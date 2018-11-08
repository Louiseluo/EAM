<template>
    <div class="basic fault-content">
        <!--模块名称-->
        <div class="title">
            <span>{{pageTitle}}备件{{status==0?"申领":"补领"}}单</span>
        </div>
        <!--表单-->
        <div class="form-content trobleForm">
            <Form :model="spareForm" label-position="right" inline :label-width="120">
                <Form-item label="单据名称">
                    <Input v-model="spareForm.formName" style="width: 160px;" disabled></Input>
                </Form-item>
                <Form-item label="工单编码">
                    <Input v-model="spareForm.billNo" style="width: 160px;" disabled></Input>
                </Form-item>
                <Form-item label="工单类型">
                    <Input v-model="spareForm.type" style="width: 160px;" disabled></Input>
                </Form-item>
                <Form-item label="故障描述" v-show="flag==2">
                    <Input v-model="spareForm.faultDesc" style="width: 160px;" disabled></Input>
                </Form-item>
                <Form-item label="上报人" v-show="flag==2">
                    <Input v-model="spareForm.reportBy" style="width: 160px;" disabled></Input>
                </Form-item>
                <Form-item label="上报时间" v-show="flag==2">
                    <Input v-model="spareForm.reportAt" style="width: 160px;" disabled></Input>
                </Form-item>
                <Form-item label="所属计划编码" v-show="flag==0">
                    <Input v-model="spareForm.planCode" style="width: 160px;" disabled></Input>
                </Form-item>
                <Form-item label="所属计划名称" v-show="flag==0">
                    <Input v-model="spareForm.planName" style="width: 160px;" disabled></Input>
                </Form-item>
                <Form-item label="计划执行时间" v-show="flag==0">
                    <Input v-model="spareForm.planTime" style="width: 160px;" disabled></Input>
                </Form-item>
                <Form-item :label="'待'+pageTitle+'设备编码'">
                    <Input v-model="spareForm.equipmentCode" style="width: 160px;" disabled></Input>
                </Form-item>
                <Form-item :label="'待'+pageTitle+'设备名称'">
                    <Input v-model="spareForm.equipmentName" style="width: 160px;" disabled></Input>
                </Form-item>
                <Form-item label="设备地点">
                    <Input v-model="spareForm.equipmentLocation" style="width: 160px;" disabled></Input>
                </Form-item>
                <hr>
                <Form-item label="申领人账户">
                    <Input v-model="spareForm.applicant" style="width: 160px;" disabled></Input>
                </Form-item>
                <Form-item label="申领人部门">
                    <Input v-model="spareForm.applicantDept" style="width: 160px;" disabled></Input>
                </Form-item>
                <Form-item label="申领人岗位">
                    <Input v-model="spareForm.applicantPosition" style="width: 160px;" disabled></Input>
                </Form-item>
                <Form-item label="申领时间">
                    <Input v-model="spareForm.applyTime" style="width: 160px;" disabled></Input>
                </Form-item>
            </Form>
        </div>

        <Table stripe border :columns="sparePartsColumn" :data="sparePartsData"></Table>
        <Row type="flex" class="mar-t-50">
            <Col span="6">审核人 <span class="lineW120"></span></Col>
            <Col span="6">审核人部门 <span class="lineW120"></span></Col>
            <Col span="6">审核人岗位 <span class="lineW120"></span></Col>
            <Col span="6">审核时间 <span class="lineW120"></span></Col>
        </Row>
        <Row class="btn-group mar-tb-25">
            <Col class="pad-15" span="24" align="center">
            <Button @click="tohistory" class="btn-gary" icon="close" size="large">取消</Button>
            <Button type="primary" size="large" icon="ios-cloud-download" @click="exportForm">导出</Button>
            </Col>
        </Row>
    </div>
