<template>
    <div style="position:relative;" class="basic bzzy-change">
        <div class="title">
            <span>设备预验收详情--{{pageTitle}}</span><br/>
        </div>
        <div class="progressContent">
            <div class="second-title">审核进度</div>
            <Steps :current="currentStep">
                <Step title="预验收申请" content=""></Step>
                <Step title="OA审核中" content=""></Step>
                <Step :title="stepText" content=""></Step>
            </Steps>
        </div>
        <div class="titleLogo"><img style="width: 100%;height: 100%;" :src="logoSrc"></div>
        <div style="overflow: hidden;">
            <h3 class="f_l">预验收单号：</h3>
            <div class="f_l text-center">
                <img v-if="imgAddr!=''" :src="'/static'+ imgAddr" alt="" height="50" width="300">
                <div>{{docTypeCode}}</div>
            </div>
        </div>
        <div class="detailContent mar-t-15">

            <div>
                <div class="form-content">
                    <Form ref="scrapForm" inline :model="scrapForm" :rules="scrapFormValidate" :label-width="100" class="equ_addForm">

                        <FormItem label="设备名称" prop="purchaseEquipmentLocalName">
                            <Input v-model="scrapForm.purchaseEquipmentLocalName" placeholder="" disabled></Input>
                        </FormItem>

                        <FormItem label="制造厂家" prop="purchaseManufacturerName">
                            <Input v-model="scrapForm.purchaseManufacturerName" placeholder="" disabled></Input>
                        </FormItem>

                        <FormItem label="规格型号" prop="purchaseModelName">
                            <Input v-model="scrapForm.purchaseModelName" placeholder="" disabled></Input>
                        </FormItem>

                        <FormItem label="请购数量" prop="purchaseQuantity">
                            <Input v-model="scrapForm.purchaseQuantity" disabled>
                            <span slot="append">台</span>
                            </Input>
                        </FormItem>

                        <FormItem label="预验收地点" prop="preAcceptanceLocation">
                            <Input v-model="scrapForm.preAcceptanceLocation" :max="50" :maxlength="50" type="textarea" placeholder="" :disabled="editAble"></Input>

                            <!--<div style="color:#ffffff" onmousemove="this.style.color='#5b5b5b';"
                                 onmouseout="this.style.color='#ffffff'">
                                <span @click="deleteSite" v-if="!editAble&&scrapForm.preAcceptanceLocation">
                                    <Icon type="ios-close" class="deleteTab"></Icon>
                                </span>
                                <div class="input-search pointDis" @click="openSiteMode">
                                    <Input v-model="scrapForm.preAcceptanceLocation" :readonly=true style="width: 160px;" :disabled="editAble"></Input>
                                    <Button icon="ios-search" :disabled="editAble"></Button>
                                </div>
                            </div>-->
                        </FormItem>

                        <FormItem label="需求日期" prop="purchaseRequiredDate">
                            <DatePicker v-model="scrapForm.purchaseRequiredDate"style="width: 160px" type="date" placeholder="选择日期和时间" :open="false" disabled></DatePicker>
                        </FormItem>
                        <FormItem label="预验收负责人" prop="preAcceptancePerson">
                            <Input v-model="scrapForm.preAcceptancePerson" placeholder="" disabled></Input>
                        </FormItem>
                        <FormItem label="预验收日期" prop="preAcceptanceDate">
                            <DatePicker v-model="scrapForm.preAcceptanceDate" type="date" style="width: 160px" :open="false" disabled></DatePicker>
                        </FormItem>
                    </Form>
                </div>
                <div class="second-title">采购合同</div>
                <div class="mar-b-20">
                    <Form :label-width="100" inline>
                        <FormItem label="合同编码" prop="department">
                            <Input v-model="contractCode" placeholder="" :disabled="editAble"></Input>
                        </FormItem>
                        <FormItem label="合同名称">
                            <Input v-model="contractName" placeholder="" :disabled="editAble"></Input>
                        </FormItem>
                        <Button class="mar-t-15" type="primary" icon="search" size="small" @click="searchContract" :disabled="editAble">合同检索</Button>
                    </Form>
                    <table class="table table-bordered table-center table-striped table-blue table-edit table-standWork taDsiplay">
                        <thead>
                        <tr>
                            <th width="80">序号</th>
                            <th>合同编码</th>
                            <th>合同名称</th>
                            <th width="80">操作</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="(item, index) in contractData" :key="item.contractId" class="trDisplay">
                            <td>{{index + 1}}</td>
                            <td>{{item.contractCode}}</td>
                            <td>{{item.contractName}}</td>
                            <td>
                                <a :disabled="editAble" @click="deleteContract(index)">删除</a>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    <div class="formTableHasNoData wid-100" v-show="!contractData.length">
                        <p>暂无数据</p>
                    </div>
                </div>
                <div class="applyRecord">
                    <div class="second-title">审核记录</div>
                    <div class="mar-b-20">
                        <Form :label-width="100" inline>
                            <FormItem label="审核状态">
                                <Input v-model="auditStatus" placeholder="" disabled></Input>
                            </FormItem>
                            <FormItem label="最新反馈日期">
                                <DatePicker v-model="auditDate" type="date" style="width: 160px" :open="false" disabled></DatePicker>
                            </FormItem>
                        </Form>
                        <Table class="table-edit" stripe border :columns="scrapColumns" :data="scrapData"></Table>
                        <div class="mar-t-10" style="float: right;">
                            <Page :total="totalNum" size="small" show-elevator :page-size="pageSize" :current="page" @on-change="pageChange"></Page>
                        </div>
                    </div>

                </div>
                <!--保存按钮-->
                <div align="center" class="btnGroupDesign">
                    <Button v-if="if_edit" type="primary" icon="document-text" size="large" v-show="flag" @click="goEdit">编辑</Button>
                    <Button v-if="if_save" type="primary" icon="document-text" size="large" v-show="saveAble" :loading="loading" @click="goSave('scrapForm')">保存</Button>
                    <Button v-if="if_toAudit" type="primary" icon="document-text" size="large" v-show="flag" :loading="OALoading" @click="toAudit('scrapForm')">提交OA审核</Button>
                    <Button v-if="if_back" class="btn-gary" size="large" @click="backHandle">返回</Button>
                </div>
            </div>
        </div>

        <Modal v-model="equSite_mod" title="设备地点" @on-ok="toSelect_equSite">
            <Tree :data="baseData" show-checkbox :multiple="false" :show-checkbox="false"
                  @on-select-change="left_personSelected" class="max-h-300"></Tree>
        </Modal>
    </div>

