<template>
    <div class="fault-content">
        <!--审核记录：-->
        <Form ref="auditForm" :model="auditForm" label-position="right" inline :label-width="100">
            <Form-item label="审核状态" prop="auditStatus">
                <Input v-model="auditForm.auditStatus" style="width: 160px;" placeholder="" disabled></Input>
            </Form-item>
            <Form-item label="最新反馈日期" prop="auditStatus">
                <Date-picker v-model="auditForm.feedbackTime" type="datetime" placeholder="选择日期和时间"
                             style="width: 160px" disabled readonly></Date-picker>
            </Form-item>
        </Form>
        <div style="overflow: hidden;margin-top: 10px;">
            <div class="table-content">
                <Table class="mar-b-15 table-edit" stripe border :columns="auditColumns" :data="auditData"></Table>
            </div>
            <div class="page" style="margin: 0;">
                <Page :total="auditTotal" :current="auditPage" size="small" show-elevator :page-size="5"
                      @on-change="auditChange"></Page>
            </div>
        </div>

    </div>
</template>

<script>
    export default {
        props: ['planId'],
        data () {
            return {
                auditForm: {
                    auditStatus: '',
                    feedbackTime: ''
                },
                auditColumns: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 80,
                        align: 'center'
                    },
                    {
                        title: '反馈结果',
                        key: 'processResult',
                        align: 'center',
                    },
                    {
                        title: '驳回意见',
                        key: 'rejectadvise',
                        align: 'center',
                        render: (h, params) => {
                            return h('p', {
                                domProps: {
                                    title: params.row.rejectAdvice
                                },
                                class: 'iview_tabDis',
                            }, params.row.rejectAdvice)
                        },
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
                    },
                    {
                        title: '处理信息',
                        key: 'processMsg',
                        align: 'center',
                    },
                    {
                        title: '备注',
                        key: 'note',
                        align: 'center',
                        render: (h, params) => {
                            return h('p', {
                                domProps: {
                                    title: params.row.note
                                },
                                class: 'iview_tabDis',
                            }, params.row.note)
                        },
                    },
                ],
                auditData: [
//                    {
//                        approvalStatus: '待审核 ',
//                        processResult: '减少测试备件001消耗',
//                        rejectadvise: 'admin001',
//                        processor: '2017-10-22 13:12',
//                        processTime: '重新提交审核',
//                        processMsg: '已减少至最低理论消耗',
//                        note: ''
//                    },
                ],
                auditPage: 1,
                auditTotal: 0,
            }
        },
        methods: {
            //审核记录
            getAuditData(){
                this.$axios.post('/plan/planAuditDetail', {
                    page: this.auditPage,
                    pageSize: 5,
                    planId: this.planId
                }).then((res) => {
                    let ret = res.data.response;
                    console.log(ret);
                    if (ret.code != 1) {
                        this.$Message.error(ret.msg);
                    } else {
                        this.auditData = ret.data.rows;
                        this.auditTotal = ret.data.count;
                        this.auditForm.feedbackTime = ret.data.newProcessTime
                        this.auditForm.auditStatus = this.$base_info.getDescByCode(ret.data.approvalStatus, this.$base_info.planStatus);
                        //processResult
                        for(var i in this.auditData){
                            this.auditData[i].processResult = this.$base_info.getDescByCode(ret.data.rows[i].processResult, this.$base_info.planStatus);
                        }
//                        this.auditForm.auditStatus = ret.data.rows[0].approvalStatus
                    }
                }).catch((err) => {
                    console.log(err);
                })
            },
            auditChange(page){
                this.auditPage = page;
                this.getAuditData();
            },

        },
        mounted () {
            this.getAuditData();
        },

    }
</script>


