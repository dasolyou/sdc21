<template>
  <!-- <div class="controls">
    <p>
      <button id="add" @click="methods.Add">Add a rectangle</button>
    </p>
  </div>
  <canvas id="c" class="fabric__output" width="400" height="300" style="border:1px solid #ccc"></canvas> -->

  <div class="button-wrap">
    <button class="button" @click="methods.addSvg">add svg</button>
  </div>

  <div class="capture">
    <div class="capture__video-wrap">
      <div class="capture__video">
        <video class="capture__player" autoplay></video>
        <img class="capture__img" src="@/assets/barcelona.jpg" alt="">
      </div>
      <button class="capture__btn" title="Take a picture"></button>
    </div>
    <div class="capture__canvas-wrap">
      <canvas id="c" class="capture__canvas" style="border:1px solid #ccc"></canvas>
      <!-- <canvas id="c" class="capture__canvas" width="400" height="300" style="border:1px solid #ccc"></canvas> -->
    </div>
    <canvas class="capture__output" width="597" height="597"></canvas>
  </div>
  
</template>

<script>
import * as $ from "fxdom";
import * as _ from "fxjs";
import { reactive, onMounted } from "@/helper/vue.js";
import { fabric } from 'fabric';
import { computed } from '@vue/reactivity';
// import { ref, reactive, onMounted, onBeforeUnmount, onUnmounted, computed, useStore, watch } from "@/helper/vue.js";
export default {
  setup() {
    const data = reactive({
      fabricCanvas: computed(() => new fabric.Canvas('c')),
      canvasSize: '',

    })
    const methods = {
      add: () => {
        // var canvas = new fabric.Canvas('c');
        var rect = new fabric.Rect({
          left: 100,
          top: 50,
          fill: 'yellow',
          width: 200,
          height: 100,
          objectCaching: false,
          stroke: 'lightgreen',
          strokeWidth: 4,
        });

        data.fabricCanvas.add(rect);
        data.fabricCanvas.setActiveObject(rect);

      },
      addSvg: () => {
        console.log("addSvg ---------------");
        fabric.loadSVGFromURL(require('@/assets/sticker-0-1.svg'), function(objects, options) {
          var shape = fabric.util.groupSVGElements(objects, options);
          data.fabricCanvas.add(shape.scale(1));
          // svg 초기 위치 설정
          // shape.set({ left: 200, top: 100 }).setCoords();
          data.fabricCanvas.renderAll();

          // data.fabricCanvas.forEachObject(function(obj) {
          //   var setCoords = obj.setCoords.bind(obj);
          //   obj.on({
          //     moving: setCoords,
          //     scaling: setCoords,
          //     rotating: setCoords
          //   });
          // })
        });
      }
    }

    let rect 
    const fabricFunc = () => {
      // var canvas = this.__canvas = new fabric.Canvas('c');
      // var canvas = new fabric.Canvas('c');
      // create a rect object
      var deleteIcon = "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg version='1.1' id='Ebene_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='595.275px' height='595.275px' viewBox='200 215 230 470' xml:space='preserve'%3E%3Ccircle style='fill:%23F44336;' cx='299.76' cy='439.067' r='218.516'/%3E%3Cg%3E%3Crect x='267.162' y='307.978' transform='matrix(0.7071 -0.7071 0.7071 0.7071 -222.6202 340.6915)' style='fill:white;' width='65.545' height='262.18'/%3E%3Crect x='266.988' y='308.153' transform='matrix(0.7071 0.7071 -0.7071 0.7071 398.3889 -83.3116)' style='fill:white;' width='65.544' height='262.179'/%3E%3C/g%3E%3C/svg%3E";

      var img = document.createElement('img');
      img.src = deleteIcon;

      fabric.Object.prototype.transparentCorners = false;
      fabric.Object.prototype.cornerColor = 'blue';
      fabric.Object.prototype.cornerStyle = 'circle';

      function Add() {
        rect = new fabric.Rect({
          left: 100,
          top: 50,
          fill: 'yellow',
          width: 200,
          height: 100,
          objectCaching: false,
          stroke: 'lightgreen',
          strokeWidth: 4,
        });

        data.fabricCanvas.add(rect);
        // data.fabricCanvas.setActiveObject(rect);
      }

      fabric.Object.prototype.controls.deleteControl = new fabric.Control({
        x: 0.5,
        y: -0.5,
        offsetY: 16,
        cursorStyle: 'pointer',
        mouseUpHandler: deleteObject,
        render: renderIcon,
        cornerSize: 24
      });
      console.log("fabric.Object.prototype.controls", fabric.Object.prototype);

      Add();

      function deleteObject(eventData, transform) {
        // console.log("transform", transform);
        var target = transform.target;
        var canvas = target.canvas;
            canvas.remove(target);
            canvas.requestRenderAll();
      }

      function renderIcon(ctx, left, top, styleOverride, fabricObject) {
        // console.log("this", this);
        // console.log("fabricObject", fabricObject);
        var size = this.cornerSize;
        ctx.save();
        ctx.translate(left, top);
        ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
        ctx.drawImage(img, -size/2, -size/2, size, size);
        ctx.restore();
      }
    }

    const captureFunc = () => {
      // return
      const player = document.getElementsByClassName("capture__player")[0];
      // const img = document.getElementsByClassName("capture__img")[0];
      // const captureBox = document.getElementsByClassName("capture__video")[0];
      const captureButton = document.getElementsByClassName("capture__btn")[0];
      const outputCanvas = document.getElementsByClassName("capture__output")[0];
      const captureCanvas = document.getElementsByClassName("capture__canvas")[0];
      console.log("outputCanvas", outputCanvas);
      const captureContext = captureCanvas.getContext("2d");
      const outputContext = outputCanvas.getContext("2d");
      // console.log("context", context);

      navigator.mediaDevices.
      getUserMedia({ video: true }).
      then(stream => {
        player.srcObject = stream;
        console.log("stream ----");
      }).
      catch(error => {
        console.error("Can not get an access to a camera...", error);
      });

      captureButton.addEventListener("click", () => {
        // 비디오랑 위에 붙는 이미지랑 각각 따로 그려줘야 됨 (player, img)
        // Get the real size of the picture
        const playerWidth = player.offsetWidth;
        const playerHeight = player.offsetHeight;
        // const imageWidth = img.offsetWidth;
        // const imageHeight = img.offsetHeight;

        // Make our hidden canvas the same size
        // captureCanvas.width = playerWidth;
        // captureCanvas.height = playerHeight;

        // Draw captured image to the hidden canvas
        // context.drawImage(player, 0, 0, playerWidth, playerHeight);
        // context.drawImage(img, 0, 0, imageWidth, imageHeight);
        outputContext.drawImage(player, 0, 0, 200, 100);
        outputContext.drawImage(captureCanvas, 0, 0, 300, 150);
        console.log("data.fabricCanvas", data.fabricCanvas);
        console.log("fabric", fabric);
        // data.fabricCanvas.moveTo(player, -1);

        // console.log("rect", rect.left, rect.top);

        // captureContext.drawImage(img, 0, 0, imageWidth, imageHeight);

        // 사용자 이미지만 캡쳐하려면 이 부분만
        // context.drawImage(player, 0, 0, playerWidth, playerHeight);

        // A bit of magic to save the image to a file
        const downloadLink = document.createElement("a");
        downloadLink.setAttribute("download", `capture-${new Date().getTime()}.png`);
        outputCanvas.toBlob(blob => {
          // blob 그대로 사용 혹은 file 이용해서 서버로 전송
          // var file = new File([blob], "name");

          const blobUrl = window.URL.createObjectURL(blob)
          downloadLink.setAttribute("href", blobUrl);
          downloadLink.click();
          window.URL.revokeObjectURL(blobUrl);
        });
        // const downloadLink = document.createElement("a");
        // downloadLink.setAttribute("download", `capture-${new Date().getTime()}.png`);
        // outputCanvas.toBlob(blob => {
        //   downloadLink.setAttribute("href", URL.createObjectURL(blob));
        //   downloadLink.click();
        // });
      });
    }
    onMounted(() => {
      const canvasW = document.querySelector(".capture__video-wrap").offsetWidth;
      // data.canvasSize = canvasW;
      data.fabricCanvas.setDimensions({width:canvasW, height:canvasW});

      fabricFunc();
      captureFunc();

    })

    return {
      data,
      methods
    }
  }
}
</script>

