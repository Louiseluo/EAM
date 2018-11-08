<template>
    <div class="basic bzzy-search">
        <!--模块名称-->
        <div class="title">
            <span>委外维修单</span>
        </div>
        <!--表单-->
        <div class="form-content">
            <Form ref="workForm" :model="workForm" label-position="right" inline :label-width="100">
                <FormItem label="报修部门">
                    <div style="color:#ffffff" onmousemove="this.style.color='#5b5b5b';" onmouseout="this.style.color='#ffffff'">
                       <span @click="emptyDept" v-if="workForm.department">
                          <Icon type="ios-close" class="deleteTab"></Icon>
                       </span>
                        <div class="input-search" prop="manufacturer" @click="deptModel=true">
                            <Input v-model="workForm.department" style="width: 160px;" readonly></Input>
                            <Button icon="ios-search" @click="deptModel=true"></Button>
                        </div>
                    </div>
                </FormItem>
                <Form-item label="设备名称">
                    <div style="color:#ffffff" onmousemove="this.style.color='#5b5b5b';" onmouseout="this.style.color='#ffffff'">
                        <span @click="workForm.equpName='';workForm.equipmentId=''" v-if="workForm.equpName">
                            <Icon type="ios-close" class="deleteTab"></Icon>
                        </span>
                        <div class="input-search" @click="equ_name = true">
                            <Input v-model="workForm.equpName" style="width: 160px;" readonly></Input>
                            <Button icon="ios-search"></Button>
                        </div>
                    </div>
                </Form-item>
                <Form-item label="设备型号">
                    <div style="color:#ffffff" onmousemove="this.style.color='#5b5b5b';" onmouseout="this.style.color='#ffffff'">
                        <span @click="workForm.equpModel='';workForm.equipmentModelId=''" v-if="workForm.equpModel">
                            <Icon type="ios-close" class="deleteTab"></Icon>
                        </span>
                        <div class="input-search" @click="equType_mod = true">
                            <Input v-model="workForm.equpModel" style="width: 160px;" readonly></Input>
                            <Button icon="ios-search"></Button>
                        </div>
                    </div>
                </Form-item>
                <Form-item label="报修人">
                    <Input v-model="workForm.repairperson" @on-blur="workForm.repairperson=toValidate(workForm.repairperson)" style="width: 160px;"></Input>
                </Form-item>
                <FormItem label="故障关键字">
                    <Input v-model="workForm.faultDesc" @on-blur="workForm.faultDesc=toValidate(workForm.faultDesc)" style="width: 160px;"></Input>
                </FormItem>
                <Form-item label="报修时间">
                    <Row>
                        <Col span="11">
                        <DatePicker v-model="workForm.repairStart" type="date" placeholder="选择日期" @on-change="changeCreateAtS"></DatePicker>
                        </Col>
                        <Col span="2" style="text-align: center">~</Col>
                        <Col span="11">
                        <DatePicker v-model="workForm.repairEnd" type="date" placeholder="选择日期" @on-change="changeCreateAtE"></DatePicker>
                        </Col>
                    </Row>
                </Form-item>
            </Form>
            <!--查询按钮-->
            <div class="btn-query">
                <Button type="primary" icon="search" size="large" @click="searchResult">查询</Button>
            </div>
        </div>
        <!--表格-->
        <div class="table-content">
            <Table stripe border :columns="standardColumns" :data="standardData"></Table>
            <!--<Table v-if="hasAmount" stripe border :columns="standardColumns2" :data="standardData"></Table>-->
        </div>
        <div class="page">
            <Page :total="numMaterial" :current="workForm.page" size="small" show-elevator :page-size="workForm.pageSize" @on-change="changePage"></Page>
        </div>

        <!--报修部门-->
        <Modal v-model="deptModel" title="报修部门" @on-ok="toSelect_dept">
            <department @deptSelected="dept_hasSelected"></department>
        </Modal>
        <!--设备名称-->
        <Modal v-model="equ_name" title="设备名称" @on-ok="toSelect_equName">
            <equ_nameSelect @nameSelected="name_hasSelected"></equ_nameSelect>
        </Modal>
        <!--设备型号-->
        <Modal v-model="equType_mod" title="设备型号" @on-ok="toSelect_equType">
            <equ_typeSelect @typeSelected="type_hasSelected"></equ_typeSelect>
        </Modal>
        <!--设备制造商-->
        <Modal v-model="manuf_mod" title="设备制造商" @on-ok="toSelect_manuf">
            <manufactur @manufSelected="manuf_hasSelected"></manufactur>
        </Modal>
    </div>
