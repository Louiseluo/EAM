<template>
    <div style="position:relative;" class="basic fault-content">
        <!--模块名称-->
        <div class="title">
            <span>委外维修申请单</span>
        </div>
        <div class="titleLogo"><img style="width: 100%;height: 100%;" :src="logoSrc"></div>
        <div v-if="editFlag" style="overflow: hidden;">
            <h3 class="f_l">委外维修申请单编号：</h3>
            <div class="f_l text-center">
                <img v-if="imgAddr!=''" :src="'/static'+ imgAddr" alt="" height="50" width="300">
                <div>{{docTypeCode}}</div>
            </div>
        </div>
        <Form :model="order_Form" label-position="right" inline :label-width="135" class="equ_addForm">
            <div class="second-title">报修信息</div>
            <Form-item label="报修部门">
                <Input v-model="order_Form.repairDept" style="width: 160px;" disabled></Input>
            </Form-item>
            <Form-item label="设备名称">
                <Input v-model="order_Form.equpName" style="width: 160px;" disabled></Input>
            </Form-item>
            <Form-item label="设备型号">
                <Input v-model="order_Form.equpModel" style="width: 160px;" disabled></Input>
            </Form-item>
            <Form-item label="报修人">
                <Input v-model="order_Form.repairReporter" style="width: 160px;" disabled></Input>
            </Form-item>
            <Form-item label="报修时间">
                <Input v-model="order_Form.repairReportTime" style="width: 160px;" disabled></Input>
            </Form-item>
            <Form-item label="报修部门领导">
                <Input v-model="order_Form.repairDeptLeader" style="width: 160px;" disabled></Input>
            </Form-item>
            <Form-item label="报修类型">
                <div class="clear" style="display: inline-block">
                    <RadioGroup class="f_l" v-model="order_Form.repairType">
                        <Radio v-for="item in newRepairTypeArr" :key="item.code" :label="item.desc" disabled>{{item.desc}}</Radio>
                    </RadioGroup>
                    <Input class="f_r" v-model="order_Form.repairTypeOther" style="width: 160px;" disabled></Input>
                </div>
            </Form-item>
            <Row>
                <Col span="24">
                <Form-item label="维修效果反馈">
                    <div class="clear" style="display: inline-block">
                        <RadioGroup class="f_l" v-model="order_Form.repairResultFeedback">
                            <Radio v-for="item in newFeedBackArr" :key="item.code" :label="item.code" disabled>{{item.desc}}</Radio>
                        </RadioGroup>
                        <Input class="f_r" v-model="order_Form.repairResultFeedbackOther" style="width: 160px;" disabled></Input>
                    </div>
                </Form-item>
                </Col>
            </Row>
            <!--<Row>
                <Col span="9">-->
                <Form-item label="故障描述" class="textarea_design">
                    <Input type="textarea" :rows="1" v-model="order_Form.repairFaultDesc" :max="500" :maxlength="500" :disabled="editFlag"></Input>
                </Form-item>
                <!--</Col>
                <Col span="9">-->
                <Form-item label="维修结果确认" class="textarea_design">
                    <Input type="textarea" :rows="1" v-model="order_Form.repairResultConfirm"  :max="500" :maxlength="500" disabled></Input>
                </Form-item>
                <!--</Col>
                <Col span="5">-->
                <Form-item label="完成时间" class="textarea_design">
                    <Date-picker type="datetime" v-model="order_Form.finishTime" placeholder="选择时间" style="width: 160px" :open="false" disabled></Date-picker>
                </Form-item>
                <!--</Col>
            </Row>-->
        </Form>
        <div class="second-title mar-t-10">所需更换零部件情况</div>
        <table class="table table-bordered table-center table-striped table-blue table-edit table-standWork taDisplay">
            <thead>
            <tr>
                <th width="80">序号</th>
                <th>类别</th>
                <th>备品备件名称</th>
                <th>型号规格</th>
                <th>备件单位</th>
                <th>备件数量</th>
                <th>备注</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item,index) in sparePartsData" :key="item.spId" class="trDisplay">
                <td>{{index + 1}}</td>
                <td>
                    {{item.categoryName}}
                </td>
                <td>
                    {{item.spName}}
                </td>
                <td>
                    {{item.modelName}}
                </td>
                <td>
                    {{item.uomName}}
                </td>
                <td class="wid-10 num_right">
                    {{item.quantity}}
                </td>
                <td>{{item.note}}</td>
            </tr>
            </tbody>
        </table>
        <div class="tableHasNoData" v-show="sparePartsData.length==0"><p>暂无数据</p></div>
        <Form :model="order_Form" label-position="right" inline :label-width="135" class="equ_addForm">
            <Row>
                <Col span="24">
                <Form-item label="损坏原因分析">
                    <div class="clear" style="display: inline-block">
                        <RadioGroup class="f_l" v-model="order_Form.damageAnalysis">
                            <Radio v-for="item in newDemageCauseArr" :label="item.code" :key="item.code" disabled>{{item.desc}}</Radio>
                        </RadioGroup>
                        <Input class="f_r" v-model="order_Form.damageAnalysisOther" style="width: 160px;" disabled></Input>
                    </div>
                </Form-item>
                </Col>
            </Row>
            <Row>
                <Col span="9">
                <Form-item label="未修复原因" class="textarea_design">
                    <Input type="textarea" v-model="order_Form.unRepairReason"  :max="500" :maxlength="500" disabled></Input>
                </Form-item>
                </Col>
                <Col span="5">
                <Form-item label="设备部负责人">
                    <div style="color:#ffffff" onmousemove="this.style.color='#5b5b5b';"
                         onmouseout="this.style.color='#ffffff'">
                                <span class="closeSpan" @click="deleteDept" v-if="!editFlag&&order_Form.equDepartMan">
                                    <Icon type="ios-close"></Icon>
                                </span>
                        <div class="input-search right0" @click="openDeptModel">
                            <Input v-model="order_Form.equDepartMan" :readonly=true :disabled="editFlag"></Input>
                            <Button icon="ios-search"></Button>
                        </div>
                    </div>
                    <!--<Input v-model="order_Form.equDepartMan" style="width: 160px;"></Input>-->
                </Form-item>
                </Col>
            </Row>
        </Form>
        <!--操作按钮-->
        <div align="center" class="btnGroupDesign">
            <Button type="primary" size="large" @click="backPage">取消</Button>
            <Button type="primary" size="large" v-if="!editFlag" @click="applyOut">申请</Button>
        </div>
        <!--设备部负责人-->
        <Modal v-model="deptModel" title="设备部负责人" @on-ok="toSelect_dept">
            <department @deptSelected="dept_hasSelected"></department>
        </Modal>


    </div>
