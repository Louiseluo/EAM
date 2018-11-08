<template class="mettingAdd">
    <div class="basic fault-content" style="padding: 0;">
        <div class="form-content">
            <Form inline :label-width="100" >
                <Form-item label="人员名称" prop="staffName">
                    <Input v-model="staffName" @on-blur="staffName=toValidate(staffName)" ></Input>
                </Form-item>
                <!--<Form-item label="人员部门" prop="equ_name">
                    <Input v-model="equ_name" @on-blur="equ_name=toValidate(equ_name)"></Input>
                </Form-item>-->
            </Form>
            <!--查询按钮-->
            <div style="text-align: right;padding-right: 20px">
                <Button type="primary" icon="search" size="large" @click="getEquipmnet(1)">查询</Button>
            </div>
        </div>
        <Row class="addPersonRow">
            <Col :span="15" class="pad-r-10" style="margin-right:2%;">
            <table class="table table-bordered table-center table-striped table-blue taDisplay">
                <thead>
                <tr>
                    <th>序号</th>
                    <th>人员名称</th>
                    <th>卡号</th>
                    <th>岗位</th>
                    <th>班组</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item, index) in tableDatas" :key="item.personId" class="pointDis trDisplay" @click="toSelectItem(index)">
                    <td>{{index + 1}}</td>
                    <td class="tdDisplay pointDis" :title="item.personName">{{item.personName}}</td>
                    <td class="tdDisplay pointDis" :title="item.personCardNo">{{item.personCardNo}}</td>
                    <td class="tdDisplay pointDis" :title="item.positionName">{{item.positionName}}</td>
                    <td class="tdDisplay pointDis" :title="item.teamName">{{item.teamName}}</td>
                </tr>
                </tbody>
            </table>
            <!--<div class="tableHasNoData" v-show="!tableDatas[0]"><p>暂无备件可以选择，您可以切换左侧备件类型试试~</p></div>-->
            <div class="pageItem" align="right">
                <Page :total="tpmsbTotal" :current="tpmsbCurrent" size="small" show-elevator :page-size="5" @on-change="changeEquipment"></Page>
            </div>
            </Col>
            <Col :span="8" class="pad-l-10">
            <div id="scrollDiv1" class="personScro">
                <p>已选择：{{selectedNum}}</p>
                <div calss="addPerson_right mar-top-3" v-for="(select, index) in mod_rightDisplay"
                     onmousemove="this.style.background='#EEEEEE';this.style.color='';"
                     onmouseout="this.style.background='#FFFFFF'">
                    <span disabled="true" class="selectedPerson_dis">{{select.personName}}</span>
                    <span @click="deleteItemReview(index)" class="personRevierDet"><Icon type="ios-close"></Icon></span>
                </div>
            </div>
            </Col>
        </Row>
    </div>
</template>

<script>
    export default {
        props: [ 'mod_rightDisplay','orderId'],
        data () {
            return {
                staffName:'',
                equ_name:'',
                tableDatas:[],
                tpmsbTotal: 0,
                locationId: '',
                tpmsbCurrent: 1,
                selectedNum: "0",
                scrollDivTo: "",
                table_selectedItem:[],
            }
        },
        methods: {
            //渲染备品备件树：
            getEquipmnet(currentPage){
                let vm = this;
                let flg = false;
                if (currentPage == undefined) {
                    currentPage = 1;
                }
                if (currentPage == 0) {
                    flg = true;
                    currentPage = 1;
                }
                let vt=this;
                this.$axios.post('/eamDo/orderOperatorList', {
                    page: currentPage,
                    pageSize:5,
                    name :this.staffName,
                    orderId:this.orderId
                }).then((res) => {
                    if (res.data.response.code === 1) {
//                        console.log("res person +" + JSON.stringify(res))
                        let dataRes = res.data.response.data;
                        vm.tpmsbTotal = dataRes.total;
//                        vm.tableDatas = dataRes.rows;
                        vm.tableDatas = [];
                        for(let i = 0;i <dataRes.rows.length; i++){
                            vm.tableDatas.push({
                                personId: dataRes.rows[i].id,
                                personName: dataRes.rows[i].name,
                                personCode: dataRes.rows[i].code,
                                personCardNo: dataRes.rows[i].cardNo,
                                positionName: dataRes.rows[i].position,
                                teamName: dataRes.rows[i].productionTeam,
                                kpiRatio:'',
                                orderCount: dataRes.rows[i].orderCount,
                                repairOrderCount: dataRes.rows[i].repairOrderCount,
                                note: dataRes.rows[i].note
                            })
                        }
                        if (flg) {
                            vm.tpmsbCurrent = 1;
                        }
                    }else {
                        vm.tableDatas=[];
                        vm.tpmsbTotal=0;
                        vt.$Message.error(res.data.response.msg);

                    }
                }).catch((err) => {
                    console.log(err);
                });
            },
            /*分页*/
            changeEquipment(currentPage) {
                this.tpmsbCurrent = currentPage;
                this.getEquipmnet(currentPage);
            },
            toSelectItem(index) {
                if (this.tableDatas == "[]") {
                    return
                };
                this.table_selectedItem = this.tableDatas[index];
                for (let i = 0; i < this.mod_rightDisplay.length; i++) {
                    if (this.mod_rightDisplay[i].personId == this.table_selectedItem.personId) {
                        return
                    };
                };
                this.mod_rightDisplay.push(this.table_selectedItem);


                this.$emit("sparePartsSetected", this.mod_rightDisplay);
                setTimeout(function () {
                    document.getElementById('scrollDiv1').scrollTop = document.getElementById('scrollDiv1').scrollHeight;
                }, 100);
            },
            deleteItemReview(item){
                this.mod_rightDisplay.splice(item, 1);
            },
            //查询时验证输入框不能为英文单双引号
            toValidate(msg) {
                var str = /[=+%!<>"'/_,()\\]/;
                if (str.test(msg)) {
                    this.$Message.warning("输入格式错误");
                    msg = msg.replace(/\'/g,"").replace(/\"/g,"").replace(/\+/g,"").replace(/\=/g,"").replace(/\%/g,"").replace(/\!/g,"").replace(/\</g,"").replace(/\>/g,"").replace(/\//g,"").replace(/\_/g,"").replace(/\,/g,"").replace(/\(/g,"").replace(/\)/g,"").replace(/\\/g,"");
                }
                return msg;
            }
        },
        mounted () {
            this.getEquipmnet(0);
        },
        watch: {
            mod_rightDisplay: function () {
                this.selectedNum = this.mod_rightDisplay.length;
            },
        },
    }
</script>


