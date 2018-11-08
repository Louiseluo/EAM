<template>
    <div style="position:relative;" class="basic fault-content">
        <div class="title">
            <span>设备请购单 -- {{editAbleTitle}}</span>
        </div>
        <div style="margin: 20px">
            <Steps :current="stepVal">
                <Step title="提交请购申请" content=""></Step>
                <Step title="OA审核中" content=""></Step>
                <Step v-if="applyForm.approvalStatus != 4" title="系统归档" content=""></Step>
                <Step v-if="applyForm.approvalStatus == 4" title="申请终止" content=""></Step>
            </Steps>
        </div>
        <div class="titleLogo"><img style="width: 100%;height: 100%;" src="../../../static/img/ch_logo.jpg" alt=""></div>
        <div v-show="editFlag != 1" style="overflow: hidden;">
            <h3 class="f_l">请购单编号：</h3>
            <div class="f_l text-center">
                <img v-if="imgAddr!=''" :src="'/static'+ imgAddr" alt="" height="50" width="300">
                <div>{{applyForm.billNo}}</div>
            </div>
        </div>

        <Form :label-width="200" inline ref="applyForm" :rules="applyRuleValidate" :model="applyForm">
            <div class="form-content" style="margin-top: 15px;">
                <Form-item label="设备名称" prop="equipmentLocalName">
                    <Input v-model="applyForm.equipmentLocalName" style="width: 160px;" :disabled="editAble"></Input>
                </Form-item>
                <Form-item label="规格型号" prop="modelName">
                    <div style="color:#FFFFFF" onmousemove="this.style.color='#5b5b5b';" onmouseout="this.style.color='#ffffff'">
                        <div :title="applyForm.modelName" style="position: relative;">
                            <Icon type="ios-close" class="deleteTab" @click.native="emptyEquType" v-show="!editAble"></Icon>
                            <Input v-model="applyForm.modelName" style="width: 160px;" readonly :disabled="editAble" :autofocus="typeFocus">
                            <Button slot="append" size="small" icon="ios-search" @click="openEquType" :disabled="editAble"></Button>
                            </Input>
                        </div>
                    </div>
                </Form-item>
                <Form-item label="请购数量" prop="purchaseQuantity">
                    <InputNumber :max="10000" :min="1" :maxlength ="5"  v-model="applyForm.purchaseQuantity" style="width: 160px;" :disabled="editAble" :precision='0'></InputNumber>
                </Form-item>
                <Form-item label="需求日期" prop="requiredDate">
                    <DatePicker type="date" v-model="applyForm.requiredDate" placeholder="选择日期" style="width: 160px" :disabled="editAble" :editable = "false"></DatePicker>
                </Form-item>
                <br>
                <Form-item label="设备作用（加工零件）" prop="usage">
                    <Input type="textarea" :rows="1"  v-model="applyForm.usage" style="width: 650px" :disabled="editAble"></Input>
                </Form-item>
                <br>
                <Form-item label="购置原因" prop="purchaseReason">
                    <Input type="textarea" :rows="1"  v-model="applyForm.purchaseReason" style="width: 650px" :disabled="editAble"></Input>
                </Form-item>
                <br>
                <Form-item label="技术要求（技术参数）" prop="techParamsInfo">
                    <Input type="textarea" :rows="1"  v-model="applyForm.techParamsInfo" style="width: 650px" :disabled="editAble"></Input>
                </Form-item>
                <br>
                <Form-item label="造型依据" prop="modelBasedOn">
                    <Input type="textarea" :rows="1"  v-model="applyForm.modelBasedOn" style="width: 650px" :disabled="editAble"></Input>
                </Form-item>
                <br>
                <Form-item label="调研" prop="researchInfo">
                    <Input type="textarea" :rows="1"  v-model="applyForm.researchInfo" style="width: 650px" :disabled="editAble"></Input>
                </Form-item>
                <br>
                <Form-item label="预算(万元)" prop="budget">
                    <InputNumber :max="1000000" :min="0" :maxlength ="7"  v-model="applyForm.budget" style="width: 650px;" :disabled="editAble" @on-change="floatFW"></InputNumber>
                </Form-item>
                <br>
                <!--<Form-item label="请购人" prop="applierName">
                    <Input v-model="applyForm.applierName" style="width: 160px;" :disabled="editAble"></Input>
                </Form-item>-->
                <Form-item label="请购人" prop="applierName">
                    <div style="color:#FFFFFF" onmousemove="this.style.color='#5b5b5b';" onmouseout="this.style.color='#ffffff'">
                        <div :title="applyForm.applierName" style="position: relative;">
                            <Icon type="ios-close" class="deleteTab" @click.native="emptyApplier" v-show="!editAble"></Icon>
                            <Input v-model="applyForm.applierName" style="width: 160px;" readonly :disabled="editAble" :autofocus="applierFocus">
                            <Button slot="append" size="small" icon="ios-search" @click="openApplierMold" :disabled="editAble"></Button>
                            </Input>
                        </div>
                    </div>
                </Form-item>
                <Form-item label="请购日期" prop="applyTime">
                    <DatePicker type="date" v-model="applyForm.applyTime" placeholder="选择日期" style="width: 160px" :disabled="editAble" :readonly="editAble" :editable = "false"></DatePicker>
                </Form-item>
            </div>
            <div class="form-content">
                <!--<Form-item label="使用部门" >
                    <Select v-model="applyForm.userDepartmentId" style="width:160px"></Select>
                </Form-item>-->
                <Form-item label="使用部门" prop="userDepartmentName">
                    <div style="color:#FFFFFF" onmousemove="this.style.color='#5b5b5b';" onmouseout="this.style.color='#ffffff'">
                        <div :title="applyForm.userDepartmentName" style="position: relative;">
                            <Icon type="ios-close" class="deleteTab" @click.native="emptyDept" v-show="!editAble"></Icon>
                            <Input v-model="applyForm.userDepartmentName" style="width: 160px;" readonly :disabled="editAble" :autofocus="deptFocus">
                            <Button slot="append" size="small" icon="ios-search" @click="openDeptMold" :disabled="editAble"></Button>
                            </Input>
                        </div>
                    </div>
                </Form-item>
                <Form-item label="使用部门负责人" prop="leaderName">
                    <Input v-model="applyForm.leaderName" style="width: 160px;" :disabled="editAble" readonly></Input>
                </Form-item>
                <!--<Form-item label="日期" >-->
                <!--<DatePicker type="date" placeholder="选择日期" style="width: 160px"></DatePicker>-->
                <!--</Form-item>-->
            </div>
        </Form>
        <!--<Row>
            <Col span="11" style="margin-right: 10px;">
            <div class="form-content">
                <Form :label-width="100" >
                    <FormItem label="主管部门意见">
                        <Input type="textarea" :autosize="{minRows: 5,maxRows: 10}" placeholder="请输入"></Input>
                    </FormItem>
                    <Form-item label="负责人" >
                        <Input  style="width: 160px;"></Input>
                    </Form-item>
                    <Form-item label="日期" >
                        <DatePicker type="date" placeholder="选择日期" style="width: 160px"></DatePicker>
                    </Form-item>
                </Form>
            </div>
            </Col>
            <Col span="11">
            <div class="form-content">
                <Form :label-width="100" >
                    <FormItem label="设备部门意见">
                        <Input type="textarea" :autosize="{minRows: 5,maxRows: 10}" placeholder="请输入"></Input>
                    </FormItem>
                    <Form-item label="负责人" >
                        <Input  style="width: 160px;"></Input>
                    </Form-item>
                    <Form-item label="日期" >
                        <DatePicker type="date" placeholder="选择日期" style="width: 160px"></DatePicker>
                    </Form-item>
                </Form>
            </div>
            </Col>
        </Row>
        <Row>
            <Col span="11" style="margin-right: 10px;">
            <div class="form-content">
                <Form :label-width="100" >
                    <FormItem label="相关部门意见">
                        <Input type="textarea" :autosize="{minRows: 5,maxRows: 10}" placeholder="请输入"></Input>
                    </FormItem>
                    <Form-item label="负责人" >
                        <Input  style="width: 160px;"></Input>
                    </Form-item>
                    <Form-item label="日期" >
                        <DatePicker type="date" placeholder="选择日期" style="width: 160px"></DatePicker>
                    </Form-item>
                </Form>
            </div>
            </Col>
            <Col span="11">
            <div class="form-content">
                <Form :label-width="100" >
                    <FormItem label="总经理核准">
                        <Input type="textarea" :autosize="{minRows: 5,maxRows: 10}" placeholder="请输入"></Input>
                    </FormItem>
                    <Form-item label="负责人" >
                        <Input  style="width: 160px;"></Input>
                    </Form-item>
                    <Form-item label="日期" >
                        <DatePicker type="date" placeholder="选择日期" style="width: 160px"></DatePicker>
                    </Form-item>
                </Form>
            </div>
            </Col>
        </Row>
        <Row>
            <Col span="11" style="margin-right: 10px;">
            <div class="form-content">
                <Form :label-width="100" >
                    <FormItem label="董事长核准">
                        <Input type="textarea" :autosize="{minRows: 5,maxRows: 10}" placeholder="请输入"></Input>
                    </FormItem>
                    <Form-item label="日期" >
                        <DatePicker type="date" placeholder="选择日期" style="width: 160px"></DatePicker>
                    </Form-item>
                </Form>
            </div>
            </Col>
        </Row>-->
        <!--审核记录-->
        <applyHistory :page="pageApplyHis" :pageSize="pageSizeApplyHis" :billId="billIdApplyHis"></applyHistory>

        <div align="center" class="btnGroupDesign">
            <Button type="primary" icon="compose" size="large" @click="editFun" v-if="rule_edit && editAble" v-show="applyForm.approvalStatus == 0 || applyForm.approvalStatus == 3">编辑</Button>
            <Button type="primary" icon="document-text" size="large" :loading="loading" @click="applySave('applyForm')" v-if="!editAble && rule_save" >保存</Button>
            <Button type="primary" icon="document-text" size="large" v-if="editAble && rule_apply" :loading="OALoading" @click="applyOAAudit" v-show="applyForm.approvalStatus == 0 || applyForm.approvalStatus == 3">提交OA审核</Button>
            <Button  class="btn-gary" size="large" @click="$router.go(-1)">返回</Button>
        </div>

        <!--请购人-->
        <Modal v-model="applierModel" title="请购人选择" @on-ok="applierSelected" width="1000">
            <Row style="height: 450px">
                <Col :span="7">
                    <div style="margin-top: 15px;">
                        <Tree :data="applierTreeData" show-checkbox :multiple="false" :show-checkbox="false" @on-select-change="left_personList" class="max-h-450"></Tree>
                    </div>
                </Col>
                <Col :span="17">
                    <div class="table-reset">
                        <Table highlight-row border ref="currentRowTable" class="taDisplay" :columns="columns_applier" :data="applierList" @on-row-click="toSelectApplier"></Table>
                    </div>
                    <div class="mar-t-10" style="overflow: hidden">
                        <div style="float: right;">
                            <Page size="small" :total='applierTotal' show-elevator :page-size="10" @on-change="applierChange"></Page>
                        </div>
                    </div>
                </Col>
            </Row>
        </Modal>
        <!--使用部门-->
        <Modal v-model="deptModel" title="使用部门" @on-ok="deptSelected">
            <div class="form-content">
                <Form>
                    <Form-item label="部门名称" prop="deptName">
                        <Input v-model="deptName" @on-blur="deptName=toValidate(deptName)" style="width: 160px"></Input>
                    </Form-item>
                </Form>
                <!--查询按钮-->
                <div style="text-align: right;padding-right: 20px">
                    <Button type="primary" icon="search" size="large" @click="loadDept">查询</Button>
                </div>
            </div>
            <div class="table-reset">
                <Table highlight-row border ref="currentRowTable" class="taDisplay" :columns="columns_dept" :data="deptList" @on-row-click="toSelectDept"></Table>
            </div>
            <div class="mar-t-10" style="overflow: hidden">
                <div style="float: right;">
                    <Page size="small" :total='deptTotal' show-elevator :page-size="pageSize" @on-change="deptChange"></Page>
                </div>
            </div>
        </Modal>
        <!--设备规格型号-->
        <Modal v-model="equ_type" title="设备规格型号" @on-ok="deviceSelected">
            <div class="form-content">
                <Form>
                    <Form-item label="设备规格型号" prop="name">
                        <Input v-model="equ_name" @on-blur="equ_name=toValidate(equ_name)" style="width: 160px"></Input>
                    </Form-item>
                </Form>
                <!--查询按钮-->
                <div style="text-align: right;padding-right: 20px">
                    <Button type="primary" icon="search" size="large" @click="deviceType">查询</Button>
                </div>
            </div>
            <div class="table-reset">
                <!--<table class="table table-bordered table-center table-striped table-blue table-edit typedevice taDisplay">
                    <thead>
                    <tr>
                        <th>选择</th>
                        <th>序号</th>
                        <th>设备型号</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(item,index) in deviceTypeList" class="trDisplay">
                        <td><input type="radio" name="id" :value="item.modelId"/></td>
                        <td>{{index + 1}}</td>
                        <td class="tdDisplay pointDis" :title="item.modelName" >{{item.modelName}}</td>
                    </tr>
                    </tbody>
                </table>-->
                <Table highlight-row border ref="currentRowTable" class="taDisplay" :columns="columns_equ_type" :data="deviceTypeList" @on-row-click="toSelectType"></Table>
            </div>
            <div class="mar-t-10" style="overflow: hidden">
                <div style="float: right;">
                    <Page size="small" :total="totalNum" show-elevator :page-size="equPageSize" @on-change="pageChange"></Page>
                </div>
            </div>
        </Modal>
    </div>
