<template>
    <div class="basic fault-content">
        <Spin fix v-show="load_fix">
            <Icon type="load-c" size=18  class="demo-spin-icon-load"></Icon>
            <div>处理中，请稍后...</div>
            <!--<div>{{this.load_fix_info}}</div>-->
        </Spin>
        <!--模块名称-->
        <div class="title">
            <span>计划管理-审核查看（{{this.planAddForm.controlTypeName}}）</span>
        </div>
        <div class="second-title">审核记录</div>
        <div class="form-content">
            <Form ref="auditForm" :model="auditForm" label-position="right" inline :label-width="100">
                <Form-item label="审核状态" prop="auditStatus">
                    <Input v-model="auditForm.auditStatus" style="width: 160px;" placeholder="" disabled></Input>
                </Form-item>
                <Form-item label="最新反馈日期" prop="auditStatus">
                    <Date-picker v-model="auditForm.feedbackTime" type="datetime" placeholder="选择日期和时间"
                                 style="width: 160px" disabled readonly></Date-picker>
                </Form-item>
            </Form>
            <div style="overflow: hidden;margin-top: 10px;">
                <div class="table-content">
                    <Table class="mar-b-15 table-edit" stripe border :columns="auditColumns" :data="auditData"></Table>
                </div>
                <div class="page" style="margin: 0;">
                    <Page :total="auditTotal" :current="auditPage" size="small" show-elevator :page-size="5"
                          @on-change="auditChange"></Page>
                </div>
            </div>
        </div>


        <div class="second-title">计划详情</div>
        <!--表单-->
        <div class="form-content">
            <Form ref="planAddForm" :model="planAddForm" label-position="right" inline :label-width="120">
                <Form-item label="计划编码" prop="code">
                    <Input v-model="planAddForm.code" style="width: 160px;" placeholder="" disabled></Input>
                </Form-item>
                <Form-item label="计划名称" prop="name">
                    <Input v-model="planAddForm.name" style="width: 160px;" placeholder="" disabled></Input>
                </Form-item>
                <Form-item label="计划类型" prop="typeName">
                    <Input v-model="planAddForm.typeName" style="width: 160px;" placeholder="" disabled></Input>
                </Form-item>
                <Form-item label="计划等级" prop="clazzName">
                    <Input v-model="planAddForm.clazzName" style="width: 160px;" placeholder="" disabled></Input>
                </Form-item>
                <Form-item label="计划状态" prop="status">
                    <Input v-model="planAddForm.statusName" style="width: 160px;" placeholder="" disabled></Input>
                </Form-item>
                <Form-item label="耗时累计（分钟）" prop="estimatedTime">
                    <Input v-model="planAddForm.estimatedTime" style="width: 160px;" placeholder="" disabled></Input>
                </Form-item>
                <Form-item label="制单人" prop="createBy">
                    <Input v-model="planAddForm.createBy" style="width: 160px;" placeholder="" disabled></Input>
                </Form-item>
                <Form-item label="制单日期" prop="createAt">
                    <Date-picker v-model="planAddForm.createAt" type="datetime" placeholder="选择日期和时间"
                                 style="width: 160px" disabled readonly></Date-picker>
                </Form-item>
                <Form-item label="最后修改人" prop="updateBy">
                    <Input v-model="planAddForm.updateBy" style="width: 160px;" placeholder="" disabled></Input>
                </Form-item>
                <Form-item label="最后修改日期" prop="updateAt">
                    <Date-picker v-model="planAddForm.updateAt" type="datetime" placeholder="选择日期和时间"
                                 style="width: 160px" disabled readonly></Date-picker>
                </Form-item>
                <Form-item v-show="planAddForm.controlTypeCode==0" label="计划年份" prop="planTime">
                    <Input v-model="planAddForm.planTime" :open="false" placeholder="选择日期"
                                 style="width: 160px" disabled></Input>
                </Form-item>
                <Form-item v-show="planAddForm.controlTypeCode==1" label="计划月份" prop="planTime">
                    <Input v-model="planAddForm.planTime" :open="false"  placeholder="选择日期"
                                 style="width: 160px" disabled></Input>
                </Form-item>
                <Form-item v-show="planAddForm.controlTypeCode==2||planAddForm.controlTypeCode==3" label="计划日期" prop="planTime">
                    <Input v-model="planAddForm.planTime" :open="false" placeholder="选择日期"
                                 style="width: 160px" disabled></Input>
                </Form-item>
                <Form-item v-show="planAddForm.controlTypeCode==0" label="年度金额（万元）" prop="yearSum">
                    <InputNumber v-model="planAddForm.estimatedMoney" :min="1" style="width: 160px;"
                                 disabled></InputNumber>
                </Form-item>
                <Form-item v-show="planAddForm.controlTypeCode==1" label="月度金额（万元）" prop="yearSum">
                    <InputNumber v-model="planAddForm.estimatedMoney" :min="1" style="width: 160px;"
                                 disabled></InputNumber>
                </Form-item>
                <Form-item v-show="planAddForm.controlTypeCode==2" label="当日金额（万元）" prop="yearSum">
                    <InputNumber v-model="planAddForm.estimatedMoney" :min="1" style="width: 160px;"
                                 disabled></InputNumber>
                </Form-item>
                <Form-item v-show="planAddForm.controlTypeCode==3" label="计划金额（万元）" prop="yearSum">
                    <InputNumber v-model="planAddForm.estimatedMoney" :min="1" style="width: 160px;"
                                 disabled></InputNumber>
                </Form-item>
                <!--<span class="ivu-form-item" style="margin: 15px -8px;font-size: 15px;cursor: pointer;color: #0391da;" @click="account = true"><Icon type="information-circled"></Icon>（金额计算说明）</span>-->
                <!--<Form-item label="责任班组" prop="teamName">
                    <Input v-model="planAddForm.teamName" style="width: 160px;" placeholder="" disabled></Input>
                </Form-item>-->
            </Form>
        </div>
        <div class="second-title"></div>
        <Table class="mar-b-15 table-edit" stripe border :columns="columns_work" :data="data_work"></Table>
        <div class="f_r mar-r-20 font-18 col-blue">总金额：<span class="col-orange">{{price_sum}}</span> 元</div>

        <div class="second-title">计划时间</div>
        <YDetail v-if="planAddForm.controlTypeCode === 0" :state="planAddForm.statusCode" :from="from" :theState="theState"></YDetail>
        <MDetail v-else-if="planAddForm.controlTypeCode === 1" :state="planAddForm.statusCode" :from="from" :theState="theState"></MDetail>
        <DDetail v-else-if="planAddForm.controlTypeCode === 2" :from="from"></DDetail>
        <TDetail v-else-if="planAddForm.controlTypeCode === 3" :state="planAddForm.statusCode" :from="from" :theState="theState"></TDetail>
        <!--操作按钮-->
        <Row class="btn-group">
            <Col class="pad-15" span="24" align="center">
            <Button class="btn-gary" icon="close" size="large" @click="goHistory">返回</Button>
            <Button v-if="planAddForm.statusCode==1&&workItemId" type="primary" icon="compose" size="large" :loading="cannot_loading" @click="adviseModal=true">驳回</Button>
            <Button v-if="planAddForm.statusCode==1&&workItemId" type="primary" icon="checkmark" size="large" :loading="agree_loading" @click="planApprove()">审核通过
            </Button>
            <Button  v-if="if_edit" type="primary" icon="compose" size="large" v-show="planAddForm.statusCode!=2&&theState==0" @click="goPlandDetailEdit()">编辑</Button>
            <!--<Button v-show="button_14424" type="primary" icon="trash-a" size="large" @click="deletePlan">删除</Button>-->
            </Col>
        </Row>
        <Modal v-model="device_code" title="适用设备">
            <Table stripe border :columns="columns_device" :data="data_device"></Table>
        </Modal>
        <Modal v-model="work_code" title="抑制作业">
            <Table stripe border :columns="columns_work2" :data="data_work2"></Table>
        </Modal>

        <!--kp:-->
        <!--驳回建议:-->
        <Modal v-model="adviseModal" title="驳回" :styles="{top: '120px'}"  :loading="cannot_loading" @on-ok="planRejected">
            <p style="text-align: center;margin: 10px 0;">驳回意见:</p>
            <Input v-model="advise" type="textarea"
                   :maxlength="500"
                   @on-change="lengthChange(advise,500)"
                   :autosize="{minRows: 6,maxRows: 6}"
                   placeholder="请输入..."></Input>

        </Modal>
        <Modal v-model="account" title="金额计算方式">
            <p>金额计算方式：</p>
        </Modal>
    </div>
