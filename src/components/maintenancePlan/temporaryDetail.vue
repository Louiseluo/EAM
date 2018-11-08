<template>
    <div>
        <Form :model="planAddForm" label-position="right" inline :label-width="135">
            <Form-item label="调度类型" prop="circleType">
                <Select v-model="planAddForm.scheduleType" style="width: 160px;" disabled>
                    <Option value="0">周期计划</Option>
                    <Option value="1">临时计划</Option>
                </Select>
            </Form-item>
            <br/>
            <Form-item label="执行日期" prop="firstStartTime">
                <Date-picker v-model="planAddForm.firstStartTime" type="date" placeholder="选择日期和时间" style="width: 160px" confirm disabled readonly></Date-picker>
            </Form-item>
            <Form-item label="执行时间" prop="happenHMS">
                <TimePicker v-model="planAddForm.happenHMS" format="HH:mm:ss" placeholder="选择时间" disabled readonly></TimePicker>
            </Form-item>
            <Form-item label="执行时间段" prop="">
                <Select v-model="planAddForm.isProductTime" style="width: 135px" readonly disabled>
                    <Option value="1">非生产时间</Option>
                    <Option value="0">生产时间</Option>
                </Select>
            </Form-item>
            <span class="line-30 mar-tb-10 display-in-b col-red">提醒：录入非精确时间（几点几分）时，请选择是否为生产时间。</span>
        </Form>
        <Row class="btn-group" v-show="!from">
            <Col class="pad-15" span="24" align="center">
            <router-link to='/maintenancePlan' class="mar-r-15">
                <Button class="btn-gary" icon="close" size="large">返回</Button>
            </router-link>
            <Button type="primary" icon="compose" size="large" @click="goEditPlan(planId);"  v-show="state!=2&&theState==0">编辑</Button>
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
                planAddForm: {
                    scheduleType: "",
                    isProductTime: 1,
                    firstStartTime: new Date(),
                },

            }
        },
        methods: {
            //设备型号查询：
            monthDetail(id){
                this.$axios.post('/plan/getTempPlanTime',{
                    planId: id
                }).then((res) => {
                    console.log("查看临时计划的详情数据==========》");
                    console.log(res);
                    let respone = res.data.response;
                    if( respone.code == 1){
                        let planData = res.data.response.data;
                        this.planAddForm.scheduleType = ''+planData.type+'';
                        this.planAddForm.firstStartTime = planData.date;
                        this.planAddForm.isProductTime = ''+planData.product;
                        this.planAddForm.happenHMS = planData.time;
                    }else {
                        this.$Message.error("错误 +" + respone.msg);
                    }
                }).catch((err) => {
                    console.log(err);
                });
            },
            goEditPlan(planId){
                this.$router.push({path: '/planAdd', query: {"planTaskId": planId}});
            },
        },
        mounted () {
            this.planId = this.$route.query.planTaskId;
            this.monthDetail(this.$route.query.planTaskId);
        },

    }
</script>

<style type="text/css">

</style>