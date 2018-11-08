<template>
    <div class="basic fault-content">
        <!--模块名称-->
        <div class="title">
            <span>备件台账</span>
        </div>
        <!--<div class="titleListManage">
            <ul class="tabUL">
                <li class="active">
                    <a>备件管理</a>
                </li>
                <li>
                    <router-link to='/typeManage'>类型管理</router-link>
                </li>
                <li>
                    <router-link to='/supplierManage'>供应商管理</router-link>
                </li>
                <li>
                    <router-link to='/leadRecord'>领用记录</router-link>
                </li>
            </ul>
        </div>-->
        <div class="form-content">
            <Form ref="formData" :model="formData" label-position="right" inline :label-width="100">
                <FormItem label="备件名称">
                    <Input :maxlength="20" @on-change="lengthChange(formData.name)" v-model="formData.name" @on-blur="formData.name = toValidate(formData.name)" style="width: 160px;"></Input>
                </FormItem>
                <FormItem label="备件分类" prop="classify">
                    <div style="color:#ffffff" onmousemove="this.style.color='#5b5b5b';" onmouseout="this.style.color='#ffffff'">
                                <span @click="deleteParts_item" v-if="formData.classify">
                                    <Icon type="ios-close" class="deleteTab"></Icon>
                                </span>
                        <div class="input-search" @click="typeModal=true;">
                            <Input :maxlength="20" @on-change="lengthChange(formData.classify)" v-model="formData.classify" readonly style="width: 160px;"></Input>
                            <Button icon="ios-search"></Button>
                        </div>
                    </div>
                </FormItem>
                <!--<FormItem label="所属供应商">-->
                <!--&lt;!&ndash;<Input v-model="formData.supplier" style="width: 160px;"></Input>&ndash;&gt;-->
                <!--<div class="input-search" prop="supplier">-->
                <!--&lt;!&ndash;<Input v-model="supplier" style="width: 160px;" readonly :disabled="true"></Input>&ndash;&gt;-->
                <!--&lt;!&ndash;<Button icon="ios-search" @click="openSup" :disabled="true"></Button>&ndash;&gt;-->
                <!--<Input v-model="formData.supplier" style="width: 160px;" readonly></Input>-->
                <!--<Button icon="ios-search" @click="openSup"></Button>-->
                <!--</div>-->
                <!--</FormItem>-->
                <FormItem label="关联设备">
                    <Input @on-change="lengthChange(formData.device)" v-model="formData.device" @on-blur="formData.device = toValidate(formData.device)" style="width: 160px;"></Input>
                </FormItem>
                <FormItem label="运输方式">
                    <!--<Input v-model="formData.shipping" style="width: 160px;"></Input>-->
                    <Select v-model="all" style="width: 160px;">
                        <Option v-for="item in formData.transports" :value="item.code" :key="item.code">
                            {{ item.desc }}
                        </Option>
                    </Select>
                </FormItem>
                <!--<FormItem label="库存仓库">-->
                <!--&lt;!&ndash;<Input v-model="formData.depot" style="width: 160px;"></Input>&ndash;&gt;-->
                <!--<Select v-model="all2" clearable style="width: 160px;" :disabled="true">-->
                <!--<Option v-for="item in formData.depot" :value="item.value" :key="item.value">-->
                <!--{{ item.label }}-->
                <!--</Option>-->
                <!--</Select>-->
                <!--</FormItem>-->
                <!--<FormItem label="库存状态">-->
                <!--&lt;!&ndash;<Input v-model="formData.condition" style="width: 160px;"></Input>&ndash;&gt;-->
                <!--<Select v-model="all3" clearable style="width: 160px;" :disabled="true">-->
                <!--<Option v-for="item in formData.states" :value="item.code" :key="item.code">-->
                <!--{{item.desc}}-->
                <!--</Option>-->
                <!--</Select>-->
                <!--</FormItem>-->
                <!--<FormItem label="采购信息">-->
                <!--&lt;!&ndash;<Input v-model="formData.purchase" style="width: 160px;"></Input>&ndash;&gt;-->
                <!--<Select v-model="all4" clearable style="width: 160px;" >-->
                <!--<Option v-for="item in formData.purchase" :value="item.value" :key="item.value">{{ item.label }}</Option>-->
                <!--</Select>-->
                <!--</FormItem>-->
            </Form>
            <!--查询按钮-->
            <div class="btn-query">
                <Button type="primary" icon="forward" size="large" :disabled="true" v-if="if_export">导出</Button>
                <Button type="primary" icon="search" size="large" @click="partsChange(1)" v-if="if_query">查询</Button>
                <Button type="primary" icon="plus" size="large" @click="add_list" v-if="if_add">新建</Button>
            </div>
        </div>
        <!--表格-->
        <div class="table-content ivu-table-auto" style="margin-bottom: 50px;">
            <Table stripe border :columns="columns" :data="tableData" style="text-align:center"></Table>
        </div>
        <div class="page">
            <Page :total="partsNum" size="small" show-elevator :page-size="10" @on-change="partsChange" :current="tempPage"></Page>
        </div>
        <!-- 备件分类 -->
        <Modal v-model="typeModal" title="备件分类" @on-ok="type_modalSelected">
            <partsTypeSelect @typeSelected="type_hasSelected" :tempState="name"></partsTypeSelect>
        </Modal>
        <!-- 所属供应商 -->
        <!--<Modal v-model="supplierModal" title="所属供应商" @on-ok="supplySelected">-->
        <!--<div class="table-reset">-->
        <!--<table class="table table-bordered table-center table-striped table-blue table-edit supply">-->
        <!--<thead>-->
        <!--<tr>-->
        <!--<th>选择</th>-->
        <!--<th>序号</th>-->
        <!--<th>所属供应商</th>-->
        <!--</tr>-->
        <!--</thead>-->
        <!--<tbody>-->
        <!--<tr v-for="(item,index) in supplierList">-->
        <!--<td><input type="radio" name="supplyId" :value="index"/></td>-->
        <!--<td>{{index + 1}}</td>-->
        <!--<td>{{item.manufacturer}}</td>-->
        <!--</tr>-->
        <!--</tbody>-->
        <!--</table>-->
        <!--</div>-->
        <!--<div class="mar-t-10" style="overflow: hidden">-->
        <!--<div style="float: right;">-->
        <!--<Page size="small" :total='supplyTotal' show-elevator :page-size="5" @on-change="supplyChange"></Page>-->
        <!--</div>-->
        <!--</div>-->
        <!--</Modal>-->
        <!--删除模态框：-->
        <Modal v-model="deleteModal" width="360" class="detMod">
            <p slot="header" class="detMod_p">
                <Icon type="information-circled"></Icon>
                <span>删除确认</span>
            </p>
            <div align="center">
                <p>是否确定删除？</p>
            </div>
            <div slot="footer">
                <Button type="error" size="large" long :loading="deleteMod_loading" @click="delItem">删除</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
    import $ from 'jquery'
    import partsTypeSelect from '../treeMulitiple/tree_sparePartsType_single.vue';
    export default {
        data(){
            return {
                /*权限校验 start*/
                if_query:  this.$rt(this.authJson.EAM.备件管理.备件台账列表页.查询),
                if_detial:  this.$rt(this.authJson.EAM.备件管理.备件台账列表页.查看),
                if_add:  this.$rt(this.authJson.EAM.备件管理.备件台账列表页.新建),
                if_export:  this.$rt(this.authJson.EAM.备件管理.备件台账列表页.导出),
                if_del:  this.$rt(this.authJson.EAM.备件管理.备件台账列表页.删除),
                if_edit:  this.$rt(this.authJson.EAM.备件管理.备件台账列表页.编辑),
                /*权限校验 end*/
                created: false,
                name: "name1",
                //删除模态框：
                deleteModal: false,
                deleteMod_loading: false,
                theParts_id: "",
                tempPage: 1,
//                supplier: '',
                supplier_obj: {},
//                supplierModal: false,
                typeModal: false,
                typeSelected_obj: "",
                supplyPage: 1,
//                supplierList: [],
                supplyTotal: 0,
                formData: {
                    name: '',
                    classify: '',
//                    supplier: '',
                    device: '',
                    transports: [],
                    depot: [
                        {
                            value: 'one',
                            label: '全部'
                        },
                        {
                            value: 'two',
                            label: '地点1'
                        },
                        {
                            value: 'three',
                            label: '地点2'
                        },
                        {
                            value: 'four',
                            label: '地点3'
                        }
                    ],
                    states: [],
                    purchase: [
                        {
                            value: 'one',
                            label: '全部'
                        },
                        {
                            value: 'two',
                            label: '采购1'
                        },
                        {
                            value: 'three',
                            label: '采购2'
                        },
                        {
                            value: 'four',
                            label: '采购3'
                        }
                    ]
                },
                all: "",
                all2: 'one',
                all3: 'one',
                all4: 'one',
                partsNum: 5,
                columns: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 80,
                        align: 'center'
                    },
                    {
                        title: '备件名称',
                        key: 'tool_define_name',
                        width: 300,
                        align: 'center',
                        render: (h, params) => {
                            return h('p', {
                                domProps: {
                                    title: params.row.tool_define_name
                                },
                                class: 'iview_tabDis',
                            }, params.row.tool_define_name)
                        },
                    },
                    {
                        title: '备件分类',
                        key: 'tool_define_type',
                        align: 'center',
                        render: (h, params) => {
                            return h('p', {
                                domProps: {
                                    title: params.row.tool_define_type
                                },
                                class: 'iview_tabDis',
                            }, params.row.tool_define_type)
                        },
                    },
                    {
                        title: '备件/库存单位',
                        key: 'uom',
                        align: 'center',
                        render: (h, params) => {
                            return h('p', {
                                domProps: {
                                    title: params.row.uom
                                },
                                class: 'iview_tabDis',
                            }, params.row.uom)
                        },
                    },
                    {
                        title: '所属供应商',
                        key: 'manufacturer',
                        align: 'center'
                    },
//                    {
//                        title: '关联设备',
//                        key: 'guanl'
//                    },
                    {
                        title: '运输方式',
                        key: 'transport_method',
                        align: 'center'
                    },
                    {
                        title: '库存仓库',
                        key: 'kuc',
                        align: 'center'
                    },
                    {
                        title: '库存状态',
                        key: 'kucz',
                        align: 'center'
                    },
                    {
                        title: '采购提前期',
                        key: 'caig',
                        align: 'center'
                    },
//                    {
//                        title: '采购状态',
//                        key: 'caigz'
//                    },
                    {
                        title: '操作',
                        key: 'edit',
                        width:200,
                        render: (h, params) => {
                            let buttons = [];
                            if (this.if_detial) {
                                buttons.push(
                                    h('a', {
                                        class: 'mar-r-5',
                                        on: {
                                            click: () => {
                                                this.$router.push({
                                                    path: '/spareAdd',
                                                    query: {
                                                        from: 'toDetail',
                                                        id: params.row.id,
                                                        theTab: "name1"
                                                    }
                                                });
                                            }
                                        }
                                    }, '查看'),
                                );
                            }
                            if (this.if_edit) {
                                buttons.push(
                                    h('a', {
                                        class: 'mar-r-5',
//                                        style: {
//                                            display: params.row.factory_equipment_name.length ? 'none': 'inline-block'
//                                        },
                                        on: {
                                            click: () => {
//                                                console.log('params == '+params.row.factory_equipment_name)
                                                this.$router.push({
                                                    path: '/spareAdd',
                                                    query: {
                                                        from: 'toEdit',
                                                        id: params.row.id,
                                                        theTab: "name1"
                                                    }
                                                });
                                            }
                                        }
                                    }, '编辑'),
                                );
                            }
                            if (this.if_del) {
                                buttons.push(
                                    h('a', {
                                        class: 'mar-r-5',
                                        on: {
                                            click: () => {
                                                this.toDelete_sparts(params.row.id);
                                            }
                                        }
                                    }, '删除'),
                                );
                            }
                            return h('div', buttons);
                        },
                        align: 'center'
                    },
                ],
                tableData: []
            }
        },
        components: {
            'partsTypeSelect': partsTypeSelect,
        },
        mounted(){
            if (this.$route.query.theTab) {
                this.name = this.$route.query.theTab;
            };
            this.get_spareParts();
            //运输方式:
            this.getSpare_trans();
            //库存状态:
            this.getSpare_states();
        },
        activated: function () {
//            this.created && this.supplierGet();
            this.created && this.get_spareParts();
            this.created = true;
        },
