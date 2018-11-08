<template>
    <div class="basic fault-content">
        <!--模块名称-->
        <div class="title">
            <span>计划管理-查看（{{this.planAddForm.controlTypeName}}）</span>
        </div>
        <!--表单-->
        <div class="form-content">
            <Form ref="planAddForm" :model="planAddForm" label-position="right" inline :label-width="120">
                <Form-item label="计划编码" prop="code">
                    <Input v-model="planAddForm.code" style="width: 160px;" placeholder="" disabled></Input>
                </Form-item>
                <Form-item label="计划名称" prop="name">
                    <Input v-model="planAddForm.name" style="width: 160px;" placeholder="" disabled></Input>
                </Form-item>
                <Form-item label="计划类型" prop="typeName">
                    <Input v-model="planAddForm.typeName" style="width: 160px;" placeholder="" disabled></Input>
                </Form-item>
                <Form-item label="计划等级" prop="clazzName">
                    <Input v-model="planAddForm.clazzName" style="width: 160px;" placeholder="" disabled></Input>
                </Form-item>
                <Form-item label="提醒提前期（天）" >
                    <Input style="width: 160px;" placeholder="" v-model="planAddForm.notifyLeadTime" disabled></Input>
                </Form-item>
                <Form-item label="单据下发提前期（天）">
                    <Input style="width: 160px;" placeholder="" v-model="planAddForm.dispatchLeadTime" disabled></Input>
                </Form-item>
                <Form-item label="计划状态" prop="statusName">
                    <Input v-model="planAddForm.statusName" style="width: 160px;" placeholder="" disabled></Input>
                </Form-item>
                <Form-item label="耗时累计（分钟）" prop="estimatedTime">
                    <Input v-model="planAddForm.estimatedTime" style="width: 160px;" placeholder="" disabled></Input>
                </Form-item>
                <Form-item label="制单人" prop="createBy">
                    <Input v-model="planAddForm.createBy" style="width: 160px;" placeholder="" disabled></Input>
                </Form-item>
                <Form-item label="制单日期" prop="createAt">
                    <Date-picker v-model="planAddForm.createAt" type="datetime" placeholder="选择日期和时间" style="width: 160px" disabled readonly></Date-picker>
                </Form-item>
                <Form-item label="最后修改人" prop="updateBy">
                    <Input v-model="planAddForm.updateBy" style="width: 160px;" placeholder="" disabled></Input>
                </Form-item>
                <Form-item label="最后修改日期" prop="updateAt">
                    <Date-picker v-model="planAddForm.updateAt" type="datetime" placeholder="选择日期和时间" style="width: 160px" disabled readonly></Date-picker>
                </Form-item>
                <Form-item label="计划年份" prop="planYear" v-if="this.planAddForm.controlTypeCode === 0">
                    <Date-picker v-model="planAddForm.planYear" :open="false" type="year" placeholder="选择日期" style="width: 160px" disabled></Date-picker>
                </Form-item>
                <Form-item label="计划月份" prop="planYear" v-if="this.planAddForm.controlTypeCode === 1">
                    <Date-picker v-model="planAddForm.planYear" :open="false" type="month" placeholder="选择日期" style="width: 160px" disabled></Date-picker>
                </Form-item>
                <Form-item label="计划日期" prop="planYear" v-if="this.planAddForm.controlTypeCode === 3">
                    <Date-picker v-model="planAddForm.planYear" :open="false" type="date" placeholder="选择日期" style="width: 160px" disabled></Date-picker>
                </Form-item>
                <Form-item label="年度金额（万元）" prop="estimatedMoney">
                    <InputNumber v-model="planAddForm.estimatedMoney" :min="1" style="width: 160px;" disabled></InputNumber>
                </Form-item>
            </Form>
        </div>
        <div class="second-title">计划任务</div>
        <div class="table-reset mar-t-10 mar-b-25">
            <table class="table table-bordered table-center table-striped table-blue .table-standWork table-edit">
                <thead>
                <tr>
                    <th>序号</th>
                    <th>设备</th>
                    <th style="text-align:center">标准方案选择</th>
                    <th>执行岗位</th>
                    <th>版本</th>
                    <th>是否停机</th>
                    <th>预计耗时（分钟）</th>
                    <th>备件金额（元）</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(plan,index) in planDatas">
                    <td>{{index + 1}}</td>
                    <td>
                        {{plan.tBdFactoryLocationName}}
                    </td>
                    <td>
                        {{plan.TEamStandardSolutionName}}
                        <!--<div class="input-search " @click="plan_choose_show(index)">-->
                        <!--<Input class="center" readonly v-model="equ.plan_name"></Input>-->
                        <!--<Button icon="ios-search"></Button>-->
                        <!--</div>-->
                    </td>
                    <td>{{plan.exeRole}}</td>
                    <td>
                        {{plan.version.version}}
                    </td>
                    <td> {{plan.version.needShutdown==0?'是':'否'}}</td>
                    <td> {{plan.version.requiredTime}}</td>
                    <td class="wid-10">
                        {{plan.sparePartCost}}
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
        <div style="height: 50px">
            <div class="f_r mar-r-20 font-18 col-blue" style="font-size:16px;">总金额(元)：<span class="col-orange">{{price_sum}}</span>
                <p style="font-size:14px;margin-right:0px;">(保留小数点后两位小数)</p>
            </div>
        </div>

        <div class="second-title">计划时间</div>
        <YDetail v-if="planAddForm.controlTypeCode === 0" :state="planAddForm.statusCode"></YDetail>
        <MDetail v-else-if="planAddForm.controlTypeCode === 1" :state="planAddForm.statusCode"></MDetail>
        <DDetail v-else-if="planAddForm.controlTypeCode === 2"></DDetail>
        <TDetail v-else-if="planAddForm.controlTypeCode === 3" :state="planAddForm.statusCode"></TDetail>
    </div>
