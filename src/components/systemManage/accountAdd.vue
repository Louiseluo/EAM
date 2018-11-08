<template>
    <div class="basic fault-content">
        <!--<Spin fix v-show="load_fix">
            <Icon type="load-c" size=18   class="demo-spin-icon-load"></Icon>
            <div>加载中，请稍后...</div>
        </Spin>-->
        <!--模块名称-->
        <div class="title">
            <span>账户列表-新建</span>
        </div>
        <!--表单-->
        <div class="form-content">
            <Form label-position="right" inline :label-width="100">
                <!--<Form ref="workForm" :model="planWorkForm" label-position="right" inline :label-width="100">-->
                <Form-item label="账户名称">
                    <Input v-model="accountName" style="width: 160px;" placeholder=""></Input>
                </Form-item>
                <Form-item label="账户密码">
                    <Input v-model="accountPsw" style="width: 160px;" placeholder=""></Input>
                </Form-item>
                <Form-item label="确认密码">
                    <Input v-model="accountPswConfirm" style="width: 160px;" placeholder=""></Input>
                </Form-item>
                <Form-item label="匹配角色">
                    <Select style="width: 160px" v-model="matchRole">
                        <Option v-for="state in matchRoles" :value="state.code" :key="state.code">{{state.desc}}</Option>
                    </Select>
                </Form-item>
                <Form-item label="是否启用">
                    <Select style="width: 160px" v-model="isEnable">
                        <Option v-for="item in isEnables" :value="item.code" :key="item.code">{{item.desc}}</Option>
                    </Select>
                </Form-item>
                <Form-item label="生产排班">
                    <Select style="width: 160px" v-model="proSchedule">
                        <Option v-for="item in proSchedules" :value="item.code" :key="item.code">{{item.desc}}</Option>
                    </Select>
                </Form-item>
                <Form-item label="备注">
                    <Input v-model="note" type="textarea" style="width: 500px;" placeholder=""></Input>
                </Form-item>
            </Form>
            <div class="divided mar-t-20 mar-b-20"></div>
            <div class="second-title">消息推送</div>
            <Form label-position="right" inline :label-width="100">
                <Form-item label="推送对象">
                    <div class="input-search">
                        <Input v-model="pushObject" style="width: 160px;"></Input>
                        <Button icon="ios-search"></Button>
                    </div>
                </Form-item>
                <Form-item label="微信">
                    <Input v-model="wechat" style="width: 160px;" placeholder=""></Input>
                </Form-item>
                <Form-item label="手机">
                    <Input v-model="phone" style="width: 160px;" placeholder=""></Input>
                </Form-item>
                <Form-item label="邮件">
                    <Input v-model="email" style="width: 160px;" placeholder=""></Input>
                </Form-item>
            </Form>
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
                accountName: '',
                accountPsw: '',
                accountPswConfirm: '',
                note: '',
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
                isEnable: '',
                isEnables: [
                    {
                        code: '1',
                        desc: '是'
                    },
                    {
                        code: '2',
                        desc: '否'
                    }
                ],
                proSchedule: '',
                proSchedules: [
                    {
                        code: '1',
                        desc: '早班'
                    },
                    {
                        code: '2',
                        desc: '中班'
                    },
                    {
                        code: '3',
                        desc: '晚班'
                    },
                    {
                        code: '4',
                        desc: '全天'
                    },
                ],
                pushObject: '',
                wechat: '',
                phone: '',
                email: '',
            }
        }
    }
</script>
<style>

</style>