//        watch: {
//            '$route' (to, from) {
//                if(from.path === "/spareAdd"){
//                    this.get_spareParts();
//                }
//            }
//        },
        methods: {
            toValidate(msg){
                console.log(msg);
                var str = /[=+%!<>"'/_,()\\]/
                if(str.test(msg)){
                    this.$Message.warning('输入格式错误')
                    msg = msg.replace(/\'/g,"").replace(/\"/g,"").replace(/\+/g,"").replace(/\=/g,"").replace(/\%/g,"").replace(/\!/g,"").replace(/\</g,"").replace(/\>/g,"").replace(/\//g,"").replace(/\_/g,"").replace(/\,/g,"").replace(/\(/g,"").replace(/\)/g,"").replace(/\\/g,"");
                }
                return msg
            },
            tabTarge(x){
                this.name = x;
            },
            deleteParts_item(){
//                this.typeSelected_obj = "";
                this.formData.classify = "";
            },
            //输入框文字长度：
            lengthChange(i){
                if (i.length >= 20) {
                    this.$Message.error('字数不能超过20')
                }
            },
            add_list(){
                this.$router.push({path: '/spareAdd', query: {from: 'toAdd1', id: "", theTab: "name1"}});
            },
            //备件分类：
            type_hasSelected(message){
                this.typeSelected_obj = message;
            },
            //所属供应商
//            openSup(){
//                this.supplierModal = true;
//                this.supplierGet();
//            },
//            supplierGet(){
//                this.$axios.get('/eamStandardSolution/getEquipmentList', {
//                    params: {
//                        page: this.supplyPage,
//                        pageSize: 5,
//                        modelId: ""
//                    }
//                }).then((res) => {
//                    var ret = res.data.response
//                    if (ret.code == 1) {
//                        this.supplierList = ret.data.rows;
//                        this.supplyTotal = ret.data.Total
//                    }
//                }).catch((err) => {
////                    console.log(err);
//                });
//            },
//            supplyChange(page){
//                this.supplyPage = page;
//                $(".supply").find("input[type='radio']:checked").prop('checked', false);
//                this.supplierGet();
//            },
//            supplySelected(){
//                var sid = $(".supply").find("input[type='radio']:checked").val();
//                this.supplier_obj = this.supplierList[sid];
//            },
            type_modalSelected(){
                this.formData.classify = this.typeSelected_obj.title;
            },
            //获取备件列表:
            get_spareParts(){
                let vt = this;
//                console.log('关联设备 '+JSON.stringify(this.formData.device));
//                    console.log('领用记录领用记录id '+ id );
                this.$axios.post('/eamSparePart/initToolDefined',
                    {
                        page: vt.tempPage,
                        pageSize: 10,
                        sparePartName: vt.formData.name,
                        sparePartTypeId: vt.formData.classify ? vt.typeSelected_obj.id : "",
                        transportMethod: vt.all == -1 ? "" : vt.all,
                        linkEquipmentName: vt.formData.device
                    }).then((res) => {
                    let result = res.data.response;
                    if (result.code != 1) {
                        vt.$Message.error(result.msg);
                    }
                    else {
                        this.partsNum = result.data.Total;
                        this.tableData = result.data.rows;
                        for (var i = 0; i < this.tableData.length; i++) {
                            if (this.tableData[i].transport_method == 0) {
                                this.tableData[i].transport_method = "人工搬运";
                            }
                            else if (this.tableData[i].transport_method == 1) {
                                this.tableData[i].transport_method = "手动推车";
                            }
                            else if (this.tableData[i].transport_method == 2) {
                                this.tableData[i].transport_method = "自动叉车";
                            }
                        }
                    }
                }).catch((err) => {
//                    console.log(err);
                });
            },
            partsChange(current){
                this.tempPage = current;
                this.get_spareParts();
            },
//删除事件：
            toDelete_sparts(item){
                this.deleteModal = true;
                this.theParts_id = item;
            },
            //确定删除：
            delItem(){
                let vt = this;
                vt.deleteMod_loading = true;
                this.$axios.post('/eamSparePart/deleteSparePart', {sparePartId: this.theParts_id}).then((res) => {
                    let result = res.data.response;
                    if (result.code != 1) {
                        vt.$Message.error(result.msg);
                        vt.deleteModal = false;
                        vt.deleteMod_loading = false;
                    }
                    else {
                        vt.$Message.success('删除成功');
                        vt.deleteModal = false;
                        vt.deleteMod_loading = false;
                        setTimeout(function () {
                            vt.get_spareParts();
                        }, 1000);
                    }
                }).catch((err) => {
//                    console.log(err);
                    vt.deleteModal = false;
                    vt.deleteMod_loading = false;
                });
            },
            //运输方式：
            getSpare_trans(){
                this.$axios.get('/info/transport/type').then((res) => {
                    var ret = res.data.response;
                    if (ret.code == 1) {
                        this.formData.transports.push({code: "-1", desc: "全部"});
                        for (var i = 0; i < ret.data.length; i++) {
                            this.formData.transports.push(ret.data[i])
                        };
                        this.all = this.formData.transports[0].code;
                    };
                }).catch((err) => {
//                    console.log(err);
                });
            },
            //库存状态：
            getSpare_states(){
                this.$axios.get('/info/stock/status').then((res) => {
                    var ret = res.data.response;
                    if (ret.code == 1) {
                        this.formData.states.push({code: "-1", desc: "全部"});
                        for (var i = 0; i < ret.data.length; i++) {
                            this.formData.states.push(ret.data[i])
                        };
                        this.all3 = this.formData.states[0].code;
                    };
                }).catch((err) => {
//                    console.log(err);
                });
            },
        }
    }
</script>