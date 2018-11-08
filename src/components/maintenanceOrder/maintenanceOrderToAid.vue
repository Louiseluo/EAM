<template>
    <div style="position:relative;" class="basic fault-content">
        <div class="title">
            <span>维修工单执行流程--疑难处理</span>
        </div>
        <div class="titleLogo"><img style="width: 100%;height: 100%;" :src="logoSrc"></div>
        <div style="overflow: hidden;">
            <h3 class="f_l">维修工单号：</h3>
            <div class="f_l text-center">
                <img v-if="imgAddr!=''" :src="'/static'+ imgAddr" alt="" height="50" width="300">
                <div>{{docTypeCode}}</div>
            </div>
        </div>
        <div class="form-content">
            <Form :model="order_Form" label-position="right" inline :label-width="135" class="equ_addForm">
                <div class="second-title">报修信息</div>
                <Form-item label="报修单编码">
                    <Input v-model="order_Form.repairBillNo" :title="order_Form.repairBillNo" style="width: 160px;" disabled></Input>
                </Form-item>
                <Form-item label="报修单状态">
                    <Input v-model="order_Form.repairBillStatus" style="width: 160px;" disabled></Input>
                </Form-item>
                <Form-item label="报修部门">
                    <Input v-model="order_Form.repairDept" style="width: 160px;" disabled></Input>
                </Form-item>
                <Form-item label="报修人">
                    <Input v-model="order_Form.repairReporter" style="width: 160px;" disabled></Input>
                </Form-item>
                <Form-item label="报修设备编码">
                    <Input v-model="order_Form.repairEquipmentCode" :title="order_Form.repairEquipmentCode" style="width: 160px;" disabled></Input>
                </Form-item>
                <Form-item label="报修时间">
                    <Input v-model="order_Form.repairReportTime" style="width: 160px;" disabled></Input>
                </Form-item>
                <Form-item label="报修地点">
                    <Input v-model="order_Form.repairReportLocation" style="width: 160px;" disabled></Input>
                </Form-item>

                <Form-item label="报修类型">
                    <Input v-model="order_Form.repairType" style="width: 160px;" disabled></Input>
                </Form-item>
                <Row>
                    <Col span="24">
                    <Form-item label="故障描述" class="textarea_design">
                        <Input type="textarea" v-model="order_Form.repairFaultDesc"  :max="500" :maxlength="500" disabled></Input>
                    </Form-item>
                    </Col>
                </Row>

            </Form>
        </div>
        <div class="form-content">
            <Form :model="order_Form" label-position="right" inline :label-width="135" >
                <div class="second-title">维修信息</div>
                <Form-item label="维修工单编码">
                    <Input v-model="order_Form.billNo" style="width: 160px;" disabled :title="order_Form.billNo"></Input>
                </Form-item>
                <Form-item label="维修工单状态">
                    <Input v-model="order_Form.billStatus" placeholder="" style="width: 160px;" disabled></Input>
                </Form-item>
                <Form-item label="故障原因">
                    <Input v-model="order_Form.faultCause"  style="width: 160px;" disabled></Input>
                </Form-item>
            </Form>
            <Table class="mar-b-15" stripe border :columns="fixCol" :data="fixData"></Table>
        </div>

        <div class="second-title">派工信息</div>
        <div class="form-content mar-t-10">
            <div class="second-title">主维修人员</div>
            <Table class="mar-b-15" stripe border :columns="mainPersonCol" :data="mainPersonData"></Table>

            <div class="second-title mar-t-15">协同维修人员</div>
            <Table class="mar-b-15" stripe border :columns="collPersonCol" :data="collPersonData"></Table>
            <div class="page pageRight">
                <Page :total="perseonPages" :current="curPersonPage" size="small" show-elevator :page-size="5" @on-change="changePersonPage"></Page>
            </div>
        </div>
        <!--保养-->
        <div class="second-title mar-t-15">工单流程执行记录</div>
        <div style="overflow: hidden;">
            <Table class="mar-b-15"  stripe border :columns="scrapColumns" :data="scrapData"></Table>
            <div class="page">
                <Page :total="ttPages" :current="curPage" size="small" show-elevator :page-size="5" @on-change="changePage3"></Page>
            </div>
        </div>
        <!--操作按钮-->
        <div align="center" class="btnGroupDesign">
            <Button type="primary" size="large" @click="$router.go(-1)">返回</Button>
            <Button v-if="if_dispatchAgain" type="primary" size="large" @click="dispatchStart(13)">重新派工</Button>
            <router-link v-if="if_apply" :to="{ path: '/applyForOutScource', query: {orderId: this.orderId}}">
                <Button type="primary" size="large">申请委外维修</Button>
            </router-link>
        </div>
    </div>
</template>

