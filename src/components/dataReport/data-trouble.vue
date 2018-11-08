<template>
    <div class="basic fault-content">
        <!--模块名称-->
        <div class="title">
            <span>数据统计</span>
        </div>
        <div class="titleListManage">
            <ul class="tabUL">
                <li class="active"><a>设备故障</a></li>
                <li>
                    <router-link to='/dataReplacement'>备品备件</router-link>
                </li>
                <li>
                    <router-link to='/dataAppraise'>人员考核</router-link>
                </li>
                <li>
                    <router-link to='/dataPerformancet'>工单执行</router-link>
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
                    <FormItem label="设备型号">
                        <Input placeholder="请选择">
                        <Button slot="append" icon="ios-search"></Button>
                        </Input>
                    </FormItem>
                    <FormItem label="设备名称">
                        <Input placeholder="请选择">
                        <Button slot="append" icon="ios-search"></Button>
                        </Input>
                    </FormItem>
                    <FormItem label="设备地点">
                        <Input placeholder="请选择">
                        <Button slot="append" icon="ios-search"></Button>
                        </Input>
                    </FormItem>

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

                <div class="radio_item chartDis" id="lineChart">
                </div>

                </Col>
                <Col span="11" style="margin-left:1%;">
                <div class="radio_item chartDis" id="pieChart">

                </div>
                </Col>

            </Row>

            <Row>
                <Col span="12">

                <div class="radio_item chartDis" id="barChart">

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
                //设备故障数量趋势：
                lineChartData: {
                   trouble1: [20.0, 24.9, 17.0, 23.2, 25.6, 26.7, 15.6, 22.2, 30.6, 20.0, 16.4, 23.3],
                   trouble2:[10.0, 14.9, 17.0, 13.2, 15.6, 16.7, 13.6, 18.2, 12.6, 17.0, 15.4, 13.3],
                   trouble3: [12.6, 5.9, 8.0, 10.4, 15.7, 13.7, 10.6, 16.2, 17.7, 19.8, 6.0, 9.3],
                    trouble4: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2],
                    troubleOther:[2.6, 5.9, 9.0, 16.4, 18.7, 20.7, 10.6, 12.2, 17.7, 18.8, 6.0, 2.3],
                },
                //故障类型占比：
                numberPercent: [{value: 335, name: '故障1'},
                    {value: 310, name: '故障2'},
                    {value: 234, name: '故障3'},
                    {value: 135, name: '故障4'},
                    {value: 1548, name: '其它故障'}],
                //设备故障次数：
                troubleNumber: [
                    {name: "设备01",number:13},
                    {name: "设备02",number:12},
                    {name: "设备03",number:11},
                    {name: "设备04",number:10},
                    {name: "设备05",number:9},
                    {name: "设备06",number:8},
                    {name:"设备07",number:7},
                ],
                troubleNumber_names:[],
                troubleNumber_numbers:[]

            }
        },

        mounted() {
            //分别统计设备故障的纵坐标及柱形图的数值：
            for(var i=0;i<this.troubleNumber.length;i++){
                this.troubleNumber_names.push(this.troubleNumber[i].name);
                this.troubleNumber_numbers.push(this.troubleNumber[i].number);

            }

            //设备故障数量趋势：
            this.drawLine();
            //故障类型占比：
            this.drawPie();
            //设备故障次数：
            this.drawBar();

        },


        methods: {
            drawLine(){
                let lineChart = this.echarts.init(document.getElementById('lineChart'))
                //绘制图表：
                lineChart.setOption({
                    title: {text: '设备故障数量趋势'},
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
                        data: ['故障1', '故障2', '故障3',"故障4","其它故障"]
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
                            name: '故障1',
                            type: 'bar',
                            data: this.lineChartData.trouble1
                        },
                        {
                            name: '故障2',
                            type: 'bar',
//                            yAxisIndex: 1,
                            data: this.lineChartData.trouble2
                        },
                        {
                            name: '故障3',
                            type: 'bar',
                            data: this.lineChartData.trouble3
                        },
                        {
                            name: '故障4',
                            type: 'line',
//                            yAxisIndex: 1,
                            data: this.lineChartData.trouble4
                        },
                        {
                            name: '其它故障',
                            type: 'bar',
                            data: this.lineChartData.troubleOther
                        }
                    ]
                });
            },
            drawPie() {
                // 基于准备好的dom，初始化echarts实例
                let pieChart = this.echarts.init(document.getElementById('pieChart'))
                // 绘制图表
                pieChart.setOption({
                    title: {text: '故障类型占比'},
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
                        top: 30,
                        bottom: 20,
                        data: ['故障1', '故障2', '故障3', '故障4(%)', "其它故障"]
                    },
                    series: [
                        {
                            name: '故障类型',
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
            drawBar(){
                let barChart = this.echarts.init(document.getElementById('barChart'))
                // 绘制图表
                barChart.setOption({
                    color: ["#61A0A8"],
                    title: {text: '设备故障次数'},
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    legend: {
                        data: ['']
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'value'
                    },
                    yAxis: {
                        type: 'category',
                        data:this.troubleNumber_names
                    },
                    series: [
                        {
                            name: '故障次数',
                            type: 'bar',
                            stack: '总量',
                            label: {
                                normal: {
                                    show: true,
                                    position: 'insideRight'
                                }
                            },
                            data: this.troubleNumber_numbers
                        }
                    ]
                });
            },
        },
    }
</script>




