<template>
    <div class="basic bzzy-change">
        <!--模块名称-->
        <div class="title">
            <span>方案管理-查看</span>
        </div>
        <!--表单-->
        <div class="form-content">
            <Form v-model="workForm" label-position="right" inline :label-width="100">
                <Form-item label="标准方案编码" prop="code">
                    <Input v-model="workForm.code" style="width: 160px;" disabled></Input>
                </Form-item>
                <Form-item label="标准方案名称" prop="name">
                    <Input v-model="workForm.name" style="width: 160px;" disabled></Input>
                </Form-item>
                <Form-item label="版本" prop="version">
                    <Input v-model="workForm.version" style="width: 160px;" disabled></Input>
                </Form-item>
                <Form-item label="是否默认版本" prop="isDefaultVersion">
                    <div style="width: 160px;" >
                        <i-switch :disabled="disabled" v-model="workForm.isDefaultVersion">
                            <span slot="open">是</span>
                            <span slot="close">否</span>
                        </i-switch>
                        <Button type="primary" size="small" disabled>版本管理</Button>
                    </div>
                </Form-item>
                <Form-item label="是否停机" prop="needShutdown">
                    <div style="width: 160px;">
                        <i-switch :disabled="disabled"  v-model="workForm.needShutdown">
                            <span slot="open">是</span>
                            <span slot="close">否</span>
                        </i-switch>
                    </div>
                </Form-item>
                <Form-item label="方案类型" prop="type">
                    <!--<Select v-model="workForm.type" style="width: 160px;" disabled>
                        <Option value='1'>点检</Option>
                        <Option value='0'>保养</Option>
                    </Select>-->
                    <Input v-model="workForm.type" style="width: 160px;" disabled></Input>
                </Form-item>
                <Form-item label="预计耗时(分钟)" prop="requiredTime">
                    <Input v-model="workForm.requiredTime" style="width: 160px;" disabled></Input>
                </Form-item>
                <!--<Form-item label="启用时间" prop="startTime">
                    <Date-picker v-model="workForm.startTime" type="datetime" placeholder="选择日期和时间" style="width: 160px" disabled readonly></Date-picker>
                </Form-item>
                <Form-item label="停用时间" prop="endTime">
                    <Date-picker v-model="workForm.endTime" type="datetime" placeholder="选择日期和时间" style="width: 160px" disabled readonly></Date-picker>
                </Form-item>-->
                <Form-item label="执行岗位" prop="station">
                    <Input v-model="workForm.station" style="width: 160px;" disabled></Input>
                </Form-item>
                <Form-item label="方案状态" prop="status">
                    <Input v-model="workForm.statusText" style="width: 160px;" disabled></Input>                   
                </Form-item>

                <Form-item label="设备型号" prop="equ_type">
                    <div class="input-search">
                        <Input v-model="workForm.equ_type" style="width: 160px;" disabled></Input>
                        <Button icon="ios-search" @click="equ_type = true"></Button>
                    </div>
                </Form-item>
                <Form-item label="所属供应商" prop="supply">
                    <div class="input-search">
                        <Input v-model="workForm.supply" style="width: 160px;" disabled></Input>
                        <Button icon="ios-search" @click="supply = true"></Button>
                    </div>
                </Form-item>

                <Form-item label="注意事项" prop="remark">
                    <Input v-model="workForm.remark" type="textarea" style="width: 500px;" disabled></Input>
                </Form-item>
            </Form>
        </div>

        <!--表格-->
        <Tabs class="maintenanceTab" type="card">
                <Tab-pane label="作业项目" icon="social-buffer">
                	<div class="table-content ivu-table-auto" style="margin-bottom: 50px;">
	                    <Table stripe border :columns="columns1" :data="data1"></Table>
	                </div>                    
                </Tab-pane>
                <Tab-pane label="备品备件" icon="cube">
                    <!--kp--备品备件--开始-->
                    <div class="table-reset mar-t-10 ">
                        <table class="table table-bordered table-center table-striped table-blue table-edit table-standWork taDisplay">
                            <thead>
                            <tr>
                                <th>序号</th>
                                <th width="35%">备品备件</th>
                                <th>备件单位</th>
                                <th>备件数量(个)</th>
                                <th>操作</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="(sparePart,index) in spareParts_display" class="trDisplay">
                                <td>{{index + 1}}</td>
                                                <td class="tdDisplay pointDis" :title="sparePart.toolDefineName">
                                    {{sparePart.toolDefineName}}
                                </td>
                                <!--<td>{{sparePart.bdUom&&sparePart.bdUom.id?$cs.spareParts_unit(sparePart.bdUom.id):"错误数据，暂无枚举"}}</td>-->
                                <td class="tdDisplay pointDis" :title="sparePart.bdUom && sparePart.bdUom.name ? sparePart.bdUom.name : '错误数据，暂无单位'">{{sparePart.bdUom && sparePart.bdUom.name ? sparePart.bdUom.name : "错误数据，暂无单位"}}</td>
                                <td class="wid-10 num_right">
                                    <Input  v-model=sparePart.number disabled
                                           @on-change="toTestIsNAN(sparePart.number)"></Input>
                                </td>
                                <td><a @click="delete_spareParts(index)" :disabled="disabled">删除</a></td>
                            </tr>
                            </tbody>
                        </table>
                        <div class="tableHasNoData" v-show="!spareParts_display[0]"><p>暂无数据</p></div>
                    </div>
                    <div class="mar-t-10">

                        <Button icon="plus-round" size="small" type="primary" :disabled="disabled" @click="addBtn_spareParts">添加</Button>

                    </div>
                    <!--kp--备品备件--结束-->
                </Tab-pane>
                <!--<Tab-pane label="人员需求" icon="android-person">
                    <Table stripe border :columns="columns3" :data="data3"></Table>
                </Tab-pane>-->
                <Tab-pane label="适用设备" icon="android-settings">
                    <!--kp---适用设备开始-->
                    <tree_multiple :baseData="treeSiteData" @dataSetected="dataSelectedDisa"
                                   :right_display="treeSiteDataSelected" :state="tempState"
                                   :treeTip1="treeTip"></tree_multiple>
                    <!--kp---适用设备结束-->
                </Tab-pane>
                <!--<Tab-pane label="抑制作业" icon="android-options">-->
                    <!--<Table stripe border :columns="columns5" :data="data5"></Table>-->
                <!--</Tab-pane>-->
        </Tabs>
        <!--保存按钮-->
        <div class="btn-group">
            <router-link v-if="if_cancel" to='/standardwork'>
                <Button  type="primary" icon="arrow-return-left" size="large">返回</Button>
            </router-link>          
            <Button v-show="this.workForm.status==1" type="primary" icon="android-close" size="large" @click="submit(0)" v-if="failure_btn">取消生效</Button>
            <Button v-show="this.workForm.status==1" type="primary" icon="close-circled" size="large" @click="delPrompt(0)" v-if="invalid_btn">作废</Button>
            <Button v-show="this.workForm.status!=1" type="primary" icon="close-circled" size="large" @click="delPrompt(1)">删除</Button>
            <Button v-show="this.workForm.status==0" type="primary" icon="checkmark" size="large" @click="submit(1)" >生效</Button>
            <router-link :to="{ path:'/standardworkedit',query:{id:this.tpmSSVId,flag:this.flag,tpmssId:this.tpmssId}}" v-if="if_edit">
                <Button  type="primary" icon="document-text" size="large" >编辑</Button>
            </router-link>
            
        </div>
        <!--kp---备品备件多选弹出框：---开始-->
        <Modal v-model="sparePartsMod" title="备品备件需求" @on-ok="toAdd_spareParts" width="1000">
            <table_multiple @sparePartsSetected="spareParts_dataSelectedDisa" :mod_rightDisplay="sparePartsSelected"
                            :canSearch="toSearch" :modelId="workForm.equId"
                            :manufacturer="workForm.supply"></table_multiple>
        </Modal>
        <!--kp---备品备件多选弹出框：---结束-->
        <!--kp-&#45;&#45;选择完关联关系才可以添加备品备件：start-->
        <Modal v-model="commonModal" width="360">
            <p slot="header" style="color:#f60;text-align:center">
                <Icon type="information-circled"></Icon>
                <span>信息提示</span>
            </p>
            <div style="text-align:center">
                <p>{{tipMessage}}</p>
            </div>
            <div slot="footer">                                                                   
                <Button type="primary" size="large" long :loading="modal_loading" @click="commonModal=false">确认</Button>
            </div>
        </Modal>
        <!--kp---end-->
        <Modal title="查看图片" v-model="visible">
            <img :src="imgUrl"  style="width: 100%">
        </Modal>
        
        <Modal v-model="promptModal" width="360">
            <p slot="header" style="color:#f60;text-align:center">
                <Icon type="information-circled"></Icon>
                <span>操作确认</span>
            </p>
            <div style="text-align:center">
                <p>确定将此方案状态修改为{{statusT}}？</p>
            </div>
            <div slot="footer">
                <Button type="primary" size="large" long :loading="modal_loading" @click="editStatus()">确定</Button>
            </div>
        </Modal>
        <Modal v-model="delModal" width="360">
            <p slot="header" style="color:#f60;text-align:center">
                <Icon type="information-circled"></Icon>
                <span>{{del}}确认</span>
            </p>
            <div style="text-align:center">
                <p>是否{{del}}此方案？</p>
            </div>
            <div slot="footer">
                <Button type="primary" size="large" long :loading="load" @click="cancelPlan(delId)">{{del}}</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    //使用jquery渲染
    import $ from 'jquery';
    //kp--适用设备多选组件：
    import tree_multiple from '../treeMulitiple/tree_multiple_equ.vue';
    //kp--备品备件多选组件：
    import table_multiple from '../treeMulitiple/table_multiple_spareParts.vue';
    export default {
        created(){
            console.log(JSON.parse(localStorage.getItem('standardWorkRowData')));
        },
        data (){
            return {
                /*权限校验 start*/
                /*if_edit:  this.$rt(this.authJson.EAM.方案管理.详情.编辑),
                if_cancel:  this.$rt(this.authJson.EAM.方案管理.详情.取消),*/
                if_edit:  true,
                if_cancel:  true,
                /*权限校验 end*/
                //kp编辑页渲染：
                theStandWorkId: "",
                //kp--备品备件相关--开始
                commonModal: false,
                tipMessage: "",
                sparePartsMod: false,
                toSearch: "cannot",
                sparePartsSelected: [],
                spareParts_display: [],
                //kp--备品备件相关--结束


                //kp--适用设备相关--开始：
                treeTip: "",
                tempState:"viewing",
                treeSiteDataSelected: [],
                treeSiteData: [],
                //kp--适用设备--结束
                tpmSSVId:'',
                tpmssId:'',
                flag:'',
                modal_loading: false,
                disabled: true,
                workForm: {
                    isdefault: "",
                    isshutdown: "",
                    code: '',
                    name: '',
                    version: '',
                    isDefaultVersion: true,
                    needShutdown: false,
                    requiredTime: '',
                    startTime: '',
                    endTime: '',
                    createAt: '',
                    updateAt: '',
//                    requiredTime: '',
                    type: '1',
                    station:'机修工',
                    stationId: '',
                    status: '',
                    //GDJ--设备型号、所属供应商--开始：
                    equ_type: '',
                    supply:  '',
                    //GDJ--设备型号、所属供应商--结束
                    remark: '',
                },
                columns1: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 80,
                        align: 'center'
                    },
                    {
                        title: '作业内容',
                        key: 'content'
                    },
                    {
                        title: '标准要求',
                        key: 'requirement'
                    },
                    {
                        title: '标准工时(分钟)',
                        key: 'required_time',
                        render: (h, params) => {
                            return h('p', {
                                domProps: {
                                    title: this.data1[params.index].required_time
                                },
                                class: ' iview_tab_numDis',
                            }, this.data1[params.index].required_time)
                        },

                    },
                    {
                        title: '参照图片',
                        key: 'standImg',
                        render: (h, params) => {
                            return h('div', {
                                class: 'demo-upload-list',
                                style:{
                                	display: (params.row.url==''||!params.row.url)?'none':'block'
                                }
                            }, [
                                h('img', {
                                    domProps: {
                                        src: (params.row.url!='')?"../static/" + params.row.url:''
                                    }
                                }),
                                h('div', {
                                    class: 'demo-upload-list-cover',
                                    on: {
	                                	click: ()=> {
	                                		this.handleView( "../static/" + params.row.url)
	                                	}
	                                }
                                },[
                                	h('Icon', {
	                                    props: {
	                                        type: 'ios-eye-outline'
	                                    },
	                                }),

                                ])
                            ]);
                        },
                    },
                ],
                data1: [
//                  {
//                      content: '',
//                      requirement: '',
//                      requiredTime: ''
//                  }
                ],
                columns2: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 80,
                        align: 'center'
                    },
                    {
                        title: '备品备件编码',
                        key: 'materialCode'
                    },
                    {
                        title: '备品备件名称',
                        key: 'materialName'
                    },
                    {
                        title: '单位',
                        key: 'materialUnit'
                    },
                    {
                        title: '数量',
                        key: 'quantity'
                    },
                    {
                        title: '备品备件类型',
                        key: 'type'

                    }
                ],
                data2: [
                    {
                        materialCode: '',
                        materialName: '',
                        materialUnit: '',
                        quantity: '',
                        type:'消耗性备品',
                    }
                ],
                columns3: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 80,
                        align: 'center'
                    },
                    {
                        title: '人员选择',
                        key: 'teamCode',
                        align: 'center'
                    },
                    {
                        title: '操作',
                        align: 'center'
                    }
                ],
                data3: [
                   /* {
                        code: '',
                        name: '',
                        quantity: '',
                    }*/
                ],
                columns4: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 80,
                        align: 'center'
                    },
                    {
                        title: '设备地点',
                        key: 'equipmentCode',
                    },
                    {
                        title: '设备选择',
                        key: 'equipmentName',
                    },
                ],
                data4: [
                    {
                        equipmentCode: '',
                        equipmentName: '',
                    }
                ],
                columns5: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 80,
                        align: 'center'
                    },
                    {
                        title: '标准方案编码',
                        key: 'code',
                    },
                    {
                        title: '标准方案名称',
                        key: 'name',
                    },
                    {
                        title: '版本',
                        key: 'version',
                    },
                    {
                        title: '前（日）',
                        key: 'daysBefore',
                    },
                    {
                        title: '后（日）',
                        key: 'daysAfter',
                    },
                ],
                data5: [
                    {
                        code: '',
                        name: '',
                        version: '',
                        daysBefore:'',
                        daysAfter:'',
                    }
                ],
                visible: false,
                imgUrl:'',
                
                promptModal: false,
                modal_loading: false,
                submitId: 0,

                del: '',
                delId: 0,
                delModal: false,
                load: false,
                statusT: '',
            }
        },
        components: {
            'table_multiple': table_multiple,
            'tree_multiple': tree_multiple,
        },
        mounted(){
            var id = this.$route.query.id;
//            id = "JN4HC5H7GPWCY71LS9HJ";
            this.theStandWorkId = id;
            this.reView_spareParts();
            this.review_eauipment();
            var id = this.$route.query.id;
//          var id = 'JMVZ37QSF1ESW5CG9GE7'
            var flag = this.$route.query.flag;
            this.tpmSSVId = id;
            this.flag = flag;//flag 2  单存查看
            this.detail(id,flag);
            this.operatingItem();
            this.tpmssId = this.$route.query.tpmssId;

//          this.jiazai(id);
            //console.log(id);

            // kp---地点设备列表，树图初始化  --开始:
//            this.toSearch_equment();
            // kp---地点设备列表，树图初始化  --结束:
        },
        methods: {
            //kp:编辑页渲染备品备件及适用设备：
            reView_spareParts(){
                let vt = this;
                let partsItem = {};
                let bdUom = {};
                this.$axios.post("/eamStandardSolution/listToolsBySolutionVersionId", {standardSolutionVersionId: vt.theStandWorkId}).then(function (response) {
                    let code = response.data.response.code;
                    if (code != 1) {
                        vt.$Message.error(response.data.response.msg);

                    } else {
                        let theSelectedGet = response.data.response.data;
                        console.log("哈哈哈哈11------------------------------------------------>>");
                        console.log(theSelectedGet);
                        for (var i in theSelectedGet) {
                            bdUom = {name: theSelectedGet[i].uom_name}
                            partsItem = {
                                "id": theSelectedGet[i].tool_define_id,
                                'toolDefineName': theSelectedGet[i].tool_define_name,
                                'number': theSelectedGet[i].quantity,
                                'bdUom': bdUom,
                            }
                            vt.sparePartsSelected.push(partsItem);
                            vt.toAdd_spareParts();
                        }

                    }
                }).catch((err) => {
                    console.log(err);
                });
            },


            review_eauipment(){
                let vt = this;
                let equeItem = {};
                this.$axios.get('/eamStandardSolution/location/equipmentList', {
                    params: {
                        standardSolutionVersionId: vt.theStandWorkId
                    }
                }).then((response) => {

                        let code = response.data.response.code;
                        if (code != 1) {
                            vt.$Message.error(response.data.response.msg);

                        }
                        else {
                            let theSelectedGet = response.data.response.data;
                            console.log(theSelectedGet);
                            for (var i in theSelectedGet) {
                                equeItem = {
                                    "id": theSelectedGet[i].id,
                                    'title': theSelectedGet[i].name,
                                }
                                vt.treeSiteDataSelected.push(equeItem);
                            }
                            ;
                        }
                    }
                ).catch((err) => {
                    console.log(err);
                });

            },

//            kp--备品备件相关--开始
            //可供选择的备品备件列表：
            addBtn_spareParts(){
                if (this.workForm.equId && this.workForm.supply) {
                    this.sparePartsMod = true;
                    this.toSearch = "cansearch";
                }
                else {
                    if (!this.workForm.equId) {
                        this.tipMessage = "请选择设备型号！"
                    }
                    else if (!this.workForm.supply) {
                        this.tipMessage = "请选择所属供应商！"
                    }
                    this.commonModal = true;
                }
                ;
            },


            //kp--获取组件数据
            spareParts_dataSelectedDisa(messagea){
                {
                    //接收传回到页面的已选择数据,赋值给变量：
                    this.sparePartsSelected = messagea;

                }
            },
            //弹出框确认按钮：
            toAdd_spareParts(){
                this.spareParts_display = [];
                for (var i = 0; i < this.sparePartsSelected.length; i++) {
                    this.spareParts_display.push(this.$fc.cloneKey(this.sparePartsSelected[i]));
    this.spareParts_display[i].number = this.sparePartsSelected[i].number?this.sparePartsSelected[i].number:1;
                }
                ;
            },
            //删除：
            delete_spareParts(item){
                this.spareParts_display.splice(item, 1);
                this.sparePartsSelected.splice(item, 1);
            },

            //验证是否是正整数
            toTestIsNAN(x){
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
            },
            //kp--备品备件相关--结束
            //kp---适用设备--动态获取组件每次进行添加或删除操作后的数据---开始
            dataSelectedDisa(messagea){
                {
                    //接收传回到页面的已选择数据,赋值给变量：
                    this.treeSiteDataSelected = messagea;
                }
            },
            //kp---适用设备--动态获取组件每次进行添加或删除操作后的数据---结束

//            kp---地点设备列表，树图初始化  --开始:
            toSearch_equment() {
                let vt = this;
                this.$axios.get('/eamStandardSolution/location/getPartTree', {
                    params: {
                        modelId: vt.workForm.equId,
                        manufacturer: vt.workForm.supply,
                    }
                }).then((response) => {
                    let code = response.data.response.code;
                    if (code != 1) {
                        vt.$Message.error(response.data.response.msg);
                    }
                    else {
                        vt.treeSiteData = response.data.response.data;
                        if (!vt.treeSiteData[0].title) {
                            vt.treeTip = "暂无数据";
                        }
                        else {
                            vt.treeTip = "";
                        }
                        ;
                    }
                }).catch((err) => {
                });
            },
//            kp---地点设备列表，树图初始化  --结束:

            jiazai: function(id){
                this.$axios.post('tpmStandardSolution/'+id+'/'+2+'/detail').then((res) => {
//                    console.log('data:'+JSON.stringify(res.data.response.data));
                    var result = res.data.response.data.tpmStandardSolutionVersion;
                    this.tpmssId = res.data.response.data.tpmssId;
                    this.workForm = result;
                    this.workForm.code = result.tpmStandardSolution.code;
                    this.workForm.name = result.tpmStandardSolution.name;
                    this.workForm.requiredTime =Math.round(parseFloat(result.requiredTime)*60);
                    if(result.isDefaultVersion == 0){
                        this.workForm.isDefaultVersion = true;
                    }else{
                        this.workForm.isDefaultVersion = false;
                    }
                    if(result.needShutdown == 0){
                        this.workForm.needShutdown = true;
                    }else{
                        this.workForm.needShutdown = false;
                    }

                    //作业项目
                    var tssa = res.data.response.data.tpmStandardSolutionAction;//TODD
                    this.data1 = tssa;
                    for(var n in tssa){
                        this.data1[n].requiredTime = Math.round(parseFloat(tssa[n].requiredTime)*60);
                    };
                    this.data2 = res.data.response.data.tpmStandardSolutionMaterial;
                    this.data3 = res.data.response.data.tpmStandardSolutionDept;
                    this.data4 = res.data.response.data.tpmStandardSolutionEquipment;
                    this.data5 = res.data.response.data.tpmStandardSolutionInhibition;

                }).catch((err) => {
                    console.log(err);
                })
            },
            del () {
                this.$axios.post('tpmStandardSolution/delete', {'tpmStandardSolutionId': this.tpmSSVId}).then((res) => {
                    if (res.data.response.data.msg == 'success') {
                        alert("删除成功！")
                        this.$router.push({path: '/standardwork'});
                    }else if (res.data.response.data.msg == 'wrong'){
                        alert("方案存在依赖,无法删除！");
                    }else {
                        alert("删除失败！")
                    }
                }).catch((err) => {
                    console.log(err);
                });
            },
            
            /*************详情接口 xulin****************/
            detail(id,flag) {
            	this.$axios.post('/eamStandardSolution/'+id+'/'+flag+'/getVersionDetails').then((res) => {
            		console.log(res.data.response);
            		var result = res.data.response.data;
                    if (res.data.response.code == 1) {
                    	this.workForm = result;
                        
                    	this.workForm.needShutdown = result.needShutDown == 0? true:false; //是否停机
                    	this.workForm.type = Number(result.type) == 0? '保养':'点检';
                    	this.workForm.station = result.actRole; //执行岗位
                    	this.workForm.stationId = result.actRoleId;
                        this.workForm.statusText = result.status == 0? '制单中':result.status == 1?'生效中':'已失效';
                        this.workForm.isDefaultVersion = result.isDefaultVersion == 0? true:false; //是否默认版本
                        this.workForm.equ_type = result.model_name; //设备型号
						this.workForm.supply = result.manufacturer; //所属供应商

                        //--kp--详情页进来会默认查询适用设备的关联树：
                        this.workForm.equId = result.model_id;
                        this.toSearch_equment();
                        //end
                    }
                    else{
                    	this.$Message.error(ret.msg)
                    }
                }).catch((err) => {
                    console.log(err);
                });
            },
            /*****作业项目接口*****/
            operatingItem(){
            	this.$axios.post('eamStandardSolution/a/' + this.tpmSSVId).then( (res) => {
                    let ret = res.data.response;
                    console.log(ret);
                    if(ret.code==1){
                    	this.data1 = ret.data;
                    	for(var i in this.data1){     
                    		if(this.data1[i].required_time!=''){
                    			this.data1[i].required_time = parseInt(this.data1[i].required_time);
                    		}                    		
                    	}

                    }
//                  else{
//                  	this.$Message.error('作业项目'+ret.msg)
//                  }

                })
            },
            handleView(img){
            	this.imgUrl = img;
            	this.visible = true
            },
            
            /********生效失效 xulin**********/
           	submit(id){
           		this.submitId = id;
           		this.promptModal = true;
           		if(this.submitId==0){
           			this.statusT = '制单中'
           		}
           		else{
           			this.statusT = '生效'
           		}
            },
            editStatus(){
            	this.modal_loading = true;
                this.promptModal = false;
                this.$axios.post('/eamStandardSolution/getEffectiveOrSingle', {EamStandardSolutionVersionId: this.theStandWorkId,status:this.submitId}).then((res) => {
                    console.log(res.data.response);
                    var ret = res.data.response;
                    if (ret.code == 1) {
                        this.$Message.success(ret.data);
                        this.$router.push({path: '/standardwork'})
                    }
                    else {
                        this.$Message.error(ret.msg)
                    }
                    setTimeout(() => {
                        this.modal_loading = false;
                    }, 500);

                }).catch((err) => {
                    console.log(err);
                });
            },
            
            //作废删除
            cancelPlan (cancelId) {
                this.load = true;
                this.delModal = false;
                if (cancelId == 0) {
                    var http = 'eamStandardSolution/invalidEamStandardSolution'; //作废
                    var del = '作废'
                }
                else {
                    var http = 'eamStandardSolution/deleteEamStandardSolution'; //删除
                    var del = '删除';
                }
                this.$axios.post(http, {standardSolutionVersionId: this.theStandWorkId}).then((res) => {
                    let ret = res.data.response;
                    console.log(ret)
                    if (ret.code == 1) {
                        this.$Message.success(del + '成功');
                        this.$router.push({path: '/standardwork'})
                    }
                    else {
                        this.$Message.error(ret.msg);
                    }
                    setTimeout(() => {
                        this.load = false;
                    }, 500);
                })

            },
            delPrompt(i){
                this.delId = i;
                if (i == 0) {
                    this.del = '作废'
                }
                else {
                    this.del = '删除'
                }
                this.delModal = true;

            },
        }
    }
</script>

<style>
    .bzzy-change .btn-group {
        margin: 15px 0px;
        text-align: center;
    }

    .bzzy-change .btn-group button {
        margin: 0px 10px;
    }
</style>
