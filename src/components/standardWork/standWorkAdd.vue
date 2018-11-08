<template>
    <div class="basic bzzy-change">
        <Spin fix v-show="load_fix">
            <Icon type="load-c" size=18       class="demo-spin-icon-load"></Icon>
            <!--<div>保存中，请稍后...</div>-->
            <div>{{this.load_fix_info}}</div>
        </Spin>
        <!--模块名称-->
        <div class="title">
            <span>方案管理-新建</span>
        </div>
        <!--表单-->
        <div class="form-content">
            <Form :model="workForm" label-position="right" inline :label-width="100" :rules="ruleValidate"
                  ref="workForm">
                <Form-item label="标准方案编码" prop="code">
                    <Input v-model="workForm.code" style="width: 160px;" disabled></Input>
                </Form-item>
                <Form-item label="标准方案名称" prop="name">
                    <Input :maxlength="20" @on-change="lengthChange(workForm.name)" v-model="workForm.name"
                           style="width: 160px;"></Input>
                </Form-item>
                <Form-item label="版本" prop="version">
                    <Input v-model="workForm.version" style="width: 160px;" disabled></Input>
                </Form-item>
                <Form-item label="是否默认版本" prop="isDefaultVersion">
                    <div style="width: 160px;">
                        <i-switch v-model="workForm.isDefaultVersion" disabled>
                            <span slot="open">是</span>
                            <span slot="close">否</span>
                        </i-switch>
                        <Button v-show="button_14743" type="primary" size="small" @click="version_code = true">版本管理
                        </Button>
                    </div>
                </Form-item>
                <Form-item label="是否停机" prop="needShutdown">
                    <div style="width: 160px;">
                        <i-switch v-model="workForm.needShutdown">
                            <span slot="open">是</span>
                            <span slot="close">否</span>
                        </i-switch>
                    </div>
                </Form-item>
                <Form-item label="方案类型" prop="standardType">
                    <Select v-model="workForm.standardType" style="width: 160px;" @on-change="aboutStation">
                        <Option value='0'>保养</Option>
                        <Option value='1'>点检</Option>
                    </Select>
                </Form-item>
                <Form-item label="预计耗时(分钟)" prop="requiredTime">
                    <!--<InputNumber :min='0' v-model="workForm.requiredTime" @on-change='checkInt' style="width: 160px;"></InputNumber>-->
                    <InputNumber :min="0" :max="9999" v-model="workForm.requiredTime" @on-change="checkInt"
                                 style="width: 160px;"></InputNumber>
                    <!--<InputNumber :max="10" :min="1" v-model="value1"></InputNumber>-->
                </Form-item>
                <!--<Form-item label="启用时间" prop="startTime">
                    <Date-picker v-model="workForm.startTime" type="date" placeholder="选择日期和时间" style="width: 160px" @on-change="checkStartTime"></Date-picker>
                </Form-item>
                <Form-item label="停用时间" prop="endTime">
                    <Date-picker v-model="workForm.endTime" type="date" placeholder="选择日期和时间" style="width: 160px" @on-change="checkEndTime"></Date-picker>
                </Form-item>-->
                <Form-item label="执行岗位" prop="">
                    <Select v-model="workForm.stationId" style="width: 160px;">
                        <Option v-for="item in workForm.station_a" :value="item.id" :key="item.id">{{ item.roleName }}
                        </Option>
                        <!--<Option value="outside">委外人员</Option>-->
                    </Select>
                </Form-item>
                <!--<Form-item v-if="workForm.standardType == '1'" label="执行岗位" prop="">                                       
                    <Select  v-model="workForm.station_b" style="width: 160px;">
                        <Option value="action">操作工</Option>
                        <Option value="manger">管理人员</Option>
                    </Select>
                </Form-item>-->

                <Form-item label="设备型号" prop="equ_type">
                    <div class="input-search" prop="equ_type">
                        <Input v-model="workForm.equ_type" style="width: 160px;" readonly></Input>
                        <Button icon="ios-search" @click="equ_type = true"></Button>
                    </div>
                </Form-item>
                <Form-item label="所属供应商" prop="supply">
                    <div class="input-search" prop="supply">
                        <Input v-model="workForm.supply" style="width: 160px;" readonly></Input>
                        <Button icon="ios-search" @click="openSup"></Button>
                    </div>
                </Form-item>

                <Form-item label="注意事项" prop="note">
                    <Input :maxlength="1000" @on-change="remarkChange(workForm.note)" v-model="workForm.note"
                           type="textarea" style="width: 500px;"></Input>
                </Form-item>
            </Form>
        </div>
        <!--表格-->
        <Tabs class="maintenanceTab" type="card">
            <Tab-pane class="checkTab" label="作业项目" icon="social-buffer">
                <div class="table-reset" :rule="ruleValidate">
                    <table class="table table-bordered table-center table-striped table-blue table-edit table-standWork taDisplay ">
                        <thead>
                        <tr>
                            <th>序号</th>
                            <th>作业内容</th>
                            <th>标准要求</th>
                            <th style="width:140px;">标准工时(分钟)</th>
                            <th>参照图片</th>
                            <th>操作</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="(itemData1,index) in tpmStandardSolutionActionTmp" class="trDisplay">
                            <td>{{index + 1}}</td>
                            <td style="position: relative;"><span class="pro">*</span><Input
                                    @on-change="change(itemData1.content)" :maxlength="100" type="text"
                                    v-model="itemData1.content" style="padding-left: 10px;"></Input></td>
                            <td><Input @on-change="change(itemData1.requirement)" :maxlength="100" type="text"
                                       v-model="itemData1.requirement"></Input></td>
                            <td class="num_right" >
                                <Input v-model="itemData1.requiredTime" :maxlength='4'
                                              @on-change="checkInt2(itemData1.requiredTime)" style="width: 120px;"></Input>
                            </td>
                            <td @click="getIndex(index)">
                                <div class="demo-upload-list" v-if="tpmStandardSolutionActionTmp[index].url">
                                    <img :src=" '../static/' + itemData1.url">
                                    <div class="demo-upload-list-cover">
                                        <Icon type="ios-eye-outline" @click.native="handleView(itemData1.url)"></Icon>
                                        <Icon type="ios-trash-outline"
                                              @click.native="handleRemove(index,itemData1.url)"></Icon>
                                    </div>
                                </div>
                                <PandoraUpload
                                        v-if="!tpmStandardSolutionActionTmp[index].url"
                                        ref="upload"
                                        :format="['jpg','jpeg','png']"
                                        header="{
				                    'Accept': 'application/json, text/plain, /'
				                    }"
                                        :max-size="2048"
                                        :show-upload-list="false"
                                        :on-success="handleSuccess"
                                        :action="uploadUrl()"
                                        :fileSavePath="'/eam/'"
                                        style="display: inline-block"
                                        @on-up-success="upSuccess"
                                        :on-format-error="handleFormatError">
                                    <div style="width: 58px;height:58px;line-height: 58px;border: dotted 1px #ccc;">
                                        <Icon type="camera" size="20"></Icon>
                                    </div>
                                </PandoraUpload>
                            </td>
                            <td><a class="mar-r-5" size="small" @click="removeTpmStandardSolutionAction(index)">删除</a>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div class="mar-t-10">
                    <Button type="primary" icon="plus-round" size="small" @click="addTpmStandardSolutionAction"
                            :disabled="btnDis">添加
                    </Button>
                </div>
            </Tab-pane>
            <Tab-pane class="checkTab" label="备品备件" icon="cube">
                <!--<div class="table-reset">-->
                <!--<table class="table table-bordered table-center table-striped table-blue table-edit">-->
                <!--<thead>-->
                <!--<tr>-->
                <!--<th>序号</th>-->
                <!--<th width="15%">备品备件编码</th>-->
                <!--<th>备品备件名称</th>-->
                <!--<th>单位</th>-->
                <!--<th width="10%">数量</th>-->
                <!--<th>备品备件类型</th>-->
                <!--<th>操作</th>-->
                <!--</tr>-->
                <!--</thead>-->
                <!--<tbody>-->
                <!--<tr v-for="(itemData2,index) in tpmStandardSolutionMaterialTmp">-->
                <!--<td>{{index + 1}}</td>-->
                <!--<td>-->
                <!--<div class="input-search">-->
                <!--<Input v-model="itemData2.materialCode" disabled></Input>-->
                <!--<Button icon="ios-search" @click="popMaterial(index)"></Button>-->
                <!--</div>-->
                <!--</td>-->
                <!--<td>{{itemData2.materialName}}</td>-->
                <!--<td>{{itemData2.materialUnit}}</td>-->
                <!--<td><Input-number v-model="itemData2.quantity" :min="0" @on-change="checkInt"></Input-number></td>-->
                <!--<td>{{itemData2.materialType}}</td>-->
                <!--<td><a class="mar-r-5" size="small" @click="removeData2(index)">作废</a></td>-->
                <!--</tr>-->
                <!--</tbody>-->
                <!--</table>-->
                <!--</div>-->
                <!--<div class="mar-t-10">-->
                <!--<Button type="primary" icon="plus-round" size="small" @click="addData2">添加</Button>-->
                <!--</div>-->
                <!--kp--备品备件--开始-->
                <div class="table-reset mar-t-10 ">
                    <table class="table table-bordered table-center table-striped table-blue table-edit table-standWork taDisplay">
                        <thead>
                        <tr>
                            <th>序号</th>
                            <th width="35%">备品备件</th>
                            <th>备件单位</th>
                            <th>备件数量(个)</th>
                            <th>操作</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="(sparePart,index) in spareParts_display" class="trDisplay">
                            <td>{{index + 1}}</td>
                            <td class="tdDisplay pointDis" :title="sparePart.toolDefineName">
                                {{sparePart.toolDefineName}}
                            </td>
                            <!--<td>{{sparePart.bdUom&&sparePart.bdUom.id?$cs.spareParts_unit(sparePart.bdUom.id):"错误数据，暂无枚举"}}</td>-->
                            <td class="tdDisplay pointDis" :title="sparePart.bdUom && sparePart.bdUom.name ? sparePart.bdUom.name : '错误数据，暂无单位'">{{sparePart.bdUom && sparePart.bdUom.name ? sparePart.bdUom.name : "错误数据，暂无单位"}}</td>
                            <td class="wid-10 num_right">
                                <Input v-model=sparePart.number
                                       @on-change="toTestIsNAN(sparePart.number,index)"></Input>
                            </td>
                            <td><a @click="delete_spareParts(index)">删除</a></td>
                        </tr>
                        </tbody>
                    </table>
                    <div class="tableHasNoData" v-show="!spareParts_display[0]"><p>暂无数据</p></div>
                </div>
                <div class="mar-t-10">

                    <Button icon="plus-round" size="small" type="primary" @click="addBtn_spareParts">添加</Button>

                </div>
                <!--kp--备品备件--结束-->
            </Tab-pane>
            <!--<Tab-pane class="checkTab" label="备品备件" icon="cube">-->
            <!--<div class="table-reset">-->
            <!--<table class="table table-bordered table-center table-striped table-blue table-edit">-->
            <!--<thead>-->
            <!--<tr>-->
            <!--<th>序号</th>-->
            <!--<th width="15%">备品备件编码</th>-->
            <!--<th>备品备件名称</th>-->
            <!--<th>单位</th>-->
            <!--<th width="10%">数量</th>-->
            <!--<th>备品备件类型</th>-->
            <!--<th>操作</th>-->
            <!--</tr>-->
            <!--</thead>-->
            <!--<tbody>-->
            <!--<tr v-for="(itemData2,index) in tpmStandardSolutionMaterialTmp">-->
            <!--<td>{{index + 1}}</td>-->
            <!--<td>-->
            <!--<div class="input-search">-->
            <!--<Input v-model="itemData2.materialCode" disabled></Input>-->
            <!--<Button icon="ios-search" @click="popMaterial(index)"></Button>-->
            <!--</div>-->
            <!--</td>-->
            <!--<td>{{itemData2.materialName}}</td>-->
            <!--<td>{{itemData2.materialUnit}}</td>-->
            <!--<td><Input-number v-model="itemData2.quantity" :min="0" @on-change="checkInt"></Input-number></td>-->
            <!--<td>{{itemData2.materialType}}</td>-->
            <!--<td><a class="mar-r-5" size="small" @click="removeData2(index)">作废</a></td>-->
            <!--</tr>-->
            <!--</tbody>-->
            <!--</table>-->
            <!--</div>-->
            <!--<div class="mar-t-10">-->
            <!--<Button type="primary" icon="plus-round" size="small" @click="addData2">添加</Button>-->
            <!--</div>-->
            <!--</Tab-pane>-->
            <!--<Tab-pane class="checkTab" label="人员需求" icon="android-person">
                <Table stripe border :columns="teamColumns" :data="teamData"></Table>
                <div class="table-reset">
                    <table class="table table-bordered table-center table-striped table-blue table-edit">
                        <thead>
                        <tr>
                            <th>序号</th>
                            <th>班组编码</th>
                            <th>班组名称</th>
                            <th>需求人数</th>
                            <th>操作</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="(ssDepartment,index) in tpmStandardSolutionDeptTmp" >
                            <td>{{index+1}}</td>
                            <td>
                                <div class="input-search">
                                    <Input v-model="ssDepartment.code" disabled></Input>
                                    <Button icon="ios-search" @click="ssDepartmentIndex(index)"></Button>
                                </div>
                            </td>
                            <td>{{ssDepartment.name}}</td>
                            <td><Input-number v-model="ssDepartment.quantity" :min="1" @on-change="checkInt"></Input-number></td>
                            <td><a class="mar-r-5" size="small" @click="removeTpmStandardSolutionDeptTmp(index)">作废</a></td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div  class="mar-t-10">
                    <Button type="primary" icon="plus-round" size="small" @click="addTpmStandardSolutionDeptTmp">添加</Button>
                </div>
            </Tab-pane>-->
            <Tab-pane class="checkTab" label="适用设备" icon="android-settings">
                <!--<Button  type="primary" icon="document-text" size="large" @click="toSearch_equment">查询</Button>-->
                <!--<table class="table table-bordered table-center table-striped table-blue table-edit">-->
                <!--<thead>-->
                <!--<tr>-->
                <!--<th>序号</th>-->
                <!--<th>设备地点</th>-->
                <!--<th>设备选择</th>-->
                <!--<th>操作</th>-->
                <!--</tr>-->
                <!--</thead>-->
                <!--<tbody>-->
                <!--<tr v-for="(sbEquipment,index) in tpmStandardSolutionEquipmentTmp" >-->
                <!--<td>{{index+1}}</td>-->
                <!--<td>-->
                <!--<div class="input-search">-->
                <!--<Input v-model="sbEquipment.equipmentCode" disabled></Input>-->
                <!--<Button icon="ios-search" @click="equipment_local = true"></Button>-->
                <!--</div>-->
                <!--</td>-->
                <!--<td>-->
                <!--<div class="input-search">-->
                <!--<Input v-model="EquipmentTmp.equipment_chk_val" disabled></Input>-->
                <!--<Button icon="ios-search" @click="equipment_chk = true"></Button>-->
                <!--</div>-->
                <!--</td>-->
                <!--<td><a class="mar-r-5" size="small" @click="removeTpmStandardSolutionEquipmentTmp(index)">作废</a></td>-->
                <!--</tr>-->
                <!--</tbody>-->
                <!--</Table>-->

                <tree_multiple :baseData="treeSiteData" @dataSetected="dataSelectedDisa"
                               :right_display="treeSiteDataSelected" :state="tempState"
                               :treeTip1="treeTip"></tree_multiple>

                <!--<p v-show="treeTip">{{treeTip }}</p>-->
                <!--<div  class="mar-t-10">-->
                <!--<Button type="primary" icon="plus-round" size="small" @click="addTpmStandardSolutionEquipmentTmp">添加</Button>-->
                <!--</div>-->
            </Tab-pane>
            <!--<Tab-pane class="checkTab" label="抑制作业" icon="android-options">
                <div class="table-reset">
                    <table class="table table-bordered table-center table-striped table-blue table-edit">
                        <thead>
                        <tr>
                            <th>序号</th>
                            <th>标准方案编码</th>
                            <th>标准方案名称</th>
                            <th>版本</th>
                            <th>前（日）</th>
                            <th>后（日）</th>
                            <th>操作</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="(ssInhibition,index) in tpmStandardSolutionInhibitionTmp">
                            <td>{{index + 1}}</td>
                            <td>
                                <div class="input-search">
                                    <Input v-model="ssInhibition.code" disabled></Input>
                                    <Button icon="ios-search" @click="ssInhibitionIndex(index)"></Button>
                                </div>
                            </td>
                            <td>{{ssInhibition.name}}</td>
                            <td>
                                <Select clearable v-model="ssInhibition.version" @on-change="checkSSVersion(index, ssInhibition.version, ssInhibition.conflictSolutionId)">
                                    <Option v-for="versionItem in ssInhibition.ssv" :value="versionItem.version" :key="versionItem">{{versionItem.version}}</Option>
                                </Select>
                            </td>
                            <td><Input-number v-model="ssInhibition.daysBefore" :min="0" @on-change="checkInt"></Input-number></td>
                            <td><Input-number v-model="ssInhibition.daysAfter" :min="0" @on-change="checkInt"></Input-number></td>
                            <td><a class="mar-r-5" size="small" @click="removeTpmStandardSolutionInhibitionTmp(index)">作废</a></td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div class="mar-t-10">
                    <Button type="primary" icon="plus-round" size="small" @click="addTpmStandardSolutionInhibitionTmp">添加</Button>
                </div>
            </Tab-pane>-->
        </Tabs>
        <!--保存按钮-->
        <div class="btn-group">
            <!--<router-link to='/standardwork'>
                <Button v-show="button_14742" class="btn-gary" icon="close" size="large">取消</Button>
            </router-link>
            <Button v-show="button_14741" type="primary" icon="document-text" size="large" @click="handleSubmit('workForm')">保存草稿</Button>
            <Button type="primary" icon="checkmark" size="large" @click="submit('workForm')" >生效</Button>-->
            <router-link to='/standardwork'>
                <Button class="btn-gary" icon="close" size="large">取消</Button>
            </router-link>
            <!--<Button type="primary" icon="document-text" size="large" @click="submit('workForm',0)">保存草稿</Button>-->
            <Button type="primary" icon="checkmark" size="large" @click="submit('workForm',1)">保存</Button>
        </div>
        <!--kp---备品备件多选弹出框：---开始-->
        <Modal v-model="sparePartsMod" title="备品备件需求" @on-ok="toAdd_spareParts" width="1000">
            <table_multiple @sparePartsSetected="spareParts_dataSelectedDisa" :mod_rightDisplay="sparePartsSelected"
                            :canSearch="toSearch" :modelId="workForm.equId"
                            :manufacturer="workForm.supply"></table_multiple>
        </Modal>
        <!--kp---备品备件多选弹出框：---结束-->


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
                <Button type="primary" size="large" long :loading="modal_loading" @click="commonModal=false">确认</Button>
            </div>
        </Modal>
        <!--end-->


        <Modal v-model="material_code" title="备品备件需求" @on-ok="chooseMaterial">
            <div class="second-title">备品备件类型</div>
            <Select style="width:200px" :value="tmp_typeId" @on-change="selectType">
                <Option v-for="item in materialType" :value="item.value" :key="item">{{ item.label }}</Option>
            </Select>
            <div class="second-title mar-t-10">备品备件选择</div>
            <table class="table table-bordered table-center table-striped table-blue materialS">
                <thead>
                <tr>
                    <th>选择</th>
                    <th>序号</th>
                    <th>备品备件编码</th>
                    <th>备品备件名称</th>
                    <th>规格型号</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(material,index) in materialList">
                    <td v-html='material.innerhtml'></td>
                    <td>{{index + 1}}</td>
                    <td>{{material.materialCode}}</td>
                    <td>{{material.materialName}}</td>
                    <td>{{material.modelType}}</td>
                </tr>
                </tbody>
            </table>
            <div class="mar-t-10" style="overflow: hidden">
                <div style="float: right;">
                    <Page :total="numMaterial" size="small" show-elevator :page-size="size"
                          @on-change="changeMaterial"></Page>
                </div>
            </div>
        </Modal>
        <!--<Modal v-model="department_code" title="人员需求" @on-ok="selectDept">
            <table class="table table-bordered table-center table-striped table-blue">
                <thead>
                <tr>
                    <th>选择</th>
                    <th>序号</th>
                    <th>班组编码</th>
                    <th>班组名称</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(dept,index) in tpmDept">
                    <td><div v-html="dept.radio"></div></td>
                    <td>{{index+1}}</td>
                    <td>{{dept.code}}</td>
                    <td>{{dept.name}}</td>
                </tr>
                </tbody>
            </table>
            <div class="mar-t-10" style="overflow: hidden">
                <div style="float: right;">
                    <Page :total="tpmDeptTotal" size="small" show-elevator :page-size="size" @on-change="initTpmDept"></Page>
                </div>
            </div>
        </Modal>-->
        <Modal v-model="equipment_code" title="设备编码" width="820" @on-ok="selectSb">
            <Row>
                <Col :span="6" class="pad-r-10">
                <div class="pad-5-20 bg-linegary">地点名称</div>
                <Tree :data="baseData" show-checkbox :multiple="false" :show-checkbox="false"
                      @on-select-change="getLocationId" class="max-h-300"></Tree>
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
                        <Page :total="tpmsbTotal" :current="tpmsbCurrent" size="small" show-elevator :page-size="size"
                              @on-change="changeEquipment"></Page>
                    </div>
                </div>
                </Col>
            </Row>
        </Modal>
        <Modal v-model="equipment_local" title="设备地点名称">
            <Row>
                <Col span="22" offset="2">
                <Tree :data="baseData" show-checkbox :multiple="false" :show-checkbox="false"
                      @on-select-change="getLocationId" class="max-h-300"></Tree>
                </Col>
            </Row>
        </Modal>
        <Modal v-model="equipment_chk" title="设备选择" width="600" @on-ok="selectEquipment">
            <Transfer :data="equipment_chk_data" :target-keys="equipment_chk_targetKeys" :list-style="listStyle"
                      filterable :render-format="render" @on-change="handleChange4"></Transfer>
        </Modal>
        <!--<Modal v-model="standard_code" title="抑制作业" @on-ok="selectSs">
            <table class="table table-bordered table-center table-striped table-blue">
                <thead>
                <tr>
                    <th>选择</th>
                    <th>序号</th>
                    <th>标准方案编码</th>
                    <th>标准方案名称</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(ss, index) in tpmss">
                    <td>
                        <div v-html="ss.radio"></div>
                    </td>
                    <td>{{index + 1}}</td>
                    <td>{{ss.code}}</td>
                    <td>{{ss.name}}</td>
                </tr>
                </tbody>
            </table>
            <div class="mar-t-10" style="overflow: hidden">
                <div style="float: right;">
                    <Page :total="tpmssTotal" size="small" show-elevator :page-size="size" @on-change="initTpmss"></Page>
                </div>
            </div>
        </Modal>-->
        <Modal v-model="version_code" title="版本管理">
            <div class="second-title">方案信息</div>
            <table v-model="workForm" class="table table-bordered table-center mar-b-10">
                <tbody>
                <tr>
                    <td>{{workForm.code}}</td>
                    <td>{{workForm.name}}</td>
                </tr>
                </tbody>
            </table>
            <div class="second-title">版本管理</div>
            <Table stripe border :columns="columns_v" :data="data_v"></Table>
            <div slot="footer" align="center">


                <!--保存按钮-->
                <Button v-show="button_14752" class="btn-gary" icon="close" size="large">取消</Button>
                <Button v-show="button_14751" type="primary" icon="document-text" size="large">保存草稿</Button>
            </div>
        </Modal>
        <Modal v-model="save_plan" title="标准方案版本确认" @on-ok="saveSolution">
            <div class="font-18 pad-b-10 col-orange">您当前保存的版本号为 <strong>{{workForm.version}}</strong>，是否继续保存？</div>
        </Modal>
        <Modal title="查看图片" v-model="visible">
            <img :src="imgUrl" v-if="visible" style="width: 100%">
        </Modal>

        <!--GDJ 设备型号、所属供应商 开始：-->
        <Modal v-model="equ_type" title="设备型号" @on-ok="deviceSelected">
            <div class="table-reset">
                <table class="table table-bordered table-center table-striped table-blue table-edit typedevice taDisplay">
                    <thead>
                    <tr>
                        <th>选择</th>
                        <th>序号</th>
                        <th>设备型号</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(item,index) in deviceTypeList" class="trDisplay">
                        <td><input type="radio" name="id" :value="item.modelId"/></td>
                        <td>{{index + 1}}</td>
                        <td class="tdDisplay pointDis" :title="item.modelName">{{item.modelName}}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div class="mar-t-10" style="overflow: hidden">
                <div style="float: right;">
                    <Page size="small" :total="totalNum" show-elevator :page-size="size" @on-change="pageChange"></Page>
                </div>
            </div>
        </Modal>
        <Modal v-model="supply" title="所属供应商" @on-ok="supplySelected">
            <div class="table-reset">
                <table class="table table-bordered table-center table-striped table-blue table-edit supply taDisplay">
                    <thead>
                    <tr>
                        <th>选择</th>
                        <th>序号</th>
                        <th>所属供应商</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(item,index) in supplierList"  class="trDisplay">
                        <td><input type="radio" name="supplyId" :value="item.manufacturer"/></td>
                        <td>{{index + 1}}</td>
                        <td class="tdDisplay pointDis" :title="item.manufacturer">{{item.manufacturer}}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div class="mar-t-10" style="overflow: hidden">
                <div style="float: right;">
                    <Page size="small" :total='supplyTotal' show-elevator :page-size="size"
                          @on-change="supplyChange"></Page>
                </div>
            </div>
        </Modal>
        <!--GDJ 设备型号、所属供应商 结束-->

        <Modal v-model="promptModal" width="360">
            <p slot="header" style="color:#f60;text-align:center">
                <Icon type="information-circled"></Icon>
                <span>保存确认</span>
            </p>
            <div style="text-align:center">
                <p>是否保存此方案？</p>
            </div>
            <div slot="footer">
                <Button type="primary" size="large" long :loading="modal_loading" @click="getSave(submitId)">确认</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
    //使用jquery渲染
    import $ from 'jquery';
    //kp--适用设备多选组件：
    import tree_multiple from '../treeMulitiple/tree_multiple_equ.vue';
    //kp--备品备件多选组件：
    import table_multiple from '../treeMulitiple/table_multiple_spareParts.vue';
    import PandoraUpload from '../../api/pandora-upload/pandoraUpload.vue';
    export default {
        created(){
            console.log(JSON.parse(localStorage.getItem('standardWorkRowData')));
        },
        data (){
            return {
                //kp--备品备件相关--开始
                commonModal: false,
                tipMessage: "",
                sparePartsMod: false,
                toSearch: "cannot",
                sparePartsSelected: [],
                spareParts_display: [],
                theequId: "",
                thesupply: "",
                //kp--备品备件相关--结束


                //kp--适用设备相关--开始：
                treeTip: "",
                tempState: "adding",
                treeSiteDataSelected: [],
                treeSiteData: [],
                //kp--适用设备--结束
                //临时字段...
                isubmit: false,
                tmp_typeId: 7,
                tmp: {
                    tpmStandardSolutionIndex: "",
                    tpmMaterialId: "",
                    tpmMaterialCode: "",
                    tpmMaterialName: "",
                    tpmModelType: "",
                    tpmMaterialUnit: "",
                },

                load_fix: false,
                load_fix_info: '',

                size: 5,
                numMaterial: 0,

                materialList: [],

                material_code: false,
                department_code: false,
                equipment_code: false,
                equipment_local: false,
                equipment_chk: false,

                equipment_chk_data: this.getMockData(),
                equipment_chk_targetKeys: this.getTargetKeys(),
                listStyle: {
                    width: '250px',
                    height: '300px'
                },

                standard_code: false,
                version_code: false,
                save_plan: false,
//                button_14743: this.$rt('14743'),
//                button_14741: this.$rt('14741'),
//                button_14742: this.$rt('14742'),
//                button_14752: this.$rt('14752'),
//                button_14751: this.$rt('14751'),
                button_14743: true,
                button_14741: true,
                button_14742: true,
                button_14752: true,
                button_14751: true,
                baseData: [],

                //GDJ--设备型号、所属供应商--开始：
                equ_type: false,
                supply: false,
                //GDJ--设备型号、所属供应商--结束

                workForm: {
                    code: '1001',
                    name: '',
                    version: '2.0',
                    isDefaultVersion: true,
                    needShutdown: false,
                    requiredTime: null,
                    startTime: new Date(),
                    endTime: '2099-01-01 08:00:00',
                    standardType: '0',
                    station_a: [{id: '', roleName: ''}],
                    stationId: '',
                    station_b: '',
                    //GDJ--设备型号、所属供应商--开始：
                    equ_type: '',
                    equId: '',
                    supply: '',
                    //GDJ--设备型号、所属供应商--结束
                    note: '',
                },
                standard: '0',
                ruleValidate: {
                    name: [
                        {required: true, message: '内容不能为空', trigger: 'change'},
                        {type: 'string', max: 60, message: '方案名称不能超出60个字', trigger: 'change'}
                    ],
                    requiredTime: [
                        {required: true, type: 'number', message: '内容不能为空', trigger: 'change'},
                    ],
                    equ_type: [
                        {required: true, message: '内容不能为空', trigger: 'change'}
                    ],
                    supply: [
                        {required: true, message: '内容不能为空', trigger: 'change'}
                    ],
                    startTime: [
                        {required: true, type: 'date', message: '请选择启用时间', trigger: 'change'}
                    ],
                    inputText: [
                        {required: true, message: '内容不能为空', trigger: 'blur'}
                    ]
                },


                new_data1: {
                    content: '',
                    requirement: '',
                    requiredTime: null,
                    url: '',
//                  picname: '',
//                  picformat: ''
                },
                tpmStandardSolutionActionTmp: [],
                btnDis: false,

                /*上传图片*/
                /*defaultList: [
                 {
                 'name': 'standard.png',
                 'url': '../../../static/img/standard.png'
                 },
                 ],*/
                imgName: '',
                visible: false,
                imgUrl: '',
                /*上传图片 end*/

                //备品备件 start
                columns2: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 80,
                        align: 'center'
                    },
                    {
                        title: '备品备件编码',
                        key: 'materialCode',
                        render: (h, params) => {
                            return h('div', {
                                class: 'input-search'
                            }, [
                                h('Input', {
                                    props: {
                                        type: 'text',
                                        value: params.row.materialCode,
                                    }
                                }),
                                h('Button', {
                                    props: {
                                        icon: 'ios-search'
                                    },
                                    on: {
                                        click: () => {
                                            this.tmp.tpmStandardSolutionIndex = params.row._index;
                                            this.material_code = true;
                                        }
                                    }
                                })
                            ]);
                        },
                    },
                    {
                        title: '备品备件名称',
                        key: 'materialName'
                    },
                    {
                        title: '单位',
                        key: 'materialUnit'
                    },
                    {
                        title: '数量',
                        key: 'quantity',
                        render: (h, params) => {
                            return h('Input', {props: {value: params.row.quantity}})
                        }
                    },
                    {
                        title: '备品备件类型',
                        key: 'materialType',
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 150,
                        align: 'center',

                        render: (h, params) => {
                            return h('a', {
                                props: {
                                    type: 'text',
                                    size: 'small',
                                    class: 'mar-l-5'
                                },
                                on: {
                                    click: () => {
                                        this.removeData2(params.index);
                                    }
                                }
                            }, '作废');
                        }
                    }
                ],
                n_data2: {
                    materialId: '',
                    materialCode: '',
                    materialName: '',
                    materialUnit: '',
                    quantity: 1,
                    materialType: '消耗性备品',
                    materialTypeId: '',
                },

                tpmStandardSolutionMaterialTmp: [],

                materialType: [],

                /*人员需求 start*/
                /* new_tpmStandardSolutionDeptTmp:{
                 teamId:'',
                 code: '',
                 name: '',
                 quantity: null,
                 },
                 tpmStandardSolutionDeptTmp: [],

                 teamColumns: [
                 {
                 title: '序号',
                 type: 'index',
                 width: 80,
                 align: 'center'
                 },
                 {
                 title: '人员选择',
                 key: 'teamCode',
                 align: 'center'
                 },
                 {
                 title: '操作',
                 align: 'center'
                 }
                 ],
                 teamData: [
                 /!* {
                 code: '',
                 name: '',
                 quantity: '',
                 }*!/
                 ],*/
                /*人员需求 end*/

                columns4: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 80,
                        align: 'center'
                    },
                    {
                        title: '设备编码',
                        key: 'equipmentId',
                        render: (h, params) => {
                            return h('div', {
                                class: 'input-search'
                            }, [
                                h('Input', {
                                    props: {
                                        type: 'text',
                                        value: params.row.equipmentId,
                                    }
                                }),
                                h('Button', {
                                    props: {
                                        icon: 'ios-search'
                                    },
                                    on: {
                                        click: () => {
                                            this.equipment_code = true;
                                        }
                                    }
                                })
                            ]);
                        },
                    },
                    {
                        title: '设备名称',
                        key: 'equipmentName',
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 150,
                        align: 'center',

                        render: (h, params) => {
                            return h('a', {
                                props: {
                                    type: 'text',
                                    size: 'small',
                                    class: 'mar-l-5'
                                },
                                on: {
                                    click: () => {
                                        this.removeData4(params.index);
                                    }
                                }
                            }, '作废');
                        }
                    }
                ],

                /*抑制方案 start*/
                new_tpmStandardSolutionInhibitionTmp: {
                    conflictSolutionId: '',
                    code: '',
                    name: '',
                    version: '',
                    daysAfter: 0,
                    daysBefore: 0,
                    ssv: [{
                        ssvId: "",
                        isDefaultVersion: "",
                        version: "",
                    }],
                },
                tpmStandardSolutionInhibitionTmp: [],
                tpmStandardSolutionInhibitionRepeat: false,
                /*抑制方案 end*/

                /*********************************适用设备start**************************/
                new_tpmStandardSolutionEquipmentTmp: {
                    equipmentId: '',
                    equipmentCode: '',
                    equipmentName: '',
                },
                tpmStandardSolutionEquipmentTmp: [],
                EquipmentTmp: {
                    equipment_chk_val: '',
                },

                /********************************适用设备start***************************/

                columns_v: [
                    {
                        title: '版本号',
                        key: 'version',
                    },
                    {
                        title: '是否默认版本',
                        key: 'isDefaultVersion',
                        render: (h, params) => {
                            return h('i-switch', {props: {value: params.row.isDefaultVersion}})
                        },
                    },
                ],
                data_v: [
                    {
                        version: '1.0',
                        isDefaultVersion: false,
                    },
                    {
                        version: '2.0',
                        isDefaultVersion: true,
                    },
                ],

                /*标准方案放大镜 start*/
                tpmss: [{id: "", code: "", name: "", radio: ""},],
                tpmssTotal: 0,
                /*标准方案放大镜 end*/

                /*人员需求班组放大镜*/
                /*设备放大镜start*/
                tpmsb: [],
                tpmsbTotal: 0,
                locationId: '',
                tpmsbCurrent: 1,

                /*设备放大镜end*/
                onlyindex: '',
                deviceTypeList: [],
                totalNum: 0,
                typePage: 1,

                supplierList: [],
                supplyTotal: 0,
                supplyPage: 1,

                promptModal: false,
                modal_loading: false,
                submitId: 0,

            }
        },
        components: {
            'table_multiple': table_multiple,
            'tree_multiple': tree_multiple,
            PandoraUpload
        },
        mounted(){
            this.getMaterial();
            this.initTpmDept(1);
            this.getLocationTree();
            this.getMaterialTyep();
//         this.initTpmss(1);
            this.initWorkForm();
            this.executive(this.workForm.standardType);
            // kp---地点设备列表，树图初始化  --开始:
//           this.toSearch_equment();
            // kp---地点设备列表，树图初始化  --结束:

            this.deviceType();
//          this.supplier();

            /*抑制方案放大镜*/
            console.log(this.workForm.standardType + 'standardType:');


//            this.uploadList = this.$refs.upload.fileList;
        },

        methods: {

//            kp--备品备件相关--开始

            //可供选择的备品备件列表：
            addBtn_spareParts(){
                if (this.workForm.equId && this.workForm.supply) {
//                    alert("111");
                    this.sparePartsMod = true;
                    this.toSearch = "cansearch";
                    this.theequId = this.workForm.equId;
                    this.thesupply = this.workForm.supply;
                }
                else {
//                    alert("222");
                    this.toSearch = "cannot";
                    if (!this.workForm.equId) {
                        this.tipMessage = "请选择设备型号！"
                    }
                    else if (!this.workForm.supply) {
                        this.tipMessage = "请选择所属供应商！"
                    }
                    this.commonModal = true;
                }
                ;
            },


            //kp--已选择：
            spareParts_dataSelectedDisa(messagea){
                {
                    this.sparePartsSelected = messagea;
                }
            },
            //弹出框确认：
            toAdd_spareParts(){
                this.spareParts_display = [];
                for (var i = 0; i < this.sparePartsSelected.length; i++) {
                    this.spareParts_display.push(this.$fc.cloneKey(this.sparePartsSelected[i]));
                    this.spareParts_display[i].number = this.sparePartsSelected[i].number?this.sparePartsSelected[i].number:"";
                }
                ;
            },

            //删除：
            delete_spareParts(item){
                this.spareParts_display.splice(item, 1);
                this.sparePartsSelected.splice(item, 1);
            },

            //验证是否是正整数
            toTestIsNAN(x,item){
                var re = /^[0-9]*[1-9][0-9]*$/;
                if (re.test(x)) {
                    if (x.length > 4) {
                        this.$Message.error('备品备件数最多为四位数!');
                    }
                }
                else {
                    this.$Message.error('备品备件数为正整数!');
                }
                ;
                this.sparePartsSelected[item].number=x;
            },

            //kp--备品备件相关--结束
            //kp---适用设备--动态获取组件每次进行添加或删除操作后的数据---开始
            dataSelectedDisa(messagea){
                {
                    //接收传回到页面的已选择数据,赋值给变量：
                    this.treeSiteDataSelected = messagea;
                }
            },
            //kp---适用设备--动态获取组件每次进行添加或删除操作后的数据---结束

//            kp---地点设备列表，树图初始化  --开始:
            toSearch_equment() {
                let vt = this;
                this.$axios.get('/eamStandardSolution/location/getPartTree', {
                    params: {
                        modelId: vt.workForm.equId,
                        manufacturer: vt.workForm.supply,
                    }
                }).then((response) => {




                    let code = response.data.response.code;
                    if (code != 1) {
                        vt.$Message.error(response.data.response.msg);

                    }
                    else {
                        vt.treeSiteData = response.data.response.data;
                        if (!vt.treeSiteData[0].title) {
                            vt.treeTip = "暂无数据";
                        }
                        else {
                            vt.treeTip = "";
                        }
                        ;
                    }
                }).catch((err) => {
                });
            },
//            kp---地点设备列表，树图初始化  --结束:

            /*上传图片*/
            /*handleView (name) {
             this.imgName = name;
             this.visible = true;
             },
             handleRemove (file) {
             // 从 upload 实例删除数据
             const fileList = this.$refs.upload.fileList;
             this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
             },
             handleSuccess (res, file) {
             // 因为上传过程为实例，这里模拟添加 url
             file.url = '../../../static/img';
             file.name = 'standard';
             },*/
            handleBeforeUpload(file) {
                // 创建一个 FileReader 对象
                let reader = new FileReader()
                // readAsDataURL 方法用于读取指定 Blob 或 File 的内容
                // 当读操作完成，readyState 变为 DONE，loadend 被触发，此时 result 属性包含数据：URL（以 base64 编码的字符串表示文件的数据）
                // 读取文件作为 URL 可访问地址
                reader.readAsDataURL(file)

                const _this = this
                reader.onloadend = function (e) {
                    file.url = reader.result
                    _this.new_data1.uploadList.push(file)
                }
                console.log(reader.result)
            },
            handleView (name) {
                this.imgName = name;
                this.visible = true;
            },
//          handleRemove(file) {
//              this.new_data1.uploadList.splice(this.new_data1.uploadList.indexOf(file), 1)
//          },
            handleFormatError(file) {
                this.$Notice.warning({
                    title: '文件格式不正确',
                    desc: '文件 ' + file.name + ' 格式不正确，请上传 jpg 或 png 格式的图片。'
                })
            },
            handleMaxSize(file) {
                this.$Notice.warning({
                    title: '超出文件大小限制',
                    desc: '文件 ' + file.name + ' 太大，不能超过 2M。'
                })
            },
            /*上传图片end*/
            /*穿梭框*/
            getMockData () {
                let mockData = [];
                for (let i = 1; i <= 10; i++) {
                    mockData.push({
                        key: i.toString(),
                        label: '分类' + i,
                        description: '分类' + i + '的设备'
                    });
                }
                return mockData;
            },
            getTargetKeys () {
                return this.getMockData()
                    .filter(() => Math.random() * 2 > 1)
                    .map(item => item.key);
            },
            handleChange4 (targetKeys) {
                this.equipment_chk_targetKeys = targetKeys;
            },
            render (item) {
                return item.label + ' - ' + item.description;
            },
            /*穿梭框*/


//          aboutStation(val){
//              if(val == "0"){
//              	this.standard = '0'
//              }
//              else{
//              	this.standard = '1'
//              }
//
//          },


            popMaterial: function (index) {
                this.tpmStandardSolutionIndex = index;
                this.material_code = true;
            },
            saveSolution: function () {
                if (this.tpmStandardSolutionInhibitionRepeat === true) {
                    this.$Message.warning("标准方案版本重复！");//TODO
                    return;
                }

                for (let o in this.tpmStandardSolutionInhibitionTmp) {
                    if (this.tpmStandardSolutionInhibitionTmp[o].version == '') {
                        this.$Message.warning("请选择具体方案版本号之后在增加版本！");
                        return;
                    }
                }

                let isDeFaultVersion = this.workForm.isDefaultVersion;
                if (isDeFaultVersion == true) {
                    isDeFaultVersion = 0;
                } else {
                    isDeFaultVersion = 1;
                }

                let needShutdown = this.workForm.needShutdown;
                if (needShutdown == true) {
                    needShutdown = 0;
                } else {
                    needShutdown = 1;
                }

                console.log(this.tpmStandardSolutionActionTmp);
                var tpmStandardSolutionVersion = [{
                    "endTime": this.workForm.endTime,
                    "needShutdown": needShutdown,
                    "isDefaultVersion": isDeFaultVersion,
                    "requiredTime": this.workForm.requiredTime,
                    "startTime": this.workForm.startTime,
                    "version": parseInt(this.workForm.version),
                    "remark": this.workForm.note
                }];

                var tss = {
                    "code": this.workForm.code,
                    "locationId": 22222,
                    "locationType": 0,
                    "name": this.workForm.name,
                    "tpmStandardSolutionActionTmp": this.tpmStandardSolutionActionTmp,
                    "tpmStandardSolutionDeptTmp": this.tpmStandardSolutionDeptTmp,
                    "tpmStandardSolutionEquipmentTmp": this.tpmStandardSolutionEquipmentTmp,
                    "tpmStandardSolutionInhibitionTmp": this.tpmStandardSolutionInhibitionTmp,
                    "tpmStandardSolutionMaterialTmp": this.tpmStandardSolutionMaterialTmp,
                    "tpmStandardSolutionVersion": tpmStandardSolutionVersion,
                }
                let vm = this;
                console.log(JSON.stringify(tss.tpmStandardSolutionMaterialTmp));
                if (this.$fc.iSubmit(this))
                    this.$axios.post('tpmStandardSolution/saveTpmProgram', tss).then((res) => {
                        let ret = res.data.response.data.ret;
                        if (ret == "success") {
                            this.load_fix = true;
                            this.load_fix_info = '保存中，请稍候......';
                            setTimeout(function () {
                                vm.$router.push({path: '/standardwork'});
                            }, 1000);
                        } else {
                            this.$Message.warning("保存失败");
                            vm.isubmit = false;
                        }
                    }).catch((err) => {
                        vm.isubmit = false;
                        console.log(err);
                    });
            },

            getMaterialTyep: function () {
                let vmm = this;
                this.$axios.get('tpmStandardSolution/getMaterialType').then(function (response) {
                    console.log(response.data.response.data);
                    vmm.materialType = response.data.response.data;
                })
            },
            selectType: function (value) {
                let vm = this;
                vm.tmp_typeId = value;
                this.getMaterial(1, value);
            },
            addTpmStandardSolutionAction: function () {
                if (this.tpmStandardSolutionActionTmp.length < 50) {
                    this.tpmStandardSolutionActionTmp.push(this.$fc.cloneKey(this.new_data1));
                }
                else {
                    this.$Message.error('添加项目过多');
                    this.btnDis = true;
                }

                // 添加完newPerson对象后，重置newPerson对象
            },
            addData2: function () {
                this.tpmStandardSolutionMaterialTmp.push(this.$fc.cloneKey(this.n_data2));
                // 添加完newPerson对象后，重置newPerson对象
            },
            addData3: function () {
                this.data3.push(this.$fc.cloneKey(this.new_data3));
                // 添加完newPerson对象后，重置newPerson对象
            },
            addData4: function () {
                this.data4.push(this.$fc.cloneKey(this.new_data4));
                // 添加完newPerson对象后，重置newPerson对象
            },
            addTpmStandardSolutionInhibitionTmp: function () {
                for (let o in this.tpmStandardSolutionInhibitionTmp) {
                    if (this.tpmStandardSolutionInhibitionRepeat === true) {
                        this.$Message.warning("版本号重复！");
                        return;
                    }
                    if (this.tpmStandardSolutionInhibitionTmp[o].version == '') {
                        this.$Message.warning("请选择具体方案版本号之后在增加版本！");
                        return;
                    }
                }
                this.tpmStandardSolutionInhibitionTmp.push(this.$fc.cloneKey(this.new_tpmStandardSolutionInhibitionTmp));
                // 添加完newPerson对象后，重置newPerson对象
            },
            addTpmStandardSolutionDeptTmp: function () {
                this.tpmStandardSolutionDeptTmp.push(this.$fc.cloneKey(this.new_tpmStandardSolutionDeptTmp));
                // 添加完newPerson对象后，重置newPerson对象
            },
            addTpmStandardSolutionEquipmentTmp: function () {
                this.tpmStandardSolutionEquipmentTmp.push(this.$fc.cloneKey(this.new_tpmStandardSolutionEquipmentTmp));
                // 添加完对象后，重置对象
            },
            saveClickHandler(){
                console.log(this.workForm);
            },

            //分页
            changeMaterial: function (current) {
                let vm = this;
                var value = vm.tmp_typeId;
                this.getMaterial(current, value);
            },

            getMaterial: function (current, value) {
                let vm = this;
                if (value == undefined) {
                    value = vm.tmp_typeId;
                }
                if (current == undefined) {
                    current = 1;
                }
                this.$axios.get('tpmStandardSolution/bdMaterial', {
                    params: {
                        cur: current,
                        size: vm.size,
                        value: value
                    }
                }).then(function (response) {
                    //      vm.materialList = response.data.response.data;

                    var array = new Array();
                    if (response.data.response.data.length != 0) {
                        let tmp = response.data.response.data;
                        console.log(tmp);
                        vm.numMaterial = tmp[0].numMaterial;
                        for (var i in tmp) {
                            if (i != "unique") {
                                //       var index = tmp[i].index;
                                var materialId = tmp[i].materialId;
                                var innerhtml = '<input type="radio" name="materialId" value="' + materialId + '"/>'
                                var materialCode = tmp[i].materialCode;
                                var materialName = tmp[i].materialName;
                                var modelType = tmp[i].modelType;
                                var materialUnit = tmp[i].materialUnit;
                                var materialTypeId = tmp[i].materialTypeId;

                                var tmpMaterial = {
                                    //  "index": index,
                                    "materialId": parseInt(materialId),
                                    "innerhtml": innerhtml,
                                    "materialCode": materialCode,
                                    "materialName": materialName,
                                    "modelType": modelType,
                                    "materialUnit": materialUnit,
                                    "materialTypeId": parseInt(materialTypeId),
                                }
                                array.push(tmpMaterial);
                            }

                        }
                    } else {
                        vm.numMaterial = 0;
                    }
                    vm.materialList = array;

                })
            },
            //备品备件弹出框选择
            selectMaterial: function (selection) {
                if (selection[0]) {
                    this.tmp.tpmMaterialId = selection[0].materialId;
                    console.log(selection[0].materialId);
                    this.tmp.tpmMaterialCode = selection[0].materialCode;
                    this.tmp.tpmMaterialName = selection[0].materialName;
                    this.tmp.tpmModelType = selection[0].modelType;
                    this.tmp.tpmMaterialUnit = selection[0].materialUnit;
                    console.log("select checkbox 1st equipment dropdown ssid: " + this.tmp.tpmMaterialId);
                }
            },
            chooseMaterial: function () {
                let vm = this;                  //全局变量
                var tmp = vm.materialList       //弹出框中查询出的所有数据
                let msg = this.$Message;
                let materialId = $(".materialS").find("input[type='radio']:checked").val();  //选择的radio框的那条数据的id

                point: for (var i in tmp) {
                    if (tmp[i].materialId == materialId) {    //判断查询出的所有数据的id是否包括你选的数据的id
                        for (var k in this.tpmStandardSolutionMaterialTmp) {       //tpmStandardSolutionMaterialTmp是要渲染到页面的数据的数组
                            if (("" + this.tpmStandardSolutionMaterialTmp[k].materialId).indexOf(materialId) == 0) {  //判断数组里是否已经存在你选择的id
//                                     if(this.tpmStandardSolutionMaterialTmp[k].materialId.indexOf(materialId) == 0){   //判断数组里是否已经存在你选择的id
                                msg.warning("不要重复选择同一条数据!");
                                break point;       //存在跳出标记点（所有循环）
                            } else {
                                continue;          //不存在就继续遍历数组所有的数据继续比对
                            }
                        }                                   //循环结束后，没有匹配到，则继续执行以下代码，进行新增
                        this.tpmStandardSolutionMaterialTmp[this.tpmStandardSolutionIndex].materialId = materialId;
                        this.tpmStandardSolutionMaterialTmp[this.tpmStandardSolutionIndex].materialCode = tmp[i].materialCode;
                        this.tpmStandardSolutionMaterialTmp[this.tpmStandardSolutionIndex].materialName = tmp[i].materialName;
                        this.tpmStandardSolutionMaterialTmp[this.tpmStandardSolutionIndex].materialUnit = tmp[i].materialUnit;
                        this.tpmStandardSolutionMaterialTmp[this.tpmStandardSolutionIndex].materialTypeId = parseInt(tmp[i].materialTypeId);
                    }
                    console.log();
                }

            },
            removeTpmStandardSolutionAction: function (index) {
                // 删一个数组元素
                this.tpmStandardSolutionActionTmp.splice(index, 1);
            },
            removeData2: function (index) {
                // 删一个数组元素
                this.tpmStandardSolutionMaterialTmp.splice(index, 1);
            },
            removeData3: function (index) {
                // 删一个数组元素
                this.data3.splice(index, 1);
            },
            removeData4: function (index) {
                // 删一个数组元素
                this.data4.splice(index, 1);
            },
            //             form表单验证
            handleSubmit(name) {
//                let blankOrNot;
                let blankTitle = new Array();
                let emptyTitle = new Array();
                $(".checkTab").each(function () {
                    if ($(this).find("input").length == 0) {
                        let index = $(this).index();
                        switch (index) {
                            case 0:
                                emptyTitle.push('作业项目');
                                break;
                            case 1:
                                emptyTitle.push('备品备件需求');
                                break;
                                /*case 2:
                                 emptyTitle.push('人员需求');
                                 break;*/
                            case 2:
                                emptyTitle.push('适用设备');
                                break;
                        }
                    }
                })
                $(".checkTab input").each(function () {
                    if ($(this).hasClass("ivu-input-number-input")) {
                        if ($(this).val()) {
                            $(this).val(Math.ceil($(this).val()));
                        }
                    }
                    if (!$(this).val()) {
                        let index = $(this).parents(".checkTab").index();
                        switch (index) {
                            case 0:
                                blankTitle.push('作业项目');
                                break;
                            case 1:
                                blankTitle.push('备品备件需求');
                                break;
                                /*case 2:
                                 blankTitle.push('人员需求');
                                 break;*/
                            case 2:
                                blankTitle.push('适用设备');
                                break;
                                /* case 4:
                                 blankTitle.push('抑制作业');
                                 break;*/
                        }
                    }
                });
                Array.prototype.unique = function () {
                    var res = [];
                    var json = {};
                    for (var i = 0; i < this.length; i++) {
                        if (!json[this[i]]) {
                            res.push(this[i]);
                            json[this[i]] = 1;
                        }
                    }
                    return res;
                };
                let eT = new Date(this.workForm.endTime).getTime();
                let sT = new Date(this.workForm.startTime).getTime();
                this.$refs[name].validate((valid) => {
                    if (!valid) {
                        this.$Message.error('请完善新增方案信息!');
                    } else if (eT <= sT) {
                        this.$Message.error('停用时间不能在启用时间之前，请重新选择');
                    } else if (emptyTitle.length > 0) {
                        this.$Message.error(emptyTitle + ' 表格中至少需要一条数据，请完善!');
                    } else if (blankTitle.length > 0) {
                        this.$Message.error(blankTitle.unique() + ' 的表格中存在未填数据，请完善!');
                    } else {
                        this.save_plan = true;
                    }
                })
            },
            //            检查数字输入框正整数
            checkInt: function (val) {
//          	console.log(val)
                if (!Number.isInteger(val)) {
                    this.workForm.requiredTime = 0;
                    this.$Message.error('请输入整数!');
                }
                else if (val >= 9999) {
                    this.$Message.error('预计时间不能超过9999');
                }
            },
            checkInt2: function (val) {
                if (isNaN(val)) {
                    this.$Message.error('请输入数字!');
                }
                else if( !Number.isInteger(Number(val)) || Number(val)<=0 ){
                    this.$Message.error('请输入大于0的正整数!');
                }
                if(val.length>=4){
                    this.$Message.error('标准工时不能超过9999');
                }
            },
            //              日历时间判断
            checkStartTime: function (sT) {
                let eT = new Date(this.workForm.endTime).getTime();
                sT = new Date(sT).getTime()
                if (eT <= sT) {
                    this.$Message.error('停用时间不能在启用时间之前，请重新选择');
                }
            },
            checkEndTime: function (eT) {
                let sT = new Date(this.workForm.startTime).getTime();
                eT = new Date(eT).getTime()
                if (eT <= sT) {
                    this.$Message.error('停用时间不能在启用时间之前，请重新选择');
                }
            },
            /************************************* 抑制方案放大镜 start *********************************************************** */
            removeTpmStandardSolutionInhibitionTmp: function (index) {
                this.tpmStandardSolutionInhibitionRepeat = false;
                this.tpmStandardSolutionInhibitionTmp.splice(index, 1);
            },
            ssInhibitionIndex: function (index) {
                this.tpmStandardSolutionIndex = index;
                this.standard_code = true;
//                console.log("index: "+ this.tpmStandardSolutionIndex);
            },
            checkSSVersion: function (index, version, conflictSolutionId) {
                this.tpmStandardSolutionInhibitionRepeat = false;
                for (let o in this.tpmStandardSolutionInhibitionTmp) {
                    if (o != index) {
                        if (this.tpmStandardSolutionInhibitionTmp[o].conflictSolutionId == conflictSolutionId
                            && this.tpmStandardSolutionInhibitionTmp[o].version == version) {
                            this.$Message.warning("版本号重复，请重新选择版本号！");
                            this.tpmStandardSolutionInhibitionRepeat = true;
                            return;
                        }
                    }
                }
            },
            initTpmss: function (page) {
                let vm = this;
                this.$axios.get('tpmStandardSolution/getAllSolution', {
                    params: {
                        page: page,
                    }
                }).then((res) => {
                    let dataRes = res.data.response.data;
                    vm.tpmssTotal = dataRes.Total;
                    vm.tpmss = new Array();
                    for (let o in dataRes.Rows) {
                        if (o != "unique") {
                            let obj = {};
                            obj["id"] = dataRes.Rows[o]["id"];
                            obj["code"] = dataRes.Rows[o]["code"];
                            obj["name"] = dataRes.Rows[o]["name"];
                            obj["radio"] = "<input type='radio' name='tpmss_radio' value='" + dataRes.Rows[o]["id"] + "'>";
                            vm.tpmss.push(obj);
                        }
                    }
                }).catch((err) => {
                    console.log(err);
                });
            },
            selectSs: function () {
                let tpmssId = this.$jq("input[name='tpmss_radio']:checked").val();
                let index = this.$fc.arrIndexOfObj("id", tpmssId, this.tpmss);
                if (index !== -1) {
                    let vm = this;
                    this.$axios.get('tpmStandardSolution/v/' + vm.tpmss[index].id).then((res) => {

                        let dataRes = res.data.response.data;
                        vm.tpmStandardSolutionInhibitionTmp[vm.tpmStandardSolutionIndex].ssv = new Array();
                        vm.tpmStandardSolutionInhibitionTmp[vm.tpmStandardSolutionIndex].conflictSolutionId = vm.tpmss[index].id;
                        vm.tpmStandardSolutionInhibitionTmp[vm.tpmStandardSolutionIndex].code = vm.tpmss[index].code;
                        vm.tpmStandardSolutionInhibitionTmp[vm.tpmStandardSolutionIndex].name = vm.tpmss[index].name;
                        for (let o in dataRes) {
                            let obj = {};
                            obj["ssvId"] = dataRes[o]["id"];
                            obj["isDefaultVersion"] = dataRes[o]["isDefaultVersion"];
                            obj["version"] = dataRes[o]["version"];
                            vm.tpmStandardSolutionInhibitionTmp[vm.tpmStandardSolutionIndex].ssv.push(obj);
                        }
                    }).catch((err) => {
                        console.log(err);
                    });
                }
            },
            /************************************* 抑制方案放大镜 end *********************************************************** */

            /************************************* 人员班组放大镜 start *********************************************************** */
            removeTpmStandardSolutionDeptTmp: function (index) {
                this.tpmStandardSolutionDeptTmp.splice(index, 1);
            },
            ssDepartmentIndex: function (index) {
                this.tpmStandardSolutionIndex = index;
                this.department_code = true;
            },
            initTpmDept: function (page) {
                let vm = this;
                this.$axios.get('tpmStandardSolution/bdShift', {
                    params: {
                        page: page,
                    }
                }).then((res) => {
                    let dataRes = res.data.response.data;
                    console.log(dataRes.Rows);
                    vm.tpmDeptTotal = dataRes.Total;
                    vm.tpmDept = new Array();
                    for (let o in dataRes.Rows) {
                        if (o != "unique") {
                            let obj = {};
                            obj["id"] = dataRes.Rows[o].teamId;
                            obj["code"] = dataRes.Rows[o].teamCode;
                            obj["name"] = dataRes.Rows[o].teamName;
                            obj["radio"] = "<input type='radio' name='tpmdept_radio' value='" + dataRes.Rows[o].teamId + "'>";
                            vm.tpmDept.push(obj);
                        }
                    }
                }).catch((err) => {
                    console.log(err);
                });
            },
            selectDept: function () {
                let tpmDeptId = this.$jq("input[name='tpmdept_radio']:checked").val();
                let index = this.$fc.arrIndexOfObj("id", tpmDeptId, this.tpmDept);
                console.log(index);
                if (index !== -1) {
                    this.tpmStandardSolutionDeptTmp[this.tpmStandardSolutionIndex].name = this.tpmDept[index].name;
                    this.tpmStandardSolutionDeptTmp[this.tpmStandardSolutionIndex].code = this.tpmDept[index].code;
                    this.tpmStandardSolutionDeptTmp[this.tpmStandardSolutionIndex].teamId = tpmDeptId;
                }
            },
            /************************************* 人员班组放大镜 end *********************************************************** */


            /************************************* 适用设备 start *********************************************************** */
            removeTpmStandardSolutionEquipmentTmp: function (index) {
                this.tpmStandardSolutionEquipmentTmp.splice(index, 1);
            },
            /*给放大镜定下标*/
            sbEquipmentIndex: function (index) {
                this.tpmStandardSolutionIndex = index;
                this.equipment_code = true;

            },
            /*初始化地点得树结构*/
            getLocationTree: function () {
                let vm = this;
                this.$axios.post("tpmStandardSolution/getLocationTree").then(function (response) {
                    var object = response.data.response.data;
                    vm.baseData = object;
                });
            },
            /*点击树节点得分子节点 通过树节点ID  获取设备*/
            getLocationId (node){
                if (node[0]) {
                    console.log("Location名称是" + node[0].title + "-----" + "对应的id--code是" + node[0].locationId);
                    this.locationId = node[0].locationId;
                    this.getEquipmnet(0, this.locationId);
                }
            },
            /*table页面获取选中行的数据*/
            selectSb: function () {
                let tpmsbId = this.$jq("input[name='tpmsb_radio']:checked").val();
                let index = this.$fc.arrIndexOfObj("equipmentId", tpmsbId, this.tpmsb);
                if (index !== -1) {
                    console.log("xxxxxxxxxxxxxxxxx = " + this.tpmsb);
                    let vm = this;
                    let tpmsb = this.tpmsb;
                    point: for (var i in tpmsb) {
                        if (tpmsb[i].equipmentId == tpmsbId) {    //判断查询出的所有数据的id是否包括你选的数据的id
                            for (var k in vm.tpmStandardSolutionEquipmentTmp) {       //vm.tpmStandardSolutionEquipmentTmp是要渲染到页面的数据的数组
                                if (("" + vm.tpmStandardSolutionEquipmentTmp[k].equipmentId).indexOf(tpmsbId) == 0) {  //判断数组里是否已经存在你选择的id
                                    this.$Message.warning("不能重复选择同一款设备");
                                    break point;       //存在跳出标记点（所有循环）
                                } else {
                                    continue;          //不存在就继续遍历数组所有的数据继续比对
                                }
                            }    //循环结束后，没有匹配到，则继续执行以下代码，进行新增
                            vm.tpmStandardSolutionEquipmentTmp[vm.tpmStandardSolutionIndex].equipmentId = tpmsbId;
                            vm.tpmStandardSolutionEquipmentTmp[vm.tpmStandardSolutionIndex].equipmentCode = this.tpmsb[index].equipmentCode;
                            vm.tpmStandardSolutionEquipmentTmp[vm.tpmStandardSolutionIndex].equipmentName = this.tpmsb[index].equipmentName;
                        }
                        console.log();
                    }
                }

            },

            getEquipmnet: function (currentPage, locationId) {
                let vm = this;
                if (locationId == undefined) {
                    locationId = vm.locationId;
                }
                let flg = false;
                if (currentPage == undefined) {
                    currentPage = 1;
                }
                if (currentPage == 0) {
                    flg = true;
                    currentPage = 1;
                }
                this.$axios.post('tpmStandardSolution/getEquipments/n', {
                    page: currentPage,
                    bdLocationId: locationId,
                }).then((res) => {
                    if (res.data.response.code == 1) {
                        let dataRes = res.data.response.data;
                        vm.tpmsbTotal = dataRes.Total;
                        console.log("total: " + vm.tpmsbTotal);
                        vm.tpmsb = new Array();
                        for (let o in dataRes.Rows) {
                            if (o != "unique") {
                                let obj = {};
                                obj["equipmentId"] = dataRes.Rows[o]["equipmentId"];
                                obj["equipmentCode"] = dataRes.Rows[o]["equipmentCode"];
                                obj["equipmentName"] = dataRes.Rows[o]["equipmentName"];
                                obj["radio"] = "<input type='radio' name='tpmsb_radio' value='" + dataRes.Rows[o]["equipmentId"] + "'>";
                                vm.tpmsb.push(obj);
                            }
                        }
                        if (flg) {
                            vm.tpmsbCurrent = 1;
                        }
                    }
                }).catch((err) => {
                    console.log(err);
                });
            },
            /*分页*/
            changeEquipment: function (currentPage) {
                this.tpmsbCurrent = currentPage;
                this.getEquipmnet(currentPage, this.locationId);
            },


            /*设备选择*/
            selectEquipment: function () {
                let str = new String
                for (let val of this.equipment_chk_targetKeys) {
                    str = str + val + '/'
                }
                this.EquipmentTmp.equipment_chk_val = str.substring(0, str.length - 1)
            },

            /************************************* 适用设备 end *********************************************************** */

            initWorkForm: function () {
                this.$axios.post('/eamStandardSolution/initSolution').then((res) => {
                    console.log(res.data.response)
                    if (res.data.response.code == 1) {
                        this.workForm.code = res.data.response.data.code;
                        this.workForm.version = res.data.response.data.version;
                    }
                }).catch((err) => {
                    console.log(err);
                });
            },
            //执行岗位
            executive(type){
//          	console.log(this.workForm.standardType)
                this.$axios.post('/eamStandardSolution/getPostByType', {type: type}).then((res) => {
//              	console.log(res.data.response);
                    var ret = res.data.response
                    if (ret.code == 1) {
                        this.workForm.station_a = ret.data;
                        this.workForm.stationId = this.workForm.station_a[0].id
                    }
                }).catch((err) => {
                    console.log(err);
                });
            },
            aboutStation(d){
                this.executive(d);
            },


            /********上传图片 xulin**********/
            handleSuccess(response, file, fileList){
                console.log(response, file, fileList)
            },
            handleFormatError(file) {
                this.$Notice.warning({
                    title: '文件格式不正确',
                    desc: '文件 ' + file.name + ' 格式不正确，请上传 jpg 或 png 格式的图片。'
                })
            },
            upSuccess: function (fileName, savePath) {
                console.log(fileName + " 上传完成了.地址： " + savePath);
                this.savePath = savePath;
                var format = fileName.split('.')[1];
                format = format == 'jpg' ? 0 : format == 'jpeg' ? 1 : format == 'png' ? 2 : format == 'gif' ? 3 : 4;
//          	console.log(format + '图片格式');
//              this.tpmStandardSolutionActionTmp[0]['url'] = 'http://192.168.40.21:8888/static/' + savePath;
//				this.$set( this.tpmStandardSolutionActionTmp[0],'url', "../static/" + savePath )
                this.$set(this.tpmStandardSolutionActionTmp[this.onlyindex], 'url', savePath);
                this.$set(this.tpmStandardSolutionActionTmp[this.onlyindex], 'picname', fileName);
                this.$set(this.tpmStandardSolutionActionTmp[this.onlyindex], 'picformat', format)

            },
            getIndex(index){
                console.log(index);
                this.onlyindex = index;
            },
            handleView (url) {
//              this.imgName = name;
                this.imgUrl = '../static/' + url;
                this.visible = true;
            },
            handleRemove(index, u) {            	
                delete this.tpmStandardSolutionActionTmp[index].url;
                this.tpmStandardSolutionActionTmp[index].picname = '';
                this.handleView(u);
                this.visible = false;
            },

            /********上传图片 xulin end**********/

            /********设备型号 所属供应商 xulin**********/
            deviceType(){
                this.$axios.get('/eamStandardSolution/equipment/modelList', {
                    params: {
                        page: this.typePage,
                        pageSize: 5
                    }
                }).then((res) => {
                    console.log(res.data.response);
                    var ret = res.data.response
                    if (ret.code == 1) {
                        this.deviceTypeList = ret.data.Rows;
                        this.totalNum = ret.data.Total
                    }
                }).catch((err) => {
                    console.log(err);
                });
            },
            pageChange(page){
                this.typePage = page;
                $(".typedevice").find("input[type='radio']:checked").prop('checked', false);
                this.deviceType();
            },
            deviceSelected(){
                var deviceId = $(".typedevice").find("input[type='radio']:checked").val();
                console.log(deviceId);
                this.workForm.equId = deviceId;
                for (var i in this.deviceTypeList) {
                    if (this.deviceTypeList[i].modelId == deviceId) {
                        this.workForm.equ_type = this.deviceTypeList[i].modelName;
                    }
                }
                ;
                this.workForm.supply = '';
                $(".supply").find("input[type='radio']:checked").prop('checked', false);
                //---kp---监听供应商和所属设备改变的事件--start
                if (this.workForm.equId && this.workForm.supply) {
                    this.toSearch_equment();
                    this.sparePartsSelected = [];
                    this.spareParts_display = [];
                    this.treeSiteDataSelected = [];
                }
                else {
                    if (!this.workForm.equId) {
                        this.treeTip = "请选择设备型号";
                        this.treeSiteData = [];
                        this.treeSiteDataSelected = [];
                        this.sparePartsSelected = [];
                        this.spareParts_display = [];
                    }
                    else if (!this.workForm.supply) {

                        this.treeTip = "请选择所属供应商！";
                        this.treeSiteData = [];
                        this.treeSiteDataSelected = [];
                        this.sparePartsSelected = [];
                        this.spareParts_display = [];
//                        this.tipMessage = "请选择所属供应商！"
                    }
                }
                ;
                //---kp---监听供应商和所属设备改变的事件---end

            },
            //所属供应商
            openSup(){
                this.supply = true;
                this.supplier();
            },
            supplier(){
                this.$axios.get('/eamStandardSolution/getEquipmentList', {
                    params: {
                        page: this.supplyPage,
                        pageSize: 5,
                        modelId: this.workForm.equId
                    }
                }).then((res) => {
                    console.log(res.data.response);
                    var ret = res.data.response
                    if (ret.code == 1) {
                        this.supplierList = ret.data.rows;
                        this.supplyTotal = ret.data.Total
                    }
                }).catch((err) => {
                    console.log(err);
                });
            },
            supplyChange(page){
                this.supplyPage = page;
                $(".supply").find("input[type='radio']:checked").prop('checked', false);
                this.supplier();
            },
            supplySelected(){
                var sid = $(".supply").find("input[type='radio']:checked").val();
                this.workForm.supply = sid;

                //---kp---监听供应商和所属设备改变的事件--start
                if (this.workForm.equId && this.workForm.supply) {
                    this.toSearch_equment();
                    this.sparePartsSelected = [];
                    this.spareParts_display = [];
                    this.treeSiteDataSelected = [];
                    this.treeTip = "";
                }
                else {

                    if (!this.workForm.equId) {
                        this.treeTip = "请选择设备型号";
                        this.treeSiteData = [];
                        this.sparePartsSelected = [];
                        this.spareParts_display = [];
                        this.treeSiteDataSelected = [];
                    }
                    else if (!this.workForm.supply) {
                        this.treeTip = "请选择所属供应商！";
                        this.treeSiteData = [];
                        this.sparePartsSelected = [];
                        this.spareParts_display = [];
                        this.treeSiteDataSelected = [];
                    }
                }
                ;
                //---kp---监听供应商和所属设备改变的事件---end
            },
            /********设备型号 所属供应商 end xulin**********/

            /********生效 xulin**********/
            submit(name, id){
//         		console.log(this.workForm.version);
                this.submitId = id;
                this.promptModal = true;
                this.$refs[name].validate((valid) => {
                    var tpm = this.tpmStandardSolutionActionTmp;
                    //键盘空格键判断
                    var re = /^[ ]+$/;
                    if (!valid) {
                        this.$Message.error('请完善新增方案信息');
                        this.promptModal = false;
                    }
                    else if (tpm.length == 0) {
                        this.$Message.error('请添加作业项目');
                        this.promptModal = false;
                    }
                    else if (this.treeSiteDataSelected.length == 0) {
                        this.$Message.error('请添加适用设备');
                        this.promptModal = false;
                    }
                    if (tpm.length != 0) {
                        var sum = 0;
                        for (var i in tpm) {
                            sum = sum + Number(tpm[i].requiredTime);
                            console.log(sum)
                            if (tpm[i].content == '' || re.test(tpm[i].content)) {
                                this.$Message.error('请完善作业项目信息');
                                this.promptModal = false;
                            }
                            else if( (!Number.isInteger( Number(tpm[i].requiredTime) )&&tpm[i].requiredTime!=''&&tpm[i].requiredTime!=null)||(tpm[i].requiredTime<=0&&tpm[i].requiredTime!=''&&tpm[i].requiredTime!=null)){
                                this.$Message.error('标准工时请输入大于0的正整数');
                                this.promptModal = false;
                            }
                            else if (sum > this.workForm.requiredTime) {
                                this.$Message.error('标准工时的总和不能超过预计工时');
                                this.promptModal = false;
                            }
                        }
                    }
                    if (this.spareParts_display.length > 0) {
                        for (var i in this.spareParts_display) {
                            var num = Number(this.spareParts_display[i].number)
                            if (!Number.isInteger(num)) {
                                this.$Message.error('备品备件数为正整数');
                                this.promptModal = false;
                            }
                            if (num == '' || re.test(num)) {
                                this.$Message.error('备品备件数不能为空');
                                this.promptModal = false;
                            }
                            if (num >= 9999) {
                                this.$Message.error('备品备件数不能超过9999');
                                this.promptModal = false;
                            }
                        }
                    }


                })

            },
            getSave(status){

                this.modal_loading = true;
                this.promptModal = false;

                //作业项目
                var actionArr = [];
                var action = {};
                if (this.tpmStandardSolutionActionTmp.length == 0) {
                    actionArr = []
                }
                else {
                    for (var i in this.tpmStandardSolutionActionTmp) {
                        if (this.tpmStandardSolutionActionTmp[i].picname == '' || !this.tpmStandardSolutionActionTmp[i].picname) {
                            action = {
                                'no': Number(i) + 1,
                                'content': this.tpmStandardSolutionActionTmp[i].content,
                                'requirement': this.tpmStandardSolutionActionTmp[i].requirement,
                                'required_time': this.tpmStandardSolutionActionTmp[i].requiredTime == null ? '' : this.tpmStandardSolutionActionTmp[i].requiredTime,
                                'pic': []
                            }
                        }
                        else {
                            action = {
                                'no': Number(i) + 1,
                                'content': this.tpmStandardSolutionActionTmp[i].content,
                                'requirement': this.tpmStandardSolutionActionTmp[i].requirement,
                                'required_time': this.tpmStandardSolutionActionTmp[i].requiredTime == null ? '' : this.tpmStandardSolutionActionTmp[i].requiredTime,
                                'pic': [
                                    {
                                        'pic_name': this.tpmStandardSolutionActionTmp[i].picname,
                                        'pic_format': this.tpmStandardSolutionActionTmp[i].picformat,
                                        'pic_url': this.tpmStandardSolutionActionTmp[i].url
                                    },
                                ]
                            }
                        }
                        actionArr.push(action);
                    }
                }

//         		console.log(actionArr)
                //备品备件
                var spareArr = [];
                var spare = {}
                if (this.spareParts_display.length == 0) {
                    spareArr = []
                }
                else {
                    for (var i in this.spareParts_display) {
                        spare = {
                            'no': Number(i) + 1,
                            'spare_part_id': this.spareParts_display[i].id,//kp,
                            'num': this.spareParts_display[i].number,//kp
                            'unit': this.spareParts_display[i].bdUom.name,//kp
                        }
                        spareArr.push(spare)
                    }
                }

//         		console.log(spareArr)
                //适用设备
                var equ = {};
                var equArr = [];
                if (this.treeSiteDataSelected.length == 0) {
                    equArr = []
                }
                else {
                    for (var i in this.treeSiteDataSelected) {
                        equ = {
                            'no': Number(i) + 1,
                            'equ_id': this.treeSiteDataSelected[i].id,
                            'name': this.treeSiteDataSelected[i].title
                        }
                        equArr.push(equ)
                    }
                }

                console.log(equArr);
                var data = {
                    standard_solution_id: "",         // 新建传空字符串，编辑传该方案的id.
                    code: this.workForm.code,
                    name: this.workForm.name,
                    version: this.workForm.version,
                    status: status,			// 保存草稿：0         生效：1
                    is_default: this.workForm.isDefaultVersion == true ? 0 : 1,
                    is_halt: this.workForm.needShutdown == true ? 0 : 1,
                    type: this.workForm.standardType,
                    per_time: this.workForm.requiredTime,
                    start_time: "2017-11-11 11:11:11",
                    end_time: "2017-11-11 11:11:11",
                    role: this.workForm.stationId,
                    remark: this.workForm.note,
                    action: actionArr,
                    spare: spareArr,
                    equ: equArr,
                }
                console.log(data)

                this.$axios.post('/eamStandardSolution/saveStandardSolution', {standardSolutionData: JSON.stringify(data)}).then((res) => {
                    console.log(res.data.response);
                    var ret = res.data.response;
                    if (ret.code == 1) {
                        this.$Message.success('操作成功');
                        history.back(-1);
                    }
                    else {
                        this.$Message.error(ret.msg)
                    }
                    setTimeout(() => {
                        this.modal_loading = false;
                    }, 500);

                }).catch((err) => {
                    console.log(err);
                });


            },
            change(i){
//          	console.log(i.length);
                if (i.length >= 100) {
                    this.$Message.error('字数不能超过100')
                }
            },
            lengthChange(i){
                if (i.length >= 20) {
                    this.$Message.error('字数不能超过20')
                }
            },
            remarkChange(i){
                if (i.length >= 1000) {
                    this.$Message.error('字数不能超过1000字符')
                }
            }
        },
        watch: {},
    }
</script>
<style>


</style>
