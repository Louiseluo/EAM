<template>
    <div class="basic fault-content">
        <!--模块名称-->
        <div class="title">
            <span>人员管理</span>
        </div>
        <!--<div class="titleListManage">
            <ul class="tabUL">
                <li>
                    <router-link to='/systemManage'>报警升级</router-link>
                </li>
                <li>
                    <router-link to='/auditShunt'>审核分流</router-link>
                </li>
                <li class="active">
                    <a>生产排班</a>
                </li>
            </ul>
        </div>-->
        <div class="second-title" v-show="type == 2">维修班次</div>
        <div class="form-content" v-show="type == 2">
            <div class="table-reset">
                <table class="table table-bordered table-center table-striped table-blue table-edit">
                    <thead>
                    <tr>
                        <th width="80">序号</th>
                        <th width="300">班次名称</th>
                        <th width="300">时段</th>
                        <th>备注</th>
                        <th width="150">操作</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(proSchedule,index) in proScheduleTableArr">
                        <td>{{index + 1}}</td>
                        <td>
                            <Input class="tests" v-model="proSchedule.tEamShiftScheduleName" :maxlength="20" @on-change="lengthChange(proSchedule.tEamShiftScheduleName,20)" style="width: 100%;" :disabled="!toEdit0"></Input>
                        </td>
                        <!--<td>{{proSchedule.period}}</td>-->
                        <td>
                            <Row>
                                <Col span="11">
                                    <TimePicker class="tests" format="HH:mm:ss" placeholder="" v-model="proSchedule.tEamShiftScheduleBeginTime" :disabled="!toEdit0"></TimePicker>
                                </Col>
                                <Col span="2" style="text-align: center">~</Col>
                                <Col span="11">
                                    <TimePicker class="tests" format="HH:mm:ss" placeholder="" v-model="proSchedule.tEamShiftScheduleEndTime" :disabled="!toEdit0"></TimePicker>
                                </Col>
                            </Row>
                        </td>
                        <td>
                            <Input class="tests" v-model="proSchedule.tEamShiftScheduleNote" :maxlength="200" @on-change="lengthChange(proSchedule.tEamShiftScheduleNote,200)" style="width: 100%;" :disabled="!toEdit0"></Input>
                        </td>
                        <td>
                            <!--<a>修改</a>-->
                            <a @click="deleteClasses(proSchedule.tEamShiftScheduleId,index)" :disabled="!toEdit0">删除</a>
                        </td>
                    </tr>
                    </tbody>
                </table>
                <div class="mar-t-10">
                    <Button type="primary" icon="plus-round" size="small" @click="addProSchedule" :disabled="!toEdit0">添加</Button>
                    <div class="f_r">
                        <Button v-if="if_maintenance_edit" v-show="!toEdit0" type="primary" icon="document-text" size="small" @click="toEdit0=true">编辑</Button>
                        <Button v-if="if_maintenance_back" v-show="toEdit0" type="primary" icon="reply" size="small" @click="toEdit0=false,classesList()">取消</Button>
                        <Button v-if="if_maintenance_save" v-show="toEdit0" type="primary" icon="checkmark-round" size="small" :loading="loading0" @click="submit">保存</Button>
                    </div>
                </div>
            </div>
        </div>
        <div class="second-title"  v-show="type == 1">人员分组</div>
        <div class="form-content"  v-show="type == 1">
            <div class="table-reset">
                <table class="table table-bordered table-center table-striped table-blue table-edit" >
                    <thead>
                    <tr>
                        <th width="80">序号</th>
                        <th width="300">班组名称</th>
                        <th width="300">职责区域</th>
                        <!--<th>成员</th>-->
                        <th>备注</th>
                        <th width="150">操作</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(teamDivision,index) in teamDivisionTableArr" :key="teamDivision.personId">
                        <td>{{index + 1}}</td>
                        <td>
                            <Input  class="tests1" v-model="teamDivision.personName" :maxlength="20" @on-change="lengthChange(teamDivision.personName,20)" style="width: 100%;" :disabled="!toEdit1"></Input>
                        </td>
                        <td>
                            <div class="input-search pointDis">
                                <Input class="tests1" style="width: 100%" v-model="teamDivision.locationName" :disabled="!toEdit1" readonly ></Input>
                                <Button icon="ios-search" @click="dutyClick(index)" :disabled="!toEdit1"></Button>
                            </div>
                        </td>
                        <td>
                            <Input  class="tests1" v-model="teamDivision.note" :maxlength="200" @on-change="lengthChange(teamDivision.note,200)" style="width: 100%;" :disabled="!toEdit1"></Input>
                        </td>
                        <td>
                            <!--<a>修改</a>-->
                            <a @click="teamDivisionDel(teamDivision.personId,index)" :disabled="!toEdit1">删除</a>
                        </td>
                    </tr>
                    </tbody>
                </table>
                <div class="mar-t-10">
                    <Button type="primary" icon="plus-round" size="small" @click="addTeamDivision" :disabled="!toEdit1">添加</Button>
                    <div class="f_r">
                        <Button v-if="if_team_edit" v-show="!toEdit1" type="primary" icon="document-text" size="small" @click="toEdit1=true">编辑</Button>
                        <Button v-if="if_team_back" v-show="toEdit1" type="primary" icon="reply" size="small" @click="toEdit1=false,teamDivisionList();">取消</Button>
                        <Button v-if="if_team_save" v-show="toEdit1" type="primary" icon="checkmark-round" size="small" :loading="loading1" @click="submit1">保存</Button>
                    </div>
                </div>
            </div>
        </div>
        <div class="second-title" v-show="type == 3">区域分工</div>
        <div class="form-content" v-show="type == 3">
            <div class="table-reset" style="margin-bottom: 30px;">
                <table class="table table-bordered table-center table-striped table-blue table-edit">
                    <thead>
                    <tr>
                        <th width="80">序号</th>
                        <th width="300">人员名称</th>
                        <th width="300">班组名称</th>
                        <th>班次名称</th>
                        <th width="150">操作</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(item,index) in personsArr">
                        <td>{{index + 1}}</td>
                        <td>
                            <div class="input-search pointDis">
                                <Input class="tests2" v-model="item.personName" style="width: 100%" :disabled="!toEdit2" readonly></Input>
                                <Button icon="ios-search" @click="toOpenPerson(index)" :disabled="!toEdit2"></Button>
                            </div>
                        </td>
                        <td>
                            <div class="input-search pointDis">
                                <Input class="tests2" v-model="item.teamName" style="width: 100%" :disabled="!toEdit2" readonly></Input>
                                <Button icon="ios-search" @click="openteamMod(index)" :disabled="!toEdit2"></Button>
                            </div>
                        </td>
                        <td>
                            <div class="input-search pointDis">
                                <Input class="tests2" v-model="item.shiftName" style="width: 100%" :disabled="!toEdit2" readonly></Input>
                                <Button icon="ios-search" @click="openclassessMod(index)" :disabled="!toEdit2"></Button>
                            </div>
                        </td>
                        <td>
                            <a @click="personDel(index)" :disabled="!toEdit2">删除</a>
                        </td>
                    </tr>
                    </tbody>
                </table>
                <div class="mar-t-10">
                    <Button type="primary" icon="plus-round" size="small" @click="addPerson" :disabled="!toEdit2">添加</Button>
                    <div class="f_r">
                        <Button v-if="if_labor_edit" v-show="!toEdit2" type="primary" icon="document-text" size="small" @click="toEdit2=true">编辑</Button>
                        <Button v-if="if_labor_back" v-show="toEdit2" type="primary" icon="reply" size="small" @click="toEdit2=false,personInforList();">取消</Button>
                        <Button v-if="if_labor_save" v-show="toEdit2" type="primary" icon="checkmark-round" size="small" :loading="loading2" @click="submit2">保存</Button>
                    </div>
                </div>
            </div>
        </div>
        <Row class="btn-group">
            <Col class="pad-15" span="24" align="center">
            <!--<Button type="primary" size="large">取消</Button>-->
            <!--<Button type="primary" size="large">保存</Button>-->
            </Col>
        </Row>
        <!--职责区域放大镜-->
        <Modal v-model="dutyMod" width="700" title="职责区域选择" @on-cancel="" @on-ok="okDuty">
            <!--<div>-->
                <Row class="addPersonRow">
                    <Col :span="12" class="pad-r-10">
                    <Tree :data="dutyData" show-checkbox :multiple="false" :show-checkbox="false" @on-select-change="leftSelected" class="max-h-300"></Tree>
                    </Col>
                    <Col :span="12" class="pad-l-10">
                    <div id="scrollDiv" class="personScro">
                        <p style="color:#393737">已选择：{{selectedDuty.length}}</p>
                        <div class="addPerson_right mar-top-1" v-for="(item, index) in selectedDuty"
                             onmousemove="this.style.background='#EEEEEE';this.style.color='';"
                             onmouseout="this.style.background='#FFFFFF'">
                            <span :disabled="true" class="selectedPerson_dis">{{item.title}}</span>
                            <span @click="deleteItemReview(index)" class="personRevierDet"><Icon type="ios-close"></Icon></span>
                        </div>
                    </div>
                    </Col>
                </Row>
            <!--</div>-->
        </Modal>
        <Modal v-model="person_mod" width="1100" title="人员选择" @on-ok="toSelectPerson">
            <personSelect @typeSelected="hasSelected_person" :rightDisplay="personSelected"></personSelect>
        </Modal>
        <Modal v-model="classessMod" title="班次选择"  width="600" @on-ok="toSelectSchedule">
            <div class="table-reset">
                <table class="table table-bordered table-center table-striped table-blue table-edit typedevice typeTable taDisplay">
                    <thead>
                    <tr>
                        <!--<th width="150">选择</th>-->
                        <th width="200">序号</th>
                        <th>班次名称</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(item,index) in proScheduleSelected" class="trDisplay trBg" @click="clickProSchedule(index)">
                        <!--<td><input type="radio" name='checked_radio' class="checkInput_problem" ></td>-->
                        <td>{{index + 1}}</td>
                        <td class="tdDisplay pointDis" :title="item.tEamShiftScheduleName">{{item.tEamShiftScheduleName}}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div class="mar-t-10" style="overflow: hidden">
                <!--<div style="float: right;">-->
                    <!--<Page size="small" :total="" show-elevator :page-size="5" :current="" @on-change=""></Page>-->
                <!--</div>-->
            </div>
        </Modal>
        <Modal v-model="teamMod" title="班组选择"  width="600" @on-ok="toSelectTeam">
            <div class="table-reset">
                <table class="table table-bordered table-center table-striped table-blue table-edit typedevice typeTable taDisplay">
                    <thead>
                    <tr>
                        <!--<th width="150">选择</th>-->
                        <th width="200">序号</th>
                        <th>班组名称</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(item,index) in teamDivisionSelected" class="trDisplay trBg0" @click="clickTeam(index)">
                        <!--<td><input type="radio" name='checked_radio' class="checkInput_problem" ></td>-->
                        <td>{{index + 1}}</td>
                        <td class="tdDisplay pointDis" :title="item.personName">{{item.personName}}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div class="mar-t-10" style="overflow: hidden">
                <!--<div style="float: right;">-->
                <!--<Page size="small" :total="" show-elevator :page-size="5" :current="" @on-change=""></Page>-->
                <!--</div>-->
            </div>
        </Modal>
    </div>
