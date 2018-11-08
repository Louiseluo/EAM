<!--设备型号弹出框：-->
<template>
    <div class="basic fault-content">
        <!--设备型号弹出框：-->
            <div class="btn-query mar-b-10" style="display: table;margin-bottom: 20px;">
                部门名称  <Input class="mar-l-10" style="width: 160px;" v-model="dept_name" @on-blur="dept_name = toValidate(dept_name)" ></Input>
                <Button type="primary" icon="search" size="large" @click="searchList">
                    查询
                </Button>
            </div>

            <div class="table-reset">
                <Table highlight-row border class="taDisplay" :columns="deptCol" :data="deptNames" @on-row-click="toSelect"></Table>
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
                dept_name: '',
                deptCol: [
                    {
                        title:'序号',
                        type: 'index',
                        width: 80,
                        align: 'center'
                    },
                    {
                        title:'部门名称',
                        key: 'tBdDepartmentName',
                        align: 'center'
                    },
                    {
                        title:'部门负责人',
                        key: 'tBdPersonName',
                        align: 'center'
                    }
                ],
                deptNames: [],
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
            getDept(){
                this.$axios.post('/common/departmentName', {
                    page: this.typePage,
                    pageSize: this.pageSize,
                    departmentName : this.dept_name,
                }).then((res) => {
//                    console.log('部门放大镜 === ');
//                    console.log(JSON.stringify(res));
                    let ret = res.data.response;
                    if (ret.code == 1) {
                        this.deptNames= ret.data.Rows;
                        this.totalNum = ret.data.Total;
                    } else {
                        this.$Message.error(ret.msg);
                    }
                }).catch((err) => {
                    console.log(err);
                });
            },
            pageChange(page){
                this.typePage = page;
                this.getDept();
            },
            toSelect(rowdata){
                this.$emit("deptSelected", rowdata);
            },
            searchList(){
                this.typePage = 1;
                this.getDept();
            },
        },
        mounted () {
            this.getDept();
        }
    }
</script>


