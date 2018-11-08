<template>
    <div class="basic fault-content">
        <!--模块名称-->
        <div class="title">
            <span>设备保养日历</span>
        </div>
        <div class="form-content">
            <Form ref="planWorkForm" :model="planWorkForm" label-position="right" inline :label-width="100">
                <Form-item label="设备编码" prop="equipmentCode">
                    <Input v-model="planWorkForm.equipmentCode" @on-blur="planWorkForm.equipmentCode = toValidate(planWorkForm.equipmentCode)" style="width: 160px;" placeholder=""></Input>
                </Form-item>
                <Form-item label="设备名称" prop="equipmentName">
                    <Input v-model="planWorkForm.equipmentName" @on-blur="planWorkForm.equipmentName = toValidate(planWorkForm.equipmentName)" style="width: 160px;" placeholder=""></Input>
                </Form-item>
            </Form>
            <!--查询按钮-->
            <div class="btn-query">
                <Button  type="primary" icon="search" size="large" @click="searchAuditList">查询</Button>
            </div>
        </div>
        <!--表格-->
        <div class="table-content">
            <div class="table-content ivu-table-auto">
                <Table stripe border :columns="columnsAudit" :data="dataAudit"></Table>
            </div>
            <div class="mar-t-10">
                <div style="float: right;">
                    <Page size="small" :total='pageTotal' show-elevator :page-size="pageSize" @on-change="pageChange"></Page>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import $ from 'jquery'
    export default {
        data (){
            return {
                planWorkForm: {
                    /*审核管理*/
                    equipmentCode: '',
                    equipmentName: '',
                },
                /*审核管理*/
                columnsAudit:[
                    {
                        title: '序号',
                        type: 'index',
                        width: 70,
                        align: 'center'
                    },
                    {
                        title: '设备编码',
                        key: 'equipmentCode',
                        align: 'center',
                        render: (h, params) => {
                            let btns = [];
                            btns.push(
                                h('a', {
                                    class: 'iview_tabDis',
                                    on: {
                                        click: () => {
                                            this.$router.push({path: '/resume', query: {id: params.row.equipmentId}})
                                        }
                                    }
                                }, params.row.equipmentCode)
                            )
                            return h('div', btns)
                        },
                    },
                    {
                        title: '设备名称',
                        key: 'equipmentName',
                        align: 'center',
                    },
                    {
                        title: '1',
                        key: '1',
                        width: 50,
                        align: 'center',
                    },
                    {
                        title: '2',
                        key: '2',
                        width: 50,
                        align: 'center',
                    },
                    {
                        title: '3',
                        key: '3',
                        width: 50,
                        align: 'center',
                    },
                    {
                        title: '4',
                        key: '4',
                        width: 50,
                        align: 'center',
                    },
                    {
                        title: '5',
                        key: '5',
                        width: 50,
                        align: 'center',
                    },
                    {
                        title: '6',
                        key: '6',
                        width: 50,
                        align: 'center',
                    },
                    {
                        title: '7',
                        key: '7',
                        width: 50,
                        align: 'center',
                    },
                    {
                        title: '8',
                        key: '8',
                        width: 50,
                        align: 'center',
                    },
                    {
                        title: '9',
                        key: '9',
                        width: 50,
                        align: 'center',
                    },
                    {
                        title: '10',
                        key: '10',
                        width: 50,
                        align: 'center',
                    },
                    {
                        title: '11',
                        key: '11',
                        width: 50,
                        align: 'center',
                    },
                    {
                        title: '12',
                        key: '12',
                        width: 50,
                        align: 'center',
                    },
                    /*{
                     title: '操作',
                     key: 'action',
                     align: 'center',
                     render: (h, params) => {
                     let btns = [];
                     if(this.if_detail) {
                     btns.push(
                     h('a', {
                     class: 'mar-r-5',
                     on: {
                     click: () => {
                     //                                            this.view();
                     this.goViewAuditPlan(this.dataAudit[params.index].id,this.dataAudit[params.index].workItemId,params.row.samePerson);
                     }
                     }
                     }, '查看'),
                     h('a', {
                     class: 'mar-r-5',
                     style:{ //可删除
                     color: (params.row.approvalStatus == '已制单'||params.row.approvalStatus == '已驳回')&&(this.dataAudit[params.index].workItemId!=''||params.row.samePerson==0) ?  "#2d8cf0": "#bbbec4",
                     display: params.row.level!='月计划'?'inline-block':'none'
                     },
                     on: {
                     click: () => {
                     // this.goViewAuditPlan(this.dataAudit[params.index].id,this.dataAudit[params.index].workItemId,params.row.samePerson);
                     this.deletePlan(this.dataAudit[params.index].id,params.row.approvalStatus,this.dataAudit[params.index].workItemId,params.row.samePerson);
                     }
                     }
                     }, '删除'),
                     );
                     }
                     return h('div', btns)
                     },
                     },*/
                ],
                dataAudit:[],
                dayTypeAry:["☆","△","○",],
                pageTotal:0,
                pageSize:20,
                page:1,
            }
        },
        mounted(){
            this.getEquipmnet();
        },
        methods: {
            toValidate(msg){
//                console.log(msg);
                var str = /[=+%!<>"'/_,()\\]/
                if(str.test(msg)){
                    this.$Message.warning('输入格式错误')
                    msg = msg.replace(/\'/g,"").replace(/\"/g,"").replace(/\+/g,"").replace(/\=/g,"").replace(/\%/g,"").replace(/\!/g,"").replace(/\</g,"").replace(/\>/g,"").replace(/\//g,"").replace(/\_/g,"").replace(/\,/g,"").replace(/\(/g,"").replace(/\)/g,"").replace(/\\/g,"");
                }
                return msg
            },
            searchAuditList(){
                this.page = 1;
                this.getEquipmnet();
            },

            /************************************* 适用设备 start *********************************************************** */
            getEquipmnet: function () {
                let vm = this;
//                "intervalTime": 0,//年，1,//半年，2,//季度，
                let backData = []
                this.$axios.post('/plan3/getEquipmentPlanList', {
                    page:vm.page,
                    pageSize:vm.pageSize,
                    equipmentCode:vm.planWorkForm.equipmentCode,
                    equipmentName:vm.planWorkForm.equipmentName,
                }).then((res) => {
//                    console.log("res + " + JSON.stringify(res));
                    if (res.data.response.code == 1) {
                        vm.dataAudit= [];
                        backData = res.data.response.data.rows;
                        vm.pageTotal = res.data.response.data.total;
                        for(let i = 0 ; i<  backData.length; i++){
                            let putTimeIcon;
                            let dataAuditItem={
                                equipmentId: '',
                                equipmentCode: '',
                                equipmentName: '',
                                1: '',
                                2: '',
                                3: '',
                                4: '',
                                5: '',
                                6: '',
                                7: '',
                                8: '',
                                9: '',
                                10: '',
                                11: '',
                                12: '',
                            };
                            dataAuditItem.equipmentId =  backData[i].equipmentId;
                            dataAuditItem.equipmentName =  backData[i].equipmentName;
                            dataAuditItem.equipmentCode =  backData[i].equipmentCode;
                            for(let j = 0 ;j < backData[i].plan.length; j++){
//                                （ 季度：○ 2   半年：△ 1  一年：☆ 0 ）
                                let month = parseInt(backData[i].plan[j].month)
                                backData[i].plan[j].intervalTime == 0?putTimeIcon = "☆":backData[i].plan[j].intervalTime == 1? putTimeIcon = "△": putTimeIcon = "○";
                                dataAuditItem[month] = putTimeIcon;
                            }
                            vm.dataAudit.push(dataAuditItem)
                        }
                    }
                }).catch((err) => {
                    console.log(err);
                });
            },
            /************************************* 适用设备 end *********************************************************** */
            pageChange(current){
                this.page = current;
                this.getEquipmnet()
            }

        },
    }
</script>


<style>
    th .ivu-table-cell{
        padding-right: 5px;
        padding-left: 5px;
        vertical-align: middle;
    }
</style>
