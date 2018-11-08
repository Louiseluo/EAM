<template>
    <div class="basic fault-content">
        <Spin fix v-show="load_fix">
            <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
            <div>处理中，请稍后...</div>
            <!--<div>{{this.load_fix_info}}</div>-->
        </Spin>
        <!--模块名称-->
        <div class="title">
            <span>月计划</span>
        </div>
        <!--表单-->
        <div class="form-content">
            <Form ref="workForm" :model="planAddForm" label-position="right" inline :label-width="120">
                <div class="second-title">基本信息</div>
                <Form-item label="计划编码" prop="code">
                    <Input v-model="planAddForm.code" style="width: 160px;" placeholder="" disabled></Input>
                </Form-item>
                <Form-item label="计划名称" prop="name">
                    <Input v-model="planAddForm.name" style="width: 160px;" placeholder="" disabled></Input>
                </Form-item>
                <Form-item label="计划类型" prop="planType">
                    <Input v-model="planAddForm.planType" style="width: 160px;" placeholder="" disabled></Input>
                </Form-item>
                <Form-item  label="计划层级" prop="planLevel">
                    <Input v-model="planAddForm.planLevel" style="width: 160px;" placeholder="" disabled></Input>
                </Form-item>
                <Form-item label="计划状态" prop="planStatus">
                    <Input v-model="planAddForm.planStatus" style="width: 160px;" placeholder="" disabled></Input>
                </Form-item>
                <Form-item label="计划月份" prop="planYear">
                    <Date-picker v-model="planAddForm.planYear" :open="false" type="month" placeholder="选择日期" style="width: 160px" disabled></Date-picker>
                </Form-item>
                <Form-item label="平均耗时统计（分钟）" prop="requiredTime">
                    <Input v-model="planAddForm.requiredTime" style="width: 160px;" placeholder="" disabled></Input>
                </Form-item>
                <Form-item label="提醒提前期（天）" prop="createByName">
                    <Input v-model="planAddForm.createByName" style="width: 160px;"></Input>
                </Form-item>
                <Form-item label="下发提前期（天）" prop="createByName">
                    <Input v-model="planAddForm.createByName" style="width: 160px;"></Input>
                </Form-item>

                <div class="second-title">上级计划</div>
                <Form-item label="上级计划编码">
                    <Input v-model="planAddForm.parentCode" style="width: 160px;" disabled></Input>
                </Form-item>
                <Form-item label="上级计划名称" prop="createByName">
                    <Input v-model="planAddForm.createByName" style="width: 160px;" disabled tag="a"></Input>
                </Form-item>
                <Form-item label="上级计划层级" prop="createByName">
                    <Input v-model="planAddForm.createByName" style="width: 160px;" disabled></Input>
                </Form-item>
                <div>
                    <Form-item label="制单人" prop="createByName">
                        <Input v-model="planAddForm.createByName" style="width: 160px;" disabled></Input>
                    </Form-item>
                    <Form-item label="制单日期" prop="createAt">
                        <Date-picker v-model="planAddForm.createAt" type="date" placeholder="选择日期" style="width: 160px"
                                     disabled readonly></Date-picker>
                    </Form-item>
                    <Form-item label="审核人" prop="createByName">
                        <Input v-model="planAddForm.createByName" style="width: 160px;" disabled></Input>
                    </Form-item>

                    <Form-item label="审核日期" prop="createAt">
                        <Date-picker v-model="planAddForm.createAt" type="date" placeholder="选择日期" style="width: 160px"
                                     disabled readonly></Date-picker>
                    </Form-item>
                </div>
                <!--<Form-item label="最后修改人" prop="updateBy">
                    <Input v-model="planAddForm.updateBy" style="width: 160px;" placeholder="" disabled></Input>
                </Form-item>
                <Form-item label="最后修改时间" prop="updateAt">
                    <Date-picker v-model="planAddForm.updateAt" type="datetime" placeholder="选择日期和时间" style="width: 160px" disabled readonly></Date-picker>
                </Form-item>-->

                <!--<Form-item label="年度金额（万元）" prop="yearSum">
                    <InputNumber v-model="planAddForm.yearSum" :min="1" style="width: 160px;" disabled></InputNumber>
                </Form-item>-->
                <!--<Form-item label="标准方案编码" prop="standWorkCode">
                    <Input v-model="planAddForm.standWorkCode" style="width: 160px;" disabled></Input>
                </Form-item>
                <Form-item label="标准方案名称" prop="standWorkName">
                    <Input v-model="planAddForm.standWorkName" style="width: 160px;"></Input>
                </Form-item>
                <Form-item label="版本" prop="version">
                    <Input v-model="planAddForm.version" style="width: 160px;" disabled></Input>
                </Form-item>
                <Form-item label="是否停机" prop="needShutdown">
                    <div style="width: 160px;">
                        <i-switch v-model="planAddForm.needShutdown">
                            <span slot="open">是</span>
                            <span slot="close">否</span>
                        </i-switch>
                    </div>
                </Form-item>
                <Form-item label="预计工时（分钟）" prop="requiredTime">
                    <Input v-model="planAddForm.requiredTime" style="width: 160px;" placeholder="" disabled></Input>
                </Form-item>
                <Form-item label="制单日期" prop="createAt">
                    <Date-picker v-model="planAddForm.createAt" type="datetime" placeholder="选择日期和时间" style="width: 160px" disabled readonly></Date-picker>
                </Form-item>
                <Form-item label="计划来源" prop="planFrom">
                    <Input v-model="planAddForm.planFrom" style="width: 160px;" placeholder="" disabled></Input>
                </Form-item>

                <Form-item label="设备选择" prop="">
                    <Input v-model="planAddForm.equipment_chk" style="width: 160px;" placeholder="" disabled></Input>
                </Form-item>
                <Form-item label="备品备件" prop="">
                    <Input v-model="planAddForm.materialName" style="width: 160px;" placeholder="" disabled></Input>
                </Form-item>-->
            </Form>
        </div>
        <div class="second-title">保养设备</div>
        <div class="table-content">
            <Table class="mar-b-15 table-edit" stripe border :columns="planTimeColumns" :data="planTimeData"></Table>
            <Button type="primary" size="small" disabled="true">添加设备</Button>
        </div>
        <div class="page">
            <Page :total="numMaterial" :current="page" size="small" show-elevator :page-size="pageSize" @on-change="changePage"></Page>
        </div>
        <!--<div class="f_r mar-r-20 font-18 col-blue">总金额：<span class="col-orange">168 </span> 元</div>-->
        <div class="second-title">计划时间</div>
        <Form :model="savePlanSchedule" label-position="right" inline :label-width="135">
            <Form-item  label="调度类型" prop="circleType">
                <Select v-model="savePlanSchedule.circleType" style="width: 160px;" disabled>
                    <Option value="circlePlan">周期计划</Option>
                    <Option value="interimPlan">临时计划</Option>
                </Select>
            </Form-item>
            <Form-item label="执行日期" >
                <Date-picker v-model="savePlanSchedule.happenTime" format="dd" type="date" placeholder="选择日期" style="width: 160px" clearable @on-clear="clearHappendate" @on-ok="savePlanScheduleHappenTime"></Date-picker>
            </Form-item>
            <Form-item label="执行时间段" >
                <!--<Row>
                    <Col span="12">
                    <TimePicker format="HH:mm" placeholder="Select time" style="width: 112px"></TimePicker>
                    </Col>
                    <Col span="12">-->
                    <TimePicker format="HH:mm" type="timerange" placement="bottom-end" placeholder="Select time" style="width: 168px"></TimePicker>
                    <!--</Col>
                </Row>-->
            </Form-item>
        </Form>
        <!--操作按钮-->
        <Row class="btn-group">
            <Col class="pad-15" span="24" align="center">
            <router-link to='/maintenancePlan' class="mar-r-15">
                <Button class="btn-gary" icon="close" size="large">取消</Button>
            </router-link>
            <Button type="primary" size="large" @click="goPlandDetailEdit()">保存草稿</Button>
            <Button type="primary" size="large" @click="goPlandDetailEdit()">提交审核</Button>
            <!--<Button type="primary" icon="compose" size="large" @click="goPlandDetailEdit()">修改建议</Button>
            <Button type="primary" icon="compose" size="large" @click="goPlandDetailEdit()">免保养</Button>
            <Button type="primary" icon="compose" size="large" @click="goPlandDetailEdit()">审核通过</Button>-->
            </Col>
        </Row>
        <Modal v-model="device_code" title="适用设备">
            <Table stripe border :columns="columns_device" :data="data_device"></Table>
        </Modal>
        <Modal v-model="work_code" title="抑制作业">
            <Table stripe border :columns="columns_work2" :data="data_work2"></Table>
        </Modal>
    </div>
