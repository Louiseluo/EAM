<template>
    <div class="basic fault-content">
        <!--模块名称-->
        <div class="title">
            <span>保养工单-执行</span>
        </div>
        <!--表单-->
        <div class="form-content">
            <Form ref="maintenanceForm" :model="maintenanceForm" label-position="right" inline :label-width="120">
                <Form-item label="计划名称" prop="planName">
                    <Input v-model="maintenanceForm.planName" style="width: 160px;" placeholder="" disabled></Input>
                </Form-item>
                <Form-item label="标准方案名称" prop="standardSolutionName">
                    <Input v-model="maintenanceForm.standardSolutionName" style="width: 160px;" placeholder="" disabled></Input>
                </Form-item>
                <Form-item label="是否需要停机" prop="isStop">
                    <i-switch v-model="maintenanceForm.isStop" disabled>
                        <span slot="open">是</span>
                        <span slot="close">否</span>
                    </i-switch>
                </Form-item>
                <Form-item label="预计耗时（分钟）" prop="expectTime">
                    <Input v-model="maintenanceForm.expectTime" style="width: 160px;" placeholder="" disabled></Input>
                </Form-item>
                <!--<Form-item label="计划执行时间" prop="plannedRunTime">-->
                    <!--<Input v-model="maintenanceForm.plannedRunTime" style="width: 160px;" disabled></Input>-->
                <!--</Form-item>-->
                <Form-item label="执行岗位" prop="position">
                    <Input v-model="maintenanceForm.position" style="width: 160px;" disabled></Input>
                </Form-item>
            </Form>
        </div>
        <Tabs class="maintenanceTab" type="card">
            <Tab-pane class="checkTab" label="保养项目" icon="social-buffer">
                <div class="table-reset " style="height: 300px;overflow-y: auto" >
                    <table class="table table-bordered table-center table-striped table-blue taDisplay">
                        <thead>
                        <tr>
                            <th width="150">序号</th>
                            <th>保养内容</th>
                            <th>保养要求</th>
                            <th>保养工时(分钟)</th>
                            <th width="300">参照图片</th>
                            <!--<th>操作</th>-->
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="(itemData1,index) in tpmStandardSolutionActionTmp" class="trDisplay">
                            <td>{{index + 1}}</td>
                            <td class="tdDisplay pointDis" :title="itemData1.content">{{itemData1.content}}</td>
                            <td class="tdDisplay pointDis" :title="itemData1.requirement">{{itemData1.requirement}}</td>
                            <td class="tdDisplay_right pointDis" :title="itemData1.time">{{itemData1.time}}</td>
                            <td @click="getIndex(index)">
                                <p v-if="!itemData1.picData||itemData1.picData.length==0">暂无图片</p>
                                <a @click="toViewImg(index)" v-if="itemData1.picData&&itemData1.picData.length>0">{{itemData1.picData.length}} 张相关图片，点击查看</a>
                                <!--<div class="demo-upload-list" v-if="itemData1.picData" v-for="(itemImg,indexImg) in itemData1.picData">-->
                                    <!--<img :src=" 'http://192.168.40.9:11180/static/'+ itemImg.savePath">-->
                                    <!--<div class="demo-upload-list-cover">-->
                                        <!--<Icon type="ios-eye-outline" @click.native="handleView(itemImg.savePath)"></Icon>-->
                                        <!--<Icon type="ios-trash-outline" @click.native="handleRemove(indexImg,itemImg.savePath)"></Icon>-->
                                    <!--</div>-->
                                <!--</div>-->
                            </td>
                            <!--<td><a class="mar-r-5" size="small" @click="removeTpmStandardSolutionAction(index)">作废</a></td>-->
                        </tr>
                        </tbody>
                    </table>
                    <div class="tableHasNoData" v-show="tpmStandardSolutionActionTmp.length==0"><p>暂无数据</p></div>
                </div>
            </Tab-pane>
            <Tab-pane class="checkTab" label="备品备件" icon="cube" style="overflow: auto;">
                <!--kp--备品备件--开始-->
                <div style="height: 345px;overflow-y: auto">
                <div class="">
                    <table class="table table-bordered table-center table-striped table-blue taDisplay">
                        <thead>
                        <tr>
                            <th width="60px">序号</th>
                            <th>备件名称</th>
                            <th>备件类型</th>
                            <th>备件、库存单位</th>
                            <th>备件数量(个)</th>
                            <th>备件单价</th>
                            <th>单价单位</th>
                            <!--<th width="100px">操作</th>-->
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="(equipment, index) in spareParts_display" :key="equipment.part_id" class="trDisplay">
                            <td>{{index + 1}}</td>
                            <td class="tdDisplay pointDis" :title="equipment.partName">{{equipment.partName}}</td>
                            <td class="tdDisplay pointDis" :title="equipment.partType">{{equipment.partType}}</td>
                            <td class="tdDisplay pointDis" :title="equipment.partUnit">{{equipment.partUnit}}</td>
                            <td class="tdDisplay pointDis numberRight">
                                <Input class="center test" :maxlength='4' v-model="equipment.partNum" style="width: 90%;margin-top: 5px;margin-bottom: 5px;" @on-change="toTestIsNAN(equipment.partNum,index)" :disabled="!toEdit"></Input>
                            </td>
                            <td class="tdDisplay pointDis numberRight" :title="equipment.partPrice" >
                                <Input class="center test" :maxlength='9' v-model="equipment.partPrice" style="width: 90%;margin-top: 5px;margin-bottom: 5px;" @on-change="toTestIsNANPrice(equipment.partPrice,index)" :disabled="!toEdit"></Input>
                            </td>
                            <td class="selectLeft">
                                <Select v-model="equipment.partPriceUnitId" style="width:90%" :label-in-value='true' :disabled="!toEdit">
                                    <Option v-for="item in priceUnitList" :value="item.uomId" :key="item.uomId">{{ item.uomName }}</Option>
                                </Select>
                            </td>
                            <!--<td class="mettingManage_oprationItem">-->
                                <!--&lt;!&ndash;<a @click="deletePart(index)">删除</a>&ndash;&gt;-->
                            <!--</td>-->
                        </tr>
                        </tbody>
                    </table>
                    <div class="tableHasNoData" v-show="!spareParts_display[0]"><p>暂无数据</p></div>
                </div>
                <div class="mar-t-10" style="margin-bottom: 200px;">
                    <Button icon="plus-round" size="small" type="primary" @click=" sparePartsMod=true" :disabled="!toEdit">添加</Button>
                </div>
                </div>
                <!--kp--备品备件--结束-->
            </Tab-pane>
        </Tabs>
        <!--操作按钮-->
        <Row class="btn-group">
            <Col class="pad-15" span="24" align="center">
            <Button v-show="!toEdit" @click="back()" type="primary" icon="chevron-left" size="large" style="margin: 0 10px" >返回</Button>
            <span v-show="status!=2">
                <Button v-show="status==0&&!toEdit" type="primary" icon="card" size="large" :loading="startLoad" @click="startExecute" style="margin: 0 10px">开始维护</Button>
                <!--<Button type="primary" icon="card" size="large" @click="chargeTurnDown">驳回</Button>-->
                <!--<Button v-show="status==0"type="primary" icon="card" size="large" @click="checkOut = true">临时签出</Button>-->
                <Button v-show="status==1&&!toEdit" type="primary" icon="ios-paper-outline" :loading="endLoad" size="large" @click="completeExecute" style="margin: 0 10px">维护完成</Button>
                <!--<router-link :to="{path: '/sparePartFor', query: {orderId: orderId, flag: 0 , status : 0}}">-->
                    <Button v-show="status==0&&!toEdit" type="primary" icon="ios-paper-outline" size="large" style="margin: 0 10px" @click="toSpartsFor(0)" >备件申领</Button>
                <!--</router-link>-->
                <!--<router-link :to="{path: '/sparePartFor', query: {orderId: orderId, flag: 0,status : 1}}">-->
                    <Button v-show="status==1&&!toEdit" type="primary" icon="ios-paper-outline" size="large" style="margin: 0 10px" @click="toSpartsFor(1)">备件补领</Button>
                <!--</router-link>-->
                <Button v-show="!toEdit" @click="toEdit=true" type="primary" icon="edit" size="large" style="margin: 0 10px" >编辑</Button>
                <Button v-show="toEdit" @click="toEdit=false,initData()" type="primary" icon="close" size="large" style="margin: 0 10px" >取消</Button>
                <Button v-show="toEdit" @click="toSubmit" type="primary" icon="checkmark" size="large" style="margin: 0 10px" >保存草稿</Button>
            </span>

            </Col>
        </Row>
        <!--modal-->

        <!---->
        <!--<Modal v-model="checkOut" title="签出原因">-->
            <!--&lt;!&ndash;<table class="table">-->
                <!--&lt;!&ndash;table table-bordered table-center table-striped table-blue&ndash;&gt;-->
                <!--<thead>-->
                <!--<tr>-->
                    <!--<th></th>-->
                <!--</tr>-->
                <!--</thead>-->
                <!--<tbody>-->
                <!--<tr v-for="(ss, index) in checkOuts">-->
                    <!--<td cellpadding="0">-->
                        <!--<div v-html="ss.radio"></div>-->
                    <!--</td>-->
                    <!--<td cellpadding="0">{{ss.reason}}</td>-->
                <!--</tr>-->
                <!--</tbody>-->
            <!--</table>&ndash;&gt;-->
            <!--<Table stripe border :columns="checkOutColumns" :data="checkOutData"></Table>-->
        <!--</Modal>-->
        <!--<Modal v-model="maintainCompleted" title="委外金额">-->
            <!--<p>辛苦了！</p>-->
            <!--<p>感谢您参与此设备的保养，为了方便我司账户做账及后续预算规划，请填写下此次保养的具体费用，谢谢！</p>-->
            <!--<Form ref="maintenanceForm" :model="maintenanceForm" label-position="right" inline :label-width="120">-->
                <!--<Form-item label="委外金额（元）" prop="outsourceSum">-->
                    <!--<Input v-model="maintenanceForm.outsourceSum" style="width: 160px;" placeholder=""></Input>-->
                <!--</Form-item>-->
            <!--</Form>-->
        <!--</Modal>-->
        <!--<Modal v-model="rejects" title="驳回原因">-->
            <!--<Table stripe border :columns="rejectColumns" :data="rejectData"></Table>-->
           <!--&lt;!&ndash; <table class="table">-->
                <!--&lt;!&ndash;table table-bordered table-center table-striped table-blue&ndash;&gt;-->
                <!--<thead>-->
                <!--<tr>-->
                    <!--&lt;!&ndash;<th>选择</th>&ndash;&gt;-->
                    <!--&lt;!&ndash;<th>序号</th>&ndash;&gt;-->
                    <!--&lt;!&ndash;<th>标准方案编码</th>&ndash;&gt;-->
                    <!--<th></th>-->
                <!--</tr>-->
                <!--</thead>-->
                <!--<tbody>-->
                <!--<tr v-for="(ss, index) in tpmss">-->
                    <!--<td cellpadding="0">-->
                        <!--<div v-html="ss.radio"></div>-->
                    <!--</td>-->
                    <!--&lt;!&ndash;<td>{{index + 1}}</td>&ndash;&gt;-->
                    <!--&lt;!&ndash;<td>{{ss.code}}</td>&ndash;&gt;-->
                    <!--<td cellpadding="0">{{ss.reason}}</td>-->
                <!--</tr>-->
                <!--</tbody>-->
            <!--</table>&ndash;&gt;-->
        <!--</Modal>-->

        <!--new-->
        <!--<Modal title="查看图片" v-model="visible">-->
            <!--<img :src="imgUrl" v-if="visible" style="width: 100%">-->
        <!--</Modal>-->
        <Modal title="查看图片" v-model="visible" width="700" :styles="{top: '20px'}">
            <div style="width: 100%;">
                <Carousel loop style="width: 670px" >
                    <CarouselItem v-for="(imageItem ,index) in viewImgs" :key="index">
                        <div class="demo-carousel">
                            <div class="demo-upload-list" style="border: 1px solid #ccc;width: 100%;min-height:350px;margin: auto;display: flex;">
                                <img  :src=" '../static/'+ imageItem.savePath" style="width:100%;height:100%;object-fit: cover;">
                            </div>
                            <p :title="imageItem.fileName" style="text-align: center;margin: 10px 0 20px">{{imageItem.fileName}}</p>
                        </div>
                    </CarouselItem>
                </Carousel>
            </div>
        </Modal>
        <!--kp---备品备件多选弹出框：---开始-->
        <Modal v-model="sparePartsMod" class="mod" title="备品备件需求" @on-ok="toAdd_spareParts" width="900" :styles="{top: '50px'}">
            <repair_spartParts @sparePartsSetected="spareParts_dataSelectedDisa"  :mod_rightDisplay="sparePartsSelected"></repair_spartParts>
        </Modal>
        <Modal v-model="toSave" width="360">
            <p slot="header" style="color:#f60;text-align:center">
                <Icon type="information-circled"></Icon>
                <span>保存确认</span>
            </p>
            <div style="text-align:center">
                <p>是否确定保存备品备件信息？</p>
            </div>
            <div slot="footer">
                <Button type="primary" size="large" long :loading="loadSave" @click="goToSave">保存</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    //kp--适用设备多选组件：
    import tree_multiple from '../treeMulitiple/tree_multiple_equ.vue';
    //kp--备品备件多选组件：
    import repair_spartParts from '../treeMulitiple/repair_spartParts.vue';

    import PandoraUpload from '../../api/pandora-upload/pandoraUpload.vue';
    export default {
        data (){
            //验证名称
            const validateAge = (rule, value, callback) => {};
            return {
                toEdit:false,
                orderId:'',
                load_fix: false,
                flag:false,
                load_fix_temporary:false,

                button_14551: this.$rt('14551'),
                button_14552: this.$rt('14552'),
                button_14553: this.$rt('14553'),
                button_14554: this.$rt('14554'),

                itemMaterialQuantityDisable: false,
                modal1: false,

                /*签出*/
//                checkOut:false,
                checkOutColumns:[
                    {
                        title: '序号',
                        type: 'index',
                        width: 80,
                        align: 'center'
                    },
                    {
                        title: '签出原因',
                        key: 'checkOutReason',
                    }
                ],
                checkOutData:[
                    {
                        checkOutReason:'签出原因1',
                    },
                    {
                        checkOutReason:'签出原因2',
                    },
                    {
                        checkOutReason:'签出原因3',
                    },
                    {
                        checkOutReason:'签出原因4',
                    },
                    {
                        checkOutReason:'签出原因5',
                    },
                ],
                rejects:false,
                rejectColumns:[
                    {
                        title: '序号',
                        type: 'index',
                        width: 80,
                        align: 'center'
                    },
                    {
                        title: '驳回原因',
                        key: 'rejectReason',
                    }
                ],
                rejectData:[
                    {
                        rejectReason:'驳回原因1',
                    },
                    {
                        rejectReason:'驳回原因2',
                    },
                    {
                        rejectReason:'驳回原因3',
                    },
                    {
                        rejectReason:'驳回原因4',
                    },
                    {
                        rejectReason:'驳回原因5',
                    },
                ],
//                maintainCompleted:false,

                fault_cause: false,
                material_code: false,
                device_modal:false,
                work_code:false,
                fault_desc: [],
                target_desc: [],
                maintainCard:'',
                blur_hitch_desc: true,
                blur_hitch_where: true,
                cardNo:'',
                teamName:'',
                personCode:'',
                personName:'',
                msg:'',
                reasonId:'',
                maintenanceForm:{
                    busiTypeName: "",
                    billNo: "",
                    statusName: '',
                    equipmentName: "",
                    plannedRunTime: '',
                    requiredTime: '90',
                    needShutdownValue: false,
                    solutionCode: '',
                    solutionName: '',
                    solutionVersion: '',
                    faultDescription: '',
                    confirmedFaultPosition: "",
                    confirmedCauseOfFault: "",
                    Remark: '',
                    billName:'',
                    outsourceSum:'',
                },
//              刷卡弹出框
                chargeForStart:false,
                chargeForStartN:false,
                chargeForStart33:false,
                chargeForStartBottom:false,
                chargeTime: this.$fc.dateFormat(new Date(),'yyyy-MM-dd hh:mm:ss'),
//              倒计时
                backTime: 5, // 发送验证码倒计时
                sendMsgDisabled: false,

                baseData: [{
                    expand: true,
                    title: '皮尔博格',
                    children: [{
                        title: '压铸车间1',
                        expand: true,
                        disabled: true,
                        children: [{
                            title: '设备1',
                            disableCheckbox: true,
                        },
                            {
                                title: '设备2',
                            }]
                    },
                        {
                            title: '压铸车间2',
                            expand: true,
                            checked: true,
                            children: [{
                                title: '设备3',
                            },
                                {
                                    title: '设备4',
                                }]
                        }]
                }],

                columns_man: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 80,
                        align: 'center'
                    },
                    {
                        title: '工号',
                        key: 'personCode',
                        align: 'center',
                    },
                    {
                        title: '姓名',
                        key: 'personName',
                        align: 'center',
                    },
                    {
                        title: '班组',
                        key: 'teamName',
                        align: 'center',
                    },
                    {
                        title: '签入时间',
                        key: 'startTime',
                        align: 'center',
                    },
                    {
                        title: '签出时间',
                        key: 'endTime',
                        align: 'center',
                    },
                    {
                        title: '实际工时（分钟）',
                        key: 'lastTimeMinute',
                        align: 'center',
                    },
                ],
                data_man:[],
//                    {
//                        personCode:'1001',
//                        personName:'张三',
//                        teamName: '电工组',
//                        startTime: '09:03',
//                        endTime: '12:00',
//                        lastTime: '177',
//                    },

                data_workflow:[
//                    {
//                        sortNo:'',
//                        content:'设备断电',
//                        requirement:'先关闭工控主机，后设备断电。',
//                        requiredTime: 5,
//                    },
                ],
                data_material:[
//                    {
//                        materialCode:'M001',
//                        materialName:'机油滤清器',
//                        materialUnit: '只',
//                        quantity: 1,
//                        materialType: '消耗性备品',
//                    },
                ],
                cityList: [
                    {
                        value: 'guzhang',
                        label: '主轴箱'
                    },
                    {
                        value: 'guzhang1',
                        label: '底座'
                    },
                    {
                        value: 'guzhang2',
                        label: '齿轮箱'
                    },
                    {
                        value: 'guzhang3',
                        label: '刀库'
                    },
                ],
                cause_where: [],
                tpmss: [{id: "",  reason: "", radio: ""},],
                checkOuts: [{id: "",  reason: "", radio: ""},],



                /*开始*/
                /*初始加载状态*/
                status: '',


                new_data1:{
                    content: '',
                    requirement: '',
                    requiredTime: 1,
                    url: ''
                },
                tpmStandardSolutionActionTmp:[],

                /*上传图片*/
                imgName: '',
                visible: false,
                imgUrl: '',
                /*上传图片 end*/
                //kp--备品备件相关--开始
                sparePartsMod: false,
                sparePartsSelected: [],
                spareParts_display:[],
                //kp--备品备件相关--结束

                //kp--适用设备相关--开始：
                treeSiteDataSelected: [],
                treeSiteData: [],
                //kp--适用设备--结束
                /*开始 end*/

                startLoad : false,
                endLoad : false,
                //单价单位
                priceUnitList:[],
                loadSave: false,
                toSave: false,
                viewImgs:[],


            }
        },
        components: {
            'repair_spartParts': repair_spartParts,
            'tree_multiple':tree_multiple,
            PandoraUpload
        },
        mounted(){
            this.orderId = this.$route.query.orderId;
            this.initData();
            this.priceUnitReady();
//            this.status = this.$route.query.status;
        },
        methods: {
            /********上传图片 xulin**********/
            handleSuccess(response,file,fileList){
                console.log(response,file,fileList)
            },
            handleFormatError(file) {
                this.$Notice.warning({
                    title: '文件格式不正确',
                    desc: '文件 ' + file.name + ' 格式不正确，请上传 jpg 或 png 格式的图片。'
                })
            },
            upSuccess: function(fileName, savePath,index) {
                console.log(fileName + " 上传完成了.地址： " + savePath);
                this.savePath = savePath;
//              this.tpmStandardSolutionActionTmp[0]['url'] = 'http://192.168.40.21:8888/static/' + savePath;
//				this.$set( this.tpmStandardSolutionActionTmp[0],'url', "../static/" + savePath )
                /*this.$set( this.tpmStandardSolutionActionTmp[this.onlyindex],'url', 'http://192.168.40.21:8888/static/' + savePath );
                console.log(index)*/
            },
            getIndex(index){
                console.log(index);
                this.onlyindex = index;
            },
            handleView (url) {
//              this.imgName = name;
                this.imgUrl = url;
                this.visible = true;
            },
            handleRemove(index,u) {
                delete this.tpmStandardSolutionActionTmp[this.onlyindex].picData[index];
                this.handleView(u);
                this.visible = false;
            },

            /********上传图片 xulin end**********/
            handleBeforeUpload(file) {
                // 创建一个 FileReader 对象
                let reader = new FileReader()
                // readAsDataURL 方法用于读取指定 Blob 或 File 的内容
                // 当读操作完成，readyState 变为 DONE，loadend 被触发，此时 result 属性包含数据：URL（以 base64 编码的字符串表示文件的数据）
                // 读取文件作为 URL 可访问地址
                reader.readAsDataURL(file)

                const _this = this
                reader.onloadend = function (e) {
                    file.url = reader.result
                    _this.new_data1.uploadList.push(file)
                }
                console.log(reader.result)
            },
            handleView (name) {
                this.imgName = name;
                this.visible = true;
            },
            handleRemove(file) {
                this.new_data1.uploadList.splice(this.new_data1.uploadList.indexOf(file), 1)
            },
            handleFormatError(file) {
                this.$Notice.warning({
                    title: '文件格式不正确',
                    desc: '文件 ' + file.name + ' 格式不正确，请上传 jpg 或 png 格式的图片。'
                })
            },
            handleMaxSize(file) {
                this.$Notice.warning({
                    title: '超出文件大小限制',
                    desc: '文件 ' + file.name + ' 太大，不能超过 2M。'
                })
            },
            /********上传图片 xulin end**********/

            addTpmStandardSolutionAction: function () {
                this.tpmStandardSolutionActionTmp.push(this.$fc.cloneKey(this.new_data1));
                // 添加完newPerson对象后，重置newPerson对象
            },
            //            kp--备品备件相关--开始

            //kp--获取组件数据
            spareParts_dataSelectedDisa(messagea){
                {
                    //接收传回到页面的已选择数据,赋值给变量：
                    this.sparePartsSelected = messagea;

                }
            },
            //弹出框确认按钮：
            toAdd_spareParts(){
                this.spareParts_display=[];
                console.log(this.sparePartsSelected)
                for(var i=0;i<this.sparePartsSelected.length;i++){
                    this.spareParts_display.push(this.$fc.cloneKey(this.sparePartsSelected[i]));
                    this.spareParts_display[i].partNum = this.sparePartsSelected[i].partNum ? this.sparePartsSelected[i].partNum : "";
                    this.spareParts_display[i].partPrice = this.sparePartsSelected[i].partPrice ? this.sparePartsSelected[i].partPrice : "";
                    this.spareParts_display[i].partPriceUnitId = this.sparePartsSelected[i].partPriceUnitId ? this.sparePartsSelected[i].partPriceUnitId:this.priceUnitList[0].uomId;
                }
            },
            //删除：
            delete_spareParts(item){
                this.spareParts_display.splice(item, 1);
                this.sparePartsSelected.splice(item, 1);
            },

            //验证是否是正整数
            toTestIsNAN(x){
                var re = /^[0-9]*[1-9][0-9]*$/;
                if (re.test(x)) {
                    if (x.length> 4) {
                        this.$Message.error('备品备件数最多为四位数!');
                    }
                }
                else {
                    this.$Message.error('备品备件数为正整数!');
                }
                ;
            },
            toTestIsNANPrice(x, item){
                let re = /^[0-9]*[1-9][0-9]*$/;
                if (re.test(x)) {
                    if (x.length > 9) {
                        this.$Message.error('备件单价最多为九位数!');
                    }
                } else {
                    this.$Message.error('备件单价为正整数!');
                };
                this.sparePartsSelected[item].partPrice = x;
            },

            //kp--备品备件相关--结束
            //kp---适用设备--动态获取组件每次进行添加或删除操作后的数据---开始
            dataSelectedDisa(messagea){
                {
                    //接收传回到页面的已选择数据,赋值给变量：
                    this.treeSiteDataSelected = messagea;
                }
            },
            //kp---适用设备--动态获取组件每次进行添加或删除操作后的数据---结束


            /**
             * 驳回入口
             */
//            chargeTurnDown:function () {
//                let vm = this;
//                this.rejects=true;
//                this.$axios.post('tpmWorkOrder/orderExecuteReason',{
//                    'typeNum':1,
//                }).then((res) =>{
//                    let dataRes = res.data.response.data;
//                    vm.tpmss = new Array();
//                    for (let o in dataRes.Rows) {
//                        let obj = {};
//                        obj["id"] = dataRes.Rows[o]["id"];
//                        obj["reason"] = dataRes.Rows[o]["reason"];
//                        obj["radio"] = "<input type='radio' name='tpmss_radio' value='" + dataRes.Rows[o]["id"] + "'>";
//                        vm.tpmss.push(obj);
//                    }
//
//                })
//            },
            //单价单位获取
            priceUnitReady(){
                let vm = this;
                this.$axios.get('/eamDo/getMoneyUom').then(function (response) {
                    let res = response.data.response;
                    if (res.code == 1) {
                        vm.priceUnitList =  res.data.rows;
                    } else {
                        vm.$Message.error('读取失败!');
                    }
                }).catch((err) => {
                    console.log(err);
                });
            },
            back(){
                this.$router.back();
            },

            initData(){
                this.$axios.post('terminal/orderExecuteDetails', {
                    workOrderId: this.orderId
                }).then((res) => {
                    let ret = res.data.response;
                    console.log(ret)
                    if (ret.code != 1) {
                        this.$Message.error(ret.msg);
                    } else {
                        console.log(ret);
                        this.maintenanceForm = ret.data;
                        this.status = ret.data.status;
                        this.maintenanceForm.isStop = ret.data.isStop==0?true:false;
                        this.spareParts_display = [];
                        this.sparePartsSelected = [];
                        for(var i in ret.data.part){
                            let arrs = {
                                part_id: ret.data.part[i].partId,
                                partName: ret.data.part[i].partName,
                                partType: this.$base_info.getDescByCode(ret.data.part[i].partType,this.$base_info.tBdSparePartUseTypeEnum),
                                partUnit: ret.data.part[i].uomName,
                                partNum: ret.data.part[i].num,
                                partPrice: ret.data.part[i].partPrice,
                                partPriceUnitId: ret.data.part[i].partPriceUomId,
                            }
                            this.spareParts_display.push(arrs);
                            this.sparePartsSelected.push(arrs);
                        }
                        this.tpmStandardSolutionActionTmp = ret.data.work;
                    }
//                        this.postAuditList();
                }).catch((err) => {
                    console.log(err);
                })
            },
            //查看图片
            toViewImg(index){
                this.visible = true;
                this.viewImgs = this.tpmStandardSolutionActionTmp[index].picData;
            },
            //开始维护
            startExecute(){
                this.startLoad = true;
                this.$axios.post('terminal/startExecute', {
                    workId: this.orderId,
                    type: 0
                }).then((res) => {
                    let ret = res.data.response;
                    console.log(ret)
                    if (ret.code != 1) {
                        this.$Message.error(ret.msg);
                        this.startLoad = false;
                    } else {
                        console.log(ret);
                        this.$Message.success('开始维护！');
                        this.startLoad = false;
                        this.$router.back();
                    }
                }).catch((err) => {
                    console.log(err);
                })
            },
            //维护完成
            completeExecute(){
                this.endLoad = true;
                this.$axios.post('terminal/completeExecute', {
                    workId: this.orderId,
                    type: 0
                }).then((res) => {
                    let ret = res.data.response;
                    console.log(ret)
                    if (ret.code != 1) {
                        this.$Message.error(ret.msg);
                        this.endLoad = false;
                    } else {
                        console.log(ret);
                        this.$Message.success('维护成功！');
                        this.endLoad = false;
                        this.$router.back();
                    }
                }).catch((err) => {
                    console.log(err);
                })
            },
            toSpartsFor(status){
                this.$axios.post('/eamDo/maintenanceSparepartApplicationDetail',{
                    dispatchOrderId: this.orderId
                }).then((res) => {
                    console.log(res.data.response)
                    if(res.data.response.code==1){
                        this.$router.push({path: '/sparePartFor', query: {orderId: this.orderId, flag: 0 , status : status}})
                    }
                    else{
                        this.$Message.error(res.data.response.msg)
                    }

                }).catch((err) => {
                    console.log(err)
                })

            },
            toSubmit(){
                this.toSave = true;
                var vt = this;
                $('.test').each(function () {
                    var vals = $(this).find('.ivu-input').val();
                    console.log(vals)
                    if(vals===''){
                        $(this).addClass('ivu-form-item-error');
                        vt.$Message.error('请完善信息');
                        vt.toSave = false;
                    }
                    else{
                        $(this).removeClass('ivu-form-item-error');
                    }
                });
            },
            //保存
            goToSave(){
                this.loadSave = true;
                let arrs = [];
                for(var i in this.spareParts_display){
                    let arr = {
                        "orderId": this.orderId,
                        "partId": this.spareParts_display[i].part_id,
                        "partNum": this.spareParts_display[i].partNum,
                        "partPrice": this.spareParts_display[i].partPrice,
                        "partPriceId": this.spareParts_display[i].partPriceUnitId,
//                        "partUomId": '',
                    }
                    arrs.push(arr)
                }

                this.$axios.post('terminal/save',arrs).then((res) =>  {
                    let ret = res.data.response;
                    console.log(ret);
                    if (ret.code == 1) {
                        this.toSave = false
                        this.$Message.success('保存成功！')
                        setTimeout(() => {
                            this.loadSave=false;
                            this.toEdit = false;
                            this.initData();
                        }, 500);
                    } else {
                        this.toSave = false;
                        this.loadSave=false;
                        this.$Message.error('操作失败!');
                    }
                }).catch((err) => {
                    console.log(err);
                });
            },
        }
    }
</script>
<style>
    .mod #scrollDiv1{
        height: 220px !important;
    }
    .ivu-select-dropdown-list{
        z-index: 1000 !important;
    }
    /*.ivu-tabs{*/
        /*overflow: auto;*/
    /*}*/
</style>
