<template class="mettingAdd">
    <div class="basic fault-content">
        <div class="form-content">
            <Tree :data="baseData" show-checkbox :multiple="false" :show-checkbox="false"
                  @on-select-change="getLocationId" class="max-h-300"></Tree>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['tempState'],
        data () {
            return {
                baseData: [],

                locationId: '',
            }
        },
        methods: {
            //渲染备品备件树：
            getSparePartsTree: function () {
                let vm = this;
                this.$axios.get("/eamSparePart/getTooTypeTree").then(function (response) {
                    vm.baseData = response.data.response.data;
                });
            },

            /*点击树节点得分子节点 通过树节点ID  获取设备*/
            getLocationId (node){
                if (JSON.stringify(node) == "[]") {
                    return
                };
                if (node[0].children[0]) {
                    node[0].expand = !node[0].expand;
                    node[0].selected = false;
                }
                if (node[0] && !node[0].children[0]) {
//                if (node[0]) {
                    this.locationId = node[0].id;
                    this.$emit("typeSelected", node[0]);
                }
            },
        },
        mounted () {
            this.getSparePartsTree();
        },
        activated: function () {
            this.created && this.getSparePartsTree();
            this.created = true;
        },
        watch: {
            tempState:function(){
                if(this.tempState=="name1"){
                    this.getSparePartsTree();
                }
            },
        },
    }
</script>


