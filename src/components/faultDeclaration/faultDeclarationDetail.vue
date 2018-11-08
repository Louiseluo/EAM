<template>
    <div class="basic fault-content">
        <Spin fix v-show="load_fix">
            <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
            <!--<div>保存中，请稍后...</div>-->
            <div>{{this.load_fix_info}}</div>
        </Spin>
        <!--模块名称-->
        <div class="title">
            <span>维修管理-查看</span><br/>
        </div>
        <div class="second-title">工单详情</div>
        <!--表单-->
        <div class="form-content trobleForm">
            <Form ref="workForm" :model="workForm" :rules="ruleValidate" label-position="right" inline :label-width="100">
                <Form-item label="执行状态">
                    <Select style="width: 160px;" disabled>
                        <Option v-for="status in handleStatusArr" :value="status.value" :key="status.value"></Option>
                    </Select>
                </Form-item>
                <Form-item label="工单类型" prop="status">
                    <Select style="width: 160px;" disabled>
                        <Option v-for="item in planTypeArr" :value="item.value" :key="item.value"></Option>
                    </Select>
                </Form-item>

                <Form-item label="设备名称" prop="equipmentName">
                    <Input v-model="workForm.equipmentName" style="width: 160px;" disabled placeholder="设备001（权重1）"></Input>
                </Form-item>
                <Form-item label="设备地点" prop="equipmentAddr">
                    <Input :maxlength="1000" v-model="workForm.equipmentAddr" placeholder="测试地点1" type="textarea" style="width: 500px;" disabled></Input>
                </Form-item>
                <Form-item label="上报人" prop="reporterName">
                    <Input v-model="workForm.reporterName" style="width: 160px;" placeholder="操作工001" disabled></Input>
                </Form-item>
                <Form-item label="上报时间" prop="reporterTime">
                    <Input v-model="workForm.reporterTime" style="width: 160px;" placeholder="2017-10-27 09:13" disabled></Input>
                </Form-item>
                <Form-item label="响应时间" prop="handleTime">
                    <Input v-model="workForm.handleTime" style="width: 160px;" placeholder="2017-10-30 08:37" disabled></Input>
                </Form-item>
                <FormItem label="故障描述" class=" mar-t-2 block">
                    <Row>
                        <Col span="22">
                        <div class="personListDiv troubleDis" style="background: #f3f3f3;">
                            <div class="ivu-tag mar-t-08" v-for="(des,index) in describesDis" :key="des.id">
                                <span style="width:150px;text-overflow:ellipsis;white-space:nowrap; overflow:hidden; ">{{des.name}}</span>
                            </div>
                        </div>
                        </Col>
                    </Row>
                </FormItem>
                <FormItem label="故障原因" class="mar-t-10 block" style="margin-top:20px;">
                    <Row>
                        <Col span="22">
                        <div class="personListDiv troubleDis" style="background: #f3f3f3;">
                            <div class="ivu-tag mar-t-08" v-for="(des,index) in reasonsDis" :key="des.id" style="overflow: visible">
                                <span  style="width:150px;text-overflow:ellipsis;  white-space:nowrap; overflow:hidden; ">{{des.name}}</span>
                                <br>
                            </div>
                        </div>
                        </Col>
                    </Row>
                </FormItem>
               <!-- <Form-item label="备品备件" prop="spareParts">
                    <Input :maxlength="1000" v-model="workForm.spareParts" placeholder="测试备件（1件）" type="textarea" style="width: 500px;" disabled></Input>
                </Form-item>-->
                <Form-item label="备件申领">
                    <Select style="width: 160px;" disabled>
                        <Option v-for="status in applyStatusArr" :value="status.value" :key="status.value"></Option>
                    </Select>
                </Form-item>
                <Form-item label="工单金额（元）" prop="outsourceAmount">
                    <Input v-model="workForm.outsourceAmount" style="width: 160px;" disabled placeholder="13,000"></Input>
                </Form-item>
            </Form>
        </div>
        <!--备品备件---start-->
        <div class="second-title">备品备件</div>
            <table class="table table-bordered table-center table-striped table-blue taDisplay">
                <thead>
                <tr>
                    <th>序号</th>
                    <th>备件名称</th>
                    <th>备件类型</th>
                    <th>备件、库存单位</th>
                    <th style="text-align:center">备件数量(个)</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(equipment, index) in gettedParts" :key="equipment.id" class="trDisplay">
                    <td>{{index + 1}}</td>
                    <td>{{equipment.parts_name}}</td>
                    <td>{{equipment.parts_type}}</td>
                    <td>{{equipment.parts_unit}}</td>
                    <td>{{equipment.number}}</td>
                </tr>
                </tbody>
            </table>
            <div class="tableHasNoData" v-show="tableNoData"><p>暂无数据</p></div>
        <!--<div class="second-title mar-t-15">驳回记录</div>-->
        <!--&lt;!&ndash;表格&ndash;&gt;-->
        <!--<div class="table-content">-->
            <!--<Table stripe border :columns="columns" :data="data"></Table>-->
        <!--</div>-->

        <div class="second-title mar-t-15">执行记录</div>
        <!--表格-->
        <div class="table-content">
            <Table stripe border :columns="columns2" :data="data2"></Table>
        </div>
        <!--操作按钮-->
        <Row class="btn-group">
            <Col class="pad-15" span="24" align="center">
            <router-link to='/fault' class="mar-r-20">
                <Button type="primary" size="large">返回</Button>
            </router-link>
            <router-link to='/faultEdit' class="mar-r-20">
                <Button type="primary" size="large">编辑</Button>
            </router-link>
            <!--<Button type="primary" size="large" @click="againIssued = true">重新下发</Button>-->
            <router-link to='/fault' class="mar-r-20">
                <Button type="primary" size="large">免维修</Button>
            </router-link>
            </Col>
        </Row>

        <!--<Modal v-model="againIssued" title="重新下发">-->
            <!--<Form ref="formItem" :model="formItem" :rules="ruleValidate" label-position="right" :label-width="140">-->
                <!--<Form-item label="执行时间">-->
                    <!--<Radio-group v-model="formItem.handleTime">-->
                        <!--<Radio label="time01">原计划时间</Radio>-->
                        <!--<Radio label="time02">其他时间</Radio>-->
                    <!--</Radio-group>-->
                <!--</Form-item>-->
                <!--<Form-item label="选择时间">-->
                    <!--<DatePicker v-model="formItem.time" type="datetime" :editable=false></DatePicker>-->
                <!--</Form-item>-->
                <!--<Form-item label="工单下发提前期（天）">-->
                    <!--<Input v-model="formItem.orderIssuedAdvance"></Input>-->
                <!--</Form-item>-->
                <!--<Form-item label="工单提醒提前期（天）">-->
                    <!--<Input v-model="formItem.orderAlertAdvance"></Input>-->
                <!--</Form-item>-->
            <!--</Form>-->
        <!--</Modal>-->
        <!--故障描述-->
        <Modal v-model="fault_desc" title="故障描述" width="800">
            <cause_of_failure :baseData="faultDesc"></cause_of_failure>
            <div slot="footer"></div>
        </Modal>
        <!--故障原因-->
        <Modal v-model="fault_cause" title="故障原因" width="800">
            <cause_of_failure :baseData="faultCause"></cause_of_failure>
            <div slot="footer"></div>
        </Modal>
    </div>
