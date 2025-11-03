<script setup></script>

<template>
  <div class="editor">toolbar</div>
</template>

<style scoped lang="scss">
.editor {
  height: 42px;
  background-color: rgb(162, 163, 175);
  display: flex;
  align-items: center;
  padding: 0 15px;
  border-radius: 2px;
  box-shadow: 0 0 3px 0 #333;

  * {
    user-select: none;
  }
}
</style>
