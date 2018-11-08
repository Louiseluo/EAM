<template class="mettingAdd">
    <div class="basic fault-content">
        <div class="form-content">
            <Row class="addPersonRow">
                <Col :span="5" class="pad-r-10">
                <Tree :data="baseData" show-checkbox :multiple="false" :show-checkbox="false"
                      @on-select-change="getLocationId" class="max-h-300"></Tree>
                </Col>
                <Col :span="12" class="pad-r-10" style="margin-right:2%;">
                <table class="table table-bordered table-center table-striped table-blue">
                    <thead>
                    <tr>
                        <th>序号</th>
                        <th>设备编码</th>
                        <th>设备名称</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(item, index) in   tableDatas" :key="item.id" class="pointDis"
                        @click="toSelectItem(index)">
                        <td>{{index + 1}}</td>
                        <td>{{item.toolDefineCode}}</td>
                        <td>{{item.toolDefineName}}</td>
                    </tr>
                    </tbody>
                </table>
                <!--<div class="tableHasNoData" v-show="!tableDatas[0]"><p>暂无备件可以选择，您可以切换左侧备件类型试试~</p></div>-->
                <div class="pageItem" align="right">
                    <Page :total="tpmsbTotal" :current="tpmsbCurrent" size="small" show-elevator :page-size="6" @on-change="changeEquipment"></Page>
                </div>
                </Col>
                <Col :span="6" class="pad-l-10">
                <div id="scrollDiv1" class="personScro">
                    <p>已选择：{{selectedNum}}</p>
                    <div calss="addPerson_right mar-top-3" v-for="(select, index) in mod_rightDisplay"
                         onmousemove="this.style.background='#EEEEEE';this.style.color='';"
                         onmouseout="this.style.background='#FFFFFF'">
                        <span disabled="true" class="selectedPerson_dis">{{select.toolDefineName}}</span>
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

        props: [ 'mod_rightDisplay'],
        
        data () {
            return {
                baseData:[],
                tableDatas:[],
                tpmsbTotal: 0,
                locationId: '',
                tpmsbCurrent: 1,
//                mod_rightDisplay:[],
                selectedNum: "0",
                scrollDivTo: "",
            }
        },
        methods: {
            //渲染备品备件树：
            getSparePartsTree: function () {
                let vm = this;
                this.$axios.get("/eamStandardSolution/getTooTypeTree").then(function (response) {
                    vm.baseData=response.data.response.data;;
                });
            },

            /*点击树节点得分子节点 通过树节点ID  获取设备*/
            getLocationId (node){
                if (node[0]) {
                    this.locationId = node[0].id;
                    this.getEquipmnet(0, this.locationId);
                }
            },


            getEquipmnet: function (currentPage, locationId) {
                let vm = this;
                if (locationId == undefined) {
                    locationId = vm.locationId;
                }
                let flg = false;
                if (currentPage == undefined) {
                    currentPage = 1;
                }
                if (currentPage == 0) {
                    flg = true;
                    currentPage = 1;
                }
                this.$axios.post('/eamStandardSolution/getTooDefineByTooTypeId', {
                    page: currentPage,
                    pageSize:6,
                    toolTypeId:locationId,
                }).then((res) => {
                    if (res.data.response.code === 1) {
                        let dataRes = res.data.response.data;
                        vm.tpmsbTotal = dataRes.total;
                        console.log("总数目");
                        console.log(vm.tpmsbTotal);
                        vm.tableDatas=res.data.response.data.dates;
                        if (flg) {
                            vm.tpmsbCurrent = 1;
                        }
                    }else {
                        //.. 业务失败的情况
                        this.$Message.error({
                            content: '数据不合法',
                            duration: 5,
                            closable: true
                        });
                    }
                }).catch((err) => {
                    console.log(err);
                });
            },
            /*分页*/
            changeEquipment(currentPage) {
                console.log("currentPage+" + currentPage)
                this.tpmsbCurrent = currentPage;
                this.getEquipmnet(currentPage, this.locationId);
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
                    ;
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
            this.getSparePartsTree();
        },
        watch: {
            mod_rightDisplay: function () {
                this.selectedNum = this.mod_rightDisplay.length;
            }
        },
    }
</script>


