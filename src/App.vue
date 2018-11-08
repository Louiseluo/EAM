<!--<style lang="less">@import "./common/css/main";</style>-->
<template>
    <!--<section class="admin-layout-container">-->
    <div id="app">
        <Layout>
            <!--头部-->
            <v-header v-show="needLogin == false" :parentItem="parentName" @childById="childByParentId"></v-header>
            <!--布局-->
            <div v-show="needLogin == false">
                <!--左边菜单栏-->
                <div style="height: calc(100vh - 60px); overflow: auto;" class="layout">
                    <!--侧边栏-->
                    <Layout :style="{minHeight: '100vh'}">
                        <Sider collapsible :collapsed-width="78" v-model="isCollapsed">
                            <Menu
                                    ref="side_menu"
                                    :active-name="activeMenuName"
                                    :open-names="openMenuName"
                                    theme="dark"
                                    width="auto"
                                    accordion
                                    @on-select="choosedMenu"
                                    :class="menuitemClasses"
                                    v-if="!isCollapsed">
                                <template v-if="parentNode!=undefined&&parentNode.isShow" v-for="(menu,menu_index) in parentNode.childrenItems" >
                                    <Submenu :name="menu.name" v-if="menu.children">
                                        <template slot="title">
                                            <Icon :size="20" type="clipboard" :class="{unDoClass: menu.isUnDo}"></Icon>
                                            <Poptip trigger="hover" :title="menu.title" placement="right"><span :class="{unDoClass: menu.isUnDo}">{{menu.title}}</span></Poptip >
                                        </template>
                                        <MenuItem :name="child.name" v-for="(child,child_index) in menu.children"
                                                  :key="child_index">
                                            <span :class="{unDoClass: child.isUnDo}">{{child.title}}</span>
                                        </MenuItem>
                                    </Submenu>
                                    <MenuItem :name="menu.name" v-if="!menu.children">
                                        <Icon :class="{unDoClass: menu.isUnDo}" :size="20" type="clipboard"></Icon>
                                        <Poptip trigger="hover" :title="menu.title" placement="right"><span :class="{unDoClass: menu.isUnDo}">{{menu.title}}</span></Poptip >
                                    </MenuItem>
                                </template>
                            </Menu>
                            <div class="dropdown-wrap">
                                <template v-show="parentNode!=undefined&&parentNode.isShow" v-for="(menu,menu_index) in parentNode.childrenItems" v-if="isCollapsed">
                                    <Dropdown transfer placement="right-start" v-if="menu.children"
                                              @on-click="dropdownClick">
                                        <Button style="width: 85px;margin-left: -5px;padding:10px 0;" type="text">
                                            <Icon :size="25" color="#fff" type="clipboard"></Icon>
                                        </Button>
                                        <DropdownMenu style="width: 200px;" slot="list">
                                            <template v-for="(child, i) in menu.children">
                                                <DropdownItem :name="child.name">
                                                    <div style="display:flex;align-items:center;" @click="go(child.link,i,child.type,child.funcId, child.plan)">
                                                        <span style="padding-left:10px;" :class="{unDoClass: child.isUnDo}">
                                                            {{ child.title }}
                                                        </span>
                                                    </div>
                                                </DropdownItem>
                                            </template>
                                        </DropdownMenu>
                                    </Dropdown>
                                    <Dropdown transfer v-if="!menu.children" placement="right-start"
                                              @on-click="dropdownClick">
                                        <Button style="width: 85px;margin-left: -5px;padding:10px 0;" type="text">
                                            <Icon :size="25" color="#fff" type="clipboard"></Icon>
                                        </Button>
                                        <DropdownMenu style="width: 200px;" slot="list">
                                            <DropdownItem :name="menu.name">
                                                <div style="display:flex;align-items:center;" @click="go(menu.link,i,menu.type,menu.funcId, menu.plan)">
                                                    <span style="padding-left:10px;" :class="{unDoClass: menu.isUnDo}">
                                                        {{ menu.title }}
                                                    </span>
                                                </div>
                                            </DropdownItem>
                                        </DropdownMenu>
                                    </Dropdown>
                                </template>
                            </div>
                        </Sider>
                        <!--右边；路由-->
                        <Layout>
                            <Content
                                    :style="{
                                    height: 'calc(100vh - 100px)',
                                    position: 'absolute',
                                    top: '85px',
                                    overflow: 'auto',
                                    padding: '0 24px 24px',
                                    width:isCollapsed?'calc(100% - 78px)':'calc(100% - 200px)'
                             }">
                                <div class="wel">
                                    <keep-alive>
                                        <router-view v-if="$route.meta.keepAlive"></router-view>
                                    </keep-alive>
                                    <router-view v-if="!$route.meta.keepAlive"></router-view>
                                </div>
                            </Content>
                        </Layout>
                    </Layout>
                </div>
            </div>
        </Layout>

        <!--<div v-show="needLogin == true">-->
        <div>
            <v-login></v-login>
        </div>

    </div>
    <!--</section>-->
