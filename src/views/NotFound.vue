<template>
  <div>
    <h1>NOT FOUND</h1>
    <button @click="back">Vover a Log In</button>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
const router = useRouter();

const back = () => {
  router.push("/logIn");
};
</script>

<style lang="scss">
</style>