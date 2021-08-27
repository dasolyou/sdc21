<template>
  <div class="sticker__ani">
    <img :src="require(`@/assets/sticker-${id}.png`)" alt="" class="sticker__ani-img">
  </div>
</template>

<script>
import * as $ from "fxdom";
import * as _ from "fxjs";
import { reactive, useStore, onMounted } from "@/helper/vue.js";
import { fabric } from 'fabric';
import { computed } from '@vue/reactivity';
// import { ref, reactive, onMounted, onBeforeUnmount, onUnmounted, computed, useStore, watch } from "@/helper/vue.js";


export default {
  props: {
    id: String,
  },
  setup(props) {
    const { state, commit, dispatch } = useStore();
    const data = reactive({})
    const methods = {}

    const test = () => {

    }

    onMounted(() => {
      test();
    })

    return {
      data,
      methods
    }
  }
}
</script>

<style lang="scss" scoped>
.sticker__ani {
  height: 100%;
  width: 100%;
  overflow: hidden;
  &-img {
    width: auto;
    height: 100%;
    animation: play 1s steps(10) infinite;
    -webkit-animation: play 1s steps(10) infinite;
  }
}
@keyframes play {
  100% {
    transform: translate(-100%, 0px);
  }
}
</style>