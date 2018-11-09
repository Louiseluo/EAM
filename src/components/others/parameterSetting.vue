<template>
    <div class="basic parameter-setting-basic bzzy-change">
        <Tabs type="card">
            <Tab-pane class="checkTab" label="基础数据自动同步变量" icon="social-buffer">
                <span class="parameter-setting-title">自动同步时间</span>
                <div class="parameter-setting-slider-box slider-box">
                    <Slider v-model="autoValue" :step="10" :max="3600" show-input show-stops></Slider>
                    <div class="mar-t-10" style="margin-top: 10px;">
                        <Button type="primary" disabled icon="plus-round" size="small" @click="saveAutoValue()">保存</Button>
                        <Button type="public" disabled icon="plus-round" size="small" @click="saveAutoValue()">保存</Button>
                    </div>
                </div>
            </Tab-pane>
            <!--<Tab-pane class="checkTab" label="功能节点敏感词配置" icon="social-buffer">-->
                <!--<div style="margin-left: 10px;">-->
                    <!--<div class="left-box">-->
                        <!--<span class="title">功能节点</span>-->
                        <!--<Tree :data="baseData.functionTree"></Tree>-->
                    <!--</div>-->
                    <!--<div class="right-box">-->
                        <!--<span class="title">数据域列表</span>-->
                        <!--<Table ref="selection" :columns="dataFieldColumns" :data="baseData.dataFieldList"></Table>-->
                        <!--<div class="mar-t-10" style="margin-left: 10px;">-->
                            <!--<Button type="primary" icon="plus-round" size="small" @click="addRuleAction()">保存</Button>-->
                        <!--</div>-->
                    <!--</div>-->
                <!--</div>-->
            <!--</Tab-pane>-->
            <!--<Tab-pane class="checkTab" label="敏感数据特权用户变量" icon="social-buffer">-->
                <!--<div class="editBox">-->
                    <!--<div class="table-reset">-->
                        <!--<table class="table table-bordered table-center table-striped table-blue table-edit table-standWork taDsiplay">-->
                            <!--<thead>-->
                            <!--<tr>-->
                                <!--<th width="60px">序号</th>-->
                                <!--<th width="200px">功能节点</th>-->
                                <!--<th width="100px">权限字段</th>-->
                                <!--<th width="100px">特权角色</th>-->
                                <!--<th>备注</th>-->
                                <!--<th width="100px">操作</th>-->
                            <!--</tr>-->
                            <!--</thead>-->
                            <!--<tbody>-->
                            <!--<tr v-for="(itemData,index) in dataFieldPolicyList" class="trDisplay">-->
                                <!--<td valign="top" style="text-align: center !important;">{{index + 1}}</td>-->
                                <!--<td valign="top" style="position: relative;">-->
                                    <!--<span @click="edit(itemData)">{{itemData.functionName}}</span>-->
                                    <!--<Tree v-show="onEdit" :data="baseData.functionTree"-->
                                          <!--@on-select-change="selectTreeNode"></Tree>-->
                                <!--</td>-->
                                <!--<td valign="top">-->
                                    <!--<span style="display: block;width: 200px;" @click="edit(itemData)" v-show="!onEdit">{{itemData.dataFieldCode}}</span>-->
                                    <!--<Select v-show="onEdit" v-model="itemData.dataFieldCode"-->
                                            <!--:value="itemData.dataFieldCode" style="width:200px">-->
                                        <!--<Option v-for="dataField in baseData.dataFieldList"-->
                                                <!--:value="dataField.code"-->
                                                <!--:key="dataField.code"-->
                                                <!--selected>-->
                                            <!--{{dataField.field}}-->
                                        <!--</Option>-->
                                    <!--</Select>-->
                                <!--</td>-->
                                <!--<td valign="top">-->
                                    <!--<span style="display: block;width: 200px;" @click="edit(itemData)" v-show="!onEdit">{{itemData.roleId}}</span>-->
                                    <!--<Select v-show="onEdit" v-model="itemData.roleId" :value="itemData.roleId"-->
                                            <!--style="width:200px" multiple>-->
                                        <!--<Option v-for="item in baseData.roleList" :value="item.value" :key="item.value">-->
                                            <!--{{item.label}}-->
                                        <!--</Option>-->
                                    <!--</Select>-->
                                <!--</td>-->
                                <!--<td valign="top"><span v-show="!onEdit" @click="edit(itemData)">{{itemData.note}}</span><textarea-->
                                        <!--rows="10" v-show="onEdit" v-model="itemData.note">{{itemData.note}}</textarea>-->
                                <!--</td>-->
                                <!--<td valign="top"><a class="mar-r-5" size="small" @click="savePolicyData()">确认</a><a-->
                                        <!--class="mar-r-5" size="small" @click="removePolicyData(index)">删除</a></td>-->
                            <!--</tr>-->
                            <!--</tbody>-->
                        <!--</table>-->
                    <!--</div>-->
                    <!--<div class="mar-t-10">-->
                        <!--<Button type="primary" icon="plus-round" size="small" @click="addRuleAction()">添加</Button>-->
                    <!--</div>-->
                <!--</div>-->
            <!--</Tab-pane>-->
        </Tabs>
    </div>
