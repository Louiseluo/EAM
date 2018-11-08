<template>
    <div :class="[prefixCls]">
        <div
            :class="classes"
            @click="handleClick"
            @drop.prevent="onDrop"
            @dragover.prevent="dragOver = true"
            @dragleave.prevent="dragOver = false">
            <input
                ref="input"
                type="file"
                :class="[prefixCls + '-input']"
                @change="handleChange"
                :multiple="multiple"
                :accept="accept">
            <slot></slot>
        </div>
        <slot name="tip"></slot>
        <upload-list
            v-if="showUploadList"
            :files="fileList"
            @on-file-remove="handleRemove"
            @on-file-preview="handlePreview"></upload-list>
    </div>
</template>
<script>
    import UploadList from './upload-list.vue';
    import { oneOf } from './assist';
    import Emitter from './emitter';

    const prefixCls = 'ivu-upload';

    export default {
        name: 'PandoraUpload',
        mixins: [ Emitter ],
        components: { UploadList },
        props: {
            action: {
                type: String,
                required: true
            },
            fileSavePath: {
                type: String,
                required: true
            },
            headers: {
                type: Object,
                default () {
                    return {};
                }
            },
            multiple: {
                type: Boolean,
                default: false
            },
            data: {
                type: Object
            },
            name: {
                type: String,
                default: 'file'
            },
            withCredentials: {
                type: Boolean,
                default: false
            },
            showUploadList: {
                type: Boolean,
                default: true
            },
            type: {
                type: String,
                validator (value) {
                    return oneOf(value, ['select', 'drag']);
                },
                default: 'select'
            },
            format: {
                type: Array,
                default () {
                    return [];
                }
            },
            accept: {
                type: String
            },
            maxSize: {
                type: Number
            },
            beforeUpload: Function,
            onProgress: {
                type: Function,
                default () {
                    return {};
                }
            },
            onSuccess: {
                type: Function,
                default () {
                    return {};
                }
            },
            onError: {
                type: Function,
                default () {
                    return {};
                }
            },
            onRemove: {
                type: Function,
                default () {
                    return {};
                }
            },
            onPreview: {
                type: Function,
                default () {
                    return {};
                }
            },
            onExceededSize: {
                type: Function,
                default () {
                    return {};
                }
            },
            onFormatError: {
                type: Function,
                default () {
                    return {};
                }
            },
            defaultFileList: {
                type: Array,
                default() {
                    return [];
                }
            },
            onUpSuccess: {
                type: Function,
                default () {
                    return {};
                }
            },
        },
        data () {
            return {
                upFileInfo: undefined,
                upFileInfos: [],
                upFileInfoLength: 0,
                prefixCls: prefixCls,
                dragOver: false,
                fileList: [],
                tempIndex: 1,

                /*ws配置*/
                concurrentHash: 3,
                concurrentHashCurrent: 0,
                wsuri: this.action,
                UPGlobal: {
                    allFiles: {},
                    filesToUpload: [],
                    filesHasHashed: [],
                    filesUploaded: [],
                    fileIdToFileNameMap: {},
                    fileUploadStepMap: {},//0,nothing;1,onHashing;2,onWaiting;3,onUploading;4,onSuccess
                    workers: {},
                    wsS: [],
                    fileSizeFormats: {
                        'Byte': Math.pow(10, 0),
                        'KB': Math.pow(10, 3),
                        'MB': Math.pow(10, 6),
                        'GB': Math.pow(10, 9),
                        'TB': Math.pow(10, 12),
                        'PB': Math.pow(10, 15),
                        'EB': Math.pow(10, 18),
                        'ZB': Math.pow(10, 21),
                        'YB': Math.pow(10, 24),
                        'BB': Math.pow(10, 27)
                    },
                }
                /*ws配置*/
            };
        },
        computed: {
            classes () {
                return [
                    `${prefixCls}`,
                    {
                        [`${prefixCls}-select`]: this.type === 'select',
                        [`${prefixCls}-drag`]: this.type === 'drag',
                        [`${prefixCls}-dragOver`]: this.type === 'drag' && this.dragOver
                    }
                ];
            },

        },
        methods: {
            /*--- ws ---*/
            initWS:function(){
                //判断当前浏览器是否支持WebSocket
                if('WebSocket' in window){
                    for(var i = 0; i < this.UPGlobal.filesToUpload.length; i++){
                        var ws = new WebSocket(this.wsuri);
                        ws.onopen = this.onOpen(this);
                        ws.onmessage = this.onMessage(this);
                        this.UPGlobal.wsS.push(ws);
                    }
                    console.log("this.fileList.length: " + this.UPGlobal.filesToUpload.length);
                    this.upFileInfoLength = this.UPGlobal.filesToUpload.length;
                }else if('MozWebSocket' in window){
                    for(var i=0; i < this.UPGlobal.filesToUpload.length; i++){
                        var ws = new MozWebSocket(this.wsuri);
                        ws.onopen = this.onOpen;
                        ws.onmessage = this.onMessage;
                        this.UPGlobal.wsS.push(ws);
                    }
                }else{
                    alert('Websocket create error.');
                }
            },
            onOpen:function(that){
                return function(){
                    console.log('pandora upload server is opened.');
                    that.startHashFile();
                }
            },
            onMessage:function(that){
                return function(e){
                    var ws = this;
                    var obj=JSON.parse(e.data);
                    if(obj.typeId=='uploadCommand'){
                        console.log('file upload process：'+parseInt(obj.completePercent * 65 + 35, 10 ) + '%');
                        that.handleProgress(e, that.getChangeFilePercent(parseInt(obj.completePercent*65+35,10), obj.fileId));
                        if(obj.completePercent != 1){
                            that.doUploadByCommand(ws,obj);
                        }else{
                            that.UPGlobal.fileUploadStepMap[that.UPGlobal.fileIdToFileNameMap[obj.fileId]]=4;//onSuccess
                            console.log('文件上传完成，开始上传下一个文件。');
                            that.handleProgress(e, that.getChangeFilePercent(100, obj.fileId));
                            that.uploadNextFile(ws);//该ws完成文件上传，接着继续上传下一个文件
                        }
                    }//if end
                }
            },
            hashNextFile:function(){
                if(this.UPGlobal.filesToUpload.length != 0){
                    var f = this.UPGlobal.filesToUpload.shift();
                    var worker = new Worker('./static/ws/calculator.worker.fileId.js');
                    worker.addEventListener('message', this.handleHashWorkerEvent(f));
                    this.UPGlobal.workers[f.name] = worker;//记录每个文件的worker用于后面清除worker
                    this.doHashWork(f, worker);
                }else{
                    //Hash计算完毕要恢复此值
                    this.concurrentHashCurrent = 0;
                }
            },
            /*计算hash 并且上传*/
            handleHashWorkerEvent:function(f){
                var that = this;
                return function (e) {
                    if (e.data.result) {
                        this.concurrentHashCurrent--;

                        //计算hash值存入服务器
                        var fileId= e.data.result;
                        //以源文件方式存入服务器
                        // var fileId= f.name;

                        //此处设置到name属性而不是id属性，是因为如果本地有相同fileId时，则进度显示会出问题（不会影响文件上传）。
                        //回调渲染页面进度条
//                        that.handleProgressWs(e, f, 35);
//                        $('[name="'+ f.name+'"]').find('.progress-bar').css('width', '35%').attr('name',fileId);

                        that.UPGlobal.workers[f.name].terminate();//关闭workers
                        that.UPGlobal.workers[f.name] = undefined;

                        f['fileId']=fileId;
                        that.UPGlobal.fileIdToFileNameMap[fileId]= f.name;//将文件对应的fileId存储到map中
                        console.log('文件已算出hash值，开始上传文件：'+ f.name);
                        that.startUploadFile(f);

                        that.hashNextFile();//hash next file
                    } else {
//                        $('[name="'+ f.name+'"]').find('.progress-bar').css('width', e.data.block.end * 35 / e.data.block.file_size + '%');
//                        that.handleProgressWs(e, f, e.data.block.end * 35 / e.data.block.file_size);
                    }
                };
            },
            doHashWork:function(file,worker){
                this.UPGlobal.fileUploadStepMap[file.name] = 1;//文件上传进入计算文件hash状态
                var i, buffer_size, block, reader, blob, handle_hash_block, handle_load_block;

                //发送数据
                handle_load_block = function (event) {
                    worker.postMessage({
                        'message': event.target.result,
                        'block': block
                    });
                };
                handle_hash_block = function (event) {
                    if (block.end !== file.size) {
                        block.start += buffer_size;
                        block.end += buffer_size;

                        if (block.end > file.size) {
                            block.end = file.size;
                        }
                        reader = new FileReader();
                        reader.onload = handle_load_block;
                        blob = file.slice(block.start, block.end);

                        reader.readAsArrayBuffer(blob);
                    }
                };
                buffer_size = 512 * 1024 ;
                block = {
                    'file_size': file.size,
                    'start': 0
                };
                block.end = buffer_size > file.size ? file.size : buffer_size;
                worker.addEventListener('message', handle_hash_block);
                reader = new FileReader();
                reader.onload = handle_load_block;
                blob = file.slice(block.start, block.end);
                reader.readAsArrayBuffer(blob);
            },
            startUploadFile:function(f){
                if(this.UPGlobal.wsS.length != 0){
                    var ws = this.UPGlobal.wsS.shift();//返回第一个元素，pop（）返回最后一个元素。
                    this.sendFileInfo(ws,f);
                    console.log('已从ws连接池中取出第一个ws连接，已发送['+ f.name+']文件信息，正在使用的ws连接加1.');
                    this.UPGlobal.filesUploaded.push(f);
                }else{
                    this.UPGlobal.filesHasHashed.push(f);
                    this.UPGlobal.fileUploadStepMap[f.name] = 2;//onWaiting
                    console.log('ws连接池中没有可用连接，已将['+ f.name+']放入已计算Hash文件池中.')
                }
            },
            sendFileInfo: function(ws,f){
                var fileInfo={};
                fileInfo.fileName= f.name;
                fileInfo.fileSize= f.size;
                fileInfo.fileInfo= f.type;
                fileInfo.fileId= f.fileId;
                fileInfo.fileSavePath= this.fileSavePath;
                var suffix = f.name.substring(f.name.lastIndexOf(".") + 1)
                this.upFileInfo = {
                    fileName: fileInfo.fileName,
                    savePath: 'upload' + this.fileSavePath + fileInfo.fileId + "." + suffix,
                };
                this.upFileInfos.push(this.upFileInfo)
                // console.log("this.upFileInfo", JSON.stringify(this.upFileInfo))
                // console.log("this.upFileInfos", JSON.stringify(this.upFileInfos))
                ws.send(JSON.stringify(fileInfo));
                this.UPGlobal.fileUploadStepMap[f.name] = 3;//onUploading
            },
            startHashFile:function(){
                for(var f,worker; this.concurrentHashCurrent < this.concurrentHash; this.concurrentHashCurrent++){
                    if(this.UPGlobal.filesToUpload.length == 0) break;
                    /*移出第一个文件*/
                    f = this.UPGlobal.filesToUpload.shift();
                    worker = new Worker('./static/ws/calculator.worker.fileId.js');
                    worker.addEventListener('message', this.handleHashWorkerEvent(f));
                    this.UPGlobal.workers[f.name] = worker;//记录每个文件的worker用于后面清除worker
                    this.doHashWork(f,worker);
                }
            },
            uploadNextFile:function(ws){
                if(this.UPGlobal.filesHasHashed.length != 0){
                    var f = this.UPGlobal.filesHasHashed.shift();
                    this.sendFileInfo(ws,f);
                    console.log('从已计算Hash文件池中取出文件['+ f.name+']，并发送文件信息.');
                    this.UPGlobal.filesUploaded.push(f);
                    console.log("f 发送完成：" + f);
                }else{//文件上传结束，回收ws连接
                    this.UPGlobal.wsS.push(ws);
//                    this.onUpSuccess();
                    /*成功上传回调*/
                    //单文件
                    this.$emit('on-up-success', this.upFileInfo.fileName, this.upFileInfo.savePath);
                    //多文件 轮询等待
                    // while (this.upFileInfos.length < this.UPGlobal.filesToUpload.length) {
                    //     console.log("wait...")
                    // }

                    console.log("this.upFileInfoLength", this.upFileInfoLength)
                    console.log("this.upFileInfos.length", this.upFileInfos.length)
                    if(this.upFileInfoLength === this.upFileInfos.length) {
                        this.$emit('on-up-multiple-success', this.upFileInfos);
                        console.log("返回前端信息...")
                        this.upFileInfoLength = 0;
                        this.upFileInfos = [];
                    }
                    console.log('没有已计算出Hash值的文件可上传，回收ws连接到连接池中.');
                }
            },
            doUploadByCommand:function(ws,command){
//                console.log("upload file: " + command);
                var fileName = this.UPGlobal.fileIdToFileNameMap[command.fileId];
                var f = this.UPGlobal.allFiles[fileName];
                if(f){
                    var blob = f.slice(command.indexStart,command.indexEnd);
                    var reader = new FileReader();
                    reader.onload = function(e){
//                      this.log('Sending data: '+blob.size);
                        ws.send(e.target.result);
                    };
                    reader.readAsArrayBuffer(blob);
                }else{
                    this.uploadNextFile(ws);
                }
            },
            /*--- ws ---*/
            handleClick () {
                this.$refs.input.click();
            },
            handleChange (e) {
                const files = e.target.files;

                if (!files) {
                    return;
                }

//                console.log("handleChange..." + JSON.stringify(files));
                this.uploadFiles(files);
                this.$refs.input.value = null;
            },
            onDrop (e) {
                this.dragOver = false;
                this.uploadFiles(e.dataTransfer.files);
            },
            uploadFiles (files) {
                let postFiles = Array.prototype.slice.call(files);
                if (!this.multiple) postFiles = postFiles.slice(0, 1);

                if (postFiles.length === 0) return;

                //检查
                for(var o in postFiles) {
                    var file = postFiles[o];
                    // check format
                    if (this.format.length) {
                        const _file_format = file.name.split('.').pop().toLocaleLowerCase();
                        const checked = this.format.some(item => item.toLocaleLowerCase() === _file_format);
                        if (!checked) {
                            this.onFormatError(file, this.fileList);
                            return false;
                        }
                    }
                    // check maxSize
                    if (this.maxSize) {
                        if (file.size > this.maxSize * 1024) {
                            this.onExceededSize(file, this.fileList);
                            return false;
                        }
                    }
                }

                /*ws: 把要上传的文件夹 放入 UPGlobal*/
                postFiles.forEach(file => {
                    this.UPGlobal.filesToUpload.push(file);
                    this.UPGlobal.allFiles[file.name]= file;
                    this.handleStart(file);
                });
//                this.initWS();
                /*ws: 计算hash*/
//                this.startHashFile();
                /*ws: end*/
                postFiles.forEach(file => {
                    this.upload(file);
                });
            },
            upload (file) {
                if (!this.beforeUpload) {
                    return this.post(file);
                }

                const before = this.beforeUpload(file);
                if (before && before.then) {
                    before.then(processedFile => {
                        if (Object.prototype.toString.call(processedFile) === '[object File]') {
                            this.post(processedFile);
                        } else {
                            this.post(file);
                        }
                    }, () => {
                        // this.$emit('cancel', file);
                    });
                } else if (before !== false) {
                    this.post(file);
                } else {
                    // this.$emit('cancel', file);
                }
            },
            post (file) {
//                /*初始化并且上传*/
//                this.upFileInfo = undefined;
//                // check format
//                if (this.format.length) {
//                    const _file_format = file.name.split('.').pop().toLocaleLowerCase();
//                    const checked = this.format.some(item => item.toLocaleLowerCase() === _file_format);
//                    if (!checked) {
//                        this.onFormatError(file, this.fileList);
//                        return false;
//                    }
//                }
//                // check maxSize
//                if (this.maxSize) {
//                    if (file.size > this.maxSize * 1024) {
//                        this.onExceededSize(file, this.fileList);
//                        return false;
//                    }
//                }
                this.initWS();

//
//                /*具体上传逻辑*/
//                this.handleStart(file);
//                let formData = new FormData();
//                formData.append(this.name, file);

//                ajax({
//                    headers: this.headers,
//                    withCredentials: this.withCredentials,
//                    file: file,
//                    data: this.data,
//                    filename: this.name,
//                    action: this.action,
//                    onProgress: e => {
//                        this.handleProgress(e, file);
//                    },
//                    onSuccess: res => {
//                        this.handleSuccess(res, file);
//                    },
//                    onError: (err, response) => {
//                        this.handleError(err, response, file);
//                    }
//                });
            },
            handleStart (file) {
                file.uid = Date.now() + this.tempIndex++;
                const _file = {
                    status: 'uploading',
                    name: file.name,
                    size: file.size,
                    percentage: 0,
                    uid: file.uid,
                    showProgress: true
                };
                this.fileList.push(_file);
            },
            getFile (file) {
                const fileList = this.fileList;
                let target;
                fileList.every(item => {
                    target = file.uid === item.uid ? item : null;
                    return !target;
                });
                return target;
            },
            /*更改vue中文件上传百分比*/
            getChangeFilePercent (percent, wsFileId) {
                var ff = this.getFile(this.UPGlobal.allFiles[this.UPGlobal.fileIdToFileNameMap[wsFileId]]);
                ff.percentage = percent;
                return ff;
            },
            handleProgress (e, file) {
                const _file = this.getFile(file);
                this.onProgress(e, _file, this.fileList);
//                _file.percentage = e.percent || 0;
//                console.log("_file.percentage: " + _file.percentage);
            },
            handleSuccess (res, file) {
                const _file = this.getFile(file);

                if (_file) {
                    _file.status = 'finished';
                    _file.response = res;

                    this.dispatch('FormItem', 'on-form-change', _file);
                    this.onSuccess(res, _file, this.fileList);

                    setTimeout(() => {
                        _file.showProgress = false;
                    }, 1000);
                }
            },
            handleError (err, response, file) {
                const _file = this.getFile(file);
                const fileList = this.fileList;

                _file.status = 'fail';

                fileList.splice(fileList.indexOf(_file), 1);

                this.onError(err, response, file);
            },
            handleRemove(file) {
                const fileList = this.fileList;
                fileList.splice(fileList.indexOf(file), 1);
                this.onRemove(file, fileList);
            },
            handlePreview(file) {
                if (file.status === 'finished') {
                    this.onPreview(file);
                }
            },
            clearFiles() {
                this.fileList = [];
            }
        },
        watch: {
            defaultFileList: {
                immediate: true,
                handler(fileList) {
                    this.fileList = fileList.map(item => {
                        item.status = 'finished';
                        item.percentage = 100;
                        item.uid = Date.now() + this.tempIndex++;
                        return item;
                    });
                }
            }
        },
    };
</script>