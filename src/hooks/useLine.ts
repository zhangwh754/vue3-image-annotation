// useLine.ts
import { ref, type Ref } from 'vue'
import defaultConfig from '@/config/default-config'
import useMouse from './useMouse'

export default function useLine(canvasRef: Ref<HTMLCanvasElement>) {
  const isDrawing = ref(false)
  const startX = ref(0)
  const startY = ref(0)
  const endX = ref(0)
  const endY = ref(0)

  const strokeWidth = ref(defaultConfig.strokeWidth)
  const strokeColor = ref(defaultConfig.strokeColor)

  // 保存初始画布状态
  let imageData: ImageData | null = null

  const getCanvasCoordinates = (e: MouseEvent) => {
    const rect = canvasRef.value.getBoundingClientRect()
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }
  }

  const drawLine = (
    ctx: CanvasRenderingContext2D,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
  ) => {
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.strokeStyle = strokeColor.value
    ctx.lineWidth = strokeWidth.value
    ctx.stroke()
    ctx.closePath()
  }

  const { onMouseInit, onMouseClean } = useMouse(canvasRef, {
    onMouseDown: (e: MouseEvent) => {
      const ctx = canvasRef.value.getContext('2d')
      if (!ctx) return

      isDrawing.value = true
      const { x, y } = getCanvasCoordinates(e)
      startX.value = x
      startY.value = y

      // 保存当前画布状态
      imageData = ctx.getImageData(0, 0, canvasRef.value.width, canvasRef.value.height)
    },

    onMouseMove: (e: MouseEvent) => {
      if (!isDrawing.value) return

      const ctx = canvasRef.value.getContext('2d')
      if (!ctx || !imageData) return

      const { x, y } = getCanvasCoordinates(e)
      endX.value = x
      endY.value = y

      // 恢复画布状态（清除预览）
      ctx.putImageData(imageData, 0, 0)

      // 绘制预览
      drawLine(ctx, startX.value, startY.value, endX.value, endY.value)
    },

    onMouseUp: (e: MouseEvent) => {
      if (!isDrawing.value) return

      const ctx = canvasRef.value.getContext('2d')
      if (!ctx) return

      isDrawing.value = false

      const { x, y } = getCanvasCoordinates(e)
      endX.value = x
      endY.value = y

      // 最终绘制
      if (imageData) {
        ctx.putImageData(imageData, 0, 0)
      }
      drawLine(ctx, startX.value, startY.value, endX.value, endY.value)

      imageData = null
    },
  })

  return {
    onMouseInit,
    onMouseClean,
    strokeWidth,
    strokeColor,
  }
}
