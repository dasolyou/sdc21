<template>
  <div class="camera">
    <div class="camera__video-wrap">
      <video class="camera__video" playsinline autoplay></video>
    </div>
    <div class="camera__canvas-wrap">
      <div class="camera__canvas-inr">
        <canvas class="camera__canvas camera__canvas--image"></canvas>
        <canvas class="camera__canvas camera__canvas--video"></canvas>
        <div class="camera__canvas">
          <canvas id="c" class="camera__canvas--fabric"></canvas>
        </div>
      </div>
    </div>
    <div class="camera__btn-wrap">
      <button class="camera__btn" @click="methods.playVideo" :disabled="data.captureState">camera__start</button>
      <button class="camera__btn" @click="methods.captureImage">captureImage</button>
      <button class="camera__btn" @click="methods.downloadImage">downloadImage</button>
      <button class="camera__btn" @click="methods.resetCanvas" :disabled="!data.captureState">resetCamera</button>
      <button class="camera__btn" @click="methods.removeSvg" :disabled="data.captureState">remove stickers</button>
      <button class="camera__btn" @click="methods.switchCamera" :disabled="data.captureState" :class="{'camera__btn--hide': data.cameraLength == 1}">switchCamera</button>
      <button class="camera__btn" @click="methods.sendUserInfo">sendUserInfo</button>
      <!-- <button class="camera__btn" @click="methods.sendUserInfo" :disabled="!data.captureState">sendUserInfo</button> -->
    </div>
    <div class="camera__stickers-wrap">
      <div v-for="(stickerG, index) in data.stickers" :key="index" class="camera__group" :class="{'camera__group--active': index == 0}">
        <button class="camera__group-name" @click="methods.activeStickerG">{{ stickerG.group }}</button>
        <div class="camera__group-stickers">
          <button v-for="(sticker, index) in stickerG.item" :key="index" @click="methods.addSvg(sticker)" :disabled="data.captureState" class="camera__stickers" :class="{'camera__stickers--animate': sticker.isAnimate}">
            <template v-if="!sticker.isAnimate">
              <img :src="sticker.path" alt="">
            </template>
            <template v-else>
              <AnimateSvg :id="sticker.id"></AnimateSvg>
            </template>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as $ from "fxdom";
import * as _ from "fxjs";
import { reactive, useStore, onMounted, onUnmounted } from "@/helper/vue.js";
import { fabric } from 'fabric';
import { computed } from '@vue/reactivity';
// import { ref, reactive, onMounted, onBeforeUnmount, onUnmounted, computed, useStore, watch } from "@/helper/vue.js";
import AnimateSvg from '@/test/AnimateSvg.vue'

