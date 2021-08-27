<template>
  <div class="fabric-canvas-wrapper">
    <canvas id="theCanvas"></canvas>
  </div>
</template>

<script>
import * as $ from "fxdom";
import * as _ from "fxjs";
import { reactive, useStore, onMounted } from "@/helper/vue.js";
import { fabric } from 'fabric';
import { computed } from '@vue/reactivity';
// import { ref, reactive, onMounted, onBeforeUnmount, onUnmounted, computed, useStore, watch } from "@/helper/vue.js";

// 1. 스티커 데이터 정리
// 1. 스티커 -> 버튼 만들기

export default {
  setup(props) {
    const { state, commit, dispatch } = useStore();
    const data = reactive({})
    const methods = {}

    const test = () => {
      function resizeCanvas() {
        const outerCanvasContainer = $('.fabric-canvas-wrapper')[0];
        
        const ratio = canvas.getWidth() / canvas.getHeight();
        const containerWidth   = outerCanvasContainer.clientWidth;
        const containerHeight  = outerCanvasContainer.clientHeight;

        const scale = containerWidth / canvas.getWidth();
        const zoom  = canvas.getZoom() * scale;
        canvas.setDimensions({width: containerWidth, height: containerWidth / ratio});
        canvas.setViewportTransform([zoom, 0, 0, zoom, 0, 0]);
      }

      $(window).resize(resizeCanvas);

      var canvas = new fabric.Canvas('theCanvas', {
          width: 500,
          height: 500
      });

      var iTextSample = new fabric.IText('Hello\nWorld', {
        left: 50,
        top: 50,
        fontFamily: 'Helvetica',
        fill: '#333',
        lineHeight: 1.1,
        styles: {
          0: {textBackgroundColor: 'red',
            0: { textBackgroundColor: 'red', fontSize: 80 },
            1: { textBackgroundColor: 'red' },
            2: { textBackgroundColor: 'red' },
            3: { textBackgroundColor: 'red' },
            4: { textBackgroundColor: 'red' },
          },
          1: {
            0: { textBackgroundColor: 'green', fontSize: 80 },
            1: { textBackgroundColor: 'green' },
            2: { textBackgroundColor: 'green' },
            3: { textBackgroundColor: 'green' },
            4: { textBackgroundColor: 'green' },
          }
        }
      });
      canvas.add(iTextSample);

      var path = new fabric.Path('M121.32,0L44.58,0C36.67,0,29.5,3.22,24.31,8.41\
      c-5.19,5.19-8.41,12.37-8.41,20.28c0,15.82,12.87,28.69,28.69,28.69c0,0,4.4,\
      0,7.48,0C36.66,72.78,8.4,101.04,8.4,101.04C2.98,106.45,0,113.66,0,121.32\
      c0,7.66,2.98,14.87,8.4,20.29l0,0c5.42,5.42,12.62,8.4,20.28,8.4c7.66,0,14.87\
      -2.98,20.29-8.4c0,0,28.26-28.25,43.66-43.66c0,3.08,0,7.48,0,7.48c0,15.82,\
      12.87,28.69,28.69,28.69c7.66,0,14.87-2.99,20.29-8.4c5.42-5.42,8.4-12.62,8.4\
      -20.28l0-76.74c0-7.66-2.98-14.87-8.4-20.29C136.19,2.98,128.98,0,121.32,0z');

      canvas.add(path.set({ left: 200, top: 50 }));

      resizeCanvas();

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

<style lang="scss">
  .fabric-canvas-wrapper {
    border: solid 1px red;
  }

  canvas {
    border: solid 1px blue;
  }
</style>