</template>

<script>
    import wholeParts_single from '../treeMulitiple/wholeParts_single.vue';
    import partsVersionSelect from '../treeMulitiple/table_spareParts_version.vue';
    import department from '../treeMulitiple/department.vue'

    export default {
        components: {
            'wholeParts': wholeParts_single,
            'partsVersionSelect': partsVersionSelect,
            'department': department
        },
        data (){
            return {
                logoSrc:"../../static/img/ch_logo.jpg",
                docTypeCode:'',
                imgAddr: '',
                editFlag: false, //是否可编辑
                /*权限按钮*/

                /***  页面初加载字段 ***/
                billId: '',
                orderId: '', //从路由信息获取的工单id
                flag: 0,  //从路由信息获取的点检还是保养
                /***  页面初加载字段 ***/

                /*form 表单*/
                order_Form:{
                    repairDept: '',
                    equpName: '',
                    equpModel: '',
                    repairReporter: '',
                    repairReportTime: '',
                    repairMan: '',
                    repairDeptLeader: '',
                    repairReportLocation: '',
                    repairType: '',
                    repairTypeOther: '',
                    repairResultFeedback: '',
                    repairResultFeedbackOther: '',
                    repairFaultDesc: '',
                    repairResultConfirm: '',
                    finishTime: '',
                    damageAnalysis: '',
                    damageAnalysisOther: '',
                    unRepairReason: '',
                    equDepartMan: '',
                    equDepartManId: '',
                    repairBillId: '', //报修单id
                },
                repairTypeArr: this.$base_info.tEamRepairTypeEnum,
                feedBackArr: this.$base_info.tEamEquipmentRequestForOutsourceRepairFormFeedBackEnum,
                demageCauseArr: this.$base_info.tEamEquipmentRequestForOutsourceRepairFormDemageCauseEnum,
                sparePartsData: [],
                /*设备部负责人*/
                deptModel: false,
                selectedDept: {},
//                flag: false,
            }
        },
        computed: {
            newRepairTypeArr() {
                return this.repairTypeArr.filter(item => item.code>-1)
            },
            newFeedBackArr() {
                return this.feedBackArr.filter(item => item.code>-1)
            },
            newDemageCauseArr() {
                return this.demageCauseArr.filter(item => item.code>-1)
            },
        },
        mounted(){
            this.billId = this.$route.query.id;
            this.listTitle = this.$route.query.title;
            this.listStatus = this.$route.query.listStatus;
            this.orderId = this.$route.query.orderId;
            this.initDetail();
            let editFlag = this.$route.query.editFlag;
            if (editFlag != undefined){
                //详情页
                this.editFlag = true;
                this.initPage();
            } else {
                this.editFlag = false;
            }
        },
        methods: {
            //报修信息渲染
            initDetail(){
                this.$axios.post('/eamDo/repairOrderDetail', {
                    id: this.orderId
                }).then((res) => {
                    let ret = res.data.response;
//                    console.log('报修信息ret ===== '+JSON.stringify(ret))
                    if (ret.code == 1) {
                        this.order_Form.repairDept = ret.data.repairDept; //报修部门
                        this.order_Form.equpName = ret.data.equipmentName; //设备名称
                        this.order_Form.equpModel = ret.data.equipmentModel; //设备型号
                        this.order_Form.repairReporter = ret.data.repairReporter; //报修人
                        this.order_Form.repairReportTime = ret.data.repairReportTime; //报修时间
//                        this.order_Form.repairMan = ret.data.repairDept; //报修负责人
                        this.order_Form.repairType = ret.data.repairType; //报修类型
                        this.order_Form.repairBillId =  ret.data.repairBillId; //报修单id
//                        this.order_Form.repairFaultDesc = ret.data.faultDesc; //故障描述
                        if (!this.editFlag) {
                            this.order_Form.repairFaultDesc = ret.data.faultDesc; //故障描述
                        }
                    } else {
                        this.$Message.error(ret.msg);
                    }
                }).catch((err) => {
                    console.log(err);
                })
            },
            //页面渲染
            initPage() {
                this.$axios.post('/eamDo/outRepairFormId', {
                    outRepairFormId: this.billId
                }).then((res) => {
                    let ret = res.data.response;
//                    console.log('页面渲染ret ===== '+JSON.stringify(ret))
                    if (ret.code == 1) {
                        this.order_Form.repairDeptLeader = ret.data.repairDeptLeader; //报修部门领导
                        this.order_Form.equDepartMan = ret.data.equipment_dept_leader; //设备部门领导
                        this.order_Form.damageAnalysis = ret.data.demage_cause; //损坏原因分析
                        this.order_Form.damageAnalysisOther = ret.data.other_demage_cause; //其他损坏原因分析
                        this.order_Form.unRepairReason = ret.data.unRepairCause; //未修复原因
                        this.order_Form.repairResultFeedback = ret.data.effectivityFeedBack; //维修效果反馈
                        this.order_Form.repairResultFeedbackOther = ret.data.otherEffectivityFeedBack; //其他维修效果反馈
                        this.order_Form.repairResultConfirm = ret.data.repairResult; //维修结果确认
                        this.order_Form.finishTime = ret.data.actual_end_time; //完成时间
                        this.sparePartsData = ret.data.sparePartDetails;
                        this.imgAddr = ret.data.barCode;
                        this.docTypeCode = ret.data.billNo;
                        if (this.editFlag) {
                            this.order_Form.repairFaultDesc = ret.data.faultDesc; //故障描述
                        }
                    } else {
                        this.$Message.error(ret.msg);
                    }
                }).catch((err) => {
                    console.log(err);
                })
            },
            //申请
            applyOut() {
                this.$axios.post('/eam/submit_equipment_outsource_repair', {
                    outRepairFormId: '', //委外维修单id
                    demageCause: this.order_Form.damageAnalysis, //损坏原因
                    otherDemageCause: this.order_Form.damageAnalysisOther, //其他损坏原因，当“demageCause”值为“其他”时，该项有值
                    details: [], //备件信息（由oa传回，暂为空）
                    equDepDutyPerson: this.order_Form.equDepartManId, //设备部门责任人
                    faultCause: this.order_Form.unRepairReason, //未修复原因（oa返回，暂为空）
                    faultDesc: this.order_Form.repairFaultDesc, //故障描述
                    repairFormId: this.order_Form.repairBillId //报修单id
                }).then((res) => {
                    let ret = res.data.response;
                    if (ret.code == 1) {
                        this.$Message.success(ret.data);
                        this.$router.go(-2);
                    } else {
                        this.$Message.error(ret.msg);
                    }
                }).catch((err) => {
                    console.log(err)
                })
            },
            openDeptModel() {
                if (!this.editFlag) {
                    this.deptModel = true;
                } else {
                    return;
                }
            },
            //设备部负责人
            dept_hasSelected(msg) {
                this.selectedDept = msg;
            },
            toSelect_dept() {
                this.order_Form.equDepartMan = this.selectedDept.tBdPersonName;
                this.order_Form.equDepartManId = this.selectedDept.tBdPersonId;
            },
            deleteDept() {
                this.order_Form.equDepartMan = '';
                this.order_Form.equDepartManId = '';
            },
            backPage() {
                this.$router.back();
            },

        },
    }
</script>
<style scoped>
    .titleLogo{
        width: 100px;
        height: 55px;
        margin: 15px 0;
        position: absolute;
        right: 60px;
        top: 0;
    }
    @keyframes ani-demo-spin {
        from { transform: rotate(0deg);}
        50%  { transform: rotate(180deg);}
        to   { transform: rotate(360deg);}
    }

    .pointDis .ivu-btn {
        right: 30px;
        top: 2px;
    }

    .closeSpan {
        position: absolute;
        right: 30px;
        z-index: 999;
    }
</style>
