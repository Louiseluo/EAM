<template>
    <div class="wrap">
        <!--权限角色-->
        <div class="second-title">权限角色</div>
        <div class="form-content">
            <div class="table-reset">
                <table class="table table-bordered table-center table-striped table-blue table-edit">
                    <thead>
                    <tr>
                        <th width="80">序号</th>
                        <th>角色定位</th>
                        <th>角色名称</th>
                        <th>消息推送</th>
                        <th>关联账户</th>
                        <th>备注</th>
                        <th width="150">操作</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(tableData,index) in tableDataArr">
                        <td>{{index + 1}}</td>
                        <td>
                            <Select style="width: 160px;" v-model="role_define">
                                <Option v-for="item in roleDefine" :value="item.code" :key="item.code">{{item.desc}}</Option>
                            </Select>
                        </td>
                        <td>{{tableData.role_name}}</td>
                        <td>
                            <div>
                                <i-switch v-model="is_msg_pushed">
                                    <span slot="open">是</span>
                                    <span slot="close">否</span>
                                </i-switch>
                            </div>
                        </td>
                        <td>{{tableData.connected_account}}</td>
                        <td>{{tableData.note}}</td>
                        <td>
                            <a>查看</a>
                            <a>编辑</a>
                            <a @click="removeTableData(index)">删除</a>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div class="mar-t-10">
                <router-link to="permissionRolesAdd">
                    <Button type="primary" icon="plus-round" size="small">新建</Button>
                </router-link>
                <div class="f_r">
                    <div class="page">
                        <Page :total="data1Total" :current="taskCurrentPage" size="small" show-elevator :page-size="pageSize"></Page>
                    </div>
                </div>
            </div>
        </div>
        <!--账户列表-->
        <div class="second-title">账户列表</div>
        <div class="form-content">
            <Form ref="formAccount" :model="formAccount" label-position="right" inline :label-width="100">
                <FormItem label="账户名称">
                    <Input v-model="formAccount.accountName" :maxlength="20" style="width: 160px;"></Input>
                </FormItem>
                <FormItem label="匹配角色">
                    <Select style="width: 160px" v-model="formAccount.matchRole">
                        <Option v-for="state in formAccount.matchRoles" :value="state.code" :key="state.code">{{state.desc}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="启用状态">
                    <Select style="width: 160px" v-model="formAccount.accountState">
                        <Option v-for="state in formAccount.accountStates" :value="state.code" :key="state.code">{{state.desc}}</Option>
                    </Select>
                </FormItem>
                <Button class="f_r" type="primary" icon="ios-search" size="large">查询</Button>
            </Form>
            <div class="table-reset">
                <table class="table table-bordered table-center table-striped table-blue table-edit">
                    <thead>
                    <tr>
                        <th width="80">序号</th>
                        <th>账户名称</th>
                        <th>匹配角色</th>
                        <th>启用状态</th>
                        <th>排班</th>
                        <th>班组</th>
                        <th>消息推送对象</th>
                        <th>备注</th>
                        <th width="150">操作</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(account,index) in accountListArr">
                        <td>{{index + 1}}</td>
                        <td>{{account.account_name}}</td>
                        <td>{{account.match_role}}</td>
                        <td>{{account.state}}</td>
                        <td>{{account.pro_schedule}}</td>
                        <td>{{account.team}}</td>
                        <td>{{account.msg_push_obj}}</td>
                        <td>{{account.note}}</td>
                        <td>
                            <a>查看</a>
                            <a>编辑</a>
                            <a @click="removeAccount(index)">删除</a>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div class="mar-t-10">
                <router-link to="accountAdd">
                    <Button type="primary" icon="plus-round" size="small">新建</Button>
                </router-link>
                <!--<Button type="primary" icon="plus-round" size="small" @click="addTpmRoleList">新建</Button>-->
                <div class="f_r">
                    <div class="page">
                        <Page :total="data1Total" :current="taskCurrentPage" size="small" show-elevator :page-size="pageSize"></Page>
                    </div>
                </div>
            </div>
        </div>
        <Row class="btn-group">
            <Col class="pad-15" span="24" align="center">
            <Button type="primary" size="large">取消</Button>
            <Button type="primary" size="large">保存</Button>
            </Col>
        </Row>
    </div>
</template>
<script>
    export default {
        data(){
            return {
                role_define: '2',
                is_msg_pushed: '',
                data1Total: 5,
                taskCurrentPage: 1,
                pageSize: 5,
                formAccount: {
                    accountName: '',
                    matchRole: '',
                    matchRoles: [
                        {
                            code: 1,
                            desc: '系统管理员'
                        },
                        {
                            code: 2,
                            desc: '产线班长'
                        },
                        {
                            code: 3,
                            desc: '机修工'
                        },
                        {
                            code: 4,
                            desc: '操作工'
                        },
                        {
                            code: 5,
                            desc: '委外人员'
                        }
                    ],
                    accountState: '',
                    accountStates: [
                      {
                          code: '1',
                          desc: '全部'
                      },
                      {
                          code: '2',
                          desc: '启用'
                      },
                      {
                          code: '3',
                          desc: '禁用'
                      },
                  ],
                },
                roleDefine: [
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
                proScheduleTableArr: [
                    {
                        shift_name: '早班',
                        period: '08:00 至 16:00',
                        note: ''
                    },
                    {
                        shift_name: '中班',
                        period: '16:00 至 24:00',
                        note: ''
                    },
                    {
                        shift_name: '晚班',
                        period: '24:00 至 08:00',
                        note: ''
                    },
                    {
                        shift_name: '全天',
                        period: '00:00 至 24:00',
                        note: '全天候岗位或角色。'
                    }
                ],
                new_proScheduleTableArr: [
                    {
                        shift_name: '',
                        period: '',
                        note: ''
                    }
                ],
                tableDataArr: [
                    {
                        role_define: '',
                        role_name: '系统管理员',
                        connected_account: '账户1',
                        note: '/'
                    },
                    {
                        role_define: '',
                        role_name: '产线班长',
                        connected_account: '账户1/账户2...',
                        note: '/'
                    },
                    {
                        role_define: '',
                        role_name: '机修工',
                        connected_account: '账户1/账户2...',
                        note: '/'
                    },
                    {
                        role_define: '',
                        role_name: '操作工',
                        connected_account: '账户1/账户2...',
                        note: '/'
                    },
                    {
                        role_define: '',
                        role_name: '委外人员',
                        connected_account: '账户2',
                        note: '/'
                    }
                ],
                accountListArr: [
                    {
                        account_name: '名称1',
                        match_role: '系统管理员',
                        state: '启用',
                        pro_schedule: '早班',
                        team: '班组1',
                        msg_push_obj: '人员1',
                        note: ''
                    },
                    {
                        account_name: '名称1',
                        match_role: '产线班长',
                        state: '禁用',
                        pro_schedule: '中班',
                        team: '班组2',
                        msg_push_obj: '人员1',
                        note: ''
                    },
                    {
                        account_name: '名称1',
                        match_role: '机修工',
                        state: '启用',
                        pro_schedule: '晚班',
                        team: '班组3',
                        msg_push_obj: '人员1',
                        note: ''
                    },
                    {
                        account_name: '名称1',
                        match_role: '操作工',
                        state: '禁用',
                        pro_schedule: '全天',
                        team: '班组1',
                        msg_push_obj: '人员1',
                        note: ''
                    },
                    {
                        account_name: '名称1',
                        match_role: '委外人员',
                        state: '禁用',
                        pro_schedule: '早班',
                        team: '班组2',
                        msg_push_obj: '人员1',
                        note: ''
                    },
                ],
                /*new_accountListArr: [
                    {
                        account_name: '',
                        match_role: '',
                        pro_schedule: '',
                        msg_push_obj: '',
                        state: '',
                        note: ''
                    }
                ],*/
            }
        },
        methods: {

            addProSchedule: function () {
                this.proScheduleTableArr.push(this.$fc.cloneKey(this.new_proScheduleTableArr));
            },
            /*删除*/
            removeAccount: function (index) {
                this.accountListArr.splice(index,1);
            },
            removeTableData: function (index) {
                this.tableDataArr.splice(index,1)
            },
        }
    }
</script>
<style>
</style>