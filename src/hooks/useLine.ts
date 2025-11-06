// useLine.ts
import { ref, type Ref } from 'vue'
import { Line, type StaticCanvas } from 'fabric'
import defaultConfig from '@/config/default-config'
import useMouse from './useMouse'

export default function useLine(canvasRef: Ref<StaticCanvas>) {
  const isDrawing = ref(false)
  const startX = ref(0)
  const startY = ref(0)

  const strokeWidth = ref(defaultConfig.strokeWidth)
  const strokeColor = ref(defaultConfig.strokeColor)

  // 保存临时线条对象
  let tempLine: Line | null = null

  const getCanvasCoordinates = (e: MouseEvent) => {
    const canvas = canvasRef.value
    const rect = canvas.getElement().getBoundingClientRect()
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }
  }

  const { onMouseInit, onMouseClean } = useMouse(canvasRef, {
    onMouseDown: (e: MouseEvent) => {
      const canvas = canvasRef.value
      if (!canvas) return

      isDrawing.value = true
      const { x, y } = getCanvasCoordinates(e)
      startX.value = x
      startY.value = y

      // 创建临时线条用于预览
      tempLine = new Line([x, y, x, y], {
        stroke: strokeColor.value,
        strokeWidth: strokeWidth.value,
        selectable: false,
        evented: false,
      })

      canvas.add(tempLine)
      canvas.renderAll()
    },

    onMouseMove: (e: MouseEvent) => {
      if (!isDrawing.value || !tempLine) return

      const canvas = canvasRef.value
      if (!canvas) return

      const { x, y } = getCanvasCoordinates(e)

      // 更新线条终点
      tempLine.set({
        x2: x,
        y2: y,
      })

      canvas.renderAll()
    },

    onMouseDblClick: (e: MouseEvent) => {
      if (!isDrawing.value || !tempLine) return

      const canvas = canvasRef.value
      if (!canvas) return

      isDrawing.value = false

      const { x, y } = getCanvasCoordinates(e)

      // 计算线条长度
      const length = Math.sqrt(Math.pow(x - startX.value, 2) + Math.pow(y - startY.value, 2))

      // 如果线条太短，移除它
      if (length < 2) {
        canvas.remove(tempLine)
      } else {
        // 更新最终位置并设置为可选择
        tempLine.set({
          x2: x,
          y2: y,
          selectable: true,
          evented: true,
        })
      }

      canvas.renderAll()
      tempLine = null
    },
  })

  const cleanupLine = () => {
    if (tempLine && canvasRef.value) {
      canvasRef.value.remove(tempLine)
      canvasRef.value.renderAll()
      tempLine = null
    }
    isDrawing.value = false
  }

  return {
    onMouseInit,
    onMouseClean: () => {
      cleanupLine()
      onMouseClean()
    },
    strokeWidth,
    strokeColor,
  }
}
