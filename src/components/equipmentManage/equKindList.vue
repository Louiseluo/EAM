<template>
    <div class="basic fault-content">
        <!--模块名称-->
        <div class="title">
            <span>设备型号管理</span>
        </div>
        <!--表单-->
        <div class="form-content">
            <Form inline :label-width="100">
                <FormItem label="设备型号编码">
                    <Input v-model="equCode" :maxlength="20" @on-blur="equCode = toValidate(equCode)" @on-change="lengthChange(equCode,20)"></Input>
                </FormItem>
                <FormItem label="设备型号名称">
                    <Input v-model="equName" :maxlength="20" @on-blur="equName = toValidate(equName)" @on-change="lengthChange(equName,20)"></Input>
                </FormItem>
                <FormItem label="制造商">
                    <div style="color:#ffffff" onmousemove="this.style.color='#5b5b5b';"
                         onmouseout="this.style.color='#ffffff'">
	                    <span @click="deleteSupply(1)" v-if="supplier">
	                    	<Icon type="ios-close" class="deleteTab"></Icon>
	                    </span>
                        <div class="input-search" prop="supplier" @click="openSup(1)">
                            <Input v-model="supplier" style="width: 160px;" readonly></Input>
                            <Button icon="ios-search" @click="openSup(1)"></Button>
                        </div>
                    </div>
                </FormItem>

                <FormItem label="创建时间">
                    <Row>
                        <Col span="11">
                        <DatePicker v-model="time_start" type="datetime" placeholder="选择日期和时间"
                                    @on-change="checkStart" :editable=false></DatePicker>
                        </Col>
                        <Col span="2" align="center">
                        ~</Col>
                        <Col span="11">
                        <DatePicker v-model="time_end" type="datetime" placeholder="选择日期和时间"
                                    @on-change="checkEnd" :editable=false></DatePicker>
                        </Col>
                    </Row>
                </FormItem>
            </Form>
            <!--查询按钮-->
            <div class="btn-query">
                <Button v-if="if_query" type="primary" icon="search" size="large" @click="searchList" >查询</Button>
                <Button v-if="if_add" type="primary" icon="plus" size="large" @click="addNew">新建</Button>
            </div>
        </div>
        <!--表格-->
        <div class="mettingManage_list">
            <table class="table table-bordered table-center table-striped table-blue table-standWork taDisplay ">
                <thead>
                <tr>
                    <th class="wid-5">序号</th>
                    <th >设备型号编码</th>
                    <th>设备型号名称</th>
                    <th>本地名称</th>
                    <th>设备制造商</th>
                    <th>备注</th>
                    <th>创建人</th>
                    <th >创建时间</th>
                    <th>操作</th>
                </tr>

                </thead>
                <tbody>

                <tr v-for="(item,index) in equments" :key="item.id" class="trDisplay">
                    <td >{{index + 1}}</td>
                    <td class="tdDisplay pointDis" :title="item.bdEquipmentModelCode">{{item.bdEquipmentModelCode}}</td>
                    <td class="tdDisplay pointDis" :title="item.bdEquipmentModelName">{{item.bdEquipmentModelName}}</td>
                    <td class="tdDisplay pointDis" :title="item.bdEquipmentModelLocalName">{{item.bdEquipmentModelLocalName}}</td>
                    <td class="tdDisplay pointDis" :title="item.manufacturerName">{{item.manufacturerName}}</td>
                    <td class="tdDisplay pointDis" :title="item.note">{{item.note}}</td>
                    <td class="tdDisplay pointDis" :title="item.create_by">{{item.create_by}}</td>
                    <td>{{item.create_at}}</td>
                    <td class="mettingManage_oprationItem">
                        <a v-if="if_edit" @click="toEdit(index)">编辑</a>
                        <a v-if="if_del" @click="deleteList(item.id)">删除</a>
                    </td>
                </tr>
                </tbody>
            </table>
            <div class="tableHasNoData" v-show="equments.length==0"><p>暂无数据</p></div>
            <!--<div class="demo-spin-col" v-show="tableDataLoading">-->
                <!--<Spin fix>-->
                    <!--<Icon type="load-c" size=18  class="demo-spin-icon-load"></Icon>-->
                    <!--<div>加载中…</div>-->
                <!--</Spin>-->
            <!--</div>-->

            <div class="pageItem" align="right">
                <Page :total="numMaterial" size="small" show-elevator :current="tempPage"
                      @on-change="changePage"></Page>
            </div>
        </div>

        <Modal v-model="supplierModal" title="制造商" @on-ok="supplySelected" class="seePicMod" :styles="{top: '100px'}" >
            <div>
                <div class="btn-query mar-b-10" style="display: table;margin-bottom: 20px;">
                    制造商名称  <Input class="mar-l-10" style="width: 160px;" v-model="manufacturer_name" @on-blur="manufacturer_name = toValidate(manufacturer_name)"></Input>
                    <Button v-if="if_detail" type="primary" icon="search" size="large" @click="searchSupplier">
                        查询
                    </Button>
                </div>
                <div class="table-reset">
                    <table class="table table-bordered table-center table-striped table-blue table-edit supply taDisplay">
                        <thead>
                        <tr>
                            <!--<th>选择</th>-->
                            <th width="150">序号</th>
                            <th>制造商名称</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="(item,index) in supplierList" class="trDisplay trBgc" @click="toSelectManufacturer(index)">
                            <!--<td><input type="radio" name="supplyId" :value="item.tBdEquipmentManufacturerId" /></td>-->
                            <td>{{index + 1}}</td>
                            <td class="tdDisplay pointDis" :title="item.tBdEquipmentManufacturerName">{{item.tBdEquipmentManufacturerName}}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div class="mar-t-10" style="overflow: hidden">
                    <div style="float: right;">
                        <Page size="small" :total='supplyTotal' show-elevator :page-size="5" :current="supplyPage"
                              @on-change="supplyChange"></Page>
                    </div>
                </div>
            </div>
        </Modal>

        <Modal v-model="addTypeMod" width="700" :title="'设备型号'+titleMod" ok-text="保存" @on-ok="handleSubmit('addData')" :loading='isLoad' :visible="visible">
            <Form ref="addData" :model="addData" :rules="ruleValidate" inline :label-width="100">
                <FormItem label="设备型号编码" prop="equCode">
                    <Input v-model="addData.equCode" :maxlength="20" @on-change="lengthChange(addData.equCode,20)" ></Input>
                </FormItem>
                <FormItem label="设备型号名称" prop="equName">
                    <Input v-model="addData.equName" :maxlength="20" @on-change="lengthChange(addData.equName,20)" @on-blur="addData.equName = toValidate(addData.equName)"></Input>
                </FormItem>
                <FormItem label="本地名称" prop="localName">
                    <Input v-model="addData.localName" :maxlength="20" @on-change="lengthChange(addData.localName,20)" @on-blur="addData.localName = toValidate(addData.localName)"></Input>
                </FormItem>
                <FormItem label="制造商" prop="supplier">
                    <div style="color:#ffffff" onmousemove="this.style.color='#5b5b5b';"
                         onmouseout="this.style.color='#ffffff'">
	                    <span @click="deleteSupply(0)" v-if="addData.supplier">
	                    	<Icon type="ios-close" class="deleteTab"></Icon>
	                    </span>
                        <div class="input-search" prop="supplier" @click="openSup(0)">
                            <Input v-model="addData.supplier" style="width: 160px;" readonly></Input>
                            <Button icon="ios-search" @click="openSup(0)"></Button>
                        </div>
                    </div>
                </FormItem>
                <br>
                <FormItem label="备注">
                    <Input v-model="addData.note" type="textarea" :rows="2" :maxlength="20" @on-change="lengthChange(addData.note,200)" placeholder="Enter something..." style="width: 435px;" ></Input>
                </FormItem>
            </Form>
        </Modal>

    </div>