</template>
<script>
    import MDetail from "./monthDetail.vue";
    import DDetail from "./dayDetail.vue";
    import YDetail from "./yearDetail.vue";
    import TDetail from "./temporaryDetail.vue";
    export default {
        components: {
            MDetail: MDetail,
            DDetail: DDetail,
            YDetail: YDetail,
            TDetail: TDetail,
        },
        data (){
            //验证名称
            const validateAge = (rule, value, callback) => {

            };
            return {
                /*权限校验 start*/
//                if_edit:  this.$rt(this.authJson.EAM.计划管理.详情页.编辑),
                if_edit:  true,

                /*权限校验 end*/
                //kp--start

                from: "audit",
                advise:"",
                adviseModal:false,
                agree_loading:false,
                cannot_loading:false,
                account:false,
                //kp--end

                planId: '',
                workItemId: '',
                titles: '',
                auditForm: {
                    auditStatus: '',
                    feedbackTime: ''
                },
                auditColumns: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 80,
                        align: 'center'
                    },
                    {
                        title: '反馈结果',
                        key: 'processResult',
                        align: 'center',
                    },
                    {
                        title: '驳回意见',
                        key: 'rejectadvise',
                        align: 'center',
                        render: (h, params) => {
                            return h('p', {
                                domProps: {
                                    title: params.row.rejectAdvice
                                },
                                class: 'iview_tabDis',
                            }, params.row.rejectAdvice)
                        },
                    },
                    {
                        title: '处理人',
                        key: 'processor',
                        align: 'center',
                        render: (h, params) => {
                            return h('p', {
                                domProps: {
                                    title: params.row.processor
                                },
                                class: 'iview_tabDis',
                            }, params.row.processor)
                        },
                    },
                    {
                        title: '处理日期',
                        key: 'processTime',
                        align: 'center',
                    },
                    {
                        title: '处理信息',
                        key: 'processMsg',
                        align: 'center',
                    },
                    {
                        title: '备注',
                        key: 'note',
                        align: 'center',
                        render: (h, params) => {
                            return h('p', {
                                domProps: {
                                    title: params.row.note
                                },
                                class: 'iview_tabDis',
                            }, params.row.note)
                        },
                    },
                ],
                auditData: [
//                    {
//                        approvalStatus: '待审核 ',
//                        processResult: '减少测试备件001消耗',
//                        rejectadvise: 'admin001',
//                        processor: '2017-10-22 13:12',
//                        processTime: '重新提交审核',
//                        processMsg: '已减少至最低理论消耗',
//                        note: ''
//                    },
                ],
                button_14411: this.$rt('14411'),
                button_14412: this.$rt('14412'),
                button_14424: this.$rt('14424'),
                taskId: '',
                load_fix: false,
                modal1: false,
                work_code: false,
                device_code: false,
                pageSize: 5,
                planAddForm: {
                    createAt: "",
                    createBy: "",
                    statusName: '',
                    code: "",
                    busiTypeName: '',
                    name: '',
                    teamName: '',
                    updateBy: '',
                    updateAt: '',
                    requiredTime: '',
                    firstStartTime: new Date(),
                    intervaltime: 1,
                    intervaltimeUnit: 'day',
                    nextStartTime: '2017-10-10',
                    planYear: '',
                    yearSum: 145,
                },

                columns_work: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 80,
                        align: 'center'
                    },
                    /*{
                     title: '设备选择',
                     key: 'device_id',
                     align: 'center',
                     render: (h, params) => {
                     return h('div', [
                     h('a', {
                     class: 'mar-r-5',
                     on: {
                     click: () => {
                     this.goViewPlan(params.row.device_id);
                     }
                     }
                     },params.row.device_id),
                     ]);
                     },
                     },*/
                    {
                        title: '设备选择',
                        key: 'tBdFactoryLocationName',
                        align: 'center',
                        render: (h, params) => {
                            return h('div', {class: 'iview_tabDis'},[
                                h('a', {
                                    domProps: {
                                        title: params.row.tBdFactoryLocationName
                                    },
                                    on: {
                                        click: () => {
                                            $('.menu-item').eq(6).addClass("ivu-menu-item-active ivu-menu-item-selected").siblings().removeClass('ivu-menu-item-active ivu-menu-item-selected')
                                            this.goViewEqu(params.row.tBdFactoryEquipmentId);
                                        }
                                    }
                                }, params.row.tBdFactoryLocationName),
                            ]);
                        },
                    },

                    /*{
                     title: '设备名称',
                     key: 'device_name',
                     align: 'center',
                     },
                     {
                     title: '标准方案编码',
                     key: 'work_id',
                     align: 'center',
                     },*/
                    {
                        title: '标准方案选择',
                        key: 'TEamStandardSolutionName',
                        align: 'center',
                        render: (h, params) => {
                            return h('div',{class: 'iview_tabDis'}, [
                                h('a', {
                                    domProps: {
                                        title: params.row.TEamStandardSolutionName
                                    },
                                    on: {
                                        click: () => {
                                            $('.menu-item').eq(1).addClass("ivu-menu-item-active ivu-menu-item-selected").siblings().removeClass('ivu-menu-item-active ivu-menu-item-selected')
                                            this.goViewPlan(params.row.versionId, params.row.TEamStandardSolutionId);
                                        }
                                    }
                                }, params.row.TEamStandardSolutionName),
                            ]);
                        },
                    },
                    {
                        title: '执行岗位',
                        key: 'exeRole',
                        align: 'center',
                        render: (h, params) => {
                            return h('p', {
                                domProps: {
                                    title: params.row.exeRole
                                },
                                class: 'iview_tabDis',
                            }, params.row.exeRole)
                        },
                    },
                    {
                        title: '版本',
                        key: 'version',
                        align: 'center',
                    },
                    {
                        title: '是否停机',
                        key: 'needShutdown',
                        align: 'center',
//                        render: (h,params)=> {
//                            return h('i-switch', {props:{ vModel : params.row.device_on, disabled: true,value:params.row.device_on}},[
//                                h('span',{slot : 'open'} ,'是'),
//                                h('span',{slot : 'close'} ,'否'),
//                            ])
//                        },
                    },
                    {
                        title: '预计耗时（分钟）',
                        key: 'requiredTime',
                        align: 'center',
                        render: (h, params) => {
                            return h('p', {
                                domProps: {
                                    title: params.row.requiredTime
                                },
                                class: 'iview_tab_numDis',
                            }, params.row.requiredTime)
                        },
                    },
                    {
                        title: '备件金额（元）',
                        key: 'sparePartCost',
                        align: 'center',
                        render: (h, params) => {
                            return h('p', {
                                domProps: {
                                    title: params.row.sparePartCost
                                },
                                class: 'iview_tab_numDis',
                            }, params.row.sparePartCost)
                        },
                    },
