<template class="mettingAdd">
    <div class="basic fault-content">
        <div class="form-content">
            <div class="meetingManage_form pad-0">
                <Form label-position="right" inline :label-width="100">
                    <FormItem label="备件名称">
                        <!--<Input  v-model="searchName"  class="form_input"></Input>-->
                        <Input  v-model="searchName" @on-blur="searchName = toValidate(searchName)" class="form_input"></Input>

                    </FormItem>

                    <FormItem label="" :label-width="50">
                        <div>
                            <Button type="primary" class="buttonsDesign" @click=" changeEquipment(1)" :current="tpmsbCurrent">查询</Button>
                        </div>
                    </FormItem>
                </Form>
            </div>
            <Row class="addPersonRow">
                <Col :span="4" class="pad-r-10" style="margin-right:2%;">
                <Tree :data="baseData" show-checkbox :multiple="false" :show-checkbox="false" @on-select-change="getLocationId" class="max-h-300"></Tree>

                <!--<div class="tableHasNoData" v-show="!tableDatas[0]"><p>暂无备件可以选择，您可以切换左侧备件类型试试~</p></div>-->
                </Col>
                <Col :span="13" class="pad-r-10" style="margin-right:2%;">
                <!--<table class="table table-bordered table-center table-striped table-blue taDisplay">
                    <thead>
                    <tr>
                        <th>序号</th>
                        <th>备件名称</th>
                        <th>备件分类</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(item, index) in   tableDatas" :key="item.id" class="pointDis trDisplay" @click="toSelectItem(index)">
                        <td>{{index + 1}}</td>
                        <td class="tdDisplay pointDis" :title="item.tool_define_name ? item.tool_define_name : itemtoolDefineName">{{item.tool_define_name ? item.tool_define_name : itemtoolDefineName}}</td>
                        <td class="tdDisplay pointDis" :title="item.tool_type_name">{{item.tool_type_name}}</td>
                    </tr>
                    </tbody>
                </table>-->
                <Table  border ref="currentRowTable" class="taDisplay" :columns="repairColumns" :data="tableDatas" @on-row-click="toSelectItem"></Table>

                <!--<div class="tableHasNoData" v-show="!tableDatas[0]"><p>暂无备件可以选择，您可以切换左侧备件类型试试~</p></div>-->
                <div class="pageItem" align="right">
                    <Page :total="tpmsbTotal" :current="tpmsbCurrent" size="small" show-elevator :page-size="this.pageSize" @on-change="changeEquipment"></Page>
                </div>
                </Col>
                <Col :span="6" class="pad-l-10">
                <div id="scrollDiv1" class="personScro" style="height:400px;">
                    <p>已选择：{{selectedNum}}</p>
                    <div calss="addPerson_right mar-top-3" v-for="(select, index) in mod_rightDisplay"
                         onmousemove="this.style.background='#EEEEEE';this.style.color='';"
                         onmouseout="this.style.background='#FFFFFF'">
                        <span disabled="true" class="selectedPerson_dis">{{select.partName}}</span>
                        <span @click="deleteItemReview(index)" class="personRevierDet" v-show="!select.fromSys">
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
                repairColumns:[
                    {
                        title:'序号',
                        type: 'index',
                        width: 120,
                        align: 'center'
                    },
                    {
                        title: '备件名称',
                        key: 'spName',
                        align:'center',
                        render:(h,params) => {
                            return h('p',{
                                domProps:{
                                    title:params.row.spName,
                                },
                                class:'iview_tabDis'
                            },params.row.spName)
                        }
                    },
                    {
                        title: '备件分类',
                        key: 'spType',
                        align:'center',
                        render:(h,params) => {
                            return h('p',{
                                domProps:{
                                    title:params.row.spType,
                                },
                                class:'iview_tabDis'
                            },params.row.spType)
                        }
                    },
                ],
                tableDatas: [],
                pageSize:10,
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
            toValidate(msg){
                var str = /[=+%!<>"'/_,()\\]/
                if(str.test(msg)){
                    this.$Message.warning('输入格式错误')
                    msg = msg.replace(/\'/g,"").replace(/\"/g,"").replace(/\+/g,"").replace(/\=/g,"").replace(/\%/g,"").replace(/\!/g,"").replace(/\</g,"").replace(/\>/g,"").replace(/\//g,"").replace(/\_/g,"").replace(/\,/g,"").replace(/\(/g,"").replace(/\)/g,"").replace(/\\/g,"");
                }
                return msg
            },

            //渲染备品备件树：
            getSparePartsTree: function () {
                let vm = this;
                this.$axios.get("/eamSparePart/getTooTypeTree").then(function (response) {
                    vm.baseData = response.data.response.data;
                    vm.baseData[0].expand = true;
                });
            },
            /*点击树节点得分子节点 通过树节点ID  获取设备*/
            getLocationId (node){
                if (JSON.stringify(node) == "[]") {
                    return
                };
                if (node[0].children[0]) {
                    node[0].expand = !node[0].expand;
                    node[0].selected = false;
                }
                if (node[0] && !node[0].children[0]) {
                    this.locationId = node[0].id;
                    this.getEquipmnet();
                }
            },
            getEquipmnet(){
                let vt = this;
                this.$axios.get('/eamDo/getSpLikeName', {
                    params:{
                        page: vt.tpmsbCurrent,
                        pageSize: vt.pageSize,
                        spName:vt.searchName,
                        spTypeId:vt.locationId ,
                    }
                }).then((res) => {
                    if (res.data.response.code === 1) {
                        let dataRes = res.data.response.data;
                        vt.tpmsbTotal = dataRes.total;
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
            toSelectItem(selectedItem) {
                if (selectedItem == "[]") {
                    return
                };

                for (var i = 0; i < this.mod_rightDisplay.length; i++) {
                    if (this.mod_rightDisplay[i].part_id == selectedItem.spId) {
                        return
                    };
                }
                if (selectedItem.fromGetted){
                    this.mod_rightDisplay.push( selectedItem);
                } else {
                    this.mod_rightDisplay.push({
                        partName: selectedItem.spName,
                        partType: selectedItem.spType,
                        partUnit: selectedItem.uomName,
//                        transport: selectedItem.transport_method,
                        part_id:selectedItem.spId,
                        fromGetted: false
                    });
                };
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
            this.getSparePartsTree();
        },
        watch: {
            mod_rightDisplay: function () {
                this.selectedNum = this.mod_rightDisplay.length;
            },


        },
    }
</script>


