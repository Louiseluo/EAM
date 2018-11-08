<template>
    <div class="basic fault-content">
        <!--模块名称-->
        <div class="title">
            <span>维修工单-进行中</span>
        </div>
        <!--表单-->
        <div class="form-content trobleForm">
            <Form ref="maintenanceForm" :model="maintenanceForm" label-position="right" inline :label-width="120">
                <Form-item label="设备名称" prop="deviceName">
                    <Input v-model="maintenanceForm.deviceName" style="width: 160px;"
                           disabled></Input>
                </Form-item>
                <Form-item label="上报人" prop="reportName">
                    <Input v-model="maintenanceForm.reportName" style="width: 160px;"
                           disabled></Input>
                </Form-item>

                <Form-item label="上报时间" prop="reportTime">
                    <Input v-model="maintenanceForm.reportTime" style="width: 160px;"
                           disabled></Input>
                </Form-item>
                <Form-item label="备件申领" prop="partStatus">
                    <Input v-model="maintenanceForm.partStatus" style="width: 160px;"
                           disabled></Input>
                </Form-item>
                <!--<Form-item label="执行岗位" prop="billMan">-->
                <!--<Input v-model="maintenanceForm.billMan" style="width: 160px;"disabled></Input>-->
                <!--</Form-item>-->
                <Form-item label="故障描述" class=" mar-t-2 block">

                    <Input v-model="maintenanceForm.describe" type="textarea" disabled></Input>


                    <!--<Row>-->
                    <!--<Col span="22">-->
                    <!--<div class="personListDiv troubleDis">-->
                    <!--<div class="ivu-tag mar-t-08" v-for="(des,index) in describesDis" :key="des.id">-->
                    <!--<span style="width:150px;text-overflow:ellipsis;  white-space:nowrap; overflow:hidden; ">{{des.name}}</span><i-->
                    <!--class="ivu-icon ivu-icon-ios-close-empty" @click="toDeleteDes(index)"></i>-->
                    <!--<br>-->
                    <!--</div>-->
                    <!--</div>-->
                    <!--</Col>-->
                    <!--<Col span="1" align="center">-->
                    <!--<div class="personAdd pad-t-25">-->
                    <!--<a @click="describeMod = true">-->
                    <!--<Icon type="plus-round" class="font-20"></Icon>-->
                    <!--</a>-->
                    <!--</div>-->
                    <!--</Col>-->
                    <!--</Row>-->
                </Form-item>
                <Form-item label="故障原因" class="mar-t-10 block" style="margin-top:20px;">
                    <Input v-model="maintenanceForm.reason" type="textarea" :maxlength="500" :disabled="!isEdit" @on-change="lengthChange(maintenanceForm.reason,500)"></Input>
                    <!--<Row>-->
                    <!--<Col span="22">-->
                    <!--<div class="personListDiv troubleDis">-->
                    <!--<div class="ivu-tag mar-t-08" v-for="(des,index) in reasonsDis" :key="des.id"-->
                    <!--style="overflow: visible">-->
                    <!--<span style="width:150px;text-overflow:ellipsis;  white-space:nowrap; overflow:hidden; ">{{des.name}}</span><i-->
                    <!--class="ivu-icon ivu-icon-ios-close-empty" @click="toDeleteRes(index)"></i>-->
                    <!--<br>-->
                    <!--</div>-->
                    <!--</div>-->
                    <!--</Col>-->
                    <!--<Col span="1" align="center">-->
                    <!--<div class="personAdd pad-t-25">-->
                    <!--<a @click="reasonMod = true">-->
                    <!--<Icon type="plus-round" class="font-20"></Icon>-->
                    <!--</a>-->
                    <!--</div>-->
                    <!--</Col>-->
                    <!--</Row>-->
                </Form-item>
            </Form>
        </div>

        <!--  kp---备品备件---start-->
        <div class="second-title">备品备件<span class="colorRed">（系统带出的备件不可删除，但是您可以把对应的备件数量修改为0）</span></div>
        <div class="form-content radio_item">
            <table class="table table-bordered table-center table-striped table-blue taDisplay">
                <thead>
                <tr>
                    <th class="wid-5">序号</th>
                    <th>备件名称</th>
                    <th>备件类型</th>
                    <th>备件、库存单位</th>
                    <th>备件数量(个)</th>
                    <th>备件单价</th>
                    <th>单价单位</th>
                    <th>操作</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(equipment, index) in gettedParts" :key="equipment.id" class="trDisplay">
                    <td>{{index + 1}}</td>
                    <td class="tdDisplay pointDis" :title="equipment.partName">{{equipment.partName}}</td>
                    <td class="tdDisplay pointDis" :title="equipment.partType">{{equipment.partType}}</td>
                    <td class="tdDisplay pointDis" :title="equipment.partUnit">{{equipment.partUnit}}</td>
                    <td class="tdDisplay pointDis numberRight"><Input :maxlength="5" v-model="equipment.number" :disabled="!isEdit"
                                                                      @on-change="toTestNum(equipment.number,'备件数量')"></Input>
                    </td>
                    <td class="tdDisplay pointDis numberRight"><Input :maxlength="5" :disabled="!isEdit" v-model="equipment.price" @on-change="toTestNum(equipment.price,'备件单价')"></Input>
                    </td>
                    <td class="selectLeft">
                        <Select v-model="equipment.priceUnit" class="wid-90" :disabled="!isEdit">
                            <Option v-for="item in priceUnits" :value="item.uomId" :key="item.uomId">{{ item.uomName }}
                            </Option>
                        </Select>

                    </td>
                    <td class="mettingManage_oprationItem">
                        <a @click="deletePart(index)" :disabled="equipment.fromSys||!isEdit">删除</a>
                    </td>
                </tr>
                </tbody>
            </table>
            <div class="tableHasNoData" v-show="tableNoData"><p>暂无数据</p></div>
            <Button type="primary" icon="plus-round" class="buttonsDesign " @click="sparePartsMod=true"
                    :disabled="!isEdit">添加
            </Button>
        </div>
        <!--操作按钮-->
        <Row class="btn-group">
            <Col class="pad-15" span="24" align="center">
            <!--<Button type="primary" icon="hammer" size="large">驳回</Button>-->
            <!--<Button type="primary" icon="ios-paper-outline" size="large" @click="checkOut = true">临时签出</Button>-->
            <router-link to='/unMaintain' v-show="!isEdit">
                <Button class="btn-gary" icon="close" size="large">返回</Button>
            </router-link>
            <Button class="btn-gary" icon="close" size="large" @click="toCancel" v-show="isEdit">取消编辑</Button>
            <Button type="primary" icon="compose" size="large" @click="isEdit=true"
                    v-show="(!isEdit)&&(ordetStatus!=3)">
                编辑
            </Button>
            <Button type="primary" class="mar-r-15" icon="document-text" size="large" @click="toSave" v-show="isEdit" :loading="saveLoading">保存草稿
            </Button>
            <Button type="primary" class="mar-r-15" icon="checkmark-round" size="large" @click="toFree"
                    v-if="(ordetStatus==0||ordetStatus==1)&&!isEdit"
                    :loading="freeLoading">免维保
            </Button>
            <router-link :to="{ path: 'sparePartFor', query: {'orderId':orderId, flag:orderType,status:ordetStatus}}">
                <Button type="primary" icon="pricetag" size="large" v-if="ordetStatus==0&&!isEdit">备件申领</Button>
            </router-link>
            <router-link :to="{ path: 'sparePartFor', query: {'orderId':orderId, flag:orderType,status:ordetStatus}}" class="mar-r-15 mar-l-18">
                <Button type="primary" icon="pricetag" size="large" v-if="ordetStatus==1&&!isEdit">备件补领</Button>
            </router-link>
            <Button type="primary" class="mar-r-15" icon="network" size="large" v-if="ordetStatus==0&&!isEdit"
                    @click="toStart" :loading="startLoading">维修开始
            </Button>
            <Button type="primary" icon="checkmark-round" v-if="ordetStatus==1&&!isEdit" size="large" @click="toFinish"
                    :loading="finishLoading">维修完成
            </Button>
            <!--<Button class="mar-l-20" type="primary" icon="compose" size="large" @click="maintainCompleted = true">委外完成</Button>-->
            </Col>
        </Row>
        <!--modal-->
        <!--<Modal v-model="checkOut" title="签出原因">-->
        <!--<Table stripe border :columns="checkOutColumns" :data="checkOutData"></Table>-->
        <!--<div class="mar-t-10" style="overflow: hidden">-->
        <!--<div style="float: right;">-->
        <!--<Page :total="10" size="small" show-elevator :page-size="5"></Page>-->
        <!--</div>-->
        <!--</div>-->
        <!--</Modal>-->
        <!--<Modal v-model="maintainCompleted" title="委外金额">-->
        <!--<p>辛苦了！</p>-->
        <!--<p>感谢您参与此设备的维修，为了方便我司账户做账及后续预算规划，请填写下此次维修的具体费用，谢谢！</p>-->
        <!--<Form ref="maintenanceForm" :model="maintenanceForm" label-position="right" inline :label-width="120">-->
        <!--<Form-item label="委外金额（元）" prop="outsourceSum">-->
        <!--<Input v-model="maintenanceForm.outsourceSum" style="width: 160px;" placeholder=""></Input>-->
        <!--</Form-item>-->
        <!--</Form>-->
        <!--</Modal>-->

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
                    <tr v-for="(des, index) in describes" :key="des.id" class="pointDis"
                        @click="toSelectItem(index)">
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
                    <tr v-for="(des, index) in reasons" :key="des.id" class="pointDis"
                        @click="toSelectReason(index)">
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
                <div id="scrollDiv2" class="personScro">
                    <p>已选数：{{selectedResNum}}</p>
                    <div calss="addPerson_right" v-for="(des, index) in reasonsReview"
                         onmousemove="this.style.background='#EEEEEE';this.style.color='';"
                         onmouseout="this.style.background='#FFFFFF'">
                        <span disabled="true" class="selectedPerson_dis">{{des.name}}</span>
                        <span @click="deleteResReview(index)" class="personRevierDet">
                            <Icon type="ios-close"></Icon></span>
                    </div>
                </div>
                </Col>
            </Row>

        </Modal>
        <!--kp---备品备件多选弹出框：---开始-->
        <Modal v-model="sparePartsMod" title="备品备件列表" @on-ok="toAdd_spareParts" width="1000" :styles="{top: '40px'}">
            <table_multiple @sparePartsSetected="spareParts_dataSelectedDisa"
                            :mod_rightDisplay="sparePartsSelected"></table_multiple>
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
                //故障描述
                orderId: "",
                ordetStatus: "",
                orderType: "",
                numberTip: "",
                priceUnits: [],
                startLoading: false,
                finishLoading: false,
                freeLoading: false,
                saveLoading:false,
                describeMod: false,
                isEdit: false,
                describesDis: [],
                describesReview: [],
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
                //故障原因
                reasonMod: false,
                reasonsDis: [],
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
                /*签出*/
