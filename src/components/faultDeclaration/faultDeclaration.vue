<template xmlns:v-bind="http://www.w3.org/1999/xhtml">
    <div class="basic fault-content">
        <Spin fix v-show="load_fix">
            <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
            <!--<div>保存中，请稍后...</div>-->
            <div>{{this.load_fix_info}}</div>
        </Spin>
        <!--模块名称-->
        <div class="title">
            <span>维修管理</span>
        </div>
        <!--按钮-->
        <div class="btn-group">
            <!--<router-link to="faultAdd">
                <Button v-show="this.$rt('14911')" type="primary" icon="plus" size="large">确认（机修工）</Button>
            </router-link>-->
        </div>
        <!--表单-->
        <div class="form-content">
            <Form ref="faultForm" :model="faultForm" :rules="ruleValidate" label-position="right" inline :label-width="100">
                <FormItem label="设备名称" prop="Name">
                    <Input v-model="faultForm.equName" @on-blur="faultForm.equName = toValidate(faultForm.equName)"></Input>
                </FormItem>
                <!--<FormItem label="设备地点" prop="Site">-->
                    <!--<div class="input-search pointDis" @click="equSite_mod = true">-->
                        <!--<Input v-model="faultForm.equSite" :readonly=true style="width: 160px;"></Input>-->
                        <!--<Button icon="ios-search"></Button>-->
                    <!--</div>-->
                <!--</FormItem>-->
                <FormItem label="设备地点" prop="Site">
                    <div style="color: #FFFFFF;" onmousemove="this.style.color='#5B5B5B';" onmouseout="this.style.color='#FFFFFF'">
                        <span @click="deleteEquSite_item" v-if="faultForm.equSite">
                            <Icon type="ios-close" class="deleteTab"></Icon>
                        </span>
                        <div class="input-search" @click="equSite_mod=true;">
                            <Input :maxlength="20" @on-change="lengthChange(faultForm.equSite)" v-model="faultForm.equSite" readonly style="width: 160px;"></Input>
                            <Button icon="ios-search"></Button>
                        </div>
                    </div>
                </FormItem>
                <Form-item label="上报人" prop="reporter">
                    <Input v-model="faultForm.reporterName" @on-blur="faultForm.reporterName = toValidate(faultForm.reporterName)" style="width: 160px;" placeholder=""></Input>
                </Form-item>
                <Form-item label="执行人" prop="handle">
                    <Input v-model="faultForm.handleName" @on-blur="faultForm.handleName = toValidate(faultForm.handleName)" style="width: 160px;" placeholder=""></Input>
                </Form-item>
                <Form-item label="执行状态" prop="Status">
                    <Select style="width: 160px;" v-model="faultForm.handleStatus">
                        <Option v-for="status in handleStatusArr" :value="status.code" :key="status.code">{{status.desc}}</Option>
                    </Select>
                </Form-item>
                <!--<Form-item label="驳回与否">-->
                    <!--<Select style="width: 160px;">-->
                        <!--<Option v-for="status in rejectStatusArr" :value="status.value" :key="status.value"></Option>-->
                    <!--</Select>-->
                <!--</Form-item>-->
                <Form-item label="备件申领" prop="apply">
                    <Select style="width: 160px;" v-model="faultForm.applyStatus">
                        <Option v-for="status in applyStatusArr" :value="status.code" :key="status.code">{{status.desc}}</Option>
                    </Select>
                </Form-item>
                <Form-item label="上报时间" prop="time">
                    <Row>
                        <Col span="11">
                            <Date-picker v-model="faultForm.startTime" type="datetime" placeholder="选择日期和时间" :editable="editable" @on-change="checkStart"></Date-picker>
                        </Col>
                        <Col span="2" style="text-align: center">~</Col>
                        <Col span="11">
                            <Date-picker v-model="faultForm.endTime" type="datetime" placeholder="选择日期和时间" :editable="editable" @on-change="checkEnd"></Date-picker>
                        </Col>
                    </Row>
                </Form-item>
                <!--<Form-item label="是否停机" prop="needShutdown">
                    <Select v-model="workForm.needShutdown" clearable style="width: 160px;" >
                        <Option v-for="item in workForm.needShutdownItem" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </Form-item>
                <Form-item label="审核人" prop="reviewerId">
					<Input v-model="workForm.reviewerId" style="width: 160px;" placeholder=""></Input>
				</Form-item>
                <Form-item label="确认人" prop="confirmerName">
                <Input v-model="workForm.confirmerName" style="width: 160px;" placeholder=""></Input>
                </Form-item>
                <Form-item label="故障确认时间" prop="confirmTime">
                    <Row>
                        <Col span="11">
                        <Date-picker v-model="workForm.confirmTime" type="datetime" placeholder="选择日期和时间" @on-change="changeconfirmTime" disabled></Date-picker>
                        </Col>
                        <Col span="2" style="text-align: center">~</Col>
                        <Col span="11">
                        <Date-picker v-model="workForm.confirmTime2" type="datetime" placeholder="选择日期和时间" @on-change="changeconfirmTime2" disabled></Date-picker>
                        </Col>
                    </Row>
                </Form-item>
                <Form-item label="计划停机时间" prop="expectedRepairTime">
                    <Row>
                        <Col span="11">
							<Date-picker v-model="workForm.expectedRepairTime" type="datetime" placeholder="选择日期和时间" @on-change="changeexpectedRepairTime"></Date-picker>
                        </Col>
                        <Col span="2" style="text-align: center">~</Col>
                        <Col span="11">
							<Date-picker v-model="workForm.expectedRepairTime2" type="datetime" placeholder="选择日期和时间" @on-change="changeexpectedRepairTime2"></Date-picker>
                        </Col>
                    </Row>
                </Form-item>-->
            </Form>
            <!--查询按钮-->
            <div class="btn-query">
                <Button type="primary" icon="forward" size="large" disabled>导出</Button>
                <Button type="primary" icon="search" size="large" @click="changePage(1)">查询</Button>
            </div>
        </div>
        <!--表格-->
        <div class="table-content">
            <!--<Table class="table-edit" stripe border :columns="columns3" :data="data3"></Table>-->
            <!--表格-->
            <!--<div class="table-content">-->
                <div class="table-reset">
                    <table class="table table-bordered table-center table-striped table-blue taDisplay">
                        <thead>
                        <tr>
                            <th class="wid-70p">序号</th>
                            <th>设备名称</th>
                            <th>设备地点</th>
                            <th>上报人</th>
                            <th class="wid-10">上报时间</th>
                            <th>执行人</th>
                            <th class="wid-20-per">故障描述</th>
                            <th class="wid-20-per">故障原因</th>
                            <th>备品备件</th>
                            <th>执行状态</th>
                            <!--<th>驳回与否</th>-->
                            <th>备件申领</th>
                            <th>操作</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="(itemData,index) in data3" class="trDisplay">
                            <td>{{index + 1}}</td>
                            <td class="tdDisplay pointDis" :title="itemData.equipmentName">{{itemData.equipmentName}}</td>
                            <td class="tdDisplay pointDis" :title="itemData.equipmentLocation">{{itemData.equipmentLocation}}</td>
                            <td :title="itemData.submitter">{{itemData.submitter}}</td>
                            <td class="tdDisplay pointDis" :title="itemData.submitTime">{{itemData.submitTime}}</td>
                            <td :title="itemData.operator">{{itemData.operator}}</td>
                            <td class="tdDisplay pointDis" :title="itemData.faultDesc">{{itemData.faultDesc}}</td>
                            <td class="tdDisplay pointDis" :title="itemData.faultCause">{{itemData.faultCause}}</td>
                            <td class="tdDisplay pointDis" :title="itemData.spartPartName">{{itemData.spartPartName.join('、')}}</td>
                            <td :title="itemData.executionStatus">{{itemData.executionStatus}}</td>
                            <!--<td>{{itemData.rejectStatus}}</td>-->
                            <td :title="itemData.faultDesc">{{itemData.sparePartAppStatus}}</td>
                            <!--<td><a class="mar-r-5" size="small" @click="toolBar(index)">{{itemData.toolBtn}}</a></td>-->
                            <td><a class="mar-r-5" size="small" @click="toolBar(index)">查看</a></td>
                        </tr>
                        </tbody>
                    </table>
                    <div class="tableHasNoData" v-show="!data3.length"><p>暂无数据</p></div>
                </div>
            <!--</div>-->
        </div>
        <div class="page">
            <Page :total="numMaterial" :current="tempPage" size="small" show-elevator :page-size="10" @on-change="changePage"></Page>
            <!--<Page :total="40" size="small" show-elevator show-sizer></Page>-->
        </div>
        <!--<Modal v-model="modalE" width="360">
            <p slot="header" style="color: #ff6a6a; text-align: center;">
                <Icon type="information-circled"></Icon>
                <span v-if="voidOrDel">作废确认</span>
                <span v-else>删除确认</span>
            </p>
            <div style="text-align: center;">
                <p v-if="voidOrDel">是否作废此单据？</p>
                <p v-else>是否继续删除？</p>
            </div>
            <div slot="footer">
                <Button type="error" size="large" long :loading="modalE_loading" @click="invalid" v-if="voidOrDel">作废</Button>
                <Button type="error" size="large" long :loading="modalE_loading" @click="del" v-else>删除</Button>
            </div>
        </Modal>
        <Modal v-model="equipment_code" title="适用设备" width="820" @on-ok="selectSb">
            <Row>
                <Col :span="6" class="pad-r-10">
                <div class="pad-5-20 bg-linegary">地点名称</div>
                <Tree :data="baseData" show-checkbox :multiple="false" :show-checkbox="false" @on-select-change="getLocationId" class="max-h-300"></Tree>
                </Col>
                <Col :span="18" class="pad-l-10">
                <table class="table table-bordered table-center table-striped table-blue">
                    <thead>
                    <tr>
                        <th>选择</th>
                        <th>序号</th>
                        <th>设备编码</th>
                        <th>设备名称</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(sb, index) in tpmsb">
                        <td>
                            <div v-html="sb.radio"></div>
                        </td>
                        <td>{{index + 1}}</td>
                        <td>{{sb.equipmentCode}}</td>
                        <td>{{sb.equipmentName}}</td>
                    </tr>
                    </tbody>
                </table>
                <div class="mar-t-10" style="overflow: hidden">
                    <div style="float: right;">
                        <Page :total="tpmsbTotal" :current="tpmsbCurrent" size="small" show-elevator :page-size="pageSize" @on-change="changeEquipment"></Page>
                    </div>
                </div>
                </Col>
            </Row>
        </Modal>-->
        <!--设备地点-->
        <Modal v-model="equSite_mod" title="设备地点" @on-ok="toSelect_equSite">
            <Tree :data="baseData" show-checkbox :multiple="false" :show-checkbox="false" @on-select-change="left_personSelected" class="max-h-300"></Tree>
        </Modal>
    </div>
