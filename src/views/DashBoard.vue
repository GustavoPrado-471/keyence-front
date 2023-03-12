<template>
  <div class="container">
    <div class="row mt-5" style="color:white">
      <h2>Check Control</h2>
    </div>
    <div class="row">
      <div class="col-6 text-start">
        <div class="btn-group mb-4" role="group" aria-label="Basic radio toggle button group">
          <input
            type="radio"
            class="btn-check"
            name="btnradio"
            id="btnradio1"
            checked
            @click="selectVeiw(0)"
          />
          <label class="btn btn-outline-light" for="btnradio1" style="font-size: 20px;">Add new book</label>

          <input
            type="radio"
            class="btn-check"
            name="btnradio"
            id="btnradio3"
            @click="selectVeiw(1)"
          />
          <label
            class="btn btn-outline-light"
            for="btnradio3"
            style="font-size: 20px;"
          >View all items</label>
        </div>
      </div>
    </div>
    <div class="container mt-4">
      <UploadFile />
      <AllData v-if="!store.state.testChangeState" />
    </div>
  </div>
</template>

<script setup>
import UploadFile from "@/components/UploadFile.vue";
import AllData from "@/components/AllData.vue";
import { useStore } from "vuex";

const store = useStore();

const selectVeiw = option => {
  if (option == 1) {
    store.commit("setTestChangeState", false);
  } else {
    store.commit("setTestChangeState", true);
  }
};
</script>

<style lang="scss">
html {
  height: 100%;
}
body {
  margin: 0;
  padding: 0;
  font-family: sans-serif;
  background: linear-gradient(#141e30, #243b55);
}
</style>