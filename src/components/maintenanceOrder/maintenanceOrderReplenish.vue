<template>
    <div class="basic fault-content">
        <!--模块名称-->
        <div class="title">
            <span>{{pageTitle}}工单执行流程--{{actionTitle}}</span>
        </div>
        <div class="secondSteps">
            <ul class="secondStepsUl">
                <li  v-for="(item,index) in secondStepsData" :class="item.liClass">{{item.content}}</li>
            </ul>
        </div>
        <div class="second-title">工单派工</div>
        <div>
            <table class="table table-bordered table-center table-striped table-blue table-edit table-standWork taDisplay">
                <thead>
                <tr>
                    <th width="70px">序号</th>
                    <th  width="100px">姓名</th>
                    <th>编码</th>
                    <th>卡号</th>
                    <th>岗位</th>
                    <th>班组</th>
                    <th>绩效占比（%）</th>
                    <!--<th>计划维修时长(分钟)</th>-->
                    <th>当前保养工单数</th>
                    <th>当前维修工单数</th>
                    <th>操作</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item,index) in dispatchData" class="trDisplay">
                    <td>{{index + 1}}</td>
                    <td :title="item.personName">
                        {{item.personName}}
                    </td>
                    <td class="tdDisplay pointDis" :title="item.personCode">
                        {{item.personCode}}
                    </td>
                    <td class="tdDisplay pointDis" :title="item.personCardNo">
                        {{item.personCardNo}}
                    </td>
                    <td class="tdDisplay pointDis" :title="item.positionName">
                        {{item.positionName}}
                    </td>
                    <td>{{item.teamName}}</td>
                    <td class="wid-10 num_right">
                        <Input v-model=item.kpiRatio @on-change="toTestIsNANMain(item.kpiRatio,index)" :disabled="editEnable"></Input>
                    </td>
                   <!-- <td class="wid-10 num_right">
                        <Input v-model=item.time @on-change="toTestIsNAN(item.time,index)" :disabled="editEnable"></Input>
                    </td>-->
                    <td class="wid-10 num_right">
                        {{item.orderCount}}
                    </td>
                    <td class="wid-10 num_right">
                        {{item.repairOrderCount}}
                    </td>
                    <td>
                        <a @click="delDispatchItem(index)">删除</a>
                    </td>
                </tr>
                </tbody>
            </table>
            <div class="tableHasNoData" v-show="!dispatchData"><p>暂无数据</p></div>
            <Button @click="dispatchMod = true" size="small" class="mar-t-10" >添加协同执行人</Button>
        </div>


        <!--操作按钮-->
        <div align="center" class="btnGroupDesign">
            <Button type="primary" :disabled="editEnable" size="large" @click="dispatchAgain" :loading="loading">补充派工</Button>
            <Button type="primary" size="large" @click="backFun">返回</Button>
        </div>
        <Modal v-model="dispatchMod" title="人员选择" @on-ok="dispatchManSelected" width="1000">
            <!--员工单选-->
            <!--<div class="form-content">
                <Form>
                    <Form-item label="人员名称" prop="name">
                        <Input v-model="dispatch_name" style="width: 160px"></Input>
                    </Form-item>
                </Form>
                &lt;!&ndash;查询按钮&ndash;&gt;
                <div style="text-align: right;padding-right: 20px">
                    <Button type="primary" icon="search" size="large" @click="dispatchManList">查询</Button>
                </div>
            </div>
            <div class="table-reset">
                <Table highlight-row border ref="currentRowTable" class="taDisplay" :columns="dispatchManColumns" :data="dispatchManData" @on-row-click="toSelectMan"></Table>
            </div>
            <div class="mar-t-10" style="overflow: hidden">
                <div style="float: right;">
                    <Page size="small" :total="dispatchManTotal" show-elevator :page-size="dispatchManPageSize" @on-change="dispatchManChange"></Page>
                </div>
            </div>-->
            <!--员工多选-->
            <dispatch :mod_rightDisplay="dispatchProData" @sparePartsSetected="dispatchSelected" :orderId="orderId"></dispatch>
        </Modal>
    </div>