</template>
<script>
    import header from './components/header.vue';
    import login from './Login.vue';

    export default {
        data() {
            return {
                nowRoutePath: '', //当前路由
                created: false,
                /*新加*/
                isCollapsed: false,
                activeMenuName: '',
                openMenuName: [],
                /*==============================*/
                needLogin: this.$fc.needLogin(),
//              contentHeight: `${document.documentElement.clientHeight - 60}px`,
//            contentHeight: '100px',
                sideitems: [
                    {
                        parentItem: '0',
                        isShow: this.$rt(this.authJson.EAM.导航区域.设备台账),
                        childrenItems: [
                            {
                                id: 11,
                                name: '11',
                                title: '设备总账',
                                src: "../static/img/spareparts.svg",
                                link: '/equipGeneralLedger',
                            },
                            /*{
                                id: 13,
                                name: '13',
                                title: '设备分类',
                                src: "../static/img/spareparts.svg",
                                link: '/equipmentList',
                            },*/
                            {
                                id: 13,
                                name: '13',
                                title: '设备基础数据',
                                src: "../static/img/spareparts.svg",
//                                link: '/equipmentList',
                                children: [
                                    {
                                        id: 130,
                                        name: '130',
                                        title: '设备制造商管理',
                                        link: '/equManufacturerList',
                                    },
                                    {
                                        id: 131,
                                        name: '131',
                                        title: '设备类型管理',
                                        link: '/equTypeList',
                                    },
                                    {
                                        id: 132,
                                        name: '132',
                                        title: '设备型号管理',
                                        link: '/equKindList',
                                    }
                                ]
                            },
                            {
                                id: 14,
                                name: '14',
                                title: '关键设备登记表',
                                src: "../static/img/spareparts.svg",
                                link: '/equipRegisForm',
                            },
                            {
                                id: 15,
                                name: '15',
                                title: '设备请购',
//                                src: "/equipApply",
                                children: [
                                    {
                                        id: 150,
                                        name: '150',
                                        title: '全部',
                                        link: '/equipApply',
                                        type: -1
                                    },
                                    {
                                        id: 151,
                                        name: '151',
                                        title: '已制单',
                                        link: '/equipApply',
                                        type: 0
                                    },
                                    {
                                        id: 152,
                                        name: '152',
                                        title: '待审核',
                                        link: '/equipApply',
                                        type: 1
                                    },
                                    {
                                        id: 153,
                                        name: '153',
                                        title: 'OA审核通过',
                                        link: '/equipApply',
                                        type: 2
                                    },
                                    {
                                        id: 154,
                                        name: '154',
                                        title: 'OA审核驳回',
                                        link: '/equipApply',
                                        type: 3
                                    },
                                    {
                                        id: 155,
                                        name: '155',
                                        title: 'OA审核终止',
                                        link: '/equipApply',
                                        type: 4
                                    },
                                    {
                                        id: 156,
                                        name: '156',
                                        title: '已归档',
                                        link: '/equipApply',
                                        type: 5
                                    }
                                ]
                            },
                            {
                                id: 16,
                                name: '16',
                                title: '设备预验收',
//                                src: '/toAccept',
                                children: [
                                    {
                                        id: 160,
                                        name: '160',
                                        title: '全部',
                                        link: '/toAccept',
                                        type: -1
                                    },
                                    {
                                        id: 161,
                                        name: '161',
                                        title: '已制单',
                                        link: '/toAccept',
                                        type: 0
                                    },
                                    {
                                        id: 162,
                                        name: '162',
                                        title: '待审核',
                                        link: '/toAccept',
                                        type: 1
                                    },
                                    {
                                        id: 163,
                                        name: '163',
                                        title: 'OA审核通过',
                                        link: '/toAccept',
                                        type: 2
                                    },
                                    {
                                        id: 164,
                                        name: '164',
                                        title: 'OA审核驳回',
                                        link: '/toAccept',
                                        type: 3
                                    },
                                    {
                                        id: 165,
                                        name: '165',
                                        title: 'OA审核终止',
                                        link: '/toAccept',
                                        type: 4
                                    },
                                    {
                                        id: 166,
                                        name: '166',
                                        title: '已归档',
                                        link: '/toAccept',
                                        type: 5
                                    }
                                ]
                            },
                            {
                                id: 17,
                                name: '17',
                                title: '设备验收',
//                                src: '/accept',
                                children: [
                                    {
                                        id: 170,
                                        name: '170',
                                        title: '全部',
                                        link: '/accept',
                                        type: -1
                                    },
                                    {
                                        id: 171,
                                        name: '171',
                                        title: '已制单',
                                        link: '/accept',
                                        type: 0
                                    },
                                    {
                                        id: 172,
                                        name: '172',
                                        title: '待审核',
                                        link: '/accept',
                                        type: 1
                                    },
                                    /*{
                                        id: 173,
                                        name: '173',
                                        title: 'OA审核通过',
                                        link: '/accept',
                                        type: 2
                                    },*/
                                    {
                                        id: 174,
                                        name: '174',
                                        title: 'OA审核驳回',
                                        link: '/accept',
                                        type: 3
                                    },
                                    {
                                        id: 175,
                                        name: '175',
                                        title: 'OA审核终止',
                                        link: '/accept',
                                        type: 4
                                    },
                                    {
                                        id: 176,
                                        name: '176',
                                        title: '已归档',
                                        link: '/accept',
                                        type: 5
                                    },
                                    {
                                        id: 177,
                                        name: '177',
                                        title: '已生效',
                                        link: '/accept',
                                        type: 6
                                    }
                                ]
                            },
                            {
                                id: 18,
                                name: '18',
                                title: '设备改造',
//                                src: '/equReformList',
                                children: [
                                    {
                                        id: 180,
                                        name: '180',
                                        title: '全部',
                                        link: '/equReformList',
                                        type: -1
                                    },
                                    {
                                        id: 181,
                                        name: '181',
                                        title: '已制单',
                                        link: '/equReformList',
                                        type: 0
                                    },
                                    {
                                        id: 182,
                                        name: '182',
                                        title: '待审核',
                                        link: '/equReformList',
                                        type: 1
                                    },
                                    /*{
                                        id: 183,
                                        name: '183',
                                        title: 'OA审核通过',
                                        link: '/equReformList',
                                        type: 2
                                    },*/
                                    {
                                        id: 184,
                                        name: '184',
                                        title: 'OA审核驳回',
                                        link: '/equReformList',
                                        type: 3
                                    },
                                    {
                                        id: 185,
                                        name: '185',
                                        title: 'OA审核终止',
                                        link: '/equReformList',
                                        type: 4
                                    },
                                    /*{
                                        id: 186,
                                        name: '186',
                                        title: '已归档',
                                        link: '/equReformList',
                                        type: 5
                                    },*/
                                    {
                                        id: 187,
                                        name: '187',
                                        title: '已生效',
                                        link: '/equReformList',
                                        type: 6
                                    }
                                ]
                            },
                            {
                                id: 19,
                                name: '19',
                                title: '设备报废',
//                                src: "/equScrapList",
                                children: [
                                    {
                                        id: 190,
                                        name: '190',
                                        title: '全部',
                                        link: '/equScrapList',
                                        type: -1
                                    },
                                    {
                                        id: 191,
                                        name: '191',
                                        title: '已制单',
                                        link: '/equScrapList',
                                        type: 0
                                    },
                                    {
                                        id: 192,
                                        name: '192',
                                        title: '待审核',
                                        link: '/equScrapList',
                                        type: 1
                                    },
                                    /*{
                                        id: 193,
                                        name: '193',
                                        title: 'OA审核通过',
                                        link: '/equScrapList',
                                        type: 2
                                    },*/
                                    {
                                        id: 194,
                                        name: '194',
                                        title: 'OA审核驳回',
                                        link: '/equScrapList',
                                        type: 3
                                    },
                                    {
                                        id: 195,
                                        name: '195',
                                        title: 'OA审核终止',
                                        link: '/equScrapList',
                                        type: 4
                                    },
                                    {
                                        id: 196,
                                        name: '196',
                                        title: '已归档',
                                        link: '/equScrapList',
                                        type: 5
                                    },
                                    {
                                        id: 197,
                                        name: '197',
                                        title: '已生效',
                                        link: '/equScrapList',
                                        type: 6
                                    }
                                ]
                            },
                            {
                                id: 110,
                                name: '110',
                                title: '设备保养日历',
                                link: "/maintainDate",
                            },
                            {
                                id: 111,
                                name: '111',
                                title: '设备维修日历',
                                link: "/dateIndex",
                            }
                        ]
                    },
                    {
                        parentItem: '1',
                        isShow: this.$rt(this.authJson.EAM.导航区域.设备保养),
                        childrenItems: [
                            {
                                id: 20,
                                name: '20',
                                title: '保养方案',
                                link: '/standardwork'
                            },
                            {
                                id: 21,
                                name: '21',
                                title: '保养年计划',
//                                link: '/maintePlan',
                                children: [
                                    {
                                        id: 210,
                                        name: '210',
                                        title: '全部',
                                        link: '/maintenancePlan',
                                        type: -1,
                                        plan: 'year'
                                    },
                                    {
                                        id: 211,
                                        name: '211',
                                        title: '已制单',
                                        link: '/maintenancePlan',
                                        type: 0,
                                        plan: 'year'
                                    },
                                    {
                                        id: 212,
                                        name: '212',
                                        title: '待审核',
                                        link: '/maintenancePlan',
                                        type: 1,
                                        plan: 'year'
                                    },
                                    /*{
                                        id: 213,
                                        name: '213',
                                        title: '已批准',
                                        link: '/maintenancePlan',
                                        type: 2,
                                        plan: 'year'
                                    },*/
                                    {
                                        id: 214,
                                        name: '214',
                                        title: '已驳回',
                                        link: '/maintenancePlan',
                                        type: 3,
                                        plan: 'year'
                                    },
                                    {
                                        id: 215,
                                        name: '215',
                                        title: '已生效',
                                        link: '/maintenancePlan',
                                        type: 6,
                                        plan: 'year'
                                    }
                                ]
                            },
                            {
                                id: 22,
                                name: '22',
                                title: '保养月计划',
//                                link: '/maintePlan',
                                children: [
                                    {
                                        id: 220,
                                        name: '220',
                                        title: '全部',
                                        link: '/maintenancePlan',
                                        type: -1,
                                        plan: 'month'
                                    },
                                    {
                                        id: 221,
                                        name: '221',
                                        title: '已制单',
                                        link: '/maintenancePlan',
                                        type: 0,
                                        plan: 'month'
                                    },
                                    {
                                        id: 222,
                                        name: '222',
                                        title: '待审核',
                                        link: '/maintenancePlan',
                                        type: 1,
                                        plan: 'month'
                                    },
                                    /*{
                                        id: 223,
                                        name: '223',
                                        title: '已批准',
                                        link: '/maintenancePlan',
                                        type: 2,
                                        plan: 'month'
                                    },*/
                                    {
                                        id: 224,
                                        name: '224',
                                        title: '已驳回',
                                        link: '/maintenancePlan',
                                        type: 3,
                                        plan: 'month'
                                    },
                                    {
                                        id: 225,
                                        name: '225',
                                        title: '已生效',
                                        link: '/maintenancePlan',
                                        type: 6,
                                        plan: 'month'
                                    }
                                ]
                            },
                            {
                                id: 23,
                                name: '23',
                                title: '保养工单',
                                children: [
                                    {
                                        id: 230,
                                        name: '230',
                                        title: '全部',
                                        link: '/maintenanceOrder',
                                        type: -1,
                                        orderFlag:0,
                                    },
                                    {
                                        id: 231,
                                        name: '231',
                                        title: '已制单',
                                        link: '/maintenanceOrder',
                                        type: 0,
                                        orderFlag:0,
                                    },
                                    /*{
                                        id: 232,
                                        name: '232',
                                        title: '已通知',
                                        link: '/maintenanceOrder',
                                        type: 2,
                                        orderFlag:0,
                                    },*/
                                    {
                                        id: 233,
                                        name: '233',
                                        title: '已拒单',
                                        link: '/maintenanceOrder',
                                        type: 4,
                                        orderFlag:0,
                                    },
                                    {
                                        id: 234,
                                        name: '234',
                                        title: '待仲裁',
                                        link: '/maintenanceOrder',
                                        type: 13,
                                        orderFlag:0,
                                    },
                                    {
                                        id: 235,
                                        name: '235',
                                        title: '已派工',
                                        link: '/maintenanceOrder',
                                        type: 2,
                                        orderFlag:0,
                                    },
                                    {
                                        id: 236,
                                        name: '236',
                                        title: '缺件暂停',
                                        link: '/maintenanceOrder',
                                        type: 6,
                                        orderFlag:0,
                                    },
                                    {
                                        id: 237,
                                        name: '237',
                                        title: '已下发',
                                        link: '/maintenanceOrder',
                                        type: 7,
                                        orderFlag:0,
                                    },
                                    {
                                        id: 238,
                                        name: '238',
                                        title: 'MES执行中',
                                        link: '/maintenanceOrder',
                                        type: 8,
                                        orderFlag:0,
                                    },
                                    {
                                        id: 239,
                                        name: '239',
                                        title: '已完成',
                                        link: '/maintenanceOrder',
                                        type: 11,
                                        orderFlag:0,
                                    },
                                    /* {
                                         id: 2310,
                                         name: '2310',
                                         title: '已归档',
                                         link: '',
                                         type: -1,
                                         orderFlag:0,
                                     },*/
                                    {
                                        id: 2311,
                                        name: '2311',
                                        title: '已取消',
                                        link: '',
                                        type: 14,
                                        orderFlag:0,
                                    }
                                ]
                            },
                            /*{
                                id: 999,
                                name: '999',
                                title: '原计划原计划',
//                              src: "../static/img/plan.svg",
                                link: '/maintenancePlan'
                            },
                            {
                                id: 888,
                                name: '888',
                                title: '原工单原工单',
//                              src: "../static/img/work.svg",
                                link: '/maintenanceOrder'
                            },
                            {
                                id: 777,
                                name: '777',
                                title: '待保养',
//                              src: "../static/img/work.svg",
                                link: '/unrepaired'
                            },*/
                        ]
                    },
                    {
                        parentItem: '2',
                        isShow: this.$rt(this.authJson.EAM.导航区域.设备维修),
                        childrenItems: [
                            /* {
                                 id: 30,
                                 name: '30',
                                 title: '设备报修单',
 //                                link: '/treeUseDetail',
                                 children: [
                                     {
                                         id: 300,
                                         name: '300',
                                         title: '全部',
                                         link: '/daichuli'
                                     },
                                     {
                                         id: 301,
                                         name: '301',
                                         title: '待处理',
                                         link: '/daichuli'
                                     },
                                     {
                                         id: 302,
                                         name: '302',
                                         title: '处理中',
                                         link: ''
                                     },
                                     {
                                         id: 303,
                                         name: '303',
                                         title: '已修复',
                                         link: ''
                                     },
                                     {
                                         id: 304,
                                         name: '304',
                                         title: '未修复',
                                         link: ''
                                     }
                                 ]
                             },*/
                            {
                                id: 31,
                                name: '31',
                                title: '维修工单',
//                                link: '/treeUseDetail',
                                children: [
                                    {
                                        id: 310,
                                        name: '310',
                                        title: '全部',
                                        link: '/maintenanceOrder',
                                        orderFlag:2,
                                        type: -1
                                    },
                                    {
                                        id: 311,
                                        name: '311',
                                        title: '已制单',
                                        link: '/maintenanceOrder',
                                        orderFlag:2,
                                        type: 0
                                    },
                                    {
                                        id: 312,
                                        name: '312',
                                        title: '已派工',
                                        link: '/maintenanceOrder',
                                        orderFlag:2,
                                        type: 2
                                    },
                                    {
                                        id: 313,
                                        name: '313',
                                        title: '待仲裁',
                                        link: '/maintenanceOrder',
                                        orderFlag:2,
                                        type: 13
                                    },
                                    /*{
                                        id: 314,
                                        name: '314',
                                        title: '延时中',
                                        link: '/maintenanceOrder',
                                        orderFlag:2,
                                        type: 16
                                    },*/
                                    {
                                        id: 315,
                                        name: '315',
                                        title: '已接单',
                                        link: '/maintenanceOrder',
                                        orderFlag:2,
                                        type: 3
                                    },
                                    {
                                        id: 316,
                                        name: '316',
                                        title: '已拒单',
                                        link: '/maintenanceOrder',
                                        orderFlag:2,
                                        type: 4
                                    },
                                    {
                                        id: 317,
                                        name: '317',
                                        title: '缺件暂停',
                                        link: '/maintenanceOrder',
                                        orderFlag:2,
                                        type: 6
                                    },
                                    {
                                        id: 318,
                                        name: '318',
                                        title: '已下发',
                                        link: '/maintenanceOrder',
                                        orderFlag:2,
                                        type: 7
                                    },
                                    {
                                        id: 319,
                                        name: '319',
                                        title: 'MES执行中',
                                        link: '/maintenanceOrder',
                                        orderFlag:2,
                                        type: 8
                                    },
                                    {
                                        id: 3110,
                                        name: '3110',
                                        title: '待援助',
                                        link: '/maintenanceOrder',
                                        orderFlag:2,
                                        type: 17
                                    },
                                    {
                                        id: 3111,
                                        name: '3111',
                                        title: 'OA待审核',
                                        link: '/maintenanceOrder',
                                        orderFlag:2,
                                        type: 18
                                    },
                                    {
                                        id: 3112,
                                        name: '3112',
                                        title: '已修复',
                                        link: '/maintenanceOrder',
                                        orderFlag:2,
                                        type: 19
                                    },
                                    {
                                        id: 3113,
                                        name: '3113',
                                        title: '未修复',
                                        link: '/maintenanceOrder',
                                        orderFlag:2,
                                        type: 20
                                    },
                                    {
                                        id: 3114,
                                        name: '3114',
                                        title: '已撤单',
                                        link: '/maintenanceOrder',
                                        orderFlag:2,
                                        type: 14
                                    },
                                    {
                                        id: 3115,
                                        name: '3115',
                                        title: '已完成',
                                        link: '/maintenanceOrder',
                                        orderFlag:2,
                                        type: 11
                                    }
                                ]
                            },
                            {
                                id: 32,
                                name: '32',
                                title: '委外维修工单',
//                              src: "../static/img/work.svg",
                                link: '/orderOutsourced'
                            },
                        ]
                    },
                    {
                        parentItem: '3',
                        isShow: this.$rt(this.authJson.EAM.导航区域.备件管理),
                        childrenItems: [
                            {
                                id: 40,
                                name: '40',
                                title: '备件台账',
                                link: '/spareParts',
                            },
                            {
                                id: 41,
                                name: '41',
                                title: '备件基础数据',
//                                link: '/spareParts',
                                children: [
                                    {
                                        id: 410,
                                        name: '410',
                                        title: '类型管理',
                                        link: '/typeManage',
                                    },
                                    {
                                        id: 411,
                                        name: '411',
                                        title: '供应商管理',
                                        link: '/supplierManage',
                                    },
                                ]
                            },
                            {
                                id: 42,
                                name: '42',
                                title: '备件领用记录',
                                link: '/leadRecord',
                            },
                            {
                                id: 43,
                                name: '43',
                                title: '备件退料记录',
                                link: '/rejectRecord',
                            }
                        ]
                    },
                    {
                        parentItem: '4',
                        isShow: this.$rt(this.authJson.EAM.导航区域.人员管理),
                        childrenItems: [
                            {
                                id: 50,
                                name: '50',
                                title: '人员档案',
                                link: '/personList'
                            },
                            {
                                id: 51,
                                name: '51',
                                title: '人员分组',
                                link: '/productSchedul',
                                type:'1',
                            },
                            {
                                id: 52,
                                name: '52',
                                title: '维修班次',
                                link: '/productSchedul',
                                type:'2',
                            },
                            {
                                id: 53,
                                name: '53',
                                title: '区域分工',
                                link: '/productSchedul',
                                type:'3',
                            },
                            {
                                id: 54,
                                name: '',
                                title: '人员绩效',
                                isUnDo: true,
                                link: '/'
                            }
                        ]
                    },
                    {
                        parentItem: '5',
                        isShow: true,
                        childrenItems: [
                            /*{
                                id: 60,
                                name: '60',
                                isUnDo: true,
                                title: '参数配置',
                                link: '/',
                                isShow: this.$rt(this.authJson.EAM.导航区域.参数配置)
                            },
                            {
                                id: 61,
                                name: '61',
                                isUnDo: true,
                                title: '流程配置',
                                link: '/',
                                isShow: this.$rt(this.authJson.EAM.导航区域.流程配置)

                            },*/
                            {
                                id: 62,
                                name: '62',
                                title: '流程指南',
                                link: '/processGuidance',
                                isShow: this.$rt(this.authJson.EAM.流程指南)
                            },
                            /*{
                                id: 63,
                                name: '63',
                                title: '维修知识库',
                                isUnDo: true,
                                link: '/',
                                isShow: this.$rt(this.authJson.EAM.导航区域.维修知识库)
                            },
                            {
                                id: 64,
                                name: '64',
                                title: '问题反馈',
                                isUnDo: true,
                                link: '/',
                                isShow: this.$rt(this.authJson.EAM.导航区域.问题反馈)
                            },*/
                            {
                                id: 65,
                                name: '65',
                                title: '基础数据导入',
                                link: '/batchManage',
                                isShow: true
                            },
                            {
                                id: 66,
                                name: '66',
                                title: '参数设置',
                                link: '/parameterSetting',
                                isShow: true
                            }
                        ]
                    }
                ],
                parentName: 0,
                approvalStatusArr: this.$base_info.tEamEquipmentPurchaseApplicationFromStatusEnum
            }
        },
        watch: {
            $route(to, from) {
                let nowRouter = to.path;
                let querys = to.query;
                sessionStorage.setItem('now_router', nowRouter);
                sessionStorage.setItem('router_query', JSON.stringify(querys));
            }
        },
        mounted() {
//            console.log('parentNode == '+JSON.stringify(this.parentNode))
//            console.log('sessionStorage active_name == '+sessionStorage.getItem('active_name'))
            if (this.parentNode!=undefined) {
                if (sessionStorage.getItem('parent_name') != null) {
                    this.parentName = sessionStorage.getItem('parent_name');
                    this.activeMenuName = sessionStorage.getItem('active_name');
                    this.childByParentId(sessionStorage.getItem('parent_name'));
                    this.choosedMenu(sessionStorage.getItem('active_name'));
                    this.$router.push({
                        path: sessionStorage.getItem('now_router'),
                        query: JSON.parse(sessionStorage.getItem('router_query'))
                    });
                } else {
//                this.parentName = 0;
//                this.$router.push({path: '/'})
                }
            }
//            console.log('this.parentName == '+this.parentName)
//            console.log('this.activeMenuName == '+this.activeMenuName)
//            console.log('TEamApproveDispatchOrderStatusEnum == '+JSON.stringify(this.$base_info.tEamApproveDispatchOrderStatusEnum))
//           this.initPage();
//            this.autoThirdNavs(0);
        },
        computed: {
            /*新加*/
            menuitemClasses: function() {
                return [
                    'menu-item',
                    this.isCollapsed ? 'collapsed-menu' : ''
                ]
            },

            parentNode() {
                if (this.sideitems[this.parentName].isShow) {
                    return this.sideitems[this.parentName]
                } else {
                    for (let i=0; i<this.sideitems.length; i++) {
                        if (this.sideitems[i].isShow) {
                            return this.sideitems[i];
                        }
                    }
                }
            },
        },
        components: {
            'v-header': header,
            'v-login': login,
        },
        methods: {
            /*新加*/
            childByParentId(childValue) {
                this.parentName = childValue;
                sessionStorage.setItem('parent_name', childValue)
                let links = this.sideitems.filter(item => item.parentItem == childValue);
                if (links.length > 0 && links[0].childrenItems != undefined) {
                    if (links[0].childrenItems[0].link) {
                        this.$router.push({
                            path: links[0].childrenItems[0].link,
                            query: {type: links[0].childrenItems[0].type}
                        });
                    } else if (links[0].childrenItems[0].children[0].orderFlag) {
                        this.$router.push({
                            path: links[0].childrenItems[0].children[0].link,
                            query: {
                                type: links[0].childrenItems[0].children[0].type,
                                orderFlag: links[0].childrenItems[0].children[0].orderFlag
                            }
                        });
                    }
                    if (links[0].childrenItems[0].children) {
//                    console.log('有三级菜单');
                        let name = links[0].childrenItems[0].name;
                        this.openMenuName = [name];
                        this.activeMenuName = links[0].childrenItems[0].children[0].name;
                    } else {
                        this.activeMenuName = links[0].childrenItems[0].name;
                    }
                }
                this.$nextTick(() => {
                    this.$refs.side_menu.updateOpened();
                    this.$refs.side_menu.updateActiveName();
                })
            },

            go(routerName, index, type, funcId, plan) {
                if(type) {
                    this.$router.push({path: routerName, query: { type: type}});
                } else if(type&&plan) {
                    this.$router.push({path: routerName, query: {type: type, plan: plan}});
                } else {
                    this.$router.push({path: routerName});
                }
            },
            initPage() {
                let vm = this;
                this.$axios.get("auth/nav").then(function (response) {
                    let searchF = false;
                    let res = response.data.response.data;
//                    console.log("res: " + JSON.stringify(res));
                    vm.userName = response.data.response.data;
                    vm.sideitems = [];
                    for (var o in res) {
                        let sideitem = {};
                        let content = res[o].rightContent.split(";");
                        sideitem['id'] = res[o].id;
                        if (res[o].id == 15008) searchF = true;
                        sideitem['name'] = res[o].rightName;
                        sideitem['funcId'] = res[o].toFunctionLinkId;
                        sideitem['src'] = content[0];
                        sideitem['link'] = content[1];
                        vm.sideitems.push(sideitem);
                    }
//                    console.log(" vm.sideitems: " +  JSON.stringify(vm.sideitems));
                    /*存在搜索功能则获取搜索下拉信息*/
//                    if(searchF) {
//                        vm.$axios.get("tpmPlan/searchInit").then(function (response) {
//                            let res = response.data.response.data;
////                            console.log(res);
//                            vm.planStatusArr = res.planStatus;
//                            vm.planTypeArr = res.planType;
////                            console.log(JSON.stringify(vm.formItem));
//                        });
//                    }
                });
            },
            dropdownClick(name){
                this.choosedMenu(name);
            },
            choosedMenu(name) {
                this.parentName = this.parentNode.parentItem;
                this.activeMenuName = name;
                sessionStorage.setItem('active_name', name);
                let links = this.sideitems.filter(item => item.parentItem == this.parentName);
                if (links.length > 0 && links[0].childrenItems != undefined) {
                    let secondNav = links[0].childrenItems;
                    for (let i = 0; i < secondNav.length; i++) {
                        if (!secondNav[i].children) {
                            if (secondNav[i].name == name) {
                                this.$router.push({path: secondNav[i].link, query: {type: secondNav[i].type}});
                            }
                        } else {
                            for (let j = 0; j < secondNav[i].children.length; j++) {
                                if (secondNav[i].children[j].name == name) {
                                    if (secondNav[i].children[j].plan) {
                                        this.$router.push({path: secondNav[i].children[j].link,
                                            query: {
                                                type: secondNav[i].children[j].type,
                                                plan: secondNav[i].children[j].plan,
                                            }
                                        })
                                    } else {
                                        this.$router.push({path: secondNav[i].children[j].link,
                                            query: {
                                                type: secondNav[i].children[j].type,
                                                orderFlag: secondNav[i].children[j].orderFlag
                                            }
                                        })
                                    }
                                    this.openMenuName = [secondNav[i].name];
                                }
                            }
                        }
                    }
                }
            },

        },

    }
