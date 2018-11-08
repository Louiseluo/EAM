<template>
    <div class="basic bzzy-search">
        <!--模块名称-->
        <div class="title">
            <span>方案管理</span>
        </div>
        <!--表单-->
        <div class="form-content">
            <Form ref="workForm" :model="workForm" :rules="ruleValidate" label-position="right" inline :label-width="100">
                <Form-item label="方案名称" prop="name">
                    <div style="color:#ffffff" onmousemove="this.style.color='#5b5b5b';" onmouseout="this.style.color='#ffffff'">
                        <span @click="workForm.standardSolutionName='';workForm.standardSolutionId=''" v-if="workForm.standardSolutionName">
                            <Icon type="ios-close" class="deleteTab"></Icon>
                        </span>
                        <div class="input-search" @click="work_code_name = true">
                            <Input v-model="workForm.standardSolutionName" style="width: 160px;" readonly></Input>
                            <Button icon="ios-search"></Button>
                        </div>
                    </div>
                </Form-item>
                <Form-item label="是否停机" prop="needShutdown">
                    <Select v-model="workForm.needShutDown" style="width: 160px;">
                        <Option v-for="item in needShutdownItem" :value="item.code" :key="item.code">{{ item.desc }}</Option>
                    </Select>
                </Form-item>
                <Form-item label="设备类型" prop="equ_mold" >
                    <div style="color:#FFFFFF" onmousemove="this.style.color='#5b5b5b';" onmouseout="this.style.color='#ffffff'">
                        <div :title="workForm.equ_mold" style="position: relative;">
                            <Icon type="ios-close" class="deleteTab" @click.native="emptyEquMold" ></Icon>
                            <Input v-model="workForm.equ_mold" style="width: 160px;" readonly >
                            <Button slot="append" size="small" icon="ios-search" @click="openEquMold"></Button>
                            </Input>
                        </div>
                    </div>
                </Form-item>
                <!--<FormItem label="适用设备">
                    <Input v-model="workForm.equipmentName" @on-blur="workForm.equipmentName=toValidate(workForm.equipmentName)" style="width: 160px;"></Input>
                </FormItem>-->
<!--
                <Form-item label="适用设备" prop="factoryLocationId">
                    <div style="color:#ffffff" onmousemove="this.style.color='#5b5b5b';" onmouseout="this.style.color='#ffffff'">
                        <span @click="workForm.factoryLocationName='';workForm.factoryLocationId=''" v-if="workForm.factoryLocationName">
                            <Icon type="ios-close" class="deleteTab"></Icon>
                        </span>
                        <div class="input-search" @click="equipment_code = true;">
                            <Input v-model="workForm.factoryLocationName" style="width: 160px;" readonly></Input>
                            <Button icon="ios-search"></Button>
                        </div>
                    </div>
                </Form-item>
