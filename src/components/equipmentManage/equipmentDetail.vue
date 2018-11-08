<template>
    <div class="basic fault-content">
        <!--模块名称-->
        <div class="title">
            <span>{{theTitle}}</span>
        </div>
        <div class="second-title">基础信息</div>
        <div>
            <div>
                <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" inline :label-width="100"
                      class="equ_addForm">
                    <div class="imgDiv radio_item" style="padding-bottom:30px;">
                        <div class="uploadImg"
                             style="width: 240px;height: 200px;left: 15px;top: 15px;">
                            <p style="text-align: center;margin: 10px 0;" v-if="imgDis||!toEdit">设备图片：</p>
                            <div>
                                <p style="text-align:center;margin-top:30%;color:red" v-if="!imgDis&&toEdit">暂无图片!</p>
                                <Carousel v-if="imgDis||!toEdit">
                                    <CarouselItem v-for="(itemImg ,index) in upLoadFiles" :key="index" >
                                        <div class="demo-carousel">
                                            <div class="demo-upload-list" style="border: 1px solid #ccc;width: 200px;height: 150px;margin: auto;display: flex;">
                                                <img :src=" '../static/'+ itemImg.savePath" style="width:100%;height:100%;object-fit: cover;">
                                                <div class="demo-upload-list-cover">
                                                    <div style="padding-top:20%;">
                                                        <Icon type="ios-eye-outline" @click.native="handleView(index)"></Icon>
                                                        <Icon type="ios-trash-outline" @click.native="handleRemove(index)"></Icon>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CarouselItem>
                                    <CarouselItem v-if="!toEdit">
                                        <div class="demo-carousel">
                                            <PandoraUpload
                                                    multiple
                                                    ref="upload"
                                                    :format="['jpg','jpeg','png']"
                                                    header="{
                                                'Accept': 'application/json, text/plain, /'
                                                }"
                                                    :max-size="2048"
                                                    :show-upload-list="false"
                                                    :action="uploadUrl()"
                                                    :fileSavePath="'/eam/'"
                                                    @on-up-multiple-success = "upSuccess"
                                                    :on-format-error="handleFormatError">
                                                <div class="Img" style="border: 1px solid #ccc;width: 200px;height: 150px;margin: 0 auto;margin: auto;display: flex;">
                                                    <Icon type="camera" size="20" style="margin: auto"></Icon>
                                                </div>
                                            </PandoraUpload>
                                        </div>
                                    </CarouselItem>
                                </Carousel>
                            </div>
                            <!--<div class="btn-query" style="position: absolute;left: 230px;top: 165px;width: 50px;">-->
                            <!--<Button type="primary" size="small">管理</Button>-->
                            <!--<Button type="primary" size="small">上传</Button>-->
                            <!--</div>-->
                        </div>
                        <div style="margin-left:300px;">
                            <FormItem label="设备编码" prop="equ_code">
                                <Input :maxlength="20" @on-change="lengthChange(formValidate.equ_code,20)"
                                       v-model="formValidate.equ_code" :disabled='editAble'></Input>
                            </FormItem>
                            <FormItem label="设备名称" prop="equ_name">
                                <Input :maxlength="20" @on-change="lengthChange(formValidate.equ_name,20)"
                                       :disabled="editAble" v-model="formValidate.equ_name" @on-blur="formValidate.equ_name = toValidate(formValidate.equ_name)"></Input>
                            </FormItem>
                            <FormItem label="是否特种设备" prop="equ_sort" :label-width="120">
                                <div>
                                    <i-switch v-model="formValidate.equ_sort" :disabled="editAble">
                                        <span slot="open">是</span>
                                        <span slot="close">否</span>
                                    </i-switch>
                                </div>
                            </FormItem>
                            <FormItem label="设备类型" prop="equ_kind" :disabled="editAble">
                                <div class="input-search pointDis" @click="openKind_mod">
                                    <Input v-model="formValidate.equ_kind" :readonly=true
                                           style="width: 160px;" :disabled="editAble"></Input>
                                    <Button icon="ios-search" :disabled="editAble"></Button>
                                </div>
                            </FormItem>
                            <FormItem label="设备型号" prop="equ_type" :disabled="editAble">
                                <div class="input-search pointDis" @click="openType_mod">
                                    <Input v-model="formValidate.equ_type" :readonly=true @on-change="numbers_addBtn = 'notFirst'"
                                           style="width: 160px;" :disabled="editAble"></Input>
                                    <Button icon="ios-search" :disabled="editAble"></Button>
                                </div>
                            </FormItem>
                            <FormItem label="设备状态" prop="equ_state">
                                <Select :disabled="editAble" v-model="formValidate.equ_state" class="typeSelect">
                                    <Option v-for="state in equ_states" :value="state.code" :key="state.code">
                                        {{state.desc}}
                                    </Option>
                                </Select>
                            </FormItem>
                            <FormItem label="设备地点" prop="equ_site">
                                <div class="input-search pointDis" @click="equSite_mod = editAble?false:true">
                                    <Input v-model="formValidate.equ_site" :readonly=true :disabled="editAble"></Input>
                                    <Button icon="ios-search" @click="equSite_mod = true" :disabled="editAble"></Button>
                                </div>
                            </FormItem>
                            <FormItem label="设备权重" prop="equ_weight">
                                <Select v-model="formValidate.equ_weight" class="typeSelect" :disabled="editAble">
                                    <Option v-for="weight in equWeights" :value="weight.code" :key="weight.code">
                                        {{weight.desc}}
                                    </Option>
                                </Select>
                            </FormItem>
                            <FormItem label="设备功率(千瓦)" prop="equ_power">
                                <Input @on-change="toTestPower(formValidate.equ_power)" :maxlength="20"
                                       :disabled="editAble" v-model="formValidate.equ_power"></Input>
                            </FormItem>
                            <br>
                            <FormItem label="创建人" v-show="pageFrom != 'toAdd'">
                                <Input :disabled="true" v-model="createBy"></Input>
                            </FormItem>
                            <FormItem label="创建日期" v-show="pageFrom != 'toAdd'">
                                <Input :disabled="true" v-model="createAt"></Input>
                            </FormItem>
                            <FormItem label="最后修改人" v-show="pageFrom != 'toAdd'">
                                <Input :disabled="true" v-model="lastEditBy"></Input>
                            </FormItem>
                            <FormItem label="最后修改时间" v-show="pageFrom != 'toAdd'">
                                <Input :disabled="true" v-model="lastEditAt"></Input>
                            </FormItem>
                            <FormItem label="设备描述" prop="equ_discable" class="textarea_design">
                                <Row class="wid-80">
                                    <Col span="24">
                                    <Input :maxlength="500" @on-change="lengthChange(formValidate.equ_discable,500)"
                                           type="textarea" :rows="1" placeholder="请输入..."
                                           :disabled="editAble" v-model="formValidate.equ_discable"></Input>
                                    </Col>
                                </Row>
                            </FormItem>
                        </div>
                    </div>
                    <div>
                        <div class="second-title">资产信息</div>
                        <div class=" radio_item">
                            <FormItem label="供应商编码" prop="service_code">
                                <div @click="openSup">
                                    <Input style="width: 180px;" :disabled="editAble"
                                           v-model="formValidate.service_code" readonly
                                           @click="openSup">
                                    <Button slot="append" icon="ios-search" :disabled="editAble"></Button>
                                    </Input>
                                </div>
                            </FormItem>
                            <FormItem label="供应商名称" prop="service_name">
                                <div @click="openSup">
                                    <Input style="width: 180px;" :disabled="editAble"
                                           v-model="formValidate.service_name" readonly >
                                    <Button slot="append" icon="ios-search" :disabled="editAble"></Button>
                                    </Input>
                                </div>
                            </FormItem>
                            <FormItem label="出厂编码" prop="comeOut_code">
                                <Input :maxlength="20" @on-change="lengthChange(formValidate.comeOut_code,20)"
                                       :disabled="true" v-model="formValidate.comeOut_code"></Input>
                            </FormItem>
                            <FormItem label="采购价格(元)" prop="buy_price">
                                <Input @on-change="toTestPrice(formValidate.buy_price)" :disabled="true"
                                       v-model="formValidate.buy_price"></Input>
                            </FormItem>
                            <FormItem label="启用时间" prop="start_time">
                                <DatePicker v-model="formValidate.start_time" type="date" @on-change="checkTime" :options="timeOption" placeholder="选择日期"></DatePicker>
                            </FormItem>
                            <br>
                            <FormItem label="设备寿命(年)" prop="equ_life">
                                <Input @on-change="toTestYear(formValidate.equ_life)" :disabled="true"
                                       v-model="formValidate.equ_life"></Input>
                            </FormItem>
                            <FormItem label="折旧系数" prop="equ_depreciation">
                                <Input :disabled="true" @on-change="toTestPersent(formValidate.equ_depreciation)"
                                       v-model="formValidate.equ_depreciation"></Input>
                            </FormItem>
                            <FormItem label="剩余价值(元)" prop="equ_value" v-show="pageFrom != 'toAdd'">
                                <Input :disabled="true" v-model="formValidate.equ_value"></Input>
                            </FormItem>
                        </div>
                    </div>
                </Form>
            </div>
        </div>
        <div class="second-title">关联备件
            <span style="color:red;padding-left:0.6%;">
            (&nbsp更改设备型号或供应商信息后，将会重新查询是否存在已关联备件&nbsp)
            </span>
        </div>
        <div class="form-content radio_item">
            <table class="table table-bordered table-center table-striped table-blue taDisplay">
                <thead>
                <tr>
                    <th class="wid-5">序号</th>
                    <th>备件名称</th>
                    <th>备件类型</th>
                    <th>备件、库存单位</th>
                    <th>供应商</th>
                    <!--<th>关联设备</th>-->
                    <th>运输方式</th>
                    <th>库存仓库</th>
                    <th>库存状态</th>
                    <th>采购提前期</th>
                    <!--<th>采购状态</th>-->
                    <th>操作</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(equipment, index) in gettedParts" :key="equipment.id" class="trDisplay">
                    <td>{{index + 1}}</td>
                    <td class="tdDisplay pointDis" :title="equipment.parts_name">{{equipment.parts_name}}</td>
                    <td class="tdDisplay pointDis" :title="equipment.parts_type">{{equipment.parts_type}}</td>
                    <td class="tdDisplay pointDis" :title="equipment.parts_unit">{{equipment.parts_unit}}</td>
                    <td class="tdDisplay pointDis" :title="equipment.sparePartSupplier">{{equipment.sparePartSupplier}}</td>
                    <!--<td></td>-->
                    <td>{{equipment.transport}}
                    </td>
                    <td>--</td>
                    <td>--</td>
                    <td>--</td>
                    <!--<td>{{equipment.byState}}</td>-->
                    <td class="mettingManage_oprationItem">
                        <a v-show="!toEdit" @click="deletePart(index)">删除</a> <a v-show="toEdit" @click="toSeeDetail(equipment.id)">查看</a>
                    </td>
                </tr>
                </tbody>
            </table>
            <div class="tableHasNoData" v-show="tableNoData"><p>暂无数据</p></div>
            <Button type="primary" icon="plus-round" class="buttonsDesign " long  @click="add_partsBtn" :disabled="toEdit">添加</Button>
        </div>
        <div align="center" class="btnGroupDesign">
            <Button @click="tohistory" class="btn-gary" icon="close" size="large">取消</Button>
            <Button type="primary" icon="close-circled" v-if="this.pageFrom != 'toAdd' && if_del" size="large" @click="deleteModal=true">删除</Button>
            <Button type="primary" v-show="!toEdit" @click="toAddEqu('formValidate')" icon="document-text" size="large">保存</Button>
            <Button v-if="if_edit" type="primary" @click="toEditBtn" v-show="toEdit" icon="document-text" size="large">编辑</Button>
        </div>
        <!--设备型号弹出框：-->
        <Modal v-model="equType_mod" title="设备型号" @on-ok="toSelect_equType">
            <equ_typeSelect @typeSelected="hasSelected_equType"></equ_typeSelect>
        </Modal>
        <!--设备类型弹出框：-->
        <Modal v-model="equKind_mod" title="设备类型" @on-ok="toSelect_equKind">
            <equ_kindSelect @typeSelected="kind_hasSelected"></equ_kindSelect>
        </Modal>
        <!--设备地点弹出框：-->
        <Modal v-model="equSite_mod" title="设备地点" @on-ok="toSelect_equSite">
            <Tree :data="baseData" show-checkbox :multiple="false" :show-checkbox="false" @on-select-change="left_personSelected" class="max-h-300"></Tree>
        </Modal>
        <!--图片预览：-->
        <Modal title="查看图片" v-model="img_modal">
            <img :src="imgView" v-if="img_modal" style="width: 100%">
            <div slot="footer">
                <Button type="primary" @click="img_modal=false">关闭</Button>
            </div>
        </Modal>
        <!--所属供应商：-->
        <Modal v-model="supplierModal" title="所属供应商" @on-ok="supplySelected">
            <div class="btn-query mar-b-10" style="display: table;margin-bottom: 20px;">
                制造商名称  <Input class="mar-l-10" style="width: 160px;" v-model="manufacturer_name" @on-blur="manufacturer_name = toValidate(manufacturer_name)" ></Input>
                <Button type="primary" icon="search" size="large" @click="searchSupplier">
                    查询
                </Button>
            </div>
            <div class="table-reset">
                <table class="table table-bordered table-center table-striped table-blue table-edit supply taDisplay">
                    <thead>
                    <tr>
                        <!--<th>选择</th>-->
                        <th width="150">序号</th>
                        <th>供应商编码</th>
                        <th>供应商名称</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(item,index) in supplierList" class="trDisplay trBgd" @click="toSelect_supply(index)">
                        <!--<td><input type="radio" name="supplyId" /></td>-->
                        <td>{{index + 1}}</td>
                        <td class="tdDisplay pointDis" :title="item.tBdEquipmentManufacturerCode">{{item.tBdEquipmentManufacturerCode}}</td>
                        <td class="tdDisplay pointDis" :title="item.tBdEquipmentManufacturerName">{{item.tBdEquipmentManufacturerName}}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div class="mar-t-10" style="overflow: hidden">
                <div style="float: right;">
                    <Page size="small" :total='supplyTotal' show-elevator :page-size="5" @on-change="supplyChange"></Page>
                </div>
            </div>
        </Modal>
        <!--kp--当没选设备型号和所属供应商时，弹出提示框：start-->
        <Modal v-model="commonModal" width="360">
            <p slot="header" style="color:#f60;text-align:center">
                <Icon type="information-circled"></Icon>
                <span>信息提示</span>
            </p>
            <div style="text-align:center">
                <p>{{tipMessage}}</p>
            </div>
            <div slot="footer">
                <Button type="primary" size="large" long @click="commonModal=false">确认</Button>
            </div>
        </Modal>
        <!--end-->
        <!--kp---备品备件多选弹出框：---开始-->
        <Modal v-model="sparePartsMod" title="备品备件列表" @on-ok="toAdd_spareParts" width="1000" :styles="{top: '40px'}">
            <table_multiple @sparePartsSetected="spareParts_dataSelectedDisa" :mod_rightDisplay="sparePartsSelected" :canSearch="toSearch"></table_multiple>
        </Modal>
        <!--kp---备品备件多选弹出框：---结束-->
        <!--提示带出已关联备件：---开始-->
        <Modal v-model="hasParts" title="关联提醒" @on-ok="hasParts_toGet">
            <p>此设备型号该供应商下，已有设备关联备品备件，您需要先点击确认按钮，带入其关联信息</p>
        </Modal>
        <!--提示带出已关联备件：---结束-->
        <Modal v-model="addModal" width="360">
            <p slot="header" style="color:#f60;text-align:center">
                <Icon type="information-circled"></Icon>
                <span>保存确认</span>
            </p>
            <div style="text-align:center">
                <p>此操作将同步作用于该型号下其它同供应商设备关联信息，是否确定保存？</p>
            </div>
            <div slot="footer">
                <Button type="primary" size="large" long :loading="add_loading" @click="toCentainAdd">确认</Button>
            </div>
        </Modal>
        <!--删除模态框：-->
        <Modal v-model="deleteModal" width="360" class="detMod">
            <p slot="header" class="detMod_p">
                <Icon type="information-circled"></Icon>
                <span>删除确认</span>
            </p>
            <div align="center">
                <p>是否确定删除？</p>
            </div>
            <div slot="footer">
                <Button type="error" size="large" long :loading="deleteMod_loading" @click="delItem">删除</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
    import equ_typeSelect from "../treeMulitiple/equ_typeSelect.vue";
    import equ_kindSelect from "../treeMulitiple/equ_kindSelect.vue";
    import PandoraUpload from '../../api/pandora-upload/pandoraUpload.vue';
    //--备品备件多选组件：
    import table_multiple from '../treeMulitiple/wholeParts_multiple.vue';
    export default {
        data(){
            return {
                /*权限校验 start*/
//                if_edit:  this.$rt(this.authJson.EAM.设备管理.详情页.编辑),
//                if_del:  this.$rt(this.authJson.EAM.设备管理.详情页.删除),
                if_edit:  true,
                if_del:  true,
                /*权限校验 end*/
                numbers: "first",
                toadd_loading:false,
                numbers_addBtn:"first",
                deleteModal: false,
                deleteMod_loading: false,
                add_loading: false,
                addModal: false,
                equKind_mod : false,
                yearTip: "",
                percentTip: "",
                powerTip: "",
                priceTip: "",
                //页面标题：
                theTitle: "",
                //设备型号和供应商相关信息
                commonModal: false,
                tipMessage: "",
                //备件-----start
                sparePartsMod: false,
                sparePartsSelected: [],
                spareParts_display: [],
                //备件-----end
                //判断是有已关联备件可以带出时--start
                toSearch: "cannot",
                hasParts: false,
                tableDatas: [],
                hasPartsCanGet: false,
                gettedParts: [],
                //保存时的id组
                partsIds: [],
                //end
                //来源页面：
                pageFrom: "",
                thePageId: "",
                //是否可编辑:
                editAble: true,
                toEdit: true,
//                equSorts: [
//                    {id: "1", value: "常规设备"},
//                    {id: "2", value: "特种设备"}
//                ],
                equTypes: [],
                //设备型号弹出框：
                equType_mod: false,
                equType_selected: "",
                //设备地点弹出框：
                equSite_mod: false,
                equ_site_obj: "",
                equ_site_id: "",
                baseData: [],
                equWeights: [],
                //供应商：
                supplierModal: false,
                supplyPage: 1,
                supplierList: [],
                manufacturer_name:'',
                supplyTotal: 0,
                supplySelected_obj: "",
                //展示图:
                spareParts_img: {},
                img_modal: false,
                imgView: '',
                imgDis: false,
                uploadList: '',
                equ_states: [],
                equKindId: '',
                photos:[],
                upLoadFiles:[],
                formValidate: {
                    modelId: "",
                    equ_code: "",
                    equ_type: "",
                    equ_kind: '',
                    equ_sort: false,
                    equ_name: "",
                    equ_state: "",
                    equ_site: "",
                    equ_weight: "",
                    equ_power: "",
                    equ_discable: "",
                    service_code: "",
                    service_name: "",
                    comeOut_code: "",
                    buy_price: "",
                    start_time: "",
                    start_life: "",
                    equ_depreciation: "",
                    equ_value: ""
                },
                ruleValidate: {
                    equ_code: [{required: true, message: "设备编码不能为空"}],
                    equ_sort: [{required: true, message: "设备分类不能为空"}],
                    equ_kind: [{required: true, message: "设备类型不能为空"}],
                    equ_type: [{required: true, message: "设备型号不能为空"}],
                    equ_name: [{required: true, message: "设备名称不能为空"}],
                    equ_state: [{required: true, message: "设备状态不能为空"}],
                    equ_site: [{required: true, message: "设备地点不能为空"}],
                    equ_weight: [{required: true, message: "设备权重不能为空"}],
//                    equ_power: [{required: true, message: "设备功率不能为空"}],
//                    equ_discable: [{required: true, message: "设备描述不能为空"}],
                    service_code: [{required: true, message: "供应商编码不能为空"}],
                    service_name: [{required: true, message: "供应商名称不能为空"}],
//                    comeOut_code: [{required: true, message: "出厂编码不能为空"}],
//                    buy_price: [{required: true, message: "采购价格不能为空"}],
//                    start_time: [{required: true, message: "启用时间不能为空"}],
//                    equ_life: [{required: true, message: "设备寿命不能为空"}],
//                    equ_depreciation: [{required: true, message: "净残值率不能为空"}],
//                    equ_value: [{required: true, message: "剩余价值不能为空"}],
                },
                createBy: "",
                createAt: "",
                lastEditBy: "",
                lastEditAt: "",
                //在表格无数据时:
                tableNoData: false,
                //数据加载中:
                tableDataLoading: false,
                associatedPart_numMaterial: 20,
                associatedPart_pageSize: 5,
                associatedPart_tempPage: 1,
                equKind_selected: '',
                //日历的时间选择范围：
                timeOption: {
                    disabledDate (date) {
                        return date && date.valueOf() < Date.now() - 86400000;
//                        return date && date.valueOf() < Date.now();
                    }
                },
                flag:'',
            }
        },
        components: {
            'equ_typeSelect': equ_typeSelect,
            'table_multiple': table_multiple,
            'equ_kindSelect': equ_kindSelect,
            PandoraUpload
        },
        methods: {
            //验证输入框格式
            toValidate(msg){
                console.log(msg);
                var str = /[=+%!<>"'/_,()\\]/
                if(str.test(msg)){
                    this.$Message.warning('输入格式错误')
                    msg = msg.replace(/\'/g,"").replace(/\"/g,"").replace(/\+/g,"").replace(/\=/g,"").replace(/\%/g,"").replace(/\!/g,"").replace(/\</g,"").replace(/\>/g,"").replace(/\//g,"").replace(/\_/g,"").replace(/\,/g,"").replace(/\(/g,"").replace(/\)/g,"").replace(/\\/g,"");
                }
                return msg
            },
            kind_hasSelected(message){
                this.equKind_selected = message;
            },
            toSelect_equKind(){
                this.formValidate.equ_kind = this.equKind_selected.tBdEquipmentTypeName;
                this.equKindId = this.equKind_selected.tBdEquipmentTypeId;
            },
            //时间：
            checkTime(time){
                var stime = time;
                this.formValidate.start_time = stime;
            },
            //输入框文字长度：
            lengthChange(i, len){
                if (i.length >= len) {
                    this.$Message.error('字数不能超过' + len)
                }
            },
            //价格检验
            toTestPrice(x){
                if (!x) {
                    this.priceTip = "";
                }
                else {
                    if ((!isNaN(x)) && (x > 0)) {
                        if (x.length > 10) {
                            this.$Message.error('价格最多为10个字符');
                            this.priceTip = '价格最多为10个字符';
                            return;
                        };
                        this.priceTip = "";
                    }
                    else {
                        this.$Message.error('价格为空值或大于0的数字');
                        this.priceTip = "价格为空值或大于0的数字";
                    };
                }
            },
            //验证是否是大于0的数
            toTestYear(x){
//                var reg = /^[-+]?\d+$/;
                if (!x) {
                    this.yearTip = "";
                }
                else {
                    if ((!isNaN(x)) && (x > 0)) {
                        if (x.length > 5) {
                            this.$Message.error('寿命最多为5个字符');
                            this.yearTip = '寿命最多为5个字符';
                            return;
                        };
                        this.yearTip = "";
                    }
                    else {
                        this.$Message.error('寿命为空值或大于0的数字');
                        this.yearTip = "寿命为空值或大于0的数字";
                    };
                };
            },
            toTestPower(x){
                if (!x) {
                    this.powerTip = "";
                }
                else {
                    if ((!isNaN(x)) && (x > 0)) {
                        if (x.length > 5) {
                            this.$Message.error('设备功率最多为5个字符');
                            this.powerTip = '设备功率最多为5个字符';
                            return;
                        };
                        this.powerTip = "";
                    }
                    else {
                        this.$Message.error('设备功率为空值或大于0的数字');
                        this.powerTip = "功率寿命为空值或大于0的数字";
                    };
                };
            },
            toTestPersent(x){
                if (!x) {
                    this.percentTip = "";
                }
                else {
                    if ((!isNaN(x)) && (x > 0)) {
                        if (x >= 100) {
                            this.$Message.error('残值率为0到100之间的数字');
                            this.percentTip = '残值率为0到100之间的数字';
                            return;
                        };
                        if (x.length > 5) {
                            this.$Message.error('残值率最多为5个字符');
                            this.percentTip = '残值率最多为5个字符';
                            return;
                        };
                        this.percentTip = "";
                    }
                    else {
                        this.$Message.error('残值率为空值或大于0的数字');
                        this.percentTip = "残值率为空值或大于0的数字";
                    };
                };
            },
            //改变当前页:
            changePage: function (current) {
                this.associatedPart_tempPage = current;
//                this.toSearch(this.associatedPart_tempPage);
            },
            //返回上一页:
            tohistory() {
                this.flag = this.$route.query.flag;
                if(this.flag==0){
                    $('.menu-item').eq(2).addClass("ivu-menu-item-active ivu-menu-item-selected").siblings().removeClass('ivu-menu-item-active ivu-menu-item-selected')
                }
                window.history.go(-1);
            },
            //点击编辑按钮:
            toEditBtn() {
                this.editAble = false;
                this.theTitle = "设备管理--编辑";
                this.toEdit = false;
            },
            //所属供应商
            openSup(){
                $('.trBgd').removeClass('highlight')
                if (this.editAble)return;
                this.supplierModal = true;
                this.supplierGet();
            },
            supplierGet(){
                this.$axios.get('/System/equipmentManufacturerMagnifier', {
                    params: {
                        page: this.supplyPage,
                        pagesize: 5,
                        manufacturer_name: this.manufacturer_name
                    }
                }).then((res) => {
                    var ret = res.data.response
                    console.log(ret)
                    if (ret.code == 1) {
                        this.supplierList = ret.data.Rows;
                        this.supplyTotal = ret.data.Total
                    }
                }).catch((err) => {

                });
            },
            searchSupplier(){
                this.supplyPage = 1;
                this.supplierGet();
            },
            supplyChange(page){
                this.supplyPage = page;
                $(".supply").find("input[type='radio']:checked").prop('checked', false);
                this.supplierGet();
            },
            //判断在该设备型号和供应商下，是否有已关联的备件：
            getEquipmnet(){
//
//                let flg = false;
                let vt = this;
                vt.toadd_loading=true;
                this.$axios.post('/eamEquipment/sparePartEdit/inquire', {
//                    tBdEquipmentId: vt.thePageId
                    page: 1,
                    pageSize: 10000,
                    equipmentModelId: vt.formValidate.modelId,
                    equipmentManufacturerId: vt.formValidate.service_id
                }).then((res) => {
                    console.log("vt.tableDatas");
                    console.log(res.data.response);
                    if (res.data.response.code === 1) {
                        let dataRes = res.data.response.data;
                        vt.tableDatas = res.data.response.data.rows;

                        if (!vt.tableDatas[0]) {
                            vt.hasPartsCanGet = false;
                        }
                        else {
                            vt.hasPartsCanGet = true;
                        };
                        if (vt.hasPartsCanGet && vt.numbers == "first" && vt.pageFrom != "toAdd") {
                            vt.hasParts_toGet();
                        };
                    } else {
//                        vt.$Message.error(res.data.response.msg);
                    }
                    vt.toadd_loading=false;
                }).catch((err) => {
                });
            },
            //使用已关联备件：
            hasParts_toGet(){
                this.gettedParts = [];
                this.sparePartsSelected = [];
                for (var i = 0; i < this.tableDatas.length; i++) {
                    if (this.tableDatas[i].transportationType == 0) {
                        this.tableDatas[i].transportationType = "人工搬运"
                    }
                    else if (this.tableDatas[i].transportationType == 1) {
                        this.tableDatas[i].transportationType = "手动推车"
                    }
                    else if (this.tableDatas[i].transportationType == 2) {
                        this.tableDatas[i].transportationType = "自动叉车"
                    }
                    else {
                        this.tableDatas[i].transportationType = ""
                    };
//                    {
//                        //备件名称
//                        "sparePartName": "hetest22",
//                        //备件类型
//                        "sparePartType": 1,
//                        //备件/库存单位
//                        "sparePartUom": "",
//                        //备件/库存单位Id
//                        "sparePartUomId": "",
//                        //供应商
//                        "sparePartSupplier": "",
//                        //供应商Id
//                        "sparePartSupplierId": "",
//                        //适用设备型号
//                        "sparePartModel": "001",
//                        //适用设备型号Id
//                        "sparePartModelId": "hetest              ",
//                        //运输方式
//                        "transportationType": 1
//                    }
                    this.gettedParts.push({
                        parts_name: this.tableDatas[i].sparePartName,
                        parts_type: this.tableDatas[i].sparePartType,
                        parts_unit: this.tableDatas[i].sparePartUom,
                        transport: this.tableDatas[i].transportationType,
                        sparePartSupplier: this.tableDatas[i].sparePartSupplier,
                        id: this.tableDatas[i].sparePartId,
                        fromGetted: true
                    });
                    this.sparePartsSelected.push({
                        parts_name: this.tableDatas[i].sparePartName,
                        parts_type: this.tableDatas[i].sparePartType,
                        parts_unit: this.tableDatas[i].sparePartUom,
                        transport: this.tableDatas[i].transportationType,
                        id: this.tableDatas[i].sparePartId,
                        fromGetted: true
                    });
                };
//console.log("this.gettedParts---------->");
//console.log(this.gettedParts);
                this.hasPartsCanGet = false;
                this.hasParts = false;
                this.numbers = "notFirst"
            },
            //删除备件：
            deletePart(item){
                this.gettedParts.splice(item, 1);
                this.sparePartsSelected.splice(item, 1);
            },
            //查看详情：
            toSeeDetail(theId){
                this.$router.push({path: '/spareAdd', query: {from: 'toDetail', id: theId, theTab: "equPage"}});
            },
            //添加备件：
            add_partsBtn()
            {
//                this.sparePartsMod = true;
                if (this.formValidate.modelId && this.formValidate.service_name) {
                    this.sparePartsMod = true;
                    this.toSearch = "cansearch";
                    this.sparePartsMod =false;
                    this.getEquipmnet();
//                    alert( this.numbers_addBtn );
                    if (this.hasPartsCanGet) {
                        if (this.pageFrom != "toAdd" && this.numbers_addBtn == "first")
                        {
                            this.hasParts = false;
                            this.sparePartsMod = true;
                        }
                    else
                        {
                            this.hasParts = true;
                        };
                    }
                    else {
                        this.sparePartsMod = true;
                    };
                    this.numbers_addBtn = "notFirst";
                }
                else {
//
                    if (!this.formValidate.modelId) {
                        this.tipMessage = "请选择设备型号！"
                    }
                    else if (!this.formValidate.service_name) {
                        this.tipMessage = "请选择供应商信息！"
                    }
                    this.commonModal = true;
                    this.toSearch = "cannot";
                };
            },
            //            //获取组件数据：
            spareParts_dataSelectedDisa(messagea){
                this.sparePartsSelected = messagea;
            },
            //关联备件弹出框确认按钮：
            toAdd_spareParts(){
                this.gettedParts = [];
                console.log(this.sparePartsSelected)
                for (var i = 0; i < this.sparePartsSelected.length; i++) {
                    this.gettedParts.push(this.$fc.cloneKey(this.sparePartsSelected[i]));
                };
//                            console.log("保存的数据");
//                            console.log(this.spareParts_display);
            },
            toSelect_supply(index)
            {
                this.supplySelected_obj = this.supplierList[index];
                $('.trBgd').eq(index).addClass('highlight').siblings().removeClass('highlight')
            },
            supplySelected()
            {
                if(this.equType_selected.modelId!=this.formValidate.modelId){
                    this.numbers_addBtn = "notFirst";
                };
                this.formValidate.service_name = this.supplySelected_obj.tBdEquipmentManufacturerName;
                this.formValidate.service_id = this.supplySelected_obj.tBdEquipmentManufacturerId;
                this.formValidate.service_code = this.supplySelected_obj.tBdEquipmentManufacturerCode;
//                this.sparePartsSelected = [];
//                this.spareParts_display = [];
            },
            //点击确定按钮：
            toAddEqu(name)
            {
                {
                    this.$refs[name].validate((valid) => {
                        if (valid) {
                            let vt = this;
                            //
                            if (vt.priceTip) {
                                vt.$Message.error(vt.priceTip);
                                return
                            };
                            if (vt.yearTip) {
                                vt.$Message.error(vt.yearTip);
                                return
                            };
                            if (vt.powerTip) {
                                vt.$Message.error(vt.powerTip);
                                return
                            };
                            if (vt.percentTip) {
                                vt.$Message.error(vt.percentTip);
                                return
                            };
                            vt.addModal = true;
                        } else {
                            this.$Message.error('请完善表单信息!');
                        }
                    })
                }
            },
            toCentainAdd(){
                let vt = this;
                vt.partsIds = [];
                let ids = [];
                if (vt.gettedParts[0]) {
                    for (var i = 0; i < vt.gettedParts.length; i++) {
                        vt.partsIds.push(vt.gettedParts[i].id)
                    }
                    ids = vt.partsIds;
                }
                vt.add_loading = true;
                let photoRes=[];
                for(var i in this.upLoadFiles){
                    photoRes.push({
                        fileName: this.upLoadFiles[i].fileName,
                        urlPath: this.upLoadFiles[i].savePath
                    })
                }
                this.$axios.post('/eamEquipment/save',
                    {
                        "updateId" : vt.thePageId,
                        "accumulatedDepreciation": vt.formValidate.equ_depreciation, //净残值率
                        "code": vt.formValidate.equ_code, //设备编码
                        "description": vt.formValidate.equ_discable,//设备描述
                        "factoryLocationId": vt.equ_site_id, //设备地点id
                        "isSpecial": vt.formValidate.equ_sort ? 0 : 1, //是否特种设备
                        "lifetime": vt.formValidate.equ_life, //设备寿命
                        "manufacturerId": vt.formValidate.service_id, //供应商 this.formValidate.service_id
                        "modelId": vt.formValidate.modelId, //设备型号id
                        "typeId": vt.equKindId, //设备类型id
                        "name": vt.formValidate.equ_name, //设备名称
                        "power": vt.formValidate.equ_power, //功率
                        "purchasePrice": vt.formValidate.buy_price, //采购价格
                        "startToUseDate": vt.formValidate.start_time, //启用时间
                        "status": vt.formValidate.equ_state, //设备状态
                        "supplierEquipmentCode": vt.formValidate.service_code, //供应商编码
                        "weight": vt.formValidate.equ_weight,//权重
//                        "manufacturerEquipmentCode": vt.formValidate.comeOut_code, //出厂编码
                        "sparepartIds": ids, //多个备件id,
                        "photoRes": photoRes
                    }
                ).then((res) => {
                    let result = res.data.response;
                    if (result.code != 1) {
                        vt.$Message.error(result.msg);
                        vt.add_loading = false;
                        vt.addModal = false;
                    }
                    else {
                        setTimeout(function () {
                            vt.$Message.success("保存成功");
                            vt.add_loading = false;
                            vt.addModal = false;
                            vt.$router.push({path: '/equipmentList'});
                        }, 1000);
                    }
                }).catch((err) => {
                });
            },
            hasSelected_equType(message)
            {
                this.equType_selected = message;
                console.log(message)
            },
            openKind_mod(){
                $('.trBgb').removeClass('highlight')
                this.equKind_mod = this.editAble?false:true
            },
            openType_mod(){
                $('.trBga').removeClass('highlight')
                this.equType_mod = this.editAble?false:true
            },
            toSelect_equType()
            {
                if(this.equType_selected.modelId!=this.formValidate.modelId){
                    this.numbers_addBtn = "notFirst";
                };
                this.formValidate.equ_type = this.equType_selected.modelName;
                this.formValidate.modelId = this.equType_selected.modelId;
//                this.sparePartsSelected = [];
//                this.spareParts_display = [];
            },
            toSelect_equSite()
            {
                this.formValidate.equ_site = this.equ_site_obj.title;
                this.equ_site_id = this.equ_site_obj.id;
            },
            //设备地点树加载：
            get_equSite()
            {
                let vt = this;
                //设备地点树接口地址修改 == 20180830-GDJ
//                this.$axios.get('/common/location/locationNameTree').then((res) => {
                this.$axios.get('/common/location/tree').then((res) => {
                    let result = res.data.response;
                    if (result.code != 1) {
                        vt.$Message.error(result.msg);
                    }
                    else {
                        vt.baseData = result.data;
                        vt.baseData[0].expand = true;
                    }
                }).catch((err) => {
                });
            },
            //设备地点树选择：
            left_personSelected(left_node)
            {
                if (JSON.stringify(left_node) == "[]") {
                    return
                };
                if (left_node[0] && left_node[0].children) {
                    left_node[0].expand = !left_node[0].expand;
                    left_node[0].selected = false;
                }
                this.equ_site_obj = left_node[0];
            },
            //查询详情：
            toGetDetail()
            {
                let vt = this;
                this.$axios.post('/eamEquipment/equipmentInfo?equipmentId='+vt.thePageId).then((res) => {
                    let result = res.data.response;
                    console.log(result);
                    console.log('详情数据')
                    if (result.code != 1) {
                        vt.$Message.error(result.msg);
                    }
                    else {
                        vt.formValidate.equ_code = result.data.equipmentCode;//设备编码
                        vt.formValidate.equ_name = result.data.equipmentName;//设备名称
                        vt.formValidate.equ_state = result.data.equipmentStatus;//设备状态
                        vt.formValidate.service_name = result.data.manufacturerName;//供应商名称
                        vt.formValidate.service_id = result.data.manufacturerId; //供应商id
                        vt.formValidate.service_code = result.data.manufacturerCode; //供应商编码
                        vt.formValidate.modelId = result.data.equipmentModeId;//设备型号id
                        vt.formValidate.equ_type = result.data.equipmentMode//设备型号名
                        vt.equKindId = result.data.equipmentTypeId;//设备类型id
                        vt.formValidate.equ_kind = result.data.equipmentType//设备类型名
                        vt.formValidate.equ_power = result.data.equipmentPower; //功率
                        vt.formValidate.buy_price = result.data.purchasePrice;//采购价格
                        vt.createAt = result.data.equipmentCreateAt;//创建日期
                        vt.lastEditAt = result.data.equipmentUpdateAt;//最后修改日期
                        vt.createBy = result.data.equipmentCreateBy;//创建人
                        vt.lastEditBy = result.data.equipmentUpdateBy;//最后修改人
                        vt.formValidate.equ_discable = result.data.equipmentDescription;//描述
                        vt.formValidate.start_time = result.data.startToUseDate;//启用时间
                        vt.formValidate.equ_sort = result.data.isSpecial==0 ? true : false;//是否特种设备
//                        vt.formValidate.equ_weight = this.equWeights[result.data.equipmentWeight - 1].code;//设备权重
                        vt.formValidate.equ_life = result.data.lifetime;//设备寿命
                        vt.formValidate.equ_depreciation = result.data.accumulatedDepreciation;//折旧系数
                        vt.formValidate.comeOut_code = result.data.supplierEquipmentCode;//出厂编码
                        vt.formValidate.equ_site = result.data.equipmentFactoryLocationName;//设备地点名
                        vt.equ_site_id = result.data.equipmentFactoryLocationId;//设备地点id
                        vt.formValidate.equ_value = result.data.remainingValue;//剩余价值
                        //图片相关
                        if (result.data.photoList.length>0) {
                            vt.imgDis = true;
                            vt.photos = result.data.photoList;
                            vt.upLoadFiles = [];
                            for(var i in result.data.photoList){
                                vt.upLoadFiles.push({
                                    savePath: result.data.photoList[i].potoUrl,
                                    fileName: result.data.photoList[i].potoName
                                })
                            }
//                            vt.$set(vt.spareParts_img, 'fileName', result.data.pic_name);
//                            vt.$set(vt.spareParts_img, 'savePath', result.data.pic_url);
                        };
                    }
                }).catch((err) => {
//                    console.log(err);
                });
            },
            //图片上传：
            //图片放大镜：
            handleView(index)
            {
                this.img_modal = true;
                this.imgView = '../static/' + this.upLoadFiles[index].savePath
            },
            //图片删除：
            handleRemove(index)
            {
                if (this.toEdit) {
                    this.$Message.error("查看状态，不可删除");
                    return
                };
                this.upLoadFiles.splice(index,1)
            },
            handleSuccess(response, file, fileList)
            {
//                console.log(response, file, fileList)
            },
            handleFormatError(file)
            {
                this.$Notice.warning({
                    title: '文件格式不正确',
                    desc: '文件 ' + file.name + ' 格式不正确，请上传 jpg 或 png 格式的图片。'
                })
            },
            upSuccess: function (files) {
//                console.log(fileName + " 上传完成了.地址： " + savePath);
                console.log(files);
                this.uploadList = files;
                this.upLoadFiles = this.upLoadFiles.concat(this.uploadList);
//                this.imgDis = true;
//                var format = fileName.split('.')[1];
//                format = format == 'jpg' ? 0 : format == 'jpeg' ? 1 : format == 'png' ? 2 : format == 'gif' ? 3 : 4;
//                this.$set(this.spareParts_img, 'fileName', fileName);
//                this.$set(this.spareParts_img, 'savePath', savePath);
//                this.$set(this.spareParts_img, 'fromat', format);
            },
            //确定删除：
            delItem(){
                let vt = this;
                vt.deleteMod_loading = true;
                this.$axios.post('/eamEquipment/delete', {equipmentId: vt.thePageId}).then((res) => {
                    let result = res.data.response;
                    if (result.code != 1) {
//                        console.log("昂");
                        vt.$Message.error(result.msg);
                        vt.deleteModal = false;
                        vt.deleteMod_loading = false;
                    }
                    else {
                        vt.$Message.success('删除成功');
                        vt.deleteModal = false;
                        vt.deleteMod_loading = false;
                        setTimeout(function () {
                            window.history.go(-1);
                        }, 1000);
                    }
                }).catch((err) => {
//                    console.log(err);
                    vt.deleteModal = false;
                    vt.deleteMod_loading = false;
                });
            },
            //新建时初始化编码信息：
            toGetCode: function () {
                this.$axios.get('/eamEquipment/getSessionInfo').then((res) => {
                    let result = res.data.response;
                    if (result.code != 1) {
                        vt.$Message.error(result.msg);
                    }
                    else {
                        this.formValidate.equ_code = result.data.code;
                    }
                });
            },
        },
        mounted()
        {
            for (var i = 0; i < this.$base_info.bdFactoryEquipmentWeightsEnum.length; i++) {
                if (i > 0) {
                    this.equWeights.push(this.$base_info.bdFactoryEquipmentWeightsEnum[i])
                }
            };
            this.formValidate.equ_weight = this.equWeights[0].code;
            for (var j = 0; j < this.$base_info.bdFactoryEquipmentStatusEnum.length; j++) {
                if (j > 0) {
                    this.equ_states.push(this.$base_info.bdFactoryEquipmentStatusEnum[j])
                }
            };
            this.formValidate.equ_state = this.equ_states[0].code;
            this.thePageId = this.$route.query.itemId;
            this.pageFrom = this.$route.query.from;
            if (this.pageFrom == "toDetail") {
                this.editAble = true;
                this.toEdit = true;
                this.theTitle = "设备管理--查看";
                this.toGetDetail();
            }
            if (this.pageFrom == "toEdit") {
                this.theTitle = "设备管理--编辑";
                this.editAble = false;
                this.toEdit = false;
                this.toGetDetail();
            };
            if (this.pageFrom == "toAdd") {
                this.theTitle = "设备管理--新增";
                this.editAble = false;
                this.toEdit = false;
//                this.toGetCode();
            };
            this.get_equSite();
//            this.getEquipmnet();
        },
        watch: {
            "formValidate.service_name": function () {
                if (this.formValidate.modelId && this.formValidate.service_name) {
                    this.getEquipmnet();
                    this.tableDatas = [];
                    this.gettedParts = [];
                    this.sparePartsSelected = [];
                }
            },
            "formValidate.modelId": function () {
                if (this.formValidate.modelId && this.formValidate.service_name) {
                    this.getEquipmnet();
                    this.tableDatas = [];
                    this.gettedParts = [];
                    this.sparePartsSelected = [];
                }
            }
        },
    }
</script>