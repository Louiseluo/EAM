<template>
    <div>
        <div class="applyRecord">
            <div class="second-title">审核记录</div>
            <div class="mar-b-20">
                <Form ref="reformForm" :label-width="100" inline>
                    <FormItem label="审核状态" prop="">
                        <Input v-model="auditStatus" placeholder="" disabled></Input>
                    </FormItem>
                    <FormItem label="最新反馈日期" prop="">
                        <DatePicker v-model="auditDate" type="date" placeholder="选择日期和时间" :open="false" disabled></DatePicker>
                    </FormItem>
                </Form>
                <Table class="table-edit" stripe border :columns="historyColumns" :data="historyData"></Table>
                <div class="mar-t-10">
                    <div style="float: right;">
                        <Page size="small" :total="totalNum" show-elevator :page-size="pageSize" @on-change="pageChange"></Page>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<script type="text/ecmascript-6">
    export default{
        props: ["page","pageSize","billId"],
        data(){
            return {
                /*审核记录 - S - */
                historyColumns:[
                    {
                        title: '序号',
                        type: 'index',
                        width: 80,
                        align: 'center'
                    },
                    {
                        title: '反馈结果',
                        key: 'billStatus',
                        align: 'center',
                        render: (h, params) => {
                            return h('p', {
                                domProps: {
                                    title: params.row.billStatus
                                },
                                class: 'iview_tabDis',
                            }, params.row.billStatus)
                        },
                    },
                    {
                        title: '驳回意见',
                        key: 'comment',
                        align: 'center',
                        render: (h, params) => {
                            return h('p', {
                                domProps: {
                                    title: params.row.comment
                                }
                            }, params.row.comment)
                        }
                    },
                    {
                        title: '处理人',
                        key: 'processor',
                        align: 'center',
                        render: (h, params) => {
                            return h('p', {
                                domProps: {
                                    title: params.row.processor
                                },
                                class: 'iview_tabDis',
                            }, params.row.processor)
                        },
                    },
                    {
                        title: '处理日期',
                        key: 'processTime',
                        align: 'center',
                        render: (h, params) => {
                            return h('p', {
                                domProps: {
                                    title: params.row.processTime
                                },
//                                class: 'iview_tab_numDis',
                            }, params.row.processTime)
                        },
                    },
                    {
                        title: '处理信息',
                        key: 'action',
                        align: 'center',
                    },
                    {
                        title: '备注',
                        key: 'note',
                        align: 'center'
                    },
                ],
                historyData:[],
                auditDate:'',
                auditStatus:'',
                totalNum:0,
                /*审核记录 - E - */
            };
        },
        computed: {},
        mounted(){},
        watch: {
            billId:function(){
//                console.log("billId +" +this.billId)
                if(this.billId !== undefined){
                    this.loadHistoryList();
                }
            },
        },
        methods: {
            loadHistoryList(){
                let vm = this;
                this.$axios.post('/equipmentApplication/equApprovalHistory', {
                    page: vm.page,
                    pageSize: vm.pageSize,
                    billId : vm.billId,
                }).then((res) => {
                    let respone = res.data.response;
                    if (respone.code  === 1) {
                        vm.historyData = respone.data.rows;
                        vm.totalNum = respone.data.total;
                        if(vm.historyData.length > 0){
                            vm.auditDate = vm.historyData[0].processTime;
                            vm.auditStatus = vm.historyData[0].billStatus
                        }
                    } else {
                        //.. 业务失败的情况
                        this.$Message.error({
                            content: '数据返回错误',
                            duration: 5,
                            closable: true
                        });
                    }
                }).catch((err) => {
                    console.log("无数据 + " + err);
                });
            },
            pageChange(page){
                this.page = page;
                this.loadHistoryList();
            }
        }
    };

</script>

<style type="text/css">

</style>