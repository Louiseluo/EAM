<template>
    <div class="basic bzzy-search">
        <!--模块名称-->
        <div class="title">
            <span>设备档案</span>
        </div>
        <!--<div style="width: 100px;height: 55px;margin: 15px 0;"><img style="width: 100%;height: 100%;" src="../../../static/img/ch_logo.jpg" alt=""></div>-->
        <!--<p>设备基本信息</p>-->
        <Form ref="archivesForm" inline :model="archivesForm" :rules="archivesFormValidate" :label-width="100" class="equ_addForm">
            <div class="second-title">设备基本信息</div>
            <!--表单-->
            <div class="form-content">
                <Row>
                    <Col :span="4">
                        <div class="imgDiv" style="padding-bottom:30px;">
                            <div class="uploadImg" style="width: 100%;height: 200px;left: 15px;top: 15px;">
                                <p style="text-align: center;margin: 10px 0;" v-if="imgDis||!toEdit">设备图片：</p>
                                <div style="width: 90% ;margin: auto;">
                                    <p style="text-align:center;margin-top:30%;color:red" v-if="!imgDis&&toEdit">暂无图片!</p>
                                    <Carousel v-if="imgDis||!toEdit">
                                        <CarouselItem v-for="(itemImg ,index) in upLoadFiles" :key="index" >
                                            <div class="demo-carousel">
                                                <div class="demo-upload-list" style="border: 1px solid #ccc;width: 90%;height: 150px;margin: auto;display: flex;">
                                                    <!--<img :src=" '../static/'+ itemImg.savePath" style="width:100%;height:100%;object-fit: cover;">-->
                                                    <img :src=" '/static/'+ itemImg.savePath" style="width:100%;height:100%;object-fit: cover;">
                                                    <div class="demo-upload-list-cover">
                                                        <div style="padding-top:20%;">
                                                            <Icon type="ios-eye-outline" @click.native="handleView(index)"></Icon>
                                                            <Icon type="ios-trash-outline" @click.native="handleRemove(index)"></Icon>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </CarouselItem>
                                        <CarouselItem v-if="!toEdit">
                                            <div class="demo-carousel">
                                                <PandoraUpload
                                                        multiple
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
                                                        :on-format-error="handleFormatError"
                                                        style="width: 100%;margin: auto">
                                                    <div class="Img" style="border: 1px solid #ccc;width: 100%;height: 150px;margin: 0 auto;margin: auto;display: flex;">
                                                        <Icon type="camera" size="20" style="margin: auto"></Icon>
                                                    </div>
                                                </PandoraUpload>
                                            </div>
                                        </CarouselItem>
                                    </Carousel>
                                </div>
                                <!--<div class="btn-query" style="position: absolute;left: 230px;top: 165px;width: 50px;">-->
                                <!--<Button type="primary" size="small">管理</Button>-->
                                <!--<Button type="primary" size="small">上传</Button>-->
                                <!--</div>-->
                            </div>
                        </div>
                    </Col>
                    <Col :span="17">
                        <Form-item label="设备编码" prop="code">
                            <Input v-model="archivesForm.code" style="width: 160px;" disabled="disabled"></Input>
                        </Form-item>
                        <Form-item label="设备名称" prop="name">
                            <Input v-model="archivesForm.name" style="width: 160px;" disabled="disabled"></Input>
                        </Form-item>
                        <Form-item label="设备类型" prop="typeName">
                            <div style="color:#FFFFFF" onmousemove="this.style.color='#5b5b5b';" onmouseout="this.style.color='#ffffff'">
                                <div :title="archivesForm.typeName" style="position: relative;">
                                    <Icon type="ios-close" class="deleteTab" @click.native="emptyEquMold"></Icon>
                                    <Input v-model="archivesForm.typeName" style="width: 160px;" readonly :disabled="editAble" :autofocus="moldFocus">
                                        <Button slot="append" size="small" icon="ios-search" @click="openEquMold" :disabled="editAble"></Button>
                                    </Input>
                                </div>
                            </div>
                        </Form-item>
                        <Form-item label="设备类别" prop="classification">
                            <Select v-model="archivesForm.classification" style="width: 160px;" :disabled="editAble">
                                <Option v-for="item in effectCategory" :value="item.code" :key="item.code">{{ item.desc }}</Option>
                            </Select>
                        </Form-item>
                        <Form-item label="重要程度" prop="importanceDis">
                            <Input v-model="archivesForm.importanceDis" style="width: 160px;" disabled="disabled"></Input>
                        </Form-item>
                        <Form-item label="主机功率(KW)" prop="power">
                            <Input v-model="archivesForm.power" @on-change="toTestIsNAN(archivesForm.power)" style="width: 160px;" :disabled="editAble" :class="shelterFlag?'':'shelterWord'"></Input>
                        </Form-item>
                        <Form-item label="重量(Kg)" prop="weightDis">
                            <Input v-model="archivesForm.weightDis" style="width: 160px;" disabled="disabled"></Input>
                        </Form-item>
                        <!--<Form-item label="">-->
                            <!--<p style="display: inline-block;margin-right: 50px;margin-left: 28px"><a>一级保养方案</a></p>-->
                            <!--<p style="display: inline-block"><a>二/三级保养方案</a></p>-->
                        <!--</Form-item>-->
                    </Col>
                    <Col :span="3">
                        <!--<img :src="archivesForm.qrCodePictureUrl" style="width: 100%;">-->
                        <img v-if="qrCodePictureUrl!=''" :src=" '/static'+ qrCodePictureUrl" style="width: 140px;height: 140px;object-fit: cover;">
                    </Col>
                    </Row>
            </div>
            <!--<div class="stitle">-->
                <!--<span>制造厂商信息</span>-->
            <!--</div>-->
            <div class="second-title">制造厂商信息</div>
            <div class="form-content">
                    <Form-item label="制造商" prop="manufacturerName">
                        <Input v-model="archivesForm.manufacturerName" style="width: 160px;" disabled="disabled" :class="shelterFlag?'':'shelterWord'"></Input>
                    </Form-item>
                    <Form-item label="厂商编码" prop="manufacturerCode">
                        <Input v-model="archivesForm.manufacturerCode" style="width: 160px;" disabled="disabled" :class="shelterFlag?'':'shelterWord'"></Input>
                    </Form-item>
                    <Form-item label="规格型号" prop="modelName">
                        <Input v-model="archivesForm.modelName" style="width: 160px;" disabled="disabled"></Input>
                    </Form-item>
                    </Br>
                    <Form-item label="生产日期" prop="manufactureDate">
                        <Input v-model="archivesForm.manufactureDate" style="width: 160px;" disabled="disabled"></Input>
                    </Form-item>
                    <Form-item label="安装日期" prop="installationDate">
                        <Input v-model="archivesForm.installationDate" style="width: 160px;" disabled="disabled"></Input>
                    </Form-item>
                    <Form-item label="安装地点" prop="tBdFactoryLocationName">
                        <Input v-model="archivesForm.tBdFactoryLocationName" style="width: 160px;" disabled="disabled"></Input>
                    </Form-item>
                    <Form-item label="验收日期" prop="acceptanceDate">
                        <Input v-model="archivesForm.acceptanceDate" style="width: 160px;" disabled="disabled"></Input>
                    </Form-item>
            </div>
            <!--<div class="stitle">-->
                <!--<span>使用信息</span>-->
            <!--</div>-->
            <div class="second-title">使用信息</div>
            <div class="form-content">
                <Form-item label="使用部门" prop="tBdDepartmentName">
                    <div style="color:#FFFFFF" onmousemove="this.style.color='#5b5b5b';" onmouseout="this.style.color='#ffffff'">
                        <div :title="archivesForm.tBdDepartmentName" style="position: relative;">
                            <Icon type="ios-close" class="deleteTab" @click.native="emptyDept" disabled="disabled"></Icon>
                            <Input v-model="archivesForm.tBdDepartmentName" style="width: 160px;" readonly  disabled="disabled" :autofocus="deptFocus">
                                <Button slot="append" size="small" icon="ios-search" @click="openDeptMold"  disabled="disabled"></Button>
                            </Input>
                        </div>
                    </div>
                </Form-item>
                <Form-item label="设备管理人" prop="userName">
                    <Input v-model="archivesForm.userName" style="width: 160px;" disabled></Input>
                </Form-item>
                <Form-item label="资产状态" prop="status">
                    <Select v-model="archivesForm.status" style="width: 160px;" :disabled="editAble">
                        <Option v-for="item in effectItem" :value="item.code" :key="item.code">{{ item.desc }}</Option>
                    </Select>
                </Form-item>
                </Br>
                <Form-item label="资产折旧率(%)" prop="depreciationRate">
                    <Input v-model="archivesForm.depreciationRate" style="width: 160px;" disabled="disabled"></Input>
                </Form-item>
                <Form-item label="设备寿命" prop="lifeTime">
                    <Input v-model="archivesForm.lifeTime" style="width: 160px;" disabled="disabled"></Input>
                </Form-item>
                <Form-item label="设备原值(万元)" prop="purchasePrice">
                    <Input :class="shelterFlag?'':'shelterWord'" v-model="archivesForm.purchasePrice" style="width: 160px;" :maxlength="18" :disabled="editAble" @on-change="changValue(archivesForm.purchasePrice)"></Input>
                </Form-item>
                <Form-item label="设备残值(万元)" prop="residualValue">
                    <Input :class="shelterFlag?'':'shelterWord'" v-model="archivesForm.residualValue" style="width: 160px;" disabled="disabled"></Input>
                </Form-item>
                <Form-item label="设备用途和功能" prop="usedFor">
                    <Input type="textarea" :rows="3" v-model="archivesForm.usedFor" style="width: 650px" :disabled="editAble"></Input>
                </Form-item>
            </div>
        </Form>
        <div align="center" class="btnGroupDesign">
            <Button v-if="flag && if_edit && from==undefined" type="primary" icon="document-text" size="large" v-show="toEdit" @click="goEdit">编辑</Button>
            <Button v-if="saveAble&&if_save" type="primary" icon="document-text" size="large" v-show="!toEdit" @click="goSave('archivesForm')">保存</Button>
            <Button v-if="if_back" class="btn-gary" icon="chevron-left" @click="backHandle">返回</Button>
        </div>
        <!--设备类型-->
        <Modal v-model="equ_mold_modal" title="设备类型" @on-ok="equMoldSelected">
            <div class="form-content">
                <Form>
                    <Form-item label="设备类型" prop="name">
                        <Input v-model="equ_mold_name" @on-blur="equ_mold_name=toValidate(equ_mold_name)" style="width: 160px"></Input>
                    </Form-item>
                </Form>
                <!--查询按钮-->
                <div style="text-align: right;padding-right: 20px">
                    <Button type="primary" icon="search" size="large" @click="equMoldReload">查询</Button>
                </div>
            </div>
            <div class="table-reset">
                <Table highlight-row border ref="currentRowTable" class="taDisplay" :columns="columns_equMold" :data="equMoldList" @on-row-click="toSelectEquMold"></Table>
            </div>
            <div class="mar-t-10" style="overflow: hidden">
                <div style="float: right;">
                    <Page size="small" :total='equMoldTotal' show-elevator :page-size="equMoldSize" @on-change="equMoldChange"></Page>
                </div>
            </div>
        </Modal>
        <!--使用部门-->
        <Modal v-model="deptModel" title="使用部门" @on-ok="deptSelected">
            <div class="form-content">
                <Form>
                    <Form-item label="部门名称" prop="deptName">
                        <Input v-model="deptName" @on-blur="deptName=toValidate(deptName)" style="width: 160px"></Input>
                    </Form-item>
                </Form>
                <!--查询按钮-->
                <div style="text-align: right;padding-right: 20px">
                    <Button type="primary" icon="search" size="large" @click="loadDept">查询</Button>
                </div>
            </div>
            <div class="table-reset">
                <Table highlight-row border ref="currentRowTable" class="taDisplay" :columns="columns_dept" :data="deptList" @on-row-click="toSelectDept"></Table>
            </div>
            <div class="mar-t-10" style="overflow: hidden">
                <div style="float: right;">
                    <Page size="small" :total='deptTotal' show-elevator :page-size="pageSize" @on-change="deptChange"></Page>
                </div>
            </div>
        </Modal>
        <!--图片预览：-->
        <Modal title="查看图片" v-model="img_modal">
            <img :src="imgView" v-if="img_modal" style="width: 100%">
            <div slot="footer">
                <Button type="primary" @click="img_modal=false">关闭</Button>
            </div>
        </Modal>
    </div>