</template>
<script type="text/ecmascript-6">
    import topItem from './systemManage.vue';
    import personSelect from "../treeMulitiple/personSelect.vue";
    export default {
        data(){
            return {
                //权限校验
                if_team_edit: this.$rt(this.authJson.EAM.人员管理.人员分组列表页.编辑),
                if_team_back: this.$rt(this.authJson.EAM.人员管理.人员分组编辑页.取消),
                if_team_save: this.$rt(this.authJson.EAM.人员管理.人员分组编辑页.保存),
                if_maintenance_edit: this.$rt(this.authJson.EAM.人员管理.维修班次列表页.编辑),
                if_maintenance_back: this.$rt(this.authJson.EAM.人员管理.维修班次编辑页.取消),
                if_maintenance_save: this.$rt(this.authJson.EAM.人员管理.维修班次编辑页.保存),
                if_labor_edit: this.$rt(this.authJson.EAM.人员管理.区域分工列表页.编辑),
                if_labor_back: this.$rt(this.authJson.EAM.人员管理.区域分工编辑页.取消),
                if_labor_save: this.$rt(this.authJson.EAM.人员管理.区域分工编辑页.保存),
                /*区分显示那个部分*/
                type:"",
                /*区分显示那个部分*/
                toEdit0: false,
                toEdit1: false,
                toEdit2: false,
                loading0: false,
                loading1: false,
                loading2: false,
                dutyMod: false,
                person_mod: false,
                classessMod: false,
                teamMod:false,
                dutyData:[],
                dutyIndex: 0,
                selectedDuty:[],
                selectedDutySure:[],
                columnsDuty:[
                    {
                        title:'序号',
                        type: 'index'
                    },
                ],
                proScheduleTableArr: [
//                    {
//                        "index": 1,
//                        "tEamShiftScheduleId": "JQI6A7KC1CLLLL29EA3M",
//                        "tEamShiftScheduleName": "晚饭",
//                        "tEamShiftScheduleBeginTime": "55555   ",
//                        "tEamShiftScheduleEndTime": "66666   ",
//                        "tEamShiftScheduleNote": "晚饭吃面条"
//                    },
                ],
                proScheduleSelected:[],
                teamDivisionTableArr: [],
                teamDivisionSelected:[],
                isSubmit0 : true,
                isSubmit1 : true,
                isSubmit2 : true,
                time_unit01: '1',
                time_unit02: '2',
                timeUnits: [
                    {
                        code: '1',
                        desc: '分钟'
                    },
                    {
                        code: '2',
                        desc: '小时'
                    },
                    {
                        code: '3',
                        desc: '天'
                    }
                ],
                personsArr:[
//                    {
//                        "teamId": "JQIUQJR87MJPLN4G6VK9",
//                        "teamName": "名字",
//                        "shiftId": "JQISEIFXQQ6NW5VKQY3H",
//                        "shiftName": "中饭",
//                        "personName": "伍子擎、熊峰、周何阳、舒万富、",
//                        "personId": "JPGY2B5RW06VF2YYH6U3,JPNDDYZ09HYBADAZGWT1,JPNDDYZ0U6CPAJA7T6HO,JPQTEZP4FNLI0B59E51G,"
//                    },
                ],
                personSelected: '',
                surePersonSelected: '',
                selectedSchedule: '',
                sureSelectedSchedule: '',
                schIndex: '',
                selectedTeamDivision:'',
                sureSelectedTeamDivision: '',
                teamIndex: '',
                personIndex: '',
            }
        },
        components: {
            'v-topItem': topItem,
            'personSelect':personSelect,
        },
        mounted(){
            this.type = this.$route.query.type;
            this.classesList();
            this.teamDivisionList();
            this.personInforList();
        },
        watch: {
            '$route' (to, from) {
                this.type = to.query.type;
                this.classesList();
                this.teamDivisionList();
                this.personInforList();
            }
        },
        methods: {
            //输入框文字长度：
            lengthChange(i, len){
                if (i.length >= len) {
                    this.$Message.error('字数不能超过' + len)
                }
            },
            //职责区域选择 start
            dutyClick(index){
                this.dutyIndex = index;
                this.dutyMod = true;
                this.dutyArea();
                this.selectedDuty =[];
                if(this.teamDivisionTableArr[index].locationName!=''&&this.teamDivisionTableArr[index].locationName){
                    let siteName = this.teamDivisionTableArr[index].locationName.split('/');
                    let siteId = this.teamDivisionTableArr[index].locationId.split(',');
                    for(var i in siteName){
                        this.selectedDuty.push({
                            title: siteName[i],
                            id: siteId[i]
                        })
                    }
                }
            },
            dutyArea(){
                this.$axios.get("/common/location/locationNameTree").then((res) => {
                    var res = res.data.response;
//                    console.log(res)
//                    console.log('职责区域放大镜数据')
                    if(res.code == 1){
                        this.dutyData = res.data;

                    }else {
                        this.$Message.error(res.msg);
                    }
                }).catch((err) => {
                    console.log(err);
                });
            },
            leftSelected(data){
                if (JSON.stringify(data) == "[]") {
                    return
                }
                for (var i = 0; i < this.selectedDuty.length; i++) {
                    if (data[0].id == this.selectedDuty[i].id) {
                        return;
                    }
                }
                this.selectedDuty.push(data[0])
            },
            okDuty(){
//                console.log(this.dutyIndex)
                this.selectedDutySure = this.selectedDuty;
                this.teamDivisionTableArr[this.dutyIndex].locationName = this.selectedDutySure[0].title;
                this.teamDivisionTableArr[this.dutyIndex].locationId = this.selectedDutySure[0].id;
                for(var i=1;i<this.selectedDutySure.length;i++){
                    this.teamDivisionTableArr[this.dutyIndex].locationName += '/' + this.selectedDutySure[i].title
                    this.teamDivisionTableArr[this.dutyIndex].locationId += ',' + this.selectedDutySure[i].id
                }
            },
            deleteItemReview(index){
                this.selectedDuty.splice(index,1)
            },
            //end
            //班次列表
            classesList(){
                this.$axios.get("/System/shiftScheduleTable").then((res) => {
                    var res = res.data.response;
                    if(res.code == 1){
                        this.proScheduleTableArr = res.data.Rows;
                        this.proScheduleSelected = res.data.Rows;

                    }else {
                        this.$Message.error(res.msg);
                    }
                }).catch((err) => {
                    console.log(err);
                });
            },
            toSave0(){
                console.log(this.submit())
//                loading0=true;
//                this.classesSave()
            },
            submit(){
                //校验不能为空的值
                let vt = this;
                vt.isSubmit0 = true;
                $('.tests').each(function () {
                    var vals = $(this).find('.ivu-input').val();
                    if(vals===''){
                        $(this).addClass('ivu-form-item-error');
                        vt.$Message.error('请完善信息');
                        vt.isSubmit0 = false;
                    }
                    else{
                        $(this).removeClass('ivu-form-item-error');
                    }
                });
                if(this.isSubmit0){
                    this.loading0 = true;
                    this.classesSave();
                }
                console.log(this.isSubmit0)
            },
            //班次列表保存
            classesSave(){
                var shiftScheduleVoList = [];
                for(var i in this.proScheduleTableArr){
                    shiftScheduleVoList.push({
                        beginTime: this.proScheduleTableArr[i].tEamShiftScheduleBeginTime,
//                        beginTime: this.$fc.dateFormat(this.proScheduleTableArr[i].tEamShiftScheduleBeginTime,'HH:mm:ss'),
                        endTime: this.proScheduleTableArr[i].tEamShiftScheduleEndTime,
//                        endTime: this.$fc.dateFormat(this.proScheduleTableArr[i].tEamShiftScheduleEndTime,'HH:mm:ss'),
                        name: this.proScheduleTableArr[i].tEamShiftScheduleName,
                        note: this.proScheduleTableArr[i].tEamShiftScheduleNote,
                    })
//                    console.log("fdf " + JSON.stringify(shiftScheduleVoList))
                }
                this.$axios.post("System/saveShiftSchedule",{
                    shiftScheduleVoList: shiftScheduleVoList
                }).then((res) => {
                    var res = res.data.response;
//                    console.log(res)
                    if(res.code == 1){
                        this.$Message.success('保存成功');
                    }else {
                        this.$Message.error(res.msg);
                    }
                    setTimeout(() => {
                        this.loading0 = false;
                        this.toEdit0 = false;
                        this.classesList();
                    }, 500);
                }).catch((err) => {
                    console.log(err);
                    this.loading0 = false;
                });
            },
            //删除班次
            deleteClasses(id,index){
                if(!id){
                    this.proScheduleTableArr.splice(index,1);
                    return
                }
                this.$axios.get("System/shiftScheduleDel",{params:{
                    shiftScheduleId: id
                }}).then((res) => {
                    var res = res.data.response;
                    console.log(res)
                    if(res.code == 1){
                        this.$Message.success('删除成功！');
                    }else {
                        this.$Message.error(res.msg);
                    }
                    setTimeout(() => {
                        this.loading0 = false;
                        this.toEdit0 = false;
                        this.classesList();
                    }, 500);
                }).catch((err) => {
                    console.log(err);
                });
            },
            //班组列表
            teamDivisionList(){
                this.$axios.get("/System/productionTeam/list").then((res) => {
                    var res = res.data.response;
//                    console.log('班组列表数据');
//                    console.log(JSON.stringify(res));
                    if(res.code == 1){
                        this.teamDivisionTableArr = res.data;
                        this.teamDivisionSelected = res.data;
                    }else {
                        this.$Message.error(res.msg);
                    }
                }).catch((err) => {
                    console.log(err);
                });
            },
            submit1(){
                //校验不能为空的值
                let vt = this;
                vt.isSubmit1 = true;
                $('.tests1').each(function () {
                    var vals = $(this).find('.ivu-input').val();
                    if(vals===''){
                        $(this).addClass('ivu-form-item-error');
                        vt.$Message.error('请完善信息');
                        vt.isSubmit1 = false;
                    }
                    else{
                        $(this).removeClass('ivu-form-item-error');
                    }
                });
                if(this.isSubmit1){
                    this.loading1 = true;
                    this.teamDivisionSave();
                }
                console.log(this.isSubmit1)
            },
            //班组保存
            teamDivisionSave(){
                let productionTeamSVoList = [];
                for(var i in this.teamDivisionTableArr){
                    productionTeamSVoList.push({
                        personId: this.teamDivisionTableArr[i].personId,
                        factoryLocationId: this.teamDivisionTableArr[i].locationId,
                        note: this.teamDivisionTableArr[i].note,
                        teamName: this.teamDivisionTableArr[i].personName
                    })
                }
//                console.log('productionTeamSVoList === '+JSON.stringify(productionTeamSVoList))
                this.$axios.post("/System/productionTeamAdd",{
                    productionTeamSVoList: productionTeamSVoList
                }).then((res) => {
                    var res = res.data.response;
                    console.log(JSON.stringify(res))
                    if(res.code == 1){
                        this.$Message.success('保存成功');
                    }else {
                        this.$Message.error(res.msg);
                    }
                    setTimeout(() => {
                        this.loading1 = false;
                        this.toEdit1 = false;
                        this.teamDivisionList();
                    }, 500);
                }).catch((err) => {
                    console.log(err);
                    this.loading1 = false;
                });
            },
            //班组删除
            teamDivisionDel(id,index){
                this.teamDivisionTableArr.splice(index,1)
            },
            addTeamDivision(){
                this.teamDivisionTableArr.push({
                    personId:'',
                    personName:'',
                    locationName:'',
                    note:'',
                    locationId:'',
                })
            },
            addProSchedule(){
                this.proScheduleTableArr.push({
                    tEamShiftScheduleName: "",
                    tEamShiftScheduleBeginTime: "",
                    tEamShiftScheduleEndTime: "",
                    tEamShiftScheduleNote: ""
                })
            },
            //人员信息列表
            personInforList(){
                this.$axios.get("/System/teamShiftPerson/list").then((res) => {
                    var res = res.data.response;
//                    console.log(res)
//                    console.log('人员列表数据')
                    if(res.code == 1){
                        this.personsArr = res.data;
                        for(var i in res.data){
                            this.personsArr[i].personName = res.data[i].personName.replace(/、/g,"/").substring(0,res.data[i].personName.length-1);
                            this.personsArr[i].personId = res.data[i].personId.substring(0,res.data[i].personId.length-1);
                        }
                    }else {
                        this.$Message.error(res.msg);
                    }
                }).catch((err) => {
                    console.log(err);
                });
            },
            toOpenPerson(index){
                this.person_mod = true;
                this.personIndex = index;
                this.personSelected = [];
                if(this.personsArr[index].personName!=''&&this.personsArr[index].personName){
                    let name = this.personsArr[index].personName.split('/');
                    let id = this.personsArr[index].personId.split(',');
                    for(var i in name){
                        this.personSelected.push({
                            personName: name[i],
                            personId: id[i]
                        })
                    }
                }
            },
            hasSelected_person(msg){
                this.personSelected = msg;
            },
            toSelectPerson(){
//                console.log(this.personSelected);
                this.surePersonSelected = this.personSelected;
                if(this.surePersonSelected.length!=0){
                    this.personsArr[this.personIndex].personName = this.surePersonSelected[0].personName;
                    this.personsArr[this.personIndex].personId = this.surePersonSelected[0].personId;
                    for(var i=1;i<this.surePersonSelected.length;i++){
                        this.personsArr[this.personIndex].personName += '/'+this.surePersonSelected[i].personName;
                        this.personsArr[this.personIndex].personId += ','+this.surePersonSelected[i].personId;
                    }
                }
                else{
                    this.personsArr[this.personIndex].personName = '';
                    this.personsArr[this.personIndex].personId = '';
                }
            },
            openclassessMod(index){
                this.classessMod = true;
                this.schIndex=index;
                $('.trBg').removeClass('highlight')
            },
            clickProSchedule(index){
//                this.schIndex = index
                this.selectedSchedule = this.proScheduleSelected[index];
                $('.trBg').eq(index).addClass('highlight').siblings().removeClass('highlight')
            },
            toSelectSchedule(){
                $(".typeTable").find("input[type='radio']:checked").prop('checked', false);
                this.sureSelectedSchedule = this.selectedSchedule;
//                console.log(this.sureSelectedSchedule)
                this.personsArr[this.schIndex].shiftName = this.sureSelectedSchedule.tEamShiftScheduleName;
                this.personsArr[this.schIndex].shiftId = this.sureSelectedSchedule.tEamShiftScheduleId
            },
            openteamMod(index){
                this.teamMod =true;
                this.teamIndex=index;
                $('.trBg0').removeClass('highlight')
            },
            clickTeam(index){
                this.selectedTeamDivision = this.teamDivisionSelected[index];
                $('.trBg0').eq(index).addClass('highlight').siblings().removeClass('highlight')
            },
            toSelectTeam(){
                $(".typeTable").find("input[type='radio']:checked").prop('checked', false);
                this.sureSelectedTeamDivision = this.selectedTeamDivision;
//                console.log(this.sureSelectedTeamDivision);
                this.personsArr[this.teamIndex].teamName = this.sureSelectedTeamDivision.personName;
                this.personsArr[this.teamIndex].teamId = this.sureSelectedTeamDivision.personId
            },
            submit2(){
                //校验不能为空的值
                let vt = this;
                vt.isSubmit2 = true;
                $('.tests2').each(function () {
                    var vals = $(this).find('.ivu-input').val();
                    if(vals===''){
                        $(this).addClass('ivu-form-item-error');
                        vt.$Message.error('请完善信息');
                        vt.isSubmit2 = false;
                    }
                    else{
                        $(this).removeClass('ivu-form-item-error');
                    }
                });
                if(this.isSubmit2){
                    this.loading2 = true;
                    this.personSave();
                }
//                console.log(this.isSubmit2)
            },
            personSave(){
                let teamShiftPersonVoList = [];
                for(var i in this.personsArr){
                    teamShiftPersonVoList.push({
                        personId: this.personsArr[i].personId,
                        shiftId: this.personsArr[i].shiftId,
                        teamId: this.personsArr[i].teamId
                    })
                }
                this.$axios.post("/System/teamShiftPersonAdd",{
                    teamShiftPersonVoList: teamShiftPersonVoList
                }).then((res) => {
                    var res = res.data.response;
//                    console.log(res)
                    if(res.code == 1){
                        this.$Message.success('保存成功');
                    }else {
                        this.$Message.error(res.msg);
                    }
                    setTimeout(() => {
                        this.loading2 = false;
                        this.toEdit2 = false;
                        this.personInforList();
                    }, 500);
                }).catch((err) => {
                    console.log(err);
                    this.loading2 = false;
                });
            },
            personDel(index){
                this.personsArr.splice(index,1)
            },
            addPerson(){
                this.personsArr.push({})
            },
        }
    }
</script>
<style type="text/css">
    .table-reset .table-striped tbody>.highlight>td,
    .table-reset .table-striped tbody>.highlight>th{
        background: #ebf7ff !important;
    }
</style>