-->

                <Form-item label="方案状态" prop="status">
                    <Select v-model="workForm.status" style="width: 160px;">
                        <Option v-for="item in effectItem" :value="item.code" :key="item.code">{{ item.desc }}</Option>
                    </Select>
                </Form-item>
                <Form-item label="方案类型" prop="type">
                    <Select v-model="workForm.type" style="width: 160px;">
                        <Option v-for="item in standardTypeItem" :value="item.code" :key="item.code" >{{ item.desc }}</Option>
                    </Select>
                </Form-item>
                <Form-item label="发布时间" prop="createAt">
                    <Row>
                        <Col span="11">
                        <DatePicker v-model="workForm.createStart" type="datetime" placeholder="选择日期和时间" @on-change="changeCreateAtS" :editable ='editable' @on-open-change="compareTime"></DatePicker>
                        </Col>
                        <Col span="2" style="text-align: center">~</Col>
                        <Col span="11">
                        <DatePicker v-model="workForm.createEnd" type="datetime" placeholder="选择日期和时间" @on-change="changeCreateAtE" :editable ='editable' @on-open-change="compareTime"></DatePicker>
                        </Col>
                    </Row>
                </Form-item>
            </Form>
            <!--查询按钮-->
            <div class="btn-query">
                <Button v-if="if_export" type="primary" icon="ios-cloud-download" size="large" :disabled="true">导出</Button>
                <Button v-if="if_search"  type="primary" icon="search" size="large" @click="searchResult">查询</Button>
                <router-link v-if="if_add" :to="{ path: 'standardworkedit', query: {'id':'', flag: 2}}">
                    <Button type="primary" icon="plus" size="large">新建</Button>
                </router-link>
            </div>
        </div>
        <!--表格-->
        <div class="table-content">
            <Table stripe border :columns="standardColumns" :data="standardData"></Table>
        </div>
        <div class="page">
            <Page :total="numMaterial" :current="workForm.page" size="small" show-elevator :page-size="workForm.pageSize" @on-change="changePage"></Page>
        </div>

        <Modal v-model="work_code_name" title="标准方案" @on-ok="selectEamfaName">
            <!--查询按钮-->
            <div class="btn-query mar-b-10" style="display: table;">
                标准方案名称
                <Input class="mar-l-10" style="width: 160px;" @on-blur="modalStandardName=toValidate(modalStandardName)" v-model="modalStandardName"></Input>
                <Button type="primary" icon="search" size="large" @click="searchName">
                    查询
                </Button>
            </div>
            <Tabs type="card" :value="currentTab" @on-click="tabChange">
                <Tab-pane class="checkTab" label="保养" name="0" >
                    <div class="table-reset">
                        <Table highlight-row border class="taDisplay" :columns="eamfaCol" :data="eamfaName" @on-row-click="toSelect"></Table>
                    </div>
                </Tab-pane>
                <!--<Tab-pane class="checkTab" label="点检" name="1">
                    <div class="table-reset">
                        <Table highlight-row border class="taDisplay" :columns="eamfaCol" :data="eamfaName" @on-row-click="toSelect"></Table>
                    </div>
                </Tab-pane>-->
            </Tabs>
            <div class="mar-t-10" style="overflow: hidden">
                <div style="float: right;">
                    <Page :current="eamfaCurrent" :total="eamfaTotal" size="small" show-elevator :page-size="pageSize" @on-change="pageChange"></Page>
                </div>
            </div>
        </Modal>
        <!--<Modal v-model="equipment_code" title="适用设备"  :cantCloseThen="cantClose" >
            <Tree :data="treeSiteData" :multiple="false" @on-select-change="treeSelected" class="max-h-300"></Tree>
            <div slot="footer">
                <a @click="equipment_code=false">取消</a>
                <Button type="primary" class="mar-l-15" @click="selectSb">确定</Button>
            </div>
        </Modal>-->
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

    </div>
</template>

