<template>
    <div class="basic bzzy-search">
        <!--模块名称-->
        <div class="title">
            <span>设备总账</span>
        </div>
        <!--表单-->
        <div class="form-content">
            <Form v-model="searchLedger" label-position="right" inline :label-width="100">
                <FormItem label="设备名称" prop="equipmentName">
                    <Input v-model="searchLedger.equipmentName" @on-blur="searchLedger.equipmentName = toValidate(searchLedger.equipmentName)" style="width: 160px;"></Input>
                </FormItem>
                <FormItem label="设备编码" prop="equipmentCode">
                    <Input v-model="searchLedger.equipmentCode" @on-blur="searchLedger.equipmentCode = toValidate(searchLedger.equipmentCode)" style="width: 160px;"></Input>
                </FormItem>
                <FormItem label="生产厂家" prop="manufacturer">
                    <div style="color:#ffffff" onmousemove="this.style.color='#5b5b5b';" onmouseout="this.style.color='#ffffff'">
	                    <span @click="deleteSupply" v-if="searchLedger.manufacturer">
	                    	<Icon type="ios-close" class="deleteTab"></Icon>
	                    </span>
                        <div class="input-search" prop="manufacturer" @click="openSup">
                            <Input v-model="searchLedger.manufacturer" style="width: 160px;" readonly></Input>
                            <Button icon="ios-search" @click="openSup"></Button>
                        </div>
                    </div>
                </FormItem>
                <FormItem label="规格型号" prop="model">
                    <div style="color:#FFFFFF" onmousemove="this.style.color='#5b5b5b';" onmouseout="this.style.color='#ffffff'">
                        <div :title="searchLedger.model" style="position: relative;">
                            <Icon type="ios-close" class="deleteTab" @click.native="emptyEquType" v-show="!editAble"></Icon>
                            <Input v-model="searchLedger.model" style="width: 160px;" readonly :disabled="editAble" :autofocus="typeFocus">
                                <Button slot="append" size="small" icon="ios-search" @click="openEquType" :disabled="editAble"></Button>
                            </Input>
                        </div>
                    </div>
                </FormItem>
                <FormItem label="启用日期" prop="createAt">
                    <Row>
                        <Col span="11">
                            <DatePicker v-model="searchLedger.startTime" type="date" placeholder="选择日期" @on-change="checkStart"></DatePicker>
                        </Col>
                        <Col span="2" style="text-align: center">~</Col>
                        <Col span="11">
                            <DatePicker v-model="searchLedger.endTime" type="date" placeholder="选择日期" @on-change="checkEnd"></DatePicker>
                        </Col>
                    </Row>
                </FormItem>
                <FormItem label="安装地点" prop="location">
                    <div style="color:#ffffff" onmousemove="this.style.color='#5b5b5b';" onmouseout="this.style.color='#ffffff'">
                        <span @click="deleteSite" v-if="!editAble&&searchLedger.location">
                            <Icon type="ios-close" class="deleteTab"></Icon>
                        </span>
                        <div class="input-search pointDis" @click="openSiteMode">
                            <Input v-model="searchLedger.location" :readonly=true style="width: 160px;" :disabled="editAble"></Input>
                            <Button icon="ios-search" :disabled="editAble"></Button>
                        </div>
                    </div>
                </FormItem>
                <FormItem label="使用部门" prop="department">
                    <div style="color:#FFFFFF" onmousemove="this.style.color='#5b5b5b';" onmouseout="this.style.color='#ffffff'">
                        <div :title="searchLedger.department" style="position: relative;">
                            <Icon type="ios-close" class="deleteTab" @click.native="emptyDept" v-show="!editAble"></Icon>
                            <Input v-model="searchLedger.department" style="width: 160px;" readonly :disabled="editAble" :autofocus="deptFocus">
                                <Button slot="append" size="small" icon="ios-search" @click="openDeptMold" :disabled="editAble"></Button>
                            </Input>
                        </div>
                    </div>
                </FormItem>
                <FormItem label="设备使用人" prop="user">
                    <Input v-model="searchLedger.user" style="width: 160px;" readonly></Input>
                </FormItem>
                <FormItem label="设备类别" prop="equipmentCategoryId">
                    <Select v-model="searchLedger.equipmentCategoryId" @on-blur="searchLedger.equipmentCategoryId = toValidate(searchLedger.equipmentCategoryId)" style="width: 160px;">
                        <Option v-for="item in effectCategory" :value="item.code" :key="item.code">{{ item.desc }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="设备类型" prop="type">
                    <div style="color:#FFFFFF" onmousemove="this.style.color='#5b5b5b';" onmouseout="this.style.color='#ffffff'">
                        <div :title="searchLedger.type" style="position: relative;">
                            <Icon type="ios-close" class="deleteTab" @click.native="emptyEquMold"></Icon>
                            <Input v-model="searchLedger.type" style="width: 160px;" readonly :disabled="editAble" :autofocus="moldFocus">
                                <Button slot="append" size="small" icon="ios-search" @click="openEquMold" :disabled="editAble"></Button>
                            </Input>
                        </div>
                    </div>
                </FormItem>
                <FormItem label="资产状态" prop="assetState">
                    <Select v-model="searchLedger.assetState" style="width: 160px;">
                        <Option v-for="item in effectItem" :value="item.code" :key="item.code">{{ item.desc }}</Option>
                    </Select>
                </FormItem>
            </Form>
            <div align="right" class="btnGroupDesign">
                <Button v-if="if_query" type="primary" icon="search" size="large" @click="searchResult">查询</Button>
            </div>
        </div>
        <!--<div style="width: 100px; height: 55px; margin: 15px 0;"><img style="width: 100%; height: 100%;" src="../../../static/img/ch_logo.jpg" alt=""></div>-->
        <!--<h3>单据类型码：P005E</h3>-->
        <!--表格-->
        <div class="table-content ivu-table-auto">
            <table class="table table-bordered table-center table-striped table-blue taDisplay lineTable">
                <thead>
                    <tr class="hdDesign">
                        <th rowspan="2" style="white-space:nowrap;width: 35px;">序号</th>
                        <th colspan="2" style="width: 120px;">设备编号</th>
                        <th rowspan="2">设备名称</th>
                        <th rowspan="2">生产厂家</th>
                        <th rowspan="2">规格型号</th>
                        <th rowspan="2">安装地点</th>
                        <th rowspan="2">生产日期</th>
                        <th rowspan="2">安装日期</th>
                        <th rowspan="2">启用日期</th>
                        <th rowspan="2">电机功率</th>
                        <th rowspan="2">设备原值</th>
                        <th rowspan="2">使用部门</th>
                        <th rowspan="2">设备使用人</th>
                        <th rowspan="2">设备类别</th>
                        <th rowspan="2">设备类型</th>
                        <th rowspan="2">资产状态</th>
                        <th rowspan="2" style="width: 150px">操作</th>
                    </tr>
                    <tr class="hdDesignSec">
                        <th>厂内编号</th>
                        <th>生产厂家编号</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item,index) in equments" :key="item.equipmentId" class="trDisplay">
                        <td>{{index + 1}}</td>
                        <td class="tdDisplay pointDis" :title="item.code">{{item.code}}</td>
                        <td class="tdDisplay pointDis" :class="shelterFlag?'':'shelterWord'">{{item.manufacturerEquipmentCode}}</td>
                        <td class="tdDisplay pointDis" :title="item.equipmentName">{{item.equipmentName}}</td>
                        <td class="tdDisplay pointDis" :class="shelterFlag?'':'shelterWord'">{{item.manufacturer}}</td>
                        <td class="tdDisplay pointDis" :title="item.model">{{item.model}}</td>
                        <td class="tdDisplay pointDis" :title="item.location">{{item.location}}</td>
                        <td class="tdDisplay pointDis" :title="item.manufactureDate">{{item.manufactureDate}}</td>
                        <td class="tdDisplay pointDis" :title="item.installationDate">{{item.installationDate}}</td>
                        <td class="tdDisplay pointDis" :title="item.startToUseDate">{{item.startToUseDate}}</td>
                        <td class="tdDisplay pointDis" :class="shelterFlag?'':'shelterWord'">{{item.power}}</td>
                        <td class="tdDisplay pointDis" :class="shelterFlag?'':'shelterWord'">{{item.purchasePrice}}</td>
                        <td class="tdDisplay pointDis" :title="item.department">{{item.department}}</td>
                        <td class="tdDisplay pointDis" :title="item.user">{{item.user}}</td>
                        <td class="tdDisplay pointDis" :title="item.classification">{{item.classification}}</td>
                        <td class="tdDisplay pointDis" :title="item.type">{{item.type}}</td>
                        <td class="tdDisplay pointDis" :title="item.state">{{item.state}}</td>
                        <!--<td>-->
                            <!--<keep-alive>-->
                                <!--<router-link :to="{path:'/archives'}" v-if="if_files">-->
                                    <!--<a>查看档案</a>-->
                                <!--</router-link>-->
                            <!--</keep-alive>-->
                            <!--<router-link :to="{path:'/resume'}" v-if="if_record">-->
                                <!--<a>查看履历</a>-->
                            <!--</router-link>-->
                        <!--</td>-->
                        <td class="mettingManage_oprationItem">
                            <a v-if="if_files" @click="archives(item.equipmentId)">查看档案</a>
                            <a v-if="if_record" @click="resume(item.equipmentId)">查看履历</a>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div class="tableHasNoData" v-show="tableNoData"><p>暂无数据</p></div>
        </div>
        <div class="page">
            <Page :total="numMaterial" :current="page" size="small" show-elevator :page-size="pageSize" @on-change="changePage"></Page>
        </div>
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
                <Table highlight-row border ref="currentRowTable" class="taDisplay" :columns="columns_equ_type" :data="deviceTypeList" @on-row-click="toSelectType"></Table>
            </div>
            <div class="mar-t-10" style="overflow: hidden">
                <div style="float: right;">
                    <Page size="small" :total="totalNum" show-elevator :page-size="equPageSize" @on-change="pageChange"></Page>
                </div>
            </div>
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
        <!--设备地点-->
        <Modal v-model="equSite_mod" title="设备地点" @on-ok="toSelect_equSite">
            <Tree :data="baseData" show-checkbox :multiple="false" :show-checkbox="false"
                  @on-select-change="left_personSelected" class="max-h-300"></Tree>
        </Modal>
        <!--设备类型-->
        <Modal v-model="equ_mold_modal" title="设备类型" @on-ok="equMoldSelected">
            <div class="form-content">
                <Form>
                    <Form-item label="设备类型" prop="name">
                        <Input v-model="equ_mold_name" @on-blur="equ_mold_name=toValidate(equ_mold_name)" style="width: 160px"></Input>
                    </Form-item>
                </Form>
                <!--查询按钮-->
                <div style="text-align: right;padding-right: 20px">
                    <Button type="primary" icon="search" size="large" @click="equMoldReload">查询</Button>
                </div>
            </div>
            <div class="table-reset">
                <Table highlight-row border ref="currentRowTable" class="taDisplay" :columns="columns_equMold" :data="equMoldList" @on-row-click="toSelectEquMold"></Table>
            </div>
            <div class="mar-t-10" style="overflow: hidden">
                <div style="float: right;">
                    <Page size="small" :total='equMoldTotal' show-elevator :page-size="equMoldSize" @on-change="equMoldChange"></Page>
                </div>
            </div>
        </Modal>
        <!--生产厂家-->
        <Modal v-model="supplierModal" title="生产厂家" @on-ok="supplySelected">
            <div>
                <div class="btn-query mar-b-10" style="display: table;margin-bottom: 20px;">
                    生产厂家  <Input class="mar-l-10" style="width: 160px;" v-model="manufacturer_name" @on-blur="manufacturer_name = toValidate(manufacturer_name)" ></Input>
                    <Button v-if="if_query" type="primary" icon="search" size="large" @click="searchSupplier">
                        查询
                    </Button>
                </div>
                <div class="table-reset">
                    <Table highlight-row border ref="currentRowTable" class="taDisplay" :columns="columns_supplierList" :data="supplierList" @on-row-click="toSelectManufacturer"></Table>
                </div>
                <div class="mar-t-10" style="overflow: hidden">
                    <div style="float: right;">
                        <Page size="small" :total='supplyTotal' show-elevator :page-size="5" :current="supplyPage" @on-change="supplyChange"></Page>
                    </div>
                </div>
            </div>
        </Modal>
    </div>
