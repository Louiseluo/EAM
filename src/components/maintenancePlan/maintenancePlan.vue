<template>
    <div class="basic fault-content">
        <Spin fix v-show="load_fix">
            <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
            <div>加载中，请稍后...</div>
        </Spin>
        <!--模块名称-->
        <div class="title">
            <span>{{pageLevel}}管理--{{pageTitle}}</span>
        </div>
        <!--表单-->
        <div class="form-content">
            <Form ref="planWorkForm" :model="planWorkForm" label-position="right" inline :label-width="100">
                <Form-item label="计划名称" prop="name">
                    <Input v-model="planWorkForm.name" @on-blur="planWorkForm.name = toValidate(planWorkForm.name)" style="width: 160px;" placeholder=""></Input>
                </Form-item>
                <Form-item label="计划单号" prop="billNo">
                    <Input v-model="planWorkForm.billNo" @on-blur="planWorkForm.billNo = toValidate(planWorkForm.billNo)" style="width: 160px;" placeholder=""></Input>
                </Form-item>
                <Form-item v-if="this.pageLevel=='月计划'" label="上级计划" prop="parentPlanName">
                    <Input v-model="planWorkForm.parentPlanName" @on-blur="planWorkForm.parentPlanName = toValidate(planWorkForm.parentPlanName)" style="width: 160px;" placeholder=""></Input>
                </Form-item>
                <Form-item v-if="this.pageLevel=='年计划'" label="有效期限" prop="effectivePeriod">
                    <Select v-model="planWorkForm.effectivePeriod" style="width: 160px;">
                        <Option v-for="type in newEffectivePeriodArr" :value="type.code" :key="type.code">{{ type.desc }}</Option>
                    </Select>
                </Form-item>
                <Form-item label="下发时间段" prop="planDate">
                    <Row>
                        <Col span="11">
                        <Date-picker type="date" v-model="planWorkForm.startTime" @on-change="changeStartTime" placeholder="选择日期" style="display: inline-block" ></Date-picker>
                        </Col>
                        <Col span="2" style="text-align: center">
                        ~
                        </Col>
                        <Col span="11">
                        <Date-picker type="date" v-model="planWorkForm.endTime" @on-change="changeEndTime" placeholder="选择日期" style="display: inline-block"></Date-picker>
                        </Col>
                    </Row>
                </Form-item>
            </Form>
            <!--查询按钮-->
            <div class="btn-query">
                <Button v-if="if_query" type="primary" icon="search" size="large" @click="searchAuditList">查询</Button>
                <router-link v-if="if_add&&plan=='year'" :to="{path: '/planAdd', query: {editFlag:2}}">
                    <Button type="primary" icon="plus" size="large">新建</Button>
                </router-link>

            </div>
        </div>
        <!--表格-->
        <div class="table-content">
            <Button v-if="if_select_all" @click="handleSelectAll(true)">全选</Button>
            <Button v-if="if_select_rever" @click="handleSelectAll(false)">反选</Button>
            <div class="f_r" style="margin-bottom:10px;">
                <Button v-if="if_clone" size="large" @click="openCloneMod">批克隆</Button>
                <Button v-if="if_audited" :loading="agree_loading" @click="planApprove">审核通过</Button>
            </div>
            <div style="clear: both;">
                <Table v-if="this.pageLevel=='年计划'" class="table-edit mar-t-15" stripe border ref="selection" @on-selection-change="selectAllChange" :columns="columnsAudit" :data="dataAudit"></Table>
                <Table v-if="this.pageLevel=='月计划'" class="table-edit mar-t-15" stripe border ref="selection" @on-selection-change="selectAllChange2" :columns="columnsAudit2" :data="dataAudit2"></Table>
            </div>
        </div>
        <div class="page">
            <Page :total="auditTotal" :current="planWorkForm.page" size="small" show-elevator :page-size="planWorkForm.pageSize" @on-change="pageSearchInfo"></Page>
        </div>
        <Modal v-model="clone_mod" title="批量克隆">
            <Form ref="cloneForm" :model="cloneForm" :rules="ruleValidate" label-position="right" inline :label-width="130">
                <Form-item label="计划年份" prop="clonePlanTime">
                    <DatePicker :options="yearOptions" v-model="cloneForm.clonePlanTime" type="year" @on-change="changePlanTime" placeholder="选择年份" style="width: 160px"></DatePicker>
                </Form-item>
                <Form-item label="克隆计划名称前缀">
                    <Input v-model="cloneForm.preName" style="width: 160px;" placeholder=""></Input>
                </Form-item>
                <Form-item label="克隆计划名称后缀">
                    <Input v-model="cloneForm.sufName" style="width: 160px;" placeholder=""> </Input>
                </Form-item>
            </Form>
            <div slot="footer">
                <Button type="primary" :loading="modal_loading" @click="toSelect_planYear('cloneForm')">确定</Button>
            </div>
        </Modal>
        <Modal v-model="equName_mod" title="设备名称" @on-ok="toSelect_equName">
            <Tree :data="baseData" show-checkbox :multiple="false" :show-checkbox="false" @on-select-change="left_personSelected" class="max-h-300"></Tree>
        </Modal>
        <Modal v-model="modalE" width="360">
            <p slot="header" style="color: #ff6a6a; text-align: center;">
                <Icon type="information-circled"></Icon>
                <span>删除确认</span>
            </p>
            <div style="text-align: center;">
                <p>是否继续删除？</p>
            </div>
            <div slot="footer">
                <Button type="error" size="large" long :loading="close_loading" @click="delPlan">删除</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
    export default {
        data (){
            return {
                created: false,
                //路由信息
                pageLevel: '',      //页面层级
                pageTitle: '',      //页面标题
                pageStatus: '',     //页面状态
                pageType: -1,     //页面状态
                plan: '',
                /*权限校验 start*/
                if_add: false,      //新建
                if_query: false,      //查询
                if_detail: false,      //查看
                if_delete: false,      //删除
                if_edit: false,      //编辑
                if_audited: false,      //审核通过
                if_select_all: false,      //全选
                if_select_rever: false,      //反选
                if_export: false, //导出
                if_clone: false, //克隆
                /*权限校验 end*/
                toLable:'',
                tabName:'planList',
                planList:'',
                toEdit:true,
                handleDate: '',
                //计划管理
                workForm: {
                    name: '',
                    planTypeArr: this.$base_info.planType,
                    type: this.$base_info.planType[0].code,
                    planStatusArr: this.$base_info.planStatus,
                    status: this.$base_info.planStatus[0].code,
                    equipmentName: '',
                    equipmentId: '',
                    equ_name_obj: '',
                    cycleArr: this.$base_info.tEamPlanLevelEnum,
                    level: this.$base_info.tEamPlanLevelEnum[0].code,
                    planLevelArr: this.$base_info.planClazz,
                    startTime: '',
                    endTime: '',
                    year: new Date().getFullYear().toString(),
                    month: '',
                    page: 1,
                    pageSize: 10,
                },
                taskCurrentPage: 1,
                equName_mod: false,
                modalE: false,
                close_loading: false,
                modalE_loading: false,
                equipment_code: false,

                currentPage: 1,
                editable: false,

                baseData: [],
                tpmTaskId: '',
                load_fix: false,
                effectivePeriodArr: [],
                planWorkForm: {
                    effectivePeriod: -1,
                    page: 1,
                    pageSize: 10,
                    name: '', //计划名称
                    billNo: '', //计划单号
                    equipmentName: '',
                    parentPlanName: '', //上级计划
                    level: this.$base_info.tEamPlanLevelEnum[0].code,
                    cycleArr: this.$base_info.tEamPlanLevelEnum,
                    auditStatus:this.$base_info.planStatus[0].code,
//                    auditStatusArr:this.$base_info.planStatus,
                    auditStatusArr:this.$base_info.tEamApprovePlanStatusEnum,
                    scheduleType:this.$base_info.plancheduleType[0].code,
                    scheduleTypeArr:this.$base_info.plancheduleType,

                    startTime: '',
                    endTime: '',
                },

                data1: [],
                data1Total: 0,
                auditTotal: 0,
                /*审核管理*/
                //年计划
                columnsAudit:[
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center',
                    },
                    {
                        title: '序号',
                        type: 'index',
                        width: 70,
                        align: 'center'
                    },
                    {
                        title: '计划单号',
                        key: 'billNo',
                        align: 'center',
                        render: (h, params) => {
                            return h('p',{
                                domProps: {
                                    title:params.row.billNo
                                },
                                class: 'iview_tabDis',
                            }, params.row.billNo);
                        }
                    },
                    {
                        title: '计划名称',
                        key: 'name',
                        align: 'center',
                        render: (h, params) => {
                            return h('p',{
                                domProps: {
                                    title:params.row.name
                                },
                                class: 'iview_tabDis',
                            }, params.row.name);
                        }
                    },
                    {
                        title: '计划年份',
                        key: 'planYear',
                        align: 'center'
                    },
                    {
                        title: '计划类型',
                        key: 'type',
                        align: 'center'
                    },
                    {
                        title: '计划层级',
                        key: 'level',
                        align: 'center',
                        render: (h, params) => {
                            return h('p',{
                                domProps: {
                                    title:params.row.level
                                },
                            }, params.row.level);
                        }
                    },
                    {
                        title: '调度类型',
                        key: 'scheduleType',
                        align: 'center'
                    },
                    {
                        title: '有效期限',
                        key: 'effectivePeriod',
                        align: 'center'
                    },
                    {
                        title: '执行时间',
                        key: 'planTime',
                        align: 'center',
                        render: (h, params) => {
                            return h('p',{
                                domProps: {
                                    title:params.row.planTime
                                },
                                class: 'iview_tabDis',
                            }, params.row.planTime);
                        }
                    },
                    {
                        title: '计划状态',
                        key: 'status',
                        align: 'center'
                    },
                    {
                        title: '下发时间',
                        key: 'dispatchTime',
                        align: 'center',
                        render: (h, params) => {
                            return h('p',{
                                domProps: {
                                    title:params.row.dispatchTime
                                },
                                class: 'iview_tabDis',
                            }, params.row.dispatchTime);
                        }
                    },
                    {
                        title: '操作',
                        key: 'action',
                        align: 'center',
                        render: (h, params) => {
                            let btns = [];
                            if(this.if_detail) {
                                btns.push(
                                    h('a', {
                                        class: 'mar-r-5',
                                        on: {
                                            click: () => {
                                                this.goViewAuditPlan(params.row.status,params.row.billNo,params.row.planId,0,params.row.workItemId,params.row.samePerson,params.row.level,params.row.clone);
                                            }
                                        }
                                    }, '查看'),

                                );
                            }
                            if (this.if_delete&&params.row.status == '已制单') {
                                btns.push(
                                    h('a', {
                                        class: 'mar-r-5',
                                        on: {
                                            click: () => {
                                                this.deletePlan(params.row.planId,params.row.status,params.row.workItemId,params.row.samePerson);
                                            }
                                        }
                                    }, '删除'),
                                )
                            }
                            if((this.if_edit&&params.row.status == '已制单')||(this.if_edit&&params.row.status == '已驳回')) {
                                btns.push(
                                    h('a', {
                                        class: 'mar-r-5',
                                        on: {
                                            click: () => {
                                                this.goViewAuditPlan(params.row.status,params.row.billNo,params.row.planId,1,params.row.workItemId,params.row.samePerson,params.row.level,params.row.clone);
                                            }
                                        }
                                    }, '编辑'),
                                );
                            }
                            if(this.if_export && (this.pageLevel=='年计划') && (params.row.status == '已生效')) {
                                btns.push(
                                    h('a', {
                                        class: 'mar-r-5',
                                        on: {
                                            click: () => {
                                                this.exportPlan(params.row.planId);
                                            }
                                        }
                                    }, '导出'),
                                );
                            }

                            return h('div', btns);
                        },
                    }
                ],
                dataAudit:[],
                //月计划
                columnsAudit2:[
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center',
                    },
                    {
                        title: '序号',
                        type: 'index',
                        width: 70,
                        align: 'center'
                    },
                    {
                        title: '计划单号',
                        key: 'billNo',
                        align: 'center',
                        render: (h, params) => {
                            return h('p',{
                                domProps: {
                                    title:params.row.billNo
                                },
                                class: 'iview_tabDis',
                            }, params.row.billNo);
                        }
                    },
                    {
                        title: '计划名称',
                        key: 'name',
                        align: 'center',
                        render: (h, params) => {
                            return h('p',{
                                domProps: {
                                    title:params.row.name
                                },
                                class: 'iview_tabDis',
                            }, params.row.name);
                        }
                    },
                    {
                        title: '上级计划',
                        key: 'parentPlanName',
                        align: 'center'
                    },
                    {
                        title: '计划类型',
                        key: 'type',
                        align: 'center'
                    },
                    {
                        title: '计划层级',
                        key: 'level',
                        align: 'center',
                        render: (h, params) => {
                            return h('p',{
                                domProps: {
                                    title:params.row.level
                                },
                            }, params.row.level);
                        }
                    },
                    {
                        title: '调度类型',
                        key: 'scheduleType',
                        align: 'center'
                    },
                    {
                        title: '执行时间',
                        key: 'planTime',
                        align: 'center',
                        render: (h, params) => {
                            return h('p',{
                                domProps: {
                                    title:params.row.planTime
                                },
                                class: 'iview_tabDis',
                            }, params.row.planTime);
                        }
                    },
                    {
                        title: '计划状态',
                        key: 'status',
                        align: 'center'
                    },
                    {
                        title: '下发时间',
                        key: 'dispatchTime',
                        align: 'center',
                        render: (h, params) => {
                            return h('p',{
                                domProps: {
                                    title:params.row.dispatchTime
                                },
                                class: 'iview_tabDis',
                            }, params.row.dispatchTime);
                        }
                    },
                    {
                        title: '操作',
                        key: 'action',
                        align: 'center',
                        render: (h, params) => {
                            let btns = [];
                            if(this.if_detail) {
                                btns.push(
                                    h('a', {
                                        class: 'mar-r-5',
                                        on: {
                                            click: () => {
                                                this.goViewAuditPlan(params.row.status,params.row.billNo,params.row.planId,0,params.row.workItemId,params.row.samePerson,params.row.level,params.row.clone);
                                            }
                                        }
                                    }, '查看'),

                                );
                            }
                            if (this.if_delete&&params.row.status == '已制单') {
                                btns.push(
                                    h('a', {
                                        class: 'mar-r-5',
                                        on: {
                                            click: () => {
                                                this.deletePlan(params.row.planId,params.row.status,params.row.workItemId,params.row.samePerson);
                                            }
                                        }
                                    }, '删除'),
                                )
                            }
                            if((this.if_edit&&params.row.status == '已制单')||(this.if_edit&&params.row.status == '已驳回')) {
                                btns.push(
                                    h('a', {
                                        on: {
                                            click: () => {
                                                this.goViewAuditPlan(params.row.status,params.row.billNo,params.row.planId,1,params.row.workItemId,params.row.samePerson,params.row.level,params.row.clone);
                                            }
                                        }
                                    }, '编辑'),
                                );
                            }
                            if(this.if_export && (this.pageLevel=='年计划') && (params.row.status == '已生效')) {
                                btns.push(
                                    h('a', {
                                        on: {
                                            click: () => {
                                                this.exportPlan(params.row.planId);
                                            }
                                        }
                                    }, '导出'),
                                );
                            }
                            return h('div', btns);
                        },
                    }
                ],
                dataAudit2:[],
                /*设备放大镜start*/
                tpmsb: [],
                tpmsbTotal: 0,
                locationId: '',
                tpmsbCurrent: 1,
                dataInfo:[],
                selectAll:[],
                agree_loading: false,
                clone_mod: false,
                modal_loading: false,
                cloneForm: {
                    clonePlanTime: '',
                    preName: '',
                    sufName: ''
                },
                yearOptions: {
                    disabledDate (date) {
                        return date && date.valueOf() < Date.now();
                    }
                },
                planIdArr: [],
                planYearArr: '',
                faultError: '',
                sameYearError: '',
                ruleValidate: {
                    clonePlanTime: [{required: true, message: "计划年份不能为空"}],
                }
            }
        },
        computed: {
            newScheduleTypeArr() {
                return this.planWorkForm.scheduleTypeArr.filter(item => item.code!=1)
            },
            newEffectivePeriodArr() {
                return this.effectivePeriodArr.filter(item => item.code < 2)
            },
        },
        watch: {
            $route(to, from) {
                let plan = to.query.plan;
                if (plan == 'year') {
                    this.pageLevel = '年计划';
                    /*权限校验*/
                    this.if_add = this.$rt(this.authJson.EAM.设备保养.保养年计划列表.新建);      //新建
                    this.if_query = this.$rt(this.authJson.EAM.设备保养.保养年计划列表.查询);      //查询
                    this.if_detail = this.$rt(this.authJson.EAM.设备保养.保养年计划列表.查看);     //查看
                    this.if_delete = this.$rt(this.authJson.EAM.设备保养.保养年计划列表.删除);     //删除
                    this.if_edit = this.$rt(this.authJson.EAM.设备保养.保养年计划列表.编辑);      //编辑
                    this.if_audited = this.$rt(this.authJson.EAM.设备保养.保养年计划列表.审核通过);      //审核通过
                    this.if_select_all = this.$rt(this.authJson.EAM.设备保养.保养年计划列表.全选);      //全选
                    this.if_select_rever = this.$rt(this.authJson.EAM.设备保养.保养年计划列表.反选);      //反选
                    this.if_export = this.$rt(this.authJson.EAM.设备保养.保养年计划列表.导出);      //反选
                    this.if_clone = this.$rt(this.authJson.EAM.设备保养.保养年计划列表.批克隆);      //克隆
                } else if (plan == 'month') {
                    this.pageLevel = '月计划';
                    /*权限校验*/
                    this.if_query = this.$rt(this.authJson.EAM.设备保养.保养月计划列表页.查询);      //查询
                    this.if_detail = this.$rt(this.authJson.EAM.设备保养.保养月计划列表页.查看);     //查看
                    this.if_delete = this.$rt(this.authJson.EAM.设备保养.保养月计划列表页.删除);     //删除
                    this.if_edit = this.$rt(this.authJson.EAM.设备保养.保养月计划列表页.编辑);      //编辑
                    this.if_audited = this.$rt(this.authJson.EAM.设备保养.保养月计划列表页.审核通过);      //审核通过
                    this.if_select_all = this.$rt(this.authJson.EAM.设备保养.保养月计划列表页.全选);      //全选
                    this.if_select_rever = this.$rt(this.authJson.EAM.设备保养.保养月计划列表页.反选);      //反选
                    this.if_clone = false;
                }
                this.pageType = to.query.type;
                this.pageTitle = this.$base_info.getDescByCode(parseInt(to.query.type),this.$base_info.tEamApprovePlanStatusEnum);
                this.planWorkForm.page = 1;
                this.plan = plan;
                this.postAuditList();
            }
        },
        mounted() {
            this.effectivePeriodArr = this.$base_info.tEamPlanEffectivePeriodEnum;
            this.planWorkForm.page = 1;
//            console.log('计划层级 ==== '+JSON.stringify(this.$base_info.tEamPlanLevelEnum))
//            console.log('计划状态 ==== '+JSON.stringify(this.$base_info.tEamApprovePlanStatusEnum))
            /*路由信息处理*/
            let plan = this.$route.query.plan;
            this.plan = plan;
            this.pageType = this.$route.query.type;
            this.pageTitle = this.$base_info.getDescByCode(parseInt(this.pageType),this.$base_info.tEamApprovePlanStatusEnum);
            if (plan == 'year') {
                this.pageLevel = '年计划';
                /*权限校验*/
                this.if_add = this.$rt(this.authJson.EAM.设备保养.保养年计划列表.新建);      //新建
                this.if_query = this.$rt(this.authJson.EAM.设备保养.保养年计划列表.查询);      //查询
                this.if_detail = this.$rt(this.authJson.EAM.设备保养.保养年计划列表.查看);     //查看
                this.if_delete = this.$rt(this.authJson.EAM.设备保养.保养年计划列表.删除);     //删除
                this.if_edit = this.$rt(this.authJson.EAM.设备保养.保养年计划列表.编辑);      //编辑
                this.if_audited = this.$rt(this.authJson.EAM.设备保养.保养年计划列表.审核通过);      //审核通过
                this.if_select_all = this.$rt(this.authJson.EAM.设备保养.保养年计划列表.全选);      //全选
                this.if_select_rever = this.$rt(this.authJson.EAM.设备保养.保养年计划列表.反选);      //反选
            } else if (plan == 'month') {
                this.pageLevel = '月计划';
                /*权限校验*/
                this.if_query = this.$rt(this.authJson.EAM.设备保养.保养月计划列表页.查询);      //查询
                this.if_detail = this.$rt(this.authJson.EAM.设备保养.保养月计划列表页.查看);     //查看
                this.if_delete = this.$rt(this.authJson.EAM.设备保养.保养月计划列表页.删除);     //删除
                this.if_edit = this.$rt(this.authJson.EAM.设备保养.保养月计划列表页.编辑);      //编辑
                this.if_audited = this.$rt(this.authJson.EAM.设备保养.保养月计划列表页.审核通过);      //审核通过
                this.if_select_all = this.$rt(this.authJson.EAM.设备保养.保养月计划列表页.全选);      //全选
                this.if_select_rever = this.$rt(this.authJson.EAM.设备保养.保养月计划列表页.反选);      //反选
            }
            this.toLable = this.$route.query.toLable;
            this.getLocationTree();

            this.postAuditList();
        },
        activated: function () {
            this.created && this.postAuditList();
            this.created = true;
        },
        methods: {
            /*计划管理列表*/
            postAuditList(){
                this.$axios.post("/plan/auditManagementList",{
                    page: this.planWorkForm.page,
                    pageSize: 10,
                    name: this.planWorkForm.name,
                    billNo: this.planWorkForm.billNo,
                    level: this.$base_info.getCodeByDesc(this.pageLevel,this.$base_info.tEamPlanLevelEnum),
                    effectivePeriod: this.planWorkForm.effectivePeriod,
                    parentPlanName: this.planWorkForm.parentPlanName,
                    status: this.pageType,
                    startTime:this.planWorkForm.startTime,
                    endTime:this.planWorkForm.endTime
                }).then((res) => {
                    let ret = res.data.response;
                    if(ret.code == 1){
                        let dataInfo = ret.data.rows;
                        let tableDataInfo = [];
                        let tableDataInfo2 = [];
                        this.auditTotal = ret.data.total;
                        for (let q in dataInfo) {
                            let type = this.$base_info.getDescByCode(dataInfo[q].type,this.$base_info.planType);
                            let status = this.$base_info.getDescByCode(dataInfo[q].status==2?6:dataInfo[q].status,this.$base_info.tEamApprovePlanStatusEnum);
                            let level = this.$base_info.getDescByCode(dataInfo[q].level,this.$base_info.tEamPlanLevelEnum);
                            let scheduleType = this.$base_info.getDescByCode(dataInfo[q].scheduleType,this.$base_info.plancheduleType);
                            let effectivePeriod = this.$base_info.getDescByCode(dataInfo[q].effectivePeriod,this.$base_info.tEamPlanEffectivePeriodEnum);
                            //年计划
                            tableDataInfo.push({
                                billNo: dataInfo[q].billNo, //计划单号
                                planId: dataInfo[q].planId,//计划ID
                                name: dataInfo[q].name,//计划名称
                                scheduleType: scheduleType,//调度类型
                                level: level,//计划层级
                                type: type,//计划类型
                                effectivePeriod: effectivePeriod, //有效期限
                                clone: dataInfo[q].clone,//能否克隆
                                planYear: dataInfo[q].planYear, //计划年份
                                planTime: dataInfo[q].planTime,//执行时间
                                status: status,//计划状态
                                dispatchTime: dataInfo[q].dispatchTime,//下发时间
                                samePerson: dataInfo[q].samePerson,
                                workItemId:dataInfo[q].workItemId?dataInfo[q].workItemId:'',
                            });
                            //月计划
                            tableDataInfo2.push({
                                billNo: dataInfo[q].billNo, //计划单号
                                planId: dataInfo[q].planId,//计划ID
                                name: dataInfo[q].name,//计划名称
                                scheduleType: scheduleType,//调度类型
                                level: level,//计划层级
                                type: type,//计划类型
                                parentPlanId: dataInfo[q].parentPlanId, //上级计划id
                                parentPlanName: dataInfo[q].parentPlanName, //上级计划
                                planTime: dataInfo[q].planTime,//执行时间
                                status: status,//计划状态
                                dispatchTime: dataInfo[q].dispatchTime,//下发时间
                                samePerson: dataInfo[q].samePerson,
                                workItemId:dataInfo[q].workItemId?dataInfo[q].workItemId:'',
                            });


                            if((this.if_audited&&dataInfo[q].samePerson==1&&tableDataInfo[q].workItemId!='') ||(this.pageLevel=='年计划'&&this.if_clone&&dataInfo[q].status==6&&tableDataInfo[q].status=='已生效'&&tableDataInfo[q].clone==0) ){
                                this.$set(tableDataInfo[q],'_disabled',false);
                                this.$set(tableDataInfo2[q],'_disabled',false);
                            }
                            else{
                                this.$set(tableDataInfo[q],'_disabled',true);
                                this.$set(tableDataInfo2[q],'_disabled',true);
                            }
                        }
                        this.dataAudit = tableDataInfo;
                        this.dataAudit2 = tableDataInfo2;
                    }
                    else{
                        this.$Message.error(ret.msg);
                    }
                })
            },
            toValidate(msg){
                let str = /[=+%!<>"'/_,()\\]/;
                if(str.test(msg)){
                    this.$Message.warning('输入格式错误');
                    msg = msg.replace(/\'/g,"").replace(/\"/g,"").replace(/\+/g,"").replace(/\=/g,"").replace(/\%/g,"").replace(/\!/g,"").replace(/\</g,"").replace(/\>/g,"").replace(/\//g,"").replace(/\_/g,"").replace(/\,/g,"").replace(/\(/g,"").replace(/\)/g,"").replace(/\\/g,"");
                }
                return msg
            },
            //初始化表格
            searchInfoTask: function () {
                this.workForm.page = 1;
                this.postPlanWorkInfo(this.workForm);
            },
            //表格翻页
            pageSearchInfoTask(page) {
                this.workForm.page = page;
                this.postPlanWorkInfo(this.workForm);
            },
            /*计划执行时间----年*/
            changeCreateYear:function (sTime) {
                this.workForm.year = sTime;
            },
            /*计划执行时间----年*/
            changeCreateMonth:function (eTime) {
                this.workForm.month = eTime;
            },
            /*全选/反选*/
            handleSelectAll (status) {
                this.$refs.selection.selectAll(status);
            },
            selectAllChange(all){
                this.selectAll = all;
                this.planIdArr = [];
                for (let i in all) {
                    this.planIdArr.push(all[i].planId)
                }
                this.planYearArr = [];
                for (let i in all) {
                    this.planYearArr.push(all[i].planYear)
                }
            },
            selectAllChange2(all) {
                this.selectAll = all;
                this.planIdArr = [];
                for (let i in all) {
                    this.planIdArr.push(all[i].planId)
                }
                this.planYearArr = [];
                for (let i in all) {
                    this.planYearArr.push(all[i].planYear)
                }
            },
            //审核通过
            planApprove(){
                if(this.selectAll.length==0){
                    this.$Message.warning('请先选择操作项')
                }
                else{
                    this.agree_loading=true;
                    let data = [];
                    for(let i in this.selectAll){
                        data.push({
                            planId: this.selectAll[i].planId,
                            workItemId: this.selectAll[i].workItemId,
                            advice:"",
                        })
                    }
                    this.$axios.post('/plan/planApprove', data).then((res) => {
                        let ret = res.data.response;
                        if (ret.code != 1) {
                            this.$Message.error(ret.msg);
                            this.agree_loading=false;
                        } else {
                            this.$Message.success('审核通过！');
                            this.agree_loading=false;
                            setTimeout(() => {
                                this.postAuditList();
                            }, 1000);
                        }
                    }).catch((err) => {
                        console.log(err);
                    })
                }
            },
            searchAuditList(){
                this.planWorkForm.page = 1;
                this.postAuditList();
            },
            pageSearchInfo(page){
                this.planWorkForm.page = page;
                this.postAuditList();
            },
            queryParams: function () {
                let p = {};
                for (let o in this.planWorkForm) {
                    p[o] = this.planWorkForm[o];
                }
                return p;
            },
//          开始时间应该小于结束时间
            changeStartTime: function (date) {
                let stime = date;
                if(this.planWorkForm.endTime != ''){
                    if(stime > this.planWorkForm.endTime){
                        this.notFitDataTip = '开始时间应在结束时间之前';
                        this.$Message.error(this.notFitDataTip);
                    }
                    else{
                        this.notFitDataTip = ""
                    }
                }
                this.planWorkForm.startTime = date;
            },
//            结束时间应该大于开始时间
            changeEndTime: function (date) {
                let etime = date;
                if(this.planWorkForm.startTime != ''){
                    if(etime < this.planWorkForm.startTime){
                        this.notFitDataTip = '结束时间应在开始时间之后';
                        this.$Message.error(this.notFitDataTip);
                    }
                    else{
                        this.notFitDataTip = ""
                    }
                }
                else{
                    this.notFitDataTip = '请先选择开始时间';
                    this.$Message.error(this.notFitDataTip);
                }
                this.planWorkForm.endTime = etime;
            },
            goViewAuditPlan(status,code,id,flag,workItemId,samePerson,level,clone) {//查看审核详情
//                this.$router.push({path: '/planAddaudit', query: {"planTaskId": id,"workItemId":workItemId ,'samePerson': samePerson }});
                /**** editFlag :查看 0；编辑 1；新建 2；****/
                level = this.$base_info.getCodeByDesc(level,this.$base_info.tEamPlanLevelEnum);
                if (status=="已制单"&&clone==1) {
                    this.$router.push({path: '/planAdd', query: {code:code,"planTaskId": id,editFlag:flag,"workItemId":workItemId ,level:level,clone:clone}});
                } else {
                    this.$router.push({
                        path: '/planAdd',
                        query: {code: code, "planTaskId": id, editFlag: flag, "workItemId": workItemId, level: level}
                    });
                }
            },
            deletePlan(id,status,workItemId,samePerson){
                if(status != '已制单'&&status != '已驳回'&&status != '已失效'){
                    this.$Message.error('此状态下不可删除！');
                    return
                }
                if(workItemId==''&&samePerson==1){
                    this.$Message.error('您没有删除权限！');
                    return
                }
                this.$axios.post("/plan/deletePlan",{
                    planId:id
                }).then((res) => {
                    var ret = res.data.response;
                    if(ret.code == 1){
                        this.$Message.success('删除成功！');
                        setTimeout(() => {
                            this.postAuditList();
                        }, 500);
                    }
                    else{
                        this.$Message.error(ret.msg);
                    }
                }).catch((err) => {

                });
            },
            /************************************* 适用设备 start *********************************************************** */
            /*初始化地点得树结构*/
            getLocationTree: function () {
                let vm = this;
                this.$axios.get("/common/location/tree",{
                    params: {
                        standardSolutionVersionId: ''
                    }
                }).then((res) => {
                    let ret = res.data.response;
                    if (ret.code != 1) {
                        vm.$Message.error(ret.msg);
                    } else {
                        vm.baseData = ret.data;
                    }
                }).catch((err) => {
                    console.log(err);
                })
            },
            //设备地点树选择：
            left_personSelected (left_node){
                if (JSON.stringify(left_node) == "[]") {
                    return
                }
                if (left_node[0] && left_node[0].children) {
                    left_node[0].expand = !left_node[0].expand;
                    left_node[0].selected = false;
                }
                this.equ_name_obj = left_node[0];
            },
            //设备确定按钮：
            toSelect_equName(){
                this.workForm.equipmentName = this.equ_name_obj.title;
                this.workForm.equipmentId = this.equ_name_obj.id;
//                this.workForm.factorylocationtype = this.equ_name_obj.type;
            },
            //设备名称删除
            deleteEquName(){
                this.workForm.equipmentName = ''
                this.workForm.equipmentId = ''
            },
            /*table页面获取选中行的数据*/
            selectSb: function () {
                let tpmsbId = this.$jq("input[name='tpmsb_radio']:checked").val();
                let index = this.$fc.arrIndexOfObj("equipmentId", tpmsbId, this.tpmsb);
                if (index !== -1) {
                    this.planWorkForm.equipmenteId = tpmsbId;
                    this.planWorkForm.equipmentName = this.tpmsb[index].equipmentName;
                }
            },
            getEquipmnet: function (currentPage, locationId) {
                let vm = this;
                if (locationId == undefined) {
                    locationId = vm.locationId;
                }
                let flg = false;
                if (currentPage == undefined) {
                    currentPage = 1;
                }
                if (currentPage == 0) {
                    flg = true;
                    currentPage = 1;
                }
                this.$axios.post('tpmStandardSolution/getEquipments/n', {
                    page: currentPage,
                    bdLocationId: locationId,
                }).then((res) => {
                    if (res.data.response.code == 1) {
                        let dataRes = res.data.response.data;
                        vm.tpmsbTotal = dataRes.Total;
//                        console.log("total: " + vm.tpmsbTotal);
                        vm.tpmsb = new Array();
                        for (let o in dataRes.Rows) {
                            let obj = {};
                            obj["equipmentId"] = dataRes.Rows[o]["equipmentId"];
                            obj["equipmentCode"] = dataRes.Rows[o]["equipmentCode"];
                            obj["equipmentName"] = dataRes.Rows[o]["equipmentName"];
                            obj["radio"] = "<input type='radio' name='tpmsb_radio' value='" + dataRes.Rows[o]["equipmentId"] + "'>";
                            vm.tpmsb.push(obj);
                        }
                        if (flg) {
                            vm.tpmsbCurrent = 1;
                        }
                    }
                }).catch((err) => {
                    console.log(err);
                });
            },
            //            检查数字输入框正整数
            checkInt: function (val) {
                if (!Number.isInteger(val)) {
                    this.$Message.error('请输入整数!');
                    this.workForm.version = null;
                }
            },
            delPlan () {
                let vm = this;
                this.modalE_loading = true;
                this.modalE = false;
                this.$axios.post('tpmPlan/deletePlanTask', {'tpmTaskId': this.tpmTaskId}).then((res) => {
                    if (res.data.response.data.msg == 'success') {
                        this.load_fix = true;
                        this.load_fix_info = '操作中，请稍候......';
                        setTimeout(function () {
                            vm.searchInfoTask(0, vm.queryParams());
//                               window.location.reload();
                        }, 1000);
                    } else {
                        alert("删除失败！")
                    }
                }).catch((err) => {
                    console.log(err);
                });
            },
            /*分页*/
            changeEquipment: function (currentPage) {
                this.tpmsbCurrent = currentPage;
                this.getEquipmnet(currentPage, this.locationId);
            },
            //导出
            exportPlan(id) {
                this.$axios.get('/tEamExport/YearPlanArchivingExport', {
                    params: {
                        formId: id
                    }
                }).then((res) => {
                    let ret = res.data.response;
                    if (ret.code == 1) {
                        window.location.href = "../static/doc/" + ret.data.fileName;
                        this.$Message.success('导出成功！');
                    } else {
                        this.$Message.error(ret.msg);
                    }
                }).catch((err) => {
                    console.log(err);
                })
            },
            openCloneMod() {
                if(this.selectAll.length==0){
                    this.$Message.warning('请先选择操作项')
                } else {
                    this.clone_mod = true;
                    this.cloneForm.clonePlanTime = '';
                }
            },
            changePlanTime(date) {
                let planYearStrs = this.planYearArr.join();
                if (planYearStrs.indexOf(date) != -1) {
                    this.faultError = '所选的年计划中已存在该计划年份，不能批量克隆，请单个克隆或重新选择计划年份';
                    this.$Message.error(this.faultError);
                }
                else {
                    this.faultError = '';
                    //批量克隆时，查询所有原计划的计划年分是否有重复
                    this.$axios.post('/plan/querySourceYearPlan', {
                        sourceYearPlanIds: this.planIdArr
                    }).then((res) => {
                        if (res.data.response.code == 1) {
                            let data = [];
                            data = res.data.response.data.tEamQuerySourceYearPlanResponseItemVOs;
                                for (let i=0; i<this.planIdArr.length; i++) {
                                    for (let j=0; j<data.length; j++) {
                                        if (this.planIdArr[i] == data[j].sourceYearPlanId) {
                                            let years = data[j].sourcePlanYears;
//                                            console.log('years === '+years);
                                            if (years.join().indexOf(date) != -1) {
                                                this.sameYearError = '已存在相同计划年份的原计划';
                                                this.$Message.error(this.sameYearError);
                                            } else {
                                                this.sameYearError = '';
                                            }
                                        }
                                    }
                                }
                        } else {
                            this.$Message.error(res.data.response.data.msg);
                        }
                    }).catch((err) => {
                        console.log(err)
                    })
                }
                this.cloneForm.clonePlanTime = date;
            },
            toSelect_planYear(name) {
                this.$refs[name].validate((valid) => {
                    if (!valid) {
                        this.clone_mod = true;
                        return;
                    } else if (this.faultError != '') {
                        this.$Message.error(this.faultError);
                        return;
                    }  else if (this.sameYearError != '') {
                        this.$Message.error(this.sameYearError);
                        return;
                    }
                    this.clone_mod = false;
                    this.$axios.post('/plan/batchCloneYearPlan', {
                        clonePlanNamePrefix: this.cloneForm.preName, // 克隆计划名称前缀，可空
                        clonePlanNameSuffix: this.cloneForm.sufName, // 克隆计划名称后缀，可空
                        planYear: this.cloneForm.clonePlanTime, // 克隆计划年份
                        planYears: this.planIdArr
                    }).then((res) => {
                        if (res.data.response.code == 1) {
                            this.$Message.success('克隆成功！');
                            this.postAuditList();
                        } else {
                            this.$Message.error('批量克隆失败');
                        }
                    }).catch((err) => {
                        console.log(err)
                    })
                })
            },
        },

    }
</script>
<style>
    .demo-spin-icon-load {
        animation: ani-demo-spin 1s linear infinite;
    }
    @keyframes ani-demo-spin {
        from {
            transform: rotate(0deg);
        }
        50% {
            transform: rotate(180deg);
        }
        to {
            transform: rotate(360deg);
        }
    }
    .demo-spin-col {
        height: 100px;
        position: relative;
        border: 1px solid #eee;
    }
    .time .ivu-date-picker-header{
        display: none;
    }
    .ivu-table-cell .disColor{
        color: #bbbec4 !important;
    }
</style>
