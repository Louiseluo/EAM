<template>
    <div class="basic bzzy-search">
        <!--模块名称-->
        <div class="title">
            <span>设备预验收列表--{{pageTitle}}</span>
        </div>
        <!--表单-->
        <div class="form-content">
            <Form :model="acceptForm" label-position="right" inline :label-width="100">
                <Form-item label="预验收单编号">
                    <Input v-model="acceptForm.bill_no" @on-blur="acceptForm.bill_no = toValidate(acceptForm.bill_no)" style="width: 160px;"></Input>
                </Form-item>
                <Form-item label="设备名称">
                    <Input v-model="acceptForm.equipment_local_name" @on-blur="acceptForm.equipment_local_name = toValidate(acceptForm.equipment_local_name)" style="width: 160px;"></Input>
                </Form-item>
                <!--<Form-item label="单据状态">
                    <Select v-model="MfStatus" class="typeSelect">
                        <Option v-for="status in MfStatues" :value="status.code" :key="status.code">{{status.desc}}</Option>
                    </Select>
                </Form-item>-->
                <FormItem label="预验收日期">
                    <Row>
                        <Col span="11">
                        <DatePicker v-model="acceptForm.apply_time_start" type="date" placeholder="选择日期" @on-change="checkStart"></DatePicker>
                        </Col>
                        <Col span="2" align="center">
                        ~</Col>
                        <Col span="11">
                        <DatePicker v-model="acceptForm.apply_time_end" type="date" placeholder="选择日期" @on-change="checkEnd"></DatePicker>
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
            return {
                //权限校验
                if_query: this.$rt(this.authJson.EAM.设备台账.设备预验收列表页.查询),
                if_delete: this.$rt(this.authJson.EAM.设备台账.设备预验收列表页.删除),
                if_detail: this.$rt(this.authJson.EAM.设备台账.设备预验收列表页.查看),
                if_export: this.$rt(this.authJson.EAM.设备台账.设备预验收列表页.导出),

                pageTitle: '',
                created: false,
                acceptForm: {
                    bill_no: '',
                    equipment_local_name: '',
                    pageStatus: '',
                    apply_time_start: '',
                    apply_time_end: ''
                },
                /*分页*/
                page:1,
                pageSize:10,
                numMaterial: 0,
                /*分页*/
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
                        key: 'purchaseBillNo',
                        align: 'center',
                        render: (h, params) => {
                            return h('a', {
                                on: {
                                    click: () => {
//                                        console.log('id === '+params.row.purchaseId)
                                        this.goApplyDetail(params.row.purchaseId, params.row.preAcceptanceApprovalStatusStr)
                                    }
                                }
                            }, params.row.purchaseBillNo)
                        },
                    },
                    {
                        title: '预验收单号',
                        key: 'preAcceptanceBillNo',
                        align: 'center',
                        render: (h, params) => {
                            return h('p', {
                                domProps: {
                                    title: params.row.preAcceptanceBillNo
                                }
                            }, params.row.preAcceptanceBillNo)
                        }
                    },
                    {
                        title: '设备名称',
                        key: 'purchaseEquipmentLocalName',
                        align: 'center',
                        render: (h, params) => {
                            return h('p', {
                                domProps: {
                                    title: params.row.purchaseEquipmentLocalName
                                },
                                class: 'iview_tabDis',
                            }, params.row.purchaseEquipmentLocalName)
                        },
                    },
                    {
                        title: '规格型号',
                        key: 'purchaseModelName',
                        align: 'center',
                        render: (h, params) => {
                            return h('p', {
                                domProps: {
                                    title: params.row.purchaseModelName
                                },
//                                class: 'iview_tab_numDis',
                            }, params.row.purchaseModelName)
                        },
                    },
                    {
                        title: '请购数量',
                        key: 'purchaseQuantity',
                        align: 'center',
                    },
                    {
                        title: '预验收日期',
                        key: 'preAcceptanceDate',
                        align: 'center'
                    },
                    {
                        title: '需求日期',
                        key: 'purchaseRequiredDate',
                        align: 'center'
                    },
                    {
                        title: '单据状态',
                        key: 'preAcceptanceApprovalStatusStr',
                        align: 'center'
                    },
                    {
                        title: '操作',
                        render: (h, params) => {
                            let btns = [];
                            if (this.if_detail) {
                                btns.push(
                                    h('a', {
                                        class: 'mar-r-5',
                                        on: {
                                            click: () => {
                                                this.detail(params.row.preAcceptanceId, params.row.preAcceptanceApprovalStatusStr, params.row.preAcceptanceBillNo)
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
                                                this.del(params.row.preAcceptanceId)
                                            }
                                        }
                                    }, '删除')
                                )
                            }

                            if(this.if_export && (params.row.preAcceptanceApprovalStatus == 5 || params.row.preAcceptanceApprovalStatus == 2 || params.row.preAcceptanceApprovalStatus == 6)){
                                btns.push(
                                    h('a', {
                                        class: 'mar-r-5',
                                        on: {
                                            click: () => {
                                                this.exportFiles(params.row.preAcceptanceId);
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
            }
        },
        activated: function () {
            this.created && this.pageInit();
            this.created = true;
        },
        mounted(){
            this.page = 1;
            this.pageSize = 10;
            this.pageTitle = this.$route.query.title;
            let type = this.$route.query.type
            this.acceptForm.pageStatus = type;
//            console.log('mounted type == '+type)
            this.pageTitle = this.$base_info.getDescByCode(parseInt(this.$route.query.type), this.$base_info.tEamEquipmentPurchaseApplicationFromStatusEnum);
//            console.log('this.pageStatus == '+this.acceptForm.pageStatus)
            this.pageInit();
        },
        watch: {
            $route(to, from){
                this.page = 1;
                this.pageSize = 10;
                this.acceptForm.pageStatus = to.query.type;
                this.pageTitle = this.$base_info.getDescByCode(parseInt(this.acceptForm.pageStatus), this.$base_info.tEamEquipmentPurchaseApplicationFromStatusEnum)
                this.pageInit();
            }
        },
        methods: {
            /*******  导出文件 S *******/
            exportFiles(formId){
                this.$axios.get('/tEamExport/equipmentPreAcceptanceApplicationFormExport', {
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
            //初始化
            pageInit() {
                let vt = this;
                this.$axios.post('/equipmentApplication/preAcceptaceList', {
                    page: vt.page,
                    pageSize: vt.pageSize,
                    bill_no: vt.acceptForm.bill_no,
                    equipment_local_name: vt.acceptForm.equipment_local_name,
                    approval_status: vt.acceptForm.pageStatus==-1 ? '': vt.acceptForm.pageStatus == 5 ? 2 : vt.acceptForm.pageStatus,
                    apply_time_start: vt.acceptForm.apply_time_start,
                    apply_time_end: vt.acceptForm.apply_time_end
                }).then((res) => {
//                    console.log('res ===== ');
//                    console.log(JSON.stringify(res));
                    let result = res.data.response;
//                    console.log(JSON.stringify(result));
                    if (result.code != 1) {
                        vt.$Message.error(result.msg);
                    } else {
                        vt.scrapData = [...result.data.Rows];
                        for (let i=0; i<vt.scrapData.length; i++) {
                            vt.scrapData[i].preAcceptanceApprovalStatusStr = vt.$base_info.getDescByCode(vt.scrapData[i].preAcceptanceApprovalStatus, vt.$base_info.tEamEquipmentPurchaseApplicationFromStatusEnum)
                        }
                        vt.numMaterial = result.data.Total;
                    }
                }).catch((err) => {
                    console.log(err);
                })
            },
            /*查询*/
            searchResult() {
                this.page = 1;
                this.pageInit();
            },
            //翻页
            changePage(currentPage) {
                this.page = currentPage;
                this.pageInit();
            },
            //查看详情
            detail(id, status, code) {
//                console.log('id == '+id);
//                console.log('status == '+status);
                status = this.$base_info.getCodeByDesc(status, this.$base_info.tEamEquipmentPurchaseApplicationFromStatusEnum)
                this.$router.push({path: '/toAcceptDetail', query: {preAcceptaceId: id, status: status, code: code}});
            },
            //关联到请购单详情页
            goApplyDetail (id, status) {
                this.$router.push({path: '/applyDetails', query: {editFlag: 0, applyId: id}});
            },
            //删除
            del(id) {
                this.$axios.post('/equipmentApplication/preAcceptaceDelete', {
                    preAcceptaceId: id
                }).then((res) => {
//                    console.log('del res');
//                    console.log(JSON.stringify(res));
                    let result = res.data.response;
                    if (result.code != 1) {
                        this.$Message.error(result.msg);
                    } else {
                        this.$Message.success('删除成功！');
                        this.pageInit();
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
            //时间大小比较
            checkStart(sTime) {
                if (this.acceptForm.apply_time_end != '') {
                    if (sTime > this.acceptForm.apply_time_end) {
                        this.$Message.error('开始时间应在结束时间之前');
                    }
                }
                this.acceptForm.apply_time_start = sTime;
            },
            checkEnd(eTime) {
                if (this.acceptForm.apply_time_start != '') {
                    if (eTime < this.acceptForm.apply_time_start) {
                        this.$Message.error('结束时间应在开始时间之后');
                    }
                }
                this.acceptForm.apply_time_end = eTime;
            },
        }
    }
</script>
