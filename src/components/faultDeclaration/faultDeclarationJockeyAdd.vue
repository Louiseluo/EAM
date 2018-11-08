<template>
    <div class="basic fault-content">
        <Spin fix v-show="load_fix">
            <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
            <!--<div>保存中，请稍后...</div>-->
            <div>{{this.load_fix_info}}</div>
        </Spin>
        <!--模块名称-->
        <div class="title">
            <span>异常上报</span>
        </div>
        <div class="mar-t-15">
            <!--<div class="second-title">计划停机上报</div>-->
            <Form ref="workForm2" :model="workForm2" :rules="ruleValidate2" label-position="right" inline :label-width="100">
                <Form-item label="设备选择" prop="applicableEquipment">
                    <div class="input-search">
                        <Input v-model="workForm2.applicableEquipment" style="width: 160px;" disabled></Input>
                        <Button icon="ios-search" @click="equipment_code = true"></Button>
                    </div>
                </Form-item>
                <Form-item label="故障描述" prop="content">
                    <div class="input-search">
                        <Input v-model="workForm2.content" style="width: 160px;" disabled></Input>
                        <Button icon="ios-search" @click="fault_cause = true"></Button>
                    </div>
                </Form-item>
                <Button class="mar-10" type="primary" >上报故障</Button><!--@click="jockeySavePlanFault('workForm2')"-->
            </Form>
        </div>

        <!--modal-->
        <Modal v-model="fault_cause" title="故障原因">
            <cause_of_failure :baseData="faultCause" :newWindow="addWindow"></cause_of_failure>
            <div slot="footer"></div>
        </Modal>

        <!--<Modal v-model="equipment_chk" title="设备选择" width="600" >&lt;!&ndash;@on-ok="selectEquipment"&ndash;&gt;
            <Transfer :data="equipment_chk_data" :target-keys="equipment_chk_targetKeys" :list-style="listStyle"  filterable :render-format="render" @on-change="handleChange4"></Transfer>
        </Modal>-->

        <Modal v-model="addWindow.modalWin" title="新增故障" class="selectModal">
            <Tabs type="card" :value="currentTab" >
                <Tab-pane label="新增内容" name="0">
                    <Form ref="addNewContent" :model="addNewContent" label-position="right" inline :label-width="120">
                        <Form-item label="故障类别" prop="tabTitle">
                            <Select v-model="addNewContent.tabTitle" style="width: 120px;">
                                <Option  value="0" key="0">0</Option>
                            </Select>
                        </Form-item>
                        <Form-item label="故障类型" prop="kindsTitle">
                            <Select v-model="addNewContent.kindsTitle" style="width: 120px;">
                                <Option  value="0" key="0">0</Option>
                            </Select>
                        </Form-item>
                        <FormItem label="故障内容">
                            <Input v-model="addNewContent.kindContent" type="textarea" :autosize="{minRows: 2,maxRows: 5}"></Input>
                        </FormItem>
                    </Form>
                </Tab-pane>
                <Tab-pane label="新增分类" name="1">
                    <Form ref="addNewKind" :model="addNewKind" label-position="right" inline :label-width="120">
                        <Form-item label="故障类别" prop="tabTitle">
                            <Select v-model="addNewKind.tabTitle" style="width: 120px;">
                                <Option  value="0" key="0">0</Option>
                            </Select>
                        </Form-item>
                        <Form-item label="故障类型" prop="kindsTitle">
                            <Input v-model="addNewKind.kindsTitle" type="textarea" :autosize="{minRows: 2,maxRows: 5}"></Input>
                        </Form-item>
                    </Form>
                </Tab-pane>
            </Tabs>
        </Modal>


        <Modal v-model="equipment_code" title="适用设备" width="820" @on-ok="selectSb">
            <Tree :data="treeSiteData" :multiple="false" @on-select-change="treeSelected" class="max-h-300"></Tree>
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
                fault_cause: false,
                status_flag:true,
                plan_status_flag:true,
                load_fix: false,
                load_fix_info:'',
                pageSize:5,
                // 自定义属性
                temp_code:'',
                temp_name:'',
                fault_description:[],


                /*设备选择*/
                /*equipment_chk:false,

                equipment_chk_data: this.getMockData(),
                equipment_chk_targetKeys: this.getTargetKeys(),
                listStyle: {
                    width: '250px',
                    height: '300px'
                },*/


                /*fault_desc: this.getMockData(),
                target_desc: [],*/
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
                workForm2: {
                    applicableEquipment:'',
                    applicableEquipmentId:'',
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




                /*设备放大镜*/
                equipment_code: false,
                treeSiteData:[],
                treeNode:[],
                /*设备放大镜 end*/
                /*故障原因、故障描述、备品备件 维修管理的组件模拟数据*/
                addWindow:{
                    modalWin:false
                },
                currentTab:"0",
                addNewContent:{
                    tabTitle:'',
                    kindsTitle:'',
                    kindContent:'',
                },
                addNewKind:{
                    tabTitle:'',
                    kindsTitle:'',
                },

                faultCause:[
                    {
                        tabTitle:'通用原因',
                        tabName:'generalReason',
                        data:[
                            {
                                kindsTitle:'类别1',
                                kindsData:[
                                    {
                                        kindDescribe:"描述1-1"
                                    },
                                    {
                                        kindDescribe:"描述1-2"
                                    },
                                    {
                                        kindDescribe:"描述1-3"
                                    },
                                    {
                                        kindDescribe:"描述1-4"
                                    },
                                ]
                            },
                            {
                                kindsTitle:'类别2',
                                kindsData:[
                                    {
                                        kindDescribe:"描述2-1"
                                    },
                                    {
                                        kindDescribe:"描述2-2"
                                    },
                                    {
                                        kindDescribe:"描述2-3"
                                    },
                                    {
                                        kindDescribe:"描述2-4"
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
                                kindsTitle:'类别3',
                                kindsData:[
                                    {
                                        kindDescribe:"描述3-1"
                                    },
                                    {
                                        kindDescribe:"描述3-2"
                                    },
                                    {
                                        kindDescribe:"描述3-3"
                                    },
                                    {
                                        kindDescribe:"描述3-4"
                                    },
                                ]
                            },
                            {
                                kindsTitle:'类别4',
                                kindsData:[
                                    {
                                        kindDescribe:"描述4-1"
                                    },
                                    {
                                        kindDescribe:"描述4-2"
                                    },
                                    {
                                        kindDescribe:"描述4-3"
                                    },
                                    {
                                        kindDescribe:"描述4-4"
                                    },
                                ]
                            }
                        ],
                    }
                ],
            }
        },
        mounted(){
//            this.getAllEquiment();
//            this.generatorBillNo();
//            this.getLocationTree();
            /* 树图初始化 */
            this.treeSiteDataF();
            /* 树图初始化 end*/
        },
        components: {
            'cause_of_failure': cause_of_failure,
        },
        methods: {

            /*穿梭框*/
            /*getMockData () {
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
            },*/
            /*穿梭框 end*/



            /*设备弹框放大镜Start*/
            treeSiteDataF:function () {
                let vm = this;
                this.$axios.get('/eamStandardSolution/location/tree',{
                    params:{
                        standardSolutionVersionId:"",
                    }
                }).then((res) => {
//                    console.log("treeRes + " + JSON.stringify(res))
                    let code = res.data.response.code;
                    if(code === 1) {
                        let result = res.data.response.data;//当前返回的结果
                        vm.treeSiteData = result;
                    }else {
                        //.. 业务失败的情况
                        this.$Message.error({
                            content: '数据不合法',
                            duration: 5,
                            closable: true
                        });
                    }
                }).catch((err) => {
                    console.log("无数据 + " + err);
                });

            },
            treeSelected:function (selectNode) {

                if (JSON.stringify(selectNode) == "[]") {
                    return
                };

                //如果该对象有子节点，将不被放入数组：
                //判断是否有子节点：
                if (selectNode[0].children) {
                    selectNode[0].expand = !selectNode[0].expand;
                    selectNode[0].selected = false;
                } else {
                    //符合条件将被存入数组
                    let vm = this;
                    this.$axios.get('/eamStandardSolution/location/getLcationType', {
                        params: {
                            locationId: selectNode[0].id,
                        }
                    }).then((response) => {
                        let code = response.data.response.code;
                        if (code === 1) {
                            let treeNodeBlank = [];
                            treeNodeBlank.push(selectNode[0]);
                            vm.treeNode = treeNodeBlank;
                            console.log("this.treeNode + " + vm.treeNode)
                            /*let type = response.data.response.data.type;
                            console.log("selectNode[0] + " + JSON.stringify(selectNode[0]))
                            console.log("response.data.response.data + " + JSON.stringify(response.data.response.data))
                            if (type == 5) {
                                let treeNodeBlank = [];
                                treeNodeBlank.push(selectNode[0]);
                                vm.treeNode = treeNodeBlank;
                                console.log("this.treeNode + " + vm.treeNode)
                            }*/
                        } else {
                            vm.$Message.error(response.data.response.msg);
                        }
                    }).catch((err) => { });
                }
            },
            selectSb: function () {
                console.log("this.treeNode + " + this.treeNode)
                if(this.treeNode[0]){
                    this.workForm2.applicableEquipment = this.treeNode[0].title;
                    this.workForm2.applicableEquipmentId = this.treeNode[0].id;
                }
                /*this.tpmsb = this.$refs.one.tpmsbChild;
                 let tpmsbId = this.$jq("input[name='tpmsb_radio']:checked").val();
                 let index = this.$fc.arrIndexOfObj("equipmentId", tpmsbId, this.tpmsb);
                 if (index !== -1) {
                 this.workForm.equipmenteId = tpmsbId;
                 this.workForm.factoryLocationId = this.tpmsb[index].equipmentName;
                 }*/
            },
            /*设备弹框放大镜 end*/

        }
    }
</script>


<style>
    .selectModal .ivu-form-item-content{
        position: inherit;
    }


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
