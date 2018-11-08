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
                <li >
                    <router-link to='/dataTrouble'>设备故障</router-link>
                </li>
                <li class="active">
                    <a>备品备件</a>
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
                    <FormItem label="备件分类">
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

                <div class="radio_item chartDis" id="NumberPie">
                </div>

                </Col>
                <Col span="11" style="margin-left:1%;">
                <div class="radio_item chartDis" id="PercentPie">

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
                //备件类型、备件消耗占比：
                numberPercent: [
                    {name: "2年",value:1},
                    {name: "3年",value:1},
                    {name: "4年",value:1},
                    {name: "5年",value:1},
                    {name: "5年以上",value:3},
                ],
                //备品备件消耗(数量)：
                consume: [
                    {name: "设备01",number:13,number_rest:8,money:10},
                    {name: "设备02",number:12,number_rest:7,money:9},
                    {name: "设备03",number:11,number_rest:6,money:8},
                    {name: "设备04",number:10,number_rest:5,money:7},
                    {name: "设备05",number:9,number_rest:4,money:6},
                    {name: "设备06",number:8,number_rest:3,money:5},
                    {name:"设备07",number:7,number_rest:2,money:4},
                ],
                consume_names:[],
                consume_numbers:[],
                consume_numbers_rest:[],
                consume_numbers_money:[]
            }
        },

        mounted() {
            //分别统计设备故障的纵坐标及柱形图的数值：
            for(var i=0;i<this.consume.length;i++){
                this.consume_names.push(this.consume[i].name);
                this.consume_numbers.push(this.consume[i].number);
                this.consume_numbers_rest.push(this.consume[i].number_rest);
                this.consume_numbers_money.push(this.consume[i].money);

            }


            //备件类型、备件消耗占比：
            this.drawPercentPie();
            //备品备件消耗(数量)：
            this.drawNumberPie();
            //备品备件消耗金额(万元)：
            this.drawBar();

        },


        methods: {

            drawPercentPie() {
                // 基于准备好的dom，初始化echarts实例
                let pieChart = this.echarts.init(document.getElementById('PercentPie'))
                // 绘制图表
                pieChart.setOption({
                    title: {text: '备件类型、备件消耗占比'},
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
                        data: ['2年', '3年', '4年', '5年', "5年以上"]
                    },
                    series: [
                        {
                            name: '剩余年限',
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
            drawNumberPie(){
                let barChart = this.echarts.init(document.getElementById('NumberPie'))
                // 绘制图表
                barChart.setOption({
                    title: {text: '备品备件消耗(数量)'},
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    toolbox: {
                        feature: {
                            restore: {show: true},
                            saveAsImage: {show: true}
                        }
                    },
                    legend: {
                        data: ['设备寿命','剩余年限']
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
                        data:this.consume_names
                    },
                    series: [
                        {
                            name: '设备寿命',
                            type: 'bar',
                            stack: '总量',
                            label: {
                                normal: {
                                    show: true,
                                    position: 'insideRight'
                                }
                            },
                            data: this.consume_numbers
                        },
                        {
                            name: '剩余年限',
                            type: 'bar',
                            stack: '总量',
                            label: {
                                normal: {
                                    show: true,
                                    position: 'insideRight'
                                }
                            },
                            data: this.consume_numbers_rest
                        }
                    ]
                });
            },
            drawBar(){
                let barChart = this.echarts.init(document.getElementById('barChart'))
                // 绘制图表
                barChart.setOption({
                    color: ["#61A0A8"],
                    title: {text: '备品备件消耗金额(万元)'},
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    legend: {
                        data: []
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
                        data:this.consume_names
                    },
                    series: [
                        {
                            name: '消耗金额',
                            type: 'bar',
                            stack: '总量',
                            label: {
                                normal: {
                                    show: true,
                                    position: 'insideRight'
                                }
                            },
                            data: this.consume_numbers_money
                        }
                    ]
                });
            },
        },
    }
</script>


