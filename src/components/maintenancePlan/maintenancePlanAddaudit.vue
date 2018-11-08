<template>
    <div class="basic fault-content">
        <Spin fix v-show="load_fix">
            <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
            <div>保存中，请稍后...</div>
        </Spin>
        <!--模块名称-->
        <div class="title">
            <!--<span>计划管理-{{this.pageTitle == !this.thePlanTaskId ? "编辑 " + "（" + this.planAddForm.controlTypeName + "）" : "新建"}}</span>-->
            <span>计划管理-待审核</span>
            <div class="progressContent">
                <div class="second-title mar-t-25">审核进度</div>
                <Steps :current="1">
                    <Step title="已制单" content=""></Step>
                    <Step title="待审核" content=""></Step>
                    <Step title="已驳回" content=""></Step>
                    <Step title="已批准" content=""></Step>
                    <Step title="已生效" content=""></Step>
                </Steps>
            </div>
        </div>
        <!--表单--><!--code、name、busiType、planLevel、statusName、requiredTime、-->
        <div class="form-content">
            <Form ref="planAddForm" :model="planAddForm" label-position="right" inline :label-width="135" :rules="ruleValidate">
                <Form-item label="计划编码" prop="code">
                    <Input v-model="planAddForm.code" style="width: 160px;" placeholder="" disabled></Input>
                </Form-item>
                <Form-item label="计划名称" prop="name">
                    <Input v-model="planAddForm.name" @on-blur="planAddForm.name = toValidate(planAddForm.name)" style="width: 160px;" placeholder="" disabled></Input>
                </Form-item>
                <Form-item label="计划类型" prop="type">
                    <Select v-model="planAddForm.busiType" style="width: 160px;" disabled>
                        <Option v-for="item in planAddForm.busiTypeArr" :value="item.code" :key="item.code">{{ item.desc }}</Option>
                    </Select>
                </Form-item>
                <Form-item label="计划层级" prop="planLevel">
                    <Select style="width: 160px;" disabled>
                        <Option :value="年计划">年计划</Option>
                        <Option :value="月计划">月计划</Option>
                    </Select>
                </Form-item>
                <Form-item label="提醒提前期（天）">
                    <Input style="width: 160px;" placeholder="" v-model="planAddForm.notifyLeadTime" disabled></Input>
                </Form-item>
                <Form-item label="单据下发提前期（天）">
                    <Input style="width: 160px;" placeholder="" v-model="planAddForm.dispatchLeadTime" disabled></Input>
                </Form-item>
                <Form-item label="计划状态" prop="statusName">
                    <!--<Input style="width: 160px;" placeholder="" v-model="planAddForm.statusName" disabled></Input>-->
                    <Input style="width: 160px;" disabled></Input>
                </Form-item>
                <Form-item label="平均耗时（分钟）" prop="estimatedTime">
                    <Input v-model="planAddForm.estimatedTime" style="width: 160px;" placeholder="" disabled></Input>
                </Form-item>
                <Form-item class="ivu-form-item-required" label="计划制定年份" prop="planTime" v-show="!this.thePlanTaskId">
                    <DatePicker v-model="planAddForm.planYear" :options="options0" type="year" placeholder="选择年份" style="width: 160px" :editable="false" disabled></DatePicker>
                </Form-item>
                <Form-item label="计划制定年份" prop="planYear" v-if="this.planAddForm.controlTypeCode===0">
                    <Input v-model="planAddForm.planYear" :open="false" placeholder="选择日期" style="width: 160px" disabled></Input>
                </Form-item>
                <Form-item label="有效期限" prop="limt">
                    <Select style="width: 160px;" disabled>
                        <Option :value="一年期">一年期</Option>
                        <Option :value="无限期">无限期</Option>
                    </Select>
                </Form-item>
                <!--<Form-item label="计划月份" prop="planYear" v-if="this.planAddForm.controlTypeCode===1">-->
                    <!--<Input v-model="planAddForm.planYear" :open="false"  placeholder="选择日期"-->
                           <!--style="width: 160px" disabled></Input>-->
                <!--</Form-item>-->
                <!--<Form-item label="计划日期" prop="planYear" v-if="this.planAddForm.controlTypeCode===2||this.planAddForm.controlTypeCode===3">-->
                    <!--<Input v-model="planAddForm.planYear" :open="false"  placeholder="选择日期"-->
                           <!--style="width: 160px" disabled></Input>-->
                <!--</Form-item>-->
                <Form-item label="制单人" prop="createBy">
                    <Input v-model="planAddForm.createBy" style="width: 160px;" placeholder="" disabled></Input>
                </Form-item>
                <Form-item label="制单日期" prop="createAt">
                    <Date-picker v-model="planAddForm.createAt" :open="false" type="datetime" placeholder="选择日期和时间" style="width: 160px;" disabled readonly></Date-picker>
                </Form-item>
                <Form-item label="最后修改人" prop="updateByName">
                    <Input v-model="planAddForm.updateByName" style="width: 160px;" placeholder="" disabled></Input>
                </Form-item>
                <Form-item label="最后修改日期" prop="updateAt">
                    <Date-picker v-model="planAddForm.updateAt" :open="false" type="datetime" placeholder="选择日期和时间" style="width: 160px" disabled readonly></Date-picker>
                </Form-item>
                <!--<Form-item v-show="planAddForm.controlTypeCode==0" label="年度金额（万元）" prop="yearSum">-->
                    <!--<InputNumber v-model="planAddForm.estimatedMoney" :min="1" style="width: 160px;"-->
                                 <!--disabled></InputNumber>-->
                <!--</Form-item>-->
                <!--<Form-item v-show="planAddForm.controlTypeCode==1" label="月度金额（万元）" prop="yearSum">-->
                    <!--<InputNumber v-model="planAddForm.estimatedMoney" :min="1" style="width: 160px;"-->
                                 <!--disabled></InputNumber>-->
                <!--</Form-item>-->
                <!--<Form-item v-show="planAddForm.controlTypeCode==2" label="当日金额（万元）" prop="yearSum">-->
                    <!--<InputNumber v-model="planAddForm.estimatedMoney" :min="1" style="width: 160px;"-->
                                 <!--disabled></InputNumber>-->
                <!--</Form-item>-->
                <!--<Form-item v-show="planAddForm.controlTypeCode==3" label="计划金额（万元）" prop="yearSum">-->
                    <!--<InputNumber v-model="planAddForm.estimatedMoney" :min="1" style="width: 160px;"-->
                                 <!--disabled></InputNumber>-->
                <!--</Form-item>-->
                <!--<Form-item label="" style="width: 10px;">-->
                    <!--<span class="ivu-form-item" style="margin: 15px -8px;font-size: 15px;cursor: pointer;color: #0391da;" @click="account = true"><Icon type="information-circled"></Icon>（金额计算说明）</span>-->
                <!--</Form-item>-->
            </Form>
        </div>
        <div class="second-title">
            保养设备
            <!--<span style="color:red;padding-left:0.6%;">(&nbsp计划类型发生改变时，已选方案将会被清空，请谨慎操作&nbsp)</span>-->
        </div>
        <div class="table-reset">
            <table class="table table-bordered table-center table-striped table-blue table-standWork table-edit taDisplay">
                <thead>
                <tr>
                    <th class="wid-5">序号</th>
                    <th>目标设备</th>
                    <th>标准方案</th>
                    <th>方案版本</th>
                    <th>设备分类</th>
                    <th>设备类型</th>
                    <th>设备安装地点</th>
                    <th>是否停机</th>
                    <th>平均耗时（分钟）</th>
                    <th>执行岗位</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(equ,index) in equ_display" class="trDisplay">
                    <td>{{index + 1}}</td>
                </tr>
                </tbody>
                <!--<tbody>-->
                <!--<tr v-for="(equ,index) in equ_display" class="trDisplay">-->
                    <!--<td>{{index + 1}}</td>-->
                    <!--<td class="tdDisplay pointDis" :title="equ.title">-->
                        <!--{{equ.title}}-->
                    <!--</td>-->
                    <!--<td>-->
                        <!--<div class="input-search " @click="plan_choose_show(index)">-->
                            <!--<Input readonly v-model="equ.plan_name"></Input>-->
                            <!--<Button icon="ios-search"></Button>-->
                        <!--</div>-->
                    <!--</td>-->
                    <!--<td>{{equ.job}}</td>-->
                    <!--<td>-->
                        <!--&lt;!&ndash;<Dropdown style="margin-left: 20px">&ndash;&gt;-->
                        <!--&lt;!&ndash;<Button type="primary" style="width:80px;">&ndash;&gt;-->
                        <!--&lt;!&ndash;{{equ.version}}&ndash;&gt;-->
                        <!--&lt;!&ndash;<Icon type="arrow-down-b"></Icon>&ndash;&gt;-->
                        <!--&lt;!&ndash;</Button>&ndash;&gt;-->
                        <!--&lt;!&ndash;<DropdownMenu slot="list">&ndash;&gt;-->
                        <!--&lt;!&ndash;<DropdownItem v-for="version in equ.versions">{{ version.version}}</DropdownItem>&ndash;&gt;-->

                        <!--&lt;!&ndash;</DropdownMenu>&ndash;&gt;-->
                        <!--&lt;!&ndash;</Dropdown>&ndash;&gt;-->

                        <!--<p v-if="!equ.version"></p>-->
                        <!--<Dropdown v-if="equ.version&&equ.versions.length>1" trigger="click" @on-click="change_version">-->
                            <!--<a href="javascript:void(0)">-->
                                <!--版本{{equ.version}}-->
                                <!--<Icon type="arrow-down-b"></Icon>-->
                            <!--</a>-->
                            <!--<DropdownMenu slot="list">-->
                                <!--<DropdownItem v-for="version in equ.versions" v-if="version.version!=equ.version"-->
                                              <!--:name="version.version+'#'+index" :key="version">-->
                                    <!--版本{{version.version}}-->
                                <!--</DropdownItem>-->
                            <!--</DropdownMenu>-->
                        <!--</Dropdown>-->
                        <!--<a v-if="equ.version&&equ.versions.length==1">版本{{equ.version}}</a>-->
                        <!--&lt;!&ndash;<Select v-model="equ.version" style="width: 160px;">&ndash;&gt;-->
                        <!--&lt;!&ndash;<Option v-for="version in equ.versions" :value="version.id" :key="version.id">&ndash;&gt;-->
                        <!--&lt;!&ndash;{{ version.version}}&ndash;&gt;-->
                        <!--&lt;!&ndash;</Option>&ndash;&gt;-->
                        <!--&lt;!&ndash;</Select>&ndash;&gt;-->
                    <!--</td>-->
                    <!--<td>{{equ.stop == 0 ? '是' : '否'}}</td>-->
                    <!--<td class="num_right">{{equ.cost}}</td>-->
                    <!--<td class="wid-10 num_right">-->
                        <!--<Input v-model=equ.price @on-change="toTestIsNAN(equ.price,index)"></Input>-->
                    <!--</td>-->
                    <!--<td><a class="mar-r-5" size="small" @click="delete_equ(index)">删除</a></td>-->
                <!--</tr>-->
                <!--</tbody>-->
            </table>
        </div>
        <div class="mar-t-10 mar-b-25">
            <Button type="primary" icon="plus-round" size="small" @click="equ_choose=true" disabled>添加设备</Button>
            <!--<div class="f_r mar-r-20  col-blue" style="font-size:16px;">总金额(元)：-->
                <!--<span class="col-orange">{{price_sum}}</span>-->
                <!--<p style="font-size:14px;margin-right:0px;">(保留小数点后两位小数)</p>-->
            <!--</div>-->
        </div>
        <div class="second-title">计划时间</div>
        <Form :model="savePlanSchedule" label-position="right" inline :label-width="135">
            <Form-item label="调度类型" prop="circleType">
                <Select v-model="savePlanSchedule.circleType" on-change="circleTypeChange" style="width: 160px;" disabled>
                    <Option value="0">周期计划</Option>
                    <Option value="1">临时计划</Option>
                </Select>
            </Form-item>
        </Form>
        <div v-if="savePlanSchedule.circleType == '0'">
            <Form :model="savePlanSchedule" label-position="right" inline :label-width="135">
                <Form-item label="开始时间" prop="happenTime">
                    <DatePicker type="date" v-model="savePlanSchedule.savePlanScheduleSetting.happenTime" :options="disabledDay" placeholder="选择日期" :editable='editable' @on-change="getStartTime" disabled></DatePicker>
                </Form-item>
                <Form-item label="触发间隔" prop="">
                    <!--<Select v-model="savePlanSchedule.periodUnit" @on-change="changePeriodUnit" style="width: 135px">-->
                        <!--&lt;!&ndash;@on-change="savePlanScheduleHappenTime"&ndash;&gt;-->
                        <!--<Option v-for="item in periodUnitType" :value="item.code" :key="item">{{ item.desc }}</Option>-->
                    <!--</Select>-->
                    <Select style="width: 160px;" disabled>
                        <Option :value="半年">半年</Option>
                        <Option :value="一年">一年</Option>
                        <Option :value="季度">季度</Option>
                    </Select>
                </Form-item>
                <!--<span class="line-30 mar-tb-10 display-in-b col-red">(&nbsp提醒：录入非精确时间（几点几分）时，请选择是否为生产时间&nbsp)</span>-->
                <Form-item label="计划归档:" prop="link">
                    <p style="display: inline-block; margin-right: 50px;"><a>P007E</a></p>
                    <!--<p style="display: inline-block"><a>二/三级保养方案</a></p>-->
                </Form-item>
                <!--表格-->
                <div class="cicrleTable">
                    <div class="table-content" v-if="savePlanSchedule.periodUnit == 1">
                        <table class="table table-bordered table-center table-striped table-blue table-edit taDisplay">
                            <thead>
                            <tr>
                                <th>序号</th>
                                <th>执行日期</th>
                                <th>执行时间</th>
                                <th>执行时间段</th>
                                <th>操作</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="(planTask,index) in dayData" class="trDisplay">
                                <td>{{index + 1}}</td>
                                <td>每天</td>
                                <td>
                                    <TimePicker :editable="false" class="timePicker necessary" v-model="planTask.durationTime" format="HH:mm:ss" placeholder="选择时间"></TimePicker>
                                </td>
                                <td>
                                    <Select v-model="planTask.execTime" style="width: 160px;">
                                        <Option value="1">非生产时间</Option>
                                        <Option value="0">生产时间</Option>
                                    </Select>
                                </td>
                                <td><a class="mar-r-5" size="small" @click="delPlan(index)">删除</a></td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="table-content" v-else-if="savePlanSchedule.periodUnit == 3">
                        <table class="table table-bordered table-center table-striped table-blue table-edit">
                            <thead>
                            <tr>
                                <th>序号</th>
                                <th style="width:15%">执行日期</th>
                                <th>执行时间</th>
                                <th>执行时间段</th>
                                <th>操作</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="(planTask,index) in monthData">
                                <td>{{index + 1}}</td>
                                <td>
                                    <Select v-model="planTask.currentD">
                                        <Row>
                                            <Col span="4" v-for="item in planTask.execDay" :key="item.value">
                                                <Option :value="item.value" style="padding: 7px 0;">{{ item.label }}</Option>
                                            </Col>
                                        </Row>
                                    </Select>
                                </td>
                                <td>
                                    <TimePicker class="timePicker necessary" v-model="planTask.durationTime" format="HH:mm:ss" placeholder="选择时间"></TimePicker>
                                </td>
                                <td>
                                    <Select v-model="planTask.execTime" style="width: 160px;">
                                        <Option value="1">非生产时间</Option>
                                        <Option value="0">生产时间</Option>
                                    </Select>
                                </td>
                                <td><a class="mar-r-5" size="small" @click="delPlan(index)">删除</a></td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="table-content" v-else-if="savePlanSchedule.periodUnit == 4">
                        <table class="table table-bordered table-center table-striped table-blue table-edit">
                            <thead>
                            <tr>
                                <th>序号</th>
                                <th>执行月份</th>
                                <th style="width:15%;">执行日期</th>
                                <th>执行时间</th>
                                <th>执行时间段</th>
                                <th>操作</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="(planTask,index) in quarterData">
                                <td>{{index + 1}}</td>
                                <td>
                                    <Select v-model="planTask.currentM">
                                        <Option v-for="item in planTask.execMonth" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                    </Select>
                                </td>
                                <td>
                                    <Select v-model="planTask.currentD">
                                        <Row>
                                            <Col span="4" v-for="item in planTask.execDay" :key="item.value">
                                                <Option :value="item.value" style="padding: 7px 0;">{{ item.label }}</Option>
                                            </Col>
                                        </Row>
                                    </Select>
                                </td>
                                <td>
                                    <TimePicker class="timePicker necessary" v-model="planTask.durationTime" format="HH:mm:ss" placeholder="选择时间"></TimePicker>
                                </td>
                                <td>
                                    <Select v-model="planTask.execTime" style="width: 160px;">
                                        <Option value="1">非生产时间</Option>
                                        <Option value="0">生产时间</Option>
                                    </Select>
                                </td>
                                <td><a class="mar-r-5" size="small" @click="delPlan(index)">删除</a></td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="table-content" v-else-if="savePlanSchedule.periodUnit == 5">
                        <table class="table table-bordered table-center table-striped table-blue table-edit">
                            <thead>
                            <tr>
                                <th>序号</th>
                                <th>执行月份</th>
                                <th>执行日期</th>
                                <th>执行时间</th>
                                <th>执行时间段</th>
                                <th>操作</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="(planTask,index) in yearData">
                                <td>{{index + 1}}</td>
                                <td>
                                    <Select v-model="planTask.currentM">
                                        <Option v-for="item in planTask.execMonth" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                    </Select>
                                </td>
                                <td>
                                    <Select v-model="planTask.currentD">
                                        <Row>
                                            <Col span="4" v-for="item in planTask.execDay" :key="item.value">
                                                <Option :value="item.value" style="padding: 7px 0;">{{ item.label }}</Option>
                                            </Col>
                                        </Row>
                                    </Select>
                                </td>
                                <td>
                                    <TimePicker class="timePicker necessary" v-model="planTask.durationTime" format="HH:mm:ss" placeholder="选择时间"></TimePicker>
                                </td>
                                <td>
                                    <Select v-model="planTask.execTime">
                                        <Option value="1">非生产时间</Option>
                                        <Option value="0">生产时间</Option>
                                    </Select>
                                </td>
                                <td><a class="mar-r-5" size="small" @click="delPlan(index)">删除</a></td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="mar-t-10 mar-b-25">
                        <Button type="primary" icon="plus-round"  size="small" @click="addPalnCycle">添加</Button>
                    </div>
                </div>
            </Form>
            <div class="applyRecord">
                <div class="second-title">审核记录</div>
                <div class="mar-b-20">
                    <Form ref="scrapForm" :model="scrapForm" :label-width="100" inline>
                        <FormItem label="审核状态" prop="applyStatus">
                            <Input v-model="scrapForm.scrapApplyStatus" placeholder="" readonly="readonly"></Input>
                        </FormItem>
                        <FormItem label="最新反馈日期" prop="feedbackDate">
                            <Input v-model="scrapForm.feedbackDate" placeholder="" readonly="readonly"></Input>
                        </FormItem>
                    </Form>
                    <Table class="table-edit" stripe border :columns="scrapColumns" :data="scrapData"></Table>
                </div>
            </div>
        </div>
        <div v-else>
            <Form :model="savePlanSchedule" label-position="right" inline :label-width="135">
                <Form-item label="执行日期" prop="happenTime">
                    <DatePicker type="date" v-model="savePlanSchedule.savePlanScheduleSetting.happenTime" :options="disabledDay" placeholder="选择日期" :editable='editable' @on-change="getStartTime"></DatePicker>
                </Form-item>
                <Form-item label="执行时间" prop="happenHMS">
                    <TimePicker class="timePicker necessary" v-model="savePlanSchedule.savePlanScheduleSetting.happenHMS" @on-change="timeChange" format="HH:mm:ss" placeholder="选择时间"></TimePicker>
                </Form-item>
                <Form-item label="执行时间段" prop="execTime">
                    <Select v-model="savePlanSchedule.execTime" style="width: 160px;">
                        <Option value="1">非生产时间</Option>
                        <Option value="0">生产时间</Option>
                    </Select>
                </Form-item>
                <span class="line-30 mar-tb-10 display-in-b col-red">&nbsp提醒：录入非精确时间（几点几分）时，请选择是否为生产时间。&nbsp</span>
            </Form>
        </div>
        <!--操作按钮-->
        <Row class="btn-group">
            <Col class="pad-15" span="24" align="center">
            <router-link to='/maintenancePlan' class="mar-r-15">
                <Button class="btn-gary" icon="close" size="large">取消</Button>
            </router-link>
            <Button type="primary" icon="checkmark" size="large" :loading="commint_loading" @click="setStatusAndApply('planAddForm')" v-show="planAddForm.statusCode!=2">批准</Button>
            <Button type="primary" icon="document-text" size="large" :loading="save_loading" @click="setStatusAndSavePlan('planAddForm')">驳回</Button>
            <Button v-show="planAddForm.statusCode==2" type="primary" icon="trash-a" size="large">作废</Button>
            <!--<Button type="primary" icon="document-text" size="large" :loading="save_loading"-->
                    <!--@click="setStatusAndSavePlan('planAddForm')">保存草稿-->
            <!--</Button>-->
            <!--<Button type="primary" icon="checkmark" size="large" :loading="commint_loading"-->
                    <!--@click="setStatusAndApply('planAddForm')" v-show="planAddForm.statusCode!=2">提交审核-->
            <!--</Button>-->
            <!--<Button v-show="planAddForm.statusCode==2" type="primary" icon="trash-a" size="large">作废</Button>-->
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
        <Modal v-model="plan_choose" title="标准方案" @on-ok="toSelect_plan()">
            <standard_plan @planSelected="plan_hasSelected" :planType="planAddForm.busiType" :equSite="equ_choose_obj.id"></standard_plan>
        </Modal>
        <Modal v-model="account" title="金额计算方式">
            <p>金额计算方式：</p>
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
            standard_plan: standard_plan,
            FormItem
        },
