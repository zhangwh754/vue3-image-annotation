import { ref, type Ref } from 'vue'
import type { ToolType } from '@/components/marker.config'
import useCircle from './useCircle'

const currentTool = ref<ToolType>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)

export function useMarkerTool() {
  const { onMouseInit: onCircleMouseInit, onMouseClean: onCircleMouseClean } = useCircle(
    canvasRef as Ref<HTMLCanvasElement>,
  )

  function setCanvasCtx(ctx: HTMLCanvasElement) {
    canvasRef.value = ctx
  }

  /** 切换工具 */
  function toggleTool(tool: ToolType) {
    const prevTool = currentTool.value
    const targetTool = currentTool.value === tool ? null : tool
    currentTool.value = targetTool

    if (targetTool === null) {
      return cleanMouseEvent(tool)
    }

    if (prevTool !== tool) {
      cleanMouseEvent(prevTool)
    }

    return onMouseEventInit(targetTool)
  }

  function onMouseEventInit(tool: ToolType) {
    switch (tool) {
      case 'circle':
        onCircleMouseInit()
        break
    }
  }

  function cleanMouseEvent(tool: ToolType) {
    switch (tool) {
      case 'circle':
        onCircleMouseClean()
        break
    }
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
    canvasRef,
    currentTool,
    setCanvasCtx,
    toggleTool,
    clearCanvas,
  }
}
