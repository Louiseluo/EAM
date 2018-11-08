<template>
    <div class="basic bzzy-search">
        <!--模块名称-->
        <div class="title">
            <span>设备改造--{{pageTitle}}</span>
        </div>
        <!--表单-->
        <div class="form-content">
            <Form v-model="searchForm" label-position="right" inline :label-width="100">
                <FormItem label="设备名称" prop="billNo">
                    <Input v-model="searchForm.equipmentName" @on-blur="searchForm.equipmentName = toValidate(searchForm.equipmentName)"></Input>
                </FormItem>
                <FormItem label="改造单号" prop="billNo">
                    <Input v-model="searchForm.billNo" @on-blur="searchForm.billNo = toValidate(searchForm.billNo)"></Input>
                </FormItem>
                <FormItem label="安装地点" prop="location">
                    <Input v-model="searchForm.location" @on-blur="searchForm.location = toValidate(searchForm.location)"></Input>
                </FormItem>
                <FormItem label="使用部门" prop="department">
                    <Input v-model="searchForm.department" @on-blur="searchForm.department = toValidate(searchForm.department)"></Input>
                </FormItem>
                <Form-item label="改造时间" prop="createAt">
                    <Row>
                        <Col span="11">
                        <DatePicker v-model="searchForm.planTimeStart" type="date" placeholder="选择日期" @on-change="checkStart"></DatePicker>
                        </Col>
                        <Col span="2" align="center">
                        ~</Col>
                        <Col span="11">
                        <DatePicker v-model="searchForm.planTimeEnd" type="date" placeholder="选择日期" @on-change="checkEnd" ></DatePicker>
                        </Col>
                    </Row>
                </Form-item>
            </Form>
            <!--查询按钮-->
            <div class="btn-query">
                <Button type="primary" icon="search" size="large" @click="searchList" v-if="rule_search">查询</Button>
                <router-link  :to="{ path: 'equReformReport',query: {'title':'新建',editFlag:1,reformId:'',listStatus:this.searchForm.status}}" v-show="billStatus == -1">
                    <Button  v-if="rule_new" type="primary" icon="plus" size="large">新建</Button>
                </router-link>
            </div>
        </div>
        <!--表格-->
        <div class="table-content ivu-table-auto">
            <Table stripe border :columns="scrapColumns" :data="scrapData"></Table>
        </div>
        <div class="page">
            <Page size="small" :total='listNum' :current="page" show-elevator :page-size="pageSize" @on-change="pageChange"></Page>
        </div>

    </div>
</template>

