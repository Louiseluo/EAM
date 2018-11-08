<template>
    <div class="basic fault-content permissionRole">
        <!--<Spin fix v-show="load_fix">
            <Icon type="load-c" size=18   class="demo-spin-icon-load"></Icon>
            <div>加载中，请稍后...</div>
        </Spin>-->
        <!--模块名称-->
        <div class="title">
            <span>权限角色-新建</span>
        </div>
        <!--表单-->
        <div class="form-content">
            <Form label-position="right" inline :label-width="100">
                <!--<Form ref="workForm" :model="planWorkForm" label-position="right" inline :label-width="100">-->
                <Form-item label="角色定位">
                    <Select style="width: 160px" v-model="roleDefine">
                        <Option v-for="item in roleDefines" :value="item.code" :key="item.code">{{item.desc}}</Option>
                    </Select>
                </Form-item>
                <Form-item label="角色名称">
                    <Input v-model="roleName" style="width: 160px;" placeholder=""></Input>
                </Form-item>
                <Form-item label="消息推送">
                    <i-switch v-model="is_msg_pushed">
                        <span slot="open">是</span>
                        <span slot="close">否</span>
                    </i-switch>
                </Form-item>
                <Form-item label="备注">
                    <Input v-model="note" type="textarea" style="width: 500px;" placeholder=""></Input>
                </Form-item>
            </Form>
        </div>
        <!--权限设置-PC端-->
        <div class="title">权限设置-PC端</div>
        <div class="form-content other-content">
            <Form class="w100" ref="formData" :model="formData" label-position="right" inline :label-width="100">
                <FormItem label="首页日历">
                    <CheckboxGroup v-model="formData.homePageCalendar">
                        <Checkbox label="one"><span>全选</span></Checkbox>
                        <Checkbox label="two"><span>反选</span></Checkbox>
                        <br/>
                        <Checkbox label="three"><span>查看工单</span></Checkbox>
                        <Checkbox label="four"><span>工单拖曳</span></Checkbox>
                    </CheckboxGroup>
                </FormItem>
                <FormItem label="方案管理">
                    <CheckboxGroup v-model="formData.schemeManage">
                        <Checkbox label="one"><span>全选</span></Checkbox>
                        <Checkbox label="two"><span>反选</span></Checkbox>
                        <br/>
                        <Checkbox label="three"><span>查询方案</span></Checkbox>
                        <Checkbox label="four"><span>新建方案</span></Checkbox>
                        <Checkbox label="five"><span>查看方案</span></Checkbox>
                        <Checkbox label="six"><span>编辑方案</span></Checkbox>
                        <Checkbox label="seven"><span>作废方案</span></Checkbox>
                        <Checkbox label="eight"><span>删除失效方案</span></Checkbox>
                        <Checkbox label="nine"><span>导出方案数据</span></Checkbox>
                    </CheckboxGroup>
                </FormItem>
                <FormItem label="计划管理">
                    <CheckboxGroup v-model="formData.planManage">
                        <Checkbox label="one"><span>全选</span></Checkbox>
                        <Checkbox label="two"><span>反选</span></Checkbox>
                    </CheckboxGroup>
                    <Form class="w100" ref="formData.planManageList" :model="formData.planManageList">
                        <FormItem label="计划管理">
                            <CheckboxGroup v-model="formData.planManageList.planManageDetail">
                                <Checkbox label="one"><span>全选</span></Checkbox>
                                <Checkbox label="two"><span>反选</span></Checkbox>
                                <br/>
                                <Checkbox label="three"><span>查询计划</span></Checkbox>
                                <Checkbox label="four"><span>新建计划</span></Checkbox>
                                <Checkbox label="five"><span>查看计划</span></Checkbox>
                                <Checkbox label="six"><span>编辑计划</span></Checkbox>
                                <Checkbox label="seven"><span>删除失效计划</span></Checkbox>
                                <Checkbox label="eight"><span>导出计划数据</span></Checkbox>
                                <Checkbox label="nine"><span>发起生效审核</span></Checkbox>
                                <Checkbox label="ten"><span>发起撤销审核</span></Checkbox>
                                <Checkbox label="eleven"><span>发起作废审核</span></Checkbox>
                            </CheckboxGroup>
                        </FormItem>
                        <FormItem label="审核管理">
                            <CheckboxGroup v-model="formData.planManageList.auditManage">
                                <Checkbox label="one"><span>全选</span></Checkbox>
                                <Checkbox label="two"><span>反选</span></Checkbox>
                            </CheckboxGroup>
                            <Form class="w100" ref="formData.planManageList.auditManageList" :model="formData.planManageList.auditManageList">
                                <FormItem label="待审核">
                                    <CheckboxGroup v-model="formData.planManageList.auditManageList.toAudit">
                                        <Checkbox label="one"><span>查询审核申请</span></Checkbox>
                                        <Checkbox label="two"><span>查看申请详情</span></Checkbox>
                                        <Checkbox label="three"><span>通过审核申请</span></Checkbox>
                                        <Checkbox label="four"><span>驳回审核申请</span></Checkbox>
                                    </CheckboxGroup>
                                </FormItem>
                                <FormItem label="待确认">
                                    <CheckboxGroup v-model="formData.planManageList.auditManageList.toConfirm">
                                        <Checkbox label="one"><span>查询驳回申请</span></Checkbox>
                                        <Checkbox label="two"><span>查看申请详情</span></Checkbox>
                                        <Checkbox label="three"><span>编辑驳回申请</span></Checkbox>
                                        <Checkbox label="four"><span>再次提交审核</span></Checkbox>
                                        <Checkbox label="five"><span>驳回被驳回申请</span></Checkbox>
                                        <Checkbox label="six"><span>添加备注</span></Checkbox>
                                    </CheckboxGroup>
                                </FormItem>
                            </Form>
                        </FormItem>
                    </Form>
                </FormItem>
                <FormItem label="工单管理">
                    <CheckboxGroup v-model="formData.workOrderManage">
                        <Checkbox label="one"><span>全选</span></Checkbox>
                        <Checkbox label="two"><span>反选</span></Checkbox>
                        <Checkbox label="three"><span>查询工单</span></Checkbox>
                        <Checkbox label="four"><span>查看工单详情</span></Checkbox>
                        <Checkbox label="five"><span>重新下发被驳回工单</span></Checkbox>
                        <Checkbox label="six"><span>将被驳回工单归档</span></Checkbox>
                        <Checkbox label="seven"><span>导出工单数据</span></Checkbox>
                    </CheckboxGroup>
                </FormItem>
                <FormItem label="维修管理">
                    <CheckboxGroup v-model="formData.repairManage">
                        <Checkbox label="one"><span>全选</span></Checkbox>
                        <Checkbox label="two"><span>反选</span></Checkbox>
                        <br/>
                        <Checkbox label="three"><span>查询工单</span></Checkbox>
                        <Checkbox label="four"><span>查看工单详情</span></Checkbox>
                        <Checkbox label="five"><span>编辑维修信息</span></Checkbox>
                        <Checkbox label="six"><span>重新下发被驳回工单</span></Checkbox>
                        <Checkbox label="seven"><span>将被驳回工单归档</span></Checkbox>
                        <Checkbox label="eight"><span>导出工单数据</span></Checkbox>
                    </CheckboxGroup>
                </FormItem>
                <FormItem label="备件管理">
                    <CheckboxGroup v-model="formData.sparePartManage">
                        <Checkbox label="one"><span>全选</span></Checkbox>
                        <Checkbox label="two"><span>反选</span></Checkbox>
                    </CheckboxGroup>
                    <Form class="w100" ref="formData.sparePartManageList" :model="formData.sparePartManageList">
                        <FormItem label="备件管理">
                            <CheckboxGroup v-model="formData.sparePartManageList.sparePartManageDetail">
                                <Checkbox label="one"><span>全选</span></Checkbox>
                                <Checkbox label="two"><span>反选</span></Checkbox>
                                <br/>
                                <Checkbox label="three"><span>查询备件</span></Checkbox>
                                <Checkbox label="four"><span>新建备件</span></Checkbox>
                                <Checkbox label="five"><span>查看备件详情</span></Checkbox>
                                <Checkbox label="six"><span>编辑备件</span></Checkbox>
                                <Checkbox label="seven"><span>触发采购申请</span></Checkbox>
                                <Checkbox label="eight"><span>删除备件</span></Checkbox>
                                <Checkbox label="nine"><span>导出备件数据</span></Checkbox>
                            </CheckboxGroup>
                        </FormItem>
                        <FormItem label="类型管理">
                            <CheckboxGroup v-model="formData.sparePartManageList.typeManage">
                                <Checkbox label="one"><span>全选</span></Checkbox>
                                <Checkbox label="two"><span>反选</span></Checkbox>
                                <br/>
                                <Checkbox label="three"><span>查看类型详情</span></Checkbox>
                                <Checkbox label="four"><span>新建类型</span></Checkbox>
                                <Checkbox label="five"><span>编辑类型</span></Checkbox>
                                <Checkbox label="six"><span>删除类型</span></Checkbox>
                            </CheckboxGroup>
                        </FormItem>
                        <FormItem label="领用记录">
                            <CheckboxGroup v-model="formData.sparePartManageList.receptionRecord">
                                <Checkbox label="one"><span>全选</span></Checkbox>
                                <Checkbox label="two"><span>反选</span></Checkbox>
                                <br/>
                                <Checkbox label="three"><span>查询记录</span></Checkbox>
                                <Checkbox label="four"><span>查看记录</span></Checkbox>
                                <Checkbox label="five"><span>导出领用数据</span></Checkbox>
                            </CheckboxGroup>
                        </FormItem>
                    </Form>
                </FormItem>
                <FormItem label="设备管理">
                    <CheckboxGroup v-model="formData.equipmentManage">
                        <Checkbox label="one"><span>全选</span></Checkbox>
                        <Checkbox label="two"><span>反选</span></Checkbox>
                        <br/>
                        <Checkbox label="three"><span>查询设备</span></Checkbox>
                        <Checkbox label="four"><span>新建设备</span></Checkbox>
                        <Checkbox label="five"><span>查看设备详情</span></Checkbox>
                        <Checkbox label="six"><span>编辑设备</span></Checkbox>
                        <Checkbox label="seven"><span>删除设备</span></Checkbox>
                        <Checkbox label="eight"><span>导出设备数据</span></Checkbox>
                    </CheckboxGroup>
                </FormItem>
                <FormItem label="数据统计">
                    <CheckboxGroup v-model="formData.dataStatistics">
                        <Checkbox label="one"><span>全选</span></Checkbox>
                        <Checkbox label="two"><span>反选</span></Checkbox>
                        <br/>
                        <Checkbox label="three"><span>查询数据</span></Checkbox>
                        <Checkbox label="four"><span>导出数据</span></Checkbox>
                    </CheckboxGroup>
                </FormItem>
            </Form>
            <div class="btn-query">
                <Button type="primary" icon="refresh">重置</Button>
                <Button type="primary" icon="checkmark-round">保存</Button>
            </div>
        </div>
        <!--权限设置-终端/移动端-->
        <div class="title">权限设置-终端/移动端</div>
        <div class="form-content other-content">
            <Form class="w100" ref="mobileFormData" :model="mobileFormData" label-position="right" inline :label-width="100">
                <FormItem label="待点检">
                    <CheckboxGroup v-model="mobileFormData.toSpotCheck">
                        <Checkbox label="one"><span>全选</span></Checkbox>
                        <Checkbox label="two"><span>反选</span></Checkbox>
                        <br/>
                        <Checkbox label="three"><span>执行点检工单</span></Checkbox>
                        <Checkbox label="four"><span>查看点检详情</span></Checkbox>
                        <Checkbox label="five"><span>提交点检结果</span></Checkbox>
                        <Checkbox label="six"><span>异常上报</span></Checkbox>
                    </CheckboxGroup>
                </FormItem>
                <FormItem label="异常上报">
                    <CheckboxGroup v-model="mobileFormData.abnormalReport">
                        <Checkbox label="one"><span>全选</span></Checkbox>
                        <Checkbox label="two"><span>反选</span></Checkbox>
                        <br/>
                        <Checkbox label="three"><span>选择设备</span></Checkbox>
                        <Checkbox label="four"><span>选择故障描述</span></Checkbox>
                        <Checkbox label="five"><span>上报故障</span></Checkbox>
                    </CheckboxGroup>
                </FormItem>
                <FormItem label="待保养">
                    <CheckboxGroup v-model="mobileFormData.toMaintain">
                        <Checkbox label="one"><span>全选</span></Checkbox>
                        <Checkbox label="two"><span>反选</span></Checkbox>
                        <br/>
                        <Checkbox label="three"><span>执行保养工单</span></Checkbox>
                        <Checkbox label="four"><span>查看保养工单</span></Checkbox>
                        <Checkbox label="five"><span>驳回保养工单</span></Checkbox>
                        <Checkbox label="six"><span>备件申领/补领</span></Checkbox>
                        <Checkbox label="seven"><span>临时签出/签入</span></Checkbox>
                        <Checkbox label="eight"><span>委外金额录入</span></Checkbox>
                    </CheckboxGroup>
                </FormItem>
                <FormItem label="待维修">
                    <CheckboxGroup v-model="mobileFormData.toRepair">
                        <Checkbox label="one"><span>全选</span></Checkbox>
                        <Checkbox label="two"><span>反选</span></Checkbox>
                        <br/>
                        <Checkbox label="three"><span>执行维修工单</span></Checkbox>
                        <Checkbox label="four"><span>查看维修工单</span></Checkbox>
                        <Checkbox label="five"><span>驳回维修工单</span></Checkbox>
                        <Checkbox label="six"><span>备件申领/补领</span></Checkbox>
                        <Checkbox label="seven"><span>临时签出/签入</span></Checkbox>
                        <Checkbox label="eight"><span>委外金额录入</span></Checkbox>
                    </CheckboxGroup>
                </FormItem>
            </Form>
            <div class="btn-query">
                <Button type="primary" icon="refresh">重置</Button>
                <Button type="primary" icon="checkmark-round">保存</Button>
            </div>
        </div>
        <Row class="btn-group">
            <Col class="pad-15" span="24" align="center">
            <Button type="primary" size="large" onclick="javascript:history.back(-1)">取消</Button>
            <Button type="primary" size="large">保存</Button>
            </Col>
        </Row>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                roleDefine: '',
                roleDefines: [
                    {
                        code: '1',
                        desc: '系统运营'
                    },
                    {
                        code: '2',
                        desc: '生产管理'
                    },
                    {
                        code: '3',
                        desc: '任务执行'
                    },
                    {
                        code: '4',
                        desc: '委外执行'
                    },
                ],
                roleName: '系统管理员',
                is_msg_pushed: '',
                note: '',
                formData: {
                    homePageCalendar: '',
                    schemeManage: '',
                    planManage: '',
                    planManageList: {
                        planManageDetail: 'one',
                        auditManage: 'two',
                        auditManageList: {
                            toAudit: 'two',
                            toConfirm: 'three',
                        }

                    },
                    workOrderManage: '',
                    repairManage: '',
                    sparePartManage: '',
                    sparePartManageList: {
                        sparePartManageDetail: 'two',
                        typeManage: 'four',
                        receptionRecord: ''
                    },
                    equipmentManage: '',
                    dataStatistics: '',
                },
                mobileFormData: {
                    toSpotCheck: '',
                    abnormalReport: '',
                    toMaintain: '',
                    toRepair: ''
                },
            }
        }
    }
</script>
<style>
    .permissionRole .other-content .ivu-form .ivu-form-item-label {
        color: #2d8cf0;
        font-size: 16px;
    }
   .permissionRole .other-content .ivu-form .ivu-form-item-label+div>.ivu-form .ivu-form-item-label {
        font-size: 14px;
    }
   .permissionRole .other-content .ivu-form .ivu-form-item-label+div>.ivu-form .ivu-form-item-label+div>.ivu-form .ivu-form-item-label {
        font-size: 14px;
    }
   .permissionRole .other-content form.w100 .ivu-form-item {
        width: 100%;
        /*margin-left: 70px;*/
    }
   .permissionRole .other-content form form form.w100 .ivu-form-item {
        margin-left:70px;
    }
</style>