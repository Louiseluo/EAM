<!--设备型号弹出框：-->
<template>
    <div class="basic fault-content">
        <!--设备型号弹出框：-->
            <div class="btn-query mar-b-10" style="display: table;margin-bottom: 20px;">
                设备型号  <Input class="mar-l-10" style="width: 160px;" v-model="equipment_model_name" @on-blur="equipment_model_name = toValidate(equipment_model_name)" ></Input>
                <Button type="primary" icon="search" size="large" @click="searchList">
                    查询
                </Button>
            </div>

            <div class="table-reset">
                <table class="table table-bordered table-center table-striped table-blue table-edit typedevice typeTable taDisplay">
                    <thead>
                    <tr>
                        <!--<th>选择</th>-->
                        <th width="150">序号</th>
                        <th>设备型号</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(item,index) in equTypes" class="trDisplay trBga" @click="toSelect(index)">
                        <!--<td><input type="radio" name='checked_radio' class="checkInput_problem"  /></td>-->
                        <td>{{index + 1}}</td>
                        <td class="tdDisplay pointDis" :title="item.modelName">{{item.modelName}}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div class="mar-t-10" style="overflow: hidden">
                <div style="float: right;">
                    <Page size="small" :total="totalNum" :current="typePage" show-elevator :page-size="5" @on-change="pageChange"></Page>
                </div>
            </div>

    </div>
</template>

<script>
    export default {
        //树图：
        props: ['baseData', 'right_display'],
        data () {
            return {
                equipment_model_name: '',
                totalNum:5,
                typePage:1,
                equTypes: [],
            }
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
            //设备型号查询：
            getEqu_type(){
                this.$axios.get('/System/equipmentModelMagnifier',{params:{page:this.typePage,pageSize:5,equipment_model_name: this.equipment_model_name}}).then((res) => {
                    var ret = res.data.response
                    if (ret.code == 1) {
                        this.equTypes= [];
                        this.totalNum = ret.data.Total;
                        $(".typeTable").find("input[type='radio']:checked").prop('checked', false);
                        for(var i in ret.data.Rows){
                            this.equTypes.push({
                                modelName: ret.data.Rows[i].tBdEquipmentModelName,
                                modelId: ret.data.Rows[i].tBdEquipmentModelId,
                            })
                        }
                    };

                }).catch((err) => {
                    console.log(err);
                });
            },
            pageChange(page){
                this.typePage = page;
                this.getEqu_type();
            },
            searchList(){
                this.typePage = 1;
                this.getEqu_type();
            },
            toSelect(index){
                $('.trBga').eq(index).addClass('highlight').siblings().removeClass('highlight')
                this.$emit("typeSelected", this.equTypes[index]);
            },},
        mounted () {
            this.getEqu_type();
        },

    }
</script>


