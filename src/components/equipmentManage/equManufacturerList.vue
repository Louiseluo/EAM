<template>
    <div class="basic fault-content">
        <!--模块名称-->
        <div class="title">
            <span>设备制造商管理</span>
        </div>
        <!--<div class="titleListManage">
            <ul class="tabUL">
                <li>
                    <router-link to='/equipmentList'>设备管理</router-link>
                </li>
                <li class="active">
                    <a>设备制造商管理</a>
                </li>
                <li>
                    <router-link to='/equTypeList'>设备类型管理</router-link>
                </li>
                <li>
                    <router-link to='/equKindList'>设备型号管理</router-link>
                </li>
            </ul>
        </div>-->
        <div class="form-content">
            <Form inline :label-width="100">
                <FormItem label="制造商编码">
                    <Input v-model="MfCode" @on-blur="MfCode = toValidate(MfCode)" :maxlength="20"></Input>
                </FormItem>
                <FormItem label="制造商名称">
                    <Input v-model="MfName" @on-blur="MfName = toValidate(MfName)" :maxlength="20"></Input>
                    <!--<div style="color:#ffffff" onmousemove="this.style.color='#5b5b5b';"-->
                    <!--onmouseout="this.style.color='#ffffff'">-->
                    <!--<span @click="deleteSupply(1)" v-if="MfName">-->
                    <!--<Icon type="ios-close" class="deleteTab"></Icon>-->
                    <!--</span>-->
                    <!--<div class="input-search" prop="MfName" @click="openSup(1)">-->
                    <!--<Input v-model="MfName" style="width: 160px;" readonly></Input>-->
                    <!--<Button icon="ios-search" @click="openSup(1)"></Button>-->
                    <!--</div>-->
                    <!--</div>-->
                </FormItem>
                <FormItem label="状态">
                    <Select v-model="MfStatus" class="typeSelect">
                        <Option v-for="status in MfStatues" :value="status.code" :key="status.code">{{status.desc}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="联系人">
                    <Input v-model="contacts" @on-blur="contacts = toValidate(contacts)" :maxlength="20"></Input>
                </FormItem>
                <FormItem label="创建时间">
                    <Row>
                        <Col span="11">
                        <DatePicker v-model="time_start" type="datetime" placeholder="选择日期和时间" @on-change="checkStart" :editable=false></DatePicker>
                        </Col>
                        <Col span="2" align="center">
                        ~
                        </Col>
                        <Col span="11">
                        <DatePicker v-model="time_end" type="datetime" placeholder="选择日期和时间" @on-change="checkEnd" :editable=false></DatePicker>
                        </Col>
                    </Row>
                </FormItem>
            </Form>
            <div class="btn-query">
                <Button v-if="if_query" type="primary" icon="search" size="large" @click="searchList" >查询</Button>
                <Button v-if="if_add" type="primary" icon="plus" size="large" @click="addNew" >新建</Button>
            </div>
        </div>
        <!--表格-->
        <div class="mettingManage_list">
            <table class="table table-bordered table-center table-striped table-blue table-standWork taDisplay">
                <thead>
                <tr>
                    <th class="wid-5">序号</th>
                    <th>制造商编码</th>
                    <th>制造商名称</th>
                    <th>本地名称</th>
                    <th>状态</th>
                    <th>注册地址</th>
                    <th>制造商邮箱</th>
                    <th>制造商电话</th>
                    <th>联系人</th>
                    <th>创建时间</th>
                    <th>操作</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item,index) in Manufacturers" :key="Manufacturers.id" class="trDisplay">
                    <td >{{index + 1}}</td>
                    <td class="tdDisplay pointDis" :title="item.bdEquipmentManufacturerCode">{{item.bdEquipmentManufacturerCode}}</td>
                    <td class="tdDisplay pointDis" :title="item.bdEquipmentManufacturerName">{{item.bdEquipmentManufacturerName}}</td>
                    <td class="tdDisplay pointDis" :title="item.bdEquipmentManufacturerLocalName">{{item.bdEquipmentManufacturerLocalName}}</td>
                    <td :title="item.status">{{item.status}}</td>
                    <td class="tdDisplay pointDis" :title="item.registered_address">{{item.registered_address}}</td>
                    <td class="tdDisplay pointDis" :title="item.email">{{item.email}}</td>
                    <td class="tdDisplay pointDis" :title="item.phone">{{item.phone}}</td>
                    <td class="tdDisplay pointDis">{{item.contactPerson}}</td>
                    <td class="wid-20-per">{{item.createAt}}</td>
                    <td>
                        <a v-if="if_edit" @click="editItem(index)">编辑</a>
                        <a v-if="if_del" @click="deleteItem(item.id,index)">删除</a>
                    </td>
                </tr>
                </tbody>
            </table>
            <div class="tableHasNoData" v-show="Manufacturers.length==0"><p>暂无数据</p></div>
            <div class="pageItem" align="right">
                <Page :total="numMaterial" size="small" show-elevator :current="tempPage" @on-change="changePage"></Page>
            </div>
        </div>
        <Modal v-model="newMfacturer" width="700"  :title="title" okText="保存" :loading="loading"  @on-ok="handleSubmit('addData')">
            <Form ref="addData" :model="addData" :rules="ruleValidate" inline :label-width="100">
                <FormItem label="制造商编码" prop="mfaCode">
                    <Input v-model="addData.mfaCode" :maxlength="20" @on-blur="addData.mfaCode = toValidate(addData.mfaCode)"></Input>
                </FormItem>
                <FormItem label="制造商名称" prop="mfaName">
                    <Input v-model="addData.mfaName" :maxlength="20" @on-blur="addData.mfaName = toValidate(addData.mfaName)"></Input>
                    <!--<div style="color:#ffffff" onmousemove="this.style.color='#5b5b5b';"-->
                    <!--onmouseout="this.style.color='#ffffff'">-->
                    <!--<span @click="deleteSupply(0)" v-if="addData.mfaName">-->
                    <!--<Icon type="ios-close" class="deleteTab"></Icon>-->
                    <!--</span>-->
                    <!--<div class="input-search" prop="mfaName" @click="openSup(0)">-->
                    <!--<Input v-model="addData.mfaName" style="width: 160px;" readonly></Input>-->
                    <!--<Button icon="ios-search" @click="openSup(0)"></Button>-->
                    <!--</div>-->
                    <!--</div>-->
                </FormItem>
                <FormItem label="制造商电话" prop="mfaPhone">
                    <Input v-model="addData.mfaPhone" :maxlength="20" @on-blur="addData.mfaPhone = toValidate(addData.mfaPhone)"></Input>
                </FormItem>
                <FormItem label="制造商邮箱" prop="mfaEamil">
                    <Input v-model="addData.mfaEamil" :maxlength="20" @on-blur="addData.mfaEamil = toValidate(addData.mfaEamil)"></Input>
                </FormItem>
                <FormItem label="制造商状态" prop="mfaStatus">
                    <Select v-model="addData.mfaStatus" class="typeSelect">
                        <Option v-if="status.code!=-1" v-for="status in MfStatues" :value="status.desc" :key="status.code">{{ status.desc }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="联系人" prop="mfaContact">
                    <Input v-model="addData.mfaContact" :maxlength="20" @on-blur="addData.mfaContact = toValidate(addData.mfaContact)"></Input>
                </FormItem>
                <FormItem label="注册地址" prop="mfaAddress">
                    <Input v-model="addData.mfaAddress" type="textarea" @on-blur="addData.mfaAddress = toValidate(addData.mfaAddress)" :rows="2" placeholder="Enter something..." style="width: 435px;" ></Input>
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
                if_query: this.$rt(this.authJson.EAM.设备台账.设备基础数据_设备制造商管理列表.查询),
                if_add: this.$rt(this.authJson.EAM.设备台账.设备基础数据_设备制造商管理列表.新建),
                if_edit: this.$rt(this.authJson.EAM.设备台账.设备基础数据_设备制造商管理列表.编辑),
                if_del: this.$rt(this.authJson.EAM.设备台账.设备基础数据_设备制造商管理列表.删除),
                if_save: false,
                /*权限校验 end*/
                MfCode:'',//制造商编码
                MfName:'',//制造商名称
                MfStatus:-1,//状态
                MfStatues:this.$base_info.manufacturerStatusEnum,
                contacts:'',//联系人
                time_start:'',//创建开始时间
                time_end:'',//创建结束时间
                Manufacturers:[],//制造商列表
                loading: true,
                numMaterial:0,
                tempPage:1,
                newMfacturer:false,
                title:'',
                manufacturer:false,
                manufacturer_name:'',
                supplierList:[],
                supplyTotal:0,
                supplyPage:1,
                supplierSelected:{},
                supplierId:'',
                isAdd:'',
                addData:{
                    id:'',
                    mfaCode:'',
                    mfaName:'',
                    mfaPhone:'',
                    mfaEamil:'',
                    mfaStatus:'',
                    mfaContact:'',
                    mfaAddress:'',
                    supplierId:''
                },
                ruleValidate:{
                    mfaCode: [
                        { required: true, message: '制造商编码不能为空', trigger: 'blur' }
                    ],
                    mfaName: [
                        { required: true, message: '制造商名称不能为空', trigger: 'blur' }
                    ],
                    mfaPhone: [
                        { required: true, message: '制造商电话不能为空', trigger: 'blur' }
                    ],
                    mfaEamil: [
                        { required: true, message: '制造商邮箱不能为空', trigger: 'blur' }
                    ],
                    mfaStatus: [
                        { required: true, message: '请选择设备制造商状态', trigger: 'change' }
                    ],
                    mfaContact: [
                        { required: true, message: '联系人不能为空', trigger: 'blur' }
                    ],
                    mfaAddress: [
                        { required: true, message: '注册地址不能为空', trigger: 'blur' }
                    ]
                }
            }
        },
        components: {

        },
        mounted(){
            this.getMfList();
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
                    };
                };
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
                }else{
                    this.notFitDataTip = '请先选择开始时间';
                    this.$Message.error(this.notFitDataTip);
                };
                this.time_end = etime;
            },
            searchList(){
                this.tempPage = 1;
                this.getMfList();
            },
            changePage(page){
                this.tempPage = page;
                this.getMfList();
            },
            getMfList(){
                this.$axios.post("/eamEquipment/manufacturerList",{
                    page:this.tempPage,
                    pagesize:10,
                    code:this.MfCode,
                    name:this.MfName,
                    status:this.MfStatus == -1 ? '': this.MfStatus,
                    contactPerson:this.contacts,
                    startTime:this.time_start,
                    endTime:this.time_end
                }).then((res) => {
                    var res = res.data.response;
//                    console.log(res);
//                    console.log(" 表格数据 + " + JSON.stringify(res));
                    if(res.code == 1){
                        this.Manufacturers = res.data.rows;
                        this.numMaterial = res.data.count;
                        for(var index in res.data.rows){
                            if(res.data.rows[index].status==-1){
                                this.Manufacturers[index].status = '全部';
                            }
                            else if(res.data.rows[index].status==0){
                                this.Manufacturers[index].status = '未认证';
                            }
                            else if(res.data.rows[index].status==1){
                                this.Manufacturers[index].status = '已认证';
                            }
                            else{
                                this.Manufacturers[index].status = '已过期';
                            }
                        }
                    }
                }).catch((err) => {

                });
            },
            //删除
            deleteItem(id){
                this.$axios.post("/eamEquipment/manufacturerDelete",{
                    "manufacturerId":id
                }).then((res) => {
//                    console.log(res);
                    if(res.data.response.code == 1){
                        this.$Message.success('删除成功！');
                        setTimeout(() => {
                            this.getMfList();
                        }, 500);
                    }
                    else{
                        this.$Message.error(res.data.response.msg)
                    }
                }).catch((err) => {
                    console.log(err);
                });
            },
            //保存
            handleSubmit(name){
//                console.log('title === '+this.title)
                if (this.if_save) {
                    this.loading = true;
                    this.$refs[name].validate((valid) => {
                        if (valid) {
                            this.$axios.post("/eamEquipment/manufacturerSave", {
                                "code": this.addData.mfaCode,
                                "name": this.addData.mfaName,
                                "phone": this.addData.mfaPhone,
                                "email": this.addData.mfaEamil,
                                "status": this.addData.mfaStatus == '全部' ? -1 : (this.addData.mfaStatus == '未认证' ? 0 : (this.addData.mfaStatus == '已认证' ? 1 : 2)),
                                "contactPerson": this.addData.mfaContact,
                                "registeredAddress": this.addData.mfaAddress,
                                "updateId": this.addData.id
                            }).then((res) => {
//                                console.log(res);
                                if (res.data.response.code == 1) {
                                    this.$Message.success('保存成功！');
                                    setTimeout(() => {
                                        this.newMfacturer = false;
                                        this.addData = {
                                            id: '',
                                            mfaCode: '',
                                            mfaName: '',
                                            mfaPhone: '',
                                            mfaEamil: '',
                                            mfaStatus: '',
                                            mfaContact: '',
                                            mfaAddress: '',
                                            supplierId: ''
                                        }
                                        this.getMfList();
                                    }, 500);
                                }
                                else {
                                    this.$Message.error(res.data.response.msg);
                                }
                            }).catch((err) => {

                            });
                        } else {
                            this.loading = false;
                            this.$Message.error('请将信息填写完整!');
                        }
                    })
                }
            },
            editItem(index){
                this.newMfacturer = true;
                this.title = '设备制造商编辑';
                this.if_save = this.$rt(this.authJson.EAM.设备台账.设备基础数据_设备制造商管理编辑页.保存);
                this.addData.mfaCode = this.Manufacturers[index].bdEquipmentManufacturerCode;
                this.addData.mfaName = this.Manufacturers[index].bdEquipmentManufacturerName;
                this.addData.mfaPhone = this.Manufacturers[index].phone;
                this.addData.mfaEamil = this.Manufacturers[index].email;
                this.addData.mfaStatus = this.Manufacturers[index].status;
                this.addData.mfaContact = this.Manufacturers[index].contactPerson;
                this.addData.mfaAddress = this.Manufacturers[index].registered_address;
                this.addData.id = this.Manufacturers[index].id;
            },
            //新建
            addNew(){
                this.newMfacturer = true;
                this.title = '设备制造商新增';
                this.if_save = this.$rt(this.authJson.EAM.设备台账.设备基础数据_设备制造商管理新建页.保存);
                this.addData = {
                    id:'',
                    mfaCode:'',
                    mfaName:'',
                    mfaPhone:'',
                    mfaEamil:'',
                    mfaStatus:'',
                    mfaContact:'',
                    mfaAddress:''
                }
            },
            //所属供应商
