<template>
    <div class="basic bzzy-search">
        <!--模块名称-->
        <div class="title">
            <span>设备报废--{{pageTitle}}</span>
        </div>
        <!--表单-->
        <div class="form-content">
            <Form ref="scrapForm" :model="scrapForm" :label-width="100" inline>
                <FormItem label="设备编码" prop="equNo">
                    <Input v-model="scrapForm.equipmentCode" @on-blur="scrapForm.equipmentCode = toValidate(scrapForm.equipmentCode)" placeholder="" ></Input>
                </FormItem>
                <FormItem label="设备名称" prop="equipmentName">
                    <Input v-model="scrapForm.equipmentName" @on-blur="scrapForm.equipmentName = toValidate(scrapForm.equipmentName)" placeholder="" ></Input>
                </FormItem>
                <!--<FormItem label="状态" prop="scrapStatus">
                    <Select v-model="scrapForm.scrapStatus" style="width: 160px">
                        &lt;!&ndash;<Option v-for="item in standardTypeItem" :value="item.code" :key="item.code" >{{ item.desc }}</Option>&ndash;&gt;
                        <Option value="1">提交申请</Option>
                    </Select>
                </FormItem>-->
                <Form-item label="报废日期" prop="scrapStart">
                    <Row>
                        <Col span="11">
                        <DatePicker v-model="scrapForm.scrapTimeStart" type="date" placeholder="选择日期和时间" @on-change="changeStart"></DatePicker>
                        </Col>
                        <Col span="2" style="text-align: center">~</Col>
                        <Col span="11">
                        <DatePicker v-model="scrapForm.scrapTimeEnd" type="date" placeholder="选择日期和时间" @on-change="changeEnd"></DatePicker>
                        </Col>
                    </Row>
                </Form-item>
            </Form>
            <!--查询按钮-->
            <div class="btn-query">
                <Button v-if="if_query" type="primary" icon="search" size="large" @click="searchResult">查询</Button>
                <router-link v-if="if_add" :to="{path: '/equScrapSteps', query: {editFlag: 1}}" v-show="pageStatus==-1">
                    <Button type="primary" icon="plus" size="large">新建</Button>
                </router-link>
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
        created: function () {
        },
        data (){
            return {
                //权限校验
                if_query: this.$rt(this.authJson.EAM.设备台账.设备报废列表页.查询),
                if_add: this.$rt(this.authJson.EAM.设备台账.设备报废列表页.新建),
                if_delete: this.$rt(this.authJson.EAM.设备台账.设备报废列表页.删除),
                if_detail: this.$rt(this.authJson.EAM.设备台账.设备报废列表页.查看),
                if_export: this.$rt(this.authJson.EAM.设备台账.设备报废列表页.导出),
                pageTitle: '',
                pageStatus: '',
                logoSrc:"../../static/img/ch_logo.jpg",
                docTypeCode:'P015E',
                created: false,
                /*分页*/
                page:1,
                pageSize:10,
                numMaterial: 0,
                /*分页*/
                scrapForm:{
                    equipmentCode:"",
                    equipmentName:"",
                    status: -1,
                    scrapTimeStart:"",
                    scrapTimeEnd:""
                },

                /*查询列表渲染*/
                scrapColumns: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 80,
                        align: 'center'
                    },
                    {
                        title: '报废单号',
                        key: 'billNo',
                        align: 'center',
                        render: (h, params) => {
                            return h('a', {
                                domProps: {
                                    title: params.row.billNo
                                },
                                on: {
                                    click: () => {
                                        this.detail(params.row.id, params.row.status)
                                    }
                                },
                                class: 'iview_tabDis',
                            }, params.row.billNo)
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
                                class: 'iview_tabDis',
                            }, params.row.equipmentName)
                        },
                    },
                    {
                        title: '设备编码',
                        key: 'equipmentCode',
                        align: 'center',
                        render: (h, params) => {
                            return h('a', {
                                domProps: {
                                    title: params.row.equipmentCode
                                },
                                class: 'iview_tabDis',
                                on: {
                                    click: () => {
                                        this.goResume(params.row.equipmentId)
                                    }
                                }
                            }, params.row.equipmentCode)
                        },
                    },
                    {
                        title: '制造商',
                        key: 'manufacturer',
                        align: 'center',
                        render: (h, params) => {
                            return h('p', {
                                domProps: {
                                    title: params.row.manufacturer
                                }
                            }, params.row.manufacturer)
                        }
                    },
                    {
                        title: '规格型号',
                        key: 'equipmentModel',
                        align: 'center',
                        render: (h, params) => {
                            return h('p', {
                                domProps: {
                                    title: params.row.equipmentModel
                                }
                            }, params.row.equipmentModel)
                        }
                    },
                    {
                        title: '设备原值',
                        key: 'purchasePrice',
                        align: 'center',
                    },
                    {
                        title: '购入日期',
                        key: 'acceptanceDate',
                        align: 'center'
                    },
                    {
                        title: '报废日期',
                        key: 'applyTime',
                        align: 'center',
                        render: (h, params) => {
                            return h('p', {
                                domProps: {
                                    title: params.row.applyTime
                                }
                            }, params.row.applyTime)
                        }
                    },
                    {
                        title: '状态',
                        key: 'statusStr',
                        align: 'center',
                        render: (h, params) => {
                            return h('p', {
                                domProps: {
                                    title: params.row.statusStr
                                }
                            }, params.row.statusStr)
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
//                                            console.log('id == '+params.row.id)
                                                this.detail(params.row.id,params.row.status)
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
                                                this.delete(params.row.id)
                                            }
                                        }
                                    }, '删除'),
                                );
                            }
                            if(this.if_export && (params.row.status == 5 || params.row.status == 2 || params.row.status == 6)){
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
                            return h('div', btns)
                        },

                    },
                ],
                scrapData:[],
            }
        },
        watch: {
            $route(to, from) {
                this.page = 1;
                this.pageSize = 10;
//                this.pageTitle = to.query.title;
                this.pageStatus = to.query.type;
                this.pageTitle = this.$base_info.getDescByCode(parseInt(this.pageStatus), this.$base_info.tEamEquipmentPurchaseApplicationFromStatusEnum);
                this.pageInit();
            }
        },
        activated: function () {
            this.created && this.postStandardWorkInfo();
            this.created = true;
        },
        mounted() {
            this.page = 1;
            this.pageSize = 10;
//            this.pageTitle = this.$route.query.title;
//            console.log('pageTitle == '+this.pageTitle);
            this.pageStatus = this.$route.query.type;
            this.pageTitle = this.$base_info.getDescByCode(parseInt(this.pageStatus), this.$base_info.tEamEquipmentPurchaseApplicationFromStatusEnum);
//            console.log('pageStatus == '+this.pageStatus);
            this.pageInit();
        },
        methods: {
            /*******  导出文件 S *******/
            exportFiles(formId){
                console.log("formId + " + formId)
                this.$axios.get('/tEamExport/equipmentScrappingApplicationFormExport', {
                    params: {
                        formId: formId
                    }
                }).then((res) => {
                    console.log("res + " + JSON.stringify(res))
                    let respone = res.data.response;
                    if (respone.code  === 1) {
                        window.location.href = "../static/doc/" + respone.data.fileName;
                        this.$Message.success('导出成功！');
                    } else {
                        //.. 业务失败的情况
                        this.$Message.error({
                            content: '导出失败！',
                            duration: 5,
                            closable: true
                        });
                    }
                }).catch((err) => {
                    console.log("无数据 + " + err);
                });
            },
            /*******  导出文件 E *******/
            //页面初始化
            pageInit() {
                let vt = this;
                this.$axios.post('/equipmentApplication/equScrapList', {
                    equipmentCode: vt.scrapForm.equipmentCode,
                    equipmentName: vt.scrapForm.equipmentName,
                    status: vt.pageStatus == 5 ? 6 : vt.pageStatus == null ? -1 : vt.pageStatus,
                    scrapTimeStart: vt.scrapForm.scrapTimeStart,
                    scrapTimeEnd: vt.scrapForm.scrapTimeEnd,
                    pageSize: vt.pageSize,
                    page: vt.page
                }).then((res) => {
//                    console.log('pageinit res');
//                    console.log(JSON.stringify(res));
                    let ret = res.data.response;
                    if (ret.code == 1) {
                        vt.scrapData = ret.data.rows;
                        for (let i=0; i<vt.scrapData.length; i++) {
                            vt.scrapData[i].statusStr = vt.$base_info.getDescByCode(vt.scrapData[i].status, vt.$base_info.tEamEquipmentPurchaseApplicationFromStatusEnum);
                        }
                        vt.numMaterial = ret.data.total;
                    } else {
                        this.$Message.error(ret.msg);
                    }
                }).catch((err) => {
                    console.log(err);
                })
            },
            //查询
            searchResult() {
                this.page = 1;
                this.pageInit();
            },
            //翻页
            changePage(currentPage) {
                this.page = currentPage;
                this.pageInit();
            },
            /*详情页面*/
            detail(id, status){
                this.$router.push({path: '/equScrapSteps', query: {'id': id, 'status': status, 'editFlag': 0}});
            },
            //删除
            delete(id) {
                this.$axios.post('/equipmentApplication/equScrapDelete', {
                    id: id
                }).then((res) => {
//                    console.log('res =12== ')
//                    console.log(JSON.stringify(res))
                    if (res.data.response.code == 1) {
                        this.$Message.success('删除成功！');
                        this.pageInit();
                    } else {
                        this.$Message.error(res.data.response.msg);
                    }
                }).catch((err) => {
                    console.log(err);
                })
            },
            //跳转到设备履历页面
            goResume(id) {
                this.$router.push({path: '/resume', query: {id: id}})
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
            //判断时间大小
            changeStart(sTime) {
                if (this.scrapForm.scrapTimeEnd != '') {
                    if (sTime > this.scrapForm.scrapTimeEnd) {
                        this.$Message.error('开始时间应在结束时间之前');
                    }
                }
                this.scrapForm.scrapTimeStart = sTime;
            },
            changeEnd(eTime) {
                if (this.scrapForm.scrapTimeStart != '') {
                    if (eTime < this.scrapForm.scrapTimeStart) {
                        this.$Message.error('结束时间应在开始时间之后');
                    }
                }
                this.scrapForm.scrapTimeEnd = eTime;
            }
        }
    }
</script>
