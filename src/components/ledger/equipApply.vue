<template>
    <div class="basic bzzy-search">
        <!--模块名称-->
        <div class="title">
            <span>设备请购--{{pageTitle}}</span>
        </div>
        <!--表单-->
        <div class="form-content">
            <Form v-model="searchForm" label-position="right" inline :label-width="100">
                <FormItem label="请购单编号" prop="billNo">
                    <Input v-model="searchForm.billNo" @on-blur="searchForm.billNo = toValidate(searchForm.billNo)"></Input>
                </FormItem>
                <!--<Form-item label="请购单状态" prop="status">
                    <Select style="width: 160px;">
                        <Option v-for="item in items" :value="item.code" :key="item.code">{{ item.desc }}</Option>
                    </Select>
                </Form-item>-->
                <Form-item label="请购时间" prop="createAt">
                    <Row>
                        <Col span="11">
                        <DatePicker v-model="searchForm.time_start" type="date" placeholder="选择日期" @on-change="checkStart"></DatePicker>
                        </Col>
                        <Col span="2" align="center">
                        ~</Col>
                        <Col span="11">
                        <DatePicker v-model="searchForm.time_end" type="date" placeholder="选择日期" @on-change="checkEnd" ></DatePicker>
                        </Col>
                    </Row>
                </Form-item>
            </Form>
            <!--查询按钮-->
            <div class="btn-query">
                <Button type="primary" icon="search" size="large" @click="searchList" v-if="rule_search">查询</Button>
                <router-link :to="{ path: 'applyDetails',query: {editFlag:1,listStatus:this.searchForm.approvalStatus}}" v-show="this.searchForm.approvalStatus == -1" v-if="rule_new">
                    <Button type="primary" icon="plus" size="large">新建</Button>
                </router-link>
            </div>
        </div>
        <!--表格-->
        <div class="table-content" style="width: 100%;">
            <Table stripe border :columns="applyColumns" :data="applyData"></Table>
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
                rule_search:this.$rt(this.authJson.EAM.设备台账.设备请购列表.查询),
                rule_new:this.$rt(this.authJson.EAM.设备台账.设备请购列表.新建),
                rule_delet:this.$rt(this.authJson.EAM.设备台账.设备请购列表.删除),
                rule_view:this.$rt(this.authJson.EAM.设备台账.设备请购列表.查看),
                rule_download:this.$rt(this.authJson.EAM.设备台账.设备请购列表.导出),
                /*权限*/

                /* ** 分页 ** */
                page:1,// 默认1
                pageSize:10,// 默认10
                currentPage:1,// 默认10
                listNum:0,// 默认10
                /* ** 分页 ** */
                searchForm:{
                    billNo:'',// 请购单编号
                    approvalStatus:'',// 请购单状态
                    time_start:'',// 请购开始时间
                    time_end:'',// 请购结束时间
                },

                applyColumns: [
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
                        key: 'approvalStatusStr',
                        align: 'center'
                    },
                    {
                        title: '操作',
                        key: 'action',
                        render: (h, params) => {
                            let btns = [];
                            if(this.rule_view){
                                btns.push(
                                    h('a', {
                                        class: 'mar-r-5',
                                        on: {
                                            click: () => {
                                                this.$router.push({path: '/applyDetails',query: {editFlag:0,applyId:params.row.id,listStatus:this.searchForm.approvalStatus}});
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
                                                this.delApply(params.row.id);
                                            }
                                        }
                                    }, '删除')
                                );
                            }
                            if(this.rule_download){
                                if(params.row.approvalStatus == 5 || params.row.approvalStatus == 2 || params.row.approvalStatus == 6){
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
                applyData:[],
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
        watch: {
            '$route' (to, from) {
                this.page = 1;
                this.pageSize = 10;
                this.searchForm.approvalStatus = to.query.type;
                this.getPageTitle(to.query.type);
                this.applyListLoad();
            }
        },
        mounted(){
            this.page = 1;
            this.pageSize = 10;
            this.searchForm.approvalStatus = this.$route.query.type;
            this.getPageTitle(this.$route.query.type);
            this.applyListLoad();
        },

        methods: {
            getPageTitle(type){
                type = parseInt(type)
                this.pageTitle = this.$base_info.getDescByCode(type,this.$base_info.tEamEquipmentPurchaseApplicationFromStatusEnum)
            },
            /*******  导出文件 S *******/
            exportFiles(formId){
                this.$axios.get('/tEamExport/equipmentPurchaseApplicationFormExport', {
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
                this.applyListLoad();
            },
            applyListLoad(){
                let vm = this;
                this.$axios.post('/equipmentApplication/equipmentPurchaseDetails', {
                    page: vm.page,
                    pageSize: vm.pageSize,
                    billNo: vm.searchForm.billNo,
                    approvalStatus: vm.searchForm.approvalStatus == 5 ? 2 : vm.searchForm.approvalStatus,
                    startTime : vm.searchForm.time_start,
                    endTime : vm.searchForm.time_end,
                }).then((res) => {
                    let respone = res.data.response;
//                    console.log("respone + " + JSON.stringify(respone))
                    if (respone.code  === 1) {
                        if(respone.data != []){
                            this.applyData = [...respone.data.rows];
                            for(let i=0;i<this.applyData.length;i++){
                                this.applyData[i].approvalStatusStr = this.$base_info.getDescByCode(this.applyData[i].approvalStatus,this.$base_info.tEamEquipmentPurchaseApplicationFromStatusEnum)
                            }
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
            //查询时验证输入框不能为英文单双引号
            delApply(applyId){
                this.$axios.post('/equipmentApplication/'+ applyId +'/equipmentPurchaseDelete').then((res) => {
                    let respone = res.data.response;
                    if (respone.code  === 1) {
                        this.$Message.success(respone.data);
                        this.applyListLoad();
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
                let starE = this.searchForm.time_end;
                let starS = this.searchForm.time_start;
                if (this.searchForm.time_end != '') {
                    if (starE < starS) {
                        this.$Message.error("开始时间应在结束时间之前");
                        this.searchForm.time_start = "";
                    } else {
                        this.searchForm.time_start = time;
                    }
                };
            },
            //结束日期应大于开始日期
            checkEnd(time){
                let starE = this.searchForm.time_end;
                let starS = this.searchForm.time_start;
                if (this.searchForm.time_start != '') {
                    if (starE < starS) {
                        this.$Message.error("结束时间应在开始时间之后");
                        this.searchForm.time_end = "";
                    } else {
                        this.searchForm.time_end = time;
                    }
                };
            },
            //分页
            pageChange(page){
                this.page = page;
                this.applyListLoad();
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
