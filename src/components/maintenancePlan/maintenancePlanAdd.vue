<template>
    <div style="position:relative;" class="basic fault-content">
        <!--模块名称-->
        <div class="title">
            <span>{{planName}}管理-{{pageTitle}}</span>
        </div>
        <div class="titleLogo"><img style="width: 100%;height: 100%;" :src="logoSrc"></div>
        <div v-if="this.editFlag!=2" style="overflow: hidden;">
            <h3 class="f_l">计划单号：</h3>
            <div class="f_l text-center">
                <img v-if="imgAddr!=''" :src="'/static'+ imgAddr" alt="" height="50" width="300">
                <div>{{docTypeCode}}</div>
            </div>
        </div>
        <!--表单--><!--code、name、busiType、planLevel、statusName、requiredTime、-->
        <div class="">
            <Form ref="planAddForm" :model="planAddForm" label-position="right" inline :label-width="135"
                  :rules="ruleValidate">
                <div class="second-title">基本信息</div>
                <Form-item label="计划编码" prop="code">
                    <Input v-model="planAddForm.code" :title="planAddForm.code" style="width: 160px;" placeholder="" disabled></Input>
                </Form-item>
                <Form-item label="计划名称" prop="name">
                    <Input v-model="planAddForm.name" :title="planAddForm.name" :maxlength="10" @on-blur="planAddForm.name = toValidate(planAddForm.name)" style="width: 160px;" :disabled="editable"></Input>
                </Form-item>
                <Form-item label="计划类型" prop="typeCode">
                    <Select v-model="planAddForm.typeCode" style="width: 160px;" disabled>
                        <Option v-for="item in busiTypeArr" :value="item.code" :key="item.code">{{ item.desc }}</Option>
                    </Select>
                </Form-item>
                <Form-item label="计划层级" prop="level">
                    <Select v-model="planAddForm.level" style="width: 160px;" disabled>
                        <Option v-for="item in planLevelArr" :value="item.code" :key="item.code">{{ item.desc}}</Option>
                    </Select>
                </Form-item>
                <Form-item label="提醒提前期（天）">
                    <Input style="width: 160px;" placeholder="" v-model="planAddForm.notifyLeadTime" disabled></Input>
                </Form-item>
                <Form-item label="单据下发提前期（天）">
                    <Input style="width: 160px;" placeholder="" v-model="planAddForm.dispatchLeadTime" disabled></Input>
                </Form-item>
                <Form-item label="计划状态" >
                    <Input v-model="planAddForm.statusName" style="width: 160px;" disabled></Input>
                </Form-item>
                <!--<Form-item label="平均耗时（分钟）" prop="estimatedTime">
                    <Input v-model="planAddForm.estimatedTime" style="width: 160px;" placeholder="" :disabled="editable"></Input>
                </Form-item>-->
                <Form-item  label="计划制定年份" prop="planTime" v-if="planAddForm.level == 0">
                    <DatePicker v-if="pageFrom==1&&!editable" :options="yearOptions" v-model="planAddForm.planTime" type="year" placeholder="选择年份" style="width: 160px" @on-change="changePlanTime"></DatePicker>
                    <DatePicker v-if="pageFrom==1&&editable" :options="yearOptions" v-model="planAddForm.planTime" type="year" :open="false" disabled placeholder="选择年份" style="width: 160px"></DatePicker>
                    <DatePicker v-if="pageFrom==''" v-model="planAddForm.planTime" type="year"  placeholder="选择年份" style="width: 160px" :editable="false" :open="false" disabled></DatePicker>
                </Form-item>
                <Form-item  label="计划制定月份" prop="planTime"  v-if="planAddForm.level == 1">
                    <DatePicker v-model="planAddForm.planTime" type="month"  placeholder="选择月份" style="width: 160px" :editable="false" :open="false" disabled></DatePicker>
                </Form-item>
                <Form-item label="有效期限" prop="effectivePeriod">
                    <Select v-model="planAddForm.effectivePeriod" style="width: 160px;" :disabled="editable||planAddForm.level==1">
                        <Option v-for="item in newEffectivePeriodArr" :value="item.code" :key="item.code">{{ item.desc }}</Option>
                    </Select>
                </Form-item>
                <div class="second-title" v-show="planAddForm.level == 1">上级计划</div>
                <Form-item label="上级计划编码" v-show="planAddForm.level == 1">
                    <Input v-model="planAddForm.parentTEamPlanCode" :title="planAddForm.parentTEamPlanCode" style="width: 160px;" placeholder="" disabled></Input>
                </Form-item>
                <Form-item label="上级计划名称" v-show="planAddForm.level == 1">
                    <Input v-model="planAddForm.parentTEamPlanNane" :title="planAddForm.parentTEamPlanNane" style="width: 160px;" placeholder="" disabled></Input>
                </Form-item>
                <Form-item label="上级计划层级" v-show="planAddForm.level == 1">
                    <Input v-model="planAddForm.parentTEamPlanLevel" style="width: 160px;" placeholder="" disabled></Input>
                </Form-item>
                <Form-item label="制单人">
                    <Input v-model="planAddForm.createBy" style="width: 160px;" placeholder="" disabled></Input>
                </Form-item>
                <Form-item label="制单日期" prop="createAt">
                    <Date-picker v-model="planAddForm.createAt" :open="false" type="datetime" placeholder="选择日期和时间" style="width: 160px;" disabled readonly
                                 :title="new Date(planAddForm.createAt).getFullYear()+'-'+parseInt(new Date(planAddForm.createAt).getMonth()+1)+'-'+new Date(planAddForm.createAt).getDate()+' '+new Date(planAddForm.createAt).getHours()+':'+new Date(planAddForm.createAt).getMinutes()+':'+new Date(planAddForm.createAt).getSeconds()"></Date-picker>
                </Form-item>
                <Form-item v-if="editFlag!=2&&!editable" label="最后修改人">
                    <Input v-model="planAddForm.updateBy" style="width: 160px;" placeholder="" disabled></Input>
                </Form-item>
                <Form-item v-if="editFlag!=2&&!editable" label="最后修改日期" prop="updateAt">
                    <Date-picker v-model="planAddForm.updateAt" :open="false" type="datetime" placeholder="选择日期和时间"
                                 style="width: 160px" disabled readonly
                                 :title="new Date(planAddForm.updateAt).getFullYear()+'-'+parseInt(new Date(planAddForm.updateAt).getMonth()+1)+'-'+new Date(planAddForm.updateAt).getDate()+' '+new Date(planAddForm.updateAt).getHours()+':'+new Date(planAddForm.updateAt).getMinutes()+':'+new Date(planAddForm.updateAt).getSeconds()"></Date-picker>
                </Form-item>

                <div class="second-title">保养设备
                    <!--<span style="color:red;padding-left:0.6%;">(&nbsp计划类型发生改变时，已选方案将会被清空，请谨慎操作&nbsp)</span>-->
                </div>
                <div class="table-reset">
                    <table class="table table-bordered table-center table-striped table-blue table-standWork table-edit taDisplay">
                        <thead>
                        <tr>
                            <th>序号</th>
                            <th>目标设备</th>
                            <th>标准方案</th>
                            <th>方案版本</th>
                            <th>设备分类</th>
                            <th>设备类型</th>
                            <th>设备安装地点</th>
                            <th>是否停机</th>
                            <th>执行岗位</th>
                            <th>操作</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="(equ,index) in equ_display" class="trDisplay">
                            <td>{{index + 1}}</td>
                            <td class="tdDisplay pointDis" :title="equ.title">
                                {{equ.title}}
                            </td>
                            <td class="pad-2-10" style="position: relative;">
                                <span class="pro">*</span>
                                <div class="input-search pointDis" style="padding-left:10px;" @click="openStandard(equ.location_id, index)">
                                    <Input :disabled="editable" readonly v-model="equ.plan_name"></Input>
                                    <Button :disabled="editable" icon="ios-search"></Button>
                                </div>
                            </td>
                            <td>
                                <a href="javascript:void(0)" v-if="equ.version&&equ.versions.length==1">版本{{equ.version}}</a>
                                <Dropdown v-if="equ.version&&equ.versions.length>1" trigger="click" @on-click="change_version">
                                    <a href="javascript:void(0)">
                                        版本{{equ.version}}
                                        <Icon type="arrow-down-b"></Icon>
                                    </a>
                                    <DropdownMenu slot="list">
                                        <DropdownItem v-for="it in equ.versions" v-if="it.version!=equ.version" :name="it.version+'#'+index" :key="it.eamStandardSolutionVersionId">
                                            版本{{it.version}}
                                        </DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                            </td>
                            <td>{{equ.classification}}</td>
                            <td>{{equ.type}}</td>
                            <td>{{equ.location}}</td>
                            <!--<td>{{equ.stop == 0 ? '是' : '否'}}</td>-->
                            <td>{{equ.stop}}</td>
                            <td>{{equ.exePos}}</td>
                            <td><a :disabled="editable" class="mar-r-5" size="small" @click="delete_equ(index)">删除</a></td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div class="mar-t-10 mar-b-25">
                    <Button :disabled="editable" type="primary" icon="plus-round" size="small"  @click="addEqu">添加设备</Button>
                </div>
                <div class="second-title">计划时间</div>
                <Form-item label="调度类型" prop="scheduleType">
                    <Select v-model="planAddForm.scheduleType" style="width: 160px;" disabled>
                        <Option v-for="it in circleTypeArr" :value="it.code" :key="it.code">{{ it.desc }}</Option>
                    </Select>
                </Form-item>
                <div v-if="planAddForm.level == 0">
                    <Form-item label="开始时间" prop="happenTime">
                        <DatePicker type="date" v-model="planAddForm.savePlanScheduleSetting.happenTime" placeholder="选择日期" :editable='false' :open="false" disabled></DatePicker>
                    </Form-item>
                    <Form-item label="触发间隔">
                        <Select v-model="planAddForm.periodUnit" style="width: 160px;" :disabled="editable" @on-change="changePlanDetailforMonthPlan">
                            <Option v-for="it in newPeriodUnitType" :value="it.code" :key="it.code">{{ it.desc }}</Option>
                        </Select>
                    </Form-item>
                    <!--<div>
                        <Form-item label="计划归档:" prop="link">
                            <p style="display: inline-block;margin-right: 50px;"><a>P007E</a></p>
                        </Form-item>
                    </div>-->
                    <!--表格-->
                    <div class="cicrleTable mar-t-10">
                        <div class="table-content">
                            <!--<Table stripe border :columns="dayColumns" :data="dayData"></Table>-->
                            <table class="table table-bordered table-center table-blue">
                                <thead>
                                <tr>
                                    <th rowspan="2" width="80">序号</th>
                                    <th colspan="12">{{newYear}}年    （ 季度：○   半年：△  一年：☆ ）</th>
                                </tr>
                                <tr>
                                    <th>1月</th>
                                    <th>2月</th>
                                    <th>3月</th>
                                    <th>4月</th>
                                    <th>5月</th>
                                    <th>6月</th>
                                    <th>7月</th>
                                    <th>8月</th>
                                    <th>9月</th>
                                    <th>10月</th>
                                    <th>11月</th>
                                    <th>12月</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr v-for="(item,index) in dayData" :key="index">
                                    <td>{{index+1}}</td>
                                    <td>{{item[1]}}</td>
                                    <td>{{item[2]}}</td>
                                    <td>{{item[3]}}</td>
                                    <td>{{item[4]}}</td>
                                    <td>{{item[5]}}</td>
                                    <td>{{item[6]}}</td>
                                    <td>{{item[7]}}</td>
                                    <td>{{item[8]}}</td>
                                    <td>{{item[9]}}</td>
                                    <td>{{item[10]}}</td>
                                    <td>{{item[11]}}</td>
                                    <td>{{item[12]}}</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div v-else-if="planAddForm.level == 1">
                    <div class="table-reset">
                        <table class="table table-bordered table-center table-striped table-blue table-edit table-standWork taDsiplay">
                            <thead>
                            <tr>
                                <th>序号</th>
                                <th width="35%">计划日期</th>
                                <th width="35%">计划时间段</th>
                                <th>操作</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="(itemData,index) in monthPlanData" class="trDisplay">
                                <td>{{index + 1}}</td>
                                <td @click="getMonthIndex(index)"><DatePicker type="date" :start-date="new Date(planAddForm.planTime)" placeholder="请选择天" :disabled="editable" style="width: 200px" v-model="itemData.triggerDay" @on-change="selectMonthDay"></DatePicker></td>
                                <td><TimePicker  type="time" placeholder="请选择时间" style="width: 200px" :disabled="editable" v-model="itemData.triggerTime "></TimePicker></td>
                                <td><a :disabled="editable" class="mar-r-5" size="small" @click="delMonthItem(index)">删除</a></td>
                            </tr>
                            </tbody>
                        </table>
                        <!-- <div class="page">
                             <Page :total="monthTotal" :current="monthPage" size="small" show-elevator :page-size="monthPageSize" @on-change="monthPageChange"></Page>
                         </div>-->
                    </div>
                    <div class="mar-t-10 mar-b-25">
                        <Button :disabled="editable" type="primary" icon="plus-round" size="small" @click="addMonthItem">添加</Button>
                    </div>
                </div>
                <div class="applyRecord">
                    <div class="second-title">审核记录</div>
                    <div class="mar-b-20">
                        <!-- <Form ref="scrapForm" :model="scrapForm" :label-width="100" inline>
                             <FormItem label="审核状态" prop="applyStatus">
                                 <Input v-model="scrapForm.scrapApplyStatus" placeholder="" readonly="readonly"></Input>
                             </FormItem>
                             <FormItem label="最新反馈日期" prop="feedbackDate">
                                 <Input v-model="scrapForm.feedbackDate" placeholder="" readonly="readonly"></Input>
                             </FormItem>
                         </Form>-->
                        <Table class="table-edit" stripe border :columns="scrapColumns" :data="scrapData"></Table>
                        <div class="page mar-t-10">
                            <Page :total="numMaterial" :current="page" size="small" show-elevator :page-size="pageSize" @on-change="changePage"></Page>
                        </div>
                    </div>
                </div>
            </Form>
        </div>
        <!--操作按钮-->
        <Row class="btn-group">
            <Col class="pad-15" span="24" align="center">
            <!--<router-link to='/maintenancePlan' class="mar-r-15" v-if="if_cancel">-->
            <!--<router-link to='/maintenancePlan' class="mar-r-15" v-if="if_cancel">-->
            <Button @click="goBack" v-if="if_cancel" class="btn-gary" icon="close" size="large">取消</Button>
            <!--</router-link>-->
            <!--<Button type="primary" icon="document-text" v-show="editable&&planAddForm.statusName!='待审核'" size="large" @click="editable = !editable">编辑</Button>-->
            <Button type="primary" icon="document-text" v-if="if_edit&&planAddForm.statusName!='已生效'" v-show="editable&&planAddForm.statusName!='待审核'" size="large" @click="editable = !editable">编辑</Button>
            <Button type="primary" icon="document-text" v-if="if_save" v-show="!editable" size="large" @click="save('planAddForm')">保存草稿</Button>
            <Button type="primary" icon="checkmark" size="large" v-if="if_toAudit&&planAddForm.statusName!='已生效'" v-show="planAddForm.statusName!='待审核'" :loading="commint_loading" @click="saveApply('planAddForm')">提交审核</Button>
            <Button v-if="if_audited&&planAddForm.statusName!='已生效'&&planAddForm.statusName!='已驳回'&&planAddForm.statusName!='已制单'" type="primary" :loading="agree_loading" icon="trash-a" size="large" @click="planApprove">审核通过</Button>
            <Button type="primary" icon="trash-a" size="large" v-if="if_reject" v-show="planAddForm.statusName =='待审核'" @click="adviseModal = true">审核驳回</Button>
            </Col>
        </Row>
        <!--designed by kp   设备多选弹框  --satrt-->
        <Modal v-model="equ_choose" title="设备选择" @on-ok="toSelect_equSite" width="800">
            <tree_equ @queSetected="equ_dataSelectedDisa" :mod_rightDisplay="equSelected"></tree_equ>
        </Modal>
        <!--designed by kp  --end-->
        <Modal v-model="emptyPlan_tip" title="提醒">
            <p>请完善计划任务栏的标准方案信息，若在该计划类型和设备下无方案可选，您可以先删除该行数据进行保存。</p>
            <div slot="footer">
                <Button type="primary" @click="emptyPlan_tip=false">关闭</Button>
            </div>
        </Modal>
        <Modal v-model="plan_choose" title="标准方案" @on-ok="selectEamfaName">
            <Table stripe border :columns="columns1" :data="data1" @on-row-click="toSelect" highlight-row></Table>
            <div class="mar-t-10" style="overflow: hidden">
                <div style="float: right;">
                    <Page size="small" :total="totalNum" show-elevator :page-size="selectStandardSolutionPageSize" @on-change="pageChange" :current="typePage"></Page>
                </div>
            </div>
        </Modal>
        <Modal v-model="account" title="金额计算方式">
            <p>金额计算方式：</p>
        </Modal>

        <!--驳回建议:-->
        <Modal v-model="adviseModal" title="驳回"  :loading="cannot_loading" @on-ok="planRejected">
            <p style="margin: 10px 0;">驳回意见:</p>
            <Input v-model="advise" type="textarea"
                   :maxlength="500"
                   @on-change="lengthChange(advise,500)"
                   :autosize="{minRows: 6,maxRows: 6}"
                   placeholder="请输入..."></Input>

        </Modal>

    </div>
