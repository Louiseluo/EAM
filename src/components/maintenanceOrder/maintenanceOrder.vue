<template>
    <div class="basic fault-content">
        <!--模块名称-->
        <div class="title">
            <span>{{orderTitle}}工单管理 -- {{pageTitle}}</span>
        </div>
        <!--表单-->
        <div class="form-content">
            <Form ref="orderWorkForm" :model="orderWorkForm" label-position="right" inline :label-width="100">
                <Form-item label="工单单据号" prop="billNo">
                    <Input v-model="orderWorkForm.billNo" @on-blur="orderWorkForm.billNo = toValidate(orderWorkForm.billNo)" style="width: 160px;" placeholder=""></Input>
                </Form-item>
                <Form-item label="来源计划名称" prop="code" v-show="orderFlag == 0">
                    <Input v-model="orderWorkForm.workOrderBillNo" @on-blur="orderWorkForm.workOrderBillNo = toValidate(orderWorkForm.workOrderBillNo)" style="width: 160px;" placeholder=""></Input>
                </Form-item>
                <!-- <Form-item label="设备地点" prop="equipmentName">
                     <div class="input-search">
                         <Input v-model="orderWorkForm.equipmentCode" style="width: 160px;" disabled></Input>
                         <Button icon="ios-search" @click="equipment_local = true"></Button>
                     </div>
                 </Form-item>-->

                <Form-item label="设备名称" prop="equipmentName">
                    <Input v-model="orderWorkForm.equipmentName" @on-blur="orderWorkForm.equipmentName = toValidate(orderWorkForm.equipmentName)" style="width: 160px;" placeholder=""></Input>
                </Form-item>
                <!--<Form-item label="工单类型" prop="status">
                    <Select style="width: 160px;" v-model="orderWorkForm.planType">
                        <Option v-for="item in planTypeArr" :value="item.code" :key="item.code">{{ item.desc }}</Option>
                    </Select>
                </Form-item>-->
                <!--<Form-item label="执行状态">
                    <Select style="width: 160px;" v-model="orderWorkForm.planStatus">
                        <Option v-for="status in planStatusArr" :value="status.code" :key="status.code">{{ status.desc }}</Option>
                    </Select>
                </Form-item>-->
                <!--<Form-item label="计划等级" prop="playLevel">
                    <Select style="width: 160px;" v-model="orderWorkForm.playLevel">
                        <Option v-for="level in playLevelArr" :value="level.code" :key="level.code">{{ level.desc }}</Option>
                    </Select>
                </Form-item>-->
                <!--<Form-item label="准点状态" prop="scheduleStatus">
                    <Select style="width: 160px;" v-model="orderWorkForm.scheduleStatus">
                        <Option v-for="status in scheduleStatusArr" :value="status.code" :key="status.code">{{ status.desc }}</Option>
                    </Select>
                </Form-item>-->
                <Form-item label="派工人" prop="submitter">
                    <Input v-model="orderWorkForm.submitter" @on-blur="orderWorkForm.submitter = toValidate(orderWorkForm.submitter)" style="width: 160px;" placeholder=""></Input>
                </Form-item>
                <Form-item label="执行人" prop="equipmentName">
                    <Input v-model="orderWorkForm.operator" @on-blur="orderWorkForm.operator = toValidate(orderWorkForm.operator)" style="width: 160px;" placeholder=""></Input>
                </Form-item>

                <Form-item label="计划时间段" prop="planTime" v-show="orderFlag == 0">
                    <Row>
                        <Col span="11">
                        <Date-picker type="datetime" v-model="orderWorkForm.planTimeStart" placeholder="选择日期" @on-change="planCheckStart" :editable="editable" style="width: 100%;display: inline-block"></Date-picker>
                        </Col>
                        <Col span="2" style="text-align: center">~</Col>
                        <Col span="11">
                        <Date-picker type="datetime" v-model="orderWorkForm.planTimeEnd" placeholder="选择日期" @on-change="planCheckEnd" :editable="editable" style="width: 100%;display: inline-block"></Date-picker>
                        </Col>
                    </Row>
                </Form-item>
                <Form-item label="执行时间段" prop="orderDate">
                    <Row>
                        <Col span="11">
                        <Date-picker type="datetime" v-model="orderWorkForm.startTime" placeholder="选择日期" @on-change="checkStart" :editable="editable" style="width: 100%;display: inline-block"></Date-picker>
                        </Col>
                        <Col span="2" style="text-align: center">~</Col>
                        <Col span="11">
                        <Date-picker type="datetime" v-model="orderWorkForm.endTime" placeholder="选择日期" @on-change="checkEnd" :editable="editable" style="width: 100%;display: inline-block"></Date-picker>
                        </Col>
                    </Row>
                </Form-item>
            </Form>
            <div class="btn-query">
                <Button type="primary" icon="forward" size="large" disabled>导出</Button>
                <Button type="primary" icon="search" size="large" @click="get_order()" v-show="rule_search_end">查询</Button>
            </div>
        </div>
        <!--表格-->
        <div class="table-content">
            <Table class="table-edit" v-show="orderFlag == 0" stripe border :columns="columnsOrder" :data="tableData"></Table>
            <Table class="table-edit" v-show="orderFlag == 2" stripe border :columns="columnsOrderMaintain" :data="tableData"></Table>
        </div>
        <div class="page">
            <!--<Page :total="data1Total" :current="taskCurrentPage" size="small" show-elevator :page-size="size" @on-change="pageSearchInfoTask"></Page>-->
            <Page :total="partsNum" :current="tempPage" size="small" show-elevator :page-size="10" @on-change="orderChange"></Page>
        </div>
    </div>
