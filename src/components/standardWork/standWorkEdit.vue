<template>
    <div class="basic bzzy-change">
        <Spin fix v-show="load_fix">
            <Icon type="load-c" size=18   class="demo-spin-icon-load"></Icon>
            <!--<div>保存中，请稍后...</div>-->
            <div>{{this.load_fix_info}}</div>
        </Spin>
        <!--模块名称-->
        <div class="title">
            <span>方案管理-{{textTitle}}</span>
        </div>
        <!--表单-->
        <div class="form-content">
            <Form :model="workForm" label-position="right" inline :label-width="100" :rules="ruleValidate" ref="workForm">
                <!--<Form-item v-for="item in formInfo" :label="item.name" :key="item">
                    <Input v-if="item.id===1" v-model="item.model"></Input>
                    <Select v-else-if="item.id===2">
                        <Option value="true">是</Option>
                        <Option value="false">否</Option>
                    </Select>
                    <Date-picker v-else-if="item.id===3" type="date" placeholder="选择日期" style="width: 160px"></Date-picker>
                    <Input v-else type="textarea" placeholder="请输入..."></Input>
                </Form-item>-->
                <Form-item label="标准方案编码" prop="code" :title="workForm.code">
                    <Input v-model="workForm.code" style="width: 160px;" disabled></Input>
                </Form-item>
                <Form-item label="标准方案名称" prop="name">
                    <Input v-model="workForm.name" :maxlength="20" @on-change="lengthChange(workForm.name)" style="width: 160px;":disabled="editAble"></Input>
                </Form-item>
                <Form-item label="版本" prop="version">
                    <Input v-model="workForm.version" style="width: 160px;" disabled></Input>
                </Form-item>
                <Form-item v-show="tag != 2" label="是否默认版本" prop="isDefaultVersion">
                    <div style="width: 160px;">
                        <i-switch v-model="workForm.isDefaultVersion" :disabled="editAble">
                            <span slot="open">是</span>
                            <span slot="close">否</span>
                        </i-switch>
                        <Button type="primary" size="small" @click="popVersion()" :disabled="editAble">版本管理</Button>
                    </div>
                </Form-item>
                <Form-item label="是否停机" prop="needShutdown">
                    <div style="width: 160px;">
                        <i-switch v-model="workForm.needShutdown" :disabled="editAble">
                            <span slot="open">是</span>
                            <span slot="close">否</span>
                        </i-switch>
                    </div>
                </Form-item>
                <Form-item label="方案类型" prop="type">
                    <Select v-model="workForm.type" style="width: 160px;" @on-change="aboutStation" :disabled="editAble">
                        <!--<Option value="1" v-show="standardType != 1">点检</Option>-->
                        <Option value="0" v-show="standardType != 2">保养</Option>
                    </Select>
                </Form-item>
                <FormItem label="预计耗时(分钟)" prop="requiredTime">
                    <InputNumber :min="0" :max="9999" v-model="workForm.requiredTime" @on-change="checkInt" style="width: 160px;" :disabled="editAble"></InputNumber>
                </FormItem>
                <!--<Form-item label="启用时间" prop="startTime">
                    <Date-picker v-model="workForm.startTime" type="datetime" placeholder="选择日期和时间" style="width: 160px" disabled @on-change="checkStartTime"></Date-picker>
                </Form-item>
                <Form-item label="停用时间" prop="endTime">
                    <Date-picker v-model="workForm.endTime" type="datetime" placeholder="选择日期和时间" style="width: 160px" disabled @on-change="checkEndTime"></Date-picker>
                </Form-item>-->
                <Form-item label="执行岗位" prop="stationId">
                    <Select v-model="workForm.stationId" style="width: 160px;" :disabled="editAble" @on-change="stationChange" clearable>
                        <Option v-for="item in station" :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select>
                </Form-item>
                <Form-item v-show="tag != 2" label="方案状态" prop="status">
                    <Input v-model="workForm.statusText" style="width: 160px;" disabled></Input>
                </Form-item>
                <Form-item label="设备类型" prop="equ_mold" v-if="equFlag==0">
                    <div style="color:#FFFFFF" onmousemove="this.style.color='#5b5b5b';" onmouseout="this.style.color='#ffffff'">
                        <div :title="workForm.equ_mold" style="position: relative;">
                            <Icon type="ios-close" class="deleteTab" @click.native="emptyEquMold" v-show="!editAble"></Icon>
                            <!--<Input v-model="workForm.equ_mold" style="width: 160px;" readonly :disabled="editAble">-->
                            <Input v-model="workForm.equ_mold" style="width: 160px;" readonly :disabled="editAble" :autofocus="moldFocus">去除校验
                                <Button slot="append" size="small" icon="ios-search" @click="openEquMold" :disabled="editAble"></Button>
                            </Input>
                        </div>
                    </div>
                </Form-item>
                <Form-item label="制造商" prop="supply" v-if="equFlag==1">
                    <div style="color:#FFFFFF" onmousemove="this.style.color='#5b5b5b';" onmouseout="this.style.color='#ffffff'">
                        <div :title="workForm.supply" style="position: relative;">
                            <Icon type="ios-close" class="deleteTab" @click.native="emptySupplier" v-show="!editAble"></Icon>
                            <!--<Input v-model="workForm.supply" style="width: 160px;" readonly :disabled="editAble" :autofocus="supplyFocus">-->
                            <Input v-model="workForm.supply" style="width: 160px;" readonly :disabled="editAble">
                                <Button slot="append" size="small" icon="ios-search" @click="openSup" :disabled="editAble"></Button>
                            </Input>
                        </div>
                    </div>
                </Form-item>
                <Form-item label="规格型号" prop="equ_type" v-if="equFlag==1">
                    <div style="color:#FFFFFF" onmousemove="this.style.color='#5b5b5b';" onmouseout="this.style.color='#ffffff'">
                        <div :title="workForm.equ_type" style="position: relative;">
                            <Icon type="ios-close" class="deleteTab" @click.native="emptyEquType" v-show="!editAble"></Icon>
                            <Input v-model="workForm.equ_type" style="width: 160px;" readonly :disabled="editAble" >
                            <!--<Input v-model="workForm.equ_type" style="width: 160px;" readonly :disabled="editAble" :autofocus="typeFocus">-->
                            <Button slot="append" size="small" icon="ios-search" @click="equ_type = true" :disabled="editAble"></Button>
                            </Input>
                        </div>
                    </div>
                </Form-item>
                <Form-item label="设备名称" prop="equName" v-if="equFlag==2">
                    <Input v-model="workForm.equName" :maxlength="20" @on-change="lengthChange(workForm.equName)" style="width: 160px;":disabled="editAble"></Input>
                </Form-item>
                <Form-item label="注意事项" prop="remark">
                    <Input :maxlength="1000" @on-change="remarkChange(workForm.remark)" v-model="workForm.remark" type="textarea" style="width: 500px;" :disabled="editAble"></Input>
                </Form-item>
            </Form>
        </div>
        <!--表格-->
        <Tabs class="maintenanceTab" type="card">
            <Tab-pane class="checkTab" :label=" proTitle + '项目'" icon="social-buffer">
                <div class="editBox" v-show="!editAble">
                    <div class="table-reset">
                        <table class="table table-bordered table-center table-striped table-blue table-edit table-standWork taDsiplay">
                            <thead>
                            <tr>
                                <th>序号</th>
                                <th width="25%">{{ proTitle }}内容</th>
                                <th width="25%">{{ proTitle }}要求</th>
                                <th width="10%">{{ proTitle }}耗时(分钟)</th>
                                <th width="10%" v-show="workForm.type == 1">点检方式</th>
                                <th width="15%">参照图片</th>
                                <th>操作</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="(itemData,index) in tpmStandardSolutionActionTmp" class="trDisplay">
                                <td>{{index + 1}}</td>
                                <td style="position: relative;"><span class="pro">*</span><Input :maxlength="100" @on-change="change(itemData.content)" type="text" v-model="itemData.content" style="padding-left: 10px;"></Input></td>
                                <td><Input type="text" :maxlength="100" @on-change="change(itemData.requirement)" v-model="itemData.requirement"></Input></td>
                                <td class="num_right">
                                    <Input v-model="itemData.required_time" :maxlength="4" @on-change="checkInt2(itemData.required_time)" style="width: 100px;" ></Input>
                                </td>
                                <td v-show="workForm.type == 1">
                                    <Select v-model="itemData.reportMethod" style="width: 160px;">
                                        <Option value="0">是否合格</Option>
                                    </Select>
                                </td>
                                <td @click="getIndex(index)">
                                    <!--<div class="demo-upload-name-list" v-if="tpmStandardSolutionActionTmp[index].images">
                                        <div v-for="(imageItem,ind) in tpmStandardSolutionActionTmp[index].images">
                                            <p class="demo-upload-nameP"  :title="imageItem.fileName">{{ imageItem.fileName }}</p>
                                            <Icon class="mar-l-10" type="ios-eye-outline" @click.native="handleView(index,ind)"></Icon>
                                            <Icon class="mar-l-10" type="ios-trash-outline" @click.native="handleRemove(index,ind)"></Icon>
                                        </div>
                                    </div>
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
                                        <div class="Img" style="width:20px;height:20px;margin:0 auto;margin: auto;display: flex;">
                                            <Icon type="camera" size="20" style="margin: auto"></Icon>
                                        </div>
                                    </PandoraUpload>-->
                                    <p style="text-align:center;margin-top:35%;color:red" v-if="editAble">暂无图片!</p>
                                    <a @click="editUploadImages(index)">{{tpmStandardSolutionActionTmp[index].images.length}} 张相关图片，点击查看</a>
                                </td>
                                <td><a class="mar-r-5" size="small" @click="removeTpmStandardSolutionAction(index)">删除</a></td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="mar-t-10">
                        <Button type="primary" icon="plus-round" size="small" @click="addTpmStandardSolutionAction" :disabled="btnDis">添加</Button>
                    </div>
                </div>

                <Table v-show="editAble && workForm.type==0" class="table-edit" stripe border :columns="standardColumns" :data="tpmStandardSolutionActionTmp"></Table>
                <Table v-show="editAble && workForm.type==1" class="table-edit" stripe border :columns="checkColumns" :data="tpmStandardSolutionActionTmp"></Table>
            </Tab-pane>
            <Tab-pane class="checkTab" label="备品备件" icon="cube">
                <div class="editBox" v-show="!editAble">
                    <!--kp--备品备件--开始-->
                    <div class="table-reset mar-t-10 ">
                        <table class="table table-bordered table-center table-striped table-blue table-edit table-standWork taDisplay">
                            <thead>
                            <tr>
                                <th>序号</th>
                                <th width="25%">备件编码</th>
                                <th width="25%">备件名称</th>
                                <th width="20%">备件单位</th>
                                <th width="10%">备件数量(个)</th>
                                <th>操作</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="(sparePart,index) in spareParts_display" class="trDisplay">
                                <td>{{index + 1}}</td>
                                <td :title="sparePart.partCode">
                                    {{sparePart.partCode}}
                                </td>
                                <td class="tdDisplay pointDis" :title="sparePart.tBdSparePartName">
                                    {{sparePart.tBdSparePartName}}
                                </td>
                                <!--<td>{{sparePart.bdUom&&sparePart.bdUom.id?$cs.spareParts_unit(sparePart.bdUom.id):"错误数据，暂无枚举"}}</td>-->
                                <td>{{sparePart.uomName ? sparePart.uomName : "错误数据，暂无单位"}}</td>
                                <td class="wid-10 num_right">
                                    <Input v-model=sparePart.number @on-change="toTestIsNAN(sparePart.number,index)"></Input>
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
                </div>
                <Table v-show="editAble" class="table-edit" stripe border :columns="sparePartsColumns" :data="spareParts_display"></Table>
            </Tab-pane>
            <!--<Tab-pane class="checkTab" label="人员需求" icon="android-person">
                <Table stripe border :columns="teamColumns" :data="teamData"></Table>
                &lt;!&ndash;<div class="table-reset">
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
                        <tr v-for="(ssTeam,index) in tpmStandardSolutionDeptTmp">
                            <td>{{index + 1}}</td>
                            <td>
                                <div class="input-search">
                                    <Input v-model="ssTeam.teamCode" disabled></Input>
                                    &lt;!&ndash;<Button icon="ios-search" @click="standard_code = true"></Button>&ndash;&gt;
                                    <Button icon="ios-search" @click="ssDepartmentIndex(index)"></Button>
                                </div>
                            </td>
                            <td>{{ssTeam.teamName}}</td>
                            <td>
                                <Input-number v-model="ssTeam.quantity" :min="0" @on-change="checkInt"></Input-number>
                            </td>
                            <td><a class="mar-r-5" size="small" @click="removeTpmStandardSolutionDeptTmp(index)">作废</a></td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div class="mar-t-10">
                    <Button type="primary" icon="plus-round" size="small" @click="addTpmStandardSolutionDeptTmp">添加</Button>
                    <Button type="primary" shape="circle" icon="minus-round" size="small"></Button>
                </div>&ndash;&gt;
            </Tab-pane>-->
            <Tab-pane class="checkTab" label="适用设备" icon="android-settings">
                <!--kp---适用设备开始-->
                <tree_multiple :baseData="treeSiteData" @dataSetected="dataSelectedDisa" :right_display="treeSiteDataSelected" :state="tempState" :treeTip1="treeTip"></tree_multiple>
                <!--kp---适用设备结束-->
                <!--<table class="table table-bordered table-center table-striped table-blue table-edit">
                <thead>
                <tr>
                <th>序号</th>
                <th>设备地点</th>
                <th>设备选择</th>
                <th>操作</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(sbEquipment,index) in tpmStandardSolutionEquipmentTmp">
                <td>{{index + 1}}</td>
                <td>
                <div class="input-search">
                <Input v-model="sbEquipment.equipmentCode" disabled></Input>
                <Button icon="ios-search" @click="equipment_local = true"></Button>
                </div>
                </td>
                <td>
                <div class="input-search">
                <Input v-model="EquipmentTmp.equipment_chk_val" disabled></Input>
                <Button icon="ios-search" @click="equipment_chk = true"></Button>
                </div>
                </td>
                <td><a class="mar-r-5" size="small" @click="removeTpmStandardSolutionEquipmentTmp(index)">作废</a></td>
                </tr>
                </tbody>
                </Table>
                <div class="mar-t-10">
                <Button type="primary" icon="plus-round" size="small" @click="addTpmStandardSolutionEquipmentTmp">添加</Button>
                &lt;!&ndash;<Button type="primary" shape="circle" icon="minus-round" size="small"></Button>&ndash;&gt;
                </div>-->
            </Tab-pane>
            <!--<Tab-pane class="checkTab" label="适用设备" icon="android-settings">
                <table class="table table-bordered table-center table-striped table-blue table-edit">
                    <thead>
                    <tr>
                        <th>序号</th>
                        <th>设备编码</th>
                        <th>设备名称</th>
                        <th>操作</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(sbEquipment,index) in tpmStandardSolutionEquipmentTmp">
                        <td>{{index + 1}}</td>
                        <td>
                            <div class="input-search">
                                <Input v-model="sbEquipment.equipmentCode" disabled></Input>
                                &lt;!&ndash;<Button icon="ios-search" @click="standard_code = true"></Button>&ndash;&gt;
                                <Button icon="ios-search" @click="sbEquipmentIndex(index)"></Button>
                            </div>
                        </td>
                        <td>{{sbEquipment.equipmentName}}</td>
                        <td><a class="mar-r-5" size="small" @click="removeTpmStandardSolutionEquipmentTmp(index)">作废</a></td>
                    </tr>
                    </tbody>
                </Table>
                <div class="mar-t-10">
                    <Button type="primary" icon="plus-round" size="small" @click="addTpmStandardSolutionEquipmentTmp">添加</Button>
                    &lt;!&ndash;<Button type="primary" shape="circle" icon="minus-round" size="small"></Button>&ndash;&gt;
                </div>
            </Tab-pane>-->
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
                                <Select v-model="ssInhibition.version" :value="ssInhibition.version" @on-change="checkSSVersion(index, ssInhibition.version, ssInhibition.conflictSolutionId)">
                                    <Option v-for="versionItem in ssInhibition.ssv" :value="versionItem.version" :key="versionItem">{{versionItem.version}}</Option>
                                </Select>
                            </td>
                            <td>
                                <Input-number v-model="ssInhibition.daysBefore" :min="0" @on-change="checkInt"></Input-number>
                            </td>
                            <td>
                                <Input-number v-model="ssInhibition.daysAfter" :min="0" @on-change="checkInt"></Input-number>
                            </td>
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
            <!--<router-link v-if="if_cancel">-->
                <Button @click="backPage" class="btn-gary" icon="close" size="large">取消</Button>
            <!--</router-link>-->
            <Button v-if="if_save&&from==undefined" v-show="this.tag != 0" type="primary" icon="checkmark" size="large" @click="submit('workForm',1,0)" >保存</Button>
            <Button v-if="if_edit&&from==undefined" v-show="this.tag == 0 && workForm.status !=1" type="primary" icon="checkmark" size="large" @click="changeEditStatus" >编辑</Button>
            <!-- -1:全部;0:制单中;1:生效中;2:已失效-->
            <Button v-if="if_invalid&&from==undefined" v-show="workForm.status==1 && this.tag == 0" type="primary" icon="close-circled" size="large" @click="statusChange(theStandWorkId,3)">作废</Button>
            <Button v-if="if_work&&from==undefined" v-show="this.tag == 2" type="primary" icon="checkmark" size="large" @click="submit('workForm',1,1)">生效</Button><!--新建生效按钮-->
            <Button v-if="if_work&&from==undefined" v-show="workForm.status == 0  && this.tag == 1" type="primary" icon="checkmark" size="large" @click="statusChange(theStandWorkId,4)">生效</Button><!--编辑生效按钮-->
            <Button v-if="if_del&&from==undefined" v-show="workForm.status!=1 && this.tag == 1" type="primary" icon="close-circled" size="large" @click="statusChange(theStandWorkId,1)" >删除</Button>
        </div>


        <!-- effective modal  S -->
        <Modal title="查看图片" v-model="img_modal" width="800">
            <Carousel  style="width: 760px" v-model="carouselNum">
                <CarouselItem v-for="(imageItem ,ind) in editUploadImagesAry" :key="ind" >
                    <div class="demo-carousel">
                        <div class="demo-upload-list" style="border: 1px solid #ccc;width: 400px;min-height:400px;margin: auto;display: flex;">
                            <img :src=" '../static/'+ imageItem.savePath" style="width:100%;height:100%;object-fit: cover;">
                            <div class="demo-upload-list-cover" v-if="!editAble">
                                <div style="padding-top:150px;">
                                    <!--<Icon type="ios-eye-outline" @click.native="handleView(ind)"></Icon>-->
                                    <Icon  type="ios-trash-outline" @click.native="handleRemove(ind)"></Icon>
                                </div>
                            </div>
                        </div>
                        <p :title="imageItem.fileName" style="text-align: center;margin: 25px 0">{{imageItem.fileName}}</p>
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
                            <div class="Img" style="width:100%;height:100%;margin:150px auto;display: flex;">
                                <Icon type="camera" size="20" style="margin: auto"></Icon>
                            </div>
                            <p style="text-align: center;margin: 25px 0">上传图片</p>
                        </PandoraUpload>
                    </div>
                </CarouselItem>
            </Carousel>
        </Modal>

        <Modal v-model="sparePartsMod" title="备品备件需求" @on-ok="toAdd_spareParts" width="1000">
            <!--<table_multiple @sparePartsSetected="spareParts_dataSelectedDisa" :mod_rightDisplay="sparePartsSelected" :canSearch="toSearch" :modelId="workForm.equId" :manufacturer="workForm.supply"></table_multiple>-->
            <tab_spareParts @sparePartsSetected="spareParts_dataSelectedDisa" :mod_rightDisplay="sparePartsSelected"></tab_spareParts>
        </Modal>

        <Modal v-model="version_code" title="默认版本选择" @on-ok="chooseVerson">
            <Table highlight-row border ref="currentRowTable" class="taDisplay" :columns="columnsVersion" :data="versionList" @on-row-click="toSelect"></Table>
            <div class="mar-t-10" style="overflow: hidden">
                <div style="float: right;">
                    <Page :total="tmp_versionPageSize" size="small" show-elevator :page-size="tmp_versionSize" @on-change="versionPage"></Page>
                </div>
            </div>
        </Modal>
        <Modal v-model="save_plan" title="标准方案版本确认" @on-ok="saveSolution">
            <div class="font-18 pad-b-10">您当前保存的版本号为 <strong>{{workForm.version}}</strong>，是否保存为当前版本？</div>
        </Modal>

        <!--GDJ 设备型号、所属供应商 开始：-->
        <!--
        equ_name:'',
                supply: false,
                supply_name: '',
                equ_mold_modal:false,
                equ_mold_name:'',
        -->
        <Modal v-model="equ_type" title="设备规格型号" @on-ok="deviceSelected">
            <div class="form-content">
                <Form>
                    <Form-item label="设备规格型号" prop="name">
                        <Input v-model="equ_name" @on-blur="equ_name=toValidate(equ_name)" style="width: 160px"></Input>
                    </Form-item>
                </Form>
                <!--查询按钮-->
                <div style="text-align: right;padding-right: 20px">
                    <Button type="primary" icon="search" size="large" @click="deviceType">查询</Button>
                </div>
            </div>
            <div class="table-reset">
                <!--<table class="table table-bordered table-center table-striped table-blue table-edit typedevice taDisplay">
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
                        <td class="tdDisplay pointDis" :title="item.modelName" >{{item.modelName}}</td>
                    </tr>
                    </tbody>
                </table>-->
                <Table highlight-row border ref="currentRowTable" class="taDisplay" :columns="columns_equ_type" :data="deviceTypeList" @on-row-click="toSelectType"></Table>
            </div>
            <div class="mar-t-10" style="overflow: hidden">
                <div style="float: right;">
                    <Page size="small" :total="totalNum" show-elevator :page-size="size" @on-change="pageChange"></Page>
                </div>
            </div>
        </Modal>
        <Modal v-model="supply" title="制造商" @on-ok="supplySelected">
            <div class="form-content">
                <Form>
                    <Form-item label="制造商" prop="name">
                        <Input v-model="supply_name" @on-blur="supply_name=toValidate(supply_name)" style="width: 160px"></Input>
                    </Form-item>
                </Form>
                <!--查询按钮-->
                <div style="text-align: right;padding-right: 20px">
                    <Button type="primary" icon="search" size="large" @click="supplier">查询</Button>
                </div>
            </div>
            <div class="table-reset">
                <!--<table class="table table-bordered table-center table-striped table-blue table-edit supply taDisplay">
                    <thead>
                    <tr>
                        <th>选择</th>
                        <th>序号</th>
                        <th>所属供应商</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(item,index) in supplierList" class="trDisplay">
                        <td><input type="radio" name="supplyId" :value="item.manufacturer"/></td>
                        <td>{{index + 1}}</td>
                        <td class="tdDisplay pointDis" :title="item.manufacturer">{{item.manufacturer}}</td>
                    </tr>
                    </tbody>
                </table>-->
                <Table highlight-row border ref="currentRowTable" class="taDisplay" :columns="columns_supplier" :data="supplierList" @on-row-click="toSelectSupplier"></Table>
            </div>
            <div class="mar-t-10" style="overflow: hidden">
                <div style="float: right;">
                    <Page size="small" :total='supplyTotal' show-elevator :page-size="size" @on-change="supplyChange"></Page>
                </div>
            </div>
        </Modal>
        <Modal v-model="equ_mold_modal" title="设备类型" @on-ok="equMoldSelected">
            <div class="form-content">
                <Form>
                    <Form-item label="设备类型" prop="name">
                        <Input v-model="equ_mold_name" @on-blur="equ_mold_name=toValidate(equ_mold_name)" style="width: 160px"></Input>
                    </Form-item>
                </Form>
                <!--查询按钮-->
                <div style="text-align: right;padding-right: 20px">
                    <Button type="primary" icon="search" size="large" @click="equMoldReload">查询</Button>
                </div>
            </div>
            <div class="table-reset">
                <Table highlight-row border ref="currentRowTable" class="taDisplay" :columns="columns_equMold" :data="equMoldList" @on-row-click="toSelectEquMold"></Table>
            </div>
            <div class="mar-t-10" style="overflow: hidden">
                <div style="float: right;">
                    <Page size="small" :total='equMoldTotal' show-elevator :page-size="equMoldSize" @on-change="equMoldChange"></Page>
                </div>
            </div>
        </Modal>
        <!--GDJ 设备型号、所属供应商 结束-->


        <Modal v-model="promptModal" width="360">
            <p slot="header" style="color:#f60;text-align:center">
                <Icon type="information-circled"></Icon>
                <span>{{workOrNoMess}}确认</span>
            </p>
            <div style="text-align:center">
                <p v-show="this.tag == 2">是否{{workOrNoMess}}此方案？</p>
                <div v-show="this.tag == 1" class="font-18 pad-b-10 col-orange">您当前{{workOrNoMess}}的版本号为 <strong>{{workForm.version}}</strong>，是否{{workOrNoMess}}为当前版本？</div>
            </div>
            <div slot="footer">
                <Button v-show="this.tag == 2 && this.workOrNo ==0" type="primary" size="large" long :loading="modal_loading" @click="getSave(submitId,0,0)">保存</Button>
                <Button v-show="this.tag == 2 && this.workOrNo ==1" type="primary" size="large" long :loading="modal_loading" @click="getSave(submitId,0,1)">生效</Button>
                <Row v-show="this.tag == 1">
                    <Col span="6" offset="6">
                    <Button type="primary" long :loading="modal_loading" @click="getSave(submitId,1,'')">保存</Button>
                    </Col>
                    <Col span="6" offset="6">
                    <Button type="primary"  long :loading="modal_loading" @click="getSave(submitId,2,'')">新增版本</Button>
                    </Col>
                </Row>


            </div>
        </Modal>

        <!-- effective modal  E -->


        <!--kp-&#45;&#45;选择完关联关系才可以添加备品备件：start-->
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
        <!--kp---end-->

        <!--<Modal v-model="material_code" title="备品备件需求" @on-ok="chooseMaterial">
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
        </Modal>-->
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
                <tr v-for="(team,index) in tpmDept">
                    <td>
                        <div v-html="team.radio"></div>
                    </td>
                    <td>{{index + 1}}</td>
                    <td>{{team.code}}</td>
                    <td>{{team.name}}</td>
                </tr>
                </tbody>
            </table>
            <div class="mar-t-10" style="overflow: hidden">
                <div style="float: right;">
                    <Page :total="tpmDeptTotal" size="small" show-elevator :page-size="size" @on-chanage="initTpmDept"></Page>
                </div>
            </div>
        </Modal>-->
        <!--<Modal v-model="equipment_code" title="设备编码" width="820" @on-ok="selectSb">
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
        </Modal>-->
        <!--<Modal v-model="equipment_local" title="设备地点名称">
            <Row>
                <Col span="22" offset="2">
                <Tree :data="baseData" show-checkbox :multiple="false" :show-checkbox="false"
                      @on-select-change="getLocationId" class="max-h-300"></Tree>
                </Col>
            </Row>
        </Modal>-->
        <!--<Modal v-model="equipment_chk" title="设备选择" width="600" @on-ok="selectEquipment">
            <Transfer :data="equipment_chk_data" :target-keys="equipment_chk_targetKeys" :list-style="listStyle"
                      filterable :render-format="render" @on-change="handleChange4"></Transfer>
        </Modal>-->

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
                    &lt;!&ndash;<Page :total="40" size="small" show-elevator :page-size="size"></Page>&ndash;&gt;
                    <Page :total="tpmssTotal" size="small" show-elevator :page-size="pageSize" @on-change="initTpmss"></Page>
                </div>
            </div>
        </Modal>-->
        <!--<Modal v-model="version_code" title="版本管理">
            <div class="second-title">方案信息</div>
            <table v-model="workForm" class="table table-bordered table-center mar-b-10">
                <thead>
                <tr>
                <th>标准方案编码</th>
                <th>标准方案名称</th>
                </tr>
                </thead>
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
        <!--<Button  class="btn-gary" icon="close" size="large" @click="version_code = false">取消</Button>
        <Button  type="primary" icon="document-text" size="large">保存草稿</Button>
    </div>
