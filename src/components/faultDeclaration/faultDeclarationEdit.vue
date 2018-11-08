<template>
    <div class="basic fault-content">
        <!--模块名称-->
        <div class="title">
            <span>维修管理 - {{titleDesc}}</span>
        </div>
        <div class="second-title">工单详情</div>
        <!--表单-->
        <div class="form-content trobleForm">
            <Form ref="editWorkForm" :model="editWorkForm" label-position="right" inline :label-width="100">
                <Form-item label="执行状态" prop="status">
                    <Select style="width: 160px;" disabled v-model="editWorkForm.status">
                        <Option v-for="status in handleStatusArr" :value="status.code" :key="status.code">{{status.desc}}</Option>
                    </Select>
                </Form-item>
                <Form-item label="工单类型" prop="orderType">
                    <Select style="width: 160px;" disabled v-model="editWorkForm.orderType">
                        <Option v-for="status in planTypeArr" :value="status.code" :key="status.code">{{status.desc}}</Option>
                    </Select>
                </Form-item>
                <Form-item label="设备名称" prop="equipmentName">
                    <Input v-model="editWorkForm.equipmentName" style="width: 160px;" disabled></Input>
                </Form-item>
                <Form-item label="设备地点" prop="equipmentAddr">
                    <Input :maxlength="1000" v-model="editWorkForm.equipmentAddr" style="width: 160px;" disabled></Input>
                </Form-item>
                <Form-item label="上报人" prop="reporterName">
                    <Input v-model="editWorkForm.reporterName" style="width: 160px;" disabled></Input>
                </Form-item>
                <Form-item label="上报时间" prop="reporterTime">
                    <Input v-model="editWorkForm.reporterTime" style="width: 160px;" disabled></Input>
                </Form-item>
                <Form-item label="响应时间" prop="handleTime">
                    <Input v-model="editWorkForm.handleTime" style="width: 160px;" disabled></Input>
                </Form-item>
                <!--<FormItem label="故障描述" class=" mar-t-2 block">
                    <Row>
                        <Col span="22">
                        <div class="personListDiv troubleDis">
                            <div class="ivu-tag mar-t-08" v-for="(des,index) in describesDis" :key="des.id">
                                <span  style="width:150px;text-overflow:ellipsis;  white-space:nowrap; overflow:hidden; ">{{des.name}}</span>
                                <i class="ivu-icon ivu-icon-ios-close-empty" @click="toDeleteDes(index)"></i>
                                <br>
                            </div>
                        </div>
                        </Col>
                        <Col span="1" align="center"  >
                        <div class="personAdd pad-t-25">
                            <a @click="describeMod = true">
                                <Icon type="plus-round" class="font-20"></Icon>
                            </a>
                        </div>
                        </Col>
                    </Row>
                </FormItem>
                <FormItem label="故障原因" class="mar-t-10 block" style="margin-top:20px;">
                    <Row>
                        <Col span="22">
                        <div class="personListDiv troubleDis">
                            <div class="ivu-tag mar-t-08" v-for="(des,index) in reasonsDis" :key="des.id" style="overflow: visible">
                                <span  style="width:150px;text-overflow:ellipsis;  white-space:nowrap; overflow:hidden; ">{{des.name}}</span><i
                                    class="ivu-icon ivu-icon-ios-close-empty" @click="toDeleteRes(index)"></i>
                                <br>
                            </div>
                        </div>
                        </Col>
                        <Col span="1" align="center">
                        <div class="personAdd pad-t-25">
                            <a @click="reasonMod = true">
                                <Icon type="plus-round" class="font-20"></Icon>
                            </a>
                        </div>
                        </Col>
                    </Row>
                </FormItem>-->
                <Form-item label="故障描述" prop="faultDesc" :title="editWorkForm.faultDesc">
                    <Input :maxlength="1000" v-model="editWorkForm.faultDesc" type="textarea"  style="width: 500px;" disabled></Input>
                </Form-item>
                <Form-item label="故障原因" prop="faultReason">
                    <Input :maxlength="1000" v-model="editWorkForm.faultReason" type="textarea" style="width: 500px;" :disabled="editEnable"></Input>
                </Form-item>

                <Form-item label="备件申领" prop="spareParts">
                    <Input v-model="editWorkForm.spareParts" style="width: 160px;" disabled></Input>
                </Form-item>
            </Form>
        </div>
        <!--  kp---备品备件---start-->
        <div class="second-title">备品备件</div>
        <div v-show="!editEnable">
            <table class="table table-bordered table-center table-striped table-blue taDisplay">
                <thead>
                <tr>
                    <th width="60px">序号</th>
                    <th>备件名称</th>
                    <th>备件类型</th>
                    <th>备件、库存单位</th>
                    <th>备件数量(个)</th>
                    <th>备件单价</th>
                    <th>单价单位</th>
                    <th width="100px">操作</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(equipment, index) in gettedParts" :key="equipment.part_id" class="trDisplay">
                    <td>{{index + 1}}</td>
                    <td class="tdDisplay pointDis" :title="equipment.partName">{{equipment.partName}}</td>
                    <td :title="equipment.partType">{{equipment.partType}}</td>
                    <td class="tdDisplay pointDis" :title="equipment.partUnit">{{equipment.partUnit}}</td>
                    <td class="wid-10">
                        <Input class="center" :maxlength='4' v-model="equipment.partNum" style="width: 100px;margin-top: 5px;margin-bottom: 5px;" @on-change="toTestIsNAN(equipment.partNum,index)"></Input>
                    </td>
                    <td :title="equipment.partPrice" >
                        <Input class="center" :maxlength='9' v-model="equipment.partPrice" style="width: 100px;margin-top: 5px;margin-bottom: 5px;" @on-change="toTestIsNANPrice(equipment.partPrice,index)"></Input>
                    </td>
                    <td class="tdDisplay pointDis">
                        <Select v-model="equipment.partPriceUnitId"  @on-change="selectPriceUnit" :label-in-value='true'>
                            <Option v-for="item in priceUnitList" :value="item.uomId" :key="item.uomId">{{ item.uomName }}</Option>
                        </Select>
                    </td>
                    <td class="mettingManage_oprationItem">
                        <a @click="deletePart(index)">删除</a>
                    </td>
                </tr>
                </tbody>
            </table>
            <div class="tableHasNoData" v-show="tableNoData"><p>暂无数据</p></div>
            <Button type="primary" icon="plus-round" class="buttonsDesign " @click="sparePartsMod=true">添加</Button>
        </div>
        <div v-show="editEnable">
            <Table highlight-row border ref="currentRowTable" class="taDisplay" :columns="partColumns" :data="partData"></Table>
        </div>

        <div class="second-title mar-t-15">执行记录</div>
        <!--表格-->
        <div class="table-content">
            <Table highlight-row border ref="currentRowTable" class="taDisplay" :columns="recordColumns" :data="recordData"></Table>
        </div>
        <!--保存按钮-->
        <div class="btn-group" align="center">
            <router-link to='/fault' class="mar-r-15">
                <Button type="primary" size="large">返回</Button>
            </router-link>
            <!--<Button type="primary" size="large" v-show="editEnable && editWorkForm.status!=3" @click="partEdit">编辑</Button>
            <Button type="primary" size="large" v-show="!editEnable" @click="partSave" :loading="load_fix">保存草稿</Button>
            <Button type="primary" size="large" v-show="!editEnable" @click="sparePartApply">备件申领</Button>
            <Button type="primary" size="large" v-show="editEnable && editWorkForm.status!=3" @click="dispatchPart">免维修</Button>-->

            <Button type="primary" size="large" v-show="editEnable && editWorkForm.status!=3" @click="partEdit">编辑</Button>
            <Button type="primary" size="large" v-show="!editEnable" @click="partSave" :loading="load_fix">保存草稿</Button>
            <Button type="primary" size="large" v-show="editEnable && editWorkForm.status == 0" @click="sparePartApply(0)">备件申领</Button>
            <Button type="primary" size="large" v-show="editEnable && editWorkForm.status == 1" @click="sparePartApply(1)">备件补领</Button>
            <Button type="primary" size="large" v-show="editEnable && editWorkForm.status!=2 && editWorkForm.status!=3" @click="dispatchPart">免维修</Button>
        </div>

        <!--备件申领-消息反馈（充足）-->
        <Modal v-model="sparePartsForEnough" title="备件申领-消息反馈（充足）">
            <Form ref="formItem" :model="formItem" label-position="right" inline :label-width="100">
                <Form-item label="领料单编号">
                    <Input v-model="formItem.sparePartsCode" style="width: 160px;" placeholder="ceshi001"></Input>
                </Form-item>
                <Form-item label="领料时间">
                    <Input v-model="formItem.sparePartsTime" style="width: 160px;" placeholder="2017-11-23 09:15"></Input>
                </Form-item>
                <Form-item label="领料地址">
                    <Input v-model="formItem.sparePartsAddr" style="width: 160px;" placeholder="仓库1"></Input>
                </Form-item>
                <Form-item label="注意事项">
                    <Input :maxlength="1000" v-model="formItem.warning" placeholder="备件运输方式是非人工时，需要提示携带运输工具；" type="textarea" style="width: 350px;"></Input>
                </Form-item>
            </Form>
            <div slot="footer">
                <Button type="primary">驳回订单</Button>
                <Button type="primary" @click="sparePartsForEnough=false">继续申领</Button>
            </div>
        </Modal>

        <!--备件申领-消息反馈（缺少）-->
        <Modal v-model="sparePartsForLack" title="备件申领-消息反馈（缺少）">
            <p>
                很抱歉地通知您，您申领的<strong class="col-orange font-18">&nbsp;备件001（3片）</strong>目前数量只剩<strong class="col-orange font-18">&nbsp;2片&nbsp;</strong>了，是否继续申领？
            </p>
            <div slot="footer">
                <Button type="primary" size="large" @click="sparePartsForLack=false">确定</Button>
            </div>
        </Modal>
        <!--//kp----故障描述弹出框---start-->
        <Modal v-model="describeMod" title="故障描述添加" width="1000" :styles="{top: '40px'}" @on-ok="toAddDes">
            <div class="meetingManage_form pad-0">
                <Form label-position="right" inline :label-width="100">
                    <FormItem label="关键字查询">
                        <Input class="form_input"></Input>
                    </FormItem>

                    <FormItem label="" :label-width="50">
                        <div>
                            <Button type="primary" class="buttonsDesign" @click="">查询</Button>
                        </div>
                    </FormItem>
                </Form>
            </div>
            <Row class="addPersonRow">
                <Col :span="12" class="pad-r-10">
                <table class="table table-bordered table-center table-striped table-blue">
                    <thead>
                    <tr>
                        <th>序号</th>
                        <th>故障描述选择</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(des, index) in describes" :key="des.id" class="pointDis" @click="toSelectItem(index)">
                        <!--<td><input input type='radio' name='checked_radio' class="checkInput_person"></td>-->
                        <td>{{index + 1}}</td>
                        <td>{{des.name}}</td>
                    </tr>
                    </tbody>
                </table>

                <div class="pageItem" align="right">
                    <Page :total="10" size="small" show-elevator :page-size="8"
                          @on-change=""></Page>
                </div>
                </Col>
                <Col :span="12" class="pad-l-10">
                <div id="scrollDiv" class="personScro">
                    <p>已选数：{{selectedDesNum}}</p>
                    <div calss="addPerson_right" v-for="(des, index) in this.describesReview"
                         onmousemove="this.style.background='#EEEEEE';this.style.color='';"
                         onmouseout="this.style.background='#FFFFFF'">
                        <span disabled="true" class="selectedPerson_dis">{{des.name}}</span>
                        <span @click="deleteDesReview(index)" class="personRevierDet">
                            <Icon type="ios-close"></Icon></span>
                    </div>
                </div>
                </Col>
            </Row>

        </Modal>
        <!--//kp----故障原因弹出框---start-->
        <Modal v-model="reasonMod" title="故障原因添加" width="1000" :styles="{top: '40px'}" @on-ok="toAddRes">
            <div class="meetingManage_form pad-0">
                <Form label-position="right" inline :label-width="100">
                    <FormItem label="关键字查询">
                        <Input class="form_input"></Input>
                    </FormItem>

                    <FormItem label="" :label-width="50">
                        <div>
                            <Button type="primary" class="buttonsDesign" @click="">查询</Button>
                        </div>
                    </FormItem>
                </Form>
            </div>
            <Row class="addPersonRow">
                <Col :span="12" class="pad-r-10">

                <table class="table table-bordered table-center table-striped table-blue">
                    <thead>
                    <tr>
                        <th>序号</th>
                        <th>故障原因选择</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(des, index) in reasons" :key="des.id" class="pointDis" @click="toSelectReason(index)">
                        <td>{{index + 1}}</td>
                        <td>{{des.name}}</td>
                    </tr>
                    </tbody>
                </table>

                <div class="pageItem" align="right">
                    <Page :total="10" size="small" show-elevator :page-size="8" @on-change=""></Page>
                </div>
                </Col>
                <Col :span="12" class="pad-l-10">
                <div id="scrollDiv2" class="personScro">
                    <p>已选数：{{selectedResNum}}</p>
                    <div calss="addPerson_right" v-for="(des, index) in reasonsReview"
                         onmousemove="this.style.background='#EEEEEE';this.style.color='';"
                         onmouseout="this.style.background='#FFFFFF'">
                        <span disabled="true" class="selectedPerson_dis">{{des.name}}</span>
                        <span @click="deleteResReview(index)" class="personRevierDet">
                            <Icon type="ios-close"></Icon>
                        </span>
                    </div>
                </div>
                </Col>
            </Row>

        </Modal>
        <!--kp---备品备件多选弹出框：---开始-->
        <Modal v-model="sparePartsMod" title="备品备件列表" @on-ok="toAdd_spareParts" width="1000" :styles="{top: '40px'}">
            <table_multiple @sparePartsSetected="spareParts_dataSelectedDisa" :mod_rightDisplay="sparePartsSelected"></table_multiple>
        </Modal>

    </div>
