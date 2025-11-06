<script lang="ts" setup>
import { ref, onMounted, defineExpose } from 'vue'
import { StaticCanvas, FabricImage } from 'fabric'
import { useMarkerTool } from '@/hooks/useMarkerTool'

interface Props {
  imageUrl?: string
}

const props = withDefaults(defineProps<Props>(), {
  imageUrl: 'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
})

const { currentTool, toggleTool, setCanvasCtx } = useMarkerTool()

const canvasRef = ref<null | HTMLCanvasElement>(null)

onMounted(() => {
  canvasRender()
})

// 在图片加载完后绘制到 canvas 上
async function canvasRender() {
  const canvas = canvasRef.value

  if (!canvas) return

  const fabricCanvas = new StaticCanvas(canvas)

  setCanvasCtx(fabricCanvas)

  // 加载图像
  const fabricImage = await FabricImage.fromURL(props.imageUrl)

  // 设置最大宽度
  const maxWidth = 800 // 你的最大宽度

  // 计算缩放比例
  let scale = 1
  if (fabricImage.width > maxWidth) {
    scale = maxWidth / fabricImage.width
  }

  // 应用缩放
  fabricImage.scale(scale)

  // 设置 canvas 尺寸以匹配缩放后的图像
  fabricCanvas.setDimensions({
    width: fabricImage.width * scale,
    height: fabricImage.height * scale,
  })

  // 添加图像到 canvas
  fabricCanvas.add(fabricImage)

  // 渲染
  fabricCanvas.renderAll()
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
