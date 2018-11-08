<template>
    <Row>
        <Col :span="6" class="pad-r-10">
        <div class="pad-5-20 bg-linegary">地点名称</div>
        <Tree :data="baseData" show-checkbox :multiple="false" :show-checkbox="false" @on-select-change="getLocationId" class="max-h-300"></Tree>
        </Col>
        <Col :span="18" class="pad-l-10">
        <table class="table table-bordered table-center table-striped table-blue">
            <thead>
            <tr>
                <th>选择</th>
                <th>序号</th>
                <th>设备编码</th>
                <th>设备名称</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(sb, index) in tpmsbChild">
                <td>
                    <div v-html="sb.radio"></div>
                </td>
                <td>{{index + 1}}</td>
                <td>{{sb.equipmentCode}}</td>
                <td>{{sb.equipmentName}}</td>
            </tr>
            </tbody>
        </table>
        <div class="mar-t-10" style="overflow: hidden">
            <div style="float: right;">
                <Page :total="tpmsbTotal" :current="tpmsbCurrent" size="small" show-elevator :page-size="5" @on-change="changeEquipment"></Page>
            </div>
        </div>
        </Col>
    </Row>
</template>

<script type="text/ecmascript-6">
    export default {
        data (){
            return {
                baseData: [],
                /*设备放大镜*/
                tpmsbChild: [],
                tpmsbTotal: 0,
                locationId: '',
                tpmsbCurrent: 1,
            }
        },
        mounted(){
            this.getLocationTree();
        },
        methods: {
            /************************************* 适用设备 start *********************************************************** */
            /*初始化地点得树结构*/
            getLocationTree: function () {
                let vm = this;
                this.$axios.get("/eamStandardSolution/getTooTypeTree").then(function (response) {
                    var object = response.data.response.data;
                    vm.baseData = object;
//                    console.log("baseData + " + JSON.stringify(object))
                });
            },
            /*点击树节点得分子节点 通过树节点ID  获取设备*/
            getLocationId (node){
                if (node[0]) {
//                    console.log("Location名称是 +"+ JSON.stringify(node[0]))
//                    console.log("Location名称是" + node[0].title + "-----" + "对应的id--是" + node[0].id);
                    this.locationId = node[0].id;
                    this.getEquipmnet(0, this.locationId);
                }
            },
            /*table页面获取选中行的数据*/

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
                    pageSize:5,
                    toolTypeId:locationId,
                }).then((res) => {
                    if (res.data.response.code === 1) {
                        let dataRes = res.data.response.data;
                        vm.tpmsbTotal = dataRes.total;
                        vm.tpmsbChild = new Array();
//                        console.log("dataRes.dates + " + JSON.stringify(dataRes.dates))
//                        console.log("dataRes.dates + " + JSON.stringify(dataRes.total))
                        for (let o in dataRes.dates) {
                            if(o != "unique") {
                                let obj = {};
                                obj["equipmentId"] = dataRes.dates[o].toolDefineId;
                                obj["equipmentCode"] = dataRes.dates[o].toolDefineCode;
                                obj["equipmentName"] = dataRes.dates[o].toolDefineName;
                                obj["radio"] = "<input type='radio' name='tpmsb_radio' value='" + dataRes.dates[o].toolDefineId + "'>";
                                vm.tpmsbChild.push(obj);
                            }
                        }
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
            changeEquipment: function (currentPage) {
                console.log("currentPage+" + currentPage)
                this.tpmsbCurrent = currentPage;
                this.getEquipmnet(currentPage, this.locationId);
            }
            /************************************* 适用设备 end *********************************************************** */
        }
    }
</script>

<style type="text/css">

</style>