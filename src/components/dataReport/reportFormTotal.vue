<template>
    <div class="basic fault-content">
        <div class="title">
            <span>{{titleAry[type]}}</span>
        </div>
        <!--form-->
        <div class="form-content">
            <Form inline :label-width="90">
                <FormItem label="时间选择">
                    <Row>
                        <Col span="11">
                        <DatePicker v-model="workForm.searchStartTime" type="datetime" placeholder="选择日期和时间"></DatePicker>
                        </Col>
                        <Col span="2" align="center">~</Col>
                        <Col span="11">
                        <DatePicker v-model="workForm.searchEndTime" type="datetime" placeholder="选择日期和时间"></DatePicker>
                        </Col>
                    </Row>
                </FormItem>
            </Form>
            <div class="btn-query">
                <Button  type="primary" icon="search" size="large" @click="searchList">查询</Button>
            </div>
        </div>
        <!--form-->
        <div class="table-content" v-show="type == 0">
            <div class="table-content ivu-table-auto">
                <Table stripe border :columns="columnsUseRate" :data="dataUseRate"></Table>
            </div>
            <!--<div class="mar-t-10">
                <div style="float: right;">
                    <Page size="small" :total='pageTotal' show-elevator :page-size="pageSize" @on-change="pageChange"></Page>
                </div>
            </div>-->
        </div>
        <div class="table-content"  v-show="type == 1">
            <div class="table-content ivu-table-auto">
                <Table stripe border :columns="columnsLayOff" :data="dataLayOff"></Table>
            </div>
            <!--<div class="mar-t-10">
                <div style="float: right;">
                    <Page size="small" :total='pageTotal' show-elevator :page-size="pageSize" @on-change="pageChange"></Page>
                </div>
            </div>-->
        </div>
        <div class="table-content"  v-show="type == 2">
            <div class="table-content ivu-table-auto">
                <Table stripe border :columns="columnsRepair" :data="dataRepair"></Table>
            </div>
            <!--<div class="mar-t-10">
                <div style="float: right;">
                    <Page size="small" :total='pageTotal' show-elevator :page-size="pageSize" @on-change="pageChange"></Page>
                </div>
            </div>-->
        </div>
        <div class="table-content"  v-show="type == 3">
            <div class="table-content ivu-table-auto">
                <Table stripe border :columns="columnsMaintain" :data="dataMaintain"></Table>
            </div>
            <!--<div class="mar-t-10">
                <div style="float: right;">
                    <Page size="small" :total='pageTotal' show-elevator :page-size="pageSize" @on-change="pageChange"></Page>
                </div>
            </div>-->
        </div>
    </div>
