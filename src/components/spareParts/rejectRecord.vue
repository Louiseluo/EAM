<template>
	<div class="basic fault-content">
		<div class="title">
			<span>备件退料记录</span>
		</div>
		<!--表单-->
        <div class="form-content">
        	<Form ref="rejectData" :model="rejectData" label-position="right" inline :label-width="100">
				<FormItem label="备件编码">
					<Input v-model="rejectData.sparePartCode" @on-blur="rejectData.code = toValidate(rejectData.code)" style="width: 180px;"></Input>
				</FormItem>
                <FormItem label="备件名称">
                	<Input v-model="rejectData.sparePartName" @on-blur="rejectData.name = toValidate(rejectData.name)" style="width: 180px;"></Input>
                </FormItem>
                <FormItem label="退料人">
                	<Input v-model="rejectData.applier" @on-blur="rejectData.person = toValidate(rejectData.person)" style="width: 180px;"></Input>
                </FormItem>
                <FormItem label="退料仓库">
                	<Select v-model="rejectData.wareHouse" clearable style="width: 180px;" >
                        <Option v-for="item in rejectData.condition" :value="item.warehouseId" :key="item.warehouseName">{{ item.warehouseName }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="关联工单号">
                	<Input v-model="rejectData.dispatchOrderNo" @on-blur="rejectData.related = toValidate(rejectData.related)" style="width: 180px;"></Input>
                </FormItem>
                <FormItem label="关联退料单号">
                	<Input v-model="rejectData.returnBillNo" @on-blur="rejectData.related = toValidate(rejectData.related)" style="width: 180px;"></Input>
                </FormItem>
                <FormItem label="退料时间" >
                    <Row>
                        <Col span="11">
                        	<DatePicker type="datetime" placeholder="选择日期和时间" v-model="rejectData.returnTimeStart" @on-change="checkStart" :editable="editable"></DatePicker>
                        </Col>
                        <Col span="2" style="text-align: center;">
                        	-
						</Col>
                        <Col span="11">
                        	<DatePicker type="datetime" placeholder="选择日期和时间" v-model="rejectData.returnTimeEnd" @on-change="checkEnd" :editable="editable"></DatePicker>
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
				rejectData: {
                    sparePartCode: '',
                    sparePartName: '',
                    applier: '',
                    wareHouse: '',
                    wareHouseId: '',
					condition: [],
                    dispatchOrderNo: '',
                    returnBillNo: '',
                    returnTimeStart: '',
                    returnTimeEnd: '',
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
                        title: '退料数量',
                        key: 'ioQuantity',
                        align: 'center',
                        render: (h, params) => {
                            return h('p', {
                                domProps: {
                                    title: params.row.ioQuantity
                                },
                                class: 'iview_tab_numDis',
                            }, params.row.ioQuantity)
                        },
                    },
                    {
                        title: '关联工单号',
                        key: 'dispatchOrderNo',
                        align: 'center',
                        render: (h, params) => {
                            return h('a', {
//                                domProps: {
//                                    title: params.row.billNo
//                                },
//                                class: 'iview_tabDis',
                                on: {
                                    click: () => {
                                        this.goBill(params.row.dispatchOrderId,params.row.dispatchOrderType);
                                    }
                                }
                            }, params.row.dispatchOrderNo)
                        },
                    },
                    {
                        title: '关联退料单号',
                        key: 'returnBillNo',
                        align: 'center',
                        render: (h, params) => {
                            return h('p', {
                                domProps: {
                                    title: params.row.returnBillNo
                                },
                                class: 'iview_tabDis',
                            }, params.row.returnBillNo)
                        },
                    },
                    {
                        title: '退料部门',
                        key: 'department',
                        align: 'center'
                    },
					{
                        title: '退料人',
                        key: 'applier',
                        align: 'center'
                    },
                    {
                        title: '退料时间',
                        key: 'returnTime',
                        align: 'center'
                    },
                    {
                        title: '退料接收仓库',
                        key: 'wareHouse',
                        align: 'center',
                        render: (h, params) => {
                            return h('p', {
                                domProps: {
                                    title: params.row.wareHouse
                                },
                                class: 'iview_tabDis',
                            }, params.row.wareHouse)
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
            }
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
					wt.rejectData.condition = rwt.rows;
                }).catch((err) => {
                    console.log(err);
                });
            },
            //获取退料记录列表
            get_leadRecord(){
                let vt = this;
                this.$axios.post('/eamDo/sparePartReturnList',
                    {
                        page: vt.tempPage,
                        pageSize: 10,
                        sparePartCode: vt.rejectData.sparePartCode,
                        sparePartName: vt.rejectData.sparePartName,
                        applier: vt.rejectData.applier,
                        wareHouseId: vt.rejectData.wareHouseId ? '':vt.rejectData.wareHouseId,
                        dispatchOrderNo: vt.rejectData.dispatchOrderNo,
                        returnBillNo: vt.rejectData.returnBillNo,
                        returnTimeStart: vt.rejectData.returnTimeStart,
                        returnTimeEnd: vt.rejectData.returnTimeEnd,
                    }).then((res) => {
                    let result = res.data.response;
//                    console.log('77777777777 '+ JSON.stringify(result) );
                    if (result.code != 1) {
                        vt.$Message.error(result.msg);
                    }
                    else {
                        this.partsNum = result.data.total;
                        this.tableData1 = result.data.rows
//                        this.tableData1 = result.data.rows;
                       /* for (let i = 0; i < data.length; i++) {
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
						}*/
                    }
                }).catch((err) => {
                    console.log(err);
                });
            },
            partsChange(current){
                this.tempPage = current;
                this.get_leadRecord();
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

            //开始日期应小于结束日期
            checkStart(time){
                let stime = time;
                if (this.rejectData.endTime != '') {
                    if (stime > this.rejectData.endTime) {
                        this.notFitDataTip = '开始时间应在结束时间之前';
                        this.$Message.error(this.notFitDataTip);
                    }
                    else {
                        this.notFitDataTip = ""
                    }
                }
                this.rejectData.startTime = stime
            },
            //结束日期应大于开始日期
            checkEnd(time){
                let etime = time;
                if (this.rejectData.startTime != '') {
                    if (etime < this.rejectData.startTime) {
                        this.notFitDataTip = '结束时间应在开始时间之后';
                        this.$Message.error(this.notFitDataTip);
                    }
                    else {
                        this.notFitDataTip = ""
                    }
                }
                this.rejectData.endTime = etime;
//                if (this.time_start!= '') {
//                    if (this.time_end<= this.time_start) {
//                        this.$Message.error('结束时间应大于开始时间');
//                    }
//                }
            }
		}
	}	
</script>