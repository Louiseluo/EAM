<template>
    <div class="basic fault-content">
        <!--模块名称-->
        <div class="title">
            <span>{{pageTitle}}工单执行流程--{{actionTitle}}</span>
        </div>
        <div class="secondSteps">
            <ul class="secondStepsUl">
                <!--<li  v-for="(item,index) in secondStepsData" :class="item.liClass" @click="activeFun(index)">{{item.content}}</li>-->
                <li  v-for="(item,index) in secondStepsData" :class="item.liClass">{{item.content}}</li>
            </ul>
        </div>
        <!--执行记录---start-->
        <div class="second-title mar-t-15">目标终端所在设备</div>
        <!--点检-->
        <div style="overflow: hidden;">
            <Table class="mar-b-15" stripe border :columns="terminalList" :data="terminalData"></Table>
        </div>

        <!--操作按钮-->
        <div align="center" class="btnGroupDesign">
            <Button type="primary" size="large"  @click="dispatchStart(7)" v-if="rule_XFZD">下发终端</Button>
            <!--<Button type="primary" size="large">取消</Button>-->
            <Button type="primary" size="large" @click="backFun">返回</Button>
        </div>
    </div>
</template>

<script>
    export default {
        data (){
            return {
                rule_XFZD:this.$rt(this.authJson.EAM.设备保养.维修工单查看页.下发终端),
                orderId:'',
                workItemId:'',
                actionTitle:'',
                pageTitle:'',
                orderFlag:0,
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
                        liClass:'secondStepsLi'
                    },
                    {
                        code:4,
                        content:"下发终端",
                        liClass:'secondStepsLi active'
                    },
                ],
                //终端列表
                terminalList: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 80,
                        align: 'center'
                    },
                    {
                        title: '设备编码',
                        key: 'code',
                        align: 'center',
                    },
                    {
                        title: '设备名称',
                        key: 'name',
                        align: 'center'
                    },
                    {
                        title: '设备分类',
                        key: 'classification',
                        align: 'center',
                        render: (h, params) => {
                            let txtTitle = this.$base_info.getDescByCode(params.row.classification,this.$base_info.tEAMEquipmentAssetsClassificationEnum);
                            return h('div', txtTitle);
                        },
                    },
                    {
                        title: '设备类型',
                        key: 'type',
                        align: 'center'
                    },
                    {
                        title: '规格型号',
                        key: 'model',
                        align: 'center'
                    },
                    {
                        title: '安装地点',
                        key: 'location',
                        align: 'center'
                    },
                    {
                        title: '终端编码',
                        key: 'terminalCode',
                        align: 'center'
                    },
                    {
                        title: '终端型号',
                        key: 'terminalType',
                        align: 'center'
                    },
                    {
                        title: '终端制造商',
                        key: 'terminalManufacturer',
                        align: 'center'
                    },
                ],
                terminalData: [],
                totalPages: 1,
                currentPage: 1,

                listTitle:'',
                listStatus:-1,

            }
        },
        mounted(){
            this.orderId = this.$route.query.orderId;
            this.workItemId = this.$route.query.workItemId;

            this.listTitle = this.$route.query.title;
            this.listStatus = this.$route.query.type;

            this.terminalLoad();
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
            }else if(this.orderFlag == 0){
                this.pageTitle = "保养";
                this.actionTitle = "接单"
//                this.secondStepsData[0].content = "确认接单"
            }
        },

        methods: {
            backFun(){
                this.$router.back()
            },
            /*******  dispatchStart 下发终端 *********/
            dispatchStart(dispatchOperatorCode){
                let dispatchAry = {
                    "operatorCode": dispatchOperatorCode,
                    "orderId": this.orderId,
                    "wfWorkItemId": this.workItemId
                };
//                console.log("dispatchAry +" + JSON.stringify(dispatchAry))
                this.$axios.post('/eamDo/maintainOrderOperator',dispatchAry ).then((res) => {
                    let ret = res.data.response;
                    if (ret.code == 1) {
                        this.$Message.success("操作成功！");
//                        this.$router.push({path: '/maintenanceOrder',query: {'title':this.listTitle,type:this.listStatus}});
                        this.$router.push({path: '/maintenanceOrder',query: {type:this.listStatus,orderFlag:this.orderFlag}});
                    } else {
                        this.$Message.error("操作失败！")
                    }
                }).catch((err) => {
                    console.log(err);
                })
            },
            terminalLoad(){
                this.$axios.post('eamDo/getTargetTerminalInfo',{
                    "dispatchOrderId": this.orderId,
                } ).then((res) => {
                    let ret = res.data.response;
                    if (ret.code == 1) {
                        this.terminalData.push(ret.data);
                    } else {
                        this.$Message.error("获取失败！")
                    }
                }).catch((err) => {
                    console.log(err);
                })
            },
            /*******  dispatchStart 下发终端 *********/
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
</style>
