<template>
    <div class="basic fault-content">
        <!--模块名称-->
        <div class="title">
            <span>机修工确认</span>
        </div>
        <!--表单-->
        <div class="form-content">
            <Form ref="workForm" :model="workForm" :rules="ruleValidate" label-position="right" inline :label-width="100">
                <Form-item label="工单编码" prop="billNo">
                    <Input v-model="workForm.billNo" style="width: 160px;" disabled></Input>
                </Form-item>
                <Form-item label="工单状态" prop="status">
                    <Select v-model="workForm.status" style="width: 160px;" disabled>
                        <Option value="1">制单中</Option>
                        <Option value="2">生效中</Option>
                        <Option value="3">进行中</Option>
                        <Option value="4">已作废</Option>
                        <Option value="5">免维保</Option>
                    </Select>
                </Form-item>
                <Form-item label="设备编码" prop="equipmentId">
                    <Input v-model="workForm.equipmentId" style="width: 160px;" placeholder="" disabled></Input>
                </Form-item>
                <Form-item label="设备名称" prop="equipmentName">
                    <Input v-model="workForm.equipmentName" style="width: 160px;" placeholder="" disabled></Input>
                </Form-item>
                <Form-item label="设备是否停机" prop="needShutdown">
                    <div style="width: 160px;">
                        <i-switch v-model="workForm.needShutdown">
                            <span slot="open">是</span>
                            <span slot="close">否</span>
                        </i-switch>
                    </div>
                </Form-item>
                <Form-item label="故障申报时间" prop="reportingTime">
                    <Date-picker v-model="workForm.reportingTime" type="datetime" placeholder="选择日期和时间" style="width: 160px;" disabled readonly></Date-picker>
                </Form-item>
                <Form-item label="计划停机时间" prop="expectedRepairTime">
                    <Row>
                        <Col span="11">
                        <Date-picker v-model="workForm.startTime" type="datetime" placeholder="选择日期和时间" disabled readonly></Date-picker>
                        </Col>
                        <Col span="2" style="text-align: center">~</Col>
                        <Col span="11">
                        <Date-picker v-model="workForm.endTime" type="datetime" placeholder="选择日期和时间" disabled readonly></Date-picker>
                        </Col>
                    </Row>
                </Form-item>
                <Form-item label="故障代码" prop="faultCode">
                    <Input v-model="workForm.faultCode" disabled style="width: 160px;" placeholder=""></Input>
                </Form-item>
                <Form-item label="设备参数" prop="equipmentParameter">
                    <Input v-model="workForm.equipmentParameter" disabled style="width: 160px;" placeholder=""></Input>
                </Form-item>
                <Form-item label="故障描述" prop="faultDescription">
                    <Transfer :data="fault_desc" :target-keys="target_desc" :render-format="render_desc" @on-change="handleChange_desc"></Transfer>
                </Form-item>
            </Form>
        </div>
        <div class="second-title">维修工程师确认</div>
        <div class="form-content">
            <Form ref="editWorkForm" :model="editWorkForm" :rules="ruleValidate" label-position="right" inline :label-width="100">
                <Form-item label="故障位置" prop="confirmedFaultPosition">
                    <Select style="width: 160px;" :disabled="blur_hitch_desc" @on-change="hitch_whereChangeHandler" multiple v-model="cause_where">
                        <Option v-for="item in cityList" :value="item.value" :key="item">{{ item.label }}</Option>
                    </Select>
                </Form-item>
                <Form-item label="故障原因" prop="confirmedCauseOfFault">
                    <div class="input-search">
                        <Input v-model="editWorkForm.confirmedCauseOfFault" style="width: 160px;" placeholder="" :disabled="blur_hitch_where"></Input>
                        <Button icon="ios-search" @click="fault_cause = false"></Button>
                    </div>
                </Form-item>
                <Form-item label="故障确认时间" prop="confirmTime">
                    <Date-picker v-model="editWorkForm.confirmTime" type="datetime" placeholder="选择日期和时间" style="width: 160px;" disabled></Date-picker>
                </Form-item>
                <Form-item label="注意事项" prop="note">
                    <Input v-model="editWorkForm.note" type="textarea" style="width: 400px;" :autosize="{minRows: 2,maxRows: 3}" placeholder=""></Input>
                </Form-item>
            </Form>
        </div>
        <div class="second-title">维修方案</div>
        <!--表格-->
        <div class="table-content">
            <div class="table-reset">
                <table class="table table-bordered table-center table-striped table-blue table-edit">
                    <thead>
                    <tr>
                        <th>序号</th>
                        <th>标准方案编码</th>
                        <th>标准方案名称</th>
                        <th>是否停机</th>
                        <th>责任班组</th>
                        <th>计划维修时间</th>
                        <th>操作</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(itemData,index) in data">
                        <td>{{index + 1}}</td>
                        <td>
                            <div class="input-search">
                                <Input v-model="itemData.work_id" disabled></Input>
                                <Button icon="ios-search" @click="device_modal = true"></Button>
                            </div>
                        </td>
                        <td>{{itemData.work_name}}</td>
                        <td>
                            <i-switch v-model="itemData.device_on" @on-change="">
                                <span slot="open">开</span>
                                <span slot="close">关</span>
                            </i-switch>
                        </td>
                        <td><Input type="text" v-model="itemData.dept"></Input></td>
                        <td><Date-picker v-model="itemData.hitch_fix_time" type="datetime" placeholder="选择日期和时间"></Date-picker></td>
                        <td><a class="mar-r-5" size="small" @click="del(index)">删除</a></td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <!--<i-table class="table-edit" stripe border :content="self" :columns="columns" :data="data" @on-select="getTr"></i-table>-->
            <div  class="mar-t-10">
                <Button type="primary" icon="plus-round" size="small" @click="addTr">添加</Button>
                <!--<Button type="primary" shape="circle" icon="minus-round" size="small"></Button>-->
            </div>
        </div>
        <!--操作按钮-->
        <div class="btn-group" align="center">
            <router-link to='/fault' class="mar-r-15">
                <Button v-show="this.$rt('14922')" class="btn-gary" icon="close" size="large">取消</Button>
            </router-link>
            <router-link to='/faultDetail'>
                <Button v-show="this.$rt('14921')" type="primary" icon="document-text" size="large">保存草稿</Button>
            </router-link>
        </div>
        <!--modal-->
        <Modal v-model="device_modal" title="标准方案">
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
                self: this,
                device_modal: false,
                fault_cause: false,
                fault_desc: this.getMockData(),
                target_desc: [],
                blur_hitch_desc: true,
                blur_hitch_where: true,
                workForm: {
                    billNo: "FR1612150001",
                    status: 'true',
                    equipmentId: "1001",
                    equipmentName: "压铸岛1号设备",
                    needShutdown: true,
                    reportingTime: '2017-05-10 15:03:31',
                    startTime: '2017-05-10 15:03:31',
                    endTime: '2017-06-10 15:03:31',
                    faultCode: '00000008',
                    equipmentParameter: '333',
                    faultDescription: '',
                },
                editWorkForm: {
                    confirmedFaultPosition: "",
                    confirmedCauseOfFault: "",
                    confirmTime: '',
                    note: '',
                },
               /* columns: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center',
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
                        align: 'center'
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
                ],*/
                newData: {
                    work_id: '1006',
                    work_name: 'ss',
                    device_on: '',
                    dept: 'ss',
                    hitch_fix_time: '',
                },
                data: [
                    {
                        work_id: '1001',
                        work_name: '压铸岛1号设备机油更换',
                        device_on: true,
                        dept: '机修一组',
                        hitch_fix_time: '2016-12-18 09:00',
                    },
                    {
                        work_id: '1002',
                        work_name: '压铸岛2号设备机油更换',
                        device_on: false,
                        dept: '机修二组',
                        hitch_fix_time: '2016-12-15 09:00',
                    },
                ],

                columns_cause: [
                    {
                        title: '',
                        width: 60,
                        key:'selects',
                        align: 'center',
                        render: (h, params) => {
                            return h('Input',{
                                props:{
                                    type:'radio',
                                    name:'selects'
                                },
                                style:{
                                    width:'14px',
                                    verticalAlign: 'text-top'
                                }
                            })
                        }
                    },
                    {
                        title: '序号',
                        type: 'index',
                        width: 80,
                        align: 'center',
                    },
                    {
                        title: '故障原因',
                        key: 'code',
                    },
                ],
                data_cause: [
                    {
                        code: '电机损坏',
                    },
                    {
                        code: '电机损坏',
                    },
                    {
                        code: '电机损坏',
                    },
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

                ruleValidate: {
                    bill_id: [
                        {required: true, message: '不能为空', trigger: 'blur'}
                    ]
                },
                //axios DEMO
//        columnsDemo: [{title: 'id', key: 'id'}, {title: '名称', key: 'cnUsername'}],
                dataDemo: []
            }
        },

        methods: {
            addTr: function () {
                this.data.push(this.$fc.cloneKey(this.newData));
                // 添加完newPerson对象后，重置newPerson对象
            },
            del: function (index) {
                // 删一个数组元素
                this.data.splice(index, 1);
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
                this.blur_hitch_desc = false;
                console.log(newTargetKeys);
                console.log(direction);
                console.log(moveKeys);
                this.target_desc = newTargetKeys;
            },
            hitch_whereChangeHandler(item){
                this.blur_hitch_where = false;
            }
        }
    }
</script>
