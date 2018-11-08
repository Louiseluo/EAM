<template>
    <div class="basic fault-content">
        <Spin fix v-show="load_fix">
            <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
            <!--<div>保存中，请稍后...</div>-->
            <div>{{this.load_fix_info}}</div>
        </Spin>
        <!--模块名称-->
        <div class="title">
            <span>操作工上报</span>
        </div>
        <!--<div class="">
            <div class="second-title">故障上报</div>
            <Form ref="workForm" :model="workForm" :rules="ruleValidate" label-position="right" inline :label-width="100">
                <Form-item label="设备名称" prop="applicableEquipment">
                    <div class="input-search">
                        <Input v-model="workForm.applicableEquipment" style="width: 160px;" disabled></Input>
                        <Button icon="ios-search" @click="device_modal = true"></Button>
                    </div>
                </Form-item>
                <Form-item label="故障描述" prop="content">
                    <div class="input-search">
                        <Input v-model="workForm.content" style="width: 160px;" disabled></Input>
                        <Button icon="ios-search" @click="getfaultDescription(1)"></Button>
                    </div>
                </Form-item>
                <Form-item label="设备是否停机" prop="needShutdown">
                    <div style="width: 160px;">
                        <i-switch v-model="workForm.needShutdown">
                            <span slot="open">是</span>
                            <span slot="close">否</span>
                        </i-switch>
                    </div>
                </Form-item>
                <Button class="mar-10" type="primary" @click="jockeySaveFault('workForm')">确认上报</Button>
            </Form>
        </div>-->
        <div class="mar-t-15">
            <!--<div class="second-title">计划停机上报</div>-->
            <Form ref="workForm2" :model="workForm2" :rules="ruleValidate2" label-position="right" inline :label-width="100">
                <Form-item label="设备选择" prop="applicableEquipment">
                    <div class="input-search">
                        <Input v-model="workForm2.applicableEquipment" style="width: 160px;" disabled></Input>
                        <Button icon="ios-search" @click="equipment_chk = true"></Button>
                    </div>
                </Form-item>
                <Form-item label="故障描述" prop="content">
                    <div class="input-search">
                        <Input v-model="workForm2.content" style="width: 160px;" disabled></Input>
                        <Button icon="ios-search" @click="getfaultDescription(1)"></Button>
                    </div>
                </Form-item>
                <Button class="mar-10" type="primary" @click="jockeySavePlanFault('workForm2')">上报故障</Button>
            </Form>
        </div>

        <!--modal-->
        <Modal v-model="device_modal" title="设备编码" width="820" @on-ok="selectSb">
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
        <Modal v-model="device_modal2" title="设备编码" width="820" @on-ok="selectSb2">
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
            <!--<i-table stripe border :content="self" :columns="device_columns" :data="device_data" @on-selection-change="selectDept"></i-table>-->
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
        <Modal v-model="team_code" title="责任班组" @on-ok="selectTeam">
            <table class="table table-bordered table-center table-striped table-blue PersonnelRequirement">
                <thead>
                <tr>
                    <th>选择</th>
                    <th>序号</th>
                    <th>班组编码</th>
                    <th>班组名称</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(team,index) in tpmTeam">
                    <td><div v-html="team.innerhtml"></div></td>
                    <td>{{index+1}}</td>
                    <td>{{team.teamCode}}</td>
                    <td>{{team.teamName}}</td>
                </tr>
                </tbody>
            </table>
            <div class="mar-t-10" style="overflow: hidden">
                <div style="float: right;">
                    <Page :total="tpmTeamTotal" size="small" show-elevator :page-size="teamSize" @on-change="changeTeamPage"></Page>
                    <!--<Page :total="tpmDeptTotal" size="small" show-elevator :page-size="pageSize" @on-change="initTpmDept"></Page>-->
                </div>
            </div>
        </Modal>

        <Modal v-model="faultDescription" title="故障描述选择"  @on-ok="selectFaultDesc">
            <table class="table table-bordered table-center table-striped table-blue faultDescriptionS">
                <thead>
                <tr>
                    <th>选择</th>
                    <th>序号</th>
                    <th>故障描述</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(fd,index) in faultDescriptionList">
                    <!--<td><div v-html="dept.radio"></div></td>-->
                    <td><div v-html="fd.innerhtml"></div></td>
                    <td>{{index+1}}</td>
                    <td>{{fd.content}}</td>
                </tr>
                </tbody>
            </table>
            <div class="mar-t-10" style="overflow: hidden">
                <div style="float: right;">
                    <Page :total="tpmfaultDescriptionTotal" size="small" show-elevator :page-size="faultDescriptionSize" @on-change="changeFaultDescriptionPage"></Page>
                    <!--<Page :total="tpmDeptTotal" size="small" show-elevator :page-size="pageSize" @on-change="initTpmDept"></Page>-->
                </div>
            </div>
        </Modal>

        <Modal v-model="fault_cause_add" title="请输入其他故障描述">
            <Input placeholder="请输入..." ></Input>
        </Modal>
        <Modal v-model="chargeForStart" title="" :closable="false">
            <p slot="header" style="color:#f60;text-align:center">
                <Icon type="information-circled"></Icon>
                <span>{{ this.chargeTime }}</span>
            </p>
            <div style="text-align:center">
                <p class="pad-20 bg-linegary">
                    <label class="font-28 pad-r-20" >请刷卡</label>
                    <Button type="primary" size="small" class="mar-l-25">{{ this.backTime + '秒后自动返回' }}</Button>
                </p>
                <Row class="mar-tb-15">
                    <Col span="12" align="right" class="pad-r-10">员工号：</Col>
                    <Col span="12" align="left" class="pad-l-10">65465465</Col>
                </Row>
                <Row class="mar-b-15">
                    <Col span="12" align="right" class="pad-r-10">姓名：</Col>
                    <Col span="12" align="left" class="pad-l-10">张成峰</Col>
                </Row>
                <Row>
                    <Col span="12" align="right" class="pad-r-10">班组：</Col>
                    <Col span="12" align="left" class="pad-l-10">维修部</Col>
                </Row>
            </div>
            <div slot="footer">
            </div>
        </Modal>

        <Modal v-model="equipment_chk" title="设备选择" width="600" @on-ok="selectEquipment">
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
                status_flag:true,
                plan_status_flag:true,
                load_fix: false,
                load_fix_info:'',
                pageSize:5,
                // 自定义属性
                temp_code:'',
                temp_name:'',
                fault_description:[],
                //
                self: this,
                device_modal: false,
                device_modal2: false,
                fault_cause: false,
                fault_cause_add:false,

                /*设备选择*/
                equipment_chk:false,

                equipment_chk_data: this.getMockData(),
                equipment_chk_targetKeys: this.getTargetKeys(),
                listStyle: {
                    width: '250px',
                    height: '300px'
                },


