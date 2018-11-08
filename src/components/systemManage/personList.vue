<template>
    <div class="basic bzzy-search">
        <!--模块名称-->
        <div class="title">
            <span>人员档案</span>
        </div>
        <!--表单-->
        <div class="form-content">
            <Form v-model="searchForm" label-position="right" inline :label-width="100">
                <Form-item label="姓名" prop="name">
                    <Input v-model="searchForm.name" @on-blur="searchForm.name = toValidate(searchForm.name)"></Input>
                </Form-item>
                <Form-item label="部门">
                    <!--<Input v-model="searchForm.departmentName" @on-blur="searchForm.departmentName = toValidate(searchForm.departmentName)"></Input>-->
                    <div style="color:#ffffff" onmousemove="this.style.color='#5b5b5b';" onmouseout="this.style.color='#ffffff'">
                        <span @click="deleteManuf" v-if="searchForm.departmentName">
                            <Icon type="ios-close" class="deleteTab"></Icon>
                        </span>
                        <div class="input-search pointDis" @click="dep_mod = true">
                            <Input v-model="searchForm.departmentName" :readonly=true style="width: 160px;"></Input>
                            <Button icon="ios-search"></Button>
                        </div>
                    </div>
                </Form-item>
                <Form-item label="岗位">
                    <div style="color:#ffffff" onmousemove="this.style.color='#5b5b5b';" onmouseout="this.style.color='#ffffff'">
                        <span @click="deletePos" v-if="searchForm.positionName">
                            <Icon type="ios-close" class="deleteTab"></Icon>
                        </span>
                        <div class="input-search pointDis" @click="pos_mod = true">
                            <Input v-model="searchForm.positionName" :readonly=true style="width: 160px;"></Input>
                            <Button icon="ios-search"></Button>
                        </div>
                    </div>
                </Form-item>
                <Form-item label="编码">
                    <Input v-model="searchForm.code" @on-blur="searchForm.code = toValidate(searchForm.code)"></Input>
                </Form-item>
                <Form-item label="状态">
                    <Select v-model="searchForm.status" class="typeSelect">
                        <Option v-for="status in MfStatues" :value="status.code" :key="status.code">{{status.desc}}</Option>
                    </Select>
                </Form-item>
            </Form>
            <!--查询按钮-->
            <div class="btn-query">
                <Button v-if="if_query" type="primary" icon="search" size="large" @click="searchResult">查询</Button>
                <router-link :to="{ path: 'person',query: {editFlag:1}}" v-if="if_new">
                    <Button type="primary" icon="plus" size="large">新建</Button>
                </router-link>
            </div>
        </div>
        <!--表格-->
        <div class="table-content ivu-table-auto">
            <Table stripe border :columns="personColumns" :data="personData"></Table>
        </div>
        <div class="page">
            <Page :total="numMaterial" :current="page" size="small" show-elevator :page-size="pageSize" @on-change="changePage"></Page>
        </div>
        <!-- 部门 -->
        <Modal v-model="dep_mod" title="部门" @on-ok="toSelect_dep">
            <departmentMod @depSelected="dep_hasSelected"></departmentMod>
        </Modal>
        <!-- 岗位 -->
        <Modal v-model="pos_mod" title="岗位" @on-ok="toSelect_pos">
            <positionMod @posSelected="pos_hasSelected"></positionMod>
        </Modal>
    </div>
