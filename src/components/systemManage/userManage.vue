<template>
    <div class="basic">
        <v-topItem></v-topItem>
        <Row class="pad-15">
            <Col span="3">
            <div class="second-title">用户名称</div>
            <Tree :data="baseData" show-checkbox></Tree>
            </Col>
            <Col span="21" class="pad-l-15">
            <div class="second-title">用户详情</div>
            <!--表单-->
            <div class="form-content">
                <Form ref="workForm" :model="userForm" :rules="ruleValidate" label-position="right" inline :label-width="100">
                    <Form-item label="用户ID" prop="userId">
                        <Input v-model="userForm.userId" style="width: 160px;" placeholder="" disabled></Input>
                    </Form-item>
                    <Form-item label="登录名" prop="userName">
                        <Input v-model="userForm.userName" style="width: 160px;" placeholder=""></Input>
                    </Form-item>
                    <Form-item label="中文名" prop="chinaName">
                        <Input v-model="userForm.chinaName" style="width: 160px;" placeholder=""></Input>
                    </Form-item>
                    <Form-item label="固定电话" prop="tel">
                        <Input v-model="userForm.tel" style="width: 160px;" placeholder=""></Input>
                    </Form-item>
                    <Form-item label="QQ" prop="qq">
                        <Input v-model="userForm.qq" style="width: 160px;" placeholder=""></Input>
                    </Form-item>
                    <Form-item label="默认语言" prop="language">
                        <Select v-model="userForm.language" style="width: 160px;">
                            <Option value="true">中文</Option>
                            <Option value="false">EN</Option>
                        </Select>
                    </Form-item>
                    <Form-item label="手机" prop="phone">
                        <Input v-model="userForm.phone" style="width: 160px;" placeholder=""></Input>
                    </Form-item>
                    <Form-item label="邮件" prop="email">
                        <Input v-model="userForm.email" style="width: 160px;" placeholder=""></Input>
                    </Form-item>
                    <Form-item label="创建时间" prop="createTime">
                        <Date-picker v-model="userForm.createTime" type="datetime" placeholder="选择日期和时间" style="width: 160px;" disabled readonly></Date-picker>
                    </Form-item>
                    <Form-item label="更新时间" prop="updateTime">
                        <Date-picker v-model="userForm.updateTime" type="datetime" placeholder="选择日期和时间" style="width: 160px;" disabled readonly></Date-picker>
                    </Form-item>
                    <Form-item label="扩展1" prop="branch1">
                        <Input v-model="userForm.branch1" style="width: 160px;" placeholder=""></Input>
                    </Form-item>
                    <Form-item label="扩展2" prop="branch2">
                        <Input v-model="userForm.branch2" style="width: 160px;" placeholder=""></Input>
                    </Form-item>
                    <Form-item label="扩展3" prop="branch3">
                        <Input v-model="userForm.branch3" style="width: 160px;" placeholder=""></Input>
                    </Form-item>
                    <Form-item label="扩展4" prop="branch4">
                        <Input v-model="userForm.branch4" style="width: 160px;" placeholder=""></Input>
                    </Form-item>
                    <Form-item label="扩展5" prop="branch5">
                        <Input v-model="userForm.branch5" style="width: 160px;" placeholder=""></Input>
                    </Form-item>
                    <Form-item label="扩展6" prop="branch6">
                        <Input v-model="userForm.branch6" style="width: 160px;" placeholder=""></Input>
                    </Form-item>
                    <Form-item label="默认首页" prop="index">
                        <Select v-model="userForm.index" style="width: 160px;">
                            <Option value="true">日历页</Option>
                            <Option value="false">待维修列表</Option>
                        </Select>
                    </Form-item>
                    <Form-item label="角色分配" prop="roleAssignment">
                        <Transfer v-model="userForm.roleAssignment" :data="data1" :target-keys="targetKeys1" :render-format="render1" @on-change="handleChange1"></Transfer>
                    </Form-item>
                </Form>
                <!--保存按钮-->
                <!--操作按钮-->
                <Row class="btn-group">
                    <Col class="pad-t-15" span="24" align="center">
                    <Button type="primary" size="large" @click="resetPWD = true">密码初始化</Button>
                    <Button type="primary" size="large" @click="handleSubmit('workForm')">保存草稿</Button>
                    </Col>
                </Row>
            </div>
            </Col>
        </Row>



        <Modal class="resetPWD" v-model="resetPWD" title="密码初始化">
            <div style="text-align:center">
                <Form ref="formCustom" :model="formCustom" :rules="ruleCustom" :label-width="100">
                    <Form-item label="密码" prop="passwd">
                        <Input type="password" v-model="formCustom.passwd"></Input>
                    </Form-item>
                    <Form-item label="确认密码" prop="passwdCheck">
                        <Input type="password" v-model="formCustom.passwdCheck"></Input>
                    </Form-item>
                    <Button type="primary" @click="resetPWDSubmit('formCustom')">提交</Button>
                    <Button type="ghost" @click="handleReset('formCustom')" style="margin-left: 15px">重置</Button>
                </Form>
            </div>
            <div slot="footer"></div>
        </Modal>
    </div>
