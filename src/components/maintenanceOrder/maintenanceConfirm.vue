<template>
    <div class="basic fault-content">
        <!--模块名称-->
        <div class="title">
            <span>维修工单执行流程--确认【机修工】</span>
        </div>

        <div class="secondSteps">
            <ul class="secondStepsUl">
                <!--<li  v-for="(item,index) in secondStepsData" :class="item.liClass" @click="activeFun(index)">{{item.content}}</li>-->
                <li  v-for="(item,index) in secondStepsData" :class="item.liClass">{{item.content}}</li>
            </ul>
        </div>
        <!--表单-->
        <div class="form-content">
            <div class="second-title">报修信息</div>
            <Form ref="order_Form" :model="order_Form" label-position="right" inline :label-width="135" >
                <Form-item label="报修单号">
                    <Input v-model="order_Form.status" style="width: 160px;" disabled></Input>
                </Form-item>
                <Form-item label="报修单状态">
                    <Input v-model="order_Form.planCode" style="width: 160px;" disabled></Input>
                </Form-item>
                <Form-item label="报修部门">
                    <Input v-model="order_Form.planName" style="width: 160px;" disabled></Input>
                </Form-item>
                <Form-item label="报修人">
                    <Input v-model="order_Form.doType" style="width: 160px;" disabled></Input>
                </Form-item>
                <Form-item label="报修时间">
                    <Input v-model="order_Form.level" style="width: 160px;" disabled></Input>
                </Form-item>
                <Form-item label="报修地点">
                    <Input v-model="order_Form.ssCode" style="width: 160px;" disabled></Input>
                </Form-item>
                <Form-item label="故障描述">
                    <!--<div @click="viewName()">-->
                    <Input v-model="order_Form.ssName" style="width: 160px;" disabled></Input>
                    <!--</div>-->
                </Form-item>
                <Form-item label="机修类型">
                    <Input v-model="order_Form.version" style="width: 160px;" disabled></Input>
                </Form-item>
            </Form>
        </div>
        <!--备品备件---start-->
        <div class="form-content">
            <div class="second-title">维修信息</div>
            <Form ref="repair_Form" :model="repair_Form" label-position="right" inline :label-width="135" >
                <Form-item label="维修单号">
                    <Input v-model="repair_Form.status" style="width: 160px;" disabled></Input>
                </Form-item>
                <Form-item label="工单类型">
                    <Input v-model="repair_Form.planCode" style="width: 160px;" disabled></Input>
                </Form-item>
                <Form-item label="工单状态">
                    <Input v-model="repair_Form.planName" style="width: 160px;" disabled></Input>
                </Form-item>
                <Form-item label="制单人">
                    <Input v-model="repair_Form.doType" style="width: 160px;" disabled></Input>
                </Form-item>
                <Form-item label="制单日期">
                    <Input v-model="repair_Form.level" style="width: 160px;" disabled></Input>
                </Form-item>
            </Form>
        </div>
        <!--保养-->
        <div class="second-title mar-t-15">报修设备信息</div>
        <div style="overflow: hidden;">
            <Table class="mar-b-15" stripe border :columns="sparePartCol" :data="gettedParts"></Table>
        </div>
        <div class="second-title mar-t-15">工单派工</div>
        <div style="overflow: hidden;">
            <Table class="mar-b-15" stripe border :columns="standardColumns" :data="tpmTmp1"></Table>
        </div>
        <div class="second-title mar-t-15">故障确认信息</div>
        <div style="overflow: hidden;">
            <Form ref="confirm_Form" :model="confirm_Form" label-position="right" inline :label-width="135" >
                <Form-item label="故障位置">
                    <Input v-model="confirm_Form.status" style="width: 160px;"></Input>
                </Form-item>
                <Form-item label="是否故障">
                    <RadioGroup v-model="confirm_Form.version">
                        <Radio label="0">故障</Radio>
                        <Radio label="1">非故障</Radio>
                    </RadioGroup>
                </Form-item>
                <Form-item label="故障现象">
                    <Input v-model="confirm_Form.planName" style="width: 160px;"></Input>
                </Form-item>
                <Form-item label="故障原因">
                    <Input v-model="confirm_Form.doType" style="width: 160px;"></Input>
                </Form-item>
            </Form>
        </div>
        <div class="second-title mar-t-15">工单执行记录</div>
        <div style="overflow: hidden;">
            <Table class="mar-b-15"  stripe border :columns="columns_man2" :data="data_man2"></Table>
            <!--<div class="page" v-show="flag==0&&ttPages>5">
                <Page :total="ttPages" :current="curPage" size="small" show-elevator :page-size="5" @on-change="changePage3"></Page>
            </div>-->
        </div>
        <!--操作按钮-->
        <div align="center" class="btnGroupDesign">
            <router-link :to="{ path: 'orderSpareParts', query: {'title':'维修',actionTitle:'确认',firstStep:'故障确认'}}">
                <Button type="primary" size="large">接单</Button>
            </router-link>
            <Button type="primary" size="large">拒单</Button>
            <!--<Button type="primary" size="large" @click="">返回</Button>-->
        </div>
        <!--图片-->
        <Modal title="查看图片" v-model="img_modal" width="800">
            <Carousel  loop style="width: 760px">
                <CarouselItem v-for="(imageItem,ind) in editUploadImagesAry" :key="ind" >
                    <div class="demo-carousel">
                        <div class="demo-upload-list" style="border: 1px solid #ccc;width: 400px;min-height:400px;margin: auto;display: flex;">
                            <img v-show="flag == 1" :src=" '../static/'+ imageItem.savePath" style="width:100%;height:100%;object-fit: cover;">
                            <img v-show="flag == 0" :src=" '../static/'+ imageItem.filePath" style="width:100%;height:100%;object-fit: cover;">
                        </div>
                        <p :title="imageItem.fileName" style="text-align: center;margin: 25px 0">{{imageItem.fileName}}</p>
                    </div>
                </CarouselItem>
            </Carousel>
        </Modal>
    </div>
