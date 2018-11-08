<template>
    <div style="position:relative;" class="basic bzzy-search">
        <!--模块名称-->
        <div class="title">
            <span>设备改造 -- {{editAbleTitle}}</span>
        </div>
        <div class="progressContent">
            <div class="second-title">审核进度</div>
            <Steps :current="stepVal" class="mar-b-20 pad-lr-15">
                <Step title="提交改造申请" content=""></Step>
                <Step title="OA审核中" content=""></Step>
                <Step v-if="reformForm.status  != 4" title="系统归档" content=""></Step>
                <Step v-if="reformForm.status  == 4" title="申请终止" content=""></Step>
                <Step v-if="reformForm.status  != 4" title="设备资料更新" content=""></Step>
            </Steps>
        </div>
        <!--表单-->
        <div class="titleLogo"><img style="width: 100%;height: 100%;" :src="logoSrc"></div>
        <div v-show="editFlag != 1" style="overflow: hidden;">
            <h3 class="f_l">设备改造单据号：</h3>
            <div class="f_l text-center">
                <img :src="'/static'+ imgAddr" alt="" height="50" width="300">
                <div>{{reformForm.billNo}}</div>
            </div>
        </div>
        <div class="form-content">
            <Form ref="reformForm" :model="reformForm" :label-width="120" inline :rules="ruleReformForm" >
                <Row>
                    <Col :span="3">
                    <Carousel v-if="uploadImagesAry.length>0">
                        <CarouselItem v-for="(imageItem,ind) in uploadImagesAry" :key="ind" >
                            <div class="demo-carousel">
                                <div class="demo-upload-list" style="border: 1px solid #ccc;width: 140px;height: 140px;margin: auto;display: flex;">
                                    <img :src=" '../static/'+ imageItem"  style="width:100%;object-fit: cover;">
                                </div>
                            </div>
                        </CarouselItem>
                    </Carousel>
                    <p v-show="uploadImagesAry.length==0" style="border: 1px solid #ccc;width: 140px;height: 140px;margin: auto;">暂无图片！</p>
                    </Col>
                    <Col :span="18">
                    <!--<FormItem label="申请单号" prop="billNo">
                        <Input v-model="reformForm.billNo" disabled></Input>
                    </FormItem>-->
                    <FormItem label="设备名称" prop="equipmentName">
                        <!--<Input v-model="reformForm.equipmentName" readonly v-show="editAble" disabled></Input>-->
                        <div style="color:#FFFFFF" onmousemove="this.style.color='#5b5b5b';" onmouseout="this.style.color='#ffffff'">
                            <div :title="reformForm.equipmentName" style="position: relative;">
                                <Icon type="ios-close" class="deleteTab" @click.native="emptyEqu" v-show="!editAble"></Icon>
                                <Input v-model="reformForm.equipmentName" style="width: 160px;" readonly :disabled="editAble" :autofocus="typeFocus">
                                <Button slot="append" size="small" icon="ios-search" @click="openEquName" :disabled="editAble"></Button>
                                </Input>
                            </div>
                        </div>
                    </FormItem>
                    <FormItem label="规格型号" prop="equipmentModel">
                        <Input v-model="reformForm.equipmentModel" placeholder="" disabled></Input>
                    </FormItem>
                    <FormItem label="设备编号" prop="equipmentCode">
                        <Input v-model="reformForm.equipmentCode" placeholder="" disabled></Input>
                    </FormItem>
                    <FormItem label="安装地点" prop="location">
                        <Input v-model="reformForm.location" placeholder="" disabled></Input>
                    </FormItem>
                    <FormItem label="制造厂家" prop="manufacturer">
                        <Input v-model="reformForm.manufacturer" disabled ></Input>
                    </FormItem>
                    <FormItem label="设备原用途和功能" prop="usedFor">
                        <Input v-model="reformForm.usedFor" placeholder="" disabled></Input>
                    </FormItem>
                    <FormItem label="改造原因及改造后达到目的" prop="reasonAndobj">
                        <Input v-model="reformForm.reasonAndobj" placeholder="" :disabled="editAble" ></Input>
                    </FormItem>
                    <FormItem label="改造方案" prop="solution">
                        <Input v-model="reformForm.solution" placeholder="" :disabled="editAble"></Input>
                    </FormItem>
                    <FormItem label="使用部门" prop="userDepartment">
                        <Input v-model="reformForm.userDepartment" placeholder="" disabled></Input>
                    </FormItem>
                    <FormItem label="状态" prop="status" v-show="editFlag != 1">
                        <Input v-model="reformForm.status" placeholder="" disabled></Input>
                    </FormItem>
                   <!-- <FormItem label="随机文书" prop="randomDoc">
                        <Input v-model="reformForm.randomDoc" placeholder="" ></Input>
                    </FormItem>
                    <FormItem label="" prop="randomDoc">
                        <Upload action="//jsonplaceholder.typicode.com/posts/">
                            <Button icon="ios-cloud-upload-outline">上传文件</Button>
                        </Upload>
                    </FormItem>
                    <FormItem label="随机文书保管者" prop="randomDoc">
                        <Input v-model="reformForm.randomDoc" placeholder="" ></Input>
                    </FormItem>-->
                    <FormItem label="编制人" prop="applier">
                        <Input v-model="reformForm.applier" placeholder="" disabled ></Input>
                    </FormItem>
                    <FormItem label="改造日期" prop="planTime" >
                        <DatePicker v-model="reformForm.planTime" type="date" :options="beforeDis" placeholder="选择日期和时间"style="width: 163px"  :disabled="editAble" @on-change="returnTime":editable = "false"></DatePicker>
                    </FormItem>
                    </Col>
                    <Col :span="3">
                        <img v-if="qrCode!=''" :src=" '../static/'+ qrCode" style="width: 140px;height: 140px;object-fit: cover;">
                    </Col>
                </Row>
                <Row>
                    <Col>
                    <div class="second-title">随机物品</div>
                    <Table stripe border :columns="reformColumns" :data="reformData"></Table>
                    </Col>
                </Row>
            </Form>
        </div>
        <div v-if="0" class="form-content">
            <Form ref="reformForm" :model="reformForm" :label-width="100">
                <Row>
                    <Col :span="16">
                    <FormItem label="审批意见" prop="approvalOpinion">
                        <Input v-model="reformForm.approvalOpinion" placeholder="" ></Input>
                    </FormItem>
                    </Col>
                    <Col :span="4">
                    <FormItem label="审批人" prop="approver">
                        <Input v-model="reformForm.approver" placeholder="" ></Input>
                    </FormItem>
                    </Col>
                    <Col :span="4">
                    <FormItem label="日期" prop="approverTime">
                        <DatePicker v-model="reformForm.approverTime" type="date" placeholder="选择日期和时间"></DatePicker>
                    </FormItem>
                    </Col>
                </Row>
            </Form>
        </div>
        <div v-if="0" class="form-content">
            <Form ref="reformForm" :model="reformForm" :label-width="100">
                <Row>
                    <Col :span="16">
                    <FormItem label="实施情况" prop="implementSituation">
                        <Input v-model="reformForm.implementSituation" placeholder="" ></Input>
                    </FormItem>
                    </Col>
                    <Col :span="4">
                    <FormItem label="实施人" prop="implementMan">
                        <Input v-model="reformForm.implementMan" placeholder="" ></Input>
                    </FormItem>
                    </Col>
                    <Col :span="4">
                    <FormItem label="日期" prop="implementTime">
                        <DatePicker v-model="reformForm.implementTime" type="date" placeholder="选择日期和时间"></DatePicker>
                    </FormItem>
                    </Col>
                </Row>
            </Form>
        </div>
        <div v-if="0" class="form-content">
            <Form ref="reformForm" :model="reformForm" :label-width="100">
                <Row>
                    <Col :span="16">
                    <FormItem label="改造后验收情况" prop="checkAndAccept">
                        <Input v-model="reformForm.checkAndAccept" placeholder="" ></Input>
                    </FormItem>
                    </Col>
                    <Col :span="4">
                    <FormItem label="验收人" prop="acceptor">
                        <Input v-model="reformForm.acceptor" placeholder="" ></Input>
                    </FormItem>
                    </Col>
                    <Col :span="4">
                    <FormItem label="日期" prop="checkTime">
                        <DatePicker v-model="reformForm.checkTime" type="date" placeholder="选择日期和时间"></DatePicker>
                    </FormItem>
                    </Col>
                </Row>
            </Form>
        </div>

        <!--审核记录-->
        <applyHistory :page="pageApplyHis" :pageSize="pageSizeApplyHis" :billId="billIdApplyHis"></applyHistory>
        <!--保存按钮-->
        <div align="center" class="btnGroupDesign">
            <Button type="primary" icon="compose" size="large" @click="editFun" v-if="editAble && rule_edit" v-show="reformForm.status == '已制单' || reformForm.status == 'OA审核驳回'">编辑</Button>
            <Button type="primary" icon="document-text" size="large" :loading="loading" v-if="rule_save" @click="reformSave('reformForm')" v-show="!editAble">保存</Button>
            <Button type="primary" icon="document-text" size="large" v-if="editAble && rule_apply" :loading="OALoading" @click="reformOAAudit" v-show="reformForm.status == '已制单'|| reformForm.status == 'OA审核驳回'">提交OA审核</Button>
            <Button  class="btn-gary" size="large" @click="backHandle">返回</Button>
        </div>
        <Modal v-model="equ_name" title="设备名称" @on-ok="toSelect_equName">
            <equ_nameSelect @nameSelected="name_hasSelected"></equ_nameSelect>
        </Modal>

    </div>
