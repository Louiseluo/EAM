<template>
    <header>
        <div class="logo"><img src="../common/img/logo.png" width="170" ><img src="../common/img/text.png" width="203" height="21"></div>
        <div class="handle">
            <!--<Button size="small" @click="CarouselImg = true">切换设备</Button>-->
            <Button size="small" @click="loginOut">登出</Button>
        </div>
        <div class="layout-nav">
            <Menu mode="horizontal"
                  :active-name="parentItem"
                  @on-select="childClick">
                <Menu-item v-if="item.isShow&&!item.children" :name="item.id" v-for="(item,index) in firstNav" :key="item.id">
                    <Icon :type="item.icon"></Icon>
                    {{item.text}}
                </Menu-item>
                <!--其他-->
                <!--<Submenu v-if="item.isShow&&item.children" :name="item.id" v-for="item in firstNav" :key="item.id">
                    <template slot="title">
                        {{item.text}}
                    </template>
                    <Menu-group>
                        <Menu-item v-if="child.isShow" v-for="child in item.children" :name="child.id" :key="child.id">
                            <span :class="{unDoClass: child.isUnDo}" @click="go(child.link,child.isUnDo)">{{child.text}}</span></Menu-item>
                    </Menu-group>
                </Submenu>-->
            </Menu>
        </div>
        <div class="role">
            <Menu mode="horizontal" active-name="1">
                <!--    <Submenu name="3">
                     <template slot="title">-->
                {{userName}} &nbsp;&nbsp;
                <!--     </template>
                     <Menu-group title="使用">
                         <Menu-item name="3-1">新增和启动</Menu-item>
                         <Menu-item name="3-2">活跃分析</Menu-item>
                         <Menu-item name="3-3">时段分析</Menu-item>
                     </Menu-group>
                     <Menu-group title="留存">
                         <Menu-item name="3-4">用户留存</Menu-item>
                         <Menu-item name="3-5">流失用户</Menu-item>
                     </Menu-group>
                 </Submenu>-->
            </Menu>
        </div>

        <!-- swiper -->
        <!--<Modal v-model="CarouselImg" :closable="false" width="auto" height="auto" class="imf">
            <swiper :options="swiperOption">
                <swiper-slide style="text-align: center;">
                    <router-link to='/App'>
                        <img src="../common/img/login_bg.png" width="100%">万丰设备零
                    </router-link>
                </swiper-slide>
                <swiper-slide style="text-align: center;"><img src="../common/img/login_bg.png" width="100%">万丰车间设备一</swiper-slide>
                <swiper-slide style="text-align: center;"><img src="../common/img/login_bg.png" width="100%">万丰设备二</swiper-slide>
                <swiper-slide style="text-align: center;"><img src="../common/img/login_bg.png" width="100%">万丰车间设备三</swiper-slide>
                <swiper-slide style="text-align: center;"><img src="../common/img/login_bg.png" width="100%">万丰设备四</swiper-slide>
                <swiper-slide style="text-align: center;"><img src="../common/img/login_bg.png" width="100%">万丰车间设备五</swiper-slide>
                <swiper-slide style="text-align: center;"><img src="../common/img/login_bg.png" width="100%">万丰设备六</swiper-slide>
                <swiper-slide style="text-align: center;"><img src="../common/img/login_bg.png" width="100%">万丰车间设备七</swiper-slide>
                <swiper-slide style="text-align: center;"><img src="../common/img/login_bg.png" width="100%">万丰设备八</swiper-slide>
                <swiper-slide style="text-align: center;"><img src="../common/img/login_bg.png" width="100%">万丰车间设备九</swiper-slide>
                <div class="swiper-pagination" slot="pagination" ></div>
            </swiper>
        </Modal>-->

    </header>
