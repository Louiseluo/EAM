<template>
    <div class="basic">
        <!--二级导航-->
        <v-topItem></v-topItem>
        <Row class="pad-15">
            <Col span="12" class="pad-r-10">
                <div class="second-title">班组定义</div>
                <!--表格-->
                <div class="table-content">
                    <div class="table-reset">
                        <table class="table table-bordered table-center table-striped table-blue table-edit">
                            <thead>
                            <tr>
                                <th>班组编码</th>
                                <th>班组名称</th>
                                <th>负责人</th>
                                <th>手机号</th>
                                <th>描述</th>
                                <th width="10%">操作</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="(itemDept,index) in data_dept">
                                <td><Input type="text" v-model="itemDept.dept_id"></Input></td>
                                <td><Input type="text" v-model="itemDept.dept_name"></Input></td>
                                <td><Input type="text" v-model="itemDept.manage_man"></Input></td>
                                <td><Input type="text" v-model="itemDept.manage_man_phone"></Input></td>
                                <td><Input type="text" v-model="itemDept.describe"></Input></td>
                                <td><a class="mar-r-5" size="small" @click="removeDept(index)">删除</a></td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="mar-t-10">
                        <Button type="primary" icon="plus-round" size="small" @click="addDept">添加</Button>
                    </div>
                </div>
            </Col>
            <Col span="12" class="pad-l-10">
                <div class="second-title">人员定义</div>
                <div class="table-content">
                <div class="table-reset">
                    <table class="table table-bordered table-center table-striped table-blue table-edit">
                        <thead>
                        <tr>
                            <th>员工编号</th>
                            <th>员工名称</th>
                            <th width="8%">维修</th>
                            <th width="8%">保养</th>
                            <th>开始时间</th>
                            <th>结束时间</th>
                            <th>描述</th>
                            <th width="10%">操作</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="(itemMan,index) in data_man">
                            <td><Input type="text" v-model="itemMan.man_id"></Input></td>
                            <td><Input type="text" v-model="itemMan.man_name"></Input></td>
                            <td><Checkbox v-model="itemMan.man_skill_WX"></Checkbox></td>
                            <td><Checkbox v-model="itemMan.man_skill_BY"></Checkbox></td>
                            <td><Time-picker format="HH:mm" placeholder="选择时间" v-model="itemMan.man_start_work_time"></Time-picker></td>
                            <td><Time-picker format="HH:mm" placeholder="选择时间" v-model="itemMan.man_end_work_time"></Time-picker></td>
                            <td><Input type="text" v-model="itemMan.describe"></Input></td>
                            <td><a class="mar-r-5" size="small" @click="removeMan(index)">删除</a></td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div class="mar-t-10">
                    <Button type="primary" icon="plus-round" size="small" @click="addMan">添加</Button>
                </div>
            </div>
            </Col>
        </Row>
    </div>

</template>

