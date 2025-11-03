<script setup lang="ts">
import Viewer from './components/Viewer.vue'
import Editor from './components/Editor.vue'
</script>

<template>
  <div class="image-annotation-container">
    <div class="canvas-container">
      <Viewer v-bind="$attrs"></Viewer>

      <Editor class="annotation-toolbar"></Editor>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.image-annotation-container {
  .canvas-container {
    display: inline-block;
    position: relative;

    .annotation-toolbar {
      position: absolute;
      right: 0;
      bottom: 0;
    }
  }
}
</style>