</template>
<script>
    //    import 'swiper/dist/css/swiper.css';
    //    import { swiper, swiperSlide } from 'vue-awesome-swiper';
    export default{
        props: ['parentItem'],
        data (){
            return{
                /*CarouselImg: true,
                swiperOption: {
                    slidesPerView: 3,
                    spaceBetween: 30,
                    pagination: {
                        el: '.swiper-pagination',
                        clickable: true,
                    }
                },*/
                flag: false,
                firstNav: [
                    {
                        id: 0,
                        icon: 'ios-browsers',
                        text: '设备台账',
                        isShow: this.$rt(this.authJson.EAM.导航区域.设备台账)
                    },
                    {
                        id: 1,
                        icon: 'medkit',
                        text: '设备保养',
                        isShow: this.$rt(this.authJson.EAM.导航区域.设备保养)
                    },
                    {
                        id: 2,
                        icon: 'wrench',
                        text: '设备维修',
                        isShow: this.$rt(this.authJson.EAM.导航区域.设备维修)
                    },
                    {
                        id: 3,
                        icon: 'cube',
                        text: '备件管理',
                        isShow: this.$rt(this.authJson.EAM.导航区域.备件管理)
                    },
                    {
                        id: 4,
                        icon: 'ios-people',
                        text: '人员管理',
                        isShow: this.$rt(this.authJson.EAM.导航区域.人员管理)
                    },
                    /*{
                        id: 5,
                        icon: 'stats-bars',
                        text: '统计报表',
                        isShow: this.$rt(this.authJson.EAM.导航区域.统计报表)
                    },*/
                    {
                        id: 5,
                        icon: 'ios-settings',
                        text: '系统管理',
                        isShow: this.$rt(this.authJson.EAM.导航区域.系统管理),
                    }
                ],
                userName:"",
            }
        },
        mounted(){
//            console.log('parentItem === '+this.parentItem);
            this.getUserName();
        },
//        created: function() {
//                let vm = this;
//                this.$axios.get("relogin/userName").then(function (response) {
////                    console.log(response.data.response.data);
//                    vm.userName = response.data.response.data;
//                });
//        },

        /*components: {
            swiper,
            swiperSlide,
        },*/

        methods: {
            go(routerName) {
                this.$router.push({path: routerName});
            },
            childClick(id) {
//                if (id > 5) return;
                this.$emit('childById', id);
            },
            loginOut() {
                let vm = this;
                this.$axios.post('relogin/loginOut').then(function (response) {
                    let res = response.data.response;
                    if(res.code == 1) {
                        //清除cookie
                        var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
                        if(keys) {
                            for(var i = keys.length; i--;)
                                document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString()
                        }
                        window.location.reload();
                        sessionStorage.clear();
                    }
                });
            },
            getUserName: function(){
                let vm = this;
                if(sessionStorage['uname'] === undefined || sessionStorage['uname'] === "undefined") {
                    this.$axios.get("relogin/userName").then(function (response) {
                        //                    console.log(response.data.response.data);
                        vm.userName = response.data.response.data;
                        sessionStorage['uname'] = vm.userName;
                    });
                }else {
                    vm.userName = sessionStorage['uname'];
                }

            },
        },
    }
</script>
<style lang="less">
    header {
        height: 60px;
        background-image: linear-gradient(to right bottom,rgb(66,85,91),rgb(17,172,168));
        background-size: cover;
        background-repeat: no-repeat;
        .logo {
            float: left;
            margin-left: 15px;
            img {
                margin: 15px 16px 0px 0px;
            }
        }
        .role {
            float: right;
            /*margin-right: 15px;*/
            .ivu-menu {
                font-size: 16px;
                font-family: SimSun;
            }
            .ivu-menu-light.ivu-menu-horizontal .ivu-menu-item-active, .ivu-menu-light.ivu-menu-horizontal .ivu-menu-submenu {
                border-bottom: none;
                color: #ffffff;
            }
            .ivu-menu-light {
                background: none;
            }
            .ivu-menu-horizontal.ivu-menu-light:after {
                height: 0px;
            }
        }
        .handle{
            float: right;
            margin-right: 40px;
            line-height: 60px;
            font-size: 16px;
            font-family: SimSun;
            .ivu-btn-small {
                font-size: 14px;
            }
        }
        .layout-nav {
            float: left;
            .ivu-menu-light {
                background: none;
                .ivu-menu-item {
                    color: #ffffff;
                    font-size: 16px;
                    font-family: SimSun;
                    .ivu-menu-submenu {
                        color: #ffffff;
                    }
                }
                .ivu-menu-submenu .ivu-menu-submenu-title:hover {
                    color: #cacaca;
                }
                .ivu-menu-submenu:hover {
                    border-bottom-color: #cacaca;
                }
                .ivu-menu-submenu .ivu-menu-submenu-title {
                    color: #ffffff;
                    font-size: 16px;
                    font-family: SimSun;
                }
                .ivu-menu-item-group-title {
                    height: 0;
                }
            }
            .ivu-menu-light:after {
                background: transparent;
            }
        }
    }
    .ivu-layout .ivu-layout-sider .ivu-layout-sider-children .ivu-menu {
        font-size: 16px;
        font-family: SimSun;
    }
    header .layout-nav .ivu-menu-light>.ivu-menu-item:hover, .ivu-menu-item-active.ivu-menu-item-selected, header .layout-nav .ivu-menu-light>.ivu-menu-item-active {
        color: #cacaca;
        border-bottom-color: #cacaca;
    }
    @media screen and (max-width: 1320px) {
        header .layout-nav .ivu-menu-light .ivu-menu-item {
            font-size: 0;
        }
        header .layout-nav .ivu-menu-light .ivu-menu-item>i {
            font-size: 20px;
            line-height: 60px;
        }
    }
    @media screen and (max-width: 910px) {
        header .layout-nav {
            display: none;
        }
    }
</style>