</template>
<script>
    export default {
        data(){
            return {
                pageTitle: '', //页面标题
                doId: '',
                status: '',
                formId: '', //备件申领单id
                spareForm:{
                    formId: '',
                    formName: '',
                    billNo: '',
                    type: '',
                    faultDesc: '',
                    reportBy: '',
                    reportAt: '',
                    equipmentCode: '',
                    equipmentName: '',
                    equipmentLocation: '',
                    applicant: '',
                    applicantDept: '',
                    applicantPosition: '',
                    applyTime: ''
                },
                sparePartsColumn: [
                    {
                        title:'序号',
                        type: 'index',
                        width: 70,
                        align: 'center'
                    },
                    {
                        title:'备件编码',
                        key: 'Code',
                        align: 'left',
                        render: (h, params) => {
                            return h('p', {
                                domProps: {
                                    title: params.row.Code
                                },
                                class: 'iview_tabDis',
                            }, params.row.Code)
                        },
                    },
                    {
                        title:'备件名称',
                        key: 'Name',
                        align: 'left',
                        render: (h, params) => {
                            return h('p', {
                                domProps: {
                                    title: params.row.Name
                                },
                                class: 'iview_tabDis',
                            }, params.row.Name)
                        },
                    },
                    {
                        title:'备件类型',
                        key: 'type',
                        align: 'center',
                    },
                    {
                        title:'备件型号',
                        key: 'modelName',
                        align: 'center',
                        render: (h, params) => {
                            return h('p', {
                                domProps: {
                                    title: params.row.modelName
                                },
                                class: 'iview_tabDis',
                            }, params.row.modelName)
                        },
                    },
                    {
                        title:'备件规格',
                        key: 'spec',
                        align: 'center',
                        render: (h, params) => {
                            return h('p', {
                                domProps: {
                                    title: params.row.spec
                                },
                                class: 'iview_tabDis',
                            }, params.row.spec)
                        },
                    },
                    {
                        title:'供应商',
                        key: 'supplierName',
                        align: 'left',
                        render: (h, params) => {
                            return h('p', {
                                domProps: {
                                    title: params.row.supplierName
                                },
                                class: 'iview_tabDis',
                            }, params.row.supplierName)
                        },
                    },
                    {
                        title:'备件单位',
                        key: 'uomName',
                        align: 'center',
                    },
                    {
                        title:'备件数量',
                        key: 'quantity',
                        align: 'right',
                    },
                    {
                        title:'仓库编码',
                        key: 'warehouseCode',
                        align: 'left',
                        render: (h, params) => {
                            return h('p', {
                                domProps: {
                                    title: params.row.warehouseCode
                                },
                                class: 'iview_tabDis',
                            }, params.row.warehouseCode)
                        },
                    },
                    {
                        title:'仓库名称',
                        key: 'warehouseName',
                        align: 'left',
                        render: (h, params) => {
                            return h('p', {
                                domProps: {
                                    title: params.row.warehouseName
                                },
                                class: 'iview_tabDis',
                            }, params.row.warehouseName)
                        },
                    },
                    {
                        title:'仓库地点',
                        key: 'warehouseLocation',
                        align: 'left',
                        render: (h, params) => {
                            return h('p', {
                                domProps: {
                                    title: params.row.warehouseLocation
                                },
                                class: 'iview_tabDis',
                            }, params.row.warehouseLocation)
                        },
                    }
                ],
                sparePartsData: [],
                flag: '',
            }
        },
        mounted(){
            //获取工单Id和flag，status
            let doId = this.$route.query.orderId;
            this.doId = doId;
            let status = this.$route.query.status;
            this.status = status;
            this.flag = this.$route.query.flag;
            if (this.flag == 2) {
//                    console.log('维修');
                this.pageTitle = '维修';
            } else if (this.flag == 0) {
//                    console.log('保养');
                this.pageTitle = '保养';
            }
            this.initPage();
            this.initTableData();
//            console.log('doId');
//            console.log(doId);
//            console.log('status');
//            console.log(status);
//            console.log('flag');
//            console.log(this.flag);
        },

        methods: {
            //页面详情
            initPage(){
                //保养工单详情
                if(this.flag==0){
                    this.$axios.post('/eamDo/maintenanceSparepartApplicationDetail',{
                        dispatchOrderId: this.doId
                    }).then((res) => {
//                        console.log('保养工单 == '+JSON.stringify(res));
                        if (res.data.response.code == 1) {
                            //成功
                            this.spareForm = res.data.response.data;
                            this.spareForm.type = this.$base_info.getDescByCode(this.spareForm.type,this.$base_info.tEamDispatchOrderTypeEnum);
                        } else {
                            this.$Message.error(res.data.response.msg)
                        }
                    }).catch((err) => {
                        console.log(err)
                    })
                    return
                }
                //维修工单详情
                this.$axios.post('/eamDo/maintainSparepartApplicationDetail',{
                    dispatchOrderId: this.doId
                }).then((res) => {
//                    console.log('页面详情 == '+JSON.stringify(res));
                    if (res.data.response.code == 1) {
                        //成功
                        this.spareForm = res.data.response.data;
                        this.spareForm.type = this.spareForm.type==2?"维修工单":"点检工单"
                    } else {
                        this.$Message.error(res.data.response.msg)
                    }
                }).catch((err) => {
                    console.log(err)
                })
            },
            //表格数据
            initTableData() {
                this.$axios.post('/eamDo/getSparePartByDispatchOrder',{
                    dispatchOrderId: this.doId
                }).then((res) => {
//                    console.log('表格数据 == '+JSON.stringify(res));
                    if (res.data.response.code == 1) {
                        //成功
                        this.sparePartsData = res.data.response.data.rows;
                        for (var i in this.sparePartsData) {
                            if (this.sparePartsData[i].type == 1) {
                                this.sparePartsData[i].type = '特殊'
                            } else if (this.sparePartsData[i].type == 0) {
                                this.sparePartsData[i].type = '通用'
                            }
                        }
//                        console.log('表格数据222 == '+JSON.stringify(this.sparePartsData));

                    } else {
                        this.$Message.error(res.data.response.msg)
                    }
                }).catch((err) => {
                    console.log(err)
                })
            },
            //导出
            exportForm(){
                this.$axios.get('/tEamExport/sparePartApplyExport', {
                    params: {
                        formId: this.spareForm.formId
                    }
                }).then((res) => {
//                    console.log('导出== '+JSON.stringify(res))
                    if (res.data.response.code == 1) {
                        //成功
                        window.location.href = "../static/doc/" + res.data.response.data.fileName;
                        this.$Message.success('导出成功！');
                    } else {
                        this.$Message.error(res.data.response.msg)
                    }
                }).catch((err) => {
                    console.log(err)
                })
            },
            //取消
            tohistory(){
                this.$router.back();
            },
        }
    }
</script>