</template>

<script>
    import dispatch_table from '../treeMulitiple/dispatch_table.vue';
    export default {
        components: {
            'dispatch': dispatch_table,
        },
        data (){
            return {
                /*重复提交*/
                loading:false,
                /*重复提交*/
                /****** 页面初加载。。。 **8*/
                orderId:'',
                workItemId:'',
                editEnable:false,
                orderFlag:0,
                /****** 页面初加载。。。 **8*/

                /*备件表格数据*/
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
                        liClass:'secondStepsLi'
                    },
                    {
                        code:3,
                        content:"补充派工",
                        liClass:'secondStepsLi active'
                    },
                    {
                        code:4,
                        content:"下发终端",
                        liClass:'secondStepsLi'
                    },
                ],
                listTitle:'',
                listStatus:-1,

                /**** 派工表格 ****/
                dispatchMod: false,
                dispatchData: [],

                dispatchManTotal: 0,
                dispatchManColumns: [
                    {
                        title: '序号',
                        width: 80,
                        align: 'center',
                        type: 'index'
                    },
                    {
                        title: '姓名',
                        key: 'personName',
                        align: 'center'
                    },
                    {
                        title: '编码',
                        key: 'personCode',
                        align: 'center',
                    },
                    {
                        title: '卡号',
                        key: 'personCardNo',
                        align: 'center'
                    },
                    {
                        title: '岗位',
                        key: 'positionName',
                        align: 'center'
                    },
                    {
                        title: '班组',
                        key: 'teamName',
                        align: 'center'
                    },
                ],
                dispatchManData: [],
                dispatch_name: '',
                dispatchManPageSize: 10,
                dispatchPage: 1,
                selectRowMan: {},
                /*多人员 --S--*/
                dispatchProData: [],
                selectRowsMan: [],
                /*多人员 --E--*/


                /**** 派工表格 ****/
            }
        },
        mounted(){
            this.orderId = this.$route.query.orderId;
            this.workItemId = this.$route.query.workItemId;
            this.listTitle = this.$route.query.title;
            this.listStatus = this.$route.query.type;
//            'title':'保养',actionTitle:'接单',firstStep:'确认接单';
            this.orderFlag = this.$route.query.orderFlag;
            this.dispatchedList();
            let addItem = {
                code:1,
                content:"故障确认",
                liClass:'secondStepsLi'
            }
            if(this.orderFlag == 2){
                this.pageTitle = "维修";
                this.actionTitle = "确认";
                this.secondStepsData.splice(1,0,addItem);
            }else if(this.orderFlag == 0){
                this.pageTitle = "保养";
                this.actionTitle = "接单"
            }
        },
        created: function () {
            this.orderId = this.$route.query.orderId;
        },
        methods: {
            //验证是否是正整数
            toTestIsNANMain(x, item){
                var re = /^[0-9]*[1-9][0-9]*$/;
                if (!re.test(x)) {
                    this.$Message.error('绩效为正整数!');
                    this.dispatchData[item].kpiRatio = ""
                } else if (x > 100) {
                    this.$Message.error('绩效不大于100%!');
                    this.dispatchData[item].kpiRatio = ""
                }
            },
            /*工单派工列表初加载*/
            dispatchedList(){
                this.$axios.post('/eamDo/assignmentList', {
                    page:1,
                    pageSize:10,
                    dispatchOrderId : this.orderId
                }).then((res) => {
                    let ret = res.data.response;
//                    console.log('工单派工列表 == ' + JSON.stringify(ret));
                    if (ret.code == 1) {
                        this.dispatchData = ret.data.rows;
                        this.dispatchProData = [...ret.data.rows];
                    } else {
                        this.$Message.error(result.msg)
                    }
                }).catch((err) => {
                    console.log(err);
                })
            },


            /*人员选择*/
            openEquType(){
                this.dispatchMod = true;
//                this.dispatchManList();
            },
            /*人员单选方法 --S--*/

            /*dispatchManList(){
                let vt = this;
                this.$axios.post('/eamDo/orderOperatorList', {
                    page: this.dispatchPage,
                    pageSize: 10,
                    name: this.dispatch_name,
                }).then((res) => {
                    if (res.data.response.code === 1) {
                        let dataRes = res.data.response.data;
                        vt.dispatchManData = [];
                        vt.dispatchManTotal = dataRes.total;
                        for (let i = 0; i < dataRes.rows.length; i++) {
                            vt.dispatchManData.push({
                                personId: dataRes.rows[i].id,
                                personName: dataRes.rows[i].name,
                                personCode: dataRes.rows[i].code,
                                personCardNo: dataRes.rows[i].cardNo,
                                positionName: dataRes.rows[i].position,
                                teamName: dataRes.rows[i].productionTeam,
                                kpiRatio: '',
                                time: '',
                                note: dataRes.rows[i].note
                            })
                        }
                    } else {
                        vt.dispatchManData = [];
                        vt.dispatchManTotal = 0;
                        vt.$Message.error(res.data.response.msg);

                    }
                }).catch((err) => {
                    console.log(err);
                });
            },
            dispatchManChange(page){
                this.dispatchPage = page;
                this.dispatchManList();
            },
            toSelectMan(rowData){
                this.selectRowMan = rowData;
            },
            dispatchManSelected(){
                let vm = this;
                vm.dispatchData = [...vm.selectRowsMan];
            },
            dispatchSelected(selectedAry){
                this.selectRowsMan = selectedAry;
            },*/
            /*人员单选方法 --E--*/
            /*删除人员*/
            delDispatchItem(index){
                this.dispatchData.splice(index, 1);
                this.dispatchProData.splice(index,1)
            },
            /*人员多选 --S--*/
             dispatchSelected(selectedAry){
                this.selectRowsMan = selectedAry;
             },
            dispatchManSelected(){
                let vm = this;
                /*多选*/
                if(vm.selectRowsMan.length===0){
                    vm.dispatchData = [...dispatchProData];
                }
                vm.dispatchData = [...vm.selectRowsMan];
                /*单选*/
               /* vm.dispatchData = [];
                vm.dispatchData.push(vm.selectRowMan);*/
            },

            /*人员多选 --E--*/
            /*人员选择*/
            /*补充派工 --S--*/
            dispatchAgain(){
                let vt = this;
                let dispatchManAry = [];
                let dispatchAry = {};
                let kpiNum = 0;
                if(vt.dispatchData.length>0){
                    for(let i = 0; i<vt.dispatchData.length;i++){
                        if(vt.dispatchData[i].kpiRatio>0){
                            kpiNum +=  parseInt(vt.dispatchData[i].kpiRatio);
                            if(kpiNum<100){
                                dispatchManAry.push({
                                    "dispatchOrderId": vt.orderId,
                                    "assignTo": vt.dispatchData[i].personId,
                                    "kpiRatio": vt.dispatchData[i].kpiRatio,
                                    "plannedLastedTime": 0,
                                })
                            }else {
                                vt.$Message.error("绩效总和小于100！")
                                return
                            }
                        }else {
                            vt.$Message.error("请输入大于0的绩效！")
                            return
                        }
                    }
                }else {
                    dispatchManAry = [];
                }
                dispatchAry.orderId = vt.orderId;
                dispatchAry.assignment = dispatchManAry;
//                    console.log("dispatchAry +" + JSON.stringify(dispatchAry))
                this.$axios.post('/eamDo/addAssignment',dispatchAry).then((res) => {
                    let ret = res.data.response;
                    if (ret.code == 1) {
                        vt.$Message.success("操作成功！");
                        vt.loading = true;
                        this.$router.push({ path: 'orderTerminal', query: {orderId:vt.orderId,workItemId:vt.workItemId,orderFlag:vt.orderFlag,'title':vt.listTitle,type:vt.listStatus,}});
                    } else {
                        vt.$Message.error("操作失败！")
                    }
                }).catch((err) => {
                    console.log(err);
                })


            },
            /*补充派工 --E--*/



            backFun(){
                this.$router.back()
            },
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
