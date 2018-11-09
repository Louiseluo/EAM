<template>
    <div class="basic bzzy-change">
        <!--模块名称-->
        <div class="title">
            <span>基础数据导入</span>
        </div>
        <!--表单-->
        <div class="second-title">选择基础数据</div>
        <div class="form-content mar-t-10">
            <Form :model="batchForm" label-position="left" inline :label-width="100">
                <Form-item label="基础数据类型">
                    <Select v-model="batchForm.comeFrom" :value="batchForm.comeFrom" style="width: 160px;"
                            @on-change="changeImportType">
                        <Option v-for="item in newComeFromItem" :value="item.code" :key="item.code">{{ item.typeName }}
                        </Option>
                    </Select>
                </Form-item>
            </Form>
        </div>

        <div v-if="batchForm.comeFrom==3">
            <Form :model="sparePartForm" label-position="left" inline :label-width="100">
                <FormItem label="K3来源视图">
                    <Input v-model="sparePartForm.equipmentName" style="width: 160px;" disabled></Input>
                </FormItem>
                <FormItem label="总共可导数据条数" :labelWidth=130>
                    <Input v-model="sparePartForm.dataTotal" style="width: 160px;" disabled></Input>
                </FormItem>
                <FormItem label="导入策略">
                    <Select v-model="sparePartForm.importType" :value="sparePartForm.importType" style="width: 160px;">
                        <Option v-for="item in newImportTypeArr" :value="item.code" :key="item.code">{{ item.fileName }}
                        </Option>
                    </Select>
                </FormItem>
            </Form>
            <div style="width: 850px;">
            <Row v-if="progressShow">
                <Col span="24">
                <Row>
                    <Col span="20">
                    <Progress :percent="progressData" :hide-info="true" />
                    </Col>
                    <Col span="4">
                    <span class="pad-l-10">{{finishData}} / {{sparePartForm.dataTotal}}</span>
                    </Col>
                </Row>
                <div class="text-center">预计时间：{{needTime}}</div>
                </Col>
            </Row>
            </div>
            <div class="btnGroupDesign mar-t-15">
                <Button v-if="if_import" size="large" type="primary" @click="sparePartsImportStart">导入</Button>
            </div>
        </div>
        <div v-else>
            <div class="second-title">下载基础数据模板</div>
            <a class="mar-l-25 underline" :href="'/static/importTemplates/'+hrefAddress">{{comeFromName}}</a>
            <div class="second-title mar-t-15">上传基础数据文件</div>
            <Table stripe border  :columns="colUpLoad" :data="dataUpLoad"></Table>
            <Upload
                    v-if="if_upload"
                    ref="upload"
                    :format="['xlsx','xls']"
                    header="{
                                'Accept': 'application/json, text/plain, /'
                                }"
                    :max-size="2048"
                    :show-upload-list="true"
                    :before-upload="breforeUpload"
                    :on-format-error="handleFormatError"
                    :on-success="handleSuccess"
                    :action="this.selfUploadUrl()"
                    :data="tokenT"
                    style="display: inline-block;margin-top: 10px;">
                <Button icon="upload" size="small" :disabled="uploadEnable" >上传文件</Button>
            </Upload>
            <div class="second-title mar-t-15">导入文件</div>
            <Button v-if="if_import" size="large" type="primary" style="position: relative;" @click="batchImport">批量导入</Button>
        </div>
        <div class="form-content mar-t-10">
            <div class="second-title">导入结果</div>
            <div class="mar-b-15 mar-l-25">
                <ul>
                    <li class="col-green">
                        成功<span class="mar-l-25"> {{successNum}} </span>条
                    </li>
                    <li class="col-red">
                        失败<span class="mar-l-25"> {{failureNum}} </span>条
                    </li>
                </ul>
            </div>

            <!--<div class="second-title col-orange">导入详情</div>-->
            <div class="second-title col-orange">{{importTxt}}</div>

            <div style="position:relative;">
                <!--<a class="posRight col-red underline">下载错误数据文件</a>-->
                <Table stripe border :columns="columns1" :data="data1"></Table>
                <div class="mar-t-10" style="overflow: hidden">
                    <div style="float: right;">
                        <Page :total="logTotal" :current="currentPage" size="small" show-elevator :page-size="10"
                              @on-change="changeLogPage"></Page>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    //使用jquery渲染
    import $ from 'jquery';
    // import PandoraUpload from '../../api/pandora-upload/pandoraUpload.vue';
    export default {
        // components: { PandoraUpload },
        data (){
            return {
                /*权限按钮*/
                if_detail:this.$rt(this.authJson.EAM.系统管理.基础数据导入.查看系统数据),
                if_import:this.$rt(this.authJson.EAM.系统管理.基础数据导入.批量导入),
                if_upload:this.$rt(this.authJson.EAM.系统管理.基础数据导入.上传文件),
                progressShow: false,
                progressData: 0,
                finishData: 0,
                needTime: '',
                hrefAddress: '',
                logTotal: 1,
                page: 1,
                currentPage: 1,
                pageSize: 10,
                successNum: 0,
                failureNum: 0,
                oTimer: {},
                processShow: false,
                importResultShow: false,
                processValue: 0,
                tokenT:{
                    _pandora_p_acc_:this.$fc.getToken(),
                },
                importTxt: '导入详情',
                username: '',
                importEnable:false,
                uploadEnable:false,
                batchForm:{
                    comeFrom: 0,
//                    comeFromItem: 0
                    comeFromItem: [],
                },
                sparePartForm: {
                    equipmentName: 'v_import_spare_part',
                    dataTotal: '',
                    importType: 0,

                },
                importTypeArr: [],
                comeFromName: '',
                colUpLoad: [
                    {
                        title: '文件名称',
                        key: 'name',
                        align: 'center'
                    },
                    {
                        title: '格式',
                        key: 'format',
                        align: 'center'
                    },
                    {
                        title: '大小',
                        key: 'size',
                        align: 'center'
                    },
                    {
                        title: '地址',
                        key: 'address',
                        align: 'center'
                    },
                    {
                        title: '上传时间',
                        key: 'time',
                        align: 'center'
                    }
                ],
                dataUpLoad: [
                    {
                        name:'12撒大声地',
                        format:'TXT',
                        size:'12M',
                        address:'/side/de',
                        time:'2018-11-15',
                    },{
                        name:'12撒大声地',
                        format:'TXT',
                        size:'12M',
                        address:'/side/de',
                        time:'2018-11-15',
                    },{
                        name:'12撒大声地',
                        format:'TXT',
                        size:'12M',
                        address:'/side/de',
                        time:'2018-11-15',
                    },{
                        name:'12撒大声地',
                        format:'TXT',
                        size:'12M',
                        address:'/side/de',
                        time:'2018-11-15',
                    },{
                        name:'12撒大声地',
                        format:'TXT',
                        size:'12M',
                        address:'/side/de',
                        time:'2018-11-15',
                    },{
                        name:'12撒大声地',
                        format:'TXT',
                        size:'12M',
                        address:'/side/de',
                        time:'2018-11-15',
                    },{
                        name:'12撒大声地',
                        format:'TXT',
                        size:'12M',
                        address:'/side/de',
                        time:'2018-11-15',
                    },
                ],
                columns1: [
                    {
                        title: '唯一标识',
                        key: 'keyWord',
                        align: 'center'
                    },
                    {
                        title: '导入结果',
                        key: 'result',
                        align: 'center',
                        render: (h, params) => {
                            //标准方案显示详情链接
                            if(params.row.result == "失败") {
                                return h('span',{
                                    style: 'color: #ed4014',
                                }, params.row.result)
                            } else {
                                return h('span',{
                                    style: 'color: #19be6b',
                                }, params.row.result)
                            }
                        },
                    },
                    {
                        title: '导入时间',
                        key: 'date',
                        align: 'center'
                    },
                    {
                        title: '导入责任人',
                        key: 'responsible',
                        align: 'center'
                    },
                    {
                        title: '导入详情信息',
                        key: 'remark',
                        align: 'center',

                    },
                    {
                        title: '操作',
//                        key: 'exception',
                        align: 'center',
                        render: (h, params) => {
                            //标准方案显示详情链接
                            if (this.if_detail && (params.row.result === "成功")&&(params.row.sheet == "标准方案版本")) {
                                return h('a', {
                                    class: 'mar-r-5',
                                    on: {
                                        click: () => {
                                            this.$router.push({path: '/standardworkedit', query: {id: params.row.successId, flag: 0,tpmssId:params.row.successId, from: 'import'}});
                                        }
                                    }
                                }, '查看系统数据')
                            }
                            if (this.if_detail && (params.row.result === "成功")&&(params.row.sheet == "设备表")) {
                                return h('a', {
                                    class: 'mar-r-5',
                                    on: {
                                        click: () => {
                                            this.$router.push({path: '/archives', query: {id: params.row.successId, from: 'import'}});
                                        }
                                    }
                                }, '查看系统数据')
                            }
                            if (this.if_detail && (params.row.result === "成功")&&(params.row.sheet == "设备故障描述")) {
                                return h('a', {
                                    class: 'mar-r-5',
                                    on: {
                                        click: () => {
                                            this.$router.push({path: '/equTypeList', query: {id: params.row.successId}});
                                        }
                                    }
                                }, '查看系统数据')
                            } else {
                                return h('span', '/')
                            }
                        },
                    }
                ],
                data1: [],
                dataAry: [],
                created: false
            }
        },
/*        activated: function () {
            this.created && this.batchImport();
            this.created = true;
        },*/
        computed: {
            newComeFromItem() {
                return this.batchForm.comeFromItem.filter(item => item.code>-1)
            },
            newImportTypeArr() {
                return this.importTypeArr.filter(item => item.code>-1)
            }
        },
        mounted() {
            this.importTypeArr = this.$base_info.importStrategyEnum;
//            console.log('this.importTypeArr === '+JSON.stringify(this.importTypeArr))
//            console.log('username === '+sessionStorage.getItem('uname'))
            this.username = sessionStorage.getItem('uname');
            this.batchForm.comeFromItem = this.$base_info.importTemplatesEnum;
            this.comeFromName = '<<标准方案.xlsx>>';
            this.hrefAddress = '标准方案.xlsx';
            if (this.batchForm.comeFrom==3) {
                this.importTxt = "导入失败详情";
                this.sparePartImportBefore();
            }
        },

        methods: {
            upSuccess: function(fileName, savePath) {
                console.log(fileName + " 上传完成了.地址： " + savePath);
            },

            //文件上传处理部分
            handleUpload:function (file) {
                this.file = file;
                return false;
            },
            handleFormatError:function () {
                this.$Message.error('上传文件只能是 xlsx 或 xls 格式!');
            },

            breforeUpload: function(file) {
                if(this.batchForm.comeFrom === "") {
                    this.$Message.warning("请选择类型再导入！");
                    return false;
                }
                console.log("file", file.name)
                this.file = file;
                // console.log("this.batchForm.comeFrom", this.batchForm.comeFromItem[this.batchForm.comeFrom].fileName)
                if(file === undefined || file.name === undefined)
                    return false;
                let data = this.newComeFromItem;
                let name = '';
                for (let i in data) {
                    if (data[i].code == this.batchForm.comeFrom) {
                        name = data[i].fileName;
                    }
                }
                if(file.name != name) {
                    this.$Message.warning("请用规范的文件名上传！正确的文件名为：" + name);
                    return false;
                }
            },

            handleUpload (file) {
                this.file = file;
                return false;
            },

            handleClickUpload:function () {
                this.$Modal.confirm({
                    title: 'confirm',
                    content: '<p>confirm</p>',
                    onOk: () => {
                        return true;

                    },
                    onCancel: () => {
                        return false;
                    }
                });
                return false;
            },

            handleSuccess:function (response,file,fileList) {
                if (response.status=="failed"){
                    this.$Message.error('上传文件失败，请重新上传!');
                    this.file = null;
                    return;
                }

                this.$Message.success("上传成功！");
                let d = new Date();
                for (let i in fileList) {
                    this.dataUpLoad = [];
                    let obj = {};
                    obj.name = fileList[i].name;
                    obj.size = fileList[i].size+'kb';
                    obj.format = fileList[i].name.split('.')[1];
                    obj.address = '/static/importTemplates/';
                    let month = parseInt((d.getMonth())+1)>9?parseInt(d.getMonth()+1):'0'+(d.getMonth()+1);
                    let date = parseInt(d.getDate())>9?parseInt(d.getDate()):'0'+d.getDate();
                    let hours = parseInt(d.getHours())>9?parseInt(d.getHours()):'0'+d.getHours();
                    let min = parseInt(d.getMinutes())>9?parseInt(d.getMinutes()):'0'+d.getMinutes();
                    let sec = parseInt(d.getSeconds())>9?parseInt(d.getSeconds()):'0'+d.getSeconds();
                    obj.time = d.getFullYear()+ '-' + month + '-' + date + ' '+hours + ':' + min + ':' + sec;
                    this.dataUpLoad.push(obj);
                }
                if (fileList.length > 1) {
                    fileList.splice(0, 1)
                }
            },

/*            upload () {
                let vm=this;
                this.loadingStatus = true;
                setTimeout(() => {
                    vm.getUploadFile(this.file);
                    this.loadingStatus = false;
//                    this.$Message.success('上传成功')
                }, 1500);
            },
            changeUploadFile(){
                this.data.uploadFile = this.$refs.input.files[0];
            },*/
            /*批量导入*/
            batchImport() {
                console.log('导入 === ')
//                this.importAble = false;
//                console.log('this.batchForm.comeFrom === '+this.batchForm.comeFrom)
                if(this.file == undefined) {
                    this.$Message.warning("请上传文件后再导入！");
                    return;
                }
                let formData = new FormData();
                formData.append('importFile', this.file);
                let config = {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                };
                this.$axios.post('import/importFile', formData, config).then((res) => {
                    let ret = res.data.response;
                    console.log('导入ret ==== ' + JSON.stringify(ret));
                    if (ret.code == 1) {
                        if (ret.data.importDataErrorItems.length == 0 && ret.data.successCount == 0 && ret.data.errorCount == 0) {
                            this.$Message.warning("该导入文件为空，请录入数据再导入！");
                        } else {
                            this.failureNum = ret.data.errorCount;
                            this.successNum = ret.data.successCount;
                            this.logTotal = ret.data.importDataErrorItems.length;
                            this.dataAry = [...ret.data.importDataErrorItems];
                            this.data1 = ret.data.importDataErrorItems.slice(0, 10);
                        }
                    }
                }).catch((err) => {
                    console.log(err);
                })
            },
            changeLogPage: function(page) {
                this.currentPage = page;
                let prevPage= (page-1)*10;
                let nextPage= (page)*10;
                this.data1 = this.dataAry.slice(prevPage,nextPage);
            },

            changeImportType: function (val) {
                this.successNum = 0;
                this.failureNum = 0;
                this.data1 = [];
                let data = this.newComeFromItem;
                let address = '';
                for (let i in data) {
                    if (data[i].code == val) {
                        this.comeFromName = '<<' + data[i].fileName + '>>';
                        address = data[i].fileName;
                    }
                }
                if (val==3) {
                    this.importTxt = "导入失败详情";
                    this.sparePartImportBefore();
                } else {
                    this.importTxt = "导入详情";
                }
                this.hrefAddress = address;
                this.page = 1;
            },
            /*日志信息 end  */

            //导入前信息查询
            sparePartImportBefore() {
                this.$axios.post('/eamSparePart/getStatisticsPreImport',{
                    importStrategy: this.sparePartForm.importType
                }).then((res) => {
                    console.log('导入前信息查询res ==== '+JSON.stringify(res))
                    let ret = res.data.response;
                    if (ret.code == 1) {
                        this.sparePartForm.dataTotal = ret.data.vImportSparePartNum;
//                        this.sparePartForm.importType = ret.data.vImportSparePartNum;
                        this.needTime = ret.data.estimatedTime;
                    } else {
                        this.$Message.error(ret.msg);
                    }
                }).catch((err) => {
                    console.log(err)
                })
            },
            //启动导入
            sparePartsImportStart() {
                this.progressShow = true;
                this.$axios.post('/eamSparePart/importSparePart', {
                    importStrategy: this.sparePartForm.importType
                }).then((res) => {
//                    console.log('启动导入res ==== ' + JSON.stringify(res))
                    let ret = res.data.response;
                    if (ret.code == 1) {
                        this.$Message.success(ret.data);
//                        this.sparePartImported();
//                        this.statusEnquiry();
                        this.oTimer = setInterval(this.statusEnquiry, 2000);
                    } else {
                        this.$Message.error(ret.msg);
                    }
                }).catch((err) => {
                    this.closeStatusEnquiry();
                    console.log(err)
                })
            },
            //导入开始后状态查询
            statusEnquiry() {
                this.$axios.post('/eamSparePart/getStatisticsImportRunning').then((res) => {
//                    console.log('导入开始后状态查询res ==== ' + JSON.stringify(res));
                    let ret = res.data.response;
                    if (ret.code == 1) {
                        this.needTime = ret.data.estimatedTime;
                        let finishData = parseInt(ret.data.importedSparePartNum + ret.data.failedSparePartNum);
//                        this.successNum = finishData;
                        this.finishData = finishData;
                        let total = ret.data.vImportSparePartNum;
//                        console.log('finishData === '+finishData);
                        this.progressData = finishData/total*100;
//                        console.log('progressData === '+this.progressData)
                        if (finishData == total) {
                            this.closeStatusEnquiry();
                            this.$Message.success('数据导入完毕！')
                            this.sparePartImported();
                        }
                    } else {
                        this.$Message.error(ret.msg);
                    }
                }).catch((err) => {
                    console.log(err)
                })
            },
            //渲染导入详情
            sparePartImported() {
                this.$axios.post('/eamSparePart/getStatisticsImportResult').then((res) => {
//                    console.log('渲染导入详情res ==== ' + JSON.stringify(res));
                    let ret = res.data.response;
                    if (ret.code == 1) {
                        this.failureNum = ret.data.failedSparePartNum;
                        this.successNum = ret.data.importedSparePartNum;
                        let importData = ret.data.data;
                        for (let i=0; i<importData.length; i++) {
                            let obj = {};
                            obj.keyWord = importData[i].FItemID;
                            obj.result = '失败';
                            obj.date = importData[i].ImportDate;
                            obj.responsible = this.username;
                            obj.remark = importData[i].msg;
                            this.data1.push(obj);
                        }
                    } else {
                        this.$Message.error(ret.msg);
                    }
                }).catch((err) => {
                    console.log(err)
                })
            },
            closeStatusEnquiry: function() {
                window.clearInterval(this.oTimer);
                this.processValue = 0;
            },
        }
    }
</script>
<style scoped>
    .underline {
        text-decoration-line: underline;
    }
    .posRight {
        position: absolute;
        right: 10px;
        top: -35px;
    }
    td div .txt-error {
        color: #ed4014!important;
    }
    td div .txt-success {
        color: #19be6b!important;
    }
</style>