</template>
<script>
    import departmentMod from '../treeMulitiple/departmentMod.vue';
    import positionMod from '../treeMulitiple/positionMod.vue';
    export default {
        data (){
            //验证名称
            return {
                //权限校验
                if_query: this.$rt(this.authJson.EAM.人员管理.人员档案列表页.查询),
                if_detail: this.$rt(this.authJson.EAM.人员管理.人员档案列表页.查看),
                if_delete: this.$rt(this.authJson.EAM.人员管理.人员档案列表页.删除),
                if_new: this.$rt(this.authJson.EAM.人员管理.人员档案列表页.新建),
                created: false,
                /*搜索条件*/
                searchForm:{
                    personId:"",                     //人员id
                    name:"",                          //姓名
                    departmentId:"",                //部门id
                    departmentName:"",              //部门
                    positionId:"",                   //岗位id
                    positionName:"",                 //岗位
                    productionTeamId:"",            //班组id
                    productionTeamName:"",          //班组名称
                    shiftId:"",                       //班次id
                    shiftName:"",                     //班次名称
                    code:"",                        //编号
                    status:"",                        //状态
                    mobile:"",                        //手机
                    weixin:"",                        //微信
                },
                /*分页*/
                page:1,
                pageSize:10,
                numMaterial: 5,
                /*分页*/
                notFitDataTip:'',
                /*查询列表渲染*/
                personColumns: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 80,
                        align: 'center'
                    },
                    {
                        title: '姓名',
                        key: 'name',
                        align: 'center'
                    },
                    {
                        title: '编码',
                        key: 'code',
                        align: 'center',
                    },
                    {
                        title: '部门',
                        key: 'departmentName',
                        align: 'center',
                    },
                    {
                        title: '岗位',
                        key: 'positionName',
                        align: 'center',
//                        render: (h, params) => {
//                            return h('p', {
//                                domProps: {
//                                    title: params.row.equipmentName
//                                },
//                                class: 'iview_tabDis',
//                            }, params.row.equipmentName)
//                        },
                    },
                    {
                        title: '班组',
                        key: 'productionTeamName',
                        align: 'center',
//                        render: (h, params) => {
//                            return h('p', {
//                                domProps: {
//                                    title: params.row.manufacturer
//                                },
////                                class: 'iview_tab_numDis',
//                            }, params.row.manufacturer)
//                        },
                    },
                    {
                        title: '班次',
                        key: 'shiftName',
                        align: 'center',
//                        render: (h, params) => {
//                            return h('p', {
//                                domProps: {
//                                    title: params.row.model
//                                },
////                                class: 'iview_tab_numDis',
//                            }, params.row.model)
//                        },
                    },
                    {
                        title: '手机',
                        key: 'mobile',
                        align: 'center',
                    },
                    {
                        title: '微信',
                        key: 'weixin',
                        align: 'center'
                    },
                    {
                        title: '状态',
                        key: 'status',
                        align: 'center',
                        render: (h, params) => {
                            return h('p', {
                                domProps: {
                                    title: this.$base_info.getDescByCode(params.row.status, this.$base_info.tEamPersonStatusEnum)
                                }
                            }, this.$base_info.getDescByCode(params.row.status, this.$base_info.tEamPersonStatusEnum))
                        }
                    },
                    {
                        title: '操作',
                        key: 'action',
                        render: (h, params) => {
                            let btns = [];
                            if (this.if_detail) {
                                btns.push(
                                h('a', {
                                    class: 'mar-r-5',
                                    on: {
                                        click: () => {
                                            this.$router.push({path: '/person',query: {editFlag:0,id:params.row.personId}});
//                                            this.$router.push({path: '/person',query: {id:params.row.personId}});
//                                            this.detail(params.row.personId)
//                                            this.$router.push({path: '/acceptDetail', query: {'id': params.row.acceptanceFormId, 'title': this.pageTitle,'from': 'toDetail','status':params.row.approveStatus}});
                                        }
                                    }
                                }, '查看'),
                                )
                            }
                            if (this.if_delete) {
                                btns.push(
                                h('a', {
                                    class: 'mar-r-5',
                                    on: {
                                        click: () => {
                                            this.del(params.row.personId)
                                        }
                                    }
                                }, '删除')
                                )
                            }
                            return h('div', btns)
                        },
                        align: 'center'
                    },
                ],
                personData:[],
                MfStatues:[],
                pageTitle: '',
                //部门
                dep_mod: false,
                selectDep: {},
                //岗位
                pos_mod: false,
                selectPos: {},
            }
        },
        components: {
            'departmentMod': departmentMod,
            'positionMod': positionMod,
        },
        mounted(){
            this.page = 1;
            this.pageSize = 10;
            this.pageTitle = this.$route.query.title;
            this.MfStatues = this.$base_info.tEamPersonStatusEnum;
//            this.searchForm.approvalStatus = this.$route.query.type;
            this.acceptListLoad();
        },
        watch: {
            '$route' (to, from) {
                this.page = 1;
                this.pageSize = 10;
                this.pageTitle = to.query.title;
//                if(to.query.type != null){
//                    this.searchForm.approvalStatus = to.query.type;
//                }
                this.acceptListLoad();
            }
        },
        methods: {
            /*列表渲染*/
            acceptListLoad () {
                let vm = this;
                this.$axios.post('/System/personDetails', {
                    page: vm.page,
                    pageSize: vm.pageSize,
                    name: vm.searchForm.name,
                    departmentId: vm.searchForm.departmentId,
                    positionId: vm.searchForm.positionId,
                    code: vm.searchForm.code,
                    status: vm.searchForm.status==-1 ? '' : vm.searchForm.status,
                }).then((res) => {
                    let result = res.data.response;
                    if (result.code == 1) {
                        vm.numMaterial = result.data.total;
                        vm.personData = result.data.rows;
//                        console.log(" vm.personData + " + JSON.stringify(res))
                    } else {
                        //.. 业务失败的情况
                        this.$Message.error(result.msg);
                    }
                }).catch((err) => {
                    console.log("无数据 + " + err);
                });
            },
            searchResult:function () {
                this.page = 1;
                this.acceptListLoad();
            },
            changePage:function (currentPage) {
                this.page = currentPage;
                this.acceptListLoad();
            },
            //部门
            dep_hasSelected(msg) {
                this.selectDep = msg;
            },
            toSelect_dep() {
                this.searchForm.departmentId = this.selectDep.tBdDepartmentId;
                this.searchForm.departmentName = this.selectDep.tBdDepartmentName;
            },
            deleteManuf() {
                this.searchForm.departmentId = '';
                this.searchForm.departmentName = '';
            },
            //岗位
            pos_hasSelected(msg) {
                this.selectPos = msg;
            },
            toSelect_pos() {
                this.searchForm.positionId = this.selectPos.tBdPositionId;
                this.searchForm.positionName = this.selectPos.tBdPositionName;
            },
            deletePos() {
                this.searchForm.positionId = '';
                this.searchForm.positionName = '';
            },
            //关联到请购单详情页
            goApplyDetail (status,id) {
                this.$router.push({path: '/applyDetails', query: {'title': status, 'editFlag': 0, 'applyId': id}});
            },
            /*设备验收查询end*/
//            detail(id){
////                let s = this.$base_info.getCodeByDesc(status, this.$base_info.tEamEquipmentPurchaseApplicationFromStatusEnum);
//                this.$router.push({path: '/person', query: {'id': this.searchForm.personId}});
//            },
            del(id) {
                this.$axios.post('/System/personDelete',{
                    personId: id
                }).then((res) => {
                    let result = res.data.response;
                    if (result.code != 1) {
                        this.$Message.error(result.msg);
                    } else {
                        this.$Message.success('删除成功！');
                        this.acceptListLoad();
                    }
                }).catch((err) => {
                    console.log(err);
                })
            },
            //查询时验证输入框不能为英文单双引号
            toValidate(msg) {
                var str = /[=+%!<>"'/_,()\\]/;
                if (str.test(msg)) {
                    this.$Message.warning("输入格式错误");
                    msg = msg.replace(/\'/g,"").replace(/\"/g,"").replace(/\+/g,"").replace(/\=/g,"").replace(/\%/g,"").replace(/\!/g,"").replace(/\</g,"").replace(/\>/g,"").replace(/\//g,"").replace(/\_/g,"").replace(/\,/g,"").replace(/\(/g,"").replace(/\)/g,"").replace(/\\/g,"");
                }
                return msg;
            },
            //开始日期应小于结束日期
            checkStart(time){
                var stime = time;
                if (this.searchForm.time_end != '') {
                    if (stime > this.searchForm.time_end) {
                        this.notFitDataTip = '开始时间应在结束时间之前';
                        this.$Message.error(this.notFitDataTip);
                        this.searchForm.time_start = ""
                    }
                    else {
                        this.notFitDataTip = ""
                    };
                };
                this.searchForm.time_start = stime
            },
            //结束日期应大于开始日期
            checkEnd(time){
                var etime = time;
                if (this.searchForm.time_start != '') {
                    if (etime < this.searchForm.time_start) {
                        this.notFitDataTip = '结束时间应在开始时间之后';
                        this.$Message.error(this.notFitDataTip);
                        this.searchForm.time_end = "";
                    }
                    else {
                        this.notFitDataTip = ""
                    }
                };
                this.searchForm.time_end = etime;
            },
        },
    }
</script>