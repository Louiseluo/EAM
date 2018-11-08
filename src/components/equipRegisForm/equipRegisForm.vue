<template>
    <div class="basic bzzy-change">
        <!--模块名称-->
        <div class="title">
            <span>关键设备登记表</span>
        </div>
        <!--表单-->
        <div class="form-content">
            <Form v-model="regForm" label-position="right" inline :label-width="100">
                <Form-item label="设备名称">
                    <Input v-model="regForm.equipment_name" @on-blur="regForm.equipment_name=toValidate(regForm.equipment_name)" style="width: 160px;"></Input>
                </Form-item>
                <Form-item label="设备编码">
                    <Input v-model="regForm.equipment_code" @on-blur="regForm.equipment_code=toValidate(regForm.equipment_code)" style="width: 160px;"></Input>
                </Form-item>
                <Form-item label="生产厂家">
                    <div style="color:#ffffff" onmousemove="this.style.color='#5b5b5b';"
                         onmouseout="this.style.color='#ffffff'">
                                <span @click="deleteManuf" v-if="regForm.manufacturer_id">
                                    <Icon type="ios-close" class="deleteTab"></Icon>
                                </span>
                        <div class="input-search pointDis" @click="manuf_mod = true">
                            <Input v-model="regForm.manufacturer_id" :readonly=true style="width: 160px;"></Input>
                            <Button icon="ios-search"></Button>
                        </div>
                    </div>
                </Form-item>
                <Form-item label="规格型号">
                    <div style="color:#ffffff" onmousemove="this.style.color='#5b5b5b';"
                         onmouseout="this.style.color='#ffffff'">
                            <span @click="deleteEqu" v-if="regForm.model_id">
                                <Icon type="ios-close" class="deleteTab"></Icon>
                            </span>
                        <div class="input-search pointDis" @click="equType_mod=true">
                            <Input v-model="regForm.model_id" :readonly=true style="width: 160px;"></Input>
                            <Button icon="ios-search"></Button>
                        </div>
                    </div>
                </Form-item>
                <Form-item label="安装地点">
                    <div style="color:#ffffff" onmousemove="this.style.color='#5b5b5b';"
                         onmouseout="this.style.color='#ffffff'">
                                <span @click="deleteSite" v-if="regForm.factory_location_id">
                                    <Icon type="ios-close" class="deleteTab"></Icon>
                                </span>
                        <div class="input-search pointDis" @click="equSite_mod=true">
                            <Input v-model="regForm.factory_location_id" :readonly=true style="width: 160px;"></Input>
                            <Button icon="ios-search"></Button>
                        </div>
                    </div>
                </Form-item>
            </Form>
            <div align="right" class="btnGroupDesign">
                <Button v-if="if_query" type="primary" @click="search">查询</Button>
            </div>
        </div>
        <div style="width: 100px;height: 55px;margin: 15px 0;"><img style="width: 100%;height: 100%;" src="../../../static/img/ch_logo.jpg" alt=""></div>
        <!--<h3>单据类型码：P006E </h3>-->
        <!--表格-->
        <div class="table-content ivu-table-auto">
            <Table  stripe :columns="tableColumns" :data="tableDatas" border></Table>
        </div>
        <div class="page">
            <Page size="small" :current="page" :total="totalPages" :page-size="pageSize" @on-change="changePage" show-elevator></Page>
        </div>
        <!--生产厂家-->
        <Modal v-model="manuf_mod" title="生产厂家" @on-ok="toSelect_manuf">
            <manufactur @manufSelected="manuf_hasSelected"></manufactur>
        </Modal>
        <!--规格型号-->
        <Modal v-model="equType_mod" title="规格型号" @on-ok="toSelect_equType">
            <equ_typeSelect @typeSelected="type_hasSelected"></equ_typeSelect>
        </Modal>
        <Modal v-model="equSite_mod" title="设备地点" @on-ok="toSelect_equSite">
            <tree_equSite @getEquSite="siteSelected"></tree_equSite>
        </Modal>
    </div>
