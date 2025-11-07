import { ref, type Ref } from 'vue'
import type { ToolType } from '@/components/marker.config'
import useCircle from './useCircle'
import useRect from './useRect'
import useLine from './useLine'
import type { Canvas } from 'fabric'
import useText from './useText'

const currentTool = ref<ToolType>(null)
const canvasRef = ref<Canvas | null>(null)

export function useMarkerTool() {
  const { onMouseInit: onCircleMouseInit, onMouseClean: onCircleMouseClean } = useCircle(
    canvasRef as Ref<Canvas>,
  )
  const { onMouseInit: onRectMouseInit, onMouseClean: onRectMouseClean } = useRect(
    canvasRef as Ref<Canvas>,
  )
  const { onMouseInit: onLineMouseInit, onMouseClean: onLineMouseClean } = useLine(
    canvasRef as Ref<Canvas>,
  )
  const { onMouseInit: onTextMouseInit, onMouseClean: onTextMouseClean } = useText(
    canvasRef as Ref<Canvas>,
  )

  function setCanvasCtx(ctx: Canvas) {
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

    if (prevTool && prevTool !== tool) {
      cleanMouseEvent(prevTool)
    }

    return onMouseEventInit(targetTool)
  }

  function onMouseEventInit(tool: ToolType) {
    switch (tool) {
      case 'circle':
        onCircleMouseInit()
        break
      case 'rect':
        onRectMouseInit()
        break
      case 'line':
        onLineMouseInit()
        break
      case 'text':
        onTextMouseInit()
        break
    }

    if (canvasRef.value) {
      canvasRef.value.selection = false
    }
  }

  function cleanMouseEvent(tool: ToolType) {
    switch (tool) {
      case 'circle':
        onCircleMouseClean()
        break
      case 'rect':
        onRectMouseClean()
        break
      case 'line':
        onLineMouseClean()
        break
      case 'text':
        onTextMouseClean()
        break
    }

    if (canvasRef.value) {
      canvasRef.value.selection = true
    }
  }

  return {
    canvasRef,
    currentTool,
    setCanvasCtx,
    toggleTool,
  }
}
