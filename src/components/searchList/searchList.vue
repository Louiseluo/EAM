<template>
    <div class="basic bzzy-change">
        <Spin fix v-show="load_fix">
            <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
            <div>保存中，请稍后...</div>
        </Spin>
        <!--模块名称-->
        <div class="title">
            <!-- 婷婷注释 <span>维保工单列表</span>-->
        </div>
        <!--表格-->
        <div class="table-content">
            <Tabs type="card" :value="tabName">
                <Tab-pane v-if="button_14214" label="任务" icon="cube" name="0">
                    <Table stripe border :context="self" :columns="columns1" :data="data1"></Table>
                    <div class="page mar-t-15">
                        <Page :total="data1Total" :current="taskCurrentPage" size="small" show-elevator :page-size="pageSize" @on-change="pageSearchInfoTask"></Page>
                    </div>
                </Tab-pane>
                <Tab-pane label="作业" icon="social-buffer" name="1">
                    <!--<div align="right" class="mar-b-15">-->
                        <!--<router-link to='/workAdd'>-->
                            <!--<Button v-show="button_14221" type="primary" icon="play" size="large">紧急维修</Button>-->
                        <!--</router-link>-->
                    <!--</div>-->
                    <Table stripe border :context="self" :columns="columns2" :data="data2"></Table>
                    <div class="page mar-t-15">
                        <Page :total="data2Total" :current="orderCurrentPage" size="small" show-elevator :page-size="pageSize" @on-change="pageSearchInfoOrder"></Page>
                    </div>
                </Tab-pane>
            </Tabs>
        </div>
    </div>
</template>

