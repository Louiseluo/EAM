<template>
    <div class="basic bzzy-search">
        <!--模块名称-->
        <div class="title">
            <span>人员档案 -- {{editAbleTitle}}</span>
        </div>
        <div class="second-title">人员基本信息</div>
        <!--表单-->
        <Form ref="archivesForm" :model="archivesForm" :rules="archivesFormValidate" :label-width="100" class="equ_addForm">
            <div class="form-content">
                <Row>
                    <Col :span="3">
                    <div class="imgDiv" style="padding-bottom:30px;">
                        <div class="uploadImg" style="width: 100%;height: 200px;left: 15px;top: 15px;">
                            <!--<p style="text-align: center;margin: 10px 0;" v-if="imgDis||!toEdit">人员照片：</p>-->
                            <div>
                                <p style="text-align:center;margin-top:30%;color:red" v-if="!imgDis&&toEdit">暂无照片!</p>
                                <!--<Carousel v-if="imgDis||!toEdit">-->
                                    <div v-for="(itemImg ,index) in upLoadFiles" :key="index" >
                                        <div class="demo-carousel">
                                            <div class="demo-upload-list" style="border: 1px solid #ccc;width: 100%;height: 200px;margin: auto;display: flex;">
                                                <!--<img :src=" '../static/'+ itemImg.savePath" style="width:100%;height:100%;object-fit: cover;">-->
                                                <img :src="'/static/'+ itemImg.savePath" style="width:100%;height:100%;object-fit: cover;">
                                                <div class="demo-upload-list-cover">
                                                    <div style="padding-top:20%;">
                                                        <Icon type="ios-eye-outline" @click.native="handleView(index)"></Icon>
                                                        <Icon type="ios-trash-outline" @click.native="handleRemove(index)"></Icon>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div v-if="!toEdit">
                                        <div class="demo-carousel" style="position: absolute;top: 0;bottom: 0;left: 0;right: 0;">
                                            <PandoraUpload
                                                    ref="upload"
                                                    :format="['jpg','jpeg','png']"
                                                    header="{
                                                'Accept': 'application/json, text/plain, /'
                                                }"
                                                    :max-size="2048"
                                                    :show-upload-list="false"
                                                    :action="uploadUrl()"
                                                    :fileSavePath="'/eam/'"
                                                    @on-up-multiple-success = "upSuccess"
                                                    :on-format-error="handleFormatError" style="width: 100%;margin: auto">
                                                <div class="Img" style="border: 1px solid #ccc;width: 100%;height: 200px;margin: 0 auto;margin: auto;display: flex;">
                                                    <Icon type="camera" size="20" style="margin: auto"></Icon>
                                                </div>
                                            </PandoraUpload>
                                        </div>
                                    </div>
                                <!--</Carousel>-->
                            </div>
                            <!--<div class="btn-query" style="position: absolute;left: 230px;top: 165px;width: 50px;">-->
                            <!--<Button type="primary" size="small">管理</Button>-->
                            <!--<Button type="primary" size="small">上传</Button>-->
                            <!--</div>-->
                        </div>
                    </div>
                    </Col>
                    <Col :span="21">
                    <Row>
                        <Col :span="6">
                        <Form-item label="姓名" prop="name">
                            <Input v-model="archivesForm.name"  :disabled="editAble"></Input>
                        </Form-item>
                        </Col>
                        <Col :span="6">
                        <Form-item label="性别" prop="sex">
                            <Select v-model="archivesForm.sex"  :disabled="editAble">
                                <Option v-for="item in sexEm" :value="item.code" :key="item.code">{{ item.desc }}</Option>
                            </Select>
                        </Form-item>
                        </Col>
                        <Col :span="6">
                        <Form-item label="部门" prop="departmentName">
                            <!--<Input v-model="searchForm.departmentName" @on-blur="searchForm.departmentName = toValidate(searchForm.departmentName)"></Input>-->
                            <div style="color:#ffffff" onmousemove="this.style.color='#5b5b5b';" onmouseout="this.style.color='#ffffff'">
                        <span @click="deleteManuf" v-if="archivesForm.departmentName">
                            <Icon type="ios-close" class="deleteTab"></Icon>
                        </span>
                                <div class="input-search pointDis" @click="dep_mod = true">
                                    <Input v-model="archivesForm.departmentName" :readonly=true  :disabled="editAble" :autofocus="deptFocus"></Input>
                                    <Button icon="ios-search"></Button>
                                </div>
                            </div>
                        </Form-item>
                        </Col>
                        <Col :span="6">
                        <Form-item label="岗位" prop="positionName">
                            <div style="color:#ffffff" onmousemove="this.style.color='#5b5b5b';" onmouseout="this.style.color='#ffffff'">
                        <span @click="deletePos" v-if="archivesForm.positionName">
                            <Icon type="ios-close" class="deleteTab"></Icon>
                        </span>
                                <div class="input-search pointDis" @click="pos_mod = true">
                                    <Input v-model="archivesForm.positionName" :readonly=true  :disabled="editAble"></Input>
                                    <Button icon="ios-search"></Button>
                                </div>
                            </div>
                        </Form-item>
                        </Col>
                    </Row>
                    <Row>
                        <Col :span="6">
                        <Form-item label="年龄" prop="age">
                            <InputNumber v-model="archivesForm.age" style="width: 100%" :disabled="editAble" :min="1" :max="99" @on-change="checkIntAge"></InputNumber>
                        </Form-item>
                        </Col>
                        <Col :span="6">
                        <Form-item label="出生年月" prop="birthday">
                            <Input v-model="archivesForm.birthday"  :disabled="editAble"></Input>
                        </Form-item>
                        </Col>
                        <Col :span="6">
                        <Form-item label="身份证号码" prop="idCard">
                            <Input v-model="archivesForm.idCard"  :disabled="editAble"></Input>
                        </Form-item>
                        </Col>
                        <Col :span="6">
                        <Form-item label="班组" prop="productionTeamName">
                            <div style="color:#ffffff" onmousemove="this.style.color='#5b5b5b';" onmouseout="this.style.color='#ffffff'">
                        <span @click="deleteTeam" v-if="archivesForm.productionTeamName">
                            <Icon type="ios-close" class="deleteTab"></Icon>
                        </span>
                                <div class="input-search pointDis" @click="team_mod = true">
                                    <Input v-model="archivesForm.productionTeamName" :readonly=true  :disabled="editAble" :autofocus="teamFocus"></Input>
                                    <Button icon="ios-search"></Button>
                                </div>
                            </div>
                        </Form-item>
                        </Col>
                    </Row>
                    <Row>
                        <Col :span="6">
                        <Form-item label="班次" prop="shiftName">
                            <div style="color:#ffffff" onmousemove="this.style.color='#5b5b5b';" onmouseout="this.style.color='#ffffff'">
                        <span @click="deleteShift" v-if="archivesForm.shiftName">
                            <Icon type="ios-close" class="deleteTab"></Icon>
                        </span>
                                <div class="input-search pointDis" @click="shift_mod = true">
                                    <Input v-model="archivesForm.shiftName" :readonly=true  :disabled="editAble" :autofocus="shiftFocus"></Input>
                                    <Button icon="ios-search"></Button>
                                </div>
                            </div>
                        </Form-item>
                        </Col>
                        <Col :span="6">
                        <Form-item label="RFID卡号" prop="rfidCardNo">
                            <Input v-model="archivesForm.rfidCardNo"  :disabled="editAble"></Input>
                        </Form-item>
                        </Col>
                        <Col :span="6">
                        <Form-item label="入职时间" prop="entryTime">
                            <Input v-model="archivesForm.entryTime"  :disabled="editAble"></Input>
                        </Form-item>
                        </Col>
                        <Col :span="6">
                        <Form-item label="工龄" prop="lengthOfService">
                            <InputNumber v-model="archivesForm.lengthOfService" style="width: 100%" :disabled="editAble" :min="1" :max="99" @on-change="checkInt"></InputNumber>
                        </Form-item>
                        </Col>
                    </Row>
                    <Row>
                        <Col :span="6">
                        <Form-item label="状态" prop="status">
                            <Select v-model="archivesForm.status"  :disabled="editAble">
                                <Option v-for="item in statusEm" :value="item.code" :key="item.code">{{ item.desc }}</Option>
                            </Select>
                        </Form-item>
                        </Col>
                    </Row>
                    <Row>
                        <Col :span="12">
                        <Form-item label="住宅地址" prop="homeAddress">
                            <Input type="textarea" :rows="3" v-model="archivesForm.homeAddress" :disabled="editAble" :maxlength="100"></Input>
                        </Form-item>
                        </Col>
                    </Row>
                    <!--<Form-item label="工号" prop="code">
                        <Input v-model="archivesForm.code" style="width: 160px;" :disabled="editAble"></Input>
                    </Form-item>-->
                    </Col>
                </Row>
            </div>
            <div class="second-title">人员通讯方式</div>
            <div class="form-content">
                <Row>
                    <Col :span="7">
                    <Form-item label="邮箱" prop="email">
                        <Input v-model="archivesForm.email"  :disabled="editAble"></Input>
                    </Form-item>
                    </Col>
                    <Col :span="7">
                    <Form-item label="手机" prop="mobile">
                        <Input v-model="archivesForm.mobile"  :disabled="editAble"></Input>
                    </Form-item>
                    </Col>
                    <Col :span="7">
                    <Form-item label="微信" prop="weixin">
                        <Input v-model="archivesForm.weixin"  :disabled="editAble"></Input>
                    </Form-item>
                    </Col>
                </Row>
            </div>
            <div class="second-title">其他信息</div>
            <div class="form-content">
                <Row>
                    <Col :span="13">
                    <Form-item label="备注信息" prop="note">
                        <Input type="textarea" :rows="3" v-model="archivesForm.note" :disabled="editAble" :maxlength="500"></Input>
                    </Form-item>
                    </Col>
                    <Col :span="13">
                    <Form-item label="任职资格" prop="qualifications">
                        <Input type="textarea" :rows="3" v-model="archivesForm.qualifications" :disabled="editAble" :maxlength="500"></Input>
                    </Form-item>
                    </Col>
                    <Col :span="13">
                    <Form-item label="奖罚记录" prop="record">
                        <Input type="textarea" :rows="3" v-model="archivesForm.record" :disabled="editAble" :maxlength="500"></Input>
                    </Form-item>
                    </Col>
                </Row>
            </div>
            <div align="center" class="btnGroupDesign">
            <Button v-if="if_edit" type="primary" icon="document-text" size="large" v-show="toEdit" @click="goEdit">编辑</Button>
            <Button v-if="if_save" type="primary" icon="document-text" size="large" v-show="!editAble" @click="goSave('archivesForm')">保存</Button>
            <Button v-if="if_back" class="btn-gary" icon="chevron-left" @click="backHandle">返回</Button>
        </div>
        </Form>
        <!--使用部门-->
        <!--<Modal v-model="deptModel" title="使用部门" @on-ok="deptSelected">-->
            <!--<div class="form-content">-->
                <!--<Form>-->
                    <!--<Form-item label="部门名称" prop="deptName">-->
                        <!--<Input v-model="deptName" @on-blur="deptName=toValidate(deptName)" style="width: 160px"></Input>-->
                    <!--</Form-item>-->
                <!--</Form>-->
                <!--&lt;!&ndash;查询按钮&ndash;&gt;-->
                <!--<div style="text-align: right;padding-right: 20px">-->
                    <!--<Button type="primary" icon="search" size="large" @click="loadDept">查询</Button>-->
                <!--</div>-->
            <!--</div>-->
            <!--<div class="table-reset">-->
                <!--<Table highlight-row border ref="currentRowTable" class="taDisplay" :columns="columns_dept" :data="deptList" @on-row-click="toSelectDept"></Table>-->
            <!--</div>-->
            <!--<div class="mar-t-10" style="overflow: hidden">-->
                <!--<div style="float: right;">-->
                    <!--<Page size="small" :total='deptTotal' show-elevator :page-size="pageSize" @on-change="deptChange"></Page>-->
                <!--</div>-->
            <!--</div>-->
        <!--</Modal>-->
        <!--图片预览：-->
        <Modal title="查看照片" v-model="img_modal">
            <img :src="imgView" v-if="img_modal" style="width: 100%">
            <div slot="footer">
                <Button type="primary" @click="img_modal=false">关闭</Button>
            </div>
        </Modal>
        <!-- 部门 -->
        <Modal v-model="dep_mod" title="部门" @on-ok="toSelect_dep">
            <departmentMod @depSelected="dep_hasSelected"></departmentMod>
        </Modal>
        <!-- 岗位 -->
        <Modal v-model="pos_mod" title="岗位" @on-ok="toSelect_pos">
            <positionMod @posSelected="pos_hasSelected"></positionMod>
        </Modal>
        <!-- 班组 -->
        <Modal v-model="team_mod" title="班组" @on-ok="toSelect_team">
            <teamMod @teamSelected="team_hasSelected"></teamMod>
        </Modal>
        <!-- 班次 -->
        <Modal v-model="shift_mod" title="班次" @on-ok="toSelect_shift">
            <shiftMod @shiftSelected="shift_hasSelected"></shiftMod>
        </Modal>
    </div>