</template>

<script>
    //--备品备件多选组件---kp：
    import table_multiple from '../treeMulitiple/repair_spartParts.vue';
    export default {
        data (){
            //验证名称
            const validateAge = (rule, value, callback) => {

            };
            return {
                /**************** page loading --S-- LTT **************/
                repairsId:'',
                editEnable:false,
                titleDesc:'编辑',
                flag:0,//0:查看；1：编辑
                /**************** page loading --E-- LTT **************/

                /**************** order detail --S-- LTT **************/
                editWorkForm: {
                    status: "",
                    orderType: '',
                    equipmentName: "",
                    equipmentAddr: "",
                    reporterName: '',
                    reporterTime: '',
                    handleTime: '',
                    faultDesc: '',
                    faultReason: '',
                    spareParts: '',
//                    applyStatus: '',
                },
                //执行状态
                handleStatusArr: this.$base_info.executionStatusEnum,
                //工单类型
                planTypeArr:this.$base_info.tEamDispatchOrderTypeEnum,

                /**************** order detail --E-- LTT **************/

                /**************** 备品备件 --S-- LTT **************/
                gettedParts: [],
                tableNoData: false,
                sparePartsMod: false,
                sparePartsSelected: [],

                partColumns: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 80,
                        align: 'center'
                    },
                    {
                        title: '备件名称',
                        key: 'partName',
                        align: 'center',
                        render:(h,params) => {
                            return h('p',{
                                domProps:{
                                    title:params.row.partName,
                                },
                                class:'iview_tabDis'
                            },params.row.partName)
                        }
                    },
                    {
                        title: '备件类型',
                        key: 'partType',
                        align: 'center'
                    },
                    {
                        title: '备件、库存单位',
                        key: 'partUnit',
                        align: 'center',
                        render:(h,params) => {
                            return h('p',{
                                domProps:{
                                    title:params.row.partUnit,
                                },
                                class:'iview_tabDis'
                            },params.row.partUnit)
                        }
                    },
                    {
                        title: '备件数量(个)',
                        key: 'partNum',
                        align: 'center',
                        render:(h,params) => {
                            return h('p',{
                                domProps:{
                                    title:params.row.partNum,
                                },
                                class:'iview_tab_numDis'
                            },params.row.partNum)
                        }
                    },
                    {
                        title: '备件单价',
                        key: 'partPrice',
                        align: 'center',
                        render:(h,params) => {
                            return h('p',{
                                domProps:{
                                    title:params.row.partPrice,
                                },
                                class:'iview_tab_numDis'
                            },params.row.partPrice)
                        }
                    },
                    {
                        title: '单价单位',
                        key: 'partPriceUnit',
                        align: 'center',
                        render:(h,params) => {
                            return h('p',{
                                domProps:{
                                    title:params.row.partPriceUnit,
                                },
                                class:'iview_tabDis'
                            },params.row.partPriceUnit)
                        }
                    },
                ],
                partData: [
                    {
                        partName: '机修工',
                        partType: '2017-10-21 09:34',
                        partUnit: '2017-10-21 10:34',
                        partNum: '60',
                        partPrice: '4',
                        partPriceUnit: '包',
                    },
                ],
                //单价单位
                priceUnitList:[],

                /**************** 备品备件 --E-- LTT **************/
                /**************** 执行记录 --S-- LTT **************/
                recordColumns: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 80,
                        align: 'center'
                    },
                    {
                        title: '执行人',
                        key: 'operator',
                        align:'center',
                        render:(h,params) => {
                            return h('p',{
                                domProps:{
                                    title:params.row.operator,
                                },
                                class:'iview_tabDis'
                            },params.row.operator)
                        }
                    },
                    {
                        title: '开始时间',
                        key: 'startTime',
                        align: 'center'
                    },
                    {
                        title: '结束时间',
                        key: 'endTime',
                        align: 'center'
                    },
                    {
                        title: '实际工时（分钟）',
                        key: 'actualTime',
                        align: 'center'
                    },