<script>
    export default {
        created: function () {
//          this.initFullCalendar();
        },
        data (){
            //验证名称
            const validateAge = (rule, value, callback) => {

            };
            return {
                /*权限校验 start*/
                if_search:  this.$rt(this.authJson.EAM.设备保养.保养方案列表页.查询),
                if_detail:  this.$rt(this.authJson.EAM.设备保养.保养方案列表页.查看),
                if_add:  this.$rt(this.authJson.EAM.设备保养.保养方案列表页.新建),
                if_edit:  this.$rt(this.authJson.EAM.设备保养.保养方案列表页.编辑),
                if_export:  this.$rt(this.authJson.EAM.设备保养.保养方案列表页.导出),
                /*权限校验 end*/
                created: false,
                pageSize:5,
                numMaterial: 0,

                close: false,
                close_loading: false,

                work_code_name: false,
                equipment_code: false,
                loading:true,
                cantClose:true,


                /*查询数组*/
                editable:false,
                workForm: {
                    standardSolutionId:'',
                    standardSolutionName:'',
                    needShutDown:-1,
                    /*factoryLocationId:'',
                    factoryLocationType: '',
                    factoryLocationName:'',*/
                    equipmentName: '',
                    equ_mold:'',//设备类型
                    equ_moldId:'',//设备类型id
                    status:-1,
                    type:-1,
                    createStart:'',
                    createEnd:'',
                    page:1,
                    pageSize:10
                },
                /*查询列表渲染*/
                standardColumns: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 80,
                        align: 'center'
                    },
                    {
                        title: '标准方案名称',
                        key: 'standardSolutionName',
                        align: 'center',
                        render: (h, params) => {
                            return h('p', {
                                domProps: {
                                    title: params.row.standardSolutionName
                                },
                                class: 'iview_tabDis',
                            }, params.row.standardSolutionName)
                        },
                    },
                    {
                        title: '方案类型',
                        key: 'type',
                        align: 'center',
                        render: (h, params) => {
                            return h('p', {
                                domProps: {
                                    title: params.row.type
                                }
                            }, params.row.type)
                        }
                    },
                    {
                        title: '关联设备',
                        key: 'equipmentName',
                        align: 'center',
                        render: (h, params) => {
                            return h('p', {
                                domProps: {
                                    title: params.row.equipmentName
                                },
                                class: 'iview_tabDis',
                            }, params.row.equipmentName)
                        },
                    },
                    {
                        title: '预计耗时(分钟)',
                        key: 'requiredTime',
                        align: 'center',
                        render: (h, params) => {
                            return h('p', {
                                domProps: {
                                    title: params.row.requiredTime
                                },
                                class: 'iview_tab_numDis',
                            }, params.row.requiredTime)
                        },
                    },
                    {
                        title: '版本',
                        key: 'version',
                        align: 'center',
                    },
                    {
                        title: '是否停机',
                        key: 'needShutDown',
                        align: 'center'
                    },
                    {
                        title: '方案状态',
                        key: 'status',
                        align: 'center'
                    },
                    {
                        title: '发布时间',
                        key: 'createAt',
                        align: 'center',
                        render: (h, params) => {
                            return h('p', {
                                domProps: {
                                    title: params.row.createAt
                                }
                            }, params.row.createAt)
                        }
                    },
                    {
                        title: '操作',
                        key: 'action',
                        render: (h, params) => {
                            let btns = [];
                            if(this.if_detail) {
                                btns.push(
                                    h('a', {
                                        class: 'mar-r-5',
                                        on: {
                                            click: () => {
                                                this.detail(params.row.id,0,params.row.standardSolutionId)
                                            }
                                        }
                                    }, '查看')
                                )
                            }
                            if(this.if_edit) {
                                btns.push(
                                    h('a', {
                                        class: 'mar-r-5',
                                        style: {
                                            display: params.row.status=='生效中'?'none':'inline-block'
                                        },
                                        on: {
                                            click: () => {
                                                if(params.row.status == "生效中"){
                                                    this.detail(params.row.id,0,params.row.standardSolutionId)
                                                }else {
                                                    this.detail(params.row.id,1,params.row.standardSolutionId)
                                                }
                                            }
                                        }
                                    }, '编辑')
                                )
                            }


                            return h('div', btns
                                // [
                                // h('a', {
                                //     class: 'mar-r-5',
                                //     on: {
                                //         click: () => {
                                //             this.detail(params.row.id,0,params.row.standardSolutionId)
                                //         }
                                //     }
                                // }, '查看'),
                                // h('a', {
                                //     class: 'mar-r-5',
                                //     style: {
                                //         display: params.row.status=='生效中'?'none':'inline-block'
                                //     },
                                //     on: {
                                //         click: () => {
                                //             if(params.row.status == "生效中"){
                                //                 this.detail(params.row.id,0,params.row.standardSolutionId)
                                //             }else {
                                //                 this.detail(params.row.id,1,params.row.standardSolutionId)
                                //             }
                                //         }
                                //     }
                                // }, '编辑'),
                            // ]
                            )

                        },

                        align: 'center'
                    },
                ],
                standardData:[],

                ruleValidate: {
                    sopname: [
                        {validator: validateAge, trigger: 'blur'}
                    ]
                },
                //axios DEMO
                columnsDemo: [{title: 'id', key: 'id'}, {title: '名称', key: 'cnUsername'}],
                dataDemo: [],

                /*基本信息初始化*/
                needShutdownItem:[],
                effectItem:[],
                standardTypeItem:[],

                /*标准方案放大镜*/
                currentTab:"0",
                modalStandardName:'',
                eamfaCol: [
                    {
                        title:'序号',
                        type: 'index',
                        width: 120,
                        align: 'center'
                    },
                    {
                        title:'标准方案名称',
                        key: 'standardSolutionName',
                        align: 'left'
                    }
                ],
                eamfaName: [],
                eamfaTotal: 0,
                locationId: '',
                solutionId: '',
                solutionName: '',
                eamfaCurrent: 1,
                /*设备类型放大镜*/
                equ_mold_modal:false,
                equ_mold_name:'',
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
                selectRowequMold:'',
                equMoldSize:5,
                equMoldTotal:0,
                equMoldPage:1,

            }
        },
        activated: function () {
            this.created && this.postStandardWorkInfo();
            this.created = true;
        },
        mounted(){
            /*console.log("if_search +" + this.if_search)
            console.log("if_detail +" + this.if_detail)*/
            /*标准方案基本信息初始化*/
            this.needShutdownItem = this.$base_info.yesOrNoEnum;
            this.effectItem = this.$base_info.eamStandardSolutionStatus;
            this.standardTypeItem = this.$base_info.eamStandardSolutionType;
            /*标准方案基本信息初始化 end*/
            this.searchStandardNameTab(1,5,0,"");
            this.postStandardWorkInfo();
        },

        methods: {
            /*标准方案名称放大镜*/
            /*提取数据*/
            searchStandardNameTab:function (currentPage,pageNum,tabId,standardName) {
                let vm = this;
                this.$axios.post('/tEamStandardSolution/searchStandardSolution',{
                    page:currentPage,
                    pageSize:pageNum,
                    type:tabId,
                    standardSolutionName:standardName
                }).then((res) => {
                    let code = res.data.response.code;
                    if(code === 1) {
                        let result = res.data.response;//当前返回的结果
//                        console.log('方案 == '+JSON.stringify(res.data.response));
                        vm.eamfaCurrent = currentPage;
                        vm.eamfaTotal =result.data.total;
                        vm.eamfaName = result.data.rows;
//                        console.log("eamfaName + " + JSON.stringify(vm.eamfaName));
                    }else {
                        //.. 业务失败的情况
                        this.$Message.error({
                            content: '数据不合法',
                            duration: 5,
                            closable: true
                        });
                    }
                }).catch((err) => {
                    console.log(err);
                });
            },
            /*点选带回名称*/
            toSelect (rowdata) {
//                console.log('rowdata == '+JSON.stringify(rowdata));
                this.solutionId = rowdata.standardSolutionId;
                this.solutionName = rowdata.standardSolutionName;
            },
            selectEamfaName () {
                this.workForm.standardSolutionName = this.solutionName;
                this.workForm.standardSolutionId = this.solutionId;
            },
            /*分页*/
            pageChange:function (page) {
                this.$jq("input[name='eamfa_radio']:checked").prop("checked", false);
                this.searchStandardNameTab(page,5,this.currentTab,this.modalStandardName);
            },
            /*方案名称搜索*/
            searchName:function () {
                this.searchStandardNameTab(1,5,this.currentTab,this.modalStandardName);
            },
            /*tabf分页*/
            tabChange:function (name) {
                this.currentTab = name;
                this.searchStandardNameTab(1,5,name,this.modalStandardName);
            },
            /*标准方案名称放大镜end*/

            /*标准方案查询*/
            changeCreateAtS:function (sTime) {
                this.workForm.createStart = sTime;
            },
            changeCreateAtE:function (eTime) {
                this.workForm.createEnd = eTime;
            },
            /*时间大小比较*/
            compareTime:function (status) {
                if(!status){
                    let sTime = this.workForm.createStart;
                    let eTime = this.workForm.createEnd;
                    if( (sTime!="") && (eTime!="") && (eTime<sTime)){
                        this.$Message.error('结束时间不能在开始时间之前,请重新选择');
                        this.workForm.createEnd = ""
                    }
                }
            },

            /*4、设备类型  S */
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
                this.workForm.equ_mold = this.selectRowequMold.tBdEquipmentTypeName;
                this.workForm.equ_moldId = this.selectRowequMold.tBdEquipmentTypeId;
            },
            emptyEquMold(){
                this.workForm.equ_mold = "";
                this.workForm.equ_moldId = "";
            },
            equMoldChange(page){
                this.equMoldPage = page;
                this.equMoldReload();
            },
            /*4、设备类型  E */





            /*列表渲染*/
            postStandardWorkInfo () {
                let vm = this;
//                console.log('查询条件 == '+JSON.stringify(this.workForm));
                this.$axios.post('/tEamStandardSolution/standardSolutionList', {
                    page: this.workForm.page,
                    pageSize: this.workForm.pageSize,
                    standardSolutionId: this.workForm.standardSolutionId,
                    standardSolutionName: this.workForm.standardSolutionName,
                    needShutDown: this.workForm.needShutDown,
                    factoryLocationId: this.workForm.factoryLocationId,
                    equipmentName: this.workForm.equipmentName,
                    equipmentType: this.workForm.equ_moldId,
                    status: this.workForm.status,
                    type: this.workForm.type,
                    createStart: this.workForm.createStart,
                    createEnd: this.workForm.createEnd
                }).then((res) => {
                    let code = res.data.response.code;
                    if (code === 1) {
//                        console.log('tableData === '+JSON.stringify(res));
                        let eamSwInfo = res.data.response.data.rows;//当前返回的结果
                        let standardDataInfo = [];
                        vm.numMaterial = res.data.response.data.total;
                        for (let q in eamSwInfo) {
                            let needShutdownDesc = this.$base_info.getDescByCode(eamSwInfo[q].needShutDown, this.$base_info.yesOrNoEnum);
                            let statusDesc = this.$base_info.getDescByCode(eamSwInfo[q].status, this.$base_info.eamStandardSolutionStatus);
                            let typeDesc = this.$base_info.getDescByCode(eamSwInfo[q].type, this.$base_info.eamStandardSolutionType);
                            standardDataInfo.push({
                                standardSolutionId: eamSwInfo[q].standardSolutionId,
                                standardSolutionName: eamSwInfo[q].standardSolutionName,
                                id: eamSwInfo[q].id,
                                type: typeDesc,
                                equipmentName: eamSwInfo[q].equipmentName,
                                requiredTime: eamSwInfo[q].requiredTime,
                                version: eamSwInfo[q].version,
                                needShutDown: needShutdownDesc,
                                status: statusDesc,
                                createAt: eamSwInfo[q].createAt,
                            })
                        }
                        vm.standardData = standardDataInfo;
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
            searchResult:function () {
                this.workForm.page = 1;
//                console.log("workForm + " + JSON.stringify(this.workForm));
                this.postStandardWorkInfo();
            },

            changePage:function (currentPage) {
                this.workForm.page = currentPage;
//                console.log("workForm.page + " + this.workForm.page);
                this.postStandardWorkInfo();
            },
            /*标准方案查询end*/
            detail(tpmSSVId,flagNum,tpmssId){
                this.$router.push({path: '/standardworkedit', query: {'id': tpmSSVId, "flag": flagNum,"tpmssId": tpmssId}});
            },
            //查询时验证输入框不能为英文单双引号
            toValidate(msg) {
//                console.log(msg);
                var str = /[=+%!<>"'/_,()\\]/;
                if (str.test(msg)) {
                    this.$Message.warning("输入格式错误");
                    msg = msg.replace(/\'/g,"").replace(/\"/g,"").replace(/\+/g,"").replace(/\=/g,"").replace(/\%/g,"").replace(/\!/g,"").replace(/\</g,"").replace(/\>/g,"").replace(/\//g,"").replace(/\_/g,"").replace(/\,/g,"").replace(/\(/g,"").replace(/\)/g,"").replace(/\\/g,"");
                }
                return msg;
            }
        }
    }
</script>

<style>

</style>
