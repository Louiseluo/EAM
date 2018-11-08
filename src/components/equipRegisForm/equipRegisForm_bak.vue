<template>
    <div class="basic bzzy-change">
        <!--模块名称-->
        <div class="title">
            <span>关键设备登记表</span>
        </div>
        <!--表单-->
        <div class="form-content">
                <Form label-position="right" inline :label-width="100">
                    <Form-item label="设备名称">
                        <Input style="width: 160px;"></Input>
                    </Form-item>
                    <Form-item label="设备编码">
                        <Input style="width: 160px;"></Input>
                    </Form-item>
                    <Form-item label="生产厂家">
                        <div class="input-search pointDis" style="position: relative;" >
                            <Input style="width: 160px;"></Input>
                            <Button icon="ios-search"></Button>
                        </div>
                    </Form-item>
                    <Form-item label="规格型号">
                        <div class="input-search pointDis" style="position: relative;" >
                            <Input style="width: 160px;"></Input>
                            <Button icon="ios-search"></Button>
                        </div>
                    </Form-item>
                    <Form-item label="安装地点">
                        <div class="input-search pointDis" style="position: relative;" >
                            <Input style="width: 160px;"></Input>
                            <Button icon="ios-search"></Button>
                        </div>
                    </Form-item>
                </Form>
                <div align="right" class="btnGroupDesign">
                    <Button type="primary">查询</Button>
                </div>
        </div>
        <div style="width: 100px;height: 55px;margin: 15px 0;"><img style="width: 100%;height: 100%;" src="../../../static/img/ch_logo.jpg" alt=""></div>
        <h3>单据类型码：P006E </h3>
        <!--表格-->
        <div class="table-content ivu-table-auto">
            <table class="table table-bordered table-center table-striped table-blue taDisplay lineTable">
                <thead>
                    <tr class="hdDesign">
                        <th rowspan="2">序号</th>
                        <th colspan="2">设备编号</th>
                        <th rowspan="2">设备名称</th>
                        <th rowspan="2">生产厂家</th>
                        <th rowspan="2">规格型号</th>
                        <th rowspan="2">安装地点</th>
                        <th rowspan="2">电机功率</th>
                        <th rowspan="2">设备原值</th>
                        <th rowspan="2">重要程度</th>
                        <th rowspan="2">设备管理责任人</th>
                    </tr>
                    <tr class="hdDesignSec">
                        <th>厂内编号</th>
                        <th>生产厂家编号</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1</td>
                        <td>lfp22</td>
                        <td>xmt2589</td>
                        <td>电脑</td>
                        <td>不知名</td>
                        <td>HCHE-TND105</td>
                        <td>杭州</td>
                        <td>65</td>
                        <td>462</td>
                        <td>非常重要</td>
                        <td>应香明</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="page">
            <Page size="small" show-elevator></Page>
        </div>
    </div>
</template>