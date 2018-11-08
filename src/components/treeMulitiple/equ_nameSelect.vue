<!--设备型号弹出框：-->
<template>
    <div class="basic fault-content">
        <!--设备型号弹出框：-->
            <div class="btn-query mar-b-10" style="display: table;margin-bottom: 20px;">
                设备名称  <Input class="mar-l-10" style="width: 160px;" v-model="equipment_name" @on-blur="equipment_name = toValidate(equipment_name)" ></Input>
                <Button type="primary" icon="search" size="large" @click="searchList">
                    查询
                </Button>
            </div>

            <div class="table-reset">
                <Table highlight-row border class="taDisplay" :columns="equCol" :data="equNames" @on-row-click="toSelect"></Table>
            </div>
            <div class="mar-t-10" style="overflow: hidden">
                <div style="float: right;">
                    <Page size="small" :total="totalNum" show-elevator :page-size="pageSize" :current="typePage" @on-change="pageChange"></Page>
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
                equipment_name: '',
                equCol: [
                    {
                        title:'序号',
                        type: 'index',
                        width: 80,
                        align: 'center'
                    },
                    {
                        title:'设备名称',
                        key: 'equipmentName',
                        align: 'left'
                    }
                ],
                equNames: [],
                typePage: 1,
                pageSize: 5
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
            //设备型号查询：
            getEqu_name(){
                this.$axios.post('/equipmentApplication/getEquList',{
                    page: this.typePage,
                    pageSize: this.pageSize,
                    equipmentName: this.equipment_name
                }).then((res) => {
//                    console.log('设备放大镜 === ');
//                    console.log(JSON.stringify(res));
                    let ret = res.data.response;
                    if (ret.code == 1) {
                        this.equNames= ret.data.rows;
                        this.totalNum = ret.data.total;
//                        $(".typeTable").find("input[type='radio']:checked").prop('checked', false);
//                        console.log('this.equNames == '+JSON.stringify(this.equNames));
                    } else {
                        this.$Message.error(ret.msg);
                    }
                }).catch((err) => {
                    console.log(err);
                });
            },
            pageChange(page){
                this.typePage = page;
                this.getEqu_name();
            },
            toSelect(rowdata){
                this.$emit("nameSelected", rowdata);
            },
            searchList(){
                this.typePage = 1;
                this.getEqu_name();
            },
        },
        mounted () {
            this.getEqu_name();
        }
    }
</script>