</template>

<script>
    import cause_of_failure from '../faultDeclaration/causeOfFailure.vue';
    export default {
        data (){
            //验证名称
            const validateAge = (rule, value, callback) => {

            };
            return {
                //故障描述
                describesDis: [
                    {code: 1, name: '测试故障1'},
                    {code: 2, name: '测试故障2'},
                    {code: 3, name: '测试故障3'},
                    {code: 4, name: '测试故障4'},
                ],
                fault_desc: false,
                faultDesc:[
                    {
                        tabTitle:'通用故障',
                        tabName:'generalReason',
                        data:[
                            {
                                kindsTitle:'类别1',
                                kindsData:[
                                    {
                                        kindDescribe:"测试故障1"
                                    },
                                    {
                                        kindDescribe:"测试故障2"
                                    },
                                    {
                                        kindDescribe:"测试故障3"
                                    },
                                    {
                                        kindDescribe:"测试故障4"
                                    },
                                ]
                            },
                            {
                                kindsTitle:'类别2',
                                kindsData:[
                                    {
                                        kindDescribe:"测试故障1"
                                    },
                                    {
                                        kindDescribe:"测试故障2"
                                    },
                                    {
                                        kindDescribe:"测试故障3"
                                    },
                                    {
                                        kindDescribe:"测试故障4"
                                    },
                                ]
                            },
                            {
                                kindsTitle:'类别3',
                                kindsData:[]
                            },
                            {
                                kindsTitle:'类别4',
                                kindsData:[]
                            },
                            {
                                kindsTitle:'类别5',
                                kindsData:[]
                            },
                            {
                                kindsTitle:'类别6',
                                kindsData:[]
                            },
                            {
                                kindsTitle:'类别7',
                                kindsData:[]
                            },
                            {
                                kindsTitle:'类别8',
                                kindsData:[]
                            },
                            {
                                kindsTitle:'类别9',
                                kindsData:[]
                            },
                            {
                                kindsTitle:'类别10',
                                kindsData:[]
                            },
                            {
                                kindsTitle:'类别11',
                                kindsData:[]
                            },
                        ],
                    },
                    {
                        tabTitle:'特殊故障',
                        tabName:'specialReasons',
                        data:[
                            {
                                kindsTitle:'类别1',
                                kindsData:[
                                    {
                                        kindDescribe:"测试故障1"
                                    },
                                    {
                                        kindDescribe:"测试故障2"
                                    },
                                    {
                                        kindDescribe:"测试故障3"
                                    },
                                    {
                                        kindDescribe:"测试故障4"
                                    },
                                ]
                            },
                            {
                                kindsTitle:'类别2',
                                kindsData:[
                                    {
                                        kindDescribe:"测试故障1"
                                    },
                                    {
                                        kindDescribe:"测试故障2"
                                    },
                                    {
                                        kindDescribe:"测试故障3"
                                    },
                                    {
                                        kindDescribe:"测试故障4"
                                    },
                                ]
                            }
                        ],
                    }
                ],
                //故障原因
                reasonsDis: [
                    {code: 1, name: '测试原因1'},
                    {code: 2, name: '测试原因2'},
                    {code: 3, name: '测试原因3'},
                    {code: 4, name: '测试原因4'},
                ],
                fault_cause: false,
                faultCause:[
                    {
                        tabTitle:'通用原因',
                        tabName:'generalReason',
                        data:[
                            {
                                kindsTitle:'类别1',
                                kindsData:[
                                    {
                                        kindDescribe:"测试原因1"
                                    },
                                    {
                                        kindDescribe:"测试原因2"
                                    },
                                    {
                                        kindDescribe:"测试原因3"
                                    },
                                    {
                                        kindDescribe:"测试原因4"
                                    },
                                ]
                            },
                            {
                                kindsTitle:'类别2',
                                kindsData:[
                                    {
                                        kindDescribe:"测试原因1"
                                    },
                                    {
                                        kindDescribe:"测试原因2"
                                    },
                                    {
                                        kindDescribe:"测试原因3"
                                    },
                                    {
                                        kindDescribe:"测试原因4"
                                    },
                                ]
                            },
                            {
                                kindsTitle:'类别3',
                                kindsData:[]
                            },
                            {
                                kindsTitle:'类别4',
                                kindsData:[]
                            },
                            {
                                kindsTitle:'类别5',
                                kindsData:[]
                            },
                            {
                                kindsTitle:'类别6',
                                kindsData:[]
                            },
                            {
                                kindsTitle:'类别7',
                                kindsData:[]
                            },
                            {
                                kindsTitle:'类别8',
                                kindsData:[]
                            },
                            {
                                kindsTitle:'类别9',
                                kindsData:[]
                            },
                            {
                                kindsTitle:'类别10',
                                kindsData:[]
                            },
                            {
                                kindsTitle:'类别11',
                                kindsData:[]
                            },
                        ],
                    },
                    {
                        tabTitle:'特殊原因',
                        tabName:'specialReasons',
                        data:[
                            {
                                kindsTitle:'类别1',
                                kindsData:[
                                    {
                                        kindDescribe:"测试原因1"
                                    },
                                    {
                                        kindDescribe:"测试原因2"
                                    },
                                    {
                                        kindDescribe:"测试原因3"
                                    },
                                    {
                                        kindDescribe:"测试原因4"
                                    },
                                ]
                            },
                            {
                                kindsTitle:'类别2',
                                kindsData:[
                                    {
                                        kindDescribe:"测试原因1"
                                    },
                                    {
                                        kindDescribe:"测试原因2"
                                    },
                                    {
                                        kindDescribe:"测试原因3"
                                    },
                                    {
                                        kindDescribe:"测试原因4"
                                    },
                                ]
                            }
                        ],
                    }
                ],
                //备品备件
                tableNoData: false,
                gettedParts: [
                    {
                        parts_name: '固定芯座',
                        parts_type: 'CNC12',
                        parts_unit: '袋',
                        number: 2
                    },
                    {
                        parts_name: '固定芯座',
                        parts_type: 'CNC12',
                        parts_unit: '块、条、件',
                        number: 3
                    },
                ],
                isubmit :false,
                load_fix: false,
                load_fix_info:'',
                id:'',//faultId
                ant:'',
                workForm:{
                    status: "",
                    orderType: "",
                    equipmentName: "",
                    equipmentAddr: "",
                    reporterName: "",
                    reporterTime: "",
                    handleTime: "",
                    faultDesc: "",
                    faultCause: "",
                    spareParts: "",
                    applyStatus: "",
                    outsourceAmount: "",
                },
                columns: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 80,
                        align: 'center'
                    },
                    {
                        title: '驳回人',
                        key: 'reject_name',
                        align: 'center'
                    },
                    {
                        title: '驳回时间',
                        key: 'reject_time',
                        align: 'center'
                    },
                    {
                        title: '驳回原因',
                        key: 'reject_reason',
                        align: 'center'
                    },
                    {
                        title: '处理人',
                        key: 'handle_name',
                        align: 'center'
                    },
                    {
                        title: '处理时间',
                        key: 'handle_time',
                        align: 'center',
                    },
                    {
                        title: '处理结果',
                        key: 'handle_result',
                        align: 'center'
                    },
                ],
                data: [
                    {
                        reject_name: '机修工001',
                        reject_time: '2017-10-21 09:34',
                        reject_reason: '备件数量不足',
                        handle_name:'admin001',
                        handle_time: '2017-10-22:09:35',
                        handle_result: '免维修',
                    },
                    {
                        reject_name: '机修工001',
                        reject_time: '2017-10-21 09:34',
                        reject_reason: '未发现故障',
                        handle_name:'admin001',
                        handle_time: '2017-10-22:09:35',
                        handle_result: '重新下发',
                    }
                ],
                handleStatusArr: [
                    {
                        value: '全部',
                        label: '全部'
                    },
                    {
                        value: '已结束',
                        label: '已结束'
                    },
                    {
                        value: '进行中',
                        label: '进行中'
                    }
                ],
                applyStatusArr: [
                    {
                        value: '全部',
                        label: '全部'
                    },
                    {
                        value: '已申领',
                        label: '已申领'
                    },
                    {
                        value: '未申领',
                        label: '未申领'
                    },
                ],
                planTypeArr:[
                    {
                        value: '全部',
                        label: '全部'
                    },
                    {
                        value: '内部保养',
                        label: '内部保养'
                    },
                    {
                        value: '委外保养',
                        label: '委外保养'
                    },
                    {
                        value: '日常点检',
                        label: '日常点检'
                    },
                    {
                        value: '管理巡检',
                        label: '管理巡检'
                    },
                ],
                columns2: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 80,
                        align: 'center'
                    },
                    {
                        title: '执行人',
                        key: 'handle_name',
                        align: 'center'
                    },
                    {
                        title: '开始时间',
                        key: 'start_time',
                        align: 'center'
                    },
                    {
                        title: '结束时间',
                        key: 'end_time',
                        align: 'center'
                    },
                    {
                        title: '实际工时（分钟）',
                        key: 'actual_time',
                        align: 'center'
                    },
