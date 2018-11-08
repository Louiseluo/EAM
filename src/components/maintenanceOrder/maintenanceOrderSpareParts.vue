<template>
    <div class="basic fault-content">
        <!--模块名称-->
        <div class="title">
            <span>{{pageTitle}}工单执行流程--{{actionTitle}}</span>
        </div>
        <div class="secondSteps" v-show="this.addflag != 0">
            <ul class="secondStepsUl">
                <li  v-for="(item,index) in secondStepsData" :class="item.liClass">{{item.content}}</li>
            </ul>
        </div>
        <!--执行记录---start-->
        <div class="second-title mar-t-15">备件领用记录</div>
        <!--点检-->
        <div style="overflow: hidden;">
            <div class="mar-b-15">
                <table class="table table-bordered table-center table-striped table-blue table-edit table-standWork taDisplay">
                    <thead>
                    <tr>
                        <th>序号</th>
                        <th>备件名称</th>
                        <th>备件编码</th>
                        <th>备件类型</th>
                        <th>仓库名称</th>
                        <th>仓库编码</th>
                        <th>仓库地点</th>
                        <th>库存数量</th>
                        <th>领用数量</th>
                        <th>单位</th>
                        <th>操作</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(item,index) in sparePartDetailData" class="trDisplay">
                        <td>{{index + 1}}</td>
                        <td class="pad-2-10" style="position: relative;">
                            <span class="pro" style="top: 18px;">*</span>
                            <div class="input-search pointDis" style="padding-left:10px;"  @click="openSparePartListLoad(index)" v-show="!item.alreadyApply">
                                <Input readonly v-model="item.sparePartName"></Input>
                                <Button icon="ios-search"></Button>
                            </div>
                            <div class="input-search pointDis" style="padding-left:10px;" v-show="item.alreadyApply">
                                <Input readonly v-model="item.sparePartName" :disabled="item.alreadyApply"></Input>
                                <Button icon="ios-search"></Button>
                            </div>
                        </td>
                        <td class="tdDisplay pointDis" :title="item.sparePartCode">
                            {{item.sparePartCode}}
                        </td>
                        <td class="tdDisplay pointDis" :title="item.sparePartType">
                            {{item.sparePartType}}
                        </td>
                        <!--<td class="tdDisplay pointDis" :title="item.wareHouseName">
                            {{item.wareHouseName}}
                        </td>-->
                        <td class="pad-2-10" style="position: relative;">
                            <span class="pro" style="top: 18px;">*</span>
                            <div class="input-search pointDis" style="padding-left:10px;"  @click="openWareHouseListLoad(index)" v-show="!item.alreadyApply">
                                <Input readonly v-model="item.wareHouseName"></Input>
                                <Button icon="ios-search"></Button>
                            </div>
                            <div class="input-search pointDis" style="padding-left:10px;" v-show="item.alreadyApply">
                                <Input readonly v-model="item.wareHouseName" :disabled="item.alreadyApply"></Input>
                                <Button icon="ios-search"></Button>
                            </div>
                        </td>
                        <td>{{item.wareHouseCode}}</td>
                        <td>{{item.wareHouseLocation}}</td>
                        <td>{{item.unUsedQuantity}}</td>
                        <td class="wid-10 num_right">
                            <Input v-model='item.sparepartAmount' @on-change="ruleValidate(item.sparepartAmount,index)"></Input>
                        </td>
                        <td>{{item.uomName}}</td>
                        <td><a @click="delSPItem(index)">删除</a></td>
                    </tr>
                    </tbody>
                </table>
                <div class="tableHasNoData" v-show="sparePartDetailData.length == 0"><p>暂无数据</p></div>
            </div>
            <Button type="primary" size="small" @click="addsparePartItem">添加</Button>
            <!--<Button type="primary" size="small">批查库存余额</Button>-->
        </div>

        <!--操作按钮-->
        <div align="center" class="btnGroupDesign">
            <Button type="primary" :disabled="editEnable" size="large" @click="applySP">申领备件</Button>
            <Button type="primary"  size="large" v-show="addflag != 0" @click="pauseFuc">缺件暂停</Button>
            <!--<Button type="primary"  size="large">导出</Button>-->
            <Button type="primary" size="large" @click="backFun">返回</Button>
        </div>


        <!--备品备件列表-->
        <Modal v-model="spListMod" title="备品备件选择" @on-ok="SPItemSelected" width="800">
        <!--<Modal v-model="spListMod" title="备品备件选择" width="800" >-->
            <div class="form-content">
                <Form>
                    <Form-item label="备件名称" prop="spListName">
                        <Input v-model="spListName"  style="width: 160px"></Input>
                    </Form-item>
                </Form>
                <!--查询按钮-->
                <div style="text-align: right;padding-right: 20px">
                    <Button type="primary" icon="search" size="large" @click="searchSPList">查询</Button>
                </div>
            </div>
            <div class="table-reset">
                <Table highlight-row border ref="currentRowTable" class="taDisplay" :columns="SPListColumns" :data="SPListData" @on-row-click="toSelectSP"></Table>
            </div>
            <div class="mar-t-10" style="overflow: hidden">
                <div style="float: right;">
                    <Page size="small" :total="spListTotal" show-elevator :current="spListPage"  :page-size="spListPageSize" @on-change="SPListPageChange"></Page>
                </div>
            </div>
        </Modal>

        <!--仓库列表-->
        <Modal v-model="whListMod" title="仓库选择" @on-ok="WHItemSelected" width="800">
            <!--<Modal v-model="spListMod" title="备品备件选择" width="800" >-->
            <div class="form-content">
                <Form>
                    <Form-item label="仓库名称" prop="spListName">
                        <Input v-model="whListName"  style="width: 160px"></Input>
                    </Form-item>
                </Form>
                <!--查询按钮-->
                <div style="text-align: right;padding-right: 20px">
                    <Button type="primary" icon="search" size="large" @click="WHItemDetailLoad">查询</Button>
                </div>
            </div>
            <div class="table-reset">
                <Table highlight-row border ref="currentRowTable" class="taDisplay" :columns="whListColumns" :data="whListData" @on-row-click="toSelectWH"></Table>
            </div>
        </Modal>


    </div>