export default {
  components: {
    AnimateSvg,
  },
  setup(props) {
    const { state, commit, dispatch } = useStore();
    const data = reactive({
      fabricCanvas: computed(() => new fabric.Canvas('c')),
      stickersInfo: [],
      userImage: null,
      facingMode: true,
      captureState: false,
      videoState: false,
      deleteState: false,
      cameraLength: null,
      stickers: computed(() => state.stickers),
    })
    const methods = {
      playVideo: () => {
        const canvasW = document.querySelector(".camera__video-wrap").offsetWidth;
        const video = document.querySelector(".camera__video");
        navigator.mediaDevices.getUserMedia({ video: { width: canvasW, height: canvasW, facingMode: data.facingMode ? 'user' : 'environment' } }).
        then(stream => {
          // 카메라 허용 클릭했을 때
          video.srcObject = stream;
          data.videoState = true;
          // console.log("stream ----", stream);
        }).catch(error => {
          console.error("Can not get an access to a camera...", error);
        });
      },
      addSvg: (sticker) => {
        if (sticker.isAnimate) {
          addAnimation(sticker.id, sticker.isAnimate);
        } else {
          fabric.loadSVGFromURL(`${sticker.path}`, function(objects, options) {
            const shape = fabric.util.groupSVGElements(objects, options);
            shape['stickerId'] = sticker.id;
            shape['isAnimate'] = false;
            data.fabricCanvas.add(shape.scale(1)).setActiveObject(shape).renderAll();
          });
        }
      },
      removeSvg: () => {
        data.fabricCanvas.remove(...data.fabricCanvas.getObjects());
        data.stickersInfo = [];
      },
      resetCanvas: () => {
        const canvasW = document.querySelector(".camera__video-wrap").offsetWidth;
        const imageCanvas = document.querySelector('.camera__canvas--image')
        const videoCanvas = document.querySelector('.camera__canvas--video')
        const fabricCanvas = document.querySelectorAll('.camera__canvas--fabric')
        const imageContext = imageCanvas.getContext("2d");
        const videoContext = videoCanvas.getContext("2d");
        methods.removeSvg();
        imageContext.clearRect(0, 0, canvasW, canvasW);
        videoContext.clearRect(0, 0, canvasW, canvasW);
        $.setCss({ display: 'inline-block' }, fabricCanvas[1]);
        data.captureState = false;
      },
      captureImage: () => {
        const canvasW = document.querySelector(".camera__video-wrap").offsetWidth;
        const imageCanvas = document.querySelector('.camera__canvas--image')
        const videoCanvas = document.querySelector('.camera__canvas--video')
        const fabricCanvas = document.querySelectorAll('.camera__canvas--fabric')
        const imageContext = imageCanvas.getContext("2d");
        const videoContext = videoCanvas.getContext("2d");
        const video = document.querySelector(".camera__video");
        const zoom = data.fabricCanvas.getZoom();
        // 스티커 active해제
        data.fabricCanvas.discardActiveObject();
        data.fabricCanvas.requestRenderAll();
        setTimeout(() => { // active해제 후 캡쳐 돼야 -> setTimeout
          imageContext.drawImage(video, 0, 0, canvasW, canvasW);
          imageContext.drawImage(fabricCanvas[0], 0, 0, canvasW, canvasW);
          videoContext.drawImage(video, 0, 0, canvasW, canvasW);
          videoCanvas.toBlob(blob => {;
            const blobUrl = window.URL.createObjectURL(blob)
            fabric.Image.fromURL(blobUrl, function(img) {
              data.fabricCanvas.add(img.scale(1/zoom).center().setCoords()).renderAll().sendToBack(img);
            });
            // // 서버로 전송 할 blob 이미지
            // data.userImage = blob;
            // blob 그대로 사용 혹은 file 이용해서 store 저장, 서버로 전송
            // const file = new File([blob], "name")
          });
          $.setCss({ display: 'none' }, fabricCanvas[1]);
          data.captureState = true;
        }, 10);
      },
      downloadImage: () => {
        const imageCanvas = document.querySelector('.camera__canvas--image')
        const downloadLink = document.createElement("a");
        downloadLink.setAttribute("download", `capture-${new Date().getTime()}.png`);
        imageCanvas.toBlob(blob => {
          const blobUrl = window.URL.createObjectURL(blob)
          downloadLink.setAttribute("href", blobUrl);
          downloadLink.click();
          window.URL.revokeObjectURL(blobUrl);
        });
      },
      sendUserInfo: () => {
        const canvasW = document.querySelector(".camera__video-wrap").offsetWidth;
        const fabricStickers = data.fabricCanvas.getObjects();
        const zoom = data.fabricCanvas.getZoom();
        _.go(fabricStickers,
          _.each(sticker => {
            const info = {
              id: sticker.stickerId,
              width: (sticker.width * 100 * zoom)/canvasW,
              height: (sticker.height * 100 * zoom)/canvasW,
              left: (sticker.left * 100 * zoom)/canvasW,
              top: (sticker.top * 100 * zoom)/canvasW,
              scaleX: sticker.scaleX,
              scaleY: sticker.scaleY,
              angle: sticker.angle,
              isAnimate: sticker.isAnimate,
            }
            if (info.id !== undefined) {
              data.stickersInfo.push(info);
            }
          })
        )
      
        commit('setStickersInfo', {'stickersInfo': data.stickersInfo, 'userImage': data.userImage})
      },
      switchCamera: () => {
        data.facingMode = !data.facingMode;
        methods.playVideo();
      },
      // addAnimation: (id) => {},
      activeStickerG: (e) => {
        _.go(
          $.qsa(".camera__group"),
          _.each(item => {
            if ($.hasClass("camera__group--active", item)) $.removeClass("camera__group--active", item)
          })
        )
        $.addClass("camera__group--active", $.closest(".camera__group", e.target));
      },
    }
    const addAnimation = (id, isAnimate) => {
      fabric.Sprite = fabric.util.createClass(fabric.Image, {
        type: 'sprite',
        spriteWidth: 50,
        spriteHeight: 72,
        spriteIndex: 0,
        frameTime: 100,

        initialize: function(element, options) {
          options || (options = { });

          options.width = this.spriteWidth;
          options.height = this.spriteHeight;

          this.callSuper('initialize', element, options);

          this.createTmpCanvas();
          this.createSpriteImages();
        },

        createTmpCanvas: function() {
          this.tmpCanvasEl = fabric.util.createCanvasElement();
          this.tmpCanvasEl.width = this.spriteWidth || this.width;
          this.tmpCanvasEl.height = this.spriteHeight || this.height;
        },

        createSpriteImages: function() {
          this.spriteImages = [ ];

          var steps = this._element.width / this.spriteWidth;
          for (var i = 0; i < steps; i++) {
            this.createSpriteImage(i);
          }
        },

        createSpriteImage: function(i) {
          var tmpCtx = this.tmpCanvasEl.getContext('2d');
          tmpCtx.clearRect(0, 0, this.tmpCanvasEl.width, this.tmpCanvasEl.height);
          tmpCtx.drawImage(this._element, -i * this.spriteWidth, 0);

          var dataURL = this.tmpCanvasEl.toDataURL('image/png');
          var tmpImg = fabric.util.createImage();

          tmpImg.src = dataURL;

          this.spriteImages.push(tmpImg);
        },

        _render: function(ctx) {
          ctx.drawImage(
            this.spriteImages[this.spriteIndex],
            -this.width / 2,
            -this.height / 2
          );
        },

        play: function() {
          var _this = this;
          this.animInterval = setInterval(function() {

            _this.onPlay && _this.onPlay();
            _this.dirty = true;
            _this.spriteIndex++;
            if (_this.spriteIndex === _this.spriteImages.length) {
              _this.spriteIndex = 0;
            }
          }, this.frameTime);
        },

        stop: function() {
          clearInterval(this.animInterval);
        }
      });

      fabric.Sprite.fromURL = function(url, callback, imgOptions) {
        fabric.util.loadImage(url, function(img) {
          callback(new fabric.Sprite(img, imgOptions));
        });
      };

      fabric.Sprite.async = true;

      //////////////////////////////////////////////////////////////

      fabric.Sprite.fromURL(require(`@/assets/sticker-${id}.png`), function(sprite) {
        sprite['stickerId'] = id;
        sprite['isAnimate'] = isAnimate;
        data.fabricCanvas.add(sprite);
          sprite.set('dirty', true);
          sprite.play();
      });

      (function render() {
        data.fabricCanvas.renderAll();
        fabric.util.requestAnimFrame(render);
      })();
    }

    const checkCamera = () => {
      // 디바이스에 전/후 카메라 체크 -> switch 버튼 노출 유무
      navigator.mediaDevices.enumerateDevices().then(deviceInfos => {
        let video = [];
        _.go(deviceInfos,
          _.each(info => {
            if (info.kind === 'videoinput') {
              video.push(info)
            }
          })
        )
        data.cameraLength = video.length;
      }).catch(error => {
        console.log("error", error);
      });
    }

    const setfabricControl = () => {
      // 스티커 컨드롤 디자인 변경
      const fabricObject = fabric.Object.prototype;
      const img = document.createElement('img');
      // const deleteIcon = "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg version='1.1' id='Ebene_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='595.275px' height='595.275px' viewBox='200 215 230 470' xml:space='preserve'%3E%3Ccircle style='fill:%23F44336;' cx='299.76' cy='439.067' r='218.516'/%3E%3Cg%3E%3Crect x='267.162' y='307.978' transform='matrix(0.7071 -0.7071 0.7071 0.7071 -222.6202 340.6915)' style='fill:white;' width='65.545' height='262.18'/%3E%3Crect x='266.988' y='308.153' transform='matrix(0.7071 0.7071 -0.7071 0.7071 398.3889 -83.3116)' style='fill:white;' width='65.544' height='262.179'/%3E%3C/g%3E%3C/svg%3E";
      const deleteIcon = require('@/assets/cancel.svg');
      img.src = deleteIcon;

      fabricObject.setControlsVisibility({ mt: false, mb: false, ml: false, mr: false });

      fabricObject.transparentCorners = false;
      // fabricObject.borderColor = 'black';
      // fabricObject.cornerColor = 'blue';
      // fabricObject.cornerStrokeColor = 'red';
      // fabricObject.cornerStyle = 'circle';
      // fabricObject.cornerStyle = 'square';

      fabricObject.controls.deleteControl = new fabric.Control({
        x: 0.5,
        y: -0.5,
        offsetY: 16,
        cursorStyle: 'pointer',
        mouseUpHandler: deleteObject,
        render: renderIcon,
        cornerSize: 24
      });

      function deleteObject(eventData, transform) {
        data.deleteState = true;
        const target = transform.target;
        const canvas = target.canvas;
        console.log("transform", transform);
        console.log("target", target);
        if (target._objects) {
          // 스티커 그룹으로 삭제하는 경우
          _.go(target._objects,
            _.each(item => canvas.remove(item))
          )
          data.fabricCanvas.discardActiveObject();
        } else canvas.remove(target);
        canvas.requestRenderAll();
      }

      function renderIcon(ctx, left, top, styleOverride, fabricObject) {
        // console.log("this", this);
        // console.log("fabricObject", fabricObject);
        const size = this.cornerSize;
        ctx.save();
        ctx.translate(left, top);
        ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
        ctx.drawImage(img, -size/2, -size/2, size, size);
        ctx.restore();
      }
    }

    const setCanvasSize = () => {
      // 초기 캔버스 사이즈 설정(스티커 영역 제외) -> resize X
      const canvasW = document.querySelector(".camera__video-wrap").offsetWidth;
      const imageCanvas = document.querySelector('.camera__canvas--image') // 사용자 device에 저장
      const videoCanvas = document.querySelector('.camera__canvas--video') // 사용자 비디오 캡쳐
      
      imageCanvas.setAttribute("width", canvasW);
      imageCanvas.setAttribute("height", canvasW);
      videoCanvas.setAttribute("width", canvasW);
      videoCanvas.setAttribute("height", canvasW);
      resizeCallback();
    }
    
    const resizeCallback = () => {
      console.log("resizeCallback ----------- all");
      // 스티커 영역 초기 캔버스 사이즈 설정 -> resize O
      const canvasW = document.querySelector(".camera__video-wrap").offsetWidth;
      const scale = canvasW / data.fabricCanvas.getWidth();
      const zoom  = data.fabricCanvas.getZoom() * scale;
      data.fabricCanvas.setDimensions({width: canvasW, height: canvasW});
      data.fabricCanvas.setViewportTransform([zoom, 0, 0, zoom, 0, 0]);
      // if (data.videoState) methods.playVideo();
    }

    const resizeXCallback = () => {
      console.log("resizeXCallback ---------- width");
      if (data.videoState) methods.playVideo();
    }
    const setZindex = () => {
      // 마지막 edit 스티커 상위로
      data.fabricCanvas.on('mouse:up', function(e) {
        if (!e.target) return;
        if (data.deleteState) return data.deleteState = false;
        data.fabricCanvas.bringToFront(e.target);
      })
    }

    onMounted(() => {
      // methods.playVideo(); // 테스트 중에만
      checkCamera();
      setZindex();
      setCanvasSize();
      setfabricControl();

      // 스티커 그룹 선택 해제
      // data.fabricCanvas.on('selection:created', (e) => {
      //   if(e.target.type === 'activeSelection') {
      //     data.fabricCanvas.discardActiveObject();
      //   } else {
      //     //do nothing
      //   }
      // })
      
      let lastWidth = window.innerWidth;
      window.addEventListener("resize", () => {
        resizeCallback();
        if (window.innerWidth !== lastWidth) {
          // 모바일 하단 컨트롤바 유무에 따른 resize제거
          resizeXCallback();
          lastWidth = window.innerWidth;
        }
      });
      // window.addEventListener("resize", resizeCallback);
    })

    onUnmounted(() => {
      window.addEventListener("resize", () => {
        resizeCallback();
        if (window.innerWidth !== lastWidth) {
          resizeXCallback();
          lastWidth = window.innerWidth;
        }
      });
    })

    return {
      data,
      methods
    }
  }
}
</script>

<style lang="scss" src="@/css/captureFabric.scss"></style>