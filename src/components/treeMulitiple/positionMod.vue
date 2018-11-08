<template>
    <div class="basic fault-content">
            <div class="btn-query mar-b-10" style="display: table;margin-bottom: 20px;">
                岗位名称  <Input class="mar-l-10" style="width: 160px;" v-model="position_name" @on-blur="position_name = toValidate(position_name)" ></Input>
                <Button type="primary" icon="search" size="large" @click="searchList">
                    查询
                </Button>
            </div>
            <div class="table-reset">
                <Table highlight-row border class="taDisplay" :columns="manufCol" :data="manufData" @on-row-click="toSelect"></Table>
            </div>
            <div class="mar-t-10" style="overflow: hidden">
                <div style="float: right;">
                    <Page size="small" :total="totalNum" show-elevator :page-size="pagesize" :current="page" @on-change="pageChange"></Page>
                </div>
            </div>
    </div>
</template>
<script>
    export default {
        //树图：
        props: ['baseData', 'right_display'],
        data () {
            return {
                totalNum:5,
                position_name: '',
                tBdPositionId: '',
                manufCol: [
                    {
                        title:'序号',
                        type: 'index',
                        width: 80,
                        align: 'center'
                    },
                    {
                        title:'岗位名称',
                        key: 'tBdPositionName',
                        align: 'center'
                    }
                ],
                manufData: [],
                page: 1,
                pagesize: 5
            }
        },
        methods: {
            //验证输入框格式
            toValidate(msg){
//                console.log(msg);
                var str = /[=+%!<>"'/_,()\\]/
                if(str.test(msg)){
                    this.$Message.warning('输入格式错误')
                    msg = msg.replace(/\'/g,"").replace(/\"/g,"").replace(/\+/g,"").replace(/\=/g,"").replace(/\%/g,"").replace(/\!/g,"").replace(/\</g,"").replace(/\>/g,"").replace(/\//g,"").replace(/\_/g,"").replace(/\,/g,"").replace(/\(/g,"").replace(/\)/g,"").replace(/\\/g,"");
                }
                return msg
            },
            //部门查询：
            getManuf(){
                this.$axios.get('/System/positionMagnifier', {
                    params: {
                        page: this.page,
                        pagesize: this.pagesize,
                        position_name: this.position_name
                    }
                }).then((res) => {
                    let ret = res.data.response;
                    if (ret.code == 1) {
                        this.manufData= ret.data.Rows;
                        this.totalNum = ret.data.Total;
                    } else {
                        this.$Message.error(ret.msg);
                    }
                }).catch((err) => {
                    console.log(err);
                });
            },
            pageChange(page){
                this.page = page;
                this.getManuf();
            },
            toSelect(rowdata){
                this.$emit("posSelected", rowdata);
            },
            searchList(){
                this.page = 1;
                this.getManuf();
            },
        },
        mounted () {
            this.getManuf();
        }
    }
</script>


