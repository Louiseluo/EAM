<!--标准方案弹出框：-->
<template>
    <div class="basic fault-content">
        <div class="table-reset">
            <Table stripe border :columns="columns1" :data="data1" @on-row-click="toSelect" highlight-row></Table>
            <!--<table class="table table-bordered table-center table-striped table-blue table-edit typedevice typeTable taDisplay">-->
                <!--<thead>-->
                <!--<tr>-->
                    <!--&lt;!&ndash;<th>选择</th>&ndash;&gt;-->
                    <!--<th>序号</th>-->
                    <!--<th>方案名称</th>-->
                <!--</tr>-->
                <!--</thead>-->
                <!--<tbody>-->
                <!--<tr v-for="(item,index) in plans" :key="item.id" class="trDisplay" @click="toSelect(index)">-->
                    <!--<td><input type="radio" name='checked_radio' class="checkInput_problem"  /></td>-->
                    <!--<td>{{index + 1}}</td>-->
                    <!--<td class="tdDisplay pointDis" :title="item.name">{{item.name}}</td>-->
                <!--</tr>-->
                <!--</tbody>-->
            <!--</table>-->
            <!--<div class="tableHasNoData" v-show="plans.length==0"><p>暂无数据</p></div>-->
        </div>
        <div class="mar-t-10" style="overflow: hidden">
            <div style="float: right;">
                <Page size="small" :total="totalNum" show-elevator :page-size="5" @on-change="pageChange" :current="typePage"></Page>
            </div>
        </div>

    </div>
</template>
<script>
    export default {
        //树图：
        props: ['planType','equSite'],
        data () {
            return {
                totalNum:5,
                plans: [],
                typePage:1,
                columns1: [
                    {
                        title: '序号',
                        type: 'index',
                        align: 'center',
                        width: '100'
                    },
                    {
                        title: '方案名称',
                        key: 'name',
                        align: 'center',
                        render: (h, params) => {
                            return h('p', {
                                domProps: {
                                    title: params.row.solutionName
                                },
                                class: 'iview_tabDis',
                            }, params.row.solutionName)
                        },
                    },
//                    {
//                        title: 'Address',
//                        key: 'address'
//                    }
                ],
                data1:[
                    {
                        name: '方案1'
                    }
                ]
            }
        },
        methods: {
            //设备型号查询：
            getPlan(){
                this.$axios.post('/plan/selectStandardSolution',{page:this.typePage,pageSize:5,planType:this.planType,locationId:this.equSite}).then((res) => {
                    var ret = res.data.response;
                    if (ret.code == 1) {
                        this.data1 = ret.data.rows;
                        this.totalNum = ret.data.total;
                    };

                }).catch((err) => {
                    console.log(err);
                });
            },
            pageChange(page){
                this.typePage = page;
                this.getPlan();
            },
            toSelect(msg){
                this.$emit("planSelected", msg);
            },},
        mounted () {
            if(this.equSite){
                this.getPlan();
            };
        },
        watch:{

            planType:function(){
                if(this.equSite){
                    this.plans=[];
                    this.pageChange(1);
                };
            },
            equSite:function(){
                this.plans=[];
                this.pageChange(1);
            },
        },

    }
</script>


