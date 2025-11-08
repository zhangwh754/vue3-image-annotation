// useRect.ts
import { ref, type Ref } from 'vue'
import { Rect, type Canvas, type TPointerEvent, type TPointerEventInfo } from 'fabric'
import defaultConfig from '@/config/default-config'
import useMouse from './useMouse'

export default function useRect(canvasRef: Ref<Canvas>) {
  const isDrawing = ref(false)
  const startX = ref(0)
  const startY = ref(0)

  const strokeWidth = ref(defaultConfig.strokeWidth)
  const strokeColor = ref(defaultConfig.strokeColor)
  const fillColor = ref(defaultConfig.fillColor)

  // 保存临时矩形对象
  let tempRect: Rect | null = null

  const { onMouseInit, onMouseClean } = useMouse(canvasRef, {
    onMouseDown: (options: TPointerEventInfo<TPointerEvent>) => {
      const canvas = canvasRef.value
      if (!canvas) return

      const target = canvas.findTarget(options.e)
      if (target && target instanceof Rect) {
        return
      }

      isDrawing.value = true
      const { x, y } = canvas.getViewportPoint(options.e)
      startX.value = x
      startY.value = y

      // 创建临时矩形用于预览
      tempRect = new Rect({
        left: x,
        top: y,
        width: 0,
        height: 0,
        fill: fillColor.value || 'transparent',
        stroke: strokeColor.value,
        strokeWidth: strokeWidth.value,
        selectable: false,
        evented: false,
      })

      canvas.add(tempRect)
      canvas.renderAll()
    },

    onMouseMove: (options: TPointerEventInfo<TPointerEvent>) => {
      if (!isDrawing.value || !tempRect) return

      const canvas = canvasRef.value
      if (!canvas) return

      const { x, y } = canvas.getViewportPoint(options.e)

      // 计算矩形的左上角和宽高
      const width = Math.abs(x - startX.value)
      const height = Math.abs(y - startY.value)
      const left = Math.min(x, startX.value)
      const top = Math.min(y, startY.value)

      // 更新临时矩形
      tempRect.set({
        left,
        top,
        width,
        height,
      })

      canvas.renderAll()
    },

    onMouseUp: (options: TPointerEventInfo<TPointerEvent>) => {
      if (!isDrawing.value || !tempRect) return

      const canvas = canvasRef.value
      if (!canvas) return

      isDrawing.value = false

      const { x, y } = canvas.getViewportPoint(options.e)

      // 计算最终尺寸
      const width = Math.abs(x - startX.value)
      const height = Math.abs(y - startY.value)
      const left = Math.min(x, startX.value)
      const top = Math.min(y, startY.value)

      // 如果矩形太小，移除它
      if (width < 2 || height < 2) {
        canvas.remove(tempRect)
      } else {
        // 更新最终状态并设置为可选择
        tempRect.set({
          left,
          top,
          width,
          height,
          selectable: true, // 可选择
          editable: true, // 可编辑
          evented: true, // 可交互
          hasControls: true, // 显示控制点
          hasBorders: true, // 显示边框
        })
      }

      canvas.renderAll()
      canvas.setActiveObject(tempRect)
      canvas.discardActiveObject()
      tempRect = null
    },
  })

  const cleanupRect = () => {
    if (tempRect && canvasRef.value) {
      canvasRef.value.remove(tempRect)
      canvasRef.value.renderAll()
      tempRect = null
    }
    isDrawing.value = false
  }

  return {
    onMouseInit,
    onMouseClean: () => {
      cleanupRect()
      onMouseClean()
    },
    strokeWidth,
    strokeColor,
    fillColor,
  }
}