</template>

<script type="text/ecmascript-6">
    export default{
        props: {},
        data(){
            return {
                //审核记录
                totalNum: 0,
                pageSize: 5,
                page: 1,
                //权限校验
                if_save: this.$rt(this.authJson.EAM.设备台账.设备预验收编辑页.保存),
                if_back: this.$rt(this.authJson.EAM.设备台账.设备预验收详情页.返回),
                if_toAudit: this.$rt(this.authJson.EAM.设备台账.设备预验收详情页.提交OA审核),
                if_edit: this.$rt(this.authJson.EAM.设备台账.设备预验收详情页.编辑),
                loading:false,
                OALoading:false,
                editAble: true,
                saveAble: false,
                flag: true,
                billId: '', //从路由信息获取的id
                pageTitle: '', //从路由信息获取的title
                pageStatus: '',
                currentStep: 0,  //默认当前进度
                stepText: '系统归档',
                logoSrc:"../../static/img/ch_logo.jpg",
                docTypeCode:'',
                scrapForm:{
                    preAcceptaceId: '',                 //预验收ID
                    purchaseId: '',                     //验收申请单ID
                    preAcceptanceApprovalStatus: '', //单据状态
                    purchaseEquipmentLocalName: '',  //设备名称
                    purchaseManufacturerId: '',      //制造厂商id
                    purchaseManufacturerName: '',    //制造厂商Name
                    purchaseModelId: '',              //设备型号ID
                    purchaseModelName: '',            //设备型号Name
                    purchaseQuantity: 0,              //申购数量--请购数量
                    preAcceptanceLocation: '',       //预验收地点
                    purchaseRequiredDate: '',       //需求日期
                    preAcceptanceResult: '',        //验收结果（技术要求）
                    preAcceptancePerson: '',        //验收负责人
                    preAcceptancePersonId: '',        //验收负责人Id
                    preAcceptanceDate: '',          //预验收日期

                },
                requiredDate: '',
                auditStatus: '', //审核状态
                auditDate: '', //最新反馈日期

                scrapFormValidate: {
                    preAcceptanceLocation: [
                        { required: true, message: '预验收地点不能为空', trigger: 'change', },
                        {  message: '预验收地点不能超出50个字', trigger: 'change',max: 50 }
                    ],
                    preAcceptanceResult: [
                        { message: '预验收结果不能超出500个字', trigger: 'change',max: 500, }
                    ],
                },
                //设备地点相关
                equSite_mod: false,
                baseData: [],
                equ_site_obj: '',
                equSite_selected: "",
                equSite: "",
                equSiteId: '',
                /*采购合同相关*/
                contractName: '', //合同名称
                contractCode: '', //合同编码
                contractData: [],
                scrapColumns:[
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
                scrapData:[],
                imgAddr: ''
            };
        },
        mounted() {
            let id = this.$route.query.preAcceptaceId;
            this.billId = id;

            let code = this.$route.query.code;
//            console.log('this.code == '+code);
            this.docTypeCode = code;
            let status = this.$route.query.status;
            this.pageStatus = status;
//            console.log('this.status == '+status);
            if (status == 0 || status == 3) {
                this.flag = true;
            } else {
                this.flag = false;
            }
            let statusCode = status;
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
            }

            this.pageInit();
            this.get_equSite();
            this.getAuditRecords();
        },

        methods: {
            //页面渲染
            pageInit() {
                this.$axios.post('/equipmentApplication/preAcceptaceInfo', {
                    preAcceptaceId: this.billId
                }).then((res) => {
                    let ret = res.data.response;
                    console.log('页面渲染 ===== 0000 ' + JSON.stringify(ret))
                    if (ret.code != 1 ) {
                        this.$Message.error(ret.msg);
                    } else {
                        //请求成功
                        this.scrapForm = ret.data;
                        this.imgAddr = ret.data.barCode;
                        this.scrapForm.preAcceptancePersonId = ret.data.preAcceptancePersonID;
                        this.auditStatus = this.$base_info.getDescByCode(ret.data.preAcceptanceApprovalStatus, this.$base_info.tEamEquipmentPurchaseApplicationFromStatusEnum);
                        this.pageTitle = this.auditStatus;
                        this.scrapForm.purchaseRequiredDate = this.scrapForm.purchaseRequiredDate.toString();
                        for (let i=0; i<ret.data.contract.length; i++) {
                            let obj = {};
                            if (ret.data.contract[i].contractId != '') {
                                obj.contractId = ret.data.contract[i].contractId;
                                obj.contractCode = ret.data.contract[i].contractCode;
                                obj.contractName = ret.data.contract[i].contractName;
                                this.contractData.push(obj);
                            }
                        }
                    }
                }).catch((err) => {
                    console.log(err);
                })
            },
            //编辑
            goEdit() {
                this.editAble = false;
                this.saveAble = true;
                this.flag = false;
            },
            //保存
            goSave(name) {
                let vt = this;
                let contractArr = [];
                for (let i in vt.contractData) {
                    contractArr.push({
                        purchaseContractCode: vt.contractData[i].contractCode,
                        purchaseContractName: vt.contractData[i].contractName
                    })
                }
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        vt.loading = true;
                        this.$axios({method:'post',url:'/equipmentApplication/preAcceptaceSave', data:{
                            equipmentLocalName: vt.scrapForm.purchaseEquipmentLocalName,   //设备名称
                            manufacturerId: vt.scrapForm.purchaseManufacturerId,  //制造厂商id--规格型号
                            modelId: vt.scrapForm.purchaseModelId,       //设备型号id--规格型号
                            preAcceptaceId: vt.scrapForm.preAcceptaceId,     //预验收单ID
                            preAcceptanceLocation: vt.scrapForm.preAcceptanceLocation,    //预验收地点
                            purchaseQuantity: vt.scrapForm.purchaseQuantity,      //申购数量--请购数量
                            requiredDate: vt.scrapForm.purchaseRequiredDate,      //需求日期
                            applier: vt.scrapForm.preAcceptancePersonId,       //验收负责人
                            approveAt: vt.scrapForm.preAcceptanceDate,     //预验收日期
                            comment: vt.scrapForm.preAcceptanceResult,      //预验收结果（技术要求）
                            equipmentPreAcceptaceContractSaveVO: contractArr         //合同
                        }}).then((res) => {
//                            console.log('保存')
//                            console.log(JSON.stringify(res))
                            let ret = res.data.response;
                            if (ret.code == 1) {
                                vt.$Message.success(ret.data);
                                this.$router.back();
                            } else {
                                //.. 业务失败的情况
                                vt.loading = false;
                                vt.$Message.error({
                                    content: ret.msg,
                                    duration: 5,
                                    closable: true
                                });
                            }
                        }).catch((err) => {
                            console.log(err);
                        })
                    } else {
                        vt.$Message.error('请完善信息！');
                    }
                })

            },
            //提交OA审核
            toAudit(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.$axios.post('/eam/submit_equipment_pre_acceptance', {
                            preAcceptaceId: this.scrapForm.preAcceptaceId
                        }).then((res) => {

                            if (res.data.response.code == 1) {
                                this.OALoading = true;
                                this.$Message.success('提交OA审核成功');
                                this.$router.back();
                            } else {
                                this.$Message.error(res.data.response.msg);
                            }
                        }).catch((err) => {
                            console.log(err);
                        })
                    } else {
                        this.$Message.error('请先编辑并完善信息');
                    }
                })

            },
            //返回上一页
            backHandle() {
                this.$router.back();
            },
            //打开地点弹框
            openSiteMode() {
                if (!this.editAble) {
                    this.equSite_mod = true;
                }
            },
            //设备地点完整树加载:
            get_equSite(){
                let vt = this;
                this.$axios.get('/common/location/locationNameTree').then((res) => {
                    let result = res.data.response;
                    if (result.code != 1) {
                        vt.$Message.error(result.msg);
                    }
                    else {
                        vt.baseData = result.data;
                        vt.baseData[0].expand = true;
                    }
                }).catch((err) => {
                    console.log(err);
                });
            },
            //设备地点树选择：
            left_personSelected (left_node){
                if (JSON.stringify(left_node) == "[]") {
                    return
                }
                if (left_node[0] && left_node[0].children) {
                    left_node[0].expand = !left_node[0].expand;
                    left_node[0].selected = true;
                }
                this.equ_site_obj = left_node[0];
            },
            //地点确定按钮：
            toSelect_equSite(){
                this.equSite = this.equ_site_obj.title;
                this.scrapForm.preAcceptanceLocation = this.equSite;
                this.equSiteId = this.equ_site_obj.id;
            },
            //删除地点
            deleteSite(){
                this.equSite = '';
                this.scrapForm.preAcceptanceLocation = '';
                this.equSiteId = '';
            },
            //合同相关
            searchContract() {
                this.$axios.post('/eam/submit_equipment_pre_acceptance_contract', {
                    contractCode: this.contractCode,
                    contractName: this.contractName
                }).then((res) => {
//                    console.log('合同相关 ==== ')
//                    console.log(JSON.stringify(res))
                    let ret = res.data.response;
                    if (ret.code == 1) {
                        this.contractData = ret.data;
                    } else {
                        this.$Message.error(ret.msg);
                    }
                }).catch((err) => {
                    console.log(err)
                })
            },
            deleteContract(idx) {
                this.contractData.splice(idx,1);
            },
            //设备单据审批历史记录
            getAuditRecords() {
                this.$axios.post('equipmentApplication/equApprovalHistory', {
                    page: this.page,
                    pageSize: this.pageSize,
                    billId: this.billId
                }).then((res) => {
                    let ret = res.data.response;
//                    console.log('ret ======== '+JSON.stringify(ret))
                    if (ret.code == 1) {
//                        this.scrapData = ret.data.rows;
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
                            this.scrapData.push(obj);
                            this.auditDate = this.scrapData[0].processTime;
                        }
                        this.totalNum = ret.data.total;
                    } else {
                        this.$Message.error(ret.msg)
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
</style>
