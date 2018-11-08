<template>
    <div>
        <div class="table-content">
            <Table class="mar-b-15 table-edit" stripe border :columns="allColumns" :data="allData"></Table>
        </div>
        <div class="page">
            <Page :total="pageNum" :current="currentPage" size="small" show-elevator :page-size="pageSize" ></Page>
        </div>
        <Row class="btn-group" v-show="!from">
            <Col class="pad-15" span="24" align="center">
            <router-link to='/maintenancePlan' class="mar-r-15">
                <Button class="btn-gary" icon="close" size="large">返回</Button>
            </router-link>
            <!--<Button type="primary" icon="compose" size="large" @click="goPlandDetailEdit()">编辑</Button>-->
            </Col>
        </Row>
    </div>
</template>

<script type="text/ecmascript-6">

    export default {
        props: ['from'],
        data () {
            return {
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
                ],
                allData: [],
                currentPage:1,
                pageNum:0,
                pageSize:5,
            }
        },
        methods: {
            //设备型号查询：
            monthDetail(id,pageSize,currentPage){
                this.$axios.post('/plan/getDayPlanTime',{
                    planId: id,
                    pageSize:pageSize,
                    pageNum:currentPage
                }).then((res) => {
                    let respone = res.data.response;
                    if( respone.code == 1){
                        this.allData =  respone.data;
                        this.pageNum = respone.data[0].count
                    }else {
                        this.$Message.error(respone.msg);
                    }
                }).catch((err) => {
                    console.log(err);
                });
            },
        },
        mounted () {
            this.monthDetail(this.$route.query.planTaskId);
        },

    }
</script>

<style type="text/css">

</style>