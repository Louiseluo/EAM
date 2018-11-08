<template>
    <div style="position:relative;" class="basic fault-content">
        <!-- /*"已制单":0,"已派工":1,"已通知":2,"已接单":3,"已拒单":4,"已领件":5,"缺件暂停":6,"已下发":7,"执行中":8,"已签入":9,"已签出":10,"已完成":11,"待派工":12,"待仲裁":13,"已取消":14,"已归档":15,*/-->
        <!--模块名称-->
        <div class="title">
            <span>保养工单执行流程--{{order_Form.billStatusStr}}</span>
        </div>
        <div class="titleLogo"><img style="width: 100%;height: 100%;" :src="logoSrc"></div>
        <div style="overflow: hidden;">
            <h3 class="f_l">保养工单号：</h3>
            <div class="f_l text-center">
                <img v-if="imgAddr!=''" :src="'/static'+ imgAddr" alt="" height="50" width="300">
                <div>{{docTypeCode}}</div>
            </div>
        </div>
        <!--表单-->
        <div class="secondSteps" v-show="order_Form.billStatus == 2">
            <ul class="secondStepsUl">
                <li  v-for="(item,index) in secondStepsData" :class="item.liClass">{{item.content}}</li>
            </ul>
        </div>
        <div class="form-content">
            <Form ref="order_Form" :model="order_Form" label-position="right" inline :label-width="135" >
                <div class="second-title">基本信息</div>
                <Form-item label="工单编码">
                    <Input v-model="order_Form.billNo" :title="order_Form.billNo" style="width: 160px;" disabled></Input>
                </Form-item>
                <Form-item label="工单类型">
                    <Input v-model="order_Form.billType" style="width: 160px;" disabled></Input>
                </Form-item>
                <Form-item label="工单状态">
                    <Input v-model="order_Form.billStatusStr" style="width: 160px;" disabled></Input>
                </Form-item>
                <Form-item label="保养方案">
                    <Input v-model="order_Form.standardSolution" style="width: 160px;" disabled></Input>
                </Form-item>
                <Form-item label="版本">
                    <Input v-model="order_Form.sopVersion" style="width: 160px;" disabled></Input>
                </Form-item>
                <Form-item label="工单执行日期">
                    <Input v-model="order_Form.doActualStartTime" style="width: 160px;" disabled></Input>
                </Form-item>
                <!--<Form-item label="提醒提前期（天）">
                    <Input v-model="order_Form.notifyTime" style="width: 160px;" disabled></Input>
                </Form-item>
                <Form-item label="下发提前期（天）">
                    <Input v-model="order_Form.doActualStartTime" style="width: 160px;" disabled></Input>
                </Form-item>-->
                <!--<Form-item label="上报计划编码">
                    <Input v-model="order_Form.submitPlanCode" placeholder="超链接" style="width: 160px;" disabled></Input>
                </Form-item>-->
                <Form-item label="制单人">
                    <Input v-model="order_Form.createBy"  style="width: 160px;" disabled></Input>
                </Form-item>
                <Form-item label="制单日期">
                    <DatePicker type="date" v-model="order_Form.createAt" placeholder="选择日期" disabled style="width: 160px;"></DatePicker>
                </Form-item>
            </Form>
        </div>
        <!--备品备件---start-->

        <Tabs type="card">
            <Tab-pane class="checkTab" label="目标设备" icon="social-buffer">
                <Table class="mar-b-15" stripe border :columns="targetEquipment" :data="targetEquData"></Table>
            </Tab-pane>
            <Tab-pane class="checkTab" label="保养项目" icon="social-buffer">
                <Table class="mar-b-15 table-edit" stripe border :columns="maintainColumns" :data="maintainData"></Table>
                <!--<Table class="table-edit" stripe border :columns="standardColumns" :data="tpmStandardSolutionActionTmp"></Table>-->
            </Tab-pane>
        </Tabs>
        <div class="second-title">派工信息</div>
        <div >
            <table class="table table-bordered table-center table-striped table-blue table-edit table-standWork taDisplay">
                <thead>
                <tr>
                    <th>序号</th>
                    <th>姓名</th>
                    <th>编码</th>
                    <th>卡号</th>
                    <th>岗位</th>
                    <th>班组</th>
                    <th>绩效占比（%）</th>
                    <!--<th>计划保养时长(分钟)</th>-->
                    <th>当前保养工单数</th>
                    <th>当前维修工单数</th>
                    <th>操作</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item,index) in dispatchData" class="trDisplay">
                    <td>{{index + 1}}</td>
                    <td :title="item.personName">
                        {{item.personName}}
                    </td>
                    <td class="tdDisplay pointDis" :title="item.personCode">
                        {{item.personCode}}
                    </td>
                    <td class="tdDisplay pointDis" :title="item.personCardNo">
                        {{item.personCardNo}}
                    </td>
                    <td class="tdDisplay pointDis" :title="item.positionName">
                        {{item.positionName}}
                    </td>
                    <td>{{item.teamName}}</td>
                    <td class="wid-10 num_right">
                        {{item.kpiRatio}}
                    </td>
                    <td class="wid-10 num_right">
                        {{item.orderCount}}
                    </td>
                    <td class="wid-10 num_right">
                        {{item.repairOrderCount}}
                    </td>
                    <td>
                        <a  v-if="order_Form.billStatus == 0 || order_Form.billStatus == 4" @click="delDispatchItem(index)">删除</a>
                        <a  v-else disabled>删除</a>
                    </td>
                </tr>
                </tbody>
            </table>
            <div class="tableHasNoData" v-show="!dispatchData"><p>暂无数据</p></div>
            <!--<Table class="mar-b-15" stripe border :columns="dispatchColumns" :data="dispatchData"></Table>-->
           <Button @click="dispatchMod = true" size="small" class="mar-t-10" v-show="order_Form.billStatus == 0 || order_Form.billStatus == 4|| (order_Form.billStatus == 13&&showAddMan)">添加主责任人</Button>
        </div>
        <!--备件领用记录-->
       <!--<div class="second-title mar-t-15">备件领用记录</div>
        <div style="overflow: hidden;">
            <Table class="mar-b-15" stripe border :columns="sparePartColumns" :data="sparePartData"></Table>
        </div>-->
        <!--备件领用记录 E -->
        <div class="second-title mar-t-15">工单流程执行记录</div>
        <div style="overflow: hidden;">
            <Table class="mar-b-15"  stripe border :columns="scrapColumns" :data="scrapData"></Table>
            <div class="page">
                <Page :total="ttPages" :current="curPage" size="small" show-elevator :page-size="5" @on-change="changePage3"></Page>
            </div>
        </div>
        <!--操作按钮-->
        <div align="center" class="btnGroupDesign">
            <!--<router-link :to="{ path: '/maintenanceOrder', query: {'title':listTitle,type:listStatus,orderFlag:0}}" v-if="rule_cancel">
                <Button type="primary" size="large">返回</Button>
            </router-link>-->
            <Button type="primary" size="large" @click="$router.go(-1)" v-if="rule_cancel">返回</Button>
            <!--<Button class="btn-gary" size="large">取消工单</Button>-->
            <Button type="primary" size="large" @click="dispatchStart(1)" v-show="order_Form.billStatus == 0" v-if="rule_PG">派工</Button>
            <Button type="primary" size="large" @click="dispatchStart(12)" v-show="order_Form.billStatus == 4" v-if="rule_ZXPG">重新派工</Button>
            <Button type="primary" size="large" @click="dispatchStart(13)" v-show="order_Form.billStatus == 13" v-if="rule_SJPG">上级派工</Button>
            <Button type="primary" size="large" @click="arbitrationMod = true" v-show="order_Form.billStatus == 4" v-if="rule_ZZC">转仲裁</Button>
            <Button type="primary" size="large" @click="cancelOrderMod = true" v-show="order_Form.billStatus == 13" v-if="rule_QXGD">取消工单</Button>

             <router-link v-if="rule_JieD" :to="{ path: 'orderSpareParts', query: {orderId:this.orderId,workItemId:this.workItemId,orderFlag:0,addflag:1,'title':this.listTitle,type:this.listStatus,}}" v-show="order_Form.billStatus == 1 || order_Form.billStatus == 2">
                <Button type="primary" size="large">接单</Button>
            </router-link>
            <!--<Button type="primary" size="large" v-show="showOrnot" v-if="rule_JuD" @click="rejectMod = true">拒单</Button>-->
            <Button type="primary" size="large" v-show="showOrnot" v-if="rule_JuD" @click="rejectMod = true">拒单</Button>
        </div>
        <!--图片-->
        <Modal title="查看图片" v-model="img_modal" width="800">
            <Carousel  loop style="width: 760px">
                <CarouselItem v-for="(imageItem,ind) in editUploadImagesAry" :key="ind" >
                    <div class="demo-carousel">
                        <div class="demo-upload-list" style="border: 1px solid #ccc;width: 400px;min-height:400px;margin: auto;display: flex;">
                            <img :src=" '../static/'+ imageItem.savePath" style="width:100%;height:100%;object-fit: cover;">
                        </div>
                        <p :title="imageItem.fileName" style="text-align: center;margin: 25px 0">{{imageItem.fileName}}</p>
                    </div>
                </CarouselItem>
            </Carousel>
        </Modal>

        <!--设备规格型号-->
        <Modal v-model="dispatchMod" title="人员选择" @on-ok="dispatchManSelected" width="1000">
            <div class="form-content">
                <Form>
                    <Form-item label="人员名称" prop="name">
                        <Input v-model="dispatch_name"  style="width: 160px"></Input>
                    </Form-item>
                </Form>
                <!--查询按钮-->
                <div style="text-align: right;padding-right: 20px">
                    <Button type="primary" icon="search" size="large" @click="dispatchManList">查询</Button>
                </div>
            </div>
            <div class="table-reset">
                <Table highlight-row border ref="currentRowTable" class="taDisplay" :columns="dispatchManColumns" :data="dispatchManData" @on-row-click="toSelectMan"></Table>
            </div>
            <div class="mar-t-10" style="overflow: hidden">
                <div style="float: right;">
                    <Page size="small" :total="dispatchManTotal" show-elevator :page-size="dispatchManPageSize" @on-change="dispatchManChange"></Page>
                </div>
            </div>
            <!--员工多选-->
            <!--<dispatch :mod_rightDisplay="dispatchProData" @sparePartsSetected="dispatchSelected"></dispatch>-->
        </Modal>
        <!--rejectMod-->
        <Modal v-model="rejectMod" title="拒单" @on-ok="dispatchOtherEdit(4)">
            <p>拒单理由：</p>
            <Input v-model="rejectReason" type="textarea" placeholder="" />
        </Modal>
        <Modal v-model="arbitrationMod" title="转仲裁" @on-ok="arbitration(arbitrationReason,13)">
            <p>转仲裁理由：</p>
            <Input v-model="arbitrationReason" type="textarea" placeholder="" />
        </Modal>
        <Modal v-model="cancelOrderMod" title="取消工单" @on-ok="arbitration(cancelOrderReason,14)">
            <p>取消工单理由：</p>
            <Input v-model="cancelOrderReason" type="textarea" placeholder="" />
        </Modal>
    </div>