</template>
<script>
    import FormItem from "../../../node_modules/iview/src/components/form/form-item";
    //kp--start
    import tree_equ from '../treeMulitiple/tree_equ_site.vue';
    import standard_plan from "../treeMulitiple/standard_plan.vue";
    //kp--end
    /*编辑 计划时间 S*/
    /*编辑 计划时间 E*/
    export default {
        components: {
            tree_equ: tree_equ,
            'standard_plan': standard_plan,
            FormItem
        },

//        //designed by kp----方案的管理相关---start:
        watch: {
            "planAddForm.typeName": function () {
                if (this.equSelected[0] !== undefined) {
                    this.plan_choose_obj = "";
                    this.version_choose_obj = "";
                    for (var i = 0; i < this.equ_display.length; i++) {
                        this.equ_display[i].version = "";//版本信息
                        this.equSelected[i].version = "";
                        this.equ_display[i].plan_name = "";
                        this.equSelected[i].plan_name = "";
                        this.equ_display[i].plan_id = "";
                        this.equSelected[i].plan_id = "";
                        this.equ_display[i].job = "";
                        this.equSelected[i].job = "";
                        this.equ_display[i].exeRoleId = "";
                        this.equSelected[i].exeRoleId = "";
                        this.equ_display[i].versions = [];
                        this.equ_display[i].version = "";
                        this.equSelected[i].version = "";  //默认版本
                        this.equSelected[i].versions = [];  //默认版本
                        this.equ_display[i].versionId = "";
                        this.equSelected[i].versionId = "";//默认版本的版本id
                        this.equ_display[i].stop = "";//是否停机
                        this.equSelected[i].stop = "";
                        this.equ_display[i].cost = "";//预计耗时
                        this.equSelected[i].cost = "";
                        this.equ_display[i].price = "";//预计耗时
                        this.equSelected[i].price = "";
                    }
//                    this.equ_display = [];
//                    this.equSelected = [];
                }
                else {
//                alert("不执行");
                }
            },
        },
        //designed by kp----方案的管理相关---end:

        data() {
            //验证名称
            const validateAge = (rule, value, callback) => { };
            return {
                /*克隆页面的计划制定年份只能选明年或明年以后的*/
                yearOptions: {
                    disabledDate (date) {
                        return date && date.valueOf() < Date.now();
                    }
                },
                //路由信息
                planName: '',
                /*权限校验 start*/
                if_edit: false,     //编辑
                if_audited: false,      //审核通过
                if_reject: false,       //驳回
                if_back: false,         //返回
                if_cancel: false,       //取消
                if_save: false,         //保存草稿
                if_toAudit: false,      //提交审核
                /*审核驳回*/
                advise:"",
                adviseModal:false,
                agree_loading:false,
                cannot_loading:false,
                workItemId:'',
                /*审核驳回*/
                /* *** 页面初始渲染 ****/
                editFlag:'',
                editable: false,
                pageTitle: '',
                /* *** 页面初始渲染 ****/
                //kp:
                theData:"",//当前日期
                theHour:"",//当前时
                theMinut:"",//当前分
                tempData:"",//当前日期：年月日时分
                addBtn:false,
                save_loading: false,//保存草稿防止多次提交
                commint_loading: false,//提交审核防止多次提交
                buttonType: "",

                editText: '',
                newText: '',
                num2: 88,
                logoSrc:"../../static/img/ch_logo.jpg",
                docTypeCode: '',
                imgAddr: '',
                //designed by kp  计划任务变量定义   --satrt
                emptyPlan_tip: false,
                planDatas: "",
                planId: "",
                //设备选择相关---》
                equ_choose: false,
                equSelected: [],
                equ_choose_obj: "",
                //方案类型选择
                has_click: false,
                plan_name: "",

                plan_choose_obj: "",
                version_choose_obj: "",
                theItem: "",
                price_sum: 0,
                //designed by kp  --end


                //临时字段...
                tmp: {
//                    //任务计划
                    tmpPlanTaskIndex: 0,
                },
                //临时字段...
                isubmit: false,
                isubmit_save_plan_force_timeCheck: false,
                isubmit_save_plan2_force: false,
                self: this,
                modal1: false,
                work_code: false,
                save_plan3: false,
                save_plan3_check: false,//不需要判断计划超出工时

                planAddForm: {
                    id: '', // 计划
                    typeCode: 0, //计划类型编码
                    typeName: 0, //计划类型名称
                    code: '',       // 计划编码
                    name: '',   // 计划名称
                    statusCode: 0,       // 计划状态编码
                    statusName: '',       // 计划状态名称
                    createBy: '',       // 创建者制单人、最后修改人名称
                    creatorId: '',       //创建者id
                    createAt: '',       //创建者时间
                    updatorId: '',       //更新者id
                    updateBy: '',       //更新者名称
                    updateAt: '',       //更新时间
                    planTime: '',       //  计划年份
                    effectivePeriod: 0,    //有效期限
                    level: 0,   //计划层级
                    notifyLeadTime: 0, //提醒提前期（天）
                    dispatchLeadTime: 0, //提醒提前期（天）
                    estimatedTime: '88', //平均耗时（分钟）
                    parentTEamPlanCode:'',//上级计划编码
                    parentTEamPlanNane:'',//上级计划名称
                    parentTEamPlanLevel:'',//上级计划层级

                    scheduleType: 0, /*循环方式*/
                    periodUnit: 1,
                    savePlanScheduleSetting: {
                        happenTime: new Date(),
                        happenHMS: ''
                    },
                    execTime: "0"
                },
                planAddFormLoad:{},
                ruleValidate: {
                    name: [
                        {required: true, message: '计划名称不能为空', trigger: 'blur'},
                        {type: 'string', message: '计划名称不能超出10个字', trigger: 'change'}
                    ],
                    effectivePeriod: [
                        {required: true, type:'number', message: '有效期限不能为空', trigger: 'blur'},
                    ],
                },
                happenTime: '',
                //保养设备
                equ_display: [],
                //标准方案
                columns1: [
                    {
                        title: '序号',
                        type: 'index',
                        align: 'center'
                    },
                    {
                        title: '方案名称',
                        key: 'name',
                        align: 'center',
                        render: (h, params) => {
                            return h('p', {
                                domProps: {
                                    title: params.row.solutionName
                                },
                                class: 'iview_tabDis',
                            }, params.row.solutionName)
                        },
                    },
                ],

                data1:[],
                versions: [], //方案版本数组
                planIndex: 0,
                plan_choose: false,
                modalStandardName: '',
                currentTab:"0",
                eamfaCol: [
                    {
                        title:'序号',
                        type: 'index',
                        width: 120,
                        align: 'center'
                    },
                    {
                        title:'标准方案名称',
                        key: 'standardSolutionName',
                        align: 'left'
                    }
                ],
                eamfaName: [],
                eamfaTotal: 0,
                locationId: '',
                version: '',
                versionId: '',
                versionArr: [], //方案版本
                versionIdArr: [], //方案版本id
                stopArr: [], //是否停机
                stop: '',
                solutionId: '',
                solutionName: '',
                roleName: '',
                roleId: '',
                eamfaCurrent: 1,
                busiTypeArr: [],
                planLevelArr: [],

                /*计划任务 start*/
                savePlanTaskList: [],
                /*计划任务 end*/

                /*计划频率 start*/
                savePlanSchedule: {
                    scheduleType: 0, /*循环方式*/
                    periodUnit: 1,
                    savePlanScheduleSetting: {
                        happenTime: "", //new Date(new date().getTime() + 1000 * 60 *60 *24)*/
                        happenHMS: ''
                    },
                    execTime: "0"
                },
                /*计划频率 end */
                /*开始时间今天之前日期禁止点击*/
                periodUnitType: [],
                circleTypeArr: [],
                effectivePeriodArr: [],
                dayData: [],
                dayTypeAry:["☆","△","○",],
                /*月计划表格*/
                monthPlanData:[],
                monthTotal:0,
                monthPage:1,
                monthPageSize:2,
                new_monthItem: {
                    "triggerTime": "",
                    "triggerDay":'',
                },
                monthIndex:0,

                new_monthData: {
                    currentM: null,
                    currentD: 1,
                    execDay: this.getExecDay(),
                    durationTime: '',
                    execTime: "0"
                },
                monthData: [],
                new_quarterData: {
                    currentM: 1,
                    execMonth: this.getExecMonth(4),
                    currentD: 1,
                    execDay: this.getExecDay(),
                    durationTime: '',
                    execTime: "0",
                },
                quarterData: [],
                new_yearData: {
                    currentM: 1,
                    execMonth: this.getExecMonth(5),
                    currentD: 1,
                    execDay: this.getExecDay(),
                    durationTime: '',
                    execTime: "1"
                },
                yearData: [],
                /*计划周期最终数据*/
                periodData: [],
                /*下拉框 start*/

                /*计划调度设置 指定时间 start*/
                planScheduleSetting: [],
                planScheduleSettingCheck: false,
                /*计划调度设置 指定时间 end*/

                /*设备放大镜end*/
                totalNum:0,
                typePage:1,
                selectStandardSolutionPageSize:5,
                plans: [],
                submintDataForm: [],
                schaleTime: "",
                account:false,
                /*审核记录*/
                scrapForm: {
                    scrapApplyStatus: '',
                    feedbackDate: ''
                },
                numMaterial: 0,
                page: 1,
                pageSize: 5,
                scrapColumns:[
                    {
                        title: '序号',
                        type: 'index',
                        width: 80,
                        align: 'center'
                    },
                    {
                        title: '执行操作',
                        key: 'operationName',
                        align: 'center'
                    },
                    {
                        title: '操作人',
                        key: 'processorName',
                        align: 'center'
                    },
                    {
                        title: '角色',
                        key: 'processorRole',
                        align: 'center'
                    },
                    {
                        title: '执行时间',
                        key: 'processTime',
                        align: 'center'
                    },
                    {
                        title: '结果状态',
                        key: 'approvalStatus',
                        align: 'center',
                    },
                    {
                        title: '意见反馈',
                        key: 'comment',
                        align: 'center'
                    },
                ],
                scrapData:[],
                pageFrom: '',
                cloneId: '',
                triggerMonth: '',
                newYear: '',
            }
        },

        mounted() {
            if (this.$route.query.clone) {
                this.pageFrom = this.$route.query.clone;
                this.cloneId = this.$route.query.planTaskId;
            }
            //获取路由信息
            this.planName = this.$base_info.getDescByCode(parseInt(this.$route.query.level),this.$base_info.tEamPlanLevelEnum);;
            /*触发间隔 数据*/
//            this.versionArr = this.$base_info.eamStandardSolutionStatus;
            this.periodUnitType = this.$base_info.planIntervalTime;
            this.circleTypeArr = this.$base_info.plancheduleType;
            this.effectivePeriodArr = this.$base_info.tEamPlanEffectivePeriodEnum;
            this.planLevelArr = this.$base_info.planControlType;
            this.busiTypeArr = this.$base_info.planType;
            //列表页传来的计划id.由它判断是来源于新增还是编辑

            this.planId = this.$route.query.planTaskId;
            this.docTypeCode = this.$route.query.code;
            this.workItemId = this.$route.query.workItemId;
            /*权限校验*/
            if (this.planAddForm.level == 0) {
                //年计划
                //保养年计划查看页
                this.if_edit = this.$rt(this.authJson.EAM.设备保养.保养年计划查看页.编辑);
                this.if_audited = this.$rt(this.authJson.EAM.设备保养.保养年计划查看页.审核通过);
                this.if_reject = this.$rt(this.authJson.EAM.设备保养.保养年计划查看页.驳回);
                this.if_back = this.$rt(this.authJson.EAM.设备保养.保养年计划查看页.返回);
                //保养年计划编辑页
                this.if_cancel = this.$rt(this.authJson.EAM.设备保养.保养年计划编辑页.取消);
                this.if_save = this.$rt(this.authJson.EAM.设备保养.保养年计划编辑页.保存草稿);
                this.if_toAudit = this.$rt(this.authJson.EAM.设备保养.保养年计划编辑页.提交审核);
            } else if (this.planAddForm.level == 1) {
                //保养月计划查看页
                this.if_edit = this.$rt(this.authJson.EAM.设备保养.保养月计划查看页.编辑);
                this.if_audited = this.$rt(this.authJson.EAM.设备保养.保养月计划查看页.审核通过);
                this.if_reject = this.$rt(this.authJson.EAM.设备保养.保养月计划查看页.驳回);
                this.if_back = this.$rt(this.authJson.EAM.设备保养.保养月计划查看页.返回);
                //保养月计划编辑页
                this.if_cancel = this.$rt(this.authJson.EAM.设备保养.保养月计划编辑页.取消);
                this.if_save = this.$rt(this.authJson.EAM.设备保养.保养月计划编辑页.保存草稿);
                this.if_toAudit = this.$rt(this.authJson.EAM.设备保养.保养月计划编辑页.提交审核);
            }
            /**** editFlag :查看 0；编辑 1；新建 2；****/
            this.editFlag = this.$route.query.editFlag;
            if (this.editFlag == 0) {
                this.pageTitle = "查看";
                this.getPlanDetail();
//                this.initPage();
                this.getPlanDetailforEqu();
                this.auditRecords();
                this.editable = true;
            }else if(this.editFlag == 1){
                this.pageTitle = "编辑";
                this.getPlanDetail();
                this.getPlanDetailforEqu();
                this.auditRecords();
                this.editable = false;
            }else if (this.editFlag == 2) {
                this.pageTitle = "新建";
                this.planName = "年计划";
                this.initPage();
                this.changePlanDetailforMonthPlan(1);
                this.editable = false;
            }
        },
        computed: {
            newEffectivePeriodArr(){
                if (this.planAddForm.level == 0) {
                    return this.effectivePeriodArr.filter(item => item.code>-1&&item.code<2)
                }
                return this.effectivePeriodArr.filter(item => item.code>-1)
            },
            newPeriodUnitType(){
                return this.periodUnitType.filter(item => item.code>-1)
            }
        },
        methods: {
            //*****************新建初始化数据
            initPage() {
                let vt = this;
                this.$axios.get('/plan/initNewPlan').then((res) => {
//                    console.log('初始化数据 ==== ')
//                    console.log(JSON.stringify(res));
                    let ret = res.data.response;
                    vt.planAddFormLoad = ret.data;
                    if (ret.code == 1) {
                        vt.planAddForm.code = ret.data.code;
                        vt.planAddForm.statusCode = ret.data.statusCode;
                        vt.planAddForm.statusName = ret.data.statusName;
                        vt.planAddForm.creatorId = ret.data.creatorId;
                        vt.planAddForm.createBy = ret.data.createBy;
                        vt.planAddForm.updatorId = ret.data.updatorId;
                        vt.planAddForm.createAt = ret.data.createAt;
                        vt.planAddForm.updateAt = ret.data.updateAt;
                        vt.planAddForm.planTime = String(ret.data.planTime);
                        vt.happenTime = vt.planAddForm.savePlanScheduleSetting.happenTime
                    } else {
                        vt.$Message.error(ret.msg);
                    }
                }).catch((err) => {
                    console.log(err)
                })
            },

            //改变计划制定年份
            changePlanTime(date) {
                let dd = new Date(this.planAddForm.savePlanScheduleSetting.happenTime);
                let str = dd.getFullYear()+'-'+parseInt(dd.getMonth()+1)+'-'+dd.getDate();
//                let str = dd.getFullYear()+'-'+(parseInt(dd.getMonth())+1)>10?(parseInt(dd.getMonth())+1):('0'+(parseInt(dd.getMonth())+1))+'-'+dd.getDate()>10?dd.getDate():'0'+dd.getDate();
                this.planAddForm.savePlanScheduleSetting.happenTime = date+str.substr(4);
                this.newYear = date;
            },
            addEqu() {
                if (this.equ_display.length > 9) {
                    this.$Message.error('一个计划只能添加10台保养设备');
                    this.equ_choose = false;
                } else {
                    this.equ_choose = true;
                    this.equSelected = []
                }
            },
            //添加设备相关
            equ_dataSelectedDisa(message,msg) {
//                console.log('添加设备相关')
//                console.log('this.equ_display ===== '+JSON.stringify(this.equ_display))
//                console.log('this.equSelected ===== '+JSON.stringify(this.equSelected))
                let lenTotal = this.equSelected.length + this.equ_display.length;
                let len = lenTotal - 10;
                let spliceLen = this.equSelected.length - len;
//                console.log('len ==== '+len)
                if (lenTotal > 10) {
                    this.$Message.error('一个计划只能添加10台保养设备');
                    this.equSelected.splice(spliceLen);
                }

                //检查重复性
                for (let i=0; i<this.equ_display.length; i++) {
                    for (let j=0; j<this.equSelected.length; j++) {
                        if (this.equ_display[i].title == this.equSelected[j].title) {
                            this.$Message.error('一台设备只能添加一次');
                            this.equSelected.splice(j,1)
                        }
                    }
                }
//                console.log(JSON.stringify(message))
//                console.log('msg333 === '+JSON.stringify(msg))
                this.equSelected = message;
                this.locationType = msg.data;
            },
            //弹框确认  --》
            toSelect_equSite() {
//                console.log('this.equSelected === '+JSON.stringify(this.equSelected))
                for (let i = 0; i < this.equSelected.length; i++) {
                    let ary = [];
                    ary = {
                        title: this.equSelected[i].title ? this.equSelected[i].title : "",
                        factoryEquipmentId: this.equSelected[i].equipmentId,
                        plan_name: this.equSelected[i].plan_name ? this.equSelected[i].title : "",
                        plan_id: this.equSelected[i].id ? this.equSelected[i].id : "",
                        classification: this.$base_info.getDescByCode(this.locationType.classification, this.$base_info.tEAMEquipmentAssetsClassificationEnum),
                        versions: this.equSelected[i].versions ? this.equSelected[i].versions : [],
                        version: this.equSelected[i].version ? this.equSelected[i].version : '',
                        versionId: this.equSelected[i].versionId ? this.equSelected[i].versionId : '',       //2018/8/29/11:28加
                        type: this.locationType.equipmentTypeName ? this.locationType.equipmentTypeName : "",
                        typeId: this.locationType.equipmentTypeId ? this.locationType.equipmentTypeId : "",
                        stop: this.equSelected[i].stop ? this.equSelected[i].stop : "",
                        location: this.locationType.location ? this.locationType.location : "",
                        location_id: this.locationType.location_id,
                        estimatedTime: this.equSelected[i].estimatedTime ? this.equSelected[i].estimatedTime : "",
                        exePos: this.equSelected[i].exePos ? this.equSelected[i].exePos : "",
                        exePosId: this.equSelected[i].exeRoleId ? this.equSelected[i].exeRoleId : ""
                    };
                    this.equ_display.push(ary)
                }
//                console.log('设备 this.equ_display === '+JSON.stringify(this.equ_display))
            },
            /*标准方案名称放大镜*/
            openStandard(id, idx) {
//                console.log('id === '+id)
                if (!this.editable) {
                    this.plan_choose = true;
                    this.planIndex = idx;
                    this.locationId = id;
                    this.data1 = [];
                    this.getPlan();
                }
            },
            getPlan(){
//                console.log('this.locationId === '+this.locationId)
//                console.log('this.planAddForm.typeName === '+this.planAddForm.typeName)
                this.$axios.post('/plan/selectStandardSolution',{
                    page:this.typePage,
                    pageSize:this.selectStandardSolutionPageSize,
                    planType: this.editFlag == 1 ? this.$base_info.getCodeByDesc(this.planAddForm.typeName, this.$base_info.planType) : this.editFlag == 2 ? this.planAddForm.typeName : this.$base_info.getCodeByDesc(this.planAddForm.typeName, this.$base_info.planType),
                    locationId: this.locationId
                }).then((res) => {
//                    console.log('标准方案数据=====');
//                    console.log(JSON.stringify(res))
                    let ret = res.data.response;
                    if (ret.code == 1) {
                        this.data1 = ret.data.rows;
                        this.totalNum = ret.data.total;
                    }
                }).catch((err) => {
                    console.log(err);
                });
            },
            /*点选带回名称*/
            toSelect (rowdata) {
                this.versions = [];
//                console.log('rowdata == '+JSON.stringify(rowdata));
                this.solutionId = rowdata.solutionId;
                this.solutionName = rowdata.solutionName;
//                this.versions = rowdata.versionRows;
//                console.log('哈哈  this.versions === ' + JSON.stringify(this.versions))
                for (let i=0; i<rowdata.versionRows.length; i++) {
                    this.versions.push({
                        eamStandardSolutionVersionId: rowdata.versionRows[i].versionId,
                        isDefaultVersion: rowdata.versionRows[i].isDefaultVersion,
                        needShutdown: rowdata.versionRows[i].needShutdown,
                        requiredTime: rowdata.versionRows[i].requiredTime,
                        version: rowdata.versionRows[i].version
                    })
                }
                this.roleName = rowdata.roleName;
                this.roleId = rowdata.exeRoleId;
            },
            selectEamfaName () {
//                console.log('选中的方案==== '+JSON.stringify(this.data1))
//                console.log('选中的方案长度==== '+this.data1.length)
                if (this.data1.length > 0) {
//                    console.log('不为空')
                    this.equ_display[this.planIndex].plan_name = this.solutionName;
                    this.equ_display[this.planIndex].plan_id = this.solutionId;
                    this.equ_display[this.planIndex].versions = this.versions;
                    for (let i=0; i<this.versions.length; i++) {
                        if (this.versions[i].isDefaultVersion == 0) {
                            this.equ_display[this.planIndex].version = this.versions[i].version;
                            this.equ_display[this.planIndex].versionId = this.versions[i].eamStandardSolutionVersionId;
                            this.equ_display[this.planIndex].stop = this.versions[i].needShutdown == 1 ? '否' : '是';
                        }
                    }
                    this.equ_display[this.planIndex].exePos = this.roleName;
                    this.equ_display[this.planIndex].exePosId = this.roleId;
                }

//                console.log('方案  this.equ_display == '+JSON.stringify(this.equ_display))
            },
            //改变方案版本
            change_version(value){
                if (!this.if_edit) {
                    this.$Message.error('您没有编辑的权限');
                    return
                }
                if (this.editable) {
                    this.$Message.error('选择编辑之后才能改变版本');
                    return
                }
                let y = value.split("#");
                let name = parseInt(y[0]);
                this.planIndex = parseInt(y[1]);
                let versions;
                for (let j = 0; j < this.equ_display[this.planIndex].versions.length; j++) {
                    this.equ_display[this.planIndex].versions[j].isDefaultVersion = 1;
                }
                for (let i = 0; i < this.equ_display[this.planIndex].versions.length; i++) { //寻找默认版本信息对象
                    if (this.equ_display[this.planIndex].versions[i].version == name) {
                        versions = this.equ_display[this.planIndex].versions[i];
                        versions.isDefaultVersion = 0;
                    }

                }
//                console.log('change_version ==== '+JSON.stringify(versions))
                this.equ_display[this.planIndex].version = versions.version;  //默认版本
                this.equ_display[this.planIndex].versionId = versions.eamStandardSolutionVersionId; //默认版本的版本id
                this.equ_display[this.planIndex].stop = versions.needShutdown == 0 ? '是' : '否';//是否停机
//                console.log('this.equ_display === '+JSON.stringify(this.equ_display))
            },
            /*分页*/
            pageChange:function (page) {
                this.$jq("input[name='eamfa_radio']:checked").prop("checked", false);
                this.searchStandardNameTab(page,5,this.currentTab,this.modalStandardName);
            },
            /*方案名称搜索*/
            searchName:function () {
                this.searchStandardNameTab(1,5,this.currentTab,this.modalStandardName);
            },

            //保存。。。。
            save(name) {
                let vt = this;
                this.$refs[name].validate((valid) => {
                    let tpm = vt.equ_display;
                    let rules = true;
                    if (!valid) {
                        vt.$Message.error('请完善信息');
                    } else if (tpm.length == 0) {
                        vt.$Message.error('请添加保养设备信息');
                    } else if (tpm.length > 0) {
                        let standArr = [];
                        for (let i in tpm) {
                            if (tpm[i].plan_name == '') {
                                vt.$Message.error('请添加标准方案');
                                rules = false;
                            } else {
                                rules = true;
                                standArr.push({
                                    classification: vt.$base_info.getCodeByDesc(tpm[i].classification, vt.$base_info.tEAMEquipmentAssetsClassificationEnum),//设备分类",
                                    eamStandardSolutionId: tpm[i].plan_id,//标准方案id",
                                    eamStandardSolutionVersionId: tpm[i].versionId,//标准方案版本id",
                                    estimatedTime: 0,//预计耗时（分钟）,
                                    exeRoleId: tpm[i].exePosId,//执行角色id",
                                    factoryEquipmentId: tpm[i].factoryEquipmentId,//设备id",
                                    typeId: tpm[i].typeId,//设备类型id"
                                })
                            }
                        }
//                        console.log('planAddForm == '+JSON.stringify(vt.planAddForm))
                        let monthList = vt.monthPlanData;
                        let triggerDayBool;
                        let triggerTimeBool;
                        let triggerListBool;
                        let planTime;
                        if (vt.planAddForm.level == 0) {
                            triggerListBool = true;
                            triggerDayBool = true;
                            triggerTimeBool = true;
                            planTime = vt.$fc.dateFormat(vt.planAddForm.planTime, 'yyyy')
                        } else if (vt.planAddForm.level == 1) {
                            planTime = vt.$fc.dateFormat(vt.planAddForm.planTime, 'yyyy-MM');
                            if (monthList.length > 0) {
                                triggerListBool = true;
                                for (let i = 0; i < monthList.length; i++) {
                                    if (monthList[i].triggerDay == '') {
                                        triggerDayBool = false;
                                        triggerTimeBool = true;
                                    } else {
                                        triggerDayBool = true;
                                        if (monthList[i].triggerTime == '') {
                                            triggerTimeBool = false;
                                        } else {
                                            triggerTimeBool = true;
                                            monthList[i].triggerDay = vt.$fc.dateFormat(monthList[i].triggerDay, 'yyyy-MM-dd')
                                        }
                                    }
//                                monthList[i].triggerDay = vt.$fc.dateFormat(monthList[i].triggerDay,'yyyy-MM-dd')
                                }
                            } else {
                                triggerListBool = false
                            }
                        }
                        let saveAry = {
                            code: vt.planAddForm.code,//计划编码",
                            controlType: Number(vt.planAddForm.level),//vt.planAddForm.level,//计划层级,,
                            dispatchLeadTime: vt.planAddForm.dispatchLeadTime,//单据下发提前期（天）",
                            effectivePeriod: vt.planAddForm.effectivePeriod,//有效期限",
                            estimatedTime: vt.planAddForm.estimatedTime,//平均耗时（分钟）,
                            isProductTime: vt.planAddForm.execTime,//执行时间段,
                            level: vt.planAddForm.level,//计划层级,
                            name: vt.planAddForm.name,//计划名称",
                            notifyLeadTime: vt.planAddForm.notifyLeadTime,//提醒提前期（天）",
                            planId: this.planId,//计划Id",//不传表示新增  传值表示更新
                            planYear: planTime,//计划年份",
                            scheduleType: vt.planAddForm.scheduleType,//调度类型,
                            scheduleBeginDay: vt.$fc.dateFormat(vt.planAddForm.savePlanScheduleSetting.happenTime, 'yyyy-MM-dd'),//开始时间",
                            intervalTime: vt.planAddForm.periodUnit,//触发间隔,
                            startTime: '',//执行时间",
                            status: vt.$base_info.getCodeByDesc(vt.planAddForm.statusName, vt.$base_info.tEamApprovePlanStatusEnum),//计划状态,
                            tEamPlanTaskList: standArr,
                            type: vt.planAddForm.typeCode,//计划类型
                            commonNonScheduleExecuteDetailVo: monthList
                        };
//                        console.log('可以保存了')
                        /*console.log(' vt.planAddForm === ' + JSON.stringify(vt.planAddForm));*/
//                        console.log('saveAry === ' + JSON.stringify(saveAry))
                            if (rules) {
                                if (triggerListBool) {
                                    if (triggerDayBool) {
                                        if (triggerTimeBool) {
                                            this.$axios.post('/plan3/eamPlanSaveDraft3', saveAry).then((res) => {
                                                let ret = res.data.response;
                                                if (ret.code == 1) {
                                                    vt.$Message.success(ret.data);
                                                    vt.$router.back();
                                                } else {
                                                    vt.$Message.error(ret.msg);
                                                }
                                            }).catch((err) => {
                                                console.log(err)
                                            })
                                        } else {
                                            this.$Message.error("请填写计划时间段！")
                                        }
                                    } else {
                                        this.$Message.error("请填写计划日期！")
                                    }
                                } else {
                                    this.$Message.error("请至少填写一条日计划！")
                                }
                            }
                        }
//                    }
                })
            },
            //提交审核。。。。
            saveApply(name) {
                let vt = this;
                this.$refs[name].validate((valid) => {
                    let tpm = vt.equ_display;
                    let rules = true;
                    if (!valid) {
                        vt.$Message.error('请完善信息');
                    } else if (tpm.length == 0) {
                        vt.$Message.error('请添加保养设备信息');
                    } else if (tpm.length > 0) {
                        let standArr = [];
                        for (let i in tpm) {
                            if (tpm[i].plan_name == '') {
                                vt.$Message.error('请添加标准方案');
                                rules = false;
                            } else {
                                rules = true;
                                standArr.push({
//                                    classification: tpm[i].classification,//设备分类",
                                    classification: vt.$base_info.getCodeByDesc(tpm[i].classification, vt.$base_info.tEAMEquipmentAssetsClassificationEnum),//设备分类",
                                    eamStandardSolutionId: tpm[i].plan_id,//标准方案id",
                                    eamStandardSolutionVersionId: tpm[i].versionId,//标准方案版本id",
                                    estimatedTime: '',//预计耗时（分钟）,
                                    exeRoleId: tpm[i].exePosId,//执行角色id",
                                    factoryEquipmentId: tpm[i].factoryEquipmentId,//设备id",
                                    typeId: tpm[i].typeId,//设备类型id"
                                })
                            }
                        }
                        let monthList = vt.monthPlanData;
                        let triggerDayBool;
                        let triggerTimeBool;
                        let triggerListBool;

                        let planTime
                        if (vt.planAddForm.level == 0) {
                            triggerListBool = true;
                            triggerDayBool = true;
                            triggerTimeBool = true;
                            planTime = vt.$fc.dateFormat(vt.planAddForm.planTime, 'yyyy')
                        } else if (vt.planAddForm.level == 1) {
                            planTime = vt.$fc.dateFormat(vt.planAddForm.planTime, 'yyyy-MM');
                            if (monthList.length > 0) {
                                triggerListBool = true;
                                for (let i = 0; i < monthList.length; i++) {
                                    if (monthList[i].triggerDay == '') {
                                        triggerDayBool = false;
                                        triggerTimeBool = true;
                                    } else {
                                        triggerDayBool = true;
                                        if (monthList[i].triggerTime == '') {
                                            triggerTimeBool = false;
                                        } else {
                                            triggerTimeBool = true;
                                            monthList[i].triggerDay = vt.$fc.dateFormat(monthList[i].triggerDay, 'yyyy-MM-dd')
                                        }
                                    }
//                                monthList[i].triggerDay = vt.$fc.dateFormat(monthList[i].triggerDay,'yyyy-MM-dd')
                                }
                            } else {
                                triggerListBool = false
                            }
                        }

                        let saveAry = {
                            code: vt.planAddForm.code,//计划编码",
                            controlType: Number(vt.planAddForm.level),//vt.planAddForm.level,//计划层级,,
                            dispatchLeadTime: vt.planAddForm.dispatchLeadTime,//单据下发提前期（天）",
                            effectivePeriod: vt.planAddForm.effectivePeriod,//有效期限",
                            estimatedTime: vt.planAddForm.estimatedTime,//平均耗时（分钟）,
                            isProductTime: vt.planAddForm.execTime,//执行时间段,
                            level: vt.planAddForm.level,//计划层级,
                            name: vt.planAddForm.name,//计划名称",
                            notifyLeadTime: vt.planAddForm.notifyLeadTime,//提醒提前期（天）",
                            planId: this.planId,//计划Id",//不传表示新增  传值表示更新
                            planYear: planTime,//计划年份",
                            scheduleType: vt.planAddForm.scheduleType,//调度类型,
                            scheduleBeginDay: vt.$fc.dateFormat(vt.planAddForm.savePlanScheduleSetting.happenTime, 'yyyy-MM-dd'),//开始时间",
                            intervalTime: vt.planAddForm.periodUnit,//触发间隔,
                            startTime: '',//执行时间",
                            status: vt.$base_info.getCodeByDesc(vt.planAddForm.statusName, vt.$base_info.tEamApprovePlanStatusEnum),//计划状态,
                            tEamPlanTaskList: standArr,
                            type: vt.planAddForm.typeCode,//计划类型
                            commonNonScheduleExecuteDetailVo: monthList
                        };
//                        console.log('可以提交审核了')
//                        console.log(' vt.planAddForm === ' + JSON.stringify(vt.planAddForm));
//                        console.log('saveAry === ' + JSON.stringify(saveAry))

                            if (rules) {
                                if (triggerListBool) {
                                    if (triggerDayBool) {
                                        if (triggerTimeBool) {
                                            this.$axios.post('/plan3/eamPlanSaveEffectiveCheck3', saveAry).then((res) => {
                                                let ret = res.data.response;
                                                if (ret.code == 1) {
                                                    vt.$Message.success(ret.data);
                                                    vt.$router.back();
                                                } else {
                                                    vt.$Message.error(ret.msg);
                                                }
                                            }).catch((err) => {
                                                console.log(err)
                                            })
                                        } else {
                                            this.$Message.error("请填写计划时间段！")
                                        }
                                    } else {
                                        this.$Message.error("请填写计划日期！")
                                    }
                                } else {
                                    this.$Message.error("请至少填写一条日计划！")
                                }
                            }
                        }
//                    }
                })
            },
            //审核通过
            planApprove(){
                let data = [];
                data.push({
                    planId: this.planId,
                    workItemId: this.workItemId,
                    advice:""
                });
                this.$axios.post('/plan/planApprove', data).then((res) => {
                    let ret = res.data.response;
//                    console.log('审核通过=============')
//                    console.log(JSON.stringify(res))
                    if (ret.code != 1) {
                        this.$Message.error(ret.msg);
                        this.agree_loading=false;
                    } else {
                        this.$Message.success('审核通过！');
                        this.agree_loading=false;
                        setTimeout( () => {
                            this.$router.back();
//                            this.window.history.back(-1)
                        },1000);
                    }
                }).catch((err) => {
                    console.log(err);
                })
            },
            //驳回
            lengthChange(i, len){
                if (i.length >= len) {
                    this.$Message.error('字数不能超过' + len)
                }
            },
            planRejected(){
                this.cannot_loading=true;
                this.$axios.post('/plan/planRejected', {
                    advise:this.advise,
                    planId: this.planId,
                    workItemId: this.workItemId
                }).then((res) => {
                    let ret = res.data.response;
//                    console.log(ret);
                    if (ret.code != 1) {
                        this.cannot_loading=false;
                        this.$Message.error(ret.msg);
                    } else {
                        this.$Message.success('驳回成功！');
                        let vt=this;
                        setTimeout(() => {
                            vt.$router.push({path: '/maintenancePlan', query: {"toLable": "auditList"}});
                        }, 1000);
                    }
                }).catch((err) => {
                    console.log(err);
                })
            },

            //审核记录数据
            auditRecords() {
                this.$axios.post('/plan3/getPlanApprovalHistory', {
                    planId: this.planId,//計劃id
                    page: this.page,//页码
                    pageSize: this.pageSize,//条目数
                }).then((res) => {
//                    console.log('审核记录数据')
//                    console.log(JSON.stringify(res))
                    let ret = res.data.response;
                    if (ret.code == 1) {
                        this.scrapData = ret.data.rows;
                        this.numMaterial = ret.data.total;
                    } else {
                        this.$Message.error(ret.msg);
                    }
                }).catch((err) => {
                    console.log(err)
                })
            },
            changePage(curPage) {
                this.page = curPage;
                this.auditRecords();
            },
            //验证输入框格式
            toValidate(msg){
                let str = /[=+%!<>"'/_,()\\]/
                if(str.test(msg)){
                    this.$Message.warning('输入格式错误')
                    msg = msg.replace(/\'/g,"").replace(/\"/g,"").replace(/\+/g,"").replace(/\=/g,"").replace(/\%/g,"").replace(/\!/g,"").replace(/\</g,"").replace(/\>/g,"").replace(/\//g,"").replace(/\_/g,"").replace(/\,/g,"").replace(/\(/g,"").replace(/\)/g,"").replace(/\\/g,"");
                }
                return msg
            },
            /*计划周期 S*/
            /*计划周期 - 触发间隔 唯一性提醒*/
            messageModal(periodUnit){
                let vm = this;
                let messageStr = "请确认是否更换触发间隔，如果确定，将清空已选择的执行明细！";
                this.$Modal.confirm({
                    title: '提醒',
                    content: '<h3>' + messageStr + '</h3>',
                    onOk: () => {
                        vm.dayData = [];
                        vm.monthData = [];
                        vm.quarterData = [];
                        vm.yearData = [];
                    },
                    onCancel: () => {
                        vm.savePlanSchedule.periodUnit = periodUnit;
                    }
                });
            },
            /*计划周期 - 触发间隔 改变*/
            changePeriodUnit(period){
                let vm = this;
                let dayLen = vm.dayData.length;
                let monthLen = vm.monthData.length;
                let quarterLen = vm.quarterData.length;
                let yearLen = vm.yearData.length;
                switch (period) {
                    case 1:/*天*/
                        if (monthLen) {
                            vm.messageModal(3);
                        }
                        if (quarterLen) {
                            vm.messageModal(4);
                        }
                        if (yearLen) {
                            vm.messageModal(5);
                        }
                        return;
                    /*case '1':/!*周*!/
                     return;*/
                    case 3:/*月*/
                        if (dayLen) {
                            vm.messageModal(1);
                        }
                        if (quarterLen) {
                            vm.messageModal(4);
                        }
                        if (yearLen) {
                            vm.messageModal(5);
                        }
                        return;
                    case 4:/*季度*/
                        if (dayLen) {
                            vm.messageModal(1);
                        }
                        if (monthLen) {
                            vm.messageModal(3);
                        }
                        if (yearLen) {
                            vm.messageModal(5);
                        }
                        return;
                    case 5:/*年、季度*/
                        if (dayLen) {
                            vm.messageModal(1);
                        }
                        if (monthLen) {
                            vm.messageModal(3);
                        }
                        if (quarterLen) {
                            vm.messageModal(4);
                        }
                        return;
                }
            },
            /*计划周期 - 获取年月份、季度月份*/
            getExecMonth(period){
                let vm = this;
                let totalM;
                let execMonth = [];
                period == 5 ? totalM = 12 : totalM = 3;
                for (let m = 1; m <= totalM; m++) {
                    execMonth.push({
                        value: m,
                        label: '第' + m + '个月'
                    })
                }
                return execMonth;
            },
            /*计划周期 - 获取月天数 默认最长天数 31*/
            getExecDay(){
                let vm = this;
                let execDay = [];
                for (let d = 1; d <= 31; d++) {
                    execDay.push({
                        value: d,
                        label: d
                    })
                }
                return execDay;
            },
            //designed by kp  计划任务相关  --start
            //判断时和分：
            toNowTime(){
                {
                    var d = new Date();
//                    this.theData = d.toLocaleString().split(" ")[0];
                    let year=d.toLocaleString().split(" ")[0].split("/")[0];
                    let month=d.toLocaleString().split(" ")[0].split("/")[1]>9?d.toLocaleString().split(" ")[0].split("/")[1]:"0"+d.toLocaleString().split(" ")[0].split("/")[1];
                    let day=d.toLocaleString().split(" ")[0].split("/")[2]>9?d.toLocaleString().split(" ")[0].split("/")[2]:"0"+d.toLocaleString().split(" ")[0].split("/")[2];
                    this.theData=year+month+day;
                    this.theMinut = d.getMinutes() > 9 ? d.getMinutes() : "0" + d.getMinutes();
                    this.theHour = d.getHours() > 9 ? d.getHours() : "0" + d.getHours();
//                    this.theSeconds = d.getSeconds() > 9 ? d.getSeconds() : "0" + d.getSeconds();
                    this.tempData=this.theData+this.theHour+this.theMinut;
                    return this.tempData;
                }
            },
            //删除设备带出的行数据：
            delete_equ(item) {
                this.equSelected.splice(item, 1);
                this.equ_display.splice(item, 1);
            },


            //从编辑页进来时候渲染计划任务详情：
            getPlanDetail(){ //查看计划详情
                let vt = this;
                this.$axios.post('/plan/searchPlanById', {
                    id: this.planId,
                }).then((res) => {
                    let result = res.data.response;
                    if (result.code === 1) {
                        vt.planAddForm.id = result.data.id;// 计划
                        vt.planAddForm.typeCode = result.data.typeCode; //计划类型编码
                        vt.planAddForm.typeName = result.data.typeName; //计划类型名称
                        vt.planAddForm.code = result.data.code;       // 计划编码
                        vt.planAddForm.name = result.data.name;   // 计划名称
                        vt.planAddForm.statusCode = result.data.statusCode;       // 计划状态编码
                        vt.planAddForm.statusName = result.data.statusName;       // 计划状态名称
                        vt.planAddForm.createBy = result.data.createBy;       // 制单人、最后修改人名称
                        vt.planAddForm.creatorId = result.data.creatorId;       //创建者id
                        vt.planAddForm.createAt = result.data.createAt;       //创建者时间
                        vt.planAddForm.updatorId = result.data.updatorId;      //更新者id
                        vt.planAddForm.updateBy = result.data.updateBy;       //更新者名称
                        vt.planAddForm.updateAt = result.data.updateAt;       //更新时间
                        vt.planAddForm.planTime = String(result.data.planTime);       //  计划年份
                        vt.planAddForm.effectivePeriod = result.data.effectivePeriod;    //有效期限
                        vt.planAddForm.level = result.data.clazzCode;   //计划层级
                        vt.planAddForm.notifyLeadTime = result.data.notifyLeadTime ? result.data.notifyLeadTime : 0; //提醒提前期（天）
                        vt.planAddForm.dispatchLeadTime = result.data.dispatchLeadTime == '' || result.data.dispatchLeadTime == null ? 0 : result.data.dispatchLeadTime; //单据下发提前期（天）
                        vt.planAddForm.estimatedTime = result.data.estimatedTime; //平均耗时（分钟）
                        vt.planAddForm.parentTEamPlanCode = result.data.parentTEamPlanCode; //上级计划编码
                        vt.planAddForm.parentTEamPlanNane = result.data.parentTEamPlanNane; //上级计划名称
//                        vt.planAddForm.parentTEamPlanLevel = result.data.parentTEamPlanLevel; //上级计划层级
                        vt.planAddForm.parentTEamPlanLevel = this.$base_info.getDescByCode(result.data.parentTEamPlanLevel,this.$base_info.planClazz); //上级计划层级
                        vt.newYear = vt.planAddForm.planTime;
                        vt.imgAddr = result.data.barCode;
                    } else {
                        vt.$Message.error(result.msg);
                    }
                    if(vt.planAddForm.level == 1){
                        this.getPlanDetailforMonthPlan();
                    }else {
                        this.getPlanDetailforYearPlan();
                    }
                }).catch((err) => {
                });
            },
            getPlanDetailforEqu(){ //查看保养设备
                let vt = this;
//                console.log('id == '+vt.planId)
                this.$axios.post('/plan/getEamPlanTaskByEamPlanId', {
                    eamPlanId: vt.planId,
                }).then((res) => {
                    let result = res.data.response;
                    if (result.code === 1) {
//                        console.log("查看保养设备-----------------------》 +" + JSON.stringify(result));
                        let newAry = [];
                        let dataAry = result.data;
                        for(let i=0; i<dataAry.length; i++) {
                            for (let j=0; j<dataAry[i].TEamStandardSolutionVersionVo.length; j++) {
                                if (dataAry[i].TEamStandardSolutionVersionVo[j].isDefaultVersion == 0) {
                                    dataAry[i].version = dataAry[i].TEamStandardSolutionVersionVo[j].version;
                                    dataAry[i].versionId = dataAry[i].TEamStandardSolutionVersionVo[j].eamStandardSolutionVersionId;
                                    dataAry[i].stop = dataAry[i].TEamStandardSolutionVersionVo[j].needShutdown
                                }
                            }

                            newAry.push({
                                title: dataAry[i].tBdFactoryEquipmentName, //目标设备
                                factoryEquipmentId: dataAry[i].tBdFactoryEquipmentId, //目标设备Id
                                plan_name: dataAry[i].TEamStandardSolutionName,//标准方案
                                plan_id: dataAry[i].TEamStandardSolutionId,//标准方案Id
                                versions: dataAry[i].TEamStandardSolutionVersionVo, //方案版本集合
                                versionId: dataAry[i].versionId,
                                version: dataAry[i].version, //方案版本
                                classification: vt.$base_info.getDescByCode(dataAry[i].classification, vt.$base_info.tEAMEquipmentAssetsClassificationEnum), //设备分类
                                type: dataAry[i].equipmentTypeName, //设备类型
                                typeId: dataAry[i].equipmentTypeId, //设备类型Id
                                location: dataAry[i].tBdFactoryLocationName, //设备安装地点
                                location_id: dataAry[i].tFactoryLocationId, //设备安装地点
                                exePos: dataAry[i].exeRole, //执行岗位
                                exePosId: dataAry[i].exeRole, //执行岗位Id
                                stop: dataAry[i].stop == 1 ? "否" : "是" //是否停机
                            })
                        }
                        vt.equ_display = newAry;
//                        console.log('vt.equ_display = ====== '+JSON.stringify(vt.equ_display))
                    } else {
                        vt.$Message.error(result.msg);
                    }
                }).catch((err) => {
                    console.log(err)
                });
            },
            getPlanDetailforMonthPlan(){ //查看月计划详情
                let vt = this;
                this.$axios.post('plan/getMonthPlanTime', {
                    planId: this.planId,
                    pageSize:32,
                    pageNum:this.monthPage,
                }).then((res) => {
                    let result = res.data.response;
                    if (result.code === 1) {
//                        vt.monthPlanData = result.data.rows;
                        vt.monthPlanData = [];
                        for(let i = 0 ; i<result.data.rows.length; i++){
                            vt.monthPlanData.push({
                                triggerDay:result.data.rows[i].triggerDay,
                                triggerTime:result.data.rows[i].triggerTime,
                            })
                        }
                        vt.monthTotal = result.data.count;
                        vt.planAddForm.scheduleType = result.data.intervalTime;
//                        console.log("月计划数据-----------------------》 +" + JSON.stringify(result));
                    } else {
                        vt.$Message.error(result.msg);
                    }
                }).catch((err) => {
                    console.log(err)
                });
            },
            getPlanDetailforYearPlan(){ //查看年计划详情
                let vt = this;
                this.$axios.post('plan/getYearPlanTime', {
                    planId: this.planId,
                }).then((res) => {
                    let result = res.data.response;
                    vt.dayData.push({1:'',2:'',3:'',4:'',5:'',6:'',7:'',8:'',9:'',10:'',11:'',12:''});
                    if (result.code === 1) {
//                        vt.planDatas = result.data;
//                        console.log("年计划数据-----------------------》 +" + JSON.stringify(result));
                        vt.planAddForm.scheduleType = result.data[0].timeType ;/*循环方式*/
                        vt.planAddForm.periodUnit = result.data[0].intervalTime;
                        vt.planAddForm.savePlanScheduleSetting.happenTime = result.data[0].beginTime;
                        let markIcon = vt.dayTypeAry[vt.planAddForm.periodUnit];
                        for (let i = 0 ; i < result.data[1].length ; i ++){
                            let MonthNum = result.data[1][i].triggerMonth;
                            vt.dayData[0][MonthNum] = markIcon
                        }
                    } else {
                        vt.$Message.error(result.msg);
                    }
                }).catch((err) => {
                });
            },
            monthPageChange(page){
                this.monthPage = page;
                this.getPlanDetailforMonthPlan();
            },
            changePlanDetailforMonthPlan(val) {
                let time = parseInt(this.planAddForm.savePlanScheduleSetting.happenTime.getMonth()+1);
                let newTime = time+1;
                this.$axios.post('/plan/changeInfoByInterval', {
                    month: newTime,
                    interval: val
                }).then((res) => {
//                    console.log('changePlanDetailforMonthPlan  ================================== ')
//                    console.log(JSON.stringify(res))
                    let ret = res.data.response;
                    let retData = ret.data;
                    if (ret.code == 1) {
                        this.dayData = [];
                        this.dayData.push({1:'',2:'',3:'',4:'',5:'',6:'',7:'',8:'',9:'',10:'',11:'',12:''});
                        for (let k in this.dayData[0]) {
                            this.dayData[0][k] = '';
                            for (let i = 0; i < retData.length; i++) {
                                this.dayData[0][retData[i]] = this.dayTypeAry[val];
                            }
                        }
                    } else {
                        this.$Message.error(ret.msg);
                    }
                }).catch((err) => {
                    console.log(err);
                })
            },
            addMonthItem(){
                this.monthPlanData.push(this.$fc.cloneKey(this.new_monthItem))
            },
            delMonthItem(index){
                this.monthPlanData.splice(index,1);
            },
            getMonthIndex(index){
                this.monthIndex = index;
            },
            selectMonthDay(date){
                for(let i = 0; i<this.monthPlanData.length;i++){
                    let dayHad = this.$fc.dateFormat(this.monthPlanData[i].triggerDay,'yyyy-MM-dd');
                    let monthHad = this.$fc.dateFormat(date,'yyyy-MM');
                    let monthPlan = this.$fc.dateFormat(this.planAddForm.planTime,'yyyy-MM');
                    if(this.monthIndex != i){
                        if(date === dayHad){
                            this.monthPlanData[this.monthIndex].triggerDay = '';
                            this.$Message.error("同一天不能添加两条以上计划！")
                        }
                        if(monthHad != monthPlan){
                            this.monthPlanData[this.monthIndex].triggerDay = '';
                            this.$Message.error("计划制定月份不符！")
                        }
                    }
                }
            },

            //designed by kp  计划任务相关  --end
            /************************************* 设备方案放大镜 end *********************************************************** */
            /*添加计划周期*/
            addPalnCycle: function () {
                switch (this.planAddForm.periodUnit) {
                    case 1:
                        for (let obj of this.dayData) {
                            if (!obj.durationTime) {
                                this.$Message.error("请将执行时间补充完整");
                                return;
                            }
                        }

                        if(this.dayData.length!=0){
                            this.$Message.error("一天内只能添加一条执行时间");
                            return;
                        }
                        this.dayData.push(this.$fc.cloneKey(this.new_dayData));
                        break;
                    /* case 1:
                     this.weekData.push(this.$fc.cloneKey(this.new_weekData));
                     break;*/
                    case 3:
                        for (let obj of this.monthData) {
                            if (!obj.durationTime) {
                                this.$Message.error("请将执行时间补充完整");
                                return;
                            }
                        }

                        if(this.monthData.length!=0){
                            let theObj=this.monthData[this.monthData.length-1];
                            for(let i=0;i<this.monthData.length-1;i++){
                                if (theObj.currentD==this.monthData[i].currentD)
                                {
                                    this.$Message.error("一天内只能添加一条执行时间，请修改");
                                    return;
                                }
                            }
                        }
                        this.monthData.push(this.$fc.cloneKey(this.new_monthData));
                        break;
                    case 4:
                        for (let obj of this.quarterData) {
                            if (!obj.durationTime) {
                                this.$Message.error("请将执行时间补充完整");
                                return;
                            }
                        }

                        this.quarterData.push(this.$fc.cloneKey(this.new_quarterData));
                        break;
                    case 5:
                        for (let obj of this.yearData) {
                            if (!obj.durationTime) {
                                this.$Message.error("请将执行时间补充完整");
                                return;
                            }
                        }

                        this.yearData.push(this.$fc.cloneKey(this.new_yearData));
                        break;
                }
            },
            /*删除计划周期*/
            delPlan: function (index) {
                switch (this.planAddForm.periodUnit) {
                    case 1:
                        this.dayData.splice(index, 1);
                        break;
                    /*case 1:
                     this.weekData.splice(index, 1);
                     break;*/
                    case 3:
                        this.monthData.splice(index, 1);
                        break;
                    case 4:
                        this.quarterData.splice(index, 1);
                        break;
                    case 5:
                        this.yearData.splice(index, 1);
                        break;
                }
            },
            /*初始开始时间格式化*/
            happenDate(date){
                let yearTime = new Date().getFullYear();
                let monthTime = new Date().getMonth() + 1;
                monthTime = monthTime < 10 ? '0' + monthTime : monthTime;
                let dayTime = new Date().getDate();
                dayTime = dayTime < 10 ? '0' + dayTime : dayTime;
                date = yearTime + "-" + monthTime + "-" + dayTime;
                return date
            },
            /************************************* 计划生效审核 start *********************************************************** */
            /*on-change时获取开始日期 格式化*/
            getStartTime(startTime){
                this.planAddForm.savePlanScheduleSetting.happenTime = startTime;
            },
            /*on-change时获取开始时间 格式化*/
            getHMSTime(time, hmsTime){
                if (time == "") {
                    hmsTime = time;
                } else {
                    let hTime = time.getHours();
                    let mTime = time.getMinutes();
                    let sTime = time.getSeconds();
                    hTime = hTime < 10 ? '0' + hTime : hTime;
                    mTime = mTime < 10 ? '0' + mTime : mTime;
                    sTime = sTime < 10 ? '0' + sTime : sTime;
                    hmsTime = hTime + ':' + mTime + ':' + sTime;
                }

                return hmsTime;
            },
            circleTypeChange(value){
                this.periodData = [];
            },
            timeChange(time){
                this.schaleTime = time;
            },

            /************************************   生效和保存前设置status  start    ******************************************/
            setStatusAndSavePlan: function (name) {
                let vm = this;
//                vm.planAddForm.status = 0;  // 制单
                this.$refs[name].validate((valid) => {
                    if (!valid) {
                        vm.$Message.error('请完善计划信息!');
                    } else {
//                        console.log('计划信息已经完善')
                        this.buttonType = "toSave";
                        this.save_loading = true;
                        vm.submintData();
                    }
                })
            },
            setStatusAndApply: function (name) {
                let vm = this;
//                vm.planAddForm.status = 1;   // 生效
                this.$refs[name].validate((valid) => {
                    if (!valid) {
                        this.$Message.error('请完善计划信息!');
                    } else {
                        this.buttonType = "toApply";
                        this.commint_loading = true;
                        vm.submintData();
                    }
                })
            },
            /************************************   生效和保存前设置status  end    ******************************************/
            changeTime(date) {
                this.planAddForm.savePlanScheduleSetting.happenTime = date;
            },
            //返回上一页
            goBack() {
                this.$router.back();
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
    .deleteTab {
        margin-left: 30px;
    }
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

    .onlyDay {
        text-align: left;
    }

    .onlyDay .ivu-date-picker-header, .onlyDay .ivu-date-picker-cells-header, .onlyDay .ivu-date-picker-cells-cell-prev-month, .onlyDay .ivu-date-picker-cells-cell-next-month {
        display: none;
    }

    .cicrleTable table {
        table-layout: fixed;

    }
    .ivu-form-item-required .ivu-form-item-label:before{
        content: '*';
        display: inline-block;
        margin-right: 4px;
        line-height: 1;
        font-family: SimSun;
        font-size: 14px;
        color: #ed3f14;
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
</style>