</template>
<script>
    let init = false;
    export default {
        mounted: function () {
            this.clearPolicyData();
            this.initAutoValueData();
            this.initDataAccessPolicyData();
            init = true;
        },
        data() {
            return {
                autoValue: 0,
                currentFunction: {
                    name: '',
                    id: ''
                },
                baseData: {
                    functionTree: [{
                        title: '设备档案',
                        id: 'xxxx',
                        expand: true
                    }, {
                        title: 'EAM',
                        expand: true,
                        children: [{
                            title: '第一层节点1',
                            expand: true,
                            children: [{
                                title: '第二层节点1'
                            }, {
                                title: '第二层节点2'
                            }]
                        }, {
                            title: '第一层节点2',
                            expand: true,
                            children: [{
                                title: '第二层节点1'
                            }, {
                                title: '第二层节点2'
                            }]
                        }]
                    }],
                    dataFieldList: [
                        {
                            field: '设备名称',
                            name: '设备名称',
                            code: 'name'
                        },
                        {
                            field: '生产厂家',
                            name: '生产厂家id',
                            code: 'factoryId'
                        }
                    ],
                    roleList: [
                        {
                            value: 'New York',
                            label: 'New York'
                        },
                        {
                            value: 'London',
                            label: 'London'
                        },
                        {
                            value: 'Sydney',
                            label: 'Sydney'
                        },
                        {
                            value: 'Ottawa',
                            label: 'Ottawa'
                        },
                        {
                            value: 'Paris',
                            label: 'Paris'
                        },
                        {
                            value: 'Canberra',
                            label: 'Canberra'
                        }
                    ],
                },
                dataFieldColumns: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    }, {
                        title: '数据域显示名称',
                        key: 'field',
                        align: 'left'
                    }, {
                        title: '数据域名称',
                        key: 'name',
                        align: 'left'
                    }, {
                        title: '数据域编码',
                        key: 'code',
                        align: 'left'
                    }
                ],
                onEdit: false,
                dataFieldEdit: {},
                dataFieldPolicyList: []
            }
        },
        methods: {
            selectTreeNode: function (data) {
                this.dataFieldEdit.functionId = data[0].id;
                this.dataFieldEdit.functionName = data[0].title;
            },
            edit: function (data) {
                this.dataFieldEdit = data;
                this.onEdit = true;
            },
            initAutoValueData: function () {
                this.$axios.get('/System/getDataAutoSyncInterval').then((res) => {
                    if (res.data.response.code) {
                        this.autoValue = parseInt(res.data.response.data.interval)
                        console.log(res.data.response.data.interval);
                    } else {
                        this.$Message.error("获取自动同步间隔数据据失败");
                    }

                });
            },
            saveAutoValue: function () {
                if (!init) {
                    return;
                }
                this.$axios.post('/System/dataAutoSyncIntervalSave', {
                    interval: this.autoValue
                }).then((res) => {
                    if (res.data.response.code) {
                        this.$Message.info("保存成功");
                    } else {
                        this.$Message.error("保存失败");
                    }

                });
            },
            initDataAccessPolicyData: function () {
                this.$axios.get('/System/getDataAccessPolicy').then((res) => {
                    if (res.data.response.code) {
                        let resultValueList = res.data.response.data.policy;
                        let dataMap = {};
                        for (let i = 0; i < resultValueList.length; i++) {
                            let valueItem = resultValueList[i];
                            dataMap[resultValueList[i]['policyId']] = dataMap[resultValueList[i]['policyId']] || {[resultValueList[i]['policyId']]: valueItem['policy']};
                        }
                    } else {
                        this.$Message.error("获取自动同步间隔数据据失败");
                    }

                });
            },
            addRuleAction: function () {
                if (!this.onEdit) {
                    this.dataFieldEdit = {
                        policyId: "JTSQFRPIGMWIKBWVLIN3",
                        functionId: "JSBVFEWNDY8U9V4GGIKP",
                        functionName: "设备档案详情页",
                        roleId: "JQXRHEG53DQEFRQZ5F7N",
                        roleName: "设备管理员",
                        dataFieldName: "金额",
                        dataFieldCode: "",
                        note: "是是是"
                    };
                    this.dataFieldPolicyList.push(this.dataFieldEdit);
                } else {
                    this.$Message.error("请完成上一项的数据编辑");
                }
            },
            savePolicyData: function () {
                this.clearPolicyData();
            },
            removePolicyData: function (i) {
                delete  this.dataFieldPolicyList[i];
                this.dataFieldEdit = undefined;
            },
            clearPolicyData: function () {
                this.dataFieldEdit = {
                    policyId: '',
                    functionId: '',
                    functionName: '',
                    roleId: '',
                    roleName: '',
                    dataFieldName: '',
                    dataFieldCode: '',
                    note: ''
                }
                this.onEdit = false
            },
        }
    }
</script>
<style>
    .parameter-setting-basic {
        overflow: inherit !important;
        height: auto;
    }

    .parameter-setting-title {
        margin-bottom: 25px;
        font-size: 16px;
        font-family: SimSun;
        color: #FFFFFF;
        font-weight: bold;
        margin-left: 10px;
        display: block;
    }

    .parameter-setting-slider-box {
        width: 50%;
        margin: 20px;
    }

</style>