</template>

<script>
    import dispatch_table from '../treeMulitiple/dispatch_table.vue';
    export default {
        components: {
            'dispatch': dispatch_table,
        },
        data (){
            return {
                /*                 "保养工单查看页":
                 {
                 "取消":"JSO0BXF0ZFJJF9PS0FB8",
                 "派工":"JSO0BXF0WUB7659TS6IP",
                 "接单":"JSO0BXF08RLYLQ4AB7P4",
                 "拒单":"JSO0BXF0Q7LPLFFOEJ32",
                 "转仲裁":"JSO0BXF02NCLIN492D7U",
                 "重新派工":"JSO0BXF045303FRW7GJ3",
                 "下发终端":"JSO0BXF0Z4QRJL539TYX",
                 "取消工单":"JSO0BXF0NGI14K107FVK"
                 }*/
                /*权限按钮*/
                rule_cancel:this.$rt(this.authJson.EAM.设备保养.保养工单查看页.取消),
                rule_PG:this.$rt(this.authJson.EAM.设备保养.保养工单查看页.派工),
                rule_JieD:this.$rt(this.authJson.EAM.设备保养.保养工单查看页.接单),
                rule_JuD:this.$rt(this.authJson.EAM.设备保养.保养工单查看页.拒单),
                rule_ZZC:this.$rt(this.authJson.EAM.设备保养.保养工单查看页.转仲裁),
                rule_SJPG:this.$rt(this.authJson.EAM.设备保养.保养工单查看页.上级派工),
                rule_ZXPG:this.$rt(this.authJson.EAM.设备保养.保养工单查看页.重新派工),
                rule_QXGD:this.$rt(this.authJson.EAM.设备保养.保养工单查看页.取消工单),
                /*工单执行状态*/
                statusAry:[],
                /*工单执行状态*/
                logoSrc:"../../static/img/ch_logo.jpg",
                docTypeCode: '',
                imgAddr: '',
                /***  页面初加载字段 ***/
                orderId: '', //从路由信息获取的工单id
                flag: 0,  //从路由信息获取的点检还是保养
                listTitle:'',
                listStatus:-1,
                editEnable:false,
                workItemId:'',
                showOrnot:false,
                /*待仲裁设备科长添加员工按钮*/
                showAddMan:false,
                /***  页面初加载字段 ***/
                /*导航条数据*/
                secondStepsData:[
                    {
                        code:0,
                        content:"确认接单",
                        liClass:'secondStepsLi active'
                    },
                    {
                        code:2,
                        content:"备件领用",
                        liClass:'secondStepsLi'
                    },
                    {
                        code:3,
                        content:"补充派工",
                        liClass:'secondStepsLi'
                    },
                    {
                        code:4,
                        content:"下发终端",
                        liClass:'secondStepsLi'
                    },
                ],
                /*导航条数据*/
                /*form 表单*/
                order_Form:{
                    "billNo": "",
                    "billType": "",
                    "billStatus": "",
                    "billStatusStr": "",
                    "sopVersion": 1,
                    "standardSolution": "",
                    "doActualStartTime": "",
                    "notifyTime": "",
                    "dispatchTime": "",
                    "doActualStartTime": "",
                    "submitPlanCode": "",
                    "createBy": "",
                    "createAt": ""
                },
                /*form 表单*/

                /*目标设备 S */
                targetEquipment: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 80,
                        align: 'center'
                    },
                    {
                        title: '设备编码',
                        key: 'equipmentCode',
                        align: 'center',
                        render: (h, params) => {
                            return h('p', {
                                domProps: {
                                    title: params.row.equipmentCode
                                },
                                class: 'iview_tabDis',
                            }, params.row.equipmentCode)
                        },
                    },
                    {
                        title: '设备名称',
                        key: 'equipmentName',
                        align: 'center',
                    },
                    {
                        title: '设备分类',
                        key: 'equipmentClassification',
                        align: 'center'
                    },
                    {
                        title: '设备类型',
                        key: 'equipmentType',
                        align: 'center'
                    },
                    {
                        title: '规格型号',
                        key: 'equipmentModel',
                        align: 'center'
                    },
                    {
                        title: '安装地点',
                        key: 'factoryLocation',
                        align: 'center'
                    },
                    {
                        title: '保管人',
                        key: 'keeper',
                        align: 'center'
                    },
                    {
                        title: '操作',
                        align: 'center',
                        render: (h, params) => {
                            let btns = [];
                            btns.push(
                                h('a', {
                                    class: 'mar-r-5',
                                    on: {
                                        click: () => {
                                            this.$router.push({path: '/resume',query: {id:params.row.equipmentId}});
                                        }
                                    }
                                }, '查看履历')
                            )
                            return h('div', btns)
                        },
                    },
                ],
                targetEquData: [],
                /*目标设备 E */
                /*保养项目  S */
                /* "solutionName": "四柱液压机保养方案",
                 "content": "拆卸"*/
                maintainColumns:[
                    {
                        title: '序号',
                        type: 'index',
                        align: 'center',
                        width: 80
                    },
                    {
                        title: '保养内容',
                        key: 'content',
                        align: 'center',
                        render:(h,params) => {
                            return h('p',{
                                domProps:{
                                    title:params.row.content,
                                },
                                class:'iview_tabDis'
                            },params.row.content)
                        }
                    },
                    {
                        title: '保养要求',
                        key: 'requirement',
                        align: 'center',
                        render:(h,params) => {
                            return h('p',{
                                domProps:{
                                    title:params.row.requirement,
                                },
                                class:'iview_tabDis'
                            },params.row.requirement)
                        }
                    },
                    {
                        title: '保养耗时(分钟)',
                        key: 'time',
                        align: 'center',
                        width: 150,
                        render:(h,params) => {
                            return h('p',{
                                domProps:{
                                    title:params.row.time,
                                },
                                class:'iview_tabDis'
                            },params.row.time)
                        }
                    },
                    {
                        title: '参照图片',
                        key: 'picData',
                        align: 'center',
                        render:(h,params)=>{
                            let showImgAry = [];
                            if(params.row.picData != undefined && params.row.picData.length>0){
                                showImgAry.push(
                                    h('a',{
                                        on:{
                                            click:()=>{
                                                this.editUploadImages(params.index)
                                            }
                                        }
                                    },params.row.picData.length +' 张相关图片，点击查看')
                                )
                            }else {
                                showImgAry.push(
                                    h('p','暂无图片')
                                )
                            }
                            return h('div',showImgAry)
                        }
                    },
                    /*{
                        title: '操作',
                        key: 'action',
                        align: 'center',
                        width: 100,
                        render: (h, params) => {
                            let buttons = [];
                            buttons.push(
                                h('a',{
                                    class: 'mar-r-5 col-gary',
                                    on: {
                                        click: () => {
                                            this.$Message.error("查看状态，不可删除");
                                        }
                                    }

                                }, '删除'),
                            );
                            return h('div', buttons);
                        },

                    },*/
                ],//查看状态
                maintainData:[],
                img_modal:false,//图片查看弹出框
                //图片相关
                editUploadImagesAry:[],
                savePath: '',
                /*保养项目  E */


                /**** 派工表格 ****/
                dispatchMod:false,
                dispatchData: [],

                dispatchManTotal:0,
                dispatchManColumns:[
                    {
                        title: '序号',
                        width: 80,
                        align: 'center',
                        type: 'index'
                    },
                    {
                        title: '姓名',
                        key: 'personName',
                        align: 'center'
                    },
                    {
                        title: '编码',
                        key: 'personCode',
                        align: 'center',
                    },
                    {
                        title: '卡号',
                        key: 'personCardNo',
                        align: 'center'
                    },
                    {
                        title: '岗位',
                        key: 'positionName',
                        align: 'center'
                    },
                    {
                        title: '班组',
                        key: 'teamName',
                        align: 'center'
                    },
                ],
                dispatchManData:[],
                dispatch_name:'',
                dispatchManPageSize:10,
                dispatchPage:1,
                selectRowMan:{},
                /*多人员 --S--*/
                dispatchProData:[],
                selectRowsMan:[],
                /*多人员 --E--*/
                /**** 派工表格 ****/

                /***** 备件领用记录 - S -*******/
                sparePartColumns:[
                    {
                        title: '序号',
                        type: 'index',
                        width: 80,
                        align: 'center'
                    },
                    {
                        title: '备件编码',
                        key: 'sparePartCode',
                        align: 'center'
                    },
                    {
                        title: '备件名称',
                        key: 'sparePartName',
                        align: 'center',
                    },
                    {
                        title: '所在仓库编码',
                        key: 'warehouseCode',
                        align: 'center'
                    },
                    {
                        title: '所在仓库名称',
                        key: 'warehouseName',
                        align: 'center'
                    },
                    {
                        title: '领用数量',
                        key: 'quantity',
                        align: 'center'
                    },
                    {
                        title: '单位',
                        key: 'uomName',
                        align: 'center'
                    },
                    {
                        title: '经办人',
                        key: 'operator',
                        align: 'center'
                    },
                    {
                        title: '领用人',
                        key: 'applier',
                        align: 'center'
                    },
                    {
                        title: '备注',
                        key: 'note',
                        align: 'center'
                    }
                ],
                sparePartData:[],
                /***** 备件领用记录 - E -*******/

                /*拒单modal*/
                rejectReason:'',
                rejectMod:false,
                /*转仲裁modal*/
                arbitrationReason:'',
                arbitrationMod:false,
                /*取消工单modal*/
                cancelOrderReason:'',
                cancelOrderMod:false,


                // 保养 -- 执行记录
                scrapColumns: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 80,
                        align: 'center'
                    },
                    {
                        title: '执行操作',
                        key: 'opearation',
                        align: 'center',
                    },
                    {
                        title: '操作人',
                        key: 'operator',
                        align: 'center',
                    },
                    {
                        title: '角色',
                        key: 'role',
                        align: 'center',
                    },
                    {
                        title: '执行时间',
                        key: 'time',
                        align: 'center',
                    },
                    {
                        title: '结果状态',
                        key: 'status',
                        align: 'center',
                    },
                    {
                        title: '意见反馈',
                        key: 'comment',
                        align: 'center'
                    },
                ],
                scrapData:[],
                ttPages: 1, //执行记录列表数
                curPage: 1,

            }
        },
        mounted(){
//            console.log('TEamApproveDispatchOrderStatusEnum === '+JSON.stringify(this.$base_info.tEamApproveDispatchOrderStatusEnum))
            /*人员*/
            this.orderId = this.$route.query.orderId;
            this.listTitle = this.$route.query.title;
            this.listStatus = this.$route.query.listStatus;
            this.workItemId = this.$route.query.workItemId;

            this.orderDetailLoad();
            this.dispatchList();
//            this.order_Form.billStatus = 1;
            setTimeout(()=>{
                if(this.order_Form.billStatus == 0 || this.order_Form.billStatus == 4){
                    this.editEnable = false
                }else {
                    this.editEnable = true;
                }
                if(this.order_Form.billStatus == 1 || this.order_Form.billStatus == 2){
                    if(this.dispatchData[0].note == "Dispatch"){
                        this.showOrnot = true;
                    }else if(this.dispatchData[0].note == "UpperDispatch"){
                        this.showOrnot = false;
                    }
                }else {
                    this.showOrnot = false;
                }
            },300);


            /*"已制单":0,"已派工":1,"已通知":2,"已接单":3,"已拒单":4,"已领件":5,"缺件暂停":6,"已下发":7,"执行中":8,"已签入":9,"已签出":10,"已完成":11,"待派工":12,"待仲裁":13,"已取消":14,"已归档":15,*/
            this.dispatchManList();
            this.auditRecords();
        },

        methods: {
            //验证是否是正整数
            toTestIsNANMax(x,item){
                var re = /^[0-9]*[1-9][0-9]*$/;
                if (!re.test(x)) {
                    this.$Message.error('绩效为正整数!');
                    this.dispatchData[item].kpiRatio = ""
                }else if(x>100) {
                    this.$Message.error('绩效不大于100%!');
                    this.dispatchData[item].kpiRatio = ""
                }
            },
            //验证是否是正整数
            toTestIsNAN(x,item){
                var re = /^[0-9]*[1-9][0-9]*$/;
                if (!re.test(x)) {
                    this.$Message.error('时间为正整数!');
                    this.dispatchData[item].time = ""
                }
            },

            /*人员选择*/
            openEquType(){
                this.dispatchMod = true;
                this.dispatchManList();
            },
            dispatchManList(){
                let vt=this;
                this.$axios.post('/eamDo/orderOperatorList', {
                    page: this.dispatchPage,
                    pageSize:10,
                    name :this.dispatch_name,
                    orderId :this.orderId
                }).then((res) => {
                    if (res.data.response.code === 1) {
                        let dataRes = res.data.response.data;
                        vt.dispatchManData=[];
                        vt.dispatchManTotal= dataRes.total;
                        for(let i = 0;i <dataRes.rows.length; i++){
                            vt.dispatchManData.push({
                                personId: dataRes.rows[i].id,
                                personName: dataRes.rows[i].name,
                                personCode: dataRes.rows[i].code,
                                personCardNo: dataRes.rows[i].cardNo,
                                positionName: dataRes.rows[i].position,
                                teamName: dataRes.rows[i].productionTeam,
                                orderCount: dataRes.rows[i].orderCount,
                                repairOrderCount: dataRes.rows[i].repairOrderCount,
                                kpiRatio:100,
//                                time:'',
                                note: dataRes.rows[i].note
                            })
                        }
                    }else {
                        vt.dispatchManData=[];
                        vt.dispatchManTotal=0;
                        vt.$Message.error(res.data.response.msg);

                    }
                }).catch((err) => {
                    console.log(err);
                });
            },
            dispatchManChange(page){
                this.dispatchPage = page;
                this.dispatchManList();
            },
            toSelectMan(rowData){
                this.selectRowMan = rowData;
            },
            /*删除人员*/
            delDispatchItem(index){
                this.dispatchData.splice(index,1);
            },
            /*多人员选择 --S--*/
            dispatchManSelected(){
                let vm = this;
                /*多选*/
                //vm.dispatchData = [...vm.selectRowsMan];
                /*单选*/
                vm.dispatchData = [];
                vm.dispatchData.push(vm.selectRowMan);
            },
            /*dispatchSelected(selectedAry){
                this.selectRowsMan = selectedAry;
            },*/
            /*多人员选择 --E--*/
            /*人员选择*/
            /*进度条点击*/
            activeFun(index){
                for(let i = 0 ;i< this.secondStepsData.length ;i++){
                    if(i == index){
                        this.secondStepsData[i].liClass = "secondStepsLi active"
                    }else {
                        this.secondStepsData[i].liClass = "secondStepsLi"
                    }
                }
            },
            /*进度条点击*/
            /***  页面初加载 *****/
            orderDetailLoad(){
                this.$axios.post('/eamDo/maintainceOrderDetail', {id: this.orderId}).then((res) => {
                    let ret = res.data.response;
//                    console.log('ret ===== '+JSON.stringify(ret))
                    if (ret.code == 1) {
                        this.order_Form =ret.data;
                        this.imgAddr = ret.data.barCode;
                        this.docTypeCode = this.order_Form.billNo;
                        this.order_Form.billStatusStr = this.$base_info.getDescByCode(this.order_Form.billStatus,this.$base_info.tEamApproveDispatchOrderStatusEnum);
                        this.maintainData = ret.data.work;
                        this.targetEquData = ret.data.equipmentInfo;
                        this.order_Form.nowUserRole.forEach((role)=>{
                            if(role ==='设备科长'){
                                this.showAddMan = true
                            }
                        })
                    } else {
                        this.$Message.error(result.msg)
                    }
                }).catch((err) => {
                    console.log(err);
                });
                this.dispatchedList();
            },
            /****   工单派工列表  ****/
            dispatchedList(){
                this.$axios.post('/eamDo/assignmentOperatorList', {
                    page:1,
                    pageSize:10,
                    dispatchOrderId : this.orderId
                }).then((res) => {
                    let ret = res.data.response;
                    if (ret.code === 1) {
                        if(JSON.stringify(ret.data) !== '{}'){
                            this.dispatchData.push(ret.data);
                        }
                        /*多人员*/
//                        this.dispatchProData = [...ret.data];
                    } else {
                        this.$Message.error(result.msg)
                    }
                }).catch((err) => {
                    console.log(err);
                })
            },
            /****   工单派工列表  ****/
            /****   备件领用记录 - S - ****/
            dispatchList(){
                this.$axios.post('/eamDo/getSparePartByDispatchOrder', {
                    page:1,
                    pageSize:10000,
                    dispatchOrderId : this.orderId
                }).then((res) => {
                    let ret = res.data.response;
//                    console.log('备件领用记录 == ' + JSON.stringify(ret));
                    if (ret.code == 1) {
                        this.sparePartData = ret.data.rows;
                    } else {
                        this.$Message.error(result.msg)
                    }
                }).catch((err) => {
                    console.log(err);
                })
            },
            /****   备件领用记录  ****/

            /*******  dispatchStart 派工按钮 *********/
            dispatchStart(dispatchOperatorCode){
                if(this.dispatchData.length != 0){
                    let dispatchAry = {
                        "kpi":100,
                        "time":0,
                        "note": "",
                        "operatorCode": dispatchOperatorCode,
                        "orderId": this.orderId,
                        "userId": this.dispatchData[0].personId,
//                        "userId": 'JQRF4MXJRENU72QITI7N',/* 吴萱id*/
                        "wfWorkItemId": this.workItemId
                    };
                    //console.log("dispatchAry +" + JSON.stringify(dispatchAry))
                    this.$axios.post('/eamDo/orderAssignment',dispatchAry ).then((res) => {
                        console.log("res + " +JSON.stringify(res));
                        let ret = res.data.response;
                        if (ret.code == 1) {
                            this.$Message.success("操作成功！");
                            setTimeout(()=>{
                                this.$router.push({path: '/maintenanceOrder',query: {type:this.listStatus,orderFlag:0}});
                            },500)
                        } else {
                            this.$Message.error("操作失败！")
                        }
                    }).catch((err) => {
                        console.log(err);
                    })
                 }else {
                    this.$Message.warning("请添加派工人员！")
                 }
                /*if(this.dispatchData.length != 0){
                    if(this.dispatchData[0].kpiRatio != ""){
                        if(this.dispatchData[0].time != ""){
                            let dispatchAry = {
                                "kpi":this.dispatchData[0].kpiRatio,
                                "time":this.dispatchData[0].time,
                                "note": "",
                                "operatorCode": dispatchOperatorCode,
                                "orderId": this.orderId,
                                "userId": this.dispatchData[0].personId,
                                "wfWorkItemId": this.workItemId
                            }
//                        console.log("dispatchAry +" + JSON.stringify(dispatchAry))
                            this.$axios.post('/eamDo/orderAssignment',dispatchAry ).then((res) => {
                                let ret = res.data.response;
                                if (ret.code == 1) {
                                    this.$Message.success("操作成功！");
                                    this.$router.push({path: '/maintenanceOrder',query: {'title':this.listTitle,type:this.listStatus,orderFlag:0}});
                                } else {
                                    this.$Message.error("操作失败！")
                                }
                            }).catch((err) => {
                                console.log(err);
                            })
                        }else {
                            this.$Message.warning("请输入计划时间！")
                        }
                    }else {
                        this.$Message.warning("请输入绩效！")
                    }
                }else {
                    this.$Message.warning("请添加派工人员！")
                }*/
            },
            /*******  dispatchStart 派工按钮 *********/
            /*******  arbitration 转仲裁 *********/
            arbitration(editReason,dispatchOperatorCode){
                if(editReason != ""){
                    let dispatchAry = {
                        "note": editReason,
                        "operatorCode": dispatchOperatorCode,
                        "orderId": this.orderId,
                        "wfWorkItemId": this.workItemId
                    };
//                console.log("dispatchAry +" + JSON.stringify(dispatchAry))
                    this.$axios.post('/eamDo/maintainOrderOperator',dispatchAry ).then((res) => {
                        let ret = res.data.response;
                        if (ret.code == 1) {
                            this.$Message.success("操作成功！");
//                        this.$router.push({path: '/maintenanceOrder',query: {'title':this.listTitle,type:this.listStatus}});
                            this.$router.push({path: '/maintenanceOrder',query: {type:1,orderFlag:0}});
                        } else {
                            this.$Message.error("操作失败！")
                        }
                    }).catch((err) => {
                        console.log(err);
                    })
                }else {
                    this.$Message.error("请填写理由！")
                }

            },
            /*******  arbitration 转仲裁 *********/
            /*******  dispatchStart 拒单、之后状态的按钮 *********/
            dispatchOtherEdit(editStatus){
                if(this.rejectReason != ""){
                    let dispatchAry = {
                        "note": this.rejectReason,
                        "operatorCode": editStatus,
                        "orderId": this.orderId,
                        "wfWorkItemId": this.workItemId
                    }
                    this.$axios.post('/eamDo/maintainOrderOperator',dispatchAry ).then((res) => {
                        let ret = res.data.response;
                        if (ret.code == 1) {
                            this.$Message.success("操作成功！");
                            this.$router.push({path: '/maintenanceOrder',query: {type:this.listStatus,orderFlag:0}});
                        } else {
                            this.$Message.error(ret.msg)
                        }
                    }).catch((err) => {
                        console.log(err);
                    })
                }else {
                    this.$Message.error("请填写拒单理由！")
                }

            },
            /*******  dispatchStart 派工按钮 *********/
            /************* 图片管理按钮方法 -S- **************/
            editUploadImages(index){
                this.img_modal = true;
                this.editUploadImagesAry = this.maintainData[index].picData;
            },
            //审核记录数据
            auditRecords() {
                this.$axios.post('/eamDo/getMaintainceOrderRecord', {
                    orderId: this.orderId,//id
                    offset: this.curPage,//页码
                    pageSize: 5,//条目数
                }).then((res) => {
//                    console.log('审核记录数据')
//                    console.log(JSON.stringify(res))
                    let ret = res.data.response;
                    if (ret.code == 1) {
                        this.scrapData = ret.data.rows;
                        this.ttPages = ret.data.total;
                        /*this.$base_info.tEamApproveDispatchOrderStatusEnum*/
                        for (let i in this.scrapData) {
                            this.scrapData[i].status = this.$base_info.getDescByCode(this.scrapData[i].status, this.$base_info.tEamApproveDispatchOrderStatusEnum)
                        }
                    } else {
                        this.$Message.error(ret.msg);
                    }
                }).catch((err) => {
                    console.log(err)
                })
            },
            changePage3(cur) {
                this.curPage = cur;
                this.auditRecords();
            }
        },
    }
</script>
<style>
    .titleLogo{
        width: 100px;
        height: 55px;
        margin: 15px 0;
        position: absolute;
        right: 60px;
        top: 0;
    }
    .demo-spin-icon-load{
        animation: ani-demo-spin 1s linear infinite;
    }
    @keyframes ani-demo-spin {
        from { transform: rotate(0deg);}
        50%  { transform: rotate(180deg);}
        to   { transform: rotate(360deg);}
    }
    .demo-spin-col{
        height: 100px;
        position: relative;
        border: 1px solid #eee;
    }
</style>
