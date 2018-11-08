<template>
    <div class="basic fault-content">
        <!--模块名称-->
        <div class="title">
            <span>系统管理</span>
        </div>
        <div class="titleListManage ">
            <ul class="tabUL">
                <li class="active">
                    <a>报警升级</a>
                </li>
                <li>
                    <router-link to='/auditShunt'>审核分流</router-link>
                </li>
                <li>
                    <router-link to='/productSchedul'>生产排班</router-link>
                </li>
            </ul>
        </div>

        <span style="color:red;position:relative;margin-left:300px;top:25px;">(切换页签时，请将您已编辑过的内容及时保存，否则编辑数据将丢失)</span>
        <Tabs type="card" :value="tempName" @on-click="tabChange" class="system">
            <TabPane label="维修响应" name="response">
                <div class="form-content">
                    <div class="settingPanel">
                        <div class="table-reset" style="margin-bottom: 30px">
                            <table class="table table-bordered table-center table-striped table-blue table-edit table-standWork">
                                <thead>
                                <tr>
                                    <th class="wid-50">序号</th>
                                    <th class="wid-7-per">响应节点</th>
                                    <th>升级时限（超过设置时间后报警）</th>
                                    <th class="wid-20-per">报警对象</th>
                                    <th class="wid-20-per">排除账户</th>
                                    <th>备注</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr v-for="(tableData,index) in resData">
                                    <td>{{index + 1}}</td>
                                    <td class="tdPadding">
                                        {{tableData.nodeName}}
                                    </td>
                                    <td class=" selectLeft">
                                        <InputNumber :min="1" :max="10000" :step="1" v-model="tableData.num" @on-change="testNum"
                                                     :disabled="!toEditResponse"></InputNumber>
                                        <Select style="width: 90px" v-model="tableData.unit"
                                                :disabled="!toEditResponse">
                                            <Option v-for="item in timeUnits" :value="item.code" :key="item.code">
                                                {{item.desc}}
                                            </Option>
                                        </Select>
                                    </td>
                                    <td>
                                        <div class="input-search" :disabled="!toEditResponse"
                                             @click="roleModShos(index)">
                                            <Input style="width: 100%;" v-model="tableData.role"
                                                   :disabled="!toEditResponse" class="pointDis"
                                                   readonly="" :title="tableData.role"></Input>
                                            <Button icon="ios-search" :disabled="!toEditResponse"></Button>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="input-search" :disabled="!toEditResponse"
                                             @click="perModShos(index)">
                                            <Input style="width: 100%;" v-model="tableData.rolePerson"
                                                   :disabled="!toEditResponse" class="pointDis"
                                                   readonly="" :title="tableData.rolePerson"></Input>
                                            <Button icon="ios-search"
                                                    :disabled="tableData.role&&!toEditResponse"></Button>
                                        </div>
                                    </td>
                                    <td><Input :maxlength="200" @on-change="lengthChange(tableData.note,200)" style="width: 100%;" v-model="tableData.note" :disabled="!toEditResponse"
                                               :title="tableData.note"></Input></td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <Row class="btn-group">
                    <Col class="pad-15" span="24" align="center">
                    <Button v-show="!toEditResponse" type="primary" size="large" @click="toEditResponse=true">编辑
                    </Button>
                    <Button v-show="!toEditResponse&&!toStart" type="primary" size="large" :loading="resOP"
                            @click="toOpreation()">开启
                    </Button>
                    <Button v-show="!toEditResponse&&toStart" type="primary" size="large" :loading="resOP"
                            @click="toOpreation()">终止
                    </Button>
                    <Button v-show="toEditResponse" type="primary" size="large" @click="toEditResponse=false">取消
                    </Button>
                    <Button v-show="toEditResponse" type="primary" size="large" :loading="resLoading"
                            @click="toSaveRes">保存
                    </Button>
                    </Col>
                </Row>
            </TabPane>
            <TabPane label="保养执行" name="carryOut">
                <div class="form-content">
                    <div class="maintainPanel">
                        <div class="table-reset" style="margin-bottom: 30px">
                            <table class="table table-bordered table-center table-striped table-blue table-edit taDisplay">
                                <thead>
                                <tr>
                                    <th class="wid-50">序号</th>
                                    <th class="wid-7-per">准点状态</th>
                                    <th>准点时限（超过设置时间后报警）</th>
                                    <th class="wid-20-per">报警对象</th>
                                    <th class="wid-20-per">排除账户</th>
                                    <th>备注</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr v-for="(tableData,index) in carryData" class="trDisplay">
                                    <td>{{index + 1}}</td>
                                    <td class="tdPadding tdDisplay pointDis">
                                        {{tableData.onTimeName}}
                                    </td>
                                    <td class=" selectLeft">
                                        <div v-show="tableData.time!=3">
                                            <InputNumber :min="1" :max="10000" :step="1" v-model="tableData.num" @on-change="testNum"
                                                         :disabled="!toEditCarryout"></InputNumber>
                                            <Select style="width: 90px" v-model="tableData.unit"
                                                    :disabled="!toEditCarryout">
                                                <Option v-for="item in timeUnits" :value="item.code" :key="item.code">
                                                    {{item.desc}}
                                                </Option>
                                            </Select>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="input-search" :disabled="!toEditCarryout"
                                             @click="roleModShos(index)">
                                            <Input style="width: 100%;" v-model="tableData.role"
                                                   :disabled="!toEditCarryout" class="pointDis"
                                                   readonly="" :title="tableData.role"></Input>
                                            <Button icon="ios-search" :disabled="!toEditCarryout"></Button>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="input-search" :disabled="!toEditFeedback"
                                             @click="perModShos(index)">
                                            <Input style="width: 100%;" v-model="tableData.rolePerson"
                                                   :disabled="!toEditCarryout" class="pointDis"
                                                   readonly="" :title="tableData.rolePerson"></Input>
                                            <Button icon="ios-search"
                                                    :disabled="tableData.role&&!toEditCarryout"></Button>
                                        </div>
                                    </td>
                                    <td><Input :maxlength="200" @on-change="lengthChange(tableData.note,200)" style="width: 100%;" v-model="tableData.note" :disabled="!toEditCarryout"
                                               :title="tableData.note"></Input></td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <Row class="btn-group">
                    <Col class="pad-15" span="24" align="center">
                    <Button v-show="!toEditCarryout" type="primary" size="large" @click="toEditCarryout=true">编辑
                    </Button>
                    <Button v-show="!toEditCarryout&&!toStartCarry" type="primary" size="large" :loading="carryOP"
                            @click="toOpreationCarry()">开启
                    </Button>
                    <Button v-show="!toEditCarryout&&toStartCarry" type="primary" size="large" :loading="carryOP"
                            @click="toOpreationCarry()">终止
                    </Button>
                    <Button v-show="toEditCarryout" type="primary" size="large" @click="toEditCarryout=false">取消
                    </Button>
                    <Button v-show="toEditCarryout" type="primary" size="large" :loading="carryLoading" @click="toSaveCarry">保存</Button>
                    </Col>
                </Row>
            </TabPane>
            <TabPane label="点检反馈" name="feedback">
                <div class="form-content">
                    <div class="spotCheckPanel">
                        <div class="table-reset" style="margin-bottom: 30px">
                            <table class="table table-bordered table-center table-striped table-blue table-edit taDisplay">
                                <thead>
                                <tr>
                                    <th class="wid-50">序号</th>
                                    <th class="wid-7-per">准点状态</th>
                                    <th>准点时限（超过设置时间后报警）</th>
                                    <th class="wid-20-per">报警对象</th>
                                    <th class="wid-20-per">排除账户</th>
                                    <th>备注</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr v-for="(tableData,index) in feedData " class="trDisplay">
                                    <td>{{index + 1}}</td>
                                    <td class="tdPadding tdDisplay pointDis">
                                        {{tableData.onTimeName}}
                                    </td>
                                    <td class=" selectLeft">
                                        <div v-show="tableData.time!=3">
                                            <InputNumber :min="1" :max="10000" :step="1" v-model="tableData.num" @on-change="testNum"
                                                         :disabled="!toEditFeedback"></InputNumber>
                                            <Select style="width: 90px" v-model="tableData.unit"
                                                    :disabled="!toEditFeedback">
                                                <Option v-for="item in timeUnits" :value="item.code" :key="item.code">
                                                    {{item.desc}}
                                                </Option>
                                            </Select>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="input-search" :disabled="!toEditFeedback"
                                             @click="roleModShos(index)">
                                            <Input style="width: 100%;" v-model="tableData.role"
                                                   :disabled="!toEditFeedback" class="pointDis"
                                                   readonly="" :title="tableData.role"></Input>
                                            <Button icon="ios-search" :disabled="!toEditFeedback"></Button>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="input-search" :disabled="!toEditFeedback"
                                             @click="perModShos(index)">
                                            <Input style="width: 100%;" v-model="tableData.rolePerson"
                                                   :disabled="!toEditFeedback" class="pointDis"
                                                   readonly="" :title="tableData.rolePerson"></Input>
                                            <Button icon="ios-search"
                                                    :disabled="tableData.role&&!toEditFeedback"></Button>
                                        </div>
                                    </td>
                                    <td><Input :maxlength="200" @on-change="lengthChange(tableData.note,200)" style="width: 100%;" v-model="tableData.note" :disabled="!toEditFeedback"
                                               :title="tableData.note"></Input></td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <Row class="btn-group">
                    <Col class="pad-15" span="24" align="center">
                    <Button v-show="!toEditFeedback" type="primary" size="large" @click="toEditFeedback=true">编辑
                    </Button>
                    <Button v-show="!toEditFeedback&&!toStartFeed" type="primary" size="large" :loading="feedOP"
                            @click="toOpreationFeed()">开启
                    </Button>
                    <Button v-show="!toEditFeedback&&toStartFeed" type="primary" size="large" :loading="feedOP"
                            @click="toOpreationFeed()">终止
                    </Button>
                    <Button v-show="toEditFeedback" type="primary" size="large" @click="toEditFeedback=false">取消
                    </Button>
                    <Button v-show="toEditFeedback" type="primary" size="large" :loading="feedLoading"
                            @click="toSaveFeed">保存
                    </Button>
                    </Col>
                </Row>
            </TabPane>
        </Tabs>
        <!--角色选择-->
        <Modal v-model="roleMod" width="900" title="报警对象" @on-ok="certainRole"  :styles="{top: '70px'}">
            <roleSelect @rolesSetected="rolesSetected"  :mod_rightDisplay="roleHas"></roleSelect>
        </Modal>
        <!--角色人员选择-->
        <Modal v-model="personMod" width="900" title="排除账户" @on-ok="certainPerson" :styles="{top: '70px'}">
            <rolePerSelect @rolesPerSetected="perSelected" :mod_rightDisplay="personHas"
                           :roleIds="theRoleIds"></rolePerSelect>
        </Modal>
    </div>
