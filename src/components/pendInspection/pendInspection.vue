<template>
    <div class="basic fault-content">
        <!--模块名称-->
        <div class="title">
            <span>待点检</span>
        </div>
        <!--表格-->
        <div class="table-content">
            <Table class="table-edit" stripe border :columns="columns_work" :data="data_work"></Table>
        </div>
        <div class="page">
            <Page :total="data2Total" :current="orderCurrentPage" size="small" show-elevator :page-size="pageSize"></Page>
        </div>
        <!--操作按钮-->
        <!-- <Row class="btn-group">
             <Col class="pad-15" span="24" align="center">
                 <Button v-show="button_14551" type="primary" icon="card" size="large">返回</Button>
                 <Button v-show="button_14552" type="primary" icon="card" size="large">确定</Button>
             </Col>
         </Row>-->
    </div>
</template>
<script>
    export default {
        data (){
            return {
                orderCurrentPage: 1,
                pageSize: 10,
                button_14611: this.$rt('14611'),
                searchParams: {
                    kinds: '任务,作业',
                    startTime: '',
                    endTime: '',
                    planStatus: '',
                    planType: '',
                    equipmentName: '',
                    workOrderBillNo: '',
                    billNo: '',
                    createByName: '',
                    unRepairedFlag: 'Yes',
                },
                columns_work: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 80,
                        align: 'center'
                    },
                    {
                        title: '点检计划名称',
                        key: 'inspectName',
                        align: 'center',
                    },
                    {
                        title: '工单下发时间',
                        key: 'planSchedule',
                        align: 'center',
                    },
                    {
                        title: '计划点检时间',
                        key: 'inspectTime',
                        align: 'center',
                    },
                    {
                        title: '点检人',
                        key: 'inspectMan',
                        align: 'center',
                    },
                    {
                        title: '点检状态',
                        key: 'inspectStatus',
                        align: 'center',
                    },
                    {
                        title: '计划类型',
                        key: 'inspectType',
                        align: 'center',
                    },
                    /* {
                     title: '触发时间',
                     key: 'startTime',
                     align: 'center',
                     },*/
                    {
                        title: '结果',
                        key: 'result',
                        align: 'center',
                        /*render:(h,params) =>{
                         return h('i-select', {
                         props: {
                         value: params.row.result
                         }
                         }, [
                         h('i-option', {
                         props: {
                         value: '1'
                         }
                         }, '合格'),
                         h('i-option', {
                         props: {
                         value: '2'
                         }
                         }, '不合格'),
                         ])
                         }*/
                    },
                    {
                        title:'操作',
                        align:'center',
                        render:(h,params) =>{
                            if(params.row.status == 1){
                                return  h('a', {
                                    on: {
                                        click: () => {
                                            this.view();
                                        }
                                    }
                                }, '查看')
                            }else {
                                return  h('a', {
                                    on: {
                                        click: () => {
                                            this.view();
                                        }
                                    }
                                }, '点检')
                            }

                        }

                    }
                ],
                data_work: [
                    {
                        status:0,
                        inspectName:'',
                        planSchedule:'',
                        inspectTime:'',
                        inspectMan:'',
                        inspectStatus:'待检',
                        inspectType:'每天',
                        startTime:'',
                        result:'1'
                    },
                    {
                        status:1,
                        inspectName:'',
                        planSchedule:'',
                        inspectTime:'',
                        inspectMan:'',
                        inspectStatus:'已检',
                        inspectType:'每天',
                        startTime:'',
                        result:'2'
                    },
                ],
                data2Total: 0,
                tabName: '0',
            }
        },

        mounted() {
            /**/
        },

        watch: {
//
        },

        methods: {
            view(index){
                this.$router.push({path: '/pendInspectionStart'});
            },
        },
    }
</script>
