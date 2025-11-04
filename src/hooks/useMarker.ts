import type { ToolType } from '@/components/marker.config'
import { ref, onMounted, onBeforeUnmount } from 'vue'

interface MarkerOptions {
  canvasRef: HTMLCanvasElement
}

/**
 * useMarker - 通用标注绘制逻辑
 */
export function useMarker({ canvasRef }: MarkerOptions) {
  const currentTool = ref<ToolType>(null)
  const ctx = ref<CanvasRenderingContext2D | null>(null)

  /** 切换工具 */
  function toggleTool(tool: ToolType) {
    currentTool.value = currentTool.value === tool ? null : tool
  }

  /** 清空画布 */
  function clearCanvas() {
    if (ctx.value) {
      ctx.value.clearRect(0, 0, canvasRef.width, canvasRef.height)
    }
  }

  onMounted(() => {
    const canvas = canvasRef
    ctx.value = canvas.getContext('2d')
  })

  onBeforeUnmount(() => {
    const canvas = canvasRef
    if (!canvas) return
  })

  return {
    currentTool,
    toggleTool,
    clearCanvas,
  }
}
