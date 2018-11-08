<template>
	<div class="basic fault-content">
		<div class="title">
			<span>类型管理</span>
		</div>
		<!--<div class="titleListManage">
			<ul class="tabUL">
				<li>
					<router-link to='/spareParts'>备件管理</router-link>
				</li>
				<li class="active">
					<a>类型管理</a>
				</li>
				<li>
					<router-link to='/supplierManage'>供应商管理</router-link>
				</li>
				<li>
					<router-link to='/leadRecord'>领用记录</router-link>
				</li>
			</ul>
		</div>-->
		<div class="form-content" style="height: 220px;overflow: hidden;">
			<Row class="wid-80">
				<Col span="8">
					<div class="tree" style="height: 200px;overflow: auto;width: 300px;float: left;margin-left: 50px;">
						<Tree :data="treedata" @on-select-change="selectedSpare"></Tree>
					</div>
				</Col>
				<Col span="16">
					<div class="tree-detail" style="float: left;width: 900px;">
						<Form v-if="createNew==false" label-position="right" inline :label-width="100">
							<FormItem label="上级分类">
								<Input :maxlength="10" v-model="detailData.parentCategoryName" style="width: 160px;" disabled></Input>
							</FormItem>
							<FormItem label="分类编码">
								<Input :maxlength="20" v-model="detailData.code" style="width: 160px;"  disabled></Input>
							</FormItem>
							<FormItem  label="分类名称">
								<Input v-model="detailData.name" style="width: 160px;"  :disabled="dis"></Input>
							</FormItem>
							<FormItem  label="分类全称">
								<Input :maxlength="50" v-model="detailData.fullName" style="width: 160px;"  :disabled="dis"></Input>
							</FormItem>
						</Form>
						<Form v-if="createNew==true" label-position="right" inline :label-width="100">
							<FormItem label="上级分类">
								<Input :maxlength="10" v-model="detailData.name" style="width: 160px;" disabled></Input>
							</FormItem>
							<FormItem label="分类编码" prop="code">
								<Input @on-blur="lengthChange(newDetail.code)" v-model="newDetail.code" style="width: 160px;"></Input>
							</FormItem>
							<FormItem  label="分类名称" prop="name">
								<Input @on-blur="lengthChange(newDetail.name)" v-model="newDetail.name" style="width: 160px;"></Input>
							</FormItem>
							<FormItem  label="分类全称" prop="fullName">
								<Input @on-blur="allChange(newDetail.fullName)" v-model="newDetail.fullName" style="width: 160px;"></Input>
							</FormItem>
						</Form>
						<!--查询按钮-->
						<div class="btn-query" style="display: block;margin: 20px 180px;">
							<Button v-if="if_add" v-show="btn==false" type="primary" @click="create">新建</Button>
							<Button v-if="if_edit" v-show="btn==false" type="primary" @click="editTool">编辑</Button>
							<Button v-if="if_del" v-show="btn==false" type="primary" @click="deleteModal=true" >删除</Button>
							<Button v-if="if_back" v-show="btn==true" type="primary" @click="cancel">取消</Button>
							<Button v-if="if_save" v-show="btn==true" type="primary" @click="submit" >保存</Button>
						</div>
					</div>
				</Col>
			</Row>
		</div>
		<!--表格-->
		<div class="table-content ivu-table-auto" style="margin-bottom: 50px;">
			<Table stripe border :columns="columns" :data="tableData"></Table>
			<div class="mar-t-10" style="overflow: hidden">
				<div style="float: right;">
					<Page :total="totalNum" size="small" show-elevator :page-size="pageSize" :current="page" @on-change="pageChange"></Page>
				</div>
			</div>
		</div>
		<Modal v-model="deleteModal" width="360">
			<p slot="header" style="color:#f60;text-align:center">
				<Icon type="information-circled"></Icon>
				<span>删除确认</span>
			</p>
			<div style="text-align:center">
				<p>是否删除此备件？</p>
			</div>
			<div slot="footer">
				<Button type="primary" size="large" long :loading="load" @click="deleteTool">删除</Button>
			</div>
		</Modal>
		<!--上级分类-->
		<!--<Modal v-model="treeTool" width="360" title="上级分类选择" @on-ok="">
            <div style="height: 150px;overflow: auto;">
                <Tree :data="treedata2" @on-select-change="selectedSpare2"></Tree>
            </div>
        </Modal>-->
		<Modal v-model="saveModal" width="360">
			<p slot="header" style="color:#f60;text-align:center">
				<Icon type="information-circled"></Icon>
				<span>保存确认</span>
			</p>
			<div style="text-align:center">
				<p>确认保存此分类？</p>
			</div>
			<div slot="footer">
				<Button type="primary" size="large" long :loading="loadSave" @click="saveTool">保存</Button>
			</div>
		</Modal>
	</div>