</template>

<script>
    export default {
        data(){
            return {
                /*权限校验 start*/
                if_query:  this.$rt(this.authJson.EAM.设备台账.设备基础数据_设备型号管理列表.查询),
                if_add:  this.$rt(this.authJson.EAM.设备台账.设备基础数据_设备型号管理列表.新建),
                if_edit:  this.$rt(this.authJson.EAM.设备台账.设备基础数据_设备型号管理列表.编辑),
                if_del:  this.$rt(this.authJson.EAM.设备台账.设备基础数据_设备型号管理列表.删除),

                if_detail:  true,

                /*权限校验 end*/
                equCode:'',
                equName:'',
                supplier:'',
                supplierId:'',
                time_start:'',
                time_end:'',
                equments:[],
                supplierModal: false,
                manufacturer_name:'',
                supplierList:[],
                supplyTotal:0,
                supplyPage:1,
                supplierSelected:{},
                numMaterial:0,
                tempPage:1,
                addTypeMod:false,
                addData:{
                    id:'',
                    equCode:'',
                    equName:'',
                    supplier:'',
                    supplierId:'',
                    localName:'',
                    note:''
                },
                isAdd:'',
                ruleValidate: {
                    equCode: [
                        { required: true, message: '设备编码不能为空', trigger: 'blur' }
                    ],
                    equName: [
                        { required: true, message: '设备名称不能为空', trigger: 'blur' }
                    ],
                    localName: [
                        { required: true, message: '本地名称不能为空', trigger: 'blur' }
                    ],
                    supplier: [
                        { required: true, message: '制造商不能为空', trigger: 'blur' }
                    ],
//                    note: [
//                        { required: true, message: '备注不能为空', trigger: 'blur' }
//                    ],

                },
                visible:true,
                isLoad: true,
                titleMod:'新增'


            }

        },
        components: {

        },
        mounted(){
            this.equmentsList();
        },
        methods: {
            //验证输入框格式
            toValidate(msg){
//                console.log(msg);
                var str = /[=+%!<>"'/_,()\\]/
                if(str.test(msg)){
                    this.$Message.warning('输入格式错误')
                    msg = msg.replace(/\'/g,"").replace(/\"/g,"").replace(/\+/g,"").replace(/\=/g,"").replace(/\%/g,"").replace(/\!/g,"").replace(/\</g,"").replace(/\>/g,"").replace(/\//g,"").replace(/\_/g,"").replace(/\,/g,"").replace(/\(/g,"").replace(/\)/g,"").replace(/\\/g,"");
                }
                return msg
            },
            //输入框文字长度：
            lengthChange(i, len){
                if (i.length >= len) {
                    this.$Message.error('字数不能超过' + len)
                }
            },
            //开始日期应小于结束日期
            checkStart(time){
                var stime = time;
                if (this.time_end != '') {
                    if (stime > this.time_end) {
                        this.notFitDataTip = '开始时间应在结束时间之前';
                        this.$Message.error(this.notFitDataTip);
                    }
                    else {
                        this.notFitDataTip = ""
                    }
                    ;
                }
                ;
                this.time_start = stime
            },
            //结束日期应大于开始日期
            checkEnd(time){

                var etime = time;
                if (this.time_start != '') {
                    if (etime < this.time_start) {
                        this.notFitDataTip = '结束时间应在开始时间之后';
                        this.$Message.error(this.notFitDataTip);
                    }
                    else {
                        this.notFitDataTip = ""
                    }
                }
                ;
                this.time_end = etime;
            },
            //update test
            //所属供应商
            openSup(item){
                $('.trBgc').removeClass('highlight');
                this.supplyPage = 1;
                this.supplierModal = true;
                this.supplierGet();
                this.isAdd = item;
            },
            supplierGet(){
                this.$axios.get('/System/equipmentManufacturerMagnifier', {
                    params: {
                        page: this.supplyPage,
                        pagesize: 5,
                        manufacturer_name: this.manufacturer_name
                    }
                }).then((res) => {
                    var ret = res.data.response
//                    console.log(ret)
                    if (ret.code == 1) {
                        this.supplierList = ret.data.Rows;
                        this.supplyTotal = ret.data.Total
                    }
                }).catch((err) => {
                    console.log(err);
                });
            },
            searchSupplier(){
                this.supplyPage=1;
                this.supplierGet();
            },
            supplyChange(page){
                this.supplyPage = page;
                $(".supply").find("input[type='radio']:checked").prop('checked', false);
                this.supplierGet();
            },
            toSelectManufacturer(index){
                $('.trBgc').eq(index).addClass('highlight').siblings().removeClass('highlight')
                this.supplierSelected = this.supplierList[index];
            },
            supplySelected(){
//                console.log(this.isAdd)
                if(this.supplierSelected){
                    //判断是新增还是查询
                    if(this.isAdd==1){
                        this.supplier = this.supplierSelected.tBdEquipmentManufacturerName;
                        this.supplierId = this.supplierSelected.tBdEquipmentManufacturerId;
                    }
                    else{
                        this.addData.supplier = this.supplierSelected.tBdEquipmentManufacturerName;
                        this.addData.supplierId = this.supplierSelected.tBdEquipmentManufacturerId;
                    }

                }
            },
            deleteSupply(item){
                this.isAdd = item;
                if(this.isAdd==1){
                    this.supplier = '';
                    this.supplierId = '';
                }
                else{
                    this.addData.supplier = '';
                    this.addData.supplierId = '';
                }

            },
            //列表相关
            changePage(page){
                this.tempPage = page;
                this.equmentsList();
            },
            equmentsList(){
                this.$axios.post('/eamEquipment/modelList', {
                        page: this.tempPage,
                        pagesize: 10,
                        manufacturerId: this.supplierId,
                        code: this.equCode,
                        name: this.equName,
                        startTime: this.time_start,
                        endTime: this.time_end
                }).then((res) => {
                    var ret = res.data.response
//                    console.log(ret);
//                    console.log('列表数据')
                    if (ret.code == 1) {
                        this.equments = ret.data.rows;
                        this.numMaterial = ret.data.count;
                    }
                }).catch((err) => {
                    console.log(err);
                });
            },
            searchList(){
                this.tempPage = 1;
                this.equmentsList();
            },
            //保存验证
            handleSubmit (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.$axios.post('/eamEquipment/modelSave', {
                            "code": this.addData.equCode,
                            "description": this.addData.note,
                            "manufacturerId": this.addData.supplierId,
                            "name": this.addData.equName,
                            "localName": this.addData.localName,
                            "note": this.addData.note,
                            "updateId": this.addData.id
                        }).then((res) => {
                            let ret = res.data.response;
//                            console.log(ret);
//                            console.log('保存保存')
                            if (ret.code == 1) {
                                this.$Message.success('保存成功！');
                                setTimeout(() => {
                                    this.addTypeMod = false;
                                    this.addData = {
                                        equCode:'',
                                        note:'',
                                        supplierId:'',
                                        supplier:'',
                                        equName:'',
                                        localName:'',
                                        id:''
                                    }
                                    this.equmentsList();
                                }, 500);
                            }
                            else{
                                this.$Message.error(ret.msg);
                            }
                        }).catch((err) => {
                            console.log(err);
                        });
                    } else {
                        this.isLoad = false;
                        this.$nextTick(() => {this.isLoad = true;});
                        this.$Message.error('请将信息填写完整!');
                    }
                })
            },
            toEdit(index){
                this.addTypeMod = true;
                this.titleMod = '编辑';
                this.addData.equCode = this.equments[index].bdEquipmentModelCode;
                this.addData.equName = this.equments[index].bdEquipmentModelName;
                this.addData.note = this.equments[index].note;
                this.addData.localName = this.equments[index].bdEquipmentModelLocalName;
                this.addData.supplierId = this.equments[index].manufacturerId;
                this.addData.supplier = this.equments[index].manufacturerName;
                this.addData.id = this.equments[index].id;
            },
            addNew(){
                this.addTypeMod = true;
                this.titleMod = '新建';
                this.addData = {
                    equCode:'',
                    note:'',
                    supplierId:'',
                    supplier:'',
                    equName:'',
                    localName:'',
                    id:''
                }
            },
            //删除
            deleteList(id){
                this.$axios.post('/eamEquipment/modelDelete', {
                    modelId: id,
                }).then((res) => {
                    var ret = res.data.response
//                    console.log(ret);
//                    console.log('删除删除')
                    if (ret.code == 1) {
                        this.$Message.success('删除成功！');
                        setTimeout(() => {
                            this.equmentsList();
                        }, 500);
                    }
                    else{
                        this.$Message.error(ret.msg);
                    }
                }).catch((err) => {
                    console.log(err);
                });
            },
        }
    }

</script>
<style>
    .seePicMod .ivu-modal-wrap{
        z-index:3000 !important;
    }
</style>