//            openSup(item){
//                $('.trBgc').removeClass('highlight')
//                this.manufacturer = true;
//                this.supplierGet();
//                this.isAdd = item;
//            },
//            supplierGet(){
//                this.$axios.get('/System/equipmentManufacturerMagnifier', {
//                    params: {
//                        page: this.supplyPage,
//                        pageSize: 5,
//                        manufacturer_name: this.manufacturer_name
//                    }
//                }).then((res) => {
//                    var ret = res.data.response
//                    console.log(ret)
//                    if (ret.code == 1) {
//                        this.supplierList = ret.data.Rows;
//                        this.supplyTotal = ret.data.Total
//                    }
//                }).catch((err) => {
//
//                });
//            },
//            searchSupplier(){
//                this.supplyPage=1;
//                this.supplierGet();
//            },
//            supplyChange(page){
//                this.supplyPage = page;
//                $(".supply").find("input[type='radio']:checked").prop('checked', false);
//                this.supplierGet();
//            },
//            toSelectManufacturer(index){
//                $('.trBgc').eq(index).addClass('highlight').siblings().removeClass('highlight')
//                this.supplierSelected = this.supplierList[index];
//            },
//            supplySelected(){
//                console.log(this.isAdd)
//                if(this.supplierSelected){
//                    //判断是新增还是查询
//                    if(this.isAdd==1){
//                        this.MfName = this.supplierSelected.tBdEquipmentManufacturerName;
//                        this.supplierId = this.supplierSelected.tBdEquipmentManufacturerId;
//                    }
//                    else{
//                        this.addData.mfaName = this.supplierSelected.tBdEquipmentManufacturerName;
//                        this.addData.supplierId = this.supplierSelected.tBdEquipmentManufacturerId;
//                    }
//
//                }
//            },
//            deleteSupply(item){
//                this.isAdd = item;
//                if(this.isAdd==1){
//                    this.MfName = '';
//                    this.supplierId = '';
//                }
//                else{
//                    this.addData.mfaName = '';
//                    this.addData.supplierId = '';
//                }
//                $(".supply").find("input[type='radio']:checked").prop('checked', false);
//            },
        }
    }
</script>