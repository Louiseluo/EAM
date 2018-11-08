<template>
    <div class="basic fault-content">
        <!--模块名称-->
        <div class="title">
            <span>系统管理</span>
        </div>
        <div class="titleListManage">
            <ul class="tabUL">
                <li>
                    <router-link to='/systemManage'>报警升级</router-link>
                </li>
                <li class="active">
                    <a>审核分流</a>
                </li>
                <li>
                    <router-link to='/productSchedul'>生产排班</router-link>
                </li>
            </ul>
        </div>
        <div class="form-content">
            <div class="table-reset">
                <table class="table table-bordered table-center table-striped table-blue table-edit">
                    <thead>
                    <tr>
                        <th width="80">序号</th>
                        <th>审核额度（元）</th>
                        <th>范围设置</th>
                        <th>审核权限</th>
                        <th>审核人</th>
                        <th width="150">操作</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(item,index) in tableDataArr3">
                        <td>{{index + 1}}</td>
                        <td>
                            <InputNumber style="text-align: right!important" :max="10000000000" :min="1" :step="1" v-model="item.auditAmount" :disabled="!toEdit"></InputNumber>
                            <!--<Input v-model="item.auditAmount" :disabled="!toEdit" style="text-align:right!important"></Input>-->
                        </td>
                        <td>
                            <Select v-model="item.range_setting" style="width: 160px" :disabled="!toEdit">
                                <Option v-show="type.code!==-1" v-for="type in rangeSettings" :value="type.code" :key="type.code" style="text-align: left">{{type.desc}}</Option>
                            </Select>
                        </td>
                        <td>
                            <div class="input-search">
                                <Input style="width: 100%;" v-model="item.roles"
                                       readonly="" :title="item.roleaccount" :disabled="!toEdit"></Input>
                                <Button icon="ios-search" @click="roleModShos(index)" :disabled="!toEdit"></Button>
                            </div>
                        </td>
                        <td>
                            <div class="input-search">
                                <Input style="width: 100%;" v-model="item.roleaccount" :readonly=true :title="item.roleaccount" :disabled="!toEdit"></Input>
                                <Button icon="ios-search" @click="roleAccountMod(index)" :disabled="!toEdit"></Button>
                            </div>
                        </td>
                        <td>
                            <!--<a>修改</a>-->
                            <a @click="deleteItem(item.id,index)" :disabled="!toEdit">删除</a>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div class="mar-t-10">
                <Button type="primary" icon="plus-round" size="small" @click="addTpmAuditGuide" :disabled="!toEdit">添加</Button>
            </div>
        </div>
        <Row class="btn-group">
            <Col class="pad-15" span="24" align="center">
            <Button type="primary" size="large" v-show="toEdit" @click="cancel">取消</Button>
            <Button type="primary" size="large" v-show="!toEdit" @click="toEdit=true">编辑</Button>
            <Button type="primary" size="large" v-show="toEdit" @click="saveData">保存</Button>
            </Col>
        </Row>
        <!--弹出框-->
        <Modal v-model="openAuditor" title="选择审核权限" width="1100"  @on-ok="certainRole">
            <roleSelect @rolesSetected="rolesSetected" :mod_rightDisplay="roleHas" :roleIds="roleIds" ></roleSelect>
        </Modal>
        <Modal v-model="selectAuditor" title="选择审核人" width="1100" @on-ok="certainAccountRole">
            <roleAccount @rolesAccountSetected="rolesAccountSetected" :modaccount_rightDisplay="roleAccountHas" ref="c1"></roleAccount>
        </Modal>
    </div>
</template>

