import { ref, type Ref } from 'vue'
import { Circle, type Canvas, type TPointerEvent, type TPointerEventInfo } from 'fabric'
import defaultConfig from '@/config/default-config'
import useMouse from './useMouse'

export default function useCircle(canvasRef: Ref<Canvas>) {
  const isDrawing = ref(false)
  const startX = ref(0)
  const startY = ref(0)

  const strokeWidth = ref(defaultConfig.strokeWidth)
  const strokeColor = ref(defaultConfig.strokeColor)
  const fillColor = ref(defaultConfig.fillColor)

  // 保存临时圆形对象
  let tempCircle: Circle | null = null

  const { onMouseInit, onMouseClean } = useMouse(canvasRef, {
    onMouseDown: (options: TPointerEventInfo<TPointerEvent>) => {
      const canvas = canvasRef.value
      if (!canvas) return

      isDrawing.value = true
      const { x, y } = canvas.getViewportPoint(options.e)
      startX.value = x
      startY.value = y

      // 创建临时圆形用于预览
      tempCircle = new Circle({
        left: x,
        top: y,
        radius: 0,
        fill: fillColor.value || 'transparent',
        stroke: strokeColor.value,
        strokeWidth: strokeWidth.value,
        originX: 'center',
        originY: 'center',
        selectable: false,
        evented: false,
      })

      canvas.add(tempCircle)
      canvas.renderAll()
    },

    onMouseMove: (options: TPointerEventInfo<TPointerEvent>) => {
      if (!isDrawing.value || !tempCircle) return

      const canvas = canvasRef.value
      if (!canvas) return

      const { x, y } = canvas.getViewportPoint(options.e)

      // 计算半径
      const radius = Math.sqrt(Math.pow(x - startX.value, 2) + Math.pow(y - startY.value, 2))

      // 更新临时圆形
      tempCircle.set({
        radius: radius,
      })

      canvas.renderAll()
    },

    onMouseUp: (options: TPointerEventInfo<TPointerEvent>) => {
      if (!isDrawing.value || !tempCircle) return

      const canvas = canvasRef.value
      if (!canvas) return

      isDrawing.value = false

      const { x, y } = canvas.getViewportPoint(options.e)

      // 计算最终半径
      const radius = Math.sqrt(Math.pow(x - startX.value, 2) + Math.pow(y - startY.value, 2))

      // 如果半径太小，移除临时圆形
      if (radius < 8) {
        canvas.remove(tempCircle)
      } else {
        // 将临时圆形转为正式对象（设置为可选择）
        tempCircle.set({
          selectable: true, // 可选择
          evented: true, // 可交互
          hasControls: true, // 显示控制点
          hasBorders: true, // 显示边框
        })
      }

      canvas.renderAll()
      canvas.setActiveObject(tempCircle)
      canvas.discardActiveObject()
      tempCircle = null
    },
  })

  const cleanupCircle = () => {
    if (tempCircle && canvasRef.value) {
      canvasRef.value.remove(tempCircle)
      canvasRef.value.renderAll()
      tempCircle = null
    }
    isDrawing.value = false
  }

  return {
    onMouseInit,
    onMouseClean: () => {
      cleanupCircle()
      onMouseClean()
    },
    strokeWidth,
    strokeColor,
    fillColor,
  }
}
