<template>
    <div class="basic fault-content">
        <!--模块名称-->
        <div class="title">
            <span>待维修</span>
        </div>
        <div class="form-content">
            <Form label-position="right" inline :label-width="100">
                <!--<Form-item label="设备名称">-->
                    <!--<Input v-model="" style="width: 160px;" placeholder=""></Input>-->
                <!--</Form-item>-->
                <FormItem label="设备名称">
                    <Input v-model="equipmentName" @on-blur="equipmentName = toValidate(equipmentName)"></Input>
                </FormItem>
                <FormItem label="上报人">
                    <Input v-model="submitter" @on-blur="submitter = toValidate(submitter)"></Input>
                </FormItem>
                <FormItem label="执行状态">
                    <Select style="width: 160px;" v-model="executionStatus">
                        <Option v-for="status in statusArr" :value="status.code" :key="status.code">{{ status.desc }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="上报时间">
                    <Row>
                        <Col span="11">
                        <Date-picker type="date" v-model="submitTimeStart" placeholder="选择日期" style="width: 100%;display: inline-block"></Date-picker>
                        </Col>
                        <Col span="2" style="text-align: center">~</Col>
                        <Col span="11">
                        <Date-picker type="date" v-model="submitTimeEnd" placeholder="选择时间" style="width: 100%;display: inline-block"></Date-picker>
                        </Col>
                    </Row>
                </FormItem>
            </Form>
            <div class="btn-query">
                <Button type="primary" icon="search" size="large" @click="searchExecutionList">查询</Button>
            </div>
        </div>
        <!--表格-->
        <div class="table-content">
            <Table class="table-edit" stripe border :columns="columns_work" :data="data_work"></Table>
        </div>
        <div class="page">
            <Page :total="dataTotal" :current="page" size="small" show-elevator :page-size="pageSize" @on-change="pageSearchTask"></Page>
        </div>
    </div>
</template>
<script>
    export default {
        data (){
            //验证名称
            const validateAge = (rule, value, callback) => {

            };
            return {
                /*权限校验 start*/
//                if_do:  this.$rt(this.authJson.EAM.待维修.待维修页面.执行),
//                if_detail:  this.$rt(this.authJson.EAM.待维修.待维修页面.查看),
                if_do:  true,
                if_detail:  true,
                /*权限校验 end*/
                equipmentName:'',
                submitter:'',
                executionStatus:-1,
                submitTimeStart:'',
                submitTimeEnd:'',
                statusArr:this.$base_info.executionStatusEnum,
                columns_work: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 80,
                        align: 'center'
                    },
                    {
                        title: '设备名称',
                        key: 'equipmentName',
                        align: 'center',
                        render: (h, params) => {
                            return h('p',{
                                domProps: {
                                    title:params.row.equipmentName
                                },
                                class: 'iview_tabDis',
                            }, params.row.equipmentName);
                        }
                    },
                    {
                        title: '上报人',
                        key: 'submitter',
                        align: 'center',
                        render: (h, params) => {
                            return h('p',{
                                domProps: {
                                    title:params.row.submitter
                                },
                                class: 'iview_tabDis',
                            }, params.row.submitter);
                        }
                    },
                    {
                        title: '上报时间',
                        key: 'submitTime',
                        align: 'center',
                    },
                    {
                        title: '故障描述',
                        key: 'faultDesc',
                        align: 'center',
                        render: (h, params) => {
                            return h('p',{
                                domProps: {
                                    title:params.row.faultDesc
                                },
                                class: 'iview_tabDis',
                            }, params.row.faultDesc);
                        }
                    },
                    {
                        title: '故障原因',
                        key: 'faultCause',
                        align: 'center',
                        render: (h, params) => {
                            return h('p',{
                                domProps: {
                                    title:params.row.faultCause
                                },
                                class: 'iview_tabDis',
                            }, params.row.faultCause);
                        }
                    },
                    {
                        title: '备品备件',
                        key: 'spartPartName',
                        align: 'center',
                        render: (h, params) => {
                            return h('p',{
                                domProps: {
                                    title:params.row.spartPartName.join('、')
                                },
                                class: 'iview_tabDis',
                            }, params.row.spartPartName.join('、'));
                        }
                    },
                    {
                        title: '执行岗位',
                        key: 'executionPosition',
                        align: 'center',
                    },
                    {
                        title: '执行状态',
                        key: 'executionStatus',
                        align: 'center',
                    },
                    {
                        title: '操作',
                        key: 'action',
                        align: 'center',
                        render:(h,params) =>{
//                            if(params.row.executionStatus == '进行中'){
//                                return  h('a', {
//                                    on: {
//                                        click: () => {
//                                            this.viewMaintain()
//                                        }
//                                    }
//                                }, '查看')
//                            }else {
//                                return  h('a', {
//                                    on: {
//                                        click: () => {
//                                            this.goMaintain()
//                                        }
//                                    }
//                                }, '执行')
//                            }
                            if(this.if_detail) {
                                return  h('a', {
                                    on: {
                                        click: () => {
                                            this.viewMaintain(this.data_work[params.index].orderId,this.data_work[params.index].executionStatus)
                                        }
                                    }
                                }, '查看')
                            }
                        }
                    },

                ],
                data_work: [
//                    {
//                        device_name:'CNC18',
//                        report_name:'001',
//                        report_time:'2017-02-12 16:45',
//                        fault_desc:'故障描述01',
//                        fault_reason:'故障原因01',
//                        spare_parts:'油管（1根）/...',
//                        bill_man:'机修工',
//                        bill_status:'进行中',
//                    },
//                    {
//                        device_name:'CNC18',
//                        report_name:'001',
//                        report_time:'2017-02-12 16:45',
//                        fault_desc:'故障描述02',
//                        fault_reason:'故障原因02',
//                        spare_parts:'油管（1根）/...',
//                        bill_man:'委外人员',
//                        bill_status:'未开始',
//                    }
                ],

                pageSize: 10,
                dataTotal: 0,
                page: 1,
            }
        },
        mounted(){
            this.postExecutionList();
        },
        activated: function () {
            this.created && this.postExecutionList();
            this.created = true;
        },
        methods: {
            viewMaintain(id,status) {
                this.$router.push({path: 'inMaintain',query: {"orderId": id,"executionStatus":status}});
            },
            goMaintain() {

                this.$router.push({path: 'goMaintain'});
            },
            postExecutionList(){
                this.$axios.post("terminal/getRepairOrderList",{
                    "page": this.page,                    //第几页
                    "pageSize": 10 ,            //每页记录数
                    "equipmentName": this.equipmentName,    //设备名称
                    "submitter": this.submitter,        //上报人
                    "executionStatus": this.executionStatus,     //执行状态
                    "submitTimeStart": this.submitTimeStart,  //上报时间开始
                    "submitTimeEnd": this.submitTimeEnd   //上报时间结束
                }).then((res) => {
                    console.log(res.data.response);
                    var ret = res.data.response;
                    if(ret.code == 1){
                        this.data_work = ret.data.rows;
                        this.dataTotal = ret.data.total;
                    }
                    else{
                        this.$Message.error(ret.msg);
                    }

                })
            },
            pageSearchTask(page){
                this.page = page;
                this.postExecutionList();
            },
            searchExecutionList(){
                this.page = 1;
                this.postExecutionList();
            },
            toValidate(msg){
                console.log(msg);
                if (msg.indexOf("'") != -1 ||msg.indexOf("\"") != -1) {
                    this.$Message.warning('输入格式错误')
                    msg = msg.replace(/\'/g,"").replace(/\"/g,"");
                }
                return msg
            },
        },
    }
</script>
