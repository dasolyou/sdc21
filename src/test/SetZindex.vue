<template>
  <canvas id="canvasS" width="1000" height="600" style="width:1000px;height:600px;border:2px solid gray"></canvas>
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
      var canvasS = new fabric.Canvas('canvasS', { renderOnAddition: false, hoverCursor: 'pointer', selection: false });
      var bars = {}; //storage for bars (bar number indexed by group object)
      var selectedBar = null; //selected bar (group object)
      var placeholder = new fabric.Text("XXXXX", { fontSize: 12 });

      //pass null or a bar
      function selectBar(bar) {
        if (selectedBar) {
          //remove the old topmost bar and put it back in the right zindex
          //PROBLEM: It doesn't go back; it stays at the same zindex
          //selectedBar.remove();
          console.log("selectedBar", selectedBar, selectedBar.XZIndex);
          canvasS.moveTo(selectedBar, selectedBar.XZIndex);
          selectedBar = null;
        }
        if (bar) {
          //put a placeholder object ("XXX" for now) in the position
          //where the bar was, and put the bar in the top position
          //so it shows topmost
          selectedBar = bar;
          canvasS.bringToFront(selectedBar);
          //canvasS.moveTo(selectedBar, canvas.size()-1);
          //canvasS.add(bar);
          canvasS.renderAll();
        }
      }

      canvasS.on('mouse:up', function(e) {
        if (!e.target) return;
        console.log("mouse:up", e.target);
        canvasS.bringToFront(e.target);
        console.log("getObjects", canvasS.getObjects());
        // canvas.bringForward, and canvas.bringToFront.
      })
          
      canvasS.on({
        'mouse:move': function(e) {
          return
          //hook up dynamic zorder
          if (!e.target) return;
          if (bars[e.target]) {
            selectBar(e.target);
            // console.log("getObjects", canvasS.getObjects());
          } else
            selectBar(null);
        },
      });

      var objcount = canvasS.getObjects().length;

      //create bars
      for (var i = 0; i < 20; ++i) {
        var rect = new fabric.Rect({
          left: 0,
          top: 0,
          rx: 3,
          ry: 3,
          // stroke: 'red',
          width: 200,
          height: 50,
          fill: '#'+(Math.random()*0xFFFFFF<<0).toString(16)
        });
        /*rect.setGradientFill({
          x1: 0,
          y1: 0,
          x2: 0,
          y2: rect.height,
          colorStops: {
            0: '#080',
            1: '#fff'
          }
        });    */
        var text = new fabric.Text("Bar number " + (i+1), {
            fontSize: 12
        });
        var group = new fabric.Group([ rect, text ], {
          left: i + 101,
          top: i * 15 + 26
        });
        group.hasControls = group.hasBorders = false;
        
        //our properties (not part of fabric)
        group.XBar = rect;
        group.XZIndex = objcount++;

        canvasS.add(group);
        bars[group] = i;
      }
      canvasS.renderAll();



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

<style lang="scss" src="@/css/captureFabric.scss"></style>