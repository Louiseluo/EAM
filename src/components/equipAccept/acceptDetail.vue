<template>
    <div style="position:relative;" class="basic bzzy-change">
        <div class="title">
            <span>设备验收详情--{{pageTitle}}</span><br/>
        </div>
        <div class="progressContent">
            <div class="second-title">审核进度</div>
            <Steps :current="currentStep">
                <Step title="验收申请" content=""></Step>
                <Step title="OA审核中" content=""></Step>
                <Step :title="stepText" content=""></Step>
                <Step v-if="statusCode!=4" title="设备建账" content=""></Step>
            </Steps>
        </div>
        <div class="titleLogo"><img style="width: 100%;height: 100%;" :src="logoSrc"></div>
        <div style="overflow: hidden;">
            <h3 class="f_l">验收单编号：</h3>
            <div class="f_l text-center">
                <img v-if="imgAddr!=''" :src="'/static'+ imgAddr" alt="" height="50" width="300">
                <div>{{docTypeCode}}</div>
            </div>
        </div>
        <Form ref="scrapForm" inline :model="scrapForm" :rules="scrapFormValidate" :label-width="100">
            <div class="second-title mar-t-15">设备信息</div>
            <FormItem label="设备名称" prop="equipmentName">
                <Input v-model="scrapForm.equipmentName" style="width: 160px;"  placeholder="" disabled></Input>
            </FormItem>
            <FormItem label="制造厂家" prop="manufacturer">
                <Input v-model="scrapForm.manufacturer" style="width: 160px;" placeholder="" disabled></Input>
            </FormItem>
            <FormItem label="规格型号" prop="model">
                <Input v-model="scrapForm.model" style="width: 160px;" placeholder="" :disabled="editAble"></Input>
            </FormItem>
            <FormItem label="基本配置" prop="config">
                <Input v-model="scrapForm.config" style="width: 160px;" placeholder="" :disabled="editAble"></Input>
            </FormItem>
            <FormItem label="使用部门" prop="userDepartment">
                <Input v-model="scrapForm.userDepartment" style="width: 160px;" placeholder=""disabled></Input>
            </FormItem>
            <FormItem label="设备总值(万元)">
                <Input v-model="scrapForm.purchasePrice" @on-change="checkNum2(scrapForm.purchasePrice)" style="width: 160px;"  :disabled="editAble" ><span slot="append">万元</span></Input>
            </FormItem>
            <FormItem label="运输费(万元)">
                <Input v-model="scrapForm.transportationFee" @on-change="checkNum1(scrapForm.transportationFee)" style="width: 160px;"  :disabled="editAble" ><span slot="append">万元</span></Input>
            </FormItem>
            <FormItem label="安装费(万元)">
                <Input v-model="scrapForm.installationFee" style="width: 160px;" @on-change="checkNum3(scrapForm.installationFee)" :disabled="editAble" ><span slot="append">万元</span></Input>
            </FormItem>
            <FormItem label="出厂编号" prop="manufacturerEquipmentCode">
                <Input v-model="scrapForm.manufacturerEquipmentCode" style="width: 160px;" placeholder=""  :disabled="editAble" ></Input>
            </FormItem>
            <FormItem label="出厂日期" prop="dateOfProduction">
                <DatePicker v-model="scrapForm.dateOfProduction" style="width: 160px;" @on-change="changeProDate" type="date" placeholder="选择日期" :editable="false" v-if="!editAble" :disabled="false" ></DatePicker>
                <DatePicker v-model="scrapForm.dateOfProduction" style="width: 160px;" @on-change="changeProDate" type="date" placeholder="选择日期" :editable="false" v-else :open="false" :disabled="true" ></DatePicker>
            </FormItem>
            <FormItem label="进厂日期" prop="dateOfReceipt">
                <!--<DatePicker v-model="scrapForm.dateOfReceipt" @on-change="changeRecDate" type="date" placeholder="选择日期" :disabled="editAble" :editable="editAble" ></DatePicker>-->
                <DatePicker v-model="scrapForm.dateOfReceipt" style="width: 160px;" @on-change="changeRecDate" type="date" placeholder="选择日期" v-if="!editAble" :editable="false" :disabled="false" ></DatePicker>
                <DatePicker v-model="scrapForm.dateOfReceipt" style="width: 160px;" @on-change="changeRecDate" type="date" placeholder="选择日期" v-else :open="false" :editable="false" :disabled="true" ></DatePicker>
            </FormItem>
            <FormItem label="发票类型" prop="invoiceType">
                <Select v-model="scrapForm.invoiceType" class="typeSelect"  :disabled="editAble" >
                    <Option v-for="it in newInvoiceTypeArr" :value="it.code" :key="it.code">{{ it.desc }}</Option>
                </Select>
            </FormItem>
            <FormItem label="发票编号" prop="invoiceNo">
                <Input v-model="scrapForm.invoiceNo" style="width: 160px;" placeholder="" :disabled="editAble" ></Input>
            </FormItem>
            <FormItem label="安装地点" prop="installationLocation">
                <div style="color:#ffffff" onmousemove="this.style.color='#5b5b5b';"
                     onmouseout="this.style.color='#ffffff'">
                                <span @click="deleteSite" v-if="!editAble&&scrapForm.installationLocation">
                                    <Icon type="ios-close" class="deleteTab"></Icon>
                                </span>
                    <div class="input-search pointDis" @click="openSiteMode">
                        <Input v-model="scrapForm.installationLocation" style="width: 160px;" :disabled="editAble"></Input>
                        <Button icon="ios-search" :disabled="editAble"></Button>
                    </div>
                </div>
            </FormItem>
            <FormItem label="交验日期" prop="dateOfSubmitAcceptance">
                <DatePicker v-model="scrapForm.dateOfSubmitAcceptance" style="width: 160px;" @on-change="changeSubDate" type="date" placeholder="选择日期" v-if="!editAble" :disabled="false" :editable="false"></DatePicker>
                <DatePicker v-model="scrapForm.dateOfSubmitAcceptance" style="width: 160px;" @on-change="changeSubDate" type="date" placeholder="选择日期" v-else :open="false" :disabled="true" :editable="false"></DatePicker>
            </FormItem>
            <FormItem label="预计使用年限" prop="useLife">
                <InputNumber :min="1" v-model="scrapForm.useLife" style="width: 160px;" placeholder=""  :disabled="editAble" ></InputNumber >
            </FormItem>
            <div class="second-title mar-t-10">设备验收内容</div>
            <Row>
                <Row>
                    <Col span="24">
                    <FormItem label="公司厂内设备编号" :label-width="130" prop="equipmentCode">
                        <Input v-model="scrapForm.equipmentCode" style="width: 160px;" placeholder=""  :disabled="editAble" ></Input>
                    </FormItem>
                    </Col>
                </Row>
                <Col span="12">
                <FormItem label="外包装" style="width: 100%;" prop="outerPackage">
                    <Input type="textarea" :max="200" :maxlength="200" v-model="scrapForm.outerPackage" placeholder=""  :disabled="editAble" ></Input>
                </FormItem>
                </Col>
                <Col span="12">
                <FormItem label="设备外观" style="width: 100%;" prop="equAppear">
                    <Input type="textarea" :max="200" :maxlength="200" v-model="scrapForm.equAppear" placeholder=""  :disabled="editAble" ></Input>
                </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="12">
                <FormItem label="空载表现" style="width: 100%;" prop="freeRun">
                    <Input type="textarea" :max="200" :maxlength="200" v-model="scrapForm.freeRun" placeholder=""  :disabled="editAble" ></Input>
                </FormItem>
                </Col>
                <Col span="12">
                <FormItem label="满载表现" style="width: 100%;" prop="loadRun">
                    <Input type="textarea" :max="200" :maxlength="200" v-model="scrapForm.loadRun" placeholder=""  :disabled="editAble" ></Input>
                </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="12">
                <FormItem label="设备安装质量" style="width: 100%;" prop="equInstallQuality">
                    <Input type="textarea" :max="200" :maxlength="200" v-model="scrapForm.equInstallQuality" placeholder=""  :disabled="editAble" ></Input>
                </FormItem>
                </Col>
            </Row>

            <div class="second-title">随机物品</div>
            <table class="table table-bordered table-center table-striped table-blue table-edit taDsiplay">
                <thead>
                <tr>
                    <th>序号</th>
                    <th>随机物品名称</th>
                    <th>随机物品类型</th>
                    <th >规格型号</th>
                    <th >功率</th>
                    <th>功率单位</th>
                    <th >随机物品数量</th>
                    <th >数量单位</th>
                    <th >保管人</th>
                    <th>上传附件</th>
                    <th width="100">操作</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item,indexs) in scrapForm.attach" class="trDisplay">
                    <td>{{indexs + 1}}</td>
                    <td class="pad-2-10" style="position: relative;">
                        <span class="pro">*</span><Input v-model="item.attachmentName" style="margin-left:10px;width: 160px;" :disabled="editAble"></Input>
                    </td>
                    <td class="pad-2-10" style="position: relative;">
                        <span class="pro">*</span>
                        <Select v-model="item.attachmentType" style="padding-left:10px;" class="meetingManage_select" :disabled="editAble">
                            <Option v-for="it in newTypeArr" :value="it.code" :key="it.code">{{ it.desc }}</Option>
                        </Select>
                    </td>
                    <td class="pad-2-10" style="position: relative;">
                        <p v-show="item.attachmentType!=2">——</p>
                        <div v-show="item.attachmentType==2"><span class="pro">*</span><Input v-model="item.model" style="padding-left:10px;" :disabled="editAble"></Input></div>
                    </td>
                    <td class="pad-2-10" style="position: relative;">
                        <p v-show="item.attachmentType!=2">——</p>
                        <div v-show="item.attachmentType==2"><span class="pro">*</span><Input v-model="item.power" style="padding-left:10px;" :disabled="editAble"></Input></div>
                    </td>
                    <td class="pad-2-10" style="position: relative;">
                        <p v-show="item.attachmentType!=2">——</p>
                        <div v-show="item.attachmentType==2">
                            <div style="position: relative;" class="pad-2-10">
                                <span class="pro">*</span>
                                <div style="color:#ffffff" onmousemove="this.style.color='#5b5b5b';"
                                     onmouseout="this.style.color='#ffffff'">
                                    <div class="input-search pointDis" @click="toOpenPowerUom(indexs)">
                                        <Input v-model="item.powerUnit" :disabled="editAble"></Input>
                                        <Button icon="ios-search" :disabled="editAble"></Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </td>
                    <td class="pad-2-10" style="position: relative;">
                        <span class="pro">*</span><Input v-model="item.attachmentQuantity" style="padding-left:10px;" :disabled="editAble"></Input>
                    </td>
                    <td>
                        <div style="position: relative;" class="pad-2-10">
                            <span class="pro">*</span>
                            <div style="color:#ffffff" onmousemove="this.style.color='#5b5b5b';"
                                 onmouseout="this.style.color='#ffffff'">
                                <div class="input-search pointDis" @click="toOpenUom(indexs)">
                                    <Input v-model="item.attachmentQuantityUnit" :disabled="editAble"></Input>
                                    <Button icon="ios-search" :disabled="editAble"></Button>
                                </div>
                            </div>
                        </div>
                    </td>
                    <td>
                        <div style="position: relative;" class="pad-2-10">
                            <span class="pro">*</span>
                            <div style="color:#ffffff" onmousemove="this.style.color='#5b5b5b';"
                                 onmouseout="this.style.color='#ffffff'">
                                <div class="input-search pointDis" @click="toOpenPerson(indexs)">
                                    <Input v-model="item.keeper" :disabled="editAble"></Input>
                                    <Button icon="ios-search" :disabled="editAble"></Button>
                                </div>
                            </div>
                        </div>
                    </td>
                    <td class="pad-2-10">
                        <Row>
                            <Col span="16">
                            <div v-for="(it,ind) in item.files">
                                <span class="wid200" :title="it.fileName">{{it.fileName}}</span>
                                <a v-show="it.fileName!=''" @click="toSee(indexs,ind)" style="margin:0 10px;">预览</a>
                                <a v-show="it.fileName!=''&&!editAble" @click="toDel(indexs,ind)">删除</a>
                            </div>
                            </Col>
                            <Col span="8">
                            <PandoraUpload v-if="!editAble" :action="uploadUrl()" :fileSavePath="'/eam/'" @on-up-success="upSuccessFile" :show-upload-list="false">
                                <Button icon="ios-cloud-upload-outline" @click="upfile(indexs)" >上传文件</Button>
                            </PandoraUpload>
                            </Col>
                        </Row>
                    </td>
                    <td>
                        <a :disabled="editAble" @click="deleteItem(indexs)">删除</a>
                    </td>
                </tr>
                </tbody>
            </table>
            <div class="mar-t-10 clear">
                <Button size="small" type="primary" class="fl" @click="addNewTr" :disabled="editAble||scrapForm.attach.length>9">添加</Button>
            </div>
        </Form>

        <div class="second-title mar-t-15">采购合同</div>
        <div class="mar-b-20">
            <Table class="table-edit" stripe border :columns="contractCols" :data="contractData"></Table>
            <div class="page mar-t-10">
                <Page :total="pageTotal" :current="page" size="small" show-elevator :page-size="pageSize" @on-change="pageSearchInfo"></Page>
            </div>
        </div>

        <div class="applyRecord">
            <div class="second-title mar-t-15">审核记录</div>
            <div class="mar-b-20">
                <Form :label-width="100" inline>
                    <FormItem label="审核状态" prop="applyStatus">
                        <Input v-model="scrapApplyStatus" placeholder="" readonly="readonly" disabled></Input>
                    </FormItem>
                    <FormItem label="最新反馈日期" prop="feedbackDate">
                        <DatePicker v-model="feedbackDate" type="date"  placeholder="选择日期" :open="false" disabled></DatePicker>
                    </FormItem>
                </Form>
                <Table class="table-edit" stripe border :columns="scrapColumns" :data="scrapData"></Table>
                <div style="float: right;">
                    <Page :total="totalNum" size="small" show-elevator :page-size="pageSizeScrap" :current="curPage" @on-change="pageChange"></Page>
                </div>
            </div>
        </div>
        <!--保存按钮-->
        <div align="center" class="btnGroupDesign">
            <Button v-if="if_save" type="primary" icon="document-text" size="large" v-show="saveAble" @click="save('scrapForm')">保存</Button>
            <Button v-if="if_edit" type="primary" icon="document-text" size="large" :loading="loading" @click="editFun" v-show="canEdit">编辑</Button>
            <Button v-if="if_toAudit" type="primary" icon="document-text" size="large" :loading="OALoading" v-show="canEdit" @click="toAudit">提交OA审核</Button>
            <Button v-if="if_back" class="btn-gary" size="large" @click="backHandle">返回</Button>
        </div>
        <!--人员选择-->
        <Modal v-model="person_mod" title="人员选择" @on-ok="toSelectPerson">
            <personSingle @typeSelected="hasSelected_person"></personSingle>
        </Modal>
        <!--功率单位-->
        <Modal v-model="powerUom_model" title="功率单位" @on-ok="toSelectPowerUom">
            <uomSelect @uomSelected="hasSelected_powerUom"></uomSelect>
        </Modal>
        <!--数量单位-->
        <Modal v-model="uom_model" title="数量单位" @on-ok="toSelectUom">
            <uomSelect @uomSelected="hasSelected_uom"></uomSelect>
        </Modal>
        <!--安装地点-->
        <Modal v-model="equSite_mod" title="安装地点" @on-ok="toSelect_equSite">
            <tree_equSite @getEquSite="siteSelected"></tree_equSite>
        </Modal>
    </div>
