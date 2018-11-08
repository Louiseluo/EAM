
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
                <li class="active">
                    <a>工单执行</a>
                </li>
                <li>
                    <router-link to='/dataRecord'>设备记录</router-link>
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
                    <FormItem label="执行人">
                        <Input placeholder="请选择">
                        <Button slot="append" icon="ios-search"></Button>
                        </Input>
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
            <Row>
                <Col span="12">
                <div class="radio_item chartDis" id="operateTime">

                </div>

                </Col>
                <Col span="11" style="margin-left:1%;">
                <div class="radio_item chartDis" id="timePercentChart">

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
                //工单执行时间趋势：
                operateTimeData: {
                    ontime: [20.0, 24.9, 17.0, 23.2, 25.6, 26.7, 15.6, 22.2, 30.6, 20.0, 16.4, 23.3],
                    overtime: [3.6, 4.9, 7.0, 15.4, 18.7, 13.7, 10.6, 12.2, 13.7, 15.8, 10.0, 5.3],
                    overTimeSerious: [2.6, 5.9, 9.0, 16.4, 18.7, 20.7, 10.6, 12.2, 17.7, 18.8, 6.0, 2.3],
                },
                timePercent: [{value: 335, name: '正常执行'},
                    {value: 210, name: '超时执行'},
                    {value: 254, name: '严重超时'},

                ],


            }
        },

        mounted() {

            //工单执行时间趋势：
            this.drawOperateTimeChart();
            //工单执行时间占比：
            this.drawTimePercentChart();


        },


        methods: {
            drawOperateTimeChart(){
                let theOverTimeChart = this.echarts.init(document.getElementById('operateTime'))
                //绘制图表：
                theOverTimeChart.setOption({
                    title: {text: '工单执行时间趋势'},
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
                        data: ['正常执行', '延迟执行', '严重超时']
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
                            name: '正常执行',
                            type: 'bar',
                            data: this.operateTimeData.ontime
                        },
                        {
                            name: '延迟执行',
                            type: 'line',
//                            yAxisIndex: 1,
                            data: this.operateTimeData.overtime
                        },
                        {
                            name: '严重超时',
                            type: 'bar',
                            data: this.operateTimeData.overTimeSerious
                        }
                    ]
                });
            },
            drawTimePercentChart() {
                // 基于准备好的dom，初始化echarts实例
                let thetimePercentChart = this.echarts.init(document.getElementById('timePercentChart'))
                // 绘制图表
                thetimePercentChart.setOption({
                    title: {text: '工单执行时间占比'},
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
                        data: ['正常执行', '延迟执行', '严重超时']
                    },
                    series: [
                        {
                            name: '执行时间占比',
                            type: 'pie',
                            radius: '65%',
                            center: ['45%', '60%'],
                            data: this.timePercent,
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