//                checkOut:false,
                checkOutColumns: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 80,
                        align: 'center'
                    },
                    {
                        title: '签出原因',
                        key: 'checkOutReason',
                    }
                ],
                checkOutData: [
                    {
                        checkOutReason: '签出内容1',
                    },
                    {
                        checkOutReason: '签出内容2',
                    },
                    {
                        checkOutReason: '签出内容3',
                    },
                    {
                        checkOutReason: '签出内容4',
                    },
                    {
                        checkOutReason: '签出内容5',
                    },
                    {
                        checkOutReason: '签出内容6',
                    },
                    {
                        checkOutReason: '签出内容7',
                    },
                    {
                        checkOutReason: '签出内容8',
                    },
                    {
                        checkOutReason: '签出内容9',
                    },
                    {
                        checkOutReason: '签出内容10',
                    },
                ],
//                maintainCompleted:false,

                maintenanceForm: {
                    deviceName: "",
                    reportName: "",
                    reportTime: '',
                    partStatus:"",
                    billMan: "",
                    describe: "",
                    reason: "",
                    price: "",
                    priceUnit: "",
                    number: ""
                },
                //备品备件
                gettedParts: [],
                tableNoData: false,
                sparePartsMod: false,
                sparePartsSelected: [],
            }
        },
        components: {
            'table_multiple': table_multiple,
        },
        mounted(){
            this.orderId = this.$route.query.orderId;
            this.getDetail();
            this.priceUnitReady();//读取单价单位
        },
        methods: {
            //kp:

            //输入框文字长度：
            lengthChange(i, len){
                if (i.length >= len) {

                    this.$Message.error('字数不能超过' + len)
                }
            },
            //备件类型转换：
            getUnitText(x){
                let objArr=this.$base_info.tBdSparePartUseTypeEnum;
                for(let obj of objArr){
                    if(x==obj.code){
                        return obj.desc;
                    };
                };
            },

            //详情渲染：
            getDetail(){
                this.$axios.post('/eamDo/maintainWorkOrderById', {workOrderId: this.orderId}).then((res) => {
                    let code = res.data.response.code;
                    if (code === 1) {//保存成功
                        let vt = this;
                        vt.sparePartsSelected=[];
                        vt.gettedParts=[];
                        let data = res.data.response.data;
//                        console.log("查看响应数据=======》");
//                        console.log(data);
                        vt.maintenanceForm.deviceName = data.equipmentName;//设备名
                        vt.maintenanceForm.reportTime = data.reportTime;//上报时间
                        vt.maintenanceForm.reportName = data.operator;//上报人
                        vt.maintenanceForm.describe = data.faultDesc;//故障描述
                        vt.maintenanceForm.reason = data.faultCause;//故障原因
                        vt.maintenanceForm.partStatus=data.partApply;//申领状态
                        vt.orderType = data.type;//工单类型
                        vt.ordetStatus = data.status;//工单状态
                        for (let obj of data.partData){
                            let object={};
                            object.partName=obj.partName;
                            object.number=obj.partNum;
                            object.price=obj.partPrice;
                            object.priceUnit=obj.partPriceUnitId;
                            object.part_id=obj.part_id;
                            object.partType=vt.getUnitText(obj.partType);
                            object.partUnit=obj.partUnit;
                            object.fromSys=true;
                            vt.sparePartsSelected.push(object);
                            vt.gettedParts.push(object);
                        };

                        //备件列表渲染
                    } else {
                        let errorMsg = res.data.response.msg;
                        this.$Message.error(errorMsg);
                    }
                });
            },
            //验证是否是正整数
            toTestNum(x,y){
//                var reg = /^[-+]?\d+$/;

                if ((!isNaN(x)) && (x >=0)) {
                    if (x.length > 5) {
                        this.$Message.error(y+'最多为5个字符');
                        this.numberTip = y+'最多为5个字符';
                        return;
                    }
                    ;
                    this.numberTip = "";
                    return ;
                } else {
                    this.$Message.error(y+'为大于或者等于0的数字');
                    this.numberTip = y+"为大于或者等于0的数字";
                    return ;
                }
                ;
            }
            ,
//维修开始：
            toStart(){
                let vt = this;
                vt.startLoading = true;
                this.$axios.post('/terminal/startExecute', {workId: this.orderId, type: this.orderType}).then((res) => {
                    let code = res.data.response.code;
                    if (code === 1) {//保存成功
                        vt.$Message.success("操作成功");
                        setTimeout(() => {
                            vt.startLoading = false;
                            vt.$router.push({path: '/unMaintain'});
                        }, 1000);
                    } else {
                        let errorMsg = res.data.response.msg;
                        vt.$Message.error(errorMsg);
                        vt.startLoading = false;
                    }
                });
            },

            toFinish(){
                let vt = this;
                vt.finishLoading = true;
                this.$axios.post('/terminal/completeExecute', {
                    workId: this.orderId,
                    type: this.orderType
                }).then((res) => {
                    let code = res.data.response.code;
                    if (code === 1) {//保存成功
                        vt.$Message.success("操作成功");
                        setTimeout(() => {
                            vt.finishLoading = false;
                            vt.$router.push({path: '/unMaintain'});
                        }, 1000);
                    } else {
                        let errorMsg = res.data.response.msg;
                        vt.$Message.error(errorMsg);
                        vt.finishLoading = false;
                    }
                });
            },

            //免维保：
            //免维保
            toFree(){
                let vm = this;
                vm.finishLoading = true;
                this.$axios.post('/eamDo/getTEamDispatchOrderNote', {tEamDispatchOrderId: vm.orderId}).then(function (response) {
                    let res = response.data.response;
                    if (res.code == 1) {
                        setTimeout(function () {
                            vm.finishLoading = false;
                            vm.$router.push({path: '/unMaintain'});
                        }, 1000);
                    } else {
                        vm.finishLoading = false;
                        vm.$Message.error(res.data.response.msg);
                    }
                }).catch((err) => {
                    console.log(err);
                });
            },

            //取消编辑
            toCancel(){
                this.isEdit = false;
                this.getDetail();
            },
            //单价单位：
            priceUnitReady(){
                let vm = this;
                this.$axios.get('/eamDo/getMoneyUom').then(function (response) {
                    let res = response.data.response;
//                    console.log("vm.priceUnits=================>");
//                    console.log(res);
                    if (res.code == 1) {
                        vm.priceUnits = res.data.rows;
//                        alert(vm.equipment.priceUnit);
                    } else {
                        vm.$Message.error('单价单位读取失败!');
                    }
                }).catch((err) => {
                    console.log(err);
                });
            },

            //保存草稿：
            toSave(){
                let vt=this;
                let objArr=[];
                vt.saveLoading=true;
                for (let obj of vt.gettedParts){
                    let object={};
                    if(!obj.number){
                        this.$Message.error("备件数量不能为空");
                        vt.saveLoading=false;
                        return;
                    };
                    if(!obj.price){
                        this.$Message.error("备件单价不能为空");
                        vt.saveLoading=false;
                        return;
                    }
                   vt.toTestNum(obj.number,"备件数量");
                   vt.toTestNum(obj.price,"备件单价");
                    if(vt.numberTip){
                        this.$Message.error(vt.numberTip);
                        vt.saveLoading=false;
                        return;
                    };
                    object.quantity=obj.number;
                    object.price=obj.price;
                    object.spId=obj.part_id;
                    object.priceUomId=obj.priceUnit;
                    objArr.push(object);
                };
//                console.log("查看编辑保存的数据信息========》");
//                console.log(objArr);
                this.$axios.post('/eamDo/repair/saveEdit',{doId:vt.orderId,editSpVOS:objArr,faultCause:vt.maintenanceForm.reason}).then(function (response) {
                    let res = response.data.response;
//                    console.log("查看响应文件=====》");
//                    console.log( response);
                    if (res.code == 1) {
                        vt.saveLoading=false;
                        vt.isEdit = false;
                        setTimeout(function () {
                            vt.$router.push({path: '/unMaintain'});
                        }, 1000);
                    } else {
                        vm.$Message.error('操作失败!');
                    }
                }).catch((err) => {
                    console.log(err);
                });
            },


            //删除
            toDeleteDes(item){
                this.describesReview.splice(item, 1);
                this.describesDis.splice(item, 1);
                this.selectedDesNum = this.describesReview.length;
            },
            //故障描述相关---
            toAddDes(){
                this.describesDis = [];
//                console.log('确定添加');
                for (var i = 0; i < this.describesReview.length; i++) {
                    this.describesDis.push(this.describesReview[i]);
                }
                ;
            },
            toSelectItem(selectedItem) {
                this.selectedDesItem = this.describes[selectedItem];
                //首先，未选择时不添加：
                if (this.selectedDesItem != "") {

                    //然后，已选择过的不添加:
                    for (var i = 0; i < this.describesReview.length; i++) {
                        if (this.describesReview[i].id == this.selectedDesItem.id) {
                            return
                        }
                        ;
                    }
                    ;

                    //已选择，并且没有被选择过，将会被加入到列表:
                    this.describesReview.push(this.selectedDesItem);
                    this.selectedDesNum = this.describesReview.length;
                }
                ;
                setTimeout(function () {
                    document.getElementById('scrollDiv').scrollTop = document.getElementById('scrollDiv').scrollHeight;
                }, 100);
            },
            deleteDesReview(item){
                this.describesReview.splice(item, 1);
                this.selectedDesNum = this.describesReview.length;
            },
            //故障原因：
            toSelectReason(selectedItem){
                this.selectedResItem = this.reasons[selectedItem];
                //首先，未选择时不添加：
                if (this.selectedResItem != "") {

                    //然后，已选择过的不添加:
                    for (var i = 0; i < this.reasonsReview.length; i++) {
                        if (this.reasonsReview[i].id == this.selectedResItem.id) {
                            return
                        }
                        ;
                    }
                    ;

                    //已选择，并且没有被选择过，将会被加入到列表:
                    this.reasonsReview.push(this.selectedResItem);
                    this.selectedResNum = this.reasonsReview.length;
                }
                ;
                setTimeout(function () {
                    document.getElementById('scrollDiv2').scrollTop = document.getElementById('scrollDiv2').scrollHeight;
                }, 100);
            },
            toAddRes(){
                this.reasonsDis = [];
                for (var i = 0; i < this.reasonsReview.length; i++) {
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
                for (var i = 0; i < this.sparePartsSelected.length; i++) {
                    this.gettedParts.push(this.$fc.cloneKey(this.sparePartsSelected[i]));
                    this.gettedParts[i].number = this.sparePartsSelected[i].number ? this.sparePartsSelected[i].number : "";
                    this.gettedParts[i].price = this.sparePartsSelected[i].price ? this.sparePartsSelected[i].price : "";
                    this.gettedParts[i].priceUnit = this.sparePartsSelected[i].priceUnit ? this.sparePartsSelected[i].priceUnit:this.priceUnits[0].uomId;
                }
                ;
//                            console.log("保存的数据");
//                            console.log(this.spareParts_display);
            },
            //验证是否是正整数
            toTestIsNAN(x, item){
                var re = /^[0-9]*[1-9][0-9]*$/;
                if (re.test(x)) {
                    if (x.length > 4) {
                        this.$Message.error('备品备件数最多为四位数!');
                    }
                }
                else {
                    this.$Message.error('备品备件数为正整数!');
                }
                ;
                this.sparePartsSelected[item].number = x;
            },
            //删除备件：
            deletePart(item){
                this.gettedParts.splice(item, 1);
                this.sparePartsSelected.splice(item, 1);
            },
        }
    }
</script>