<script>
    export default {
        data (){
            return {
                load_fix: false,
                self: this,
                pageSize: 10,
                button_14211: this.$rt('14211'),
                button_14212: this.$rt('14212'),
                button_14214: this.$rt('14214'),
                button_14221: this.$rt('14221'),
                button_14226: this.$rt('14226'),
                button_14227: this.$rt('14227'),
                button_14228: this.$rt('14228'),
                taskCurrentPage: 1,
                orderCurrentPage: 1,
                workForm: { },
                searchParams:{
                    kinds: '任务,作业',
                    startTime: '',
                    endTime: '',
                    planStatus: '',
                    planType: '',
                    equipmentName: '',
                    workOrderBillNo: '',
                    billNo: '',
                    createByName: '',
                },
                columns1: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 80,
                        align: 'center'
                    },
                    {
                        title: '工作类型',
                        key: 'workflow_type',
                    },
                    {
                        title: '单据类型',
                        key: 'bill_type',
                    },
                    {
                        title: '工单状态',
                        key: 'bill_status_name',
                    },
                    {
                        title: '工单编码',
                        key: 'bill_no',
                    },
                    {
                        title: '计划名称',
                        key: 'plan_name',
                    },
                    {
                        title: '设备名称',
                        key: 'device_name',
                    },
                    {
                        title: '标准方案',
                        key: 'workflow_stank',
                    },
                    {
                        title: '计划维保时间',
                        key: 'hitch_sure_time',
                    },
                    {
                        title: '上次维保时间',
                        key: 'last_hitch_fix_time',
                    },
                    {
                        title: '建议维保时间',
                        key: 'planDate',
//                        width: 280,
                    },
                    {
                        title: '操作',
                        key: 'action',
                        align: 'center',
                        render (params) {
                            return `<a type="text" v-show="button_14211" size="small" @click="goViewPlan('${params.taskId}')">查看</a>
									<a type="text" v-show="button_14212" size="small" class="mar-l-5" @click="goCopyPlan('${params.taskId}')">复制</a>`
                                ;
                        }
                    }
                ],
                data1: [
//                    {
//                        workflow_type: '保养',
//                        bill_type: '维保工单',
//                        bill_status: '生效 ',
//                        bill_no: 'M161212001 ',
//                        device_name: '压铸岛1号设备',
//                        workflow_stank: '压铸岛设备机油更换 ',
//                        hitch_sure_time: '2016.12.15  09:00',
//                        last_hitch_fix_time: '2016.11.12  08:46',
//						planDate: '2017-06-15 00:00:00~2017-06-17 00:00:00',
//                    },
                ],
                data1Total: 0,
                columns2: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 80,
                        align: 'center'
                    },
                    {
                        title: '工作类型',
                        key: 'workflow_type',
                    },
                    {
                        title: '工单状态',
                        key: 'bill_status_name',
                    },
                    {
                        title: '工单编码',
                        key: 'bill_no',
                    },
                    {
                        title: '设备名称',
                        key: 'device_name',
                    },
                    {
                        title: '标准方案',
                        key: 'workflow_stank',
                    },
                    {
                        title: '计划维保时间',
                        key: 'hitch_sure_time',
                    },
                    {
                        title: '上次维保时间',
                        key: 'last_hitch_fix_time',
                    },
                    {
                        title: '建议维保时间',
                        key: 'planDate',
//                        width: 280,
                    },
                    {
                        title: '操作',
                        key: 'action',
                        align: 'center',
                        render (params) {
                            let buttons = `<a type="text" v-show="button_14226" size="small" @click="goViewWorkOrder('${params.workOrderId}')">查看</a>
									<a type="text" v-show="button_14227" size="small" class="mar-l-5" @click="goCopyWorkOrder('${params.workOrderId}')">复制</a>`;
                            if(params.bill_status == 1 || params.bill_status == 2) {
                                buttons += `<a type="text" v-show="button_14228" size="small" class="mar-l-5" @click="goExecuteWorkOrder('${params.workOrderId}')">执行</a>`;
                            }
                            return buttons;
                        }
                    }
                ],
                data2: [
//                    {
//                        workflow_type: '保养',
//                        bill_status: '生效 ',
//                        bill_no: 'M161212001 ',
//                        device_name: '压铸岛1号设备',
//                        workflow_stank: '压铸岛设备机油更换 ',
//                        hitch_sure_time: '2016.12.15  09:00',
//                        last_hitch_fix_time: '2016.11.12  08:46',
//						planDate: '2017-06-15 00:00:00~2017-06-17 00:00:00,2017-06-15 00:00:00~2017-06-17 00:00:00',
//                    },
//                    {
//                        workflow_type: '维修',
//                        bill_status: '制单 ',
//                        bill_no: 'M161215001 ',
//                        device_name: '压铸岛2号设备',
//                        workflow_stank: '压铸岛设备轴承更换 ',
//                        hitch_sure_time: '2016.12.15  09:00',
//                        last_hitch_fix_time: '2016.11.12  08:46',
//						planDate: '2017-06-15 00:00:00~2017-06-17 00:00:00',
//                    },
                ],
                data2Total: 0,
                tabName:'0',
            }
        },
        mounted() {
            this.initPage();
        },
        watch: {
          "$route.query": function() {
              this.initPage();
          }
        },
        methods: {
            initPage: function() {
                this.pageQuery = this.$route.query;
//                this.load_fix = true;
                setTimeout(this.searchInfoTask(0, this.pageQuery),1000);

                this.searchTpmPlanOrder(0, this.pageQuery);
                if(this.pageQuery.tabName !== undefined) {
                    this.tabName = this.pageQuery.tabName
                }else {
                    this.showTab(this.pageQuery.kinds);
                }
            },
            goViewPlan(id) {//计划详情
//                console.log(id)
                this.$router.push({path:'/PlanDetail',query: {"planTaskId": id}});
            },
            goCopyPlan: function (id) {
                this.$router.push({path:'/PlanEdit',query: {"planTaskId": id, "c": 1}});
            },
            goViewWorkOrder(id) {//工单详情
                this.$router.push({path:'/orderDetail',query: {"workOrderId": id}});
            },
            goEditWorkOrder(id) {//工单编辑
                this.$router.push({path:'/orderEdit',query: {"workOrderId": id}});
            },
            goCopyWorkOrder(id) {//工单编辑
                this.$router.push({path:'/orderEdit',query: {"workOrderId": id, "c": 1}});
            },
            goExecuteWorkOrder(id) {
                this.$router.push({path:'/workDetail',query: {"workOrderId": id}});
            },
            saveClickHandler(){
                console.log(this.workForm);
            },
            remove(index) {
                // 删一个数组元素
                this.data1.splice(index,1);
            },
            searchInfoTask: function (currentPage, p) {
                let flg = false;
                console.log("search task...");
                if(p.kinds === undefined) {
                    p = this.searchParams;
                }
                p.kinds = p.kinds.replace(/任务/, "0")
                p.kinds = p.kinds.replace(/作业/, "1")

//                console.log("p.kinds: " + p.kinds);
                if (currentPage == 0) {
                    flg = true;
                    p["page"] = 1;
                }else {
                    p["page"] = currentPage;
                }
                let vm = this;
                if(p.kinds.indexOf("0") !== -1) {
                    this.$axios.post('tpmPlan/searchTpmPlanTask',p).then((res) => {
                        var result = res.data.response.data;
                        vm.data1 = result.Rows;
                        vm.data1Total = result.Total;
                        if(flg) {
                            vm.taskCurrentPage = 1;
                        }
                    }).catch((err) => {
                        console.log(err);
                    });
                }else {
                    vm.data1 = [];
                    vm.data1Total = 0;
                }

            },
            pageSearchInfoTask: function(page) {
                this.taskCurrentPage = page;
                this.pageQuery["page"] = page;
                this.searchInfoTask(page, this.pageQuery);
            },
            searchTpmPlanOrder: function (currentPage, p) {
                let flg = false;
                console.log("search order...");
                if(p.kinds === undefined) {
                    p = this.searchParams;
                }
                if (currentPage == 0) {
                    flg = true;
                    this.pageQuery["page"] = 1;
                }else {
                    p["page"] = currentPage;
                }
                p.kinds = p.kinds.replace(/任务/, "0")
                p.kinds = p.kinds.replace(/作业/, "1")
                let vm = this;
                if(p.kinds.indexOf("1") !== -1) {
                    this.$axios.post('tpmPlan/searchTpmPlanOrder',p).then((res) => {
                        var result = res.data.response.data;
                        vm.data2 = result.Rows;
                        vm.data2Total = result.Total;
                        if(flg) {
                            vm.orderCurrentPage = 1;
                        }
                    }).catch((err) => {
                        console.log(err);
                    });
                }else {
                    vm.data2 = [];
                    vm.data2Total = 0;
                }
            },
            pageSearchInfoOrder: function(page) {
                this.orderCurrentPage = page;
                this.pageQuery["page"] = page;
                this.searchTpmPlanOrder(page, this.pageQuery);
            },
            showTab: function(kinds) {
                if(kinds === undefined) {
                    this.tabName = '0';
                    return;
                }
                kinds = kinds.replace(/任务/, "0")
                kinds = kinds.replace(/作业/, "1")
                if(kinds.indexOf("0") == -1 && kinds.indexOf("1") == 0) {
                    this.tabName = '1';
                }else {
                    this.tabName = '0';
                }
            }
        }
    }
</script>

<style>
    .bzzy-change .btn-group {
        margin: 15px 0px;
        text-align: center;
    }

    .bzzy-change .btn-group button {
        margin: 0px 10px;
    }
</style>
