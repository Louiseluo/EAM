<template>
    <div class="basic">
        <v-topItem></v-topItem>
        <Row class="pad-15">
            <Col span="18" offset="3">
            <div align="right" class="mar-b-10">
                <Button type="primary" shape="circle" icon="plus-round" size="small" @click=""></Button>
                <Button type="primary" shape="circle" icon="minus-round" size="small" @click=""></Button>
            </div>
            <Table class="table-edit" stripe border :columns="columns_style" :data="data_style"></Table>
            </Col>
        </Row>
    </div>
</template>

<script type="text/ecmascript-6">
    import topItem from './systemManage.vue';
    export default {
        data(){
            return {
                columns_style:[
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title:'序号',
                        type: 'index',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '类型编码',
                        key: 'style_id',
                        align: 'center',
                        render: (h,params)=>{
                            return h('Input',{props:{value:params.row.style_id}})
                        },
                    },
                    {
                        title: '类型名称',
                        key: 'style_name',
                        align: 'center',
                        render: (h,params)=>{
                            return h('Input',{props:{value:params.row.style_name}})
                        },
                    },
                    {
                        title: '业务类型',
                        key: 'work_plan',
                        align: 'center',
                        render: (h, params) => {
                            return h('i-select', {
                                props: {
                                    value: params.row.work_plan
                                }
                            }, [
                                h('i-option', {
                                    props: {
                                        value: '1'
                                    }
                                }, '维修'),
                                h('i-option', {
                                    props: {
                                        value: '2'
                                    }
                                }, '保养'),
                            ])
                        }
                    },
                ],
                data_style:[
                    {
                        style_id: '1001',
                        style_name: 'ahhaha',
                        work_plan:'2'
                    },
                    {
                        style_id: '1001',
                        style_name: 'ahhaha',
                        work_plan:'2'
                    },
                ],
            }
        },
        components: {
            'v-topItem': topItem
        },
        methods: {

        }
    }
</script>

<style type="text/css">

</style>
