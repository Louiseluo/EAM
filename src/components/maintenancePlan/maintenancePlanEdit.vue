<template>
    <div class="basic fault-content">
        <Spin fix v-show="load_fix">
            <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
            <!--<div>保存中，请稍后...</div>-->
            <div>{{this.load_fix_info}}</div>
        </Spin>
        <!--模块名称-->
        <div class="title">
            <span>计划管理-编辑（年计划）</span>
        </div>
        <!--表单-->
        <div class="form-content">
            <Form ref="planAddForm" :model="planAddForm" label-position="right" inline :label-width="135" :rules="ruleValidate">
                <Form-item label="计划编码" prop="code">
                    <Input v-model="planAddForm.code" style="width: 160px;" placeholder="" disabled></Input>
                </Form-item>
                <Form-item label="计划名称" prop="name">
                    <Input v-model="planAddForm.name" style="width: 160px;" placeholder=""></Input>
                </Form-item>
                <Form-item label="计划类型" prop="typeName">
                    <Select v-model="planAddForm.typeName" style="width: 160px;">
                        <Option v-for="item in planAddForm.planTypeArr" :value="item.code" :key="item.code">{{ item.desc }}</Option>
                    </Select>
                </Form-item>
                <Form-item label="计划等级" prop="clazzName">
                    <Select v-model="planAddForm.clazzName" style="width: 160px;">
                        <Option v-for="item in planAddForm.planLevelArr" :value="item.code" :key="item.code">{{ item.desc }}</Option>
                    </Select>
                </Form-item>
                <Form-item label="计划状态" prop="statusName">
                    <Input v-model="planAddForm.statusName" style="width: 160px;" placeholder="" disabled></Input>
                </Form-item>
                <Form-item label="耗时累计（分钟）" prop="estimatedTime">
                    <Input v-model="planAddForm.estimatedTime" style="width: 160px;" placeholder="" disabled></Input>
                </Form-item>
                <Form-item label="制单人" prop="createBy">
                    <Input v-model="planAddForm.createBy" style="width: 160px;" placeholder="" disabled></Input>
                </Form-item>
                <Form-item label="制单日期" prop="createAt">
                    <Date-picker v-model="planAddForm.createAt" :open="false" type="datetime" placeholder="选择日期和时间" style="width: 160px;" disabled readonly></Date-picker>
                </Form-item>
                <Form-item label="最后修改人" prop="updateBy">
                    <Input v-model="planAddForm.updateBy" style="width: 160px;" placeholder="" disabled></Input>
                </Form-item>
                <Form-item label="最后修改日期" prop="updateAt">
                    <Date-picker v-model="planAddForm.updateAt" :open="false" type="datetime" placeholder="选择日期和时间" style="width: 160px" disabled readonly></Date-picker>
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
        </div>

        <div class="second-title">计划周期</div>
        <Form :model="savePlanSchedule" label-position="right" inline :label-width="135">
            <Form-item  label="调度类型" prop="circleType">
                <Select v-model="savePlanSchedule.circleType" style="width: 160px;">
                    <Option value="circlePlan">周期计划</Option>
                    <Option value="interimPlan">临时计划</Option>
                </Select>
            </Form-item>
        </Form>
        <div v-if="savePlanSchedule.circleType == 'circlePlan'">
            <Form label-position="right" inline :label-width="135">
                <Form-item label="初次开始时间" >
                    <Date-picker v-model="savePlanSchedule.savePlanScheduleSetting.happenTime" type="date" placeholder="选择日期" style="width: 160px" confirm clearable @on-clear="clearHappendate" @on-ok="savePlanScheduleHappenTime"  disabled></Date-picker>
                </Form-item>
                <Form-item label="触发间隔" prop="">
                    <Select v-model="savePlanSchedule.periodUnit" @on-change="savePlanScheduleHappenTime" style="width: 135px">
                        <Option v-for="item in periodUnitType" :value="item.code" :key="item">{{ item.name }}</Option>
                    </Select>
                </Form-item>
                <span class="line-30 mar-tb-10 display-in-b col-red">提醒：录入非精确时间（几点几分）时，请选择是否为生产时间。</span>
                <!--<Form-item label="下次执行时间" prop="">
                    <Date-picker v-model="nextStartTime" type="date" placeholder="选择日期和时间" style="width: 160px" disabled readonly></Date-picker>
                </Form-item>-->
                <!--表格-->
                <div class="table-content" v-if="savePlanSchedule.periodUnit == 0" >
                    <table class="table table-bordered table-center table-striped table-blue table-edit">
                        <thead>
                        <tr>
                            <th>序号</th>
                            <th>执行日期</th>
                            <th>执行时间</th>
                            <th>操作</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="(planTask,index) in dayData">
                            <td>{{index + 1}}</td>
                            <td>每天</td>
                            <td><TimePicker v-model="planTask.duration" format="HH:mm" placeholder="选择时间" ></TimePicker></td>
                            <td>
                                <Select v-model="planTask.execTime" style="width: 160px;">
                                    <Option value="offWorkTime">非生产时间</Option>
                                    <Option value="WorkTime">生产时间</Option>
                                </Select>
                            </td>
                            <td><a class="mar-r-5" size="small" @click="delPlan(index)">废除</a></td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <!--<div class="table-content"  v-else-if="savePlanSchedule.periodUnit == 1" >
                    <table class="table table-bordered table-center table-striped table-blue table-edit">
                        <thead>
                        <tr>
                            <th>序号</th>
                            <th>执行日期</th>
                            <th>执行时间</th>
                            <th>操作</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="(planTask,index) in weekData">
                            <td>{{index + 1}}</td>
                            <td>
                                <Select v-model="planTask.execDate" >
                                    <Option value="1" >星期一</Option>
                                    <Option value="2" >星期二</Option>
                                    <Option value="3" >星期三</Option>
                                    <Option value="4" >星期四</Option>
                                    <Option value="5" >星期五</Option>
                                    <Option value="6" >星期六</Option>
                                    <Option value="7" >星期日</Option>
                                </Select>
                            </td>
                            <td><TimePicker v-model="planTask.duration" format="HH:mm" placeholder="选择时间" ></TimePicker></td>
                            <td>
                                <Select v-model="planTask.execTime" style="width: 160px;">
                                    <Option value="offWorkTime">非生产时间</Option>
                                    <Option value="WorkTime">生产时间</Option>
                                </Select>
                            </td>
                            <td><a class="mar-r-5" size="small" @click="delPlan(index)">废除</a></td>
                        </tr>
                        </tbody>
                    </table>
                </div>-->
                <div class="table-content"  v-else-if="savePlanSchedule.periodUnit == 2"  >
                    <table class="table table-bordered table-center table-striped table-blue table-edit">
                        <thead>
                        <tr>
                            <th>序号</th>
                            <th>执行日期</th>
                            <th>执行时间</th>
                            <th>操作</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="(planTask,index) in monthData">
                            <td>{{index + 1}}</td>
                            <td>
                                <div class="onlyDay">
                                    <DatePicker type="date" format="d" v-model="planTask.execDate" placeholder="选择日期" style="width: 160px;" :editable="editable"></DatePicker>
                                </div>
                                <!--<Select v-model="planTask.execDate" >
                                    <Option value="1" >1</Option>
                                    <Option value="2" >2</Option>
                                    <Option value="3" >3</Option>
                                    <Option value="4" >4</Option>
                                    <Option value="5" >5</Option>
                                    <Option value="6" >6</Option>
                                    <Option value="7" >7</Option>
                                    <Option value="8" >8</Option>
                                    <Option value="9" >9</Option>
                                    <Option value="10" >10</Option>
                                    <Option value="11" >11</Option>
                                    <Option value="12" >12</Option>
                                    <Option value="13" >13</Option>
                                    <Option value="14" >14</Option>
                                    <Option value="15" >15</Option>
                                    <Option value="16" >16</Option>
                                    <Option value="17" >17</Option>
                                    <Option value="18" >18</Option>
                                    <Option value="19" >19</Option>
                                    <Option value="20" >20</Option>
                                    <Option value="21" >21</Option>
                                    <Option value="22" >22</Option>
                                    <Option value="23" >23</Option>
                                    <Option value="24" >24</Option>
                                    <Option value="25" >25</Option>
                                    <Option value="26" >26</Option>
                                    <Option value="27" >27</Option>
                                    <Option value="28" >28</Option>
                                    <Option value="29" >29</Option>
                                    <Option value="30" >30</Option>
                                    <Option value="31" >31</Option>
                                </Select>-->
                            </td>
                            <td><TimePicker v-model="planTask.duration" format="HH:mm" placeholder="选择时间" ></TimePicker></td>
                            <td>
                                <Select v-model="planTask.execTime" style="width: 160px;">
                                    <Option value="offWorkTime">非生产时间</Option>
                                    <Option value="WorkTime">生产时间</Option>
                                </Select>
                            </td>
                            <td><a class="mar-r-5" size="small" @click="delPlan(index)">废除</a></td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div class="table-content"  v-else-if="savePlanSchedule.periodUnit == 3" >
                    <table class="table table-bordered table-center table-striped table-blue table-edit">
                        <thead>
                        <tr>
                            <th>序号</th>
                            <th>执行日期</th>
                            <th>执行时间</th>
                            <th>操作</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="(planTask,index) in quarterData">
                            <td>{{index + 1}}</td>
                            <td><Date-picker v-model="planTask.execDate" :open="false" type="date" placeholder="选择日期和时间" disabled readonly></Date-picker></td>
                            <td><TimePicker v-model="planTask.duration" format="HH:mm" placeholder="选择时间" ></TimePicker></td>
                            <td>
                                <Select v-model="planTask.execTime" style="width: 160px;">
                                    <Option value="offWorkTime">非生产时间</Option>
                                    <Option value="WorkTime">生产时间</Option>
                                </Select>
                            </td>
                            <td><a class="mar-r-5" size="small" @click="delPlan(index)">废除</a></td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div class="table-content"  v-else >
                    <table class="table table-bordered table-center table-striped table-blue table-edit">
                        <thead>
                        <tr>
                            <th>序号</th>
                            <th>执行日期</th>
                            <th>执行时间</th>
                            <th>操作</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="(planTask,index) in yearData">
                            <td>{{index + 1}}</td>
                            <td><Date-picker v-model="planTask.execDate" :open="false" type="date" placeholder="选择日期和时间" disabled readonly></Date-picker></td>
                            <td><TimePicker v-model="planTask.duration" format="HH:mm" placeholder="选择时间" ></TimePicker></td>
                            <td>
                                <Select v-model="planTask.execTime" style="width: 160px;">
                                    <Option value="offWorkTime">非生产时间</Option>
                                    <Option value="WorkTime">生产时间</Option>
                                </Select>
                            </td>
                            <td><a class="mar-r-5" size="small" @click="delPlan(index)">废除</a></td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div class="mar-t-10 mar-b-25">
                    <Button type="primary" icon="plus-round" size="small" @click="addPalnCycle">添加</Button>
                </div>
            </Form>
        </div>
        <div v-else>
            <Form :model="savePlanSchedule" label-position="right" inline :label-width="135">
                <Form-item label="执行时间" prop="firstStartTime">
                    <Date-picker v-model="savePlanSchedule.savePlanScheduleSetting.happenTime" type="date" placeholder="选择日期和时间"  @on-clear="clearHappendate" @on-ok="savePlanScheduleHappenTime" confirm disabled></Date-picker>
                </Form-item>
                <Form-item label="执行时间段" prop="execTime">
                    <Select v-model="savePlanSchedule.execTime" style="width: 160px;">
                        <Option value="offWorkTime">非生产时间</Option>
                        <Option value="WorkTime">生产时间</Option>
                    </Select>
                </Form-item>
                <span class="line-30 mar-tb-10 display-in-b col-red">提醒：录入非精确时间（几点几分）时，请选择是否为生产时间。</span>
            </Form>
        </div>

        <!--操作按钮-->
        <Row class="btn-group">
            <Col class="pad-15" span="24" align="center">
            <router-link to='/maintenancePlan' class="mar-r-15">
                <Button v-show="button_14421" class="btn-gary" icon="close" size="large">取消</Button>
            </router-link>
            <Button v-show="button_14422" type="primary" icon="document-text" size="large" @click="setStatusAndSavePlan('planAddForm')">保存草稿</Button>
            <Button v-show="button_14423" type="primary" icon="checkmark" size="large" @click="setStatusAndApply('planAddForm')">提交审核</Button>
            <Button v-show="button_14424" type="primary" icon="trash-a" size="large" @click="deletePlan">删除</Button>
            </Col>
        </Row>

        <Modal v-model="device_code" title="设备编码" width="820" @on-ok="selectSb">
            <Row>
                <Col :span="6" class="pad-r-10">
                <div class="pad-5-20 bg-linegary">地点名称</div>
                <Tree :data="baseData" show-checkbox :multiple="false" :show-checkbox="false" @on-select-change="getLocationId" class="max-h-300"></Tree>
                </Col>
                <Col :span="18" class="pad-l-10">
                <table class="table table-bordered table-center table-striped table-blue">
                    <thead>
                    <tr>
                        <th>选择</th>
                        <th>序号</th>
                        <th>设备编码</th>
                        <th>设备名称</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(sb, index) in tpmsb">
                        <td>
                            <div v-html="sb.radio"></div>
                        </td>
                        <td>{{index + 1}}</td>
                        <td>{{sb.equipmentCode}}</td>
                        <td>{{sb.equipmentName}}</td>
                    </tr>
                    </tbody>
                </table>
                <div class="mar-t-10" style="overflow: hidden">
                    <div style="float: right;">
                        <Page :total="tpmsbTotal" :current="tpmsbCurrent" size="small" show-elevator :page-size="pageSize" @on-change="changeEquipment"></Page>
                    </div>
                </div>
                </Col>
            </Row>
        </Modal>
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
        <Modal v-model="work_code" title="标准方案编码" @on-ok="selectSs">
            <table class="table table-bordered table-center table-striped table-blue">
                <thead>
                <tr>
                    <th>选择</th>
                    <th>序号</th>
                    <th>标准方案编码</th>
                    <th>标准方案名称</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(ss, index) in tpmss">
                    <td>
                        <div v-html="ss.radio"></div>
                    </td>
                    <td>{{index + 1}}</td>
                    <td>{{ss.code}}</td>
                    <td>{{ss.name}}</td>
                </tr>
                </tbody>
            </table>
            <div class="mar-t-10" style="overflow: hidden">
                <div style="float: right;">
                    <Page :total="tpmssTotal" size="small" show-elevator :page-size="pageSize" @on-change="initTpmss"></Page>
                </div>
            </div>
        </Modal>
        <Modal v-model="timeCheck" title="保存计划">
            <div class="font-18 pad-b-10 col-orange">与以下计划存在时间冲突！</div>
            <Table stripe border :columns="columns_save1" :data="data_save1"></Table>
            <div slot="footer">
                <a @click="timeCheck=false">取消</a>
                <Button type="primary" class="mar-l-15" @click="save_plan_force_timeCheck">强制保存</Button>
            </div>
        </Modal>
        <Modal v-model="save_plan2" title="保存计划">
            <div class="font-18 pad-b-10 col-orange">已存在未执行完的维保工单,是否继续调整计划？</div>
            <Table stripe border :columns="columns_save2" :data="data_save2"></Table>
            <div slot="footer">
                <a @click="save_plan2=false">取消</a>
                <Button type="primary" class="mar-l-15" @click="save_plan2_force">强制保存</Button>
            </div>
        </Modal>
        <Modal v-model="save_plan3" title="保存计划" width="800">
            <div class="font-18 pad-b-10 col-orange">超出计划可用工时，是否继续保存？</div>
            <Table stripe border :columns="columns_save3" :data="data_save_3_msg"></Table>
            <div slot="footer">
                <a @click="save_plan3=false">取消</a>
                <Button type="primary" class="mar-l-15" @click="save_plan3_force">强制保存</Button>
            </div>
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
                //临时字段...
                tmp: {
//                    //任务计划
                    tmpPlanTaskIndex: 0,
                },
                //编辑页面渲染
                thePlanTaskId: '',
                //临时字段...
                load_fix: false,
                isubmit :false,
                isubmit_save_plan_force_timeCheck :false,
                isubmit_save_plan2_force :false,
                load_fix_info:'',
                pageSize: 5,
                self: this,
                modal1: false,
                work_code: false,
                device_code: false,
                department_code: false,
                timeCheck: false,
                save_plan2: false,
                save_plan3: false,
                save_plan3_check: true,
                button_14421: this.$rt('14421'),
                button_14422: this.$rt('14422'),
                button_14423: this.$rt('14423'),
                button_14424: this.$rt('14424'),
                nextStartTime: '',
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
                ruleValidate: {
                    name: [
                        {required: true, message: '内容不能为空', trigger: 'change'},
                        {type: 'string', max: 60, message: '计划名称不能超出60个字', trigger: 'change'}
                    ]
                },

                columns_save1: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 80,
                        align: 'center',
                    },
                    {
                        title: '计划编号',
                        key: 'code',
                        align: 'center',
                    },
                    {
                        title: '计划名称',
                        key: 'name',
                        align: 'center',
                    },
                    {
                        title: '首次冲突时间',
                        key: 'firstConflictTime',
                        width: 160,
                        align: 'center',
                    },
                ],
                data_save1: [],

                /*人员需求 start*/
                new_tpmStandardSolutionDeptTmp: {
                    teamId: '',
                    code: '',
                    name: '',
                    quantity: '',
                },
                tpmStandardSolutionDeptTmp: [],
                /*人员需求 end*/

                columns_save2: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 80,
                        align: 'center',
                    },
                    {
                        title: '工单编号',
                        key: 'billNo',
                        align: 'center',
                    },
                    {
                        title: '计划维保时间',
                        key: 'plannedRunTime',
                        align: 'center',
                    },
                ],
                data_save2: [],

                columns_save3: [
                    {
                        title: '序号',
                        type: 'index',
                        align: 'center',
                        width: 80,
                    },
                    {
                        title: '计划编号',
                        key: 'code',
                        align: 'center',
                    },
                    {
                        title: '计划名称',
                        key: 'name',
                        align: 'center',
                    },
                    {
                        title: '本单需工时（分钟）',
                        key: 'manHours',
                        align: 'center',
                    },
                    {
                        title: '总可用工时（分钟）',
                        key: 'totalHours',
                        align: 'center',
                    },
                ],
                /*计划任务 start*/
                new_savePlanTaskList: {
                    equipmentId: "",
                    equipmentCode: "",
                    equipmentName: "",
                    standardSolutionId: "",
                    standardSolutionCode: "",
                    standardSolutionName: "",
                    needShutdown: 0, /*是否关机快照*/
                    needShutdownValue: true,
                    standardSolutionVersion: "", /*版本快照*/
                    solutionVersionId: "", /*版本id*/
                    ssLinkLocationId: "",
                    taskWorkingHour: 0,
                    ssv: [{
                        ssvId: "",
                        isDefaultVersion: "",
                        needShutdown: 0,
                        needShutdownValue: true,
                        version: "",
                    }],
                },
                savePlanTaskList: [],
                savePlanTaskListCheckRepeat: false,
                /*计划任务 end*/

                /*计划频率 start*/
                savePlanSchedule: {
                    circleType:'circlePlan',/*循环方式*/
                    period: 0, /*周期数*/
                    periodUnit: '1',
                    savePlanScheduleSetting: {
                        happenTime: '',
                        nextHappenTime: '',
                        fModificationTimeTagValue: false,
                    }
                },
                new_savePlanSchedule: {
                    period: '', /*周期数*/
                    periodUnit: '1',
                    savePlanScheduleSetting: {
                        happenTime: ''
                    }
                },
                /*计划频率 end */



                periodUnitType: [
                    {
                        code: 0 ,
                        name: "每天",
                    },
                    /*{
                        code: 1,
                        name: "每周",
                    },*/
                    {
                        code: 2,
                        name: "每月",
                    },
                    {
                        code: 3,
                        name: "每季度",
                    },
                    {
                        code: 4,
                        name: "每年",
                    },
                ],

                new_dayData: {
                    duration:'每天',
                    execTime:'offWorkTime'
                },
                dayData: [],
                new_weekData: {
                    execDate:'7',
                    duration:'每周',
                    execTime:'offWorkTime'
                },
                weekData: [],
                new_monthData: {
                    execDate:'7',
                    duration:'每月',
                    execTime:'offWorkTime'
                },
                monthData: [],
                new_quarterData: {
                    execDate:'10:10',
                    duration:'每季',
                    execTime:'offWorkTime'
                },
                quarterData: [],
                new_yearData: {
                    execDate:'10:10',
                    duration:'每年',
                    execTime:'offWorkTime'
                },
                yearData:[],

                /*下拉框 start*/

                /*计划调度设置 指定时间 start*/
                planScheduleSetting: [],
                planScheduleSettingCheck: false,
                /*计划调度设置 指定时间 end*/

                /*标准方案放大镜 start*/
                tpmss: [{id: "", code: "", name: "", radio: ""},],
                tpmssTotal: 0,
                /*标准方案放大镜 end*/

                /*人员需求班组放大镜 start*/
                tpmDept: [{id: "", code: "", name: "", radio: ""},],
                tpmDeptTotal: 0,
                /*人员需求班组放大镜 end*/


                /*设备放大镜start*/
                tpmsb: [],
                //   tpmsb: [{equipmentId:"",equipmentCode:"",equipmentName:"",radio:""},],
                tpmsbTotal: 0,
                locationId: '',
                tpmsbCurrent: 1,
                /*设备放大镜end*/
                estimatedTime: '',
            }
        },

        mounted(){
            var id = this.$route.query.planTaskId;
            this.initPlanDetail(id);
            this.thePlanTaskId = id;
            if (this.$route.query.planTaskId) {
                this.initPage();
                this.getLocationTree();//初始化地点树
                this.initTpmDept();
                //this.planEditByTaskId(this.$route.query.planTaskId, this.$route.query.c);
                if(this.$route.query.c !== undefined) {
                    this.button_14424 = false;
                }
            }else if (this.$route.query.planId) {
                this.initPage();
                this.getLocationTree();//初始化地点树
                this.initTpmDept();
                this.planEditByPlanId(this.$route.query.planId);
            } else {
                this.$Message.error("页面有错误，请重新进入！");
                this.button_14422 = false;
                this.button_14423 = false;
                this.button_14424 = false;
            }
        },

        computed: {
            checkRequiredTime: function () {/*大于0则不合格*/
                let taskSumWorkingHours = 0;
                for (let o in this.savePlanTaskList) {
                    taskSumWorkingHours += Number(this.savePlanTaskList[o].taskWorkingHour);
                }
                return Number(taskSumWorkingHours) - Number(this.planAddForm.teamSumWorkingHours);
            },
            data_save_3_msg: function () {/*工时校验失败数据回显*/
                let result = [];
                for (let o in this.savePlanTaskList) {
                    let obj = {};
                    obj["code"] = this.planAddForm.code;
                    obj["name"] = this.planAddForm.name;
                    obj["manHours"] = Math.round((parseFloat(this.savePlanTaskList[o].taskWorkingHour) * 60));
                    obj["totalHours"] = this.planAddForm.teamSumWorkingHours;
                    result.push(obj);
                }
                return result;
            },
            tpmPlan: function () {
                /*
                 tpmPlan: { //planAddForm
                    id: "",
                    status:"",
                     code: "",
                     name: '',
                     busiType: '',
                     teamId: '',
                     planLeadTime:'',
                     workOrderLeadTime:'',
                     createAt: "",
                     createBy: "",
                     savePlanTaskList: [
                             {
                                 standardSolutionId: '',
                                 solutionVersionId:'',
                                 equipmentId: '',
                                 needShutdown: '',
                             }
                         ],
                         savePlanScheduleList: [
                             {
                                 period:'',
                                 periodUnit:'',
                                 savePlanScheduleSetting: {
                                    happenTime: '',
                                    fModificationTimeTag: '',
                             }
                         }
                     ],
                 savePlanNoScheduleList: [
                 {
                 period:'',
                 periodUnit:'',
                 savePlanScheduleSetting: {
                 happenTime: ''
                 }
                 ],
                 },
                 * */
                let tpmPlan = this.planAddForm;
                tpmPlan.bdTeam = {};
                tpmPlan['savePlanTaskList'] = [];
                for (let o in this.savePlanTaskList) {
                    if (this.savePlanTaskList[o].needShutdownValue === true) {
                        this.savePlanTaskList[o].needShutdown = 0;
                    } else {
                        this.savePlanTaskList[o].needShutdown = 1;
                    }
                    tpmPlan['savePlanTaskList'].push({
                        standardSolutionId: this.savePlanTaskList[o].standardSolutionId,
                        solutionVersionId: this.savePlanTaskList[o].solutionVersionId,
                        equipmentId: this.savePlanTaskList[o].equipmentId,
                        needShutdown: this.savePlanTaskList[o].needShutdown,
                    });
                }
                /*调整计划校验*/
//                console.log(this.savePlanSchedule.savePlanScheduleSetting.nextHappenTime + "   this.savePlanSchedule.savePlanScheduleSetting.nextHappenTime")
                if (typeof this.savePlanSchedule.savePlanScheduleSetting.nextHappenTime == 'object') {
//                    if (this.savePlanSchedule.savePlanScheduleSetting.nextHappenTime.getTime() - new Date().getTime() <= 0)
//                        return "下次调整到时间必须大于今天";
                    this.savePlanSchedule.savePlanScheduleSetting.nextHappenTime.setHours(0);
                    this.savePlanSchedule.savePlanScheduleSetting.nextHappenTime.setMinutes(0);
                    this.savePlanSchedule.savePlanScheduleSetting.nextHappenTime.setSeconds(0);
                }
                tpmPlan['savePlanScheduleList'] = [];
                if(this.savePlanSchedule.period > 0) {
                    tpmPlan['savePlanScheduleList'].push(this.$fc.clone(this.savePlanSchedule));
//                    tpmPlan.savePlanScheduleList[0].savePlanScheduleSetting.happenTime = this.$fc.dateFormat(this.savePlanSchedule.savePlanScheduleSetting.happenTime);
//                    if (typeof this.savePlanSchedule.savePlanScheduleSetting.nextHappenTime == 'object') {
//                        tpmPlan.savePlanScheduleList[0].savePlanScheduleSetting.nextHappenTime = this.$fc.dateFormat(this.savePlanSchedule.savePlanScheduleSetting.nextHappenTime);
//                    }

//                    if(this.savePlanSchedule.savePlanScheduleSetting.fModificationTimeTagValue == true) {
//                        tpmPlan.savePlanScheduleList[0].savePlanScheduleSetting.fModificationTimeTag = 0;
//                    }else {
//                        tpmPlan.savePlanScheduleList[0].savePlanScheduleSetting.fModificationTimeTag = 1;
//                    }
//                    tpmPlan.savePlanScheduleList[0].savePlanScheduleSetting.fModificationTimeTagValue = this.savePlanSchedule.savePlanScheduleSetting.fModificationTimeTagValue;
                }

                tpmPlan['savePlanNoScheduleList'] = [];
                for (let o in this.planScheduleSetting) {
                    let schSet = this.$fc.cloneKey(this.new_savePlanSchedule);
                    schSet['savePlanScheduleSetting']['happenTime'] = this.planScheduleSetting[o].happenTime;
                    tpmPlan['savePlanNoScheduleList'].push(schSet);
                }
//                console.log(JSON.stringify(tpmPlan));
                return tpmPlan;
            },
        },

        methods: {
            //初始化表单
            initPlanDetail( planId){
                let vm = this;
                this.$axios.post('/eamPlan/searchPlanById',{
                    id: planId
                }).then((res) => {
                    let ret = res.data.response;
                    console.log('result + ' + JSON.stringify(ret));
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
                    } else {
                        this.$Message.error(ret.msg);
                    }
                }).catch((err) => {
                    console.log(err);
                })
            },
            changeRequiredTime : function () {
                let taskSumWorkingHours = 0;
                for(let o in this.savePlanTaskList) {
                    taskSumWorkingHours += Math.round((parseFloat(this.savePlanTaskList[o].taskWorkingHour) * 60));
                }
//                this.requiredTime = taskSumWorkingHours + "/" + this.planAddForm.teamSumWorkingHours;

                console.log("taskSumWorkingHours: " + taskSumWorkingHours)
//                console.log("this.savePlanTaskList: " + JSON.stringify(this.savePlanTaskList))
                this.estimatedTime = taskSumWorkingHours;
            },
            del: function (index) {
                // 删一个数组元素
                this.date.splice(index, 1);
            },
            getTr: function (selection, row, index) {
                console.log(selection);
            },
            initPage: function () {
                let vm = this;
                this.$axios.get('tpmPlan/init').then(function (response) {
                    let res_data = response.data.response.data;
                    vm.typeName = res_data.planType;
                    let unitType = res_data.periodUnitType;
                    unitType.splice(3,2);
//                    vm.periodUnitType = unitType;
                });
            },
            //            检查数字输入框正整数
            checkInt: function (val) {
                if (!Number.isInteger(val)) {
                    this.$Message.error('请输入整数!');
                }
            },

            clearHappendate: function () {
                let today = new Date();
                today.setHours(0);
                today.setMinutes(0);
                today.setSeconds(0);
                this.savePlanSchedule.savePlanScheduleSetting.happenTime = today;
                this.savePlanScheduleHappenTime();
            },
            savePlanScheduleHappenTime: function () {
                if (this.savePlanSchedule.period === '') {
                    this.savePlanSchedule.savePlanScheduleSetting.happenTime = '';
                } else {
                    if (!Number.isInteger(this.savePlanSchedule.period)) {
                        this.savePlanSchedule.savePlanScheduleSetting.happenTime = '错误';
                    } else {
                        let today = new Date(this.$fc.dateFormat(this.savePlanSchedule.savePlanScheduleSetting.happenTime));
                        today.setHours(0);
                        today.setMinutes(0);
                        today.setSeconds(0);
                        switch (this.savePlanSchedule.periodUnit) {
                            case '0':/*小时*/
                                today.setHours(today.getHours() + Number(this.savePlanSchedule.period));
                                this.nextStartTime = today;
                                return;
                            case '1':/*天*/
                                today.setDate(today.getDate() + Number(this.savePlanSchedule.period));
                                this.nextStartTime = today;
                                return;
                            case '2':/*周*/
                                today.setDate(today.getDate() + Number(this.savePlanSchedule.period) * 7);
                                this.nextStartTime = today;
                                return;
                            case '3':/*月*/
                                today.setMonth(today.getMonth() + Number(this.savePlanSchedule.period));
                                this.nextStartTime = today;
                                return;
                            case '4':/*季度*/
                                today.setMonth(today.getMonth() + Number(this.savePlanSchedule.period) * 3);
                                this.nextStartTime = today;
                                return;
                            case '5':/*年*/
                                today.setFullYear(today.getFullYear() + Number(this.savePlanSchedule.period));
                                this.nextStartTime = today;
                                return;
                        }
                    }
                }
            },

            removePlanScheduleSetting: function (index) {
                this.planScheduleSetting.splice(index, 1);
            },
            addPlanScheduleSetting: function () {
                for (let o in this.planScheduleSetting) {
                    if (this.planScheduleSetting[o].happenTime == '') {
                        this.$Message.warning("时间未填写！");
                        return;
                    }
                    for (let i = Number(o) + 1; i < this.planScheduleSetting.length; i++) {
                        if (Date.parse(this.planScheduleSetting[o].happenTime) == Date.parse(this.planScheduleSetting[i].happenTime)) {
                            this.$Message.warning("存在重复时间： " + this.$fc.dateFormat(this.planScheduleSetting[o].happenTime));
                            return;
                        }
                    }
                }
                this.planScheduleSetting.push({"happenTime": ""});
            },

            /************************************* 设备方案放大镜 start *********************************************************** */
            taskSSIndex: function (index) {
                this.tmp.tmpPlanTaskIndex = index;
                this.initTpmss(1);
                this.work_code = true;
            },
            removeTpmPalnTasks: function (index) {
                this.savePlanTaskList.splice(index, 1);
                this.changeRequiredTime();
            },
            addTpmPalnTasks: function () {
                for (let o in this.savePlanTaskList) {
                    if (this.savePlanTaskList[o].solutionVersionId == '' || this.savePlanTaskList[o].equipmentId == '') {
                        this.$Message.warning("请选择之后在添加！");
                        return;
                    }
                }
                if (this.savePlanTaskListCheckRepeat) {
                    this.$Message.warning("存在重复项！");
                } else {
                    this.savePlanTaskList.push(this.$fc.cloneKey(this.new_savePlanTaskList));
                }
            },
            taskSSversionChange: function (index) {
                let ssv = this.savePlanTaskList[index].ssv;
                for (let o in ssv) {
                    if(o != "unique"){
                        if (ssv[o].version == this.savePlanTaskList[index].standardSolutionVersion) {
                            this.savePlanTaskList[index].needShutdown = ssv[o].needShutdown;
                            this.savePlanTaskList[index].needShutdownValue = ssv[o].needShutdownValue;
                            this.savePlanTaskList[index].solutionVersionId = ssv[o].ssvId;
                            this.savePlanTaskList[index].taskWorkingHour = ssv[o].estimatedTime;
                            console.log("this.savePlanTaskList[index].taskWorkingHour: " + this.savePlanTaskList[index].taskWorkingHour)
                            this.checkRepeat(index);
                            this.changeRequiredTime();
                        }
                    }
                }
//                console.log("this.savePlanTaskList[index]: " + JSON.stringify(this.savePlanTaskList[index]))
            },
            checkRepeat: function (index) {
                this.savePlanTaskListCheckRepeat = false;
                for (let o in this.savePlanTaskList) {
                    if (this.savePlanTaskList[o].solutionVersionId === this.savePlanTaskList[index].solutionVersionId
                        && this.savePlanTaskList[o].equipmentId === this.savePlanTaskList[index].equipmentId
                        && o != index) {
                        console.log(o + " --- " + index);
                        this.$Message.warning("存在重复项！");
                        this.savePlanTaskListCheckRepeat = true;
                        return;
                    }
                }
            },
            initTpmss: function (page) {
                console.log("page: " + page);
                let vm = this;
                this.$axios.get('tpmStandardSolution/getAllSolution', {
                    params: {
                        page: page,
//                        bdEquipmentId: 1
                        bdEquipmentId: vm.savePlanTaskList[vm.tmp.tmpPlanTaskIndex].equipmentId
                    }
                }).then((res) => {
                    let dataRes = res.data.response.data;
                    vm.tpmssTotal = dataRes.Total;
                    vm.tpmss = dataRes.Rows;
                    for(let o in vm.tpmss) {
                        if(!isNaN(o)){
                            vm.tpmss[o]["radio"] = "<input type='radio' name='tpmss_radio' value='"+vm.tpmss[o]["id"]+"'>";
                        }
                    }
                }).catch((err) => {
                    console.log(err);
                });
            },
            selectSs: function () {
                let tpmssId = this.$jq("input[name='tpmss_radio']:checked").val();
                let index = this.$fc.arrIndexOfObj("id", tpmssId, this.tpmss);
                let vm = this;
                let indexTmp = vm.tmp.tmpPlanTaskIndex;
                vm.savePlanTaskList[indexTmp].ssv = new Array();
                vm.savePlanTaskList[indexTmp].standardSolutionId = vm.tpmss[index].id;
                vm.savePlanTaskList[indexTmp].standardSolutionCode = vm.tpmss[index].code;
                vm.savePlanTaskList[indexTmp].standardSolutionName = vm.tpmss[index].name;
                vm.savePlanTaskList[indexTmp].ssLinkLocationId = vm.tpmss[index].locationId;
                vm.savePlanTaskList[indexTmp].solutionVersionId = '';
                vm.savePlanTaskList[indexTmp].standardSolutionVersion = '';
                vm.savePlanTaskList[indexTmp].taskWorkingHour = 0;
                vm.savePlanTaskList[indexTmp].ssv = new Array();
                if (index !== -1) {
                    for(let o in this.tpmss[index].ssv) {
                        if(o != "unique"){
                            if(!isNaN(o)) {
                                vm.savePlanTaskList[indexTmp].ssv.push({
                                    ssvId: this.tpmss[index].ssv[o].id,
                                    isDefaultVersion: this.tpmss[index].ssv[o].isDefaultVersion,
                                    version: this.tpmss[index].ssv[o].version,
                                    needShutdownValue: this.tpmss[index].ssv[o].needShutdownValue,
                                    needShutdown: this.tpmss[index].ssv[o].needShutdown,
                                    estimatedTime: this.tpmss[index].ssv[o].estimatedTime,
                                });
                            }
                            if(this.tpmss[index].ssv[o].isDefaultVersion === 0) {
                                vm.savePlanTaskList[indexTmp].solutionVersionId = this.tpmss[index].ssv[o].id;
                                vm.savePlanTaskList[indexTmp].standardSolutionVersion = this.tpmss[index].ssv[o].version;
                                vm.savePlanTaskList[indexTmp].taskWorkingHour = this.tpmss[index].ssv[o].estimatedTime;
                            }
                            vm.changeRequiredTime();
                        }
                    }
                }
            },
            /************************************* 设备方案放大镜 end *********************************************************** */

            /************************************* 适用设备 start *********************************************************** */
            /*确定选中放大镜的下标，并且让模态框显示出来*/
            taskEquipmentIndex: function (index) {
                this.tmp.tmpPlanTaskIndex = index;
                if (this.savePlanTaskList[this.tmp.tmpPlanTaskIndex].standardSolutionId != "" && this.savePlanTaskList[this.tmp.tmpPlanTaskIndex].solutionVersionId == "") {
                    this.$Message.warning("请选择方案具体版本号在选择设备！");
                } else {
                    this.device_code = true;
                }
//                console.log("this.locationId: " + this.locationId);
                this.getEquipmnet(0, this.locationId);
            },
            /*初始化地点得树结构*/
            getLocationTree: function () {
                let vm = this;
                this.$axios.post("tpmStandardSolution/getLocationTree").then(function (response) {
                    var object = response.data.response.data;
                    vm.baseData = object;
                });
            },
            /*点击树节点得分子节点 通过树节点ID  获取设备*/
            getLocationId (node){
                if (node[0]) {
                    console.log("Location名称是" + node[0].title + "-----" + "对应的id--code是" + node[0].locationId);
                    this.locationId = node[0].locationId;
//                     this.savePlanTaskList[this.tmp.tmpPlanTaskIndex].ssLinkLocationId = node[0].locationId;
                    this.getEquipmnet(0, this.locationId);
                }
            },
            /*table页面获取选中行的数据*/
            selectSb: function () {
                let tpmsbId = this.$jq("input[name='tpmsb_radio']:checked").val();
                let index = this.$fc.arrIndexOfObj("equipmentId", tpmsbId, this.tpmsb);
                if (index !== -1) {
                    let vm = this;
//                        vm.savePlanTaskList[vm.tmp.tmpPlanTaskIndex].equipmentCode = this.tpmsb[index].equipmentCode;
//                        vm.savePlanTaskList[vm.tmp.tmpPlanTaskIndex].equipmentName = this.tpmsb[index].equipmentName;
//
                    let tpmsb = this.tpmsb;
                    point: for (var i in tpmsb) {
                        if(i != "unique"){
                        if (tpmsb[i].equipmentId == tpmsbId) {    //判断查询出的所有数据的id是否包括你选的数据的id
                            for (var k in vm.savePlanTaskList) {       //vm.tpmStandardSolutionEquipmentTmp是要渲染到页面的数据的数组
                                if (("" + vm.savePlanTaskList[k].equipmentId).indexOf(tpmsbId) == 0) {   //判断数组里是否已经存在你选择的id
                                    //console.log("不能重复选择同一款设备");
                                    this.$Message.warning("不能重复选择同一款设备");
                                    break point;       //存在跳出标记点（所有循环）
                                } else {
                                    continue;          //不存在就继续遍历数组所有的数据继续比对
                                }
                            }    //循环结束后，没有匹配到，则继续执行以下代码，进行新增
//                                vm.tpmStandardSolutionEquipmentTmp[vm.tpmStandardSolutionIndex].equipmentId = tpmsbId;
//                                vm.tpmStandardSolutionEquipmentTmp[vm.tpmStandardSolutionIndex].equipmentCode = this.tpmsb[index].equipmentCode;
//                                vm.tpmStandardSolutionEquipmentTmp[vm.tpmStandardSolutionIndex].equipmentName = this.tpmsb[index].equipmentName;

                            vm.savePlanTaskList[vm.tmp.tmpPlanTaskIndex].equipmentId = tpmsbId;
                            vm.savePlanTaskList[vm.tmp.tmpPlanTaskIndex].equipmentCode = this.tpmsb[index].equipmentCode;
                            vm.savePlanTaskList[vm.tmp.tmpPlanTaskIndex].equipmentName = this.tpmsb[index].equipmentName;
                        }
//                        console.log();
                        }
                    }
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
                let standardSolutionVersionId = vm.savePlanTaskList[vm.tmp.tmpPlanTaskIndex].solutionVersionId;
                //let standardSolutionId = vm.savePlanTaskList[vm.tmp.tmpPlanTaskIndex].standardSolutionVersionId;
                let correlation = "Y"; // 是否关联方案放大镜（Y:关联；N：不关联）
                if (standardSolutionVersionId == null || standardSolutionVersionId == undefined || standardSolutionVersionId == "") {
                    correlation = "N";
                    standardSolutionVersionId == ""
                }
                this.$axios.post('tpmStandardSolution/getEquipments/' + correlation, {
                    page: currentPage,
                    bdLocationId: locationId,
                    standardSolutionVersionId: standardSolutionVersionId,
                }).then((res) => {
                    if (res.data.response.code == 1) {
                        let dataRes = res.data.response.data;
                        vm.tpmsbTotal = dataRes.Total;

                        console.log("total: " + vm.tpmsbTotal);

                        vm.tpmsb = new Array();
                        for (let o in dataRes.Rows) {
                            if(o != "unique"){
                            let obj = {};
                            obj["equipmentId"] = dataRes.Rows[o]["equipmentId"];
                            obj["equipmentCode"] = dataRes.Rows[o]["equipmentCode"];
                            obj["equipmentName"] = dataRes.Rows[o]["equipmentName"];
                            obj["radio"] = "<input type='radio' name='tpmsb_radio' value='" + dataRes.Rows[o]["equipmentId"] + "'>";
                            vm.tpmsb.push(obj);
                            }
                        }
                        if (flg) {
                            vm.tpmsbCurrent = 1;
                        }
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
            /************************************* 适用设备 end *********************************************************** */

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
//                    console.log(dataRes.Rows);
//                    console.log("laiba ==========" + res);
                    vm.tpmDeptTotal = dataRes.Total;
                    vm.tpmDept = new Array();
//                    console.log("lai ba "+dataRes);
                    for (let o in dataRes.Rows) {
                        if(o != "unique"){
                        let obj = {};
                        obj["id"] = dataRes.Rows[o].teamId;
                        obj["code"] = dataRes.Rows[o].teamCode;
                        obj["name"] = dataRes.Rows[o].teamName;
                        obj["teamSumWorkingHours"] = dataRes.Rows[o].teamSumWorkingHours;
                        obj["radio"] = "<input type='radio' name='tpmdept_radio' value='" + dataRes.Rows[o].teamId + "'>";
                        vm.tpmDept.push(obj);
                        }
                    }
//                    console.log(vm.tpmDept);
                }).catch((err) => {
                    console.log(err);
                });
            },
            selectDept: function () {
                let tpmDeptId = this.$jq("input[name='tpmdept_radio']:checked").val();
                let index = this.$fc.arrIndexOfObj("id", tpmDeptId, this.tpmDept);
//                console.log(index);
//                console.log("this.tpmDept: " + JSON.stringify(this.tpmDept[index]));
                if (index !== -1) {
                    this.planAddForm.teamName = this.tpmDept[index].name;
                    this.planAddForm.teamId = tpmDeptId;
                    /*算出班组总工时*/
                    this.planAddForm.teamSumWorkingHours = this.tpmDept[index].teamSumWorkingHours;
                    this.changeRequiredTime();
                }
            },
            /************************************* 人员班组放大镜 end *********************************************************** */

            /************************************* 计划保存 start *********************************************************** */
            save_plan3_force: function () {
                if (this.tpmPlan === "") {
                    this.$Message.error("非法！");
                    return;
                }
                this.save_plan3_check = false;
                this.save_plan3 = false;
                this.savePlan();
            },
            savePlan: function (name) {
                if (this.tpmPlan === "") {
                    this.$Message.error("非法！");
                    return;
                }
                if (typeof(this.tpmPlan) === "string") {
                    this.$Message.error(this.tpmPlan);
                    return;
                }
//                /*1.工时校验*/
//                if (this.save_plan3_check == true && this.checkRequiredTime > 0) {
//                    this.save_plan3 = true;
//                    return;
//                }

                let tpmPlan = this.tpmPlan;
                if (typeof this.savePlanSchedule.savePlanScheduleSetting.nextHappenTime == 'object') {
                    if (this.savePlanSchedule.savePlanScheduleSetting.nextHappenTime.getTime() - new Date().getTime() <= 0) {
                        this.$Message.error("下次调整到时间必须大于今天");
                        return;
                    }
                    this.savePlanSchedule.savePlanScheduleSetting.nextHappenTime.setHours(0);
                    this.savePlanSchedule.savePlanScheduleSetting.nextHappenTime.setMinutes(0);
                    this.savePlanSchedule.savePlanScheduleSetting.nextHappenTime.setSeconds(0);
//                    tpmPlan.savePlanScheduleList[0].savePlanScheduleSetting.nextHappenTime = this.$fc.dateFormat(this.savePlanSchedule.savePlanScheduleSetting.nextHappenTime);
                    tpmPlan.savePlanScheduleList[0].savePlanScheduleSetting.nextHappenTime = this.savePlanSchedule.savePlanScheduleSetting.nextHappenTime;
                }
                if (typeof this.savePlanSchedule.savePlanScheduleSetting.happenTime == 'object') {
                    this.savePlanSchedule.savePlanScheduleSetting.happenTime.setHours(0);
                    this.savePlanSchedule.savePlanScheduleSetting.happenTime.setMinutes(0);
                    this.savePlanSchedule.savePlanScheduleSetting.happenTime.setSeconds(0);
//                    tpmPlan.savePlanScheduleList[0].savePlanScheduleSetting.happenTime = this.$fc.dateFormat(this.savePlanSchedule.savePlanScheduleSetting.happenTime);
                    tpmPlan.savePlanScheduleList[0].savePlanScheduleSetting.happenTime = this.savePlanSchedule.savePlanScheduleSetting.happenTime;
                }

                if(this.savePlanSchedule.savePlanScheduleSetting.fModificationTimeTagValue == true) {
                    tpmPlan.savePlanScheduleList[0].savePlanScheduleSetting.fModificationTimeTag = 0;
                }else {
                    tpmPlan.savePlanScheduleList[0].savePlanScheduleSetting.fModificationTimeTag = 1;
                }
                tpmPlan.savePlanScheduleList[0].savePlanScheduleSetting.fModificationTimeTagValue = this.savePlanSchedule.savePlanScheduleSetting.fModificationTimeTagValue;

                console.log("tpmPlan: " + JSON.stringify(tpmPlan))
                let vm = this;
//                console.log("tpmPlan: " + JSON.stringify(tpmPlan));
                if(this.$fc.iSubmit(this))
                this.$axios.post('tpmPlan/checkAndSave', tpmPlan).then((res) => {
                    let code = res.data.response.code;
                    let resdata = res.data.response.data;
                    if (code === 1) {//保存成功
//                        vm.$Message.success('保存成功!');
                        this.load_fix = true;
                        this.load_fix_info = '保存中，请稍候......';
                        setTimeout(function(){
                            vm.$router.push({path: '/maintenancePlan', query: {"date": new Date()}});
                        },1000);
                    } else if (code === -100) {/*时间校验失败*/
                        vm.isubmit = false;
                        vm.data_save1 = [];
                        for (let o in resdata) {
                            let obj = {};
                            obj["code"] = resdata[o].plan.code;
                            obj["name"] = resdata[o].plan.name;
                            obj["firstConflictTime"] = resdata[o].conflictDate;
                            vm.data_save1.push(obj);
                        }
                        vm.timeCheck = true;
                    } else if (code === -101) {/*维保计划存在未完成工单*/
                        vm.isubmit = false;
                        vm.data_save2 = [];
                        for (let o in resdata) {
                            let obj = {};
                            obj["billNo"] = resdata[o].billNo;
                            obj["plannedRunTime"] = resdata[o].plannedRunTime;
                            vm.data_save2.push(obj);
                        }
                        vm.save_plan2 = true;
                    } else {
                        vm.isubmit = false;
                        vm.$Message.error(res.data.response.msg);
                    }
                });
            },
            save_plan_force_timeCheck: function () {/*不校验冲突时间*/
                this.timeCheck = false;
                if (this.tpmPlan === "") {
                    this.$Message.error("非法！");
                    return;
                }
                let vm = this;
                if(this.$fc.iSubmit2(this, 'isubmit_save_plan_force_timeCheck'))
                this.$axios.post('tpmPlan/checkAndSaveIgnoreOne', this.tpmPlan).then((res) => {
//                    console.log(res);
                    let code = res.data.response.code;
                    let resdata = res.data.response.data;
                    if (code === 1) {//保存成功
//                        vm.$Message.success('保存成功!');
                        this.load_fix = true;
                        this.load_fix_info = '保存中，请稍候......';
                        setTimeout(function(){
                            vm.$router.push({path: '/maintenancePlan', query: {"date": new Date()}});
                        },1000);
                    } else if (code === -101) {/*维保计划存在未完成工单*/
                        vm.isubmit_save_plan_force_timeCheck = false;
                        vm.data_save2 = [];
                        for (let o in resdata) {
                            let obj = {};
                            obj["billNo"] = resdata[o].billNo;
                            obj["plannedRunTime"] = resdata[o].plannedRunTime;
                            vm.data_save2.push(obj);
                        }
                        vm.save_plan2 = true;
                    } else {
                        vm.isubmit_save_plan_force_timeCheck = false;
                        vm.$Message.error(res.data.response.msg);
                    }
                });
            },
            save_plan2_force: function () {
                this.save_plan2 = false
                if (this.tpmPlan === "") {
                    this.$Message.error("非法！");
                    return;
                }
                let vm = this;
                if(this.$fc.iSubmit2(this, 'isubmit_save_plan2_force'))
                this.$axios.post('tpmPlan/save', this.tpmPlan).then((res) => {
//                    console.log(res);
                    let code = res.data.response.code;
                    let resdata = res.data.response.data;
                    if (code === 1) {//保存成功
                        this.load_fix_info = '保存中，请稍候......';
                        this.load_fix = true;
                        setTimeout(function(){
                            vm.$router.push({path: '/maintenancePlan', query: {"date": new Date()}});
                        },1000);
                    } else {
                        vm.isubmit_save_plan2_force = false;
                        vm.$Message.error(res.data.response.msg);
                    }
                });
            },


            /*添加计划周期*/

            addPalnCycle: function () {
                switch(this.savePlanSchedule.periodUnit)
                {
                    case 0:
                        this.dayData.push(this.$fc.cloneKey(this.new_dayData));
                        break;
                    case 1:
                        this.weekData.push(this.$fc.cloneKey(this.new_weekData));
                        break;
                    case 2:
                        this.monthData.push(this.$fc.cloneKey(this.new_monthData));
                        break;
                    case 3:
                        this.quarterData.push(this.$fc.cloneKey(this.new_quarterData));
                        break;
                    case 4:
                        this.yearData.push(this.$fc.cloneKey(this.new_yearData));
                        break;
                }
            },
            delPlan:function (index) {
                switch(this.savePlanSchedule.periodUnit)
                {
                    case 0:
                        this.dayData.splice(index, 1);
                        break;
                    case 1:
                        this.weekData.splice(index, 1);
                        break;
                    case 2:
                        this.monthData.splice(index, 1);
                        break;
                    case 3:
                        this.quarterData.splice(index, 1);
                        break;
                    case 4:
                        this.yearData.splice(index, 1);
                        break;
                }
            },
            /************************************* 计划保存 end *********************************************************** */

            /**************************************页面数据渲染部分**********   start    *************************************/
            planEditByTaskId(taskId, c){
                let vm = this;
//                console.log("searchPlanDetail stating by taskId: " + taskId);
                this.$axios.post('/tpmPlan/planEditByTaskId', {
                    taskId: taskId,
                    c: c
                }).then((res) => {
                    let code = res.data.response.code;
                    if (code != 1) {
                        vm.$Message.error(res.data.response.msg);
                        this.button_14422 = false;
                        this.button_14423 = false;
                        this.button_14424 = false;
                    } else {
                        let res_data = res.data.response.data;
                        this.initEditPlan(res_data);
                    }
                }).catch((err => {
                    console.log(err);
                }))
            },

            planEditByPlanId(planId){
                let vm = this;
                console.log("searchPlanDetail stating by planId: " + planId);
                this.$axios.post('/tpmPlan/planEditByPlanId', {
                    planId: planId
                }).then((res) => {
                    let code = res.data.response.code;
                    if (code != 1) {
                        vm.$Message.error(res.data.response.msg);
                    } else {
                        let res_data = res.data.response.data;
                        this.initEditPlan(res_data);
                    }
                }).catch((err => {
                    console.log(err);
                }))
            },

            initEditPlan(res_data){
                let vm = this;
                vm.planAddForm = res_data.plan;
                vm.planAddForm.createByName = res_data.createByName;
                vm.planAddForm.teamName = res_data.teamName;
                vm.planAddForm.updateByName = res_data.updateByName;
                vm.planAddForm.teamSumWorkingHours = res_data.teamSumWorkingHours;
                /*任务*/
                vm.savePlanTaskList = res_data.tasks;
                for (let o in vm.savePlanTaskList) {
                    let task = vm.savePlanTaskList[o];
                    task["equipmentCode"] = task.bdEquipment.equipmentCode;
                    task["equipmentName"] = task.bdEquipment.equipmentName;
                    task["standardSolutionCode"] = task.tpmStandardSolution.code;
                    task["standardSolutionName"] = task.tpmStandardSolution.name;
                    task["solutionVersionId"] = task.tpmStandardSolutionVersion.id;
                    task["standardSolutionVersion"] = task.tpmStandardSolutionVersion.version;
                    task["ssv"] = res_data[task.standardSolutionId];
                    task["taskWorkingHour"] = task.tpmStandardSolutionVersion.estimatedTime;
                }

                /*周期的调度*/
//                console.log("res_data.sch: " + JSON.stringify(res_data.sch));
                if (res_data.sch != "") {
                    vm.savePlanSchedule = res_data.sch;
                    vm.savePlanSchedule.savePlanScheduleSetting = res_data.schSetting;
                    vm.savePlanSchedule.savePlanScheduleSetting.happenTime = new Date(res_data.schSetting.happenTime);
                    vm.savePlanSchedule.savePlanScheduleSetting.happenTime.setHours(0);
                    vm.savePlanSchedule.savePlanScheduleSetting.happenTime.setMinutes(0);
                    vm.savePlanSchedule.savePlanScheduleSetting.happenTime.setSeconds(0);
                    vm.savePlanSchedule.periodUnit = res_data.sch.periodUnit + "";
                    vm.savePlanSchedule.lastPlanHappenTime = res_data.schLastPlanHappenTime;
                    vm.savePlanScheduleHappenTime();
                }
//                console.log("vm.savePlanSchedule: " + JSON.stringify(vm.savePlanSchedule));
//                /*非周期的调度*/
//                vm.planScheduleSetting = [];
//                for(let o in res_data.noSchs) {
//                    vm.planScheduleSetting.push({'happenTime': new Date(res_data[res_data.noSchs[o].id].happenTime)});
//                }
                this.changeRequiredTime();
            },
            /**************************************页面数据渲染部分**********   end   *************************************/

            /************************************   生效和保存前设置status  start    ******************************************/
            setStatusAndSavePlan: function (name) {
                this.planAddForm.status = 0;  // 制单
                this.$refs[name].validate((valid) => {
                    if (!valid) {
                        this.$Message.error('请完善计划信息!');
                    } else {
                        this.savePlan();
                    }
                })
            },
            setStatusAndApply: function (name) {
                this.planAddForm.status = 1;   // 生效
                this.$refs[name].validate((valid) => {
                    if (!valid) {
                        this.$Message.error('请完善计划信息!');
                    } else {
                        this.savePlan();
                    }
                })
            },

            /************************************   生效和保存前设置status  end    ******************************************/
            /************************************   作废    ******************************************/
            deletePlan: function () {
//                this.$router.push({path:'/searchList'});
//                return;
                let vm = this;
                this.$axios.post('tpmPlan/delete', {
                    tpmPlanId: vm.planAddForm.id,
                }).then((res) => {
                    let code = res.data.response.code;
                    if (code == 1) {
//                        vm.$Message.info("删除成功！");
//                        setTimeout(function(){
//                            vm.$router.push({path: '/searchList', query: {"date": new Date()}});
//                        },500);
                        this.load_fix_info = '操作中，请稍候......';
                        this.load_fix = true;
                        setTimeout(function(){
                            vm.$router.push({path: '/maintenancePlan', query: {"date": new Date()}});
                        },1000);
                    } else {
                        vm.$Message.error("删除失败！");
                    }
                });
            },
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
    .onlyDay {
        text-align: left;
    }
    .onlyDay .ivu-date-picker-header, .onlyDay .ivu-date-picker-cells-header, .onlyDay .ivu-date-picker-cells-cell-prev-month, .onlyDay .ivu-date-picker-cells-cell-next-month {
        display: none;
    }
</style>
