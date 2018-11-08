<template>
    <div class="basic fault-content">
        <div class="title">
            <span>供应商管理</span>
        </div>
        <!--<div class="titleListManage">
            <ul class="tabUL">
                <li>
                    <router-link to='/spareParts'>备件管理</router-link>
                </li>
                <li>
                    <router-link to='/typeManage'>类型管理</router-link>
                </li>
                <li class="active">
                    <a>供应商管理</a>
                </li>
                <li>
                    <router-link to='/leadRecord'>领用记录</router-link>
                </li>
            </ul>
        </div>-->
            <!--表单-->
            <div class="form-content">
                <Form ref="supplierData" :model="supplierData" label-position="right" inline :label-width="100">
                    <FormItem label="供应商编码" prop="supplier_code">
                        <Input v-model="supplierData.supplierCode" style="width: 160px;"></Input>
                    </FormItem>
                    <FormItem label="供应商名称">
                        <Input v-model="supplierData.supplierName" style="width: 160px;"></Input>
                    </FormItem>
                    <FormItem label="状态">
                        <Select v-model="supplierData.status" style="width: 160px;">
                            <Option v-for="item in statusArr" :value="item.code" :key="item.code">
                                {{ item.desc }}
                            </Option>
                        </Select>
                    </FormItem>
                    <FormItem label="联系人">
                        <Input v-model="supplierData.contactPerson" style="width: 160px;"></Input>
                    </FormItem>
                    <FormItem label="创建时间" >
                        <Row>
                            <Col span="11">
                            <DatePicker type="datetime" placeholder="选择日期和时间" v-model="supplierData.createStart" @on-change="changeCreateAt" @on-open-change="compareTime"></DatePicker>
                            </Col>
                            <Col span="2" style="text-align: center">
                            -</Col>
                            <Col span="11">
                            <DatePicker type="datetime" placeholder="选择日期和时间" v-model="supplierData.createEnd" @on-change="changeCreateEnd" @on-open-change="compareTime"></DatePicker>
                            </Col>
                        </Row>
                    </FormItem>
                </Form>
                <!--查询按钮-->
                <div class="btn-query">
                    <Button v-if="if_query" type="primary" icon="search" size="large" @click="partsChange(1)">查询</Button>
                    <Button v-if="if_add" type="primary" icon="plus" size="large" @click="supplier_modal()">新建</Button>
                </div>
            </div>
            <!--表格-->
            <div class="table-content ivu-table-auto" style="margin-bottom: 50px;">
                <Table stripe border :columns="columns" :data="tableData" style="text-align:center"></Table>
            </div>
            <div class="page">
                <Page :total="totalNum" size="small" show-elevator :page-size="pageSize" @on-change="partsChange" :current="tempPage"></Page>
            </div>
        <!-- 供应商新建、查看、编辑 -->
        <Modal v-model="supplierModal" :title="modelTitle" width="630">
            <Form ref="newSupplier" :model="newSupplier" :rules="ruleValidate" label-position="right" inline :label-width="100">
                <FormItem label="供应商编码" prop="supplierCode">
                    <Input @on-change="lengthChange(newSupplier.supplierCode)" v-model="newSupplier.supplierCode" style="width: 160px;" @on-blur="specialString(newSupplier.supplierCode)"></Input>
                </FormItem>
                <FormItem label="供应商名称" prop="supplierName">
                    <Input @on-change="lengthChange(newSupplier.supplierName)" v-model="newSupplier.supplierName" style="width: 160px;" @on-blur="specialString2(newSupplier.supplierName)"></Input>
                </FormItem>
                <FormItem label="供应商电话">
                    <Input @on-change="lengthChange(newSupplier.phone)" v-model="newSupplier.phone" style="width: 160px;"></Input>
                </FormItem>
                <FormItem label="供应商邮箱">
                    <Input @on-change="lengthChange(newSupplier.email)" v-model="newSupplier.email" style="width: 160px;"></Input>
                </FormItem>
                <FormItem label="供应商状态" prop="status">
                    <Select v-model="newSupplier.status" style="width: 160px;">
                        <Option v-for="item in statusArr2" :value="item.code" :key="item.code">
                            {{ item.desc }}
                        </Option>
                    </Select>
                </FormItem>
                <FormItem label="联系人">
                    <Input @on-change="lengthChange(newSupplier.contactPerson)" v-model="newSupplier.contactPerson" style="width: 160px;" @on-blur="specialString3(newSupplier.contactPerson)"></Input>
                </FormItem>
                <FormItem label="注册地址"class="textarea_design" >
                    <Input @on-change="lengthChange(newSupplier.registeredAddress)" type="textarea":maxlength="200" v-model="newSupplier.registeredAddress" :rows="2" style="width: 430px;"></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button v-if="if_back" @click="supplierModal=false">取消</Button>
                <Button v-if="if_save" type="primary" @click="save('newSupplier')">保存</Button>
            </div>
        </Modal>
        <!--@on-ok="save('newSupplier')" -->
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
    export default {
        data(){
            return {
                /*权限校验 start*/
                if_query:  this.$rt(this.authJson.EAM.备件管理.备件基础数据_供应商管理列表.查询),
                if_add:  this.$rt(this.authJson.EAM.备件管理.备件基础数据_供应商管理列表.新建),
                if_del:  this.$rt(this.authJson.EAM.备件管理.备件基础数据_供应商管理列表.删除),
                if_edit:  this.$rt(this.authJson.EAM.备件管理.备件基础数据_供应商管理列表.编辑),
                if_save: false,
                if_back:  this.$rt(this.authJson.EAM.备件管理.备件基础数据_供应商管理新建页.取消),
                /*权限校验 end*/
                created: false,
                //删除模态框：
                deleteModal: false,
                deleteMod_loading: false,
                deleteId: "",
                tempPage: 1,
                pageSize: 10,
                totalNum: 0,
                supplierModal: false,
                supplierData: {
                    supplierCode: '',
                    supplierName: '',
                    status: -1,
                    contactPerson: '',
                    createStart: '',
                    createEnd: ''
                },
                save_loading: false,
                statusArr:this.$base_info.manufacturerStatusEnum,
                newSupplier: {
                    supplierCode: '',
                    supplierName: '',
                    phone: '',
                    email: '',
                    status: '',
                    contactPerson: '',
                    registeredAddress: ''
                },
                ruleValidate: {
                    supplierCode: [{required: true, message: '供应商编码不能为空'}],
                    supplierName: [{required: true, message: '供应商名称不能为空'}],
                    status: [{required: true, message: '供应商状态不能为空'}]
                },
                modelTitle: '',
                columns: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 80,
                        align: 'center'
                    },
                    {
                        title: '供应商编码',
                        key: 'supplierCode',
                        width: 300,
                        align: 'center',
                        render: (h, params) => {
                            return h('p', {
                                domProps: {
                                    title: params.row.supplierCode
                                },
                                class: 'iview_tabDis',
                            }, params.row.supplierCode)
                        },
                    },
                    {
                        title: '供应商名称',
                        key: 'supplierName',
                        align: 'center',
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
                        title: '本地名称',
                        key: 'localName',
                        align: 'center',
                        render: (h, params) => {
                            return h('p', {
                                domProps: {
                                    title: params.row.localName
                                },
                                class: 'iview_tabDis',
                            }, params.row.localName)
                        },

                    },
                    {
                        title: '状态',
                        key: 'status',
                        align: 'center',
                        render: (h, params) => {
                            return h('p', {
                                domProps: {
                                    title: params.row.status
                                },
                            }, params.row.status)
                        }
                    },
                    {
                        title: '注册地址',
                        key: 'registeredAddress',
                        align: 'center',
                        render: (h, params) => {
                            return h('p', {
                                domProps: {
                                    title: params.row.registeredAddress
                                },
                                class: 'iview_tabDis',
                            }, params.row.registeredAddress)
                        }
                    },
                    {
                        title: '供应商邮箱',
                        key: 'email',
                        align: 'center',
                        render: (h, params) => {
                            return h('p', {
                                domProps: {
                                    title: params.row.email
                                },
                                class: 'iview_tabDis',
                            }, params.row.email)
                        }
                    },
                    {
                        title: '供应商电话',
                        key: 'phone',
                        align: 'center',
                        render: (h, params) => {
                            return h('p', {
                                domProps: {
                                    title: params.row.phone
                                },
                                class: 'iview_tabDis',
                            }, params.row.phone)
                        }
                    },
                    {
                        title: '联系人',
                        key: 'contactPerson',
                        align: 'center',
                        render: (h, params) => {
                            return h('p', {
                                domProps: {
                                    title: params.row.contactPerson
                                },
                                class: 'iview_tabDis',
                            }, params.row.contactPerson)
                        }
                    },
                    {
                        title: '操作',
                        key: 'edit',
                        width:200,
                        render: (h, params) => {
                            let btns = [];
                            if(this.if_edit) {
                                btns.push(
                                    h('a', {
                                        class: 'mar-r-5',
                                        on: {
                                            click: () => {
                                                this.supplier_modal(params.row);

                                            }
                                        }
                                    }, '编辑')
                                )
                            }
                            if(this.if_del) {
                                btns.push(
                                    h('a', {
                                        class: 'mar-r-5',
                                        on: {
                                            click: () => {
                                                this.delete_supplier(params.row.supplierId);
                                            }
                                        }
                                    }, '删除')
                                )
                            }
                            return h('div', btns
                                // [
                                // h('a', {
                                //     class: 'mar-r-5',
                                //     on: {
                                //         click: () => {
                                //             this.supplier_modal(params.row);
                                //
                                //         }
                                //     }
                                // }, '编辑'),
                                // h('a', {
                                //     class: 'mar-r-5',
                                //     on: {
                                //         click: () => {
                                //             this.delete_supplier(params.row.supplierId);
                                //         }
                                //     }
                                // }, '删除')
                            // ]
                            );
                        },
                        align: 'center'
                    },
                ],
                tableData: [],
//                editData : {}
                lenTip: '',
                strTip: '',
                strTip2: '',
                strTip3: '',
                reg: /[`~!@#$^&*()=|{}':;',\[\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]/
            }
        },
        computed: {
            statusArr2() {
                return this.statusArr.filter(item => item.code>-1);
            }
        },
        mounted(){
            this.get_supplier();

        },
        activated: function () {
            this.created && this.get_supplier();
            this.created = true;
        },
        methods: {
            /*去掉字符串里特殊字符的正则表达式方求*/
            specialString(s) {
                if (s && s.match(this.reg)) {
                    this.strTip = '不能有特殊字符，请重新输入！';
                }else {
                    this.strTip = '';
                }
            },
            specialString2(s) {
                if (s && s.match(this.reg)) {
                    this.strTip2 = '不能有特殊字符，请重新输入！';
                }else {
                    this.strTip2 = '';
                }
            },
            specialString3(s) {
                if (s && s.match(this.reg)) {
                    this.strTip3 = '不能有特殊字符，请重新输入！';
                }else {
                    this.strTip3 = '';
                }
            },
            /*校验时间*/
            changeCreateAt(stime) {
                this.supplierData.createStart = stime;
            },
            changeCreateEnd(etime) {
                this.supplierData.createEnd = etime;
            },
            compareTime(status) {
                if (!status) {
                    let stime = this.supplierData.createStart;
                    let etime = this.supplierData.createEnd;
                    if ( (stime!= '') && (etime!='') && (etime<stime)) {
                        this.$Message.error('结束时间不能在开始时间之前,请重新选择');
                        this.supplierData.createEnd = '';
                    }
                }
            },
            lengthChange(val) {
                if (val.length>200) {
                    this.$Message.error('不能超过200个字');
                    this.lenTip = '不能超过20个字';
                } else {
                    this.lenTip = '';
                }
            },
            supplier_modal(rowData) {
//                console.log("select rowData +" + JSON.stringify(rowData))
                if (!rowData) {
                    this.modelTitle = '供应商新建';
                    this.if_save = this.$rt(this.authJson.EAM.备件管理.备件基础数据_供应商管理新建页.保存);
                    this.newSupplier = {};
                    if (this.$refs['newSupplier']!==undefined) {
                        this.$refs['newSupplier'].resetFields();
                    }
                } else{
                    this.modelTitle = '供应商编辑';
                    this.if_save = this.$rt(this.authJson.EAM.备件管理.备件基础数据_供应商管理编辑页.保存);
                    let data = {
                        supplierId: rowData.supplierId,
                        supplierCode: rowData.supplierCode,
                        supplierName: rowData.supplierName,
                        localName: rowData.localName,
                        status: this.$base_info.getCodeByDesc(rowData.status,this.$base_info.manufacturerStatusEnum),
                        registeredAddress: rowData.registeredAddress,
                        email: rowData.email,
                        phone: rowData.phone,
                        contactPerson: rowData.contactPerson
                    };
                    this.newSupplier = data;
                }
                this.supplierModal = true;
            },

            //获取供应商列表:
            get_supplier(){
                let vt = this;
                this.$axios.post('/eamSparePart/supplierList',
                    {
                        page: vt.tempPage,
                        pageSize: 10,
                        supplierCode: vt.supplierData.supplierCode,
                        supplierName: vt.supplierData.supplierName,
                        status: vt.supplierData.status,
                        contactPerson: vt.supplierData.contactPerson,
                        createStart: vt.supplierData.createStart,
                        createEnd: vt.supplierData.createEnd
                    }).then((res) => {
                    let result = res.data.response;
//                    console.log('supplierData '+JSON.stringify(vt.supplierData));
//                    console.log('result '+JSON.stringify(result));
                    if (result.code != 1) {
                        vt.$Message.error(result.msg);
                    }
                    else {
                        this.totalNum = result.data.total;
                        this.tableData = result.data.rows;
                        for (var i = 0; i < this.tableData.length; i++) {
                            if (this.tableData[i].status == 0) {
                                this.tableData[i].status = "未认证";
                            }
                            else if (this.tableData[i].status == 1) {
                                this.tableData[i].status = "已认证";
                            }
                            else if (this.tableData[i].status == 2) {
                                this.tableData[i].status = "已过期";
                            }
                        }
                    }
                }).catch((err) => {
                    console.log(err);
                });
            },
            partsChange(current){
                this.tempPage = current;
                this.get_supplier();
            },
            save(name) {
                this.$refs[name].validate((valid) => {
                    if (!valid) {
                        this.supplierModal = true;
                        this.$Message.error('请完善表单信息!');
                    } else {
                        if (this.lenTip) {
                            this.$Message.error(this.lenTip);
                            return;
                        } else if (this.strTip || this.strTip2 || this.strTip3) {
                            this.$Message.error('不能有特殊字符，请重新输入！');
                            return;
                        }
                        this.supplierModal = false;
                        this.$axios.post('/eamSparePart/supplierEditSave', {
                            supplierId: this.newSupplier.supplierId?this.newSupplier.supplierId:'',
                            supplierCode: this.newSupplier.supplierCode,
                            supplierName: this.newSupplier.supplierName,
                            localName: this.newSupplier.localName,
                            status: this.newSupplier.status,
                            registeredAddress: this.newSupplier.registeredAddress,
                            email: this.newSupplier.email,
                            phone: this.newSupplier.phone,
                            contactPerson: this.newSupplier.contactPerson
                        }).then((res) => {
                            let ret = res.data.response;
                            if (ret.code != 1) {
                                this.$Message.error(ret.msg);
                            } else {
                                this.get_supplier();
                                this.newSupplier = {};
                            }
                        }).catch((err) => {
                            console.log(err);
                        })
                    }
                })



//                console.log("saveData +" + JSON.stringify(this.newSupplier))
            },
            //删除事件：
            delete_supplier(id){
                this.deleteModal = true;
                this.deleteId = id;
            },
            //确定删除：
            delItem(){
                let vt = this;
                vt.deleteMod_loading = true;
                this.$axios.post('/eamSparePart/deleteSupplier', {supplierId: this.deleteId}).then((res) => {
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
//                            console.log('删除 === '+JSON.stringify(result));
                        setTimeout(function () {
                            vt.get_supplier();
                        }, 1000);

                    }
                }).catch((err) => {
                    console.log(err);
                    vt.deleteModal = false;
                    vt.deleteMod_loading = false;
                });
            },
        }
    }

</script>