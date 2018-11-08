<!--设备型号弹出框：-->
<template>
    <div class="basic fault-content">
        <!--设备型号弹出框：-->
        <!--<div class="table-reset">
            <table class="table table-bordered table-center table-striped table-blue table-edit typedevice taDisplay">
                <thead>
                <tr>
                    <th>选择</th>
                    <th>序号</th>
                    <th>设备型号</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item,index) in spareUnits" class="trDisplay">
                    <td><input type="radio" name='checked_radio' class="checkInput_problem" @click="toSelect(index)"/>
                    </td>
                    <td>{{index + 1}}</td>
                    <td class="tdDisplay pointDis" :title="item.name">{{item.name}}</td>
                </tr>
                </tbody>
            </table>
        </div>-->
        <div class="table-reset">
            <Table highlight-row border ref="currentRowTable" class="taDisplay" :columns="columns_spareUnits" :data="spareUnits" @on-row-click="toSelect"></Table>
        </div>
        <div class="mar-t-10" style="overflow: hidden">
            <div style="float: right;">
                <Page size="small" :total="totalNum" show-elevator :page-size="5" @on-change="pageChange"></Page>
            </div>
        </div>

    </div>
</template>

<script>
    export default {
        //树图：
        data () {
            return {
                totalNum: 5,
                columns_spareUnits:[
                    {
                        title:'序号',
                        type: 'index',
                        width: 120,
                        align: 'center'
                    },
                    {
                        title: '备件单位',
                        key: 'name',
                        align:'center',
                        render:(h,params) => {
                            return h('p',{
                                domProps:{
                                    title:params.row.name,
                                },
                                class:'iview_tabDis'
                            },params.row.name)
                        }
                    },
                ],
                spareUnits: [],
               typePage:1,
            }
        },
        methods: {
            //设备型号查询：
            getParts_unit(){
                this.$axios.post('/eamSparePart/getUom', {
                        pageNum: this.typePage,
                        pageSize:5
                }).then((res) => {
                    var ret = res.data.response;
//                    cosnole.log('unit === ')
//                    console.log(JSON.stringify(ret))
                    if (ret.code == 1) {
                        this.spareUnits = ret.data.rows;
                        this.totalNum = ret.data.total;

//                        $(".checkInput_problem").attr("checked", "checked");
//                        $(".checkInput_problem").attr("checked", false);
                    }
                    ;
                    this.$jq("input[name='checked_radio']:checked").prop("checked", false);
                }).catch((err) => {
                    console.log(err);
                });
            },
            pageChange(page){
                this.typePage = page;
                this.getParts_unit();
            },
            toSelect(rowdata,index){
                this.$emit("unitSelected", rowdata);
            },
            /*toSelect(index){
                this.$emit("unitSelected", this.spareUnits[index]);
            },*/
        },
        mounted () {
            this.getParts_unit();
        },

    }
</script>


