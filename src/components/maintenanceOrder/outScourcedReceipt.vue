<template>
    <div style="position:relative;" class="basic bzzy-change">
        <div class="title">
            <span>{{pageTitle}}</span>
        </div>
        <div class="titleLogo"><img style="width: 100%;height: 100%;" :src="logoSrc"></div>
        <div style="overflow: hidden;">
            <h3 class="f_l">委外维修验收单编号：</h3>
            <div class="f_l text-center">
                <img v-if="imgAddr!=''" :src="'/static'+ imgAddr" alt="" height="50" width="300">
                <div>{{docTypeCode}}</div>
            </div>
        </div>
        <div class="detailContent mar-t-15">
            <div>
                <div class="form-content">
                    <Form ref="workForm" inline :model="workForm" :label-width="100" class="equ_addForm">
                        <div class="second-title">委外维修验收信息</div>
                        <FormItem label="设备名称">
                            <Input v-model="workForm.equName" :title="workForm.equName" style="width: 160px;" disabled></Input>
                        </FormItem>
                        <Form-item label="规格型号">
                            <Input v-model="workForm.equModelName" style="width: 160px;" disabled></Input>
                        </Form-item>
                        <Form-item label="供应商">
                            <Input v-model="workForm.equManufacturerName" :title="workForm.equManufacturerName" style="width: 160px;" disabled></Input>
                        </Form-item>
                        <Form-item label="进厂时间">
                            <Input v-model="workForm.inFactoryTime" style="width: 160px;" disabled></Input>
                        </Form-item>
                        <FormItem label="使用单位">
                            <Input v-model="workForm.useDeptName" style="width: 160px;" disabled></Input>
                        </FormItem>
                        <FormItem label="设备存放地点">
                            <Input v-model="workForm.installationLocationName" style="width: 160px;" disabled></Input>
                        </FormItem>
                        <FormItem label="修理单位">
                            <Input v-model="workForm.repair_company" style="width: 160px;" disabled></Input>
                        </FormItem>
                        <FormItem label="修理日期">
                            <DatePicker v-model="workForm.repair_date" style="width: 160px;" type="date" placeholder="选择日期和时间" :open="false" disabled></DatePicker>
                        </FormItem>
                        <FormItem label="修理费用(万元)">
                            <Input v-model="workForm.repair_cost" style="width: 160px;" :disabled="editFlag==0" @on-change="toTestNum(workForm.repair_cost)"
                            :class="{shelterWord: !roleShow}"
                            ></Input>
                        </FormItem>
                        <FormItem label="发票类型">
                            <Input v-model="workForm.invoice_type" style="width: 160px;" disabled></Input>
                        </FormItem>
                        <FormItem label="发票编号">
                            <Input v-model="workForm.invoice_no" style="width: 160px;" disabled></Input>
                        </FormItem>
                        <div class="second-title">修理信息反馈</div>
                            <FormItem label="修理内容" class="textarea_design">
                                <Input v-model="workForm.commentByContent" :max="500" :maxlength="500"  type="textarea" disabled></Input>
                            </FormItem>
                            <FormItem label="采购部门负责人">
                                <Input v-model="workForm.approverByContent" style="width: 160px" placeholder="" disabled></Input>
                            </FormItem>
                            <FormItem label="日期">
                                <DatePicker v-model="workForm.approveDateByContent" type="date" style="width: 160px" :open="false" disabled></DatePicker>
                            </FormItem>
                        <div class="second-title">修理结果反馈</div>
                            <FormItem label="修理结果" class="textarea_design">
                                <Input v-model="workForm.commentByResult" :max="500" :maxlength="500"  type="textarea" disabled></Input>
                            </FormItem>
                            <FormItem label="使用部门负责人">
                                <Input v-model="workForm.approverByResult" placeholder="" style="width: 160px" disabled></Input>
                            </FormItem>
                            <FormItem label="日期">
                                <DatePicker v-model="workForm.approveDateResult" type="date" style="width: 160px" :open="false" disabled></DatePicker>
                            </FormItem>
                        <div class="second-title">验收意见反馈</div>
                            <FormItem label="验收意见" class="textarea_design">
                                <Input v-model="workForm.commentByAccept" :max="500" :maxlength="500"  type="textarea" disabled></Input>
                            </FormItem>
                            <FormItem label="设备部门主管">
                                <Input v-model="workForm.approverByAccept" placeholder="" style="width: 160px" disabled></Input>
                            </FormItem>
                            <FormItem label="日期">
                                <DatePicker v-model="workForm.approveDateByAccept" type="date" style="width: 160px" :open="false" disabled></DatePicker>
                            </FormItem>
                        <div class="second-title">领导意见反馈</div>
                            <FormItem label="领导意见" class="textarea_design">
                                <Input v-model="workForm.commentByLeader" :max="500" :maxlength="500"  type="textarea" disabled></Input>
                            </FormItem>
                            <FormItem label="部门主管">
                                <Input v-model="workForm.approverByLeader" placeholder="" style="width: 160px" disabled></Input>
                            </FormItem>
                            <FormItem label="日期">
                                <DatePicker v-model="workForm.approveDateByLeader" type="date" style="width: 160px" :open="false" disabled></DatePicker>
                            </FormItem>
                    </Form>
                </div>

                <!--操作按钮-->
                <div align="center" class="btnGroupDesign">
                    <Button type="primary" size="large" @click="backHandle">返回</Button>
                    <Button v-show="editFlag==1" type="primary" size="large" @click="save">保存</Button>
                </div>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import {baseUrl} from '../../api/http';
    export default{
        props: {},
        data(){
            return {
                baseUrl:baseUrl(),
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
                imgAddr: '',
                workForm:{
                    equName: '',
                    equModelName: '',
                    equModelId: '',
                    equManufacturerName: '',
                    equManufacturerId: '',
                    inFactoryTime: '',
                    useDeptId: '',
                    useDeptName: '',
                    installationLocationName: '',
                    repair_company: '',
                    repair_date: '',
                    repair_cost: '',
                    repair_cost_unit_id: '',
                    repair_cost_unit_Name: '',
                    invoice_type: '',
                    invoice_no: '',
                    commentByContent: '',
                    approverByContent: '',
                    approveDateByContent: '',
                    commentByResult: '',
                    approverByResult: '',
                    approveDateResult: '',
                    commentByAccept: '',
                    approverByAccept: '',
                    approveDateByAccept: '',
                    commentByLeader: '',
                    approverByLeader: '',
                    approveDateByLeader: ''
                },
                //设备地点相关
                equSite_mod: false,
                baseData: [],
                equ_site_obj: '',
                equSite_selected: "",
                equSite: "",
                equSiteId: '',
                editFlag: 0,
                faultTip: '',
                roleShow: false
            };
        },
        mounted() {
            let id = this.$route.query.id;
            this.editFlag = this.$route.query.flag;
            if (this.editFlag==1) {
                this.pageTitle = "设置委外金额";
            } else {
                this.pageTitle = "委外维修验收单详情";
            }
            /*  0：详情； 1：编辑*/
            this.billId = id;
            this.pageInit();
        },

        methods: {
            //页面渲染
            pageInit() {
                this.$axios.post('/eamDo/outRepairAcceptDetail', {
                    outRepairFormId: this.billId
                }).then((res) => {
                    let ret = res.data.response;
                    if (ret.code != 1 ) {
                        this.$Message.error(ret.msg);
                    } else {
                        //请求成功
                        this.workForm = ret.data;
                        this.imgAddr = ret.data.barCode;
                        this.docTypeCode = ret.data.billNo;
                        let roles = ret.data.roles;
                        if (roles.join().indexOf('设备管理员')!=-1 || roles.join().indexOf('设备科长')!=-1) {
                            this.roleShow = true;
                        } else {
                            this.roleShow = false;
                        }
                    }
                }).catch((err) => {
                    console.log(err);
                })
            },
            //返回上一页
            backHandle() {
                this.$router.back();
            },
            //验证是否是正整数
            toTestNum(val) {
                if (!val) {
                    this.faultTip = "";
                }
                else {
                    if ((!isNaN(val)) && (val > 0)) {
                        if (val.indexOf('.') != -1) {
                            //有小数
                            let arr = val.split('.');
                            let str = arr[1];
                            if (str.length > 4) {
                                this.$Message.error('小数点位数不能超过4位');
                                this.faultTip = '小数点位数不能超过4位';
                            }
                            return;
                        }/* else if (val.indexOf('.') == -1 && val.length > 4) {
                            this.$Message.error('修理费用为小于10000的数字');
                            this.faultTip = '修理费用为小于10000的数字';
                            return;
                        }*/
                        this.faultTip = "";
                    }
                    else {
                        this.$Message.error('修理费用为大于0的数字');
                        this.faultTip = "修理费用大于0的数字";
                    }
                }
            },
            save() {
                this.$axios.post('/eamDo/outRepairAcceptSave', {
                    outRepairFormId: this.billId, //委外维修单id
                    repairCost: this.workForm.repair_cost //维修金额
                }).then((res) => {
                    if (res.data.response.code == 1) {
                        this.$Message.success(res.data.response.data);
                        this.$router.back();
                    } else {
                        this.$Message.error('保存失败');
                    }
                }).catch((err) => {
                    console.log(err);
                })
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