<script type="text/ecmascript-6">
    import roleSelect from '../treeMulitiple/roleSelect.vue';
    import roleAccount from '../treeMulitiple/roleAccount.vue';
    export default {
        data(){
            return {
                auditAmount:'1',
                range_setting:-1,//范围设置
                audit_permission:'',//审核权限
                auditor:'',//审核人
                toEdit:false,
                roleIds:'',
                userIds:'',
                //枚举
                rangeSettings:this.$base_info.tEamPlanAuditSettingRangeSettingsEnum,
                auditPermission:'',
                auditors:[],
                auditorsIds:[],
                openAuditor:false,
                selectAuditor:false,
                //删除当前所选择的对象
                qmsIssueId:'',
                tableData:[],
                roleHas:[],//已渲染角色
                resItem:"",//维修响应的当前已选项
                roleIndex: '',
                rolePre:[],//已选但未确定角色
                roleSelected:[],//已选角色
                roleAccountHas:[],
                resAccountItem:"",
                roleAccountPre:[],
                roleAccountSelected:[],
                roleaccount:[],
                roles:[],
                tableDataArr3: [],
                columns:[
                    {
                        title:"序号",
                        type:'index',
                        align:"center",
                    },
                    {
                        title:"姓名",
                        key:"localName",
                        align:"center"
                    },
                    {
                        title:"编号",
                        key:"id",
                        align:"center"
                    }
                ],
                tempPage_persons:"1"
            }
        },
        components: {
            'roleSelect': roleSelect,
            'roleAccount': roleAccount
        },
        mounted(){
            this.getTableData();
        },
        methods: {
            addTpmAuditGuide: function () {
                let obj = {
                    id:"",
                    auditAmount:1,
                    range_setting:"",
                    roles:"",
                    roleIds:"",
                    roleIdArr: [],
                    roleArr: [],
                    userIdArr: [],
                    userArr: [],
                    roleaccount:"",
                };
                this.tableDataArr3.push(obj);
            },

            //已选项：
            rolesSetected(message){
                console.log("已选角色项---------------》");
                console.log(message);
                this.rolePre=message;
            },
            rolesAccountSetected(message){
                console.log("已选角色账户项---------------》");
                console.log(message);
                this.roleAccountPre=message;
            },
            //角色选择放大镜：
            roleModShos(item){
                this.resItem=item;
                this.roleHas = [];
                if(this.tableDataArr3[this.resItem].roleArr){
                    this.roleHas = this.tableDataArr3[this.resItem].roleArr;
                    this.rolePre = this.roleHas;
                }
                this.openAuditor = true;
            },
            roleAccountMod(item){
                this.resAccountItem=item;
                this.selectAuditor = true;
                //this.roleIndex = item;
                this.roleAccountHas = [];
                if(this.tableDataArr3[this.resAccountItem].userArr){
                    this.roleAccountHas = this.tableDataArr3[this.resAccountItem].userArr;
                    this.roleAccountPre = this.roleAccountHas;
                }
                //console.log(this.tableDataArr3[this.resAccountItem].roleIds)
                this.$refs.c1.theMethods(this.tableDataArr3[this.resAccountItem].roleIds);
                if(!this.tableDataArr3[this.resAccountItem].roles){
                    this.selectAuditor = false;
                    this.$Message.success('请先选择审核权限！');
                }
            },
            //确定选择：
            certainRole(){
                let objectData = this.tableDataArr3;
                objectData[this.resItem].roles = "";
                objectData[this.resItem].roleIds = "";
                objectData[this.resItem].roleArr = [];
                objectData[this.resItem].roleIdArr = [];
                //this.roleSelected=[];
//                this.tableDataArr3[this.resItem].roles="";
//                this.tableDataArr3[this.resItem].rolesId='';
                for(let i=0;i<this.rolePre.length;i++){
                    //this.roleSelected[i]=this.rolePre[i];
                    objectData[this.resItem].roleArr.push(this.rolePre[i]);
                    objectData[this.resItem].roleIdArr.push(this.rolePre[i].id);
                    if(i==this.rolePre.length-1){
                        objectData[this.resItem].roles=objectData[this.resItem].roles+this.rolePre[i].name;;
                        objectData[this.resItem].roleIds= objectData[this.resItem].roleIds+this.rolePre[i].id;
                    }
                    else{
                        objectData[this.resItem].roles=objectData[this.resItem].roles+this.rolePre[i].name + "、";
                        objectData[this.resItem].roleIds=objectData[this.resItem].roleIds+ this.rolePre[i].id + ",";
                    };
                }
               console.log(objectData[this.resItem].roleIdArr);
            },
            certainAccountRole(){
                this.roleAccountSelected=[];
                this.tableDataArr3[this.resAccountItem].roleaccount="";
                this.tableDataArr3[this.resAccountItem].usersId="";
                this.tableDataArr3[this.resAccountItem].userArr = [];
                this.tableDataArr3[this.resAccountItem].userIdArr = [];
                for(let i=0;i<this.roleAccountPre.length;i++){
//                    this.roleAccountSelected[i]=this.roleAccountPre[i];
                    this.tableDataArr3[this.resAccountItem].userArr.push(this.roleAccountPre[i]);
                    this.tableDataArr3[this.resAccountItem].userIdArr.push(this.roleAccountPre[i].id);
                    if(i==this.roleAccountPre.length-1){
                        this.tableDataArr3[this.resAccountItem].roleaccount=this.tableDataArr3[this.resAccountItem].roleaccount+this.roleAccountPre[i].localName;
                        this.tableDataArr3[this.resAccountItem].usersId=this.tableDataArr3[this.resAccountItem].usersId+this.roleAccountPre[i].id;
                    }
                    else{
                        this.tableDataArr3[this.resAccountItem].roleaccount=this.tableDataArr3[this.resAccountItem].roleaccount+this.roleAccountPre[i].localName+"、";
                        this.tableDataArr3[this.resAccountItem].usersId=this.tableDataArr3[this.resAccountItem].usersId+this.roleAccountPre[i].id+",";
                    };
                }
//                var userIds = "";
//                for(let j in this.roleAccountSelected){
//                    userIds += ','+ this.roleAccountSelected[j].id
//                }
//                this.userIds = userIds.substring(1);
//                console.log(this.userIds);
            },

            //列表展示
            getTableData(){
                let vt = this;
                this.$axios.get("/System/audit/list").then((res) => {
                    let result = res.data.response;
                    let resArr = result.data;
                    if(result.code != 1){
                        vt.$Message.error(result.msg);
                    }
                    else{
                        for (let i = 0; i < resArr.length; i++){
                            let obj = {
                                id:"",
                                auditAmount:"",
                                range_setting:"",
                                roles:"",
                                roleIds:"",
                                roleIdArr: [],
                                roleArr: [],
                                userIdArr: [],
                                userArr: [],
                                roleaccount:"",
                            };
                            obj.id = resArr[i].id;//id
                            obj.auditAmount =  resArr[i].auditAmount;//审核额度
                            obj.range_setting = resArr[i].rangeSettings;//范围设置
                            for (let j = 0; j < resArr[i].auditUsers.length; j++){//审核人
                                let auditUsersObj = {};
                                auditUsersObj.localName = resArr[i].auditUsers[j].localName;
                                auditUsersObj.id = resArr[i].auditUsers[j].id;
                                obj.userArr.push(auditUsersObj);//审核人数组
                                obj.userIdArr.push(resArr[i].auditUsers[j].id);//id数组
                                if (j == resArr[i].auditUsers.length - 1){
                                    obj.roleaccount = obj.roleaccount + resArr[i].auditUsers[j].localName;

                                }
                                else{
                                    obj.roleaccount = obj.roleaccount + resArr[i].auditUsers[j].localName + "、";
                                }
                            }
                            for (let j = 0; j < resArr[i].roles.length; j++){
                                obj.roleIdArr.push(resArr[i].roles[j].id);
                                let roleObg = {};
                                roleObg.name = resArr[i].roles[j].name;
                                roleObg.id = resArr[i].roles[j].id;
                                obj.roleArr.push(roleObg);//审核权限数组
                                if (j == resArr[i].roles.length - 1){
                                    obj.roles = obj.roles + resArr[i].roles[j].name;
                                    obj.roleIds = obj.roleIds + resArr[i].roles[j].id;
                                }
                                else{
                                    obj.roles = obj.roles + resArr[i].roles[j].name + "、";
                                    obj.roleIds = obj.roleIds + resArr[i].roles[j].id + ",";
                                }

                            };
                            console.log(obj.roleIdArr);
                            console.log(obj.roleIds);
                            vt.tableDataArr3.push(obj);
                        };

                    }
//                    if(res.data.response.code == 1){
//                        let dataInfo = res.data.response.data;
//                        let tableDataInfo = [];
//                        let tempRoleArr = [];
//                        for (let q in dataInfo){
//                            var nameStr = "";
//                            dataInfo[q].auditUsers.map(function(v,i){
//                                nameStr+=v.localName+","
//                            });
//                            var rolesNameStr = "";
//                            var inTempRoleArr = [];
//                            dataInfo[q].roles.map(function(v,i){
//                                rolesNameStr+=v.name+","
//                                inTempRoleArr.push({"id":v.id,"name":v.name})
//                            });
//                            rolesNameStr=rolesNameStr.substring(0,rolesNameStr.length-1);
//                            nameStr=nameStr.substring(0,nameStr.length-1);
//                            this.roles.push(rolesNameStr);
//                            this.roleaccount.push(nameStr);
//                            tableDataInfo.push({
//                                "id":dataInfo[q].id,
//                                "auditAmount":dataInfo[q].auditAmount,
//                                "range_setting":dataInfo[q].rangeSettings,
//                                "roles":this.roles[q],
//                                "roleaccount":this.roleaccount[q]
//                            });
//                        }
//                        console.log(tableDataInfo);
//                        console.log(this.roleaccount);
//                        vt.tableDataArr3 = tableDataInfo;
//                    }else{
//
//                    }
                }).catch(error => {

                })
            },
            cancel(){
//                this.toEdit = false;
                setTimeout(() => {
                    this.toEdit = false;
                    this.tableDataArr3 = [];
                    this.getTableData();
                }, 500);
            },
            deleteItem(id,index){
                if(!id){
                    this.tableDataArr3.splice(index,1);
                    return
                }
                let vt = this;
                this.$axios.post("/System/audit/delete",{
                    "settingId":id
                }).then((res) => {
                    console.log(res.data.response);
                    if(res.data.response.code == 1){
                        this.$Message.success('删除成功！');
                        setTimeout(() => {
                            this.toEdit = false;
                            this.tableDataArr3 = [];
                            this.getTableData();
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
            saveData(){
                var oneSettings = [];
                for(var i = 0; i< this.tableDataArr3.length; i++ ){
                    let obj = {};
                    obj.auditAmount = this.tableDataArr3[i].auditAmount;
                    obj.rangeSettings = this.tableDataArr3[i].range_setting;
                    obj.roleIds = this.tableDataArr3[i].roleIdArr//审核权限的id数组
                    if (!this.tableDataArr3[i].roleIdArr) {
                        this.$Message.error('审核权限不能为空!');
                        return;
                    };
                    obj.userIds = this.tableDataArr3[i].userIdArr;//审核人的Id数组
                    oneSettings.push(obj);
//                    let roleIds = this.tableDataArr3[i].rolesId.split(',');
//                    let userIds = this.tableDataArr3[i].usersId.split(',');
//                    oneSettings.push({
//                        auditAmount: this.tableDataArr3[i].auditAmount,
//                        rangeSettings: this.tableDataArr3[i].range_setting,
//                        roleIds: roleIds,
//                        userIds: userIds
//                    })
                }
                let vt = this;
                this.$axios.post("/System/audit/save",{
                    oneSettings: oneSettings
                }).then((res) => {
                    var res = res.data.response;
                    console.log(res)
                    if(res.code == 1){
                        this.$Message.success('保存成功');
                        setTimeout(() => {
                            this.toEdit = false;
                            this.tableDataArr3 = [];
                            this.getTableData();
                        }, 500);
                    }else {
                        this.$Message.error(res.msg);
                    }

                }).catch((err) => {
                    console.log(err);
                });
            }
        }
    }
</script>

<style type="text/css">
    .ivu-input-number-input[disabled]{
        text-align: right;
    }
    .ivu-select-selected-value{
        text-align: left;
    }
</style>
