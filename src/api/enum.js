import $ from 'jquery';
import {baseUrl} from './http';
import fc from './fc';

let token = fc.data.token;

var base_info = {

    // allENum:{},
    yesOrNoEnum                         : [],                   /*是否枚举*/
    timeUnitEnum                        : [],                   /*时间枚举*/

    commonAttachmentFormatEnum          : [],                   /*附件格式*/

    bdFactoryLocationType               : [],                   /*工厂类型*/
    stockStatus                         : [],                   /*库存状态*/
    transportType                       : [],                   /*运输方式*/
    purchaseStatus                      : [],                   /*采购状态*/
    bdFactoryEquipmentStatusEnum        : [],                   /*设备状态*/
    bdFactoryEquipmentWeightsEnum       : [],                   /*设备权重*/
    tBdSparePartUseTypeEnum             : [],                   /*备件使用类型*/

    eamStandardSolutionType             : [],                   /*方案类型*/
    eamStandardSolutionStatus           : [],                   /*方案状态、方案版本状态*/
    eamCheckReportMethodEnum            : [],                   /*点检上报方式*/

    planIntervalTime                    : [],                   /*计划周期触发间隔*/
    planType                            : [],                   /*计划类型*/
    planStatus                          : [],                   /*计划状态*/
    planControlType                     : [],                   /*计划层级/控制类型*/
    planClazz                           : [],                   /*计划等级*/
    plancheduleType                     : [],                   /*调度类型*/

    auditStatus                         : [],                   /*审核状态*/

    onTimeStatusEnum                              : [],              /*报警设置 - 准点状态*/
    responseNodeEnum                              : [],              /*报警设置 - 响应节点*/
    tEamAlarmSettingEnum                         : [],              /*报警设置 - 报警类型*/
    tEamAlarmStatusEnum                          : [],              /*报警设置 - 报警状态*/
    tEamResponseTimeUnitEnum                    : [],              /*报警设置 - 时间间隔*/
    tEamPlanAuditSettingRangeSettingsEnum     : [],              /*分流设置 - 范围设置*/
    manufacturerStatusEnum					    : [],              /*供应商-状态*/
    executionStatusEnum					        : [],              /*工单-执行状态*/
    tEamDispatchOrderTypeEnum					: [],              /*工单-工单类型*/
    tEamOrderIntimeStatusEnum					: [],              /*工单-超时状态*/
    tEamPlanLevelEnum                               : [],              /*计划level*/
    tEamSparePartApplicationTyepEnum            : [],              /*备件申领--已申领,未申领*/
    warehouseIODirectionEnum					:[],                /*出入库方向-枚举*/

    // 长华版--添加枚举 ==================
    tEamApproveDispatchOrderStatusEnum					:[],/*工单执行流程-状态*/
    tEamApprovePlanStatusEnum					        :[],/*保养计划审核流程-状态*/
    tEamEquipmentInvoiceTypeEnum					    :[],/*发票类型*/
    tEAMEquipmentAssetsStatusEnum					    :[],/*资产状态*/
    tEAMEquipmentAssetsClassificationEnum			    :[],/*设备类别*/
    tEamAttachmentTypeEnum					            :[],/*随机附件类型*/
    tEamPlanEffectivePeriodEnum					        :[],/*有效期限*/
    tEamPersonSexEnum					                    :[],/*性别枚举-t_bd_person*/
    tEamPersonStatusEnum					                :[],/*离职状态枚举-t_bd_person*/
    tEamRepairTypeEnum					                :[],/*报修类型-repair_type*/
    tEamRepairApprovalStatusEnum					    :[],/*处理状态-approval_status*/
    tEamEquipmentEventActionEnum					    :[],/*处理操作-action*/
    importTemplatesEnum					                :[],/*导入Excel模板信息*/
    importStrategyEnum					:[],/*导入策略*/
    tEamSparePartReturnStatusEnum					:[],/*备件退料-状态*/
    tEamEquipmentRequestForOutsourceRepairFormDemageCauseEnum					:[],/*损坏原因分析*/
    tEamEquipmentRequestForOutsourceRepairFormFeedBackEnum					:[],/*维修效果反馈*/

    init: function() {
        console.log("enum init...")
        base_info.ajax_all_enum_func();
        console.log("enum ok.")
    },

    ajax_all_enum_func : function() {
        if(sessionStorage['allENum'] === undefined || sessionStorage['allENum'] === "undefined") {
            // if(fc.getTokenFromCookie() !== "") {
            console.log("base_info init ...")
            $.ajax({
                url : baseUrl() + '/info/enum/all?'+token+'='+ fc.getTokenFromCookie(),
                type : 'GET',
                async: false,
                success : function (data) {
                    if(data.response.code === 1) {
                        // console.log("data.response.data: " + JSON.stringify(data.response.data))
                        sessionStorage['allENum'] = JSON.stringify(data.response.data);
                        // for(var o in sessionStorage['allENum']) {
                        //     sessionStorage[o] = sessionStorage['allENum'][o];
                        //     console.log(sessionStorage[o] + "  sessionStorage[o]")
                        // }
                    }else {
                        sessionStorage['allENum'] = undefined;
                        // fc.clearAllCookie();
                        fc.clearAllCookie();
                        console.log("need login: " + data.response.msg);
                        window.location.href = data.response.msg;
                    }
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    console.log(XMLHttpRequest.status);
                    console.log(XMLHttpRequest.readyState);
                    console.log(textStatus);
                    console.log(errorThrown);
                }
            });
            // }
        }

        if(sessionStorage['allENum'] !== undefined && sessionStorage['allENum'] !== "undefined") {
            if(base_info.yesOrNoEnum.length == 0
                || base_info.timeUnitEnum.length == 0
                || base_info.commonAttachmentFormatEnum.length == 0
                || base_info.bdFactoryLocationType.length == 0
                || base_info.stockStatus.length == 0
                || base_info.transportType.length == 0
                || base_info.purchaseStatus.length == 0
                || base_info.bdFactoryEquipmentStatusEnum.length == 0
                || base_info.bdFactoryEquipmentWeightsEnum.length == 0
                || base_info.tBdSparePartUseTypeEnum.length == 0
                || base_info.eamStandardSolutionType.length == 0
                || base_info.eamStandardSolutionStatus.length == 0
                || base_info.eamCheckReportMethodEnum.length == 0
                || base_info.planIntervalTime.length == 0
                || base_info.planType.length == 0
                || base_info.planStatus.length == 0
                || base_info.planControlType.length == 0
                || base_info.planClazz.length == 0
                || base_info.plancheduleType.length == 0
                || base_info.auditStatus.length == 0
                || base_info.onTimeStatusEnum.length == 0
                || base_info.responseNodeEnum.length == 0
                || base_info.tEamAlarmSettingEnum.length == 0
                || base_info.tEamAlarmStatusEnum.length == 0
                || base_info.tEamResponseTimeUnitEnum.length == 0
                || base_info.tEamPlanAuditSettingRangeSettingsEnum.length == 0
                || base_info.manufacturerStatusEnum.length == 0
                || base_info.executionStatusEnum.length == 0
                || base_info.tEamDispatchOrderTypeEnum.length == 0
                || base_info.tEamOrderIntimeStatusEnum.length == 0
                || base_info.tEamPlanLevelEnum.length == 0
                || base_info.tEamSparePartApplicationTyepEnum.length == 0
                || base_info.warehouseIODirectionEnum.length == 0

                // 长华版--添加枚举 ==================
                || base_info.tEamApproveDispatchOrderStatusEnum.length == 0
                || base_info.tEamApprovePlanStatusEnum.length == 0
                || base_info.tEamEquipmentInvoiceTypeEnum.length == 0
                || base_info.tEAMEquipmentAssetsStatusEnum.length == 0
                || base_info.tEAMEquipmentAssetsClassificationEnum.length == 0
                || base_info.tEamAttachmentTypeEnum.length == 0
                || base_info.tEamPlanEffectivePeriodEnum.length == 0
                || base_info.tEamPersonSexEnum.length == 0
                || base_info.tEamPersonStatusEnum.length == 0
                || base_info.tEamRepairTypeEnum.length == 0
                || base_info.tEamRepairApprovalStatusEnum.length == 0
                || base_info.tEamEquipmentEventActionEnum.length == 0
                || base_info.importTemplatesEnum.length == 0
                || base_info.importStrategyEnum.length == 0
                || base_info.tEamSparePartReturnStatusEnum.length == 0
                || base_info.tEamEquipmentRequestForOutsourceRepairFormDemageCauseEnum.length == 0
                || base_info.tEamEquipmentRequestForOutsourceRepairFormFeedBackEnum.length == 0

            ) {
                var allENum = JSON.parse(sessionStorage['allENum']);
                var obj = {
                    code: -1,
                    name: "全部",
                    desc: "全部"
                };

                for(var o in allENum) {
                    base_info[o] = [];
                    base_info[o].push(obj);
                    base_info[o + "2"] = [];
                    for (var i in allENum[o]) {
                        base_info[o].push(allENum[o][i]);
                        base_info[o + "2"].push(allENum[o][i]);
                    }
                    // console.log(o, base_info[o])
                }
            }
        }
    },

    /**
     * 该枚举编码是否合法
     * @param code      code编码
     * @param _enum     枚举
     * @returns {boolean}   true:非法;
     */
    isIllegal: function(code, _enum) {
        if (_enum === undefined || !Array.isArray(_enum))
            return true;
        for(let o in _enum) {
            if(_enum[o].code === code)
                return false;
        }
        return true;
    },

    /**
     * 获取枚举名称
     * @param code
     * @param _enum
     * @returns {*}
     */
    getDescByCode: function(code, _enum) {
        if (_enum === undefined || !Array.isArray(_enum))
            return undefined;
        for(let o in _enum) {
            if(_enum[o].code === code)
                return _enum[o].desc;
        }
        return undefined;
    },

    /**
     * 获取枚举编码
     * @param code
     * @param _enum
     * @returns {*}
     */
    getCodeByDesc: function(desc, _enum) {
        if (_enum === undefined || !Array.isArray(_enum))
            return undefined;
        for(let o in _enum) {
            if(_enum[o].desc === desc)
                return _enum[o].code;
        }
        return undefined;
    },


}

export default base_info;
