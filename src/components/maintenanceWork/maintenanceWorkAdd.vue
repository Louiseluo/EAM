<template>
    <div class="basic fault-content">
        <!--模块名称-->
        <div class="title">
            <span>紧急维修</span>
        </div>
        <!--表单-->
        <div class="form-content">
            <Form ref="maintenanceForm" :model="maintenanceForm" label-position="right" inline :label-width="120">
                <Form-item label="单据类型" prop="billType">
                    <Input v-model="maintenanceForm.billType" style="width: 160px;" placeholder="" disabled></Input>
                </Form-item>
                <Form-item label="工单编号" prop="billNo">
                    <Input v-model="maintenanceForm.billNo" style="width: 160px;" placeholder="" disabled></Input>
                </Form-item>
                <Form-item label="工单状态" prop="status" >
                    <Select v-model="maintenanceForm.status" style="width: 160px;" disabled>
                        <Option value="01">制单中</Option>
                        <Option value="02">生效中</Option>
                        <Option value="03">进行中</Option>
                        <Option value="04">已作废</Option>
                        <Option value="05">免维保</Option>
                    </Select>
                </Form-item>
                <Form-item label="设备名称" prop="equipmentName">
                    <div class="input-search">
                        <Input v-model="maintenanceForm.equipmentName" style="width: 160px;" disabled></Input>
                        <Button icon="ios-search" @click="device_modal = true"></Button>
                    </div>
                    <!--<Input v-model="maintenanceForm.equipmentName" style="width: 160px;" placeholder=""></Input>-->
                </Form-item>
                <Form-item label="计划维保时间" prop="plannedRunTime">
                    <Date-picker type="datetime" v-model="maintenanceForm.plannedRunTime" placeholder="选择日期和时间" style="width: 160px" disabled></Date-picker>
                </Form-item>
                <Form-item label="预计耗时（分钟）" prop="requiredTime">
                    <Input v-model="maintenanceForm.requiredTime" style="width: 160px;" placeholder=""></Input>
                </Form-item>
                <Form-item label="是否需要停机" prop="needShutdown">
                    <i-switch v-model="maintenanceForm.needShutdown">
                        <span slot="open">是</span>
                        <span slot="close">否</span>
                    </i-switch>
                </Form-item>
				<Form-item label="标准方案编码" prop="code">
                    <div class="input-search">
                        <Input v-model="maintenanceForm.code" style="width: 160px;" disabled></Input>
                        <Button icon="ios-search" @click="work_code = true"></Button>
                    </div>
					<!--<Input v-model="maintenanceForm.code" style="width: 160px;" placeholder=""></Input>-->
				</Form-item>
				<Form-item label="标准方案名称" prop="name">
					<Input v-model="maintenanceForm.name" style="width: 160px;" placeholder=""></Input>
				</Form-item>
				<Form-item label="版本" prop="version">
					<Input v-model="maintenanceForm.version" style="width: 160px;"></Input>
				</Form-item>
                <Form-item label="故障描述" prop="faultDescription">
                    <!--<Transfer :data="fault_desc" :target-keys="target_desc" :render-format="render_desc" @on-change="handleChange_desc"></Transfer>-->
                    <div class="input-search">
                        <Input v-model="maintenanceForm.faultDescription" style="width: 160px;" disabled></Input>
                        <Button icon="ios-search" @click="faultDescription = true"></Button>
                    </div>
                </Form-item>
				<Form-item label="故障位置" prop="confirmedFaultPosition">
                    <Select style="width: 160px;" :disabled="blur_hitch_desc" @on-change="hitch_whereChangeHandler" multiple v-model="cause_where">
                        <Option v-for="item in cityList" :value="item.value" :key="item">{{ item.label }}</Option>
                    </Select>
                </Form-item>
                <Form-item label="故障原因" prop="confirmedCauseOfFault">
                    <div class="input-search">
                        <Input v-model="maintenanceForm.confirmedCauseOfFault" style="width: 160px;" placeholder="" :disabled="blur_hitch_where" disabled></Input>
                        <Button icon="ios-search" @click="fault_cause = true"></Button>
                    </div>
                </Form-item>
                <!--<Form-item label="注意事项" prop="Remark">
                    <Input v-model="maintenanceForm.Remark" type="textarea" style="width: 400px;" :autosize="{minRows: 2,maxRows: 5}" placeholder=""></Input>
                </Form-item>


                <Form-item label="实际耗时（分钟）" prop="actualTime">
                    <Input v-model="maintenanceForm.actualTime" style="width: 160px;" placeholder=""></Input>
                </Form-item>
                <Form-item label="故障描述" prop="note">
                    <Input v-model="maintenanceForm.note" type="textarea" style="width: 800px;" :autosize="{minRows: 2,maxRows: 5}" placeholder=""></Input>
                </Form-item>
				-->
            </Form>
        </div>
        <div class="mar-b-15">实际累计耗时<span class="col-orange mar-lr-10 font-28">57</span>分钟</div>
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
                            <th>是否完成</th>
                            <th>操作</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="(itemWorkflow,index) in data_workflow">
                            <td>{{index + 1}}</td>
                            <td><Input type="text" v-model="itemWorkflow.workflow_content"></Input></td>
                            <td><Input type="text" v-model="itemWorkflow.standards"></Input></td>
                            <td><Input type="text" v-model="itemWorkflow.standards_time"></Input></td>
                            <td><Checkbox v-model="itemWorkflow.doneOrNo"></Checkbox></td>
                            <td><a class="mar-r-5" size="small" @click="removeWorkFlow(index)">删除</a></td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div class="mar-t-10">
                    <Button type="primary" icon="plus-round" size="small" @click="addWorkflow">添加</Button>
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
                            <th>操作</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="(itemMaterial,index) in data_material">
                            <td>{{index + 1}}</td>
                            <td>
                                <div class="input-search">
                                    <Input v-model="itemMaterial.material_id" disabled></Input>
                                    <Button icon="ios-search" @click="material_code = true"></Button>
                                </div>
                            </td>
                            <td>{{itemMaterial.material_name}}</td>
                            <td>{{itemMaterial.material_unit}}</td>
                            <td><Input type="text" v-model="itemMaterial.material_num"></Input></td>
                            <td>{{itemMaterial.material_type}}</td>
                            <td><a class="mar-r-5" size="small" @click="removeMaterial(index)">删除</a></td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div class="mar-t-10">
                    <Button type="primary" icon="plus-round" size="small" @click="addMaterial">添加</Button>
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
				<Button type="primary" icon="card" size="large">开始维护</Button>
				<Button type="primary" icon="card" size="large">临时签出</Button>
				<Button type="primary" icon="ios-folder-outline" size="large">单据保存</Button>
				<router-link to="searchList" style="margin: 0px 20px;">
					<Button type="primary" icon="ios-paper-outline" size="large">维护完成</Button>
				</router-link>
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
        <Modal v-model="faultDescription" title="故障描述选择">
            <table class="table table-bordered table-center table-striped table-blue">
                <thead>
                <tr>
                    <th>选择</th>
                    <th>序号</th>
                    <th>故障描述</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(reason,index) in faultDescriptionList">
                    <!--<td><div v-html="dept.radio"></div></td>-->
                    <td><input type='radio' name='faultDescription'></td>
                    <td>{{index+1}}</td>
                    <td>{{reason.resaon}}</td>
                </tr>
                </tbody>
            </table>
            <div class="mar-t-10" style="overflow: hidden">
                <div style="float: right;">
                    <Page :total="20" size="small" show-elevator :page-size="5" @on-change=""></Page>
                    <!--<Page :total="tpmDeptTotal" size="small" show-elevator :page-size="pageSize" @on-change="initTpmDept"></Page>-->
                </div>
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
                modal1: false,
                fault_cause: false,
                material_code: false,
                device_modal:false,
                work_code:false,
                fault_desc: this.getMockData(),
                target_desc: [],
                blur_hitch_desc: true,
                blur_hitch_where: true,
                //                故障原因弹出框
                faultDescription:false,
                faultDescriptionList:[
                    {
                        faultId:0,
                        resaon:'坏了'
                    },
                    {
                        faultId:1,
                        resaon:'真的坏了'
                    },
                    {
                        faultId:2,
                        resaon:'我也不知道为啥坏了'
                    },
                    {
                        faultId:3,
                        resaon:'就是坏了'
                    },
                ],

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

                maintenanceForm:{
                    billType: "维修",
                    billNo: "M1612150001",
                    status: '01',
                    equipmentName: "压铸岛1号设备",
                    plannedRunTime: '',
                    requiredTime: '',
                    needShutdown: true,
                    code: '',
                    name: '',
                    version: '',
					faultDescription: '',
                    confirmedFaultPosition: "",
                    confirmedCauseOfFault: "",
					Remark: '',
                    //actualTime: '',
                    //note: '',
                },

                columns_man: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 80,
                        align: 'center'
                    },
                    {
                        title: '工号',
                        key: 'man_num',
                        align: 'center',
                    },
                    {
                        title: '姓名',
                        key: 'man_name',
                        align: 'center',
                    },
                    {
                        title: '班组',
                        key: 'man_group',
                        align: 'center',
                    },
                    {
                        title: '签入时间',
                        key: 'start_time',
                        align: 'center',
                    },
                    {
                        title: '签出时间',
                        key: 'finish_time',
                        align: 'center',
                    },
                    {
                        title: '实际工时（分钟）',
                        key: 'duration',
                        align: 'center',
                    },
                ],
                data_man:[
                    {
                        man_num:'1001',
                        man_name:'张三',
                        man_group: '电工组',
                        start_time: '09:03',
                        finish_time: '12:00',
                        duration: '177',
                    },
                    {
                        man_num:'1002',
                        man_name:'张三',
                        man_group: '机修一组',
                        start_time: '09:03',
                        finish_time: '12:00',
                        duration: '177',
                    },
                ],
                workflow: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '序号',
                        type: 'index',
                        width: 80,
                        align: 'center'
                    },
                    {
                        title: '作业内容',
                        key: 'workflow_content',
                        align: 'center',
                        render:(h,params) => {
                            return h('Input',{props: {value:params.row.workflow_content}})
                        }
                    },
                    {
                        title: '标准要求',
                        key: 'standards',
                        align: 'center',
                        render:(h,params) => {
                            return h('Input',{props: {value:params.row.standards}})
                        }
                    },
                    {
                        title: '标准工时（分钟）',
                        key: 'standards_time',
                        align: 'center',
                        width: 200,
                        render:(h,params) => {
                            return h('Input',{props: {value:params.row.standards_time}})
                        }
                    },
                    {
                        title: '是否完成',
                        key: 'do_or_no',
                        align: 'center',
                        width: 100,
                        render:(h,params) => {
                            return h('Checkbox')
                        }
                    },
                ],
                new_data_workflow: {
                    workflow_content:'',
                    standards:'',
                    standards_time: '',
                    do_or_no: '',
                },
                data_workflow:[
                    {
                        workflow_content:'设备断电',
                        standards:'先关闭工控主机，后设备断电。',
                        standards_time: '5',
                        doneOrNo: true,
                    },
                    {
                        workflow_content:'安全隔离',
                        standards:'人员通道放置隔离护栏。',
                        standards_time: '5',
                        doneOrNo: false,
                    },
                    {
                        workflow_content:'排出废机油',
                        standards:'放置收集器，打开放油螺栓，确保机油排放干净。',
                        standards_time: '5',
                        doneOrNo: false,
                    },
                    {
                        workflow_content:'加入新机油',
                        standards:'拧紧放油螺栓，确认机油标号正确后，倒入适量机油。',
                        standards_time: '5',
                        doneOrNo:true,
                    },
                    {
                        workflow_content:'打扫现场',
                        standards:'保持现场干净整洁，无明显油污。',
                        standards_time: '5',
                        doneOrNo: true,
                    },
                ],
                material: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '序号',
                        type: 'index',
                        width: 80,
                        align: 'center'
                    },
                    {
                        title: '备品备件编码',
                        key: 'material_id',
                        align: 'center',
                        render:(h,params) => {
                            return h('Input',{props: {value:params.row.material_id}})
                        }
                    },
                    {
                        title: '备品备件名称',
                        key: 'material_name',
                        align: 'center',
                        render:(h,params) => {
                            return h('Input',{props: {value:params.row.material_name}})
                        }
                    },
                    {
                        title: '单位',
                        key: 'material_unit',
                        align: 'center',
                        render:(h,params) => {
                            return h('Input',{props: {value:params.row.material_unit}})
                        }
                    },
                    {
                        title: '计划数',
                        key: 'material_num',
                        align: 'center',
                        render:(h,params) => {
                            return h('Input',{props: {value:params.row.material_num}})
                        }
                    },
                    {
                        title: '实际使用数',
                        key: 'material_use_num',
                        align: 'center',
                        render:(h,params) => {
                            return h('Input',{props: {value:params.row.material_use_num}})
                        }
                    },
                ],
                new_data_material: {
                    material_id:'',
                    material_name:'',
                    material_unit: '',
                    material_num: '',
                    material_use_num: '',
                },
                data_material:[
                    {
                        material_id:'M001',
                        material_name:'机油滤清器',
                        material_unit: '只',
                        material_num: '1',
                        material_use_num: '1',
                    },
                    {
                        material_id:'M002',
                        material_name:'国标46号抗磨液压油',
                        material_unit: 'L',
                        material_num: '5',
                        material_use_num: '4.5',
                    },
                ],
//                columns_cause: [
//                    {
//                        type: 'selection',
//                        width: 60,
//                        align: 'center',
//                    },
//                    {
//                        title: '序号',
//                        type: 'index',
//                        width: 80,
//                        align: 'center',
//                    },
//                    {
//                        title: '故障原因',
//                        key: 'code',
//                    },
//                ],
//                data_cause: [
//                    {
//                        code: '电机损坏',
//                    },
//                    {
//                        code: '电机损坏',
//                    },
//                    {
//                        code: '电机损坏',
//                    },
//                ],
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
            }
        },

        methods: {
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
        }
    }
</script>