</template>

<script type="text/ecmascript-6">
    import equ_nameSelect from '../treeMulitiple/equ_nameSelect.vue';
    import department from '../treeMulitiple/department.vue';
    import applyHistory from '../ledger/applyHistory.vue';

    export default{
        props: {},
        data(){
            return {
                rule_save:this.$rt(this.authJson.EAM.设备台账.设备改造编辑页.保存),
                rule_apply:this.$rt(this.authJson.EAM.设备台账.设备改造详情页.提交OA审核),
                rule_edit:this.$rt(this.authJson.EAM.设备台账.设备改造详情页.编辑),
                /* **** editFlag 编辑 2、查看 0 、新建 1  - S - ***** */
                editAble:'',
                editFlag:'',
                openDate:false,
                reformId:'',
                stepVal:0,
                loading:false,
                OALoading:false,
                editAbleTitle:'',
                approvalStatus:'',//状态
                /* **** 编辑、查看、新建  - E - ***** */

                parentType: '', //父级路由type
                logoSrc:"../../static/img/ch_logo.jpg",
                docTypeCode:'P015E',
                pageTitle:'',
                listStatus:'',
                /*设备图片*/
                uploadImagesAry:[],
                /*设备二维码*/
                qrCode:'',

                imgAddr: '',
                /*审核记录 - S - */
                /*审核记录 - S - */
                pageApplyHis:1,
                pageSizeApplyHis:5,
                billIdApplyHis:'',
                /*审核记录 - E - */
                /*随机物品 - S - */
                reformColumns:[
                    {
                        title: '序号',
                        type: 'index',
                        width: 80,
                        align: 'center'
                    },
                    {
                        title: '随机物品名称',
                        key: 'attachmentName',
                        align: 'center',
                        render: (h, params) => {
                            return h('p', {
                                domProps: {
                                    title: params.row.attachmentName
                                },
                                class: 'iview_tabDis',
                            }, params.row.attachmentName)
                        },
                    },
                    {
                        title: '随机物品类型',
                        key: 'attachmentType',
                        align: 'center',
                        render: (h, params) => {
                            return h('p', {
                                domProps: {
                                    title: params.row.attachmentType
                                }
                            }, params.row.attachmentType)
                        }
                    },
                    {
                        title: '随机物品数量',
                        key: 'attachmentQuantity',
                        align: 'center',
                        render: (h, params) => {
                            return h('p', {
                                domProps: {
                                    title: params.row.attachmentQuantity
                                },
                                class: 'iview_tabDis',
                            }, params.row.attachmentQuantity)
                        },
                    },
                    {
                        title: '数量单位',
                        key: 'attachmentQuantityUnit',
                        align: 'center',
                        render: (h, params) => {
                            return h('p', {
                                domProps: {
                                    title: params.row.attachmentQuantityUnit
                                },
//                                class: 'iview_tab_numDis',
                            }, params.row.attachmentQuantityUnit)
                        },
                    },
                    {
                        title: '保管人',
                        key: 'keeper',
                        align: 'center',
                    },
                    {
                        title: '附件',
                        key: 'attachment',
                        align: 'center',
                        render: (h, params) => {
                            let filesItem = [];
                            if(params.row.files != undefined){
                                for(let i=0;i<params.row.files.length;i++){
                                    filesItem.push(
                                        h("div",[
                                            h('div',{
                                                class:'',
                                                domProps:{
                                                    style:'width:60%;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;margin-right:10px'
                                                }
                                            },params.row.files[i].fileName),
                                            h('a',{
                                                domProps:{
                                                    href:"../static/" + params.row.files[i].savePath,
                                                    target:"_blank",
                                                }
                                            },"查看"),
                                        ])
                                    );
                                }

                            }
                            return h('div', filesItem)
                        },
                    },
                    /*{
                        title: '备注',
                        key: 'remarks',
                        align: 'center'
                    },*/
                ],
                reformData:[],
                /*随机物品 - E - */
                reformForm:{
                    billNo:'',
                    equipmentName: '',
                    equipmentModel: '',
                    equipmentCode: '',
                    equipmentId:'',
                    usedFor:'',
                    manufacturer:'',
                    reasonAndobj:'',
                    solution:'',
                    randomDoc:'',
                    compactorSign:"",
                    compactorTime:"",
                    location:'',
                    userDepartment:'',
                    status:'',
                    planTime:'',
                   /* approvalOpinion:"审批意见",
                    approver:"审批人",
                    approverTime:"2018-07-31",

                    implementSituation:"实施情况",
                    implementMan:"实施人" ,
                    implementTime:"2018-07-31" ,

                    checkAndAccept:"改造后验收情况",
                    acceptor:"验收人",
                    checkTime:"2018-07-31" ,*/

                },
                planTimeFor:'',//时间组件验证Onchange冲突
                ruleReformForm: {
                    equipmentName: [
                        { required: true, message: '请选择设备', trigger: 'blur' }
                    ],
                    solution: [
                        { required: true, message: '请填写信息', trigger: 'blur' }
                    ],
                    reasonAndobj: [
                        { required: true, message: '请填写信息', trigger: 'blur' }
                    ],
                    planTime: [
                        { required: true,type:'date', message: '请选择改造日期', trigger: 'blur'}
                    ],
                },
                beforeDis:{
                    disabledDate (date) {
                        return date && date.valueOf() < Date.now() - 86400000;
                    }
                },
                /*设备名称选择带回数组*/
                equInfo:{},
                /*设备名称选择带回数组*/

                /*设备选择*/
                equ_name:false,
                typeFocus:false,

            };
        },
        components: {
            'equ_nameSelect': equ_nameSelect,
            'department': department,
            'applyHistory': applyHistory,
        },
        mounted(){
            this.reformId = this.$route.query.reformId;
            this.billIdApplyHis = this.$route.query.reformId;
            this.editFlag = this.$route.query.editFlag;
            this.listStatus = this.$route.query.listStatus;
            this.pageTitle = this.$base_info.getDescByCode(this.$route.query.listStatus,this.$base_info.tEamEquipmentPurchaseApplicationFromStatusEnum)
            if(this.editFlag== 1){
                this.editAbleTitle = "新建";
                this.editAble = false;
            }else if(this.editFlag== 0){
                this.editAbleTitle = "详情";
                this.editAble = true;
                this.reformLoad();
            }else if(this.editFlag== 2){
                this.editAbleTitle = "编辑";
                this.editAble = false;
                this.reformLoad();
            }
        },
        methods: {
            editFun(){
                this.editAble = false;
            },
            backHandle() {
                this.$router.push({path: '/equReformList', query: {type: this.listStatus}});
            },
            reformLoad(){
                let vm = this;
                this.$axios.post('/equipmentApplication/equTransformationDetail', {
                    id :vm.reformId
                }).then((res) => {
                    let respone = res.data.response;
                    if (respone.code  === 1) {
                        vm.reformForm = respone.data;
                        vm.imgAddr = respone.data.barCode;
                        this.planTimeFor = vm.reformForm.planTime;
//                        console.log("respone.data +" + JSON.stringify(respone.data))
                        if(vm.reformForm.status == 0 || vm.reformForm.status == 3){
                            vm.stepVal = 0;
                        }else if(vm.reformForm.status == 1){
                            vm.stepVal = 1
                        }else if(vm.reformForm.status == 2 || vm.reformForm.status == 5 || vm.reformForm.status == 4){
                            vm.stepVal = 2
                        }else if(vm.reformForm.status == 6 ){
                            vm.stepVal = 3
                        }
                        vm.approvalStatus = vm.reformForm.status;
                        vm.reformForm.status = vm.$base_info.getDescByCode(vm.reformForm.status, vm.$base_info.tEamEquipmentPurchaseApplicationFromStatusEnum);
                        vm.reformData = respone.data.attach;
                        vm.uploadImagesAry = respone.data.picUrl;
                        respone.data.qrCode != undefined ? vm.qrCode = respone.data.qrCode:vm.qrCode ="";
                        for(let i = 0;i<vm.reformData.length;i++){
                            vm.reformData[i].attachmentType = vm.$base_info.getDescByCode(vm.reformData[i].attachmentType,this.$base_info.tEamAttachmentTypeEnum);
                        }
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
            /*设备名称*/
            openEquName() {
                this.equ_name = true;
            },
            toSelect_equName() {
                let vm = this;
                this.$axios.post('/equipmentApplication/equRelationInfo', {
                    equipmentId :vm.equInfo.equipmentId
                }).then((res) => {
                    let respone = res.data.response;
                    let billNo = vm.reformForm.billNo;
                    if (respone.code  === 1) {
                        vm.reformForm = respone.data;
                        vm.reformForm.equipmentId = vm.equInfo.equipmentId;
                        vm.reformForm.billNo = billNo;
                        vm.reformData = respone.data.attach;
                        vm.uploadImagesAry = respone.data.picUrl;
                        vm.qrCode = respone.data.qrCode != undefined ? respone.data.qrCode:"";
                        vm.typeFocus = true;
                        for(let i = 0;i<vm.reformData.length;i++){
                            vm.reformData[i].attachmentType = vm.$base_info.getDescByCode(vm.reformData[i].attachmentType,this.$base_info.tEamAttachmentTypeEnum);
                        }
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
            name_hasSelected(msg) {
                this.equInfo = msg;
                this.typeFocus = false;
            },
            emptyEqu(){
                this.reformForm.equipmentName= '';
                this.reformForm.equipmentModel= '';
                this.reformForm.equipmentCode= '';
                this.reformForm.equipmentId='';
                this.reformForm.usedFor='';
                this.reformForm.manufacturer='';
                this.reformForm.location='';
                this.reformForm.randomDoc='';
                this.reformForm.userDepartment='';
                this.reformForm.status='';
                this.reformData = [];
                this.uploadImagesAry = '';
                this.qrCode = '';
            },
            /*设备名称*/

            /*保存按钮 - S -*/
            /*改造时间*/
            returnTime(time){
                this.planTimeFor = time;
            },
            reformSave(name){
                let vm = this;
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        vm.loading = true;
                        this.$axios.post('/equipmentApplication/equTransEditSave', {
                            billNo:vm.reformForm.billNo,//设备改造单号
                            equipmentId:vm.reformForm.equipmentId,//设备id
                            reasonAndobj:vm.reformForm.reasonAndobj,//改造原因及改造后达到的目的
                            planTime:vm.planTimeFor,//改造日期
                            solution:vm.reformForm.solution,//改造方案
                        }).then((res) => {
                            let respone = res.data.response;
                            if (respone.code  === 1) {

                                this.$Message.success({
                                    content: respone.data,
                                    duration: 2,
                                    closable: true
                                });
                                this.$router.push({path: '/equReformList', query: {type: this.listStatus}});
                            } else {
                                //.. 业务失败的情况
                                vm.loading = false;
                                this.$Message.error({
                                    content: '数据返回错误',
                                    duration: 5,
                                    closable: true
                                });
                            }
                        }).catch((err) => {
                            vm.loading = false;
                            console.log("无数据 + " + err);
                        });
                    } else {
                        vm.$Message.error('请完善信息！');
                    }
                })

            },
            /*提交OA审核*/
            reformOAAudit(){
                let vm = this;
                vm.OALoading=true;
                this.$axios.post('/eam/submit_equipment_tranformation',{
                    id:vm.reformId
                }).then((res) => {
                    let respone = res.data.response;
                    if (respone.code === 1) {

                        vm.$Message.success("提交OA成功！");
                        this.$router.push({path: '/equReformList', query: {type: this.listStatus}});
                    } else {
                        vm.OALoading=false;
                        //.. 业务失败的情况
                        vm.$Message.error({
                            content: respone.msg,
                            duration: 5,
                            closable: true
                        });
                    }
                }).catch((err) => {
                    vm.OALoading=false;
                    console.log("无数据 + " + err);
                });
            },


            /*保存按钮 - E -*/
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
</style>