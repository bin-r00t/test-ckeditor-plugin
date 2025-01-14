<script setup>
import Editor from './components/Editor.vue';
import { ref } from 'vue';

const data = ref('<p>Hello, world</p>')
</script>

<template>
  <main>
    <Editor v-model:value="data" />
    <div class="content-preview" v-html="data"></div>
  </main>
</template>

<style scoped> 
main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #cfcfcf;
  padding: 20px;
}
</style>
