import Vue from 'vue'
import {rl} from '../api/http';
import Router from 'vue-router'
import fc from '../api/fc';

//导入路由路径
import  home from '../App';
import  dateindex from '../components/dateIndex/dateIndex.vue';
import  maintainDate from '../components/dateIndex/maintainDate.vue';
import  searchlist from '../components/searchList/searchList.vue';

import  maintenancePlan from '../components/maintenancePlan/maintenancePlan.vue';
import  maintenancePlanAdd from '../components/maintenancePlan/maintenancePlanAdd.vue';
import  maintenancePlanAddaudit from '../components/maintenancePlan/maintenancePlanAddaudit.vue';
import  maintenancePlanEdit from '../components/maintenancePlan/maintenancePlanEdit.vue';
import  maintenancePlanDetail from '../components/maintenancePlan/maintenancePlanDetail.vue';
import  maintenancePlanDetailMonth from '../components/maintenancePlan/maintenancePlanDeatilMonth.vue';
import  maintenancePlanMonthEdit from '../components/maintenancePlan/maintenancePlanMonthEdit.vue';
import  maintenancePlanDetailInterim from '../components/maintenancePlan/maintenancePlanDetailInterim.vue';
import  maintenancePlanInterimEdit from '../components/maintenancePlan/maintenancePlanInterimEdit.vue';
import  maintenancePlanAudit from '../components/maintenancePlan/maintenancePlanAudit.vue';
import  yearEquPlan from '../components/maintenancePlan/yearEquPlan.vue';
/*工单管理*/
import  maintenanceOrder from '../components/maintenanceOrder/maintenanceOrder.vue';
import  maintenanceReturn from '../components/maintenanceOrder/maintenanceReturn.vue';
import  maintenanceOrderDetail from '../components/maintenanceOrder/maintenanceOrderDetail.vue';
import  maintenanceOrderReceipt from '../components/maintenanceOrder/maintenanceOrderReceipt.vue';
import  maintenanceOrderReplenish from '../components/maintenanceOrder/maintenanceOrderReplenish.vue';
import  maintenanceOrderSpareParts from '../components/maintenanceOrder/maintenanceOrderSpareParts.vue';
import  maintenanceTerminal from '../components/maintenanceOrder/maintenanceTerminal.vue';
import  maintenanceConfirm from '../components/maintenanceOrder/maintenanceConfirm.vue';
import  maintenanceMain from '../components/maintenanceOrder/maintenanceOrderReceiptMain.vue';

import  maintenanceWork from '../components/maintenanceWork/maintenanceWork.vue';
import  maintenanceWorkAdd from '../components/maintenanceWork/maintenanceWorkAdd.vue';
import  maintenanceWorkDetail from '../components/maintenanceWork/maintenanceWorkDetail.vue';

import  unrepaired from '../components/unRepaired/unRepaired.vue';
import  unrepairedExecute from '../components/unRepaired/unRepairedExecute.vue';
//保养工单派发
import workOrder from '../components/maintenanceOrder/workOrder.vue'
/*委外维修*/
import maintToAid from '../components/maintenanceOrder/maintenanceOrderToAid.vue'
import applyForOutScource from '../components/maintenanceOrder/applyForOutScource.vue'
/*委外维修工单*/
import orderOutsourced from '../components/maintenanceOrder/maintenanceOrderOutsourced'
import outScourcedReceipt from '../components/maintenanceOrder/outScourcedReceipt.vue'
/*待维修*/
import  unmaintain from '../components/unMaintain/unMaintain.vue';
import  inmaintain from '../components/unMaintain/inMaintain.vue';
import  gomaintain from '../components/unMaintain/goMaintain.vue';
import  sparePartFor from '../components/treeMulitiple/sparePartFor.vue';

import  standardwork from '../components/standardWork/standardWork.vue';
import  standardworkadd from '../components/standardWork/standWorkAdd.vue';
import  standardworkview from '../components/standardWork/standWorkView.vue';
import  standardworkedit from '../components/standardWork/standWorkEdit.vue';
import  equipGeneralLedger from '../components/equipGeneralLedger/equipGeneralLedger.vue';
import  resume from '../components/equipGeneralLedger/resume.vue';
import  equipRegisForm from '../components/equipRegisForm/equipRegisForm.vue';
import  archives from '../components/equipGeneralLedger/archives.vue'

/*维修管理*/
import  fault from '../components/faultDeclaration/faultDeclaration.vue';
import  faultDeclarationJockeyAdd from '../components/faultDeclaration/faultDeclarationJockeyAdd.vue';
import  faultDeclarationAdd from '../components/faultDeclaration/faultDeclarationAdd.vue';
import  faultDeclarationDetail from '../components/faultDeclaration/faultDeclarationDetail.vue';
import  faultDeclarationEdit from '../components/faultDeclaration/faultDeclarationEdit.vue';

import  deptManage from '../components/systemManage/deptManage.vue';
import  userManage from '../components/systemManage/userManage.vue';
import  roleManage from '../components/systemManage/roleManage.vue';
import  planManage from '../components/systemManage/planManage.vue';
import  webManage from '../components/systemManage/webManage.vue';
import  engineManage from '../components/systemManage/engineManage.vue';