</template>
<script>
    //审核记录
    import auditLogging from '../treeMulitiple/auditLogging.vue';
    import applyHistory from './applyHistory.vue';
    export default{
        data(){
            return {
                rule_save:this.$rt(this.authJson.EAM.设备台账.设备请购编辑页.保存),
//                rule_new:this.$rt(this.authJson.EAM.设备台账.设备请购编辑页.取消),
                rule_apply:this.$rt(this.authJson.EAM.设备台账.设备请购详情页.提交OA审核),
//                rule_view:this.$rt(this.authJson.EAM.设备台账.设备请购详情页.返回),
                rule_edit:this.$rt(this.authJson.EAM.设备台账.设备请购详情页.编辑),
                /*权限*/
                /* **** editFlag 编辑 2、查看 0 、新建 1  - S - ***** */
                editAble:'',
                editFlag:'',
                openDate:false,
                applyId:'',
                stepVal:0,
                precisionNum:4,
                loading:false,
                OALoading:false,
                editAbleTitle:'',
                imgAddr: '', //barcode
                /* **** 编辑、查看、新建  - E - ***** */

                /****  申请表格填写内容 ****/
                applyForm:{
                    billNo:'',
                    "applierId":"",
                    "applierName":"", // 请购人
                    "applyTime":"",// 请购日期
                    budget:0,// 预算
                    "equipmentLocalName":"",// 设备名称
                    "equipmentPurchaseApplicationId":"",// 设备请购id（不传或者传入的值数据库中没有就认为是新增）
                    "modelBasedOn":"",// 造型依据
                    //GDJ--设备型号--开始：
                    "modelId":"",// 规格型号id
                    "modelName":"",// 规格型号name无
                    //GDJ--设备型号--结束
                    purchaseQuantity:0, // 请购数量
                    "purchaseReason":"",// 购置原因
                    "requiredDate":"",// 需求日期
                    "researchInfo":"",//  调研
                    "techParamsInfo":"",// 技术参数
                    "usage":"",// 设备作用(加工零件)
                    "userDepartmentId":"",// 使用部门id
                    "userDepartmentName":"",// 使用部门name
                    leaderId:"",//部门负责人id
                    leaderName:"",//部门负责人
                    approvalStatus:'',
                },
                applyRuleValidate: {
                    applierName: [
                        { required: true, message: '请填写请购人信息', trigger: 'change' }
                    ],
                    applyTime: [
                        {required: true, type: 'date', trigger: 'change',message: '请填写请购日期信息',},
                    ],
                    requiredDate: [
                        {required: true, type: 'date', trigger: 'change',message: '请填写需求日期信息',},
                    ],
                    budget: [
                        { required: true,type:"number", message: '请填写预算信息', trigger: 'blur' }
                    ],
                    equipmentLocalName: [
                        { required: true, message: '请填写设备名称信息', trigger: 'blur' }
                    ],
                    modelName: [
                        { required: true, message: '请填写规格型号信息', trigger: 'change' }
                    ],
                    purchaseQuantity: [
                        { required: true,type:"number",message: '请填写请购数量信息', trigger: 'blur' }
                    ],
                    purchaseReason: [
                        { required: true, message: '请填写购置原因信息', trigger: 'blur' }
                    ],
                    /*modelBasedOn: [
                        { required: true, message: '请填写造型依据信息', trigger: 'blur' }
                    ],
                    researchInfo: [
                        { required: true, message: '请填写调研信息', trigger: 'blur' }
                    ],*/
                    techParamsInfo: [
                        { required: true, message: '请填写技术要求（技术参数）信息', trigger: 'blur' }
                    ],
                    usage: [
                        { required: true, message: '请填写设备作用(加工零件)信息', trigger: 'blur' }
                    ],
                    userDepartmentName: [
                        { required: true, message: '请填写使用部门信息', trigger: 'change' }
                    ],
                    leaderName: [
                        { required: true, message: '请填写部门负责人信息', trigger: 'change' }
                    ],
                },

                /*审核记录 - S - */
                pageApplyHis:1,
                pageSizeApplyHis:5,
                billIdApplyHis:'',
                /*审核记录 - E - */

                /********* 设备型号 S ************/
                equ_type:false,
                equ_name:'',
                columns_equ_type:[
                    {
                        title:'序号',
                        type: 'index',
                        width: 120,
                        align: 'center'
                    },
                    {
                        title: '设备型号',
                        key: 'tBdEquipmentModelName',
                        align:'center',
                        render:(h,params) => {
                            return h('p',{
                                domProps:{
                                    title:params.row.tBdEquipmentModelName,
                                },
                                class:'iview_tabDis'
                            },params.row.tBdEquipmentModelName)
                        }
                    },
                ],//设备型号选择数据源
                deviceTypeList: [],//设备型号选择数据源
                selectRowType:'',//选择得到数据
                typeFocus:false,
                totalNum:0,
                equPageSize:5,
                equPage:1,
                /********* 设备型号 E ************/
                auditDate:"",
                auditStatus:"",
                //页面名称
                pageTitle: '',
                parentType: '', //父级路由type
                listStatus: '', //状态
                /*三个设备条件获取焦点,添加焦点以解决编辑页面无法清空页面显示值*/
                columns_dept:[
                    {
                        title:'序号',
                        type: 'index',
                        width: 120,
                        align: 'center'
                    },
                    {
                        title: '部门名称',
                        key: 'tBdDepartmentName',
                        align:'center',
                        render:(h,params) => {
                            return h('p',{
                                domProps:{
                                    title:params.row.tBdDepartmentName,
                                },
                                class:'iview_tabDis'
                            },params.row.tBdDepartmentName)
                        }
                    },
                    {
                        title: '部门负责人名称',
                        key: 'tBdPersonName',
                        align:'center',
                        render:(h,params) => {
                            return h('p',{
                                domProps:{
                                    title:params.row.tBdPersonName,
                                },
                                class:'iview_tabDis'
                            },params.row.tBdPersonName)
                        }
                    },
                ],
                deptList:[],
                deptModel:false,
                deptFocus:false,
                deptName:'',
                page:1,
                pageSize:5,
                deptTotal:0,
                editAble:false,
                selectRowDept:[],

                /*三个设备条件获取焦点*/

                /*请购人弹框*/
                applierModel:false,
                applierFocus:false,
                applierTreeData:[],
                columns_applier:[
                    {
                        title:'序号',
                        type: 'index',
                        width: 120,
                        align: 'center'
                    },
                    {
                        title: '人员编码',
                        key: 'personCode',
                        align:'center',
                        render:(h,params) => {
                            return h('p',{
                                domProps:{
                                    title:params.row.personCode,
                                },
                                class:'iview_tabDis'
                            },params.row.personCode)
                        }
                    },
                    {
                        title: '人员名称',
                        key: 'personName',
                        align:'center',
                        render:(h,params) => {
                            return h('p',{
                                domProps:{
                                    title:params.row.personName,
                                },
                                class:'iview_tabDis'
                            },params.row.personName)
                        }
                    },
                ],
                applierList:[],
                applierTotal:0,
                applierPage:1,
                selectApplierDept:{},
                rightDeptItem:[],
                /*请购人弹框*/
            }
        },
        components: {
            'applyHistory': applyHistory,
        },
        mounted(){
            this.applyId = this.$route.query.applyId;
            this.billIdApplyHis = this.$route.query.applyId;
            this.editFlag = this.$route.query.editFlag;
            this.listStatus = this.$route.query.listStatus;
            this.pageTitle = this.$base_info.getDescByCode(this.listStatus,this.$base_info.tEamEquipmentPurchaseApplicationFromStatusEnum)
            this.applyForm.equipmentPurchaseApplicationId = this.applyId;
            if(this.editFlag== 1){
                this.editAbleTitle = "新建";
                this.editAble = false;
                this.openDate = false;
            }else if(this.editFlag== 0){
                this.editAbleTitle = "详情";
                this.editAble = true;
                this.openDate = false;
                this.loadApplyDetail();
            }else if(this.editFlag== 2){
                this.editAbleTitle = "编辑";
                this.editAble = false;
                this.loadApplyDetail();
            }
        },
        methods: {
            editFun(){
                this.editAble = false;
            },
            loadApplyDetail(){
                let vm = this;
                this.$axios.post('/equipmentApplication/equipmentPurchaseEditDetail', {
                    equipmentPurchaseId : vm.applyId
                }).then((res) => {
                    let respone = res.data.response;
                    console.log("res +" + JSON.stringify(res))
                    if (respone.code  === 1) {
                        vm.applyForm = respone.data;
                        if(vm.applyForm.approvalStatus == 0 || vm.applyForm.approvalStatus == 3){
                            vm.stepVal = 0;
                        }else if(vm.applyForm.approvalStatus == 1){
                            vm.stepVal = 1
                        }else if(vm.applyForm.approvalStatus == 2 || vm.applyForm.approvalStatus == 5 || vm.applyForm.approvalStatus == 4){
                            vm.stepVal = 2
                        }
                        vm.auditDate = '';
                        vm.auditStatus = this.$base_info.getDescByCode(vm.applyForm.approvalStatus,this.$base_info.tEamEquipmentPurchaseApplicationFromStatusEnum);
                        vm.imgAddr = respone.data.barCode;
                    } else {
                        //.. 业务失败的情况
                        this.$Message.error({
                            content: '数据返回错误',
                            duration: 5,
                            closable: true
                        });
                    }
                }).catch((err) => {
                    console.log("无数据 + " + err);
                });
            },
            /*请购人选择框*/
            openApplierMold(){
                this.applierModel = true;
                this.loadApplier();
            },
            loadApplier(){
                let vt = this;
                this.$axios.get('/System/organizationTree').then((res) => {
                    let result = res.data.response;
                    if (result.code != 1) {
                        vt.$Message.error(result.msg);
                    } else {
                        vt.applierTreeData = result.data;
                    }
                }).catch((err) => {
                    console.log(err)
                });
            },
            applierSelected(){
                let sid = this.selectRowDept.tBdDepartmentId;
                this.applyForm.applierName = this.selectApplierDept.personName;
                this.applyForm.applierId = this.selectApplierDept.id;
                this.applierFocus = false;
            },
            left_personList(itemData){
                let vm = this;
                vm.rightDeptItem = [];
                vm.rightDeptItem = itemData;
                if(itemData.length > 0){
                    this.$axios.post('/System/getPersonByOrganization', {
                        page: vm.applierPage,
                        pageSize: 10,
                        organizationId  : itemData[0].id,
                    }).then((res) => {
                        let respone = res.data.response;
                        if (respone.code  === 1) {
                            this.applierList = respone.data.Rows;
                            this.applierTotal = respone.data.Total;
                        } else {
                            //.. 业务失败的情况
                            this.$Message.error({
                                content: '数据返回错误',
                                duration: 5,
                                closable: true
                            });
                        }
                    }).catch((err) => {
                        console.log("无数据 + " + err);
                    });
                }

            },
            toSelectApplier(rowData){
                this.selectApplierDept = rowData;
            },
            emptyApplier(){
                this.applyForm.applierName = "";
                this.applyForm.applierId = "";
                this.applierFocus = true;
            },
            /*分页*/
            applierChange(crrentPage){
                this.applierPage = crrentPage;
                this.left_personList(this.rightDeptItem);
            },
            /*请购人选择框*/
            /*使用部门*/
            openDeptMold(){
                this.deptModel = true;
                this.loadDept();
            },
            loadDept(){
                let vm = this;
                this.$axios.post('/common/departmentName', {
                    page: vm.page,
                    pageSize: vm.pageSize,
                    departmentName : vm.deptName,
                }).then((res) => {
                    let respone = res.data.response;
                    if (respone.code  === 1) {
                        this.deptList = respone.data.Rows;
                        this.deptTotal = respone.data.Total;
                    } else {
                        //.. 业务失败的情况
                        this.$Message.error({
                            content: '数据返回错误',
                            duration: 5,
                            closable: true
                        });
                    }
                }).catch((err) => {
                    console.log("无数据 + " + err);
                });
            },
            deptSelected(){
//                console.log("selectRowDept + " + JSON.stringify(this.selectRowDept))
                let sid = this.selectRowDept.tBdDepartmentId;
                this.applyForm.userDepartmentName = this.selectRowDept.tBdDepartmentName;
                this.applyForm.userDepartmentId = sid;
                this.applyForm.leaderName = this.selectRowDept.tBdPersonName;
                this.applyForm.leaderId = this.selectRowDept.tBdPersonId;
                this.deptFocus = false;
            },
            toSelectDept(rowData){
                this.selectRowDept = rowData;
            },
            emptyDept(){
                this.applyForm.userDepartmentName = "";
                this.applyForm.userDepartmentId = "";
                this.applyForm.leaderName = "";
                this.applyForm.leaderId = "";
                this.deptFocus = true;
            },
            /*分页*/
            deptChange(crrentPage){
                this.page = crrentPage;
                this.loadDept();
            },
            /*使用部门*/
            /*3、设备型号 S  */
            openEquType(){
                this.equ_type = true;
                this.deviceType();
            },
            deviceType(){
                this.$axios.get('/System/equipmentModelMagnifier', {
                    params: {
                        page: this.equPage,
                        pageSize: 5,
                        equipment_model_name:this.equ_name,
                    }
                }).then((res) => {
                    let ret = res.data.response;
                    if (ret.code == 1) {
                        this.deviceTypeList = ret.data.Rows;
                        this.totalNum = ret.data.Total;
                    }
                }).catch((err) => {
                    console.log(err);
                });
            },
            pageChange(page){
                this.equPage = page;
                this.deviceType();
            },
            toSelectType(rowData){
                this.selectRowType = rowData;
            },
            deviceSelected(){
                let deviceId = this.selectRowType.tBdEquipmentModelId;
                this.applyForm.modelId = deviceId;
                this.applyForm.modelName = this.selectRowType.tBdEquipmentModelName;
                this.typeFocus = false;
            },
            emptyEquType(){
                this.applyForm.modelId = "";
                this.applyForm.modelName = "";
                this.typeFocus = true;
            },
            /*3、设备型号  E */


            /* *** save *** */
            applySave(name){
                let vm = this;
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        vm.loading = true;
                        this.$axios.post('/equipmentApplication/equipmentPurchaseSave',vm.applyForm ).then((res) => {
                            let respone = res.data.response;
                            if (respone.code  === 1) {
                                vm.$Message.success(respone.data);
                                this.$router.push({path: '/equipApply', query: {type: this.listStatus}});
                            } else {
                                //.. 业务失败的情况
                                vm.loading = false;
                                vm.$Message.error({
                                    content: respone.msg,
                                    duration: 5,
                                    closable: true
                                });
                            }
                        }).catch((err) => {
                            vm.loading = false;
                            console.log("无数据 + " + err);
                        });
                    } else {
                        vm.$Message.error('请完善信息！');
                    }
                })
