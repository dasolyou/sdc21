<template>
    
  <main id="webcam-app">
      <div class="webcam-start" id="webcam-control">
          <label class="form-switch">
              <input type="checkbox" id="webcam-switch">
              <i></i>
              <span id="webcam-caption">Click to Start Camera</span>
          </label>
          <button id="cameraFlip">전환</button>
      </div>

      <div class="">
          <div id="app-panel" class="app-panel">
              <div id="webcam-container" class="webcam-container">
                  <video id="webcam" autoplay playsinline></video>
                  <canvas id="canvas" class="display-none"></canvas>
                  <audio id="snapSound" src="audio/snap.wav" preload = "auto"></audio>
              </div>
              <div id="cameraControls" class="cameraControls">
                  <a href="#" id="take-photo" title="Take Photo" class="display-none"><i>take-photo</i></a>
                  <a href="#" id="resume-camera"  title="Resume Camera" class="display-none"><i>resume-camera</i></a>
                  <a href="#" id="download-photo" download="selfie.png" target="_blank" class="display-none"><i>download-photo</i></a>
              </div>
          </div>
      </div>
  </main>
</template>

<script>
export default {
  setup(props) {

    const page = () => {
      const webcamElement = document.getElementById('webcam');
      const canvasElement = document.getElementById('canvas');
      const snapSoundElement = document.getElementById('snapSound');
      const webcam = new Webcam(webcamElement, canvasElement, snapSoundElement);

      document.querySelector('#webcam-switch').addEventListener('change', function () {
        if(this.checked){
          webcam.start()
            .then(result =>{
              document.querySelector('#take-photo').classList.remove('display-none');
              console.log("webcam started");
            })
            .catch(err => {
              alert(err);
            });
        }
        else {
          webcam.stop();
          document.querySelector('#take-photo').classList.add('display-none');
          console.log("webcam stopped");
        }
      });

      document.querySelector('#cameraFlip').addEventListener('click', function() {
        webcam.flip();
        webcam.start()
          .then(result =>{
            console.log("webcam flipped");
          })
          .catch(err => {
            alert(err);
          });
      });

      document.querySelector("#take-photo").addEventListener('click',function () {
        let picture = webcam.snap();
        document.querySelector('#download-photo').href = picture;
        afterTakePhoto();
      });

      document.querySelector("#resume-camera").addEventListener('click',function () {
        webcam.start()
          .then(facingMode =>{
            removeCapture();
          });
      });

      function afterTakePhoto(){
        webcam.stop();
        window.scrollTo(0, 0);
        document.querySelector('#webcam-control').classList.add('display-none');
        document.querySelector('#webcam').classList.add('display-none');
        document.querySelector('#take-photo').classList.add('display-none');

        document.querySelector('#canvas').classList.remove('display-none');
        document.querySelector('#resume-camera').classList.remove('display-none');
        document.querySelector('#download-photo').classList.remove('display-none');
      }

      function removeCapture(){
        document.querySelector('#webcam-control').classList.remove('display-none');
        document.querySelector('#webcam').classList.remove('display-none');
        document.querySelector('#take-photo').classList.remove('display-none');

        document.querySelector('#canvas').classList.add('display-none');
        document.querySelector('#resume-camera').classList.add('display-none');
        document.querySelector('#download-photo').classList.add('display-none');
      }
    }

    const webcam = () => {
      class Webcam {
        constructor(webcamElement, canvasElement, snapSoundElement) {
          this._canvasElement = canvasElement;
          this._snapSoundElement = snapSoundElement;
          this._webcamElement = webcamElement;
          this._webcamElement.width = this.isMobile() ? document.body.clientWidth : 640;
          this._webcamElement.height = this.isMobile() ? document.body.clientWidth * 7 / 5 : 480;
          this._facingMode = 'user';
          this._streamList = [];
        }

        isMobile() {
          let filter = "win16|win32|win64|mac";

          if(navigator.platform){
            if(0 > filter.indexOf(navigator.platform.toLowerCase())){
              return true;
            }else{
              return false;
            }
          }
        }

        /* Get media constraints */
        getMediaConstraints() {
          let videoConstraints = { facingMode: { exact: this._facingMode } };
          let constraints = {
            video: videoConstraints,
            audio: false
          };
          return constraints;
        }

        /* Change Facing mode and selected camera */
        flip(){
          this._facingMode = (this._facingMode === 'user') ? 'environment': 'user';
          this._webcamElement.style.transform = "";
        }

        async start() {
          return new Promise((resolve, reject) => {
            this.stop();
            navigator.mediaDevices.getUserMedia(this.getMediaConstraints()) //get permisson from user
              .then(stream => {
                this._streamList.push(stream);
                this._webcamElement.srcObject = stream;
                if(this._facingMode === 'user'){
                  this._webcamElement.style.transform = "scale(-1,1)";
                }
                this._webcamElement.play();
                resolve();
              })
              .catch(error => {
                reject(error);
              })
          });
        }

        /* Stop streaming webcam */
        stop() {
          this._streamList.forEach(stream => {
            stream.getTracks().forEach(track => {
              track.stop();
            });
          });
        }

        snap() {
          if(this._canvasElement !== null){
            if(this._snapSoundElement !== null){
              this._snapSoundElement.play();
            }

            this._canvasElement.width = this._webcamElement.width;
            this._canvasElement.height = this._webcamElement.width * this._webcamElement.videoHeight / this._webcamElement.videoWidth;

            let context = this._canvasElement.getContext('2d');

            if(this._facingMode === 'user'){
              context.translate(this._canvasElement.width, 0);
              context.scale(-1, 1);
            }
            context.clearRect(0, 0, this._canvasElement.width, this._canvasElement.height);
            context.drawImage(this._webcamElement, 0, 0, this._canvasElement.width, this._canvasElement.height);
            let data = this._canvasElement.toDataURL('image/png');
            return data;
          }
          else{
            throw "canvas element is missing";
          }
        }
      }


    }

  }
}
</script>

<style>
.display-none {
  display: none!important;
}



</style>