</template>
<script>
    export default {
        created: function () {
            this.treeDataList();
        },
		activated () {
            this.created && this.tableListData();
            this.created = true;
		},
        data(){
            return {
                /*权限校验 start*/
                if_add:  this.$rt(this.authJson.EAM.备件管理.备件基础数据_类型管理列表.新建),
                if_del:  this.$rt(this.authJson.EAM.备件管理.备件基础数据_类型管理列表.删除),
                if_edit:  this.$rt(this.authJson.EAM.备件管理.备件基础数据_类型管理列表.编辑),
                if_back:  this.$rt(this.authJson.EAM.备件管理.备件基础数据_类型管理新建页.取消),
                if_save:  this.$rt(this.authJson.EAM.备件管理.备件基础数据_类型管理新建页.保存),
                if_detail:  this.$rt(this.authJson.EAM.备件管理.备件基础数据_类型管理列表.查看),
                /*权限校验 end*/
                created: false,
                treedata: [],
                lenTip: '',
                valTip: '',
//				expand: true,
                detailData: {
                    code: "",
                    name: '',
                    fullName: '',
                    parentCategoryName: "",
                    parentCategoryId: ''
                },
                initId: '',
                dis: true,
                deleteModal: false,
                delId: '',
                load: false,
                createNew: false,
                btn: false,
                treeTool: false,
                newDetail: {
                    code: '',
                    name: '',
                    fullName: ''
                },
                saveModal: false,
                loadSave: false,
                totalNum: 0,
                page: 1,
                pageSize: 10,
                cateParent: [
                    {
                        value: 'one',
                        label: '通用型设备'
                    },
                    {
                        value: 'two',
                        label: '特殊型设备'
                    },
                    {
                        value: 'none',
                        label: '无'
                    }
                ],
                all: '',
                supplierName: [],
                localName: [],
                warehouseName: [],
                columns: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 80,
                        align: 'center'
                    },
                    {
                        title: '备件编码',
                        key: 'code',
                        width:150,
                        align: 'center',
                        render: (h, params) => {
                            return h('p', {
                                domProps: {
                                    title: params.row.code
                                },
                                class: 'iview_tabDis',
                            }, params.row.code)
                        },
                    },
                    {
                        title: '备件名称',
                        key: 'name',
                        align: 'center',
                        render: (h, params) => {
                            return h('p', {
                                domProps: {
                                    title: params.row.name
                                },
                                class: 'iview_tabDis',
                            }, params.row.name)
                        },
                    },
                    {
                        title: '备件型号',
                        key: 'modelName',
                        align: 'center',
                        render: (h, params) => {
                            return h('p', {
                                domProps: {
                                    title: params.row.modelName
                                },
                                class: 'iview_tabDis',
                            }, params.row.modelName)
                        },
                    },
                    {
                        title: '备件单位',
                        key: 'uomName',
                        align: 'center',
                        render: (h, params) => {
                            return h('div',{
                                domProps: {
                                    title: params.row.uomName
                                },
                                class: 'iview_tabDis',
                            },params.row.uomName);
                        }
                    },
                    {
                        title: '运输方式',
                        key: 'transportationType',
                        align:'center',
                        render: (h, params) => {
                       		 return h('div',{
                                domProps: {
                                    title: params.row.transportationType
                                },
                                class: 'iview_tabDis',
                            },params.row.transportationType);
//                            return h('div',params.row.transportationType==0?'人工搬运':params.row.transportationType==1?'手动推车':'自动叉车');
                        }
                    },
                    {
                        title: '仓库名称',
                        key: 'wareHousemName',
                        align:'center',
                        render: (h, params) => {
                           return h('span','--')
                        }
                        /*render: (h, params) => {
                            return h('span',{
                                domProps: {
                                    title:this.warehouseName[params.index]
                                },
                                class: 'iview_tabDis',
                            },this.warehouseName[params.index])
                        }*/
                    },
                    {
                        title: '库存单位',
                        key: 'stockUom',
                        align:'center',
                        render: (h, params) => {
                            return h('span','--')                                                   
                        }
                    },
                    {
                        title: '库存安全值',
                        key: 'stockThreshold',
                        align:'center',
                        render: (h, params) => {
                            return h('span','--')                                                   
                        }
                    },
                    {
                        title: '库存状态',
                        key: 'stockStatus',
                        align:'center',
                        render: (h, params) => {
                            return h('span','--')
                        }
                    },
                    {
                        title: '供应商',
                        key: 'supplierName',
                        align:'center',
                        /* render: (h, params) => {
                             return h('span',{
                                 domProps: {
                                     title: this.supplierName[params.index]
                                 },
                                 class: 'iview_tabDis',
                             },this.supplierName[params.index])
                         },*/

                    },
                    {
                        title: '采购单位',
                        key: 'purchaseUom',
                        align:'center',
                        render: (h, params) => {
                            return h('span','--')                                                   
                        }
                    },
                    {
                        title: '创建时间',
                        key: 'createTime',
                        align:'center',
                        width: 150,
                        render: (h, params) => {
                            return h('div',{
                                domProps: {
                                    title: params.row.createTime
                                },
                                class: 'iview_tabDis',
                            },params.row.createTime);
                        }
                    },
                    {
                        title: '操作',
                        key: 'edit',
                        align:'center',
                        render: (h, params) => {
                            if (this.if_detail) {
                            return h('a', {
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
//                                        this.$router.push({path: '/spareAdd',query: {'id': params.row.id, 'from': 'toDetail',theTab:"name2"}});
                                        this.$router.push({path: '/spareAdd',query: {id: params.row.sparePartId}});
                                    }
                                }
                            }, '查看')
                            }
                        }
                    },
                ],
                tableData: [
                    /*{
                        wareHousemName:{warehouseName: '',localName:''},
                        warehouseName: '',
                        localName: '',
                        bdUom:{localName: ''},
                        supplierName:{supplierName: ''}

                    }*/
                ],
            }
        },
        methods: {
            treeDataList(){
                this.$axios.get('/eamSparePart/getTooTypeTree').then((res) => {
//                    console.log('treeDataList== '+JSON.stringify(res));
                    var result = res.data.response;
                    if(res.data.response.code==1){
                        this.treedata = res.data.response.data;
                        this.initId = this.treedata[0].id;
                        this.treedata[0].expand = true;
                        this.delId = this.initId;
                        this.initData();
                        setTimeout(() => {
                            this.tableListData();
                        }, 1000);
                    }
                    else{
                        this.$Message.error(res.data.response.msg)
                    }
                }).catch((err) => {
                    console.log(err);
                });

            },
            initData(){
                this.$axios.post('/eamSparePart/sparePartCategoryDetail',{categoryId:this.initId}).then((res) => {
//                    console.log('initData == '+ JSON.stringify(res.data.response));
                    if(res.data.response.code==1){
                        this.detailData = res.data.response.data;
                        this.detailData.fullName = res.data.response.data.fullName;
                        this.detailData.parentCategoryName = res.data.response.data.parentCategoryName;
                        this.detailData.parentCategoryId = res.data.response.data.parentCategoryId;
                    }
                    else{
                        this.$Message.error(res.data.response.msg)
                    }
                }).catch((err) => {
                    console.log(err);
                });
            },
            selectedSpare(left_node){
                this.dis = true;
                this.btn = false;
                this.createNew = false;
                if (JSON.stringify(left_node) == "[]") {
                    return
                }
                if (left_node[0] && left_node[0].children) {
                    left_node[0].expand = !left_node[0].expand;
                    left_node[0].selected = true;
                }
                let id = left_node[0].id;
                this.delId = id;
                this.detailList(id);
                this.tableListData();
            },
            detailList(id){
                this.$axios.post('/eamSparePart/sparePartCategoryDetail',{categoryId:id}).then((res) => {
//                    console.log('分类详情： '+JSON.stringify(res));
                    var ret = res.data.response;
                    if(ret.code==1){
                        this.detailData = ret.data
                    }
                    else{
                        this.$Message.error(ret.msg)
                    }
                }).catch((err) => {
                    console.log(err);
                });
            },
            tableListData(){
                this.$axios.post('/common/getSparePartByCategory',
                    {
                        page:this.page,
                        pageSize:10,
                        categoryId:this.delId
                    }).then((res) => {
//				    console.log('000 == '+this.delId)
//                    console.log('tableListData == '+JSON.stringify(res.data.response.data));
                    var ret = res.data.response;
                    if(ret.code==1){
                        this.tableData = ret.data.rows;
                        this.totalNum = ret.data.total;
                        /*var sname,lname,wname;
                        this.supplierName=[];
                        this.localName=[];
                        this.warehouseName=[];
                        for(var i in this.tableData){
                            if(!this.tableData[i].supplierName){
                                sname = '';
                            }
                            else{
                                sname = this.tableData[i].supplierName.supplierName
                            }
                            this.supplierName.push(sname)
                            if(!this.tableData[i].bdUom){
                                lname=''
                            }
                            else{
                                lname = this.tableData[i].bdUom.localName
                            }
                            this.localName.push(lname)
                            if(!this.tableData[i].wareHousemName){
                                wname = ''
                            }
                            else{
                                wname = this.tableData[i].wareHousemName.warehouseName
                            }
                            this.warehouseName.push(wname)
                        }*/
                    }
                    else{
                        this.$Message.error(ret.msg)
                    }
                }).catch((err) => {
                    console.log(err);
                });
            },
            pageChange(page){
                this.page = page;
//				console.log('page == '+this.page);
                this.tableListData()
            },
            //删除
            deleteTool(){
                this.load = true;
                this.$axios.get('/eamSparePart/sparePartCategoryDelete',{params:{categoryId:this.delId}}).then((res) => {
//                    console.log('deleteData == '+JSON.stringify(res.data.response));
                    var ret = res.data.response;
                    this.deleteModal = false;
                    if(ret.code==1){
                        this.$Message.success('删除成功');
                        this.treeDataList();
                    }
                    else{
                        this.$Message.error(ret.msg)
                    }
                    setTimeout(() => {
                        this.load = false;
                    }, 500);

                }).catch((err) => {
                    console.log(err);
                });
            },
            //弹出保存保存对话框
            submit(){
                if (this.lenTip != '') {
//                    console.log('不能保存！！！'+this.lenTip)
                    this.$Message.error(this.lenTip);
                    return;
				} else if(this.valTip != '') {
//                    console.log('不能保存！！！'+this.valTip)
                    this.$Message.error(this.valTip);
                    return;
				} else {
                    this.saveModal = true;
                    if(this.createNew == false){
                        if(this.detailData.name==''){
                            this.$Message.error('分类名称不能为空');
                            this.saveModal = false;
                        }
                        else if(this.detailData.full_name==''){
                            this.$Message.error('分类全称不能为空');
                            this.saveModal = false;
                        }
                    }
                    else{
                        if(this.newDetail.code==''){
                            this.$Message.error('分类编码不能为空');
                            this.saveModal = false;
                        }
                        else if(this.newDetail.name==''){
                            this.$Message.error('分类名称不能为空');
                            this.saveModal = false;
                        }
                        else if(this.newDetail.fullName==''){
                            this.$Message.error('分类全称不能为空');
                            this.saveModal = false;
                        }
                    }
				}
            },
            //保存
            saveTool(){
                this.loadSave = true;
//				console.log('saveData == '+JSON.stringify(this.detailData));
                //判断是编辑还是新建
                if(this.createNew == false){
                    var data = {
                        categoryId: this.delId,
                        parentCategoryId: this.detailData.parentCategoryId==''?'':this.detailData.parentCategoryId,
                        code: this.detailData.code,
                        name: this.detailData.name,
                        fullName: this.detailData.fullName
                    }
                }
                else{
                    var data = {
                        categoryId:'',
                        parentCategoryId: this.delId,
                        code: this.newDetail.code,
                        name: this.newDetail.name,
                        fullName: this.newDetail.fullName
                    }
                }
                this.$axios.post('/eamSparePart/sparePartCategorySave',data).then((res) => {
//                    console.log("savedata == "+JSON.stringify(data));
//                    console.log("saveData2222 == "+JSON.stringify(res.data.response));
                    var ret = res.data.response;
                    this.saveModal = false;
                    if(ret.code==1){
                        this.$Message.success('保存成功');
                        this.createNew = false;
                        this.btn = false;
                        this.dis = true;
                        this.newDetail = {
                            code: '',
                            name: '',
                            fullName: ''
                        },
                            this.treeDataList();
                    }
                    else{
                        this.$Message.error(ret.msg)
                    }
                    setTimeout(() => {
                        this.loadSave = false;
                    }, 500);

                }).catch((err) => {
                    console.log(err);
                });
            },
            create(){
                this.createNew = true;
                this.btn = true;
            },
            editTool(){
                this.dis = false;
                this.btn = true
//				this.createNew = true
            },
            cancel(){
                this.createNew = false;
                this.dis = true;
                this.btn = false;
                this.detailList(this.delId)
            },
            lengthChange(len){
                if(len.length>20){
                    this.$Message.error('不能超过20个字');
                    this.lenTip = '不能超过20个字';
                } else {
                    this.lenTip = '';
                }
            },
            allChange(val){
                if(val.length>50){
                    this.$Message.error('不能超过50个字');
                    this.valTip = '不能超过50个字';
                } else {
                    this.valTip = '';
                }
            }
        }

    }
</script>