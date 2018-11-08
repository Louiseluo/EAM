<!--数据统计——设备记录-->

<!--数据统计——工单执行-->
<!--数据统计——人员考核-->
<!--数据统计——备品备件-->


<template class="meetingManage">
    <!--<transition name="slide-right">-->
    <div class="basic fault-content">
        <!--模块名称-->
        <div class="title">
            <span>数据统计</span>
        </div>
        <div class="titleListManage">
            <ul class="tabUL">
                <li>
                    <router-link to='/dataTrouble'>设备故障</router-link>
                </li>
                <li>
                    <router-link to='/dataReplacement'>备品备件</router-link>
                </li>
                <li>
                    <router-link to='/dataAppraise'>人员考核</router-link>
                </li>

                <li>
                    <router-link to='/dataPerformancet'>工单执行</router-link>
                </li>
                <li class="active">
                    <a>设备记录</a>
                </li>
                <li>
                    <router-link to='/dataDepreciation'>设备折旧</router-link>
                </li>
            </ul>
        </div>
        <div>

            <div class="radio_item">
                <Form inline :label-width="90">
                    <FormItem label="时间选择">
                        <Row>
                            <Col span="11">
                            <DatePicker type="datetime" placeholder="选择日期和时间"
                            ></DatePicker>
                            </Col>
                            <Col span="2" align="center">
                            ~</Col>
                            <Col span="11">
                            <DatePicker type="datetime" placeholder="选择日期和时间"
                            ></DatePicker>
                            </Col>
                        </Row>
                    </FormItem>
                    <FormItem>
                        <div class="btnGroupDesign">
                            <Button type="primary">导出</Button>
                            <Button type="primary">查询</Button>
                        </div>
                    </FormItem>
                </Form>
            </div>

        </div>

        <div>

            <Row class="mar-bot-1percent">
                <Col span="12">

                <div class="radio_item chartDis" id="taskNumberChart">
                </div>

                </Col>
                <Col span="11" style="margin-left:1%;">
                <div class="radio_item chartDis" id="numberPercentChart">

                </div>
                </Col>

            </Row>
        </div>
    </div>
</template>
<script>
    export default {
        data (){
            return {
                //各类工单趋势：
                taskNumber: {
                    maintenance: [20.0, 24.9, 17.0, 23.2, 25.6, 26.7, 15.6, 22.2, 30.6, 20.0, 16.4, 23.3],
                    dailyCheckup: [2.6, 5.9, 9.0, 16.4, 18.7, 20.7, 10.6, 12.2, 17.7, 18.8, 6.0, 2.3],
                    patrol: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2],
                    plan: [3.6, 4.9, 7.0, 15.4, 18.7, 13.7, 10.6, 12.2, 13.7, 15.8, 10.0, 5.3],
                },
                //各类工单占比：
                numberPercent: [{value: 335, name: '设备维修'},
                    {value: 210, name: '日常点检'},
                    {value: 254, name: '管理检巡'},
                    {value: 275, name: '保养计划'},
                ],
            }
        },

        mounted() {
            //各类工单趋势：
            this.DrawtaskNumberChart();
            //各类工单占比：
            this.drawNumberPercentChart();

        },


        methods: {
            DrawtaskNumberChart(){
                let theTaskNumberChart = this.echarts.init(document.getElementById('taskNumberChart'))
                //绘制图表：
                theTaskNumberChart.setOption({
                    title: {text: '各类工单趋势'},
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross',
                            crossStyle: {
                                color: '#999'
                            }
                        }
                    },
                    toolbox: {
                        feature: {

                            restore: {show: true},
                            saveAsImage: {show: true}
                        }
                    },

                    legend: {
                        top: 30,
                        bottom: 0,
                        data: ['设备维修', '日常点检', '管理检巡',"保养计划"]
                    },
                    grid: {
                        top: "20%",
                        bottom: "10%",
//                        containLabel: true
                    },
                    xAxis: [
                        {
                            type: 'category',
                            data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                            axisPointer: {
                                type: 'shadow'
                            }
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            name: '数目',
//                            min: 0,
//                            max: 250,
//                            interval: 50,
                            axisLabel: {
                                formatter: '{value} 个'
                            }
                        },
//                        {
//                            type: 'value',
//                            name: '百分比',
////                            min: 0,
////                            max: 25,
////                            interval: 5,
//                            axisLabel: {
//                                formatter: '{value} %'
//                            }
//                        }
                    ],
                    series: [

                        {
                            name: '设备维修',
                            type: 'bar',
                            data: this.taskNumber.maintenance
                        },
                        {
                            name: '日常点检',
                            type: 'bar',
//                            yAxisIndex: 1,
                            data: this.taskNumber.dailyCheckup
                        },
                        {
                            name: '管理检巡',
                            type: 'bar',
                            data: this.taskNumber.patrol
                        },
                        {
                            name: '保养计划',
                            type: 'line',
//                            yAxisIndex: 1,
                            data: this.taskNumber.plan
                        }
                    ]
                });
            },
            drawNumberPercentChart() {
                // 基于准备好的dom，初始化echarts实例
                let theNumberPercentChart = this.echarts.init(document.getElementById('numberPercentChart'))
                // 绘制图表
                theNumberPercentChart.setOption({
                    title: {text: '各类工单占比'},
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    toolbox: {
                        feature: {

                            restore: {show: true},
                            saveAsImage: {show: true}
                        }
                    },
                    legend: {
                        orient: 'vertical',
                        right: 10,
                        top: 40,
                        bottom: 20,
                        data: ['设备维修', '日常点检', '管理检巡', '保养计划']
                    },
                    series: [
                        {
                            name: '任务占比',
                            type: 'pie',
                            radius: '65%',
                            center: ['45%', '60%'],
                            data: this.numberPercent,
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                });
            },


        },
    }
</script>