//                责任班组弹出框
                team_code: false,
                teamSize: 5,
                faultDescriptionSize:5,
                tpmfaultDescriptionTotal:0,
//                故障原因弹出框
                faultDescription:false,
                faultDescriptionList:[],
//              刷卡弹出框
                chargeForStart:false,
                chargeTime: new Date(),
//              倒计时
                backTime: 3, // 发送验证码倒计时
                sendMsgDisabled: false,

                fault_desc: this.getMockData(),
                target_desc: [],
                blur_hitch_desc:true,
                blur_hitch_where:true,
                reportType:'fault',
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
                workForm: {
                    applicableEquipment:'',
                    billNo: "", //FR1612150001
                    status: '0', //true
                    equipmentId: '', //1001
                    equipmentName: "", //压铸岛1号设备
                    needShutdown: false,
                    reportingTime: '', //2017-05-10 15:03:31
                    /*startTime: '', //2017-05-10 15:03:31
                    endTime: '', //2017-06-10 15:03:31*/
                    teamId:'', //1
                    teamCode:'',
                    faultCode: '', //00000008
                    equipmentParameter: '', //333
                    faultDescription: '',
                    tpmFaultDescId:'',
                    content:'',//1
                    teamName:'',
                },
                workForm2: {
                    applicableEquipment:'',
                    ceshi:'',
                    billNo: "", //FR1612150001
                    status: '0', //true
                    equipmentId: "", //1001
                    equipmentName: "", //压铸岛1号设备
                    needShutdown: false,
                    reportingTime: '', //2017-05-10 15:03:31
                    startTime: '', //2017-05-10 15:03:31
                    endTime: '', //2017-06-10 15:03:31
                    noticeTeam:'', //1
                    restartTime:'', //2017-10-10
                    faultCode: '', //00000008
                    equipmentParameter: '', //333
                    faultDescription: '',
                    content:'',
                },
                columns: [
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
                        title: '标准方案编码',
                        key: 'work_id',
                        align: 'center',
                        render: (h, params) => {
                            return h('div', {
                                class: 'input-search'
                            }, [
                                h('Input', {
                                    props: {
                                        type: 'text',
                                        value: params.row.work_id
                                    }
                                }),
                                h('Button', {
                                    props: {
                                        icon: 'ios-search'
                                    },
                                    on: {
                                        click: () => {
                                            this.device_modal = true;
                                        }
                                    }
                                })
                            ]);
                        },
                    },
                    {
                        title: '标准方案名称',
                        key: 'work_name',
                        align: 'center',
                        render: (h, params) => {
                            return h('div', {
                                class: 'input-search'
                            }, [
                                h('Input', {
                                    props: {
                                        type: 'text',
                                        value: params.row.work_name
                                    }
                                }),
                                h('Button', {
                                    props: {
                                        icon: 'ios-search'
                                    },
                                    on: {
                                        click: () => {
                                            this.device_modal = true;
                                        }
                                    }
                                })
                            ]);
                        },
                    },
                    {
                        title: '是否停机',
                        key: 'device_on',
                        align: 'center',
                        render: (h, params) => {
                            return h('i-select', {
                                props: {
                                    value: params.row.device_on
                                }
                            }, [
                                h('i-option', {
                                    props: {
                                        value: 'true'
                                    }
                                }, '是'),
                                h('i-option', {
                                    props: {
                                        value: 'false'
                                    }
                                }, '否'),
                            ])
                        }
                    },
                    {
                        title: '责任班组',
                        key: 'dept',
                        align: 'center',
                        render: (h, params) => {
                            return h('Input', { props: {value: params.row.dept}})
                        },
                    },
                    {
                        title: '计划维修时间',
                        key: 'hitch_fix_time',
                        align: 'center',
                        render: (h, params) => {
                            return h('Date-picker', {
                                props: {
                                    value: params.row.hitch_fix_time,
                                    placement: 'bottom-end',
                                    type: 'datetime',
                                    placeholder: "选择日期和时间",
                                },
                                style: {
                                    width: '160px',
                                }
                            })
                        },
                    },
                ],
                newData: {
                    work_id: '',
                    work_name: '',
                    device_on: '',
                    dept: '',
                    hitch_fix_time: '',
                },
                data: [
                    {
                        work_id: '1001',
                        work_name: '压铸岛1号设备机油更换',
                        device_on: 'true',
                        dept: '机修一组',
                        hitch_fix_time: '2016-12-15 09:00',
                    },
                    {
                        work_id: '1002',
                        work_name: '压铸岛2号设备机油更换',
                        device_on: 'false',
                        dept: '机修一组',
                        hitch_fix_time: '2016-12-15 09:00',
                    },
                ],
                /*人员需求班组放大镜 start*/
                tpmTeam: [],
                tpmTeamTotal: 0,
                /*人员需求班组放大镜 end*/
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

                ruleValidate: {
                    applicableEquipment: [
                        {required: true, message: '内容不能为空', trigger: 'change'}
                    ],
                    content: [
                        {required: true, message: '内容不能为空', trigger: 'change'},
                    ],

                },

                ruleValidate2: {
                    applicableEquipment: [
                        { required: true, message: '内容不能为空', trigger: 'change'},
                    ]
                },
                dataDemo: [],
                /*设备放大镜*/
                tpmsb: [],
                tpmsbTotal: 0,
                locationId: '',
                tpmsbCurrent: 1,
            }
        },
        mounted(){
            this.getAllEquiment();
            this.getTeam();
            this.generatorBillNo();
            this.getLocationTree();
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


            //              日历时间判断
            checkStartTime: function (sT) {
                let eT = new Date(this.workForm2.endTime).getTime();
                this.workForm2.startTime = sT;
                sT = new Date(sT).getTime()
                if(eT <= sT){
                    this.$Message.error('结束时间不能在开始时间之前，请重新选择');
                }
            },
            checkEndTime: function (eT) {
                let sT = new Date(this.workForm2.startTime).getTime();
                this.workForm2.endTime = eT;
                eT = new Date(eT).getTime()
                if(eT <= sT){
                    this.$Message.error('结束时间不能在开始时间之前，请重新选择');
                }
            },

            generatorBillNo:function () {
                let vm = this;
               this.$axios.post('tmpFault/callCreatBillNo').then(function (response) {
                   let data = response.data.response.data;
                   (!!data.billNo1)&&(vm.workForm.billNo = data.billNo1);
                   (!!data.billNo2)&&(vm.workForm2.billNo = data.billNo2);
               })
            },
            selectDept:function(selection){
                this.temp_code = selection[0].equipmentCode;
                this.temp_name = selection[0].equipmentName;
            },
            getAllEquiment() {
                let vm = this;
                this.$axios.get('tmpFault/getAllEquimentDetail').then(function(response){
                    console.log(response.data.response.data);
                    if(response.data.response.code == 1){
                        vm.device_data = response.data.response.data[0];
                    }else{
                        vm.device_data = [];
                    }
                });
            },

            jockeySaveFault:function(name){
                let  vm = this;
                this.$refs[name].validate((valid) => {
                    console.log(vm.workForm.content + '输出故障详情')
                        if (!valid) {
                            console.log(valid + '00000')
                            this.$Message.error('请完善信息!');
                        } else {
                        if(!!vm.status_flag){
                            vm.status_flag = false;
                            this.$axios.post('tmpFault/operatorAdd',
                                {   billNo:this.workForm.billNo,
                                    status:this.workForm.status,
                                    equipmentId:this.workForm.equipmentId,
                                    needShutdown:this.workForm.needShutdown,
                                    faultDescriptionId:this.workForm.tpmFaultDescId,
                                }).then(function(res){
                                console.log(res);
                                if(res.data.response.code == 1){
                                    vm.load_fix = true;
                                    vm.load_fix_info = '操作中，请稍候......';
                                    //        vm.$Message.warning("保存成功");
                                    //      vm.$router.push({path: '/fault'});
                                    setTimeout(function(){
                                        vm.$router.push({path: '/fault', query: {"date": new Date()}});
                                    },1000);
                                }else{
                                    vm.status_flag = true;
                                    vm.$Message.warning("保存失败");
                                }
                            }).catch((err) => {
                                vm.status_flag = true;
                                console.log(err);
                            });
                        }
                    }
                })

            },
            jockeySavePlanFault:function(name){
                let vm = this;
                this.$refs[name].validate((valid) => {
                    if (!valid) {
                        this.$Message.error('请完善信息!');
                    }else {
                        if(!!vm.plan_status_flag){
                            vm.plan_status_flag = false;
                            vm.load_fix = true;
                            vm.load_fix_info = '操作中，请稍候......';
                            this.$axios.post('tmpFault/operatorPlanAdd',
                                {
                                    billNo:this.workForm2.billNo,
                                    //           status:this.workForm2.status,
                                    equipmentId:this.workForm2.equipmentId,
                                    restartTime:this.workForm2.restartTime
                                }).then(function(res){
                                if(res.data.response.code != 1) {
                                    vm.plan_status_flag = true;
                                    vm.$Message.error(res.data.response.msg);
                                    vm.plan_status_flag = true;
                                    return;
                                }else{
                                    let ret = res.data.response.data.ret;
                                    if(ret == "success"){
//                                        vm.load_fix = true;
//                                        vm.load_fix_info = '操作中，请稍候......';
                                        setTimeout(function(){
                                            vm.$router.push({path: '/fault', query: {"date": new Date()}});
                                        },1000);
                                    }else{
                                        vm.plan_status_flag = true;
                                        vm.$Message.warning("保存失败");
                                    }
                                }
                            }).catch((err) => {
                                vm.plan_status_flag = true;
                                console.log(err);
                            });
                        }
                    }
                })

            },
            addTr: function () {
                this.data.push(this.newData);
                // 添加完newPerson对象后，重置newPerson对象
            },
            del: function (index) {
                // 删一个数组元素
                this.date.splice(index, 1);
            },
            getTr: function (selection, row, index) {
                console.log(selection.id);
            },
            getMockData () {
                let mockData = [];
                this.$axios.get('tmpFault/queryAll').then(function(response){
                    var arr  = response.data.response.data
                    console.log(arr);
                    for(let i= 0;i<arr.length;i++){
                        mockData.push({
                            key:i.toString(),                  // 列表数据下标
                            label: arr[i].content,
                            fault_desc_id:arr[i].id
                            //    disabled: Math.random() * 3 < 1  随机只读某些个选项
                            // description: '内容' + i + '的描述信息',
                        });
                    }
                })
                return mockData;
            },
            render_desc (item) {
                return item.label;
            },
            handleChange_desc (newTargetKeys, direction, moveKeys ) {
                this.blur_hitch_desc=false;
//                console.log(newTargetKeys);
//                console.log(direction);
//                console.log(moveKeys);
                this.target_desc = newTargetKeys;
                var arr = new Array();
//                for (var i = 0 ;i < newTargetKeys.length;i++){
//                    var j = newTargetKeys[i];
//                    console.log(j)
//                    console.log('内容是:'+ this.fault_desc[j-1].label + ',Index:'+ this.fault_desc[j-1].index + ',额外:'+ this.fault_desc[j-1].content)
//                }
                for (var i = 0 ;i < newTargetKeys.length;i++){
                    var obj = new Object();
                    var j = newTargetKeys[i] -0 + 1;
                    obj.fault_desc_id = this.fault_desc[j-1].fault_desc_id;
                    obj.content = this.fault_desc[j-1].label;
                    arr.push(obj);
                    console.log('内容是:'+ this.fault_desc[j-1].label + ',Index:'+ this.fault_desc[j-1].fault_desc_id);
                }
                this.fault_description = arr;
            },
            hitch_whereChangeHandler(item){
                this.blur_hitch_where=false;
            },
            //            倒计时
            send() {
                let vm = this;
                vm.sendMsgDisabled = true;
                let interval = window.setInterval(function () {
                    if ((vm.backTime--) <= 0) {
                        vm.backTime = 3,
                            vm.chargeForStart = false;
                        vm.sendMsgDisabled = false;
                        window.clearInterval(interval);
                    }
                }, 1000);
            },


            chargeForStartF:function () {
                this.chargeForStart = true;
                this.send();
            },

            /*#######################班组 begin#####################*/

            //分页
            changeTeamPage: function (current) {
                this.getTeam(current);
            },

            getTeam:function (current) {
                let vm = this;
                if (current == undefined) {
                    current = 1;
                }
                this.$axios.get('tmpFault/bdTeam', {
                    params: {
                        cur: current,
                        size: vm.teamSize,
                    }
                }).then(function (response) {
                    var array = new Array();
                    if (response.data.response.data.length != 0) {
                        vm.tpmTeamTotal = response.data.response.data[0].teamNum;
                        for (var i in response.data.response.data) {
                            if(i != "unique"){
                                //    for(var i = 0;i<response.data.response.data.Rows.length;i++){
                                var teamId = response.data.response.data[i].teamId;
                                var innerhtml = '<input type="radio" name="teamId" value="' + teamId + '"/>'
                                var teamCode = response.data.response.data[i].teamCode;
                                var teamName = response.data.response.data[i].teamName;

                                var PersonnelRequirement = {
                                    "teamId": teamId,
                                    "innerhtml": innerhtml,
                                    "teamCode": teamCode,
                                    "teamName": teamName,

                                }
                                array.push(PersonnelRequirement);
                            }
                        }
                    } else {
                        vm.tpmTeamTotal = 0;
                    }
                    vm.tpmTeam = array;
                    console.log(vm.tpmTeam)
                })
            },

            selectTeam:function () {
                let vm = this;
                let teamId =  $(".PersonnelRequirement").find("input[type='radio']:checked").val();
                var tmp = vm.tpmTeam;
                for(var i in tmp){
                    if(tmp[i].teamId == teamId){
                        this.workForm.teamId =tmp[i].teamId;
                        this.workForm.teamName =tmp[i].teamName;
                    }
                }
            },

            /*#######################班组 end#####################*/

            /*#######################故障描述 start#####################*/

            //分页
            changeFaultDescriptionPage: function (current) {
                this.getfaultDescription(current);
            },

            getfaultDescription:function (current) {
                let vm = this;
                let equipmentId = vm.workForm.equipmentId;
                if( equipmentId != null & equipmentId != undefined & equipmentId != ''){
                    if (current == undefined) {
                        current = 1;
                    }
                    this.$axios.get('tmpFault/faultDescription', {
                        params: {
                            cur:current,
                            size:vm.faultDescriptionSize,
                            equipmentId:vm.workForm.equipmentId
                        }
                    }).then(function (res) {
                        var array = new Array();
                        if(res.data.response.data.length !=0){
                            vm.tpmfaultDescriptionTotal = res.data.response.data[0].tpmFaultDescNum;
                            var tmp = res.data.response.data;
                            for(var i in tmp){
                                if(i != "unique"){
                                    var tpmFaultDescId = tmp[i].tpmFaultDescId;
                                    var innerhtml = '<input type="radio" name="tpmFaultDescId" value="' + tpmFaultDescId + '"/>'
                                    var content = tmp[i].content;
                                    var equipmentId = tmp[i].equipmentId;

                                    var faultDescription = {
                                        "tpmFaultDescId":tpmFaultDescId,
                                        "innerhtml":innerhtml,
                                        "content":content,
                                        "equipmentId":equipmentId
                                    }
                                }
                                array.push(faultDescription);
                            }

                        }else{
                            vm.tpmfaultDescriptionTotal = 0;
                        }
                        vm.faultDescriptionList = array;
                    })
                    this.faultDescription = true;
                }else{
                    this.$Message.warning("请选择设备！");
                }
            },

            selectFaultDesc:function () {
                let vm = this;
                let tpmFaultDescId =  $(".faultDescriptionS").find("input[type='radio']:checked").val();
                var tmp = vm.faultDescriptionList;
                for(var i in tmp){
                    if(tmp[i].tpmFaultDescId == tpmFaultDescId){
                        this.workForm.tpmFaultDescId =tmp[i].tpmFaultDescId;
                        this.workForm.content =tmp[i].content;
                    }
                }
            },



            /*#######################故障描述 end#####################*/

            /*初始化地点得树结构*/
            getLocationTree: function () {
                let vm = this;
                this.$axios.post("tpmStandardSolution/getLocationTree").then(function (response) {
                    var object = response.data.response.data;
                    vm.baseData = object;
                });
            },
            /*table页面获取选中行的数据*/
            selectSb: function () {
                let tpmsbId = this.$jq("input[name='tpmsb_radio']:checked").val();
                let index = this.$fc.arrIndexOfObj("equipmentId", tpmsbId, this.tpmsb);
                if (index !== -1) {
                    this.workForm.equipmentId = tpmsbId;
                    this.workForm.applicableEquipment = this.tpmsb[index].equipmentName;
                    this.workForm.content = '';
                }
            },
            selectSb2: function () {
                let tpmsbId = this.$jq("input[name='tpmsb_radio']:checked").val();
                let index = this.$fc.arrIndexOfObj("equipmentId", tpmsbId, this.tpmsb);
                if (index !== -1) {
                    this.workForm2.equipmentId = tpmsbId;
                    this.workForm2.applicableEquipment = this.tpmsb[index].equipmentName;
                }
            },
            /*点击树节点得分子节点 通过树节点ID  获取设备*/
            getLocationId (node){
                if (node[0]) {
                    console.log("Location名称是" + node[0].title + "-----" + "对应的id--是" + node[0].locationId);
                    this.locationId = node[0].locationId;
                    this.getEquipmnet(0, this.locationId);
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
                            if(o != "unique") {
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
        }
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