//        //designed by kp----方案的管理相关---start:
        watch: {
            "planAddForm.busiType": function () {
                if (this.equSelected[0] !== undefined) {
                    this.plan_choose_obj = "";
                    this.version_choose_obj = "";
                    for (var i = 0; i < this.equ_display.length; i++) {
                        this.equ_display[i].versions = "";//版本信息
                        this.equSelected[i].versions = "";
                        this.equ_display[i].plan_name = "";
                        this.equSelected[i].plan_name = "";
                        this.equ_display[i].plan_id = "";
                        this.equSelected[i].plan_id = "";

                        this.equ_display[i].job = "";
                        this.equSelected[i].job = "";
                        this.equ_display[i].exeRoleId = "";
                        this.equSelected[i].exeRoleId = "";
                        this.equ_display[i].version = "";
                        this.equSelected[i].version = "";  //默认版本
                        this.equ_display[i].version_id = "";
                        this.equSelected[i].version_id = "";//默认版本的版本id
                        this.equ_display[i].stop = "";//是否停机
                        this.equSelected[i].stop = "";
                        this.equ_display[i].cost = "";//预计耗时
                        this.equSelected[i].cost = "";
                        this.equ_display[i].price = "";//预计耗时
                        this.equSelected[i].price = "";
                    };
//                    this.equ_display = [];
//                    this.equSelected = [];
                }
                else {
//                alert("不执行");
                }
            },
        },
        //designed by kp----方案的管理相关---end:
        data()
        {
            //验证名称
            const validateAge = (rule, value, callback) => {

            };
            return {
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
                //编辑页面渲染
                thePlanTaskId: '',
                pageTitle: '',
                //designed by kp  计划任务变量定义   --satrt
                emptyPlan_tip: false,
                planDatas: "",
                planId: "",
                //设备选择相关---》
                equ_choose: false,
                equSelected: [],
                equ_display: [],
                equ_choose_obj: "",
                //方案类型选择
                has_click: false,
                plan_name: "",
                plan_choose: false,
                plan_choose_obj: "",
                version_choose_obj: "",
                theItem: "",
                price_sum: 0,
                //designed by kp  --end
                scrapForm:{
                    applyStatus:'',
                    feedbackDate:"",
                },
                scrapColumns:[
                    {
                        title: '序号',
                        type: 'index',
                        width: 80,
                        align: 'center'
                    },
                    {
                        title: '反馈结果',
                        key: 'feedback',
                        align: 'center',
                        render: (h, params) => {
                            return h('p', {
                                domProps: {
                                    title: params.row.feedback
                                },
                                class: 'iview_tabDis',
                            }, params.row.feedback)
                        },
                    },
                    {
                        title: '驳回意见',
                        key: 'rejectMess',
                        align: 'center',
                        render: (h, params) => {
                            return h('p', {
                                domProps: {
                                    title: params.row.rejectMess
                                }
                            }, params.row.rejectMess)
                        }
                    },
                    {
                        title: '处理人',
                        key: 'handleMan',
                        align: 'center',
                        render: (h, params) => {
                            return h('p', {
                                domProps: {
                                    title: params.row.handleMan
                                },
                                class: 'iview_tabDis',
                            }, params.row.handleMan)
                        },
                    },
                    {
                        title: '处理日期',
                        key: 'handleDate',
                        align: 'center',
                        render: (h, params) => {
                            return h('p', {
                                domProps: {
                                    title: params.row.handleDate
                                },
//                                class: 'iview_tab_numDis',
                            }, params.row.handleDate)
                        },
                    },
                    {
                        title: '处理信息',
                        key: 'handleMess',
                        align: 'center',
                    },
                    {
                        title: '备注',
                        key: 'remarks',
                        align: 'center'
                    },
                ],
                scrapData:[
                    {
                        feedback: '待审核',
                        rejectMess: '',
                        handleMan: '主管',
                        handleDate: '2018/7/31 10:09:01',
                        handleMess: '提交审核',
                        remarks: '',
                    },
                ],
                //临时字段...
                tmp: {
//                    //任务计划
                    tmpPlanTaskIndex: 0,
                },
                //临时字段...
                isubmit: false,
                isubmit_save_plan_force_timeCheck: false,
                isubmit_save_plan2_force: false,
                load_fix: false,
                pageSize: 5,
                self: this,
                modal1: false,
                work_code: false,
                save_plan3: false,
                save_plan3_check: false,//不需要判断计划超出工时
                /*button_14431: this.$rt('14431'),
                 button_14432: this.$rt('14432'),
                 button_14433: this.$rt('14433'),*/
                planAddForm: {
                    planID: '',
                    code: "",
                    name: '',
                    busiTypeArr: this.$base_info.planType2,
                    busiType: this.$base_info.planType2[0].code,
                    planLevelArr: this.$base_info.planClazz2,
                    planLevel: this.$base_info.planClazz2[0].code,
                    statusName: '',
                    estimatedTime: '',
                    createAt: "",
                    createBy: "",
                    updateByName: '',
                    updateAt: '',
                    planYear: '',
                    estimatedMoney: null,

//                    status: '',
                    shiftName: '',
                    teamId: '',
                    updateBy: '',
                    updateAtName: '',
                    teamSumWorkingHours: 0, /*班组工时*/
                    firstStartTime: new Date(),
//                    intervaltime: 1,
                    intervaltimeUnit: 'day',
//                    nextStartTime: '',
                    controlTypeName: '',
                    controlTypeCode: '',
                    dispatchLeadTime: 0,
                    notifyLeadTime: 0,
                },
                ruleValidate: {
                    name: [
                        {required: true, message: '内容不能为空', trigger: 'blur'},
                        {type: 'string', max: 60, message: '计划名称不能超出60个字', trigger: 'change'}
                    ],
//                    planTime: [
//                        {required: true,type:'date', message: '内容不能为空', trigger: 'blur'},
//                    ],
                    shiftName: [
                        {required: true, message: '内容不能为空', trigger: 'change'}
                    ],
                },
                /*计划任务 start*/
                savePlanTaskList: [],
                /*计划任务 end*/
                /*计划频率 start*/
                savePlanSchedule: {
                    circleType: '0', /*循环方式*/
                    periodUnit: 1,
                    savePlanScheduleSetting: {
                        happenTime: this.happenDate(), //new Date(new date().getTime() + 1000 * 60 *60 *24)*/
                        happenHMS: ''
                    },
                    execTime: "0"
                },
                /*计划频率 end */
                /*下拉框 start*/
                /*循环周期*/
                /*开始时间今天之前日期禁止点击*/
                disabledDay: {
                    disabledDate (date) {
                        return date && date.valueOf() < Date.now() - 86400000;
                    }
                },
                periodUnitType: [
                    /*{
                     code: 0 ,
                     name: "每天",
                     },
                     /!*{
                     code: 1,
                     name: "每周",
                     },*!/
                     {
                     code: 2,
                     name: "每月",
                     },
                     {
                     code: 3,
                     name: "每季度",
                     },
                     {
                     code: 4,
                     name: "每年",
                     },*/
                ],
                new_dayData: {
                    currentM: null,
                    currentD: null,
                    durationTime: '',
                    execTime: "0"
                },
                dayData: [],
                /*new_weekData: {
                 execDate:'7',
                 durationTime:'每周',
                 execTime:'offWorkTime'
                 },
                 weekData: [],*/
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
                /*设备放大镜start*/
                locationId: '',
                /*设备放大镜end*/
                submintDataForm: [],
                editable: false,
                schaleTime: "",
                options0 : {
                    disabledDate (date) {
                        let dates = new Date;
                        let year = dates.getFullYear();
                        let time = new Date(year.toString()+'-01-01');
                        return  date &&date.valueOf() < time.valueOf() - 86400000;
                    }
                },
                account:false,
            }
        },
        mounted()
        {
            /*触发间隔 数据*/
//            this.toNowTime();
            this.periodUnitType = this.$base_info.planIntervalTime2;
//            console.log("触发间隔枚举===============》");
//            console.log(this.$base_info.planIntervalTime2);
            //列表页传来的计划id.由它判断是来源于新增还是编辑
            this.planId = this.$route.query.planTaskId;
            if (this.planId) {
                this.getPlanDetail();
            }
            //this.initNewPlan();
            var id = this.$route.query.planTaskId;
            this.initNewPlan(id);
            this.thePlanTaskId = id;
        },
        computed: {},
        methods: {
            //验证输入框格式
            toValidate(msg){
                console.log(msg);
                var str = /[=+%!<>"'/_,()\\]/
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
            /*预览编辑计划周期*/
            viewPlanExec(planId){
                this.$axios.post('/plan/getYearPlanTime', {
                    planId: planId
                }).then((res) => {
                    let showData = res.data.response.data;
                    this.savePlanSchedule.circleType = '' + showData[0].timeType + '';
                    if (showData[0].timeType == 0) {
                        this.savePlanSchedule.periodUnit = showData[0].intervalTime;
                        this.savePlanSchedule.savePlanScheduleSetting.happenTime = showData[0].beginTime;
                        for (let i = 0; i < showData[1].length; i++) {
                            switch (this.savePlanSchedule.periodUnit) {
                                case 1:/*天*/
                                    this.dayData.push({
                                        currentM: null,
                                        currentD: null,
                                        durationTime: showData[1][i].triggerTime,
                                        execTime: '' + showData[1][i].isProductTime + ''
                                    });
                                    break;
                                case 3:/*月*/
                                    this.monthData.push({
                                        currentM: null,
                                        currentD: showData[1][i].triggerDay,
                                        execDay: this.getExecDay(),
                                        durationTime: showData[1][i].triggerTime,
                                        execTime: '' + showData[1][i].isProductTime + ''
                                    });
                                    break;
                                case 4:/*季度*/
                                    this.quarterData.push({
                                        currentM: showData[1][i].triggerMonth,
                                        execMonth: this.getExecMonth(4),
                                        currentD: showData[1][i].triggerDay,
                                        execDay: this.getExecDay(),
                                        durationTime: showData[1][i].triggerTime,
                                        execTime: '' + showData[1][i].isProductTime + ''
                                    });
                                    break;
                                case 5:/*年、季度*/
                                    this.yearData.push({
                                        currentM: showData[1][i].triggerMonth,
                                        execMonth: this.getExecMonth(5),
                                        currentD: showData[1][i].triggerDay,
                                        execDay: this.getExecDay(),
                                        durationTime: showData[1][i].triggerTime,
                                        execTime: '' + showData[1][i].isProductTime + ''
                                    });
                                    break;
                            }
                        }
                    } else {
                        this.savePlanSchedule.savePlanScheduleSetting.happenTime = showData[1][0].triggerDate;
                        this.savePlanSchedule.savePlanScheduleSetting.happenHMS = showData[1][0].triggerTime;
                        this.savePlanSchedule.execTime = '' + showData[1][0].isProductTime + '';
                    }
                }).catch((err) => {
                    console.log(err);
                });
            },
            viewTempPlan(id){
                //哈哈哈
                this.$axios.post('/plan/getTempPlanTime', {
                    planId: id
                }).then((res) => {
                    let respone = res.data.response;
                    if (respone.code == 1) {
                        let planData = res.data.response.data;
                        this.savePlanSchedule.circleType = '' + planData.type + '';
                        this.savePlanSchedule.savePlanScheduleSetting.happenTime = planData.date;
                        this.savePlanSchedule.execTime = '' + planData.product;
                        this.savePlanSchedule.savePlanScheduleSetting.happenHMS = planData.time;
                        this.schaleTime = this.savePlanSchedule.savePlanScheduleSetting.happenHMS;
                    } else {
                        this.$Message.error("错误 +" + respone.msg);
                    }
                }).catch((err) => {
                    console.log(err);
                });
            },
            /*计划周期 E*/
            //初始化表单--byxulin
            initNewPlan(planId){
                if (!planId) {
                    this.$axios.get('/plan/initNewPlan').then((res) => {
                        var ret = res.data.response;
                        console.log(ret);
//                         console.log('333+' + JSON.stringify(ret));
                        if (ret.code == 1) {
//                            console.log(ret.name);
                            this.planAddForm.code = ret.data.planCode;//计划编码
                            this.planAddForm.statusName = ret.data.planStatusName;//计划状态名称
                            this.planAddForm.createBy = ret.data.userName;// 制单人
                            this.planAddForm.updateByName = ret.data.userName;// 最后修改人
                            this.planAddForm.createAt = ret.data.time;//制单日期
                            this.planAddForm.updateAt = ret.data.time;//最后修改日期
//                            this.planAddForm.estimatedTime = ret.data.estimatedTime;
                        }
                    }).catch((err) => {
                        console.log(err);
                    });
                } else {
                    this.$axios.post('/plan/searchPlanById', {
                        id: planId
                    }).then((res) => {
                        let ret = res.data.response;
                        console.log(ret);
                        if (ret.code == 1) {
                            this.planAddForm.code = ret.data.code;// 计划编码
                            this.planAddForm.name = ret.data.name;//计划名称
                            this.planAddForm.typeName = ret.data.typeName;//计划类型名称
                            this.planAddForm.clazzName = ret.data.clazzName;// 计划等级名称
                            this.planAddForm.statusName = ret.data.statusName;//计划状态名称
                            this.planAddForm.estimatedTime = ret.data.estimatedTime;//累计用时(分钟)
                            this.planAddForm.createBy = ret.data.createBy;//创建者名称
                            this.planAddForm.createAt = ret.data.createAt;//创建时间
                            this.planAddForm.updateByName = ret.data.updateBy;// 更新者名称
                            this.planAddForm.updateAt = ret.data.updateAt;// 更新时间
                            this.planAddForm.planYear = ret.data.planTime;// 计划制定年份
                            this.planAddForm.estimatedMoney = ret.data.estimatedMoney;// 累计金钱(万元)
                            this.planAddForm.busiType = ret.data.typeCode;// 计划类型编码
                            this.planAddForm.clazzCode = ret.data.clazzCode;// 计划等级编码
                            this.planAddForm.statusCode = ret.data.statusCode;// 计划状态编码
                            this.planAddForm.controlTypeCode = ret.data.controlTypeCode;// 计划层级编码
                            this.planAddForm.controlTypeName = ret.data.controlTypeName;// 计划层级名称
                            this.planAddForm.notifyLeadTime = ret.data.notifyLeadTime; //提醒提前期
                            this.planAddForm.dispatchLeadTime = ret.data.dispatchLeadTime; //单据下发提前期
                            /*计划时间编辑*/
                            if (this.planId) {
                                if (this.planAddForm.controlTypeCode == 3) {
                                    this.viewTempPlan(this.planId);
                                }
                                else {
                                    this.viewPlanExec(this.planId);
                                };
                                this.planAddForm.planID = this.planId;
                            }
                        } else {
                            this.$Message.error(ret.msg);
                        }
                    }).catch((err) => {
                        console.log(err);
                    });
                }
            },
            /************************************* 计划任务 start *********************************************************** */
            //designed by kp  计划任务相关  --start
                //判断时和分：
            toNowTime(){
                {
                    var d = new Date();
//                    this.theData = d.toLocaleString().split(" ")[0];
                    console.log();
                    let year=d.toLocaleString().split(" ")[0].split("/")[0];
                    let month=d.toLocaleString().split(" ")[0].split("/")[1]>9?d.toLocaleString().split(" ")[0].split("/")[1]:"0"+d.toLocaleString().split(" ")[0].split("/")[1];
                    let day=d.toLocaleString().split(" ")[0].split("/")[2]>9?d.toLocaleString().split(" ")[0].split("/")[2]:"0"+d.toLocaleString().split(" ")[0].split("/")[2];
                    this.theData=year+month+day;
                    console.log(this.theData);
                    this.theMinut = d.getMinutes() > 9 ? d.getMinutes() : "0" + d.getMinutes();
                    this.theHour = d.getHours() > 9 ? d.getHours() : "0" + d.getHours();
//                    this.theSeconds = d.getSeconds() > 9 ? d.getSeconds() : "0" + d.getSeconds();
                    this.tempData=this.theData+this.theHour+this.theMinut;
                  return this.tempData;
                }
            },
            equ_dataSelectedDisa(message)
            {
                this.equSelected = message;
            },
            //弹框确认  --》
            toSelect_equSite()
            {
                this.equ_display = [];
                for (var i = 0; i < this.equSelected.length; i++) {
                    this.equ_display.push(this.$fc.cloneKey(this.equSelected[i]));
                    this.equ_display[i].plan_name = this.equSelected[i].plan_name ? this.equSelected[i].plan_name : "";
                    this.equ_display[i].plan_id = this.equSelected[i].plan_id ? this.equSelected[i].plan_id : "";
                    this.equ_display[i].job = this.equSelected[i].job ? this.equSelected[i].job : "";
                    this.equ_display[i].stop = this.equSelected[i].stop ? this.equSelected[i].stop : "";
                    this.equ_display[i].cost = this.equSelected[i].cost ? this.equSelected[i].cost : "";
                    this.equ_display[i].versions = this.equSelected[i].versions ? this.equSelected[i].versions : "";
                    this.equ_display[i].version = this.equSelected[i].version ? this.equSelected[i].version : "";
                    this.equ_display[i].version_id = this.equSelected[i].version_id ? this.equSelected[i].version_id : "";
                    this.equ_display[i].price = this.equSelected[i].version ? this.equSelected[i].price : "";
                };
            },
            //删除设备带出的行数据：
            delete_equ(item)
            {
                if (this.equSelected[item].price) {
                    this.price_sum = parseFloat(this.price_sum) * 1000000000000 - parseFloat(this.equSelected[item].price) * 1000000000000;
                    this.price_sum = (this.price_sum / 1000000000000).toFixed(2);
                };
                this.plan_choose_obj = "";
                this.equ_display[item].versions = this.plan_choose_obj.versionRows;//版本信息
                this.equSelected[item].versions = this.plan_choose_obj.versionRows;
                this.equ_display[item].plan_name = this.plan_choose_obj.solutionName;
                this.equSelected[item].plan_name = this.plan_choose_obj.solutionName;
                this.equ_display[item].plan_id = this.plan_choose_obj.solutionId;
                this.equSelected[item].plan_id = this.plan_choose_obj.solutionId;
                this.equ_display[item].job = this.plan_choose_obj.roleName;
                this.equSelected[item].job = this.plan_choose_obj.roleName;
                this.equ_display[item].exeRoleId = this.plan_choose_obj.exeRoleId;
                this.equSelected[item].exeRoleId = this.plan_choose_obj.exeRoleId;

                this.version_choose_obj = "";
                this.equ_display[item].version = this.version_choose_obj.version;
                this.equSelected[item].version = this.version_choose_obj.version;  //默认版本
                this.equ_display[item].version_id = this.version_choose_obj.eamStandardSolutionVersionId;
                this.equSelected[item].version_id = this.version_choose_obj.eamStandardSolutionVersionId;  //默认版本的版本id
                this.equ_display[item].stop = this.version_choose_obj.needShutdown;//是否停机
                this.equSelected[item].stop = this.version_choose_obj.needShutdown;
                this.equ_display[item].cost = this.version_choose_obj.requiredTime;//预计耗时
                this.equSelected[item].cost = this.version_choose_obj.requiredTime;
                this.equ_display[item].price = this.version_choose_obj.totalAmount; //备件金额
                this.equSelected[item].price = this.version_choose_obj.totalAmount;

                this.equSelected.splice(item, 1);
                this.equ_display.splice(item, 1);
//                this.timeCount();
            },
            //计算累计耗时
            timeCount: function () {
                if (this.equ_display[0] != undefined) {
                    let costVal = 0;
                    for (var i = 0; i < this.equ_display.length; i++) {
                        this.planAddForm.estimatedTime = 0;
                        costVal = costVal + this.equ_display[i].cost;
                    }
                    this.planAddForm.estimatedTime = costVal;
                } else {
                    this.planAddForm.estimatedTime = 0;
                }
            },
            plan_choose_show(item)
            {
                this.theItem = item;
                this.plan_choose = true;
                this.equ_choose_obj = this.equ_display[item];
//                console.log( this.equ_choose_obj);
            },
            plan_hasSelected(message)
            {
                this.plan_choose_obj = message;
                this.has_click = true;
//                let version_message=this.plan_choose_obj.eamStandardSolutionVersions;
            },
            //金额改变
            //验证是否是正整数
            //验证是否是正整数
            toTestIsNAN(x, item)
            {
                this.equSelected[item].price = x;
                if ((!isNaN(x)) && (x >= 0)) {
                    if (x.length > 10) {
//                        alert("1");
                        this.$Message.error('备件金额最多为10个字符');
                        this.price_sum = "请输入正确格式的备件金额";
                        return;
                    }
                    else {
//                        alert("2");
                        this.price_sum = 0;
                        for (var i = 0; i < this.equSelected.length; i++) {
//                            alert("3");
                            if (this.equSelected[i].price) {
                                this.price_sum = Number(this.price_sum) * 1000000000000 + Number(this.equSelected[i].price) * 1000000000000;
                                this.price_sum = (this.price_sum / 1000000000000).toFixed(2);
                            };
                        };
                    };
                }
                else {
//                    alert("4");
                    this.$Message.error('备件金额为空或大于0的数字');
                    this.price_sum = "请输入正确格式的备件金额";
                };
            },
            toSelect_plan()
            {
                console.log(this.plan_choose_obj)
                if (!this.has_click) {
                    return;
                };
                let v_obj = false;
                this.equ_display[this.theItem].versions = this.plan_choose_obj.versionRows;//版本信息
                this.equSelected[this.theItem].versions = this.plan_choose_obj.versionRows;
                this.equ_display[this.theItem].plan_name = this.plan_choose_obj.solutionName;
                this.equSelected[this.theItem].plan_name = this.plan_choose_obj.solutionName;
                this.equ_display[this.theItem].plan_id = this.plan_choose_obj.solutionId;
                this.equSelected[this.theItem].plan_id = this.plan_choose_obj.solutionId;
                this.equ_display[this.theItem].job = this.plan_choose_obj.roleName;
                this.equSelected[this.theItem].job = this.plan_choose_obj.roleName;
                this.equ_display[this.theItem].exeRoleId = this.plan_choose_obj.exeRoleId;
                this.equSelected[this.theItem].exeRoleId = this.plan_choose_obj.exeRoleId;
                for (var i = 0; i < this.plan_choose_obj.versionRows.length; i++) { //寻找默认版本信息对象
                    if (this.plan_choose_obj.versionRows[i].isDefaultVersion == 0) {
                        this.version_choose_obj = this.plan_choose_obj.versionRows[i];
                        v_obj = true;
                    }
                };
                if (!v_obj) {
                    this.version_choose_obj = this.plan_choose_obj.versionRows[0] //没有默认版本暂时设定数组的第一个为默认版本
                };
                this.equ_display[this.theItem].version = this.version_choose_obj.version;
                this.equSelected[this.theItem].version = this.version_choose_obj.version;  //默认版本
                this.equ_display[this.theItem].version_id = this.version_choose_obj.versionId;
                this.equSelected[this.theItem].version_id = this.version_choose_obj.versionId;  //默认版本的版本id
                this.equ_display[this.theItem].stop = this.version_choose_obj.needShutdown;//是否停机
                this.equSelected[this.theItem].stop = this.version_choose_obj.needShutdown;
                this.equ_display[this.theItem].cost = this.version_choose_obj.requiredTime;//预计耗时
                this.equSelected[this.theItem].cost = this.version_choose_obj.requiredTime;
//                this.equ_display[this.theItem].price = this.version_choose_obj.totalAmount; //备件金额
//                this.equSelected[this.theItem].price = this.version_choose_obj.totalAmount;
                this.has_click = false;
//                this.timeCount();
//                this.toTestIsNAN(this.version_choose_obj.totalAmount,this.theItem)
                console.log("查看===========》");
                console.log(this.equ_display);
            },
            change_version(x){
                let y = x.split("#");
                let name = parseInt(y[0]);
                this.theItem = parseInt(y[1]);
                for (var i = 0; i < this.equ_display[this.theItem].versions.length; i++) { //寻找默认版本信息对象
                    if (this.equ_display[this.theItem].versions[i].version == name) {
                        this.version_choose_obj = this.equ_display[this.theItem].versions[i];
                    };
                };
                this.equ_display[this.theItem].version = this.version_choose_obj.version;
                this.equSelected[this.theItem].version = this.version_choose_obj.version;  //默认版本
                this.equ_display[this.theItem].version_id = this.version_choose_obj.eamStandardSolutionVersionId?this.version_choose_obj.eamStandardSolutionVersionId:this.version_choose_obj.versionId;
                this.equSelected[this.theItem].version_id = this.version_choose_obj.eamStandardSolutionVersionId?this.version_choose_obj.eamStandardSolutionVersionId:this.version_choose_obj.versionId;  //默认版本的版本id
                this.equ_display[this.theItem].stop = this.version_choose_obj.needShutdown ? this.version_choose_obj.needShutdown : this.version_choose_obj.needShutdown;//是否停机
                this.equSelected[this.theItem].stop = this.version_choose_obj.needShutdown ? this.version_choose_obj.needShutdown : this.version_choose_obj.needShutdown;
                this.equ_display[this.theItem].cost = this.version_choose_obj.requiredTime;//预计耗时
                this.equSelected[this.theItem].cost = this.version_choose_obj.requiredTime;
//                this.equ_display[this.theItem].price = this.version_choose_obj.totalAmount; //备件金额
//                this.equSelected[this.theItem].price = this.version_choose_obj.totalAmount;
                this.plan_choose = true;
                this.plan_choose = false;
                console.log("已选版本对象-----------------------》");
                console.log(this.version_choose_obj);
            },
            //从编辑页进来时候渲染计划任务详情：
            getPlanDetail(){ //查看计划详情
                let vt = this;
                this.$axios.post('/plan/getEamPlanTaskByEamPlanId', {
                    eamPlanId: this.planId,
                }).then((res) => {
                    let result = res.data.response;
                    if (result.code === 1) {
                        vt.planDatas = result.data;
                        console.log("小黄给的数据-----------------------》");
                        console.log(vt.planDatas);
                        for (var i = 0; i < vt.planDatas.length; i++) {
                            let dataObj = {};
                            dataObj.title = vt.planDatas[i].tBdFactoryLocationName;//设备地点名
                            dataObj.id = vt.planDatas[i].tFactoryLocationId;//设备地点id
                            dataObj.equipmentId = vt.planDatas[i].tBdFactoryEquipmentId;//设备id
                            dataObj.plan_name = vt.planDatas[i].TEamStandardSolutionName;//方案名
                            dataObj.plan_id = vt.planDatas[i].TEamStandardSolutionId;//方案id
                            dataObj.job = vt.planDatas[i].exeRole;//执行岗位
                            dataObj.exeRoleId = vt.planDatas[i].exeRoleId;
                            dataObj.stop = vt.planDatas[i].TEamStandardSolutionVersionVo[vt.planDatas[i].TEamStandardSolutionVersionVo.length - 1].needShutdown;//是否停机
                            dataObj.cost = vt.planDatas[i].TEamStandardSolutionVersionVo[vt.planDatas[i].TEamStandardSolutionVersionVo.length - 1].requiredTime;//预计耗时
                            dataObj.version_id = vt.planDatas[i].TEamStandardSolutionVersionVo[vt.planDatas[i].TEamStandardSolutionVersionVo.length - 1].eamStandardSolutionVersionId;//方案版本的版本id
                            dataObj.versions = vt.planDatas[i].TEamStandardSolutionVersionVo;//方案数组
                            dataObj.version = vt.planDatas[i].TEamStandardSolutionVersionVo[vt.planDatas[i].TEamStandardSolutionVersionVo.length - 1].version;//方案号
                            dataObj.price = vt.planDatas[i].sparePartCost;//备件金额
                            vt.equSelected.push(dataObj);
                            vt.equ_display.push(dataObj);
                            if (vt.planDatas[i].sparePartCost) {
                                vt.price_sum = Number(vt.price_sum) * 1000000000000 + Number(vt.planDatas[i].sparePartCost) * 1000000000000;
                                vt.price_sum = (vt.price_sum / 1000000000000).toFixed(2);
                            };
//                            vt.equSelected[i].title =vt.planDatas.eamStandardSolutionName;//设备名
//                            vt.equSelected[i].id =vt.planDatas.factoryLocationId;//设备id
//                            vt.equSelected[i].plan_name =vt.planDatas.eamStandardSolutionName;//方案名
//                            vt.equSelected[i].job = vt.planDatas.exeRole;//执行岗位
//                            vt.equSelected[i].stop = vt.planDatas.needShutdown;//是否停机
//                            vt.equSelected[i].cost = vt.planDatas.requiredTime;//预计耗时
//                            vt.equSelected[i].versions = [];//方案数组
//                            vt.equSelected[i].version = vt.planDatas.version;//方案号
//                            vt.equSelected[i].price = vt.planDatas.sparePartCost;//备件金额
                        };
                    } else {
                        vt.$Message.error(result.msg);
                    }
                }).catch((err) => {
                });
            },
            //designed by kp  计划任务相关  --end
            /************************************* 设备方案放大镜 end *********************************************************** */
            /*添加计划周期*/
            addPalnCycle: function () {
//                if(period==1){
////                    alert("天");//添加
//                    this.addBtn=false;
//                };
//                if(period==3){
//                    alert("月");
//                    this.addBtn=true;
//                }
                switch (this.savePlanSchedule.periodUnit) {
                    case 1:
                        for (let obj of this.dayData) {
                            if (!obj.durationTime) {
                                this.$Message.error("请将执行时间补充完整");
                                return;
                            }
                        };
                        if(this.dayData.length!=0){
                            this.$Message.error("一天内只能添加一条执行时间");
                            return;
                        };
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
                        };
                        if(this.monthData.length!=0){
                            let theObj=this.monthData[this.monthData.length-1];
                            for(let i=0;i<this.monthData.length-1;i++){
                                if (theObj.currentD==this.monthData[i].currentD)
                                {
                                    this.$Message.error("一天内只能添加一条执行时间，请修改");
                                    return;
                                };
                            };
                        };
                        this.monthData.push(this.$fc.cloneKey(this.new_monthData));
                        break;
                    case 4:
                        for (let obj of this.quarterData) {
                            if (!obj.durationTime) {
                                this.$Message.error("请将执行时间补充完整");
                                return;
                            }
                        };
                        this.quarterData.push(this.$fc.cloneKey(this.new_quarterData));
                        break;
                    case 5:
                        for (let obj of this.yearData) {
                            if (!obj.durationTime) {
                                this.$Message.error("请将执行时间补充完整");
                                return;
                            }
                        };
                        this.yearData.push(this.$fc.cloneKey(this.new_yearData));
                        break;
                }
            },
            /*删除计划周期*/
            delPlan: function (index) {
                switch (this.savePlanSchedule.periodUnit) {
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
                this.savePlanSchedule.savePlanScheduleSetting.happenTime = startTime;
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
                };
                return hmsTime;
            },
            circleTypeChange(value){
                this.periodData = [];
            },
            timeChange(time){
                this.schaleTime = time;
            },
            submintData() {
                this.planAddForm.planYear = this.$fc.dateFormat(this.planAddForm.planYear,'yyyy')
                console.log(this.equ_display)
                let periodUnit = this.savePlanSchedule.periodUnit
                let equList = [];
                let periodDataList = [];
                let intervalTime;
                let subData = {};
                let costMinu = 0;
                let circleType = this.savePlanSchedule.circleType;
                /*计划周期数据 临时 和 周期 两种情况*/
                if (circleType == "0") {
                    if (periodUnit == 1) {
                        periodDataList = this.dayData;
                    } else if (periodUnit == 3) {
                        periodDataList = this.monthData;
                    } else if (periodUnit == 4) {
                        periodDataList = this.quarterData;
                    } else if (periodUnit == 5) {
                        periodDataList = this.yearData;
                    }
                    /*提取周期列表 数据*/
                    /* if(periodDataList.length == 0){
                     this.$Message.warning('请至少添加一条计划周期！');
                     }else {*/
                    this.periodData = [];
                    for (let i in periodDataList) {
                        if (!periodDataList[i].durationTime) {
                            this.save_loading = false;
                            this.commint_loading = false;
                            this.$Message.error("请将执行时间补充完整");
                            return;
                        }
                        this.periodData.push({
                            isProductTime: parseInt(periodDataList[i].execTime),         //执行时间段    YesOrNoEnum  -1:全部;0:yes；1:no
                            triggerDay: periodDataList[i].currentD,            //触发日期
                            triggerMonth: periodDataList[i].currentM,          //触发月份
                            triggerTime: this.getHMSTime(periodDataList[i].durationTime)     //触发时间
                        })
                    };
                    intervalTime = this.savePlanSchedule.periodUnit
//                    }
                } else {
                    /*提取临时 数据*/
                    let lsTime = this.savePlanSchedule.savePlanScheduleSetting.happenTime.split("-");
                    let lsHMS = this.savePlanSchedule.savePlanScheduleSetting.happenHMS;
                    intervalTime = null;
                    this.periodData = [];
                    this.periodData.push({
                        isProductTime: parseInt(this.savePlanSchedule.execTime),         //执行时间段    YesOrNoEnum  -1:全部;0:yes；1:no
                        triggerDay: parseInt(lsTime[2]),            //触发日期
                        triggerMonth: parseInt(lsTime[1]),          //触发月份
                        triggerTime: this.getHMSTime(lsHMS)     //触发时间
                    });
                };
                /*计划任务数据*/
                if (this.price_sum == "请输入正确格式的备件金额") {
                    this.save_loading = false;
                    this.commint_loading = false;
                    this.$Message.error("请输入正确格式的备件金额");
                    return
                };
                if (this.equ_display.length == 0) {
                    this.save_loading = false;
                    this.commint_loading = false;
                    this.$Message.error("请添加至少一条计划任务");
                    return
                };
                for (let j in this.equ_display) {
                    if (this.equ_display[j].equipmentId == "") {
                        this.save_loading = false;
                        this.commint_loading = false;
                        this.$Message.error("请完善计划任务信息");
                        return;
                    } else if (!this.equ_display[j].price) {
                        this.save_loading = false;
                        this.commint_loading = false;
                        this.$Message.error("备件金额不能为空");
                        return;
                    }
                    else {
                        equList.push({
                            eamStandardSolutionId: this.equ_display[j].plan_id,               // 标准方案
                            eamStandardSolutionVersionId: this.equ_display[j].version_id,       // 标准方案版本
                            factoryEquipmentId: this.equ_display[j].equipmentId,                   // 工厂设备
                            sparePartCost: this.equ_display[j].price,
                            estimatedTime: this.equ_display[j].cost,       //平均耗时（分钟）
                            exeRoleId: this.equ_display[j].exeRoleId
                        });
                    }
                    costMinu = costMinu + this.equ_display[j].cost;
                };
//                this.planAddForm.estimatedTime = costMinu;
                let theObj=this.periodData[this.periodData.length-1];
                for(let i=0;i<this.periodData.length-1;i++){
                    if (theObj.triggerDay==this.periodData[i].triggerDay)
                    {
                        console.log("嗯啊=====》");
                        console.log(this.periodData);
                        console.log(i);
                        console.log(theObj.triggerDay);
                        console.log(this.periodData[i].triggerDay);
                        this.$Message.error("一天内只能添加一条执行时间，请修改");
                        this.save_loading = false;
                        this.commint_loading = false;
                        return;
                    };
                };
                if(!this.planAddForm.planYear||this.planAddForm.planYear==''||this.planAddForm.planYear=='NaN'){
                    this.$Message.error("计划年份不能为空");
                    this.save_loading = false;
                    this.commint_loading = false;
                    return
                };
                if(!this.planAddForm.name||this.planAddForm.name==''){
                    this.$Message.error("计划名称不能为空");
                    this.save_loading = false;
                    this.commint_loading = false;
                    return
                };
                if(this.planAddForm.planYear!=this.savePlanSchedule.savePlanScheduleSetting.happenTime.split("-")[0]){
                    this.save_loading = false;
                    this.commint_loading = false;
                    if(this.savePlanSchedule.circleType == "1"){
                        this.$Message.error("计划年份应等于执行日期年份");
                        return ;
                    }
                    else{
                        this.$Message.error("计划年份应等于开始时间年份");
                        return ;
                    };
                }
                subData = {
                    planId: this.planAddForm.planID,                        //计划ID（编辑的时候有）
                    code: this.planAddForm.code,                          //计划编码
                    name: this.planAddForm.name,                          //计划名称
                    type: this.planAddForm.busiType,                     //计划类型
                    planLevel: this.planAddForm.planLevel,               //计划等级
                    //计划状态
                    commonPlanExecuteDetailUIList: this.periodData,
                    estimatedTime: this.planAddForm.estimatedTime==''?0:this.planAddForm.estimatedTime,       //平均耗时（分钟）
//                    estimatedTime: "50",       //平均耗时（分钟）
                    //制单人         //制单日期        //最后修改人       //最后修改日期
                    tEamPlanTaskList: equList,                               //计划任务
//                    tEamPlanTaskList:   [{
//                        "eamStandardSolutionId":"JNJMCA6I7J5UJRKL04JF",
//                        "eamStandardSolutionVersionId":"JNJMCA6JQDNJOJZ7J8KB",
//                        "factoryEquipmentId":"JQRJ09VC0NS1OZB7SFWW",
//                        "sparePartCost":"123456"
//                    }
//            ],                               //计划任务
                    scheduleType: parseInt(this.savePlanSchedule.circleType),   //调度类型   EamPlanScheduleTypeEnum  -1:全部; 0:周期;1:临时
                    intervalTime: intervalTime,                             //触发间隔
                    scheduleBeginDay: this.savePlanSchedule.savePlanScheduleSetting.happenTime, //开始时间
                    planYear: this.planAddForm.planYear,                //计划制定年份
//                    status: this.planAddForm.statusName,                //计划状态   EamPlanStatusEnum  -1:全部; 0:制单中; 1:审核中; 3:已生效;4:已失效 已删除
                };
                if (this.savePlanSchedule.circleType == "1") {
                    if (!this.schaleTime) {
                        this.save_loading = false;
                        this.commint_loading = false;
                        this.$Message.error("请选择执行时间");
                        return
                    };
                    console.log("如果是临时计划====》")
                    subData.isProductTime = parseInt(this.savePlanSchedule.execTime), //执行时间段（临时计划的时候传入）
                        subData.startTime = this.schaleTime  //执行时间（临时计划的时候传入）
                    let theData=this.savePlanSchedule.savePlanScheduleSetting.happenTime.replace(/\-/g, "");
                    let startTime=this.schaleTime.split(":")[0]+this.schaleTime.split(":")[1];
                    let compareData=this.savePlanSchedule.savePlanScheduleSetting.happenTime.replace(/\-/g, "")+this.schaleTime.split(":")[0]+this.schaleTime.split(":")[1];
                    let secondData=this.toNowTime();
                    if(parseInt(compareData)<parseInt(this.toNowTime())||parseInt(compareData)==parseInt(this.toNowTime())){
                        this.save_loading = false;
                        this.commint_loading = false;
                        this.$Message.error("请选择执行时间必须大于当前时间");
                        return
                    };
                };
                this.submintDataForm = subData;
                if (this.buttonType == "toSave") {
                    this.savePlan();
                }
                if (this.buttonType == "toApply") {
                    this.applyPlan();
                }
            },
            applyPlan: function () {
                this.$axios.post('/plan/eamPlanSaveEffectieCheck', this.submintDataForm).then((res) => {
                    let code = res.data.response.code;
                    if (code === 1) {//保存成功
                        this.$Message.success('操作成功!');
                        this.commint_loading = false;
                        let vt = this;
                        setTimeout(() => {
                            vt.$router.push({path: '/maintenancePlan'});
//                            window.history.go(-1);
                        }, 1000);
                    } else {
                        let errorMsg = res.data.response.msg;
                        this.save_loading = false;
                        this.commint_loading = false;
                        this.$Message.error(errorMsg);
                    }
                });
            },
            /************************************* 计划生效审核 end *********************************************************** */
            /************************************* 计划保存草稿 start *********************************************************** */
            savePlan: function () {
//                console.log("保存草稿传的参数====================》");
//                console.log(this.submintDataForm);
                this.$axios.post('/plan/eamPlanSaveDraft', this.submintDataForm).then((res) => {
                    let code = res.data.response.code;
                    if (code === 1) {//保存成功
                        this.$Message.success('保存成功!');
                        this.save_loading = false;
                        let vt = this;
                        setTimeout(() => {
                            vt.$router.push({path: '/maintenancePlan'});
//                            window.history.go(-1);
                        }, 1000);
                    } else {
                        let errorMsg = res.data.response.msg;
                        this.save_loading = false;
                        this.commint_loading = false;
                        this.$Message.error(errorMsg);
                    }
                });
            },
            /************************************* 计划保存草稿 end *********************************************************** */
            /************************************   生效和保存前设置status  start    ******************************************/
            setStatusAndSavePlan: function (name) {
                let vm = this;
//                vm.planAddForm.status = 0;  // 制单
                this.$refs[name].validate((valid) => {
                    if (!valid) {
                        vm.$Message.error('请完善计划信息!');
                    } else {
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
</style>