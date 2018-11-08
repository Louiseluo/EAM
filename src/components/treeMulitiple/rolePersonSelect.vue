<!--角色多选：-->
<template class="mettingAdd">
    <div class="basic fault-content">
        <div class="form-content">
            <div class="meetingManage_form pad-0">
                <Form label-position="right" inline :label-width="100">
                    <FormItem label="姓名">
                        <Input v-model="personName" class="form_input"></Input>
                    </FormItem>
                    <FormItem label="" :label-width="50">
                        <div>
                            <Button type="primary" class="buttonsDesign" @click="changePage(1)" :current="pageCurrent">
                                查询
                            </Button>
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
                        <th>角色名称</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(item, index) in   tableDatas" :key="item.id" class="pointDis trDisplay"
                        @click="toSelectItem(index)">
                        <td>{{index + 1}}</td>
                        <td class="tdDisplay pointDis" :title="item.name">{{item.name}}</td>
                    </tr>
                    </tbody>
                </table>
                <!--<div class="tableHasNoData" v-show="!tableDatas[0]"><p>暂无备件可以选择，您可以切换左侧备件类型试试~</p></div>-->
                <div class="pageItem" align="right">
                    <Page :total="personTotal" :current="pageCurrent" size="small" show-elevator :page-size="6"
                          @on-change="changePage"></Page>
                </div>
                </Col>
                <Col :span="8" class="pad-l-10">
                <div id="scrollDiv1" class="personScro">
                    <p>已选择：{{selectedNum}}</p>
                    <div calss="addPerson_right mar-top-3" v-for="(select, index) in mod_rightDisplay"
                         onmousemove="this.style.background='#EEEEEE';this.style.color='';"
                         onmouseout="this.style.background='#FFFFFF'">
                        <span disabled="true" class="selectedPerson_dis">{{select.name}}</span>
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
        props: ['mod_rightDisplay',"roleIds"],
        data () {
            return {
                personName: "",//角色名称模糊搜索
                baseData: [],
                tableDatas: [],
                personTotal: 0,
                locationId: '',
                pageCurrent: 1,
//                mod_rightDisplay:[],
                selectedNum: "0",
                scrollDivTo: "",
            }
        },
        methods: {
            getpersons(currentPage){
                let vt = this;
                this.$axios.post('/common/role/persons', {
                    page: vt.pageCurrent,
                    pageSize: 6,
                    name: vt.personName,
                    roleIds:vt.roleIds
                }).then((res) => {
                    let code = res.data.response.code;
                    let data = res.data.response.data;
                    if (code == 1) {
                        vt.personTotal = data.Total;
                        vt.tableDatas = data.Rows;
                    }
                    else {
                        vt.$Message.error(res.data.response.msg);
                    }
                    ;
                }).catch((err) => {
                });
            },
            /*分页*/
            changePage(currentPage) {
                console.log("currentPage+" + currentPage)
                this.pageCurrent = currentPage;
                this.getpersons();
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

                this.$emit("rolesPerSetected", this.mod_rightDisplay);
                setTimeout(function () {
                    document.getElementById('scrollDiv1').scrollTop = document.getElementById('scrollDiv1').scrollHeight;
                }, 100);
            },
            deleteItemReview(item){
                this.mod_rightDisplay.splice(item, 1);
            },
        },
        mounted () {
            this.getpersons(0);
            console.log("roleIds----->");
            console.log(this.roleIds);
        },
        watch: {
            mod_rightDisplay: function () {
                this.selectedNum = this.mod_rightDisplay.length;
            },
            roleIds: function () {
                this.getpersons(0);
            },
        },
    }
</script>