</template>

<script type="text/ecmascript-6">
    import topItem from './systemManage.vue';
    export default {
        data(){
            const validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'));
                } else {
                    if (this.formCustom.passwdCheck !== '') {
                        // 对第二个密码框单独验证
                        this.$refs.formCustom.validateField('passwdCheck');
                    }
                    callback();
                }
            };
            const validatePassCheck = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.formCustom.passwd) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            return {
                resetPWD:false,
                baseData: [{
                    expand: true,
                    title: 'all users',
                    children: [
                        {
                            title: 'administrator',
                            expand: true,
                            disabled: true,
                            children: [
                                {
                                    title: 'admin',
                                    disableCheckbox: true,
                                },
                                {
                                    title: '刘飞',
                                },
                                {
                                    title: '姚德明',
                                },
                                {
                                    title: '姚满琳',
                                }
                            ]
                        },
                        {
                            title: '生产部',
                            expand: true,
                            disabled: true,
                            children: [
                                {
                                    title: '张小燕',
                                    disableCheckbox: true,
                                },
                                {
                                    title: '胡兵',
                                },
                                {
                                    title: '潘逸波',
                                },
                                {
                                    title: '陈伟',
                                }
                            ]
                        },
                        {
                            title: '设备部',
                            expand: true,
                            disabled: true,
                            children: [
                                {
                                    title: '吕永刚',
                                    disableCheckbox: true,
                                },
                                {
                                    title: '陈亮',
                                }
                            ]
                        },
                        {
                            title: '总经办',
                            expand: true,
//                            disabled: true,
                            children: [
                                {
                                    title: '王炎辉',
//                                    disableCheckbox: true,
                                },
                                {
                                    title: '陆建群',
                                }
                            ]
                        },
                        {
                            title: '质管部',
                            expand: true,
//                            checked: true,
                            children: [
                                {
                                    title: '费彬',
                                },
                                {
                                    title: '熊智军',
                                },
                                {
                                    title: '陈伟',
                                }
                            ]
                        }
                    ]
                }],
                userForm:{
                    userId: "1001",
                    userName: "压铸岛1号设备",
                    chinaName: '压铸岛',
                    tel: '12569854475',
                    qq: '10101010101010',
                    language: 'true',
                    phone: '123456952566',
                    email: '1054062@qq.com',
                    createTime: '2017-07-01',
                    updateTime: '2017-07-01',
                    branch1:'',
                    branch2:'',
                    branch3:'',
                    branch4:'',
                    branch5:'',
                    branch6:'',
                    index:'true',
                    roleAssignment:'',
                },
                ruleValidate: {
//          sopname: [
//            	{validator: validateAge, trigger: 'blur'},
//              {required: true, message: '姓名不能为空', trigger: 'blur'},
//          ]
                },
                data1: this.getMockData(),
                targetKeys1: this.getTargetKeys(),



                formCustom: {
                    passwd: '',
                    passwdCheck: '',
                },
                ruleCustom: {
                    passwd: [
                        { validator: validatePass, trigger: 'blur' }
                    ],
                    passwdCheck: [
                        { validator: validatePassCheck, trigger: 'blur' }
                    ],
                }
            }
        },
        components: {
            'v-topItem': topItem
        },
        methods: {
            handleSubmit (name) {
                console.log(this.workForm);
                //this.$refs[name].validate((valid) => {
                //if (valid) {
                // this.$Message.success('提交成功!');
                // } else {
                //   this.$Message.error('表单验证失败!');
                // }
                // })
            },
            getMockData () {
                let mockData = [];
                for (let i = 1; i <= 20; i++) {
                    mockData.push({
                        key: i.toString(),
                        label: '内容' + i,
                        description: '内容' + i + '的描述信息',
                        disabled: Math.random() * 3 < 1
                    });
                }
                return mockData;
            },
            getTargetKeys () {
                return this.getMockData()
                    .filter(() => Math.random() * 2 > 1)
                    .map(item => item.key);
            },
            render1 (item) {
                return item.label;
            },
            handleChange1 (newTargetKeys, direction, moveKeys) {
                console.log(newTargetKeys);
                console.log(direction);
                console.log(moveKeys);
                this.targetKeys1 = newTargetKeys;
            },



            resetPWDSubmit (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.$Message.success('提交成功!');
                    } else {
                        this.$Message.error('表单验证失败!');
                    }
                })
            },
            handleReset (name) {
                this.$refs[name].resetFields();
            }
        }
    }
</script>

<style type="text/css">
    .resetPWD  .ivu-form-item{
        margin-bottom: 25px;
    }
    .resetPWD  .ivu-form-item:last-child{
        margin-bottom: 0;
    }
    .resetPWD .ivu-modal-footer{
        border-top: none;
        padding: 0 0 0 0;
    }
</style>
