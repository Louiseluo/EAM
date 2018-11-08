<template>
    <div class="basic fault-content">
        <!--模块名称-->
        <div class="title">
            <span>设备管理</span>
        </div>
        <div class="titleListManage">
            <ul class="tabUL">
                <li class="active">
                    <a>设备管理</a>
                </li>
                <li>
                    <router-link to='/equManufacturerList'>设备制造商管理</router-link>
                </li>
                <li>
                    <router-link to='/equTypeList'>设备类型管理</router-link>
                </li>
                <li>
                    <router-link to='/equKindList'>设备型号管理</router-link>
                </li>
            </ul>
        </div>
        <!--表单-->
        <div class="form-content">
            <Form inline :label-width="100">
                <!--<FormItem label="设备类型">-->
                    <!--<Input v-model="equName" :maxlength="20" @on-blur="equName = toValidate(equName)" @on-change="lengthChange(equName,20)"></Input>-->
                <!--</FormItem>-->
                <FormItem label="设备类型">
                    <div style="color:#ffffff" onmousemove="this.style.color='#5b5b5b';"
                         onmouseout="this.style.color='#ffffff'">
	                    <span @click="deleteEquKind" v-if="equKind">
	                    	<Icon type="ios-close" class="deleteTab"></Icon>
	                    </span>
                        <div class="input-search pointDis" @click="openKind_mod">
                            <Input v-model="equKind" :readonly=true style="width: 160px;"></Input>
                            <Button icon="ios-search"></Button>
                        </div>
                    </div>
                </FormItem>
                <FormItem label="设备型号">
                    <div style="color:#ffffff" onmousemove="this.style.color='#5b5b5b';"
                         onmouseout="this.style.color='#ffffff'">
	                    <span @click="deleteEqu" v-if="equType">
	                    	<Icon type="ios-close" class="deleteTab"></Icon>
	                    </span>
                        <div class="input-search pointDis" @click="openType_mod">
                            <Input v-model="equType" :readonly=true style="width: 160px;"></Input>
                            <Button icon="ios-search"></Button>
                        </div>
                    </div>
                </FormItem>
                <FormItem label="设备状态">
                    <Select v-model="equState" class="typeSelect">
                        <Option v-for="state in equStates" :value="state.code" :key="state.code">{{state.desc}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="设备地点">
                    <div style="color:#ffffff" onmousemove="this.style.color='#5b5b5b';" onmouseout="this.style.color='#ffffff'">
	                    <span @click="deleteSite" v-if="equSite">
	                    	<Icon type="ios-close" class="deleteTab"></Icon>
	                    </span>
                        <div class="input-search pointDis" @click="equSite_mod = true">
                            <Input v-model="equSite" :readonly=true style="width: 160px;"></Input>
                            <Button icon="ios-search"></Button>
                        </div>
                    </div>
                </FormItem>
                <!--<FormItem label="关联备件">-->
                    <!--<Input v-model="associatedPart" :maxlength="20"-->
                           <!--@on-change="lengthChange(associatedPart,20)"></Input>-->
                <!--</FormItem>-->
                <FormItem label="制造商">
                    <div style="color:#ffffff" onmousemove="this.style.color='#5b5b5b';"
                         onmouseout="this.style.color='#ffffff'">
	                    <span @click="deleteSupply" v-if="supplier">
	                    	<Icon type="ios-close" class="deleteTab"></Icon>
	                    </span>
                        <div class="input-search" prop="supplier" @click="openSup">
                            <Input v-model="supplier" style="width: 160px;" readonly></Input>
                            <Button icon="ios-search" @click="openSup"></Button>
                        </div>
                    </div>

                    <!--<Select v-model="servicePerson"  class="typeSelect">
                        <Option v-for="person in servicePersons" :value="person.value" :key="person.id">{{ person.value}}
                        </Option>
                    </Select>-->
                </FormItem>
                <FormItem label="设备权重">
                    <Select v-model="equWeight" class="typeSelect">
                        <Option v-for="weight in equWeights" :value="weight.code" :key="weight.code">{{weight.desc}}
                        </Option>
                    </Select>
                </FormItem>
                <FormItem label="启用时间">
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
                <Button type="primary" icon="shuffle" size="large" disabled>同步</Button>
                <Button v-if="if_export" type="primary" icon="forward" size="large" @click="signOut" disabled >导出</Button>
                <Button type="primary" icon="search" size="large" @click="changePage(1)" >查询</Button>
                <!--<router-link :to="{ path:'/equipmentDetail',query:{from:'toAdd',itemId:''}}">-->
                    <Button v-if="if_add" type="primary" icon="plus" size="large" disabled >新建</Button>
                <!--</router-link>-->
            </div>
        </div>
        <!--表格-->
        <div class="mettingManage_list">
            <table class="table table-bordered table-center table-striped table-blue table-standWork taDisplay">
                <thead>
                <tr>
                    <th class="wid-5">序号</th>
                    <th >设备名称</th>
                    <th>设备类型</th>
                    <th>制造商</th>
                    <th>设备型号</th>
                    <th>设备状态</th>
                    <th>设备地点</th>
                    <th >设备权重</th>
                    <!--<th>生产工序</th>-->
                    <!--<th>关联备件</th>-->
                    <th>启用时间</th>
                    <th>操作</th>
                </tr>

                </thead>
                <tbody>

                <tr v-for="(equipment, index) in equments" :key="equipment.id" class="trDisplay">
                    <td >{{index + 1}}</td>
                    <td class="tdDisplay pointDis" :title="equipment.bdEquipmentName">{{equipment.bdEquipmentName}}</td>
                    <td class="tdDisplay pointDis" :title="equipment.typeName">{{equipment.typeName}}</td>
                    <td class="tdDisplay pointDis" :title="equipment.manufacturerName">{{equipment.manufacturerName}}</td>
                    <td class="tdDisplay pointDis" :title="equipment.modelName">{{equipment.modelName}}</td>
                    <td class="tdDisplay pointDis" :title="equipment.status">{{equipment.status==0?'停机':equipment.status==1?'故障':equipment.status==2?'换装调试':equipment.status==3?'计划内保养':equipment.status==4?'正常加工':''}}</td>
                    <!--<td>{{equipment.procedure}}</td>-->
                    <!--<td>{{equipment.associated}}</td>-->
                    <td class="tdDisplay pointDis" :title="equipment.factoryLocationName">{{equipment.factoryLocationName}}</td>
                    <td>{{equipment.weight}}</td>
                    <td>{{equipment.startToUseDate}}</td>
                    <td class="mettingManage_oprationItem">

                        <router-link v-if="if_detail"
                                :to="{ path:'/equipmentDetail',query:{from:'toDetail',itemId:equipment.id}}">
                            <a>查看</a></router-link>
                        <router-link v-if="if_edit"
                                :to="{ path:'/equipmentDetail',query:{from:'toEdit',itemId:equipment.id}}"><a>编辑</a>
                        </router-link>
                        <a v-if="if_del" @click="delEquPro(equipment.id)">删除</a>
                    </td>
                </tr>
                </tbody>
            </table>
            <div class="tableHasNoData" v-show="tableNoData"><p>暂无数据</p></div>
            <div class="demo-spin-col" v-show="tableDataLoading">
                <Spin fix>
                    <Icon type="load-c" size=18  class="demo-spin-icon-load"></Icon>
                    <div>加载中…</div>
                </Spin>
            </div>

            <div class="pageItem" align="right">
                <Page :total="numMaterial" size="small" show-elevator :current="tempPage" @on-change="changePage"></Page>
            </div>
        </div>
        <!--导出的弹出框：-->
        <Modal title="提示" v-model="equListModalDis" class-name="vertical-center-modal" @on-ok="toSignOutList">
            <div class="outBtn">
                <p v-show=signOutTip>请先选择日期范围</p>
                <p v-show="!signOutTip">确定要导出从<span class="dataColor">{{time_start_formate}}</span>到<span class="dataColor">{{time_end_formate}}</span>的签到记录吗</p>
            </div>
        </Modal>
        <!--设备型号弹出框：-->
        <Modal v-model="equType_mod" title="设备型号" @on-ok="toSelect_equType">
            <equ_typeSelect @typeSelected="type_hasSelected"></equ_typeSelect>
        </Modal>
        <!--设备型号-->
        <Modal v-model="equKind_mod" title="设备类型" @on-ok="toSelect_equKind">
            <equ_kindSelect @typeSelected="kind_hasSelected"></equ_kindSelect>
        </Modal>
        <Modal v-model="equSite_mod" title="设备地点" @on-ok="toSelect_equSite">
            <Tree :data="baseData" show-checkbox :multiple="false" :show-checkbox="false" @on-select-change="left_personSelected" class="max-h-300"></Tree>
        </Modal>
        <Modal v-model="supplierModal" title="制造商" @on-ok="supplySelected">
            <div>
            <div class="btn-query mar-b-10" style="display: table;margin-bottom: 20px;">
                制造商名称  <Input class="mar-l-10" style="width: 160px;" v-model="manufacturer_name" @on-blur="manufacturer_name = toValidate(manufacturer_name)" ></Input>
                <Button v-if="if_query" type="primary" icon="search" size="large" @click="searchSupplier">
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
                    <Page size="small" :total='supplyTotal' show-elevator :page-size="5" :current="supplyPage" @on-change="supplyChange"></Page>
                </div>
            </div>
            </div>
        </Modal>
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
                <Button type="error" size="large" long :loading="deleteMod_loading" @click="delEqu">删除</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
    import equ_typeSelect from "../treeMulitiple/equ_typeSelect.vue";
    import equ_kindSelect from "../treeMulitiple/equ_kindSelect.vue";
    export default {
        data(){
            return {
                /*权限校验 start*/
//                if_query:  this.$rt(this.authJson.EAM.设备管理.列表.查询),
//                if_detail:  this.$rt(this.authJson.EAM.设备管理.列表.查看),
//                if_add:  this.$rt(this.authJson.EAM.设备管理.列表.新建),
//                if_edit:  this.$rt(this.authJson.EAM.设备管理.列表.编辑),
//                if_export:  this.$rt(this.authJson.EAM.设备管理.列表.导出),
//                if_del:  this.$rt(this.authJson.EAM.设备管理.列表.删除),
                if_query:  true,
                if_detail:  true,
                if_add:  true,
                if_edit:  true,
                if_export:  true,
                if_del:  true,
                /*权限校验 end*/
                //设备型号
                //搜索项：
//                equName: "",
                equType_mod: false,
                equKind_mod: false,
                equType: "",
                equTypeId: '',
                equKind: '',
                equKindId: '',
                equStates: this.$base_info.bdFactoryEquipmentStatusEnum,
                equState: this.$base_info.bdFactoryEquipmentStatusEnum[0].code,
                equSite_mod: false,
                baseData: [],
                equ_site_obj: "",
                equSite_selected: "",
                equSite: "",
                equSiteId: '',
                associatedPart: "",
                servicePersons: [
                    {id: "0", value: "全部"},
                    {id: "1", value: "供应商一"},
                    {id: "2", value: "供应商二"},
                    {id: "3", value: "供应商三"}
                ],
                servicePerson: "全部",
                equWeights: this.$base_info.bdFactoryEquipmentWeightsEnum,

                equWeight: this.$base_info.bdFactoryEquipmentWeightsEnum[0].code,
                //起始时间：
                time_start: "",
                time_end: "",
                //时间范围不合适时的提示：
                notFitDataTip: "",
                time_start_formate: "",
                time_end_formate: "",
                //导出，模态框提示内容：
                signOutTip: true,
                equListModalDis: false,
                //设备列表：
                equments: [

//                  {id:"0",name:"设备一",type:"类型一",state:"状态一",site:"地点一",weight:"权重一",procedure:"工序一",associated:"备件一",service:"供应商一",startTime:"2017-10-21 00:00:00"},
//                  {id:"0",name:"设备二",type:"类型二",state:"状态二",site:"地点二",weight:"权重二",procedure:"工序二",associated:"备件二",service:"供应商二",startTime:"2017-10-21 00:00:00"},
//                  {id:"0",name:"设备三",type:"类型三",state:"状态三",site:"地点三",weight:"权重三",procedure:"工序三",associated:"备件三",service:"供应商三",startTime:"2017-10-21 00:00:00"}
                ],
                //在表格无数据时:
                tableNoData: false,
                //数据加载中:
                tableDataLoading: false,
                numMaterial: 10,
                pageSize: 5,
                tempPage: 1,
                supplier: '',
                supplierId:'',
                supplierSelected: '',
                supplierModal: false,
                supplyPage: 1,
                supplierList: [],
                manufacturer_name:'',
                supplyTotal: 0,
                deleteModal: false,
                deleteMod_loading: false,
                created: false,
            }

        },
        components: {
            'equ_typeSelect': equ_typeSelect,
            'equ_kindSelect': equ_kindSelect,
        },
        mounted(){

            this.get_equSite();
            this.equList();
        },
        activated: function () {
            this.created && this.equListAquest();
            this.created = true;
        },
        methods: {
            //验证输入框格式
            toValidate(msg){
                console.log(msg);
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
            //设备型号：
            openKind_mod(){
                $('.trBgb').removeClass('highlight')
                this.equKind_mod = true;
            },
            type_hasSelected(message){
                this.equType_selected = message;
            },
            kind_hasSelected(message){
                this.equKind_selected = message;
            },
            //设备型号：
            openType_mod(){
                $('.trBga').removeClass('highlight')
                this.equType_mod = true;
            },
            site_hasSelected(message){
                this.equSite_selected = message;
            },
            toSelect_equType(){
                this.equType = this.equType_selected.modelName;
                this.equTypeId = this.equType_selected.modelId;
            },
            toSelect_equKind(){
                this.equKind = this.equKind_selected.tBdEquipmentTypeName;
                this.equKindId = this.equKind_selected.tBdEquipmentTypeId;
            },
            //设备地点完整树加载:
            get_equSite(){
                let vt = this;
                //设备地点树接口地址修改 == 20180823-GDJ
//                this.$axios.get('/common/location/locationNameTree').then((res) => {
                this.$axios.get('/common/location/tree').then((res) => {
                    let result = res.data.response;
//                    console.log(result)
//                    console.log('设备地点数据')
                    if (result.code != 1) {
                        vt.$Message.error(result.msg);
                    }
                    else {
                        vt.baseData = result.data;
                        vt.baseData[0].expand = true;
                    }
                }).catch((err) => {

                });
            },
            //设备地点树选择：
            left_personSelected (left_node){
                if (JSON.stringify(left_node) == "[]") {
                    return
                };
//                if (left_node[0] && left_node[0].children) {
//                    left_node[0].expand = !left_node[0].expand;
//                    left_node[0].selected = false;
//                }
                this.equ_site_obj = left_node[0];
            },

            //地点确定按钮：
            toSelect_equSite(){
                this.equSite = this.equ_site_obj.title;
                this.equSiteId = this.equ_site_obj.id
            },
            //改变当前页:
            changePage: function (current) {
                this.tempPage = current;
                this.equList();
//              this.toSearch(this.tempPage);
            },
            to_search(){
                this.tempPage = 1;
                this.equList();
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
                };
                this.time_end = etime;
//                if (this.time_start!= '') {
//                    if (this.time_end<= this.time_start) {
//                        this.$Message.error('结束时间应大于开始时间');
//                    }
//                }
            },
            //导出：
            signOut() {
                if (this.time_start && this.time_end) {
                    if (this.notFitDataTip != "") {
                        this.$Message.error(this.notFitDataTip);
                        return;
                    }
                    else {
                        this.time_start_formate = this.time_start;
                        this.time_end_formate = this.time_end;
                        this.signOutTip = false;
                    }
                }
                else {
                    this.signOutTip = true;
                };
                this.equListModalDis = true
            },
            //跳转至导出列表
            toSignOutList() {
                if (!this.signOutTip) {
                    let vt = this;
//                    this.$axios.post("/meetings/export", {
//                        "page": "",
//                        "pageSize": "",
//                        startTime: vt.meeting_start,
//                        endTime: vt.meeting_end,
//                    }).then(function (response) {
//                        let code = response.data.response.code;
//                        if (code != 1) {
//                            vt.$Message.error(response.data.response.msg);
//
//                        } else {
//                            window.location.href = "../static/excel/qsbMeeting/" + response.data.response.data.success;
//                        }
//                    }).catch((err) => {
//
//                    });
                }
                else {
                };
            },
            //所属供应商
            openSup(){
                $('.trBgc').removeClass('highlight')
                this.supplierModal = true;
                this.supplierGet();
            },
            supplierGet(){
                this.$axios.get('/System/equipmentManufacturerMagnifier', {
                    params: {
                        page: this.supplyPage,
                        pageSize: 5,
                        manufacturer_name: this.manufacturer_name
                    }
                }).then((res) => {
                    var ret = res.data.response
                    console.log(ret)
                    if (ret.code == 1) {
                        this.supplierList = ret.data.Rows;
                        this.supplyTotal = ret.data.Total
                    }
                }).catch((err) => {

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
                this.supplier = this.supplierSelected.tBdEquipmentManufacturerName;
                this.supplierId = this.supplierSelected.tBdEquipmentManufacturerId;
            },
            //查询列表
            equList(){
//          	console.log(this.equWeight)
                if (this.time_start != '' && this.time_end != '') {
                    if (this.time_start >= this.time_end) {
                        this.$Message.error('开始时间应在结束时间之前')
                    }
                    else {
                        this.equListAquest();
                    }
                }
                else if (this.time_start == '' && this.time_end != '') {
                    this.$Message.error('开始时间不能为空')
                }
                else if (this.time_start != '' && this.time_end == '') {
                    this.$Message.error('结束时间不能为空')
                }
                else {
                    this.equListAquest();
                }
            },
            equListAquest(){
                let vt = this;
                this.$axios.post('/eamEquipment/equipment/inquire', {
                    page: vt.tempPage,
                    pageSize: 10,
//                    name: this.equName,
                    modelId: vt.equTypeId,
                    typeId: this.equKindId,
                    status: vt.equState == -1 ? '' : this.equState,
                    factoryLocationId: this.equSiteId,
//                    toolName: vt.associatedPart,
                    manufacturerId: this.supplierId, //制造商供应商
                    weight: vt.equWeight == -1 ? '' : this.equWeight,
                    startToUseDateA: vt.time_start,
                    startToUseDateB: vt.time_end
                }).then((res) => {
                    var ret = res.data.response.data.response;
                    if (ret.code == 1) {
                        console.log("ret------------->");
                        console.log(ret);
                        if (ret.data) {
                            vt.equments =  ret.data.rows;
//                            console.log("this.equments------------>");
//                            console.log(this.equments);
                            vt.numMaterial = ret.data.count;
                            if (vt.equments.length > 0) {
                                vt.tableNoData = false;
                            }
                            else {
                                vt.tableNoData = true
                            }
                        }
                        else{
                            vt.equments=[];
                            vt.numMaterial=10;
                            vt.tableNoData = true;
                        };
                    }
                    else {
                        vt.$Message.error(ret.msg)
                    }
                }).catch((err) => {
//            	    alert("访问失败");
                });
            },
            delEquPro(id){
                this.deleteModal = true;
                this.equipmentId = id;
            },
            delEqu(){
                this.deleteMod_loading = true;
                this.$axios.post('/eamEquipment/delete', {equipmentId: this.equipmentId}).then((res) => {
                    var ret = res.data.response
                    this.deleteModal = false;
                    if (ret.code == 1) {
                        this.$Message.success('删除成功');
                        this.equListAquest();
                    }
                    else {
                        this.$Message.error(ret.msg)
                    }
                    setTimeout(() => {
                        this.deleteMod_loading = false;
                    }, 500);
                }).catch((err) => {
                });
            },
            deleteEqu(){

                $("td").find(".checkInput_problem:checked").prop('checked', false);
                this.equType = ''
                this.equTypeId = ''
            },
            deleteEquKind(){
                $("td").find(".checkInput_problem:checked").prop('checked', false);
                this.equKind = ''
                this.equKindId = ''
            },
            deleteSite(){
                this.equSite = ''
                this.equSiteId = ''
            },
            deleteSupply(){
                this.supplier = '';
                this.supplierId = '';
                $(".supply").find("input[type='radio']:checked").prop('checked', false);
            },
        }
    }
</script>