/*系统管理*/
import  batchManage from '../components/systemManage/batchManage.vue';
import  systemManage from '../components/systemManage/systemManage.vue';
import  auditShunt from '../components/systemManage/auditShunt.vue';
import  productSchedul from '../components/systemManage/productSchedul.vue';
import  accountAdd from '../components/systemManage/accountAdd.vue';
import  permissionRolesAdd from '../components/systemManage/permissionRolesAdd.vue';
import  personList from '../components/systemManage/personList.vue';
import  person from '../components/systemManage/person.vue';

import  pendInspection from '../components/pendInspection/pendInspection.vue';
import  pendInspectionStart from '../components/pendInspection/pendInspectionStart.vue';

//备品备件
import  spareParts from '../components/spareParts/spareParts.vue';
import  spareAdd from '../components/spareParts/spareAdd.vue';
import  typeManage from '../components/spareParts/typeManage.vue';
import  supplierManage from '../components/spareParts/supplierManage.vue';
import  leadRecord from '../components/spareParts/leadRecord.vue';
//退料记录
import  rejectRecord from '../components/spareParts/rejectRecord.vue';

//设备管理部分---start
import  equipmentList from '../components/equipmentManage/equipmentList.vue';
import  equipmentDetail from '../components/equipmentManage/equipmentDetail.vue';
import  equManufacturerList from '../components/equipmentManage/equManufacturerList.vue';
import  equTypeList from '../components/equipmentManage/equTypeList.vue';
import  equKindList from '../components/equipmentManage/equKindList.vue';
//end

//数据统计部分---start
import dataTrouble from '../components/dataReport/data-trouble.vue';
import dataReplacement from '../components/dataReport/data-replacement.vue';
import dataAppraise from '../components/dataReport/data-appraise.vue';
import dataPerformancet from '../components/dataReport/data-performance.vue';
import dataRecord from '../components/dataReport/data-record.vue';
import dataDepreciation from '../components/dataReport/data-depreciation.vue';
import reportFormTotal from '../components/dataReport/reportFormTotal.vue';

//设备处置---报废 -S-
import equScrapList from '../components/equScrap/equScrapList.vue';
import equScrapSteps from '../components/equScrap/equScrapSteps.vue';
//设备处置---报废 -E-
// 设备改造 -S-
import equReformList from '../components/equReform/equReformList.vue';
import equReformReport from '../components/equReform/equReformReport.vue';
//设备改造 -E-

//设备请购
import equipApply from '../components/ledger/equipApply.vue';
import applyDetails from '../components/ledger/applyDetails.vue';

//设备验收
import toAccept from '../components/equipAccept/toAccept.vue';
import toAcceptDetail from '../components/equipAccept/toAcceptDetail.vue';
import accept from '../components/equipAccept/accept.vue';

import acceptDetail from '../components/equipAccept/acceptDetail.vue';
//end
//流程指南
import processGuidance from '../components/others/processGuidance.vue'
//参数设置
import parameterSetting from '../components/others/parameterSetting.vue'
//公用树图组件：


//
Vue.use(Router);