</template>

<script>
    import equ_nameSelect from '../treeMulitiple/equ_nameSelect.vue';
    import department from '../treeMulitiple/department.vue'
    import equ_typeSelect from "../treeMulitiple/equ_typeSelect.vue";
    import manufactur from '../treeMulitiple/manufactur.vue';
    export default {
        data (){
            return {
                notFitDataTip: '',
                /*权限校验 start*/
                if_search:  this.$rt(this.authJson.EAM.设备维修.委外维修工单列表页.查询),
                if_outOrder:  this.$rt(this.authJson.EAM.设备维修.委外维修工单列表页.委外申请单),
                if_outAccept:  this.$rt(this.authJson.EAM.设备维修.委外维修工单列表页.委外验收单),
                if_hasAmount: this.$rt(this.authJson.EAM.设备维修.委外维修工单列表页.设置委外金额),
                /*权限校验 end*/
                created: false,
                pageSize:5,
                numMaterial: 0,

                /*查询数组*/
                workForm: {
                    department: '', //报修部门
                    repairDeptId: '', //报修部门Id
                    equpName: '', //设备名称
                    equipmentId: '', //设备名称Id
                    equpModel: '', //设备型号
                    equipmentModelId: '', //设备型号Id
                    repairperson: '', //报修人
                    equpManufacturer: '', //设备制造商
                    equManufacturerId: '', //设备制造商Id
                    faultDesc: '', //故障关键字
                    repairStart:'',
                    repairEnd:'',
                    page:1,
                    pageSize:10
                },
                /*报修部门相关*/
                deptModel: false,
                selectedDept: {},
                hasAmount: false,
                /*查询列表渲染*/
                standardColumns: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 80,
                        align: 'center'
                    },
                    {
                        title: '关联维修工单',
                        key: 'doBillNo',
                        align: 'center',
                        render: (h, params) => {
                            return h('a', {
                                domProps: {
                                    title: params.row.doBillNo
                                },
                                on: {
                                    click: () => {
                                        this.$router.push({path: 'maintenanceMain', query: {orderId: params.row.odId}})
                                    }
                                }
                            }, params.row.doBillNo)
                        }
                    },
                    {
                        title: '报修部门',
                        key: 'repairDept',
                        align: 'center',
                    },
                    {
                        title: '报修关键字',
                        key: 'faultDesc',
                        align: 'center',
                    },
                    {
                        title: '设备名称',
                        key: 'equipmentName',
                        align: 'center',
                    },
                    {
                        title: '设备型号',
                        key: 'model',
                        align: 'center',
                    },
                    {
                        title: '报修人',
                        key: 'reporter',
                        align: 'center',
                    },
                    {
                        title: '报修时间',
                        key: 'reportTime',
                        align: 'center'
                    },
                    {
                        title: '设备存放地点',
                        key: 'installationLocationName',
                        align: 'center'
                    },
                    {
                        title: '维修金额',
                        key: 'repairCost',
                        align: 'center',
                        render: (h, params) => {
                            return h('p', {
                                domProps: {
                                    title: params.row.repairCost,
                                },
                                class: (params.row.roles.join().indexOf('设备管理员')!=-1 || params.row.roles.join().indexOf('设备科长')!=-1) ? 'iview_tab_numDis' : 'shelterWord',
                            }, params.row.repairCost)
                        },
                    },
                    {
                        title: '操作',
                        width: 300,
                        key: 'action',
                        render: (h, params) => {
                            let btns = [];
                            if(this.if_outOrder) {
                                btns.push(
                                    h('a', {
                                        class: 'mar-r-5',
                                        on: {
                                            click: () => {
                                                this.$router.push({path: 'applyForOutScource', query: {id: params.row.outRepairId,editFlag: 0,orderId: params.row.odId}})
                                            }
                                        }
                                    }, '委外申请单')
                                )
                            }
                            if(this.if_outAccept) {
                                btns.push(
                                    h('a', {
                                        class: 'mar-r-5',
                                        on: {
                                            click: () => {
                                                this.goOutsourcedReceipt(params.row.outRepairId,0)
                                            }
                                        }
                                    }, '委外验收单')
                                )
                            }
                            if((this.if_hasAmount&&params.row.doStatus==19)||(this.if_hasAmount&&params.row.doStatus==20)) {
                                btns.push(
                                    h('a', {
                                        class: 'mar-r-5',
                                        on: {
                                            click: () => {
                                                this.goOutsourcedReceipt(params.row.outRepairId,1)
                                            }
                                        }
                                    }, '设置委外金额')
                                )
                            }
                            return h('div', btns)

                        },
                        align: 'center'
                    },
                ],
                standardData:[],
                /*设备名称*/
                equ_name: false,
                equNameSelected: {},
                /*规格型号*/
                equType_mod: false,
                equTypeSelected: {},
                /*设备制造商*/
                manuf_mod: false,
                equManufSelected: {},

            }
        },
        components: {
            'department': department,
            'equ_nameSelect': equ_nameSelect,
            'equ_typeSelect': equ_typeSelect,
            'manufactur': manufactur
        },
        activated: function () {
            this.created && this.pageInfo();
            this.created = true;
        },
        mounted(){
            this.pageInfo();
        },
        methods: {
            /*列表渲染*/
            pageInfo () {
                let vm = this;
                this.$axios.post('/eamDo/outRepairList', {
                    page: this.workForm.page,
                    pageSize: this.workForm.pageSize,
                    repairDeptId: this.workForm.repairDeptId, //报修部门id
                    equipmentId: this.workForm.equipmentId, //设备id
                    equipmentModelId: this.workForm.equipmentModelId, //设备型号id
                    repairperson: this.workForm.repairperson, //报修人
                    faultDesc: this.workForm.faultDesc, //故障关键字
                    repairStart: this.workForm.repairStart, //报修时间开始
                    repairEnd: this.workForm.repairEnd, //报修时间结束
                    equManufacturerId: this.workForm.equManufacturerId, //设备制造商id
                }).then((res) => {
                    let code = res.data.response.code;
                    if (code === 1) {
                        let eamSwInfo = res.data.response.data.rows;//当前返回的结果
                        vm.numMaterial = res.data.response.data.total;
                        for (let i in eamSwInfo) {
                            let obj = {};
                            obj.outRepairId = eamSwInfo[i].outRepairId;
                            obj.odId = eamSwInfo[i].odId;
                            obj.doStatus = eamSwInfo[i].doStatus;
                            obj.doBillNo = eamSwInfo[i].doBillNo;
                            obj.repairCost = eamSwInfo[i].repairCost;
                            obj.repairDept = eamSwInfo[i].repairDept;
                            obj.faultDesc = eamSwInfo[i].faultDesc;
                            obj.equipmentName = eamSwInfo[i].equipmentName;
                            obj.reporter = eamSwInfo[i].reporter;
                            obj.reportTime = eamSwInfo[i].reportTime;
                            obj.manufacturer = eamSwInfo[i].manufacturer;
                            obj.model = eamSwInfo[i].model;
                            obj.installationLocationName = eamSwInfo[i].installationLocationName;
                            obj.roles = eamSwInfo[i].roles;
                            vm.standardData.push(obj);
                        }
                    } else {
                        //.. 业务失败的情况
                        this.$Message.error({
                            content: '数据返回错误',
                            duration: 5,
                            closable: true
                        });
                    }
                }).catch((err) => {
                    console.log("无数据 + " + err);
                });
            },
            searchResult:function () {
                this.workForm.page = 1;
                this.pageInfo();
            },
            changePage:function (currentPage) {
                this.workForm.page = currentPage;
                this.pageInfo();
            },
            /*时间大小比较*/
            //开始时间应该小于结束时间
            changeCreateAtS: function (date) {
//                console.log(date);
                let stime = date;
                if (this.workForm.repairEnd != '') {
                    if (stime > this.workForm.repairEnd) {
                        this.notFitDataTip = '开始时间应在结束时间之前';
                        this.$Message.error(this.notFitDataTip);
                    }
                    else {
                        this.notFitDataTip = ""
                    }
                }
                this.workForm.repairStart = date;
            },
            //            结束时间应该大于开始时间
            changeCreateAtE: function (date) {
                let etime = date;
                if (this.workForm.repairStart != '') {
                    if (etime < this.workForm.repairStart) {
                        this.notFitDataTip = '结束时间应在开始时间之后';
                        this.$Message.error(this.notFitDataTip);
                    }
                    else {
                        this.notFitDataTip = ""
                    }
                }
                else {
                    this.notFitDataTip = '请先选择开始时间';
                    this.$Message.error(this.notFitDataTip);
                }
                this.workForm.repairEnd = etime;
            },

            //查询时验证输入框不能为英文单双引号
            toValidate(msg) {
//                console.log(msg);
                let str = /[=+%!<>"'/_,()\\]/;
                if (str.test(msg)) {
                    this.$Message.warning("输入格式错误");
                    msg = msg.replace(/\'/g,"").replace(/\"/g,"").replace(/\+/g,"").replace(/\=/g,"").replace(/\%/g,"").replace(/\!/g,"").replace(/\</g,"").replace(/\>/g,"").replace(/\//g,"").replace(/\_/g,"").replace(/\,/g,"").replace(/\(/g,"").replace(/\)/g,"").replace(/\\/g,"");
                }
                return msg;
            },
            /*部门相关*/
            //选择部门
            dept_hasSelected(msg) {
                this.selectedDept = msg;
            },
            //选中部门
            toSelect_dept() {
                this.workForm.department = this.selectedDept.tBdDepartmentName;
                this.workForm.repairDeptId = this.selectedDept.tBdDepartmentId;
            },
            //删除使用部门
            emptyDept() {
                this.workForm.department = '';
                this.workForm.repairDeptId = '';
            },
            /*设备名称相关*/
            name_hasSelected(msg) {
                this.equNameSelected = msg;
            },
            toSelect_equName() {
                this.workForm.equpName = this.equNameSelected.equipmentName;
                this.workForm.equipmentId = this.equNameSelected.equipmentId;
            },
            /*设备型号相关*/
            type_hasSelected(msg) {
                this.equTypeSelected = msg;
            },
            toSelect_equType() {
                this.workForm.equpModel = this.equTypeSelected.modelName;
                this.workForm.equipmentModelId = this.equTypeSelected.modelId;
            },
            /*设备制造商*/
            manuf_hasSelected(msg) {
                this.equManufSelected = msg;
            },
            toSelect_manuf() {
                this.workForm.equpManufacturer = this.equManufSelected.tBdEquipmentManufacturerName;
                this.workForm.equManufacturerId = this.equManufSelected.tBdEquipmentManufacturerId;
            },
            /*查看委外验收单*/
            goOutsourcedReceipt(id,flag) {
                this.$router.push({path: 'outScourcedReceipt', query:{id: id,flag:flag}})
            }
        }
    }
</script>