</template>

<script>
    import roleSelect from '../treeMulitiple/roleSelect.vue';//角色多选
    import rolePerSelect from '../treeMulitiple/rolePersonSelect.vue';//角色人员多选
    export default {
        data(){
            return {
                resNum1: "",
                resNum2: "",
                resNum3: "",
                resLoading: false,//维修响应保存loading
                resOP: false,//维修响应的开启中止loading
                feedLoading: false,//点检反馈保存loading
                feedOP: false,
                carryOP: false,//保养执行的开启中止loading
                carryLoading: false,//点检反馈保存loading
                //当前tab页：
                tempName: "response",
                //报警对象：
                roleMod: false,
                roleHas: [],//已渲染角色
                resItem: "",//维修响应的当前已选项
                rolePre: [],//已选但未确定角色
                roleSelected: [],//已选角色
                //排除账户：
                personMod: false,//
                theRoleIds: "",
                personPre: [],//已选但未确定角色人员
                personHas: [],//已渲染人员
                personSelected: [],//已选人员
                toStart: true,
                toStartFeed: true,
                toStartCarry: true,
                toEditResponse: false,
                toEditCarryout: false,
                toEditFeedback: false,
                name: "name1",
                equWeight: 'one',
                equWeight2: 'two',
                executePosition: ['one', 'two'],//执行岗位
                checked: true,
                open: 'open',
                open2: 'open',
                open3: 'open',
                formData: {
                    value1: 1,
                    checked: 'one'
                },
                time_unit01: '1',
                time_unit02: '2',
                timeUnits: [],
                new_tableDataArr: {
                    node: '',
                    num: '',
                    role: '',
                    note: ''
                },
                resData: [],
                carryData: [],
                feedData: [],
            }
        },
        components: {
            "roleSelect": roleSelect,
            "rolePerSelect": rolePerSelect,
        },
        mounted(){
            this.getResData();//维修响应列表
            console.log(this.$base_info);
            for (let i = 0; i < this.$base_info.tEamResponseTimeUnitEnum.length; i++) {
                if (this.$base_info.tEamResponseTimeUnitEnum[i].code != -1) {
                    this.timeUnits.push(this.$base_info.tEamResponseTimeUnitEnum[i]);
                }
                ;
            }
            ;
        },
        methods: {
            //输入框文字长度：
            lengthChange(i, len){
                if (i.length >= len) {
                    this.$Message.error('备注字数不能超过' + len)
                }
            },
            testNum(val){
                if (this.tempName == "response") {
                    if (!Number.isInteger(val)) {
                        this.$Message.error('升级时限请设置为整数!');
                        this.resNum1 = "升级时限请设置为整数!";
                    }
                    else {
                        this.resNum1 = "";
                    }
                }
                ;
                if (this.tempName == "carryOut") {
                    if (!Number.isInteger(val)) {
                        this.$Message.error('准点时限请设置为整数!');
                        this.resNum2 = "升级时限请设置为整数!";
                    }
                    else {
                        this.resNum2 = "";
                    }
                }
                ;
                if (this.tempName == "feedback") {
                    if (!Number.isInteger(val)) {
                        this.$Message.error('准点时限请设置为整数!');
                        this.resNum3 = "升级时限请设置为整数!";
                    }
                    else {
                        this.resNum3 = "";
                    }
                }
                ;

            },
            getOntimeName(x){
                for(let i=0;i<this.$base_info.onTimeStatusEnum2.length;i++){
                    if(x==this.$base_info.onTimeStatusEnum2[i].code){
                        return this.$base_info.onTimeStatusEnum2[i].desc;
                    };
                };
            },
            tabChange(x){
                this.tempName = x;
              //编辑过未保存项，将会重新请求数据恢复为默认值：
                if(x=="response"&&this.toEditResponse){
                    this.toEditResponse=false;
                    this.resData=[];
                    this.getResData();
                };
                if((x=="carryOut"&&this.toEditCarryout)||(x=="carryOut"&&this.carryData.length==0)){
                    this.toEditCarryout=false;
                    this.carryData=[];
                    this.getCarryData();
                };
                if((x=="feedback"&&this.toEditFeedback)||(x=="feedback"&&this.feedData.length==0)){
                    this.toEditFeedback=false;
                    this.feedData=[];
                    this.getFeedData();
                };
            },

            //角色相关---start

            //角色选择放大镜：
            roleModShos(item){
                this.resItem = item;
                if (this.tempName == "response" && this.toEditResponse) {
                    //维修响应：
                    this.roleHas = this.resData[this.resItem].roleArr;
                    this.rolePre = this.roleHas;
                    this.roleMod = true;
                }
                ;
                if (this.tempName == "carryOut" && this.toEditCarryout) {
                    //维修响应：
                    this.roleHas = this.carryData[this.resItem].roleArr;
                    this.rolePre = this.roleHas;
                    this.roleMod = true;
                }
                ;

                if (this.tempName == "feedback" && this.toEditFeedback) {
                    //点检反馈
                    this.roleHas = this.feedData[this.resItem].roleArr;
                    this.rolePre = this.roleHas;
                    this.roleMod = true;
                }
                ;
            },
            //确定选择：
            certainRole(){
                let objectData;
                if (this.tempName == "response") {
                    objectData = this.resData;
                }
                ;
                if (this.tempName == "carryOut") {
                    //维修响应：
                    objectData = this.carryData;
                }

                if (this.tempName == "feedback") {
                    objectData = this.feedData;
                }
                objectData[this.resItem].role = "";
                objectData[this.resItem].roleIds = "";
                objectData[this.resItem].rolePerson = "";
                objectData[this.resItem].roleIdArr = [],
                    objectData[this.resItem].roleArr = [];
                objectData[this.resItem].personArr = [];
                objectData[this.resItem].personIdArr = [];

                for (let i = 0; i < this.rolePre.length; i++) {
                    objectData[this.resItem].roleArr.push(this.rolePre[i]);
                    objectData[this.resItem].roleIdArr.push(this.rolePre[i].id);
                    if (i == this.rolePre.length - 1) {
                        objectData[this.resItem].role = objectData[this.resItem].role + this.rolePre[i].name;
                        objectData[this.resItem].roleIds = objectData[this.resItem].roleIds + this.rolePre[i].id;
                    }
                    else {
                        objectData[this.resItem].role = objectData[this.resItem].role + this.rolePre[i].name + "、";
                        objectData[this.resItem].roleIds = objectData[this.resItem].roleIds + this.rolePre[i].id + ",";
                    }
                    ;
                }
                ;
            },
            //已选项：
            rolesSetected(message){
                this.rolePre = message;
            },

            //排除账户相关：
            perModShos(item){
                this.resItem = item;
                if (this.tempName == "response" && this.toEditResponse) {//维修响应
                    this.theRoleIds = this.resData[this.resItem].roleIds;
                    this.personHas = this.resData[this.resItem].personArr;
                    this.personMod = true;
                    this.personPre = this.personHas;
                }
                ;
                if (this.tempName == "carryOut" && this.toEditCarryout) {
                    //保养执行：
                    this.theRoleIds = this.carryData[this.resItem].roleIds;
                    this.personHas = this.carryData[this.resItem].personArr;
                    this.personMod = true;
                    this.personPre = this.personHas;
                }
                ;
                if (this.tempName == "feedback" && this.toEditFeedback) {//点检反馈
                    //点检反馈
                    this.theRoleIds = this.feedData[this.resItem].roleIds;
                    this.personHas = this.feedData[this.resItem].personArr;
                    this.personMod = true;
                    this.personPre = this.personHas;
                }
                ;

            },
            //已选角色人员：
            perSelected(message){
                this.personPre = message;
            },

            certainPerson(){

                let objectData;
                if (this.tempName == "response") {//维修相应
                    objectData = this.resData;
                }
                ;
                if (this.tempName == "carryOut") {
                    //保养执行：
                    objectData=this.carryData;
                }
                ;
                if (this.tempName == "feedback") {//点检反馈
                    objectData = this.feedData;
                }

                objectData[this.resItem].rolePerson = "";
                objectData[this.resItem].personArr = [];
                objectData[this.resItem].personIdArr = [];
                for (let i = 0; i < this.personPre.length; i++) {
                    objectData[this.resItem].personIdArr.push(this.personPre[i].id);
                    objectData[this.resItem].personArr.push(this.personPre[i]);
                    if (i == this.personPre.length - 1) {
                        objectData[this.resItem].rolePerson = objectData[this.resItem].rolePerson + this.personPre[i].name;
                    }
                    else {
                        objectData[this.resItem].rolePerson = objectData[this.resItem].rolePerson + this.personPre[i].name + "、";
                    }
                    ;
                }
                ;
            },

            //维修响应列表：
            getResData(){
                let vt = this;
                this.$axios.get('/System/maintainResponseList').then((res) => {
                    let result = res.data.response;
                    let resArr = result.data;
                    if (result.code != 1) {
                        vt.$Message.error(result.msg);
                    }
                    else {
                        for (let i = 0; i < resArr.length; i++) {
                            let obj = {
                                node: 0,
                                nodeName: "",
                                num: 0,
                                unit: "",
                                role: '',
                                roleIds: "",
                                roleIdArr: [],
                                roleArr: [],
                                rolePerson: "",
                                personIdArr: [],
                                personArr: [],
                                note: '',

                            };
                            obj.alarmSettingId = resArr[i].alarmSettingId;//id
                            obj.node = resArr[i].responseNodeCode;//响应节点
                            obj.nodeName = resArr[i].responseNodeName;//响应节点名
                            obj.num = resArr[i].timeLimit;//升级时限
                            obj.unit = resArr[i].uomCode;//时限单位
                            obj.note = resArr[i].note;//备注
                            obj.status = resArr[i].status;//状态

                            for (let j = 0; j < resArr[i].persons.length; j++) {//排除账户相关
                                let personObg = {};
                                personObg.name = resArr[i].persons[j].personName;
                                personObg.id = resArr[i].persons[j].personId;
                                obj.personArr.push(personObg);//排除账户数组
                                obj.personIdArr.push(resArr[i].persons[j].personId);//id数组
                                if (j == resArr[i].persons.length - 1) {//人员显示：
                                    obj.rolePerson = obj.rolePerson + resArr[i].persons[j].personName;
                                }
                                else {
                                    obj.rolePerson = obj.rolePerson + resArr[i].persons[j].personName + "、";
                                }
                                ;
                            }
                            ;
                            for (let j = 0; j < resArr[i].roles.length; j++) {//角色相关
                                obj.roleIdArr.push(resArr[i].roles[j].roleId);
                                let roleObg = {};
                                roleObg.name = resArr[i].roles[j].roleName;
                                roleObg.id = resArr[i].roles[j].roleId;
                                obj.roleArr.push(roleObg);//报警对象数组
                                if (j == resArr[i].roles.length - 1) {
                                    obj.role = obj.role + resArr[i].roles[j].roleName;
                                    obj.roleIds = obj.roleIds + resArr[i].roles[j].roleId;
                                }
                                else {
                                    obj.role = obj.role + resArr[i].roles[j].roleName + "、";
                                    obj.roleIds = obj.roleIds + resArr[i].roles[j].roleId + ",";
                                }
                                ;
                            }
                            ;
                            vt.resData.push(obj);
                        }
                        ;
                        vt.toStart = vt.resData[0] && vt.resData[0].status ? true : false;
                    }
                }).catch((err) => {

                });
            },

            //保存维修响应：
            toSaveRes(){
                this.resLoading = true;
                let finalRes = [];
                if (this.resNum1) {
                    this.$Message.error('升级时限请设置为整数!');
                    this.resLoading = false;
                    return;
                }
                ;
                for (let i = 0; i < this.resData.length; i++) {
                    let obj = {};
                    obj.alarmSettingId = this.resData[i].alarmSettingId;//id
                    obj.responseNodeCode = this.resData[i].node;//响应节点
                    obj.responseNodeName = this.resData[i].nodeName;//响应节点名
                    obj.timeLimit = this.resData[i].num;//升级时限
                    obj.uomCode = this.resData[i].unit//时间单位
                    obj.note = this.resData[i].note//备注信息
                    obj.roleIds = this.resData[i].roleIdArr//权限的id数组
                    if (!this.resData[i].roleIdArr[0]) {
                        this.$Message.error('报警对象不能为空!');
                        this.resLoading = false;
                        return;
                    }
                    ;
                    obj.persons = this.resData[i].personIdArr;//排除账户的Id数组
                    finalRes.push(obj);

                }
                ;
                let vt = this;
                this.$axios.post('/System/maintainResponseSave', {
                    maintainResponses: finalRes,
                }).then((res) => {
//
                    if (res.data.response.code === 1) {
                        vt.$Message.success("保存成功");
                        vt.toEditResponse = !vt.toEditResponse;
                    } else {
                        vt.$Message.error(res.data.response.msg);
                    }
                    ;
                    vt.resLoading = false;
                }).catch((err) => {
                });
            },


            //保养执行列表：
            getCarryData(){
                let vt = this;
                let url = "/System/getMaintenanceExecutionDetail";
                this.$axios.post(url, {
                    type:1,
                }).then((res) => {
                    let resArr=res.data.response.data;
                    if (res.data.response.code === 1) {
                        for (let i = 0; i < resArr.length; i++) {
                            let obj = {
                                time: 0,
                                onTimeName: "",
                                num: 10,
                                unit: 0,
                                role: '',
                                roleIds: "",
                                roleIdArr: [],
                                roleArr: [],
                                rolePerson: "",
                                personIdArr: [],
                                personArr: [],
                                note: '',
                            };
                            obj.alarmSettingId = resArr[i].id;//id
                            obj.time = resArr[i].onTimeCode;//准点状态
                            obj.onTimeName = this.getOntimeName(resArr[i].onTimeCode);//准点状态,名字暂时没有的呀~~~~~~
                            obj.num = resArr[i].timeLimit;//升级时限
                            obj.unit = resArr[i].timeUnit;//时限单位
                            obj.note = resArr[i].note;//备注,暂时没有~~~~~~
                            for (let j = 0; j < resArr[i].excludeAccounts.length; j++) {//排除账户相关
                                let personObg = {};
                                personObg.name = resArr[i].excludeAccounts[j].name;
                                personObg.id = resArr[i].excludeAccounts[j].id;
                                obj.personArr.push(personObg);//排除账户数组
                                obj.personIdArr.push(resArr[i].excludeAccounts[j].id);//id数组
                                if (j == resArr[i].excludeAccounts.length - 1) {//人员显示：
                                    obj.rolePerson = obj.rolePerson + resArr[i].excludeAccounts[j].name;
                                }
                                else {
                                    obj.rolePerson = obj.rolePerson + resArr[i].excludeAccounts[j].name + "、";
                                }
                                ;
                            }
                            ;
                            for (let j = 0; j < resArr[i].alertObject.length; j++) {//角色相关
                                obj.roleIdArr.push(resArr[i].alertObject[j].id);
                                let roleObg = {};
                                roleObg.name = resArr[i].alertObject[j].name;
                                roleObg.id = resArr[i].alertObject[j].id;
                                obj.roleArr.push(roleObg);//报警对象数组
                                if (j == resArr[i].alertObject.length - 1) {
                                    obj.role = obj.role + resArr[i].alertObject[j].name;
                                    obj.roleIds = obj.roleIds + resArr[i].alertObject[j].id;
                                }
                                else {
                                    obj.role = obj.role + resArr[i].alertObject[j].name + "、";
                                    obj.roleIds = obj.roleIds + resArr[i].alertObject[j].id+ ",";
                                }
                                ;
                            }
                            ;
                            vt.carryData.push(obj);
                        }
                        ;

                        vt.toStartCarry= vt.carryData[0] && vt.carryData[0].status ? true : false;

                    } else {
                        vt.$Message.error(res.data.response.msg);
                    }
                }).catch((err) => {
                });
            },
            toSaveCarry(){
                this.carryLoading = true;
                let finalRes = [];
                if (this.resNum2) {
                    this.$Message.error(this.resNum2);
                    this.carryLoading = false;
                    return;
                }
                ;
                for (let i = 0; i < this.carryData.length; i++) {
                    let obj = {};
                    obj.id = this.carryData[i].alarmSettingId;//id
                    obj.type= this.carryData[i].time;//准点状态
                    obj.timeLimit = this.carryData[i].num;//升级时限
                    obj.timeUnit = this.carryData[i].unit//时间单位
                    obj.note = this.carryData[i].note//备注信息
                    obj.roleIds = this.carryData[i].roleIdArr.join(",")//权限的id数组
                    if (!this.carryData[i].roleIdArr[0]) {
                        this.$Message.error('报警对象不能为空!');
                        this.carryLoading = false;
                        return;
                    }
                    ;
                    obj.personIds = this.carryData[i].personIdArr.join(",");//排除账户的Id数组
                    finalRes.push(obj);

                }
                ;
                let vt = this;
                this.$axios.post('/System/saveMaintenanceExecutionDetail', finalRes
                ).then((res) => {
//
                    if (res.data.response.code === 1) {
                        vt.$Message.success("保存成功");
                        vt.toEditCarryout = !vt.toEditCarryout;
                    } else {
                        vt.$Message.error(res.data.response.msg);
                    }
                    vt.carryLoading = false;
                }).catch((err) => {
                });
            },
            //点检反馈列表：
            getFeedData(){
                let vt = this;
                this.$axios.get('/System/checkFeedbackList').then((res) => {
                    let result = res.data.response;
                    let resArr = result.data;
                    if (result.code != 1) {
                        vt.$Message.error(result.msg);
                    }
                    else {
                        for (let i = 0; i < resArr.length; i++) {
                            let obj = {
                                time: 0,
                                onTimeName: "",
                                num: 10,
                                unit: 0,
                                role: '',
                                roleIds: "",
                                roleIdArr: [],
                                roleArr: [],
                                rolePerson: "",
                                personIdArr: [],
                                personArr: [],
                                note: '',
                            };
                            obj.alarmSettingId = resArr[i].alarmSettingId;//id
                            obj.time = resArr[i].onTimeCode;//准点状态
                            obj.onTimeName = resArr[i].onTimeName;//准点状态
                            obj.num = resArr[i].timeLimit;//升级时限
                            obj.unit = resArr[i].uomCode;//时限单位
                            obj.note = resArr[i].note;//备注
                            for (let j = 0; j < resArr[i].person.length; j++) {//排除账户相关
                                let personObg = {};
                                personObg.name = resArr[i].person[j].personName;
                                personObg.id = resArr[i].person[j].personId;
                                obj.personArr.push(personObg);//排除账户数组
                                obj.personIdArr.push(resArr[i].person[j].personId);//id数组
                                if (j == resArr[i].person.length - 1) {//人员显示：
                                    obj.rolePerson = obj.rolePerson + resArr[i].person[j].personName;
                                }
                                else {
                                    obj.rolePerson = obj.rolePerson + resArr[i].person[j].personName + "、";
                                }
                                ;
                            }
                            ;
                            for (let j = 0; j < resArr[i].roles.length; j++) {//角色相关
                                obj.roleIdArr.push(resArr[i].roles[j].roleId);
                                let roleObg = {};
                                roleObg.name = resArr[i].roles[j].roleName;
                                roleObg.id = resArr[i].roles[j].roleId;
                                obj.roleArr.push(roleObg);//报警对象数组
                                if (j == resArr[i].roles.length - 1) {
                                    obj.role = obj.role + resArr[i].roles[j].roleName;
                                    obj.roleIds = obj.roleIds + resArr[i].roles[j].roleId;
                                }
                                else {
                                    obj.role = obj.role + resArr[i].roles[j].roleName + "、";
                                    obj.roleIds = obj.roleIds + resArr[i].roles[j].roleId + ",";
                                }
                                ;
                            }
                            ;
                            vt.feedData.push(obj);
                        }
                        ;
                        vt.toStartFeed = vt.feedData[0] && vt.feedData[0].status ? true : false;
                    }
                }).catch((err) => {

                });
            },

            //保存点检反馈：
            toSaveFeed(){
                this.feedLoading = true;
                let finalRes = [];
                if (this.resNum3) {
                    this.$Message.error(this.resNum3);
                    this.feedLoading = false;
                    return;
                }
                ;
                for (let i = 0; i < this.feedData.length; i++) {
                    let obj = {};
                    obj.alarmId = this.feedData[i].alarmSettingId;//id
                    obj.onTimeCode = this.feedData[i].time;//准点状态
                    obj.onTimeName = this.feedData[i].onTimeName;//准点状态点名
                    obj.timeLimit = this.feedData[i].num;//升级时限
                    obj.timeUnit = this.feedData[i].unit//时间单位
                    obj.note = this.feedData[i].note//备注信息
                    obj.roleIds = this.feedData[i].roleIdArr//权限的id数组
                    if (!this.feedData[i].roleIdArr[0]) {
                        this.$Message.error('报警对象不能为空!');
                        this.feedLoading = false;
                        return;
                    }
                    ;
                    obj.personIds = this.feedData[i].personIdArr;//排除账户的Id数组
                    finalRes.push(obj);

                }
                ;
                let vt = this;
                this.$axios.post('/System/checkFeedbackSave', finalRes
                ).then((res) => {
//
                    if (res.data.response.code === 1) {
                        vt.$Message.success("保存成功");
                        vt.toEditFeedback= !vt.toEditFeedback;
                    } else {
                        vt.$Message.error(res.data.response.msg);
                    }
                    vt.feedLoading = false;
                }).catch((err) => {
                });
            },
            //feedback


//开启或终止维修响应：
            toOpreation(){
                let vt = this;
                vt.resOP = true;
                let url = "/System/maintainResponseSwitch";
                this.$axios.post(url, {
                    statusCode: vt.resData[0].status ? 0 : 1,
                }).then((res) => {
//
                    if (res.data.response.code === 1) {
                        vt.$Message.success(vt.toStart ? "终止成功" : "开启成功");
                        if(vt.resData[0].status==1){
                            vt.resData[0].status=0;
                        }
                        else{
                            vt.resData[0].status=1;
                        };
                        vt.toStart = !vt.toStart;
                    } else {
                        vt.$Message.error(res.data.response.msg);
                    }
                    vt.resOP = false;
                }).catch((err) => {
                });
            },

            //开启或中止保养执行：
            toOpreationCarry(){
                let vt = this;
                vt.carryOP = true;
                let url = "/System/startOrEndMaintenanceExecution";
                this.$axios.post(url, {
                    type: vt.carryData[0].status ? 0 : 1,
                }).then((res) => {
//
                    if (res.data.response.code === 1) {

                        vt.$Message.success(vt.toStartCarry? "终止成功" : "开启成功");
                        if(vt.carryData[0].status==1){
                            vt.carryData[0].status=0;
                        }
                        else{
                            vt.carryData[0].status=1;
                        };
                        vt.toStartCarry= !vt.toStartCarry;
                    } else {
                        vt.$Message.error(res.data.response.msg);
                    }
                    ;
                    vt.carryOP = false;
                }).catch((err) => {
                });
            },

//开启或终止点检反馈
            toOpreationFeed(){
                let vt = this;
                vt.feedOP = true;
                let url = "/System/checkFeedbackStatus";
                this.$axios.post(url, {
                    status: vt.feedData[0].status ? 0 : 1,
                }).then((res) => {
                    if (res.data.response.code === 1) {
                        vt.$Message.success(vt.toStartFeed ? "终止成功" : "开启成功");
                        if(vt.feedData[0].status==1){
                            vt.feedData[0].status=0;
                        }
                        else{
                            vt.feedData[0].status=1;
                        };
                        vt.toStartFeed = !vt.toStartFeed;
                    } else {
                        vt.$Message.error(res.data.response.msg);
                    }
                    ;
                    vt.feedOP = false;
                }).catch((err) => {
                });
            },
        }
    }
</script>

<style type="text/css">
    .newtime .ivu-date-picker-cells-cell-today em:after {
        display: none;
    }
    .table_maintain tbody tr td:nth-of-type(2) {
        background: #bbbec4;
    }
</style>