</Modal>-->

        <Modal v-model="delModal" width="360">
            <p slot="header" style="color:#f60;text-align:center">
                <Icon type="information-circled"></Icon>
                <span>{{del}}确认</span>
            </p>
            <div style="text-align:center">
                <p>是否{{del}}此方案？</p>
            </div>
            <div slot="footer">
                <Button type="primary" size="large" long :loading="load" @click="cancelPlan(delId)">{{del}}</Button>
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
    import tabpane_spareParts from '../treeMulitiple/tabpane_spareParts.vue';
    import PandoraUpload from '../../api/pandora-upload/pandoraUpload.vue';
    export default {
        created(){
//            console.log(JSON.parse(localStorage.getItem('standardWorkRowData')));
        },
        data (){
            return {
                /* ****  **** */
                equFlag:0,
                from: '',
                isShow: false,
                /* ****  **** */
                /**/
                /*权限校验 start*/
                if_cancel:  this.$rt(this.authJson.EAM.设备保养.保养方案查看页.取消),
                if_edit:  this.$rt(this.authJson.EAM.设备保养.保养方案查看页.编辑),
                if_invalid:  this.$rt(this.authJson.EAM.设备保养.保养方案查看页.作废),
                if_save:  this.$rt(this.authJson.EAM.设备保养.保养方案编辑页.保存),
                if_work:  this.$rt(this.authJson.EAM.设备保养.保养方案编辑页.生效),
                if_del:  this.$rt(this.authJson.EAM.设备保养.保养方案编辑页.删除),
                /*权限校验 end*/
                /*
                *          页面来源 */
                textTitle: '',//标题
                tag: '',//来源、复制、新建、查看
                editAble:true,//编辑与否
                workOrNo:0,//生效是否 0 制单中生效、1 未生效 生效
                workOrNoMess:"保存",//生效是否 0 制单中生效、1 未生效 生效
                //kp编辑页渲染：
                theStandWorkId: "",//初始方案编码
                /*执行岗位牵连方案类型*/
                standardType:0,
                /*执行岗位牵连方案类型*/

                //GDJ--设备型号、所属供应商 、设备类型--开始：
                equ_type: false,
                equ_name:'',
                supply: false,
                supply_name: '',
                equ_mold_modal:false,
                equ_mold_name:'',
                //GDJ--设备型号、所属供应商 、设备类型--结束
                columns_equ_type:[
                    {
                        title:'序号',
                        type: 'index',
                        width: 120,
                        align: 'center'
                    },
                    {
                        title: '设备型号',
                        key: 'tBdEquipmentModelName',
                        align:'center',
                        render:(h,params) => {
                            return h('p',{
                                domProps:{
                                    title:params.row.tBdEquipmentModelName,
                                },
                                class:'iview_tabDis'
                            },params.row.tBdEquipmentModelName)
                        }
                    },
                ],//设备型号选择数据源
                deviceTypeList: [],//设备型号选择数据源
                selectRowType:'',//选择得到数据
                columns_supplier:[
                    {
                        title:'序号',
                        type: 'index',
                        width: 120,
                        align: 'center'
                    },
                    {
                        title: '所属供应商',
                        key: 'tBdEquipmentManufacturerName',
                        align:'center',
                        render:(h,params) => {
                            return h('p',{
                                domProps:{
                                    title:params.row.tBdEquipmentManufacturerName,
                                },
                                class:'iview_tabDis'
                            },params.row.tBdEquipmentManufacturerName)
                        }
                    },
                ],
                supplierList: [],//供应商选择数据源
                selectRowSupplier:'',//选择得到数据
                supplyTotal: 0,//供应商分页
                supplyPage: 1,//供应商分页
                columns_equMold:[
                    {
                        title:'序号',
                        type: 'index',
                        width: 120,
                        align: 'center'
                    },
                    {
                        title: '设备类型',
                        key: 'tBdEquipmentTypeName',
                        align:'center',
                        render:(h,params) => {
                            return h('p',{
                                domProps:{
                                    title:params.row.tBdEquipmentTypeName,
                                },
                                class:'iview_tabDis'
                            },params.row.tBdEquipmentTypeName)
                        }
                    },
                ],
                equMoldList:[],
                selectRowequMold:'',
                equMoldSize:5,
                equMoldTotal:0,
                equMoldPage:1,

                columnsVersion:[
                    {
                        title:'序号',
                        type: 'index',
                        width: 120,
                        align: 'center'
                    },
                    {
                        title: '标准方案编码',
                        key: 'versionCode',
                        align:'center',
                        render:(h,params) => {
                            return h('p',{
                                domProps:{
                                    title:params.row.versionCode,
                                },
                                class:'iview_tabDis'
                            },params.row.versionCode)
                        }
                    },
                    {
                        title: '标准方案名称',
                        key: 'versionName',
                        align:'center',
                        render:(h,params) => {
                            return h('p',{
                                domProps:{
                                    title:params.row.versionName,
                                },
                                class:'iview_tabDis'
                            },params.row.versionName)
                        }
                    },
                    {
                        title: '版本号',
                        key: 'versionType',
                        align:'center',
                        render:(h,params) => {
                            return h('p',{
                                domProps:{
                                    title:params.row.versionType,
                                },
                                class:'iview_tabDis'
                            },params.row.versionType)
                        }
                    },
                ],//版本管理modal
                versionList: [],//版本管理data
                selectVer: {},//选择版本
                proTitle:'保养',//项目tabpane标题
                img_modal:false,//图片查看弹出框
                carouselNum:0,//轮播显示第几页
                upLoadList :'',//图片上传列表
                upLoadFiles :'',//图片二次上传保存列表
                imgViewPath:'',
                editUploadImagesAry:[],
                checkMethod:this.$base_info.eamCheckReportMethodEnum,//点检方式

                workForm: {
                    equName:'',//设备名称
                    standardSolutionId:'',//方案Id
                    code: '',
                    name: '',
                    version: '',
                    isDefaultVersion: true,
                    needShutdown: false,
                    requiredTime: 0,
                    startTime: '',
                    endTime: '2099-01-01 08:00:00',
                    type: "",
                    /**/
                    statusText:'',
                    status:'',
                    /*设备类型*/
                    equ_mold:'',
                    equ_moldId:'',
                    //GDJ--设备型号、所属供应商--开始：
                    equ_type: '',
                    equId: '',
                    supply: '',
                    supplyId:'',
                    //GDJ--设备型号、所属供应商--结束
                    remark: '',
                    stationId: '',
                },
                station: [],
                stationId: '',
                standard: '0',
                isType: false,
                btnDis: false,
                ruleValidate: {
                    name: [
                        {required: true, message: '内容不能为空', trigger: 'change'},
                        {type: 'string', max: 60, message: '方案名称不能超出60个字', trigger: 'change'}
                    ],
                    requiredTime: [
                        {required: true, type: 'number', message: '内容不能为空', trigger: 'change'}
                    ],
                    type: [
                        {required: true, message: '请选择方案类型', trigger: 'change'}
                    ],
                    equ_mold: [
                        {required: true, message: '设备类型不能为空', trigger: 'change'}
                    ],
                    stationId: [
                        {required: true, message: '请选择执行岗位', trigger: 'change'}
                    ],
                   /* equ_type: [
                        {required: true, message: '内容不能为空', trigger: 'change'}
                    ],
                    equ_mold: [
                        {required: true, message: '内容不能为空', trigger: 'change'}
                    ],
                    supply: [
                        {required: true, message: '内容不能为空', trigger: 'change'}
                    ],*/
                    inputText: [
                        {required: true, message: '内容不能为空', trigger: 'blur'}
                    ]
                },

                /*三个设备条件获取焦点,添加焦点以解决编辑页面无法清空页面显示值*/
                moldFocus:false,
                typeFocus:false,
                supplyFocus:false,
                /*三个设备条件获取焦点*/

                commonModal: false,
                tipMessage: "",
                sparePartsMod: false,
                toSearch: "cannot",
                sparePartsSelected: [],
                spareParts_display: [],
                sparePartsColumns:[
                    {
                        title: '序号',
                        type: 'index',
                        align: 'center',
                        width: 80,
                    },
                    {
                        title: '备件编码',
                        key: 'partCode',
                        align: 'center',
                        render:(h,params) => {
                            return h('p',{
                                domProps:{
                                    title:params.row.partCode,
                                },
//                                class:'iview_tabDis'
                            },params.row.partCode)
                        }
                    },
                    {
                        title: '备件名称',
                        key: 'tBdSparePartName',
                        align: 'center',
                        render:(h,params) => {
                            return h('p',{
                                domProps:{
                                    title:params.row.tBdSparePartName,
                                },
                                class:'iview_tabDis'
                            },params.row.tBdSparePartName)
                        }
                    },
                    {
                        title: '备件单位',
                        key: 'uomName',
                        align: 'center',
                        width: 150,
                        render:(h,params) => {
                            return h('p',{
                                domProps:{
                                    title:params.row.uomName,
                                },
                                class:'iview_tabDis'
                            },params.row.uomName)
                        }
                    },
                    {
                        title: '备件数量(个)',
                        key: 'number',
                        align: 'center',
                        width: 150,
                        render:(h,params) => {
                            return h('p',{
                                domProps:{
                                    title:params.row.number,
                                },
                                class:'iview_tabDis'
                            },params.row.number)
                        }
                    },
                    {
                        title: '操作',
                        key: 'action',
                        align: 'center',
                        width: 100,
                        render: (h, params) => {
                            let buttons = [];
                            if (this.from==undefined) {
                                buttons.push(
                                    h('a', {
                                        class: 'mar-r-5',
                                        on: {
                                            click: () => {
                                                this.$Message.error("查看状态，不可删除");
                                            }
                                        }
                                    }, '删除'),
                                );
                            }
                            return h('div', buttons);
                        },

                    },
                ],

                //kp--适用设备相关--开始：
                treeTip: "",
                tempState: "editting",
                treeSiteDataSelected: [],
                treeSiteData: [],
                //kp--适用设备--结束

                isubmit: false,
                load_fix: false,
                load_fix_info: '',
                tpmssId: '',
                tpmStandardSolutionId: '',
                tmp_versionSize: 5,
                tmp_versionPageSize: 0,
                tmp_nid: '',
                //临时字段...
                tmp_typeId: '7',

                tmp: {
                    tpmStandardSolutionIndex: "",
                    tpmMaterialId: "",
                    tpmMaterialCode: "",
                    tpmMaterialName: "",
                    tpmModelType: "",
                    tpmMaterialUnit: "",
                },

                size: 5,
                pageSize: 5,
                numMaterial: 0,
                button_14743: this.$rt('14743'),
                button_14732: this.$rt('14732'),
                button_14731: this.$rt('14731'),

                materialList: [],


                self: this,
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
                baseData: [{
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
                }],





                /* columns1: [
                 {
                 title: '序号',
                 type: 'index',
                 width: 80,
                 align: 'center',
                 },
                 {
                 title: '作业内容',
                 key: 'content',
                 render:(h,params) =>{
                 return h('Input',{props: {value: params.row.content}})
                 },
                 },
                 {
                 title: '标准要求',
                 key: 'requirement',
                 render:(h,params) =>{
                 return h('Input',{props: {value: params.row.requirement}})
                 }
                 },
                 {
                 title: '标准工时(分钟)',
                 key: 'requiredTime',
                 render:(h,params) =>{
                 return h('Input',{props: {value: params.row.requiredTime}})
                 }
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
                 this.removeData1(params.index);
                 }
                 }
                 },'作废');
                 }
                 }
                 ],*/
                /*项目tabpane*/
                checkModeData:[],//点检
                maintainData:[],//保养
                new_data1: {
                    content: '',
                    requirement: '',
                    reportMethod: '0',
                    required_time: null,
                    file_name: '',
                    images:[]
                },
                tpmStandardSolutionActionTmp: [],
                standardColumns:[
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
                        key: 'required_time',
                        align: 'center',
                        width: 150,
                        render:(h,params) => {
                            return h('p',{
                                domProps:{
                                    title:params.row.required_time,
                                },
                                class:'iview_tabDis'
                            },params.row.required_time)
                        }
                    },
                    {
                        title: '参照图片',
                        key: 'images',
                        align: 'center',
                        render:(h,params)=>{
                           /* let imgItem = [] ;
                            for(let i = 0 ; i < params.row.images.length ; i ++){
                                imgItem.push(
                                    h('div',[
                                        h("label",{
                                            title:params.row.images[i].fileName
                                        },params.row.images[i].fileName),
                                        h("Icon",{
                                            class:'mar-l-10 ivu-icon ivu-icon-ios-eye-outline',
                                            nativeOn: {
                                                click: () => {
                                                    this.handleView(params.index,i)
                                                }
                                            }
                                        }),
                                        h("Icon",{
                                            class:'mar-l-10 ivu-icon ivu-icon-ios-trash-outline',
                                            nativeOn: {
                                                click: () => {
                                                    this.handleRemove(params.index,i)
                                                }
                                            }
                                        }),
                                    ])
                                )
                            }
                           return h('div',imgItem)*/
                           let showImgAry = [];
                           if(params.row.images.length>0){
                               showImgAry.push(
                                   h('a',{
                                       on:{
                                           click:()=>{
                                               this.editUploadImages(params.index)
                                           }
                                       }
                                   },params.row.images.length +' 张相关图片，点击查看')
                               )
                           }else {
                               showImgAry.push(
                                   h('p','暂无图片')
                               )
                           }
                           return h('div',showImgAry)
                        }
                    },
                    {
                        title: '操作',
                        key: 'action',
                        align: 'center',
                        width: 100,
                        render: (h, params) => {
                            let buttons = [];
                            if (this.from==undefined) {
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
                            }
                            return h('div', buttons);
                        },

                    },
                ],//查看状态
                checkColumns:[
                    {
                        title: '序号',
                        type: 'index',
                        align: 'center',
                        width: 80
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
                        title: '点检耗时(分钟)',
                        key: 'required_time',
                        width: 150,
                        align: 'center',
                        render:(h,params) => {
                            return h('p',{
                                domProps:{
                                    title:params.row.required_time,
                                },
                                class:'iview_tabDis'
                            },params.row.required_time)
                        }
                    },
                    {
                        title: '点检方式',
                        key: 'reportMethod',
                        align: 'center',
                    },
                    {
                        title: '参照图片',
                        key: 'images',
                        align: 'center',
                        render:(h,params)=>{
                            /*let imgItem = [] ;
                            if(params.row.images != []){
                                for(let i = 0 ; i < params.row.images.length ; i ++){
                                    imgItem.push(
                                        h('div',[
                                            h("label",{
                                                title:params.row.images[i].fileName
                                            },params.row.images[i].fileName),
                                            h("Icon",{
                                                class:'mar-l-10 ivu-icon ivu-icon-ios-eye-outline',
                                                nativeOn: {
                                                    click: () => {
                                                        this.handleView(params.index,i)
                                                    }
                                                }
                                            }),
                                            h("Icon",{
                                                class:'mar-l-10 ivu-icon ivu-icon-ios-trash-outline',
                                                nativeOn: {
                                                    click: () => {
                                                        this.handleRemove(params.index,i)
                                                    }
                                                }
                                            }),
                                        ])
                                    )
                                }
                                return h('div',imgItem)

                            }else {
                                return h('div')
                            }*/
                            let showImgAry = [];
                            if(params.row.images.length>0){
                                showImgAry.push(
                                    h('a',{
                                        on:{
                                            click:()=>{
                                                this.editUploadImages(params.index)
                                            }
                                        }
                                    },params.row.images.length +' 张相关图片，点击查看')
                                )
                            }else {
                                showImgAry.push(
                                    h('p','暂无图片')
                                )
                            }
                            return h('div',showImgAry)
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

                    },
                ],//查看状态
                /*项目tabpane*/

                //备品备件 start
                /*columns2: [
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
                },*/
                tpmStandardSolutionMaterialTmp: [],
                materialType: [],

                /*人员需求 start*/
                new_tpmStandardSolutionDeptTmp: {
                    teamId: '',
                    teamCode: '',
                    teamName: '',
                    quantity: 1,
                },
                tpmStandardSolutionDeptTmp: [],

                /*columns4: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 80,
                        align: 'center'
                    },
                    {
                        title: '设备编码',
                        key: 'equipmentCode',
                        render: (h, params) => {
                            return h('div', {
                                class: 'input-search'
                            }, [
                                h('Input', {
                                    props: {
                                        type: 'text',
                                        value: params.row.equipmentCode,
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
                new_data4: {
                    equipmentCode: '',
                    equipmentName: '',
                },*/

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
                    /* {
                     code: '',
                     name: '',
                     quantity: '',
                     }*/
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
                //alert("tpmsbId = "+ this.data4.equipmentId+"     ,equipmentName = "+this.data4.equipmentName);
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

                tpmss: [{id: "", code: "", name: "", radio: ""},],
                tpmssTotal: 0,

                /*人员需求班组放大镜*/
                tpmDept: [{id: "", code: "", name: "", radio: ""},],
                tpmDeptTotal: 0,

                /*设备放大镜*/
                tpmsb: [],
                //   tpmsb: [{equipmentId:"",equipmentCode:"",equipmentName:"",radio:""},],
                tpmsbTotal: 0,
                locationId: '',
                tpmsbCurrent: 1,
                savePath: '',
                onlyindex: '',
                deleteZfei: false,
                modal_loading: false,
                delIndex: '',


                totalNum: 0,
                typePage: 1,

                promptModal: false,
                submitId: 0,

                del: '',
                delId: 0,
                delModal: false,
                load: false,

            }
        },
        components: {
            'table_multiple': table_multiple,
            'tab_spareParts': tabpane_spareParts,
            'tree_multiple': tree_multiple,
            PandoraUpload
        },

        mounted(){
            this.from = this.$route.query.from;
            /*
            * 页面ID初始值获取*/
            let standardId = this.$route.query.id;//方案版本Id
            this.theStandWorkId = standardId;

            var flag = this.$route.query.flag;
            this.tag = flag;
            this.tpmStandardSolutionId = this.$route.query.tpmssId;
            if(flag == 0){
                this.textTitle = '查看';
                this.editAble = true;
                this.tempState = 'viewing';
                this.detailReload(standardId);
//                this.getVer();///*版本管理*/
            } else if( flag == 1){
                this.textTitle = '编辑';
                this.editAble = false;
                this.tempState = 'editting';
                this.detailReload(standardId);
                this.getVer();///*版本管理*/
            } else if(flag == 2){
                this.textTitle = '新建';
                this.editAble = false;
                this.newReload();
            }

            this.reView_spareParts();
//            this.review_eauipment();
            let vmm = this;
            vmm.tmp_nid = standardId;
//          this.jiazai(id, flag);//加载显示的内容
//          this.detail(standardId, flag);

//          this.getVersion();
//          this.getMaterialType();
//          this.getMaterial();//备品备件 modal EAM二期
//          this.initTpmss(1);//抑制作业tabpane EAM二期
//          this.initTpmDept(1);//班组tabpane EAM二期
//          this.getLocationTree();//适用设备tabpane EAM二期
//          this.operatingItem();//作业项目 EAM二期
            setTimeout(()=>{
                this.executive(this.workForm.type);
            },500);

            this.deviceType();


//          this.supplier();


            // kp---地点设备列表，树图初始化  --开始:
//            this.toSearch_equment();
            // kp---地点设备列表，树图初始化  --结束:
            this.equFlagLoad();

        },
        methods: {
            /*************** 制造商、规格型号、设备类型 *************************/
            equFlagLoad(){
                this.$axios.get('/tEamStandardSolution/equipmentFlag').then((res) => {
                    this.equFlag = res.data.equipmentFlag;
//                    console.log("this.equFlag +" + this.equFlag);
                }).catch((err) => {
                    console.log(err);
                });
            },
           /* 一、 标准方案使用范围：
            URL ：  /tEamStandardSolution/equipmentFlag
            结果：{"equipmentFlag": 0}

            二、地点信息树形结构部分树V2
            /tEamStandardSolution/location/treePV2*/


        /*************** 制造商、规格型号、设备类型 *************************/


            /************* 图片管理按钮方法 -S- **************/
            editUploadImages(index){
                this.img_modal = true;
                this.carouselNum = 0;
                this.editUploadImagesAry = this.tpmStandardSolutionActionTmp[index].images;
                console.log("editUploadImagesAry +" + JSON.stringify(this.editUploadImagesAry))
//                this.imgViewPath = this.tpmStandardSolutionActionTmp[index].images[ind].savePath
//                tpmStandardSolutionActionTmp[index].images
            },
            /************* 图片管理按钮方法 -E- **************/



            /*查看改为编辑状态*/
            changeEditStatus(){
                this.textTitle = '编辑';
                this.editAble = false;
                this.tag = 1;
                if(this.workForm.type == "1"){
                    for(let i in this.tpmStandardSolutionActionTmp){
                        this.tpmStandardSolutionActionTmp[i].reportMethod = '0';
                    };
                }
            },
            /*
            * *****************方案管理新建、编辑  S *******************/
            newReload(){
                this.$axios.post('/tEamStandardSolution/addStandardSolutionVersionInit').then((res) => {
                    if(res.data.response.code != 0){
                        this.workForm.version = res.data.response.data.version;
                        this.workForm.code = res.data.response.data.code;
                    }
                }).catch((err) => {
                    console.log(err);
                });
            },
            detailReload(reLoadId){
                this.$axios.post('tEamStandardSolution/standardSolutionVersionDetail',{standardSolutionVersionId:reLoadId}).then((res) => {
                    let result = res.data.response.data;
                    if (res.data.response.code == 1) {
                        this.workForm = result;
//                        console.log("this.workForm + " + JSON.stringify(this.workForm))
                        this.workForm.requiredTime = Number(result.requiredTime);
                        this.workForm.needShutdown = result.needShutDown == 0? true:false; //是否停机
                        this.workForm.statusText = result.status == 0? '制单中':result.status == 1?'生效中':'已失效';
                        this.workForm.isDefaultVersion = result.isDefaultVersion == 0? true:false; //是否默认版本
                        this.workForm.type=String(result.type);
                        this.workForm.stationId = result.roleId;//执行岗位
                        this.workForm.equ_type = result.equipmentModelName; //设备型号
                        this.workForm.equId = result.equipmentModelId; //设备型号Id
                        this.workForm.equ_mold = result.equipmentTypeName; //设备类型
                        this.workForm.equ_moldId = result.equipmentTypeId; //设备类型Id
                        this.workForm.supply = result.equipmentManufacturerName; //所属供应商
                        this.workForm.supplyId = result.equipmentManufacturerId; //所属供应商
                        //--kp--详情页进来会默认查询适用设备的关联树：
                        this.toSearch_equment();
                        //end
                        this.tabInfo(reLoadId,this.workForm.type);
                    } else {
                        this.$Message.error(res.data.response.msg)
                    }

                }).catch((err) => {
                    console.log(err);
                });
            },
            tabInfo(reLoadId,type){
                this.$axios.post('/tEamStandardSolution/getStandardworkTypeDetails',{id:reLoadId,type:type}).then((res) => {
                    let result = res.data.response.data;
//                    console.log("getStandardworkTypeDetails +" + JSON.stringify(result))
                    if (res.data.response.code == 1) {
                        /*备品备件*/
                        let sparePartsAry = [];
                        if(result.part != []){
                            for(let i = 0; i < result.part.length; i++){
                                sparePartsAry.push({
                                    id:result.part[i].id,
                                    partCode:result.part[i].partCode,
                                    tBdSparePartName:result.part[i].partName,
                                    tBdSparePartId:result.part[i].partId,
                                    uomName:result.part[i].uomName,
                                    uomId:result.part[i].uomId,
                                    number:result.part[i].num,
                                })
                            }
                            this.spareParts_display = sparePartsAry;
                            this.sparePartsSelected = sparePartsAry;
                        }
                        /*点检、保养项目*/
                        if(this.workForm.type == "0"){
                            let standardAry = [];
                            if(result.work != []){
                                for(let i = 0; i < result.work.length; i++){
                                    standardAry.push({
                                        id:result.work[i].id,
                                        content:result.work[i].content,
                                        requirement:result.work[i].requirement,
                                        required_time:result.work[i].time,
                                        images:result.work[i].picData != undefined ? result.work[i].picData : [],
                                    });
                                    this.tpmStandardSolutionActionTmp = standardAry;
                                    this.maintainData = this.tpmStandardSolutionActionTmp;
                                }
                            }
                        } else{
                            let checkAry = [];
                            if(result.check != []){
                                for(let i = 0; i < result.check.length; i++){
                                    checkAry.push({
                                        eamStandardSolutionItemsId:result.check[i].id,
                                        name:result.check[i].content,
                                        content:result.check[i].content,
                                        requirement:result.check[i].requirment,
                                        required_time:result.check[i].time,
                                        reportMethod:this.editAble ? '是否合格':String(result.check[i].type),
                                        images:result.check[i].picData,
                                    })
                                }
                                this.tpmStandardSolutionActionTmp = checkAry;
                                this.checkModeData = this.tpmStandardSolutionActionTmp ;
                            }
                        }
                        /*适用设备*/
                        let equipmentAry = [];
                        if(result.equipment != []){
                            for(let i = 0; i < result.equipment.length; i++){
                                equipmentAry.push({
                                    id:result.equipment[i].factoryLocationId,
                                    rowId:result.equipment[i].id,
                                    title:result.equipment[i].factoryLocationName,
                                    type:5,
                                })
                            }
                            this.treeSiteDataSelected = equipmentAry
                        }
                    } else {
                        this.$Message.error(res.data.response.msg)
                    }

                }).catch((err) => {
                    console.log(err);
                });
            },
            /*
            * *****************方案管理新建、编辑  E *******************/

            /*
             * *****************方案管理 form 表单选择初始化 S *******************/
            /*1、版本管理 (弹出框 要修改为点选，稍等编辑时修改) S */
            popVersion: function () {
                this.version_code = true;
            },
            chooseVerson: function () {
                let vm = this;
                this.$axios.post('/tEamStandardSolution/b/' + vm.selectVer.versionId).then(function (res) {
                    let ret = res.data.response.data.ret;
//                    console.log("res +" + JSON.stringify(res))
                    if (ret == "success") {
                        if(vm.selectVer.versionType==vm.workForm.version){
                            vm.workForm.isDefaultVersion = true;
                        } else{
                            vm.workForm.isDefaultVersion = false;
                        }
                        vm.$Message.success("保存成功");
                    } else if (ret == "false") {
                        vm.$Message.warning("保存失败");
                    } else {
                        vm.$Message.warning(ret)
                    }
                })
            },
            toSelect(message){
                this.selectVer = message;
            },
            getVer: function (current) {
                let vm = this;
                if (current == undefined) {
                    current = 1;
                }
                this.$axios.post('/tEamStandardSolution/getAllVersionInfo', {
                    page: current,
                    pageSize: vm.tmp_versionSize,
                    id: vm.tpmStandardSolutionId,
                }).then(function (response) {
                    if (response.data.response.code != 0) {
                        let tmp = response.data.response.data;
                        vm.tmp_versionPageSize = tmp.total;
                        vm.versionList = tmp.rows;
                    } else {
                        vm.tmp_versionPageSize = 0;
                    }
                })
            },
            versionPage: function (current) {
                this.getVer(current);
            },
            /*getVersion: function (current) {
                let vm = this;
                if (current == undefined) {
                    current = 1;
                }
                this.$axios.get('tpmStandardSolution/getAllVersionInfo', {
                    params: {
                        cur: current,
                        size: vm.size,
                        id: vm.tmp_nid,
                    }
                }).then(function (response) {

                    var array = new Array();
                    if (response.data.response.data.length != 0) {
                        let tmp = response.data.response.data;
                        vm.tmp_versionPageSize = tmp[0].numMaterial;
                        var num = 1;
                        for (var i in tmp) {
                            if (i != "unique") {
                                let index = num;
                                let versionId = tmp[i].id;
                                let innerhtml = '<input type="radio" name="versionId" value="' + versionId + '"/>'
                                let versionCode = tmp[i].code;
                                let versionlName = tmp[i].name;
                                let versionType = tmp[i].version;
                                num++;

                                let tmpMaterial = {
                                    "index": index,
                                    "versionId": versionId,
                                    "innerhtml": innerhtml,
                                    "versionCode": versionCode,
                                    "versionName": versionlName,
                                    "versionType": versionType,
                                }
                                array.push(tmpMaterial);
                            }
                        }
                    } else {
                        vm.tmp_versionPageSize = 0;
                    }
                    for (var i = 0; i < array.length; i++) {
                        if (array[i].versionId == "undefined") {
                            array.splice(i, 1)
                        }
                    }
                    vm.versionList = array;
                })
            },*/
            /*1、版本管理 (弹出框 要修改为点选，稍等编辑时修改)  E */

            /*2、执行岗位 (完) S */
            executive(type){
                this.$axios.post('/tEamStandardSolution/getPostByType', {type: type}).then((res) => {
                    let ret = res.data.response;
                    if (ret.code == 1) {
                        this.station = ret.data;
//                        console.log(" this.station +" + JSON.stringify( this.station))
                    }
                }).catch((err) => {
                    console.log(err);
                });
            },
            aboutStation(val){
                this.executive(val);
                if(val == "0"){
                    this.proTitle = '保养';
                    this.tpmStandardSolutionActionTmp = this.maintainData;
                } else if(val == "1"){
                    this.proTitle = '点检';
                    this.tpmStandardSolutionActionTmp = this.checkModeData;
                }
            },
            stationChange(val){
                if(val =='JQS5P4EEJE5I9OGC4YTB'){
                    this.standardType = 1
                }else if(val =='JQS5KI0Z2FQ67G2UGENE'){
                    this.standardType = 2
                }else {
                    this.standardType = 0
                }
                // <Option value="1" v-show="workForm.stationId =='JQS5KI0Z2FQ67G2UGENE'">点检</Option>
            },
            /*2、执行岗位 (完)  E */

            /*3、设备型号 S  */
            deviceType(){
//                console.log(this.typePage),
//                console.log(this.equ_mold_name),
                this.$axios.get('/System/equipmentModelMagnifier', {
                    params: {
                        page: this.typePage,
                        pageSize: 5,
                        equipment_model_name:this.equ_name,
                    }
                }).then((res) => {
                    let ret = res.data.response;
                    if (ret.code == 1) {
                        this.deviceTypeList = ret.data.Rows;
                        this.totalNum = ret.data.Total
//                        console.log("this.deviceTypeList +" +JSON.stringify(this.deviceTypeList))
                    }
                }).catch((err) => {
                    console.log(err);
                });
            },
            pageChange(page){
                this.typePage = page;
                this.deviceType();
            },
            toSelectType(rowData){
                this.selectRowType = rowData;
            },
            deviceSelected(){
                let deviceId = this.selectRowType.tBdEquipmentModelId;
                this.workForm.equId = deviceId;
                this.workForm.equ_type = this.selectRowType.tBdEquipmentModelName;
                /*this.watchRely();
                this.typeFocus = false;*/
                this.toSearch_equment();
            },
            emptyEquType(){
                this.workForm.equId = "";
                this.workForm.equ_type = "";
                /*this.typeFocus = true;
                this.watchRely();*/
                this.toSearch_equment();
            },
            /*3、设备型号  E */

            /*4、设备类型  S */
            openEquMold(){
                this.equ_mold_modal = true;
                this.equMoldReload();
            },
            equMoldReload(){
                this.$axios.get('/System/equipmentTypeMagnifier', {
                    params: {
                        page: this.equMoldPage,
                        pageSize: 5,
                        equipment_name:this.equ_mold_name
                    }
                }).then((res) => {
                    let ret = res.data.response;
                    if (ret.code == 1) {
                        this.equMoldList = ret.data.Rows;
                        this.equMoldTotal = ret.data.Total
                    }
                }).catch((err) => {
                    console.log(err);
                });
            },
            toSelectEquMold(rowData){
                this.selectRowequMold = rowData;
            },
            equMoldSelected(){
                this.workForm.equ_mold = this.selectRowequMold.tBdEquipmentTypeName;
                this.workForm.equ_moldId = this.selectRowequMold.tBdEquipmentTypeId;
                this.treeSiteDataSelected = [];
                this.toSearch_equment();
                this.moldFocus = false;
//                this.watchRely();
            },
            emptyEquMold(){
                this.workForm.equ_mold = "";
                this.workForm.equ_moldId = "";
                this.moldFocus = true;
                 /*this.watchRely();*/
                this.toSearch_equment();
            },
            equMoldChange(page){
                this.equMoldPage = page;
                this.equMoldReload();
            },
            /*4、设备类型  E */

            /*5、所属供应商  S */
            //所属供应商
            openSup(){
                this.supply = true;
                this.supplier();
            },
            supplier(){
                this.$axios.get('/System/equipmentManufacturerMagnifier', {
                    params: {
                        page: this.supplyPage,
                        pageSize: 5,
                        manufacturer_name:this.supply_name,
                    }
                }).then((res) => {
                    let ret = res.data.response;
                    if (ret.code == 1) {
                        this.supplierList = ret.data.Rows;
                        this.supplyTotal = ret.data.Total
                    }
                }).catch((err) => {
                    console.log(err);
                });
            },
            supplyChange(page){
                this.supplyPage = page;
                this.supplier();
            },
            toSelectSupplier(rowData){
                this.selectRowSupplier = rowData;
            },
            supplySelected(){
                let sid = this.selectRowSupplier.tBdEquipmentManufacturerId;
                this.workForm.supply = this.selectRowSupplier.tBdEquipmentManufacturerName;
                this.workForm.supplyId = sid;
                /*this.watchRely();
                this.supplyFocus = false;*/
                this.toSearch_equment();
            },
            emptySupplier(){
                this.workForm.supply = "";
                this.workForm.supplyId = "";
                /*this.supplyFocus = true;
                this.watchRely();*/
                this.toSearch_equment();
            },
            /*5、所属供应商  E */
            /*
             * *****************方案管理 form 表单选择初始化 E *******************/


            /*
             * *****************方案管理 Tab-pane S *******************/

            /*1、适用设备 S */

            watchRely(){
               //---kp---监听供应商和所属设备改变的事件--start
                if (this.workForm.equId && this.workForm.supply && this.workForm.equ_mold) {
                    this.toSearch_equment();
                    this.sparePartsSelected = [];
                    this.spareParts_display = [];
                    this.treeSiteDataSelected = [];
                } else {
                    if (!this.workForm.equId) {
                        this.treeTip = "请选择设备型号";
                        this.treeSiteData = [];
                        this.treeSiteDataSelected = [];
                        this.sparePartsSelected = [];
                        this.spareParts_display = [];
                    } else if (!this.workForm.supply) {
                        this.treeTip = "请选择所属供应商！";
                        this.treeSiteData = [];
                        this.treeSiteDataSelected = [];
                        this.sparePartsSelected = [];
                        this.spareParts_display = [];
                    } else if (!this.workForm.equ_mold) {
                        this.treeTip = "请选择设备类型！";
                        this.treeSiteData = [];
                        this.treeSiteDataSelected = [];
                        this.sparePartsSelected = [];
                        this.spareParts_display = [];
                    }
                };
                //---kp---监听供应商和所属设备改变的事件---end
            },
                //kp---适用设备--动态获取组件每次进行添加或删除操作后的数据---开始
            dataSelectedDisa(messagea){
                {
                    //接收传回到页面的已选择数据,赋值给变量：
                    this.treeSiteDataSelected = messagea;
                }
            },
                //kp---适用设备--动态获取组件每次进行添加或删除操作后的数据---结束
                //kp---地点设备列表，树图初始化  --开始:
            toSearch_equment() {
                let vt = this;
                this.$axios.get('/tEamStandardSolution/location/treePV2', {
//                    this.$axios.get('/tEamStandardSolution/location/treeP', {
                    params:{
                        manufacturerId: vt.workForm.supplyId,
                        modelId: vt.workForm.equId,
                        typeId: vt.workForm.equ_moldId,
                    },
                }).then((response) => {
                    let code = response.data.response.code;
                    if (code != 1) {
                        vt.$Message.error(response.data.response.msg);
                    } else {
                        vt.treeSiteData = response.data.response.data;
                        if (!vt.treeSiteData[0].title) {
                            vt.treeTip = "暂无数据";
                        } else {
                            vt.treeTip = "";
                        };
                    }
                }).catch((err) => {
                });
            },
           /* review_eauipment(){
                let vt = this;
                let equeItem = {};
                this.$axios.get('/eamStandardSolution/location/equipmentList', {
                    params: {
                        standardSolutionVersionId: vt.theStandWorkId
                    }
                }).then((response) => {
                    let code = response.data.response.code;
                    if (code != 1) {
                        vt.$Message.error(response.data.response.msg);

                    } else {
                        let theSelectedGet = response.data.response.data;
                        for (var i in theSelectedGet) {
                            equeItem = {
                                "id": theSelectedGet[i].id,
                                'title': theSelectedGet[i].name,
                            }
                            vt.treeSiteDataSelected.push(equeItem);
                        };
                    }
                }).catch((err) => {
                    console.log(err);
                });

            },*/
                //kp---地点设备列表，树图初始化  --结束:

            conditionOfEquipment(){

            },


            /*1、适用设备 E */

            /*2、备品备件 S */
                //kp:编辑页渲染备品备件及适用设备：
            reView_spareParts(){
                /*let vt = this;
                let partsItem = {};
                let bdUom = {};
                this.$axios.post("/eamStandardSolution/listToolsBySolutionVersionId", {
                    standardSolutionVersionId: vt.theStandWorkId
                }).then(function (response) {
                    let code = response.data.response.code;
                    if (code != 1) {
                        vt.$Message.error(response.data.response.msg);
                    } else {
                        let theSelectedGet = response.data.response.data;
                        for (var i in theSelectedGet) {
                            bdUom = {name: theSelectedGet[i].uom_name};
                            partsItem = {
                                "id": theSelectedGet[i].tool_define_id,
                                'tBdSparePartName': theSelectedGet[i].tool_define_name,
                                'number': theSelectedGet[i].quantity,
                                'bdUom': bdUom,
                            }
                            vt.sparePartsSelected.push(partsItem);
                            vt.toAdd_spareParts();
                        }

                    }
                }).catch((err) => {
                    console.log(err);
                });*/
            },
                // kp--备品备件相关--开始
                //可供选择的备品备件列表：
            addBtn_spareParts(){
                /*EAM 三期 与设备条件不相关 LTT*/
                this.sparePartsMod = true;
                this.toSearch = "cansearch";
                /*if (this.workForm.equId && this.workForm.supply) {
                    this.sparePartsMod = true;
                    this.toSearch = "cansearch";
                } else {
                    this.toSearch="cannot";
                    if (!this.workForm.equId) {
                        this.tipMessage = "请选择设备型号！"
                    } else if (!this.workForm.supply) {
                        this.tipMessage = "请选择所属供应商！"
                    }else if (!this.workForm.equ_mold) {
                        this.tipMessage = "请选择设备类型！"
                    }
                    this.commonModal = true;
                };*/
            },
                //kp--获取组件数据
            spareParts_dataSelectedDisa(messagea){
                {
                    //接收传回到页面的已选择数据,赋值给变量：
                    this.sparePartsSelected = messagea;
                }
            },
                //弹出框确认按钮：
            toAdd_spareParts(){
                this.spareParts_display = [];
                for (var i = 0; i < this.sparePartsSelected.length; i++) {
                    this.spareParts_display.push(this.$fc.cloneKey(this.sparePartsSelected[i]));
                    this.spareParts_display[i].number = this.sparePartsSelected[i].number?this.sparePartsSelected[i].number:1;
                };
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

            /*2、备品备件 E */

            /*3、作业项目 S */
            /*项目添加方法*/
            addTpmStandardSolutionAction: function () {
                if(this.tpmStandardSolutionActionTmp.length<50){
                    if(this.workForm.type == 0){
                        this.maintainData.push(this.$fc.cloneKey(this.new_data1));
                        this.tpmStandardSolutionActionTmp = this.maintainData;
                    }else {
                        this.checkModeData.push(this.$fc.cloneKey(this.new_data1));
                        this.tpmStandardSolutionActionTmp = this.checkModeData;
                    }
                } else{
                    this.$Message.error('添加项目过多');
                    this.btnDis = true;
                }

                // 添加完newPerson对象后，重置newPerson对象
            },
            /*上传图片*/
            //图片放大镜：
            /*handleView (index,ind) {
                this.img_modal = true;
                this.imgViewPath = this.tpmStandardSolutionActionTmp[index].images[ind].savePath
            },*/
            //图片删除：
            handleRemove(ind){
                if (this.editAble) {
                    this.$Message.error("查看状态，不可删除");
                    return
                };
                this.tpmStandardSolutionActionTmp[this.onlyindex].images.splice(ind,1);
            },
            handleFormatError(file) {
                this.$Notice.warning({
                    title: '文件格式不正确',
                    desc: '文件 ' + file.name + ' 格式不正确，请上传 jpg 或 png 格式的图片。'
                })
            },
            upSuccessMulti:function (files) {
                this.upLoadFiles = [];
                this.upLoadList = files;
                this.upLoadFiles = this.tpmStandardSolutionActionTmp[this.onlyindex].images;
                this.upLoadFiles = this.upLoadFiles.concat(this.upLoadList);
                this.tpmStandardSolutionActionTmp[this.onlyindex].images = this.upLoadFiles;
                this.editUploadImagesAry = this.tpmStandardSolutionActionTmp[this.onlyindex].images
            },
            getIndex(index){
                this.onlyindex = index;
            },
            handleSuccess(response, file, fileList){
//                console.log(response, file, fileList)
            },

            /*上传图片end*/
            removeTpmStandardSolutionAction: function (index) {
                // 删一个数组元素
                this.tpmStandardSolutionActionTmp.splice(index, 1);
            },



            /*3、作业项目 E */



            /** *****************方案管理 Tab-pane E *******************/
            /** *****************方案管理 保存 S *******************/
            submit(name,id ,workStatus){
                this.submitId = id;
                this.promptModal = true;
                this.workOrNo = workStatus;
                if(workStatus==0){
                    this.workOrNoMess = "保存";
                }else if(workStatus==1){
                    this.workOrNoMess = "生效";
                }
                this.$refs[name].validate((valid) => {
                    var tpm = this.tpmStandardSolutionActionTmp;
                    //键盘空格键判断
                    var re = /^[ ]+$/;
                    if(!valid){
                        this.$Message.error('请完善新增方案信息');
                        this.promptModal = false;
                    }else if(tpm.length==0){
                        this.$Message.error('请添加'+ this.proTitle +'项目');
                        this.promptModal = false;
                    }
                    if(tpm.length!=0){
                        var sum=0;
                        for(var i in tpm){
                            sum = sum + Number(tpm[i].required_time);
                            if(tpm[i].content==''||re.test(tpm[i].content)){
                                this.$Message.error('请完善作业项目信息');
                                this.promptModal = false;
                            } else if( (!Number.isInteger( Number(tpm[i].required_time) )&&tpm[i].required_time!=''&&tpm[i].required_time!=null)||(tpm[i].required_time<=0&&tpm[i].required_time!=''&&tpm[i].required_time!=null)){
                                this.$Message.error( this.proTitle + '耗时请输入大于0的正整数');
                                this.promptModal = false;
                            } else if(sum>this.workForm.requiredTime){
                                this.$Message.error(this.proTitle + '耗时的总和不能超过预计工时');
                                this.promptModal = false;
                            }
                        }
                    }
                    if(this.spareParts_display.length>0){
                        for(var i in this.spareParts_display){
                            var num = Number(this.spareParts_display[i].number)
                            if(!Number.isInteger(num)){
                                this.$Message.error('备品备件数为正整数');
                                this.promptModal = false;
                            }
                            if(num ==''||re.test(num)){
                                this.$Message.error('备品备件数不能为空');
                                this.promptModal = false;
                            }
                            if(num>=9999){
                                this.$Message.error('备品备件数不能超过9999');
                                this.promptModal = false;
                            }
                        }
                    }

                })
            },
            getSave(status ,versionFlag,needStatus){
                this.modal_loading = true;
                this.promptModal = false;
                let saveAry ={};
                //基本信息
                let basicInfo = {
                    "actionRoleId": this.workForm.stationId,//执行岗位
                    "equipmentManufacturerId": this.workForm.supplyId,//供应商
                    "equipmentModelId": this.workForm.equId,//设备型号
                    "isDefaultVersion":this.workForm.isDefaultVersion == true ? 0 : 1,//默认版本
                    "needShutdown": this.workForm.needShutdown == true ? 0 : 1,//是否开机
                    "remark": this.workForm.remark,//注意事项
                    "requiredTime": this.workForm.requiredTime,//预计耗时
                    "standardSolutionVersionId": this.theStandWorkId,
                    "status": status,//状态
                    "typeId": this.workForm.equ_moldId,//设备类型Id
                    "version": this.workForm.version,//版本
                    "needStatus":needStatus,
                };
                //保养项目
                //点检项目
                let maintainInfo = [];
                let checkInfo = [];
                for (let i in this.tpmStandardSolutionActionTmp) {
                    if(this.workForm.type == 0){
                        maintainInfo.push({
                            'sortNo': Number(i) + 1,
                            'content': this.tpmStandardSolutionActionTmp[i].content,
                            'requirement': this.tpmStandardSolutionActionTmp[i].requirement,
                            'requiredTime': this.tpmStandardSolutionActionTmp[i].required_time==null?'':this.tpmStandardSolutionActionTmp[i].required_time,
                            'images': this.tpmStandardSolutionActionTmp[i].images,
                            "standardSolutionSopId": "",
                            "standardSolutionVersionId": this.theStandWorkId
                        });
                    }else {
                        checkInfo.push({
                            'sortNo': Number(i) + 1,
                            'name': this.tpmStandardSolutionActionTmp[i].content,
                            'requirement': this.tpmStandardSolutionActionTmp[i].requirement,
                            'reportMethod': this.tpmStandardSolutionActionTmp[i].reportMethod,
                            'requiredTime': this.tpmStandardSolutionActionTmp[i].required_time==null?'':this.tpmStandardSolutionActionTmp[i].required_time,
                            'images': this.tpmStandardSolutionActionTmp[i].images,
                            "referedPhotoResUserObjId": "",
                            "standardSolutionVersionId": this.theStandWorkId,
                            "eamStandardSolutionItemsId": "",
                        });
                    }

                }
//                console.log("maintainInfo + " + JSON.stringify(maintainInfo));
//                console.log("checkInfo + " + JSON.stringify(checkInfo));
                //备品备件
                let sparePartInfo = [];
                if (this.spareParts_display.length == 0) {
                    sparePartInfo = []
                } else {
                    for (let i in this.spareParts_display) {
                        sparePartInfo.push({
                            'sparePartId': this.spareParts_display[i].tBdSparePartId,
                            'quantity': this.spareParts_display[i].number,
                            'uomId': this.spareParts_display[i].uomId,
                            "standardSolutionSparePartId": "",
                            "standardSolutionVersionId": this.theStandWorkId,
                        })
                    }
                }
                //适用设备
                let equipmentsInfo = [];
                if (this.treeSiteDataSelected.length == 0) {
                    equipmentsInfo = []
                } else {
                    for (let i in this.treeSiteDataSelected) {
                        equipmentsInfo.push({
                            'eamStandardSolutionEquipmentsId': "",
                            "factoryLocationId": this.treeSiteDataSelected[i].id,
                            "standardSolutionVersionId": this.theStandWorkId
                        })
                    }
                }

                saveAry = {
                    "code": this.workForm.code,
                    "equipmentsVos": equipmentsInfo,//适用设备
                    "flag": versionFlag,//flag的参数，表示新增，编辑，新增版本
                    "itemsVos": this.workForm.type == 1 ? checkInfo : [],//点检项目
                    "name": this.workForm.name,
                    "status":this.workForm.status,
                    "needStatus":needStatus,
                    "sopVos": this.workForm.type == 0 ? maintainInfo : [],//保养项目
                    "sparePartVos": sparePartInfo,//备品备件
                    "standardSolutionId": this.workForm.solutionId,//标准方案ID
                    "type": this.workForm.type,
                    "versionVo": basicInfo//基本信息
                };
//                console.log("saveAry +" + JSON.stringify(saveAry));
                this.$axios.post('/tEamStandardSolution/standardSolutionSave',saveAry).then((res) => {
                    var ret = res.data.response;
                    if (ret.code == 1) {
                        this.$Message.success('操作成功！');
                        this.$router.push({path: '/standardwork'})
                    } else {
                        this.$Message.error(ret.msg);
                    }
                    setTimeout(() => {
                        this.modal_loading = false;
                    }, 500);

                }).catch((err) => {
                    console.log(err);
                });
            },
            /** *****************方案管理 保存 E *******************/
            /** *****************方案管理 取消生效 传入值为2 / 作废 传入值为3 / 删除 传入值为1 / 生效 传入值为4 S *******************/
            workNow(){
                if(this.tag == 2){
                    this.submit('workForm',1);
                }
                this.statusChange(this.theStandWorkId,4)
            },
            statusChange(standVersionId,statusFlag){
                let cancelStatusNum,invalidStatusNum,deleteStatusNum,effectiveStatusNum,validModel,messageContent;
                switch (statusFlag){
                    case 2:
                        cancelStatusNum = 2;
                        invalidStatusNum = "";
                        deleteStatusNum = "";
                        effectiveStatusNum = "";
                        validModel = true;
                        break;
                    case 3:
                        cancelStatusNum = "";
                        invalidStatusNum = 3;
                        deleteStatusNum = "";
                        effectiveStatusNum = "";
                        validModel = true;
                        break;
                    case 1:
                        cancelStatusNum = "";
                        invalidStatusNum = "";
                        deleteStatusNum = 1;
                        effectiveStatusNum = "";
                        validModel = true;
                        break;
                    case 4:
                        cancelStatusNum = "";
                        invalidStatusNum = "";
                        deleteStatusNum = "";
                        effectiveStatusNum = 4;
                        this.$refs['workForm'].validate((valid) => {
                            validModel = valid;
                        });
                        if(validModel){
                            let re = /^[ ]+$/;
                            let tpm = this.tpmStandardSolutionActionTmp;
                            if(tpm.length > 0){
                                let sum=0;
                                for(let i in tpm){
                                    sum = sum + Number(tpm[i].required_time);
                                    if(tpm[i].content==''||re.test(tpm[i].content)){
                                        this.$Message.error('请完善作业项目信息');
                                        this.promptModal = false;
                                        validModel=false;
                                    } else if( (!Number.isInteger( Number(tpm[i].required_time) )&&tpm[i].required_time!=''&&tpm[i].required_time!=null)||(tpm[i].required_time<=0&&tpm[i].required_time!=''&&tpm[i].required_time!=null)){
                                        this.$Message.error( this.proTitle + '耗时请输入大于0的正整数');
                                        this.promptModal = false;
                                        validModel=false;
                                    } else if(sum>this.workForm.requiredTime){
                                        this.$Message.error(this.proTitle + '耗时的总和不能超过预计工时');
                                        this.promptModal = false;
                                        validModel=false;
                                    }else {
                                        validModel=true;
                                    }
                                }
                            }else {
                                validModel=false;
                                messageContent = "请至少添加一条方案项目";
                            }
                        }else {
                            validModel=false;
                            messageContent = "请完善方案信息!";
                        }
                        break;
                };
                if(validModel){
                    this.$axios.post('/tEamStandardSolution/standardSolutionToChangeStatus',{
                        standardSolutionVersionId:standVersionId,
                        // 取消按钮（传入值为2）
                        cancelStatus:cancelStatusNum,
                        // 作废按钮（传入值为3）
                        invalidStatus:invalidStatusNum,
                        // 删除按钮（传入值为1）
                        deleteStatus:deleteStatusNum,
                        // 生效按钮（传入值为4）
                        effectiveStatus:effectiveStatusNum,
                        requiredTime:this.workForm.requiredTime,
                    }).then((res) => {
                        var ret = res.data.response;
                        if (ret.code == 1) {
                            this.$Message.success('操作成功');
                            setTimeout(()=>{
                                this.$router.push({path: '/standardwork'})
                            },1000)
                        } else {
                            this.$Message.error(ret.msg)
                        }
                    }).catch((err) => {
                        console.log(err);
                    });
                }else {
                    this.$Message.error(messageContent)
                }
            },
            /** *****************方案管理 取消生效 传入值为2 / 作废 传入值为3 / 删除 传入值为1 / 生效 传入值为4 S *******************/

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

            /*jiazai(id, flag){
                this.$axios.post('tpmStandardSolution/' + id + '/' + flag + '/detail').then((res) => {
                    var result = res.data.response.data.tpmStandardSolutionVersion;
                    var max_version = res.data.response.data.maxVersion;
                    this.workForm = result;
                    this.workForm.isDefaultVersion = true;
                    if (flag == 1) {
                        this.workForm.version = 1;//复制默认1
                    } else {
                        this.workForm.version = parseInt(max_version) + 1;//编辑最高版本基础加1
                    }
                    this.workForm.code = result.tpmStandardSolution.code;
                    this.workForm.name = result.tpmStandardSolution.name;
                    this.workForm.requiredTime = Math.round(parseFloat(result.requiredTime) * 60);
                    if (result.needShutdown == 0) {
                        this.workForm.needShutdown = true;
                    } else {
                        this.workForm.needShutdown = false;
                    }
                    //作业项目
                    var tssa = res.data.response.data.tpmStandardSolutionAction;//TODD
                    this.tpmStandardSolutionActionTmp = tssa;
                    for (var n in tssa) {
                        this.tpmStandardSolutionActionTmp[n].requiredTime = Math.round(parseFloat(tssa[n].requiredTime) * 60);
                    }
                    ;
                    //备品备件需求
                    this.tpmStandardSolutionMaterialTmp = res.data.response.data.tpmStandardSolutionMaterial;
                    //人员需求
                    this.tpmStandardSolutionDeptTmp = res.data.response.data.tpmStandardSolutionDept;
                    //适用设备
                    this.tpmStandardSolutionEquipmentTmp = res.data.response.data.tpmStandardSolutionEquipment;
                    //抑制作业
                    this.tpmStandardSolutionInhibitionTmp = res.data.response.data.tpmStandardSolutionInhibition;
                }).catch((err) => {
                    console.log(err);
                });
            },*/

            popMaterial: function (index) {
                this.tpmStandardSolutionIndex = index;
                this.material_code = true;
            },
            /*chooseVerson: function () {
              let vm = this;
              let msg = this.$Message;
              var versionId = $(".versionTable").find("input[type='radio']:checked").val();
              this.$axios.post('tpmStandardSolution/a/' + versionId).then(function (res) {
                  let ret = res.data.response.data.ret;
                  if (ret == "success") {
                      vm.workForm.isDefaultVersion = false;
                      msg.warning("保存成功");
                  } else if (ret == "false") {
                      msg.warning("保存失败");
                  } else {
                      vm.workForm.isDefaultVersion = false;
                      msg.warning("选择的数据就是默认版本的，无需改动!")
                  }
              })
            },*/

            /*getMaterialType: function () {
                let vmm = this;
                this.$axios.get('tpmStandardSolution/getMaterialType').then(function (response) {
                    //     console.log(response.data.response.data);
                    vmm.materialType = response.data.response.data;
                })
            },*/
            /*selectType: function (value) {
                let vm = this;
                vm.tmp_typeId = value;
//                this.getMaterial(1, value);
            },*/

           /* addData2: function () {
                this.tpmStandardSolutionMaterialTmp.push(this.$fc.cloneKey(this.n_data2));
                // 添加完newPerson对象后，重置newPerson对象
            },
            addData3: function () {
                this.data3.push(this.$fc.cloneKey(this.new_data3));
//                this.data3.push(this.new_data3);
                // 添加完newPerson对象后，重置newPerson对象
            },
            addData4: function () {
                this.data4.push(this.$fc.cloneKey(this.new_data4));
                // 添加完newPerson对象后，重置newPerson对象
            },*/
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
            addTpmStandardSolutionEquipmentTmp: function () {
                this.tpmStandardSolutionEquipmentTmp.push(this.$fc.cloneKey(this.new_tpmStandardSolutionEquipmentTmp));
                // 添加完对象后，重置对象 ,
            },
            addTpmStandardSolutionDeptTmp: function () {
                this.tpmStandardSolutionDeptTmp.push(this.$fc.cloneKey(this.new_tpmStandardSolutionDeptTmp));
                // 添加完newPerson对象后，重置newPerson对象
            },

            saveClickHandler(){
                0
                //        console.log(this.workForm);
            },
            /*getMaterial: function (current, value) {
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
                        value: value,
                    }
                }).then(function (response) {
                    //      vm.materialList = response.data.response.data;

                    var array = new Array();
                    if (response.data.response.data.length != 0) {
                        let tmp = response.data.response.data;
                        vm.numMaterial = tmp[0].numMaterial;
                        for (var i in tmp) {
                            if (i != "unique") {
                                //    var index = tmp[i].index;
                                let materialId = tmp[i].materialId;
                                let innerhtml = '<input type="radio" name="materialId" value="' + materialId + '"/>'
                                let materialCode = tmp[i].materialCode;
                                let materialName = tmp[i].materialName;
                                let modelType = tmp[i].modelType;
                                let materialUnit = tmp[i].materialUnit;
                                let materialTypeId = tmp[i].materialTypeId

                                let tmpMaterial = {
                                    //   "index":index,
                                    "materialId": materialId,
                                    "innerhtml": innerhtml,
                                    "materialCode": materialCode,
                                    "materialName": materialName,
                                    "modelType": modelType,
                                    "materialUnit": materialUnit,
                                    "materialTypeId": materialTypeId
                                }
                                array.push(tmpMaterial);
                            }
                        }
                    } else {
                        vm.numMaterial = 0;
                    }
                    vm.materialList = array;

                })
            },*/

            chooseMaterial: function () {
                let vm = this;
                var tmp = vm.materialList;
                let msg = this.$Message;
                let materialId = $(".materialS").find("input[type='radio']:checked").val();

                point: for (var i in tmp) {
                    if (tmp[i].materialId == materialId) {
                        for (var k in this.tpmStandardSolutionMaterialTmp) {
                            if (("" + this.tpmStandardSolutionMaterialTmp[k].materialId).indexOf(materialId) == 0) {
                                msg.warning("不要重复选择同一条数据!");
                                break point;
                            } else {
                                continue;
                            }
                        }
                        this.tpmStandardSolutionMaterialTmp[this.tpmStandardSolutionIndex].materialId = materialId;
                        this.tpmStandardSolutionMaterialTmp[this.tpmStandardSolutionIndex].materialCode = tmp[i].materialCode;
                        this.tpmStandardSolutionMaterialTmp[this.tpmStandardSolutionIndex].materialName = tmp[i].materialName;
                        this.tpmStandardSolutionMaterialTmp[this.tpmStandardSolutionIndex].materialUnit = tmp[i].materialUnit;
                        this.tpmStandardSolutionMaterialTmp[this.tpmStandardSolutionIndex].materialTypeId = parseInt(tmp[i].materialTypeId);
                    }
                }
            },

            /************************************* 抑制方案放大镜 start *********************************************************** */
            /*removeTpmStandardSolutionInhibitionTmp: function (index) {
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
             //                            this.tpmStandardSolutionInhibitionTmp[index].version = -1;
             return;
             }
             }
             }
             //                console.log(this.tpmStandardSolutionInhibitionTmp[index].version);
             },
             initTpmss: function (page) {
             //                console.log(page);
             let vm = this;
             this.$axios.get('tpmStandardSolution/getAllSolution', {
             params: {
             page: page,
             //                        bdEquipmentId: bdEquipmentId
             }
             }).then((res) => {
             let dataRes = res.data.response.data;
             //                    console.log(dataRes.Rows);
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
             //                    console.log(vm.tpmss);
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
             //                    console.log("vm.tpmStandardSolutionInhibitionTmp: " + JSON.stringify(vm.tpmStandardSolutionInhibitionTmp));
             }).catch((err) => {
             console.log(err);
             });
             }
             },*/
            /************************************* 抑制方案放大镜 end *********************************************************** */

            //分页
            /*changeMaterial: function (current) {
                let vm = this;
                var value = vm.tmp_typeId;
                this.getMaterial(current, value);
            },*/
            //            作废


            removeData2: function (index) {
                // 删一个数组元素
//                console.log(111);
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
            removeData5: function (index) {
                // 删一个数组元素
                this.data5.splice(index, 1);
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
                                emptyTitle.push('备品备件');
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
                        $(this).val(Math.ceil($(this).val()));
                    }
                    if (!$(this).val()) {
                        let index = $(this).parents(".checkTab").index();
                        switch (index) {
                            case 0:
                                blankTitle.push('作业项目');
                                break;
                            case 1:
                                blankTitle.push('备品备件');
                                break;
                                /* case 2:
                                 blankTitle.push('人员需求');
                                 break;*/
                            case 2:
                                blankTitle.push('适用设备');
                                break;
                                /*case 4:
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
                if (!Number.isInteger(val)) {
                    this.workForm.requiredTime = 0;
                    this.$Message.error('请输入整数!');
                }
                else if(val>=9999){
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
                if(val>=9999){
                	this.$Message.error(this.proTitle + '耗时不能超过9999');
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
            /************************************* 人员班组放大镜 start *********************************************************** */
            /*removeTpmStandardSolutionDeptTmp: function (index) {
                this.tpmStandardSolutionDeptTmp.splice(index, 1);
            },
            ssDepartmentIndex: function (index) {
                this.tpmStandardSolutionIndex = index;
                this.department_code = true;
//                console.log("index: "+ this.tpmStandardSolutionIndex);
            },
            initTpmDept: function (page) {
//                console.log(page);
                let vm = this;
                this.$axios.get('tpmStandardSolution/bdShift', {
                    params: {
                        page: page,
//                        bdEquipmentId: bdEquipmentId
                    }
                }).then((res) => {
                    let dataRes = res.data.response.data;
                    console.log(dataRes.Rows);
                    vm.tpmDeptTotal = dataRes.Total;
                    vm.tpmDept = new Array();
//                    console.log("lai ba "+dataRes);
                    for (let o in dataRes.Rows) {
                        if (o != "unique") {
                            let obj = {};
                            obj["id"] = dataRes.Rows[o].teamId;
                            obj["code"] = dataRes.Rows[o].teamCode;
                            obj["name"] = dataRes.Rows[o].teamName;
                            obj["radio"] = "<input type='radio' name='tpmdept_radio' value='" + dataRes.Rows[o]["teamId"] + "'>";
                            vm.tpmDept.push(obj);
                        }
                    }
//                    console.log(vm.tpmDept);
                }).catch((err) => {
                    console.log(err);
                });
            },
            selectDept: function () {
                let tpmDeptId = this.$jq("input[name='tpmdept_radio']:checked").val();
                let index = this.$fc.arrIndexOfObj("id", tpmDeptId, this.tpmDept);
                /!********************************!/
                let arr = new Array();
//                alert(JSON.stringify(this.tpmStandardSolutionDeptTmp));
                for (let x in this.tpmStandardSolutionDeptTmp) {
                    arr.push(this.tpmStandardSolutionDeptTmp[x].teamId + "");
                }
                let exists = this.$jq.inArray(tpmDeptId, arr);//班组id不存在，则返回-1
                if (exists !== -1) {
                    this.$Message.warning("班组已选择，请重新选择！");
                    return;
                }

                /!********************************!/

                console.log(index);
                if (index !== -1) {
                    this.tpmStandardSolutionDeptTmp[this.tpmStandardSolutionIndex].teamName = this.tpmDept[index].name;
                    this.tpmStandardSolutionDeptTmp[this.tpmStandardSolutionIndex].teamCode = this.tpmDept[index].code;
                    this.tpmStandardSolutionDeptTmp[this.tpmStandardSolutionIndex].teamId = tpmDeptId;
                }
            },*/
            /************************************* 人员班组放大镜 end *********************************************************** */

            /************************************* 适用设备 start *********************************************************** */
            /*removeTpmStandardSolutionEquipmentTmp: function (index) {
                this.tpmStandardSolutionEquipmentTmp.splice(index, 1);
            },
            sbEquipmentIndex: function (index) {
                this.tpmStandardSolutionIndex = index;
                this.equipment_code = true;

            },
            /!*初始化地点得树结构*!/
            getLocationTree: function () {
                let vm = this;
                this.$axios.post("tpmStandardSolution/getLocationTree").then(function (response) {
                    var object = response.data.response.data;
                    vm.baseData = object;
                });
            },
            /!*点击树节点得分子节点 通过树节点ID  获取设备*!/
            getLocationId (node){
                if (node[0]) {
                    console.log("Location名称是" + node[0].title + "-----" + "对应的id--code是" + node[0].locationId);
                    this.locationId = node[0].locationId;
                    this.getEquipmnet(0, this.locationId);
                }
            },
            /!*table页面获取选中行的数据*!/
            selectSb: function () {
                let tpmsbId = this.$jq("input[name='tpmsb_radio']:checked").val();
                let index = this.$fc.arrIndexOfObj("equipmentId", tpmsbId, this.tpmsb);
                if (index !== -1) {
                    let vm = this;
//                         vm.tpmStandardSolutionEquipmentTmp[vm.tpmStandardSolutionIndex].equipmentId = tpmsbId;
//                         vm.tpmStandardSolutionEquipmentTmp[vm.tpmStandardSolutionIndex].equipmentCode = this.tpmsb[index].equipmentCode;
//                         vm.tpmStandardSolutionEquipmentTmp[vm.tpmStandardSolutionIndex].equipmentName = this.tpmsb[index].equipmentName;
                    let tpmsb = this.tpmsb;
                    point: for (var i in tpmsb) {
                        if (tpmsb[i].equipmentId == tpmsbId) {    //判断查询出的所有数据的id是否包括你选的数据的id
                            for (var k in vm.tpmStandardSolutionEquipmentTmp) {       //vm.tpmStandardSolutionEquipmentTmp是要渲染到页面的数据的数组
                                if (("" + vm.tpmStandardSolutionEquipmentTmp[k].equipmentId).indexOf(tpmsbId) == 0) {   //判断数组里是否已经存在你选择的id
                                    //console.log("不能重复选择同一款设备");
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
            /!*分页*!/
            changeEquipment: function (currentPage) {
                this.tpmsbCurrent = currentPage;
                this.getEquipmnet(currentPage, this.locationId);
            },

            /!*设备选择*!/
            selectEquipment: function () {
                let str = new String
                for (let val of this.equipment_chk_targetKeys) {
                    str = str + val + '/'
                }
                this.EquipmentTmp.equipment_chk_val = str.substring(0, str.length - 1)
            },*/
            /************************************* 适用设备 end *********************************************************** */
            //标准方案保存
            saveSolution: function () {
                let vm = this;
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

//                console.log(this.tpmStandardSolutionActionTmp);
                var tpmStandardSolutionVersion = [{
                    "endTime": this.workForm.endTime,
                    "needShutdown": needShutdown,
                    "isDefaultVersion": isDeFaultVersion,
                    "requiredTime": this.workForm.requiredTime,
                    "startTime": this.workForm.startTime,
                    "version": parseInt(this.workForm.version),
                    "remark": this.workForm.remark
                }];
                var tss;
                if (this.tag == 0) { //编辑 0  需要带tpmssId
                    tss = {
                        'id': this.tpmStandardSolutionId,//solutionId
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
                }
                ;
//                console.log(JSON.stringify(this.tpmStandardSolutionActionTmp));
                if (this.tag == 1) {//复制 1  不需要带tpmssId
                    tss = {
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
                }
                if (this.$fc.iSubmit(this))
                    this.$axios.post('tpmStandardSolution/saveTpmProgram', tss).then((res) => {
                        let ret = res.data.response.data.ret;
                        if (ret == "success") {
                            this.load_fix = true;
                            this.load_fix_info = '保存中，请稍候......';
                            setTimeout(function () {
                                vm.$router.push({path: '/standardwork'});
                            }, 1000);
                            //this.$Message.warning("保存成功");
                            //this.$router.push({path: '/standardwork'});
                        } else {
                            this.$Message.warning("保存失败");
                            vm.isubmit = false;
                        }
                    }).catch((err) => {
                        console.log(err);
                        vm.isubmit = false;
                    });
            },
            /*************详情接口 xulin****************/
            /*detail(id, flag) {
                this.$axios.post('/eamStandardSolution/' + id + '/' + flag + '/getVersionDetails').then((res) => {
                    console.log(res.data.response);
                    var result = res.data.response.data;
                    if (res.data.response.code == 1) {
                        this.workForm = result;
//                      this.workForm.requiredTime = Number(result.requiredTime)
                    	this.workForm.needShutdown = result.needShutDown == 0? true:false; //是否停机
                        this.workForm.statusText = result.status == 0? '制单中':result.status == 1?'生效中':'已失效';
                        this.workForm.isDefaultVersion = result.isDefaultVersion == 0? true:false; //是否默认版本
                        this.workForm.type=String(result.type);
//                      this.stationId = result.actRoleId;
                        this.workForm.equ_type = result.model_name; //设备型号
                        this.workForm.equId = result.model_id;
                        this.workForm.supply = result.manufacturer; //所属供应商

                        //--kp--详情页进来会默认查询适用设备的关联树：
                        this.toSearch_equment();
                        //end
                    }
                    else {
                        this.$Message.error(res.data.response.msg)
                    }

                }).catch((err) => {
                    console.log(err);
                });
            },*/
            //版本管理列表


            /*aboutStation(val){
              if(val == "0"){
                this.standard = '0'
              }
              else{
                this.standard = '1'
              }

            },*/
            /*************详情接口 xulin end****************/

            /*//作业项目接口
            operatingItem(){
                this.$axios.post('eamStandardSolution/a/' + this.tmp_nid).then((res) => {
                    let ret = res.data.response;
//                  console.log(ret);

                    if (ret.code == 1) {
                        for (var i in ret.data) {
                        	if(ret.data[i].required_time!=''){
                        		ret.data[i].required_time = Number(ret.data[i].required_time); 
                        	}
                        	else{
//                      		console.log('时间为空呀呀呀呀')
                        		ret.data[i].required_time = null
                        	}
                        }
                        this.tpmStandardSolutionActionTmp = ret.data;

                    }

//                  console.log(this.tpmStandardSolutionActionTmp)

                })
            },*/

            //作废
            cancelPlan (cancelId) {
                this.load = true;
                this.delModal = false;
                if (cancelId == 0) {
                    var http = 'eamStandardSolution/invalidEamStandardSolution'; //作废
                    var del = '作废'
                }
                else {
                    var http = 'eamStandardSolution/deleteEamStandardSolution'; //删除
                    var del = '删除';
                }
                this.$axios.post(http, {standardSolutionVersionId: this.tmp_nid}).then((res) => {
                    let ret = res.data.response;
//                  console.log(ret)
                    if (ret.code == 1) {
                        this.$Message.success(del + '成功');
                        this.$router.push({path: '/standardwork'})
                    }
                    else {
                        this.$Message.error(ret.msg);
                    }
                    setTimeout(() => {
                        this.load = false;
                    }, 500);
                })

            },
            delPrompt(i){
                this.delId = i;
                if (i == 0) {
                    this.del = '作废'
                }
                else {
                    this.del = '删除'
                }
                this.delModal = true;

            },
            /********生效 xulin**********/


            change(i){
//          	console.log(i.length);
            	if(i.length>=100){
            		this.$Message.error('字数不能超过100字符')
            	}
            },
            lengthChange(i){
            	if(i.length>=20){
            		this.$Message.error('字数不能超过20字符')
            	}
            },
            remarkChange(i){
            	if(i.length>=1000){
            		this.$Message.error('字数不能超过1000字符')
            	}
            },
            //查询时验证输入框不能为英文单双引号
            toValidate(msg) {
                var str = /[=+%!<>"'/_,()\\]/;
                if (str.test(msg)) {
                    this.$Message.warning("输入格式错误");
                    msg = msg.replace(/\'/g,"").replace(/\"/g,"").replace(/\+/g,"").replace(/\=/g,"").replace(/\%/g,"").replace(/\!/g,"").replace(/\</g,"").replace(/\>/g,"").replace(/\//g,"").replace(/\_/g,"").replace(/\,/g,"").replace(/\(/g,"").replace(/\)/g,"").replace(/\\/g,"");
                }
                return msg;
            },
            backPage() {
                this.$router.back();
            }
        }
    }
</script>

<style>
    .ivu-upload-select{
        display: block;
    }
    .demo-upload-nameP{
        text-align: left;
        width: 80%;
        height: 100%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        cursor: pointer;
    }
    .bzzy-change .btn-group {
        margin: 15px 0px;
        text-align: center;
    }

    .bzzy-change .btn-group button {
        margin: 0px 10px;
    }

    .bzzy-change .btn-group {
        margin: 15px 0px;
        text-align: center;
    }

    .bzzy-change .btn-group button {
        margin: 0px 10px;
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

    .pro{
    	display: inline-block;
	    margin-right: 4px;
	    line-height: 1;
	    font-family: SimSun;
	    font-size: 14px;
	    color: #ed3f14;
	    /*width: 20px;*/
	    position: absolute;
	    left: 5px;
	    top: 15px;
    }
</style>
