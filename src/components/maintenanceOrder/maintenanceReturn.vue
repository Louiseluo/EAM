<template>
    <div class="basic bzzy-change">
        <!--模块名称-->
        <div class="title">
            <span v-show="!applyQuitFlag">退料申请单</span>
            <span v-show="applyQuitFlag">确认退料申请单</span>
        </div>
        <div v-if="sparePartTablesData.length>0">
            <div class="tables" v-show="!applyQuitFlag">
                <div class="tableItem" v-for="(SPTableItems,index) in sparePartTablesData" v-bind:key="index">
                    <!--执行记录---start-->
                    <div class="second-title mar-t-15">退料单号：{{SPTableItems.applyFormBillNo}}</div>
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
                                    <th>退料数量</th>
                                    <th>单位</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr v-for="(item,itemIndex) in SPTableItems.applyFormDetil" class="trDisplay">
                                    <td>{{itemIndex + 1}}</td>
                                    <td class="pad-2-10" :title="item.sparePartName">
                                        {{item.sparePartName}}
                                    </td>
                                    <td class="tdDisplay pointDis" :title="item.sparePartCode">
                                        {{item.sparePartCode}}
                                    </td>
                                    <td class="tdDisplay pointDis" :title="item.sparePartType">
                                        {{item.sparePartType}}
                                    </td>
                                    <td class="tdDisplay pointDis" :title="item.warehouseName">
                                        {{item.warehouseName}}
                                    </td>
                                    <td>{{item.warehouseCode}}</td>
                                    <td>{{item.wareHouseLocation}}</td>
                                    <td>{{item.unUsedQuantity}}</td>
                                    <td>{{item.quantity}}</td>
                                    <td class="wid-10 num_right">
                                        <Input v-model='item.sparepartAmount' @on-change="ruleValidate(item.sparepartAmount,index,itemIndex)"></Input>
                                        <!--<Input v-model='item.sparepartAmount'></Input>-->
                                    </td>
                                    <td>{{item.uomName}}</td>
                                </tr>
                                </tbody>
                            </table>
                            <div class="tableHasNoData" v-show="!SPTableItems.applyFormDetil"><p>暂无数据</p></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="tables" v-show="applyQuitFlag">
                <!--执行记录---start-->
                <div class="second-title mar-t-15">工单号：{{billNo}}</div>
                <!--点检-->
                <div class="mar-b-15">
                    <Table class="table-edit" stripe border :columns="columns_sparePart" :data="sparePartDetailData"></Table>
                </div>
                <div class="second-title mar-t-15">可下载退料单据：</div>
                <div class="fileList">
                    <ul>
                        <li v-for="(item,index) in returnFileList" :title="item" :key="index" @click="downLoadFile(item)">
                            {{item}}
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div v-else>
            <h2 align="center" style="color: red;margin-bottom: 15px">无可退料工单</h2>
        </div>

        <div align="center" class="btnGroupDesign">
            <Button type="primary" class="" v-show="!applyQuitFlag" @click="$router.back(-1)">返回</Button>
            <Button type="primary" class="" v-show="applyQuitFlag" @click="backApplyQuit">返回</Button>
            <Button type="primary" class="" @click="applyQuit" v-show="!applyQuitFlag" :disabled="editEnable" v-if="rule_quitApply">退料申请</Button>
            <Button type="primary" class="" v-show="applyQuitFlag" @click="saveQuit" :disabled="makeSureBtn">确定退料</Button>
        </div>
    </div>
</template>

