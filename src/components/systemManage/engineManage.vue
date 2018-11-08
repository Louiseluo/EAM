<template>

    <div class="basic">
        <v-topItem></v-topItem>
        <Row class="pad-15">
            <Col span="3">
            <div class="second-title">预测引擎定义</div>
            </Col>
            <Col span="21" class="pad-l-15">
            </Col>
        </Row>
    </div>
</template>

<script>
    import topItem from './systemManage.vue';
    export default {
        data(){
            return {

            }
        },
        components: {
            'v-topItem': topItem
        },
        methods: {

        }
    }
</script>

<style type="text/css">

</style>
