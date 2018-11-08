<!--角色账户多选：-->
<template class="mettingAdd">
    <div class="basic fault-content">
        <div class="form-content">
            <div class="meetingManage_form pad-0">
                <Form label-position="right" inline :label-width="100">
                    <FormItem label="角色名称">
                        <Input v-model="roleName" class="form_input"></Input>
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
                        <td class="tdDisplay pointDis" :title="item.localName">{{item.localName}}</td>
                    </tr>
                    </tbody>
                </table>
                <!--<div class="tableHasNoData" v-show="!tableDatas[0]"><p>暂无备件可以选择，您可以切换左侧备件类型试试~</p></div>-->
                <div class="pageItem" align="right">
                    <Page :total="roleTotal" :current="pageCurrent" size="small" show-elevator :page-size="6"
                          @on-change="changePage"></Page>
                </div>
                </Col>
                <Col :span="8" class="pad-l-10">
                <div id="scrollDiv1" class="personScro">
                    <p>已选择：{{selectedNum}}</p>
                    <div calss="addPerson_right mar-top-3" v-for="(select, index) in modaccount_rightDisplay"
                         onmousemove="this.style.background='#EEEEEE';this.style.color='';"
                         onmouseout="this.style.background='#FFFFFF'">
                        <span disabled="true" class="selectedPerson_dis">{{select.localName}}</span>
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
        props: ['modaccount_rightDisplay'],
        data () {
            return {
                roleName: "",//角色名称模糊搜索
                baseData: [],
                tableDatas: [],
                roleTotal: 0,
                locationId: '',
                pageCurrent: 1,
//                mod_rightDisplay:[],
                selectedNum: "0",
                scrollDivTo: "",
                ids: '',
            }
        },
        methods: {
            getRoles(currentPage){
                console.log(this.ids)
                let vt = this;
                this.$axios.post('/common/role/users', {
                    page: vt.pageCurrent,
                    pageSize: 5,
                    name: vt.roleName,
                    roleIds:vt.ids
                }).then((res) => {
                    let code = res.data.response.code;
                    let data = res.data.response.data;
                    if (code == 1) {
                        vt.roleTotal = data.Total;
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
                this.getRoles();
            },
            toSelectItem(table_selectedItem) {
                if (table_selectedItem == "[]") {
                    return
                }
                ;
                this.table_selectedItem = this.tableDatas[table_selectedItem];
                for (var i = 0; i < this.modaccount_rightDisplay.length; i++) {
                    if (this.modaccount_rightDisplay[i].id == this.table_selectedItem.id) {
                        return
                    }
                    ;
                }
                ;
                this.modaccount_rightDisplay.push(this.table_selectedItem);

                this.$emit("rolesAccountSetected", this.modaccount_rightDisplay);
                setTimeout(function () {
                    document.getElementById('scrollDiv1').scrollTop = document.getElementById('scrollDiv1').scrollHeight;
                }, 100);
            },
            deleteItemReview(item){
                this.modaccount_rightDisplay.splice(item, 1);
            },
            theMethods(ids){
                this.ids = ids;
                console.log(ids);
                this.getRoles(0);
            }
        },
        mounted () {
            this.theMethods();
        },
        watch: {
            modaccount_rightDisplay: function () {
                this.selectedNum = this.modaccount_rightDisplay.length;
            },
        },
    }
</script>


