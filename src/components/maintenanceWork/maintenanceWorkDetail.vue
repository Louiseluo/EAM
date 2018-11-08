<template>
    <div class="basic fault-content">
        <Spin fix v-show="load_fix">
            <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
            <div>保存中，请稍后...</div>
        </Spin>
        <Spin fix v-show="load_fix_temporary">
            <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
            <div>正在迁出，请稍后...</div>
        </Spin>
        <!--模块名称-->
        <div class="title">
            <span v-if="maintenanceForm.busiType == 1">维修工单</span>
            <span v-else>维保工单-执行</span>
        </div>
        <!--表单-->
        <div class="form-content">
            <Form ref="maintenanceForm" :model="maintenanceForm" label-position="right" inline :label-width="120">
                <!--<Form-item label="工单类型" prop="busiTypeName">
                    <Input v-model="maintenanceForm.busiTypeName" style="width: 160px;" placeholder="" disabled></Input>
                </Form-item>-->
                <Form-item label="计划名称" prop="billName">
                    <Input v-model="maintenanceForm.billName" style="width: 160px;" placeholder="" disabled></Input>
                </Form-item>
                <Form-item label="计划编码" prop="billNo">
                    <Input v-model="maintenanceForm.billNo" style="width: 160px;" placeholder="" disabled></Input>
                </Form-item>
                <Form-item label="标准方案名称" prop="solutionName">
                    <Input v-model="maintenanceForm.solutionName" style="width: 160px;" placeholder="" disabled></Input>
                </Form-item>
                <Form-item label="标准方案编码" prop="solutionCode">
                    <div class="input-search">
                        <Input v-model="maintenanceForm.solutionCode" style="width: 160px;" disabled></Input>
                    </div>
                </Form-item>
                <Form-item label="版本" prop="solutionVersion">
                    <Input v-model="maintenanceForm.solutionVersion" style="width: 160px;" disabled></Input>
                </Form-item>
                <Form-item label="是否需要停机" prop="needShutdownValue">
                    <i-switch v-model="maintenanceForm.needShutdownValue" disabled>
                        <span slot="open">是</span>
                        <span slot="close">否</span>
                    </i-switch>
                </Form-item>
                <Form-item label="预计耗时（分钟）" prop="requiredTime">
                    <Input v-model="maintenanceForm.requiredTime" style="width: 160px;" placeholder="" disabled></Input>
                </Form-item>
                <Form-item label="计划执行时间" prop="plannedRunTime">
                    <Input v-model="maintenanceForm.plannedRunTime" style="width: 160px;" disabled></Input>
                </Form-item>


                <Form-item label="单据状态" prop="statusName" >
                    <Input v-model="maintenanceForm.statusName" style="width: 160px;" placeholder="" disabled></Input>
                </Form-item>
                <Form-item label="设备名称" prop="equipmentName">
                    <div class="input-search">
                        <Input v-model="maintenanceForm.equipmentName" style="width: 160px;" disabled></Input>
                    </div>
                </Form-item>
                <div v-if="maintenanceForm.faultDescription != undefined">
                    <Form-item label="故障描述" prop="faultDescription">
                        <div class="input-search">
                            <Input v-model="maintenanceForm.faultDescription" style="width: 160px;" disabled></Input>
                            <Button icon="ios-search" @click="faultDescription = false"></Button>
                        </div>
                    </Form-item>
                    <Form-item label="故障位置" prop="confirmedFaultPosition">
                        <Select style="width: 160px;" :disabled="blur_hitch_desc" @on-change="hitch_whereChangeHandler" multiple v-model="cause_where" disabled>
                            <Option v-for="item in cityList" :value="item.value" :key="item">{{ item.label }}</Option>
                        </Select>
                    </Form-item>
                    <Form-item label="故障原因" prop="confirmedCauseOfFault">
                        <div class="input-search">
                            <Input v-model="maintenanceForm.confirmedCauseOfFault" style="width: 160px;" placeholder="" :disabled="blur_hitch_where" disabled></Input>
                            <Button icon="ios-search" @click="fault_cause = false"></Button>
                        </div>
                    </Form-item>
                </div>
                <!--<Form-item label="注意事项" prop="Remark">
                    <Input v-model="maintenanceForm.Remark" type="textarea" style="width: 400px;" :autosize="{minRows: 2,maxRows: 5}" placeholder="" disabled></Input>
                </Form-item>
                <Form-item label="实际耗时（分钟）" prop="actualTime">
                    <Input v-model="maintenanceForm.actualTime" style="width: 160px;" placeholder=""></Input>
                </Form-item>
                <Form-item label="故障描述" prop="note">
                    <Input v-model="maintenanceForm.note" type="textarea" style="width: 800px;" :autosize="{minRows: 2,maxRows: 5}" placeholder=""></Input>
                </Form-item>-->
            </Form>
        </div>
        <div class="mar-b-15">实际累计耗时<span class="col-orange mar-lr-10 font-28">{{Math.round((parseFloat(maintenanceForm.num06) * 60))}}</span>分钟</div>
        <Table class="mar-b-15" stripe border :columns="columns_man" :data="data_man"></Table>
        <Tabs class="maintenanceTab" type="card">
            <Tab-pane label="作业项目" icon="social-buffer">
                <div class="table-reset">
                    <table class="table table-bordered table-center table-striped table-blue table-edit">
                        <thead>
                        <tr>
                            <th>序号</th>
                            <th>作业内容</th>
                            <th>标准要求</th>
                            <th>标准工时(分钟)</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="(itemWorkflow, index) in data_workflow">
                            <td>{{index + 1}}</td>
                            <td>{{itemWorkflow.content}}</td>
                            <td>{{itemWorkflow.requirement}}</td>
                            <!--<td><Input-number v-model="itemWorkflow.requiredTime" :min="0" @on-change="checkInt" style="width: 160px;"></Input-number></td>-->
                            <td>{{itemWorkflow.requiredTime}}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </Tab-pane>
            <Tab-pane label="备品备件需求" icon="cube">
                <div class="table-reset">
                    <table class="table table-bordered table-center table-striped table-blue table-edit">
                        <thead>
                        <tr>
                            <th>序号</th>
                            <th width="15%">备品备件编码</th>
                            <th>备品备件名称</th>
                            <th>单位</th>
                            <th width="10%">实际使用数量</th>
                            <th>备品备件类型</th>
                            <!--<th>操作</th>-->
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="(itemMaterial,index) in data_material">
                            <td>{{index + 1}}</td>
                            <td>{{itemMaterial.materialCode}}</td>
                            <td>{{itemMaterial.materialName}}</td>
                            <td>{{itemMaterial.materialUnit}}</td>
                            <td><Input-number v-model="itemMaterial.quantity" :min="0" @on-change="checkInt" style="width: 160px;" :disabled="itemMaterialQuantityDisable"></Input-number></td>
                            <td>{{itemMaterial.materialType}}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </Tab-pane>
        </Tabs>
        <!--操作按钮-->
        <Row class="btn-group">
            <Col class="pad-15" span="24" align="center">
            <!--
            <Button type="primary" icon="card" size="large">刷卡</Button>
            <Button type="primary" icon="play" size="large">开始维保</Button>
            <Button type="primary" icon="ios-folder-outline" size="large">单据保存</Button>
            <Button type="primary" icon="ios-paper-outline" size="large">维保完成</Button>
            -->
            <Button v-show="button_14551" type="primary" icon="card" size="large" @click="chargeForStartF">开始维护</Button>
            <!--<Button v-show="button_14551" type="primary" icon="card" size="large" @click="rejects = true">驳回</Button>-->
            <Button v-show="button_14551" type="primary" icon="card" size="large" @click="chargeTurnDown">驳回</Button>
            <Button v-show="button_14552" type="primary" icon="card" size="large" @click="chargeForStartT">临时签出</Button>
            <!--<router-link to="/" style="margin: 0px 20px;">
                <Button type="primary" icon="ios-folder-outline" size="large">编辑</Button>
            </router-link>
            <router-link to="searchList" style="margin: 0px 20px;">-->
                <Button v-show="button_14553" type="primary" icon="ios-paper-outline" size="large"  @click="finishExecute">维护完成</Button>
            <!--</router-link>
            <Button v-show="button_14554" type="primary" icon="card" size="large" @click="chargeForStartF">新故障上报</Button>-->
            </Col>
        </Row>
        <!--modal-->
        <Modal v-model="material_code" title="备品备件需求" @on-ok="">
            <div class="second-title">备品备件类型</div>
            <Select style="width:200px" :value="7" @on-change="">
                <!--<Option v-for="item in materialType" :value="item.value" :key="item">{{ item.label }}</Option>-->
            </Select>
            <div class="second-title mar-t-10">备品备件选择</div>
            <table class="table table-bordered table-center table-striped table-blue materialS">
                <thead>
                <tr>
                    <th>选择</th>
                    <th>序号</th>
                    <th>备品备件编码</th>
                    <th>备品备件名称</th>
                    <th>规格型号</th>
                </tr>
                </thead>
                <tbody>
                <!--<tr v-for="material in materialList">
                    <td v-html='material.innerhtml'></td>
                    &lt;!&ndash;{{material.innerhtml}}&ndash;&gt;
                    <td>{{material.index}}</td>
                    <td>{{material.materialCode}}</td>
                    <td>{{material.materialName}}</td>
                    <td>{{material.modelType}}</td>
                </tr>-->
                <tr>
                    <td><input type="radio" name="selects"/></td>
                    <td>2</td>
                    <td>M002</td>
                    <td>机油滤清器</td>
                    <td>12333</td>
                </tr>
                <tr>
                    <td><input type="radio" name="selects"/></td>
                    <td>3</td>
                    <td>M003</td>
                    <td>机油滤清器</td>
                    <td>12333</td>
                </tr>
                </tbody>
            </table>
            <div class="mar-t-10" style="overflow: hidden">
                <div style="float: right;">
                    <!--<Page :total="numMaterial" size="small" show-elevator :page-size="size" @on-change="changeMaterial"></Page>-->
                </div>
            </div>
        </Modal>
        <Modal v-model="fault_cause" title="故障原因">
            <table class="table table-bordered table-center table-striped table-blue">
                <thead>
                <tr>
                    <th>选择</th>
                    <th>序号</th>
                    <th>故障原因</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td><input type="radio" name="selects"/></td>
                    <td>1</td>
                    <td>M001</td>
                </tr>
                <tr>
                    <td><input type="radio" name="selects"/></td>
                    <td>2</td>
                    <td>M002</td>
                </tr>
                <tr>
                    <td><input type="radio" name="selects"/></td>
                    <td>3</td>
                    <td>M003</td>
                </tr>
                </tbody>
            </table>
            <div class="mar-t-10" style="overflow: hidden">
                <div style="float: right;">
                    <Page :total="40" size="small" show-elevator :page-size="5"></Page>
                </div>
            </div>

            <!--<Table stripe border :columns="columns_cause" :data="data_cause"></Table>-->
        </Modal>
        <Modal v-model="device_modal" title="设备编码" @on-ok="" width="820">
            <Row>
                <Col :span="6" class="pad-r-10">
                <div class="pad-5-20 bg-linegary">地点名称</div>
                <Tree class="max-h-300" :data="baseData" show-checkbox></Tree>
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
                    <tr>
                        <td><input type="radio" name="selects"/></td>
                        <td>1</td>
                        <td>M001</td>
                        <td>压铸岛1号设备</td>
                    </tr>
                    <tr>
                        <td><input type="radio" name="selects"/></td>
                        <td>2</td>
                        <td>M002</td>
                        <td>压铸岛1号设备</td>
                    </tr>
                    <tr>
                        <td><input type="radio" name="selects"/></td>
                        <td>3</td>
                        <td>M003</td>
                        <td>压铸岛1号设备</td>
                    </tr>
                    </tbody>
                </table>
                <div class="mar-t-10" style="overflow: hidden">
                    <div style="float: right;">
                        <Page :total="40" size="small" show-elevator :page-size="5"></Page>
                    </div>
                </div>
                </Col>
            </Row>
            <!--<i-table stripe border :content="self" :columns="device_columns" :data="device_data" @on-selection-change="selectDept"></i-table>-->
        </Modal>
        <Modal v-model="work_code" title="标准方案编码">
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
                <tr>
                    <td><input type="radio" name="selects"/></td>
                    <td>1</td>
                    <td>M001</td>
                    <td>压铸岛1号设备</td>
                </tr>
                <tr>
                    <td><input type="radio" name="selects"/></td>
                    <td>2</td>
                    <td>M002</td>
                    <td>压铸岛1号设备</td>
                </tr>
                <tr>
                    <td><input type="radio" name="selects"/></td>
                    <td>3</td>
                    <td>M003</td>
                    <td>压铸岛1号设备</td>
                </tr>
                </tbody>
            </table>
            <div class="mar-t-10" style="overflow: hidden">
                <div style="float: right;">
                    <Page :total="40" size="small" show-elevator :page-size="5"></Page>
                </div>
            </div>

            <!--<Table stripe border :columns="columns_work2" :data="data_work2"></Table>-->
        </Modal>
        <Modal v-model="chargeForStart" title="" :closable="false">
            <p slot="header" style="color:#f60;text-align:center">
                <Icon type="information-circled"></Icon>
                <span>{{ this.chargeTime }}</span>
            </p>
            <div style="text-align:center">
                <p class="pad-20 bg-linegary">
                    <label class="font-28 pad-r-20" >刷卡成功</label>
                    <Button type="primary" size="small" class="mar-l-25">{{ this.backTime + '秒后自动返回' }}</Button>

                </p>
                <Row class="mar-tb-15">
                    <Col span="12" align="right" class="pad-r-10">员工号：</Col>
                    <Col span="12" align="left" class="pad-l-10">{{this.personCode}}</Col>
                </Row>
                <Row class="mar-b-15">
                    <Col span="12" align="right" class="pad-r-10">姓名：</Col>
                    <Col span="12" align="left" class="pad-l-10">{{this.personName}}</Col>
                </Row>
                <Row>
                    <Col span="12" align="right" class="pad-r-10">班组：</Col>
                    <Col span="12" align="left" class="pad-l-10">{{this.teamName}}</Col>
                </Row>
            </div>
            <div slot="footer">
            </div>
        </Modal>
        <Modal v-model="chargeForStartN" title="" :closable="false">
            <p slot="header" style="color:#f60;text-align:center">
                <Icon type="information-circled"></Icon>
                <span>{{ this.chargeTime }}</span>
            </p>
            <div style="text-align:center">
                <p class="pad-20 bg-linegary">
                    <label class="font-28 pad-r-20" >请刷卡</label>
                    <Button type="primary" size="small" class="mar-l-25">{{ this.backTime + '秒后自动返回' }}</Button>

                </p>
            </div>
            <div slot="footer">
            </div>
        </Modal>
        <Modal v-model="chargeForStart33" title="" :closable="false">
            <div style="text-align:center">
                <Row class="mar-tb-15">
                    <Col span="12" align="right" class="pad-r-10">员工号：</Col>
                    <Col span="12" align="left" class="pad-l-10">{{this.personCode}}</Col>
                </Row>
                <Row class="mar-b-15">
                    <Col span="12" align="right" class="pad-r-10">姓名：</Col>
                    <Col span="12" align="left" class="pad-l-10">{{this.personName}}</Col>
                </Row>
                <Row>
                    <Col span="12" align="right" class="pad-r-10">班组：</Col>
                    <Col span="12" align="left" class="pad-l-10">{{this.teamName}}</Col>
                </Row>
            </div>
        </Modal>
        <Modal v-model="chargeForStartBottom" title="" :closable="false">
            <div style="text-align:center">
                <Row class="mar-tb-15">
                    <Col span="8" align="right" class="pad-r-10">信息提示：</Col>
                    <Col span="12" align="left" class="pad-l-10">{{this.msg}}</Col>
                </Row>
            </div>
        </Modal>

        <Modal v-model="equipment_local" title="设备地点名称"  >
            <Row>
                <Col span="22" offset="2">
                <Tree :data="baseData" show-checkbox :multiple="false" :show-checkbox="false" @on-select-change="getLocationId" class="max-h-300"></Tree>
                </Col>
            </Row>
        </Modal>
        <Modal v-model="equipment_chk" title="设备选择" width="600" @on-ok="selectEquipment">
            <Transfer :data="equipment_chk_data" :target-keys="equipment_chk_targetKeys" :list-style="listStyle"  filterable :render-format="render" @on-change="handleChange4"></Transfer>
        </Modal>

        <!--<Modal v-model="checkOut" title="签出原因">
            <Radio-group :model.sync="checkOutReason" vertical class="mar-l-25">
                <Radio label="forMaterial">
                    <span>备品备件领取</span>
                </Radio>
                <Radio label="standardWork">
                    <span>临时紧急维修任务</span>
                </Radio>
                <Radio label="department">
                    <span>班组交接</span>
                </Radio>
                <Radio label="other">
                    <span>其他原因</span>
                </Radio>
            </Radio-group>
        </Modal>-->
        <Modal v-model="checkOut" title="签出原因" @on-ok="selectCs">
            <table class="table">
                <!--table table-bordered table-center table-striped table-blue-->
                <thead>
                <tr>
                    <!--<th>选择</th>-->
                    <!--<th>序号</th>-->
                    <!--<th>标准方案编码</th>-->
                    <th></th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(ss, index) in checkOuts">
                    <td cellpadding="0">
                        <div v-html="ss.radio"></div>
                    </td>
                    <!--<td>{{index + 1}}</td>-->
                    <!--<td>{{ss.code}}</td>-->
                    <td cellpadding="0">{{ss.reason}}</td>
                </tr>
                </tbody>
            </table>
        </Modal>
        <Modal v-model="rejects" title="驳回原因" @on-ok="selectSs">
            <table class="table">
                <!--table table-bordered table-center table-striped table-blue-->
                <thead>
                <tr>
                    <!--<th>选择</th>-->
                    <!--<th>序号</th>-->
                    <!--<th>标准方案编码</th>-->
                    <th></th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(ss, index) in tpmss">
                    <td cellpadding="0">
                        <div v-html="ss.radio"></div>
                    </td>
                    <!--<td>{{index + 1}}</td>-->
                    <!--<td>{{ss.code}}</td>-->
                    <td cellpadding="0">{{ss.reason}}</td>
                </tr>
                </tbody>
            </table>
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
                load_fix: false,
                flag:false,
                load_fix_temporary:false,
                button_14551: this.$rt('14551'),
                button_14552: this.$rt('14552'),
                button_14553: this.$rt('14553'),
                button_14554: this.$rt('14554'),
                itemMaterialQuantityDisable: false,
                modal1: false,

                checkOut:false,
                checkOutReason:'standardWork',
                rejects:false,
                rejectReason:'1',

                equipment_local:false,
                equipment_chk:false,
                equipment_chk_data: this.getMockData(),
                equipment_chk_targetKeys: this.getTargetKeys(),
                listStyle: {
                    width: '250px',
                    height: '300px'
                },


                fault_cause: false,
                material_code: false,
                device_modal:false,
                work_code:false,
                fault_desc: this.getMockData(),
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
                    //actualTime: '',
                    //note: '',
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
            }
        },

        mounted(){
            if(this.$route.query.workOrderId) {
                this.getDetail(this.$route.query.workOrderId);
            }else {
                this.$Message.error("页面有错误，请重新进入！");
                this.button_14551 = false;
                this.button_14552 = false;
                this.button_14553 = false;
            }
        },

        methods: {

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


            getInfo:function() {
                 this.$axios.post("tpmWorkOrder/startExecute",
                     {
                         'workOrderId': this.$route.query.workOrderId
//                        'personId':"1"
                     }
                 ).then((res) =>{
                     let vm = this;
                     console.log("开始维护入口:"+res);
                     if (res.data.response.code=-1) {
//                        this.load_fix = true;
                         this.msg=res.data.response.msg;
//                        res=eval('(' + res.request.responseText + ')');
                         let  res_new=JSON.parse(res.request.responseText);
                         /**
                          * 当再次进入开始维护的时候
                          * @type {Array}
                          */
                         if(res_new.response.code===1){
//                            let res_data = res_new.response.data;
                             this.$axios.post("tpmWorkOrder/workOrderExecute",
                                 {
                                     'workOrderId': this.$route.query.workOrderId
                                 }
                             ).then((res) =>{
                                 console.log("查询workOrder:"+res);
                                 vm.data_man=res.data.response.data.workOrderListExecutions;
//                                window.location.reload();
                                 history.go(0);
                             })
                             this.button_14551 = false;
//                             this.button_14552 = true;
//                             this.button_14553 = true;
                         }else{
                             vm.$Message.error(res_new.response.msg);
                         }

                     }else{
                         /**
                          * 就是当返回不成功的时候，比如该用户没有权限，那么需要提示该用户没有相关的权限，用弹窗进行提示
                          */
                         console.log("开始维护入口:"+res);
                     }
                 })
             },

            getPersonInfo(personId){
                //let personId = parent.window.maintainCard ;
//                let personId = '1';
                this.$axios.post("tpmWorkOrder/maintainCardExecute",
                    {
                        'maintainCard': personId
                    }
                ).then((res) => {
                    let vm = this;
                    console.log("维护完成入口" + res);
                    this.chargeForStartN = false;
                    this.chargeForStart = true;
                    this.teamName = res.data.response.data["teamName"];
                    this.personCode = res.data.response.data["personCode"];
                    this.personName = res.data.response.data["personName"];
                    let interval = window.setInterval(function () {
                        if ((vm.backTime--) <1) {
                            vm.chargeForStart = false;
                            window.clearInterval(interval);
//                            vm.getInfo();
                            vm.getWorkDetail();
                        }
                    }, 1000);
                })
            },

            getWorkDetail(){
                let vm=this;
                this.$axios.post("tpmWorkOrder/workOrderExecute",
                    {
                        'workOrderId': this.$route.query.workOrderId
                    }
                ).then((res) =>{
                    console.log("查询workOrder:"+res);
                    vm.data_man=res.data.response.data.workOrderListExecutions;
                    history.go(0);
                })
                this.button_14551 = false;
            },
            //            倒计时
            send() {

                /**
                 * 首先进来之后，判断用户是否具有工单权限
                 */
                let vm = this;
                this.$axios.post("tpmWorkOrder/startExecute",
                    {
                        'workOrderId': this.$route.query.workOrderId
//                        'personId':"1"
                    }
                ).then((res) =>{

//                    if (res.data.response.code===1) {
                        this.msg=res.data.response.msg;
//                        res=eval('(' + res.request.responseText + ')');
                        let  res_new=JSON.parse(res.request.responseText);
                        if(res_new.response.code===1){
//                           //实际刷卡上线后，就使用这个调用相应的参数
                            //let personId = parent.window.maintainCard ;
                            let personId = '2';
                            this.$axios.post("tpmWorkOrder/maintainCardExecute",
                                {
                                    'maintainCard': personId
                                }
                            ).then((res) =>{
                                let vm=this;

                                /**
                                 * 此处去后台查询是否存在相关的人物信息，根据返回的结果判断
                                 * 如果存在相应的人物信息，就进行人物信息的加载，然后展示在弹窗中，然后进行开始维护
                                 * 并且需要在这个途中不断的去获取该用户是否刷卡，如何有刷卡那么久中断等待，直接开始查询，否则就不进行查询
                                 * 如果不存在就不展示，并且提示无该人物的信息，并且不进行开始维护
                                 */

                                if(res.data.response.code===1) {
//                        this.fc.datetimeToDate()
                                    console.log("开始入口" + res);
                                    this.chargeForStart = true;
                                    this.teamName = res.data.response.data["teamName"];
                                    this.personCode = res.data.response.data["personCode"];
                                    this.personName = res.data.response.data["personName"];
                                    let interval = window.setInterval(function () {
                                        if ((vm.backTime--) === 1) {
                                            vm.chargeForStart = false;
                                            window.clearInterval(interval);
//                                            vm.getInfo();
                                            vm.getWorkDetail();
                                        }
                                    }, 1000);
                                }else{
                                    this.chargeForStartN = true;
                                    let time=1;
                                    let interval = window.setInterval(function () {
                                        let  personId=parent.window.maintainCard;
                                        if(time==2){
                                            this.personId=1;
                                            if(typeof(this.personId)!="undefined"){
                                                vm.getPersonInfo(this.personId);
                                            }
                                        }
                                        if ((vm.backTime--) <= 0) {
                                            vm.backTime = 5,
                                                this.chargeForStartN = false;
                                            window.clearInterval(interval);
                                        }
                                        time++;
                                    }, 1000);
                                };
                            })
                        }else{
                            vm.$Message.error(res_new.response.msg);
                        }
//                    }
                })
//                parent.window.maintainCard = undefined;

            },

            sendBottom() {
                let vm = this;
                vm.chargeForStartBottom = true;
            },

            /**
             * 维护完成入口
             */
             finishExecute:function () {
                this.load_fix = true;
                let vm = this;
                let orderMaterialIds='';
                let orderMaterialQuantities='';
                for(let o in vm.data_material) {
                    orderMaterialIds += vm.data_material[o].materialId+",";
                    orderMaterialQuantities += vm.data_material[o].quantity+",";
                }
                this.$axios.post("tpmWorkOrder/finishExecute",
                    {
                        'workOrderId': this.$route.query.workOrderId,
                        'orderMaterialIds':orderMaterialIds,
                        'orderMaterialQuantities':orderMaterialQuantities
                    }
                ).then((res) =>{
                    console.log("维护完成入口"+res);
                    if (res.data.response.code=-1) {
//                        this.msg=res.data.response.msg;
                        this.load_fix = true;
                        setTimeout(function(){
                            vm.$router.push({path: '/unRepaired'});
                        },1000);

                    }else{

                    }

                });

            },

            /**
             * 临时迁出入口
             */
            chargeForStartT:function () {
                let vm=this;
                this.checkOut = true;
                this.$axios.post('tpmWorkOrder/orderExecuteReason',{
                    'typeNum':0,
                }).then((res) =>{
                    let dataRes = res.data.response.data;
                    vm.checkOuts = new Array();
                    for (let o in dataRes.Rows) {
                        let obj = {};
                        obj["id"] = dataRes.Rows[o]["id"];
                        obj["reason"] = dataRes.Rows[o]["reason"];
                        obj["radio"] = "<input type='radio' name='checkOuts_radio' value='" + dataRes.Rows[o]["id"] + "'>";
                        vm.checkOuts.push(obj);
                    }
                })
            },

           /* /!**
             * 临时迁出原因选择  保存
             *
             *!/
            selectCs: function () {
                let vm = this;
                let orderMaterialIds='';
                let orderMaterialQuantities='';
                for(let o in vm.data_material) {
                    orderMaterialIds += vm.data_material[o].materialId+",";
                    orderMaterialQuantities += vm.data_material[o].quantity+",";
                }
                let reasonId = this.$jq("input[name='checkOuts_radio']:checked").val();

                console.log(reasonId+"---------");
                console.log(this.$route.query.workOrderId+"---------");
                this.$axios.post('tpmWorkOrder/orderSavecheckOutReason',{
                    'reasonId': reasonId,
                    'workOrderId': this.$route.query.workOrderId
                }).then((res) => {

                    if(res.data.response.code===1){
                        this.$Message.success("临时迁出原因保存成功");
//                        vm.$router.push({path: '/maintenanceOrder'});
                        this.$axios.post("tpmWorkOrder/temporaryStopExecute",
                            {
                                // req.getParameter("orderMaterialIds"), req.getParameter("orderMaterialQuantities"));
                                'workOrderId': this.$route.query.workOrderId,
                                'orderMaterialIds':orderMaterialIds,
                                'orderMaterialQuantities':orderMaterialQuantities
                                //
                            }
                        ).then((res) =>{
                            history.go(0);
                            console.log("临时迁出入口"+res);
                            if (res.data.response.code===1) {
                                this.load_fix_temporary = true;
                                this.msg=res.data.response.msg;
                                setTimeout(function(){
                                    vm.$router.push({path: '/unRepaired', query: {"tabName":1}});
                                },1000);
                            }
                        })
                    }else{
                        this.$Message.error("临时迁出原因保存失败，请重新选择");
                    }

                })
            },*/


            /**
             * 临时迁出原因选择  保存
             *
             */
            selectCs: function () {
                let vm = this;
                let orderMaterialIds='';
                let orderMaterialQuantities='';
                for(let o in vm.data_material) {
                    orderMaterialIds += vm.data_material[o].materialId+",";
                    orderMaterialQuantities += vm.data_material[o].quantity+",";
                }
                let reasonId = this.$jq("input[name='checkOuts_radio']:checked").val();

                console.log(reasonId+"---------");
                console.log(this.$route.query.workOrderId+"---------");
                this.$axios.post('tpmWorkOrder/orderSavecheckOutReason',{
                    'reasonId': reasonId,
                    'workOrderId': this.$route.query.workOrderId,
                    'orderMaterialIds':orderMaterialIds,
                    'orderMaterialQuantities':orderMaterialQuantities
                }).then((res) => {
                        if(res.data.response.code===1){
                            this.$Message.success("临时迁出原因保存成功");
    //                        vm.$router.push({path: '/maintenanceOrder'});
                                console.log("临时迁出入口"+res);
                                    this.load_fix_temporary = true;
                                    this.msg=res.data.response.msg;
                                    setTimeout(function(){
                                        vm.$router.push({path: '/unRepaired', query: {"tabName":1}});
                                    },1000);
                    }else{
                            this.$Message.error("临时迁出原因保存失败，请重新选择");
                        }
                })
            },

            /**
             * 开始维护入口
             */

            chargeForStartF:function () {
                this.getInfo();//不含有刷卡功能的开始维护功能
//                this.send();//含有刷卡功能的开始维护功能
            },

            /**
             * 驳回入口
             */
            chargeTurnDown:function () {
                let vm = this;
                this.rejects=true;
                this.$axios.post('tpmWorkOrder/orderExecuteReason',{
                    'typeNum':1,
                }).then((res) =>{
                    let dataRes = res.data.response.data;
                    vm.tpmss = new Array();
                    for (let o in dataRes.Rows) {
                        let obj = {};
                        obj["id"] = dataRes.Rows[o]["id"];
                        obj["reason"] = dataRes.Rows[o]["reason"];
                        obj["radio"] = "<input type='radio' name='tpmss_radio' value='" + dataRes.Rows[o]["id"] + "'>";
                        vm.tpmss.push(obj);
                    }

                })
            },

            /**
             * 驳回原因选择  保存
             *
             */
            selectSs: function () {
                let vm = this;
                let reasonId = this.$jq("input[name='tpmss_radio']:checked").val();
                console.log(reasonId+"---------");
                console.log(this.$route.query.workOrderId+"---------");
                this.$axios.post('tpmWorkOrder/orderSaveReason',{ 'reasonId': reasonId,'workOrderId': this.$route.query.workOrderId}).then((res) => {
                    if(res.data.response.code===1){
                        this.$Message.success("驳回原因保存成功");
                        vm.$router.push({path: '/unRepaired'});
                    }else{
                        this.$Message.error("驳回原因保存失败，请重新选择");
                    }

                })
            },



    //            检查数字输入框正整数
            checkInt:function(val){
                if(!Number.isInteger(val)){
                    this.$Message.error('请输入整数!');
                }
            },

            addWorkflow: function(){
                this.data_workflow.push(this.$fc.cloneKey(this.new_data_workflow));
                // 添加完newPerson对象后，重置newPerson对象
            },
            addMaterial: function(){
                this.data_material.push(this.$fc.cloneKey(this.new_data_material));
                // 添加完newPerson对象后，重置newPerson对象
            },
            del: function(index){
                // 删一个数组元素
                this.date.splice(index,1);
            },
            getTr: function (selection,row,index) {
                console.log(selection);
            },
            getMockData () {
                let mockData = [];
                for (let i = 1; i <= 20; i++) {
                    mockData.push({
                        key: i.toString(),
                        label: '内容' + i,
                        description: '内容' + i + '的描述信息',
                        disabled: Math.random() * 3 < 1
                    });
                }
                return mockData;
            },
            render_desc (item) {
                return item.label;
            },
            handleChange_desc (newTargetKeys, direction, moveKeys) {
                this.blur_hitch_desc=false;
                console.log(newTargetKeys);
                console.log(direction);
                console.log(moveKeys);
                this.target_desc = newTargetKeys;
            },
            hitch_whereChangeHandler(item){
                this.blur_hitch_where=false;
            },
            removeWorkFlow: function (index) {
                this.data_workflow.splice(index, 1);
            },
            removeMaterial: function (index) {
                this.data_material.splice(index, 1);
            },

            /****************************   获取编辑页初始化信息  start **************************************************/
            getDetail:function(workOrderId){
                let vm = this;
                this.$axios.post('tpmWorkOrder/orderExecute', {
                    workOrderId: workOrderId,
                }).then((res) =>{
                    if(res.data.response.code != 1) {
                        vm.button_14551 = false;
                        vm.button_14552 = false;
                        vm.button_14553 = false;
                        vm.$Message.error(res.data.response.msg);
                        return;
                    }
                    let res_data = res.data.response.data;
                    if(res_data.notFinished !== undefined && res_data.notFinished == true) {
                        vm.button_14551 = false;
                        vm.itemMaterialQuantityDisable = false;
                    }else {
                        vm.itemMaterialQuantityDisable = true;
                        vm.button_14552 = false;
                        vm.button_14553 = false;
                    }
                    vm.maintenanceForm = res_data.order;
                    vm.maintenanceForm.equipmentName = res_data.equipment.equipmentName;
                    vm.maintenanceForm.requiredTime = Math.round(parseFloat(vm.maintenanceForm.num02) * 60);
                    vm.maintenanceForm.solutionCode = res_data.standardSolution.code;
                    vm.maintenanceForm.solutionName = res_data.standardSolution.name;
                    vm.maintenanceForm.solutionVersion = res_data.standardSolutionVersion.version;
                    if(res_data.fault !== undefined) {
                        vm.maintenanceForm.faultDescription = res_data.fault.faultDescription;
                        vm.maintenanceForm.confirmedFaultPosition = res_data.fault.confirmedFaultPosition;
                        vm.maintenanceForm.confirmedCauseOfFault = res_data.fault.confirmedCauseOfFault;
                    }else {
                        vm.maintenanceForm.faultDescription = undefined;
                    }

                    /*执行明细*/
                    vm.data_man = res_data.workOrderExecutions;
//                    console.log("vm.data_man: " + JSON.stringify(vm.data_man))
                    /*作业项目*/
                    vm.data_workflow = res_data.workOrderActions;
                    for(let o in vm.data_workflow) {
                        vm.data_workflow[o].requiredTime = Math.round(parseFloat(vm.data_workflow[o].requiredTime) * 60 );
                    }
                    /*备品备件需求*/
                    vm.data_material = res_data.materialArr;
                }).catch((err) =>{
                    console.log(err);
                })
            },
            /****************************   获取编辑页初始化信息  end **************************************************/
        }
    }
</script>