</template>

<script>
    export default {
        data (){
            //验证名称
            const validateAge = (rule, value, callback) => {

            };
            return {
                button_14411: this.$rt('14411'),
                button_14412: this.$rt('14412'),
                button_14424: this.$rt('14424'),
                taskId:'',
                load_fix: false,
                modal1: false,
                work_code: false,
                device_code: false,
                pageSize:5,
                planAddForm:{
                    code: "",
                    name: '',
                    planType:'',
                    planLevel:'',
                    planStatus:'',
                    requiredTime: '',
                    createByName: "",
                    createAt: '',
                    updateBy: '',
                    updateAt: '',
                    planYear: '2018-08',
                    yearSum: 163,
                    parentCode: '超链接'
                },
                savePlanSchedule: {
                    circleType: 'circlePlan',
                    happenTime: ''
                },
                /*计划周期*/

                allColumns: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 80,
                        align: 'center'
                    },
                    /*{
                     title: '设备选择',
                     key: 'device_id',
                     align: 'center',
                     render: (h, params) => {
                     return h('div', [
                     h('a', {
                     class: 'mar-r-5',
                     on: {
                     click: () => {
                     this.goViewPlan(params.row.device_id);
                     }
                     }
                     },params.row.device_id),
                     ]);
                     },
                     },*/
                    {
                        title: '设备选择',
                        key: 'device_name',
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('a', {
                                    class: 'mar-r-5',
                                    on: {
                                        click: () => {
                                            this.goViewPlan(params.row.device_name);
                                        }
                                    }
                                },params.row.device_name),
                            ]);
                        },
                    },

                    /*{
                     title: '设备名称',
                     key: 'device_name',
                     align: 'center',
                     },
                     {
                     title: '标准方案编码',
                     key: 'work_id',
                     align: 'center',
                     },*/
                    {
                        title: '标准方案选择',
                        key: 'work_name',
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('a', {
                                    class: 'mar-r-5',
                                    on: {
                                        click: () => {
                                            this.goViewPlan(params.row.work_name);
                                        }
                                    }
                                },params.row.work_name),
                            ]);
                        },
                    },
                    {
                        title: '执行岗位',
                        key: 'quarters',
                        align: 'center',
                    },
                    {
                        title: '版本',
                        key: 'version',
                        align: 'center',
                    },
                    {
                        title: '是否停机',
                        key: 'device_on',
                        align: 'center',
                        render: (h,params)=> {
                            return h('i-switch', {props:{ vModel : params.row.device_on, disabled: true,value:params.row.device_on}},[
                                h('span',{slot : 'open'} ,'是'),
                                h('span',{slot : 'close'} ,'否'),
                            ])
                        },
                    },
                    {
                        title: '预计耗时（分钟）',
                        key: 'version',
                        align: 'center',
                    },
                    {
                        title: '备件金额（元）',
                        key: 'version',
                        align: 'center',
                    },
                    {
                        title: '操作',
                        key: 'action',
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('a', {
                                    class: 'mar-r-5',
                                }, '删除'),
                            ]);
                        },
                    },
                ],

                allData: [],

                /*计划时间*/
                planTimeColumns:[
                    {
                        title: '序号',
                        type: 'index',
                        align: 'center',
                        width: 80,
                    },
                    {
                        title: '目标设备',
                        key: 'execDate',
                        align: 'center',
                    },
                    {
                        title: '设备分类',
                        key: 'duration',
                        align: 'center',
                    },
                    {
                        title: '设备类型',
                        key: 'duration',
                        align: 'center',
                    },
                    {
                        title: '设备安装地点',
                        key: 'duration',
                        align: 'center',
                    },
                    {
                        title: '标准方案',
                        key: 'duration',
                        align: 'center',
                    },
                    {
                        title: '方案版本',
                        key: 'duration',
                        align: 'center',
                    },
                    {
                        title: '是否停机',
                        key: 'duration',
                        align: 'center',
                    },
                    {
                        title: '平均耗时（分钟）',
                        key: 'duration',
                        align: 'center',
                    },
                    {
                        title: '执行岗位',
                        key: 'duration',
                        align: 'center',
                    }
                    /*{
                        title: '操作',
                        key: 'action',
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('a', {
                                    class: 'mar-r-5',
                                    on: {
                                        click: () => {
                                            this.tpmTaskId = params.row.taskId;
                                            this.delPlan(params.row.taskId);
                                        }
                                    }
                                }, '查看'),
                            ]);
                        },
                    },*/
                ],
                planTimeData:[],
                columns_device: [],
                data_device: [],
                columns_work2: [],
                data_work2: [],
            }
        },
        mounted(){
            this.initData();
            if(this.$route.query.planId) {
                this.searchPlanDetailByPlanId(this.$route.query.planId);
//                this.getPlanNoScheduleByPlanId(this.$route.query.planId);
            }else if(this.$route.query.planTaskId) {
                this.searchPlanDetail(this.$route.query.planTaskId);
//                this.getPlanNoScheduleByTaskId(this.$route.query.planTaskId);
            }else {
                this.$Message.error("页面有错误！")
            }
        },
        methods: {
            initData(indexID,currentPageNum,pageNum) {
                this.$axios.post('/eamPlan/searchPlanById',{
                    id: 'JNIVKTKRN2JSFMYPJ8HG'
                }).then((res) => {
                    let ret = res.data.response;
                    console.log(ret);
                    if (ret.code != 1){
                        this.$Message.error(ret.msg);
                    }else {
                        this.planAddForm.code = ret.data.code;//计划编码
                        this.planAddForm.name = ret.data.name;//计划名称
                        this.planAddForm.planType = ret.data.typeName;//计划类型名称
                        this.planAddForm.planLevel = ret.data.clazzName;//计划等级名称
                        this.planAddForm.planStatus = ret.data.statusName;//计划状态名称
                        this.planAddForm.requiredTime = ret.data.estimatedTime;//累计用时(分钟)
                        this.planAddForm.createByName = ret.data.createBy;//创建者名称
                        this.planAddForm.createAt = ret.data.createAt;//创建时间
                        this.planAddForm.updateBy = ret.data.updateBy;//更新者名称
                        this.planAddForm.updateAt = ret.data.updateAt;//更新时间
                        this.planAddForm.planYear = ret.data.planYear;//计划年份
                        this.planAddForm.yearSum = ret.data.estimatedMoney;// 累计金钱(万元)
                    }
                }).catch((err) => {
                    console.log(err);
                })
            },
            getTr: function (selection, row, index) {
                console.log(selection);
            },
            getPlanNoScheduleByTaskId: function (taskId) {
                let vm = this;
                this.$axios.post('/tpmPlan/getPlanNoScheduleByTaskId', {taskId: taskId}).then((res) => {
                    let res_data = res.data.response.data;
                    vm.data_date = res_data.Rows;
                    vm.data_date_total = res_data.Total;
                });
            },
            getPlanNoScheduleByPlanId: function (planId) {
                let vm = this;
                this.$axios.post('/tpmPlan/getPlanNoScheduleByPlanId', {planId: planId}).then((res) => {
                    let res_data = res.data.response.data;
                    vm.data_date = res_data.Rows;
                    vm.data_date_total = res_data.Total;
                });
            },
            searchPlanDetail(taskId) {
                let vm = this;
//                console.log("searchPlanDetail stating ......."+taskId);
                this.$axios.post('/tpmPlan/' + taskId + '/taskDetail').then((res) => {
                    if (res.data.response.code != 1) {
                        this.$Message.error("无效的计划，页面有错误！");
                        this.button_14411 = false;
                        return;
                    }
                    var result = res.data.response.data;
                    vm.initDetail(result);
                }).catch((err => {
                    console.log(err);
                }))
            },
            searchPlanDetailByPlanId(planId) {
                let vm = this;
                console.log("searchPlanDetail by planId stating ......." + planId);
                this.$axios.post('/tpmPlan/' + planId + '/detail').then((res) => {
                    if (res.data.response.code != 1) {
                        this.$Message.error("无效的计划，页面有错误！")
                        return;
                    }
                    var result = res.data.response.data;
                    vm.initDetail(result);
                }).catch((err => {
                    console.log(err);
                }))
            },
            initDetail: function (result) {
                let vm = this;
                vm.taskId = result.taskId;
                /*第一块数据------计划*/
                vm.planAddForm = result.tpmPlan;
                vm.planAddForm.teamName = result.tpmPlan.bdTeam.teamName;
                let str = result.requiredTime;
                str = str.substr(0,str.indexOf('/'))
                vm.planAddForm.requiredTime =  str; //result.requiredTime;
                vm.planAddForm.createBy = result.createBy_name;
                vm.planAddForm.updateBy = result.updateBy_name;
                if (result.tpmPlan.statusName === '制单中') {
                    vm.button_14411 = true;
                } else {
                    vm.button_14411 = false;
                }
                if (result.tpmPlan.statusName === '已失效') {
                    vm.button_14424 = false;
                } else {
                    vm.button_14424 = true;
                }
                /*第二块数据-----当前任务对应计划下所有的任务*/
                var tpmPlanTaskList = result.tpmPlanTaskList;
                vm.data_work = new Array();
                for (var i in tpmPlanTaskList) {
                    let obj = {};
                    obj["device_id"] = tpmPlanTaskList[i].bdEquipment.equipmentCode;
                    obj["device_name"] = tpmPlanTaskList[i].bdEquipment.equipmentName;
                    obj["work_id"] = tpmPlanTaskList[i].tpmStandardSolution.code;
                    obj["work_name"] = tpmPlanTaskList[i].tpmStandardSolution.name;
                    obj["version"] = tpmPlanTaskList[i].tpmStandardSolutionVersion.version;
                    obj["device_on"] = tpmPlanTaskList[i].needShutdownValue; //needShutdown; //needShutdownValue;  open close
                    vm.data_work.push(obj);
                }

                /*第三块数据<计划调度---按频率>*/
                vm.tpmPlanSchedule = result.tpmPlanSchedule;
                vm.savePlanScheduleHappenTime();
            },
            savePlanScheduleHappenTime: function () {
                let today = new Date(this.$fc.dateFormat(this.tpmPlanSchedule.happenTime));
                today.setHours(0);
                today.setMinutes(0);
                today.setSeconds(0);
                switch (this.tpmPlanSchedule.periodUnit) {
                    case 0:/*小时*/
                        today.setHours(today.getHours() + Number(this.tpmPlanSchedule.period));
                        break;
                    case 1:/*天*/
                        today.setDate(today.getDate() + Number(this.tpmPlanSchedule.period));
                        break;
                    case 2:/*周*/
                        today.setDate(today.getDate() + Number(this.tpmPlanSchedule.period) * 7);
                        break;
                    case 3:/*月*/
                        today.setMonth(today.getMonth() + Number(this.tpmPlanSchedule.period));
                        break;
                    case 4:/*季度*/
                        today.setMonth(today.getMonth() + Number(this.tpmPlanSchedule.period) * 3);
                        break;
                    case 5:/*年*/
                        today.setFullYear(today.getFullYear() + Number(this.tpmPlanSchedule.period));
                        break;
                }
                this.tpmPlanSchedule["nextHappenTime"] = today;
            },
            goPlandDetailEdit() {//计划详情编辑页
                var taskId = this.taskId;
                this.$router.push({path: '/planMonthEdit', query: {"planTaskId": taskId}});
            },
            /************************************   作废   start  ******************************************/
            deletePlan: function () {
                let vm = this;
                this.$axios.post('tpmPlan/deletePlan', {
                    tpmPlanId: vm.planAddForm.id,
                }).then((res) => {
                    let code = res.data.response.code;
                    if (code == 1) {
                        this.load_fix_info = '保存中，请稍候......';
                        this.load_fix = true;
                        setTimeout(function () {
                            vm.$router.push({path: '/maintenancePlan', query: {"date": new Date()}});
                        }, 1000);
                    } else {
                        vm.$Message.error("删除失败！");
                    }
                });
            },
            /************************************   作废   end  ******************************************/
        },
    }
</script>

<style>
    .demo-spin-icon-load{
        animation: ani-demo-spin 1s linear infinite;
    }
    @keyframes ani-demo-spin {
        from { transform: rotate(0deg);}
        50%  { transform: rotate(180deg);}
        to   { transform: rotate(360deg);}
    }
    .demo-spin-col{
        height: 100px;
        position: relative;
        border: 1px solid #eee;
    }
</style>
