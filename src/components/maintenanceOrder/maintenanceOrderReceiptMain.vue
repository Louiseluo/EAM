<template>
    <div style="position:relative;" class="basic fault-content">
        <!-- /*"已制单":0,"已派工":1,"已通知":2,"已接单":3,"已拒单":4,"已领件":5,"缺件暂停":6,"已下发":7,"执行中":8,"已签入":9,"已签出":10,"已完成":11,"待派工":12,"待仲裁":13,"已取消":14,"已归档":15,*/-->
        <!--模块名称-->
        <div class="title">
            <span>维修工单执行流程--{{order_Form.billStatusStr}}</span>
        </div>
        <div class="titleLogo"><img style="width: 100%;height: 100%;" :src="logoSrc"></div>
        <div style="overflow: hidden;">
            <h3 class="f_l">维修工单号：</h3>
            <div class="f_l text-center">
                <img v-if="imgAddr!=''" :src="'/static'+ imgAddr" alt="" height="50" width="300">
                <div>{{docTypeCode}}</div>
            </div>
        </div>
        <!--表单-->
        <div class="secondSteps" v-show="order_Form.billStatus == 2">
            <ul class="secondStepsUl">
                <li v-for="(item,index) in secondStepsData" :class="item.liClass">{{item.content}}</li>
            </ul>
        </div>
        <div class="form-content">
            <Form :model="order_Form" label-position="right" inline :label-width="135">
                <div class="second-title">报修信息</div>
                <Form-item label="报修单编码">
                    <Input v-model="order_Form.repairBillNo" :title="order_Form.repairBillNo" style="width: 160px;" disabled></Input>
                </Form-item>
                <Form-item label="报修单状态">
                    <Input v-model="order_Form.repairBillStatus" style="width: 160px;" disabled></Input>
                </Form-item>
                <Form-item label="报修部门">
                    <Input v-model="order_Form.repairDept" style="width: 160px;" disabled></Input>
                </Form-item>
                <Form-item label="报修人">
                    <Input v-model="order_Form.repairReporter" style="width: 160px;" disabled></Input>
                </Form-item>
                <Form-item label="报修设备编码">
                    <Input v-model="order_Form.repairEquipmentCode" :title="order_Form.repairEquipmentCode" style="width: 160px;" disabled></Input>
                </Form-item>
                <Form-item label="报修时间">
                    <Input v-model="order_Form.repairReportTime" style="width: 160px;" disabled></Input>
                </Form-item>
                <Form-item label="报修地点">
                    <Input v-model="order_Form.repairReportLocation" style="width: 160px;" disabled></Input>
                </Form-item>
                <Form-item label="故障描述">
                    <Input type="textarea" v-model="order_Form.repairFaultDesc" style="width: 160px;" disabled></Input>
                </Form-item>
                <Form-item label="报修类型">
                    <Input v-model="order_Form.repairType" style="width: 160px;" disabled></Input>
                </Form-item>
                <div class="second-title">维修信息</div>
                <Form-item label="维修工单编码">
                    <Input v-model="order_Form.billNo" :title="order_Form.billNo" style="width: 160px;" disabled></Input>
                </Form-item>
                <Form-item label="工单类型">
                    <Input v-model="order_Form.billType" placeholder="" style="width: 160px;" disabled></Input>
                </Form-item>
                <!--<Form-item label="制单人">
                    <Input v-model="order_Form.createBy"  style="width: 160px;" disabled></Input>
                </Form-item>-->
                <Form-item label="制单日期">
                    <DatePicker v-model="order_Form.createAt" type="date" placeholder="选择日期" disabled></DatePicker>
                </Form-item>
            </Form>
        </div>
        <!--备品备件---start-->
        <div class="second-title mar-t-15">报修设备信息</div>
        <div style="overflow: hidden;">
            <Table class="mar-b-15" stripe border :columns="sparePartCol" :data="gettedParts"></Table>
        </div>

        <div class="second-title">工单派工</div>
        <div>
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
                   <!-- <td class="wid-10 num_right">
                        <Input v-model=item.kpiRatio @on-change="toTestIsNANMain(item.kpiRatio,index)" :disabled="editEnable"></Input>
                    </td>
                    <td class="wid-10 num_right">
                        <Input v-model=item.time @on-change="toTestIsNAN(item.time,index)" :disabled="editEnable"></Input>
                    </td>-->
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
                        <a v-if="order_Form.billStatus == 0 || order_Form.billStatus == 4" @click="delDispatchItem(index)">删除</a>
                        <a v-else disabled>删除</a>
                    </td>
                </tr>
                </tbody>
            </table>
            <div class="tableHasNoData" v-show="!dispatchData"><p>暂无数据</p></div>
            <!--<Table class="mar-b-15" stripe border :columns="dispatchColumns" :data="dispatchData"></Table>-->
            <Button @click="dispatchMod = true" size="small" class="mar-t-10" v-show="order_Form.billStatus == 0 || order_Form.billStatus == 4|| (order_Form.billStatus == 13&&showAddMan)">添加主责任人</Button>
        </div>
        <div class="second-title mar-t-15" v-if="receiptOk">故障确认信息</div>
        <div v-if="receiptOk">
            <Form ref="order_Form" :model="order_Form" label-position="right" :label-width="135" :rules="ruleValidate">
                <Form-item label="是否故障">
                    <RadioGroup v-model="order_Form.faultOrNot" @on-change="changeFault">
                        <Radio label="0" :disabled="faultSelectDis">故障</Radio>
                        <Radio label="1" :disabled="faultSelectDis">非故障</Radio>
                    </RadioGroup>
                </Form-item>
                <Row>
                    <Col :span="12">
                    <Form-item label="故障现象" prop="faultDesc">
                        <Input type="textarea" v-model="order_Form.faultDesc" disabled></Input>
                    </Form-item>
                    </Col>
                    <Col :span="12">
                    <Form-item label="故障原因" prop="faultCause">
                        <Input type="textarea" v-model="order_Form.faultCause" :disabled="editDisabled" :maxlength="500"></Input>
                    </Form-item>
                    </Col>
                </Row>


            </Form>
        </div>
        <!--保养-->
        <div class="second-title mar-t-15">工单流程执行记录</div>
        <div style="overflow: hidden;">
            <Table class="mar-b-15" stripe border :columns="scrapColumns" :data="scrapData"></Table>
            <div class="page">
                <Page :total="ttPages" :current="curPage" size="small" show-elevator :page-size="5" @on-change="changePage3"></Page>
            </div>
        </div>
        <!--操作按钮-->
        <div align="center" class="btnGroupDesign">
            <!--<router-link :to="{ path: '/maintenanceOrder', query: {'title':listTitle,type:listStatus,orderFlag:2}}" v-if="rule_back">
                <Button type="primary" size="large" @click="goBack">返回</Button>
            </router-link>-->
            <Button type="primary" size="large" @click="$router.go(-1)" v-if="rule_back">返回</Button>
            <Button type="primary" size="large" @click="dispatchStart(1)" v-show="order_Form.billStatus == 0" v-if="rule_PG">派工</Button>
            <Button type="primary" size="large" @click="arbitrationMod = true" v-if="rule_ZZC" v-show="order_Form.billStatus == 4">转仲裁</Button>
            <Button type="primary" size="large" @click="dispatchStart(12)" v-if="rule_againDispatch" v-show="order_Form.billStatus == 17">重新派工</Button>
            <Button type="primary" size="large" @click="dispatchStart(13)" v-if="rule_SJPG" v-show="order_Form.billStatus == 13">上级派工</Button>
            <Button type="primary" size="large" @click="delayOrderMod = true" v-if="rule_delayDispatch" v-show="order_Form.billStatus == 13" disabled>延迟派工</Button>
            <Button type="primary" size="large" @click="receiptOrder" v-if="rule_JieD" v-show="!receiptOk &&( order_Form.billStatus == 1 || order_Form.billStatus == 2)">接单</Button>
            <Button type="primary" size="large" @click="rejectMod = true" v-if="rule_refuse" v-show="( order_Form.billStatus == 1 || order_Form.billStatus == 2)&& !receiptOk && showOrnot">拒单</Button>
            <!--<Button type="primary" size="large" @click="makeSureOrder('order_Form')" v-show="order_Form.billStatus == 3 && receiptOk" v-if="rule_CD">确认故障</Button>-->
            <Button type="primary" size="large" @click="makeSureOrder('order_Form')" v-show="receiptOk" v-if="rule_confirmFault" :disabled="receiptDis">确认故障</Button>
            <Button type="primary" size="large" @click="cancelOrderMod = true" v-show="receiptOk" v-if="rule_CD" :disabled="!receiptDis">误报撤单</Button>
        </div>
        <!--图片-->
        <Modal title="查看图片" v-model="img_modal" width="800">
            <Carousel loop style="width: 760px">
                <CarouselItem v-for="(imageItem,ind) in editUploadImagesAry" :key="ind">
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
                        <Input v-model="dispatch_name" style="width: 160px"></Input>
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
        <Modal v-model="rejectMod" title="拒单" @on-ok="arbitration(rejectReason,4)">
            <p>拒单理由：</p>
            <Input v-model="rejectReason" type="textarea" placeholder=""/>
        </Modal>
        <Modal v-model="arbitrationMod" title="转仲裁" @on-ok="arbitration(arbitrationReason,13)">
            <p>转仲裁理由：</p>
            <Input v-model="arbitrationReason" type="textarea" placeholder=""/>
        </Modal>
        <Modal v-model="cancelOrderMod" title="撤单" @on-ok="arbitration(cancelOrderReason,14)">
            <p>撤单理由：</p>
            <Input v-model="cancelOrderReason" type="textarea" placeholder=""/>
        </Modal>
        <Modal v-model="delayOrderMod" title="延迟工单" @on-ok="arbitration(delayOrderTime,14)">
            <p>延迟时间：</p>
            <InputNumber :min="1" v-model="delayOrderTime"></InputNumber>
            /小时
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
                /*权限按钮*/
                rule_back: this.$rt(this.authJson.EAM.设备保养.维修工单查看页.返回),
                rule_PG: this.$rt(this.authJson.EAM.设备保养.维修工单查看页.派工),
                rule_JieD: this.$rt(this.authJson.EAM.设备保养.维修工单查看页.接单),
                rule_CD: this.$rt(this.authJson.EAM.设备保养.维修工单查看页.撤单),
                /*rule_ZZC: this.$rt(this.authJson.EAM.设备保养.保养工单查看页.转仲裁),
                rule_SJPG: this.$rt(this.authJson.EAM.设备保养.保养工单查看页.上级派工),
                rule_ZXPG: this.$rt(this.authJson.EAM.设备保养.保养工单查看页.重新派工),
                rule_QXGD: this.$rt(this.authJson.EAM.设备保养.保养工单查看页.取消工单),*/
                /*新加 -- start*/
                rule_ZZC: this.$rt(this.authJson.EAM.设备保养.维修工单查看页.转仲裁),
                rule_SJPG: this.$rt(this.authJson.EAM.设备保养.维修工单查看页.上级派工),
                rule_againDispatch: this.$rt(this.authJson.EAM.设备保养.维修工单查看页.重新派工),
                rule_delayDispatch: this.$rt(this.authJson.EAM.设备保养.维修工单查看页.延迟派工),
                rule_refuse: this.$rt(this.authJson.EAM.设备保养.维修工单查看页.拒单),
                rule_confirmFault: this.$rt(this.authJson.EAM.设备保养.维修工单查看页.确认故障),
                /*新加 -- end*/
                /*工单执行状态*/
                statusAry: [],
                /*工单执行状态*/

                /***  页面初加载字段 ***/
                orderId: '', //从路由信息获取的工单id
                flag: 0,  //从路由信息获取的点检还是保养
                listTitle: '',
                listStatus: -1,
                editEnable: false,
                workItemId: '',
                showOrnot: false,
                editDisabled: false,
                faultSelectDis: false,
                /*待仲裁设备科长添加员工按钮*/
                showAddMan:false,
                /***  页面初加载字段 ***/
                logoSrc:"../../static/img/ch_logo.jpg",
                docTypeCode: '',
                imgAddr: '',
                /*导航条数据*/
                secondStepsData: [
                    {
                        code: 0,
                        content: "确认接单",
                        liClass: 'secondStepsLi active'
                    },
                    {
                        code: 1,
                        content: "故障确认",
                        liClass: 'secondStepsLi'
                    },
                    {
                        code: 2,
                        content: "备件领用",
                        liClass: 'secondStepsLi'
                    },
                    {
                        code: 3,
                        content: "补充派工",
                        liClass: 'secondStepsLi'
                    },
                    {
                        code: 4,
                        content: "下发终端",
                        liClass: 'secondStepsLi'
                    },
                ],
                /*导航条数据*/
                /*form 表单*/
                order_Form: {
                    "billNo": "",
                    "billType": "",
                    "billStatus": "",
                    "billStatusStr": "",
                    "sopVersion": 1,
                    "standardSolution": "",
                    "doActualStartTime": "",
                    "notifyTime": "",
                    "dispatchTime": "",
                    "submitPlanCode": "",
                    "createBy": "",
                    "createAt": "",
                    "repairBillId": "",
                    "repairBillNo": "",
                    "repairBillStatus": "",
                    "repairDept": "",
                    "repairReporter": "",
                    "repairEquipmentCode": "",
                    "repairReportTime": "",
                    "repairReportLocation": "",
                    "repairFaultDesc": "",
                    "repairType": "",
                    /*故障信息*/
                    faultOrNot: '0',
                    "faultCause": "",
                    "faultDesc": "",
                },
                ruleValidate: {
                    faultCause: [
                        {required: true, message: '请填写原因', trigger: 'blur'}
                    ],
                    faultDesc: [
                        {required: true, message: '请填写现象', trigger: 'blur'}
                    ],
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
                                            this.$router.push({path: '/resume', query: {id: params.row.equipmentId}});
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
                maintainColumns: [
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
                        render: (h, params) => {
                            return h('p', {
                                domProps: {
                                    title: params.row.content,
                                },
                                class: 'iview_tabDis'
                            }, params.row.content)
                        }
                    },
                    {
                        title: '保养要求',
                        key: 'requirement',
                        align: 'center',
                        render: (h, params) => {
                            return h('p', {
                                domProps: {
                                    title: params.row.requirement,
                                },
                                class: 'iview_tabDis'
                            }, params.row.requirement)
                        }
                    },
                    {
                        title: '保养耗时(分钟)',
                        key: 'time',
                        align: 'center',
                        width: 150,
                        render: (h, params) => {
                            return h('p', {
                                domProps: {
                                    title: params.row.time,
                                },
                                class: 'iview_tabDis'
                            }, params.row.time)
                        }
                    },
                    {
                        title: '参照图片',
                        key: 'picData',
                        align: 'center',
                        render: (h, params) => {
                            let showImgAry = [];
                            if (params.row.picData != undefined && params.row.picData.length > 0) {
                                showImgAry.push(
                                    h('a', {
                                        on: {
                                            click: () => {
                                                this.editUploadImages(params.index)
                                            }
                                        }
                                    }, params.row.picData.length + ' 张相关图片，点击查看')
                                )
                            } else {
                                showImgAry.push(
                                    h('p', '暂无图片')
                                )
                            }
                            return h('div', showImgAry)
                        }
                    },
                    {
                        title: '操作',
                        key: 'action',
                        align: 'center',
                        width: 100,
                        render: (h, params) => {
                            let buttons = [];
                            buttons.push(
                                h('a', {
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

                    },
                ],//查看状态
                maintainData: [],
                img_modal: false,//图片查看弹出框
                //图片相关
                editUploadImagesAry: [],
                savePath: '',
                /*保养项目  E */

                /*报修设备信息*/
                sparePartCol: [
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
                        key: 'classification',
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
                        key: 'location',
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
                                            this.$router.push({path: '/resume', query: {'id': params.row.equipmentId}})
                                        }
                                    }
                                }, '查看履历')
                            )
                            return h('div', btns)
                        },
                    },
                ],
                gettedParts: [],
                /*报修设备信息*/


                /**** 派工表格 ****/
                dispatchMod: false,
                dispatchData: [],

                dispatchManTotal: 0,
                dispatchManColumns: [
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
                dispatchManData: [],
                dispatch_name: '',
                dispatchManPageSize: 10,
                dispatchPage: 1,
                selectRowMan: {},
                /*多人员 --S--*/
                dispatchProData: [],
                selectRowsMan: [],
                /*多人员 --E--*/


                /**** 派工表格 ****/

                /***** 备件领用记录 - S -*******/
                sparePartColumns: [
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
                sparePartData: [],
                /***** 备件领用记录 - E -*******/

                /*拒单modal*/
                rejectReason: '',
                rejectMod: false,
                /*转仲裁modal*/
                arbitrationReason: '',
                arbitrationMod: false,
                /*取消工单modal*/
                cancelOrderReason: '',
                cancelOrderMod: false,
                /*取消工单modal*/
                delayOrderTime: 0,
                delayOrderMod: false,


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
                scrapData: [],
                ttPages: 1, //执行记录列表数
                curPage: 1,
                /*接单按钮点击状态*/
                receiptDis: false,
                /*确认按钮*/
                receiptOk:false,

            }
        },
        mounted(){
            /*人员*/
            this.orderId = this.$route.query.orderId;
            this.listTitle = this.$route.query.title;
            this.listStatus = this.$route.query.listStatus;
            this.workItemId = this.$route.query.workItemId;
            this.docTypeCode = this.$route.query.code;
            this.orderDetailLoad();
            this.dispatchList();
            setTimeout(() => {
                if (this.order_Form.billStatus == 0 || this.order_Form.billStatus == 4) {
                    this.editEnable = false
                } else {
                    this.editEnable = true;
                }
                if (this.order_Form.billStatus == 2 && this.rule_JieD) {
                    this.editDisabled = false;
                    this.faultSelectDis = false;
                } else {
                    this.editDisabled = true;
                    this.faultSelectDis = true;
                };
                if(this.order_Form.billStatus == 1 || this.order_Form.billStatus == 2){
                    if(this.dispatchData[0].note == "Dispatch"){
                        this.showOrnot = true;
                    }else if(this.dispatchData[0].note == "UpperDispatch"){
                        this.showOrnot = false;
                    }
                }else {
                    this.showOrnot = false;
                }
            }, 300);
            /*"已制单":0,"已派工":1,"已通知":2,"已接单":3,"已拒单":4,"已领件":5,"缺件暂停":6,"已下发":7,"执行中":8,"已签入":9,"已签出":10,"已完成":11,"待派工":12,"待仲裁":13,"已取消":14,"已归档":15,*/
            this.dispatchManList();
            this.auditRecords();
        },

        methods: {
            //验证是否是正整数
            toTestIsNANMain(x, item){
                var re = /^[0-9]*[1-9][0-9]*$/;
                if (!re.test(x)) {
                    this.$Message.error('绩效为正整数!');
                    this.dispatchData[item].kpiRatio = ""
                } else if (x > 100) {
                    this.$Message.error('绩效不大于100%!');
                    this.dispatchData[item].kpiRatio = ""
                }
            },
            //验证是否是正整数
            toTestIsNAN(x, item){
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
                let vt = this;
                this.$axios.post('/eamDo/orderOperatorList', {
                    page: this.dispatchPage,
                    pageSize: 10,
                    name: this.dispatch_name,
                    orderId :this.orderId
                }).then((res) => {
                    if (res.data.response.code === 1) {

                        let dataRes = res.data.response.data;
//                        console.log("人员选择 dataRes +" + JSON.stringify(dataRes))
                        vt.dispatchManData = [];
                        vt.dispatchManTotal = dataRes.total;
                        for (let i = 0; i < dataRes.rows.length; i++) {
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
                    } else {
                        vt.dispatchManData = [];
                        vt.dispatchManTotal = 0;
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
            dispatchSelected(selectedAry){
                this.selectRowsMan = selectedAry;
            },
            /*删除人员*/
            delDispatchItem(index){
                this.dispatchData.splice(index, 1);
            },
            /*人员多选 --S--*/
            /* dispatchSelected(selectedAry){
             this.selectRowsMan = selectedAry;
             },*/
            dispatchManSelected(){
                let vm = this;
                /*多选*/
                //vm.dispatchData = [...vm.selectRowsMan];
                /*单选*/
                vm.dispatchData = [];
                vm.dispatchData.push(vm.selectRowMan);
            },

            /*人员多选 --E--*/
            /*人员选择*/
            /*进度条点击*/
            activeFun(index){
                for (let i = 0; i < this.secondStepsData.length; i++) {
                    if (i == index) {
                        this.secondStepsData[i].liClass = "secondStepsLi active"
                    } else {
                        this.secondStepsData[i].liClass = "secondStepsLi"
                    }
                }
            },
            /*进度条点击*/
            /***  页面初加载 *****/
            orderDetailLoad(){
                this.$axios.post('/eamDo/repairOrderDetail', {id: this.orderId}).then((res) => {
                    console.log('基础信息 目标设备、保养项目 == ' + JSON.stringify(res));
                    let ret = res.data.response;
                    if (ret.code == 1) {
                        this.order_Form = ret.data;
                        this.imgAddr = ret.data.barCode;
                        this.docTypeCode = this.order_Form.billNo;
                        this.gettedParts.push({
                            "equipmentId": ret.data.equipmentId,
                            "equipmentName": ret.data.equipmentName,
                            "equipmentCode": ret.data.equipmentCode,
                            "classification": ret.data.classification,
                            "equipmentType": ret.data.equipmentType,
                            "equipmentModel": ret.data.equipmentModel,
                            "location": ret.data.location,
                            "keeper": ret.data.keeper,
                        });
                        this.order_Form.billStatusStr = this.$base_info.getDescByCode(this.order_Form.billStatus, this.$base_info.tEamApproveDispatchOrderStatusEnum);
                        if (this.order_Form.billStatus == 14) {
                            this.order_Form.faultOrNot = '1';
                        } else {
                            this.order_Form.faultOrNot = '0';
                        };
                        this.order_Form.nowUserRole.forEach((role)=>{
                            if(role ==='设备科长'){
                                this.showAddMan = true
                            }
                        })
                    } else {
                        this.$Message.error(ret.msg)
                    }
                }).catch((err) => {
                    console.log(err);
                });
                this.dispatchedList();
            },
            /****   工单派工列表  ****/
            dispatchedList(){
                this.$axios.post('/eamDo/assignmentOperatorList', {
                    page: 1,
                    pageSize: 10,
                    dispatchOrderId: this.orderId
                }).then((res) => {
                    let ret = res.data.response;
//                    console.log('工单派工列表 == ' + JSON.stringify(ret));
                    if (ret.code == 1) {
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
                    page: 1,
                    pageSize: 10000,
                    dispatchOrderId: this.orderId
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
                /*if (this.dispatchData.length != 0) {
                    if (this.dispatchData[0].kpiRatio != "") {
                        if (this.dispatchData[0].time != "") {
                            let dispatchAry = {
                                "kpi": this.dispatchData[0].kpiRatio,
                                "time": this.dispatchData[0].time,
                                "note": "",
                                "operatorCode": dispatchOperatorCode,
                                "orderId": this.orderId,
                                "userId": this.dispatchData[0].personId,
                                "wfWorkItemId": this.workItemId
                            }
                            //                        console.log("dispatchAry +" + JSON.stringify(dispatchAry))
                            this.$axios.post('/eamDo/orderAssignment', dispatchAry).then((res) => {
                                let ret = res.data.response;
                                if (ret.code == 1) {
                                    this.$Message.success("操作成功！");
                                    this.$router.push({path: '/maintenanceOrder', query: {'title': this.listTitle, type: this.listStatus, orderFlag: 2}});
                                } else {
                                    this.$Message.error("操作失败！")
                                }
                            }).catch((err) => {
                                console.log(err);
                            })
                        } else {
                            this.$Message.warning("请输入计划时间！")
                        }
                    } else {
                        this.$Message.warning("请输入绩效！")
                    }
                } else {
                    this.$Message.warning("请添加主责人！")
                }*/
                if (this.dispatchData.length != 0) {
                    let dispatchAry = {
                        "kpi": 100,
                        "time": 0,
                        "note": "",
                        "operatorCode": dispatchOperatorCode,
                        "orderId": this.orderId,
                        "userId": this.dispatchData[0].personId,
                        "wfWorkItemId": this.workItemId
                    }
//                      console.log("dispatchAry +" + JSON.stringify(dispatchAry))
                    this.$axios.post('/eamDo/orderAssignment', dispatchAry).then((res) => {
                        let ret = res.data.response;
                        if (ret.code == 1) {
                            this.$Message.success("操作成功！");
                            setTimeout(()=>{
                                this.$router.push({path: '/maintenanceOrder', query: {type: this.listStatus, orderFlag: 2}});
                            },500)

                        } else {
                            this.$Message.error("操作失败！")
                        }
                    }).catch((err) => {
                        console.log(err);
                    })
                } else {
                    this.$Message.warning("请添加主责人！")
                }
            },
            /*******  dispatchStart 派工按钮 *********/
            /*******  arbitration 拒单、转仲裁 、撤单、延迟工单等状态的按钮 *********/
            arbitration(editReason, dispatchOperatorCode){
                if (editReason != "") {
                    let dispatchAry = {
                        "note": editReason,
                        "operatorCode": dispatchOperatorCode,
                        "orderId": this.orderId,
                        "wfWorkItemId": this.workItemId
                    };
    //                console.log("dispatchAry +" + JSON.stringify(dispatchAry))
                    this.$axios.post('/eamDo/maintainOrderOperator', dispatchAry).then((res) => {
                        let ret = res.data.response;
                        if (ret.code == 1) {
                            this.$Message.success("操作成功！");
                            this.$router.push({path: '/maintenanceOrder', query: { type: this.listStatus, orderFlag: 2}});
                        } else {
                            this.$Message.error("操作失败！")
                        }
                    }).catch((err) => {
                        console.log(err);
                    })
                } else {
                    this.$Message.error("请填写理由！")
                }
            },
            /*******  arbitration 转仲裁 *********/
            /*******  dispatchStart 拒单、之后状态的按钮 *********/
           /* dispatchOtherEdit(editStatus){
                if (this.rejectReason != "") {
                    let dispatchAry = {
                        "note": this.rejectReason,
                        "operatorCode": editStatus,
                        "orderId": this.orderId,
                        "wfWorkItemId": this.workItemId
                    }
                    this.$axios.post('/eamDo/maintainOrderOperator', dispatchAry).then((res) => {
                        let ret = res.data.response;
                        if (ret.code == 1) {
                            this.$Message.success("操作成功！");
                            this.$router.push({path: '/maintenanceOrder', query: {'title': this.listTitle, type: this.listStatus, orderFlag: 2}});
                        } else {
                            this.$Message.error(ret.msg)
                        }
                    }).catch((err) => {
                        this.$Message.error(err)
                        console.log(err);
                    })
                } else {
                    this.$Message.error("请填写撤单理由！")
                }

            },*/
            /*******  dispatchStart 派工按钮 *********/
            /************* 图片管理按钮方法 -S- **************/
            editUploadImages(index){
                this.img_modal = true;
                this.editUploadImagesAry = this.maintainData[index].picData;
            },
            /*接单*/
            changeFault(val){
                if (val == "1") {
                    this.receiptDis = true;
                    this.editDisabled = true;
                    this.order_Form.faultCause = "";
//                    this.$refs['order_Form'].resetFields();
                } else {
                    this.receiptDis = false;
                    this.editDisabled = false;
                }
            },
            receiptOrder(){
                this.secondStepsData[0].liClass = "secondStepsLi";
                this.secondStepsData[1].liClass = "secondStepsLi active";
                this.receiptOk = true;
            },
            /*确认故障*/
            makeSureOrder(name){
                this.$refs[name].validate((valid) => {
                     if (valid) {
                         this.$axios.post('/eamDo/takingRepairOrder', {
                             "id": this.orderId,
                             "faultCause": this.order_Form.faultCause,
                             "faultDesc": this.order_Form.faultDesc,
                         }).then((res) => {
                             let ret = res.data.response;
                             if (ret.code == 1) {
                                 this.$Message.success("操作成功！");
                                 this.$router.push({path: '/orderSpareParts', query: {orderId: this.orderId, workItemId: this.workItemId, orderFlag: 2, addflag: 1, 'title': this.listTitle, type: this.listStatus,}});
                             } else {
                                 this.$Message.error("操作失败！")
                             }
                         }).catch((err) => {
                             console.log(err);
                         })
                     } else {
                        this.$Message.error("请填写信息！")
                     }
                 })
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
