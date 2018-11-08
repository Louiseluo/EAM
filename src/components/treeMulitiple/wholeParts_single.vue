<template class="mettingAdd">
    <div class="basic fault-content">
        <!--<div class="btn-query mar-b-10" style="display: table;margin-bottom: 20px;">
            备件名称  <Input class="mar-l-10" style="width: 160px;" v-model="searchName" @on-blur="searchName = toValidate(searchName)" ></Input>
            <Button type="primary" icon="search" size="large" @click="changeEquipment">
                查询
            </Button>
        </div>-->
        <div class="form-content">
            <Form inline :label-width="100" >
                <Form-item label="备品备件编码" prop="equ_code">
                    <Input v-model="equ_code" @on-blur="equ_code=toValidate(equ_code)" ></Input>
                </Form-item>
                <Form-item label="备品备件名称" prop="equ_name">
                    <Input v-model="equ_name" @on-blur="equ_name=toValidate(equ_name)"></Input>
                </Form-item>
            </Form>
            <!--查询按钮-->
            <div style="text-align: right;padding-right: 20px">
                <Button type="primary" icon="search" size="large" @click="getEquipmnet(1)">查询</Button>
            </div>
        </div>

            <Table highlight-row border class="taDisplay" :columns="deptCol" :data="tableDatas" @on-row-click="toSelect"></Table>

            <!--<table class="table table-bordered table-center table-striped table-blue taDisplay">
                    <thead>
                    <tr>
                        <th>序号</th>
                        <th>备件名称</th>
                        <th>备件分类</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(item, index) in   tableDatas" :key="item.id" class="pointDis trDisplay"
                        @click="toSelectItem(index)">
                        <td>{{index + 1}}</td>
                        <td class="tdDisplay pointDis" :title="item.tool_define_name ? item.tool_define_name : itemtoolDefineName">{{item.tool_define_name ? item.tool_define_name : itemtoolDefineName}}</td>
                        <td class="tdDisplay pointDis" :title="item.tool_define_type">{{item.tool_define_type}}</td>
                    </tr>
                    </tbody>
                </table>-->
                <!--<div class="tableHasNoData" v-show="!tableDatas[0]"><p>暂无备件可以选择，您可以切换左侧备件类型试试~</p></div>-->
                <div class="pageItem" align="right">
                    <Page :total="tpmsbTotal" :current="tpmsbCurrent" size="small" show-elevator :page-size="10"
                          @on-change="changeEquipment"></Page>
                </div>

    </div>
</template>

<script>
    export default {
        props: ['mod_rightDisplay', 'canSearch'],
        data () {
            return {
                equ_code: '',
                equ_name: '',
                deptCol: [
                    {
                        title:'序号',
                        type: 'index',
                        width: 80,
                        align: 'center'
                    },
                    {
                        title:'备品备件编码',
                        key: 'tBdSparePartCode',
                        align: 'center'
                    },
                    {
                        title:'备品备件名称',
                        key: 'tBdSparePartName',
                        align: 'center'
                    }
                ],
                baseData: [],
                tableDatas: [],
                tpmsbTotal: 0,
                locationId: '',
                tpmsbCurrent: 1,
//                mod_rightDisplay:[],
                selectedNum: "0",
                scrollDivTo: "",
                searchName:"",
            }
        },
        methods: {
            getEquipmnet(){
                let vt = this;
                this.$axios.get('/tEamStandardSolution/sparePart/list', {
                    params: {
                        page: vt.tpmsbCurrent,
                        pageSize:5,
                        partCode:this.equ_code,
                        sparePartName:this.equ_name,
                    }
                }).then((res) => {
//                    alert("查询");
                    if (res.data.response.code === 1) {
                        let dataRes = res.data.response.data;
                        vt.tpmsbTotal = dataRes.Total;
                        vt.tableDatas = dataRes.Rows;

                    } else {
                        vt.tableDatas = [];
                        vt.tpmsbTotal = 0;
                        vt.$Message.error(res.data.response.msg);

                    }
                }).catch((err) => {
                    console.log(err);
                });
            },
            /*分页*/
            changeEquipment(currentPage) {
                this.tpmsbCurrent = currentPage;
                this.getEquipmnet();
            },
            toSelect(rowdata) {
                this.$emit("sparePartsSetected", rowdata);
            },
            toSelectItem(table_selectedItem) {
                if (table_selectedItem == "[]") {
                    return
                }

                this.table_selectedItem = this.tableDatas[table_selectedItem];

                for (let i = 0; i < this.mod_rightDisplay.length; i++) {
                    if (this.mod_rightDisplay[i].id == this.table_selectedItem.id) {
                        return
                    }
                }

               /* if (this.table_selectedItem.transport_method == 0) {
                    this.table_selectedItem.transport_method = "人工搬运";
                }
                else if (this.table_selectedItem.transport_method == 1) {
                    this.table_selectedItem.transport_method = "手动推车";
                }
                else if (this.table_selectedItem.transport_method == 2) {
                    this.table_selectedItem.transport_method = "自动叉车";
                }
                else {
                    this.table_selectedItem.transport_method = ""
                }*/

                if (this.table_selectedItem.fromGetted){
                    this.mod_rightDisplay.push( this.table_selectedItem);
                    console.log(" this.mod_rightDisplay111------");
                    console.log( this.mod_rightDisplay);
                }
                else
                {
                    this.mod_rightDisplay.push({
                        parts_name: this.table_selectedItem.tool_define_name,
                        parts_type: this.table_selectedItem.tool_define_type,
                        parts_unit: this.table_selectedItem.uom,
                        transport: this.table_selectedItem.transport_method,
                        id:this.table_selectedItem.id,
                        fromGetted: false
                    });
                }
                ;
                console.log(" this.mod_rightDisplay222------");
                console.log( this.mod_rightDisplay);
                this.$emit("sparePartsSetected", this.mod_rightDisplay);
                setTimeout(function () {
                    document.getElementById('scrollDiv1').scrollTop = document.getElementById('scrollDiv1').scrollHeight;
                }, 100);

            },
            deleteItemReview(item){
                this.mod_rightDisplay.splice(item, 1);
            },
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
        },
        mounted () {
//       alert(this.modelId);
//              alert(this.manufacturer);
//            if(this.canSearch=="cansearch"){
//                this.getEquipmnet(0);
//            }
//            else{
//            };
            this.getEquipmnet(0);
        },
        watch: {
            canSearch: function () {
                if (this.canSearch == "cansearch") {
                    this.getEquipmnet(0);
                }
                else {
                }
                ;
            },
            mod_rightDisplay: function () {
                this.selectedNum = this.mod_rightDisplay.length;
            },


        },
    }
</script>


