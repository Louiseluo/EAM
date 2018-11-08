<template class="mettingAdd">
    <div class="basic fault-content">
        <div class="form-content">
            <div class="meetingManage_form pad-0">
                <Form label-position="right" inline :label-width="100">
                    <FormItem label="备件名称">
                        <Input  v-model="searchName" class="form_input"></Input>
                    </FormItem>

                    <FormItem label="" :label-width="50">
                        <div>
                            <Button type="primary" class="buttonsDesign" @click=" changeEquipment(1)" :current="tpmsbCurrent">查询</Button>
                        </div>
                    </FormItem>
                </Form>
            </div>
            <Row class="addPersonRow">

                <Col :span="15" class="pad-r-10" style="margin-right:2%;">
                <table class="table table-bordered table-center table-striped table-blue taDisplay">
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
                </table>

                <!--<div class="tableHasNoData" v-show="!tableDatas[0]"><p>暂无备件可以选择，您可以切换左侧备件类型试试~</p></div>-->
                <div class="pageItem" align="right">
                    <Page :total="tpmsbTotal" :current="tpmsbCurrent" size="small" show-elevator :page-size="10"
                          @on-change="changeEquipment"></Page>
                </div>
                </Col>
                <Col :span="8" class="pad-l-10">
                <div id="scrollDiv1" class="personScro" style="height:400px;">
                    <p>已选择：{{selectedNum}}</p>
                    <div calss="addPerson_right mar-top-3" v-for="(select, index) in mod_rightDisplay"
                         onmousemove="this.style.background='#EEEEEE';this.style.color='';"
                         onmouseout="this.style.background='#FFFFFF'">
                        <span disabled="true" class="selectedPerson_dis">{{select.parts_name}}</span>
                        <span @click="deleteItemReview(index)" class="personRevierDet">
                            <Icon type="ios-close"></Icon></span>
                    </div>
                </div>
                </Col>
            </Row>

        </div>
    </div>
</template>

<script>
    export default {
        props: ['mod_rightDisplay', 'canSearch'],
        data () {
            return {
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
//                alert(vt.modelId);
//                alert(vt.manufacturer);
                this.$axios.post('eamSparePart/initToolDefined', {
                    page: vt.tpmsbCurrent,
                    pageSize: "10",
                    sparePartName:vt.searchName,
                    sparePartTypeId: "",
                    linkEquipmentName: "",
                    transportMethod:"",
                }).then((res) => {
//                    alert("查询");
                    if (res.data.response.code === 1) {
                        let dataRes = res.data.response.data;
                        vt.tpmsbTotal = dataRes.Total;
                        vt.tableDatas = dataRes.rows;

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
            toSelectItem(table_selectedItem) {
                if (table_selectedItem == "[]") {
                    return
                }
                ;
                this.table_selectedItem = this.tableDatas[table_selectedItem];

                for (var i = 0; i < this.mod_rightDisplay.length; i++) {
                    if (this.mod_rightDisplay[i].id == this.table_selectedItem.id) {
                        return
                    }
                    ;
                }

                if (this.table_selectedItem.transport_method == 0) {
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
                }
                ;
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