<script>

    export default {
        data (){
            return {

                /*权限按钮*/
                if_apply:this.$rt(this.authJson.EAM.设备保养.维修工单查看页.申请委外维修),
                if_dispatchAgain:this.$rt(this.authJson.EAM.设备保养.维修工单查看页.重新派工),
                /***  页面初加载字段 ***/
                orderId: '', //从路由信息获取的工单id
                listTitle:'',
                listStatus:-1,
                editEnable:false,
                workItemId:'',
                editDisabled:false,
                /***  页面初加载字段 ***/
                logoSrc:"../../static/img/ch_logo.jpg",
                docTypeCode: '',
                imgAddr: '',
                /*form 表单*/
                order_Form:{
                    /*报修信息*/
                    "repairBillNo":"",
                    "repairBillStatus":"",
                    "repairDept":"",
                    "repairReporter":"",
                    "repairEquipmentCode":"",
                    "repairReportTime":"",
                    "repairReportLocation":"",
                    "repairFaultDesc":"",
                    "repairType":"",
                    /*维修信息*/
                    "billNo": "",
                    "fixFaultDesc": "",
                    "billStatus": "",
                    "sopVersion": 1,
                    "standardSolution": "",
                    "doActualStartTime": "",
                    "notifyTime": "",
                    "dispatchTime": "",
                    "submitPlanCode": "",
                    "createBy": "",
                    "createAt": "",
                    "repairBillId":"",
                    /*故障信息*/
                    faultOrNot:'0',
                    "faultCause": "",
                    "faultDesc": "",
                },
                fixCol: [
                    {
                        title: '维修开始时间',
                        key: 'actualStartTime',
                        align: 'center'
                    },
                    {
                        title: '维修结束时间',
                        key: 'actualEndTime',
                        align: 'center'
                    },
                    {
                        title: '耗时（分钟）',
                        key: 'totalTime',
                        align: 'center'
                    },
                    {
                        title: '维修结果',
                        key: 'repairResult',
                        align: 'center'
                    },
                    {
                        title: '维修反馈',
                        key: 'repairFeedBack',
                        align: 'center',
                    }
                ],
                fixData: [],
                maintainData:[],

                /*报修设备信息*/
                mainPersonCol: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 80,
                        align: 'center'
                    },
                    {
                        title: '姓名',
                        key: 'personName',
                        align: 'center',
                    },
                    {
                        title: '编码',
                        key: 'personCode',
                        align: 'center',
                    },
                    {
                        title: '卡号',
                        key: 'personCardNo',
                        align: 'center'
                    },
                    {
                        title: '岗位',
                        key: 'positionName',
                        align: 'center'
                    },
                    {
                        title: '班组',
                        key: 'teamName',
                        align: 'center'
                    },
                    {
                        title: '班次',
                        key: 'shiftName',
                        align: 'center'
                    },
                    {
                        title: '绩效占比（%）',
                        key: 'kpiRatio',
                        align: 'center'
                    }
                ],
                mainPersonData: [],
                collPersonCol: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 80,
                        align: 'center'
                    },
                    {
                        title: '姓名',
                        key: 'personName',
                        align: 'center',
                    },
                    {
                        title: '编码',
                        key: 'personCode',
                        align: 'center',
                    },
                    {
                        title: '卡号',
                        key: 'personCardNo',
                        align: 'center'
                    },
                    {
                        title: '岗位',
                        key: 'positionName',
                        align: 'center'
                    },
                    {
                        title: '班组',
                        key: 'teamName',
                        align: 'center'
                    },
                    {
                        title: '班次',
                        key: 'shiftName',
                        align: 'center'
                    },
                    {
                        title: '绩效占比（%）',
                        key: 'kpiRatio',
                        align: 'center'
                    }
                ],
                personId: '',
                collPersonData: [],
                curPersonPage: 1,
                perseonPages: 1,
                /*报修设备信息*/
                // 保养 -- 执行记录
                scrapColumns: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 80,
                        align: 'center'
                    },
                    {
                        title: '执行操作',
                        key: 'opearation',
                        align: 'center',
                    },
                    {
                        title: '操作人',
                        key: 'operator',
                        align: 'center',
                    },
                    {
                        title: '角色',
                        key: 'role',
                        align: 'center',
                    },
                    {
                        title: '执行时间',
                        key: 'time',
                        align: 'center',
                    },
                    {
                        title: '结果状态',
                        key: 'status',
                        align: 'center',
                    },
                    {
                        title: '意见反馈',
                        key: 'comment',
                        align: 'center'
                    },
                ],
                scrapData:[],
                ttPages: 1, //执行记录列表数
                curPage: 1,
                /*接单按钮点击状态*/
                receiptDis:false,
            }
        },
        mounted(){
            this.orderId = this.$route.query.orderId;
            this.listTitle = this.$route.query.title;
            this.listStatus = this.$route.query.listStatus;
            this.workItemId = this.$route.query.workItemId;
            this.auditRecords();
            this.initDetail();
            this.getMainPersonData();
            this.getCollPersonData();
        },

        methods: {
            //报修信息渲染
            initDetail(){
//                console.log('initDetail')
                this.$axios.post('/eamDo/repairOrderDetail', {
                    id: this.orderId
                }).then((res) => {
                    let ret = res.data.response;
//                    console.log('ret ===== '+JSON.stringify(ret))
                    if (ret.code == 1) {
                        this.order_Form = ret.data; //报修信息
                        this.docTypeCode = this.order_Form.billNo;
                        this.imgAddr = ret.data.barCode;
                        this.order_Form.billStatus = this.$base_info.getDescByCode(ret.data.billStatus, this.$base_info.tEamApproveDispatchOrderStatusEnum);
                        let obj = {};
                        obj.actualStartTime = ret.data.actualStartTime;
                        obj.actualEndTime = ret.data.actualEndTime;
                        obj.totalTime = ret.data.totalTime;
                        obj.repairResult = ret.data.repairResult;
                        obj.repairFeedBack = ret.data.repairFeedBack;
                        this.fixData.push(obj);
                    } else {
                        this.$Message.error(ret.msg);
                    }
                }).catch((err) => {
                    console.log(err);
                })
            },
            //主维修人员
            getMainPersonData() {
                this.$axios.post('/eamDo/assignmentOperatorList', {
                    dispatchOrderId: this.orderId
                }).then((res) => {
                    let ret = res.data.response;
//                    console.log('主维修人员res ==== '+JSON.stringify(res))
                    if(ret.code == 1) {
                        this.mainPersonData = [ret.data];
                        this.personId = ret.data.personId
                    } else {
                        this.$Message.error(ret.msg);
                    }
                }).catch((err) => {
                    console.log(err);
                })
            },
            //协同维修人员
            getCollPersonData() {
                this.$axios.post('/eamDo/assignmentList', {
                    page: this.curPersonPage,
                    pageSize: 5,
                    dispatchOrderId: this.orderId
                }).then((res) => {
                    let ret = res.data.response;
//                    console.log('协同维修人员res ==== '+JSON.stringify(res));
                    if(ret.code == 1) {
                        this.collPersonData = ret.data.rows;
                        this.perseonPages = ret.data.total;
                    } else {
                        this.$Message.error(ret.msg);
                    }
                }).catch((err) => {
                    console.log(err);
                })
            },
            changePersonPage(cur) {
                this.curPersonPage = cur;
                this.getCollPersonData();
            },
            /*******  dispatchStart 派工按钮 *********/
            dispatchStart(dispatchOperatorCode){
                if(this.mainPersonData.length != 0){
                    if(this.mainPersonData[0].kpiRatio != ""){
                        if(this.mainPersonData[0].time != ""){
                            let dispatchAry = {
                                "kpi":this.mainPersonData[0].kpiRatio,
                                "time":0,
                                "note": "",
                                "operatorCode": dispatchOperatorCode,
                                "orderId": this.orderId,
                                "userId": this.personId,
                                "wfWorkItemId": this.workItemId
                            }
    //                        console.log("dispatchAry +" + JSON.stringify(dispatchAry))
                            this.$axios.post('/eamDo/orderAssignment',dispatchAry ).then((res) => {
                                let ret = res.data.response;
                                if (ret.code == 1) {
                                    this.$Message.success("操作成功！");
                                    this.$router.push({path: '/maintenanceOrder',query: {type:this.listStatus,orderFlag:2}});
                                } else {
                                    this.$Message.error("操作失败！")
                                }
                            }).catch((err) => {
                                console.log(err);
                            })
                        }else {
                            this.$Message.warning("请输入计划时间！")
                        }
                    }else {
                        this.$Message.warning("请输入绩效！")
                    }
                }else {
                    this.$Message.warning("请添加派工人员！")
                }
            },
            //审核记录数据
            auditRecords() {
                this.$axios.post('/eamDo/getMaintainceOrderRecord', {
                    orderId: this.orderId,//id
                    offset: this.curPage,//页码
                    pageSize: 5,//条目数
                }).then((res) => {
//                    console.log('审核记录数据')
//                    console.log(JSON.stringify(res))
                    let ret = res.data.response;
                    if (ret.code == 1) {
                        this.scrapData = ret.data.rows;
                        this.ttPages = ret.data.total;
                        /*this.$base_info.tEamApproveDispatchOrderStatusEnum*/
                        for (let i in this.scrapData) {
                            this.scrapData[i].status = this.$base_info.getDescByCode(this.scrapData[i].status, this.$base_info.tEamApproveDispatchOrderStatusEnum)
                        }
                    } else {
                        this.$Message.error(ret.msg);
                    }
                }).catch((err) => {
                    console.log(err)
                })
            },
            changePage3(cur) {
                this.curPage = cur;
                this.auditRecords();
            }
        },
    }
</script>
<style>
    .titleLogo{
        width: 100px;
        height: 55px;
        margin: 15px 0;
        position: absolute;
        right: 60px;
        top: 0;
    }
    .demo-spin-icon-load{
        animation: ani-demo-spin 1s linear infinite;
    }
    @keyframes ani-demo-spin {
        from { transform: rotate(0deg);}
        50%  { transform: rotate(180deg);}
        to   { transform: rotate(360deg);}
    }
    .demo-spin-col{
        height: 100px;
        position: relative;
        border: 1px solid #eee;
    }
    .pageRight {
        float: none;
        text-align: right;
        margin-bottom: 0;
    }
</style>
