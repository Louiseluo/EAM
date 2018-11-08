<template>
    <div style="position:relative;" class="basic bzzy-search">
        <div class="title">
            <span v-if="!addAble">设备报废详情--{{pageTitle}}</span>
            <span v-if="addAble">设备报废新建</span>
        </div>
        <!--<div class="progressContent" v-if="pageStatus!='已制单'&&!addAble">-->
        <div class="progressContent">
            <div class="second-title">审核进度</div>
            <Steps :current="currentStep" class="mar-b-20 pad-lr-15">
                <Step title="报废申请" content=""></Step>
                <Step title="OA审核中" content=""></Step>
                <Step :title="stepText" content=""></Step>
                <Step v-if="statusCode!=4" title="设备销账" content=""></Step>
            </Steps>
        </div>
        <div class="titleLogo"><img style="width: 100%;height: 100%;" :src="logoSrc"></div>

        <div v-if="!addAble" style="overflow: hidden;">
            <h3 class="f_l">报废单号：</h3>
            <div class="f_l text-center">
                <img v-if="imgAddr!=''" :src="'/static'+ imgAddr" alt="" height="50" width="300">
                <div>{{docTypeCode}}</div>
            </div>
        </div>

        <div class="form-content">
            <Form ref="scrapForm" :model="scrapForm" :label-width="120" :rules="scrapFormValidate">
                <Row>
                    <Col span="6">
                    <FormItem label="设备名称" prop="equipmentName">
                        <div style="color:#ffffff" onmousemove="this.style.color='#5b5b5b';" onmouseout="this.style.color='#ffffff'">
                                <span @click="deleteEqu" v-if="addAble&&scrapForm.equipmentName">
                                    <Icon type="ios-close" class="deleteTab"></Icon>
                                </span>
                            <div class="input-search" @click="openEquName">
                                <Input v-model="scrapForm.equipmentName" readonly :disabled="!addAble"></Input>
                                <Button icon="ios-search" :disabled="!addAble"></Button>
                            </div>
                        </div>
                    </FormItem>
                    </Col>
                    <Col span="6">
                    <FormItem label="设备编号" prop="equipmentCode">
                        <Input v-model="scrapForm.equipmentCode" placeholder="" disabled></Input>
                    </FormItem>
                    </Col>
                    <Col span="6">
                    <FormItem label="制造商">
                        <Input v-model="scrapForm.manufacturer" placeholder=""disabled></Input>
                    </FormItem>
                    </Col>
                    <Col span="6">
                    <FormItem label="规格型号">
                        <Input v-model="scrapForm.equipmentModel" placeholder=""disabled></Input>
                    </FormItem>
                    </Col>
                    <Col span="6">
                    <FormItem label="设备原值">
                        <Input v-model="scrapForm.purchasePrice" placeholder="" disabled></Input>
                    </FormItem>
                    </Col>
                    <Col span="6">
                    <FormItem label="购入日期">
                        <DatePicker v-model="scrapForm.acceptanceDate" type="date" placeholder="选择日期" :open="false" disabled></DatePicker>
                    </FormItem>
                    </Col>

                </Row>
                <Row>
                    <Col span="24">
                    <FormItem label="报废原因" prop="scrappingReason">
                        <Input v-model="scrapForm.scrappingReason" type="textarea" :disabled="!saveAble"></Input>
                    </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="6">
                    <FormItem label="申请部门" prop="department">
                        <div style="color:#ffffff" onmousemove="this.style.color='#5b5b5b';"
                             onmouseout="this.style.color='#ffffff'">
                                <span @click="deleteDept" v-if="scrapForm.department&&saveAble">
                                    <Icon type="ios-close" class="deleteTab"></Icon>
                                </span>
                            <div class="input-search pointDis" @click="openDeptMold">
                                <Input v-model="scrapForm.department" :readonly=true :disabled="!saveAble"></Input>
                                <Button icon="ios-search" :disabled="!saveAble"></Button>
                            </div>
                        </div>
                    </FormItem>
                    </Col>
                    <Col span="6">
                    <FormItem label="申请人" prop="applier">
                        <Input v-model="scrapForm.applier" :disabled="!saveAble"></Input>
                    </FormItem>
                    </Col>
                    <Col span="6">
                    <FormItem label="报废日期" prop="applyTime">
                        <DatePicker v-if="addAble||saveAble" v-model="scrapForm.applyTime" @on-change="changeDate" type="date" placeholder="选择日期"></DatePicker>
                        <DatePicker v-if="!addAble&&!saveAble" v-model="scrapForm.applyTime" @on-change="changeDate" type="date" placeholder="选择日期" :open="false" disabled></DatePicker>
                    </FormItem>
                    </Col>
                </Row>
            </Form>
        </div>
        <div class="applyRecord">
            <div class="second-title">审核记录</div>
            <div class="mar-b-20">
                <Form :label-width="100" inline>
                    <FormItem label="审核状态">
                        <Input v-model="auditStatus" placeholder="" readonly="readonly"disabled></Input>
                    </FormItem>
                    <FormItem label="最新反馈日期">
                        <DatePicker v-model="auditDate" type="date" placeholder="选择日期" :open="false" disabled></DatePicker>
                    </FormItem>
                </Form>
                <Table class="table-edit" stripe border :columns="historyColumns" :data="historyData"></Table>
                <div style="float: right;">
                    <Page :total="totalNum" size="small" show-elevator :page-size="pageSize" :current="page" @on-change="pageChange"></Page>
                </div>
            </div>
        </div>
        <div align="center" class="btnGroupDesign">
            <Button v-if="if_edit" type="primary" icon="document-text" size="large" v-show="editAble" @click="goEdit">编辑</Button>
            <Button v-if="if_save" type="primary" icon="document-text" size="large" v-show="saveAble" :loading="loading" @click="goSave('scrapForm')">保存</Button>
            <Button v-if="if_toAudit" type="primary" icon="document-text" size="large" v-show="editAble" :loading="OALoading" @click="toOAAudit">提交OA审核</Button>
            <Button v-if="if_back"  class="btn-gary" size="large" @click="backHandle">返回</Button>
        </div>

        <Modal v-model="equ_name" title="设备名称" @on-ok="toSelect_equName">
            <equ_nameSelect @nameSelected="name_hasSelected"></equ_nameSelect>
        </Modal>

        <!--使用部门-->
        <Modal v-model="deptModel" title="使用部门" @on-ok="toSelect_dept">
            <department @deptSelected="dept_hasSelected"></department>
        </Modal>
    </div>