</template>
<script>
    import equ_typeSelect from "../treeMulitiple/equ_typeSelect.vue";
    export default {
        data (){
            //验证名称
            const validateAge = (rule, value, callback) => {
            };
            return {
                load_fix: false,
                load_fix_info: '',
                faultForm:{
                    equName: '',
                    equSite: '',
                    reporterName: '',
                    handleName: '',
                    handleStatus: -1,
                    applyStatus: -1,
                    startTime: '',
                    endTime: ''
                },
                handleStatusArr: this.$base_info.executionStatusEnum,
                applyStatusArr: this.$base_info.tEamSparePartApplicationTyepEnum,
                editable: false,
                created: false,
                equSite_mod: false,
                equ_site_obj: "",
                tempPage:1,
                numMaterial: 5,
                baseData:[],
                data3: [],
                ruleValidate: {},
//                loadingStatus: false,
//                rejectStatus: '',
//                rejectStatusArr: [
//                    {
//                        value: '全部',
//                        label: '全部'
//                    },
//                    {
//                        value: '是',
//                        label: '是'
//                    },
//                    {
//                        value: '否',
//                        label: '否'
//                    },
//                ],
                /*baseData: [{
                    expand: true,
                    title: '皮尔博格',
                    children: [{
                        title: '压铸车间1',
                        expand: true,
                        disabled: true,
                        children: [{
                            title: '设备1',
                            disableCheckbox: true,
                        },
                            {
                                title: '设备2',
                            }]
                    },
                        {
                            title: '压铸车间2',
                            expand: true,
                            checked: true,
                            children: [{
                                title: '设备3',
                            },
                                {
                                    title: '设备4',
                                }]
                        }]
                }],*/

                /*设备放大镜*/
//                tpmsb: [],
//                tpmsbTotal: 0,
//                locationId: '',
//                tpmsbCurrent: 1,
            }
        },

        components: {
            'equ_typeSelect': equ_typeSelect,
        },

        mounted(){
//            console.log('66666 '+ JSON.stringify(this.$base_info.executionStatusEnum) );
            this.get_fault();
            this.get_equSite();
        },
        activated: function () {
            this.created && this.get_fault();
            this.created = true;
        },
        methods: {
            toValidate(msg){
                console.log(msg);
                var str = /[=+%!<>"'/_,()\\]/
                if(str.test(msg)){
                    this.$Message.warning('输入格式错误')
                    msg = msg.replace(/\'/g,"").replace(/\"/g,"").replace(/\+/g,"").replace(/\=/g,"").replace(/\%/g,"").replace(/\!/g,"").replace(/\</g,"").replace(/\>/g,"").replace(/\//g,"").replace(/\_/g,"").replace(/\,/g,"").replace(/\(/g,"").replace(/\)/g,"").replace(/\\/g,"");
                }
                return msg
            },
            deleteEquSite_item(){
                this.faultForm.equSite = "";
            },
            changePage(current){
                this.tempPage = current;
                this.get_fault();
            },
            //获取维修工单列表:
            get_fault(){
                let vt = this;
//                console.log('关联设备 '+JSON.stringify(this.faultForm));
//                console.log('领用记录领用记录id '+ id );
                this.$axios.post('/eamDo/repairOrderList',
                    {
                        page: vt.tempPage,
                        pageSize: 10,
                        equipmentLocation: vt.faultForm.equSite ? vt.equ_site_obj.id : "",
                        equipmentName: vt.faultForm.equName,
                        executionStatus: vt.faultForm.handleStatus,
                        operator: vt.faultForm.handleName,
                        sparePartAppStatus: vt.faultForm.applyStatus,
                        submitTimeStart: vt.faultForm.startTime,
                        submitTimeEnd: vt.faultForm.endTime,
                        submitter: vt.faultForm.reporterName
                    }).then((res) => {
//                    console.log('9999999 '+ JSON.stringify(res) );
//                    console.log('00 '+ vt.faultForm.applyStatus );
//                    console.log('11 '+ vt.faultForm.reporterName );
//                    console.log('22 '+ vt.faultForm.handleName );
                    let result = res.data.response;
                    if (result.code != 1) {
                        vt.$Message.error(result.msg);
                    }
                    else {
                        vt.numMaterial = result.data.total;
                        vt.data3 = result.data.rows;
//                        console.log('66666 '+ JSON.stringify(vt.data3) );
                    }
                }).catch((err) => {
//                    console.log(err);
                });
            },
            //开始日期应小于结束日期
            checkStart(time){
                var stime = time;
                if (this.faultForm.endTime != '') {
                    if (stime > this.faultForm.endTime) {
                        this.notFitDataTip = '开始时间应在结束时间之前';
                        this.$Message.error(this.notFitDataTip);
                    }
                    else {
                        this.notFitDataTip = ""
                    };
                };
                this.faultForm.startTime = stime
            },
            //结束日期应大于开始日期
            checkEnd(time){
                var etime = time;
                if (this.faultForm.startTime != '') {
                    if (etime < this.faultForm.startTime) {
                        this.notFitDataTip = '结束时间应在开始时间之后';
                        this.$Message.error(this.notFitDataTip);
                    }
                    else {
                        this.notFitDataTip = ""
                    }
                };
                this.faultForm.endTime = etime;
//                if (this.time_start!= '') {
//                    if (this.time_end<= this.time_start) {
//                        this.$Message.error('结束时间应大于开始时间');
//                    }
//                }
            },
            toolBar:function (index) {
                let partId = this.data3[index].orderId;
//                let status = this.data3[index].executionStatus;
//                console.log(status);
//                this.$router.push({path: 'faultEdit',query: {'id': partId , "flag": 0 ,"status": handleStatus }});
                this.$router.push({path: 'faultEdit',query: {'id': partId , "flag": 0 }});
            },
//            changereportingTime: function (date) {
//                this.workForm.reportingTime = date;
//            },
//            changereportingTime2: function (date) {
//                this.workForm.reportingTime2 = date;
//            },
//            getEquipmnet: function (currentPage, locationId) {
//                let vm = this;
//                if (locationId == undefined) {
//                    locationId = vm.locationId;
//                }
//                let flg = false;
//                if (currentPage == undefined) {
//                    currentPage = 1;
//                }
//                if (currentPage == 0) {
//                    flg = true;
//                    currentPage = 1;
//                }
//                this.$axios.post('tpmStandardSolution/getEquipments/n', {
//                    page: currentPage,
//                    bdLocationId: locationId,
//                }).then((res) => {
//                    if (res.data.response.code == 1) {
//                        let dataRes = res.data.response.data;
//                        vm.tpmsbTotal = dataRes.Total;
//                        console.log("total: " + vm.tpmsbTotal);
//                        vm.tpmsb = new Array();
//                        for (let o in dataRes.Rows) {
//                            if (o != "unique") {
//                                let obj = {};
//                                obj["equipmentId"] = dataRes.Rows[o]["equipmentId"];
//                                obj["equipmentCode"] = dataRes.Rows[o]["equipmentCode"];
//                                obj["equipmentName"] = dataRes.Rows[o]["equipmentName"];
//                                obj["radio"] = "<input type='radio' name='tpmsb_radio' value='" + dataRes.Rows[o]["equipmentId"] + "'>";
//                                vm.tpmsb.push(obj);
//                            }
//                        }
//                        if (flg) {
//                            vm.tpmsbCurrent = 1;
//                        }
//                    }
//                }).catch((err) => {
//                    console.log(err);
//                });
//            },
            //设备地点完整树加载:
            get_equSite(){
                let vt = this;
                this.$axios.get('/common/location/locationNameTree',
//                    {
//                    params: {
//                        standardSolutionVersionId:"",
//                    }
//                }
                ).then((res) => {
                    let result = res.data.response;
                    if (result.code != 1) {
                        vt.$Message.error(result.msg);
                    }
                    else {
//                        console.log(result);
                        vt.baseData = result.data;
                        vt.baseData[0].expand = true;
                    }
                }).catch((err) => {
//                    console.log(err);
                });
            },
            //设备地点树选择：
            left_personSelected (left_node){
                if (JSON.stringify(left_node) == "[]") {
                    return
                };
//                var ele = left_node[left_node.length - 1];
//                ele.expand = !ele.expand;
                this.equ_site_obj=left_node[0];
            },
//            地点确定按钮：
            toSelect_equSite(){
                this.faultForm.equSite=this.equ_site_obj.title;
            },
            /*分页*/
//            changeEquipment: function (currentPage) {
//                this.tpmsbCurrent = currentPage;
//                this.getEquipmnet(currentPage, this.locationId);
//            },
//            getCookie: function (name) {
//                var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
//                // console.log("getcookie: " + document.cookie);
//                if (arr = document.cookie.match(reg)) {
//                    return decodeURIComponent(arr[2]);
//                }
//                else
//                    return null;
//            }
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