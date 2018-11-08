<template>
    <div class="basic bzzy-change">
        <!--模块名称-->
        <div class="title">
            <span>设备履历卡</span>
        </div>
        <!--表单-->
        <div class="form-content">
            <Form ref="resumeForm" inline :model="resumeForm" :label-width="110" label-position="right">
                <Row>
                    <Col :span="4">
                    <Carousel loop>
                        <CarouselItem v-for="(imageItem,ind) in uploadImagesAry" :key="ind" >
                            <div class="demo-carousel">
                                <div class="demo-upload-list" style="border: 1px solid #ccc;width: 140px;height: 140px;margin: auto;display: flex;">
                                    <img :src=" '../static/'+ imageItem" style="width:100%;object-fit: cover;">
                                </div>
                            </div>
                        </CarouselItem>
                    </Carousel>
                    <p v-show="uploadImagesAry.length==0" style="border: 1px solid #ccc;width: 140px;height: 140px;margin: auto;">暂无图片！</p>
                    </Col>
                    <Col :span="17">
                    <Form-item label="设备名称" prop="equipmentName">
                        <Input v-model="resumeForm.equipmentName" style="width: 160px;" disabled="disabled"></Input>
                    </Form-item>
                    <Form-item label="使用单位" prop="department">
                        <Input v-model="resumeForm.department" style="width: 160px;" disabled="disabled"></Input>
                    </Form-item>
                    <Form-item label="设备编号" prop="equipmentCode">
                        <Input v-model="resumeForm.equipmentCode" style="width: 160px;" disabled="disabled"></Input>
                    </Form-item>
                    <Form-item label="规格型号" prop="model">
                        <Input v-model="resumeForm.model" style="width: 160px;" disabled="disabled"></Input>
                    </Form-item>
                    <Form-item label="制造编号" prop="manufacturerEquipmentCode">
                        <Input v-model="resumeForm.manufacturerEquipmentCode" style="width: 160px;" disabled="disabled"></Input>
                    </Form-item>
                    <Form-item label="设备功率" prop="power">
                        <Input v-model="resumeForm.power" style="width: 160px;" disabled="disabled" :class="shelterFlag?'':'shelterWord'"></Input>
                    </Form-item>
                    <Form-item label="制造日期" prop="manufactureDate">
                        <Input v-model="resumeForm.manufactureDate" style="width: 160px;" disabled="disabled"></Input>
                    </Form-item>
                    <Form-item label="投运日期" prop="startToUseDate">
                        <Input v-model="resumeForm.startToUseDate" style="width: 160px;" disabled="disabled"></Input>
                    </Form-item>
                    <Form-item label="重量（KG）" prop="weights">
                        <Input v-model="resumeForm.weights" style="width: 160px;" disabled="disabled"></Input>
                    </Form-item>
                    <Form-item label="制造厂商" prop="manufacturer">
                        <Input v-model="resumeForm.manufacturer" style="width: 160px;" disabled="disabled"></Input>
                    </Form-item>
                    </Col>
                    <Col :span="3">
                        <!--<img :src="qrCode" style="width: 100%;">-->
                        <!--<img v-if="qrCode!=''" :src=" '../static/'+ qrCode" style="width: 140px;height: 140px;object-fit: cover;">-->
                    </Col>
                </Row>
            </Form>
            <!--表格-->
            <div>
                <p class="resumeTitle" style="padding: 6px;font-size: 16px">主机及附属登记</p>
                <Table border :columns="hostRegister" :data="hostRegisterData"></Table>
                <!--<p style="padding: 6px;font-size: 16px;margin-top: 10px">设备调拨记录</p>-->
                <!--<Table border :columns="deviceCon" :data="deviceConData"></Table>-->
                <p style="padding: 6px;font-size: 16px;margin-top: 10px">设备维修记录</p>
                <Table border :columns="deviceSituation" :data="deviceSituationDate"></Table>
                <p style="padding: 6px;font-size: 16px;margin-top: 10px">设备保养记录</p>
                <Table border :columns="deviceMaintain" :data="deviceMaintainData"></Table>
                <p style="padding: 6px;font-size: 16px;margin-top: 10px">设备改造记录</p>
                <Table border :columns="deviceFeform" :data="deviceFeformData"></Table>
                <p style="padding: 6px;font-size: 16px;margin-top: 10px">设备报废记录</p>
                <Table border :columns="deviceScrap" :data="deviceScrapData"></Table>
            </div>
        </div>
        <div align="center" class="btnGroupDesign">
            <Button class="btn-gary" icon="chevron-left" @click="backHandle">返回</Button>
        </div>
    </div>