//                    {
//                        title: '签出时间',
//                        key: 'logout_time',
//                        align: 'center',
//                    },
//                    {
//                        title: '签出原因',
//                        key: 'logout_reason',
//                        align: 'center'
//                    },
                ],
                data2: [
                    {
                        handle_name: '机修工',
                        start_time: '2017-10-21 09:34',
                        end_time: '2017-10-21 10:34',
                        actual_time: '60',
                        logout_time:'15分钟32秒',
                        logout_reason: '备件申领/备件申领...',
                    },
                ],

//                againIssued: false,

                formItem: {
                    handleTime: 'time01',
                    time: '',
                    orderIssuedAdvance: '',
                    orderAlertAdvance: '',
                },
                ruleValidate: {
                    /*reportingTime: [
                        {required: true,type: 'date', message: '内容不能为空', trigger: 'change'}
                    ],*/
                    noticeTeam: [
                        {required: true, message: '内容不能为空', trigger: 'change'}
                    ],
                    faultDescription: [
                        {required: true, message: '内容不能为空', trigger: 'change'}
                    ],
                    confirmedFaultPosition: [
                        {required: true, message: '内容不能为空', trigger: 'change'}
                    ],
                    confirmedCauseOfFault: [
                        {required: true, message: '内容不能为空', trigger: 'change'}
                    ],
                    confirmTime: [
                        {required: true, type: 'date', message: '内容不能为空', trigger: 'change'}
                    ]
                },
                //axios DEMO