<script type="text/ecmascript-6">
    import topItem from './systemManage.vue';
    export default {
        data(){
            return {
                columns_dept: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '班组编码',
                        key: 'dept_id',
                        align: 'center',
                        render: (h,params)=>{
                            return h('Input',{props:{value:params.row.dept_id}})
                        },
                    },
                    {
                        title: '班组名称',
                        key: 'dept_name',
                        align: 'center',
                        render: (h,params)=>{
                            return h('Input',{props:{value:params.row.dept_name}})
                        },
                    },
                    {
                        title: '负责人',
                        key: 'manage_man',
                        align: 'center',
                        render: (h,params)=>{
                            return h('Input',{props:{value:params.row.manage_man}})
                        },
                    },
                    {
                        title: '手机号',
                        key: 'manage_man_phone',
                        align: 'center',
                        render: (h,params)=>{
                            return h('Input',{props:{value:params.row.manage_man_phone}})
                        },
                    },
                    {
                        title: '描述',
                        key: 'describe',
                        align: 'center',
                        render: (h,params)=>{
                            return h('Input',{props:{value:params.row.describe}})
                        },
                    }
                ],
                data_dept: [
                    {
                        dept_id: 'W001',
                        dept_name: '机修一组',
                        manage_man: 'XXX',
                        manage_man_phone: '1521212',
                        describe:'牛X组'
                    },
                    {
                        dept_id: 'W002',
                        dept_name: '机修二组',
                        manage_man: 'XXX',
                        manage_man_phone: '15212122222',
                        describe:'牛X二组'
                    }
                ],
                n_dept:{
                    dept_id: 'W001',
                    dept_name: '机修一组',
                    manage_man: 'XXX',
                    manage_man_phone: '1521212',
                    describe:'牛X组'
                },
                columns_man: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '员工编号',
                        key: 'man_id',
                        align: 'center',
                        render: (h,params)=>{
                            return h('Input',{props:{value:params.row.man_id}})
                        },
                    },
                    {
                        title: '员工名称',
                        key: 'man_name',
                        align: 'center',
                        render: (h,params)=>{
                            return h('Input',{props:{value:params.row.man_name}})
                        },
                    },
                    {
                        title: '维修',
                        key: 'man_skill_WX',
                        align: 'center',
                        render: (h,params)=>{
                            return h('Checkbox',{props:{value:params.row.man_skill_WX}})
                        },
                    },
                    {
                        title: '保养',
                        key: 'man_skill_BY',
                        align: 'center',
                        render: (h,params)=>{
                            return h('Checkbox',{props:{value:params.row.man_skill_BY}})
                        },
                    },
                    {
                        title: '开始时间',
                        key: 'man_start_work_time',
                        align: 'center',

                        render: (h,params)=>{
                            return h('Time-picker',{
                                props:{
                                    format:'HH:mm',
                                    placeholder:"选择时间",
                                    value:params.row.man_start_work_time
                                },
//                                style:{width: '112px'}
                            })
                        },
                    },
                    {
                        title: '结束时间',
                        key: 'man_end_work_time',
                        align: 'center',
                        render: (h,params)=>{
                            return h('Time-picker',{
                                props:{
                                    format:'HH:mm',
                                    placeholder:"选择时间",
                                    value:params.row.man_end_work_time
                                },
//                                style:{width: '112px'}
                            })
                        },
                    },
                    {
                        title: '描述',
                        key: 'describe',
                        align: 'center',
                        render: (h,params)=>{
                            return h('Input',{props:{value:params.row.describe}})
                        },
                    }
                ],
                data_man: [
                    {
                        man_id: '1001',
                        man_name: '张三',
                        man_skill_WX: true,
                        man_skill_BY: false,
                        man_start_work_time: '09:00',
                        man_end_work_time:'19:00',
                        describe:'牛X组'
                    },
                    {
                        man_id: '1002',
                        man_name: '李四',
                        man_skill_WX: true,
                        man_skill_BY: true,
                        man_start_work_time: '19:00',
                        man_end_work_time:'09:00',
                        describe:'牛X组'
                    },
                ],
                n_man:{
                    man_id: '1001',
                    man_name: '张三',
                    man_skill_WX: true,
                    man_skill_BY: false,
                    man_start_work_time: '09:00',
                    man_end_work_time:'19:00',
                    describe:'牛X组'
                },
//                data_man:this.getDataMan(),
            }
        },
        components: {
            'v-topItem': topItem
        },
        methods: {
            addDept: function () {
                this.data_dept.push(this.$fc.cloneKey(this.n_dept));
//                this.data3.push(this.new_data3);
                // 添加完newPerson对象后，重置newPerson对象
            },
            removeDept: function (index) {
                // 删一个数组元素
                this.data_dept.splice(index, 1);
            },
            addMan: function () {
                this.data_man.push(this.$fc.cloneKey(this.n_man));
//                this.data3.push(this.new_data3);
                // 添加完newPerson对象后，重置newPerson对象
            },
            removeMan: function (index) {
                // 删一个数组元素
                this.data_man.splice(index, 1);
            },
            clickRow:function ( ) {
                console.log("sss")
            }

        }
    }
</script>

<style type="text/css">

</style>
