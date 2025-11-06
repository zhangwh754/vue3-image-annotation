import { ref, type Ref } from 'vue'
import type { ToolType } from '@/components/marker.config'
import useCircle from './useCircle'
import useRect from './useRect'
import useLine from './useLine'
import type { StaticCanvas } from 'fabric'

const currentTool = ref<ToolType>(null)
const canvasRef = ref<StaticCanvas | null>(null)

export function useMarkerTool() {
  const { onMouseInit: onCircleMouseInit, onMouseClean: onCircleMouseClean } = useCircle(
    canvasRef as Ref<StaticCanvas>,
  )
  // const { onMouseInit: onRectMouseInit, onMouseClean: onRectMouseClean } = useRect(
  //   canvasRef as Ref<StaticCanvas>,
  // )
  const { onMouseInit: onLineMouseInit, onMouseClean: onLineMouseClean } = useLine(
    canvasRef as Ref<StaticCanvas>,
  )

  function setCanvasCtx(ctx: StaticCanvas) {
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
      // case 'rect':
      //   onRectMouseInit()
      //   break
      case 'line':
        onLineMouseInit()
        break
    }
  }

  function cleanMouseEvent(tool: ToolType) {
    switch (tool) {
      case 'circle':
        onCircleMouseClean()
        break
      // case 'rect':
      //   onRectMouseClean()
      //   break
      case 'line':
        onLineMouseClean()
        break
    }
  }

  return {
    canvasRef,
    currentTool,
    setCanvasCtx,
    toggleTool,
  }
}
