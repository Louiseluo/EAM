<template>
    <div class="basic fault-content">
        <Spin fix v-show="load_fix">
            <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
            <div>{{load_fix_info}}</div>
        </Spin>
        <!--模块名称-->
        <div class="title">
            <span>维修工单执行流程--派工</span>
        </div>

        <!--表单-->
        <div class="form-content">
            <Form ref="order_Form" :model="order_Form" label-position="right" inline :label-width="135" >
                <div class="second-title">报修信息</div>
                <Form-item label="报修单编码">
                    <Input v-model="order_Form.status" style="width: 160px;" disabled></Input>
                </Form-item>
                <Form-item label="报修单状态">
                    <Input v-model="order_Form.planCode" style="width: 160px;" disabled></Input>
                </Form-item>
                <Form-item label="报修部门">
                    <!--<div @click="toolBar(order_Form.planId)">-->
                        <Input v-model="order_Form.planName" style="width: 160px;" disabled></Input>
                    <!--</div>-->
                </Form-item>
                <Form-item label="报修人">
                    <Input v-model="order_Form.doType" style="width: 160px;" disabled></Input>
                </Form-item>
                <Form-item label="报修设备编码">
                    <Input v-model="order_Form.level" style="width: 160px;" disabled></Input>
                </Form-item>
                <Form-item label="报修时间">
                    <Input v-model="order_Form.ssCode" style="width: 160px;" disabled></Input>
                </Form-item>
                <Form-item label="报修地点">
                    <!--<div @click="viewName()">-->
                        <Input v-model="order_Form.ssName" style="width: 160px;" disabled></Input>
                    <!--</div>-->
                </Form-item>
                <Form-item label="故障描述">
                    <Input v-model="order_Form.version" style="width: 470px;" disabled></Input>
                </Form-item>
               <!-- <Form-item label="是否停机">
                    <div style="width: 160px;">
                        <i-switch v-model="order_Form.needShutDown" disabled>
                            <span slot="open">是</span>
                            <span slot="close">否</span>
                        </i-switch>
                    </div>
                </Form-item>-->
                <Form-item label="报修类型">
                    <Input v-model="order_Form.requiredTime" style="width: 160px;" disabled></Input>
                </Form-item>
                <div class="second-title">维修信息</div>
                <Form-item label="维修工单编码">
                    <Input v-model="order_Form.notifyTime" style="width: 160px;" disabled></Input>
                </Form-item>
                <Form-item label="工单类型">
                    <Input v-model="order_Form.dispatchTime" placeholder="已制单" style="width: 160px;" disabled></Input>
                </Form-item>
                <Form-item label="制单人">
                    <Input v-model="order_Form.equipmentLocs"  style="width: 160px;" disabled></Input>
                </Form-item>
                <Form-item label="制单日期">
                    <DatePicker type="date" placeholder="选择日期" disabled></DatePicker>
                </Form-item>
            </Form>
        </div>
        <!--备品备件---start-->

        <div class="second-title">报修设备信息</div>
        <div style="overflow: hidden;">
            <Table class="mar-b-15" stripe border :columns="sparePartCol" :data="gettedParts"></Table>
            <!--<div class="f_r" v-show="totalSpare>5">
                <Page :total="totalSpare" :current="cutSparePage" size="small" show-elevator :page-size="5" @on-change="changePage"></Page>
            </div>-->
        </div>
        <div class="second-title">工单派工</div>
        <div >
            <Table class="mar-b-15" stripe border :columns="standardColumns" :data="tpmTmp1"></Table>
            <!--<div class="f_r" v-show="flag==0&&totalColPages>5">
                <Page :total="totalColPages" :current="colPage" size="small" show-elevator :page-size="5" @on-change="changePageItem1"></Page>
            </div>-->
            <Button type="primary" size="small">添加</Button>
            <Button  size="small">删除</Button>
        </div>
        <!--点检项目-->
        <div style="overflow: hidden;">
            <Table v-show="flag==1" class="mar-b-15" stripe border :columns="checkColumns" :data="tpmTmp2"></Table>
            <div class="f_r" v-show="flag==1&&totalTtemPage>5">
                <Page :total="totalTtemPage" :current="itemCurPage" size="small" show-elevator :page-size="5" @on-change="changePageItem2"></Page>
            </div>
        </div>
        <!--执行记录---start-->
        <div class="second-title mar-t-15">备件领用记录</div>
        <!--点检-->
        <div style="overflow: hidden;">
            <Table class="mar-b-15" stripe border :columns="columns_man" :data="data_man"></Table>
            <!--<div class="f_r" v-show="flag==1&&totalPages>5">
                <Page :total="totalPages" :current="currentPage" size="small" show-elevator :page-size="5" @on-change="changePage2"></Page>
            </div>-->
        </div>
        <!--保养-->
        <div class="second-title mar-t-15">工单执行记录</div>
        <div style="overflow: hidden;">
            <Table class="mar-b-15"  stripe border :columns="columns_man2" :data="data_man2"></Table>
            <!--<div class="page" v-show="flag==0&&ttPages>5">
                <Page :total="ttPages" :current="curPage" size="small" show-elevator :page-size="5" @on-change="changePage3"></Page>
            </div>-->
        </div>
        <!--操作按钮-->
        <div align="center" class="btnGroupDesign">
           <!-- <router-link to="/maintenanceOrder" class="mar-r-20">
                <Button type="primary" size="large">返回</Button>
            </router-link>-->
            <Button v-show="flag==0&&status!='免维保'&&status!='已结束'" type="primary" size="large" @click="disMaintain">派发工单</Button>
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
                    ssName:"冲压一车间",
                    version: '机械故障',
                    needShutDown: false,
                    requiredTime: '损坏维修',
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
                        align: 'center',
                        render: (h, params) => {
                            return h('p', {
                                domProps: {
                                    title: params.row.uomName
                                },
                                class: 'iview_tab_numDis',
                            }, params.row.uomName)
                        }
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
                                            this.detail(params.row.preAcceptanceId)
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
                        title: '仓库名称',
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
                        width: 80,
                        align: 'center',
                        type: 'selection'
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
                        key: 'operator',
                        align: 'center',
                    },
                    {
                        title: '操作人',
                        key: 'plannedStartTime',
                        align: 'center',
                    },
                    {
                        title: '角色',
                        key: 'startTime',
                        align: 'center',
                    },
                    {
                        title: '操作时间',
                        key: 'endTime',
                        align: 'center',
                    },
                    {
                        title: '结果状态',
                        key: 'costTime',
                        align: 'center',
                    },
                    {
                        title: '意见反馈',
                        key: 'inTimeStatus',
                        align: 'center'
                    },
                ],
                data_man2:[],
                ttPages: 1, //执行记录列表数
                curPage: 1,
                //图片相关
                img_modal: false,
                editUploadImagesAry:[],
                savePath: '',
            }
        },
        mounted(){
            /*let flag = this.$route.query.flag;
            let orderId = this.$route.query.orderId;
            let status = this.$route.query.status;
//            console.log('flag == '+flag);
//            console.log('orderId == '+orderId);
            this.flag = flag;
            this.orderId = orderId;
            this.status = status;

            if (flag == 0) {
                this.typeName = '保养';
                this.initMainPage();
            } else if (flag == 1) {
                this.typeName = '点检';
                this.initCheckPage();
            }*/
        },

        methods: {
            //点检
            // console.log('点检');
            initCheckPage() {
                this.$axios.post('/eamDo/checkWorkOrderById', {
                    workOrderId: this.orderId,
                    partPage: this.totalSpare,
                    partPageSize: 5,
                    fulfilmentPage: this.currentPage,
                    fulfilmentPageSize: 5,
                    itemPage: this.itemCurPage,
                    itemPageSize: 5
                }).then((res) => {
//                    console.log('点检详情 == ' + JSON.stringify(res));
                    let ret = res.data.response;
                    if (ret.code == 1) {
                        //成功
                        this.order_Form = ret.data;
                        this.order_Form.status = this.$base_info.getDescByCode(ret.data.status, this.$base_info.executionStatusEnum);
                        this.order_Form.doType = this.$base_info.getDescByCode(ret.data.type, this.$base_info.tEamDispatchOrderTypeEnum);
                        this.order_Form.level = this.$base_info.getDescByCode(ret.data.planLevel, this.$base_info.planClazz);
                        this.order_Form.ssCode = ret.data.standardSolutionCode;
                        this.order_Form.ssName = ret.data.standardSolutionName;
                        this.order_Form.version = ret.data.standardSolutionVersion;
                        this.order_Form.needShutDown = ret.data.needShutDown == 0 ? true : false;
                        this.order_Form.requiredTime = ret.data.estimatedTime;
                        this.order_Form.dispatchTime = ret.data.dispatch_time;
                        this.order_Form.equipmentLocs = ret.data.equipmentLocation;
                        this.order_Form.equipmentNames = ret.data.equipmentName;

                        let sparePartData = [];
                        for (var q in ret.data.partData) {
                            sparePartData.push({
                                spName: ret.data.partData[q].partName,
                                spType: ret.data.partData[q].partType == 1 ? '通用' : '特殊',
                                uomName: ret.data.partData[q].partUnit,
                                quantity: ret.data.partData[q].partNum
                            });
                        }
                        this.gettedParts = sparePartData;
                        this.totalSpare = ret.data.partTotal;

//                            console.log('this.totalSpare');
//                            console.log(this.totalSpare);

                        let resultData = [];
                        for (var q in ret.data.fulfilment) {
                            resultData.push({
                                handleMan: ret.data.fulfilment[q].operator,
                                planTime: ret.data.fulfilment[q].planTime,
                                content: ret.data.fulfilment[q].content,
                                checkResult: ret.data.fulfilment[q].itemStatus == 0 ? '未上报' : ret.data.fulfilment[q].itemStatus == 1 ? '执行成功' : '执行失败'
                            });
                        }
//                        console.log('ret.data.fulfilment');
//                        console.log(' === '+JSON.stringify(ret.data.fulfilment));
                        this.data_man = resultData;
                        this.totalPages = ret.data.fulfilmentTotal;
                        this.tpmTmp2 = ret.data.items;
                        this.totalTtemPage = ret.data.itemsTotal;
                        for (var i in this.tpmTmp2) {
                            this.tpmTmp2[i].way = this.tpmTmp2[i].way == 0 ? '是否' : this.tpmTmp2[i].way == 1 ? '选项' : '输入';
                        }

                    } else {
                        this.$Message.error(result.msg)
                    }
                }).catch((err) => {
                    console.log(err);
                })
            },
            //保养
            // console.log('保养');
            initMainPage() {
                    this.$axios.get('/eamDo/maintenance/'+this.orderId, {
                        params: {
                            doId: this.orderId
                        }
                    }).then((res) => {
//                        console.log('保养详情 == '+JSON.stringify(res));
                        let result = res.data.response;
                        if (result.code == 1) {
                            //成功
                            this.order_Form = result.data;
                            this.order_Form.needShutDown = '是'?true:false;
                            this.getSpareParts();
                            this.getDoRecords();
                            this.getSops();
                        } else {
                            this.$Message.error(result.msg)
                        }
                    }).catch((err) => {
                        console.log(err);
                    })

            },
            //保养工单详情备件列表
            getSpareParts(){
                this.$axios.get('/eamDo/maintenance/sp', {
                    params: {
                        doId: this.orderId,
                        page: this.cutSparePage,
                        pageSize: 5
                    }
                }).then((res) => {
//                    console.log('备件列表');
//                    console.log(JSON.stringify(res));
                    let result = res.data.response;
                    if (result.code == 1) {
                        //成功
                         this.gettedParts = result.data.taskSpRows;
                         this.totalSpare = result.data.taskSpTotal;
//                         console.log('this.gettedParts');
//                         console.log(this.gettedParts);
                    } else {
                        this.$Message.error(result.msg)
                    }
                }).catch((err) => {
                    console.log(err)
                })
            },
            //保养工单详情保养项目列表
            getSops(){
                this.$axios.get('/eamDo/maintenance/sops', {
                    params: {
                        doId: this.orderId,
                        page: this.colPage,
                        pageSize: 5
                    }
                }).then((res) => {
//                    console.log('保养项目列表');
//                    console.log(JSON.stringify(res));
                    let result = res.data.response;
                    if (result.code == 1) {
                        //成功
                        this.tpmTmp1 = result.data.rows;
                        this.totalColPages = result.data.total;
//                         console.log('this.gettedParts');
//                         console.log(this.orderId);
                    }
                }).catch((err) => {
                    console.log(err)
                })
            },

            //执行记录列表
            getDoRecords(){
//                this.$axios.get('https://www.easy-mock.com/mock/5b29c3a6353194793efa876e/listData/nba', {
                this.$axios.get('/eamDo/maintenance/fulfilment', {
                    params: {
                        doId: this.orderId,
                        page: this.curPage,
                        pageSize: 5
                    }
                }).then((res) => {
//                    console.log('执行记录列表');
//                    console.log(JSON.stringify(res));
                    let result = res.data.response;
                    if (res.data.response.code == 1) {
                        //成功
                        this.data_man2 = result.data.implHistoryRows;
                        this.ttPages = result.data.implHistoryTotal;
//                        console.log('this.data_man2');
//                        console.log(this.data_man2);
//                        console.log(this.ttPages);
                    } else {
                        this.$Message.error(result.msg)
                    }
                }).catch((err) => {
                    console.log(err)
                })
            },

            //免保养
            disMaintain(){
                let vm = this;
                this.$axios.post('/eamDo/getTEamDispatchOrderNote',{tEamDispatchOrderId :vm.orderId}).then(function (response) {
                    let res = response.data.response;
                    if (res.code == 1) {
                        vm.load_fix = true;
                        vm.load_fix_info = '操作中，请稍候......';
                        setTimeout(function () {
                            vm.$router.push({path: '/maintenanceOrder'});
                        }, 1000);
                    } else {
                        vm.$Message.error(res.msg);
                    }
                }).catch((err) => {
                    console.log(err);
                });
            },

            //查看计划详情
            toolBar (id) {
//                console.log('id');
//                console.log(id);
                this.$router.push({path: '/PlanDetail', query: {"planTaskId": id}});
            },
            /************* 图片管理按钮方法 -S- **************/
            editUploadImages(index){
                if (this.flag == 0) {
                    //保养项目
//                    console.log('保养项目  tpmTmp1')
                    this.editUploadImagesAry = this.tpmTmp1[index].picFiles;
                } else {
//                    console.log('点检项目')
                    this.editUploadImagesAry = this.tpmTmp2[index].picData;
                }
                setTimeout(() => {
                    this.img_modal = true;
                }, 1000);
            },

            //备品备件 -- 翻页
            changePage(curPage) {
                this.cutSparePage = curPage;
                if (this.flag == 0) {
                    //点检
                    this.initCheckPage();
                } else {
                    //保养
                    this.getSpareParts();
                }
            },
            //点检 -- 执行记录 -- 翻页
            changePage2(curPage) {
                this.currentPage = curPage;
                this.initCheckPage();
            },
            //保养 -- 执行记录 -- 翻页
            changePage3(currentPage) {
                this.curPage = curPage;
                this.getDoRecords();
            },

            //保养项目 -- 翻页
            changePageItem1(curPage) {
                this.colPage = curPage;
                this.getSops();
            },
            //点检项目 -- 翻页
            changePageItem2(curPage) {
                this.itemCurPage = curPage;
                this.initCheckPage();
            },
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