</template>
<script type="text/ecmascript-6">
    import personSingle from "../treeMulitiple/personSingle.vue";
    import PandoraUpload from '../../api/pandora-upload/pandoraUpload.vue'
    import uomSelect from '../treeMulitiple/getUom.vue'
    import tree_equSite from '../treeMulitiple/tree_equSite.vue'
    import {baseUrl} from '../../api/http';
    export default{
        data(){
            return {
                baseUrl: baseUrl(),
                //审核记录
                totalNum: 0,
                pageSizeScrap: 5,
                curPage: 1,
                //权限校验
                if_save: this.$rt(this.authJson.EAM.设备台账.设备验收编辑页.保存),
                if_cancel: this.$rt(this.authJson.EAM.设备台账.设备验收编辑页.取消),
                if_toAudit: this.$rt(this.authJson.EAM.设备台账.设备验收详情页.提交OA审核),
                if_back: this.$rt(this.authJson.EAM.设备台账.设备验收详情页.返回),
                if_edit: this.$rt(this.authJson.EAM.设备台账.设备验收详情页.编辑),
                powerIndex: 0,
                powerUom_model: false,
                powerUomSelected: null,
                //流程进度
                currentStep: 0,
                stepText: '系统归档',
                statusCode: 0,
                loading:false,
                OALoading:false,
                parentType: '',
                logoSrc:"../../static/img/ch_logo.jpg",
                docTypeCode:'',
                imgAddr: '',
                scrapForm:{
                    //设备信息
                    acceptanceFormId: '',
                    equipmentName: '',
                    manufacturer: '',
                    model: '',
                    userDepartment: '',
                    purchasePrice: 1,
                    transportationFee: 1,
                    installationFee: 1,
                    manufacturerEquipmentCode:'',
                    dateOfProduction:'',
                    dateOfReceipt:'',
                    invoiceType:'',
                    invoiceNo:'',
                    installationLocation:'',
                    installationLocationId: '',
                    dateOfSubmitAcceptance:'',
                    useLife: 1,
                    attach: [
                        {
                            acceptanceFormId: "",
                            attachmentName: "",
                            attachmentQuantity: "",
                            attachmentQuantityUnit: '',
                            attachmentQuantityUnitId: "",
                            attachmentType: "",
                            model: '',
                            power: '',
                            powerUnit: '',
                            powerUnitId: '',
                            keeper: "",
                            keeperId: "",
                            note: "",
                            files: []
                        }
                    ],
                    /*新加*/
                    equipmentCode: '', //公司厂内设备编号
                    outerPackage: '', //外包装
                    equAppear: '', //设备外观
                    freeRun: '', //空载表现
                    loadRun: '', //满载表现
                    equInstallQuality: '', //设备安装质量
                    config: '', //基本配置
                },
                scrapFormValidate: {
                    manufacturerEquipmentCode: [
                        { required: true,type: 'string', message: '请填写出厂编号', trigger: 'blur' }
                    ],
                    dateOfProduction: [
                        { required: true,type: 'date', message: '请填写出厂日期', trigger: 'blur' }
                    ],
                    dateOfReceipt: [
                        { required: true,type: 'date', message: '请填写进厂日期', trigger: 'blur' }
                    ],
                    invoiceType: [
                        { required: true,type: 'number', message: '请选择发票类型', trigger: 'blur' }
                    ],
                    invoiceNo: [
                        { required: true,type: 'string', message: '请填写发票编号', trigger: 'blur' }
                    ],
                    dateOfSubmitAcceptance: [
                        { required: true,type: 'date', message: '请选择交验日期', trigger: 'blur' }
                    ],
                    installationLocation: [
                        { required: true, message: '请选择安装地点', trigger: 'change' }
                    ],
                    transportationFee: [
                        { required: false, type: 'number', reg: /^[0-9]+(.[0-9]{2})?$/, message: '请输入正确的格式', trigger: 'change' }
                    ],
                    model: [
                        { required: true, message: '请填写规格型号', trigger: 'blur' }
                    ],
                    config: [
                        { required: true, message: '请填写基本配置', trigger: 'blur' }
                    ],
                    useLife: [
                        { required: true, type: 'number', message: '请填写预计使用年限', trigger: 'blur' }
                    ],
                    equipmentCode: [
                        { required: true, message: '请填写公司厂内设备编号', trigger: 'blur' }
                    ],
                    outerPackage: [
                        { required: true, message: '请填写外包装', trigger: 'blur' },
                        { message: '外包装不能超出200个字', trigger: 'change', max: 200 }
                    ],
                    equAppear: [
                        { required: true, message: '请填写设备外观', trigger: 'blur' },
                        { message: '设备外观不能超出200个字', trigger: 'change', max: 200 }
                    ],
                    freeRun: [
                        { required: true, message: '请填写空载表现', trigger: 'blur' },
                        { message: '空载表现不能超出200个字', trigger: 'change', max: 200 }
                    ],
                    loadRun: [
                        { required: true, message: '请填写满载表现', trigger: 'blur' },
                        { message: '满载表现不能超出200个字', trigger: 'change', max: 200 }
                    ],
                    equInstallQuality: [
                        { required: true, message: '请填写设备安装质量', trigger: 'blur' },
                        { message: '设备安装质量不能超出200个字', trigger: 'change', max: 200 }
                    ]
                },
                invoiceTypeArr: [],
                submitTime: '',
                receiptTime: '',
                productTime: '',
                //随机物品类型
                typeArr: [],
                isShow: false,
                attachmentFile: [],
                surePersonSelected: '',
                personIndex: 0,
                person_mod: false,
                personSelected: {},
                /*采购合同相关*/
                contractCols: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 80,
                        align: 'center'
                    },
                    {
                        title: '合同编码',
                        key: 'contractCode',
                        align: 'center'
                    },
                    {
                        title: '合同名称',
                        key: 'contractName',
                        align: 'center'
                    }
                ],
                contractData: [],
                pageTotal: 0,
                page: 1,
                pageSize: 10,
                //审核记录
                scrapApplyStatus:'',
                feedbackDate:"",
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
                canEdit: false,
                editAble: true,
                saveAble: false,
                created: false,
                pageTitle: '',
                pageStatus: '',
                thePageId: '',
                pageFrom: '',
                //单位
                uomIndex: 0,
                uom_model: false,
                uomSelected: {},
                //地点
                equSite_mod: false,
                selectSite: {
                    title: '',
                    id: ''
                },
                //错误提示
                faultTip1: '',
                faultTip2: '',
                faultTip3: '',
            };
        },
        activated: function () {
            this.created && this.loadAcceptDetail();
            this.created = true;
        },
        mounted(){
            this.invoiceTypeArr = this.$base_info.tEamEquipmentInvoiceTypeEnum;
            this.typeArr = this.$base_info.tEamAttachmentTypeEnum;

            this.thePageId = this.$route.query.id;
            this.scrapForm.acceptanceFormId = this.thePageId;
            this.pageStatus = this.$route.query.status;
            this.scrapApplyStatus = this.$base_info.getDescByCode(parseInt(this.pageStatus), this.$base_info.tEamEquipmentPurchaseApplicationFromStatusEnum);
            this.pageTitle = this.$base_info.getDescByCode(parseInt(this.pageStatus), this.$base_info.tEamEquipmentPurchaseApplicationFromStatusEnum);

//            let statusCode = this.$base_info.getCodeByDesc(this.pageStatus, this.$base_info.tEamEquipmentPurchaseApplicationFromStatusEnum);
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
            //判断页面来源：
            if (this.pageStatus == 0 || this.pageStatus == 3) {
                this.editAble = true;
                this.canEdit = true;
            }
            this.loadAcceptDetail();
            this.getContract();
            this.getAuditRecords();
        },
        computed: {
            newTypeArr() {
                return this.typeArr.filter(item => item.code>-1)
            },
            newInvoiceTypeArr() {
                return this.invoiceTypeArr.filter(item => item.code>-1)
            }
        },
        components: {
            'personSingle': personSingle,
            'PandoraUpload': PandoraUpload,
            'uomSelect': uomSelect,
            'tree_equSite': tree_equSite
        },
        methods: {
            editFun(){
                this.canEdit = false;
                this.editAble = false;
                this.saveAble = true;
            },
            //设备验收详情渲染
            loadAcceptDetail(){
                let vm = this;
//                console.log('id === '+vm.thePageId)
                this.$axios.post('/equipmentApplication/acceptanceDetail', {
                    acceptanceFormId: vm.thePageId
                }).then((res) => {
                    let result = res.data.response;
//                    console.log('id === '+vm.thePageId)
                    console.log("详情渲染 + ===  " + JSON.stringify(result))
                    if (result.code === 1) {
                        vm.scrapForm = result.data;
                        vm.scrapForm.attach = result.data.attach;
                        vm.scrapForm.acceptanceFormId = result.data.acceptanceFormId;
                        vm.submitTime=vm.scrapForm.dateOfSubmitAcceptance;
                        vm.receiptTime=vm.scrapForm.dateOfReceipt;
                        vm.productTime=vm.scrapForm.dateOfProduction;
                        vm.selectSite.title = vm.scrapForm.installationLocation;
                        vm.selectSite.id = vm.scrapForm.installationLocationId;
                        vm.docTypeCode = result.data.billNo;
                        vm.imgAddr = result.data.barCode;
//                        console.log('vm.imgAddr==== '+vm.imgAddr)
                    } else {
                        //.. 业务失败的情况
                        this.$Message.error({
                            content: '数据返回错误',
                            duration: 5,
                            closable: true
                        });
                    }
                }).catch((err) => {
                    console.log("无数据 + " + err);
                });
            },
            //合同相关
            getContract() {
                this.$axios.post('/equipmentApplication/getContractByAcceptId', {
                    page: this.page,
                    pageSize: this.pageSize,
                    acceptanceFormId: this.thePageId
                }).then((res) => {
                    let ret = res.data.response;
                    if (ret.code == 1) {
                        this.contractData = ret.data.rows;
                        this.pageTotal = ret.data.total;
                    } else {
                        this.$Message.error(ret.msg);
                    }
                }).catch((err) => {
                    console.log(err);
                })
            },
            pageSearchInfo(curPage) {
                this.page = curPage;
                this.getContract();
            },
            //打开地点弹框
            openSiteMode() {
                if (!this.editAble) {
                    this.equSite_mod = true;
                }
            },
            siteSelected(msg) {
                this.selectSite = msg;
            },
            //地点确定按钮：
            toSelect_equSite(){
                this.scrapForm.installationLocation = this.selectSite.title;
                this.scrapForm.installationLocationId = this.selectSite.id;
            },
            //删除地点
            deleteSite(){
                this.selectSite = null;
                this.scrapForm.installationLocation = '';
                this.scrapForm.installationLocationId = '';
            },
            //添加人相关
            toOpenPerson(index){
                if (!this.editAble) {
                    this.person_mod = true;
                    this.personIndex = index;
                }
            },
            hasSelected_person(msg){
                this.personSelected = msg;
            },
            toSelectPerson(){
                this.scrapForm.attach[this.personIndex].keeper = this.personSelected.personName;
                this.scrapForm.attach[this.personIndex].keeperId = this.personSelected.personId;
            },
            //添加单位相关
            toOpenUom(index) {
                if (!this.editAble) {
                    this.uom_model = true;
                    this.uomIndex = index;
                }
            },
            hasSelected_uom(msg) {
                this.uomSelected = msg;
            },
            toSelectUom() {
                this.scrapForm.attach[this.uomIndex].attachmentQuantityUnit = this.uomSelected.uomName;
                this.scrapForm.attach[this.uomIndex].attachmentQuantityUnitId = this.uomSelected.uomId;
            },
            //添加功率单位
            toOpenPowerUom(index) {
                if (!this.editAble) {
                    this.powerUom_model = true;
                    this.powerIndex = index;
                }
            },
            hasSelected_powerUom(msg) {
                this.powerUomSelected = msg;
            },
            toSelectPowerUom() {
                this.scrapForm.attach[this.powerIndex].powerUnit = this.powerUomSelected.uomName;
                this.scrapForm.attach[this.powerIndex].powerUnitId = this.powerUomSelected.uomId;
            },
            //添加行
            addNewTr() {
                this.scrapForm.attach.push(
                    {
                        acceptanceFormId: "",
                        attachmentName: "",
                        attachmentQuantity: "",
                        attachmentQuantityUnit: '',
                        attachmentQuantityUnitId: "",
                        attachmentType: "",
                        model: '',
                        power: '',
                        powerUnit: '',
                        powerUnitId: '',
                        keeper: "",
                        keeperId: "",
                        note: "",
                        files: []
                    }
                )
            },
            //删除行
            deleteItem(idx) {
                this.scrapForm.attach.splice(idx,1);
            },
            //文件上传
            upfile(index){
                this.fileIndex = index;
            },
            upSuccessFile(name,path) {
                this.attachmentFile = [];
                this.attachmentFile = this.scrapForm.attach[this.fileIndex].files;
                this.attachmentFile.push({ fileName: name,savePath: path });
                this.scrapForm.attach[this.fileIndex].files = this.attachmentFile;
            },
            //文件预览
            toSee(index,index2){
                window.open('../static/' + this.scrapForm.attach[index].files[index2].savePath)
            },
            //文件删除
            toDel(index,index2){
                this.scrapForm.attach[index].files.splice(index2,1);
            },
            //保存
            save(name) {
                let vt = this;
                this.$refs[name].validate((valid) => {
                    let tpm = vt.scrapForm.attach;
                    let newAttArr = [];
                    let ruleS = true;
                    //键盘空格键判断
                    let re = /^[ ]+$/;
                    if(!valid) {
                        vt.$Message.error('请完善信息');
                    } else if (this.faultTip1 != ''){
                        vt.$Message.error(this.faultTip1);
                    } else if (this.faultTip2 != ''){
                        vt.$Message.error(this.faultTip2);
                    } else if (this.faultTip3 != ''){
                        vt.$Message.error(this.faultTip3);
                    } else if (tpm.length == 0) {
                        this.$Message.error('请添加随机物品信息');
                    }else if (tpm.length > 10) {
                        this.$Message.error('最多只能添加10条随机物品信息');
                    } else if (tpm.length > 0) {
                        for (let i in tpm) {
                            if (tpm[i].attachmentName == '' || re.test(tpm[i].attachmentName) || tpm[i].attachmentName == undefined) {
                                vt.$Message.error('请完善随机物品信息');
                                ruleS = false;
                            } else if (tpm[i].attachmentType === '') {
                                vt.$Message.error('请完善随机物品信息');
                                ruleS = false;
                            } else if (tpm[i].attachmentQuantity == null || (tpm[i].attachmentQuantity != null&& !Number.isInteger( Number(tpm[i].attachmentQuantity))) ||(tpm[i].attachmentQuantity != null&&tpm[i].attachmentQuantity<=0 )) {
                                vt.$Message.error('随机物品数量请输入大于0的正整数');
                                ruleS = false;
                            } else if (tpm[i].keeper == '' || tpm[i].keeper == undefined) {
                                vt.$Message.error('请完善随机物品信息');
                                ruleS = false;
                            } else if (tpm[i].attachmentQuantityUnit == '' || tpm[i].attachmentQuantityUnit == undefined) {
                                vt.$Message.error('请完善随机物品信息');
                                ruleS = false;
                            } else if ((tpm[i].attachmentType === 2 && tpm[i].model == '') || (tpm[i].attachmentType === 2 && tpm[i].model == undefined)) {
                                vt.$Message.error('请完善随机物品信息');
                                ruleS = false;
                            } else if ((tpm[i].attachmentType === 2 && tpm[i].power == '') || (tpm[i].attachmentType === 2 && tpm[i].power == undefined)) {
                                vt.$Message.error('请完善随机物品信息');
                                ruleS = false;
                            } else if ((tpm[i].attachmentType === 2 && tpm[i].powerUnit == '') || (tpm[i].attachmentType === 2 && tpm[i].powerUnit == undefined)) {
                                vt.$Message.error('请完善随机物品信息');
                                ruleS = false;
                            } else {
                                ruleS = true;
                                newAttArr.push(
                                    {
                                        acceptanceFormId: vt.thePageId,
                                        attachmentName: tpm[i].attachmentName,
                                        attachmentQuantity: parseInt(tpm[i].attachmentQuantity),
                                        attachmentQuantityUnitId: tpm[i].attachmentQuantityUnitId,
                                        attachmentType: tpm[i].attachmentType,
                                        keeper: tpm[i].keeperId,
                                        note: tpm[i].note,
                                        model: tpm[i].model ? tpm[i].model : '',
                                        power: tpm[i].power ? tpm[i].power : '',
                                        powerUnit: tpm[i].powerUnit ? tpm[i].powerUnit : '',
                                        powerUnitId: tpm[i].powerUnitId ? tpm[i].powerUnitId : '',
                                        files: tpm[i].files
                                    }
                                )
                            }
                        }
                        let saveAry = {
                            acceptanceFormId: vt.thePageId,
                            dateOfProduction: vt.productTime,
                            dateOfReceipt: vt.receiptTime,
                            dateOfSubmitAcceptance: vt.submitTime,
                            installationFee: vt.scrapForm.installationFee,
                            installationLocationId: vt.scrapForm.installationLocationId,
//                            installationLocationId: vt.selectSite.id,
                            invoiceNo: vt.scrapForm.invoiceNo,
                            invoiceType: vt.scrapForm.invoiceType,
//                            invoiceType: vt.$base_info.getCodeByDesc(vt.scrapForm.invoiceType, vt.$base_info.tEamEquipmentInvoiceTypeEnum),
                            manufacturerEquipmentCode: vt.scrapForm.manufacturerEquipmentCode,
                            purchasePrice: vt.scrapForm.purchasePrice,
                            transportationFee: vt.scrapForm.transportationFee,
                            config: vt.scrapForm.config,
                            equAppear: vt.scrapForm.equAppear,
                            equInstallQuality: vt.scrapForm.equInstallQuality,
                            equipmentCode: vt.scrapForm.equipmentCode,
                            freeRun: vt.scrapForm.freeRun,
                            loadRun: vt.scrapForm.loadRun,
                            outerPackage: vt.scrapForm.outerPackage,
                            useLife: vt.scrapForm.useLife,
                            attachments: newAttArr
                        };
//                        console.log('保存之后 ==== ')
//                        console.log(JSON.stringify(saveAry))
                        if ((newAttArr.length != 0) && ruleS) {
                            vt.$axios.post('/equipmentApplication/acceptanceSave',saveAry).then((res) => {
//                                console.log('保存res === '+JSON.stringify(res))
                                if(res.data.response.code == 1) {
                                    vt.loading = true;
                                    vt.$Message.success(res.data.response.data);
                                    vt.$router.back();
                                } else {
                                    vt.$Message.error(res.data.response.msg);
                                }
                            }).catch((err) => {
                                console.log(err);
                            })
                        }
                    }

                })
            },
            //提交OA审核
            toAudit() {
                this.$axios.post('/eam/submit_equipment_acceptance', {
                    acceptanceFormId: this.thePageId
                }).then((res) => {
                    if(res.data.response.code == 1) {
                        this.OALoading = true;
                        this.$Message.success(res.data.response.data);
                        this.$router.back();
                    } else {
                        this.$Message.error(res.data.response.msg);
                    }
                }).catch((err) => {
                    console.log(err)
                })
            },
            //返回上一页
            backHandle() {
                this.$router.back();
            },
            changeProDate(date) {
                this.productTime = date;
            },
            changeRecDate(date) {
                this.receiptTime = date;
            },
            changeSubDate(date) {
                this.submitTime = date;
            },
            checkNum1(val) {
                if (!val) {
                    this.faultTip1 = "";
                }
                else {
                    if ((!isNaN(val)) && (val > 0)) {
                        if (val.indexOf('.') != -1 && val.length > 9) {
                            this.$Message.error('运输费超过规定字符长度');
                            this.faultTip1 = '运输费超过规定字符长度';
                            return;
                        } else if (val.indexOf('.') == -1 && val.length > 4) {
                            this.$Message.error('运输费为小于10000的数字');
                            this.faultTip1 = '运输费为小于10000的数字';
                            return;
                        }
                        this.faultTip1 = "";
                    }
                    else {
                        this.$Message.error('运输费为大于0的数字');
                        this.faultTip1 = "运输费大于0的数字";
                    }
                }
            },
            checkNum2(val) {
                if (!val) {
                    this.faultTip2 = "";
                }
                else {
                    if ((!isNaN(val)) && (val > 0)) {
                        if (val.indexOf('.') != -1 && val.length > 9) {
                            this.$Message.error('设备总值超过规定字符长度');
                            this.faultTip2 = '设备总值超过规定字符长度';
                            return;
                        } else if (val.indexOf('.') == -1 && val.length > 4) {
                            this.$Message.error('设备总值为小于10000的数字');
                            this.faultTip2 = '设备总值为小于10000的数字';
                            return;
                        }
                        this.faultTip2 = "";
                    }
                    else {
                        this.$Message.error('设备总值为大于0的数字');
                        this.faultTip2 = "设备总值大于0的数字";
                    }
                }
            },
            checkNum3(val) {
                if (!val) {
                    this.faultTip3 = "";
                }
                else {
                    if ((!isNaN(val)) && (val > 0)) {
                        if (val.indexOf('.') != -1 && val.length > 9) {
                            this.$Message.error('安装费超过规定字符长度');
                            this.faultTip3 = '安装费超过规定字符长度';
                            return;
                        }else if (val.indexOf('.') == -1 && val.length > 4) {
                            this.$Message.error('安装费为小于10000的数字');
                            this.faultTip3 = '安装费为小于10000的数字';
                            return;
                        }
                        this.faultTip3 = "";
                    }
                    else {
                        this.$Message.error('安装费为大于0的数字');
                        this.faultTip3 = "安装费大于0的数字";
                    }
                }
            },

            //设备单据审批历史记录
            getAuditRecords() {
                this.$axios.post('equipmentApplication/equApprovalHistory', {
                    page: this.curPage,
                    pageSize: this.pageSizeScrap,
                    billId: this.thePageId
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
                            this.feedbackDate = this.scrapData[0].processTime;
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
                this.curPage = cur;
                this.getAuditRecords();
            }
        }
    };
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
    .pro{
        display: inline-block;
        margin-right: 4px;
        line-height: 1;
        font-family: SimSun;
        font-size: 14px;
        color: #ed3f14;
        /*width: 20px;*/
        position: absolute;
        left: 5px;
        top: 15px;
    }
    .deleteTab.ml40 {
        margin-left:40px;
    }
    .wid200 {
        display: inline-block;
        overflow: hidden;
        width: 200px;
        font-size: 16px;
        text-overflow: ellipsis;
        white-space: nowrap;
        vertical-align: middle;
    }
</style>
