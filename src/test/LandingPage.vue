<template>
  <div class="container stacks">
    <div class="stacks__title">Stack List</div>
    <div class="stacks__wrapper">
      <div class="stacks__items">
        <StackItem v-for="(stack, idx) in data.stacksList" :key="idx" :stack="stack"></StackItem>
      </div>
    </div>
    <button class="stacks__btn" @click="methods.loadMore">Load More</button>
  </div>
</template>

<script>
import { onMounted, reactive } from 'vue'
import * as $ from "fxdom";
import * as _ from "fxjs";
import axios from 'axios';
import StacksData from '../store/data-stacks';
import StackItem from '@/test/StackItem.vue'

export default {
  name: 'StackList',
  components: { 
    StackItem
  },
  props: {      
  },
  setup() {
    const data = reactive({
      stacksList: null,
      pageCount: 1,
    })

    const methods = {
      loadMore: async () => {
        // data.pageCount = data.pageCount + 1;
        // const res = await axios.get(`http://localhost:3000/stacks?_page=${data.pageCount}&_limit=12`);
        // const newData = res.data;
        // newData.map((i) => {
        //   data.stacksList.push(i)
        // })
        // console.log(data.pageCount, data.stacksList, res.data);
      }
    } 

    onMounted(async () => {
      // const res = await axios.get(`http://localhost:3000/stacks?_page=${data.pageCount}&_limit=12`)
      data.stacksList = StacksData
      // console.log(data.stacksList);
    })

    return {
      data,
      methods
    }
  }
}
</script>

<style lang="scss" src="@/css/landingPage.scss" scoped></style>