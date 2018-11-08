<template>
    <div class="basic fault-content">
        <!--模块名称-->
        <div class="title">
            <span>设备类型管理</span>
        </div>
        <div class="form-content">
            <Row class="wid-80">
                <Col span="8">
                <div class="tree" style="height: 250px;overflow: auto;margin-left: 50px;">
                    <Tree :data="eqTypeData" @on-select-change="toSelectType" v-show="canoperation"></Tree>
                    <p v-show="!canoperation">暂无数据</p>
                </div>
                </Col>
                <Col span="16">
                <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" inline :label-width="200" class="equ_addForm">
                    <FormItem label="上级设备类型编码" prop="parentTypeCode">
                        <Input :maxlength="10" v-model="formValidate.parentTypeCode"
                               @on-change="lengthChange(formValidate.parentTypeCode,10)" style="width: 160px;"
                               disabled></Input>
                    </FormItem>
                    <FormItem label="上级设备类型名称" prop="parentTypeName">
                        <Input :maxlength="10" v-model="formValidate.parentTypeName"
                               @on-change="lengthChange(formValidate.eqTypeName,10)" style="width: 160px;"
                               disabled></Input>
                    </FormItem>
                    <FormItem label="设备类型编码" prop="eqTypeCode">
                        <Input :maxlength="10" v-model="formValidate.eqTypeCode" :disabled="!canEdit"
                               @on-change="lengthChange(formValidate.eqTypeName,10)" style="width: 160px;"></Input>
                    </FormItem>
                    <FormItem label="设备类型名称" prop="eqTypeName">
                        <Input :maxlength="10" v-model="formValidate.eqTypeName" :disabled="!canEdit"
                               @on-change="lengthChange(formValidate.eqTypeName,10)" style="width: 160px;"></Input>
                    </FormItem>
                    <FormItem label="设备类型描述" prop="eqTypeDesc" class="textarea_design">
                        <Row class="wid-90">
                            <Col span="24">
                            <Input :maxlength="200" @on-change="lengthChange(formValidate.eqTypeDesc,200)"
                                   :disabled="!canEdit"
                                   type="textarea" :rows="1" placeholder="请输入..."
                                   v-model="formValidate.eqTypeDesc"></Input>
                            </Col>
                        </Row>
                    </FormItem>
                    <FormItem label="设备故障描述" class="textarea_design">
                        <div class="scrollTable">
                            <table class="table table-bordered table-center table-striped table-blue table-edit wid-90 taDisplay">
                                <thead>
                                <tr>
                                    <th class="wid-70p">序号</th>
                                    <th>故障描述</th>
                                    <th>备注</th>
                                    <th style="width:85px;">删除</th>
                                </tr>
                                </thead>
                                <tbody id="scrollDiv">
                                <tr v-for="(tableData,index) in faultData " class="trDisplay">
                                    <td class="wid-70p">{{index+1}}</td>
                                    <td class="tdPadding tdDisplay pointDis">
                                        <Input class="necessary" :maxlength="200" :disabled="!canEdit"
                                               @on-change="lengthChange(tableData.faultDesc,200)" style="width: 90%;"
                                               v-model="tableData.faultDesc"
                                               :title="tableData.faultDesc"></Input>
                                    </td>
                                    <td class="tdPadding tdDisplay pointDis">
                                        <Input :maxlength="200" :disabled="!canEdit"
                                               @on-change="lengthChange(tableData.note,200)" style="width: 100%;"
                                               v-model="tableData.note"
                                               :title="tableData.note"></Input>
                                    </td>
                                    <td style="width:70px;"><a @click="toDelete(index)" :disabled="!canEdit">删除</a>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                            <div class="formTableHasNoData wid-90" v-show="!faultData.length">
                                <p>暂无数据</p>
                            </div>
                            <Button type="primary" style="margin-top:15px;" icon="plus-round" size="small" @click="toAddfaultData" :disabled="!canEdit">添加</Button>
                        </div>
                    </FormItem>
                    <FormItem label="当前设备数" class="centerInput" v-show="!ifNew">
                        <Input style="width: 80px;margin-right:10px" v-model="equNum" disabled></Input>台
                    </FormItem>
                </Form>
                <div align="center" class="btnGroupDesign2">
                    <Button v-if="if_add&&!canEditPage" type="primary" :disabled="!canoperation" v-show="!canEdit" @click="toNew">新建</Button>
                    <Button type="primary" :disabled="!canoperation" v-show="canEdit" @click="toCancle">取消</Button>
                    <Button v-if="if_edit&&!canEditPage" type="primary" :disabled="!canoperation||firstNode" v-show="!canEdit" @click="canEdit=true;ifNew=false">编辑</Button>
                    <Button v-if="if_del&&!canEditPage" type="primary" :disabled="!canoperation||firstNode" v-show="!canEdit" @click="deleteModal=true">删除</Button>
                    <Button v-if="(if_add&&if_save_add)||(if_edit&&if_save_edit)" type="primary" :disabled="!canoperation" v-show="canEdit" @click="toSave('formValidate')" :loading="saveLoading">保存</Button>
                </div>
                </Col>
            </Row>
        </div>
        <div class="form-content">
            <table class="table table-bordered table-center table-striped table-blue table-edit taDisplay">
                <thead>
                <tr>
                    <th class="wid-70p">序号</th>
                    <th>设备编码</th>
                    <th>设备名称</th>
                    <th>设备类型编码</th>
                    <th>制造商</th>
                    <th>设备型号</th>
                    <th>设备类型描述</th>
                    <th>创建人</th>
                    <th>创建时间</th>
                    <th>最后修改人</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item,index) in allEqus" class="trDisplay">
                    <td>{{index + 1}}</td>
                    <td class="tdDisplay pointDis" :title="item.equipmentCode">{{item.equipmentCode}}</td>
                    <td class="tdDisplay pointDis" :title="item.equipmentName">{{item.equipmentName}}</td>
                    <td class="tdDisplay pointDis" :title="item.equipmentTypeCode">{{item.equipmentTypeCode}}</td>
                    <td class="tdDisplay pointDis" :title="item.equipmentManu">{{item.equipmentManu}}</td>
                    <td class="tdDisplay pointDis" :title="item.equipmentModel">{{item.equipmentModel}}</td>
                    <td class="tdDisplay pointDis" :title="item.equipmentTypeDesc">{{item.equipmentTypeDesc}}</td>
                    <td class="tdDisplay pointDis" :title="item.createBy">{{item.createBy}}</td>
                    <td>{{item.creatTime}}</td>
                    <td class="tdDisplay pointDis" :title="item.updateBy">{{item.updateBy}}</td>
                </tr>
                </tbody>
            </table>
            <div class="tableHasNoData" v-show="!allEqus.length"><p>暂无数据</p></div>
            <div class="mar-t-10" style="overflow: hidden">
                <div style="float: right;">
                    <Page size="small" :total='equTotal' show-elevator :page-size="5" :current="equPage" @on-change="equChange"></Page>
                </div>
            </div>
        </div>
        <div v-if="pageId!=undefined" class="btn-group text-center">
            <!--<router-link v-if="if_cancel">-->
            <Button @click="backPage" class="btn-gary" icon="close" size="large">取消</Button>
        </div>
        <!--删除模态框：-->
        <Modal v-model="deleteModal" width="360" class="detMod">
            <p slot="header" class="detMod_p">
                <Icon type="information-circled"></Icon>
                <span>删除确认</span>
            </p>
            <div style="text-align:center">
                <p>是否确定删除？</p>
            </div>
            <div slot="footer">
                <Button type="error" size="large" long :loading="deleteMod_loading" @click="toDeleteType">删除</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
    export default {
        data(){
            return {
                /*权限校验 start*/
                if_add: this.$rt(this.authJson.EAM.设备台账.设备基础数据_设备类型管理列表.新建),
                if_edit: this.$rt(this.authJson.EAM.设备台账.设备基础数据_设备类型管理列表.编辑),
                if_del: this.$rt(this.authJson.EAM.设备台账.设备基础数据_设备类型管理列表.删除),
                if_cancel: this.$rt(this.authJson.EAM.设备台账.设备基础数据_设备类型管理新建页.取消),
                if_save_add: this.$rt(this.authJson.EAM.设备台账.设备基础数据_设备类型管理新建页.保存),
                if_save_edit: this.$rt(this.authJson.EAM.设备台账.设备基础数据_设备类型管理编辑页.保存),

                /*权限校验 end*/
                canoperation: false,//树图无数据时按钮均不可操作
                eqTypeData: [],//设备类型树图数据
                typeId: "",//设备类型id
                firstNodeId: "",
                firstNode: false,
                faultData: [],//设备故障
                canEdit: false,//编辑
                ifNew: false,//新建
                deleteModal: false,//删除确认框
                deleteMod_loading: false,
                saveLoading: false,
                equNum: 0,
                allEqus: [],
                formValidate: {
                    parentTypeCode: "",
                    parentTypeName: "",
                    eqTypeCode: "",
                    eqTypeName: "",
                    eqTypeDesc: ""
                },
                ruleValidate: {
                    eqTypeCode: [{required: true, message: "设备类型编码不能为空"}],
                    eqTypeName: [{required: true, message: "设备类型名称不能为空"}],
                },
                //分页
                equTotal: 0,
                equPage: 1,
                pageId: '',
                canEditPage: false,
            }
        },

        mounted(){
            this.getTreeData();//获取设备类型树
            this.pageId = this.$route.query.id;
            if (this.pageId) {
                this.canEditPage = true;
            }
        },
        methods: {
            backPage() {
                this.$router.back();
            },
            //输入框文字长度校验：
            lengthChange(i, len){
                if (i.length >= len) {
                    this.$Message.error('字数不能超过' + len);
                }
            },
            getTreeData(){
                let vt = this;
                this.$axios.get('/eamEquipment/typeTree').then((res) => {
                    let result = res.data.response;
                    if (result.code != 1) {
                        vt.$Message.error(result.msg);
                    }
                    else {
                        vt.eqTypeData = result.data;
                        vt.eqTypeData[0].expand = true;
                        vt.typeId = vt.eqTypeData[0].id;
                        vt.firstNodeId = vt.eqTypeData[0].id;
                        vt.firstNode = true;
                        vt.equPage = 1;
                        if (vt.typeId == undefined) {
                        }
                        else {
                            vt.canoperation = true;
                        };

                        if (vt.typeId) {
                            setTimeout(() => {
                                vt.equTypeDetail();
                                vt.getAllEqus();
                            }, 1000);
                        };
                    }
                }).catch((err) => {

                });
            },
            toSelectType(left_node){//点击树节点时触发
                if (left_node[0] && left_node[0].children) {
                    left_node[0].expand = !left_node[0].expand;
                    left_node[0].selected = false;
                }
                this.typeId = left_node[0].id;
                if (left_node[0].id == this.firstNodeId) {
                    this.firstNode = true;
                }
                else {
                    this.firstNode = false;
                };
                this.equTypeDetail();
                this.getAllEqus();
            },
            //设备类型详情
            equTypeDetail(){
                let vt = this;
                this.$axios.post('/eamEquipment/typeById', {
                    typeId: vt.typeId,
                }).then((res) => {
                    let result = res.data.response;
//                    console.log('result ==== '+JSON.stringify(result))
                    if (result.code === 1) {
                        vt.faultData = [];
                        vt.canEdit = false;
                        vt.ifNew = false;
                        vt.formValidate.parentTypeCode = result.data.parentCode;
                        vt.formValidate.parentTypeName = result.data.parentName;
                        vt.formValidate.eqTypeCode = result.data.code;
                        vt.formValidate.eqTypeName = result.data.name;
                        vt.formValidate.eqTypeDesc = result.data.description;
                        vt.equNum = result.data.equipmentCount;
                        for (let i = 0; i < result.data.faults.length; i++) {
                            let obj = {};
                            obj.sortNo = result.data.faults[i].sortNo;
                            obj.faultDesc = result.data.faults[i].description;
                            obj.note = result.data.faults[i].note;
                            vt.faultData.push(obj);
                        }
                        vt.faultData.sort(this.compare('sortNo'))
                    } else {
                        vt.$Message.error(result.msg);
                    }
                }).catch((err) => {
                    console.log(err);
                });
            },
            //排序
            compare(property){
                return (a,b) => {
                    let val1 = a[property];
                    let val2 = b[property];
                    return val1 - val2;
                }
            },
            //设备类型下的所有设备：
            getAllEqus(){
                let vt = this;
                this.$axios.post('/eamEquipment/equipmentByTypeId', {
                    typeId: vt.typeId,
                    page: vt.equPage,
                    pagesize: "5"
                }).then((res) => {
                    let result = res.data.response;
                    if (result.code === 1) {
                        vt.allEqus = result.data.rows;
                        vt.equTotal = result.data.count;
                    } else {
                        vt.$Message.error(result.msg);
                    };
                }).catch((err) => {
                    console.log(err);
                });
            },

            //设备类型详情保存：
            toSave(name) {
                let vt = this;
                this.$refs[name].validate((valid) => {
                    if (!valid) {
                        vt.$Message.error('请完善信息');
                    } else {
                        vt.saveLoading = true;
                        for (let i = 0; i < vt.faultData.length; i++) {
                            vt.faultData[i].sortNo = i;
                            if (!vt.faultData[i].faultDesc) {
                                vt.$Message.error("故障描述不能为空");
                                vt.saveLoading = false;
                                return
                            }
                        }
                        let obj = {
                            code: vt.formValidate.eqTypeCode,
                            description: vt.formValidate.eqTypeDesc,
                            faults: vt.faultData,
                            name: vt.formValidate.eqTypeName,
                            note: "",
                            parentId: vt.ifNew ? vt.typeId : "",
                            updateId: vt.ifNew ? "" : vt.typeId
                        };
                        this.$axios.post('/eamEquipment/typeSave', obj).then((res) => {
                            let result = res.data.response;
                            if (result.code === 1) {
                                vt.$Message.success("保存成功");
                                setTimeout(() => {
                                    vt.canEdit = false;
                                    vt.ifNew = false;
                                    vt.getTreeData();
                                }, 1000);
                            } else {
                                vt.$Message.error(result.msg);
                            }

                            vt.saveLoading = false;
                        }).catch((err) => {
                            console.log(err);
                        });
                    }
                })
            },
            //添加故障描述条目：
            toAddfaultData(){
                for (let i = 0; i < this.faultData.length; i++) {
                    if (!this.faultData[i].faultDesc) {
                        this.$Message.error("请将故障描述补充完整");
                        return
                    }
                };
                let obj = {
                    faultDesc: "",
                    note: ""
                };
                this.faultData.push(obj);
                setTimeout(function () {
                    document.getElementById('scrollDiv').scrollTop = document.getElementById('scrollDiv').scrollHeight;
                }, 100);
            },
            toDelete(item){
                this.faultData.splice(item, 1);
            },
            toDeleteType(){
                let vt = this;
                vt.deleteMod_loading = true;
                this.$axios.post('/eamEquipment/typeDelete', {
                    typeId: vt.typeId,
                }).then((res) => {
                    let result = res.data.response;
                    if (result.code === 1) {
                        vt.$Message.success("删除成功");
                        vt.deleteModal = false;
                        vt.getTreeData();
                    } else {
                        vt.$Message.error(result.msg);
                    };
                    vt.deleteMod_loading = false;
                }).catch((err) => {
                    console.log(err);
                });
            },
            toNew(){
                this.canEdit = true;
                this.ifNew = true;
                this.faultData = [];
                this.formValidate.parentTypeCode = this.formValidate.eqTypeCode;
                this.formValidate.parentTypeName = this.formValidate.eqTypeName;
                this.formValidate.eqTypeCode = "";
                this.formValidate.eqTypeName = "";
                this.formValidate.eqTypeDesc = "";
            },
            toCancle(){
                this.canEdit = false;
                this.ifNew = false;
                this.equTypeDetail();
            },
            equChange(page){
                this.equPage = page;
                this.getAllEqus();
            },
        }
    }
</script>