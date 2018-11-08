<template class="mettingAdd">
    <div class="basic fault-content">
        <!--模块名称-->
        <!--<div class="title">-->
        <!--<span>树图选择</span>-->
        <!--</div>-->
            <!--树图代码：-->
                <Tree :data="baseData" show-checkbox :multiple="false" :show-checkbox="false"
                      @on-select-change="left_Selected" class="max-h-300"></Tree>
    </div>
</template>

<script>
    export default {
        //树图：
        data () {
            return {
                baseData:[]
            }
        },
        methods: {
            //设备地点完整树
            get_equSite(){
                let vt = this;
                this.$axios.get('/common/location/locationNameTree').then((res) => {
                    let result = res.data.response;
//                    console.log('result == ')
//                    console.log(JSON.stringify(result))
                    if (result.code != 1) {
                        vt.$Message.error(result.msg);
                    }
                    else {
                        vt.baseData = result.data;
                    }
                }).catch((err) => {
                    console.log(err);
                });
            },
            left_Selected (left_node){
                if (JSON.stringify(left_node) == "[]") {
                    return
                }
                if (left_node[0] && left_node[0].children) {
                    left_node[0].expand = !left_node[0].expand;
                    left_node[0].selected = true;
                }
//                console.log(JSON.stringify(left_node[0]))
                this.$emit('getEquSite', left_node[0]);

            }
        },
        mounted() {
            this.get_equSite();
        }
    }
</script>