</template>

<script>
    export default {
        data (){
            return {

                secondStepsData:[
                    {
                        code:0,
                        content:"故障确认",
                        liClass:'secondStepsLi active'
                    },
                    {
                        code:1,
                        content:"工单备件领用",
                        liClass:'secondStepsLi'
                    },
                    {
                        code:2,
                        content:"工单下发终端",
                        liClass:'secondStepsLi'
                    },
                ],

                orderId: '', //从路由信息获取的工单id
                flag: 0,  //从路由信息获取的flag
                status: '',  //从路由信息获取的执行状态
                typeName: '',
                load_fix: false,
                load_fix_info:'',
                planName: '',
                order_Form:{
                    status: '',
                    planCode: '待处理',
                    planName: '',
                    planId: '',
                    doType: '',
                    level: '',
                    ssCode:"",
                    ssName:"",
                    version: '',
                    needShutDown: false,
                    requiredTime: '',
                    notifyTime: '',
                    dispatchTime: '',
                    equipmentLocs: '',
                    equipmentNames: ''
                },
                repair_Form:{
                    status: '',
                    planCode: '待处理',
                    planName: '',
                    planId: '',
                    doType: '',
                    level: '',
                    ssCode:"",
                    ssName:"",
                    version: '',
                    needShutDown: false,
                    requiredTime: '',
                    notifyTime: '',
                    dispatchTime: '',
                    equipmentLocs: '',
                    equipmentNames: ''
                },
                confirm_Form:{
                    status: '',
                    planCode: '待处理',
                    planName: '',
                    planId: '',
                    doType: '',
                    level: '',
                    ssCode:"",
                    ssName:"",
                    version: '',
                    needShutDown: false,
                    requiredTime: '',
                    notifyTime: '',
                    dispatchTime: '',
                    equipmentLocs: '',
                    equipmentNames: ''
                },
                //备品备件
                sparePartCol: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 80,
                        align: 'center'
                    },
                    {
                        title: '设备编码',
                        key: 'spName',
                        align: 'center',
                        render: (h, params) => {
                            return h('p', {
                                domProps: {
                                    title: params.row.spName
                                },
                                class: 'iview_tabDis',
                            }, params.row.spName)
                        },
                    },
                    {
                        title: '设备名称',
                        key: 'spType',
                        align: 'center',
                    },
                    {
                        title: '设备分类',
                        key: 'uomName',
                        align: 'center'
                    },
                    {
                        title: '设备类型',
                        key: 'quantity',
                        align: 'center'
                    },
                    {
                        title: '规格型号',
                        key: 'aa',
                        align: 'center'
                    },
                    {
                        title: '安装地点',
                        key: 'bb',
                        align: 'center'
                    },
                    {
                        title: '保管人',
                        key: 'cc',
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
                                            this.$router.push({path: '/resume',query: {'id': params.row.preAcceptanceId}})
                                        }
                                    }
                                }, '查看履历')
                            )
                            return h('div', btns)
                        },
                    },
                ],
                gettedParts: [
                    {
                        spName: 'XXX',
                        spType: '阿玛达冲床',
                        uomName: 'A类',
                        quantity: '冲压类',
                        aa: 'N31',
                        bb: '冲压一车间',
                        cc: 'XXX'
                    }
                ],
                sdColumns: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 80,
                        align: 'center'
                    },
                    {
                        title: '保养项目名称',
                        key: 'aa',
                        align: 'center'
                    },
                    {
                        title: '保养项目内容',
                        key: 'bb',
                        align: 'center'
                    },
                    {
                        title: '操作指导图',
                        key: 'cc',
                        align: 'center'
                    },
                    {
                        title: '备注',
                        align: 'center'
                    },
                ],
                sdTmp:[],
                totalSpare: 1,
                cutSparePage: 1,
                // 点检 -- 执行记录
                columns_man: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 80,
                        align: 'center'
                    },
                    {
                        title: '备件编码',
                        key: 'handleMan',
                        align: 'center'
                    },
                    {
                        title: '备件名称',
                        key: 'planTime',
                        align: 'center',
                    },
                    {
                        title: '所在仓库编码',
                        key: 'content',
                        align: 'center'
                    },
                    {
                        title: '所在仓库名称',
                        key: 'checkResult',
                        align: 'center'
                    },
                    {
                        title: '领用数量',
                        key: 'aa',
                        align: 'center'
                    },
                    {
                        title: '单位',
                        key: 'bb',
                        align: 'center'
                    },
                    {
                        title: '经办人',
                        key: 'cc',
                        align: 'center'
                    },
                    {
                        title: '领用人',
                        key: 'dd',
                        align: 'center'
                    },
                    {
                        title: '备注',
                        key: 'ee',
                        align: 'center'
                    }
                ],
                data_man: [],
                totalPages: 1,
                currentPage: 1,
                //  保养项目
                standardColumns:[
                    {
                        title: '序号',
                        type: 'index',
                        width: 80,
                        align: 'center'
                    },
                    {
                        title: '姓名',
                        key: 'content',
                        align: 'center'
                    },
                    {
                        title: '编码',
                        key: 'requirement',
                        align: 'center',
                    },
                    {
                        title: '卡号',
                        key: 'aa',
                        align: 'center'
                    },
                    {
                        title: '岗位',
                        key: 'bb',
                        align: 'center'
                    },
                    {
                        title: '班组',
                        key: 'cc',
                        align: 'center'
                    },
                    {
                        title: '绩效占比（%）',
                        key: 'dd',
                        align: 'center'
                    }
                ],
                tpmTmp1: [
                    {
                        content: '彭莉军',
                        requirement: 'XXX',
                        aa: 'XXX',
                        bb: '机修组长',
                        cc: '机械组',
                        dd: '100%'
                    }
                ],
                totalColPages: 1,
                colPage: 1,
                // 点检项目
                checkColumns:[
                    {
                        title: '序号',
                        key: 'sortNo',
                        align: 'center',
                        width: '80'
                    },
                    {
                        title: '点检内容',
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
                        title: '点检要求',
                        key: 'require',
                        align: 'center',
                        render:(h,params) => {
                            return h('p',{
                                domProps:{
                                    title:params.row.require,
                                },
                                class:'iview_tabDis'
                            },params.row.require)
                        }
                    },
                    {
                        title: '点检耗时(分钟)',
                        key: 'requireTime',
                        align: 'center',
                        render: (h, params) => {
                            return h('p', {
                                domProps: {
                                    title: params.row.requireTime
                                },
                                class: 'iview_tab_numDis',
                            }, params.row.requireTime)
                        }
                    },
                    {
                        title: '点检方式',
                        key: 'way',
                        align: 'center',
                    },
                    {
                        title: '参照图片',
                        key: 'picData',
                        align: 'center',
                        render:(h,params)=>{
                            let showImgAry = [];
                            if (params.row.picData != undefined) {
                                if(params.row.picData.length>0){
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
                            }else {
                                showImgAry.push(
                                    h('p','暂无图片')
                                )
                            }

                            return h('div',showImgAry)
                        }
                    }
                ],
                tpmTmp2: [],
                totalTtemPage: 1,
                itemCurPage: 1,
                // 保养 -- 执行记录
                columns_man2: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 80,
                        align: 'center'
                    },
                    {
                        title: '执行操作',
                        key: 'operate',
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
                        title: '操作时间',
                        key: 'time',
                        align: 'center',
                    },
                    {
                        title: '结果状态',
                        key: 'result',
                        align: 'center',
                    },
                    {
                        title: '意见反馈',
                        key: 'note',
                        align: 'center'
                    },
                ],
                data_man2:[
                    {
                        operate: '派工给澎莉军',
                        operator: '任新波',
                        role: '设备管理员',
                        time: 'XXX',
                        result: '已派工',
                        note: ''
                    },
                    {
                        operate: '拒单',
                        operator: '彭莉军',
                        role: '机修组长',
                        time: 'XXX',
                        result: '已拒单',
                        note: '当天任务多，无时间执行'
                    },
                    {
                        operate: '转设备科长',
                        operator: '任新波',
                        role: '设备管理员',
                        time: 'XXX',
                        result: '待派工',
                        note: ''
                    }
                ],
                ttPages: 1, //执行记录列表数
                curPage: 1,
                //图片相关
                img_modal: false,
                editUploadImagesAry:[],
                savePath: '',
            }
        },
        mounted(){

        },

        methods: {

        },
    }
</script>
<style>
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
