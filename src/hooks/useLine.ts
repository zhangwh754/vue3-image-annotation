// useLine.ts
import { ref, type Ref } from 'vue'
import { Line, type Canvas, type TPointerEvent, type TPointerEventInfo } from 'fabric'
import defaultConfig from '@/config/default-config'
import useMouse from './useMouse'

export default function useLine(canvasRef: Ref<Canvas>) {
  const isDrawing = ref(false)
  const startX = ref(0)
  const startY = ref(0)

  const strokeWidth = ref(defaultConfig.strokeWidth)
  const strokeColor = ref(defaultConfig.strokeColor)

  // 保存临时线条对象
  let tempLine: Line | null = null

  const { onMouseInit, onMouseClean } = useMouse(canvasRef, {
    onMouseDown: (options: TPointerEventInfo<TPointerEvent>) => {
      const canvas = canvasRef.value
      if (!canvas) return

      const target = canvas.findTarget(options.e)
      if (target && target instanceof Line) {
        return
      }

      isDrawing.value = true
      const { x, y } = canvas.getViewportPoint(options.e)
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

    onMouseMove: (options: TPointerEventInfo<TPointerEvent>) => {
      if (!isDrawing.value || !tempLine) return

      const canvas = canvasRef.value
      if (!canvas) return

      const { x, y } = canvas.getViewportPoint(options.e)

      // 更新线条终点
      tempLine.set({
        x2: x,
        y2: y,
      })

      canvas.renderAll()
    },

    onMouseUp: (options: TPointerEventInfo<TPointerEvent>) => {
      if (!isDrawing.value || !tempLine) return

      const canvas = canvasRef.value
      if (!canvas) return

      isDrawing.value = false

      const { x, y } = canvas.getViewportPoint(options.e)

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
          editable: true, // 可编辑
          hasControls: false,
          hasBorders: true,
          perPixelTargetFind: true, // 精确像素检测
          targetFindTolerance: 5, // 增加选择容差（像素）
        })
      }

      canvas.renderAll()
      canvas.setActiveObject(tempLine)
      canvas.discardActiveObject()
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