</template>
<script>
    export default {
        data (){
            return {
                /*遮挡shelterFlag*/
                shelterFlag:false,
                /*权限校验 start*/
                if_query: this.$rt(this.authJson.EAM.设备台账.设备总账列表.查询),
                if_files: this.$rt(this.authJson.EAM.设备台账.设备总账列表.查看档案),
                if_record: this.$rt(this.authJson.EAM.设备台账.设备总账列表.查看履历),
                /*权限校验 end*/
                /*搜索条件*/
                searchLedger:{
                    equipmentName: "",
                    equipmentCode: "",
                    manufacturerId: "",
                    manufacturer: "",
                    specId: "",
                    model: "",
                    startTime: "",
                    endTime: "",
                    locationId: "",
                    location: "",
                    departmentId: "",
                    department: "",
                    userId: "",
                    user: "",
                    equipmentCategoryId: "",
                    equipmentTypeId: "",
                    type: "",
                    assetState: ""
                },
                editAble: false,
                equments:[],
                //在表格无数据时
                tableNoData: false,
                /********* 设备规格型号 ************/
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
                ],
                //设备型号选择数据源
                deviceTypeList: [],//设备型号选择数据源
                selectRowType:'',//选择得到数据
                typeFocus:false,
                totalNum:0,
                equPageSize:5,
                equPage:1,
                /********* 使用部门 ************/
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
                deptTotal:0,
                //设备地点相关
                equSite_mod: false,
                baseData: [],
                equ_site_obj: '',
                equSite_selected: "",
                equSite: "",
                equSiteId: '',
                //设备类型
                moldFocus:false,
                equ_mold_modal:false,
                equ_mold_name:'',
                equMoldList:[],
                selectRowequMold:'',
                equMoldSize:5,
                equMoldPage:1,
                equMoldTotal:0,
                columns_equMold:[
                    {
                        title:'序号',
                        type: 'index',
                        width: 120,
                        align: 'center'
                    },
                    {
                        title: '设备类型',
                        key: 'tBdEquipmentTypeName',
                        align:'center',
                        render:(h,params) => {
                            return h('p',{
                                domProps:{
                                    title:params.row.tBdEquipmentTypeName,
                                },
                                class:'iview_tabDis'
                            },params.row.tBdEquipmentTypeName)
                        }
                    },
                ],
                equMoldList:[],
                //生产厂家
                supplierModal: false,
                supplyPage: 1,
                manufacturer_name:'',
                columns_supplierList:[
                    {
                        title:'序号',
                        type: 'index',
                        width: 120,
                        align: 'center'
                    },
                    {
                        title: '生产厂家',
                        key: 'tBdEquipmentManufacturerName',
                        align:'center',
                        render:(h,params) => {
                            return h('p',{
                                domProps:{
                                    title:params.row.tBdEquipmentManufacturerName,
                                },
                                class:'iview_tabDis'
                            },params.row.tBdEquipmentManufacturerName)
                        }
                    },
                ],
                supplierList: [],
                supplyTotal: 0,
                supplierSelected: '',
                //枚举初始化
                effectItem:[],
                effectCategory:[],
                /*分页*/
                page:1,
                pageSize:10,
                numMaterial: 5,
                /*分页*/
                notFitDataTip:'',
            }
        },
        activated: function () {
            this.created && this.listEquipment();
            this.created = true;
        },
        mounted(){
            this.effectItem = this.$base_info.tEAMEquipmentAssetsStatusEnum;
            this.effectCategory = this.$base_info.tEAMEquipmentAssetsClassificationEnum;
            this.listEquipment();
            this.get_equSite();
        },
        watch: {
            '$route' (to, from) {
//                this.pageTitle = to.query.title;
//                this.searchForm.approvalStatus = to.query.type;
                this.listEquipment();
            }
        },
        methods: {
            listEquipment(){
                let vt = this;
                this.$axios.get('eamEquipment/listEquipment', {
                    params: {
                        page: vt.page,
                        pageSize: vt.pageSize,
                        equipmentName: vt.searchLedger.equipmentName,
                        equipmentCode: vt.searchLedger.equipmentCode,
                        manufacturerId: vt.searchLedger.manufacturerId,
                        manufacturer: vt.searchLedger.manufacturer,
                        specId: vt.searchLedger.specId,
                        startTime: vt.searchLedger.startTime,
                        endTime: vt.searchLedger.endTime,
                        locationId: vt.searchLedger.locationId,
                        location: vt.searchLedger.location,
                        departmentId: vt.searchLedger.departmentId,
                        department: vt.searchLedger.department,
                        userId: vt.searchLedger.userId,
                        user: vt.searchLedger.user,
                        equipmentCategoryId: vt.searchLedger.equipmentCategoryId==-1 ? '' : vt.searchLedger.equipmentCategoryId,
                        equipmentTypeId: vt.searchLedger.equipmentTypeId,
                        assetState: vt.searchLedger.assetState==-1 ? '' : vt.searchLedger.assetState,
                    }
                }).then((res) => {
                    let result = res.data.response;
//                    console.log( 'dfddg +' + JSON.stringify(res))
                    if (result.code == 1) {
                        vt.equments = result.data.data;
                        vt.numMaterial = result.data.total;
                          //字符&文字转化判断
                        if (vt.equments) {
//                                    console.log( '数据显示数据显示 + ' + JSON.stringify(vt.equments))
                            for (let i=0; i<vt.equments.length; i++) {
                                vt.equments[i].state = vt.$base_info.getDescByCode(vt.equments[i].state, vt.$base_info.tEAMEquipmentAssetsStatusEnum);
                                vt.equments[i].classification = vt.$base_info.getDescByCode(vt.equments[i].classification, vt.$base_info.tEAMEquipmentAssetsClassificationEnum)
                            }
                            vt.tableNoData = false;
                        }
                        else {
                            vt.tableNoData = true
                        }
                        for(let val of result.data.roles){
                            val == '设备管理员'|| val == '设备科长'? vt.shelterFlag = true :vt.shelterFlag = false;
                        }
                    } else {
                        vt.$Message.error(result.msg)
                    }
                }).catch((err) => {
                    console.log(err);
                });
            },
            /*查询*/
            searchResult() {
                this.page = 1;
                this.listEquipment();
            },
            //翻页
            changePage(currentPage) {
                this.page = currentPage;
                this.listEquipment();
            },
            //查看档案
            archives:function (equId) {
                this.$router.push({path: '/archives',query: {'id': equId}});
            },
            //查看履历
            resume:function (equId) {
                this.$router.push({path: '/resume',query: {'id': equId}});
            },
            //规格型号－Start
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
                this.searchLedger.specId = deviceId;
                this.searchLedger.model = this.selectRowType.tBdEquipmentModelName;
                this.typeFocus = false;
            },
            emptyEquType(){
                this.searchLedger.specId = "";
                this.searchLedger.model = "";
                this.typeFocus = true;
            },
            //规格型号－End
            //使用部门－Start
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
                this.searchLedger.department = this.selectRowDept.tBdDepartmentName;
                this.searchLedger.departmentId = sid;
                this.searchLedger.user = this.selectRowDept.tBdPersonName;
                this.searchLedger.userId = this.selectRowDept.tBdPersonId;
                this.deptFocus = false;
            },
            toSelectDept(rowData){
                this.selectRowDept = rowData;
            },
            emptyDept(){
                this.searchLedger.department = "";
                this.searchLedger.departmentId = "";
                this.searchLedger.user = "";
                this.searchLedger.userId = "";
                this.deptFocus = true;
            },
            /*分页*/
            deptChange(crrentPage){
                this.page = crrentPage;
                this.loadDept();
            },
            //使用部门－End
            //安装地点－Start
            //打开地点弹框
            openSiteMode() {
                if (!this.editAble) {
                    this.equSite_mod = true;
                }
            },
            //设备地点完整树加载:
            get_equSite(){
                let vt = this;
                this.$axios.get('/common/location/locationNameTree').then((res) => {
                    let result = res.data.response;
//                    console.log(result)
//                    console.log('设备地点数据')
                    if (result.code != 1) {
                        vt.$Message.error(result.msg);
                    }
                    else {
                        vt.baseData = result.data;
                        vt.baseData[0].expand = true;
                    }
                }).catch((err) => {
                    console.log(err);
                });
            },
            //设备地点树选择：
            left_personSelected (left_node){
                if (JSON.stringify(left_node) == "[]") {
                    return
                }
//                if (left_node[0] && left_node[0].children) {
//                    left_node[0].expand = !left_node[0].expand;
//                    left_node[0].selected = false;
//                }
                this.equ_site_obj = left_node[0];
            },
            //地点确定按钮：
            toSelect_equSite(){
                this.equSiteId = this.equ_site_obj.id;
                this.equSite = this.equ_site_obj.title;
                this.searchLedger.locationId = this.equ_site_obj.id;
                this.searchLedger.location = this.equSite;
            },
            //删除地点
            deleteSite(){
                this.equSiteId = '';
                this.equSite = '';
                this.searchLedger.locationId = '';
                this.searchLedger.location = '';
            },
            //安装地点－End
            //设备类型－Start
            openEquMold(){
                this.equ_mold_modal = true;
                this.equMoldReload();
            },
            equMoldReload(){
                this.$axios.get('/System/equipmentTypeMagnifier', {
                    params: {
                        page: this.equMoldPage,
                        pageSize: 5,
                        equipment_name:this.equ_mold_name
                    }
                }).then((res) => {
                    let ret = res.data.response;
                    if (ret.code == 1) {
                        this.equMoldList = ret.data.Rows;
                        this.equMoldTotal = ret.data.Total
                    }
                }).catch((err) => {
                    console.log(err);
                });
            },
            toSelectEquMold(rowData){
                this.selectRowequMold = rowData;
            },
            equMoldSelected(){
                this.searchLedger.type = this.selectRowequMold.tBdEquipmentTypeName;
                this.searchLedger.equipmentTypeId = this.selectRowequMold.tBdEquipmentTypeId;
                this.moldFocus = false;
//                this.watchRely();
//                console.log( "455+fdsf+555 + " + this.searchLedger.equipmentTypeId)
            },
            emptyEquMold(){
                this.searchLedger.type = "";
                this.searchLedger.equipmentTypeId = "";
                this.moldFocus = true;
//                this.watchRely();
            },
            equMoldChange(page){
                this.equMoldPage = page;
                this.equMoldReload();
            },
            //设备类型－End
            //生产厂家－Start
            openSup(){
                $('.trBgc').removeClass('highlight')
                this.supplierModal = true;
                this.supplierGet();
            },
            supplierGet(){
                this.$axios.get('/System/equipmentManufacturerMagnifier', {
                    params: {
                        page: this.supplyPage,
                        pageSize: 5,
                        manufacturer_name: this.manufacturer_name
                    }
                }).then((res) => {
                    var ret = res.data.response;
                    console.log(ret)
                    if (ret.code == 1) {
                        this.supplierList = ret.data.Rows;
                        this.supplyTotal = ret.data.Total
                    }
                }).catch((err) => {

                });
            },
            searchSupplier(){
                this.supplyPage=1;
                this.supplierGet();
            },
            supplyChange(page){
                this.supplyPage = page;
                $(".supply").find("input[type='radio']:checked").prop('checked', false);
                this.supplierGet();
            },
            toSelectManufacturer(rowData){
//                $('.trBgc').eq(index).addClass('highlight').siblings().removeClass('highlight')
//                console.log('9 99 == '+JSON.stringify(rowData))
                this.supplierSelected = rowData;
            },
            supplySelected(){
                this.searchLedger.manufacturerId = this.supplierSelected.tBdEquipmentManufacturerId;
                this.searchLedger.manufacturer = this.supplierSelected.tBdEquipmentManufacturerName;
            },
            deleteSupply(){
                this.searchLedger.manufacturerId = '';
                this.searchLedger.manufacturer = '';
                $(".supply").find("input[type='radio']:checked").prop('checked', false);
            },
            //生产厂家－End
            //查询时验证输入框不能为英文单双引号
            toValidate(msg) {
                var str = /[=+%!<>"'/_,()\\]/;
                if (str.test(msg)) {
                    this.$Message.warning("输入格式错误");
                    msg = msg.replace(/\'/g,"").replace(/\"/g,"").replace(/\+/g,"").replace(/\=/g,"").replace(/\%/g,"").replace(/\!/g,"").replace(/\</g,"").replace(/\>/g,"").replace(/\//g,"").replace(/\_/g,"").replace(/\,/g,"").replace(/\(/g,"").replace(/\)/g,"").replace(/\\/g,"");
                }
                return msg;
            },
            //时间大小比较
            checkStart(sTime) {
//                console.log('sTime == ' + sTime)
                if (this.searchLedger.endTime != '') {
                    if (sTime > this.searchLedger.endTime) {
                        this.$Message.error('开始时间应在结束时间之前');
                    }
                }
                this.searchLedger.startTime = sTime;
            },
            checkEnd(eTime) {
//                console.log('eTime == ' +eTime)
                if (this.searchLedger.startTime != '') {
                    if (eTime < this.searchLedger.startTime) {
                        this.$Message.error('结束时间应在开始时间之后');
                    }
                }
                this.searchLedger.endTime = eTime;
            },
        }
    }
</script>