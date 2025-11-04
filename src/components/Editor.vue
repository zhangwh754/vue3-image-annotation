<script lang="ts" setup>
import { useMarkerTool } from '@/hooks/useMarkerTool'
import Icon from './Icon/index.vue'
import markerConfig from './marker.config'

const { currentTool, toggleTool, clearCanvas } = useMarkerTool()
</script>

<template>
  <div class="editor">
    <icon
      v-for="item in markerConfig"
      class="editor-btn"
      :class="[{ 'editor-btn-active': item.type === currentTool }, `editor-btn-${item.type}`]"
      :icon="item.icon"
      @click="toggleTool(item.type)"
    />
  </div>
</template>

<style scoped lang="scss">
.editor {
  height: 42px;
  background-color: rgb(162, 163, 175);
  display: flex;
  align-items: center;
  padding: 0 15px;
  border-radius: 2px;

  * {
    user-select: none;
  }

  .editor-btn {
    padding: 0 4px;
    font-size: 26px;
    cursor: pointer;
    color: #fff;

    &.editor-btn-active {
      color: blue;
    }
  }
}
</style>
