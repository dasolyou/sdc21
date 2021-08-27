<template>
  <div ref="self" class="sticker">
    <template v-if="!isAnimate">
      <img :src="require(`@/assets/sticker-${id}.svg`)"  alt=""/>
    </template>
    <template v-else>
      <AnimateSvg :id="id"></AnimateSvg>
    </template>
  </div>
</template>

<script>
import { onMounted, reactive, ref } from 'vue'
import * as $ from "fxdom";
import * as _ from "fxjs";
import Stickers from './stickers';
import AnimateSvg from '@/test/AnimateSvg.vue'

export default {
  components: {
    AnimateSvg,
  },
  props: {
    angle: Number,
    height: Number,
    id: String,
    left: Number,
    scaleX: Number,
    scaleY: Number,
    top: Number,
    width: Number,
    isAnimate: Boolean,
  },
  setup(props) {
    const self = ref();
    const data = reactive({
      stickers: Stickers.stickers,
      src: ''
    })

    const methods = {
    }
    
    onMounted(() => {
      // const res = await axios.get(`http://localhost:3000/stacks?_page=${data.loadCount}&_limit=12`)
      // data.stacksList = StacksData
      // console.log(data.stacksList);
        // gsap.to(chatbotEl, 0.3, { x: 0 , y: 0, ease: 'power1' });

      $.setCss({
        transform: `scale(${props.scaleX}, ${props.scaleY}) rotate(${props.angle}deg)`,
        top: `${props.top}%`,
        left: `${props.left}%`,
        width: `${props.width}%`,
        height: `${props.height}%`
        // transform: `scale(${props.scaleX}, ${props.scaleY})`,
      // }, self.value.parentElement)
      }, $.closest(".stacks__item-sticker", self.value))
    })

    return {
      data,
      self,
      methods
    }
  }
}
</script>

<style lang="scss" scoped>
.sticker {
  width: 100%;
  height: 100%;
}
</style>