//                console.log("applyForm +" + JSON.stringify(this.applyForm))

            },
            applyOAAudit(){
                let vm = this;
                vm.OALoading=true;
                this.$axios.post('/eam/submit_equipment_purchase',{
                    tEamEquipmentPurchaseApplicationFormId:vm.applyId
                }).then((res) => {
                    let respone = res.data.response;
                    if (respone.code === 1) {
                        vm.$Message.success("提交OA成功！");
                        this.$router.push({path: '/equipApply', query: {type: this.listStatus}});
                    } else {
                        vm.OALoading = false;
                        //.. 业务失败的情况
                        vm.$Message.error({
                            content: respone.msg,
                            duration: 5,
                            closable: true
                        });
                    }
                }).catch((err) => {
                    vm.OALoading = false;
                    console.log("无数据 + " + err);
                });
            },
            //查询时验证输入框不能为英文单双引号
            toValidate(msg) {
                var str = /[=+%!<>"'/_,()\\]/;
                if (str.test(msg)) {
                    this.$Message.warning("输入格式错误");
                    msg = msg.replace(/\'/g,"").replace(/\"/g,"").replace(/\+/g,"").replace(/\=/g,"").replace(/\%/g,"").replace(/\!/g,"").replace(/\</g,"").replace(/\>/g,"").replace(/\//g,"").replace(/\_/g,"").replace(/\,/g,"").replace(/\(/g,"").replace(/\)/g,"").replace(/\\/g,"");
                }
                return msg;
            },
            /*检测四位小数*/
            floatFW(num){
                let regNum=/^\d+(\.\d{0,5})?$/.test(num);
                if(!regNum && num!=null){
                    let backNum = parseFloat(num.toFixed(4));
                    this.applyForm.budget = backNum;
                };
            },

        }
    }
</script>
<style>
    .titleLogo{
        width: 100px;
        height: 55px;
        margin: 15px 0;
        position: absolute;
        right: 60px;
        top: 0;
    }
</style>