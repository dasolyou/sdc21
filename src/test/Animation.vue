<template>
  <div id="sprite-container">
    <div id="sprite-image">
      <img src="@/assets/sprite.png" alt="">
    </div>
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
  setup(props) {
    const { state, commit, dispatch } = useStore();
    const data = reactive({})
    const methods = {}

    const test = () => {
      return
      var animationInterval;
      var spriteSheet = document.getElementById("sprite-image");
      var widthOfSpriteSheet = 1472;
      var widthOfEachSprite = 184;

      function stopAnimation() {
        clearInterval(animationInterval);
      }

      function startAnimation() {
        var position = widthOfEachSprite; //start position for the image
        const speed = 100; //in millisecond(ms)
        const diff = widthOfEachSprite; //difference between two sprites

        animationInterval = setInterval(() => {
          spriteSheet.style.backgroundPosition = `-${position}px 0px`;

          if (position < widthOfSpriteSheet) {
            position = position + diff;
          } else {
            //increment the position by the width of each sprite each time
            position = widthOfEachSprite;
          }
          //reset the position to show first sprite after the last one
        }, speed);
      }

      //Start animation
      startAnimation();

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

<style>
#sprite-image {
  height: 144px;
  width: 100px;
  overflow: hidden;
  /* background-image: require('@/assets/sprite.png'); */
}

#sprite-image img {
  width: auto;
  height: 100%;
  animation: play 1s steps(10) infinite;
}
@keyframes play {
  100% {
    transform: translate(-100%, 0px);
  }
}
</style>