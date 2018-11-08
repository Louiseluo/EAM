<template>
    <div style="padding-bottom:30px;">
        <div class="table-content">
            <Table class="mar-b-15 table-edit" stripe border :columns="allColumns" :data="allData"></Table>
        </div>
        <div class="page">
            <Page :total="pageTotal"  size="small"   show-elevator :page-size="5" @on-change="changePage" :current="currentPage"></Page>
        </div>
        <Row class="btn-group" v-show="!from">
            <Col class="pad-15" span="24" align="center">
            <router-link to='/maintenancePlan' class="mar-r-15">
                <Button class="btn-gary" icon="close" size="large">返回</Button>
            </router-link>
            <Button type="primary" icon="compose" size="large" @click="goPlandDetailEdit(planId)"  v-show="state!=2&&theState==0">编辑</Button>
            </Col>
        </Row>
    </div>
</template>
<script type="text/ecmascript-6">
    export default {
        props: ['state','from','theState'],
        data () {
            return {
                planId:'',
                allColumns: [
                    {
                        title: '序号',
                        type: 'index',
                        align: 'center',
                        width: 80,
                    },
                    {
                        title: '执行日期',
                        key: 'triggerDay',
                        align: 'center',
                    },
                    {
                        title: '执行时间',
                        key: 'triggerTime',
                        align: 'center',
                    },
//                    {
//                        title: '操作',
//                        key: 'execTime',
//                        align: 'center',
//                        render: (h, params) => {
//                            return h('div', [
//                                h('a', {
//                                    class: 'mar-r-5',
//                                    on: {
//                                        click: () => {
//                                            console.log("this.allData[params.index].id +" + this.allData[params.index].id)
//                                            this.goViewPlan(this.allData[params.index].id);
//                                        }
//                                    }
//                                }, '查看'),
//                            ]);
//                        },
//                    },
                ],
                allData: [],
                currentPage:1,
                pageNum:0,
                pageSize:5,
                pageTotal:1,
            }
        },
        methods: {
            //设备型号查询：
            monthDetail(){
                let vt=this;
                this.$axios.post('/plan/getMonthPlanTime',{
                    planId:vt.planId,
                    pageSize:5,
                    pageNum:vt.currentPage
                }).then((res) => {
                    let planData = res.data.response.data;
                   vt.allData =  planData;
                    vt.pageTotal =planData[0].count;
                }).catch((err) => {
                    console.log(err);
                });
            },
            goViewPlan(id) {//查看计划详情
                this.$router.replace({path: '/PlanDetail', query: {"planTaskId": id}});
                window.location.reload()
            },
            goPlandDetailEdit(planId){ //编辑
                this.$router.push({path: '/planAdd', query: {"planTaskId": planId}});
            },
            changePage(currentPage){
                this.currentPage=currentPage;
                this.monthDetail();
            },
        },
        mounted () {
            this.planId = this.$route.query.planTaskId;
            this.monthDetail();
        },

    }
</script>

<style type="text/css">

</style>