</template>
<script type="text/ecmascript-6">
    import PandoraUpload from '../../api/pandora-upload/pandoraUpload.vue';
    export default{
        data () {
            return{
                /*遮挡shelterFlag*/
                shelterFlag:false,
                /*遮挡shelterFlag*/
                /*权限校验 start*/
                if_back:  this.$rt(this.authJson.EAM.设备台账.设备档案详情页.返回),
                if_edit:  this.$rt(this.authJson.EAM.设备台账.设备档案详情页.编辑),
                if_save:  this.$rt(this.authJson.EAM.设备台账.设备档案编辑页.保存),
                /*权限校验 end*/
                editAble: true,
                saveAble: false,
                flag: true,
                created: false,
//                loading: false,
                thePageId: '',
                archivesForm:{
                    //设备基本信息
                    code: "",                               //设备编码
                    name: "",                               //设备名称
                    typeName: "",                          //设备类型
                    classification: "",                   //设备类别
                    importanceDis: "",                        //重要程度
                    power: "",                              //主机功率(KW)
                    weightDis: "",                             //重量(Kg)
                    //制造厂商信息
                    manufacturerName: "",               //制造商
                    manufacturerCode: "",               //厂商编码
                    modelName: "",                       //规格型号
                    manufactureDate: "",                //生产日期
                    installationDate: "",               //安装日期
                    tBdFactoryLocationName: "",        //安装地点
                    tBdFactoryLocationId: "",
                    acceptanceDate: "",                 //验收日期
                    //使用信息
                    tBdDepartmentName: "",              //使用单位
                    userId: "",                          //设备管理人ID
                    userName: "",                        //设备管理人名字
                    status: "",                          //资产状态
                    depreciationRate: "",               //资产折旧率
                    lifeTime: "",                        //设备寿命
                    purchasePrice: "",                  //设备原值
                    purchasePriceTip: "",               //设备原值提示
                    residualValue: "",                   //设备残值
                    usedFor: "",                         //设备用途和功能
                    //关于编辑
                    equipmentDetailId: "",
                    accessUrl: "",
                    manufacturerId: "",
                    modelId: "",
//                    qrCodePictureUrl: "",
                    tBdDepartmentId: "",
                    typeId: "",
                    attachmentResUserVoList:[],
                },
                //设备类型
                moldFocus:false,
                equ_mold_modal:false,
                equ_mold_name:'',
                selectRowequMold:'',
                equMoldSize:5,
                equMoldPage:1,
                equMoldTotal:0,
                columns_equMold:[
                    {
                        title:'序号',
                        type: 'index',
                        width: 120,
                        align: 'center'
                    },
                    {
                        title: '设备类型',
                        key: 'tBdEquipmentTypeName',
                        align:'center',
                        render:(h,params) => {
                            return h('p',{
                                domProps:{
                                    title:params.row.tBdEquipmentTypeName,
                                },
                                class:'iview_tabDis'
                            },params.row.tBdEquipmentTypeName)
                        }
                    },
                ],
                equMoldList:[],
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
                /*设备二维码*/
                qrCodePictureUrl: '',
                //验证
                archivesFormValidate: {
                    power: [
                        { required: true, message: '请填写主机功率(KW)', trigger: 'blur' }
                    ],
                    usedFor: [
                        { required: true, message: '请填写设备用途和功能', trigger: 'blur' }
                    ],
                },
                //枚举初始化
                effectItem:[],
                effectCategory:[],
                /*分页*/
                pageSize:10,
                from: ''
            }
        },
        activated: function () {
            this.created && this.fileDetail();
            this.created = true;
        },
        mounted(){
            this.from = this.$route.query.from;
            this.thePageId = this.$route.query.id;
            this.effectItem = this.$base_info.tEAMEquipmentAssetsStatusEnum;
            this.effectCategory = this.$base_info.tEAMEquipmentAssetsClassificationEnum;
            this.fileDetail();
//            console.log(this.effectItem)
        },
        components: {
            PandoraUpload
        },
        methods:{
            toTestIsNAN(x){
                var re = /^[0-9]*[1-9][0-9]*$/;
                if (!re.test(x)) {
                    this.$Message.error('功率为正整数!');
                    this.archivesForm.power = ""
                }
            },
            //改变设备原值计算出设备残值方法
            //验证是否是正数
            changValue(x){
                let vm = this;
                vm.archivesForm.purchasePrice = x;
                if ((!isNaN(x)) && (x > 0)) {
                    if (x.length > 10) {
//                        alert("1");
                        vm.$Message.error('设备原值最多为10个字符');
                        vm.archivesForm.purchasePriceTip = "请输入正确格式的设备原值";
                        return;
                    }
                    else {
//                      console.log("-=-=-change   =-=")
                        //设备残值
                        let nowTime = new Date();
                        let yearsForUse;
                        vm.archivesForm.acceptanceDate = vm.archivesForm.acceptanceDate ||
                            (new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate());
                        yearsForUse = Math.ceil(this.$fc.dayMinus(nowTime,this.$fc.stringToDate(vm.archivesForm.acceptanceDate))/365);

                        vm.archivesForm.residualValue = (1-Number(vm.archivesForm.depreciationRate || 10)*yearsForUse/100) * Number(vm.archivesForm.purchasePrice || 0)
                    };
                }
                else {
//                    alert("4");
                    vm.$Message.error('设备原值为空或大于0的数字');
                    vm.archivesForm.purchasePriceTip = "请输入正确格式的设备原值";
                };
            },
            //设备档案详情渲染
            fileDetail(){
                let vm = this;
                this.$axios.post('/equipmentApplication/equipmentDetail', {
                    equipmentId: vm.thePageId,
//                    status: vm.archivesForm.status === "" ? 0 : vm.archivesForm.status,
                }).then((res) => {
                    let result = res.data.response;
//                    console.log('result === '+JSON.stringify(result))
                    if (result.code  === 1) {
                        vm.archivesForm = result.data;
                        vm.archivesForm.power = String(result.data.power)
                        vm.archivesForm.userId = result.data.userId;
                        vm.archivesForm.userName = result.data.userName;
                        vm.archivesForm.equipmentDetailId = vm.thePageId;
                        vm.archivesForm.classification = vm.archivesForm.classification;
                        vm.archivesForm.status = vm.archivesForm.status;
                        vm.archivesForm.tBdFactoryLocationId = result.data.tBdFactoryLocationId;
                        //二维码相关
                        result.data.qrCodePictureUrl != undefined ? vm.qrCodePictureUrl = result.data.qrCodePictureUrl : vm.qrCodePictureUrl ="";
                        //设备残值
                        let nowTime = new Date();
                        let yearsForUse;
                        if (vm.archivesForm.acceptanceDate) {
                            yearsForUse = Math.ceil(this.$fc.dayMinus(nowTime,this.$fc.stringToDate(vm.archivesForm.acceptanceDate))/365);
                        }
                        if (vm.archivesForm.purchasePrice) {
                            vm.archivesForm.residualValue = (1-Number(vm.archivesForm.depreciationRate)*yearsForUse/100) * Number(vm.archivesForm.purchasePrice);
                        }
                        //图片相关
                        if (result.data.attachmentResUserVoList.length>0) {
                            vm.imgDis = true;
                            vm.photos = result.data.attachmentResUserVoList;
                            vm.upLoadFiles = [];
                            for(var i in result.data.attachmentResUserVoList){
                                vm.upLoadFiles.push({
                                    savePath: result.data.attachmentResUserVoList[i].savePath,
                                    fileName: result.data.attachmentResUserVoList[i].fileName
                                })
                            }
//                            vt.$set(vt.spareParts_img, 'fileName', result.data.pic_name);
//                            vt.$set(vt.spareParts_img, 'savePath', result.data.pic_url);
                        };
                        for(let val of result.data.roles){
                            val == '设备管理员'|| val == '设备科长'? vm.shelterFlag = true  :vm.shelterFlag = false;
                        }
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
            //设备类型－Start
            openEquMold(){
                this.equ_mold_modal = true;
                this.equMoldReload();
            },
            equMoldReload(){
                this.$axios.get('/System/equipmentTypeMagnifier', {
                    params: {
                        page: this.equMoldPage,
                        pageSize: 5,
                        equipment_name:this.equ_mold_name
                    }
                }).then((res) => {
                    let ret = res.data.response;
                    if (ret.code == 1) {
                        this.equMoldList = ret.data.Rows;
                        this.equMoldTotal = ret.data.Total
                    }
                }).catch((err) => {
                    console.log(err);
                });
            },
            toSelectEquMold(rowData){
                this.selectRowequMold = rowData;
            },
            equMoldSelected(){
                this.archivesForm.typeName = this.selectRowequMold.tBdEquipmentTypeName;
                this.archivesForm.typeId = this.selectRowequMold.tBdEquipmentTypeId;
                this.moldFocus = false;
            },
            emptyEquMold(){
                this.archivesForm.typeName = "";
                this.archivesForm.typeId = "";
                this.moldFocus = true;
//                this.watchRely();
            },
            equMoldChange(page){
                this.equMoldPage = page;
                this.equMoldReload();
            },
            //设备类型－End
            //使用部门－Start
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
            /*分页*/
            deptChange(crrentPage){
                this.page = crrentPage;
                this.loadDept();
            },
            //使用部门－End
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
//                    vt.archivesForm.classification = vt.$base_info.getCodeByDesc(vt.archivesForm.classification, vt.$base_info.tEAMEquipmentAssetsClassificationEnum);
//                    vt.archivesForm.status = vt.$base_info.getCodeByDesc(vt.archivesForm.status, vt.$base_info.tEAMEquipmentAssetsStatusEnum);
                    if (valid) {
                        let photoRes=[];
//                        console.log("upLoadFiles +" +JSON.stringify(this.upLoadFiles))
                        for(var i in this.upLoadFiles){
                            photoRes.push({
                                fileName: this.upLoadFiles[i].fileName,
                                savePath: this.upLoadFiles[i].savePath
                            })
                        }
//                        console.log("photoRes +" +JSON.stringify(photoRes));
                        vt.archivesForm.attachmentResUserVoList = photoRes;
//                        console.log("archivesForm"+JSON.stringify(vt.archivesForm));
                        this.$axios.post('/equipmentApplication/equipmentDetailEdit', vt.archivesForm).then((res) => {
                            let ret = res.data.response;
//                            console.log('res========ddfdfdfdfd======' + JSON.stringify(ret) );
                            if (ret.code == 1) {
//                                console.log('保存成功！！');
                                vt.$Message.success(ret.data);
                                this.$router.push({path: '/equipGeneralLedger', query: {'id': vt.thePageId}});
                            } else {
                                //.. 业务失败的情况
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
//                console.log(fileName + " 上传完成了.地址： " + savePath);
//                console.log(files);
                this.uploadList = files;
                this.upLoadFiles = this.upLoadFiles.concat(this.uploadList);
//                this.imgDis = true;
//                var format = fileName.split('.')[1];
//                format = format == 'jpg' ? 0 : format == 'jpeg' ? 1 : format == 'png' ? 2 : format == 'gif' ? 3 : 4;
//                this.$set(this.spareParts_img, 'fileName', fileName);
//                this.$set(this.spareParts_img, 'savePath', savePath);
//                this.$set(this.spareParts_img, 'fromat', format);
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
        }
    }
</script>
<style>
    .ivu-upload .ivu-upload-select{
        display: block;
    }
</style>