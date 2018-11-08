<template>
    <div class="basic fault-content">
        <!--模块名称-->
        <div class="title">
            <span>待保养</span>
        </div>
        <div class="form-content">
            <Form ref="orderWorkForm" :model="orderWorkForm" label-position="right" inline :label-width="100">
                <!--<Form-item label="计划名称" prop="code">-->
                    <!--<Input v-model="orderWorkForm.workOrderBillNo" style="width: 160px;" placeholder=""></Input>-->
                <!--</Form-item>-->
                <!-- <Form-item label="设备地点" prop="equipmentName">
                     <div class="input-search">
                         <Input v-model="orderWorkForm.equipmentCode" style="width: 160px;" disabled></Input>
                         <Button icon="ios-search" @click="equipment_local = true"></Button>
                     </div>
                 </Form-item>-->
                <Form-item label="设备名称" prop="equipmentName">
                    <Input v-model="orderWorkForm.equipmentName" @on-blur="orderWorkForm.equipmentName = toValidate(orderWorkForm.equipmentName)" style="width: 160px;" placeholder=""></Input>
                </Form-item>
                <!--<Form-item label="工单类型" prop="status">-->
                    <!--<Select style="width: 160px;" v-model="orderWorkForm.planType">-->
                        <!--<Option v-for="item in planTypeArr" :value="item.code" :key="item.code">{{ item.desc }}</Option>-->
                    <!--</Select>-->
                <!--</Form-item>-->
                <Form-item label="执行状态">
                    <Select style="width: 160px;" v-model="orderWorkForm.planStatus">
                        <Option v-for="status in planStatusArr" :value="status.code" :key="status.code">{{ status.desc }}</Option>
                    </Select>
                </Form-item>
                <!--<Form-item label="计划等级" prop="playLevel">-->
                    <!--<Select style="width: 160px;" v-model="orderWorkForm.playLevel">-->
                        <!--<Option v-for="level in playLevelArr" :value="level.code" :key="level.code">{{ level.desc }}</Option>-->
                    <!--</Select>-->
                <!--</Form-item>-->
                <Form-item label="准点状态" prop="scheduleStatus">
                    <Select style="width: 160px;" v-model="orderWorkForm.scheduleStatus">
                        <Option v-for="status in scheduleStatusArr" :value="status.code" :key="status.code">{{ status.desc }}</Option>
                    </Select>
                </Form-item>
                <Form-item label="执行时间" prop="orderDate">
                    <Row>
                        <Col span="11">
                        <Date-picker type="date" v-model="orderWorkForm.startTime" placeholder="选择日期" @on-change="checkStart" :editable="false" style="width: 100%;display: inline-block"></Date-picker>
                        </Col>
                        <Col span="2" style="text-align: center">~</Col>
                        <Col span="11">
                        <Date-picker type="date" v-model="orderWorkForm.endTime" placeholder="选择日期" @on-change="checkEnd" :editable="false" style="width: 100%;display: inline-block"></Date-picker>
                        </Col>
                    </Row>
                </Form-item>
            </Form>
            <div class="btn-query">
                <Button type="primary" icon="search" size="large" @click="maintainList()">查询</Button>
            </div>
        </div>
        <!--表格-->
        <div class="table-content">
            <Table class="table-edit" stripe border :columns="columns_work" :data="data_work"></Table>
        </div>
        <div class="page">
            <Page :total="dataTotal" :current="orderCurrentPage" size="small" show-elevator :page-size="pageSize" @on-change="pageSearchInfoOrder"></Page>
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
//                if_do:  this.$rt(this.authJson.EAM.待保养.待保养页面.执行),
                if_do:  true,
                // if_detail:  this.$rt(this.authJson.EAM.待保养.待保养页面.查看),
                /*权限校验 end*/
                orderWorkForm:{
                    workOrderBillNo: '',
                    equipmentName: '',
                    planType: -1,
                    planStatus: -1,
                    playLevel: -1,
                    scheduleStatus: -1,
                    startTime: '',
                    endTime: ''
                },
                planTypeArr: this.$base_info.tEamDispatchOrderTypeEnum, //工单类型
                planStatusArr: this.$base_info.executionStatusEnum,//执行状态
                scheduleStatusArr: this.$base_info.tEamOrderIntimeStatusEnum,//准点状态
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
                            return h('p', {
                                domProps: {
                                    title: params.row.equipmentName
                                },
                                class: 'iview_tabDis',
                            }, params.row.equipmentName)
                        },
                    },
                    {
                        title: '计划名称',
                        key: 'planName',
                        align: 'center',
                        render: (h, params) => {
                            return h('p', {
                                domProps: {
                                    title: params.row.planName
                                },
                                class: 'iview_tabDis',
                            }, params.row.planName)
                        },
                    },
                    {
                        title: '计划等级',
                        key: 'planGrade',
                        align: 'center',
                    },
                    {
                        title: '标准方案名称',
                        key: 'standardSolutionName',
                        align: 'center',
                        render: (h, params) => {
                            return h('p', {
                                domProps: {
                                    title: params.row.standardSolutionName
                                },
                                class: 'iview_tabDis',
                            }, params.row.standardSolutionName)
                        },
                    },
                    {
                        title: '预计耗时（分钟）',
                        key: 'expectTime',
                        align: 'center',
                        render: (h, params) => {
                            return h('p', {
                                domProps: {
                                    title: params.row.expectTime
                                },
                                class: 'iview_tab_numDis',
                            }, params.row.expectTime)
                        },
                    },
                    {
                        title: '是否停机',
                        key: 'isStop',
                        align: 'center',
                    },
                    {
                        title: '计划保养时间',
                        key: 'plannedStartTime',
                        align: 'center',
//                        width: 280,
//                        render: (h, params) => {
//                            return h('span', this.$fc.dateFormat(params.row.plannedStartTime, "yyyy-MM-dd"));
//                        }
                    },
                    {
                        title: '执行岗位',
                        key: 'position',
                        align: 'center',
                        render: (h, params) => {
                            return h('p', {
                                domProps: {
                                    title: params.row.position
                                },
                                class: 'iview_tabDis',
                            }, params.row.position)
                        },
                    },
                    {
                        title: '执行状态',
                        key: 'status',
                        align: 'center',
                    },
                    {
                        title: '操作',
                        key: 'action',
                        align: 'center',
                        render: (h, params) => {
                            let btns = [];
                            if(this.if_do) {
                                btns.push(
                                    h('a', {
                                        on: {
                                            click: () => {
                                                this.goExecuteWorkOrder(this.datas[params.index].status,params.row.orderId)
                                            }
                                        }
                                    }, '执行'),
                                )
                            }
                            return h('div', btns
                                // []
                            );
                        },
                    },

                ],
                data_work: [

                ],

                pageSize: 10,
                dataTotal: 0,
                orderCurrentPage: 1,
                datas:[
                    {
                        status:0,
                    }
                ],
                created:false,
            }
        },

        mounted() {
            this.maintainList();
        },
        activated: function () {
            this.created && this.maintainList();
            this.created = true;
        },
        methods: {
            //验证输入框格式
            toValidate(msg){
                console.log(msg);
                var str = /[=+%!<>"'/_,()\\]/
                if(str.test(msg)){
                    this.$Message.warning('输入格式错误')
                    msg = msg.replace(/\'/g,"").replace(/\"/g,"").replace(/\+/g,"").replace(/\=/g,"").replace(/\%/g,"").replace(/\!/g,"").replace(/\</g,"").replace(/\>/g,"").replace(/\//g,"").replace(/\_/g,"").replace(/\,/g,"").replace(/\(/g,"").replace(/\)/g,"").replace(/\\/g,"");
                }
                return msg
            },
            //开始日期应小于结束日期
            checkStart(time){
                var stime = time;
                if (this.orderWorkForm.endTime != '') {
                    if (stime > this.orderWorkForm.endTime) {
                        this.notFitDataTip = '开始时间应在结束时间之前';
                        this.$Message.error(this.notFitDataTip);
                    }
                    else {
                        this.notFitDataTip = ""
                    };
                };
                this.orderWorkForm.startTime = stime
            },
            //结束日期应大于开始日期
            checkEnd(time){
                var etime = time;
                if (this.orderWorkForm.startTime != '') {
                    if (etime < this.orderWorkForm.startTime) {
                        this.notFitDataTip = '结束时间应在开始时间之后';
                        this.$Message.error(this.notFitDataTip);
                    }
                    else {
                        this.notFitDataTip = ""
                    }
                };
                this.orderWorkForm.endTime = etime;
//                if (this.time_start!= '') {
//                    if (this.time_end<= this.time_start) {
//                        this.$Message.error('结束时间应大于开始时间');
//                    }
//                }
            },
            maintainList(){
                this.$axios.get('terminal/listMaintain', {params:{
                    page: this.orderCurrentPage,
                    pageSize: 10,
                    equipmenName: this.orderWorkForm.equipmentName,
                    executeStatus: this.orderWorkForm.planStatus==-1?'':this.orderWorkForm.planStatus ,
                    onTimeStatus: this.orderWorkForm.scheduleStatus==-1?'':this.orderWorkForm.scheduleStatus ,
                    startTime: this.orderWorkForm.startTime,
                    endTime: this.orderWorkForm.endTime
                }}).then((res) => {
                    let ret = res.data.response;
                    if (ret.code != 1) {
                        this.$Message.error(ret.msg);
                    } else {
                        console.log(ret)
                        this.data_work = ret.data.rows;
                        this.datas = ret.data.rows
                        this.dataTotal = ret.data.total;
                        for(var i in ret.data.rows){ //isStop
                            this.data_work[i].expectTime = ret.data.rows[i].expectTime?ret.data.rows[i].expectTime:'';
                            this.data_work[i].status = this.$base_info.getDescByCode(ret.data.rows[i].status,this.planStatusArr);
                            this.data_work[i].planGrade = this.$base_info.getDescByCode(ret.data.rows[i].planGrade,this.$base_info.planClazz);
                            this.data_work[i].isStop = ret.data.rows[i].isStop==0?'是':'否';
                        }
//                        this.postAuditList();
                    }
                }).catch((err) => {
                    console.log(err);
                })
            },
            goExecuteWorkOrder(status,orderId) {
                this.$router.push({path: 'unRepairedExe', query: {'orderId':orderId }});/*暂代 0 是未开始，1 是进行中*/
            },
            pageSearchInfoOrder: function (page) {
                this.orderCurrentPage = page;
                this.maintainList();
            },
        },
    }
</script>