</template>
<script>
    export default {
        data (){
            return {
                formTitle:'',
                workForm: {
                    searchStartTime: '',
                    searchEndTime: '',
                },
                type:0,
                titleAry:[
                    '设备利用率报表',
                    '设备的障停机率报表',
                    '设备维修率报表',
                    '设备保养完成率报表',
                ],
                /*审核管理*/
                columnsUseRate:[
                    {
                        title: '序号',
                        type: 'index',
                        width:70,
                        align: 'center'
                    },
                    {
                        title: '地点',
                        key: 'equipmentLocation',
                        align: 'center',
                    },
                    {
                        title: '设备类型',
                        key: 'equipmentType',
                        align: 'center',
                    },
                    {
                        title: '设备编码',
                        key: 'equipmentCode',
                        align: 'center',
                        render: (h, params) => {
                            let btns = [];
                            btns.push(
                                h('a', {
                                    class: 'iview_tabDis',
                                    on: {
                                        click: () => {
                                            this.$router.push({path: '/resume', query: {id: params.row.equipmentId}})
                                        }
                                    }
                                }, params.row.equipmentCode)
                            )
                            return h('div', btns)
                        },
                    },
                    {
                        title: '设备名称',
                        key: 'equipmentName',
                        align: 'center',
                    },
                    {
                        title: '实际开机工时',
                        key: '1',
                        align: 'center',
                    },
                    {
                        title: '计划开机工时',
                        key: '2',
                        align: 'center',
                    },
                    {
                        title: '设备利用率（实际开机工时/计划开机工时）',
                        key: '3',
                        align: 'center',
                    },

                ],
                dataUseRate:[
                    {
                        equipmentLocation:'A厂',
                        equipmentType:'A|类',
                        equipmentCode:'Abc',
                        equipmentName:'设备名称',
                        1:'2018-09-01',
                        2:'2018-10-01',
                        3:'80%',
                    }
                ],
                columnsLayOff:[
                    {
                        title: '序号',
                        type: 'index',
                        width: 70,
                        align: 'center'
                    },
                    {
                        title: '地点',
                        key: 'equipmentLocation',
                        align: 'center',
                    },
                    {
                        title: '设备类型',
                        key: 'equipmentType',
                        align: 'center',
                    },
                    {
                        title: '设备编码',
                        key: 'equipmentCode',
                        align: 'center',
                        render: (h, params) => {
                            let btns = [];
                            btns.push(
                                h('a', {
                                    class: 'iview_tabDis',
                                    on: {
                                        click: () => {
                                            this.$router.push({path: '/resume', query: {id: params.row.equipmentId}})
                                        }
                                    }
                                }, params.row.equipmentCode)
                            )
                            return h('div', btns)
                        },
                    },
                    {
                        title: '设备名称',
                        key: 'equipmentName',
                        align: 'center',
                    },
                    {
                        title: '故障停机工时',
                        key: '1',
                        align: 'center',
                    },
                    {
                        title: '计划开机工时',
                        key: '2',
                        align: 'center',
                    },
                    {
                        title: '设备障停机率（故障停机工时/计划开机工时）',
                        key: '3',
                        align: 'center',
                    },

                ],
                dataLayOff:[
                    {
                        equipmentLocation:'A厂',
                        equipmentType:'A|类',
                        equipmentCode:'Abc',
                        equipmentName:'设备名称',
                        1:'2018-09-01',
                        2:'2018-10-01',
                        3:'80%',
                    }
                ],
                columnsRepair:[
                    {
                        title: '序号',
                        type: 'index',
                        width: 70,
                        align: 'center'
                    },
                    {
                        title: '地点',
                        key: 'equipmentLocation',
                        align: 'center',
                    },
                    {
                        title: '设备类型',
                        key: 'equipmentType',
                        align: 'center',
                    },
                    {
                        title: '设备编码',
                        key: 'equipmentCode',
                        align: 'center',
                        render: (h, params) => {
                            let btns = [];
                            btns.push(
                                h('a', {
                                    class: 'iview_tabDis',
                                    on: {
                                        click: () => {
                                            this.$router.push({path: '/resume', query: {id: params.row.equipmentId}})
                                        }
                                    }
                                }, params.row.equipmentCode)
                            )
                            return h('div', btns)
                        },
                    },
                    {
                        title: '设备名称',
                        key: 'equipmentName',
                        align: 'center',
                    },
                    {
                        title: '实际维修时间',
                        key: '1',
                        align: 'center',
                    },
                    {
                        title: '计划维修时间',
                        key: '2',
                        align: 'center',
                    },
                    {
                        title: '设备维修及时率',
                        key: '3',
                        align: 'center',
                    },

                ],
                dataRepair:[
                    {
                        equipmentLocation:'A厂',
                        equipmentType:'A|类',
                        equipmentCode:'Abc',
                        equipmentName:'设备名称',
                        1:'2018-09-01',
                        2:'2018-10-01',
                        3:'80%',
                    }
                ],
                columnsMaintain:[
                    {
                        title: '序号',
                        type: 'index',
                        width: 70,
                        align: 'center'
                    },
                    {
                        title: '地点',
                        key: 'equipmentLocation',
                        align: 'center',
                    },
                    {
                        title: '设备类型',
                        key: 'equipmentType',
                        align: 'center',
                    },
                    {
                        title: '设备编码',
                        key: 'equipmentCode',
                        align: 'center',
                        render: (h, params) => {
                            let btns = [];
                            btns.push(
                                h('a', {
                                    class: 'iview_tabDis',
                                    on: {
                                        click: () => {
                                            this.$router.push({path: '/resume', query: {id: params.row.equipmentId}})
                                        }
                                    }
                                }, params.row.equipmentCode)
                            )
                            return h('div', btns)
                        },
                    },
                    {
                        title: '设备名称',
                        key: 'equipmentName',
                        align: 'center',
                    },
                    {
                        title: '实际保养时间',
                        key: '1',
                        align: 'center',
                    },
                    {
                        title: '计划保养时间',
                        key: '2',
                        align: 'center',
                    },
                    {
                        title: '计划保养完成率',
                        key: '3',
                        align: 'center',
                    },

                ],
                dataMaintain:[
                    {
                        equipmentLocation:'A厂',
                        equipmentType:'A|类',
                        equipmentCode:'Abc',
                        equipmentName:'设备名称',
                        1:'2018-09-01',
                        2:'2018-10-01',
                        3:'80%',
                    }
                ],
                pageTotal:0,
                pageSize:20,
                page:1,
            }
        },
        mounted() {
            this.type = this.$route.query.type;
        },
        watch: {
            '$route' (to, from) {
                this.type = to.query.type;
            }
        },
        methods: {
            pageChange(){},
            searchList(){},
        },
    }
</script>