//                    {
//                        title: '操作',
//                        key: 'action',
//                        align: 'center',
//                        render: (h, params) => {
//                            return h('div', [
//                                h('a', {
//                                    class: 'mar-r-5',
//                                }, '删除'),
//                            ]);
//                        },
//                    },

                ],
                data_work: [
//                    {
//                        device_id:'',
//                        device_name:'',
//                        work_id: '',
//                        work_name: '',
//                        version: '',
//                        quarters: '测试岗位',
//                        device_on: '',
//                    }
                ],

                columns_device: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center',
                    },
                    {
                        title: '序号',
                        type: 'index',
                        width: 80,
                        align: 'center',
                    },
                    {
                        title: '设备编码',
                        key: 'code',
                    },
                    {
                        title: '设备名称',
                        key: 'name',
                    },
                ],
                data_device: [
                    {
                        code: 'M001',
                        name: '压铸岛1号设备',
                    },
                    {
                        code: 'M001',
                        name: '压铸岛1号设备',
                    },
                    {
                        code: 'M001',
                        name: '压铸岛1号设备',
                    },
                ],


                columns_work2: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center',
                    },
                    {
                        title: '序号',
                        type: 'index',
                        width: 80,
                        align: 'center',
                    },
                    {
                        title: '作业编码',
                        key: 'code',
                    },
                    {
                        title: '作业名称',
                        key: 'name',
                    },
                ],
                data_work2: [
                    {
                        code: 'M001',
                        name: '压铸岛1号设备',
                    },
                    {
                        code: 'M001',
                        name: '压铸岛1号设备',
                    },
                    {
                        code: 'M001',
                        name: '压铸岛1号设备',
                    },
                ],


                /*计划周期*/
                periodUnitType: [
                    {
                        code: 0,
                        name: "每天",
                    },
                    /*{
                     code: 1,
                     name: "每周",
                     },*/
                    {
                        code: 2,
                        name: "每月",
                    },
                    {
                        code: 3,
                        name: "每季度",
                    },
                    {
                        code: 4,
                        name: "每年",
                    },
                ],

                allColumns: [
                    {
                        title: '序号',
                        type: 'index',
                        align: 'center',
                        width: 80,
                    },
                    {
                        title: '执行日期',
                        key: 'execDate',
                        align: 'center',
                    },
                    {
                        title: '执行时间',
                        key: 'duration',
                        align: 'center',
                    },
                    {
                        title: '执行时间段',
                        key: 'execTime',
                        align: 'center',
                    },
                    {
                        title: '操作',
                        key: 'action',
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('a', {
                                    class: 'mar-r-5',
                                    on: {
                                        click: () => {
                                            this.modalE = true;
                                            this.tpmTaskId = params.row.taskId;
                                            this.delPlan(params.row.taskId);
                                        }
                                    }
                                }, '作废'),
                            ]);
                        },
                    },
                ],
                allData: [
                    {
                        execDate: '星期一',
                        execTime: '',
                        duration: '03:00',
                    },
                    {
                        execDate: '星期二',
                        execTime: '',
                        duration: '03:00',
                    },
                    {
                        execDate: '星期三',
                        execTime: '',
                        duration: '03:00',
                    },
                ],


                tpmPlanSchedule: {},

                date: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 80,
                        align: 'center'
                    },
                    {
                        title: '计划时间',
                        key: 'happenTime',
                        align: 'center',
                    },
                ],
                data_date: [],
                data_date_total: 0,
                price_sum: 0,
                auditPage: 1,
                auditTotal: 0,
                theState:""
            }
        },
        mounted(){
            this.theState=this.$route.query.samePerson;
            this.workItemId = this.$route.query.workItemId;
            this.planId = this.$route.query.planTaskId;
            this.initDetail();
            this.getPlanDetail();
            this.getAuditData();
//            if(this.$route.query.planId) {
//                this.searchPlanDetailByPlanId(this.$route.query.planId);
////                this.getPlanNoScheduleByPlanId(this.$route.query.planId);
//            }else if(this.$route.query.planTaskId) {
//                this.searchPlanDetail(this.$route.query.planTaskId);
////                this.getPlanNoScheduleByTaskId(this.$route.query.planTaskId);
//            }else {
//                this.$Message.error("页面有错误！")
//            }
        },
        methods: {
            /***************初始化数据 计划详情和计划任务 xulin****************/
            initDetail(){
                this.$axios.post('/plan/searchPlanById', {
                    id: this.planId
                }).then((res) => {
                    let ret = res.data.response;
                    console.log(ret);
                    if (ret.code != 1) {
                        this.$Message.error(ret.msg);
                    } else {
                        this.planAddForm = ret.data;
                    }
                }).catch((err) => {
                    console.log(err);
                })

            },
            getPlanDetail(){ //查看计划详情
                let vt = this;
                this.$axios.post('/plan/getEamPlanTaskByEamPlanId', {
                    eamPlanId: this.planId,
                }).then((res) => {
                    let result = res.data.response;
                    console.log(result)
                    if (result.code === 1) {
                        vt.data_work = result.data;
//                        vt.price_sum = 0;
                        for (var i = 0; i < vt.data_work.length; i++) {
                            vt.data_work[i].versions = vt.data_work[i].TEamStandardSolutionVersionVo;
                            vt.data_work[i].version = vt.data_work[i].TEamStandardSolutionVersionVo[vt.data_work[i].TEamStandardSolutionVersionVo.length - 1].version;
                            vt.data_work[i].versionId = vt.data_work[i].TEamStandardSolutionVersionVo[vt.data_work[i].TEamStandardSolutionVersionVo.length - 1].eamStandardSolutionVersionId;
                            vt.data_work[i].needShutdown = vt.data_work[i].TEamStandardSolutionVersionVo[vt.data_work[i].TEamStandardSolutionVersionVo.length - 1].needShutdown == 0 ? '是' : '否';
                            vt.data_work[i].requiredTime = vt.data_work[i].TEamStandardSolutionVersionVo[vt.data_work[i].TEamStandardSolutionVersionVo.length - 1].requiredTime;
                            if (vt.data_work[i].sparePartCost) {
                                vt.price_sum = Number(vt.price_sum) * 1000000000000 + Number(vt.data_work[i].sparePartCost) * 1000000000000;
                                vt.price_sum = (vt.price_sum / 1000000000000).toFixed(2);
                            }
                            ;
                        }
                        ;
                    } else {
                        vt.$Message.error("错误 +" + result.msg);

                    }
                }).catch((err) => {
                });
            },
            //审核记录
            getAuditData(){
                this.$axios.post('/plan/planAuditDetail', {
                    page: this.auditPage,
                    pageSize: 5,
                    planId: this.planId
                }).then((res) => {
                    let ret = res.data.response;
                    console.log(ret);
                    if (ret.code != 1) {
                        this.$Message.error(ret.msg);
                    } else {
                        this.auditData = ret.data.rows;
                        this.auditTotal = ret.data.count;
                        this.auditForm.feedbackTime = ret.data.newProcessTime
                        this.auditForm.auditStatus = this.$base_info.getDescByCode(ret.data.approvalStatus, this.$base_info.planStatus);
                        //processResult
                        for(var i in this.auditData){
                            this.auditData[i].processResult = this.$base_info.getDescByCode(ret.data.rows[i].processResult, this.$base_info.planStatus);
                        }
//                        this.auditForm.auditStatus = ret.data.rows[0].approvalStatus
                    }
                }).catch((err) => {
                    console.log(err);
                })
            },
            auditChange(page){
                this.auditPage = page;
                this.getAuditData();
            },
            //返回：
            goHistory(){
                this.$router.push({path: '/maintenancePlan', query: {"toLable": "auditList"}});
            },
            lengthChange(i, len){
                if (i.length >= len) {
                    this.$Message.error('字数不能超过' + len)
                }
            },

            //驳回
            planRejected(){
                this.cannot_loading=true;
                this.$axios.post('/plan/planRejected', {
                    advise:this.advise,
                    planId: this.planId,
                    workItemId: this.workItemId
                }).then((res) => {
                    let ret = res.data.response;
                    console.log(ret);
                    if (ret.code != 1) {
                        this.cannot_loading=false;
                        this.$Message.error(ret.msg);
                    } else {
                        this.$Message.success('驳回成功！');
                        let vt=this;
                        setTimeout(() => {
                            vt.$router.push({path: '/maintenancePlan', query: {"toLable": "auditList"}});
                        }, 1000);
                    }
                }).catch((err) => {
                    console.log(err);
                })
            },
            //审核通过
            planApprove(){

                this.agree_loading=true;
                let data = [];
                data.push({
                    planId: this.planId,
                    workItemId: this.workItemId,
                    advise:"",
                })
                this.$axios.post('/plan/planApprove', data).then((res) => {
                    let ret = res.data.response;
                    if (ret.code != 1) {
                        this.$Message.error(ret.msg);
                        this.agree_loading=false;
                    } else {
                        this.$Message.success('审核通过！');
                        this.agree_loading=false;
                        let vt=this;
                        setTimeout(() => {
                            vt.$router.push({path: '/maintenancePlan', query: {"toLable": "auditList"}});
                        }, 1000);
                    }
                }).catch((err) => {
                    console.log(err);
                })
            },
            /***************初始化数据 计划详情和计划任务 xulin end****************/
            addWorkflow: function () {
                this.data_workflow.push(this.new_data_workflow);
                // 添加完newPerson对象后，重置newPerson对象
            },
            addMaterial: function () {
                this.data_material.push(this.new_data_material);
                // 添加完newPerson对象后，重置newPerson对象
            },
            del: function (index) {
                // 删一个数组元素
                this.date.splice(index, 1);
            },
            getTr: function (selection, row, index) {
                console.log(selection);
            },
            getPlanNoScheduleByTaskId: function (taskId) {
                let vm = this;
                this.$axios.post('/tpmPlan/getPlanNoScheduleByTaskId', {taskId: taskId}).then((res) => {
                    let res_data = res.data.response.data;
                    vm.data_date = res_data.Rows;
                    vm.data_date_total = res_data.Total;
                });
            },
            getPlanNoScheduleByPlanId: function (planId) {
                let vm = this;
                this.$axios.post('/tpmPlan/getPlanNoScheduleByPlanId', {planId: planId}).then((res) => {
                    let res_data = res.data.response.data;
                    vm.data_date = res_data.Rows;
                    vm.data_date_total = res_data.Total;
                });
            },
            searchPlanDetail(taskId) {
                let vm = this;
//                console.log("searchPlanDetail stating ......."+taskId);
                this.$axios.post('/tpmPlan/' + taskId + '/taskDetail').then((res) => {
                    if (res.data.response.code != 1) {
                        this.$Message.error("无效的计划，页面有错误！");
                        this.button_14411 = false;
                        return;
                    }
                    var result = res.data.response.data;
                    vm.initDetail(result);
                }).catch((err => {
                    console.log(err);
                }))
            },
            searchPlanDetailByPlanId(planId) {
                let vm = this;
                console.log("searchPlanDetail by planId stating ......." + planId);
                this.$axios.post('/tpmPlan/' + planId + '/detail').then((res) => {
                    if (res.data.response.code != 1) {
                        this.$Message.error("无效的计划，页面有错误！")
                        return;
                    }
                    var result = res.data.response.data;
                    vm.initDetail(result);
                }).catch((err => {
                    console.log(err);
                }))
            },
//            initDetail: function (result) {
//                let vm = this;
//                vm.taskId = result.taskId;
//                /*第一块数据------计划*/
//                vm.planAddForm = result.tpmPlan;
//                vm.planAddForm.teamName = result.tpmPlan.bdTeam.teamName;
//                let str = result.requiredTime;
//                str = str.substr(0,str.indexOf('/'))
//                vm.planAddForm.requiredTime =  str; //result.requiredTime;
//                vm.planAddForm.createBy = result.createBy_name;
//                vm.planAddForm.updateBy = result.updateBy_name;
//                if (result.tpmPlan.statusName === '制单中') {
//                    vm.button_14411 = true;
//                } else {
//                    vm.button_14411 = false;
//                }
//                if (result.tpmPlan.statusName === '已失效') {
//                    vm.button_14424 = false;
//                } else {
//                    vm.button_14424 = true;
//                }
//                /*第二块数据-----当前任务对应计划下所有的任务*/
//                var tpmPlanTaskList = result.tpmPlanTaskList;
//                vm.data_work = new Array();
//                for (var i in tpmPlanTaskList) {
//                    let obj = {};
//                    obj["device_id"] = tpmPlanTaskList[i].bdEquipment.equipmentCode;
//                    obj["device_name"] = tpmPlanTaskList[i].bdEquipment.equipmentName;
//                    obj["work_id"] = tpmPlanTaskList[i].tpmStandardSolution.code;
//                    obj["work_name"] = tpmPlanTaskList[i].tpmStandardSolution.name;
//                    obj["version"] = tpmPlanTaskList[i].tpmStandardSolutionVersion.version;
//                    obj["device_on"] = tpmPlanTaskList[i].needShutdownValue; //needShutdown; //needShutdownValue;  open close
//                    vm.data_work.push(obj);
//                }
//
//                /*第三块数据<计划调度---按频率>*/
//                vm.tpmPlanSchedule = result.tpmPlanSchedule;
//                vm.savePlanScheduleHappenTime();
//            },
            savePlanScheduleHappenTime: function () {
                let today = new Date(this.$fc.dateFormat(this.tpmPlanSchedule.happenTime));
                today.setHours(0);
                today.setMinutes(0);
                today.setSeconds(0);
                switch (this.tpmPlanSchedule.periodUnit) {
                    case 0:/*小时*/
                        today.setHours(today.getHours() + Number(this.tpmPlanSchedule.period));
                        break;
                    case 1:/*天*/
                        today.setDate(today.getDate() + Number(this.tpmPlanSchedule.period));
                        break;
                    case 2:/*周*/
                        today.setDate(today.getDate() + Number(this.tpmPlanSchedule.period) * 7);
                        break;
                    case 3:/*月*/
                        today.setMonth(today.getMonth() + Number(this.tpmPlanSchedule.period));
                        break;
                    case 4:/*季度*/
                        today.setMonth(today.getMonth() + Number(this.tpmPlanSchedule.period) * 3);
                        break;
                    case 5:/*年*/
                        today.setFullYear(today.getFullYear() + Number(this.tpmPlanSchedule.period));
                        break;
                }
                this.tpmPlanSchedule["nextHappenTime"] = today;
            },
            goPlandDetailEdit() {//计划详情编辑页
                this.$router.push({path: '/planAdd', query: {"planTaskId": this.planId}});
            },

            goViewPlan(tpmSSVId, tpmssId) {//计划详情
                this.$router.push({path: '/standardworkedit', query: {'id': tpmSSVId, "flag": 0, "tpmssId": tpmssId}});
            },
            goViewEqu(id) {//计划详情
                this.$router.push({path: '/equipmentDetail', query: {from: 'toDetail', itemId: id , flag : 0}});
            },


            /************************************   作废   start  ******************************************/
            deletePlan: function () {
                let vm = this;
                this.$axios.post('tpmPlan/deletePlan', {
                    tpmPlanId: vm.planAddForm.id,
                }).then((res) => {
                    let code = res.data.response.code;
                    if (code == 1) {
                        this.load_fix_info = '保存中，请稍候......';
                        this.load_fix = true;
                        setTimeout(function () {
                            vm.$router.push({path: '/maintenancePlan', query: {"date": new Date()}});
                        }, 1000);
                    } else {
                        vm.$Message.error("删除失败！");
                    }
                });
            },
            /************************************   作废   end  ******************************************/
        },
    }
</script>

<style>
    .demo-spin-icon-load {
        animation: ani-demo-spin 1s linear infinite;
    }

    @keyframes ani-demo-spin {
        from {
            transform: rotate(0deg);
        }
        50% {
            transform: rotate(180deg);
        }
        to {
            transform: rotate(360deg);
        }
    }

    .demo-spin-col {
        height: 100px;
        position: relative;
        border: 1px solid #eee;
    }
</style>