</script>
<style lang="less">
    .wel {
        background: #ffffff;
        height: 100%;
        background-image: url("/static/img/welcome.png");
        background-size: auto;
        background-repeat: no-repeat;
        background-position: center;
    }
    .ivu-layout-sider {
        top: 48px;
    }
    .ivu-layout-sider-trigger {
        top: 60px;
        padding-top: 10px;
    }
    .ivu-layout-sider-trigger .ivu-icon-chevron-left:before {
        content: "\F20D";
        font-size: 24px;
    }
    .ivu-layout-sider-trigger.ivu-layout-sider-trigger-collapsed .ivu-layout-sider-trigger-icon {
        transform: rotateZ(90deg);
    }
    .ivu-menu-dark.ivu-menu-vertical .ivu-menu-opened .ivu-menu .ivu-menu-item {
        padding-left: 54px !important;
    }
    .ivu-menu-item>span {
        font-family: SimSun;
        font-size: 16px;
    }
    .layout-con{
        height: 100%;
        width: 100%;
    }
    .menu-item span{
        display: inline-block;
        overflow: hidden;
        width: 100px;
        font-size: 16px;
        text-overflow: ellipsis;
        white-space: nowrap;
        vertical-align: bottom;
        transition: width .2s ease .2s;
    }
    .menu-item i{
        transform: translateX(0px);
        transition: font-size .2s ease, transform .2s ease;
        vertical-align: middle;
        font-size: 16px;
    }
    .collapsed-menu span{
        width: 0;
        transition: width .2s ease;
    }
    .collapsed-menu i{
        transform: translateX(5px);
        transition: font-size .2s ease .2s, transform .2s ease .2s;
        vertical-align: middle;
        font-size: 22px;
    }
    .ivu-poptip-body {
        display: none;
    }
    .unDoClass {
        color: #afafaf;
        cursor: not-allowed;
    }
</style>
