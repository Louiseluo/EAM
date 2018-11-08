<template>

    <Carousel v-model="value" loop class="process">
        <CarouselItem>
            <div class="demo-carousel">
                <div>
                <img src="../../../static/img/year_plan.png" alt="">
                </div>
            </div>
        </CarouselItem>
        <CarouselItem>
            <div class="demo-carousel">
                <div>
                <img src="./../../../static/img/month_plan.png" alt="">
                </div>
            </div>
        </CarouselItem>
        <CarouselItem>
            <div class="demo-carousel">
                <div>
                <img src="./../../../static/img/fix_order.png" alt="">
                </div>
            </div>
        </CarouselItem>
        <CarouselItem>
            <div class="demo-carousel">
                <div>
                <img src="./../../../static/img/maintain_order.png" alt="">
                </div>
            </div>
        </CarouselItem>
    </Carousel>

</template>
<script>
    export default {
        data () {
            return {
                value: 0
            }
        }
    }
</script>
<style>
    .process .ivu-carousel-track {
        text-align: center;
    }
    .process .ivu-carousel-item {
        background: #FFFFFF;
    }
    .process {
        width: 100%;
    }
    .process img {
        width: 100%;
    }
    .process .ivu-carousel-arrow.left, .process .ivu-carousel-arrow.right {
        top: 150px;
    }
    .process .demo-carousel div {
        width: 100%;
        height: 2073px;
        background: #FFFFFF;
        overflow: hidden;
    }
</style>