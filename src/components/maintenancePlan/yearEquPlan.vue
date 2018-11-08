<template>
    <div class="basic fault-content">
        <!--模块名称-->
        <div class="title">
            <span>年设备维护保养计划</span>
        </div>
        <!--表单-->

        <div class="form-content">
            <Form ref="planWorkForm" :model="planWorkForm" label-position="right" inline :label-width="100">
                <Form-item label="设备名称">
                    <Input v-model="planWorkForm.equipmentName" @on-blur="planWorkForm.equipmentName = toValidate(planWorkForm.equipmentName)" style="width: 160px;" placeholder=""></Input>
                </Form-item>
                <Form-item label="设备编号">
                    <Input v-model="planWorkForm.equipmentName" @on-blur="planWorkForm.equipmentName = toValidate(planWorkForm.equipmentName)" style="width: 160px;" placeholder=""></Input>
                </Form-item>
                <Form-item label="设备型号">
                    <Input v-model="planWorkForm.equipmentName" @on-blur="planWorkForm.equipmentName = toValidate(planWorkForm.equipmentName)" style="width: 160px;" placeholder=""></Input>
                </Form-item>
                <!--<Form-item label="最近反馈日期" prop="planDate">
                    <Row>
                        <Col span="11">
                        <Date-picker type="date" v-model="planWorkForm.startTime" placeholder="选择日期" style="display: inline-block" ></Date-picker>
                        </Col>
                        <Col span="2" style="text-align: center">
                        ~</Col>
                        <Col span="11">
                        <Date-picker type="date" v-model="planWorkForm.endTime" placeholder="选择日期" style="display: inline-block"></Date-picker>
                        </Col>
                    </Row>
                </Form-item>-->
            </Form>
            <!--查询按钮-->
            <div class="btn-query">
                <Button  type="primary" icon="search" size="large" >查询</Button>
                <router-link to="planAdd">
                    <Button type="primary" icon="plus" size="large">新建</Button>
                </router-link>
            </div>
        </div>
        <!--表格-->
        <div class="table-content">
            <div class="table-content ivu-table-auto">
                <Table stripe border :columns="columnsAudit" :data="dataAudit"></Table>
            </div>
        </div>
        <div class="page">
            <Page :total="auditTotal" :current="planWorkForm.page" size="small" show-elevator :page-size="planWorkForm.pageSize"></Page>
        </div>
        <Modal v-model="equName_mod" title="设备名称" @on-ok="toSelect_equName">
            <Tree :data="baseData" show-checkbox :multiple="false" :show-checkbox="false" @on-select-change="left_personSelected" class="max-h-300"></Tree>
        </Modal>
    </div>
</template>

