<template>
    <div class="basic">
        <v-topItem></v-topItem>
        <Row class="pad-15">
            <Col span="5">
            <div class="second-title">角色管理</div>
            <Table class="table-edit" stripe border :columns="columns_role" :data="data_role"></Table>
            <div  class="mar-t-10">
                <Button type="primary" icon="plus-round" size="small" @click="add_role">添加</Button>
                <!--<Button type="primary" shape="circle" icon="minus-round" size="small"></Button>-->
            </div>
            </Col>
            <Col span="19" class="pad-l-15">
            <div class="second-title">角色权限管理</div>
            <div class="role-groups">
                <div class="role-group">
                    <div class="role-group-title">
                        <Checkbox v-model="navigation">
                            <Icon type="social-twitter"></Icon>
                            <span>导航栏</span>
                        </Checkbox>
                    </div>
                    <div class="role-group-content">
                        <div class="chk chk_01">
                            <input type="checkbox" id="newPlan" v-model="newPlan" />
                            <label for="newPlan">新建计划</label>
                        </div>
                        <div class="chk chk_01">
                            <input type="checkbox" id="newOrder" v-model="newOrder" />
                            <label for="newOrder">新建工单</label>
                        </div>
                        <div class="chk chk_01">
                            <input type="checkbox" id="standardWork" v-model="standardWork" />
                            <label for="standardWork">标准方案</label>
                        </div>
                        <div class="chk chk_01">
                            <input type="checkbox" id="fault" v-model="fault"/>
                            <label for="fault">设备上报</label>
                        </div>
                        <div class="chk chk_01">
                            <input type="checkbox" id="system" v-model="system" />
                            <label for="system">系统管理</label>
                        </div>
                    </div>
                </div>
                <div class="role-group">
                    <div class="role-group-title">
                        <Checkbox v-model="calendar" >
                            <Icon type="calendar"></Icon>
                            <span>日历</span>
                        </Checkbox>
                    </div>
                    <div class="role-group-content">
                        <div class="chk chk_01">
                            <input type="checkbox" id="monthView" v-model="monthView" />
                            <label for="monthView">月视图</label>
                        </div>
                        <span class="mar-l-20">日期</span>
                        <Checkbox class="mar-l-15" v-model="orderID" >对应单据号</Checkbox>
                        <Checkbox class="mar-l-15" v-model="orderDate" >日期区号</Checkbox>
                    </div>
                    <div class="role-group-content">
                        <div class="chk chk_01">
                            <input type="checkbox" id="yearView" v-model="yearView" />
                            <label for="yearView">年视图</label>
                        </div>
                        <span class="mar-l-20">月份</span>
                        <Checkbox class="mar-l-15" v-model="yearID" >单据</Checkbox>
                        <Checkbox class="mar-l-15" v-model="yearMonth" >月份区域</Checkbox>
                        <Checkbox class="mar-l-15" v-model="monthForward" >前进</Checkbox>
                        <Checkbox class="mar-l-15" v-model="monthBack" >后退</Checkbox>
                    </div>
                </div>
                <div class="role-group">
                    <div class="role-group-title">
                        <Checkbox v-model="searchResult" >
                            <Icon type="search"></Icon>
                            <span>查询结果</span>
                        </Checkbox>
                    </div>
                    <div class="role-group-content">
                        <div class="chk chk_01">
                            <input type="checkbox" id="taskView" v-model="taskView" />
                            <label for="taskView">任务视图</label>
                        </div>
                        <Checkbox class="mar-l-15" v-model="taskCheck" >查看</Checkbox>
                        <Checkbox class="mar-l-15" v-model="taskCopy" >复制</Checkbox>
                        <Checkbox class="mar-l-15" v-model="taskDel" >作废</Checkbox>
                    </div>
                    <div class="role-group-content">
                        <div class="chk chk_01">
                            <input type="checkbox" id="workView" v-model="workView" />
                            <label for="workView">作业视图</label>
                        </div>
                    </div>
                    <div class="role-group-content">
                        <div class="chk chk_01">
                            <input type="checkbox" id="urgentRepair" v-model="urgentRepair" />
                            <label for="urgentRepair">紧急维修</label>
                        </div>
                        <Checkbox class="mar-l-15" v-model="repairID" >单据保存</Checkbox>
                        <Checkbox class="mar-l-15" v-model="repairDone" >维护完成</Checkbox>
                    </div>
                </div>
                <div class="role-group">
                    <div class="role-group-title">
                        <Checkbox v-model="orderDetail" >
                            <Icon type="clipboard"></Icon>
                            <span>维保工单详情</span>
                        </Checkbox>
                    </div>
                    <div class="role-group-content">
                        <Checkbox class="mar-l-15" v-model="orderCancel" >取消</Checkbox>
                        <Checkbox class="mar-l-15" v-model="orderEdit" >编辑/保存</Checkbox>
                        <Checkbox class="mar-l-15" v-model="orderEffective" >生效</Checkbox>
                        <Checkbox class="mar-l-15" v-model="orderDel" >作废</Checkbox>
                        <Checkbox class="mar-l-15" v-model="orderSave" >保存方案</Checkbox>
                    </div>
                    <div class="role-group-content">
                        <div class="chk chk_01">
                            <input type="checkbox" id="saveModal" v-model="saveModal" />
                            <label for="saveModal">保存方案弹出框</label>
                        </div>
                        <Checkbox class="mar-l-15" v-model="orderCancelModel" >取消</Checkbox>
                        <Checkbox class="mar-l-15" v-model="orderSaveModel" >保存</Checkbox>
                    </div>
                </div>
                <div class="role-group">
                    <div class="role-group-title">
                        <Checkbox v-model="workDetail" >
                            <Icon type="clipboard"></Icon>
                            <span>维保作业详情</span>
                        </Checkbox>
                    </div>
                    <div class="role-group-content">
                        <Checkbox class="mar-l-15" v-model="workStart" >开始维护</Checkbox>
                        <Checkbox class="mar-l-15" v-model="workSave" >单据保存</Checkbox>
                        <Checkbox class="mar-l-15" v-model="workDone" >维护完成</Checkbox>
                        <Checkbox class="mar-l-15" v-model="workSkip" >免维护</Checkbox>
                    </div>
                </div>
                <div class="role-group">
                    <div class="role-group-title">
                        <Checkbox v-model="standardWorkIndex" >
                            <Icon type="clipboard"></Icon>
                            <span>标准方案</span>
                        </Checkbox>
                    </div>
                    <div class="role-group-content">
                        <div class="chk chk_01">
                            <input type="checkbox" id="standardWorkList" v-model="standardWorkList" />
                            <label for="standardWorkList">列表页</label>
                        </div>
                        <Checkbox class="mar-l-15" v-model="standardWorkCheck" >查询</Checkbox>
                        <Checkbox class="mar-l-15" v-model="standardWorkView" >查看</Checkbox>
                        <Checkbox class="mar-l-15" v-model="standardWorkCopy" >复制</Checkbox>
                        <Checkbox class="mar-l-15" v-model="standardWorkDel" >作废</Checkbox>
                    </div>
                    <div class="role-group-content">
                        <div class="chk chk_01">
                            <input type="checkbox" id="detail" v-model="standardWorkDetail" />
                            <label for="detail">详情页</label>
                        </div>
                        <Checkbox class="mar-l-15" v-model="standardWorkDetailCancel" >取消</Checkbox>
                        <Checkbox class="mar-l-15" v-model="standardWorkDetailEdit" >编辑/保存</Checkbox>
                    </div>
                    <div class="role-group-content">
                        <div class="chk chk_01">
                            <input type="checkbox" id="standardWorkVersion" v-model="standardWorkVersion" />
                            <label for="standardWorkVersion">版本管理</label>
                        </div>
                        <Checkbox class="mar-l-15" v-model="standardWorkVersionCancel" >取消</Checkbox>
                        <Checkbox class="mar-l-15" v-model="standardWorkVersionEdit" >编辑/保存</Checkbox>
                    </div>
                </div>
                <div class="role-group">
                    <div class="role-group-title">
                        <Checkbox v-model="faultIndex" >
                            <Icon type="clipboard"></Icon>
                            <span>设备上报</span>
                        </Checkbox>
                    </div>
                    <div class="role-group-content">
                        <div class="chk chk_01">
                            <input type="checkbox" id="faultList" v-model="faultList" />
                            <label for="faultList">列表页</label>
                        </div>
                        <Checkbox class="mar-l-15" v-model="faultAdd" >新增</Checkbox>
                        <Checkbox class="mar-l-15" v-model="faultView" >查看</Checkbox>
                        <Checkbox class="mar-l-15" v-model="faultCopy" >复制</Checkbox>
                        <Checkbox class="mar-l-15" v-model="faultDel" >作废</Checkbox>
                    </div>
                    <div class="role-group-content">
                        <div class="chk chk_01">
                            <input type="checkbox" id="faultDetail" v-model="faultDetail" />
                            <label for="faultDetail">故障上报详情页</label>
                        </div>
                        <Checkbox class="mar-l-15" v-model="faultDetailCancel" >取消</Checkbox>
                        <Checkbox class="mar-l-15" v-model="faultDetailSave" >保存</Checkbox>
                        <Checkbox class="mar-l-15" v-model="faultDetailSure" >确认</Checkbox>
                    </div>
                    <div class="role-group-content">
                        <div class="chk chk_01">
                            <input type="checkbox" id="faultDetailOff" v-model="faultDetailOff" />
                            <label for="faultDetailOff">停机上报详情页</label>
                        </div>
                        <Checkbox class="mar-l-15" v-model="faultDetailOffCancel" >取消</Checkbox>
                        <Checkbox class="mar-l-15" v-model="faultDetailOffSave" >保存</Checkbox>
                        <Checkbox class="mar-l-15" v-model="faultDetailOffSure" >确认</Checkbox>
                    </div>
                </div>
                <div class="role-group">
                    <div class="role-group-title">
                        <Checkbox v-model="planIndex" >
                            <Icon type="clipboard"></Icon>
                            <span>维保计划详情页</span>
                        </Checkbox>
                    </div>
                    <div class="role-group-content">
                        <Checkbox class="mar-l-15" v-model="planDetailCancel" >取消</Checkbox>
                        <Checkbox class="mar-l-15" v-model="planDetailEdit" >编辑/保存</Checkbox>
                        <Checkbox class="mar-l-15" v-model="planDetailDone" >生效</Checkbox>
                        <Checkbox class="mar-l-15" v-model="planDetailDel" >作废</Checkbox>
                    </div>
                </div>
                <div class="role-group">
                    <div class="role-group-title">
                        <Checkbox v-model="systemIndex" >
                            <Icon type="settings"></Icon>
                            <span>系统管理</span>
                        </Checkbox>
                    </div>
                    <div class="role-group-content">
                        <div class="chk chk_01">
                            <input type="checkbox" id="systemUser" v-model="systemUser" />
                            <label for="systemUser">用户管理</label>
                        </div>
                        <Checkbox class="mar-l-15" v-model="systemUserAdd" >新增</Checkbox>
                        <Checkbox class="mar-l-15" v-model="systemUserDel" >删除</Checkbox>
                        <Checkbox class="mar-l-15" v-model="systemUserCancel" >取消</Checkbox>
                        <Checkbox class="mar-l-15" v-model="systemUserSave" >保存</Checkbox>
                    </div>
                    <div class="role-group-content">
                        <div class="chk chk_01">
                            <input type="checkbox" id="systemRole" v-model="systemRole" />
                            <label for="systemRole">用户角色</label>
                        </div>
                        <Checkbox class="mar-l-15" v-model="systemRoleAdd" >新增</Checkbox>
                        <Checkbox class="mar-l-15" v-model="systemRoleDel" >删除</Checkbox>
                        <Checkbox class="mar-l-15" v-model="systemRoleCancel" >取消</Checkbox>
                        <Checkbox class="mar-l-15" v-model="systemRoleSave" >保存</Checkbox>
                    </div>
                    <div class="role-group-content">
                        <div class="chk chk_01">
                            <input type="checkbox" id="authority" v-model="authority" />
                            <label for="authority">权限管理</label>
                        </div>
                        <Checkbox class="mar-l-15" v-model="authorityEdit" >编辑/保存</Checkbox>
                    </div>
                    <div class="role-group-content">
                        <div class="chk chk_01">
                            <input type="checkbox" id="systemPlan" v-model="systemPlan" />
                            <label for="systemPlan">计划类型定义</label>
                        </div>
                        <Checkbox class="mar-l-15" v-model="systemPlanAdd" >新增</Checkbox>
                        <Checkbox class="mar-l-15" v-model="systemPlanDel" >删除</Checkbox>
                        <Checkbox class="mar-l-15" v-model="systemPlanCancel" >取消</Checkbox>
                        <Checkbox class="mar-l-15" v-model="systemPlanSave" >保存</Checkbox>
                    </div>
                    <div class="role-group-content">
                        <div class="chk chk_01">
                            <input type="checkbox" id="systemDept" v-model="systemDept" />
                            <label for="systemDept">班组定义</label>
                        </div>
                        <Checkbox class="mar-l-15" v-model="systemDeptAdd" >新增</Checkbox>
                        <Checkbox class="mar-l-15" v-model="systemDeptDel" >删除</Checkbox>
                        <Checkbox class="mar-l-15" v-model="systemDeptCancel" >取消</Checkbox>
                        <Checkbox class="mar-l-15" v-model="systemDeptSave" >保存</Checkbox>
                    </div>
                </div>
            </div>
            </Col>
        </Row>

    </div>
