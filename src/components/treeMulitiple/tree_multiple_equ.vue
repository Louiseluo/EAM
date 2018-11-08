<template class="mettingAdd">
    <div class="basic fault-content">
        <!--模块名称-->
        <!--<div class="title">-->
        <!--<span>树图选择</span>-->
        <!--</div>-->
        <div class="form-content">
            <!--树图代码：-->
            <Row class="addPersonRow">
                <Col :span="12" class="pad-r-10">
                <Tree :data="baseData" show-checkbox :multiple="false" :show-checkbox="false"
                      @on-select-change="left_personSelected" class="max-h-300" :v-show="!theTip"></Tree>
                <p v-show="theTip" style="color:red">{{theTip}}</p>
                </Col>
                <Col :span="12" class="pad-l-10">
                <div id="scrollDiv" class="personScro">
                    <p style="color:#393737">已选择：{{selectedNum}}</p>
                    <div calss="addPerson_right mar-top-1" v-for="(select, index) in right_display"
                         onmousemove="this.style.background='#EEEEEE';this.style.color='';"
                         onmouseout="this.style.background='#FFFFFF'">
                        <span :disabled="true" class="selectedPerson_dis" style="width:500px;">{{select.title}}</span>
                        <span @click="deleteItem(index)" style="margin-left:1%;">
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
        props: ['baseData', 'right_display', 'state', 'treeTip1'],
        data () {
            return {

                //名称显示：
                treeName: "人员添加",
                theTip: "",
                //人员添加的模态框：
                personAddMod: false,
                //已选人员列表：
//                right_display: [],

                //已选人员的个数：
                selectedNum: "0",
                //会议新增页面显示已选与会人员：
                meetingPersons: '',
                scrollDivTo: "",
            }

        },
        methods: {
            left_personSelected (left_node){

                if (this.state == "viewing") {
                    if (left_node[0] && left_node[0].children) {
                        left_node[0].expand = !left_node[0].expand;
                        left_node[0].selected = false;
                    }
                }
                else {
                    if (JSON.stringify(left_node) == "[]") {
                        return
                    }
                    ;
                    if (left_node[0] && left_node[0].children) {
                        left_node[0].expand = !left_node[0].expand;
                        left_node[0].selected = false;
                    }
                    else {
                        for (var i = 0; i < this.right_display.length; i++) {
                            if (left_node[0].id == this.right_display[i].id) {
                                return;
                            }
                        }
                        let type = left_node[0].type;
                        if (type == 5) {
                            this.right_display.push(left_node[0]);
                            this.$emit("dataSetected", this.right_display);
                            setTimeout(function () {
                                document.getElementById('scrollDiv').scrollTop = document.getElementById('scrollDiv').scrollHeight;
                            }, 100);
                        }
                        /*let vt = this;
                        this.$axios.get('/eamStandardSolution/location/getLcationType', {
                            params: {
                                locationId: left_node[0].id,
                            }
                        }).then((response) => {

                            let code = response.data.response.code;
                            if (code != 1) {
                                vt.$Message.error(response.data.response.msg);

                            }
                            else {
                                let type = response.data.response.data.type;
                                if (type == 5) {
                                    this.right_display.push(left_node[0]);
                                    this.$emit("dataSetected", this.right_display);
                                    setTimeout(function () {
                                        document.getElementById('scrollDiv').scrollTop = document.getElementById('scrollDiv').scrollHeight;
                                    }, 100);
                                }
                            }
                        }).catch((err) => {
                        });*/
                    }
                }

            },
            //移除：
            deleteItem(item){
                if (this.state == "viewing") {
                }
                else {
                    this.right_display.splice(item, 1);
                };

            },
        },
        mounted () {
            if (this.state == "adding") {
                this.theTip = "请选择设备型号和所属供应商！";
            } else {
                this.theTip = ""
            };
        },
        watch: {
            right_display: function () {

                this.selectedNum = this.right_display.length;
            },
            treeTip1: function () {
                this.theTip = this.treeTip1;
            }
        },
    }
</script>


