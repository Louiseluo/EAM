<template>
	<div class="basic fault-content">
		<div class="title">
			<span>领用记录</span>
		</div>
		<!--<div class="titleListManage">
			<ul class="tabUL">
				<li>
					<router-link to='/spareParts'>备件管理</router-link>
				</li>
				<li>
					<router-link to='/typeManage'>类型管理</router-link>
				</li>
				<li>
					<router-link to='/supplierManage'>供应商管理</router-link>
				</li>
				<li class="active">
					<a>领用记录</a>
				</li>
			</ul>
		</div>-->
		<!--表单-->
        <div class="form-content">
        	<Form ref="leadData" :model="leadData" label-position="right" inline :label-width="100">
				<FormItem label="备件编码">
					<Input v-model="leadData.code" @on-blur="leadData.code = toValidate(leadData.code)" style="width: 180px;"></Input>
				</FormItem>
                <FormItem label="备件名称">
                	<Input v-model="leadData.name" @on-blur="leadData.name = toValidate(leadData.name)" style="width: 180px;"></Input>
                </FormItem>
                <FormItem label="领用人">
                	<Input v-model="leadData.person" @on-blur="leadData.person = toValidate(leadData.person)" style="width: 180px;"></Input>
                </FormItem>
                <FormItem label="领用仓库">
                	<Select v-model="all2" clearable style="width: 180px;" >
                        <Option v-for="item in leadData.condition" :value="item.warehouseId" :key="item.warehouseName">{{ item.warehouseName }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="关联工单号">
                	<Input v-model="leadData.related" @on-blur="leadData.related = toValidate(leadData.related)" style="width: 180px;"></Input>
                </FormItem>
                <FormItem label="领用时间" >
                    <Row>
                        <Col span="11">
                        	<DatePicker type="datetime" placeholder="选择日期和时间" v-model="leadData.startTime" @on-change="checkStart" :editable="editable"></DatePicker>
                        </Col>
                        <Col span="2" style="text-align: center;">
                        	-
						</Col>
                        <Col span="11">
                        	<DatePicker type="datetime" placeholder="选择日期和时间" v-model="leadData.endTime" @on-change="checkEnd" :editable="editable"></DatePicker>
                        </Col>
                    </Row>
                </FormItem>
            </Form>    
            <!--查询按钮-->
            <div class="btn-query">
            	<Button type="primary" icon="forward" size="large" disabled>导出</Button>
                <Button v-if="if_query" type="primary" icon="search" size="large" @click="partsChange(1)">查询</Button>
            </div>
        </div>
        <!--表格-->
        <div class="table-content ivu-table-auto">
            <Table stripe border :columns="columns1" :data="tableData1"></Table>
        </div>
        <div class="page">
			<Page :total="partsNum" size="small" show-elevator :page-size="10" @on-change="partsChange" :current="tempPage"></Page>
		</div>
        <!--查看-->
        <Modal v-model="leadDetail" :title="modelTitle" width="780" :styles="{top: '100px'}">
        	<div class="second-title">领用记录-查看</div>
	        <div class="form-content" style="border-radius: 5px;">
	        	<Form ref="detailData" :model="detailData" inline :label-width="60">
	                <FormItem label="备件编码">
	                	<Input v-model="detailData.sparePartCode" style="width: 160px;" disabled></Input>
	                </FormItem>
	                <FormItem label="备件名称">
	                	<Input v-model="detailData.sparePartName" style="width: 160px;" disabled></Input>
	                </FormItem> 
	                <FormItem label="领用数量">
	                	<Input v-model="detailData.ioQuantity" style="width: 160px;" disabled></Input>
	                </FormItem>
	                <FormItem label="领用单位">
	                	<Input v-model="detailData.ioUomName" style="width: 160px;" disabled></Input>
	                </FormItem>
	                <FormItem label="领用仓库">
	                	<Input v-model="detailData.warehouseName" style="width: 160px;" disabled></Input>
	                </FormItem>
	                <FormItem label="领用人">
	                	<Input v-model="detailData.receiptor" style="width: 160px;" disabled></Input>
	                </FormItem>
	                <FormItem label="领用时间">
	                	<Input v-model="detailData.ioTime" style="width: 160px;" disabled></Input>
	                </FormItem>	                
	            </Form>    
	        </div>
	        <div class="second-title">关联工单</div>
	        <div class="form-content" style="border-radius: 5px;">
	        	<Form ref="detailData" :model="detailData" inline :label-width="60">
	                <FormItem label="工单编码">
	                	<Input v-model="detailData.billNo" style="width: 160px;" disabled>
	                		<Button slot="append" icon="ios-search" ></Button>
	                	</Input>
	                </FormItem>
	                <!--<FormItem label="工单名称">-->
	                	<!--<Input v-model="detailData.gdname" style="width: 160px;" disabled></Input>-->
	                <!--</FormItem> -->
	                <FormItem label="工单类型">
	                	<Input v-model="detailData.billType" style="width: 160px;" disabled></Input>
	                </FormItem>
	                <FormItem label="执行人">
	                	<Input v-model="detailData.operator" style="width: 160px;" disabled></Input>
	                </FormItem>
	                <FormItem label="执行日期">
	                	<Input v-model="detailData.dispatchTime" style="width: 160px;" disabled></Input>
	                </FormItem>
	            </Form>    
	        </div>
	        <div slot="footer">
	            <Button type="primary" @click="leadDetail=false">返回</Button>
	        </div>
	    </Modal>
    </div>    
</template>
<script>
	export default {
		data(){
			return {
				/*权限校验 start*/
                if_query:  this.$rt(this.authJson.EAM.备件管理.备件领用记录列表.查询),
				leadData: {
                    code: '',
					name: '',
					person: '',
					condition: [],
					related: '',
					startTime: '',
					endTime: '',
				},
				all: 'all',
				all2: '',
				all3: 'one',
				all4: 'one',
				editable: false,
                created: false,
                partsNum: 5,
                tempPage: 1,
                modelTitle: '',
				columns1: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 80,
                        align: 'center'
                    },
                    {
                        title: '备件编码',
                        key: 'sparePartCode',
                        align: 'center',
                        render: (h, params) => {
                            return h('p', {
                                domProps: {
                                    title: params.row.sparePartCode
                                },
                                class: 'iview_tabDis',
                            }, params.row.sparePartCode)
                        },
                    },
                    {
                        title: '备件名称',
                        key: 'sparePartName',
                        align: 'center',
                        render: (h, params) => {
                            return h('a', {
//                                domProps: {
//                                    title: params.row.sparePartName
//                                },
//                                class: 'iview_tabDis',
                                on: {
                                    click: () => {
                                        this.goSparePart(params.row.sparePartId);
                                    }
                                }
                            }, params.row.sparePartName)
                        },
                    },
                    {
                        title: '领用数量',
                        key: 'ioQuantityandUom',
                        align: 'center',
                        render: (h, params) => {
                            return h('p', {
                                domProps: {
                                    title: params.row.ioQuantityandUom
                                },
                                class: 'iview_tab_numDis',
                            }, params.row.ioQuantityandUom)
                        },
                    },
                    /*{
                        title: '领用单位',
                        key: 'ioUomName',
                        align: 'center',
                        render: (h, params) => {
                            return h('p', {
                                domProps: {
                                    title: params.row.ioUomName
                                },
                                class: 'iview_tabDis',
                            }, params.row.ioUomName)
                        },
                    },*/
                    {
                        title: '关联工单号',
                        key: 'billNo',
                        align: 'center',
                        render: (h, params) => {
                            return h('a', {
//                                domProps: {
//                                    title: params.row.billNo
//                                },
//                                class: 'iview_tabDis',
                                on: {
                                    click: () => {
                                        this.goBill(params.row.dispatchOrderId,params.row.type);
                                    }
                                }
                            }, params.row.billNo)
                        },
                    },
                    {
                        title: '关联申领单号',
                        key: 'applyFormNo',
                        align: 'center',
                        render: (h, params) => {
                            return h('p', {
                                domProps: {
                                    title: params.row.applyFormNo
                                },
                                class: 'iview_tabDis',
                            }, params.row.applyFormNo)
                        },
                    },
                    {
                        title: '领用部门',
                        key: 'applierDeptName',
                        align: 'center'
                    },
					{
                        title: '领用人',
                        key: 'applier',
                        align: 'center'
                    },
                    {
                        title: '领用时间',
                        key: 'applyTime',
                        align: 'center'
                    },
                    {
                        title: '领用仓库',
                        key: 'warehouseName',
                        align: 'center',
                        render: (h, params) => {
                            return h('p', {
                                domProps: {
                                    title: params.row.warehouseName
                                },
                                class: 'iview_tabDis',
                            }, params.row.warehouseName)
                        },
                    }
                ],
                tableData1:[],
                leadDetail: false,
				detailData: {
                    sparePartCode: '',
                    sparePartName: '',
                    ioQuantity: '',
                    ioUomName: '',
                    warehouseName: '',
                    receiptor: '',
                    ioTime: '',
                    billNo: '',
//					gdname: '',
                    billType: '',
                    operator: '',
                    dispatchTime: ''
				},
			}
		},
        mounted(){
            if (this.$route.query.theTab) {
                this.name = this.$route.query.theTab;
            };
            this.get_warehouse();
            this.get_leadRecord();
        },
        activated: function () {
            this.created && this.get_leadRecord();
            this.created = true;
        },
		methods: {
            toValidate(msg){
                console.log(msg);
                var str = /[=+%!<>"'/_,()\\]/
                if(str.test(msg)){
                    this.$Message.warning('输入格式错误')
                    msg = msg.replace(/\'/g,"").replace(/\"/g,"").replace(/\+/g,"").replace(/\=/g,"").replace(/\%/g,"").replace(/\!/g,"").replace(/\</g,"").replace(/\>/g,"").replace(/\//g,"").replace(/\_/g,"").replace(/\,/g,"").replace(/\(/g,"").replace(/\)/g,"").replace(/\\/g,"");
                }
                return msg
            },
//			list_show(index){
//	          this.$router.push({path:'/orderDetail',query: {workOrderId: index}});
//	      	},
            //领用仓库下拉
            get_warehouse() {
                let wt = this;
                this.$axios.post('/eamSparePart/getWarehouse').then((res) => {
                    let rwt = res.data;
//                    console.log('领用记录领用记录res '+ JSON.stringify(rwt ));
					wt.leadData.condition = rwt.rows;
                }).catch((err) => {
                    console.log(err);
                });
            },
            //获取领用记录列表
            get_leadRecord(){
                let vt = this;
                this.$axios.post('/eamSparePart/ioFlowList',
                    {
                        page: vt.tempPage,
                        pageSize: 10,
                        sparePartCode: vt.leadData.code,
                        sparePartName: vt.leadData.name,
                        receiptor: vt.leadData.person,
                        warehouseId: vt.all2 == -1 ? "" : vt.all2,
                        billNo: vt.leadData.related,
                        createStart: vt.leadData.startTime,
                        createEnd: vt.leadData.endTime,
                    }).then((res) => {
                    let result = res.data.response;
//                    console.log('77777777777 '+ JSON.stringify(result) );
                    if (result.code != 1) {
                        vt.$Message.error(result.msg);
                    }
                    else {
                        this.partsNum = result.data.total;
                        this.tableData1 = [];
                        let data = result.data.rows
//                        this.tableData1 = result.data.rows;
                        for (let i = 0; i < data.length; i++) {
                            let obj = {};
                            obj.detailId = data[i].detailId;
                            obj.sparePartId = data[i].sparePartId;
                            obj.sparePartName = data[i].sparePartName;
                            obj.sparePartCode = data[i].sparePartCode;
                            obj.dispatchOrderId = data[i].dispatchOrderId;
                            obj.billNo = data[i].billNo;
                            obj.type = data[i].type;
                            obj.applier = data[i].applier;
                            obj.applyTime = data[i].applyTime;
                            obj.applyFormId = data[i].applyFormId;
                            obj.applyFormNo = data[i].applyFormNo;
                            obj.applierDeptId = data[i].applierDeptId;
                            obj.applierDeptName = data[i].applierDeptName;
                            obj.ioQuantityandUom = data[i].ioQuantity+ ' ' +data[i].ioUomName;
                            obj.warehouseName = data[i].warehouseName;
                            this.tableData1.push(obj);
						}
                    }
                }).catch((err) => {
                    console.log(err);
                });
            },
            //关联到备件详情页
            goSparePart (id) {
                this.$router.push({path: '/spareAdd', query: { from: 'toDetail', id: id }});
            },
            //关联到工单详情页
            goBill (id,type) {
                console.log(type)
                if(type==0){
                    this.$router.push({path: '/orderReceipt', query: { orderId: id }});
                }
                if(type==2){
                    this.$router.push({path: '/maintenanceMain', query: { orderId: id }});
                }
            },
            //领用记录查看
            lead_detail(id) {
                let dt = this;
                this.$axios.post('/eamSparePart/ioFlowDetail', {ioFlowId: id}).then((res) => {
                    let ret = res.data.response;
//                    console.log('领用记录领用记录res '+ JSON.stringify(ret));
//                    console.log('领用记录领用记录id '+ id );
                    if (ret.code != 1) {
                        this.$Message.error(ret.msg);
                    } else {
                        this.leadDetail = true;
                        this.modelTitle = '领用记录查看';
                        dt.detailData = ret.data;
                    }
                }).catch((err) => {
                    console.log(err);
                });
            },
            partsChange(current){
                this.tempPage = current;
                this.get_leadRecord();
            },
            //开始日期应小于结束日期
            checkStart(time){
                var stime = time;
                if (this.leadData.endTime != '') {
                    if (stime > this.leadData.endTime) {
                        this.notFitDataTip = '开始时间应在结束时间之前';
                        this.$Message.error(this.notFitDataTip);
                    }
                    else {
                        this.notFitDataTip = ""
                    };
                };
                this.leadData.startTime = stime
            },
            //结束日期应大于开始日期
            checkEnd(time){
                var etime = time;
                if (this.leadData.startTime != '') {
                    if (etime < this.leadData.startTime) {
                        this.notFitDataTip = '结束时间应在开始时间之后';
                        this.$Message.error(this.notFitDataTip);
                    }
                    else {
                        this.notFitDataTip = ""
                    }
                };
                this.leadData.endTime = etime;
//                if (this.time_start!= '') {
//                    if (this.time_end<= this.time_start) {
//                        this.$Message.error('结束时间应大于开始时间');
//                    }
//                }
            }
		}
	}	
</script>