</template>
<script>
    import manufactur from '../treeMulitiple/manufactur.vue';
    import equ_typeSelect from "../treeMulitiple/equ_typeSelect.vue";
    import tree_equSite from '../treeMulitiple/tree_equSite.vue'
    export default {
        data() {
            return {
                //权限校验
                if_query: this.$rt(this.authJson.EAM.设备台账.关键设备登记表.查询),
                regForm: {
                    equipment_name: '',
                    equipment_code: '',
                    manufacturer_id: '',
                    model_id: '',
                    factory_location_id: '',
                },
                page: 1,
                pageSize: 10,
                totalPages: 10,
                tableColumns: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 70,
                        align: 'center'
                    },
                    {
                        title: '设备编号',
                        align: 'center',
                        children: [
                            {
                                title: '厂内编号',
                                key: 'internalCode',
                                align: 'center',
                                render: (h, params) => {
                                    return h('p', {
                                        domProps: {
                                            title: params.row.internalCode
                                        },
                                        class: 'iview_tabDis',
                                    }, params.row.internalCode)
                                }
                            },
                            {
                                title: '生产厂家编号',
                                key: 'createCode',
                                align: 'center',
                                render: (h, params) => {
                                    return h('p', {
                                        domProps: {
                                            title: params.row.createCode
                                        },
                                        class: 'iview_tabDis',
                                    }, params.row.createCode)
                                }
                            }
                        ]
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
                        }
                    },
                    {
                        title: '生产厂家',
                        key: 'manufacturerName',
                        align: 'center',
                        render: (h, params) => {
                            return h('p', {
                                domProps: {
                                    title: params.row.manufacturerName
                                },
                                class: 'iview_tabDis',
                            }, params.row.manufacturerName)
                        }
                    },
                    {
                        title: '规格型号',
                        key: 'modelName',
                        align: 'center'
                    },
                    {
                        title: '安装地点',
                        key: 'factoryLocationName',
                        align: 'center',
                        render: (h, params) => {
                            return h('p', {
                                domProps: {
                                    title: params.row.factoryLocationName
                                },
                                class: 'iview_tabDis',
                            }, params.row.factoryLocationName)
                        }
                    },
                    {
                        title: '电机功率',
                        key: 'power',
                        align: 'center'
                    },
                    {
                        title: '设备原值',
                        key: 'purchasePrice',
                        align: 'center'
                    },
                    {
                        title: '重要程度',
                        key: 'importance',
                        align: 'center',
                        render: (h, params) => {
                            return h('p', {
                                domProps: {
                                    title: params.row.importance
                                },
                                class: 'iview_tabDis',
                            }, params.row.importance)
                        }
                    },
                    {
                        title: '设备管理责任人',
                        key: 'userName',
                        align: 'center'
                    }
                ],
                tableDatas: [],
                //生产厂家
                manuf_mod: false,
                selectManuf: {},
                //规格型号
                equType_mod: false,
                selectType: {},
                //安装地点
                equSite_mod: false,
                selectSite: {}
            }
        },
        components: {
            'manufactur': manufactur,
            'equ_typeSelect': equ_typeSelect,
            'tree_equSite': tree_equSite
        },
        mounted() {
            this.pageInit();
        },
        methods: {
            //查询
            search() {
                this.page = 1;
                this.pageInit();
            },
            //初始化
            pageInit() {
                let vt = this;
                this.$axios.post('equipmentApplication/crucialEquipmentList', {
                    equipment_name: vt.regForm.equipment_name,
                    equipment_code: vt.regForm.equipment_code,
                    manufacturer_id: vt.regForm.manufacturer_id,
                    model_id: vt.regForm.model_id,
                    factory_location_id: vt.regForm.factory_location_id,
                    page: vt.page,
                    pageSize: vt.pageSize
                }).then((res) => {
//                    console.log('res === ')
//                    console.log(JSON.stringify(res));
                    let ret = res.data.response;
                    if (ret.code == 1) {
                        vt.tableDatas = ret.data.Rows;
                        vt.totalPages = ret.data.Total;
                    } else {
                        vt.$Message.error(ret.msg);
                    }
                }).catch((err) => {
                    console.log(err);
                })
            },
            //翻页
            changePage(currentPage) {
                this.page = currentPage;
                this.pageInit();
            },
            //生产厂家
            manuf_hasSelected(msg) {
                this.selectManuf = msg;
            },
            toSelect_manuf() {
                this.regForm.manufacturer_id = this.selectManuf.tBdEquipmentManufacturerName;
            },
            deleteManuf() {
                this.regForm.manufacturer_id = '';
            },
            //规格型号
            type_hasSelected(msg) {
                this.selectType = msg;
            },
            toSelect_equType() {
                this.regForm.model_id = this.selectType.modelName;
            },
            deleteEqu() {
                this.regForm.model_id = '';
            },
            //安装地点
            siteSelected(msg) {
                this.selectSite = msg;
            },
            //地点确定按钮：
            toSelect_equSite(){
                this.regForm.factory_location_id = this.selectSite.title;
            },
            //删除地点
            deleteSite(){
                this.regForm.factory_location_id = '';
            },
            toValidate(msg) {
                var str = /[=+%!<>"'/_,()\\]/;
                if (str.test(msg)) {
                    this.$Message.warning("输入格式错误");
                    msg = msg.replace(/\'/g,"").replace(/\"/g,"").replace(/\+/g,"").replace(/\=/g,"").replace(/\%/g,"").replace(/\!/g,"").replace(/\</g,"").replace(/\>/g,"").replace(/\//g,"").replace(/\_/g,"").replace(/\,/g,"").replace(/\(/g,"").replace(/\)/g,"").replace(/\\/g,"");
                }
                return msg;
            }
        }
    }
</script>