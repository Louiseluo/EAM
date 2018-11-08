<template>
    <div class="basic fault-content">
        <!--模块名称-->
        <div class="title">
            <span>维保作业</span>
        </div>
        <div class="btn-group">
            <router-link to="WorkDetail" class="mar-r-15">
                <Button type="primary" icon="play" size="large">开始维保</Button>
            </router-link>
            <Button class="mar-r-15" type="primary" icon="ios-pulse-strong" size="large">免维保</Button>
            <router-link to="WorkAdd">
                <Button type="primary" icon="edit" size="large">申请维保</Button>
            </router-link>
        </div>
        <Row>
            <Col span="3">
				<div class="pad-5-20 bg-linegary">地点名称</div>
				<Tree class="max-h-300" :data="baseData" show-checkbox></Tree>
            </Col>
            <Col span="21" class="pad-l-15">
            <Tabs class="maintenanceTab" type="card">
                <Tab-pane label="待处理" icon="funnel">
                    <Table border stripe :columns="columns" :data="data"></Table>
                    <div class="page mar-t-15">
                        <Page :total="40" size="small" show-elevator show-sizer></Page>
                    </div>
                </Tab-pane>
                <Tab-pane label="已完成" icon="clipboard">
                    <Table border stripe :columns="columns" :data="data"></Table>
                    <div class="page mar-t-15">
                        <Page :total="40" size="small" show-elevator show-sizer></Page>
                    </div>
                </Tab-pane>
                <Tab-pane label="免维保" icon="ios-pulse-strong">
                    <Table border stripe :columns="columns" :data="data"></Table>
                    <div class="page mar-t-15">
                        <Page :total="40" size="small" show-elevator show-sizer></Page>
                    </div>
                </Tab-pane>
            </Tabs>
            </Col>
        </Row>
    </div>
</template>

<script>
    export default {
        data (){
            return {
                baseData: [{
                    expand: true,
                    title: '皮尔博格',
                    children: [{
                        title: '压铸车间1',
                        expand: true,
                        disabled: true,
                        children: [{
                            title: '设备1',
                            disableCheckbox: true
                        }, {
                            title: '设备2',
                        }]
                    }, {
                        title: '压铸车间2',
                        expand: true,
                        checked: true,
                        children: [{
                            title: '设备3',
                        }, {
                            title: '设备4',
                        }]
                    }]
                }],
                columns: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '序号',
                        type: 'index',
                        width: 70,
                        align: 'center'
                    },
                    {
                        title: '单据类型',
                        key: 'bill_type',
                        align: 'center'
                    },
                    {
                        title: '工单编码',
                        key: 'bill_id',
                        align: 'center'
                    },
                    {
                        title: '标准方案',
                        key: 'stand_work',
                        align: 'center'
                    },
                    {
                        title: '预计耗时（分钟）',
                        key: 'expect_time',
                        align: 'center'
                    },
                    {
                        title: '计划维保时间',
                        key: 'hitch_fix_time',
                        align: 'center'
                    },
                    {
                        title: '保养周期（天）',
                        key: 'cycle_time',
                        align: 'center'
                    },
                    {
                        title: '距离上次保养计划（天）',
                        key: 'space_time',
                        align: 'center'
                    },
                    {
                        title: '是否需要停机',
                        key: 'device_on',
                        align: 'center'
                    },
                ],
                data: [
                    {
                        bill_type: '保养',
                        bill_id: 'M1612100001',
                        stand_work: '压铸岛1号设备机油更换',
                        expect_time: '60',
                        hitch_fix_time: '2016年12月15日 09:00',
                        cycle_time: '30',
                        space_time: '33',
                        device_on: '是',

                    },
                    {
                        bill_type: '维修',
                        bill_id: 'M1612100002',
                        stand_work: '压铸岛1号设备机油更换',
                        expect_time: '60',
                        hitch_fix_time: '2016年12月15日 13:00',
                        cycle_time: '30',
                        space_time: '33',
                        device_on: '是',

                    },
                ],
            }
        },
        methods: { },
    }
</script>
