<!--设备型号弹出框：-->
<template>
    <div class="basic fault-content">
        <div class="form-content">
            <div class="meetingManage_form pad-0">
                <Form label-position="right" inline :label-width="100">
                    <FormItem label="人员名称">
                        <Input v-model="person_name" class="form_input"></Input>
                    </FormItem>

                    <FormItem label="" :label-width="50">
                        <div>
                            <Button type="primary" class="buttonsDesign" @click="searchList">
                                查询
                            </Button>
                        </div>
                    </FormItem>
                </Form>
            </div>

            <Row class="addPersonRow">

                <Col :span="15" class="pad-r-10" style="margin-right:2%;">
                <table class="table table-bordered table-center table-striped table-blue table-edit typedevice typeTable taDisplay">
                    <thead>
                    <tr>
                        <!--<th>选择</th>-->
                        <th>序号</th>
                        <th>人员姓名</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(item,index) in equTypes" class="trDisplay" @click="toSelect(index)">
                        <!--<td><input type="radio" name='checked_radio' class="checkInput_problem" @click="toSelect(index)" /></td>-->
                        <td>{{index + 1}}</td>
                        <td class="tdDisplay pointDis" :title="item.personName">{{item.personName}}</td>
                    </tr>
                    </tbody>
                </table>
                <!--<div class="tableHasNoData" v-show="!tableDatas[0]"><p>暂无备件可以选择，您可以切换左侧备件类型试试~</p></div>-->
                <div class="pageItem" align="right">
                    <Page size="small" :total="totalNum" show-elevator :page-size="5" :current="typePage" @on-change="pageChange"></Page>
                </div>
                </Col>
                <Col :span="8" class="pad-l-10">
                <div id="scrollDiv1" class="personScro">
                    <p>已选择：{{rightDisplay.length}}</p>
                    <div calss="addPerson_right mar-top-3" v-for="(select, index) in rightDisplay"
                         onmousemove="this.style.background='#EEEEEE';this.style.color='';"
                         onmouseout="this.style.background='#FFFFFF'">
                        <span disabled="true">{{select.personName}}</span>
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
        //树图：
        props: ['rightDisplay'],
        data () {
            return {
                totalNum: 0,
                person_name: '',
                equTypes: [],
                typePage: 1,
//                rightDisplay:[],
            }
        },
        methods: {
            //设备型号查询：
            getEqu_type(){
                this.$axios.get('/System/bdSelect',{params:{page:this.typePage,pageSize:5,person_name: this.person_name}}).then((res) => {
                    var ret = res.data.response
//                    console.log(ret)
//                    console.log('人员信息表数据')
                    if (ret.code == 1) {
                        this.equTypes= ret.data.Rows;
                        this.totalNum = ret.data.Total;
                        $(".typeTable").find("input[type='radio']:checked").prop('checked', false);
                    };

                }).catch((err) => {
                    console.log(err);
                });
            },
            pageChange(page){
                this.typePage = page;
                this.getEqu_type();
            },
            toSelect(index){
                for (var i = 0; i < this.rightDisplay.length; i++) {
                    if (this.rightDisplay[i].personId == this.equTypes[index].personId) {
                        return
                    }
                    ;
                }
                ;
                this.rightDisplay.push(this.equTypes[index]);

                this.$emit("typeSelected", this.rightDisplay);
            },
            deleteItemReview(item){
                this.rightDisplay.splice(item, 1);
            },
            searchList(){
                this.typePage = 1;
                this.getEqu_type();
            },
        },
        mounted () {
            this.getEqu_type();
        },

    }
</script>


