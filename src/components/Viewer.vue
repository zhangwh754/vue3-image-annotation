<script lang="ts" setup>
import { useMarkerTool } from '@/hooks/useMarkerTool'
import { ref, onMounted, defineExpose } from 'vue'

interface Props {
  imageUrl?: string
}

const props = withDefaults(defineProps<Props>(), {
  imageUrl: 'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
})

const { currentTool, toggleTool, clearCanvas, setCanvasCtx } = useMarkerTool()

const canvasRef = ref<null | HTMLCanvasElement>(null)

onMounted(() => {
  canvasRender()
})

// 在图片加载完后绘制到 canvas 上
function canvasRender() {
  const canvas = canvasRef.value

  if (!canvas) return

  setCanvasCtx(canvas)

  const img = new Image()
  img.crossOrigin = 'anonymous' // ⚠️ 若图片跨域，这行必加
  img.src = props.imageUrl
  img.onload = () => {
    const ctx = canvas.getContext('2d')!
    canvas.width = img.width
    canvas.height = img.height
    ctx.drawImage(img, 0, 0)
  }
}

// 暴露方法：导出 Canvas 内容为 File 对象
function exportImageFile() {
  return new Promise((resolve) => {
    const canvas = canvasRef.value
    if (!canvas) return
    canvas.toBlob((blob) => {
      if (!blob) return
      const file = new File([blob], 'annotation.png', { type: 'image/png' })
      resolve(file)
    }, 'image/png')
  })
}

defineExpose({
  exportImageFile,
})
</script>

<template>
  <div class="viewer">
    <div class="canvas-container">
      <div class="image-wrapper">
        <canvas ref="canvasRef"></canvas>

        {{ currentTool }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.viewer {
  .canvas-container {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .image-wrapper {
    position: relative;
    display: inline-block;

    canvas {
      display: block;
      max-width: 100%;
      height: auto;
      border: 1px solid #ddd;
      border-radius: 6px;
    }
  }
}
</style>
