<template>
    <div>
        <Form :model="planAddForm" label-position="right" inline :label-width="135">
            <Form-item label="调度类型" prop="circleType">
                <Select v-model="planAddForm.scheduleType" style="width: 160px;" disabled>
                    <Option value="0">周期计划</Option>
                    <Option value="1">临时计划</Option>
                </Select>
            </Form-item><br/>
            <Form-item label="开始时间" prop="firstStartTime">
                <Date-picker v-model="planAddForm.firstStartTime" type="date" placeholder="选择日期和时间" style="width: 160px" confirm disabled readonly></Date-picker>
            </Form-item>
            <Form-item label="触发间隔" prop="">
                <Select v-model="planAddForm.periodUnit" style="width: 135px" readonly disabled>
                    <Option v-for="item in planAddForm.periodUnitType" :value="item.code" :key="item">{{ item.desc }}</Option>
                </Select>
            </Form-item>
            <span class="line-30 mar-tb-10 display-in-b col-red">提醒：录入非精确时间（几点几分）时，请选择是否为生产时间。</span>
        </Form>
        <div class="table-content">
            <Table class="mar-b-15 table-edit" stripe border :columns="allColumns" :data="allData"></Table>
        </div>
        <Row class="btn-group" v-show="!from">
            <Col class="pad-15" span="24" align="center">
            <router-link to='/maintenancePlan' class="mar-r-15">
                <Button class="btn-gary" icon="close" size="large">返回</Button>
            </router-link>
            <Button type="primary" icon="compose" size="large" @click="goEditPlan(planId);" v-show="state!=2&&theState==0">编辑</Button>
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
                    periodUnitType:this.$base_info.planIntervalTime2,
                    periodUnit: 1,
                    firstStartTime: new Date(),
                    controlTypeName: '',
                },
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
                    {
                        title: '执行时间段',
                        key: 'isProductTime',
                        align: 'center',
                    },
                ],
                allData: [],
            }
        },
        methods: {
            //设备型号查询：
            monthDetail(id){
                this.$axios.post('/plan/getYearPlanTime',{
                    planId: id
                }).then((res) => {
                    let respone = res.data.response;
                    if( respone.code == 1){
                        console.log("查看年计划的返回数据=========》");
                        console.log(res);
                        let planData = res.data.response.data;
                        this.planAddForm.scheduleType = ''+planData[0].timeType+'';
                        this.planAddForm.firstStartTime = planData[0].beginTime;
                        this.planAddForm.periodUnit = planData[0].intervalTime;
                        for(let i in planData[1]){
                            if(planData[1][i].isProductTime == 0){
                                planData[1][i].isProductTime = "生产时间段"
                            }else{
                                planData[1][i].isProductTime = "非生产时间段"
                            }
                        }
                        this.allData = planData[1];
                    }else {
                        this.$Message.error(respone.msg);
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