</template>

<script>
    import MDetail from "./monthDetail.vue";
    import DDetail from "./dayDetail.vue";
    import YDetail from "./yearDetail.vue";
    import TDetail from "./temporaryDetail.vue";

    export default {
        components: {
            MDetail: MDetail,
            DDetail: DDetail,
            YDetail: YDetail,
            TDetail: TDetail,
        },
        data (){
            //验证名称
            return {
                //查看页面渲染
                thePlanTaskId: '',
                //design by kp 变量定义----start
                planId: "",//列表页传过来的id
                planDatas: "",//计划任务详情
                price_sum: 0,
                //design by kp 变量定义----end
                pageSize: 5,
                planAddForm: {
                    code: "",
                    name: '',
                    typeName: '',
                    clazzName: '',
                    statusName: '',
                    estimatedTime: '',
                    createBy: "",
                    createAt: "",
                    updateBy: '',
                    updateAt: '',
                    planYear: '',
                    estimatedMoney: 145,

//                    scheduleTypeArr: this.$base_info.plancheduleType,
                    scheduleType: "",
                    periodUnitType: this.$base_info.planTriggerInterval2,
                    periodUnit: 1,
                    firstStartTime: new Date(),
                    controlTypeName: '',
                    controlTypeCode: '',
                    dispatchLeadTime: 0,
                    notifyLeadTime: 0,
                },


               /* allColumns: [
                    {
                        title: '序号',
                        type: 'index',
                        align: 'center',
                        width: 80,
                    },
                    {
                        title: '执行日期',
                        key: 'execDate',
                        align: 'center',
                    },
                    {
                        title: '执行时间',
                        key: 'duration',
                        align: 'center',
                    },
                    {
                        title: '执行时间段',
                        key: 'execTime',
                        align: 'center',
                    },
                ],
                allData: [
                    {
                        execDate: '星期一',
                        execTime: '',
                        duration: '03:00',
                    },
                    {
                        execDate: '星期二',
                        execTime: '',
                        duration: '03:00',
                    },
                    {
                        execDate: '星期三',
                        execTime: '',
                        duration: '03:00',
                    },
                ],*/

            }
        },
        mounted(){
            //designed by kp ----start
            this.planId = this.$route.query.planTaskId;
//            this.planId = "JNIXUHU57KYBKVR84Q40";//先将id写死
            this.getPlanDetail();
            //designed by kp ---end
            var id = this.$route.query.planTaskId;
            this.initData(id);
            this.thePlanTaskId = id;


        },
        methods: {
            initData(planId){
                this.$axios.post('/plan/searchPlanById', {
                    id: planId
                }).then((res) => {
                    let ret = res.data.response;
                    console.log('fff + '+JSON.stringify(ret));
                    if (ret.code != 1) {
                        this.$Message.error("错误 +" + response.data.response.msg);
                    } else {
                        this.planAddForm.code = ret.data.code;// 计划编码
                        this.planAddForm.name = ret.data.name;//计划名称
                        this.planAddForm.typeName = ret.data.typeName;//计划类型名称
                        this.planAddForm.clazzName = ret.data.clazzName;// 计划等级名称
                        this.planAddForm.statusName = ret.data.statusName;//计划状态名称
                        this.planAddForm.estimatedTime = ret.data.estimatedTime;//累计用时(分钟)
                        this.planAddForm.createBy = ret.data.createBy;//创建者名称
                        this.planAddForm.createAt = ret.data.createAt;//创建时间
                        this.planAddForm.updateBy = ret.data.updateBy;// 更新者名称
                        this.planAddForm.updateAt = ret.data.updateAt;// 更新时间
                        this.planAddForm.planYear = ret.data.planTime;// 计划年份
                        this.planAddForm.estimatedMoney = ret.data.estimatedMoney;// 累计金钱(万元)
                        this.planAddForm.typeCode = ret.data.typeCode;// 计划类型编码
                        this.planAddForm.clazzCode = ret.data.clazzCode;// 计划等级编码
                        this.planAddForm.statusCode = ret.data.statusCode;// 计划状态编码
                        this.planAddForm.controlTypeCode = ret.data.controlTypeCode;// 计划状态编码
                        this.planAddForm.controlTypeName = ret.data.controlTypeName;// 计划状态编码
                        this.planAddForm.notifyLeadTime = ret.data.notifyLeadTime; //提醒提前期
                        this.planAddForm.dispatchLeadTime = ret.data.dispatchLeadTime; //单据下发提前期
                    }
                }).catch((err) => {
                    console.log(err);
                })

            },
            goViewPlan(id) {//计划详情
                this.$router.push({path: '/standardworkview', query: {"planTaskId": id}});
            },

            /************************************   designed by kp  计划任务---start ******************************************/
            getPlanDetail(){ //查看计划详情
                let vt = this;
                this.$axios.post('/plan/getEamPlanTaskByEamPlanId', {
                    eamPlanId: this.planId,
                }).then((res) => {
                    let result = res.data.response;
                    if (result.code === 1) {
                        vt.planDatas = result.data;
                        vt.price_sum = 0;
                        for (var i = 0; i < vt.planDatas.length; i++) {
                            vt.planDatas[i].versions = vt.planDatas[i].TEamStandardSolutionVersionVo;
                            vt.planDatas[i].version = vt.planDatas[i].TEamStandardSolutionVersionVo[vt.planDatas[i].TEamStandardSolutionVersionVo.length - 1];
                            if (vt.planDatas[i].sparePartCost) {
                                vt.price_sum = Number(vt.price_sum) * 1000000000000 + Number(vt.planDatas[i].sparePartCost) * 1000000000000;
                                vt.price_sum = (vt.price_sum / 1000000000000).toFixed(2);
                            }
                            ;
                        }
                        ;
                    } else {
                        vt.$Message.error("错误 +" + result.msg);

                    }
                }).catch((err) => {
                });
            },
            /************************************   designed by kp  计划任务---end ******************************************/

        },
    }
</script>

<style>
    .demo-spin-icon-load {
        animation: ani-demo-spin 1s linear infinite;
    }

    @keyframes ani-demo-spin {
        from {
            transform: rotate(0deg);
        }
        50% {
            transform: rotate(180deg);
        }
        to {
            transform: rotate(360deg);
        }
    }

    .demo-spin-col {
        height: 100px;
        position: relative;
        border: 1px solid #eee;
    }
</style>