//        columnsDemo: [{title: 'id', key: 'id'}, {title: '名称', key: 'cnUsername'}],
                dataDemo: []
            }
        },
        mounted(){
            var id = this.$route.query.id;
            this.id = id;
            this.ant = this.$route.query.status;
            console.log("id:"+id);
            this.$axios.post('tmpFault/'+id+'/detail').then((res) => {
//                console.log("details:"+JSON.stringify(res.data.response.data));
                var result = res.data.response.data;
                this.editWorkForm = result.tpmFault;
                this.editWorkForm.status = result.tpmFault.status+'';
                this.editWorkForm.confirmTime = new Date(result.tpmFault.confirmTime);
                this.editWorkForm.equipmentCode = result.equipmentCode;
                this.editWorkForm.equipmentName = result.equipmentName;
//                this.editWorkForm.noticeTeam = result.noticeTeam;
                this.editWorkForm.faultDescription = result.tpmFaultDesc;
                //是否停机
                this.editWorkForm.needShutdown = result.tpmFault.needShutdown === 0 ? true : false;
                this.editWorkForm.confirmedFaultPosition = result.tpmFaultPosition;
                this.editWorkForm.noticeTeam = result.noticeTeam;
                this.editWorkForm.confirmedCauseOfFault = result.tpmFaultReason;
                //this.data = result.details;
                var aaa = result.details;
                this.data = new Array();
                for(var i in aaa){
                    let obj = {};
                    obj["work_code"] = aaa[i].work_code;
                    obj["work_name"] = aaa[i].work_name;
                    obj["work_version"] = aaa[i].work_version;
                    obj["device_on"] = parseInt(aaa[i].device_on)===0?true:false;
                    obj["dept"] = aaa[i].dept;
                    obj["hitch_fix_time"] = aaa[i].hitch_fix_time;
                    this.data.push(obj);
                }
            }).catch((err) => {
                console.log(err);
            })

        },
        methods: {
            submit:function (name) {
                let vm = this;
                this.$refs[name].validate((valid) => {
                    if (!valid) {
                        this.$Message.error('请完善信息!');
                    } else {
                        if(this.$fc.iSubmit(this))
                        vm.load_fix = true;
                        vm.load_fix_info = '操作中，请稍候......';
                        this.$axios.post('tmpFault/generatorTpmWorkOrder',{faultId:this.id}).then(function (res) {
                            let result = res.data.response.code;
                            //alert(result)
                            if(result == 1){
//                                vm.load_fix = true;
//                                vm.load_fix_info = '操作中，请稍候......';
                                //        vm.$Message.warning("保存成功");
                                //      vm.$router.push({path: '/fault'});
                                setTimeout(function(){
                                    vm.$router.push({path: '/fault', query: {"date": new Date()}});
                                },1000);
                            }else{
                                vm.$Message.error('保存失败!');
                                vm.iSubmit = false;
                            }
                        }).catch((err) => {
                            vm.iSubmit = false;
                            console.log(err);
                        });
                    }
                })
            },

            //获取接口数据demo
            getTableDataDemo(){
                this.$ajax.post('http://192.168.118.249:808/api/user/getList').then((res) => {
                    this.dataDemo = res.data.r;
                }).catch((err) => {
                    console.log(err);
                });
            },
            handleSubmit (name) {
                console.log(this.workForm);
            }
        },
        components: {
            'cause_of_failure': cause_of_failure,
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