//                    {
//                        title: '签出时间',
//                        key: 'logout_time',
//                        align: 'center',
//                    },
//                    {
//                        title: '签出原因',
//                        key: 'logout_reason',
//                        align: 'center'
//                    },
                ],
                recordData: [
                    {
                        operator: '机修工',
                        startTime: '2017-10-21 09:34',
                        endTime: '2017-10-21 10:34',
                        actualTime: '60',
                        /*logout_time:'15分钟32秒',
                         logout_reason: '备件申领/备件申领...',*/
                    },
                ],
                /**************** 执行记录 --E-- LTT **************/
                /**************** 编辑管理保存 --S-- LTT **************/




                /**************** 编辑管理保存 --E-- LTT **************/







                //故障描述
                describesDis: [],
                describeMod: false,
                describes: [
                    {id: 0, name: "这是故障描述一这是故障描述一这是故障描述一这是故障描述一"},
                    {id: 1, name: "这是故障描述二这是故障描述二这是故障描述二这是故障描述二"},
                    {id: 2, name: "这是故障描述三这是故障描述三这是故障描述三这是故障描述三"},
                    {id: 3, name: "这是故障描述四这是故障描述四这是故障描述四这是故障描述四"},
                    {id: 4, name: "这是故障描述五这是故障描述五这是故障描述五这是故障描述五"},
                    {id: 5, name: "这是故障描述六这是故障描述六这是故障描述六这是故障描述六"},
                    {id: 6, name: "这是故障描述七这是故障描述七这是故障描述七这是故障描述七"},
                    {id: 7, name: "这是故障描述八这是故障描述八这是故障描述八这是故障描述八"},
                    {id: 8, name: "这是故障描述九这是故障描述九这是故障描述九这是故障描述九"},
                ],
                selectedDesNum: 0,
                describesReview: [],
                //故障描述E
                //故障原因：
                reasonsDis: [],
                reasonMod: false,
                reasons: [
                    {id: 0, name: "这是故障原因一这是故障原因一这是故障原因一这是故障原因一"},
                    {id: 1, name: "这是故障原因二这是故障原因二这是故障原因二这是故障原因二"},
                    {id: 2, name: "这是故障原因三这是故障原因三这是故障原因三这是故障原因三"},
                    {id: 3, name: "这是故障原因四这是故障原因四这是故障原因四这是故障原因四"},
                    {id: 4, name: "这是故障原因五这是故障原因五这是故障原因五这是故障原因五"},
                    {id: 5, name: "这是故障原因六这是故障原因六这是故障原因六这是故障原因六"},
                    {id: 6, name: "这是故障原因七这是故障原因七这是故障原因七这是故障原因七"},
                    {id: 7, name: "这是故障原因八这是故障原因八这是故障原因八这是故障原因八"},
                    {id: 8, name: "这是故障原因九这是故障原因九这是故障原因九这是故障原因九"},
                ],
                selectedResNum: 0,
                reasonsReview: [],
                //故障原因E

                sparePartsForEnough: false,
                sparePartsForLack: false,
                formItem: {
                    sparePartsCode: '',
                    sparePartsTime: '',
                    sparePartsAddr: '',
                    warning: '',
                },
                load_fix_info: '',
                load_fix: false,
            }
        },
        mounted(){
            /** 页面ID初始值获取*/
            let repairsId = this.$route.query.id;
            let flag = this.$route.query.flag;
            this.repairsId = repairsId;
            if(flag == 0){
                this.titleDesc = '查看';
                this.editEnable = true;
                this.detailReload(repairsId);
            } else if( flag == 1){
                this.titleDesc = '编辑';
                this.editEnable = false;
                this.detailReload(repairsId);
            }
            this.priceUnitReady();
        },
        components: {
            'table_multiple': table_multiple
        },
        methods: {
            //单价单位获取
            priceUnitReady(){
                let vm = this;
                this.$axios.get('/eamDo/getMoneyUom').then(function (response) {
                    let res = response.data.response;
                    if (res.code == 1) {
                        vm.priceUnitList =  res.data.rows;
                    } else {
                        vm.$Message.error('读取失败!');
                    }
                }).catch((err) => {
                    console.log(err);
                });
            },
            selectPriceUnit(mess,label){
//                console.log("mess +" + JSON.stringify(mess));
            },
            partEdit(){
                this.titleDesc = '编辑';
                this.editEnable = false;
            },
            //详情加载
            detailReload(repairsId){
                let vm = this;
                this.$axios.post('/eamDo/maintainWorkOrderById',{workOrderId:repairsId}).then(function (response) {
                    let res = response.data.response;
                    let partDataReady = [];
                    let sparePartType = vm.$base_info.tBdSparePartUseTypeEnum;
                    if (res.code == 1) {
                        vm.editWorkForm.status = res.data.status;
                        vm.editWorkForm.orderType = res.data.type;
                        vm.editWorkForm.equipmentName = res.data.equipmentName;
                        vm.editWorkForm.equipmentAddr = res.data.equipmentLocation;
                        vm.editWorkForm.reporterName = res.data.operator;
                        vm.editWorkForm.reporterTime = res.data.reportTime;
                        vm.editWorkForm.handleTime = res.data.responseTime;
                        vm.editWorkForm.faultDesc = res.data.faultDesc;
                        vm.editWorkForm.faultReason = res.data.faultCause;
                        vm.editWorkForm.spareParts = res.data.partApply;
                        vm.sparePartsSelected = [...res.data.partData];
                        for(let i in res.data.partData){
                            for(let j in sparePartType){
                                if(res.data.partData[i].partType == sparePartType[j].code){
                                    res.data.partData[i].partType = sparePartType[j].desc;
                                }
                            }
                        }
                        vm.gettedParts = res.data.partData;
                        vm.partData = res.data.partData;
                        vm.recordData = res.data.fulfilment
                    } else {
                        vm.$Message.error('读取失败!');
                    }
                }).catch((err) => {
                    console.log(err);
                });
            },
            //备品备件
            //删除备件：
            deletePart(item){
                this.gettedParts.splice(item, 1);
                this.sparePartsSelected.splice(item, 1);
            },
            //免维保
            dispatchPart(){
                let vm = this;
                this.$axios.post('/eamDo/getTEamDispatchOrderNote',{tEamDispatchOrderId :vm.repairsId}).then(function (response) {
                    let res = response.data.response;
                    if (res.code == 1) {
                        vm.load_fix = true;
                        setTimeout(function () {
                            vm.$router.push({path: '/fault'});
                        }, 1000);
                    } else {
                        vm.$Message.error('操作失败!');
                    }
                }).catch((err) => {
                    console.log(err);
                });
            },
            //保存
            partSave(){
                let vm = this;
                let spVOS = [];

                for(let i in vm.gettedParts){
                    let item = vm.gettedParts[i];
                    if(item.partPrice==''|| item.partNum =='' ||item.partPriceUnitId == undefined){
                        vm.$Message.error('请填写完整备品备件信息!');
                        return;
                    }else{
                        spVOS.push({
                            "price": item.partPrice,
                            "priceUomId": item.partPriceUnitId,
                            "quantity":item.partNum,
                            "spId": item.part_id,
                        })
                    }
                };
                let saveAry = {
                    "doId": vm.repairsId,
                    "editSpVOS": spVOS,
                    "faultCause": vm.editWorkForm.faultReason
                };
                this.$axios.post('/eamDo/repair/saveEdit',saveAry).then(function (response) {
                    let res = response.data.response;
                    if (res.code == 1) {
                        vm.load_fix = true;
                        setTimeout(function () {
                            vm.$router.push({path: '/fault'});
                        }, 1000);
                    } else {
                        vm.$Message.error('操作失败!');
                    }
                }).catch((err) => {
                    console.log(err);
                });
            },
            //备件申领
            sparePartApply(status){
                if(this.gettedParts.length > 0) {
                    this.$axios.post('/eamDo/maintainSparepartApplicationDetail', {
                        dispatchOrderId: this.repairsId
                    }).then((res) => {
//                        console.log('res === ')
//                        console.log(JSON.stringify(res))
                        if (res.data.response.code == 1) {
                            this.$router.push({path: '/sparePartFor',
                                query: {
                                    'orderId': this.repairsId,
                                    'flag': this.editWorkForm.orderType,
                                    'status': status
                                }
                            });
                        } else {
                            this.$Message.error(res.data.response.msg);
                        }
                    }).catch((err) => {
                        console.log(err);
                    });
                }else {
                    this.$Message.error("请编辑工单，添加备品备件信息！");
                    return;
                }
                /*if(this.gettedParts.length > 0){
                    this.$router.push({path: '/sparePartFor',query: {'orderId': this.repairsId ,'flag':this.editWorkForm.orderType,'status':status }});
                }else {
                    this.$Message.error("请编辑工单，添加备品备件信息！");
                    return;
                }*/
            },


            //故障描述相关---
            toAddDes(){
                this.describesDis = [];
                for (let i = 0; i < this.describesReview.length; i++) {
                    this.describesDis.push(this.describesReview[i]);
                }
                ;
            },
            toSelectItem(selectedItem) {
                this.selectedDesItem = this.describes[selectedItem];
                //首先，未选择时不添加：
                if (this.selectedDesItem != "") {

                    //然后，已选择过的不添加:
                    for (let i = 0; i < this.describesReview.length; i++) {
                        if (this.describesReview[i].id == this.selectedDesItem.id) {
                            return
                        };
                    };

                    //已选择，并且没有被选择过，将会被加入到列表:
                    this.describesReview.push(this.selectedDesItem);
                    this.selectedDesNum = this.describesReview.length;
                };
                setTimeout(function () {
                    document.getElementById('scrollDiv').scrollTop = document.getElementById('scrollDiv').scrollHeight;
                }, 100);

            },
            deleteDesReview(item){
                this.describesReview.splice(item, 1);
                this.selectedDesNum = this.describesReview.length;
            },
            //删除
            toDeleteDes(item){
                this.describesReview.splice(item, 1);
                this.describesDis.splice(item, 1);
                this.selectedDesNum = this.describesReview.length;
            },
            //故障原因
            toSelectReason(selectedItem){
                this.selectedResItem = this.reasons[selectedItem];
                //首先，未选择时不添加：
                if (this.selectedResItem != "") {

                    //然后，已选择过的不添加:
                    for (let i = 0; i < this.reasonsReview.length; i++) {
                        if (this.reasonsReview[i].id == this.selectedResItem.id) {
                            return
                        };
                    };

                    //已选择，并且没有被选择过，将会被加入到列表:
                    this.reasonsReview.push(this.selectedResItem);
                    this.selectedResNum = this.reasonsReview.length;
                };
                setTimeout(function () {
                    document.getElementById('scrollDiv2').scrollTop = document.getElementById('scrollDiv2').scrollHeight;
                }, 100);
            },
            toAddRes(){
                this.reasonsDis = [];
                for (let i = 0; i < this.reasonsReview.length; i++) {
                    this.reasonsDis.push(this.reasonsReview[i]);
                }
                ;
            },
            deleteResReview(item){
                this.reasonsReview.splice(item, 1);
                this.selectedResNum = this.reasonsReview.length;
            },
            //删除
            toDeleteRes(item){
                this.reasonsReview.splice(item, 1);
                this.reasonsDis.splice(item, 1);
                this.selectedResNum = this.reasonsReview.length;
            },
            //备品备件相关：
            spareParts_dataSelectedDisa(messagea){
                this.sparePartsSelected = messagea;
            },
            toAdd_spareParts(){
                this.gettedParts = [];
                for (let i = 0; i < this.sparePartsSelected.length; i++) {
                    this.gettedParts.push(this.$fc.cloneKey(this.sparePartsSelected[i]));
                    this.gettedParts[i].partNum = this.sparePartsSelected[i].partNum ? this.sparePartsSelected[i].partNum : "";
                    this.gettedParts[i].partPriceUnitId = "JOCXLE6JS98GZHVE3CRR";
                };
            },
            //验证是否是正整数
            toTestIsNAN(x, item){
                let re = /^[0-9]*[1-9][0-9]*$/;
                if (re.test(x)) {
                    if (x.length > 4) {
                        this.$Message.error('备品备件数最多为四位数!');
                    }
                } else {
                    this.$Message.error('备品备件数为正整数!');
                };
                this.sparePartsSelected[item].partNum = x;
            },
            toTestIsNANPrice(x, item){
                let re = /^[0-9]*[1-9][0-9]*$/;
                if (re.test(x)) {
                    if (x.length > 9) {
                        this.$Message.error('备件单价最多为九位数!');
                    }
                } else {
                    this.$Message.error('备件单价为正整数!');
                };
                this.sparePartsSelected[item].partPrice = x;
            },



            initTpmss: function (page) {
                let vm = this;
                this.$axios.get('tpmStandardSolution/getAllSolution', {
                    params: {
                        page: page,
//                        bdEquipmentId: bdEquipmentId
                    }
                }).then((res) => {
                    let dataRes = res.data.response.data;
                    vm.tpmssTotal = dataRes.Total;
                    vm.tpmss = new Array();
                    for (let o in dataRes.Rows) {
                        let obj = {};
                        obj["id"] = dataRes.Rows[o]["id"];
                        obj["code"] = dataRes.Rows[o]["code"];
                        obj["name"] = dataRes.Rows[o]["name"];
                        obj["radio"] = "<input type='radio' name='tpmss_radio' value='" + dataRes.Rowsid[o]["id"] + "'>";
                        vm.tpmss.push(obj);
                    }
                }).catch((err) => {
                    console.log(err);
                });
            },
            initData: function () {
                let vm = this;
                this.$axios.get('tmpFault/initData', {
                    params: {
                        id: vm.id,
                        str: vm.str,
                    }
                }).then(function (response) {
                    let data = response.data.response.data;
                    let num = 1;
                    if ("success" == data.flag) {
                        vm.faultSolutionS = data.arr;
                        vm.faultId = data.faultId;
                        vm.editWorkForm.billNo = data.billNo;
                        vm.editWorkForm.status = data.status + "";
                        vm.editWorkForm.equipmentCode = data.equipmentCode;
                        vm.editWorkForm.equipmentName = data.equipmentName;
                        vm.editWorkForm.reportingTime = new Date(data.reportTime);
                        vm.editWorkForm.faultId = data.faultCode;
                        if (data.needShutDown == 0) {
                            vm.editWorkForm.needShutdown = true;
                        } else {
                            vm.editWorkForm.needShutdown = false;
                        }
                        vm.editWorkForm.teamName = data.noticeTeam;
                        vm.editWorkForm.tpmFaultDescId = data.tpmFaultDescId;
                        vm.editWorkForm.faultDescContent = data.faultDescription;
                        vm.editWorkForm.teamId = data.teamId;
                        vm.editWorkForm.equipmentId = data.equipmentId;
                        vm.editWorkForm.faultPositionId = data.positionId;
                        vm.editWorkForm.faultPositionContent = data.positionContent;
                        vm.editWorkForm.faultReasonContent = data.reasonContent;
                        vm.editWorkForm.faultReasonId = data.reasonId;
                        vm.editWorkForm.faultReasonContent = data.reasonContent;
                        if (!!data.cofirmTime) {
                            vm.editWorkForm.confirmTime = new Date(data.cofirmTime);
                        }
                        vm.tpmFaultResolveId = data.tpmFaultResolveId;    //描述id
                        vm.tpmFaultResolve1Id = data.tpmFaultResolve1Id;  //位置id
                        vm.tpmFaultResolve2Id = data.tpmFaultResolve2Id;  //原因id
                    }
                })
            },
            save: function (name) {
                let vm = this;
                let blankTitle = true;
                if ($(".checkTab").find(" input")) {
                    $(".checkTab input").each(function () {
                        if (!$(this).val()) {
                            blankTitle = true;
                        } else {
                            blankTitle = false;
                        }
                    });
                } else {
                    blankTitle = false;
                }
                this.$refs[name].validate((valid) => {
                    if (!valid) {
                        vm.$Message.error('请完善信息!');
                    } else if (blankTitle) {
                        vm.$Message.error('请填写维修方案');
                    } else {
                        if(this.$fc.iSubmit(this))
                            this.$axios.post('tmpFault/save', {
                                str: vm.str,
                                faultId: vm.id,
                                billNo: vm.editWorkForm.billNo,
                                equipmentId: vm.editWorkForm.equipmentId,
                                reportingTime: vm.editWorkForm.reportingTime,
                                needShutDown: vm.editWorkForm.needShutdown,
                                teamId: vm.editWorkForm.teamId,
                                faultDescId: vm.editWorkForm.tpmFaultDescId,
                                faultPositionId: vm.editWorkForm.faultPositionId,
                                faultReasonId: vm.editWorkForm.faultReasonId,
                                confirmTime: vm.editWorkForm.confirmTime,
                                tpmFaultResolveId: vm.tpmFaultResolveId,
                                tpmFaultResolve1Id: vm.tpmFaultResolve1Id,
                                tpmFaultResolve2Id: vm.tpmFaultResolve2Id,
                                faultSolutionS: JSON.stringify(vm.faultSolutionS)

                            }).then(function (response) {
                                let res = response.data.response.code;;
                                if (res == 1) {
                                    vm.load_fix = true;
                                    setTimeout(function () {
                                        vm.$router.push({path: '/fault', query: {"date": new Date()}});
                                    }, 1000);
                                } else {
                                    vm.$Message.error('保存失败!');
                                    vm.iSubmit = false;
                                }
                            }).catch((err) => {
                                vm.iSubmit = false;
                                console.log(err);
                            });
                    }
                })

            },


            //              日历时间判断
            /*checkStartTime: function (sT) {
             let eT = new Date(this.editWorkForm.confirmTime).getTime();
             sT = new Date(sT).getTime()
             if(eT <= sT){
             this.$Message.error('上报时间不能在故障确认时间之后，请重新选择');
             }
             },
             checkEndTime: function (eT) {
             let sT = new Date(this.editWorkForm.reportingTime).getTime();
             eT = new Date(eT).getTime()
             if(eT <= sT){
             this.$Message.error('故障确认时间不能在上报时间之前，请重新选择');
             }
             },*/

            EditFault: function (name) {
                let blankTitle = true;
                if ($(".checkTab").find(" input")) {
                    $(".checkTab input").each(function () {
                        if (!$(this).val()) {
                            blankTitle = true;
                        } else {
                            blankTitle = false;
                        }
                    });
                } else {
                    blankTitle = false;
                }
                this.$refs[name].validate((valid) => {
                    if (!valid) {
                        this.$Message.error('请完善信息!');
                    } else if (blankTitle) {
                        this.$Message.error('请填写维修方案');
                    } else {
//                        this.$Message.error('成功');
                        this.$axios.post('tmpFault/operatorPlanAdd',
                            {
                                billNo: this.editWorkForm.billNo,
                                status: this.editWorkForm.status,
                                equipmentCode: this.editWorkForm.equipmentCode,
                                equipmentName: this.editWorkForm.equipmentName,
                                reportingTime: this.editWorkForm.reportingTime,
                                needShutdown: this.editWorkForm.needShutdown,
                                teamName: this.editWorkForm.teamName,
                                faultDescContent: this.editWorkForm.faultDescContent,
                                faultPositionContent: this.editWorkForm.faultPositionContent,
                                confirmedCauseOfFault: this.editWorkForm.confirmedCauseOfFault,
                                confirmTime: this.editWorkForm.confirmTime,
                            }).then(function (res) {

                        });
                    }
                })

            },

            EditFault2: function (name) {
                this.$refs[name].validate((valid) => {
                    if (!valid) {
                        this.$Message.error('请完善信息!');
                    } else {
                        this.$axios.post('tmpFault/operatorPlanAdd',
                            {
                                faultPositionContent: this.workForm.faultPositionContent,
                                confirmedCauseOfFault: this.workForm.confirmedCauseOfFault,
                                confirmTime: this.workForm.confirmTime,
                            }).then(function (res) {

                        });
                    }
                })

            },


            //获取接口数据demo
            getTableDataDemo(){
                this.$ajax.post('http://192.168.118.249:808/api/user/getList').then((res) => {
                    this.dataDemo = res.data.r;
                }).catch((err) => {
                    console.log(err);
                });
            },
            addTr: function () {
                this.faultSolutionS.push(this.$fc.cloneKey(this.newFaultSolutionS));
                // 添加完newPerson对象后，重置newPerson对象
            },
            del: function (index) {
                // 删一个数组元素
                this.data.splice(index, 1);
            },
            handleSubmit (name) {
                console.log(this.workForm);
                //this.$refs[name].validate((valid) => {
                //if (valid) {
                // this.$Message.success('提交成功!');
                // } else {
                //   this.$Message.error('表单验证失败!');
                // }
                //	 })
            },
            //            班组弹窗的选择
            selectDept: function () {
                let tpmDeptId = this.$jq("input[name='tpmdept_radio']:checked").val();
                let index = this.$fc.arrIndexOfObj("id", tpmDeptId, this.tpmDept);
                if (index !== -1) {
                    let vm = this;
                    this.$axios.get('tpmPlan/sumPlanWorkMinutes', {
                        params: {
                            teamId: tpmDeptId,
                        }
                    }).then((res) => {
                        vm.workForm.noticeTeam = vm.tpmDept[index].name;
                    });
                }
            },

            /*#######################班组 begin#####################*/
            //分页
            changeTeamPage: function (current) {
                this.getTeam(current);
            },

            getTeam: function (current) {
                let vm = this;
                if (current == undefined) {
                    current = 1;
                }
                this.$axios.get('tmpFault/bdTeam', {
                    params: {
                        cur: current,
                        size: vm.teamSize,
                    }
                }).then(function (response) {
                    let array = new Array();
                    if (response.data.response.data.length != 0) {
                        vm.tpmTeamTotal = response.data.response.data[0].teamNum;
                        for (let i in response.data.response.data) {
                            if (i != "unique") {
                                //    for(let i = 0;i<response.data.response.data.Rows.length;i++){
                                let teamId = response.data.response.data[i].teamId;
                                let innerhtml = '<input type="radio" name="teamId" value="' + teamId + '"/>'
                                let teamCode = response.data.response.data[i].teamCode;
                                let teamName = response.data.response.data[i].teamName;

                                let PersonnelRequirement = {
                                    "teamId": teamId,
                                    "innerhtml": innerhtml,
                                    "teamCode": teamCode,
                                    "teamName": teamName,

                                }
                                array.push(PersonnelRequirement);
                            }
                        }
                    } else {
                        vm.tpmTeamTotal = 0;
                    }
                    vm.tpmTeam = array;
                    console.log(vm.tpmTeam)
                })
            },

            selectTeam: function () {
                let vm = this;
                let teamId = $(".PersonnelRequirement").find("input[type='radio']:checked").val();
                let tmp = vm.tpmTeam;
                for (let i in tmp) {
                    if (tmp[i].teamId == teamId) {
                        this.editWorkForm.teamId = tmp[i].teamId;
                        this.editWorkForm.teamName = tmp[i].teamName;
                    }
                }
            },

            /*#######################班组 end#####################*/

            /*#######################故障描述 start#####################*/

            //分页
            changeFaultDescriptionPage: function (current) {
                this.getfaultDescription(current);
            },

            getfaultDescription: function (current) {
                let vm = this;
                let equipmentId = vm.editWorkForm.equipmentId;
                if (equipmentId != null & equipmentId != undefined & equipmentId != '') {
                    if (current == undefined) {
                        current = 1;
                    }
                    this.$axios.get('tmpFault/faultDescription', {
                        params: {
                            cur: current,
                            size: vm.faultDescriptionSize,
                            equipmentId: equipmentId
                        }
                    }).then(function (res) {
                        let array = new Array();
                        if (res.data.response.data.length != 0) {
                            vm.tpmfaultDescriptionTotal = res.data.response.data[0].tpmFaultDescNum;
                            let tmp = res.data.response.data;
                            for (let i in tmp) {
                                if (i != "unique") {
                                    let tpmFaultDescId = tmp[i].tpmFaultDescId;
                                    let innerhtml = '<input type="radio" name="tpmFaultDescId" value="' + tpmFaultDescId + '"/>'
                                    let content = tmp[i].content;
                                    let equipmentId = tmp[i].equipmentId;

                                    let faultDescription = {
                                        "tpmFaultDescId": tpmFaultDescId,
                                        "innerhtml": innerhtml,
                                        "faultDescContent": content,
                                        "equipmentId": equipmentId
                                    }
                                }
                                array.push(faultDescription);
                            }

                        } else {
                            vm.tpmfaultDescriptionTotal = 0;
                        }
                        vm.faultDescriptionList = array;
                    })
                    this.faultDescription = true;
                } else {
                    this.$Message.warning("请选择设备！");
                }
            },

            selectFaultDesc: function () {
                let vm = this;
                let tpmFaultDescId = $(".faultDescriptionS").find("input[type='radio']:checked").val();
                let tmpTfId = vm.editWorkForm.tpmFaultDescId;
                let tmp = vm.faultDescriptionList;
                if (tmpTfId != tpmFaultDescId) {
                    vm.editWorkForm.faultPositionId = '';
                    vm.editWorkForm.faultPositionContent = '';

                    vm.editWorkForm.faultReasonId = '';
                    vm.editWorkForm.faultReasonContent = '';

                    //todo 添加清除方案
                    vm.faultSolutionS = [];
                }
                for (let i in tmp) {
                    if (tmp[i].tpmFaultDescId == tpmFaultDescId) {
                        this.editWorkForm.tpmFaultDescId = tmp[i].tpmFaultDescId;
                        this.editWorkForm.faultDescContent = tmp[i].faultDescContent;
                    }
                }
            },

            /*#######################故障描述 end#####################*/

            /*#######################故障位置 start#####################*/

            //分页
            changeFaultPosition: function (current) {
                this.getFaultPosition(current);
            },

            getFaultPosition: function (current) {
                let vm = this;
                let tpmFaultDescId = vm.editWorkForm.tpmFaultDescId;
                if (tpmFaultDescId != null & tpmFaultDescId != undefined & tpmFaultDescId != '') {
                    if (current == undefined) {
                        current = 1;
                    }
                    this.$axios.get('tmpFault/faultPosition', {
                        params: {
                            cur: current,
                            size: vm.faultPositionSize,
                            tpmFaultDescId: tpmFaultDescId
                        }
                    }).then(function (res) {
                        let array = new Array();
                        if (res.data.response.data.length != 0) {
                            vm.faultPositionTotal = res.data.response.data[0].tpmFaultPositionNum;
                            let tmp = res.data.response.data;
                            for (let i in tmp) {
                                if (i != "unique") {
                                    let faultPositionId = tmp[i].faultPositionId;
                                    let innerhtml = '<input type="radio" name="faultPositionId" value="' + faultPositionId + '"/>'
                                    let content = tmp[i].faultPositionContent;
                                    let tpmFaultDescId = tmp[i].tpmFaultDescId;

                                    let faultPosition = {
                                        "faultPositionId": faultPositionId,
                                        "innerhtml": innerhtml,
                                        "faultPositionContent": content,
                                        "tpmFaultDescId": tpmFaultDescId
                                    }
                                }
                                array.push(faultPosition);
                            }

                        } else {
                            vm.faultPositionTotal = 0;
                        }
                        vm.faultPositionList = array;
                    })
                    this.confirmedFaultPosition = true;
                } else {
                    this.$Message.warning("请选择故障描述！");
                }
            },

            selectFaultPos: function () {
                let vm = this;
                let faultPositionId = $(".faultPositionS").find("input[type='radio']:checked").val();
                let tmpTpId = vm.editWorkForm.faultPositionId;
                if (tmpTpId != faultPositionId) {
                    vm.editWorkForm.faultReasonId = '';
                    vm.editWorkForm.faultReasonContent = '';

                    //todo 添加清除方案
                    vm.faultSolutionS = [];

                }
                let tmp = vm.faultPositionList;
                for (let i in tmp) {
                    if (tmp[i].faultPositionId == faultPositionId) {
                        this.editWorkForm.faultPositionId = tmp[i].faultPositionId;
                        this.editWorkForm.faultPositionContent = tmp[i].faultPositionContent;
                    }
                }
            },

            /*#######################故障位置 end#####################*/

            /*#######################故障原因 start#####################*/

            //分页
            changeFaultReason: function (current) {
                this.getFaultPosition(current);
            },

            getFaultReason: function (current) {
                let vm = this;
                let faultPositionId = vm.editWorkForm.faultPositionId;
                if (faultPositionId != null & faultPositionId != undefined & faultPositionId != '') {
                    if (current == undefined) {
                        current = 1;
                    }
                    this.$axios.get('tmpFault/faultReason', {
                        params: {
                            cur: current,
                            size: vm.faultPositionSize,
                            faultPositionId: faultPositionId
                        }
                    }).then(function (res) {
                        let array = new Array();
                        if (res.data.response.data.length != 0) {
                            vm.faultReasonTotal = res.data.response.data[0].tpmfaultReasonNum;
                            let tmp = res.data.response.data;
                            for (let i in tmp) {
                                if (i != "unique") {
                                    let faultReasonId = tmp[i].faultReasonId;
                                    let innerhtml = '<input type="radio" name="faultReasonId" value="' + faultReasonId + '"/>'
                                    let content = tmp[i].faultReasonContent;
                                    let faultPositionId = tmp[i].faultPositionId;

                                    let faultReason = {
                                        "faultReasonId": faultReasonId,
                                        "innerhtml": innerhtml,
                                        "faultReasonContent": content,
                                        "faultPositionId": faultPositionId
                                    }
                                }
                                array.push(faultReason);
                            }

                        } else {
                            vm.faultReasonTotal = 0;
                        }
                        vm.faultReasonList = array;
                    })
                    this.confirmedCauseOfFault = true;
                } else {
                    this.$Message.warning("请选择故障位置！");
                }
            },

            selectFaultReason: function () {
                let vm = this;
                let faultReasonId = $(".faultReasonS").find("input[type='radio']:checked").val();

                let tmpfrId = vm.editWorkForm.faultReasonId;
                if (tmpfrId != faultReasonId) {
                    //todo 添加清除方案
                    vm.faultSolutionS = [];

                }

                let tmp = vm.faultReasonList;
                for (let i in tmp) {
                    if (tmp[i].faultReasonId == faultReasonId) {
                        this.editWorkForm.faultReasonId = tmp[i].faultReasonId;
                        this.editWorkForm.faultReasonContent = tmp[i].faultReasonContent;
                    }
                }
            },

            /*#######################故障原因 end#####################*/

            /*#######################维修方案 start#####################*/
            getSSolution: function (index) {
                this.tpmStandardSolutionIndex = index;
                this.getFaultSSSolution(1);
            },

            getFaultSSSolution: function (current) {
                let vm = this;
                let faultReasonId = vm.editWorkForm.faultReasonId;
                if (faultReasonId != null & faultReasonId != undefined & faultReasonId != '') {
                    if (current == undefined) {
                        current = 1;
                    }
                    this.$axios.get('tmpFault/getStandardSolution', {
                        params: {
                            cur: current,
                            size: vm.faultSolutionSize,
                            faultReasonId: faultReasonId
                        }
                    }).then(function (res) {
                        if (res.data.response.code != 1) {
                            vm.$Message.error(res.data.response.msg);
                            return;
                        } else {
                            let array = new Array();
                            if (res.data.response.data.length != 0) {
                                vm.faultSolutionTotal = res.data.response.data[0].tpmfaultSolutionNum;
                                let tmp = res.data.response.data;
                                for (let i in tmp) {
                                    if (i != "unique") {
                                        let solutionId = tmp[i].solutionId;
                                        let innerhtml = '<input type="radio" name="solutionId" value="' + solutionId + '"/>'
                                        let solutionCode = tmp[i].solutionCode;
                                        let solutionName = tmp[i].solutionName;

                                        let faultSolution = {
                                            "solutionId": solutionId,
                                            "innerhtml": innerhtml,
                                            "solutionCode": solutionCode,
                                            "solutionName": solutionName
                                        }
                                    }
                                    array.push(faultSolution);
                                }

                            } else {
                                vm.faultSolutionTotal = 0;
                            }
                            vm.faultSolutionList = array;
                        }
                    })

                    this.solution_modal = true;
                } else {
                    this.$Message.warning("请选择故障原因！");
                }
//                console.log("index: "+ this.tpmStandardSolutionIndex);
            },

            selectSolution: function () {
                let solutionId = $(".solutionS").find("input[type='radio']:checked").val();
                //let tpmssId = this.$jq("input[name='tpmss_radio']:checked").val();
                let index = this.$fc.arrIndexOfObj("solutionId", solutionId, this.faultSolutionList);
                if (index !== -1) {
                    let vm = this;
                    this.$axios.get('tmpFault/v/' + vm.faultSolutionList[index].solutionId).then((res) => {

                        let dataRes = res.data.response.data;
                        vm.faultSolutionS[vm.tpmStandardSolutionIndex].ssv = new Array();
                        vm.faultSolutionS[vm.tpmStandardSolutionIndex].solutionId = vm.faultSolutionList[index].solutionId;
                        vm.faultSolutionS[vm.tpmStandardSolutionIndex].solutionCode = vm.faultSolutionList[index].solutionCode;
                        vm.faultSolutionS[vm.tpmStandardSolutionIndex].solutionName = vm.faultSolutionList[index].solutionName;
                        for (let o in dataRes) {
                            let obj = {};
                            obj["versionId"] = dataRes[o]["versionId"];
                            obj["isDefaultVersion"] = dataRes[o]["isDefaultVersion"];
                            obj["version"] = dataRes[o]["version"];
                            obj["needShutdown"] = dataRes[o]["needShutdown"];
                            obj["teamName"] = dataRes[o]["teamName"];
                            vm.faultSolutionS[vm.tpmStandardSolutionIndex].ssv.push(obj);
                        }
                    }).catch((err) => {
                        console.log(err);
                    });
                }
            },


            checkSSVersion: function (index, version, solutionId) {
                this.tpmStandardSolutionRepeat = false;
                let ssv = this.faultSolutionS[index].ssv;
                for (let o in this.faultSolutionS) {
                    if (o != index) {
                        if (this.faultSolutionS[o].solutionId == solutionId
                            && this.faultSolutionS[o].version == version) {
                            this.$Message.warning("版本号重复，请重新选择版本号！");
                            this.tpmStandardSolutionRepeat = true;
//                            this.tpmStandardSolutionInhibitionTmp[index].version = -1;
                            return;
                        }
                    }
                }
                for (let o in ssv) {
                    if (parseInt(ssv[o].version) == parseInt(this.faultSolutionS[index].version)) {
//                        this.getRequiredTime();
                        let tmp = true;
                        if (ssv[o].needShutdown == 0) {
                            tmp = true;
                        } else {
                            tmp = false;
                        }
                        this.faultSolutionS[index].needShutdown = tmp;
                        this.faultSolutionS[index].versionId = ssv[o].versionId;
                        this.faultSolutionS[index].teamName = ssv[o].teamName;
                    }
                }
//                console.log(this.tpmStandardSolutionInhibitionTmp[index].version);
            },

            addTpmStandardSolution: function () {
                for (let o in this.faultSolutionS) {
                    if (this.tpmStandardSolutionRepeat === true) {
                        this.$Message.warning("版本号重复！");
                        return;
                    }
                    if (this.faultSolutionS[o].version == '') {
                        this.$Message.warning("请选择具体方案版本号之后在增加版本！");
                        return;
                    }
                }
                this.faultSolutionS.push(this.$fc.cloneKey(this.newFaultSolutionS));
                // 添加完newPerson对象后，重置newPerson对象
            },

            //删除维修方案
            removeTpmStandardSolution: function (index) {
                let vm = this;
                let faultResolveId = vm.faultSolutionS[index].faultResolveId;
                if (faultResolveId != null & faultResolveId != undefined & faultResolveId != '') {
                    vm.$axios.get('tmpFault/solutionDelete', {
                        params: {
                            faultResolveId: faultResolveId
                        }
                    }).then(function (res) {
                        if (res.data.response.code != 1) {
                            vm.$Message.error(res.data.response.msg);
                            return;
                        } else {
                            let ret = res.data.response.data.ret;
                            if (ret == "success") {
                                vm.$Message.warning("删除成功");
                                vm.tpmStandardSolutionRepeat = false;
                                vm.faultSolutionS.splice(index, 1);
                            } else {
                                vm.$Message.warning("删除失败");
                            }
                        }
                    })
                } else {
                    vm.$Message.warning("删除成功");
                    vm.tpmStandardSolutionRepeat = false;
                    vm.faultSolutionS.splice(index, 1);
                }
            },


            /*#######################维修方案 end#####################*/
        }
    }
</script>

<style>
    .demo-spin-icon-load {
        animation: ani-demo-spin 1s linear infinite;
    }

    @keyframes ani-demo-spin {
        from {
            transform: rotate(0deg);
        }
        50% {
            transform: rotate(180deg);
        }
        to {
            transform: rotate(360deg);
        }
    }

    .demo-spin-col {
        height: 100px;
        position: relative;
        border: 1px solid #eee;
    }
</style>
