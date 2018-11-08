<template class="mettingAdd">
    <div class="basic fault-content">
        <div class="form-content">
            <div class="meetingManage_form pad-0">
                <Form label-position="right" inline :label-width="100">
                    <FormItem label="仓库名称">
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

                <Col :span="5" class="pad-r-10" style="margin-right:2%;">
                <Table stripe border highlight-row :columns="warehouseColumn" :data="warehouseData" @on-row-click="selectWarehouse"></Table>
                </Col>
                <Col :span="10" class="pad-r-10" style="margin-right:2%;">
                <table class="table table-bordered table-center table-striped table-blue taDisplay">
                    <thead>
                    <tr>
                        <th>序号</th>
                        <th>备件名称</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(item, index) in sparepartData" :key="item.sparePartId" class="pointDis trDisplay"
                        @click="selectSpareparts(index)">
                        <td>{{index + 1}}</td>
                        <td class="tdDisplay pointDis" :title="item.Name">{{item.Name}}</td>
                    </tr>
                    </tbody>
                </table>
                <div class="pageItem" align="right">
                    <Page :total="tpmsbTotal" :current="tpmsbCurrent" size="small" show-elevator :page-size="10"
                          @on-change="changeSpareparts"></Page>
                </div>
                </Col>
                <Col :span="8" class="pad-l-10">
                <div id="scrollDiv1" class="personScro" style="height:400px;">
                    <p>已选择：{{selectedNum}}</p>
                    <div class="addPerson_right mar-top-3"  v-for="(select, index) in mod_rightDisplay"
                         onmousemove="this.style.background='#EEEEEE';this.style.color='';"
                         onmouseout="this.style.background='#FFFFFF'">
                        <span disabled="true" class="selectedPerson_dis">{{select.Name}}</span>
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
        props: ['warehouse_data', 'mod_rightDisplay'],
        data () {
            return {
                warehouseColumn: [
                    {
                        title:'序号',
                        type: 'index',
                        width: 80,
                        align: 'center'
                    },
                    {
                        title:'仓库名称',
                        key: 'tBdWarehouseName',
                        align: 'left'
                    }
                ],
                warehouseData: [],
                sparepartCol: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 80,
                        align: 'center'
                    },
                    {
                        title:'备件名称',
                        key: 'Name',
                        align: 'left'
                    }
                ],
                sparepartData: [],
                tpmsbTotal: 0,
                tpmsbCurrent: 1,
                selectedNum: 0,
                scrollDivTo: "",
                searchName:"",
                selectedId: '', //选中的仓库id
                table_selectedItem: {}
            }
        },
        methods: {
            //仓库名称下拉数据
            initWarehouse(name){
                let vm = this;
                this.$axios.get('/System/warehouseMagnifier', {
                    params: {
                        warehouseName: name
                    }
                }).then((res) => {
                    if (res.data.response.code === 1) {
                        let dataRes = res.data.response.data;
                        vm.tpmsbTotal = dataRes.Total;
                        vm.warehouseData = dataRes.Rows;
//                        console.log('ware222 == '+JSON.stringify(vm.warehouseData))
                    }else {
                        vm.warehouseData=[];
                        vm.tpmsbTotal=0;
                        vt.$Message.error(res.data.response.msg);
                    }
                }).catch((err) => {
                    console.log(err);
                });
            },
            //单击一行选中
            selectWarehouse(row) {
                if (this.warehouseData == "[]") {
                    return
                }
//                console.log('row == '+JSON.stringify(row));
                this.selectedId = row.tBdWarehouseId;
//               console.log('id == '+this.selectedId);
               this.getSpareParts(this.tpmsbCurrent,10,this.selectedId);
               this.warehouse_data.push({
                   code: row.tBdWarehouseCode,
                   id: row.tBdWarehouseId,
                   name: row.tBdWarehouseName,
                   location: row.tBdWarehouseLocation
               });
               this.$emit("warehouseSetected", this.warehouse_data);
            },

            //备品备件列表：
            getSpareParts(page,pageSize,id){
                let vm = this;
                this.$axios.post('/eamDo/getSparePartByWarehouse', {
                    page: page,
                    pageSize: pageSize,
                    warehouseId: id
                }).then((res) => {
                    if (res.data.response.code === 1) {
                        let dataRes = res.data.response.data;
//                        console.log('dataRes == '+JSON.stringify(res))
                        vm.sparepartData = dataRes.rows;
                        vm.tpmsbTotal = dataRes.count;
                    }else {
                        vm.sparepartData=[];
                        vm.$Message.error(res.data.response.msg);
                    }
                }).catch((err) => {
                    console.log(err);
                });
            },
            changeSpareparts(currentPage) {
                this.tpmsbCurrent = currentPage;
                this.getSpareParts(currentPage, 10, this.selectedId);
            },
            //选择备品备件
            selectSpareparts(table_selectedItem){
                if (table_selectedItem == "[]") {
                    return
                }
                this.table_selectedItem = this.sparepartData[table_selectedItem];
//                console.log('111 == '+this.mod_rightDisplay)
                for (var i = 0; i < this.mod_rightDisplay.length; i++) {
                    if (this.mod_rightDisplay[i].sparePartId == this.table_selectedItem.sparePartId) {
                        return
                    }
                }
                this.mod_rightDisplay.push(this.table_selectedItem);
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
            this.initWarehouse(this.searchName);
        },
        watch: {
            mod_rightDisplay: function () {
                this.selectedNum = this.mod_rightDisplay.length;
            },
        },
    }
</script>