<script>
    import $ from 'jquery'
    export default {
        data (){
            return {
                planList:'',

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
                    grade: this.$base_info.planClazz[0].code,
                    startTime: '',
                    endTime: '',
                    year: new Date().getFullYear().toString(),
                    month: '',
                    page: 1,
                    pageSize: 10,
                },

                equName_mod: false,
                modalE: false,

                currentPage: 1,

                baseData: [],

                planWorkForm: {
                    /*审核管理*/
                    auditStatus:this.$base_info.planStatus[0].code,

                    cycleArr: this.$base_info.tEamPlanLevelEnum,
                    level: this.$base_info.tEamPlanLevelEnum[0].code,
                    auditStatusArr:this.$base_info.planStatus,
                    scheduleType:this.$base_info.plancheduleType[0].code,
                    scheduleTypeArr:this.$base_info.plancheduleType,
                    page: 1,
                    pageSize: 10,
                    approvalStatus: '',
                    name: '',
                    grade: '',
                    startTime: '',
                    endTime: '',
                    equipmentName: '',
                },

                data1: [],

                auditTotal: 0,
                /*审核管理*/
                columnsAudit:[
                    {
                        title: '序号',
                        type: 'index',
                        width: 50,
                        align: 'center'
                    },
                    {
                        title: '设备',
//                        key: 'name',
                        align: 'center',
                        children: [
                            {
                                title: '编号',
                                key: 'equCode',
                                align: 'center',
                            },
                            {
                                title: '型号',
                                key: 'equType',
                                align: 'center',
                            },
                            {
                                title: '名称',
                                key: 'equName',
                                align: 'center',
                            }
                        ]
                    },
                    {
                        title: '三级保养时间安排（月）',
                        key: 'type',
                        align: 'center',
                        children: [
                            {
                                title: '1',
                                key: 'jan',
                                width: 35,
                                align: 'center',
                                render: (h, params) => {
                                    let btns = [];
                                    btns.push(
                                        h('i', {
                                            class: 'ivu-icon ivu-icon-md-radio-button-off',
                                            nativeOn: {
                                                click: () => {
                                                    this.goViewAuditPlan();
                                                }
                                            }
                                        }),
                                    );
                                    return h('div', btns);
                                },
                            },
                            {
                                title: '2',
                                key: 'feb',
                                width: 35,
                                align: 'center',
                                render: (h, params) => {
                                    let btns = [];
                                    btns.push(
                                         h('i', {
                                             class: 'ivu-icon ivu-icon-ios-play-outline',
                                             nativeOn: {
                                                 click: () => {
                                                    this.goViewAuditPlan();
                                                 }
                                             }
                                         }),
                                     );
                                    return h('div', btns);
                                },
                            },
                            {
                                title: '3',
                                key: 'mar',
                                width: 35,
                                align: 'center',
                                render: (h, params) => {
                                    let btns = [];
                                    btns.push(
                                        h('i', {
                                            class: 'ivu-icon ivu-icon-ios-play-outline',
                                            nativeOn: {
                                                click: () => {
                                                    this.goViewAuditPlan();
                                                }
                                            }
                                        }),
                                    );
                                    return h('div', btns);
                                },
                            },
                            {
                                title: '4',
                                key: 'apr',
                                width: 35,
                                align: 'center',
                            },
                            {
                                title: '5',
                                key: 'may',
                                width: 35,
                                align: 'center',
                            },
                            {
                                title: '6',
                                key: 'jun',
                                width: 35,
                                align: 'center',
                            },
                            {
                                title: '7',
                                key: 'jul',
                                width: 35,
                                align: 'center',
                            },
                            {
                                title: '8',
                                key: 'aug',
                                width: 35,
                                align: 'center',
                            },
                            {
                                title: '9',
                                key: 'sep',
                                width: 35,
                                align: 'center',
                            },
                            {
                                title: '10',
                                key: 'oct',
                                width: 35,
                                align: 'center',
                            },
                            {
                                title: '11',
                                key: 'nov',
                                width: 35,
                                align: 'center',
                            },
                            {
                                title: '12',
                                key: 'dec',
                                width: 50,
                                align: 'center',
                            },
                        ]

                    },
                    {
                        title: '保养（负责人）',
                        key: 'responseMan',
                        align: 'center',
                    },
                    {
                        title: '备注',
                        key: 'mark',
                        align: 'center'
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
//                                            this.view();
                                                this.goViewAuditPlan(this.dataAudit[params.index].id,this.dataAudit[params.index].workItemId,params.row.samePerson);
                                            }
                                        }
                                    }, '查看'),
                                    h('a', {
                                        class: 'mar-r-5',
                                        style:{ //可删除
                                            color: (params.row.approvalStatus == '已制单'||params.row.approvalStatus == '已驳回')&&(this.dataAudit[params.index].workItemId!=''||params.row.samePerson==0) ?  "#2d8cf0": "#bbbec4",
                                            display: params.row.level!='月计划'?'inline-block':'none'
                                        },
                                        on: {
                                            click: () => {
                                                // this.goViewAuditPlan(this.dataAudit[params.index].id,this.dataAudit[params.index].workItemId,params.row.samePerson);
                                                this.deletePlan(this.dataAudit[params.index].id,params.row.approvalStatus,this.dataAudit[params.index].workItemId,params.row.samePerson);
                                            }
                                        }
                                    }, '删除'),
                                );
                            }
                            return h('div', btns)
                        },
                    },
                ],
                dataAudit:[
                    {
                        equCode: '编号',
                        equType: '型号',
                        jan: '',
                        feb: '',
                        mar: '',
                        apr: '',
                        may: '',
                        jun: '',
                        jul: '',
                        aug: '',
                        sep: '',
                        oct: '',
                        nov: '',
                        dec: '',
                    }
                ],
                /*设备放大镜start*/
                tpmsb: [],
                tpmsbTotal: 0,
                locationId: '',
                tpmsbCurrent: 1,
            }
        },
        methods: {
            toValidate(msg){
                var str = /[=+%!<>"'/_,()\\]/
                if(str.test(msg)){
                    this.$Message.warning('输入格式错误')
                    msg = msg.replace(/\'/g,"").replace(/\"/g,"").replace(/\+/g,"").replace(/\=/g,"").replace(/\%/g,"").replace(/\!/g,"").replace(/\</g,"").replace(/\>/g,"").replace(/\//g,"").replace(/\_/g,"").replace(/\,/g,"").replace(/\(/g,"").replace(/\)/g,"").replace(/\\/g,"");
                }
                return msg
            },
            //初始化表格

            goViewPlan(id,status,level,workItemId) {//查看计划详情
                this.$router.push({path: '/PlanDetail', query: {"planTaskId": id,"planStatus":status,"planLevel":level,"workItemId":workItemId}});
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
                };
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

                        console.log("total: " + vm.tpmsbTotal);

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

            /*分页*/
            changeEquipment: function (currentPage) {
                this.tpmsbCurrent = currentPage;
                this.getEquipmnet(currentPage, this.locationId);
            },
            /************************************* 适用设备 end *********************************************************** */

        },
    }
</script>


<style>
     th .ivu-table-cell{
        padding-right: 5px;
        padding-left: 5px;
        vertical-align: middle;
    }
</style>
