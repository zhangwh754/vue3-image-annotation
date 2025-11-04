import { ref } from 'vue'
import type { ToolType } from '@/components/marker.config'

const currentTool = ref<ToolType>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)

export function useMarkerTool() {
  function setCanvasCtx(ctx: HTMLCanvasElement) {
    canvasRef.value = ctx
  }

  /** 切换工具 */
  function toggleTool(tool: ToolType) {
    currentTool.value = currentTool.value === tool ? null : tool
  }

  /** 清空画布 */
  function clearCanvas() {
    if (canvasRef.value) {
      const ctx = canvasRef.value
      const ctxContext = canvasRef.value.getContext('2d')!

      ctxContext.clearRect(0, 0, ctx.width, ctx.height)
    }
  }

  return {
    setCanvasCtx,
    currentTool,
    toggleTool,
    clearCanvas,
  }
}
