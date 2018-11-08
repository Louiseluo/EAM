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
                      @on-select-change="left_personSelected" class="max-h-300"></Tree>
                </Col>
                <Col :span="12" class="pad-l-10">
                <div id="scrollDiv" class="personScro">
                    <p style="color:#393737">已选择：{{selectedNum}}</p>
                    <div class="addPerson_right mar-top-1" v-for="(select, index) in mod_rightDisplay"
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
        props: ['mod_rightDisplay'],
        data () {
            return {
                baseData:[],
                //已选人员的个数：
                selectedNum: 0,
                //会议新增页面显示已选与会人员：
                meetingPersons: '',
                scrollDivTo: "",
            }

        },
        methods: {
            //设备地点完整树
            get_equSite(){
                let vt = this;
                this.$axios.get('/common/location/tree', {
                    params: {
                        standardSolutionVersionId: "",
                    }
                }).then((res) => {
                    let result = res.data.response;
//                    console.log('一级树 ===== ')
//                    console.log(JSON.stringify(result))
                    if (result.code != 1) {
                        vt.$Message.error(result.msg);
                    } else {
                        vt.baseData = result.data;
                    }
                }).catch((err) => {
                    console.log(err)
                });
            },
            left_personSelected (left_node){
                if (JSON.stringify(left_node) == "[]") {
                    return
                }
                if (left_node[0] && left_node[0].children) {
                    left_node[0].expand = !left_node[0].expand;
                    left_node[0].selected = false;
                }
                else {
                    for (var i = 0; i < this.mod_rightDisplay.length; i++) {
                        if (left_node[0].equipmentId == this.mod_rightDisplay[i].equipmentId) {
                            return;
                        }
                    }
                    let vt = this;
                    this.$axios.get('/plan/getLcationType', {
                        params: {
                            locationId: left_node[0].id,
                        }
                    }).then((response) => {
                        let code = response.data.response.code;
//                        console.log('二级树 ===== ')
//                        console.log(JSON.stringify(response.data.response))
                        if (code != 1) {
                            vt.$Message.error(response.data.response.msg);
                        }
                        else {
                            let type = response.data.response.data.type;
                            if (type == 5) {
                                //有关联设备，可以添加
                                let locationType = response.data.response;
//                                console.log('left_node[0] ==== '+JSON.stringify(left_node[0]))
                                //检查重复性
                                this.$axios.post('plan3/eamPlanEupChoice', {
                                    eupIds: left_node[0].equipmentId
                                }).then((res) => {
//                                    console.log('检查设备的重复性 ==== ');
//                                    console.log(JSON.stringify(res));
                                    let ret = res.data.response;
                                    if (ret.code == 1) {
                                        this.mod_rightDisplay.push(left_node[0]);
                                        this.$emit("queSetected", this.mod_rightDisplay, locationType);
                                        setTimeout(function () {
                                            document.getElementById('scrollDiv').scrollTop = document.getElementById('scrollDiv').scrollHeight;
                                        }, 100);
                                    } else {
                                        this.$Message.error(ret.msg);
                                    }
                                }).catch((err) => {
                                    console.log(err)
                                })
                            } else {
                                this.$Message.warning('此地点没有关联设备，请选择其它地点！')
                            }

                        }
                    }).catch((err) => {
                        console.log(err)
                    });
                }
            },
            //移除：
            deleteItem(item){
                this.mod_rightDisplay.splice(item,1);
            },
        },
        mounted() {
            this.get_equSite();
        },
        watch: {
            mod_rightDisplay: function () {
                this.selectedNum = this.mod_rightDisplay.length;
            }
        }
    }
</script>