</template>
<script>
    import PandoraUpload from '../../api/pandora-upload/pandoraUpload.vue';
    export default {
        data () {
            return{
                /*遮挡shelterFlag*/
                shelterFlag:false,
                hostRegister:[
                    {
                        type: 'index',
                        title: '序号',
                        align:"center"
                    },
                    {
                        title:"名称",
                        key:'name',
                        align:"center"
                    },
                    {
                        title:'型号规格',
                        key:'model',
                        align:"center"
                    },
                    {
                        title:'备注',
                        key:'note',
                        align:"center"
                    }
                ],
                hostRegisterData:[],
                deviceCon:[
                    {
                        type: 'index',
                        title: '序号',
                        align:"center"
                    },
                    {
                        title:"日期",
                        key:'time',
                        align:"center"
                    },
                    {
                        title:"异动原因",
                        key:'movementCause',
                        align:"center"
                    },
                    {
                        title:"由何处调往何处",
                        key:'wherecomefrom',
                        align:"center"
                    }
                ],
                deviceConData:[],
                deviceSituation:[
                    {
                        type: 'index',
                        title: '序号',
                        align:"center"
                    },
                    {
                        title:"是否委外",
                        key:'flag',
                        align:"center",
                        render:(h,params)=>{
                            return h('div',params.row.flag==0?'是':'否')
                        }
                    },
                    {
                        title:"下发日期",
                        key:'startTime',
                        align:"center"
                    },
                    {
                        title:"完成日期",
                        key:'endTime',
                        align:"center"
                    },
                    {
                        title:"记录内容",
                        key:'content',
                        align:"center"
                    },
                    {
                        title:"报修人",
                        key:'originator',
                        align:"center"
                    },
                    {
                        title:"维修人",
                        key:'approver',
                        align:"center"
                    },
                    {
                        title:"委外金额（万元）",
                        key:'money',
                        align:"center",
                        render:(h,params)=>{
                            return h('p', {
                                class:this.shelterFlag?'':'shelterWord',
                            }, params.row.money)
                        }
                    },
                ],
                deviceSituationDate:[],
                deviceMaintain:[
                    {
                        type: 'index',
                        title: '序号',
                        align:"center"
                    },
                    {
                        title:"下发日期",
                        key:'startTime',
                        align:"center"
                    },
                    {
                        title:"完成日期",
                        key:'endTime',
                        align:"center"
                    },
                    {
                        title:"记录内容",
                        key:'content',
                        align:"center"
                    },
                    {
                        title:"发起人",
                        key:'originator',
                        align:"center"
                    },
                    {
                        title:"执行人",
                        key:'approver',
                        align:"center"
                    },
                    {
                        title:"归档文件",
                        key:'action',
                        align:"center",
                        render: (h, params) => {
                            let btns = [];
                            btns.push(
                                h('a', {
                                    class: 'mar-r-5',
                                    on: {
                                        click: () => {
                                            this.maintainFiles(params.row.orderId);
                                        }
                                    }
                                }, '保养归档')
                            );
                            return h('div', btns)
                        },
                    }
                ],
                deviceMaintainData:[],
                deviceFeform:[
                    {
                        type: 'index',
                        title: '序号',
                        align:"center"
                    },
                    {
                        title:"申请日期",
                        key:'startTime',
                        align:"center"
                    },
                    {
                        title:"完成日期",
                        key:'endTime',
                        align:"center"
                    },
                    {
                        title:"记录内容",
                        key:'content',
                        align:"center"
                    },
                    {
                        title:"申请人",
                        key:'originator',
                        align:"center"
                    },
                    {
                        title:"批准人",
                        key:'approver',
                        align:"center"
                    },
                    {
                        title:"归档文件",
                        key:'action',
                        align:"center",
                        render: (h, params) => {
                            let btns = [];
                            btns.push(
                                h('a', {
                                    class: 'mar-r-5',
                                    on: {
                                        click: () => {
                                            this.reformFiles(params.row.formId);
                                        }
                                    }
                                }, '改造归档')
                            );
                            return h('div', btns)
                        },
                    }
                ],
                deviceFeformData:[],
                deviceScrap:[
                    {
                        type: 'index',
                        title: '序号',
                        align:"center"
                    },
                    {
                        title:"申请日期",
                        key:'startTime',
                        align:"center"
                    },
                    {
                        title:"完成日期",
                        key:'endTime',
                        align:"center"
                    },
                    {
                        title:"记录内容",
                        key:'content',
                        align:"center"
                    },
                    {
                        title:"申请人",
                        key:'originator',
                        align:"center"
                    },
                    {
                        title:"批准人",
                        key:'approver',
                        align:"center"
                    },
                    {
                        title:"归档文件",
                        key:'action',
                        align:"center",
                        render: (h, params) => {
                            let btns = [];
                                    btns.push(
                                        h('a', {
                                            class: 'mar-r-5',
                                            on: {
                                                click: () => {
                                                    this.scraFiles(params.row.formId);
                                                }
                                            }
                                        }, '报废归档')
                                    );
                            return h('div', btns)
                        },
                    }
                ],
                deviceScrapData:[],
                resumeForm:{
//                    fileUrl: "",
                    equipmentName: "",
                    department: "",
                    equipmentCode: "",
                    model: "",
                    manufacturerEquipmentCode: "",
                    power: "",
                    manufactureDate: "",
                    startToUseDate: "",
                    weights: "",
                    manufacturer: "",
                    pic: [],
                },
                created: false,
                thePageId: '',
                /*设备图片*/
                uploadImagesAry:[],
                /*设备二维码*/
                qrCode: '',
            }
        },
        activated: function () {
            this.created && this.resume();
            this.created = true;
        },
        mounted(){
            this.thePageId = this.$route.query.id;
            this.resume();
        },
        components: {
            PandoraUpload
        },
        methods:{
            /*******  保养归档 S *******/
            maintainFiles(formId){
                this.$axios.get('/tEamExport/EquipmentMaintenanceScheduleFormArchivingExport', {
                    params: {
                        formId: formId
                    }
                }).then((res) => {
                    let respone = res.data.response;
                    if (respone.code  === 1) {
                        window.location.href = "../static/doc/" + respone.data.fileName;
                        this.$Message.success('保养归档成功！');
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
            /*******  保养归档 E *******/
            /*******  改造归档 S *******/
            reformFiles(formId){
                this.$axios.get('/tEamExport/equipmentTranformationApplicationFormExport', {
                    params: {
                        formId: formId
                    }
                }).then((res) => {
                    let respone = res.data.response;
                    if (respone.code  === 1) {
                        window.location.href = "../static/doc/" + respone.data.fileName;
                        this.$Message.success('改造归档成功！');
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
            /*******  改造归档 E *******/
            /*******  报废归档 S *******/
            scraFiles(formId){
                this.$axios.get('/tEamExport/equipmentScrappingApplicationFormExport', {
                    params: {
                        formId: formId
                    }
                }).then((res) => {
                    let respone = res.data.response;
                    if (respone.code  === 1) {
                        window.location.href = "../static/doc/" + respone.data.fileName;
                        this.$Message.success('报废归档成功！');
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
            /*******  报废归档 E *******/
            resume(){
                let vt = this;
                this.$axios.get('eamEquipment/readEquipmentResume', {
                    //请求
                    params: {
                        equipmentId: vt.thePageId
                    }
                }).then((res) => {
                    let result = res.data.response;
                    if (result.code == 1) {
                        vt.resumeForm = result.data;
                        vt.hostRegisterData = result.data.attachment;
                        vt.deviceSituationDate = result.data.repair;
                        vt.deviceMaintainData = result.data.maintain;
                        vt.deviceFeformData = result.data.modification;
                        vt.deviceScrapData = result.data.scrap;
                        //二维码相关
                        result.data.qrCode != undefined ? vt.qrCode = result.data.qrCode : vt.qrCode ="";
                        //轮播图片相关 - 判断
                        result.data.pic != undefined ? vt.uploadImagesAry = result.data.pic : vt.uploadImagesAry =[];
                        for(let val of result.data.roles){
                            val == '设备管理员'|| val == '设备科长'? vt.shelterFlag = true :vt.shelterFlag = false;
                        }
                    } else {
                        vt.$Message.error(result.msg)
                    }
                }).catch((err) => {
                    console.log(err);
                });
            },
            //返回
            backHandle() {
                this.$router.back();
            },
        }
    }
</script>