</template>

<script type="text/ecmascript-6">
    import equ_nameSelect from '../treeMulitiple/equ_nameSelect.vue';
    import department from '../treeMulitiple/department.vue'

    export default{
        props: {},
        data(){
            return {
                //审核记录
                totalNum: 0,
                pageSize: 5,
                page: 1,
                //权限校验
                if_save: this.$rt(this.authJson.EAM.设备台账.设备报废编辑页.保存),
                if_cancel: this.$rt(this.authJson.EAM.设备台账.设备报废编辑页.取消),
                if_toAudit: this.$rt(this.authJson.EAM.设备台账.设备报废详情页.提交OA审核),
                if_back: this.$rt(this.authJson.EAM.设备台账.设备报废详情页.返回),
                if_edit: this.$rt(this.authJson.EAM.设备台账.设备报废详情页.编辑),
                //流程进度
                currentStep: 0,
                stepText: '系统归档',
                statusCode: 0,
                loading:false,
                OALoading:false,
                addAble: false,
                editAble: false,
                saveAble: true,
                flag: 0,
                parentId: '', //低级路由id
                pageTitle: '', //父级路由title
                pageFrom: '',
                pageStatus: 0,
                imgAddr: '', //barcode
                logoSrc:"../../static/img/ch_logo.jpg",
                docTypeCode:'',
                //申请部门
                deptModel: false,
                selectedDept: {},

                scrapForm: {
                    equipmentId: '',
                    equipmentName: '',
                    equipmentCode: '',
                    manufacturer: '',
                    equipmentModel: '',
                    purchasePrice: '',
                    acceptanceDate: '',
                    applyTime: '',
                    scrappingReason: '',
                    department: '',
                    applier: '',
                    applierId: ''
                },
                applyTime: '',
                scrapFormValidate: {
                    scrappingReason: [
                        { required: true, message: '请填写报废原因', trigger: 'blur' }
                    ],
                    department: [
                        { required: true, message: '请填写申请部门', trigger: 'blur' }
                    ],
                    applier: [
                        { required: true, message: '请填写申请人', trigger: 'blur' }
                    ],
                    applyTime: [
                        { required: true, type: 'date', message: '请填写报废日期', trigger: 'blur' }
                    ],
                },
                auditStatus: '',
                auditDate: '',
                equ_name: false,
                equ_nameSelect: {}, //选中的设备名称信息

                applyHistory:{
                    applyStatus:'',
                    feedbackDate:"",
                },
                historyColumns:[
                    {
                        title: '序号',
                        type: 'index',
                        width: 80,
                        align: 'center'
                    },
                    {
                        title: '反馈结果',
                        key: 'billStatus',
                        align: 'center',
                        render: (h, params) => {
                            return h('p', {
                                domProps: {
                                    title: params.row.billStatus
                                },
                                class: 'iview_tabDis',
                            }, params.row.billStatus)
                        },
                    },
                    {
                        title: '驳回意见',
                        key: 'comment',
                        align: 'center',
                        render: (h, params) => {
                            return h('p', {
                                domProps: {
                                    title: params.row.comment
                                }
                            }, params.row.comment)
                        }
                    },
                    {
                        title: '处理人',
                        key: 'processor',
                        align: 'center',
                        render: (h, params) => {
                            return h('p', {
                                domProps: {
                                    title: params.row.processor
                                },
                                class: 'iview_tabDis',
                            }, params.row.processor)
                        },
                    },
                    {
                        title: '处理时间',
                        key: 'processTime',
                        align: 'center',
                        render: (h, params) => {
                            return h('p', {
                                domProps: {
                                    title: params.row.processTime
                                },
//                                class: 'iview_tab_numDis',
                            }, params.row.processTime)
                        },
                    },
                    {
                        title: '处理信息',
                        key: 'action',
                        align: 'center',
                    },
                    {
                        title: '备注',
                        key: 'note',
                        align: 'center'
                    },
                ],
                historyData:[],
            }
        },
        mounted() {
            this.parentId = this.$route.query.id;
            let flag = this.$route.query.editFlag;
            this.flag = flag;
            this.pageStatus = this.$route.query.status;
            this.pageTitle = this.$base_info.getDescByCode(parseInt(this.pageStatus), this.$base_info.tEamEquipmentPurchaseApplicationFromStatusEnum);
            let statusCode = this.pageStatus;
            this.statusCode = statusCode;
            if (statusCode == 0 || statusCode == 3) {
                this.currentStep = 0;
            } else if (statusCode == 1) {
                this.currentStep = 1;
            } else if (statusCode == 2 || statusCode == 5) {
                this.currentStep = 2;
                this.stepText = '系统归档';
            } else if (statusCode == 4){
                this.currentStep = 2;
                this.stepText = '申请终止';
            } else if (statusCode == 6) {
                this.currentStep = 3;
            }

            if (flag == 1) {
                //新建
                this.addAble = true;
                this.saveAble = true;
            } else {
                //详情
                this.addAble = false;
                this.saveAble = false;
                this.pageInit();
                this.getAuditRecords();
            }
        },
        components: {
            'equ_nameSelect': equ_nameSelect,
            'department': department
        },
        methods: {
            changeDate(date) {
//                console.log('date === ' + date);
                this.applyTime = date;
//                this.scrapForm.applyTime = this.applyTime;
            },
            //渲染页面
            pageInit() {
                this.$axios.post('/equipmentApplication/equScrapDetail', {
                    id: this.parentId
                }).then((res) => {
//                    console.log('909090 ====== ')
                    console.log(JSON.stringify(res));
                    let ret = res.data.response;
                    if (ret.code == 1) {
                        this.scrapForm = ret.data;
                        this.imgAddr = ret.data.barCode;
                        this.docTypeCode = ret.data.billNo;
                        this.auditStatus = this.$base_info.getDescByCode(parseInt(this.pageStatus), this.$base_info.tEamEquipmentPurchaseApplicationFromStatusEnum);
                        this.applyTime = this.scrapForm.applyTime;
                        if (this.auditStatus == '已制单' || this.auditStatus == '已驳回') {
                            this.editAble = true;
                        } else {
                            this.editAble = false;
                        }
                        this.pageTitle = this.auditStatus;
                    } else {
                        this.$Message.error(ret.msg)
                    }
                }).catch((err) => {
                    console.log(err);
                })
            },
            /*申请部门*/
            openDeptMold(){
                if (this.saveAble) {
                    this.deptModel = true;
                }
            },
            //选择部门
            dept_hasSelected(msg) {
//                console.log('msg');
//                console.log(JSON.stringify(msg));
                this.selectedDept = msg;
            },
            //选中部门
            toSelect_dept() {
                this.scrapForm.department = this.selectedDept.tBdDepartmentName;
                this.scrapForm.applier = this.selectedDept.tBdPersonName;
                this.scrapForm.applierId = this.selectedDept.tBdPersonId;
            },
            //删除使用部门
            deleteDept() {
                this.scrapForm.department = '';
                this.scrapForm.applier = '';
            },
            //编辑
            goEdit() {
                this.editAble = false;
                this.saveAble = true;
            },
            //保存
            goSave(name) {
                let vt = this;
//                console.log('保存');
//                console.log(vt.scrapForm.applyTime)
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.$axios.post('/equipmentApplication/equScrapEditSave', {
                            billNo: vt.docTypeCode,//设备报废申请单号
                            equipmentId: vt.scrapForm.equipmentId,//设备id
                            scrapReason: vt.scrapForm.scrappingReason,//报废原因
                            applier: vt.scrapForm.applierId,//申请人
                            applyTime: vt.applyTime//申请日期
                        }).then((res) => {
//                            console.log('保存之后');
//                            console.log(JSON.stringify(res))
                            if (res.data.response.code == 1) {
                                vt.loading = true;
                                this.$Message.success('保存成功');
//                                if (vt.flag == 1) {
                                vt.$router.back();
//                                }
                            } else {
                                this.$Message.error(res.data.response.msg);
                            }
                        }).catch((err) => {
                            console.log(err);
                        })
                    } else {
                        this.$Message.error('请完善信息');
                    }
                })
            },

            //
            openEquName() {
                if (this.addAble) {
                    this.equ_name = true;
                }
            },
            //设备名称
            name_hasSelected(msg) {
                this.equ_nameSelect = msg;
            },
            //确定选中设备名称
            toSelect_equName() {
                this.scrapForm.equipmentName = this.equ_nameSelect.equipmentName;
                this.scrapForm.equipmentId = this.equ_nameSelect.equipmentId;
                this.equInfo();
            },
            //带出设备关联信息
            equInfo() {
                this.$axios.post('/equipmentApplication/equRelationInfo', {
                    equipmentId: this.scrapForm.equipmentId
                }).then((res) => {
//                    console.log('带出设备关联信息');
                    let ret = res.data.response;
//                    console.log(JSON.stringify(ret.data));
                    if (ret.code == 1) {
                        this.scrapForm.equipmentName = ret.data.equipmentName;
                        this.scrapForm.equipmentModel = ret.data.equipmentModel;
                        this.scrapForm.equipmentCode = ret.data.equipmentCode;
                        this.scrapForm.manufacturer = ret.data.manufacturer;
                        this.scrapForm.purchasePrice = ret.data.purchasePrice;
                        this.scrapForm.acceptanceDate = ret.data.acceptanceDate;
                    } else {
                        this.$Message.error(ret.msg);
                    }
                }).catch((err) => {
                    console.log(err);
                })
            },
            //删除设备名称
            deleteEqu() {
                this.scrapForm.equipmentName = '';
                this.scrapForm.equipmentCode = '';
                this.scrapForm.manufacturer = '';
                this.scrapForm.equipmentModel = '';
                this.scrapForm.purchasePrice = '';
                this.scrapForm.acceptanceDate = '';
            },
            //提交OA审核
            toOAAudit() {
                let vt = this;
                this.$axios.post('/eam/submit_equipment_scrapping', {
                    id: this.parentId
                }).then((res) => {
//                    console.log('id === ' + this.parentId);
//                    console.log(JSON.stringify(res));
                    if (res.data.response.code == 1) {
                        vt.OALoading = true;
                        this.$Message.success('提交OA审核成功');
                        this.$router.back();
                    } else {
                        this.$Message.error(res.data.response.msg);
                    }
                }).catch((err) => {
                    console.log(err);
                })
            },
            //返回上一页
            backHandle() {
                this.$router.back();
            },
            //设备单据审批历史记录
            getAuditRecords() {
                this.$axios.post('equipmentApplication/equApprovalHistory', {
                    page: this.page,
                    pageSize: this.pageSize,
                    billId: this.parentId
                }).then((res) => {
                    let ret = res.data.response;
//                    console.log('ret ======== '+JSON.stringify(ret))
                    if (ret.code == 1) {
                        for (let i in ret.data.rows) {
                            let obj = {};
                            obj.billId = ret.data.rows[i].billId;
                            obj.billType = ret.data.rows[i].billType;
                            obj.billStatus = ret.data.rows[i].billStatus;
                            obj.comment = ret.data.rows[i].comment;
                            obj.processor = ret.data.rows[i].processor;
                            obj.processTime = ret.data.rows[i].processTime;
                            obj.action = ret.data.rows[i].action;
                            obj.note = ret.data.rows[i].note;
                            this.historyData.push(obj);
                            this.auditDate = this.historyData[0].processTime;
                        }
                        this.totalNum = ret.data.total;
                    } else {
                        this.$Message.error()
                    }
                }).catch((err) => {
                    console.log(err);
                })
            },
            pageChange(cur) {
                this.page = cur;
                this.getAuditRecords();
            }
        }
    };

</script>

<style type="text/css">
    .titleLogo{
        width: 100px;
        height: 55px;
        margin: 15px 0;
        position: absolute;
        right: 60px;
        top: 0;
    }
    .deleteTab {
        right: 30px;
        margin-left: 0;
    }
</style>
