<template>
  <div class="home">
    <!-- <img alt="Vue logo" src="../assets/logo.png"> -->
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->

    <!-- <FabricTest></FabricTest> -->
    <!-- <CaptureTest></CaptureTest> -->
    <!-- <CaptureFabricTest></CaptureFabricTest> -->
    <CaptureFabric></CaptureFabric>
  </div>
</template>

<script>
import { fabric } from "fabric";
import { reactive, useStore, onMounted } from 'vue'
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'
// import FabricTest from '@/test/FabricTest.vue'
// import CaptureTest from '@/test/CaptureTest.vue'
import CaptureFabricTest from '@/test/CaptureFabricTest.vue'
import CaptureFabric from '@/test/CaptureFabric.vue'

export default {
  name: 'Home',
  components: {
    // FabricTest,
    // CaptureTest,
    CaptureFabricTest,
    CaptureFabric,
  },
  setup() {
    // const { state, commit, dispatch } = useStore();
    const data = reactive({});

    const methods = {};

    onMounted(() => {
      // dispatch('init');
      // console.log("fabric", fabric);
    });

    return {
      data,
			methods,
    }
  }
}
</script>