<script>
    //使用jquery渲染
    import $ from 'jquery';
    export default {

        data (){
            return {
                rule_quitApply:this.$rt(this.authJson.EAM.设备维修.退料申请页_保养工单和维修工单.退料申请),
                /*备件表格数据*/
                /*备件信息*/
                orderId:'',
                billNo:'',
                listTitle:'',
                listStatus:'',
                orderFlag:'',
                editEnable:true,
                sparePartTablesData:[],
                columns_sparePart: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 80,
                        align: 'center'
                    },
                    {
                        title: '备件名称',
                        key: 'sparePartName',
                        align: 'center',
                    },
                    {
                        title: '备件编码',
                        key: 'sparePartCode',
                        align: 'center'
                    },
                    {
                        title: '备件类型',
                        key: 'sparePartType',
                        align: 'center',
                    },
                    {
                        title: '仓库名称',
                        key: 'warehouseName',
                        align: 'center'
                    },
                    {
                        title: '仓库编码',
                        key: 'warehouseCode',
                        align: 'center'
                    },
                    {
                        title: '仓库地点',
                        key: 'wareHouseLocation',
                        align: 'center'
                    },
                    {
                        title: '领用数量',
                        key: 'quantity',
                        align: 'center'
                    },
                    {
                        title: '退料总数',
                        key: 'sparepartAmount',
                        align: 'center'
                    },
                    {
                        title: '单位',
                        key: 'uomName',
                        align: 'center'
                     },
                ],
                sparePartDetailData: [],
                applyQuitFlag:false,

                returnFileList:[],
                makeSureBtn:false

            }
        },
        components: {},
        mounted(){
            this.listTitle = this.$route.query.title;
            this.listStatus = this.$route.query.type;
            this.orderFlag = this.$route.query.orderFlag;
        },
        created(){
            let vm = this;
            vm.orderId = vm.$route.query.orderId;
            vm.billNo = vm.$route.query.billNo;
//            vm.orderId = 'JTIOHVGR2W910O0HB2TB';
            this.$axios.post('/eamDo/getSparePartByDoId', {
                dispatchOrderId : vm.orderId
            }).then((res) => {
                let respone = res.data.response;
                if (respone.code  === 1) {
                    vm.sparePartTablesData = [...respone.data.applyForm];
//                    console.log("vm.sparePartTablesData +" + JSON.stringify(vm.sparePartTablesData))
//                    this.$Message.success('导出成功！');
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
        methods: {
            downLoadFile(url){
//                console.log(url)
                window.location.href = "http://" + location.host + "/static/doc/" + url;
            },
            /*退料申请 -S-*/
            applyQuit(){
                this.applyQuitFlag = true;
                let detailAry = [];
                let copyTotalAry = JSON.parse(JSON.stringify(this.sparePartTablesData));
                this.sparePartDetailData = [];
                copyTotalAry.forEach((items)=>{
                   for(let i=0;i<items.applyFormDetil.length;i++){
                       let quitNum = items.applyFormDetil[i].sparepartAmount;
                        if(quitNum !==''&& quitNum > 0 && quitNum !== undefined){
                            detailAry.push(items.applyFormDetil[i]);
                        }
                    }
                });
                this.sparePartDetailData = this.UniquePay(detailAry)
            },
            /*去重*/
            UniquePay(paylist){
                let payArr = [paylist[0]];
                for(let i = 1; i < paylist.length; i++){
                    let payItem = paylist[i];
                    let repeat = false;
                    for (let j = 0; j < payArr.length; j++) {
                        if (payItem.sparePartId === payArr[j].sparePartId) {
                            payArr[j].sparepartAmount = parseFloat(payArr[j].sparepartAmount)+parseFloat(payItem.sparepartAmount);
                            payArr[j].quantity = parseFloat(payArr[j].quantity)+parseFloat(payItem.quantity);
                            repeat = true;
                            break;
                        }
                    }
                    if (!repeat) {
                        payArr.push(payItem);
                    }
                }
                return payArr;
            },
            /*退料申请 -E-*/
            /*保存申请 -S-*/
            saveQuit(){
                let copyTotalAry = JSON.parse(JSON.stringify(this.sparePartTablesData));
                let saveAry = {};
                saveAry.dispatchOrderId = this.orderId;
                saveAry.sparepartReturnDetailVos = [];
                copyTotalAry.forEach((items,index,arrayBack)=>{
                    saveAry.sparepartReturnDetailVos.push({
                        applicationFormId : items.applyFormId,
                        sparepartVos:[]
                    })
                    let i = items.applyFormDetil.length;
                    while (i--){
                        let quitNum = items.applyFormDetil[i].sparepartAmount;
                        if(quitNum !==''&& quitNum > 0 && quitNum !== undefined){
                            saveAry.sparepartReturnDetailVos[index].sparepartVos.push({
                                sparepartAmount : items.applyFormDetil[i].sparepartAmount,
                                sparepartId:items.applyFormDetil[i].sparePartId,
                                warehouseId:items.applyFormDetil[i].warehouseId
                            })
                        }
                    }
                });
                let j = saveAry.sparepartReturnDetailVos.length;
                while (j--){
                    if(saveAry.sparepartReturnDetailVos[j].sparepartVos.length===0){
                        saveAry.sparepartReturnDetailVos.splice(j,1)
                    }
                }
//                console.log("saveAry + " + JSON.stringify(saveAry));
                this.$axios.post('/eamDo/sparepartReturnSave',saveAry).then((res) => {
                    let respone = res.data.response;
//                    console.log("sparepartReturnSave + " + JSON.stringify(res));
                    if (respone.code  === 1) {
//                        this.$router.push({path: '/maintenanceOrder',query: {'title':this.listTitle,type:this.listStatus,orderFlag:this.orderFlag}});

                        let outPutStr = res.data.response.data;
                        let outPutId = outPutStr.substring(outPutStr.indexOf(":")+1,outPutStr.length).trim();
//                        console.log("outPutId +" + outPutId)
                        this.$Modal.confirm({
                            title: '生成退料备件列表',
                            content: '<p>是否需要生成退料备件列表？</p>',
                            onOk: () => {
                                this.$axios.get('/tEamExport/exportReturnMaterial',{
                                    params: {
                                        formIds: outPutId
                                    }
                                }).then((res) => {
                                    let respone = res.data.response;
                                    if (respone.code  === 1) {
//                                        console.log(" respone + " + JSON.stringify(respone));
                                        this.makeSureBtn = true;
                                        this.returnFileList = [...respone.data];
                                        this.$Message.success('生成成功！');
//                                        this.$router.push({path: '/maintenanceOrder',query: {'title':this.listTitle,type:this.listStatus,orderFlag:this.orderFlag}});
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
                        this.$Message.success('退料成功！');
                    } else {
                        //.. 业务失败的情况
                        this.$Message.error({
                            content: respone.msg,
                            duration: 5,
                            closable: true
                        });
                    }
                }).catch((err) => {
                    console.log("无数据 + " + err);
                });

            },
            /*保存申请 -E-*/
            backApplyQuit(){
                this.applyQuitFlag = false;
                this.makeSureBtn = false;
            },
            ruleValidate(num,index,itemIndex){
                var re = /^[1-9]*[1-9][0-9]*$/;
                if (!re.test(num)) {
                    this.$Message.error('退料数量为正整数!');
                    this.sparePartTablesData[index].applyFormDetil[itemIndex].sparepartAmount = "";
                    this.editEnable = true;
                }else if(num>this.sparePartTablesData[index].applyFormDetil[itemIndex].quantity) {
                    this.$Message.error('退料数量不大于申请数量！');
                    this.sparePartTablesData[index].applyFormDetil[itemIndex].sparepartAmount = "";
                    this.editEnable = true;
                }else {
                    this.editEnable = false;
                }
            }
        }
    }
</script>

<style>
    .fileList ul li{
        display: inline;
        list-style: none;
        margin-bottom: 15px;
        margin-left: 30px;
        color: #0391da;
        cursor: pointer;
    }

</style>