</template>

<script>
    export default {
        data (){
            return {
                /****** 页面初加载。。。 **8*/
                orderId:'',
                spareId:'',
                workItemId:'',
                editEnable:false,
                orderFlag:0,

                /****** 页面初加载。。。 **8*/

                /*备件表格数据*/
                sparePartDetailData: [],
                new_sparePartDetailItem: {
                    "sparePartId": "",
                    "sparePartName": "",
                    "sparePartCode": "",
                    "sparePartType": "",
                    "uomId": "",
                    "uomName": "",
                    "uomCode": "",
                    "wareHouseName": "",
                    "wareHouseCode": "",
                    "wareHouseLocation": "",
                    "unUsedQuantity": "",
                    sparepartAmount:'',
                },

                /*备件添加列表 - S -*/
                editItemIndex:0,
                spListName:'',
                spListPage:1,
                spListPageSize:5,
                spListTotal:0,
                spListMod:false,
                SPListColumns:[
                    {
                        title: '序号',
                        width: 80,
                        align: 'center',
                        type: 'index'
                    },
                    {
                        title: '备件名称',
                        key: 'spName',
                        align: 'center'
                    },
                    {
                        title: '单位',
                        key: 'uomName',
                        align: 'center',
                    },
                    {
                        title: '备件类型',
                        key: 'spType',
                        align: 'center'
                    },
                ],
                SPListData:[],
                selectSPItem:{},

                /*备件添加列表 - E -*/
                /*仓库添加列表 - S -*/
//                editItemIndex:0,
                whListName:'',
                whListMod:false,
                /*
                * <th>仓库名称</th>
                 <th>仓库编码</th>
                 <th>仓库地点</th>
                 <th>库存数量</th>*/
                whListColumns:[
                    {
                        title: '序号',
                        width: 80,
                        align: 'center',
                        type: 'index'
                    },
                    {
                        title: '仓库名称',
                        key: 'warehouseName',
                        align: 'center'
                    },
                    {
                        title: '仓库编码',
                        key: 'warehouseCode',
                        align: 'center',
                    },
                    {
                        title: '仓库地点',
                        key: 'locationName',
                        align: 'center'
                    },
                ],
                whListData:[],
                selectWHItem:{},

                /*仓库添加列表 - E -*/


                actionTitle:'',
                pageTitle:'',
                secondStepsData:[
                    {
                        code:0,
                        content:"确认接单",
                        liClass:'secondStepsLi'
                    },
                    {
                        code:2,
                        content:"备件领用",
                        liClass:'secondStepsLi active'
                    },
                    {
                        code:3,
                        content:"补充派工",
                        liClass:'secondStepsLi'
                    },
                    {
                        code:4,
                        content:"下发终端",
                        liClass:'secondStepsLi'
                    },
                ],
                /*备件信息*/
                columns_man: [
                    {
                        type: 'selection',
                        width: 80,
                        align: 'center'
                    },
                    {
                        title: '序号',
                        type: 'index',
                        width: 80,
                        align: 'center'
                    },
                    {
                        title: '备件编码',
                        key: 'handleMan',
                        align: 'center'
                    },
                    {
                        title: '备件名称',
                        key: 'planTime',
                        align: 'center',
                    },
                    {
                        title: '备件类型',
                        key: 'sparePartType',
                        align: 'center',
                    },
                    {
                        title: '仓库名称',
                        key: 'checkResult',
                        align: 'center'
                    },
                    {
                        title: '仓库编码',
                        key: 'content',
                        align: 'center'
                    },
                    {
                        title: '仓库地点',
                        key: 'contentLoca',
                        align: 'center'
                    },
                    {
                        title: '库存数量（单位）',
                        key: 'contentNum',
                        align: 'center'
                    },
                    {
                        title: '领用数量（单位）',
                        key: 'aa',
                        align: 'center'
                    },
                    /*{
                        title: '单位',
                        key: 'bb',
                        align: 'center'
                    },
                    {
                        title: '经办人',
                        key: 'cc',
                        align: 'center'
                    },
                    {
                        title: '领用人',
                        key: 'dd',
                        align: 'center'
                    },*/
                ],

                totalPages: 1,
                currentPage: 1,
                //  保养项目
                /*再次申领备件*/
                addflag:1,
                listTitle:'',
                listStatus:-1,
            }
        },
        mounted(){
            this.addflag = this.$route.query.addflag;
            this.orderId = this.$route.query.orderId;
            this.workItemId = this.$route.query.workItemId;

            this.listTitle = this.$route.query.title;
            this.listStatus = this.$route.query.type;
            this.sparePartListLoad();
            this.sparePartSelectedListLoad()
//            console.log("this.orderId + " + this.orderId)
//            'title':'保养',actionTitle:'接单',firstStep:'确认接单';
            this.orderFlag = this.$route.query.orderFlag;
            let addItem = {
                code:1,
                content:"故障确认",
                liClass:'secondStepsLi'
            }
            if(this.orderFlag == 2){
                this.pageTitle = "维修";
                this.actionTitle = "确认"
                this.secondStepsData.splice(1,0,addItem);
//                console.log("this.secondStepsData + " + JSON.stringify(this.secondStepsData))
            }else if(this.orderFlag == 0){
                this.pageTitle = "保养";
                this.actionTitle = "接单"
            }
        },

        methods: {
            backFun(){
                this.$router.back()
            },
            sparePartSelectedListLoad(){
                let vt=this;
                this.$axios.post('/eamDo/getSparePartByDispatchOrder', {
                    dispatchOrderId: this.orderId,
                    page:this.spListPage,
                    pageSize: 100000,
                }).then((res) => {
                    if (res.data.response.code === 1) {
                        let dataRes = res.data.response.data;
                        if(vt.addflag == 0){
                            vt.sparePartDetailData = [];
                        }else {
                            for(let i = 0; i<dataRes.rows.length; i ++){
                                vt.sparePartDetailData.push({
                                    sparePartName : dataRes.rows[i].sparePartName,
                                    sparePartId : dataRes.rows[i].sparePartId,
                                    sparePartCode : dataRes.rows[i].sparePartCode,
                                    sparePartType : dataRes.rows[i].sparePartType,
                                    uomName : dataRes.rows[i].uomName,
                                    wareHouseName : dataRes.rows[i].warehouseName,
                                    wareHouseCode : dataRes.rows[i].warehouseCode,
                                    wareHouseLocation : dataRes.rows[i].wareHouseLocation,
                                    unUsedQuantity : dataRes.rows[i].unUsedQuantity,
                                    sparepartAmount : dataRes.rows[i].quantity,
                                    alreadyApply:true,
                                })
                            }
                        }

                    }else {

                    }
                }).catch((err) => {
                    console.log(err);
                });
            },
            sparePartListLoad(){
                let vt=this;
                this.$axios.get('/eamDo/getSpLikeName', {
                    params:{
                        spName:this.spListName,
                        page:this.spListPage,
                        pageSize:this.spListPageSize,
                    },
                }).then((res) => {
                    if (res.data.response.code === 1) {
                        let dataRes = res.data.response.data;
                        this.SPListData = dataRes.rows;
                        this.spListTotal = dataRes.total;
//                        console.log("dataRes + " + JSON.stringify(dataRes))
                    }else {

                    }
                }).catch((err) => {
                    console.log(err);
                });
            },
            openSparePartListLoad(index){
                this.spListMod = true;
                this.editItemIndex = index;
            },

            addsparePartItem(){
                this.sparePartDetailData.push(this.$fc.cloneKey(this.new_sparePartDetailItem))
            },

            searchSPList(){
                this.spListPage = 1;
                this.sparePartListLoad()
            },
            toSelectSP(item){
                this.selectSPItem = item;
            },
            SPListPageChange(page){
                this.spListPage = page;
                this.sparePartListLoad()
            },
            SPItemSelected(){
                this.spareId = this.selectSPItem.spId;
                this.SPItemDetailLoad();
            },
            SPItemDetailLoad(){
                let vt=this;
                this.$axios.post('/eamDo/sparePartInfo', {
                    id: this.spareId,
                }).then((res) => {
                    if (res.data.response.code === 1) {
                        let dataRes = res.data.response.data;
//                        console.log("选中后带出信息 +" + JSON.stringify(dataRes));
                        let rowData = vt.sparePartDetailData[vt.editItemIndex];
                        rowData.sparePartName = dataRes.sparePartName;
                        rowData.sparePartId = dataRes.sparePartId;
                        rowData.sparePartCode = dataRes.sparePartCode;
                        rowData.sparePartType = dataRes.sparePartType;
                        rowData.uomId = dataRes.uomId;
                        rowData.uomName = dataRes.uomName;
                        rowData.uomCode = dataRes.uomCode;
                    }else {

                    }
                }).catch((err) => {
                    console.log(err);
                });
            },
            delSPItem(index){
                this.sparePartDetailData.splice(index,1);
            },
            /*仓库放大镜 - S -*/
            openWareHouseListLoad(index){
                this.editItemIndex = index;
                if(this.sparePartDetailData[this.editItemIndex].sparePartId =='' ){
                    this.$Message.error("请先选择所需备件！")
                }else {
                    this.whListMod = true;
                    this.WHItemDetailLoad();
                }
            },
            WHItemDetailLoad(){
                let vt=this;
                this.$axios.post('/eamDo/getWarehouseInfo', {
                    warehouseName:vt.whListName,
                    spId: vt.sparePartDetailData[vt.editItemIndex].sparePartId,
                }).then((res) => {
                    if (res.data.response.code === 1) {
                        let dataRes = res.data.response.data;
                        vt.whListData = [...dataRes.warehouseInfo];
                    }else {
                        this.$Message.error("数据错误！")
                    }
                }).catch((err) => {
                    console.log(err);
                });
            },
            toSelectWH(item){
                this.selectWHItem = item;
            },
            WHItemSelected(){
                let rowData = this.sparePartDetailData[this.editItemIndex];
                rowData.wareHouseName = this.selectWHItem.warehouseName;
                rowData.warehouseId = this.selectWHItem.warehouseId;
                rowData.wareHouseCode = this.selectWHItem.warehouseCode;
                rowData.wareHouseLocation = this.selectWHItem.locationName;
                rowData.unUsedQuantity = this.selectWHItem.unUsedQuantity;
                rowData.sparepartAmount = 0;
            },
            /*仓库放大镜 - E -*/



            ruleValidate(num,index){
                var re = /^[1-9]*[1-9][0-9]*$/;
                if (!re.test(num)) {
                    this.$Message.error('申领数量为正整数!');
                    this.sparePartDetailData[index].sparepartAmount = "";
                    this.editEnable = true;
                }else if(num>this.sparePartDetailData[index].unUsedQuantity) {
                    this.$Message.error('申领数量不大于库存数量，如需要请挂起！');
                    this.sparePartDetailData[index].sparepartAmount = "";
                    this.editEnable = true;
                }else {
                    this.editEnable = false;
                }
            },
            /*挂起按钮*/
//        <Button type="primary"  size="large" @click="/eamDo/pause">挂起</Button>
            pauseFuc(){
                let vt=this;
                this.$axios.post('/eamDo/pause', {
                    orderId : this.orderId,
                }).then((res) => {
                    if (res.data.response.code === 1) {
//                        console.log("/挂起 ++ " + JSON.stringify(res));
                        this.$Message.success("操作"+ res.data.response.name);
                        this.$router.push({path: '/maintenanceOrder',query: {type:this.listStatus,orderFlag:this.orderFlag}});
                    }else {
                        this.$Message.error("操作"+ res.data.response.name)
                    }
                }).catch((err) => {
                    console.log(err);
                });
            },

            /*补领备件按钮*/
            applySP(){
                let vt=this;
                let sparepartVos = [];
                let sparepartAmountZero;
                let sparepartNameZero;
                let wareHouseNameZero;
                if(vt.sparePartDetailData.length > 0 ){
                    for(let i = 0 ; i < vt.sparePartDetailData.length ; i++){
                        if(vt.sparePartDetailData[i].sparePartId === "" || vt.sparePartDetailData[i].sparePartId === undefined){
                            wareHouseNameZero = false;
                            sparepartNameZero = false;
                            sparepartAmountZero = false;
                        }else if(vt.sparePartDetailData[i].wareHouseName === "" || vt.sparePartDetailData[i].wareHouseName === undefined){
                            wareHouseNameZero = false;
                            sparepartNameZero = true;
                            sparepartAmountZero = false;
                        }else if(vt.sparePartDetailData[i].sparepartAmount === "" || vt.sparePartDetailData[i].sparepartAmount === undefined|| vt.sparePartDetailData[i].sparepartAmount === 0){
                            sparepartNameZero = true;
                            wareHouseNameZero = true;
                            sparepartAmountZero = false;
                        }else {
                            sparepartNameZero = true;
                            wareHouseNameZero = true;
                            sparepartAmountZero = true;
                            sparepartVos.push({
                                "sparepartAmount": vt.sparePartDetailData[i].sparepartAmount,
                                "sparepartId":  vt.sparePartDetailData[i].sparePartId,
                                "warehouseId":vt.sparePartDetailData[i].warehouseId
                            })
                        }
                    }
                }else {
//                    console.log("无值存入")
                    sparepartNameZero = true;
                    sparepartAmountZero = true;
                    wareHouseNameZero = true;
                }

                let saveAry = {
                    "dispatchOrderId": vt.orderId,
                    "moreApply": vt.addflag,
                    "sparepartVos": sparepartVos
                };
                /*console.log("saveAry +" + JSON.stringify(saveAry))
                console.log("vt.sparePartDetailData +" + JSON.stringify(vt.sparePartDetailData))*/
                if(sparepartNameZero){
                    if(wareHouseNameZero){
                        if(sparepartAmountZero){
                            this.$axios.post('/eamDo/sparepartApplicationSave',saveAry ).then((res) => {
                                if (res.data.response.code === 1) {
                                    let outPutStr = res.data.response.data;
                                    let outPutId = outPutStr.substring(outPutStr.indexOf(":")+1,outPutStr.length).trim();
                                    if(vt.addflag == 0){
                                        if(sparepartVos.length>0){
                                            this.$Modal.confirm({
                                                title: '导出备件列表',
                                                content: '<p>是否需要导出该备件列表？</p>',
                                                onOk: () => {
                                                    this.$axios.get('/tEamExport/exportSpareParts',{
                                                        params: {
                                                            formId: outPutId
                                                        }
                                                    }).then((res) => {
                                                        let respone = res.data.response;
                                                        if (respone.code  === 1) {
                                                            window.location.href = "../static/doc/" + respone.data.fileName;
                                                            this.$Message.success('导出成功！');
                                                            this.$router.push({path: '/maintenanceOrder',query: {type:this.listStatus,orderFlag:this.orderFlag}});
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
                                                onCancel: () => {
                                                    this.$Message.success("操作"+ res.data.response.name);
                                                    this.$router.push({path: '/maintenanceOrder',query: {type:this.listStatus,orderFlag:this.orderFlag}});
                                                }
                                            });
                                        }else {
                                            this.$Message.success("操作"+ res.data.response.name);
                                            this.$router.push({path: '/maintenanceOrder',query: {type:this.listStatus,orderFlag:this.orderFlag}});
                                        }
                                    }else {
                                        if(sparepartVos.length>0){
                                            this.$Modal.confirm({
                                                title: '导出备件列表',
                                                content: '<p>是否需要导出该备件列表？</p>',
                                                onOk: () => {
                                                    this.$axios.get('/tEamExport/exportSpareParts',{
                                                        params: {
                                                            formId: outPutId
                                                        }
                                                    }).then((res) => {
                                                        let respone = res.data.response;
                                                        if (respone.code  === 1) {
                                                            window.location.href = "../static/doc/" + respone.data.fileName;
                                                            this.$Message.success('导出成功！');
                                                            this.$router.push({ path: 'orderReplenish', query: {orderId:this.orderId,workItemId:vt.workItemId,orderFlag:vt.orderFlag,'title':this.listTitle,type:this.listStatus,}});
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
                                                onCancel: () => {
                                                    this.$Message.success("操作"+ res.data.response.name);
                                                    this.$router.push({ path: 'orderReplenish', query: {orderId:this.orderId,workItemId:vt.workItemId,orderFlag:vt.orderFlag,'title':this.listTitle,type:this.listStatus,}});
                                                }
                                            });
                                        }else {
                                            this.$Message.success("操作"+ res.data.response.name);
                                            this.$router.push({ path: 'orderReplenish', query: {orderId:this.orderId,workItemId:vt.workItemId,orderFlag:vt.orderFlag,'title':this.listTitle,type:this.listStatus,}});
                                        }
                                    }
                                }else {
//                                    console.log("res +" + JSON.stringify(res))
                                    this.$Message.error(res.data.response.msg)
                                }
                            }).catch((err) => {
                                console.log(err);
                            });
                        }else {
                            this.$Message.error("请填写所需备件数量！")
                        }
                    }else {
                        this.$Message.error("请选择备件所在仓库！")
                    }
                }else {
                    this.$Message.error("请选择所需备件！")
                }

            },
        },
    }
</script>
<style>
    .demo-spin-icon-load{
        animation: ani-demo-spin 1s linear infinite;
    }
    @keyframes ani-demo-spin {
        from { transform: rotate(0deg);}
        50%  { transform: rotate(180deg);}
        to   { transform: rotate(360deg);}
    }
    .demo-spin-col{
        height: 100px;
        position: relative;
        border: 1px solid #eee;
    }
    table input{
        border: 1px #d7dde4 solid;
        width: 100%;
        padding: 0 5px;
        height: 16px;
        color: #657180;
        line-height: 10px;
        border-radius: 3px;
    }
</style>