</template>
<script>
    export default {
        data (){
            return {
                /*权限按钮*/
                rule_search:this.$rt(this.authJson.EAM.设备保养.保养工单列表页.查询),
                rule_Detail:this.$rt(this.authJson.EAM.设备保养.保养工单列表页.查看),
                rule_BLBJ:this.$rt(this.authJson.EAM.设备保养.保养工单列表页.补领备件),
                rule_HFLJ:this.$rt(this.authJson.EAM.设备保养.保养工单列表页.恢复领件),
                rule_DC:this.$rt(this.authJson.EAM.设备保养.保养工单列表页.导出),
                rule_TN:this.$rt(this.authJson.EAM.设备保养.保养工单列表页.退料),
                rule_search_main:this.$rt(this.authJson.EAM.设备保养.维修工单列表页.查询),
                rule_Detail_main:this.$rt(this.authJson.EAM.设备保养.维修工单列表页.查看),
                rule_BLBJ_main:this.$rt(this.authJson.EAM.设备保养.维修工单列表页.补领备件),
                rule_HFLJ_main:this.$rt(this.authJson.EAM.设备保养.维修工单列表页.恢复领件),
                rule_DC_main:this.$rt(this.authJson.EAM.设备保养.维修工单列表页.导出),
                rule_TN_main:this.$rt(this.authJson.EAM.设备保养.维修工单列表页.退料),
                rule_to_help:this.$rt(this.authJson.EAM.设备保养.维修工单列表页.待援助),
                rule_search_end:false,
                rule_Detail_end:false,
                rule_BLBJ_end:false,
                rule_HFLJ_end:false,
                rule_DC_end:true,
                rule_TN_end:true,


                /* *** 预加载字段 - S - **** */
                pageTitle:'',
                orderStatus:'',
                orderFlag:0,
                orderTitle:'',
                /* *** 预加载字段 - E - **** */
                /*预加载字段*/
                orderWorkForm:{
                    workOrderBillNo: '',
                    equipmentName: '',
                    planType: -1,
                    planStatus: -1,
                    playLevel: -1,
                    scheduleStatus: -1,
                    startTime: '',
                    endTime: '',
                    planTimeStart: '',
                    planTimeEnd: '',
                    billNo:'',
                    submitter:'',
                    operator:'',
                },
                editable: false,
                created: false,
                planTypeArr: this.$base_info.tEamDispatchOrderTypeEnum.filter(item =>item.code<2),
                planStatusArr: this.$base_info.executionStatusEnum,
                playLevelArr: this.$base_info.planClazz,
                scheduleStatusArr: this.$base_info.tEamOrderIntimeStatusEnum,
                tempPage:1,
                partsNum: 5,
                columnsOrder: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 70,
                        align: 'center'
                    },
                    {
                        title: '工单单据号',
                        key: 'billNo',
                        align: 'center',
                        render: (h, params) => {
                            return h('a', {
                                class: 'mar-r-5 iview_tabDis',
                                domProps:{
                                    title:params.row.billNo,
                                },
                                on: {
                                    click: () =>{
                                        if(this.rule_Detail_end){
                                            this.goViewPlan(0,params.row.orderId,params.row.executionStatus,params.row.workItemId)
                                        }
                                    }
                                }
                            }, params.row.billNo)
                        },
                    },
                    {
                        title: '来源计划名称',
                        key: 'planName',
                        align: 'center',
                        render: (h, params) => {
                            return h('p', {
                                domProps: {
                                    title: params.row.planName
                                },
                                class: 'iview_tabDis',
                            }, params.row.planName)
                        },
                    },
                    {
                        title: '设备名称',
                        key: 'equipmentName',
                        align: 'center',
                        render: (h, params) => {
                            return h('p', {
                                domProps: {
                                    title: params.row.equipmentName
                                },
                                class: 'iview_tabDis',
                            }, params.row.equipmentName)
                        },
                    },
                    {
                        title: '派工人',
                        key: 'submitter',
                        align: 'center',
                        width:100,
                        render: (h, params) => {
                            return h('p', {
                                domProps: {
                                    title: params.row.submitter
                                },
                                class: 'iview_tabDis',
                            }, params.row.submitter)
                        },
                    },
                    {
                        title: '执行人',
                        key: 'operator',
                        align: 'center',
                        width:100,
                        render: (h, params) => {
                            return h('p', {
                                domProps: {
                                    title: params.row.operator
                                },
                                class: 'iview_tabDis',
                            }, params.row.operator)
                        },
                    },
                    {
                        title: '计划时间',
                        key: 'planTime',
                        align: 'center',
                        /*render: (h, params) => {
                            return h('span', this.$fc.dateFormat(params.row.actuallyTime, "yyyy-MM-dd"));
                        }*/
                    },
                    {
                        title: '执行时间',
                        key: 'actuallyTime',
                        align: 'center',
//                        render: (h, params) => {
//                            return h('span', this.$fc.dateFormat(params.row.hitch_sure_time, "yyyy-MM-dd"));
//                        }
                    },
                    {
                        title: '累计耗时',
                        key: 'lastedInAll',
                        align: 'center'
                    },
                    {
                        title: '工单状态',
                        key: 'executionStatus',
                        align: 'center',
                        width:100,
                    },

                    {
                        title: '工单类型',
                        key: 'orderType',
                        align: 'center',
                        width:110,
                    },
                    /*{
                        title: '计划层级',
                        key: 'planLevel',
                        align: 'center'
                    },*/
//                    {
//                        title: '标准方案名称',
//                        key: 'stand_work_name',
//                        align: 'center'
//                    },
                    /*{
                        title: '设备地点',
                        key: 'equipmentLocation',
                        align: 'center',
                        render: (h, params) => {
                            return h('p', {
                                domProps: {
                                    title: params.row.equipmentLocation
                                },
                                class: 'iview_tabDis',
                            }, params.row.equipmentLocation)
                        },
                    },*/
                    /*{
                        title: '执行状态',
                        key: 'executionStatus',
                        align: 'center'
                    },*/


                    /*{
                        title: '准点状态',
                        key: 'intimeStatus',
                        align: 'center',
                        render: (h, params) => {
                            const row = params.row;
                            const color = row.intimeStatus === '按时完成' ? 'green' : row.intimeStatus === '超时完成' ? 'yellow' : row.intimeStatus === '严重超时' ? 'red' : null;
                            const text = row.intimeStatus === '按时完成' ? '按时完成' : row.intimeStatus === '超时完成' ? '超时完成' : row.intimeStatus === '严重超时' ? '严重超时' : '';
                            return h('Tag', {
                                props: {
//                                    type: 'dot',
//                                    type: row.intimeStatus === '按时完成' ? 'dot': row.intimeStatus === '超时完成' ? 'dot': row.intimeStatus === '严重超时' ? 'dot' : null,
                                    type: color == null ? null : 'dot',
                                    color: color
                                }
                            }, text);
                        }
                    },*/
                    {
                        title: '操作',
                        key: 'action',
                        align: 'center',
                        width:100,
                        render: (h, params) => {
                            let btnGroup = [];
                            /*if(this.rule_Detail){
                                btnGroup.push(
                                    h('a', {
                                        class: 'mar-r-5',
                                        on: {
                                            click: () =>{
                                                this.goViewPlan(0,params.row.orderId,params.row.executionStatus,params.row.workItemId)
                                            }
                                        }
                                    }, '查看'),
                                );
                            }*/
                            if((this.orderStatus == 8 || params.row.executionStatus == "MES执行中") && this.rule_BLBJ_end){
                                btnGroup.push(
                                    h('a', {
                                        class: 'mar-r-5',
                                        on: {
                                            click: () =>{
//                                                this.$router.push({path: 'orderSpareParts',query: { "orderId": params.row.orderId,workItemId:params.row.workItemId,addflag:0,orderFlag:0,}});
                                                this.goViewSL(params.row.orderId,params.row.workItemId,0,0)
                                            }
                                        }
                                    }, '补领备件'),
                                );
                            }
                            if( (this.orderStatus == 6 || params.row.executionStatus == "缺件暂停") && this.rule_HFLJ_end){
                                btnGroup.push(
                                    h('a', {
                                        class: 'mar-r-5',
                                        on: {
                                            click: () =>{
//                                                this.$router.push({path: 'orderSpareParts',query: { "orderId": params.row.orderId,workItemId:params.row.workItemId,addflag:1,orderFlag:0,}});
                                                this.goViewSL(params.row.orderId,params.row.workItemId,1,0)
                                            }
                                        }
                                    }, '恢复领件'),
                                );
                            }
                            if((this.orderStatus == 11 || params.row.executionStatus == "已完成") && this.rule_DC_end){
                                btnGroup.push(
                                    h('a', {
                                        class: 'mar-r-5',
                                        on: {
                                            click: () =>{
//                                                this.$router.push({path: 'orderSpareParts',query: { "orderId": params.row.orderId,workItemId:params.row.workItemId,addflag:1,orderFlag:0,}});
                                                this.exportFiles(params.row.orderId)
                                            }
                                        }
                                    }, '导出'),
                                );
                            }
                            if((this.orderStatus == 11 || params.row.executionStatus == "已完成")&&this.rule_TN_end){
                                btnGroup.push(
                                    h('a', {
                                        class: 'mar-r-5',
                                        on: {
                                            click: () => {
                                                this.$router.push({path: 'maintenanceReturn',query: { "orderId": params.row.orderId,'billNo':params.row.billNo,title:this.pageTitle ,type:this.orderStatus,orderFlag:0,}});
                                            }
                                        }
                                    }, '退料'),
                                );
                            }
                            return h('div',btnGroup );
                        },
                    },
                ],
                columnsOrderMaintain: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 70,
                        align: 'center'
                    },
                    {
                        title: '工单单据号',
                        key: 'billNo',
                        align: 'center',
                        render: (h, params) => {
                            return h('a', {
                                class: 'mar-r-5 iview_tabDis',
                                domProps:{
                                    title:params.row.billNo,
                                },
                                on: {
                                    click: () =>{
                                        if(this.orderStatus == 17||params.row.executionStatus == "待援助") {
                                            this.goToAid(params.row.orderId,params.row.workItemId)
                                        } else {
                                            this.goViewPlan(2, params.row.orderId, params.row.executionStatus, params.row.workItemId)
                                        }
                                    }
                                }
                            }, params.row.billNo)
                        },
                    },
                    {
                        title: '设备名称',
                        key: 'equipmentName',
                        align: 'center',
                        render: (h, params) => {
                            return h('p', {
                                domProps: {
                                    title: params.row.equipmentName
                                },
                                class: 'iview_tabDis',
                            }, params.row.equipmentName)
                        },
                    },
                    {
                        title: '派工人',
                        key: 'submitter',
                        align: 'center',
                        width:100,
                        render: (h, params) => {
                            return h('p', {
                                domProps: {
                                    title: params.row.submitter
                                },
                                class: 'iview_tabDis',
                            }, params.row.submitter)
                        },
                    },
                    {
                        title: '执行人',
                        key: 'operator',
                        align: 'center',
                        width:100,
                        render: (h, params) => {
                            return h('p', {
                                domProps: {
                                    title: params.row.operator
                                },
                                class: 'iview_tabDis',
                            }, params.row.operator)
                        },
                    },
                    /* {
                         title: '计划时间',
                         key: 'planTime',
                         align: 'center'
                     },*/
                    {
                        title: '执行时间',
                        key: 'actuallyTime',
                        align: 'center',
                        /* render: (h, params) => {
                             return h('span', this.$fc.dateFormat(params.row.actuallyTime, "yyyy-MM-dd"));
                         }*/
                    },
                    {
                        title: '累计耗时',
                        key: 'lastedInAll',
                        align: 'center'
                    },
                    {
                        title: '报工人',
                        key: 'createBy',
                        align: 'center',
                        width:100,
                    },
                    {
                        title: '工单状态',
                        key: 'executionStatus',
                        align: 'center',
                        width:100,
                    },
                    {
                        title: '工单类型',
                        key: 'orderType',
                        align: 'center',
                        width:110,
                    },
                    {
                        title: '操作',
                        key: 'action',
                        align: 'center',
                        width:100,
                        render: (h, params) => {
                            let btnGroup = [];
                            if((this.orderStatus == 14 || this.orderStatus == 19 || this.orderStatus == 20 || this.orderStatus == 11 || params.row.executionStatus == "已完成" || params.row.executionStatus == "未修复"|| params.row.executionStatus == "已修复" || params.row.executionStatus == "已撤单" )&&this.rule_TN_end){
                                btnGroup.push(
                                    h('a', {
                                        class: 'mar-r-5',
                                        on: {
                                            click: () =>{
                                                this.$router.push({path: 'maintenanceReturn',query: { "orderId": params.row.orderId,'billNo':params.row.billNo,title:this.pageTitle ,type:this.orderStatus,orderFlag:2,}});
                                            }
                                        }
                                    }, '退料'),
                                );
                            }
                            if((this.orderStatus == 8 || params.row.executionStatus == "MES执行中")&& this.rule_BLBJ_end){
                                btnGroup.push(
                                    h('a', {
                                        class: 'mar-r-5',
                                        on: {
                                            click: () =>{
                                                this.goViewSL(params.row.orderId,params.row.workItemId,0,2)
                                            }
                                        }
                                    }, '补领备件'),
                                );
                            }
                            if( (this.orderStatus == 6 || params.row.executionStatus == "缺件暂停") && this.rule_HFLJ_end){
                                btnGroup.push(
                                    h('a', {
                                        class: 'mar-r-5',
                                        on: {
                                            click: () =>{
                                                this.goViewSL(params.row.orderId,params.row.workItemId,1,2)
                                            }
                                        }
                                    }, '恢复领件'),
                                );
                            }
                            if((this.orderStatus == 11 || params.row.executionStatus == "已完成")&& this.rule_DC_end){
                                btnGroup.push(
                                    h('a', {
                                        class: 'mar-r-5',
                                        on: {
                                            click: () =>{
                                                this.exportFilesMain(params.row.orderId)
                                            }
                                        }
                                    }, '导出'),
                                );
                            }
                            /*待援助*/
                            if(this.rule_to_help && (this.orderStatus == 17 || params.row.executionStatus == "待援助")){
                                btnGroup.push(
                                    h('a', {
                                        class: 'mar-r-5',
                                        on: {
                                            click: () =>{
                                                this.goToAid(params.row.orderId,params.row.workItemId)
                                            }
                                        }
                                    }, '待援助'),
                                );
                            }
                            return h('div',btnGroup );
                        },
                    },
                ],
                tableData: [],
                tableDataAry: [],
            }
        },
        mounted(){
            this.orderStatus = this.$route.query.type;
            /*维修  （2） 和保养 （0）区分 */
            this.orderFlag = this.$route.query.orderFlag;
            if(this.orderFlag == 2){
                this.orderTitle = "维修";
                this.rule_search_end = this.rule_search_main
                this.rule_Detail_end = this.rule_Detail_main;
                this.rule_BLBJ_end = this.rule_BLBJ_main;
                this.rule_HFLJ_end = this.rule_HFLJ_main;
                this.rule_DC_end = this.rule_DC_main;
                this.rule_TN_end = this.rule_TN_main;
                this.getPageTitle(this.$route.query.type)
                if(this.orderStatus == 14){
                    this.pageTitle = "已撤单"
                }
            }else if(this.orderFlag == 0){
                this.orderTitle = "保养";
                this.rule_search_end = this.rule_search;
                this.rule_Detail_end = this.rule_Detail;
                this.rule_BLBJ_end = this.rule_BLBJ;
                this.rule_HFLJ_end = this.rule_HFLJ;
                this.rule_DC_end = this.rule_DC;
                this.rule_TN_end = this.rule_TN;
                this.getPageTitle(this.$route.query.type)
            }
            this.get_order()
        },
        activated: function () {
            this.created && this.get_order();
            this.created = true;
        },
        watch: {
            '$route' (to, from) {
                this.orderStatus = to.query.type;
                this.getPageTitle(to.query.type)
                /*维修  （2） 和保养 （0）区分 */
                this.orderFlag = this.$route.query.orderFlag;
                if(this.orderFlag == 2){
                    this.orderTitle = "维修";
                    this.rule_search_end = this.rule_search_main
                    this.rule_Detail_end = this.rule_Detail_main;
                    this.rule_BLBJ_end = this.rule_BLBJ_main;
                    this.rule_DC_end = this.rule_DC_main;
                    if(this.orderStatus == 14){
                        this.pageTitle = "已撤单"
                    }
                }else if(this.orderFlag == 0){
                    this.orderTitle = "保养";
                    this.rule_search_end = this.rule_search;
                    this.rule_Detail_end = this.rule_Detail;
                    this.rule_BLBJ_end = this.rule_BLBJ;
                    this.rule_DC_end = this.rule_DC;
                }
                to.path == "/maintenanceOrder" ? this.get_order():"";
            }
        },
        methods: {
            getPageTitle(type){
                type = parseInt(type)
                this.pageTitle = this.$base_info.getDescByCode(type,this.$base_info.tEamApproveDispatchOrderStatusEnum)
            },
            /*******  导出文件 S *******/
            /*保养工单导出*/
            exportFiles(formId){
                this.$axios.get('/tEamExport/EquipmentMaintenanceScheduleFormArchivingExport', {
                    params: {
                        formId: formId
                    }
                }).then((res) => {
                    let respone = res.data.response;
                    if (respone.code  === 1) {
                        window.location.href = "../static/doc/" + respone.data.fileName;
                        this.$Message.success('导出成功！');
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
            /*维修工单导出*/
            exportFilesMain(formId){
                this.$axios.get('/tEamExport/EquipmentRepairFormArchivingExport', {
                    params: {
                        formId: formId
                    }
                }).then((res) => {
                    let respone = res.data.response;
                    if (respone.code  === 1) {
                        window.location.href = "../static/doc/" + respone.data.fileName;
                        this.$Message.success('导出成功！');
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
            /*******  导出文件 E *******/

            goViewSL(orderId,workItemId,addflag,orderFlag){
                this.$router.push({path: 'orderSpareParts',query: { "orderId": orderId,workItemId:workItemId,addflag:addflag,orderFlag:orderFlag, title:this.pageTitle ,type:this.orderStatus,}});
            },
            toValidate(msg){
                var str = /[=+%!<>"'/_,()\\]/
                if(str.test(msg)){
                    this.$Message.warning('输入格式错误')
                    msg = msg.replace(/\'/g,"").replace(/\"/g,"").replace(/\+/g,"").replace(/\=/g,"").replace(/\%/g,"").replace(/\!/g,"").replace(/\</g,"").replace(/\>/g,"").replace(/\//g,"").replace(/\_/g,"").replace(/\,/g,"").replace(/\(/g,"").replace(/\)/g,"").replace(/\\/g,"");
                }
                return msg
            },
            orderChange(current){
                this.tempPage = current;
                let prevPage= (current-1)*10;
                let nextPage= (current)*10;
                this.tableData = this.tableDataAry.slice(prevPage,nextPage);
            },
            //获取备件列表:
            get_order(){
                let vt = this;
                let searchList = {
                    page: vt.tempPage,
                    pageSize: 10,
                    /*维修工单*/
                    billNo:vt.orderWorkForm.billNo,
                    submitter:vt.orderWorkForm.submitter,
                    operator:vt.orderWorkForm.operator,
                    /*维修工单*/
                    planName: vt.orderWorkForm.workOrderBillNo,
                    equipmentName: vt.orderWorkForm.equipmentName,
                    billType: parseInt(vt.orderFlag),
                    executionStatus: vt.orderStatus,
                    planLevel: vt.orderWorkForm.playLevel == -1 ? "" : vt.orderWorkForm.playLevel,
                    intimeStatus: vt.orderWorkForm.scheduleStatus == -1 ? "" : vt.orderWorkForm.scheduleStatus,
                    actuallyTimeStart: vt.orderWorkForm.startTime,
                    actuallyTimeEnd: vt.orderWorkForm.endTime,
                    planTimeStart: vt.orderWorkForm.planTimeStart,
                    planTimeEnd: vt.orderWorkForm.planTimeEnd
                };
//                console.log('/eamDo/list searchList+ '+ JSON.stringify(searchList) );
                this.$axios.post('/eamDo/list',searchList).then((res) => {
//                    console.log('/eamDo/list + '+ JSON.stringify(res) );
                    let result = res.data.response;
                    if (result.code != 1) {
                        vt.$Message.error(result.msg);
                    }
                    else {
                        this.partsNum = result.data.rows.length;
                        this.tableDataAry = [...result.data.rows];
                        this.tempPage = 1;
                        this.tableData = result.data.rows.slice(0,10);

                    }
                }).catch((err) => {
//                    console.log(err);
                });
            },
            /*跳到待援助详情页*/
            goToAid(id,id2) {
                this.$router.push({path: 'maintToAid', query: {orderId: id,title: this.pageTitle,listStatus: this.orderStatus, workItemId: id2}})
            },
            //开始日期应小于结束日期
            checkStart(time){
                var stime = time;
                if (this.orderWorkForm.endTime != '') {
                    if (stime > this.orderWorkForm.endTime) {
                        this.notFitDataTip = '开始时间应在结束时间之前';
                        this.$Message.error(this.notFitDataTip);
                    }
                    else {
                        this.notFitDataTip = ""
                    };
                };
                this.orderWorkForm.startTime = stime
            },
            //结束日期应大于开始日期
            checkEnd(time){
                var etime = time;
                if (this.orderWorkForm.startTime != '') {
                    if (etime < this.orderWorkForm.startTime) {
                        this.notFitDataTip = '结束时间应在开始时间之后';
                        this.$Message.error(this.notFitDataTip);
                    }
                    else {
                        this.notFitDataTip = ""
                    }
                };
                this.orderWorkForm.endTime = etime;
//                if (this.time_start!= '') {
//                    if (this.time_end<= this.time_start) {
//                        this.$Message.error('结束时间应大于开始时间');
//                    }
//                }
            },
            //开始日期应小于结束日期
            planCheckStart(time){
                var stime = time;
                if (this.orderWorkForm.planTimeEnd != '') {
                    if (stime > this.orderWorkForm.planTimeEnd) {
                        this.notFitDataTip = '开始时间应在结束时间之前';
                        this.$Message.error(this.notFitDataTip);
                    }
                    else {
                        this.notFitDataTip = ""
                    };
                };
                this.orderWorkForm.planTimeStart = stime
            },
            //结束日期应大于开始日期
            planCheckEnd(time){
                var etime = time;
                if (this.orderWorkForm.planTimeStart != '') {
                    if (etime < this.orderWorkForm.planTimeStart) {
                        this.notFitDataTip = '结束时间应在开始时间之后';
                        this.$Message.error(this.notFitDataTip);
                    }
                    else {
                        this.notFitDataTip = ""
                    }
                };
                this.orderWorkForm.planTimeEnd = etime;

            },

            // 计划详情
            goViewPlan(orderFlag, orderId, executionStatus,workItemId) {
                /*流程页面
                workOrder      保养工单执行流程--派工【设备管理员】
                orderReceipt   保养工单执行流程--接单【机修工】
                orderSpareParts   工单备件领用
                orderTerminal   工单下发页面
                流程页面*/
                if(orderFlag == 0){
                    /*保养页面*/
                    this.$router.push({path: '/orderReceipt',query: {"orderId": orderId,"status": executionStatus,title:this.pageTitle ,listStatus:this.orderStatus,workItemId:workItemId}});
                }else if(orderFlag == 2) {
                    /*维修页面*/
                    this.$router.push({path: '/maintenanceMain', query: {"orderId": orderId, "status": executionStatus, title: this.pageTitle, listStatus: this.orderStatus, workItemId: workItemId}});
                }
            },

        },
    }
</script>
<style>
    /*tr .demo-table-success-cell, .ivu-table-row-hover .demo-table-success-cell {*/
    /*background-color: #19be6b;*/
    /*}*/
    /*tr .demo-table-warning-cell, .ivu-table-row-hover .demo-table-warning-cell {*/
    /*background-color: #ff9900!important;*/
    /*}*/
    /*tr .demo-table-error-cell, .ivu-table-row-hover .demo-table-error-cell {*/
    /*background-color: #ed3f14;*/
    /*}*/
</style>