let router = new Router({
    routes: [
        {path: '/home', component: home},
        {path: '/dateIndex', component: dateindex},
        {path: '/maintainDate', component: maintainDate},
        {path: '/searchList', component: searchlist},
        {path: '/maintenancePlan', component: maintenancePlan, meta:{
            keepAlive: true
        }},
        /*计划管理*/
        {path: '/planAdd', component: maintenancePlanAdd},
        {path: '/planAddaudit', component: maintenancePlanAddaudit},
        {path: '/planEdit', component: maintenancePlanEdit},
        {path: '/planDetail', component: maintenancePlanDetail},
        {path: '/planMonth', component: maintenancePlanDetailMonth},
        {path: '/planMonthEdit', component: maintenancePlanMonthEdit},
        {path: '/planInterim', component: maintenancePlanDetailInterim},
        {path: '/planInterimEdit', component: maintenancePlanInterimEdit},
        {path: '/planAudit', component: maintenancePlanAudit},
        {path: '/yearEquPlan', component: yearEquPlan},
        /*工单管理*/
        {path: '/maintenanceOrder', component: maintenanceOrder, meta: {
            keepAlive: true
        }},
        {path: '/maintenanceReturn', component: maintenanceReturn},
        {path: '/orderDetail', component: maintenanceOrderDetail},
        {path: '/orderReceipt', component: maintenanceOrderReceipt},
        {path: '/orderReplenish', component: maintenanceOrderReplenish},
        {path: '/orderSpareParts', component: maintenanceOrderSpareParts},
        {path: '/orderTerminal', component: maintenanceTerminal},
        {path: '/orderConfirm', component: maintenanceConfirm},
        {path: '/maintenanceMain', component: maintenanceMain},
        {path: '/maintToAid', component: maintToAid},
        {path: '/applyForOutScource', component: applyForOutScource},

        {path: '/maintenanceWork', component: maintenanceWork},
        {path: '/workAdd', component: maintenanceWorkAdd},
        {path: '/workDetail', component: maintenanceWorkDetail},

        {path: '/unRepaired', component: unrepaired,meta:{
            keepAlive: true
        }},
        {path: '/unRepairedExe', component: unrepairedExecute},
        /*待维修*/
        {path: '/unMaintain', component: unmaintain, meta: {
            keepAlive: true
        }},
        {path: '/inMaintain', component: inmaintain},
        {path: '/goMaintain', component: gomaintain},
        /*委外维修工单*/
        {path: '/orderOutsourced', component: orderOutsourced},
        {path: '/outScourcedReceipt', component: outScourcedReceipt},
        /*方案管理*/
        {path: '/standardwork', component: standardwork, meta: {
            keepAlive: true
        }},
        {path: '/standardworkadd', component: standardworkadd},
        {path: '/standardworkview', component: standardworkview},
        {path: '/standardworkedit', component: standardworkedit},
        //设备台账
        {path: '/equipGeneralLedger', component: equipGeneralLedger,meta:{
            keepAlive: true
        }},
        {path: '/resume', component: resume},
        {path:'/equipRegisForm',component:equipRegisForm},
        {path:'/archives',component:archives},
        {path:'/toAccept',component:toAccept,meta:{
            keepAlive: true
        }},
        {path:'/toAcceptDetail',component:toAcceptDetail},
        {path:'/accept', component:accept},
        {path:'/acceptDetail',component:acceptDetail},
        /*维修管理*/
        {path: '/fault', component: fault, meta: {
            keepAlive: true
        }},
        {path: '/faultJockeyAdd', component: faultDeclarationJockeyAdd},
        {path: '/faultAdd', component: faultDeclarationAdd},
        {path: '/faultDetail', component: faultDeclarationDetail},
        {path: '/faultEdit', component: faultDeclarationEdit},
        {path: '/sparePartFor', component: sparePartFor},
        {path: '/deptManage', component: deptManage},
        {path: '/userManage', component: userManage},
        {path: '/roleManage', component: roleManage},
        {path: '/planManage', component: planManage},
        {path: '/webManage', component: webManage},
        {path: '/engineManage', component: engineManage},
        /*系统管理*/
        {path: '/systemManage', component: systemManage},
        {path: '/accountAdd', component: accountAdd},
        {path: '/permissionRolesAdd', component: permissionRolesAdd},
        {path: '/auditShunt', component: auditShunt},
        {path: '/productSchedul', component: productSchedul},
        {path: '/batchManage', component: batchManage, meta: {
            keepAlive: true
        }},
        {path: '/personList', component: personList},
        {path: '/person', component: person},


        {path: '/pendInspection', component: pendInspection},
        {path: '/pendInspectionStart', component: pendInspectionStart},
        //备品备件
        {path: '/spareParts', component: spareParts, meta: {
            keepAlive: true
        }},
        {path: '/typeManage', component: typeManage, meta: {
            keepAlive: true
        }},
        {path: '/supplierManage', component: supplierManage, meta: {
            keepAlive: true
        }},
        {path: '/leadRecord', component: leadRecord, meta: {
            keepAlive: true
        }},
        {path: '/rejectRecord', component: rejectRecord},
        {path: '/spareAdd', component: spareAdd},
        //设备管理---start
        {path: '/equipmentList', component:equipmentList,meta:{
            keepAlive: true
        }},
        {path: '/equipmentDetail', component:equipmentDetail},
        {path: '/equManufacturerList', component:equManufacturerList},
        {path: '/equTypeList', component:equTypeList},
        {path: '/equKindList', component:equKindList},
        //数据统计---start
        {path: '/dataTrouble', component:dataTrouble},
        {path: '/dataReplacement', component:dataReplacement},
        {path: '/dataAppraise', component:dataAppraise},
        {path: '/dataPerformancet', component:dataPerformancet},
        {path: '/dataRecord', component:dataRecord},
        {path: '/dataDepreciation', component:dataDepreciation},
        //设备四个报表之和
        {path: '/reportFormTotal', component:reportFormTotal},
        //设备四个报表之和

        //树图：
        // {path: '/treeUseDetail', component:treeUseDetail}
        //设备处置---报废 -S-
        {path: '/equScrapList', component:equScrapList},
        {path: '/equScrapSteps', component:equScrapSteps},
        //设备处置---报废 -E-
        // 设备改造 -S-
        {path: '/equReformList', component:equReformList},
        {path: '/equReformReport', component:equReformReport},
        //设备改造 -E-
        //设备请购
        {path: '/equipApply', component:equipApply,meta: {
            keepAlive: true
        }},
        {path: '/applyDetails', component:applyDetails},
        //保养工单派发
        {path: '/workOrder', component:workOrder},
        //流程指南
        {path: '/processGuidance', component:processGuidance},
        //参数设置
        {path: '/parameterSetting', component:parameterSetting},

    ]
});


/*跳转页面权限判断*/
// router.beforeEach((to, from, next) => {
//     if(!rl(to.path)) {
//         console.log("Url No permissions.");
//         next(false);
//     }else {
//         next(true);
//     }
// })

export default router;
