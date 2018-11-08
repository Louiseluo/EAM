<template>
    <div class="basic fault-content">
        <Spin fix v-show="load_fix">
            <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
            <div>处理中，请稍后...</div>
            <!--<div>{{this.load_fix_info}}</div>-->
        </Spin>
        <!--模块名称-->
        <div class="title">
            <span>计划管理-编辑（月计划）</span>
        </div>
        <!--表单-->
        <div class="form-content">
            <Form ref="planAddForm" :model="planAddForm" label-position="right" inline :label-width="135" :rules="ruleValidate">
                <Form-item label="计划编码" prop="code">
                    <Input v-model="planAddForm.code" style="width: 160px;" placeholder="" disabled></Input>
                </Form-item>
                <Form-item label="计划名称" prop="name">
                    <Input v-model="planAddForm.name" style="width: 160px;" placeholder="" disabled></Input>
                </Form-item>
                <Form-item label="计划类型" prop="typeName">
                    <Select v-model="planAddForm.typeName" style="width: 160px;" disabled>
                        <Option v-for="item in planAddForm.planTypeArr" :value="item.code" :key="item.code">{{ item.desc }}</Option>
                    </Select>
                </Form-item>
                <Form-item label="计划等级" prop="clazzName">
                    <Select v-model="planAddForm.clazzName" style="width: 160px;" disabled>
                        <Option v-for="item in planAddForm.planLevelArr" :value="item.code" :key="item.code">{{ item.desc }}</Option>
                    </Select>
                </Form-item>
                <Form-item label="计划状态" prop="statusName">
                    <Input v-model="planAddForm.statusName" style="width: 160px;" placeholder="" value="制单" disabled></Input>
                </Form-item>
                <Form-item label="耗时累计（分钟）" prop="estimatedTime">
                    <Input v-model="planAddForm.estimatedTime" style="width: 160px;" placeholder="" disabled></Input>
                </Form-item>
                <Form-item label="制单人" prop="createBy">
                    <Input v-model="planAddForm.createBy" style="width: 160px;" placeholder="" disabled></Input>
                </Form-item>
                <Form-item label="制单日期" prop="createAt">
                    <Date-picker v-model="planAddForm.createAt" :open="false" type="date" placeholder="选择日期和时间" style="width: 160px;" disabled readonly></Date-picker>
                </Form-item>
                <Form-item label="最后修改人" prop="updateBy">
                    <Input v-model="planAddForm.updateBy" style="width: 160px;" placeholder="" disabled></Input>
                </Form-item>
                <Form-item label="最后修改日期" prop="updateAt">
                    <Date-picker v-model="planAddForm.updateAt" :open="false" type="date" placeholder="选择日期和时间" style="width: 160px" disabled readonly></Date-picker>
                </Form-item>
                <Form-item label="计划年份" prop="planYear">
                    <Date-picker v-model="planAddForm.planYear" :open="false" type="year" placeholder="选择日期" style="width: 160px" disabled></Date-picker>
                </Form-item>
                <Form-item label="年度金额（万元）" prop="estimatedMoney">
                    <InputNumber v-model="planAddForm.estimatedMoney" :min="1" style="width: 160px;" disabled></InputNumber>
                </Form-item>
            </Form>
        </div>

        <div class="second-title">计划任务</div>
        <div class="table-reset">
            <table class="table table-bordered table-center table-striped table-blue table-edit">
                <thead>
                <tr>
                    <th>序号</th>
                    <th>设备选择</th>
                    <th>标准方案选择</th>
                    <th>执行岗位</th>
                    <th>版本</th>
                    <th>是否停机</th>
                    <th>预计耗时（分钟）</th>
                    <th>备件金额（元）</th>
                    <th>操作</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(planTask,index) in savePlanTaskList">
                    <td>{{index + 1}}</td>
                    <td>
                        <div class="input-search">
                            <router-link class="display-in-b" to="/standardworkview">{{planTask.standardSolutionName}}</router-link>
                            <Button class="no-bd-c" icon="ios-search" @click="taskEquipmentIndex(index)"></Button>
                        </div>
                    </td>
                    <td>
                        <div class="input-search">
                            <router-link class="display-in-b" to="/standardworkview">{{planTask.standardSolutionName}}</router-link>
                            <Button class="no-bd-c" icon="ios-search" @click="taskSSIndex(index)"></Button>
                        </div>
                    </td>
                    <td>测试岗位</td>
                    <td>1</td>
                    <td>是</td>
                    <td>65</td>
                    <td>3500</td>
                    <td><a class="mar-r-5" size="small" @click="removeTpmPalnTasks(index)">删除</a></td>
                </tr>
                </tbody>
            </table>
        </div>
        <div class="mar-t-10 mar-b-25">
            <Button type="primary" icon="plus-round" size="small" @click="addTpmPalnTasks">添加</Button>
            <div class="f_r mar-r-20 font-18 col-blue">总金额：<span class="col-orange">168 </span> 元</div>
        </div>
        <div class="second-title">计划时间</div>
        <div class="table-content">
            <Table class="mar-b-15 table-edit" stripe border :columns="planTimeColumns" :data="planTimeData"></Table>
        </div>
        <div class="mar-t-10 mar-b-25">
            <Button type="primary" icon="plus-round" size="small" >添加</Button>
        </div>
        <!--操作按钮-->
        <Row class="btn-group">
            <Col class="pad-15" span="24" align="center">
            <Button v-show="button_14412" class="btn-gary" icon="close" size="large">取消</Button>
            <Button v-show="button_14412" type="primary" icon="checkmark" size="large">提交审核</Button>
            <Button v-show="button_14411" type="primary" icon="document-text" size="large">作废审核</Button>
            </Col>
        </Row>

        <Modal v-model="department_code" title="责任班组" @on-ok="selectDept">
            <table class="table table-bordered table-center table-striped table-blue">
                <thead>
                <tr>
                    <th>选择</th>
                    <th>序号</th>
                    <th>班组编码</th>
                    <th>班组名称</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(dept,index) in tpmDept">
                    <td>
                        <div v-html="dept.radio"></div>
                    </td>
                    <td>{{index + 1}}</td>
                    <td>{{dept.code}}</td>
                    <td>{{dept.name}}</td>
                </tr>
                </tbody>
            </table>
            <div class="mar-t-10" style="overflow: hidden">
                <div style="float: right;">
                    <Page :total="tpmDeptTotal" size="small" show-elevator :page-size="pageSize" @on-change="initTpmDept"></Page>
                </div>
            </div>
        </Modal>

        <Modal v-model="material_code" title="备品备件需求" width="600">
            <Transfer :data="equipment_chk_data" :target-keys="equipment_chk_targetKeys" :list-style="listStyle"  filterable :render-format="render" @on-change="handleChange4"></Transfer>
        </Modal>

        <Modal v-model="equipment_chk" title="设备选择" width="600">
            <Transfer :data="equipment_chk_data" :target-keys="equipment_chk_targetKeys" :list-style="listStyle"  filterable :render-format="render" @on-change="handleChange4"></Transfer>
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
                //编辑页面渲染
                thePlanTaskId: '',

                button_14411: this.$rt('14411'),
                button_14412: this.$rt('14412'),
                button_14424: this.$rt('14424'),
                taskId:'',
                load_fix: false,
                modal1: false,
                work_code: false,
                equipment_chk:false,
                material_code: false,
                department_code:false,
                pageSize:5,
                planAddForm: {
                    code: "",
                    name: '',
                    statusName: '',
                    estimatedTime: '',
                    createBy: "",
                    createAt: "",
                    updateBy: '',
                    updateAt: '',
                    planYear:'',
                    estimatedMoney:145,
                    planTypeArr: this.$base_info.planType2,
                    typeName: this.$base_info.planType2[0].code,
                    planLevelArr: this.$base_info.planClazz2,
                    clazzName: this.$base_info.planClazz2[0].code,

                    typeCode: '',// 计划类型编码
                    clazzCode: '',// 计划等级编码
                    statusCode: '',//计划状态编码

                    firstStartTime: new Date(),
                },
                /*人员需求班组放大镜 start*/
                tpmDept: [{id: "", code: "", name: "", radio: ""},],
                tpmDeptTotal: 0,
                /*人员需求班组放大镜 end*/

                /*计划周期*/

                allColumns: [
                    {
                        title: '序号',
                        type: 'index',
                        align: 'center',
                        width: 80,
                    },
                    {
                        title: '执行时间',
                        key: 'execDate',
                        align: 'center',
                    },
                    {
                        title: '班组选择',
                        key: 'teamGroup',
                        align: 'center',
                    },
                ],
                new_allData: {
                    execDate:'2017-09-16 08:30',
                    teamGroup:'机修1班',
                },
                allData:[],


                equipment_chk_data: this.getMockData(),
                equipment_chk_targetKeys: this.getTargetKeys(),
                listStyle: {
                    width: '250px',
                    height: '300px'
                },


                /*计划时间*/
                planTimeColumns:[
                    {
                        title: '序号',
                        type: 'index',
                        align: 'center',
                        width: 80,
                    },
                    {
                        title: '执行日期',
                        key: 'execDate',
                        align: 'center',
                    },
                    {
                        title: '执行时间',
                        key: 'duration',
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
                                    on: {
                                        click: () => {
                                            this.tpmTaskId = params.row.taskId;
                                            this.delPlan(params.row.taskId);
                                        }
                                    }
                                }, '查看'),
                                h('a', {
                                    class: 'mar-r-5',
                                    on: {
                                        click: () => {
                                            this.tpmTaskId = params.row.taskId;
                                            this.delPlan(params.row.taskId);
                                        }
                                    }
                                }, '删除'),
                            ]);
                        },
                    },
                ],
                planTimeData:[]


            }
        },
        mounted(){
            var id = this.$route.query.planTaskId;
            this.initPlanDetail(id);
            this.thePlanTaskId = id;
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
            //初始化表单
            initPlanDetail(planId){
                this.$axios.post('/eamPlan/searchPlanById',{
                    id: planId
                }).then((res) => {
                    let ret = res.data.response;
                    console.log(ret);
                    if (ret.code == 1) {
                        this.planAddForm.code = ret.data.code;// 计划编码
                        this.planAddForm.name= ret.data.name;//计划名称
                        this.planAddForm.typeName= ret.data.typeName;//计划类型名称
                        this.planAddForm.clazzName=ret.data.clazzName;// 计划等级名称
                        this.planAddForm.statusName=ret.data.statusName;//计划状态名称
                        this.planAddForm.estimatedTime=ret.data.estimatedTime;//累计用时(分钟)
                        this.planAddForm.createBy=ret.data.createBy;//创建者名称
                        this.planAddForm.createAt=ret.data.createAt;//创建时间
                        this.planAddForm.updateBy=ret.data.updateBy;// 更新者名称
                        this.planAddForm.updateAt=ret.data.updateAt;// 更新时间
                        this.planAddForm.planYear=ret.data.planYear;// 计划年份
                        this.planAddForm.estimatedMoney=ret.data.estimatedMoney;// 累计金钱(万元)
                        this.planAddForm.typeCode=ret.data.typeCode;// 计划类型编码
                        this.planAddForm.clazzCode=ret.data.clazzCode;// 计划等级编码
                        this.planAddForm.statusCode=ret.data.statusCode;// 计划状态编码
                        this.$Message.error(ret.msg);
                    }
                }).catch((err) => {
                    console.log(err);
                })
            },

            /*添加计划周期*/

            addPalnCycle: function () {
                this.allData.push(this.$fc.cloneKey(this.new_allData));
            },
            delPlan:function (index) {
                this.allData.splice(index, 1);
            },

            /*穿梭框*/
            getMockData () {
                let mockData = [];
                for (let i = 1; i <= 10; i++) {
                    mockData.push({
                        key: i.toString(),
                        label: '分类' + i,
                        description: '分类' + i + '的设备'
                    });
                }
                return mockData;
            },
            getTargetKeys () {
                return this.getMockData()
                    .filter(() => Math.random() * 2 > 1)
                    .map(item => item.key);
            },
            handleChange4 (targetKeys) {
                this.equipment_chk_targetKeys = targetKeys;
            },
            render (item) {
                return item.label + ' - ' + item.description;
            },
            /*穿梭框*/



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
                let str = result.estimatedTime;
                str = str.substr(0,str.indexOf('/'))
                vm.planAddForm.estimatedTime =  str; //result.requiredTime;
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
                this.$router.push({path: '/planEdit', query: {"planTaskId": taskId}});
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

            /************************************* 人员班组放大镜 start *********************************************************** */
            removeTpmStandardSolutionDeptTmp: function (index) {
                this.tpmStandardSolutionDeptTmp.splice(index, 1);
            },
            ssDepartmentIndex: function (index) {
                this.tmp.tmpPlanTaskIndex = index;
                this.department_code = true;
//                console.log("index: "+ this.tpmStandardSolutionIndex);
            },
            initTpmDept: function (page) {
//                console.log(page);
                let vm = this;
                this.$axios.get('tpmStandardSolution/bdShift', {
                    params: {
                        page: page,
//                        bdEquipmentId: bdEquipmentId
                    }
                }).then((res) => {
                    let dataRes = res.data.response.data;
                    console.log(dataRes.Rows);
                    console.log("laiba ==========" + res);
                    vm.tpmDeptTotal = dataRes.Total;
                    vm.tpmDept = new Array();
//                    console.log("lai ba "+dataRes);
                    for (let o in dataRes.Rows) {
                        if (o != "unique") {
                            let obj = {};
                            obj["id"] = dataRes.Rows[o].teamId;
                            obj["code"] = dataRes.Rows[o].teamCode;
                            obj["name"] = dataRes.Rows[o].teamName;
                            obj["radio"] = "<input type='radio' name='tpmdept_radio' value='" + dataRes.Rows[o].teamId + "'>";
                            vm.tpmDept.push(obj);
                        }
                    }
                    vm.planAddForm.shiftName = dataRes.Rows[0].teamName;
                    vm.planAddForm.teamId = dataRes.Rows[0].teamId;
//                    console.log(vm.tpmDept);
                }).catch((err) => {
                    console.log(err);
                });
            },
            selectDept: function () {
                let tpmDeptId = this.$jq("input[name='tpmdept_radio']:checked").val();
                let index = this.$fc.arrIndexOfObj("id", tpmDeptId, this.tpmDept);
                console.log(index);
                if (index !== -1) {
                    let vm = this;
                    this.$axios.get('tpmPlan/sumPlanWorkMinutes', {
                        params: {
                            teamId: tpmDeptId,
                        }
                    }).then((res) => {
                        vm.planAddForm.shiftName = vm.tpmDept[index].name;
                        vm.planAddForm.teamId = tpmDeptId;
                        /*算出班组总工时*/
                        vm.planAddForm.teamSumWorkingHours = res.data.response.data;
                    });
                }
            },
            /************************************* 人员班组放大镜 end *********************************************************** */
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
