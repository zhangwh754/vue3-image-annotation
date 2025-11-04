<script setup lang="ts">
import { ref } from 'vue'
import Viewer from './components/Viewer.vue'
import Editor from './components/Editor.vue'

const viewerRef = ref<InstanceType<typeof Viewer> | null>(null)
</script>

<template>
  <div class="image-annotation-container">
    <div class="canvas-container">
      <Viewer ref="viewerRef" v-bind="$attrs"></Viewer>

      <Editor
        v-if="viewerRef?.canvasRef"
        class="annotation-toolbar"
        :canvasRef="viewerRef?.canvasRef"
      ></Editor>
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
