<template>
    <div class="wrap">
        <div class="form-content">
            <Form ref="formData" :model="formData" label-position="right" inline :label-width="100">
                <FormItem label="导入类型">
                    <Select v-model="formData.importType" style="width: 160px;">
                        <Option v-for="item in formData.importTypes" :value="item.code" :key="item.code">
                            {{ item.desc }}
                        </Option>
                    </Select>
                </FormItem>
                <div class="f_r">
                    <Button type="primary" icon="ios-cloud-download">下载模板</Button>
                    <Button type="primary" class="mar-l-20" icon="ios-download">开始导入</Button>
                    <Button type="primary" class="mar-l-20" icon="upload">上传文件</Button>
                </div>
            </Form>
            <div class="table-content">
                <table class="table table-bordered table-center table-striped table-blue table-edit">
                    <thead>
                    <tr>
                        <th width="80">序号</th>
                        <th>文件名称</th>
                        <th>格式</th>
                        <th width="150">操作</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(tableData, index) in tableDataArr">
                        <td>{{index + 1}}</td>
                        <td>{{tableData.file_name}}</td>
                        <td>{{tableData.file_format}}</td>
                        <td>
                            <a>修改</a>
                            <a @click="removeTableData(index)">删除</a>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="second-title">批量管理</div>
        <div class="form-content">
            <div class="second-title">导入结果</div>
           <!-- <div class="font-18 mar-l-25">
                <strong class="font-success">成功<span class="mar-l-20">23</span>条</strong><br/>
                <strong class="font-error">失败<span class="mar-l-20">15</span>条</strong>
            </div>-->
            <Tabs value="name1" class="onlyTab" size="small">
                <TabPane label="失败（7）" name="name1">
                    <div class="table-content">
                        <table class="table table-bordered table-center table-striped table-blue table-edit">
                            <thead>
                            <tr>
                                <th width="80">序号</th>
                                <th>文件名称</th>
                                <th>文件格式</th>
                                <th>导入项目名称</th>
                                <th>导入结果</th>
                                <th>错误原因</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="(tableData, index) in errTableDataList">
                                <td>{{index + 1}}</td>
                                <td>{{tableData.file_name}}</td>
                                <td>{{tableData.file_format}}</td>
                                <td>{{tableData.import_project_name}}</td>
                                <td>{{tableData.import_result}}</td>
                                <td>{{tableData.err_reason}}</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </TabPane>
                <TabPane label="成功（23）" name="name2">
                    <div class="table-content">
                        <table class="table table-bordered table-center table-striped table-blue table-edit">
                            <thead>
                            <tr>
                                <th width="80">序号</th>
                                <th>文件名称</th>
                                <th>文件格式</th>
                                <th>导入项目名称</th>
                                <th>导入结果</th>
                                <th>操作</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="(tableData, index) in successTableDataList">
                                <td>{{index + 1}}</td>
                                <td>{{tableData.file_name}}</td>
                                <td>{{tableData.file_format}}</td>
                                <td>{{tableData.import_project_name}}</td>
                                <td>{{tableData.import_result}}</td>
                                <td><a>查看</a></td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </TabPane>
            </Tabs>


        </div>
        <div class="page">
            <Page :total="data1Total" :current="taskCurrentPage" size="small" show-elevator :page-size="pageSize"></Page>
        </div>
    </div>
</template>
<script>
    export default {
        data(){
            return {
                data1Total: 10,
                taskCurrentPage: 1,
                pageSize: 5,
                formData: {
                    importType: '1',
                    importTypes: [
                        {
                            code: '1',
                            desc: '标准方案'
                        },
                        {
                            code: '2',
                            desc: '年度计划'
                        },
                        {
                            code: '3',
                            desc: '设备台账'
                        },
                        {
                            code: '4',
                            desc: '备品备件'
                        },
                        {
                            code: '5',
                            desc: '设备与故障、原因关联关系'
                        },
                        {
                            code: '6',
                            desc: '设备与备件关联关系'
                        },
                        {
                            code: '7',
                            desc: '人员账户'
                        },
                    ]
                },
                tableDataArr: [
                    {
                        file_name: '标准方案文件1',
                        file_format: 'csv'
                    },
                    {
                        file_name: '标准方案文件2',
                        file_format: 'csv'
                    },
                ],
                errTableDataList: [
                    {
                        file_name: '标准方案文件1',
                        file_format: 'csv',
                        import_project_name: '方案1',
                        import_result: '失败',
                        err_reason: ''
                    },
                    {
                        file_name: '标准方案文件2',
                        file_format: 'csv',
                        import_project_name: '方案1',
                        import_result: '失败',
                        err_reason: ''
                    },
                    {
                        file_name: '标准方案文件1',
                        file_format: 'csv',
                        import_project_name: '方案1',
                        import_result: '失败',
                        err_reason: ''
                    },
                    {
                        file_name: '标准方案文件2',
                        file_format: 'csv',
                        import_project_name: '方案1',
                        import_result: '失败',
                        err_reason: ''
                    },
                ],
                successTableDataList: [
                    {
                        file_name: '标准方案文件1',
                        file_format: 'csv',
                        import_project_name: '方案1',
                        import_result: '成功',
                    },
                    {
                        file_name: '标准方案文件2',
                        file_format: 'csv',
                        import_project_name: '方案1',
                        import_result: '成功',
                    },
                ],
            }
        },
        methods: {
            removeTableData: function (index) {
                this.tableDataArr.splice(index,1);
            },
        }
    }
</script>
<style>
    .onlyTab .ivu-tabs-bar {
        border-bottom: none;

    }
    .onlyTab .ivu-tabs-ink-bar {
        height:0;
    }
    .onlyTab .ivu-tabs-nav .ivu-tabs-tab {
        background: #19be6b;
        color: #fff;
        -webkit-border-radius: 5px;
        -moz-border-radius: 5px;
        border-radius: 5px;
        margin-right: 20px;
    }
    .onlyTab .ivu-tabs-nav .ivu-tabs-tab:nth-of-type(2) {
        background: #ed3f14;
    }
</style>