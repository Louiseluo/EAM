<template>
    <div class="date-index">
        <div class="legend-status">
            <ul>
                <li v-for="item in statusColorAry">
                    <span :style="item.bgRGB" class="statusIcon"></span>
                    {{item.desc}}
                </li>
            </ul>
        </div>
        <div id="calendar"></div>
    </div>
</template>

<script>
    //使用jquery渲染
    import $ from 'jquery'
    import './../../../node_modules/fullcalendar/dist/fullcalendarforIndex.js'
    import './../../../node_modules/fullcalendar/dist/locale/zh-cn.js'
    //    import './../../common/js/jquery-ui.min.js'
    import 'moment'
    require("../../common/css/fullcalendar.css")

    export default {
        data (){
            return{
                columns: {
                    name:'设备名称',
                    style:'作业类型',
                    work:'标准方案名称',
                    man:'人员需求',
                    time:'计划工时'
                },
                workOrderInfo: [],
                statusColorAry: {
                    '0': {
                        bgRGB:"background-Color:rgba(137,255,245,0.5)",
                        RGB:"rgba(137,255,245,0.5)",
                        desc:'已制单'
                    },
                    '2': {
                        bgRGB:"background-Color:rgba(255,127,0,0.5)",
                        RGB:"rgba(255,127,0,0.5)",
                        desc:'已通知'
                    },
                    '7': {
                        bgRGB:"background-Color:rgba(255,62,150,0.5)",
                        RGB:"rgba(255,62,150,0.5)",
                        desc:'已下发'
                    },
                    '8': {
                        bgRGB:"background-Color:rgba(255,137,140,0.5)",
                        RGB:"rgba(255,137,140,0.5)",
                        desc:'MES执行中'
                    },
                    '11': {
                        bgRGB:"background-Color:rgba(37,126,74,0.5)",
                        RGB:"rgba(37,126,74,0.5)",
                        desc:'已完成'
                    },
                    '14': {
                        bgRGB:"background-Color:rgba(238,238,0,0.5)",
                        RGB:"rgba(238,238,0,0.5)",
                        desc:'已取消'
                    },

                    '6': {
                        bgRGB:"background-Color:rgba(0,102,255,0.5)",
                        RGB:"rgba(0,102,255,0.5)",
                        desc:'缺件暂停'
                    },
                    '17': {
                        bgRGB:"background-Color:rgba(51,0,0,0.5)",
                        RGB:"rgba(51,0,0,0.5)",
                        desc:'待援助'
                    },
                    '18': {
                        bgRGB:"background-Color:rgba(102,0,0,0.5)",
                        RGB:"rgba(102,0,0,0.5)",
                        desc:'OA待审核'
                    },
                    '19': {
                        bgRGB:"background-Color:rgba(102,102,255,0.5)",
                        RGB:"rgba(102,102,255,0.5)",
                        desc:'已修复'
                    },
                    '20': {
                        bgRGB:"background-Color:rgba(204,102,0,0.5)",
                        RGB:"rgba(204,102,0,0.5)",
                        desc:'未修复'
                    },
                    /*"rgba(148,0,211,0.5)",
                     "rgba(255,62,150,0.5)",*/
                }
            }
        },
        mounted(){
//            this.initFullCalendar();
            this.calendarOrderInfo2();
        },
        computed: {
            pageDate: function() {
                let pageDate = [];
                for(let o in this.workOrderInfo) {
                    alert(this.workOrderInfo[o].billNo);
                    let obj = {
                        id: this.workOrderInfo[o].id,
                        title: this.workOrderInfo[o].billNo,
                        start: this.workOrderInfo[o].plannedRunTime,
                        content:{
                            /*columns:vm.columns,
                             data:{
                             name:this.workOrderInfo[o].equipmentName,
                             style:this.workOrderInfo[o].busiTypeName,
                             work:this.workOrderInfo[o].work,
                             man:this.workOrderInfo[o].teamInfo,
                             time:this.workOrderInfo[o].requiredTime,
                             }*/
                        },
                        url: '#/orderDetail?workOrderId=' + this.workOrderInfo[o].id,
                    };
                    if(this.workOrderInfo[o].billType == 1) {
                        obj['color'] = 'rgba(255,137,140,0.5)';
                    }
                    pageDate.push(obj);
                }
                return pageDate;
            },
        },
        methods:{
            initFullCalendar(pageDate) {
                let vm = this;
                $('#calendar').fullCalendar({
                    firstDay: 1,
                    header: {
//                        left: 'listYear month',
                        left: 'month',
                        center: 'title',
                        right: 'prev next'
                    },
                    defaultDate: new Date(),
                    navLinks: false, // can click day/week names to navigate views=
                    eventLimit: true, // allow "more" link when too many events

                    events:pageDate,

                    /* events: [
                     {
                     title: '20170601',
                     start: '2018-06-01',
                     content:{
                     columns:vm.columns,
                     data:{
                     name:'压铸岛1号设备',
                     style:'维修',
                     work:'压铸岛1号设备轴承更换',
                     man:'强电组1人、机修一组2人',
                     time:'3天'
                     }
                     },
                     url: '#/orderDetail',
                     color: 'rgba(255,137,140,0.5)'
                     },
                     {
                     title: '20170602',
                     start: '2017-05-07',
                     url: '#/orderDetail',
                     content:{
                     columns:vm.columns,
                     data:{
                     name:'压铸岛2号设备',
                     style:'维修',
                     work:'压铸岛2号设备轴承更换',
                     man:'强电组1人、机修一组2人',
                     time:'3天'
                     }
                     },
                     color: 'rgba(255,137,140,0.5)'
                     },
                     {
                     id: 999,
                     title: '20170603',
                     url: '#/orderDetail',
                     content:{
                     columns:vm.columns,
                     data:{
                     name:'压铸岛3号设备',
                     style:'维修',
                     work:'压铸岛3号设备轴承更换',
                     man:'强电组1人、机修一组2人',
                     time:'3天'
                     }
                     },
                     start: '2017-05-09T16:00:00'
                     },
                     {
                     id: 999,
                     title: '20170604',
                     url: '#/orderDetail',
                     content:{
                     columns:vm.columns,
                     data:{
                     name:'压铸岛4号设备',
                     style:'维修',
                     work:'压铸岛4号设备轴承更换',
                     man:'强电组1人、机修一组2人',
                     time:'3天'
                     }
                     },
                     start: '2017-05-16T16:00:00'
                     },
                     {
                     id: 123,
                     title: '20170605',
                     url: '#/orderDetail',
                     content:{
                     columns:vm.columns,
                     data:{
                     name:'压铸岛5号设备',
                     style:'维修',
                     work:'压铸岛5号设备轴承更换',
                     man:'强电组1人、机修一组2人',
                     time:'3天'
                     }
                     },
                     start: '2017-05-16T16:00:00'
                     },
                     {
                     title: '20170606',
                     url: '#/orderDetail',
                     content:{
                     columns:vm.columns,
                     data:{
                     name:'压铸岛6号设备',
                     style:'维修',
                     work:'压铸岛6号设备轴承更换',
                     man:'强电组1人、机修一组2人',
                     time:'3天'
                     }
                     },
                     start: '2017-05-11'
                     },
                     {
                     title: 'Meeting',
                     url: '#/orderDetail',
                     content:{
                     columns:vm.columns,
                     data:{
                     name:'压铸岛7号设备',
                     style:'维修',
                     work:'压铸岛7号设备轴承更换',
                     man:'强电组1人、机修一组2人',
                     time:'3天'
                     }
                     },
                     start: '2017-05-12T10:30:00'
                     },
                     {
                     title: 'Lunch',
                     content:{
                     columns:vm.columns,
                     data:{
                     name:'压铸岛8号设备',
                     style:'维修',
                     work:'压铸岛8号设备轴承更换',
                     man:'强电组1人、机修一组2人',
                     time:'3天'
                     }
                     },
                     start: '2017-05-12T12:00:00'
                     },
                     {
                     title: 'Meeting',
                     url: '#/orderDetail',
                     start: '2017-05-12T14:30:00',
                     content:{
                     columns:vm.columns,
                     data:{
                     name:'压铸岛9号设备',
                     style:'维修',
                     work:'压铸岛9号设备轴承更换',
                     man:'强电组1人、机修一组2人',
                     time:'3天'
                     }
                     },
                     color: 'rgba(255,137,140,0.5)'
                     },
                     {
                     title: 'Happy Hour',
                     url: '#/orderDetail',
                     content:{
                     columns:vm.columns,
                     data:{
                     name:'压铸岛10号设备',
                     style:'维修',
                     work:'压铸岛10号设备轴承更换',
                     man:'强电组1人、机修一组2人',
                     time:'3天'
                     }
                     },
                     start: '2017-05-12T17:30:00'
                     },
                     {
                     title: 'Dinner',
                     url: '#/orderDetail',
                     content:{
                     columns:vm.columns,
                     data:{
                     name:'压铸岛1号设备',
                     style:'维修',
                     work:'压铸岛1号设备轴承更换',
                     man:'强电组1人、机修一组2人',
                     time:'3天'
                     }
                     },
                     start: '2017-05-12T20:00:00'
                     },
                     {
                     title: 'Birthday Party',
                     url: '#/orderDetail',
                     content:{
                     columns:vm.columns,
                     data:{
                     name:'压铸岛1号设备',
                     style:'维修',
                     work:'压铸岛1号设备轴承更换',
                     man:'强电组1人、机修一组2人',
                     time:'3天'
                     }
                     },
                     start: '2017-05-13T07:00:00'
                     },
                     {
                     title: 'Click for 开始维修',
                     url: '#/orderDetail',
                     content:{
                     columns:vm.columns,
                     data:{
                     name:'压铸岛1号设备',
                     style:'维修',
                     work:'压铸岛1号设备轴承更换',
                     man:'强电组1人、机修一组2人',
                     time:'3天'
                     }
                     },
                     start: '2017-05-28'
                     },
                     {
                     title: 'Happy Hour',
                     url: '#/orderDetail',
                     content:{
                     columns:vm.columns,
                     data:{
                     name:'压铸岛1号设备',
                     style:'维修',
                     work:'压铸岛1号设备轴承更换',
                     man:'强电组1人、机修一组2人',
                     time:'3天'
                     }
                     },
                     start: '2017-04-12T17:30:00'
                     },
                     {
                     title: 'Dinner',
                     url: '#/orderDetail',
                     content:{
                     columns:vm.columns,
                     data:{
                     name:'压铸岛1号设备',
                     style:'维修',
                     work:'压铸岛1号设备轴承更换',
                     man:'强电组1人、机修一组2人',
                     time:'3天'
                     }
                     },
                     start: '2017-04-12T20:00:00'
                     },
                     {
                     title: 'Birthday Party',
                     url: '#/orderDetail',
                     content:{
                     columns:vm.columns,
                     data:{
                     name:'压铸岛1号设备',
                     style:'维修',
                     work:'压铸岛1号设备轴承更换',
                     man:'强电组1人、机修一组2人',
                     time:'3天'
                     }
                     },
                     start: '2017-04-13T07:00:00'
                     },
                     {
                     title: 'Click for 开始维修',
                     url: '#/orderDetail',
                     content:{
                     columns:vm.columns,
                     data:{
                     name:'压铸岛1号设备',
                     style:'维修',
                     work:'压铸岛1号设备轴承更换',
                     man:'强电组1人、机修一组2人',
                     time:'3天'
                     }
                     },
                     start: '2017-04-28'
                     },
                     {
                     title: 'Meeting',
                     url: '#/orderDetail',
                     start: '2017-03-12T14:30:00',
                     content:{
                     columns:vm.columns,
                     data:{
                     name:'压铸岛1号设备',
                     style:'维修',
                     work:'压铸岛1号设备轴承更换',
                     man:'强电组1人、机修一组2人',
                     time:'3天'
                     }
                     },
                     color: 'rgba(255,137,140,0.5)'
                     },
                     {
                     title: 'Happy Hour',
                     url: '#/orderDetail',
                     start: '2017-03-12T17:30:00',
                     content:{
                     columns:vm.columns,
                     data:{
                     name:'压铸岛1号设备',
                     style:'维修',
                     work:'压铸岛1号设备轴承更换',
                     man:'强电组1人、机修一组2人',
                     time:'3天'
                     }
                     },
                     color: 'rgba(255,137,140,0.5)'
                     },
                     {
                     title: 'Dinner',
                     url: '#/orderDetail',
                     start: '2017-03-12T20:00:00',
                     content:{
                     columns:vm.columns,
                     data:{
                     name:'压铸岛1号设备',
                     style:'维修',
                     work:'压铸岛1号设备轴承更换',
                     man:'强电组1人、机修一组2人',
                     time:'3天'
                     }
                     },
                     color: 'rgba(255,137,140,0.5)'
                     },
                     {
                     title: 'Birthday Party',
                     url: '#/orderDetail',
                     start: '2017-03-13T07:00:00',
                     content:{
                     columns:vm.columns,
                     data:{
                     name:'压铸岛1号设备',
                     style:'维修',
                     work:'压铸岛1号设备轴承更换',
                     man:'强电组1人、机修一组2人',
                     time:'3天'
                     }
                     },
                     color: 'rgba(255,137,140,0.5)'
                     },
                     {
                     title: 'Click for 开始维修',
                     url: '#/orderDetail',
                     start: '2017-03-28',
                     content:{
                     columns:{
                     name:'设备名称',
                     style:'作业类型',
                     work:'标准方案名称',
                     man:'人员需求',
                     time:'计划工时'
                     },
                     data:{
                     name:'压铸岛1号设备',
                     style:'维修',
                     work:'压铸岛1号设备轴承更换',
                     man:'强电组1人、机修一组2人',
                     time:'3天'
                     }
                     },
                     color: 'rgba(255,137,140,0.5)'
                     }
                     ],*/
                    editable: false,
                    /*eventDrop : function( event, delta, revertFunc ){
                     //do something here...
                     let plannedRunTime= event.start._i;
                     let currentTime = Date.parse(new Date(plannedRunTime))/1000;
                     let days  = Number(delta._days);
                     let tag = 0;
                     let flag = true;
                     if(days<0){
                     var now_day = new Date(new Date().setHours(0,0,0,0))/1000;//当前零点时间戳
                     var to_day = currentTime + days * 86400 ;
                     console.log('今日零点时间戳：'+now_day);
                     console.log('移动至时间戳  ：'+to_day);
                     flag = now_day <= to_day ;
                     }

                     if(flag){
                     vm.$Message.destroy();
                     vm.$Modal.confirm({
                     //title: '你确认修改时间么？',
                     content: '你确认修改时间么?',
                     onOk: () => {
                     //                                this.$Message.info('点击了确定');
                     let workOrderId = event.id;
                     vm.$axios.post('/tpmWorkOrder/'+ workOrderId + '/' + days + '/changeCalendar').then((res)=>{
                     console.log(res.data.response.data);
                     let ret = res.data.response.data.ret;
                     if(ret == "success"){
                     vm.$Message.warning("工单时间调整成功");
                     }else{
                     vm.$Message.warning("工单时间调整失败");
                     revertFunc();
                     }
                     }).catch((err)=>{
                     console.log(err);
                     })
                     },
                     onCancel: () => {
                     revertFunc();
                     }
                     });
                     }else{
                     vm.$Message.destroy();
                     vm.$Message.warning("工单调整时间必须大于等于今天");
                     revertFunc();

                     }
                     // ...
                     },*/
                    /*eventMouseover: function( event  ) {
                     vm.$Message.destroy();
                     vm.$Message.info({
                     content: '<table class="table table-bordered table-center mar-tb-10 mar-l-15"><thead><tr><th>'+ event.content.columns.name +'</th>' +
                     '<th>'+ event.content.columns.style +'</th><th>'+ event.content.columns.work +'</th>' +
                     '<th>'+ event.content.columns.man +'</th><th>'+ event.content.columns.time +'</th></tr></thead><tbody>' +
                     '<tr><td>'+ event.content.data.name +'</td><td>'+ event.content.data.style +'</td><td>'+ event.content.data.work +'</td>' +
                     '<td>'+ event.content.data.man +'</td><td>'+ event.content.data.time +'</td></tr></tbody></table>',
                     duration: 5,
                     closable: true
                     });
                     },*/
                    eventClick: function(calEvent, jsEvent, view) {
                        /*alert('Event: ' + calEvent.title);
                         alert('Coordinates: ' + jsEvent.pageX + ',' + jsEvent.pageY);
                         alert('View: ' + view.name);*/
                        vm.$Message.destroy();
                    }

                });
            },
            changeCalendar:function (days,workOrderId) {
                this.$axios.post('/tpmWorkOrder/'+ workOrderId + '/' + days + '/changeCalendar').then((res)=>{
                    let ret = res.data.response.data.ret;
                    if(ret == "success"){
                        this.$Message.warning("工单时间调整成功");
                    }else{
                        this.$Message.warning("工单时间调整失败");
                        revertFunc();
                    }
                }).catch((err)=>{
                    console.log(err);
                })
            },

            calendarOrderInfo: function(month) {
                let vm = this;
                this.$axios.post('/tpmWorkOrder/calendarOrderInfo/'+month).then((res)=>{
                    if(res.data.response.code != 1) {
                        this.$Message.error("页面有错误！")
                        return;
                    }
                    let pageDate = [];
                    let res_data = res.data.response.data;
//                    console.log("res_data + " + JSON.stringify(res_data))
                    for(let o in res_data) {
                        let obj = {
                            title: res_data[o].billNo,
                            start: res_data[o].plannedRunTime,
                            content:{
                                columns:vm.columns,
                                data:{
                                    name:res_data[o].equipmentName,
                                    style:res_data[o].busiTypeName,
                                    work:res_data[o].note,
                                    man:res_data[o].teamInfo,
                                    time:res_data[o].requiredTime,
                                }
                            },
                            url: '#/orderDetail?workOrderId=' + res_data[o].id,
                        };
                        if(res_data[o].busiType == 1) {
                            obj['color'] = 'rgba(255,137,140,0.5)';
                        }
                        pageDate.push(obj);
                    }
                    vm.initFullCalendar(pageDate);
                }).catch((err=>{
                    console.log(err);
                }))
            },

            calendarOrderInfo2: function(){
                let vm = this;
                this.$axios.post('/eamDo/getCalendarOrderInfo').then((res)=>{
                    if(res.data.response.code != 1) {
                        this.$Message.error("页面有错误！")
                        return;
                    }
                    let pageDate = [];
                    let res_data = res.data.response.data;
//                    console.log("res_data +" + JSON.stringify(res_data))
                    for(let o in res_data) {
                        let obj = {
                            id: res_data[o].id,
                            title: res_data[o].billTypeName,
                            start: res_data[o].plannedStartTime,
                            content:{
                                /*columns:vm.columns,
                                 data:{

                                 name:res_data[o].equipmentName,
                                 style:res_data[o].billTypeName,
                                 work:res_data[o].work,
                                 man:res_data[o].teamInfo,
                                 time:res_data[o].requiredTime,
                                 }*/
                            },
                            color:vm.statusColorAry[res_data[o].status].RGB,
//                            url: '#/maintenanceMain?orderId=' + res_data[o].id + '&type='+ res_data[o].billType + '&status='+ res_data[o].status,
                        };
                        /*if(res_data[o].billType == 0) {
                            obj['color'] = 'rgba(255,137,140,0.5)';
                        }*/
                        pageDate.push(obj);
                    }
                    vm.initFullCalendar(pageDate);
                }).catch((err=>{
                    console.log(err);
                }))
            }

        }
    }
</script>

<style>
    #calendar{
        width: 75%;
        margin: 20px auto ;
    }
    .date-index{
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 900;
        overflow-y: auto;
    }
    .legend,.legend-status{
        position: absolute;
        z-index: 901;
        top: 40px;
        right: 12.5%;
    }
    .legend-status{
        top: 20px;
        left:3%;
        width: 140px;
    }
    .legend-status ul li{
        color: #FFFFFF;
        display:block ;
        margin-left: 20px;
        margin-bottom: 10px;
    }
    .legend-status ul li .statusIcon{
        display: inline-block;
        vertical-align: middle;
        height: 15px;
        width: 15px;
        margin-right: 5px;
    }
    .legend ul li{
        color: #FFFFFF;
        display: inline-block;
        margin-left: 20px;
    }
    .legend ul li:last-child:before{
        background-color: rgba(255,137,140,0.5);
    }
    .legend ul li:before{
        content: '';
        display: inline-block;
        vertical-align: middle;
        height: 15px;
        width: 15px;
        margin-right: 5px;
        background-color: rgba(137,255,245,0.5);
    }

    .fc-more-popover {
        z-index: 2;
        width: 400px;
    }
</style>
