<template>
    <div class="basic bzzy-search">
        <!--模块名称-->
        <div class="title">
            <span>设备验收列表--{{pageTitle}}</span>
        </div>
        <!--表单-->
        <div class="form-content">
            <Form v-model="searchForm" label-position="right" inline :label-width="100">
                <Form-item label="验收单编号" prop="billNo">
                    <Input v-model="searchForm.billNo" @on-blur="searchForm.billNo = toValidate(searchForm.billNo)"></Input>
                </Form-item>
                <Form-item label="设备名称">
                    <Input v-model="searchForm.equipmentName" @on-blur="searchForm.equipmentName = toValidate(searchForm.equipmentName)"></Input>
                </Form-item>
                <!--<Form-item label="单据状态">
                    <Select v-model="MfStatus" class="typeSelect">
                        <Option v-for="status in MfStatues" :value="status.code" :key="status.code">{{status.desc}}</Option>
                    </Select>
                </Form-item>-->
                <FormItem label="验收日期">
                    <Row>
                        <Col span="11">
                        <DatePicker v-model="searchForm.time_start" type="date" placeholder="选择日期" @on-change="checkStart" :editable=false></DatePicker>
                        </Col>
                        <Col span="2" align="center">
                        ~</Col>
                        <Col span="11">
                        <DatePicker v-model="searchForm.time_end" type="date" placeholder="选择日期" @on-change="checkEnd" :editable=false></DatePicker>
                        </Col>
                    </Row>
                </FormItem>
            </Form>
            <!--查询按钮-->
            <div class="btn-query">
                <Button v-if="if_query" type="primary" icon="search" size="large" @click="searchResult">查询</Button>
            </div>
        </div>
        <!--表格-->
        <div class="table-content ivu-table-auto">
            <Table stripe border :columns="scrapColumns" :data="scrapData"></Table>
        </div>
        <div class="page">
            <Page :total="numMaterial" :current="page" size="small" show-elevator :page-size="pageSize" @on-change="changePage"></Page>
        </div>
    </div>
