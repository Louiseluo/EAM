<template class="mettingAdd">
    <div class="basic fault-content">
        <Form ref="partsVersion" :model="partsVersion" label-position="right" inline :label-width="90">
            <Form-item label="备件型号">
                <!--<Input v-model="partsVersion.parts_version_name" style="width: 120px;" placeholder=""></Input>-->
                <Input v-model="partsVersion.parts_version_name" @on-blur="partsVersion.parts_version_name = toValidate(partsVersion.parts_version_name)" style="width: 120px;" placeholder=""></Input>
            </Form-item>
            <FormItem>
                <Button type="primary" icon="search" @click="getParts_unit">查询</Button>
            </FormItem>
        </Form>
        <!--<div class="table-reset">
            <table class="table table-bordered table-center table-striped table-blue table-edit typedevice taDisplay">
                <thead>
                <tr>
                    <th width="20%">序号</th>
                    <th>备件型号</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item,index) in spareVersionData" class="trDisplay" @click="toSelect(index)">
                    <td >{{index + 1}}</td>
                    <td class="tdDisplay pointDis" :title="item.name">{{item.name}}</td>
                </tr>
                </tbody>
            </table>
        </div>-->
        <div class="table-reset">
            <Table highlight-row border ref="currentRowTable" class="taDisplay" :columns="columns_spareVersion" :data="spareVersionData" @on-row-click="toSelect"></Table>
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
        props: ['tempState'],
        data () {
            return {
                partsVersion:{
                    parts_version_id:'',
                    parts_version_name:'',
                },
                typePage:'',
                totalNum:0,

                columns_spareVersion: [
                    {
                        title:'序号',
                        type: 'index',
                        width: 120,
                        align: 'center'
                    },
                    {
                        title: '备件型号',
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
                spareVersionData: []
            }
        },
        methods: {
            toValidate(msg){
                var str = /[=+%!<>"'/_,()\\]/
                if(str.test(msg)){
                    this.$Message.warning('输入格式错误')
                    msg = msg.replace(/\'/g,"").replace(/\"/g,"").replace(/\+/g,"").replace(/\=/g,"").replace(/\%/g,"").replace(/\!/g,"").replace(/\</g,"").replace(/\>/g,"").replace(/\//g,"").replace(/\_/g,"").replace(/\,/g,"").replace(/\(/g,"").replace(/\)/g,"").replace(/\\/g,"");
                }
                return msg
            },
            //设备型号查询：
            getParts_unit(){
                this.$axios.post('/common/modelList', {
                    page: this.typePage,
                    pageSize:5,
                    name:this.partsVersion.parts_version_name,
                }).then((res) => {
                    var ret = res.data.response;
                    if (ret.code == 1) {
                        this.spareVersionData = ret.data.Rows;
                        this.totalNum = ret.data.Total;
                    };
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
                this.$emit("versionSelected", rowdata);
            },
        },
        mounted () {
            this.getParts_unit();
        },
    }
</script>


