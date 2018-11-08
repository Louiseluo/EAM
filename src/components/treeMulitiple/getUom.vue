<!--设备型号弹出框：-->
<template>
    <div class="basic fault-content">
        <div class="btn-query mar-b-10" style="display: table;margin-bottom: 20px;">
            单位名称  <Input class="mar-l-10" style="width: 160px;" v-model="person_name"
                         @on-blur="person_name = toValidate(person_name)"></Input>
            <Button type="primary" icon="search" size="large" @click="searchList">
                查询
            </Button>
        </div>
        <div class="table-reset">
            <Table highlight-row border class="taDisplay" :columns="personCol" :data="personData"
                   @on-row-click="toSelect"></Table>
        </div>

        <div class="pageItem" align="right">
            <Page size="small" :total="totalNum" show-elevator :page-size="5" :current="typePage"
                  @on-change="pageChange"></Page>
        </div>
    </div>
</template>

<script>
    export default {
        //树图：
        data () {
            return {
                totalNum: 0,
                person_name: '',
                personCol: [
                    {
                        title:'序号',
                        type: 'index',
                        width: 80,
                        align: 'center'
                    },
                    {
                        title:'单位名称',
                        key: 'uomName',
                        align: 'center'
                    }
                ],
                personData: [],
                typePage: 1
            }
        },
        methods: {
            //设备型号查询：
            getEqu_type(){
                this.$axios.post('/equipmentApplication/getUom',{page:this.typePage,pageSize:5,uomName: this.person_name}).then((res) => {
                    let ret = res.data.response;
                    if (ret.code == 1) {
                        this.personData= ret.data.rows;
                        this.totalNum = ret.data.total;
                    }

                }).catch((err) => {
                    console.log(err);
                });
            },
            pageChange(page){
                this.typePage = page;
                this.getEqu_type();
            },
            toSelect(rowData){
                this.$emit("uomSelected", rowData);
            },
            searchList(){
                this.typePage = 1;
                this.getEqu_type();
            },
            //验证输入框格式
            toValidate(msg){
//                console.log(msg);
                let str = /[=+%!<>"'/_,()\\]/;
                if(str.test(msg)){
                    this.$Message.warning('输入格式错误');
                    msg = msg.replace(/\'/g,"").replace(/\"/g,"").replace(/\+/g,"").replace(/\=/g,"").replace(/\%/g,"").replace(/\!/g,"").replace(/\</g,"").replace(/\>/g,"").replace(/\//g,"").replace(/\_/g,"").replace(/\,/g,"").replace(/\(/g,"").replace(/\)/g,"").replace(/\\/g,"");
                }
                return msg
            },
        },
        mounted () {
            this.getEqu_type();
        },

    }
</script>