</template>
<script type="text/ecmascript-6">
    import PandoraUpload from '../../api/pandora-upload/pandoraUpload.vue';
    import departmentMod from '../treeMulitiple/departmentMod.vue';
    import positionMod from '../treeMulitiple/positionMod.vue';
    import teamMod from '../treeMulitiple/teamMod.vue';
    import shiftMod from '../treeMulitiple/shiftMod.vue';
    export default{
        data () {
            const validatePass = (rule, value, callback) => {
                let reg = /^1[0-9]{10}$/;
                if (value === '') {
                    callback(new Error('请输入手机号！'));
                } else {
                    let flag = reg.test(value);
                    if (!flag) {
                        // 对第二个密码框单独验证
                        callback(new Error('请正确输入手机号！'));
                    }
                    callback();
                }
            };
            return{
                //权限校验
                if_back: this.$rt(this.authJson.EAM.人员管理.人员档案详情页.返回),
                if_edit: this.$rt(this.authJson.EAM.人员管理.人员档案详情页.编辑),
                if_save: this.$rt(this.authJson.EAM.人员管理.人员档案编辑页.保存),
                editFlag:'',
                editAbleTitle:'',
                openDate:false,
                editAble: true,
                saveAble: false,
                flag: true,
                created: false,
                thePageId: '',
                archivesForm:{
                    //人员基本信息
                    code:'',
                    name: "",                               //姓名
                    sex: 0,                                //性别
                    departmentId: "",                    //部门
                    departmentName: "",                    //部门
                    positionId: "",                        //岗位
                    positionName:'',
                    code: "",                             //工号
                    age: 1,                                 //年龄
                    birthday: "",                           //出生年月
                    idCard: "",                              //身份证号码
                    productionTeamName: "",                //班组
                    shiftName: "",                          //班次
                    rfidCardNo: "",                         //RFID卡号
                    entryTime: "",                          //入职时间
                    lengthOfService: 1,                    //工龄
                    status: "",                              //状态
                    homeAddress: "",                         //住宅地址
                    personId: "",                             //人员id
                    //人员通讯方式
                    email: "",                //邮箱
                    mobile: "",               //手机
                    weixin: "",               //微信
                    //其他信息
                    note: "",                  //备注信息
                    qualifications: "",       //任职资格
                    record: "",                //奖罚记录
                    //关于编辑
                    equipmentDetailId: "",
                    accessUrl: "",
                    manufacturerId: "",
                    modelId: "",
                    typeId: "",
//                    attachmentResUserVoList:[],
                    photoUrl: "",
                },
                /********* 使用部门 ************/
                columns_dept:[
                    {
                        title:'序号',
                        type: 'index',
                        width: 120,
                        align: 'center'
                    },
                    {
                        title: '部门名称',
                        key: 'tBdDepartmentName',
                        align:'center',
                        render:(h,params) => {
                            return h('p',{
                                domProps:{
                                    title:params.row.tBdDepartmentName,
                                },
                                class:'iview_tabDis'
                            },params.row.tBdDepartmentName)
                        }
                    },
                    {
                        title: '部门负责人名称',
                        key: 'tBdPersonName',
                        align:'center',
                        render:(h,params) => {
                            return h('p',{
                                domProps:{
                                    title:params.row.tBdPersonName,
                                },
                                class:'iview_tabDis'
                            },params.row.tBdPersonName)
                        }
                    },
                ],
                deptList:[],
                deptModel:false,
                deptFocus:false,
                deptName:'',
                deptTotal:0,
                //展示图:
                toEdit: true,
                img_modal: false,
                imgView: '',
                imgDis: false,
                uploadList: '',
                equ_states: [],
                equKindId: '',
                photos:[],
                upLoadFiles:[],
                //验证
                archivesFormValidate: {
                    code: [
                        { required: true, message: '请填写编码', trigger: 'blur' }
                    ],
                    name: [
                        { required: true, message: '请填写名称', trigger: 'blur' }
                    ],
                    sex: [
                        { required: true, type: 'number', message: '请选择性别', trigger: 'blur' }
                    ],
                    idCard: [
                        { required: true, message: '请填写身份证号码', trigger: 'blur' }
                    ],
                    departmentName: [
                        { required: true, message: '请选择部门', trigger: 'change' }
                    ],
                    positionName: [
                        { required: true, message: '请选择岗位', trigger: 'change' }
                    ],
                    productionTeamName: [
                        { required: true, message: '请选择班组', trigger: 'change' }
                    ],
                    shiftName: [
                        { required: true, message: '请选择班次', trigger: 'change' }
                    ],
                    code: [
                        { required: true, message: '请填写工号', trigger: 'blur' }
                    ],
                    email: [
                        { required: true,type: "email", message: '请填写正确邮箱', trigger: 'blur' }
                    ],
                    mobile: [
//                        /^1[0-9]{10}$/
                        { validator: validatePass,required: true, message: '请正确填写手机号', trigger: 'blur' }
                    ],
                    weixin: [
                        { required: true, message: '请填写微信号', trigger: 'blur' }
                    ],
                },
                //枚举初始化
                sexEm:[],
                statusEm:[],
                /*分页*/
                pageSize:10,
                //部门
                dep_mod: false,
                selectDep: {},
                //岗位
                pos_mod: false,
                selectPos: {},
                //班组
                team_mod: false,
                selectTeam: {},
                teamFocus:false,
                //班次
                shift_mod: false,
                selectShift: {},
                shiftFocus:false,
            }
        },
        activated: function () {
            this.created && this.fileDetail();
            this.created = true;
        },
        mounted(){
            this.thePageId = this.$route.query.id;

            this.editFlag = this.$route.query.editFlag;
            this.sexEm = this.$base_info.tEamPersonSexEnum;
            this.sexEm.forEach(function (val, index, arry) {
                val.code == -1 ? arry.splice(index,1): arry.splice(index,0);
            });
            this.statusEm = this.$base_info.tEamPersonStatusEnum;
            this.statusEm.forEach(function (val, index, arry) {
                val.code == -1 ? arry.splice(index,1): arry.splice(index,0);
            });
//            console.log(this.sexEm)
            if(this.editFlag== 0){
                this.editAbleTitle = "详情";
                this.editAble = true;
                this.openDate = false;
                this.archivesForm.personId = this.thePageId;
                this.fileDetail();
            }else if(this.editFlag== 1){
                this.editAbleTitle = "新建";
                this.editAble = false;
                this.toEdit = false;
//                this.fileDetail();
            }else if(this.editFlag== 2){
                this.editAbleTitle = "编辑";
                this.editAble = false;
                this.archivesForm.personId = this.thePageId;
                this.fileDetail();
            }
        },
        components: {
            PandoraUpload,
            'departmentMod': departmentMod,
            'positionMod': positionMod,
            'teamMod': teamMod,
            'shiftMod': shiftMod,
        },
        methods:{
            //人员档案详情渲染
            fileDetail(){
                let vm = this;
                this.$axios.post('/System/personList', {
                    personId: vm.thePageId,
//                    status: vm.archivesForm.status === "" ? 0 : vm.archivesForm.status,
                }).then((res) => {
                    let result = res.data.response;
//                    console.log('vm.archivesForm.99889 === '+ JSON.stringify(result))
                    if (result.code  === 1) {
                        result.data.age == ""? result.data.age = 1 : result.data.age = parseInt(result.data.age);
                        result.data.lengthOfService == ""? result.data.lengthOfService = 1 : result.data.lengthOfService = parseInt(result.data.lengthOfService);
//                        console.log('vm.archivesForm.99889 === '+ JSON.stringify(result))
                        vm.archivesForm = result.data;
                        vm.archivesForm.status = result.data.status;
                        vm.archivesForm.personId = vm.thePageId;
                        vm.archivesForm.code = result.data.personCode;
//                    console.log('vm.archivesForm.status === '+ result.data.status)
//                        vm.archivesForm.userId = result.data.userId;
                        //图片相关
                        if (result.data.photoUrl!= "") {
                            vm.imgDis = true;
                            vm.upLoadFiles = [];
                            vm.upLoadFiles.push({
                                savePath: result.data.photoUrl
                            })
                        };
                    } else {
                        //业务失败的情况
                        this.$Message.error({
                            content: '数据返回错误',
                            duration: 5,
                            closable: true
                        });
                    }
                }).catch((err) => {
                    console.log("无数据 + " + err);
                });
            },
            /*//使用部门－Start
            openDeptMold(){
                this.deptModel = true;
                this.loadDept();
            },
            loadDept(){
                let vm = this;
                this.$axios.post('/common/departmentName', {
                    page: vm.page,
                    pageSize: vm.pageSize,
                    departmentName : vm.deptName,
                }).then((res) => {
                    let respone = res.data.response;
                    if (respone.code  === 1) {
                        this.deptList = respone.data.Rows;
                        this.deptTotal = respone.data.Total;
                    } else {
                        //.. 业务失败的情况
                        this.$Message.error({
                            content: '数据返回错误',
                            duration: 5,
                            closable: true
                        });
                    }
                }).catch((err) => {
                    console.log("无数据 + " + err);
                });
            },
            deptSelected(){
//                console.log("selectRowDept + " + JSON.stringify(this.selectRowDept))
                let sid = this.selectRowDept.tBdDepartmentId;
                this.archivesForm.tBdDepartmentName = this.selectRowDept.tBdDepartmentName;
                this.archivesForm.tBdDepartmentId = sid;
                this.archivesForm.userId = this.selectRowDept.tBdPersonId;
                this.archivesForm.userName = this.selectRowDept.tBdPersonName;
                this.deptFocus = false;
            },
            toSelectDept(rowData){
                this.selectRowDept = rowData;
            },
            emptyDept(){
                this.archivesForm.tBdDepartmentName = "";
                this.archivesForm.tBdDepartmentId = "";
                this.archivesForm.userId = "";
                this.archivesForm.userName = "";
                this.deptFocus = true;
            },
            /!*分页*!/
            deptChange(crrentPage){
                this.page = crrentPage;
                this.loadDept();
            },
            //使用部门－End*/
            //部门
            dep_hasSelected(msg) {
                this.selectDep = msg;
            },
            toSelect_dep() {
                this.archivesForm.departmentId = this.selectDep.tBdDepartmentId;
                this.archivesForm.departmentName = this.selectDep.tBdDepartmentName;
                this.deptFocus = false;
            },
            deleteManuf() {
                this.archivesForm.departmentId = '';
                this.archivesForm.departmentName = '';
                this.deptFocus = true;
            },
            //岗位
            pos_hasSelected(msg) {
                this.selectPos = msg;
            },
            toSelect_pos() {
                this.archivesForm.positionId = this.selectPos.tBdPositionId;
                this.archivesForm.positionName = this.selectPos.tBdPositionName;
            },
            deletePos() {
                this.archivesForm.positionId = '';
                this.archivesForm.positionName = '';
            },
            //班组
            team_hasSelected(msg) {
                this.selectTeam = msg;
            },
            toSelect_team() {
                this.archivesForm.productionTeamId = this.selectTeam.productionTeamId;
                this.archivesForm.productionTeamName = this.selectTeam.productionTeamName;
            },
            deleteTeam() {
                this.archivesForm.productionTeamId = '';
                this.archivesForm.productionTeamName = '';
            },
            //班次
            shift_hasSelected(msg) {
                this.selectShift = msg;
            },
            toSelect_shift() {
                this.archivesForm.shiftId = this.selectShift.shiftId;
                this.archivesForm.shiftName = this.selectShift.shiftName;
            },
            deleteShift() {
                this.archivesForm.shiftId = '';
                this.archivesForm.shiftName = '';
            },
            //编辑
            goEdit() {
                this.editAble = false;
                this.saveAble = true;
                this.flag = false;
                this.toEdit = false;
            },
            //保存
            goSave(name) {
                let vt = this;
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        let photoUrl = vt.upLoadFiles.length == 0 ? '': vt.upLoadFiles[0].savePath
                        let saveAry = {
                            "code": vt.archivesForm.code,
                            "age": vt.archivesForm.age,
                            "birthday": vt.archivesForm.birthday,
                            "departmentId": vt.archivesForm.departmentId,
                            "email": vt.archivesForm.email,
                            "entryTime": vt.archivesForm.entryTime,
                            "homeAddress": vt.archivesForm.homeAddress,
                            "idCard": vt.archivesForm.idCard,
                            "lengthOfService": vt.archivesForm.lengthOfService,
                            "mobile": vt.archivesForm.mobile,
                            "name": vt.archivesForm.name,
                            "note": vt.archivesForm.note,
                            "code": vt.archivesForm.code,
                            "personId": vt.archivesForm.personId,
                            "photoUrl":photoUrl ,
                            "positionId": vt.archivesForm.positionId,
                            "productionTeamId": vt.archivesForm.productionTeamId,
                            "qualifications": vt.archivesForm.qualifications,
                            "record": vt.archivesForm.record,
                            "rfidCardNo": vt.archivesForm.rfidCardNo,
                            "sex": vt.archivesForm.sex,
                            "status": vt.archivesForm.status,
                            "weixin": vt.archivesForm.weixin,
                            "shiftId": vt.archivesForm.shiftId
                        };
//                        console.log("saveAry + " + JSON.stringify(saveAry))
                        this.$axios.post('/System/personSave', saveAry).then((res) => {
                            let ret = res.data.response;
                            if (ret.code == 1) {
                                vt.$Message.success(ret.data);
                                this.$router.push({path: '/personList', query: {'id': vt.thePageId}});
                            } else {
                                //.. 业务失败的情况
                                vt.$Message.error("失败");
                                vt.$Message.error(ret.msg);
                            }
                        }).catch((err) => {
                            console.log(err);
                        })
                    } else {
                        vt.$Message.error('请完善信息！');
                    }
                })
            },
            //图片上传：
            //图片放大镜：
            handleView(index)
            {
                this.img_modal = true;
                this.imgView = '../static/' + this.upLoadFiles[index].savePath
            },
            //图片删除：
            handleRemove(index)
            {
                if (this.toEdit) {
                    this.$Message.error("查看状态，不可删除");
                    return
                };
                this.upLoadFiles.splice(index,1)
            },
            handleSuccess(response, file, fileList)
            {
//                console.log(response, file, fileList)
            },
            handleFormatError(file)
            {
                this.$Notice.warning({
                    title: '文件格式不正确',
                    desc: '文件 ' + file.name + ' 格式不正确，请上传 jpg 或 png 格式的图片。'
                })
            },
            upSuccess: function (files) {
//                console.log(" 上传完成了.地址： " + JSON.stringify(files));
                this.uploadList = files;
                this.upLoadFiles = this.uploadList

            },
            //返回
            backHandle() {
                this.$router.back();
            },
            //查询时验证输入框不能为英文单双引号
            toValidate(msg) {
                var str = /[=+%!<>"'/_,()\\]/;
                if (str.test(msg)) {
                    this.$Message.warning("输入格式错误");
                    msg = msg.replace(/\'/g,"").replace(/\"/g,"").replace(/\+/g,"").replace(/\=/g,"").replace(/\%/g,"").replace(/\!/g,"").replace(/\</g,"").replace(/\>/g,"").replace(/\//g,"").replace(/\_/g,"").replace(/\,/g,"").replace(/\(/g,"").replace(/\)/g,"").replace(/\\/g,"");
                }
                return msg;
            },
            //检查年龄数字输入框是否为正整数
            checkIntAge(val) {
//                console.log('val ==== '+val)
                if (!Number.isInteger(val)) {
                    this.$Message.error('请输入正整数！');
                } else if (val > 99) {
                    this.$Message.error('最大值不超过2位数！');
                }
            },
            //检查工龄数字输入框是否为正整数
            checkInt(val) {
//                console.log('val ==== '+val)
                if (!Number.isInteger(val)) {
                    this.$Message.error('请输入正整数！');
                } else if (val > 50) {
                    this.$Message.error('最大值不超过50！');
                }
            },
        }
    }
</script>
<style>
    .ivu-upload .ivu-upload-select{
        display: block;
    }
</style>