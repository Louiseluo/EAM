<template>
    <div class="basic fault-content">
        <!--模块名称-->
        <div class="title">
            <span>维修工单-执行</span>
        </div>
        <!--表单-->
        <div class="form-content trobleForm">
            <Form ref="maintenanceForm" :model="maintenanceForm" label-position="right" inline :label-width="120">
                <Form-item label="设备名称" prop="deviceName">
                    <Input v-model="maintenanceForm.deviceName" style="width: 160px;" placeholder="设备001（权重1）"
                           disabled></Input>
                </Form-item>
                <Form-item label="上报人" prop="reportName">
                    <Input v-model="maintenanceForm.reportName" style="width: 160px;" placeholder="操作工001"
                           disabled></Input>
                </Form-item>
                <Form-item label="上报时间" prop="reportTime">
                    <Input v-model="maintenanceForm.reportTime" style="width: 160px;" placeholder="2017-02-12 16:45"
                           disabled></Input>
                </Form-item>

                <Form-item label="执行岗位" prop="billMan">
                    <Input v-model="maintenanceForm.billMan" style="width: 160px;" placeholder="机修工" disabled></Input>
                </Form-item>

                <FormItem label="故障描述" class=" mar-t-2 block">
                    <Row>
                        <Col span="22">
                        <div class="personListDiv troubleDis">
                            <div class="ivu-tag mar-t-08" v-for="(des,index) in describesDis" :key="des.id">
                                    <span  style="width:150px;text-overflow:ellipsis;  white-space:nowrap; overflow:hidden; ">{{des.name}}</span><i
                                        class="ivu-icon ivu-icon-ios-close-empty" @click="toDeleteDes(index)"></i>
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
                <!-- kp----故障原因--end-->
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
                </FormItem>
                <!-- kp----故障原因--end-->
            </Form>
        </div>

        <!--  kp---备品备件---start-->
        <div class="second-title">备品备件</div>
        <div class="form-content radio_item">
            <table class="table table-bordered table-center table-striped table-blue taDisplay">
                <thead>
                <tr>
                    <th>序号</th>
                    <th>备件名称</th>
                    <th>备件类型</th>
                    <th>备件、库存单位</th>
                    <th style="text-align:center">备件数量(个)</th>
                    <th>操作</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(equipment, index) in gettedParts" :key="equipment.id" class="trDisplay">
                    <td>{{index + 1}}</td>
                    <td class="tdDisplay pointDis" :title="equipment.parts_name">{{equipment.parts_name}}</td>
                    <td class="tdDisplay pointDis" :title="equipment.parts_type">{{equipment.parts_type}}</td>
                    <td class="tdDisplay pointDis" :title="equipment.parts_unit">{{equipment.parts_unit}}</td>
                    <td class="wid-10">
                        <Input class="center" v-model=gettedParts.number
                               style="width: 100px;margin-top: 5px;margin-bottom: 5px;"
                               @on-change="toTestIsNAN(gettedParts.number,index)"></Input>
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

        <!-- kp---备品备件---end-->
        <!--操作按钮-->
        <Row class="btn-group">
            <Col class="pad-15" span="24" align="center">
            <router-link to='/inmaintain' class="mar-l-20">
                <Button type="primary" icon="ios-pricetags" size="large">维修开始</Button>
            </router-link>
            <!--<Button class="mar-l-20" type="primary" icon="hammer" size="large" @click="rejects = true">驳回</Button>-->
            <router-link to="/sparePartFor">
                <Button type="primary" icon="card" size="large" class="mar-l-20">备件申领</Button>
            </router-link>
            </Col>
        </Row>
        <!--modal-->
        <!--<Modal v-model="rejects" title="驳回原因">-->
            <!--<Table stripe border :columns="rejectColumns" :data="rejectData"></Table>-->
            <!--<div class="mar-t-10" style="overflow: hidden">-->
                <!--<div style="float: right;">-->
                    <!--<Page :total="10" size="small" show-elevator :page-size="5"></Page>-->
                <!--</div>-->
            <!--</div>-->
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
        <!--//kp----故障描述弹出框---end-->
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
        <!--//kp----故障原因弹出框---end-->
        <!--kp---备品备件多选弹出框：---开始-->
        <Modal v-model="sparePartsMod" title="备品备件列表" @on-ok="toAdd_spareParts" width="1000" :styles="{top: '40px'}">
            <table_multiple @sparePartsSetected="spareParts_dataSelectedDisa"
                            :mod_rightDisplay="sparePartsSelected"></table_multiple>
        </Modal>
        <!--kp---备品备件多选弹出框：---结束-->
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

                //kp---变量定义---start

                //故障描述：
                describeMod: false,
                describesDis: [],
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
                describesReview: [],
                selectedDesItem: "",
                selectedDesNum: 0,

                //故障原因：
                reasonMod:false,
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
                reasonsReview: [],
                selectedResItem: "",
                selectedResNum: 0,
                //备品备件
                sparePartsMod: false,
                tableNoData: false,
                gettedParts: [],
                sparePartsSelected: [],
                spareParts_display: [],
                //kp---变量定义---end

                //备品备件
//                rejects: false,
                rejectColumns: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 80,
                        align: 'center'
                    },
                    {
                        title: '驳回内容',
                        key: 'rejectReason',
                    }
                ],
                rejectData: [
                    {
                        rejectReason: '驳回内容1',
                    },
                    {
                        rejectReason: '驳回内容2',
                    },
                    {
                        rejectReason: '驳回内容3',
                    },
                    {
                        rejectReason: '驳回内容4',
                    },
                    {
                        rejectReason: '驳回内容5',
                    },
                ],
                maintainCompleted: false,

                maintenanceForm: {
                    deviceName: "",
                    reportName: "",
                    reportTime: '',
                    billMan: "",
                },
                //备品备件
                spareSelected: [],
            }
        },
        components: {
            'table_multiple': table_multiple,// kp--
        },
        methods: {
            //kp---方法定义---start
            //故障描述相关---
            toAddDes(){
                this.describesDis = [];
                console.log('确定添加');
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

            //删除
            toDeleteDes(item){
                this.describesReview.splice(item, 1);
                this.describesDis.splice(item, 1);
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

            //kp---方法定义---end

            spare_dataSelectedDisa(message) {
                this.spareSelected = message;
            }
        },
    }
</script>