</template>

<script type="text/ecmascript-6">
    import topItem from './systemManage.vue';
    export default {
        data(){
            return {
                navigation:true,
                newPlan:true,
                newOrder:true,
                standardWork:true,
                fault:true,
                system:true,
                calendar:true,
                monthView:true,
                orderID:true,
                orderDate:true,
                yearView:true,
                yearID:true,
                yearMonth:true,
                monthForward:true,
                monthBack:true,
                searchResult:true,
                taskView:true,
                taskCheck:true,
                taskCopy:true,
                taskDel:true,
                workView:true,
                urgentRepair:true,
                repairID:true,
                repairDone:true,
                orderDetail:true,
                orderCancel:true,
                orderEdit:true,
                orderEffective:true,
                orderDel:true,
                orderSave:true,
                saveModal:true,
                orderCancelModel:true,
                orderSaveModel:true,
                workDetail:true,
                workStart:true,
                workSave:true,
                workDone:true,
                workSkip:true,
                standardWorkIndex:true,
                standardWorkList:true,
                standardWorkCheck:true,
                standardWorkView:true,
                standardWorkCopy:true,
                standardWorkDel:true,
                standardWorkDetail:true,
                standardWorkDetailCancel:true,
                standardWorkDetailEdit:true,
                standardWorkVersion:true,
                standardWorkVersionCancel:true,
                standardWorkVersionEdit:true,
                faultIndex:true,
                faultList:true,
                faultAdd:true,
                faultView:true,
                faultCopy:true,
                faultDel:true,
                faultDetail:true,
                faultDetailCancel:true,
                faultDetailSave:true,
                faultDetailSure:true,
                faultDetailOff:true,
                faultDetailOffCancel:true,
                faultDetailOffSave:true,
                faultDetailOffSure:true,
                planIndex:false,
                planDetailCancel:false,
                planDetailEdit:false,
                planDetailDone:false,
                planDetailDel:false,
                systemIndex:false,
                systemUser:false,
                systemUserAdd:false,
                systemUserDel:false,
                systemUserCancel:false,
                systemUserSave:false,
                systemRole:false,
                systemRoleAdd:false,
                systemRoleDel:false,
                systemRoleCancel:false,
                systemRoleSave:false,
                authority:false,
                authorityEdit:false,
                systemPlan:false,
                systemPlanAdd:false,
                systemPlanDel:false,
                systemPlanCancel:false,
                systemPlanSave:false,
                systemDept:false,
                systemDeptAdd:false,
                systemDeptDel:false,
                systemDeptCancel:false,
                systemDeptSave:false,

                columns_role: [
                    {
                        title: '序号',
                        type: 'index',
                        width:'70',
                        align: 'center'
                    },
                    {
                        title: '角色',
                        key: 'role',
                        render: (h, params) => {
                            return h('Input', {
                                props: {
                                    type: 'text',
                                    value:params.row.role,

                                },
                            })
                        },
                    },
                    {
                        title: '操作',
                        key: 'action',
                        align: 'center',
                        width:'70',
                        render: (h, params) => {
                            return h('a', {
                                props: {
                                    type: 'text',
                                    size: 'small',
                                    class: 'mar-l-5'
                                },
                                on: {
                                    click: () => {
                                        this.removeRole(params.index);
                                    }
                                }
                            },'作废');
                        }
                    }
                ],
                n_data_role:{
                    role: '',
                },
                data_role: [
                    {
                        role: '管理员',
                    },
                    {
                        role: '维修工',
                    },
                    {
                        role: '机修工（保养）',
                    },
                    {
                        role: '机修工（维修）',
                    },
                ],
            }
        },
        components: {
            'v-topItem': topItem
        },
        methods: {
            add_role: function(){
                this.data_role.push(this.$fc.cloneKey(this.n_data_role));
            },

            removeRole:  function(index) {
                // 删一个数组元素
                this.data_role.splice(index,1);
            },
        }
    }
</script>

<style type="text/css">

</style>
