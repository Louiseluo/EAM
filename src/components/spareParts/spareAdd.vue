<template>
    <div class="basic fault-content">
        <!--模块名称-->
        <div class="title">
            <span>{{theTitle}}</span>
        </div>

        <div class="second-title">基础信息</div>
        <div>
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" inline :label-width="100" class="equ_addForm">
                <div class="imgDiv radio_item" style="padding-bottom:30px;">
                    <div class="uploadImg" style="width: 240px;height: 200px;left: 15px;top: 15px;">
                        <p style="text-align: center;margin: 10px 0;"v-if="imgDis||!editAble">备件图片：</p>
                        <p style="text-align:center;margin-top:35%;color:red" v-if="!imgDis&&editAble">暂无图片!</p>
                        <Carousel loop v-if="imgDis||!editAble">
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
                            <CarouselItem v-if="!editAble">
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
                                            @on-up-multiple-success = "upSuccessMulti"
                                            :on-format-error="handleFormatError">
                                        <div class="Img" style="border: 1px solid #ccc;width: 200px;height: 150px;margin: 0 auto;margin: auto;display: flex;">
                                            <Icon type="camera" size="20" style="margin: auto"></Icon>
                                        </div>
                                    </PandoraUpload>
                                </div>
                            </CarouselItem>
                        </Carousel>
                    </div>
                    <div style="margin-left:300px;">
                        <FormItem label="备件编码" prop="parts_code">
                            <Input :maxlength="20" @on-change="lengthChange(formValidate.parts_code)" style="width: 180px;" v-model="formValidate.parts_code" :disabled="true"></Input>
                        </FormItem>
                        <FormItem label="备件名称" prop="parts_name">
                            <Input :maxlength="20" style="width: 180px;" v-model="formValidate.parts_name" :disabled="editAble"></Input>
                        </FormItem>
                        <FormItem label="备件型号" prop="parts_version">
                            <div style="color:#ffffff" onmousemove="this.style.color='#5b5b5b';" onmouseout="this.style.color='#ffffff'">
                                <div :title="formValidate.parts_version" style="position: relative">
                                    <span @click="emptyInfo" v-show="!editAble">
                                        <Icon type="ios-close" class="deleteTab"></Icon>
                                    </span>
                                    <Input placeholder="" v-model="formValidate.parts_version" readonly :disabled="editAble" style="width: 180px;" >
                                        <Button slot="append" icon="ios-search" @click="versionModal=editAble?false:true;"></Button>
                                    </Input>
                                </div>
                            </div>
                        </FormItem>
                        <FormItem label="备件分类" prop="parts_type">
                            <div style="color:#ffffff" onmousemove="this.style.color='#5b5b5b';" onmouseout="this.style.color='#ffffff'">
                                <div :title="formValidate.parts_type" style="position: relative">
                                    <span @click="emptyType" v-show="!editAble">
                                        <Icon type="ios-close" class="deleteTab"></Icon>
                                    </span>
                                    <Input placeholder="" v-model="formValidate.parts_type" readonly :disabled="editAble" style="width: 180px;" >
                                    <Button slot="append" icon="ios-search" @click="typeModal=editAble?false:true;"></Button>
                                    </Input>
                                </div>
                            </div>
                        </FormItem>
                        <FormItem label="备件单位" prop="parts_unit">
                            <div style="color:#ffffff" onmousemove="this.style.color='#5b5b5b';" onmouseout="this.style.color='#ffffff'">
                                <div :title="formValidate.parts_unit" style="position: relative">
                                    <span @click="emptyUnit" v-show="!editAble">
                                        <Icon type="ios-close" class="deleteTab"></Icon>
                                    </span>
                                    <Input placeholder="" v-model="formValidate.parts_unit" readonly :disabled="editAble" style="width: 180px;" >
                                    <Button slot="append" icon="ios-search" @click="unitModal=editAble?false:true;"></Button>
                                    </Input>
                                </div>
                            </div>
                        </FormItem>
                        <FormItem label="备件重量（kg）" prop="parts_weight">
                            <Input :maxlength="5" style="width: 180px;" :disabled="editAble" v-model="formValidate.parts_weight" @on-change="toTestNum(formValidate.parts_weight)"></Input>
                        </FormItem>
                        <FormItem label="备件规格" prop="parts_standard">
                            <Input :maxlength="20" @on-change="lengthChange(formValidate.parts_standard)" style="width: 180px;" v-model="formValidate.parts_standard" :disabled="editAble"></Input>
                        </FormItem>
                        <FormItem label="运输方式" :disabled="editAble" prop="parts_trans">
                            <Select v-model="formValidate.parts_trans" clearable class="typeSelect" style="width: 180px;" :disabled="editAble">
                                <Option v-for="trans in transports" :value="trans.code" :key="trans.code">
                                    {{trans.desc}}
                                </Option>
                            </Select>
                        </FormItem>
                        <FormItem label="备件类型" :disabled="editAble" prop="parts_spec">
                            <Select v-model="formValidate.parts_spec" clearable class="typeSelect" style="width: 180px;" :disabled="editAble">
                                <Option v-for="useType in useTypePorts" :value="useType.code" :key="useType.code">
                                    {{useType.desc}}
                                </Option>
                            </Select>
                            <!--<Input style="width: 180px;" v-model="formValidate.parts_spec" :disabled="editAble"></Input>-->
                        </FormItem>
                        <FormItem label="创建人" v-show="this.pageFrom != 'toAdd1'" prop="parts_create_by">
                            <Input style="width: 180px;" v-model="formValidate.parts_create_by" :disabled=true></Input>
                        </FormItem>
                        <FormItem label="创建日期" v-show="this.pageFrom != 'toAdd1'" prop="parts_create_at">
                            <Input style="width: 180px;" v-model="formValidate.parts_create_at" :disabled=true></Input>
                        </FormItem>
                        <FormItem label="最后修改时间" v-show="this.pageFrom != 'toAdd1'" prop="parts_create_at_last">
                            <Input style="width: 180px;" v-model="formValidate.parts_create_at_last" :disabled=true></Input>
                        </FormItem>
                        <FormItem label="最后修改人" v-show="this.pageFrom != 'toAdd1'" prop="parts_create_by_last">
                            <Input style="width: 180px;" v-model="formValidate.parts_create_by_last" :disabled=true></Input>
                        </FormItem>
                        <FormItem label="备件描述" class="textarea_design" prop="parts_desc">
                            <Row style="width:95%;">
                                <Col span="24">
                                <Input type="textarea":maxlength="200" @on-change="remarkChange(formValidate.parts_desc)"  :rows="1" placeholder="请输入..." :disabled="editAble" v-model="formValidate.parts_desc"></Input>
                                </Col>
                            </Row>
                        </FormItem>
                    </div>
                </div>
                <div class="second-title">库存信息</div>
                <div class="radio_item">
                    <FormItem label="仓库编码" prop="stock_code">
                        <Input style="width: 180px;" v-model="formStockCost.stock_code" :disabled=true></Input>
                    </FormItem>
                    <FormItem label="仓库名称" prop="stock_name">
                        <Input style="width: 180px;" :disabled=true v-model="formStockCost.stock_name"></Input>
                    </FormItem>
                    <FormItem label="库存数量" prop="stock_num">
                        <Input style="width: 180px;" :disabled=true v-model="formStockCost.stock_num"></Input>
                    </FormItem>
                    <FormItem label="库存单位" prop="stock_unit">
                        <Input style="width: 180px;" :disabled=true v-model="formStockCost.stock_unit"></Input>
                    </FormItem>
                    <FormItem label="库存位置" prop="stock_postion">
                        <Input style="width: 180px;" :disabled=true v-model="formStockCost.stock_position"></Input>
                    </FormItem>
                    <FormItem label="库存安全值" prop="stock_safe">
                        <Input style="width: 180px;" :disabled=true v-model="formStockCost.stock_safe"></Input>
                    </FormItem>
                    <FormItem label="采购提前期" prop="stock_before">
                        <Input style="width: 180px;" :disabled=true v-model="formStockCost.stock_before"></Input>
                    </FormItem>
                    <FormItem label="库存状态" prop="stock_state">
                        <Input style="width: 180px;" :disabled=true v-model="formStockCost.stock_state"></Input>
                    </FormItem>
                    <FormItem label="采购信息">
                        <Button icon="search" type="primary" size="large" :disabled=true
                                @click="bugDetail=true">查看详情
                        </Button>
                    </FormItem>
                </div>
                <div class="second-title">成本信息</div>
                <div class="radio_item">
                    <FormItem label="供应商编码" prop="cost_spare_supplyCode">
                        <div @click="openSup">
                            <Input style="width: 180px;" v-model="formStockCost.cost_spare_supplyCode" readonly @click="openSup" :disabled=true>
                            <Button slot="append" icon="ios-search" :disabled=true></Button>
                            </Input>
                        </div>
                    </FormItem>
                    <FormItem label="供应商名称" prop="cost_spare_supplyName">
                        <div @click="openSup">
                            <Input style="width: 180px;" v-model="formStockCost.cost_spare_supplyName" readonly :disabled=true>
                            <Button slot="append" icon="ios-search" :disabled=true></Button>
                            </Input>
                        </div>
                    </FormItem>
                    <FormItem label="采购成本" prop="cost_price">
                        <Input style="width: 180px;" :disabled=true v-model="formStockCost.cost_price"></Input>
                    </FormItem>
                    <FormItem label="采购单位" prop="cost_unit">
                        <Input style="width: 180px;" :disabled=true v-model="formStockCost.cost_unit"></Input>
                    </FormItem>
                    <FormItem label="备注" class="textarea_design" prop="cost_desc">
                        <Row class="wid-86">
                            <Col span="24">
                            <Input type="textarea" :rows="1" placeholder="请输入..." :disabled=true v-model="formStockCost.cost_desc"></Input>
                            </Col>
                        </Row>
                    </FormItem>
                </div>
            </Form>
        </div>
        <div v-show="this.pageFrom!='toAdd1'">
            <div class="second-title">关联设备</div>
            <div class="form-content ivu-table-auto" style="border-radius: 5px;">
                <Table stripe border :columns="columns" :data="tableData"></Table>
            </div>
        </div>
        <div style="margin-right:43%;" class=" btn-query">
            <Button v-if="if_back" @click="tohistory" class="btn-gary" icon="close" size="large">取消</Button>
            <Button v-if="if_save" type="primary" :loading="save_loading" v-show="!editAble" @click="toAddSpare('formValidate')" icon="document-text" size="large">保存</Button>
            <Button v-if="this.pageFrom != 'toAdd1' && if_del" type="primary" icon="close-circled" v-show="!editAble" size="large" @click="deleteModal=true">删除</Button>
            <Button v-if="if_edit" type="primary" @click="toEditBtn" v-show="editAble" icon="document-text" size="large">编辑</Button>
        </div>
        <!--<div class="btn-query">-->
            <!--<Button type="primary" icon="forward" size="large" :disabled="true">导出</Button>-->
            <!--<Button type="primary" icon="search" size="large" @click="get_spareParts">查询</Button>-->
            <!--<Button type="primary" icon="plus" size="large" @click="add_list">新建</Button>-->
        <!--</div>-->
        <!--备件分类：-->
        <Modal v-model="typeModal" title="备件分类" @on-ok="type_modalSelected">
            <partsTypeSelect @typeSelected="type_hasSelected" :tempState=null></partsTypeSelect>
        </Modal>
        <!--备件型号：-->
        <Modal v-model="versionModal" title="备件型号" @on-ok="type_versionSelected">
            <partsVersionSelect @versionSelected="version_hasSelected" ></partsVersionSelect>
        </Modal>
        <!--备件单位-->
        <Modal v-model="unitModal" title="备件单位" @on-ok="unit_modalSelected">
            <partsUnitSelect @unitSelected="unit_hasSelected"></partsUnitSelect>
        </Modal>
        <!--采购信息查看详情-->
        <Modal v-model="bugDetail" title="采购详情" width='600'>
            <!--<div class="second-title">领用记录-查看</div>-->
            <Form inline :label-width="90">
                <FormItem label="采购状态">
                    <Input style="width: 160px;" :disabled=true></Input>
                </FormItem>
                <FormItem label="采购申请数量">
                    <Input style="width: 160px;" :disabled=true></Input>
                </FormItem>
                <FormItem label="实际采购数量">
                    <Input style="width: 160px;" :disabled=true></Input>
                </FormItem>
                <FormItem label="采购人">
                    <Input style="width: 160px;" :disabled=true></Input>
                </FormItem>
                <FormItem label="采购时间">
                    <Input style="width: 160px;" :disabled=true></Input>
                </FormItem>
                <FormItem label="预计到货时间">
                    <Input style="width: 160px;" :disabled=true></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="primary" @click="bugDetail=false">返回</Button>
            </div>
        </Modal>
        <!--所属供应商：-->
        <Modal v-model="supplierModal" title="所属供应商" @on-ok="supplySelected">
            <div class="table-reset">
                <table class="table table-bordered table-center table-striped table-blue table-edit supply">
                    <thead>
                    <tr>
                        <th>选择</th>
                        <th>序号</th>
                        <th>所属供应商</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(item,index) in supplierList">
                        <td><input type="radio" name="supplyId" @click="toSelect_supply(index)"/></td>
                        <td>{{index + 1}}</td>
                        <td>{{item.manufacturer}}</td>
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
        <!--图片预览：-->
        <Modal title="查看图片" v-model="img_modal">
            <img :src=" '../static/'+ imgViewPath" v-if="img_modal" style="width: 100%">
            <div slot="footer">
                <Button type="primary" @click="img_modal=false">关闭</Button>
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
    import partsTypeSelect from '../treeMulitiple/tree_sparePartsType_single.vue';
    import partsUnitSelect from '../treeMulitiple/spare_unitSelect.vue';
    import partsVersionSelect from '../treeMulitiple/table_spareParts_version.vue';
    import PandoraUpload from '../../api/pandora-upload/pandoraUpload.vue';
    export default {
        data(){
            const validateName = (rule, value, callback) => {
                let ruleNew = /[`~!@#$^&*()=|{}':;',\[\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]/;
                if (value === '') {
                    callback(new Error('备件名称不能为空！'));
                } else {
                    if (value && value.match(ruleNew)) {
                        callback(new Error('备件名称不能包含特殊字符串！'));
                    }else {
                        if (value.length > 20) {
                            callback(new Error('备件名称不能超出20字！'));
                        }
                    }
                    callback();
                }
            };
            return {
                /*权限校验 start*/
                if_back:  this.$rt(this.authJson.EAM.备件管理.备件台账详情页.取消),
                if_edit:  this.$rt(this.authJson.EAM.备件管理.备件台账详情页.编辑),
                if_save:  this.$rt(this.authJson.EAM.备件管理.备件台账编辑页.保存),
                if_del:  this.$rt(this.authJson.EAM.备件管理.备件台账编辑页.删除),
                /*权限校验 end*/
                common_parts_create_at_last:"",//最后修改时间。
                common_code:"",//初始化备件编码。
                common_parts_create_by_last:"",//最后修改人。
                common_parts_create_at:"",//创建时间。
                common_parts_create_by:"",//创建人人。
                save_loading:false,
                //删除模态框：
                deleteModal:false,
                deleteMod_loading:false,
                //查询和编辑时备件id:
                thePageId: "",
                weightTip: "",
                //判断来源：
                theTabTo:"",
                pageFrom: "",
                editAble: true,
                theTitle: "",
                //展示图:
                spareParts_img: {},
                img_modal: false,
                imgViewPath:'',
                imgDis: false,
                upLoadList:[],
                upLoadFiles:[],
//
                typeModal: false,
                typeSelected_obj: "",
                //有关备件单位:
                unitModal: false,
//
                unitSelected_obj: "",

//                备件型号
                versionModal:false,
                versionSelected_ary:"",

                transports: [],
                /*备件类型*/
                useTypePorts: this.$base_info.tBdSparePartUseTypeEnum2,


                //供应商：
//                spare_supplyCode: "",
//                spare_supplyName: "",
                supplierModal: false,
                supplyPage: 1,
                supplierList: [],
                supplyTotal: 0,
                supplySelected_obj: "",
                //库存状态：
                parts_states: [],
                bugDetail: false,
                columns: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 80,
                        align: 'center'
                    },
                    {
                        title: '设备编码',
                        key: 'code',
                        align: 'center',
//                        render: (h, params) => {
//                            return h('p', {
//                                domProps: {
//                                    title: this.tableData[params.index].code
//                                },
//                                class: 'iview_tabDis',
//                            }, this.tableData[params.index].code)
//                        },
                    },
                    {
                        title: '设备名称',
                        key: 'name',
                        align: 'center',
                        render: (h, params) => {
                            return h('p', {
                                domProps: {
                                    title: this.tableData[params.index].name
                                },
                                class: 'iview_tabDis',
                            }, this.tableData[params.index].name)
                        },
                    },
                    {
                        title: '设备型号',
                        key: 'type',
                        align: 'center',
                        render: (h, params) => {
                            return h('p', {
                                domProps: {
                                    title: this.tableData[params.index].type
                                },
                                class: 'iview_tabDis',
                            }, this.tableData[params.index].type)
                        },

                    },
                    {
                        title: '设备状态',
                        key: 'status',
                        align: 'center',
                        render: (h, params) => {
                            return h('p', {
                                domProps: {
                                    title: this.tableData[params.index].status
                                },
                                class: 'iview_tabDis',
                            }, this.tableData[params.index].status)
                        },
                    },
                    {
                        title: '设备地点',
                        key: 'location',
                        align: 'center',
                        render: (h, params) => {
                            return h('p', {
                                domProps: {
                                    title: this.tableData[params.index].location
                                },
                                class: 'iview_tabDis',
                            }, this.tableData[params.index].location)
                        },
                    },
                    {
                        title: '设备权重',
                        key: 'weight'
                    },
                    {
                        title: '生产工序',
                        key: 'gongx'
                    },
                    {
                        title: '供应商',
                        key: 'manufacturer'
                    },
                    {
                        title: '出厂编码',
                        key: 'manufacturer_code'
                    },
                    {
                        title: '启用时间',
                        key: 'start_time'
                    },
                    {
                        title: '操作',
                        key: 'edit',
                        render: (h, params) => {
                            return h('a', {
                                prop: {
                                    type: 'primary',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        this.$router.push({
                                            path: '/equipmentDetail',
                                            query:{from:'toDetail',itemId:this.tableData[params.index].id}
                                        });
                                    }
                                }
                            }, '查看')
                        },
                        align: 'center'
                    },
                ],
                tableData: [],
                //保存参数：
                saveData: {},
                //表单验证：
                parts_unit_id: "",
                formValidate: {
                    //有关备件的信息：
                    parts_code: "",/*备件编码*/
                    parts_name: "",/*备件名称*/
                    parts_version: "",/*备件型号*/
                    parts_version_id: "",/*备件型号id*/
                    parts_type: "",/*备件分类*/
                    parts_type_id: "",/*备件分类Id*/
                    parts_unit: "",/*备件单位*/
                    parts_unit_id: "",/*备件单位*/
                    parts_weight: "",/*备件重量（kg）*/
                    parts_standard: "",/*备件规格*/
                    parts_trans: "",/*运输方式*/
                    parts_create_by: "",/*创建人*/
                    parts_create_at: "",/*创建日期*/
                    parts_create_by_last: "",/*最后修改人*/
                    parts_create_at_last: "",/*最后修改日期*/
                    parts_spec: "",/*类型*/
                    parts_desc: "",/*备件描述*/
                    upLoadList:[],
                },
                formStockCost:{
                    //有关库存的信息：
                    stock_code: "",/*仓库编码*/
                    stock_name: "",/*仓库名称*/
                    stock_num: "",/*库存数量*/
                    stock_unit: "",/*库存单位*/
                    stock_position: "",/*库存位置*/
                    stock_safe: "",/*库存安全值*/
                    stock_before: "",/*采购提前期*/
                    stock_state: "",/*库存状态*/
                    //有关成本的信息：
                    cost_spare_supplyCode: "",/*供应商编码*/
                    cost_spare_supplyName: "",/*供应商名称*/
                    cost_price: "",/*采购成本（元）*/
                    cost_unit: "",/*采购单位*/
                    cost_desc: "",/*备注*/
                },
                ruleValidate: {
                    parts_code: [{required: true, message: "备件编码不能为空"}],
                    parts_name: [
                        {required: true, validator: validateName, trigger: 'blur' }
                    ],
                    parts_type: [{required: true, message: "备件分类不能为空"}],
                    parts_version: [{required: true, message: "备件型号不能为空"}],
//                    parts_weight: [{required: true, message: "备件重量不能为空"}],
                    parts_spec: [{required: true, message: "备件类型不能为空"}],
//                    stock_unit: [{required: true, message: "库存单位不能为空"}],
//                    stock_safe: [{required: true, message: "库存安全期不能为空"}],
//                    cost_spare_supplyCode: [{required: true, message: "供应商编码不能为空"}],
//                    cost_spare_supplyName: [{required: true, message: "供应商名称不能为空"}],
//                    cost_price: [{required: true, message: "采购成本不能为空"}],
//                    cost_unit: [{required: true, message: "采购单位不能为空"}],
                },
            }
        },
        components: {
            'partsTypeSelect': partsTypeSelect,
            'partsUnitSelect': partsUnitSelect,
            'partsVersionSelect': partsVersionSelect,
            PandoraUpload,
        },
        methods: {
            //清空选择框
            emptyInfo(){
                this.formValidate.parts_version =  "";/*备件型号*/
                this.formValidate.parts_version_id =  "";/*备件型号id*/
            },
            emptyType(){
                this.formValidate.parts_type =  "";/*备件分类*/
                this.formValidate.parts_type_id =  "";/*备件分类id*/
            },
            emptyUnit(){
                this.formValidate.parts_unit =  "";/*备件分类*/
                this.formValidate.parts_unit_id =  "";/*备件分类id*/
            },
            //输入框文字长度：
            lengthChange(i){
                if (i.length >= 20) {
                    this.$Message.error('字数不能超过20')
                }
            },
            remarkChange(i){
                if (i.length >= 200) {
                    this.$Message.error('字数不能超过200字符')
                }
            },

            //确定删除：
            delItem(){
                let vt=this;
                vt.deleteMod_loading=true;
                this.$axios.post('/eamSparePart/deleteSparePart',{sparePartId:vt.thePageId }).then((res) => {
                    let result = res.data.response;
                    if (result.code != 1) {
                        vt.$Message.error(result.msg);
                        vt.deleteModal=false;
                        vt.deleteMod_loading=false;
                    } else {
                        vt.$Message.success('删除成功');
                        vt.deleteModal=false;
                        vt.deleteMod_loading=false;
                        setTimeout(function () {
                            if(this.theTabTo=="equPage"){
                                 window.history.go(-1);
                            } else{
                                vt.$router.push({path: '/spareParts',query:{theTab:vt.theTabTo}});
                            };
                        }, 1000);

                    }
                }).catch((err) => {
//                    console.log(err);
                    vt.deleteModal=false;
                    vt.deleteMod_loading=false;
                });
            },

            //验证是否是正整数
            toTestNum(x){
//                var reg = /^[-+]?\d+$/;

                if ((!isNaN(x)) && (x > 0)) {
                    if (x.length > 5) {
                        this.$Message.error('重量最多为5个字符');
                        this.weightTip = '重量最多为5个字符';
                        return;
                    };
                    this.weightTip = "";
                } else {
                    this.$Message.error('重量为大于0的数字');
                    this.weightTip = "重量为大于0的数字";
                };
            },
            //按钮组：
            //返回上一页:
            tohistory() {
//                if(this.theTabTo=="equPage"){
//                     window.history.go(-1);
//                }
//                else{
//                    this.$router.push({path: '/spareParts',query:{theTab:this.theTabTo}});
//                };
                this.$router.back();
            },
            //点击编辑按钮:
            toEditBtn() {
                this.editAble = false;
                this.theTitle = "备件管理--编辑";
            },
            //备件分类：
            type_modalSelected(){
                this.formValidate.parts_type = this.typeSelected_obj.title;
                this.formValidate.parts_type_id = this.typeSelected_obj.id;
            },
            type_hasSelected(message){
                this.typeSelected_obj = message;

            },
            //备件型号：
            type_versionSelected(){
                this.formValidate.parts_version = this.versionSelected_ary.name;
                this.formValidate.parts_version_id = this.versionSelected_ary.id;
            },
            version_hasSelected(message){
                this.versionSelected_ary = message;

            },
            //备件单位：
            unit_hasSelected(message){
                this.unitSelected_obj = message;

            },
            //备件单位：
            unit_modalSelected(){
                this.formValidate.parts_unit = this.unitSelected_obj.name;
                this.formValidate.parts_unit_id = this.unitSelected_obj.id;
            },
            //运输方式：
            getSpare_trans(){
                this.$axios.get('/info/transport/type').then((res) => {
                    var ret = res.data.response;
                    if (ret.code == 1) {
                        this.transports = ret.data;
//                        this.formValidate.parts_trans = this.transports[0].code;
                    };

                }).catch((err) => {
//                    console.log(err);
                });
            },
            //带出创建信息:
            get_createMes(){
                /*this.$axios.post('/eamTools/getSessionInfo').then((res) => {
                    let result = res.data.response;
                    if (result.code != 1) {
                        vt.$Message.error(response.data.response.msg);
                    }
                    else {
                        this.common_parts_create_by = result.data.createName;
                        this.common_parts_create_at = result.data.createTime;
                        this.common_parts_create_by_last = result.data.createName;
                        this.common_parts_create_at_last = result.data.updateTime;
                        if(this.pageFrom == "toAdd1"){
                            this.formValidate.parts_code=result.data.code;
                        };

                    }
                }).catch((err) => {
//                    console.log(err);
                });*/
            },
            //库存状态：
            getSpare_states(){
                this.$axios.get('/info/stock/status').then((res) => {
                    var ret = res.data.response;
                    if (ret.code == 1) {
                        this.parts_states = ret.data;
                    };

                }).catch((err) => {
//                    console.log(err);
                });
            },

            //所属供应商
            openSup(){
//                if (this.editAble)return;
//                this.supplierModal = true;
//                this.supplierGet();
            },

            supplierGet(){
                /*this.$axios.get('/eamStandardSolution/getEquipmentList', {
                    params: {
                        page: this.supplyPage,
                        pageSize: 5,
                        modelId: ""
                    }
                }).then((res) => {
                    var ret = res.data.response;
                    if (ret.code == 1) {
                        this.supplierList = ret.data.rows;
                        this.supplyTotal = ret.data.Total
                    }
                }).catch((err) => {
//                    console.log(err);
                });*/
            },
            supplyChange(page){
                /*this.supplyPage = page;
                $(".supply").find("input[type='radio']:checked").prop('checked', false);
                this.supplierGet();*/
            },
            toSelect_supply(index){
//                this.supplySelected_obj = this.supplierList[index];
            },
            supplySelected(){
                /*this.formValidate.cost_spare_supplyName = this.supplySelected_obj.manufacturer;
                this.formValidate.cost_spare_supplyCode = this.supplySelected_obj.code;*/
            },
            //图片上传：
            //图片放大镜：
            handleView (index) {
                this.img_modal = true;
                this.imgViewPath = this.formValidate.upLoadList[index].savePath
            },
            //图片删除：
            handleRemove(index){
                if (this.editAble) {
                    this.$Message.error("查看状态，不可删除");
                    return
                };
                /*this.spareParts_img = {};
                this.img_modal = false;
                this.imgDis = false;*/
                this.upLoadList.splice(index,1);
                this.formValidate.upLoadList.splice(index,1);
            },
            handleSuccess(response, file, fileList){
//                console.log(response, file, fileList)
            },
            handleFormatError(file) {
                this.$Notice.warning({
                    title: '文件格式不正确',
                    desc: '文件 ' + file.name + ' 格式不正确，请上传 jpg 或 png 格式的图片。'
                })
            },
            /*upSuccess: function (fileName, savePath) {
                this.imgDis = true;
                this.$set(this.spareParts_img, 'fileName', fileName);
                this.$set(this.spareParts_img, 'savePath', savePath);
            },*/
            upSuccessMulti:function (files) {
                this.imgDis = true;
                this.upLoadList = files;
                this.upLoadFiles = this.upLoadFiles.concat(this.upLoadList);
                this.formValidate.upLoadList = this.upLoadFiles;
            },
            //保存按钮:
            toGetInitiaDetail(){
                this.$axios.post('/eamSparePart/initCode').then((res) => {
                    if(res.data.response.code!=0){
                        this.formValidate.parts_code = res.data.response.data.sparePareCode;
                    }
                }).catch((err) => {console.log(err);})
            },
            toAddSpare(name){
                {
                    this.$refs[name].validate((valid) => {
                        if (valid) {
                            if (this.weightTip && this.formValidate.parts_weight) {
                                this.$Message.error(this.weightTip);
                                return;
                            };
                            let vt = this;
                            vt.saveData = {
//                                    "toolDefineId":11, 备品备件id
                                "sparePartId": this.thePageId,//备件编码
                                "sparePartName": vt.formValidate.parts_name, //备件名称
                                "sparePareCode":vt.formValidate.parts_code,
                                "modelId": vt.formValidate.parts_version_id, //备件型号
                                "categoryId": vt.formValidate.parts_type_id, //备件分类id
                                "uomId": vt.formValidate.parts_unit_id, //备件单位
                                "weight": vt.formValidate.parts_weight, //备件重量
                                "useType": vt.formValidate.parts_spec, //备件类型
                                "spec": vt.formValidate.parts_standard, //备件规格
                                "transportationType": vt.formValidate.parts_trans, //运输方式
                                "desc": vt.formValidate.parts_desc,//备件描述
                                "images":vt.formValidate.upLoadList,//多图片数组
                            };
                            if(vt.thePageId){
                                vt.saveData.toolDefineId=vt.thePageId;
                            };
                            this.save_loading=true;
                            this.$axios.post('/eamSparePart/SparePartEditSave',vt.saveData).then((res) => {
                                let result = res.data.response;
                                if (result.code != 1) {
                                    vt.$Message.error(response.data.response.msg);
                                   vt.save_loading=false;
                                } else {
                                    setTimeout(function () {
                                        vt.$Message.success('成功');
                                        vt.save_loading=false;
                                        window.history.go(-1);
                                        /*if(this.theTabTo=="equPage"){
                                             window.history.go(-1);
                                        } else{
                                            vt.$router.push({path: '/spareParts',query:{theTab:vt.theTabTo}});
                                        };*/
                                    }, 1200);

                                }
                            }).catch((err) => {
//                                console.log(err);
                                vt.save_loading=false;
                            });
                        } else {
                            this.$Message.error('请完善表单信息!');
                        }
                    })

                }
            },

            //查询详情：
            toGetDetail(){
                let vt = this;
                this.$axios.post('/eamSparePart/getSparePartDetails',
                    {
                        sparePartId : vt.thePageId,
                    }
                ).then((res) => {
                    let result = res.data.response;
                    if (result.code != 1) {
                        vt.$Message.error(response.data.response.msg);
                    } else {
                        vt.formValidate = result.data.formValidate;//基本信息
                        if (result.data.formValidate.upLoadList.length>0) {
                            vt.imgDis = true;
                        };
                        vt.upLoadFiles = result.data.formValidate.upLoadList;
                        vt.tableData = result.data.tableData;
//                        console.log("result.data.tableData +" + JSON.stringify(result.data.tableData))
                        for(let i = 0 ;i < vt.tableData.length; i++){
                            switch(vt.tableData[i].status)
                            {
                                case 0:
                                    vt.tableData[i].status = "停机";
                                    break;
                                case 1:
                                    vt.tableData[i].status = "故障";
                                    break;
                                case 2:
                                    vt.tableData[i].status = "换装调试";
                                    break;
                                case 3:
                                    vt.tableData[i].status = "计划内保养";
                                    break;
                                case 4:
                                    vt.tableData[i].status = "正常加工";
                                    break;
                            }
                        }
                    }
                }).catch((err) => {
//                    console.log(err);
                });
            },
            toGet_associatedEqu(){
                /*let vt = this;
                this.$axios.post('/eamTools/equipment_link_detail',
                    {
                        id: vt.thePageId,
//                        id: 1,
                    }
                ).then((res) => {
                    let result = res.data.response;
                    if (result.code != 1) {
                        vt.$Message.error(response.data.response.msg);
                    }
                    else {
                        this.tableData = result.data;
                    }
                }).catch((err) => {
//                    console.log(err);
                });*/
            },
        },
        mounted(){
            //判断页面来源：
            this.theTabTo=this.$route.query.theTab;
            this.thePageId = this.$route.query.id;
            this.pageFrom =this.$route.query.from;
            if (this.pageFrom == "toDetail") {
                this.editAble = true;
                this.theTitle = "备件管理--查看";
            }
            if (this.pageFrom == "toEdit") {
                this.theTitle = "备件管理--编辑";
                this.editAble = false;
            }
            if (this.pageFrom == "toAdd1") {
                this.theTitle = "备件管理--新增";
                this.editAble = false;
                this.toGetInitiaDetail();
            }

            //运输方式:
            this.getSpare_trans();
            //库存状态:
            this.getSpare_states();
            this.get_createMes();

            if (this.thePageId) {
                this.toGetDetail();
                this.toGet_associatedEqu();

            }
        },
    }
</script>

<style>
</style>