<script>
    export default {
        data (){
            //验证名称
            const validateAge = (rule, value, callback) => {

            };
            return {
                /*权限*/
                rule_search:this.$rt(this.authJson.EAM.设备台账.设备改造列表页.查询),
                rule_new:this.$rt(this.authJson.EAM.设备台账.设备改造列表页.新建),
                rule_delet:this.$rt(this.authJson.EAM.设备台账.设备改造列表页.删除),
                rule_view:this.$rt(this.authJson.EAM.设备台账.设备改造列表页.查看),
                rule_download:this.$rt(this.authJson.EAM.设备台账.设备改造列表页.导出),
                /*权限*/
                /* ** 分页 ** */
                page:1,// 默认1
                pageSize:10,// 默认10
                currentPage:1,// 默认10
                listNum:0,// 默认10
                billStatus:'',//单据状态
                /* ** 分页 ** */
                searchForm:{
                     equipmentName:'', //设备名称
                     billNo:'',//改造单号
                     status:'',//状态
                     location:'',//安装地点
                     department:'',//使用部门
                     planTimeStart:'',//改造时间开始
                     planTimeEnd:'',//改造时间开始
                },

               /* applyColumns: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 85,
                        align: 'center'
                    },
                    {
                        title: '请购单编号',
                        key: 'billNo',
                        align: 'center',
                    },
                    {
                        title: '设备名称',
                        key: 'equipmentLocalName',
                        align: 'center',
                    },
                    {
                        title: '规格型号',
                        key: 'modelName',
                        align: 'center',
                    },
                    {
                        title: '请购数量',
                        key: 'purchaseQuantity',
//                        width:'18%',
                        align: 'center',
                    },
                    {
                        title: '请购部门',
                        key: 'departmentName',
//                        width:'18%',
                        align: 'center',
                    },
                    {
                        title: '请购日期',
                        key: 'applyTime',
                        align: 'center',
                    },
                    {
                        title: '需求日期',
                        key: 'requiredDate',
                        align: 'center',
                    },
                    {
                        title: '请购状态',
                        key: 'approvalStatus',
                        align: 'center'
                    },
                    {
                        title: '操作',
                        key: 'action',
                        render: (h, params) => {
                            let btns = [];
                            btns.push(
                                h('a', {
                                    class: 'mar-r-5',
                                    on: {
                                        click: () => {
                                            this.$router.push({path: '/applyDetails',query: {'title':this.pageTitle,editFlag:0,applyId:params.row.id}});
                                        }
                                    }
                                }, '查看')
                            );
                            btns.push(
                                h('a', {
                                    class: 'mar-r-5',
                                    on: {
                                        click: () => {
                                            this.delApply(params.row.id);
                                        }
                                    }
                                }, '删除')
                            );
                            return h('div', btns)
                        },
                        align: 'center'
                    },
                ],
                applyData:[],*/
                /*查询列表渲染*/
                scrapColumns: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 80,
                        align: 'center'
                    },
                    {
                        title: '设备改造单据号',
                        key: 'billNo',
                        align: 'center',
                        render: (h, params) => {
                            return h('a', {
                                domProps: {
                                    title: params.row.billNo
                                },
                                on: {
                                    click: () => {
                                        this.$router.push({path: '/equReformReport',query: {reformId:params.row.id,editFlag:0,listTitle:this.pageTitle,listStatus:this.searchForm.status}});
                                    }
                                },
                                class: 'iview_tabDis',
                            }, params.row.billNo)
                        },
                    },
                    {
                        title: '设备编号',
                        key: 'equipmentCode',
                        align: 'center',
                        render: (h, params) => {
                            return h('a', {
                                domProps: {
                                    title: params.row.equipmentCode
                                },
                                on: {
                                    click: () => {
                                        this.$router.push({path: '/equReformReport',query: {reformId:params.row.id,editFlag:0,}});
                                    }
                                },
                                class: 'iview_tabDis',
                            }, params.row.equipmentCode)
                        },
                    },
                    {
                        title: '设备名称',
                        key: 'equipmentName',
                        align: 'center',
                        render: (h, params) => {
                            return h('p', {
                                domProps: {
                                    title: params.row.equipmentName
                                },
//                                class: 'iview_tab_numDis',
                            }, params.row.equipmentName)
                        },
                    },
                    {
                        title: '规格型号',
                        key: 'model',
                        align: 'center',
                        render: (h, params) => {
                            return h('p', {
                                domProps: {
                                    title: params.row.model
                                }
                            }, params.row.model)
                        }
                    },
                    {
                        title: '安装地点',
                        key: 'location',
                        align: 'center',
                        render: (h, params) => {
                            return h('p', {
                                domProps: {
                                    title: params.row.location
                                }
                            }, params.row.location)
                        }
                    },
                    {
                        title: '使用部门',
                        key: 'department',
                        align: 'center',
                        render: (h, params) => {
                            return h('p', {
                                domProps: {
                                    title: params.row.department
                                }
                            }, params.row.department)
                        }
                    },
                    {
                        title: '状态',
                        key: 'status',
                        align: 'center',
                        width:120,
                        render: (h, params) => {
                            return h('p', {
                                domProps: {
                                    title: params.row.status
                                }
                            }, params.row.status)
                        }
                    },
                    {
                        title: '改造日期',
                        key: 'planTime',
                        align: 'center',
                        width:120,
                        render: (h, params) => {
                            return h('p', {
                                domProps: {
                                    title: params.row.planTime
                                }
                            }, params.row.planTime)
                        }
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width:100,
                        render: (h, params) => {
                            let btns = [];
                            if(this.rule_view){
                                btns.push(
                                    h('a', {
                                        class: 'mar-r-5',
                                        on: {
                                            click: () => {
                                                this.$router.push({path: '/equReformReport',query: {title:'',reformId:params.row.id,editFlag:0,listStatus:this.billStatus}});
                                            }
                                        }
                                    }, '查看')
                                );
                            }
                            if(this.rule_delet){
                                btns.push(
                                    h('a', {
                                        class: 'mar-r-5',
                                        on: {
                                            click: () => {
                                                this.delReform(params.row.id);
                                            }
                                        }
                                    }, '删除')
                                );
                            }
                            if(this.rule_download){
                                if(params.row.status == "OA审核通过" || params.row.status == "已归档" || params.row.status == "已生效"){
                                    btns.push(
                                        h('a', {
                                            class: 'mar-r-5',
                                            on: {
                                                click: () => {
                                                    this.exportFiles(params.row.id);
                                                }
                                            }
                                        }, '导出')
                                    );
                                }
                            }
                            return h('div', btns)
                        },
                        align: 'center'
                    },
                ],
                scrapData:[],
                items: [
                    {
                        code: 0,
                        desc: '请购中'
                    },
                    {
                        code: 1,
                        desc: '已完成'
                    }
                ],
                //页面名称
                pageTitle: '',
                notFitDataTip:'',

            }
        },
        mounted(){
            this.page = 1;
            this.pageSize = 10;
            this.billStatus = this.$route.query.type;
            this.searchForm.status = this.billStatus;
            this.reformListLoad();
            this.getPageTitle(this.$route.query.type);
        },
        watch: {
            '$route' (to, from) {
                this.page = 1;
                this.pageSize = 10;
                this.billStatus = to.query.type;
                this.searchForm.status = this.billStatus;
                this.reformListLoad();
                this.getPageTitle(to.query.type);
            }
        },
        methods: {
            getPageTitle(type){
                type = parseInt(type);
                this.pageTitle = this.$base_info.getDescByCode(type,this.$base_info.tEamEquipmentPurchaseApplicationFromStatusEnum);
            },
            /*******  导出文件 S *******/
            exportFiles(formId){
                this.$axios.get('/tEamExport/equipmentTranformationApplicationFormExport', {
                    params: {
                        formId: formId
                    }
                }).then((res) => {
                    let respone = res.data.response;
                    if (respone.code  === 1) {
                        window.location.href = "../static/doc/" + respone.data.fileName;
                        this.$Message.success('导出成功！');
                    } else {
                        //.. 业务失败的情况
                        this.$Message.error({
                            content: '数据返回错误',
                            duration: 5,
                            closable: true
                        });
                    }
                }).catch((err) => {
                    console.log("无数据 + " + err);
                });
            },
            /*******  导出文件 E *******/
            searchList(){
                this.page = 1;
                this.pageSize = 10;
                this.reformListLoad();
            },
            reformListLoad(){
                let vm = this;
                this.$axios.post('/equipmentApplication/equTransformationList', {
                    page: vm.page,
                    pageSize: vm.pageSize,
                    equipmentName:vm.searchForm.equipmentName, //设备名称
                    billNo:vm.searchForm.billNo,//改造单号
                    status:vm.searchForm.status == 5 ? 2 : vm.searchForm.status,//状态
                    location:vm.searchForm.location,//安装地点
                    department:vm.searchForm.department,//使用部门
                    planTimeStart:vm.searchForm.planTimeStart,//改造时间开始
                    planTimeEnd:vm.searchForm.planTimeEnd,//改造时间开始
                }).then((res) => {
                    let respone = res.data.response;
//                    console.log("respone +" + JSON.stringify(respone))
                    if (respone.code  === 1) {
                        if(respone.data != []){
                            this.scrapData = [...respone.data.rows];
                            this.listNum = respone.data.total;
                        }
                    } else {
                        //.. 业务失败的情况
                        this.$Message.error({
                            content: '数据返回错误',
                            duration: 5,
                            closable: true
                        });
                    }
                }).catch((err) => {
                    console.log("无数据 + " + err);
                });
            },
            /*分页切换*/
            pageChange(page){
                this.page = page;
                this.reformListLoad();
            },
            //查询时验证输入框不能为英文单双引号
            delReform(reformId){
                this.$axios.post('/equipmentApplication/equTransformationDel',{id:reformId}).then((res) => {
                    let respone = res.data.response;
                    if (respone.code  === 1) {
                        this.$Message.error(respone.data);
                        this.reformListLoad();
                    } else {
                        //.. 业务失败的情况
                        this.$Message.error({
                            content: respone.msg,
                            duration: 5,
                            closable: true
                        });
                    }
                }).catch((err) => {
                    console.log("无数据 + " + err);
                });

            },
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
                let starE = this.searchForm.planTimeEnd;
                let starS = this.searchForm.planTimeStart;
                if (this.searchForm.planTimeEnd != '') {
                    if (starE < starS) {
                        this.$Message.error("开始时间应在结束时间之前");
                        this.searchForm.planTimeStart = "";
                    } else {
                        this.searchForm.planTimeStart = time;
                    }
                };
            },
            //结束日期应大于开始日期
            checkEnd(time){
                let starE = this.searchForm.planTimeEnd;
                let starS = this.searchForm.planTimeStart;
                if (this.searchForm.planTimeStart != '') {
                    if (starE < starS) {
                        this.$Message.error("结束时间应在开始时间之后");
                        this.searchForm.planTimeEnd = "";
                    } else {
                        this.searchForm.planTimeEnd = time;
                    }
                };
            },
        }
    }
</script>

<style>
    /*.bzzy-search .table-content div.ivu-table-header th {*/
    /*background-color: #0391da;*/
    /*color: #ffffff;*/
    /*}*/
</style>

