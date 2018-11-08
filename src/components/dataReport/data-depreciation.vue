
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
                <li>
                    <router-link to='/dataRecord'>设备记录</router-link>
                </li>
                <li class="active">
                    <a>设备折旧</a>
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
                    <FormItem label="设备地点">
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

            <Row class="mar-bot-1percent">
                <Col span="12">

                <div class="radio_item chartDis" id="barChart">
                </div>

                </Col>
                <Col span="11" style="margin-left:1%;">
                <div class="radio_item chartDis" id="pieChart">

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
                //设备剩余年限占比：
                numberPercent: [
                    {name: "2年",value:1},
                    {name: "3年",value:1},
                    {name: "4年",value:1},
                    {name: "5年",value:1},
                    {name: "5年以上",value:3},
                    ],
                //设备寿命及剩余年限：
                yearsDetail: [
                    {name: "设备01",number:13,number_rest:8},
                    {name: "设备02",number:12,number_rest:7},
                    {name: "设备03",number:11,number_rest:6},
                    {name: "设备04",number:10,number_rest:5},
                    {name: "设备05",number:9,number_rest:4},
                    {name: "设备06",number:8,number_rest:3},
                    {name:"设备07",number:7,number_rest:2},
                ],
                yearsDetail_names:[],
                yearsDetail_numbers:[],
                yearsDetail_numbers_rest:[],
            }
        },

        mounted() {
            //分别统计设备故障的纵坐标及柱形图的数值：
            for(var i=0;i<this.yearsDetail.length;i++){
                this.yearsDetail_names.push(this.yearsDetail[i].name);
                this.yearsDetail_numbers.push(this.yearsDetail[i].number);
                this.yearsDetail_numbers_rest.push(this.yearsDetail[i].number_rest);

            }


            //设备剩余年限占比：
            this.drawPie();
            //设备寿命及剩余年限：
            this.drawBar();

        },


        methods: {

            drawPie() {
                // 基于准备好的dom，初始化echarts实例
                let pieChart = this.echarts.init(document.getElementById('pieChart'))
                // 绘制图表
                pieChart.setOption({
                    title: {text: '设备剩余年限占比'},
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
            drawBar(){
                let barChart = this.echarts.init(document.getElementById('barChart'))
                // 绘制图表
                barChart.setOption({
                    title: {text: '设备寿命及剩余年限'},
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
                        data:this.yearsDetail_names
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
                            data: this.yearsDetail_numbers
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
                            data: this.yearsDetail_numbers_rest
                        }
                    ]
                });
            },
        },
    }
</script>