</template>
<script>
    export default {
        data (){
            //验证名称
            return {
                //权限校验
                if_query: this.$rt(this.authJson.EAM.设备台账.设备验收列表页.查询),
                if_delete: this.$rt(this.authJson.EAM.设备台账.设备验收列表页.删除),
                if_detail: this.$rt(this.authJson.EAM.设备台账.设备验收列表页.查看),
                if_export: this.$rt(this.authJson.EAM.设备台账.设备验收列表页.导出),

                created: false,
                /*搜索条件*/
                searchForm:{
                    billNo:"",
                    equipmentName: "",
                    approvalStatus: "",
                    time_start: "",
                    time_end: "",
                },
                /*分页*/
                page:1,
                pageSize:10,
                numMaterial: 5,
                /*分页*/
                notFitDataTip:'',
                /*查询列表渲染*/
                scrapColumns: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 80,
                        align: 'center'
                    },
                    {
                        title: '关联请购单',
                        key: 'purchaseFormBillNo',
                        align: 'center',
                        render: (h, params) => {
                            return h('a', {
                                domProps: {
                                    title: params.row.purchaseFormBillNo
                                },
                                on: {
                                    click: () => {
//                                        console.log('params.row.purchaseFormId == '+params.row.purchaseFormId)
                                        this.goApplyDetail(params.row.approveStatus,params.row.purchaseFormId)
                                    }
                                },
                                class: 'iview_tabDis',
                            }, params.row.purchaseFormBillNo)
                        },
                    },
                    {
                        title: '关联预验收单号',
                        key: 'preAcceptanceFormBillNo',
                        align: 'center',
                        render: (h, params) => {
                            return h('p', {
                                domProps: {
                                    title: params.row.preAcceptanceFormBillNo
                                }
                            }, params.row.preAcceptanceFormBillNo)
                        }
                    },
                    {
                        title: '验收单编号',
                        key: 'acceptanceFormBillNo',
                        align: 'center',
                        render: (h, params) => {
                            return h('p', {
                                domProps: {
                                    title: params.row.acceptanceFormBillNo
                                }
                            }, params.row.acceptanceFormBillNo)
                        }
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
                                class: 'iview_tabDis',
                            }, params.row.equipmentName)
                        },
                    },
                    {
                        title: '制造厂家',
                        key: 'manufacturer',
                        align: 'center',
                        render: (h, params) => {
                            return h('p', {
                                domProps: {
                                    title: params.row.manufacturer
                                },
//                                class: 'iview_tab_numDis',
                            }, params.row.manufacturer)
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
                                },
//                                class: 'iview_tab_numDis',
                            }, params.row.model)
                        },
                    },
                    {
                        title: '设备存放地点',
                        key: 'installationLocation',
                        align: 'center',
                    },
                    {
                        title: '验收日期',
                        key: 'approveTime',
                        align: 'center'
                    },
                    {
                        title: '单据状态',
                        key: 'approveStatusStr',
                        align: 'center',
                        render: (h, params) => {
                            return h('p', {
                                domProps: {
                                    title: params.row.approveStatusStr
                                }
                            }, params.row.approveStatusStr)
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
                                                this.detail(params.row.acceptanceFormId,params.row.approveStatusStr)
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
                                                this.del(params.row.acceptanceFormId)
                                            }
                                        }
                                    }, '删除')
                                )
                            }
                            if(this.if_export && (params.row.approveStatus == 5 || params.row.approveStatus == 2 || params.row.approveStatus == 6)){
                                btns.push(
                                    h('a', {
                                        class: 'mar-r-5',
                                        on: {
                                            click: () => {
                                                this.exportFiles(params.row.acceptanceFormId);
                                            }
                                        }
                                    }, '导出')
                                );
                            }
                            return h('div', btns)
                        },
                        align: 'center'
                    },
                ],
                scrapData:[],
                pageTitle: ''
            }
        },

        mounted(){
            this.page = 1;
            this.pageSize = 10;
            let type = this.$route.query.type;
            this.searchForm.approvalStatus = type;
            this.pageTitle = this.$base_info.getDescByCode(parseInt(type), this.$base_info.tEamEquipmentPurchaseApplicationFromStatusEnum);
            this.acceptListLoad();
        },
        watch: {
            '$route' (to, from) {
                this.page = 1;
                this.pageSize = 10;

                if(to.query.type != null){
                    this.searchForm.approvalStatus = to.query.type;
                    this.pageTitle = this.$base_info.getDescByCode(parseInt(this.searchForm.approvalStatus), this.$base_info.tEamEquipmentPurchaseApplicationFromStatusEnum);;
                }
                this.acceptListLoad();
            }
        },
        methods: {
            /*******  导出文件 S *******/
            exportFiles(formId){
                this.$axios.get('/tEamExport/EquipmentAdjustmentAcceptanceFormArchivingExport', {
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
            /*列表渲染*/
            acceptListLoad () {
                let vm = this;
//                console.log("热热热" + JSON.stringify(vm.searchForm.approvalStatus))
                this.$axios.post('/equipmentApplication/acceptanceList', {
                    page: vm.page,
                    pageSize: vm.pageSize,
                    billNo: vm.searchForm.billNo,
                    equipmentName: vm.searchForm.equipmentName,
                    approvalStatus: vm.searchForm.approvalStatus == 5 ? 6 : vm.searchForm.approvalStatus,
                    approvalStart: vm.searchForm.time_start,
                    approvalEnd: vm.searchForm.time_end,
                }).then((res) => {
//                    console.log("res +12222 " + JSON.stringify(res))
//                    console.log( "res +ddd " + vm.searchForm.approvalStatus)
                    let result = res.data.response;
                    if (result.code == 1) {
//                        console.log("res +cxcxcxc " + JSON.stringify(res))
                        this.numMaterial = result.data.total;
                        let scrapDataList = result.data.rows;
//                        console.log("5555555555"+ JSON.stringify(scrapDataList))
                        let scrapDataInfo = [];
                        for (let q in scrapDataList) {
                            let approveStatusDesc = vm.$base_info.getDescByCode(scrapDataList[q].approveStatus, vm.$base_info.tEamEquipmentPurchaseApplicationFromStatusEnum);
                            scrapDataInfo.push({
                                acceptanceFormId: scrapDataList[q].acceptanceFormId,
                                purchaseFormId: scrapDataList[q].purchaseFormId,
                                purchaseFormBillNo: scrapDataList[q].purchaseFormBillNo,
                                preAcceptanceFormBillNo: scrapDataList[q].preAcceptanceFormBillNo,
                                acceptanceFormBillNo: scrapDataList[q].acceptanceFormBillNo,
                                equipmentName: scrapDataList[q].equipmentName,
                                manufacturer: scrapDataList[q].manufacturer,
                                model: scrapDataList[q].model,
                                installationLocation: scrapDataList[q].installationLocation,
                                approveTime: scrapDataList[q].approveTime,
                                approveStatus: scrapDataList[q].approveStatus,
                                approveStatusStr: approveStatusDesc,
                            })
                        }
//                        console.log("ddd"+ JSON.stringify(scrapDataInfo))
                        vm.scrapData = scrapDataInfo;
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
            //关联到请购单详情页
            goApplyDetail (status,id) {
                this.$router.push({path: '/applyDetails', query: {'title': status, 'editFlag': 0, 'applyId': id}});
            },
            /*设备验收查询end*/
            detail(id,status){
                status = this.$base_info.getCodeByDesc(status, this.$base_info.tEamEquipmentPurchaseApplicationFromStatusEnum);
//                console.log('s === '+s)
                let title = this.$base_info.getCodeByDesc(this.pageTitle, this.$base_info.tEamEquipmentPurchaseApplicationFromStatusEnum);
                this.$router.push({path: '/acceptDetail', query: {'id': id,'status':status}});
            },
            del(id) {
                this.$axios.post('/equipmentApplication/acceptanceDelete',{
                    acceptanceFormId: id
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
