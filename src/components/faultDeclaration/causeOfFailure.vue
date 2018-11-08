<template>
    <div>
        <Tabs type="card" :value="firstTabName" @on-click="tabList">
            <TabPane v-for="(tabItem,m) in baseData" :label="tabItem.tabTitle" :key="tabItem.tabName" >
                <Row :gutter="16">
                    <Col span="2" class-name="txt-center font-2">
                        <a @click="scrollLeft"><Icon type="arrow-left-b"></Icon></a>
                    </Col>
                    <Col span="20">
                    <div class="kindsBox">
                        <ul class="kindsUl">
                            <li v-for="(kindItem ,n) in tabItem.data" @click="kindList(m,n)">{{kindItem.kindsTitle}}</li>
                        </ul>
                    </div>
                    </Col>
                    <Col span="2" class-name="txt-center font-2">
                        <a @click="scrollRight"><Icon type="arrow-right-b"></Icon></a>
                    </Col>
                    <Col span="24">
                    <Table stripe border highlight-row :columns="causeColumns" :data="causeData" @on-current-change="selectTr"></Table>
                    <div class="page mar-t-15">
                        <Page :total="40" size="small" show-elevator :page-size="5" ></Page><!--@on-change="changePage"-->
                    </div>
                    </Col>
                </Row>
            </TabPane>
        </Tabs>
        <!--<div class="btn-group text-center">
            <Button type="primary" icon="document-text" size="large" >编辑</Button>
            <Button type="primary" icon="checkmark" size="large" @click="newWindow.modalWin = true">新增</Button>&lt;!&ndash;@click="addWinFun"&ndash;&gt;
            <Button class="btn-gary" icon="close" size="large">返回</Button>
            <Button type="primary" icon="document-text" size="large" >确认</Button>
        </div>-->
        <footer class="text-center">
            <slot name="footer">
            <Button type="primary" icon="document-text" size="large" >编辑</Button>
            <Button type="primary" class="mar-l-10" icon="checkmark" size="large" @click="newWindow.modalWin = true">新增</Button><!--@click="addWinFun"-->
            <Button class="btn-gary mar-l-10" icon="close" size="large">返回</Button>
            <Button type="primary" class="mar-l-10" icon="document-text" size="large" >确认</Button>
            </slot>
        </footer>
    </div>
</template>

<script type="text/ecmascript-6">
    export default {
        props: [
            'baseData',
            'newWindow',
        ],
        data (){
            //验证名称
            return {
                firstTabName:'',
                causeColumns:[
                    {
                        title: '序号',
                        type: 'index',
                        width: 80,
                        align: 'center'
                    },
                    {
                        title: '故障描述',
                        key: 'kindDescribe',
                        align: 'center'
                    },
                ],
                causeData:[],
            }
        },
        mounted(){
            this.dataLoad();
    },
        methods: {
            addWindow:function () {

            },
            dataLoad:function () {
                this.firstTabName = this.baseData[0].tabTitle;
                this.causeData = this.baseData[0].data[0].kindsData;
            },
            tabList:function (name) {
                for(let i=0 ; i<this.baseData.length; i++){
                    if( name == this.baseData[i].tabName){
                        this.causeData = this.baseData[i].data[0].kindsData;
                    }
                }
            },
            kindList:function (m,n) {
                console.log("m +" + m + " n +" + n)
                this.causeData = this.baseData[m].data[n].kindsData
            },
            selectTr:function (current,brefore) {
                console.log("baseData + " + JSON.stringify(this.baseData));
                console.log("brefore +" + JSON.stringify(brefore) + " current +" + JSON.stringify(current))
            },

            scrollLeft:function () {
                let liBox = $(".kindsBox");
                let offset = ($(".kindsBox li").width()) * -1;
                let scrollLeft = liBox.scrollLeft();
                liBox.scrollLeft( scrollLeft + offset)
            },
            scrollRight:function () {
                let liBox = $(".kindsBox");
                let offset = ($(".kindsBox li").width() * 1);
                let scrollLeft = liBox.scrollLeft();
                liBox.scrollLeft( scrollLeft + offset)
            },
        }
    }
</script>

<style type="text/css">
    .kindsBox{
        position: relative;
        height: 44px;
        overflow: hidden;
    }
    .kindsUl{
        white-space: nowrap;
    }
    .kindsUl li{
        display: inline-flex;
        line-height: 30px;
        text-align: center;
        border: 1px solid #dddddd;
        padding: 0 16px;
        margin-top: 8px;
        cursor: pointer;
    }
    .kindsUl li + li{
        margin-left: 10px;
    }
    .kindsUl li:hover{
        background-color: #57a3f3;
        color: #FFFFFF;
    }
    .kindsUl li.active{
        background-color: #0391da;
        color: #FFFFFF;
    }


</style>