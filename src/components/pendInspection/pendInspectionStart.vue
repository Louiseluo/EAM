<template>
    <div class="basic fault-content">
        <!--模块名称-->
        <div class="title">
            <span>点检-执行</span>
        </div>
        <div>
            <Row>
                <Col :xs="24" :md="10" class-name="line-60">
                <span>已完成点检项目
                    <label class="font-18"> {{itemCheck}} </label>/
                    <label class="font-18"> {{itemTotal}} </label>条
                </span>
                <span class="mar-l-20">合格
                    <label class="col-orange font-18">{{itemPass}} </label>项，不合格
                    <label class="col-orange font-18">{{itemNoPass}} </label>项
                </span>
                </Col>
                <Col :xs="24" :md="14" style="text-align: right">
                <Form class="display-in-b" ref="pendForm" :model="pendForm" label-position="right" inline :label-width="100">
                    <Form-item label="点检结果：" prop="checkResult" style="vertical-align: inherit">
                        <Select v-model="pendForm.checkResult" clearable style="width: 120px;">
                            <Option value="pass">合格</Option>
                            <Option value="over">不合格</Option>
                        </Select>
                    </Form-item>
                </Form>
                <Button class="mar-r-10" type="primary" @click="faultReport">异常上报</Button>
                <Button class="mar-r-10" type="primary">重新点检</Button>
                <Button class="mar-r-10" type="primary">提交</Button>
                </Col>
            </Row>
        </div>
        <!--表格-->
        <div class="table-content">
           <!-- <Row>
                <Col span="18">
                    <table class="table table-bordered table-center table-striped table-blue">
                        <thead>
                            <tr>
                                <th>选择</th>
                                <th>序号</th>
                                <th>点检项目</th>
                                <th>点检要求</th>
                                <th>标准工时（分钟）</th>
                                <th>点检结果</th>
                                <th>参照图片</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(si, index) in spotInspection" @click="showImg(index)">
                                <td>
                                    <input type="radio" name="materialId" :value="index"/>
                                </td>
                                <td>{{index + 1}}</td>
                                <td>{{si.standard}}</td>
                                <td>{{si.checkRequest}}</td>
                                <td>{{si.StandardTime}}</td>
                                <td>
                                    <Select v-model="si.checkResult" clearable style="width: 120px;">
                                        <Option value="pass">合格</Option>
                                        <Option value="over">不合格</Option>
                                    </Select>
                                </td>
                                <td>
                                    <Tooltip placement="left">
                                        <Button>图片显示</Button>
                                        <div slot="content">
                                            <img class="bd-gary"  :src="imgUrl" style="width: 100%">
                                        </div>
                                    </Tooltip>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </Col>
                <Col span="6">
                    <div class="txt-center line-35 btn-blue">参照图片</div>
                    <img class="bd-gary"  :src="imgUrl" style="width: 100%">
                </Col>
            </Row>-->
            <table class="table table-bordered table-center table-striped table-blue">
                <thead>
                <tr>
                    <th>选择</th>
                    <th>序号</th>
                    <th>点检项目</th>
                    <th>点检要求</th>
                    <th>标准工时（分钟）</th>
                    <th>点检结果</th>
                    <th>参照图片</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(si, index) in spotInspection" ><!--@click="showImg(index)"-->
                    <td>
                        <input type="radio" name="materialId" :value="index"/>
                    </td>
                    <td>{{index + 1}}</td>
                    <td>{{si.standard}}</td>
                    <td>{{si.checkRequest}}</td>
                    <td>{{si.StandardTime}}</td>
                    <td>
                        <Select v-model="si.checkResult" clearable style="width: 120px;">
                            <Option value="pass">合格</Option>
                            <Option value="over">不合格</Option>
                        </Select>
                    </td>
                    <td style="position: relative">
                        <Tooltip placement="left-start" class="imgView">
                            <Button>图片显示</Button>
                            <div slot="content" >
                                <img class="bd-gary"  :src="si.checkImg">
                            </div>
                        </Tooltip>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
        <div class="page">
            <Page :total="data2Total" :current="orderCurrentPage" size="small" show-elevator :page-size="5"></Page>
        </div>
    </div>
</template>
<script>
    export default {
        data (){
            //验证名称
            const validateAge = (rule, value, callback) => {
            };
            return {
                /*项目总数*/
                itemTotal:5,
                itemCheck:5,
                itemPass:5,
                itemNoPass:5,
                /*form*/
                pendForm:{
                    checkResult:'pass',
                },

                /*点检执行表格*/
                spotInspection:[
                    {
                        standard:'点检项目1',
                        checkRequest:'点检要求1 ',
                        StandardTime:'1',
                        checkResult:'pass',
                        checkImg:'../../../../static/img/dateindex_bg.png',
                    },
                    {
                        standard:'点检项目2',
                        checkRequest:'点检要求2 ',
                        StandardTime:'2',
                        checkResult:'over',
                        checkImg:'../../../../static/img/login_bg.png',
                    },
                    {
                        standard:'点检项目3',
                        checkRequest:'点检要求3 ',
                        StandardTime:'3',
                        checkResult:'pass',
                        checkImg:'../../../../static/img/welcome.png',
                    },
                ],
                imgUrl:'../../../../static/img/dateindex_bg.png',


                orderCurrentPage: 1,
                searchParams: {
                    kinds: '任务,作业',
                    startTime: '',
                    endTime: '',
                    planStatus: '',
                    planType: '',
                    equipmentName: '',
                    workOrderBillNo: '',
                    billNo: '',
                    createByName: '',
                    unRepairedFlag: 'Yes',
                },
                columns_work: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '序号',
                        type: 'index',
                        width: 80,
                        align: 'center'
                    },
                    {
                        title: '点检项目',
                        key: 'device_name',
                        align: 'center',
                    },
                    {
                        title: '点检要求',
                        key: 'device_name',
                        align: 'center',
                    },
                ],
                data_work: [],
                data2Total: 0,
                tabName: '0',
            }
        },

        mounted() {
        },
        methods: {

            showImg:function (index) {
                for(let q in this.spotInspection){
                    if(index == q){
                        this.imgUrl = this.spotInspection[q].checkImg;
                    }
                }
            },
            faultReport:function () {
                let faultReportId = this.$jq("input[name='materialId']:checked").val();
                console.log("faultReportId + " + faultReportId)
                this.$router.push({path: '/faultJockeyAdd'});/*, query: {"workOrderId": faultReportId}*/
            },
        },
    }
</script>
<style>
    .imgView .ivu-tooltip-inner{
        max-width: 400px;
    }
    .imgView img{
        width: 100%;
    }
</style>
