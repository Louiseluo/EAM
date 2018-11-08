<template>
  <div id="login">
    <div class="login_content">
		<div class="login_title">
			<img src="./common/img/login_logo.png" width="180" height="42">设备资产管理系统
		</div>
		<div class="login_text">
            <div>
                <Spin fix v-show="load_fix">
                    <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
                    <div>登陆中...</div>
                </Spin>
            </div>
			<div class="L_title">
				<div class="L_left" prop="language">
					<!--<i-switch v-model="formItem.language" size="large" @on-change="changeLang">-->
						<!--<span slot="open">中文</span>-->
						<!--<span slot="close">EN</span>-->
					<!--</i-switch>-->
					<Select style="width:100px;" placeholder="多语选择">
						<Option value="简体中文">简体中文</Option>
						<Option value="English">English</Option>
						<Option value="French" disabled>French</Option>
						<Option value="German" disabled>German</Option>
						<Option value="Italian" disabled>Italian</Option>
						<!--<Option value="Japanese" disabled>Japanese</Option>
						<Option value="Spanish" disabled>Spanish</Option>-->
					</Select>
				</div>
				<div class="L_right">LOGIN</div>
				<div class="clear"></div>
			</div>
			<Form ref="formItem" :model="formItem" :rules="ruleItem">
				<Form-item prop="user">
					<Input type="text" v-model="formItem.user" placeholder="用户名">
						<Icon type="ios-person-outline" slot="prepend"></Icon>
					</Input>
				</Form-item>
				<Form-item prop="password">
					<Input type="password" v-model="formItem.password" placeholder="密码">
						<Icon type="ios-locked-outline" slot="prepend"></Icon>
					</Input>
				</Form-item>
				<Form-item prop="factory">
					<Select v-model="formItem.factory">
                        <Option v-for="item in allFactorys" :value="item.value" :key="item.value">{{ item.label }}</Option>
						<!--<Option value="GROUP">GROUP</Option>-->
						<!--<Option value="Shanghai">Shanghai</Option>-->
						<!--<Option value="Hangzhou">Hangzhou</Option>-->
					</Select>
				</Form-item>
				<Form-item>
					<!--<Button type="primary" @click="handleSubmit('formItem')">登录</Button>-->
					<Button type="primary" @click="handleSubmit('formItem')">{{this.$t("login.login_btn")}}</Button>
				</Form-item>
			</Form>
		</div>
    </div>
  </div>
</template>

<script>
    import {clearAllCookie} from './api/http';
    export default {
        data () {
            return {
                load_fix: false,
                formItem: {
                    language: "",
                    user: '',
                    password: '',
                    factory:'',
                },
                allFactorys:[],
                ruleItem: {
                    user: [
                        { required: true, message: '请填写用户名', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请填写密码', trigger: 'blur' },
                        { type: 'string', min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
                    ]
                }
            }
        },
//        mounted() {
//            let vm = this;
//            this.$axios.get('/relogin/allFactory').then(function(res) {
//                vm.allFactorys = res.data.response.data;
//                console.log(JSON.stringify(vm.allFactorys))
//            });
//            this.$axios.get('tpmStandardSolution/getMaterialType').then(function(response){
//        },
        methods: {
            handleSubmit(name) {
                console.log(this.formItem.factory + " ...factory");
                this.$refs[name].validate((valid) => {
                    if (!valid) {
                        this.$Message.error("请完善信息")
                        return;
                    }
                    let vm = this;
                    vm.$Loading.start();
                    vm.load_fix = true;
                    this.$axios.post("relogin/doLogin",{
                        username: vm.formItem.user,
                        pwd: vm.formItem.password,
                        factoryId: vm.formItem.factory
                    }).then(function (res) {
                        let code = res.data.response.code;
                        if(code == 1) {
                            let data = res.data.response.data;
                            if(data.token) {
                                clearAllCookie();
                                vm.$fc.setCookie("token", data.token)
                            }
                            console.log(JSON.stringify(data))
                            window.location.reload();
                            vm.$Loading.finish();
                        }else {
                            vm.$Message.info(res.data.response.msg)
                            vm.$Loading.error();
                        }
                        vm.load_fix = false;
                    }).catch((err) => {
                        console.log(err)
                        vm.importEnable = false;
                        vm.uploadEnable = false;
                        vm.$Loading.error();
                        vm.load_fix = false;
                    });
                })
            },

            changeLang() {
                if(this.getLocale() === "en") {
                    this.changeLocale("zh")
                }else if(this.getLocale() === "zh") {
                    this.changeLocale("en")
                }
            }
        }
    }
</script>

<style lang="less">
body {
	background-image: url("common/img/login_bg.png");
	background-size: cover;
}
#login {
    .demo-spin-icon-load{
        animation: ani-demo-spin 1s linear infinite;
    }
    @keyframes ani-demo-spin {
        from { transform: rotate(0deg);}
        50%  { transform: rotate(180deg);}
        to   { transform: rotate(360deg);}
    }
    .demo-spin-col{
        height: 100px;
        position: relative;
        border: 1px solid #eee;
    }
	.login_content {
		width: 1000px;
		margin: 0px auto;
		margin-top: 160px;
		.login_title {
			color: #ffffff;
			font-size: 25px;
			line-height: 42px;
			img {
				vertical-align: middle;
				margin-right: 28px;
			}
		}
		.login_text {
			background-image: url("common/img/login_content.png");
			width: 485px;
			height: 363px;
			margin: 0px auto;
			margin-top: 50px;
			padding: 20px 50px;
			.L_title {
			}
			.L_left {
				float: left;
				margin: 10px 0px 0px 0px;
				.ivu-switch-inner {
					font-size: 16px;
					left: 42px;
				}
				.ivu-switch-large {
					width: 85px;
				}
				.ivu-switch-checked {
					border-color: #13749d;
					background-color: #13749d;
				}
				.ivu-switch {
					width: 85px;
					height: 30px;
					line-height: 28px;
					border-radius: 24px;
					border: 1px solid #13749d;
					background-color: #13749d;
				}
				.ivu-switch::after {
					width: 26px;
					height: 26px;
					border-radius: 30px;
				}
				.ivu-switch-large.ivu-switch-checked::after {
					left: 56px;
				}
				.ivu-switch-checked .ivu-switch-inner {
					left: 14px;
				}
			}
			.L_right {
				float: right;
				color: #79858a;
				font-size: 24px;
				margin: 8px 0px 25px 0px;
			}
			.clear {
				clear: both;
			}
			.ivu-form-item {
				margin-bottom: 24px;
			}
			.ivu-input {
				height: 35px;
			}
			.ivu-select-single .ivu-select-selection {
				height: 35px;
			}
			.ivu-select-single .ivu-select-selection .ivu-select-selected-value {
				height: 33px;
				line-height: 33px;
			}
			.ivu-select-single .ivu-select-selection .ivu-select-placeholder {
				line-height: 33px;
			}
			.ivu-btn {
				width: 100%;
				height: 45px;
				font-size: 18px;
			}
			.ivu-btn-primary {
				background-color: #0585bb;
				border-color: #0585bb;
			}
			.ivu-btn-primary:hover {
				background-color: #5da9c2;
				border-color: #5da9c2;
			}
		}
	}
}
</style>