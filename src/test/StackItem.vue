<template>
  <div ref="self" class="stackItem">
    <div class="stackItem__sticker" v-for="(info, idx) in stack.stackInfo" :key="idx">
      <template v-if="!info.isAnimate">
        <img :src="require(`@/assets/sticker-${info.id}.svg`)"  alt=""/>
      </template>
      <template v-else>
        <AnimateSvg :id="info.id"></AnimateSvg>
      </template>
    </div>
    <div class="stackItem__bg">
      <img v-if="stack.imgSrc" :src="stack.imgSrc" alt="stack-image">
    </div>
  </div>
</template>

<script>
import * as $ from "fxdom";
import * as _ from "fxjs";
import { reactive, ref, useStore, onMounted } from "@/helper/vue.js";
import { fabric } from 'fabric';
import { computed } from '@vue/reactivity';
// import { ref, reactive, onMounted, onBeforeUnmount, onUnmounted, computed, useStore, watch } from "@/helper/vue.js";
import AnimateSvg from '@/test/AnimateSvg.vue'


export default {
  props: {
    stack: Object
  },
  components: {
    AnimateSvg,
  },
  setup(props) {
    const self = ref();
    const { state, commit, dispatch } = useStore();
    const data = reactive({
      info: props.stack.stackInfo
    })
    const methods = {}

    onMounted(() => {
      const stickers = $.qsa(".stackItem__sticker", self.value);
      stickers.forEach((el, index) => {
        const info = data.info[index];
        $.setCss({
          transform: `scale(${info.scaleX}, ${info.scaleY}) rotate(${info.angle}deg)`,
          top: `${info.top}%`,
          left: `${info.left}%`,
          width: `${info.width}%`,
          height: `${info.height}%`
        }, el)
      });
    })

    return {
      data,
      methods,
      self,
    }
  }
}
</script>

<style lang="scss" scoped>
  .stackItem {
    margin-top: 20px;
    position: relative;
    width: 48%;
    // height: 100%;
    overflow: hidden;
    &:nth-child(1), &:nth-child(2) {
      margin-top: 0;
    }

    &__bg {
      width: 100%;
      img {
        width: 100%;
      }
      // opacity: 0.4;
    }

    &__sticker {
      position: absolute;
      z-index: 10;
      transform-origin: top left;
      img {
        width: 100%;
      }
      // transform: scale(2) translate(100px,100px);
    }  
  }
</style>