<template>
  <div class="capture">
    <div class="capture__video-wrap">
      <div class="capture__video">
        <video class="capture__player" autoplay></video>
        <img class="capture__img" src="@/assets/barcelona.jpg" alt="">
      </div>
      <button class="capture__btn" title="Take a picture"></button>
    </div>
    <canvas class="capture__output"></canvas>
  </div>
</template>

<script>
import { reactive, onMounted } from "@/helper/vue.js";
// import { ref, reactive, onMounted, onBeforeUnmount, onUnmounted, computed, useStore, watch } from "@/helper/vue.js";
export default {
  setup() {
    const data = reactive({})
    const methods = {}

    const captureFunc = () => {
      // return
      const player = document.getElementsByClassName("capture__player")[0];
      const img = document.getElementsByClassName("capture__img")[0];
      // const captureBox = document.getElementsByClassName("capture__video")[0];
      const captureButton = document.getElementsByClassName("capture__btn")[0];
      const outputCanvas = document.getElementsByClassName("capture__output")[0];
      console.log("outputCanvas", outputCanvas);
      const context = outputCanvas.getContext("2d");
      console.log("context", context);

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
        const imageWidth = img.offsetWidth;
        const imageHeight = img.offsetHeight;

        // Make our hidden canvas the same size
        outputCanvas.width = playerWidth;
        outputCanvas.height = playerHeight;

        // Draw captured image to the hidden canvas
        context.drawImage(player, 0, 0, playerWidth, playerHeight);
        context.drawImage(img, 0, 0, imageWidth, imageHeight);
        // 사용자 이미지만 캡쳐하려면 이 부분만
        // context.drawImage(player, 0, 0, playerWidth, playerHeight);

        // A bit of magic to save the image to a file
        // return
        const downloadLink = document.createElement("a");
        downloadLink.setAttribute("download", `capture-${new Date().getTime()}.png`);
        outputCanvas.toBlob(blob => {
          downloadLink.setAttribute("href", URL.createObjectURL(blob));
          downloadLink.click();
        });
      });
    }
    onMounted(() => {
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
.capture {
  width: 100vw;
  height: 100vh;
  background-color: #282c34;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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
      max-width: 80vw;
      max-height: 80vh;
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
    
    &:hover {
      transform: scale(1.1);
    }
    
    &:active {
      background-color: #00ff00;
    }
    &__output {

    }
  }
}

.controls {
  display: inline-block;
}
</style>