<style lang="scss">
.controls {
  display: inline-block;
}
.button {
  width: 100px;
  height: 20px;
}
.capture {
  // position: relative;
  // width: 100vw;
  // height: 100vh;
  // background-color: #282c34;
  // display: flex;
  // flex-direction: column;
  // align-items: center;
  // justify-content: center;
  position: relative;
    // width: 50vw;
    // height: 50vh;
  &__tit {
    color: #fff;
    font-family: Sarala, Arial, sans-serif;
    font-size: 22px;
    text-transform: uppercase;
    text-align: center;
    margin-bottom: 30px;
  }
  &__video {
    position: relative;
    width: 100%;
    // height: 50vh;
    &-wrap {
      max-width: 50vw;
      max-height: 50vh;
      // width: 80vw;
      // height: 80vh;
      position: relative;
    }
  }
  &__player {
    width: 100%;
    // height: 100%;
    border: 2px solid #111;
    // box-shadow: 0 0 50px #111;
  }
  &__img {
    position: absolute;
    top: 160px;
    left: 130px;
    width: 240px;
    height: 170px;
  }
  &__btn {
    display: block;
    position: absolute;
    width: 50px;
    height: 50px;
    bottom: 20px;
    left: 50%;
    margin-left: -25px;
    border-radius: 50%;
    background-color: #ff0000;
    border: 2px solid #fff;
    cursor: pointer;
    transition: all .15s ease-in-out;
    opacity: 0.5;
    outline: none;
    z-index: 1000;
    
    &:hover {
      transform: scale(1.1);
    }
    
    &:active {
      background-color: #00ff00;
    }
  }
  .canvas-container {

  }
  &__canvas {
    // width: 50vw;
    // height: 50vh;
    &-wrap {
      position: absolute;
      // width: 100%;
      // height: 100%;
      // top: 0;
      bottom: -35%;
      left: 50%;
      transform: translate(-50%, 0);
    }

  }
}

</style>