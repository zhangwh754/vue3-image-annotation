import { ref, type Ref } from 'vue'
import defaultConfig from '@/config/default-config'
import useMouse from './useMouse'

export default function useCircle(canvasRef: Ref<HTMLCanvasElement>) {
  const isDrawing = ref(false)
  const startX = ref(0)
  const startY = ref(0)
  const endX = ref(0)
  const endY = ref(0)

  const strokeWidth = ref(defaultConfig.strokeWidth)
  const strokeColor = ref(defaultConfig.strokeColor)
  const fillColor = ref(defaultConfig.fillColor)

  // 保存初始画布状态
  let imageData: ImageData | null = null

  const getCanvasCoordinates = (e: MouseEvent) => {
    const rect = canvasRef.value.getBoundingClientRect()
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }
  }

  const drawCircle = (ctx: CanvasRenderingContext2D, x: number, y: number, radius: number) => {
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, 2 * Math.PI)
    ctx.strokeStyle = strokeColor.value
    ctx.lineWidth = strokeWidth.value
    ctx.stroke()
    if (fillColor.value) {
      ctx.fillStyle = fillColor.value
      ctx.fill()
    }
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

      // 计算半径
      const radius = Math.sqrt(
        Math.pow(endX.value - startX.value, 2) + Math.pow(endY.value - startY.value, 2),
      )

      // 绘制预览
      drawCircle(ctx, startX.value, startY.value, radius)
    },

    onMouseUp: (e: MouseEvent) => {
      if (!isDrawing.value) return

      const ctx = canvasRef.value.getContext('2d')
      if (!ctx) return

      isDrawing.value = false

      const { x, y } = getCanvasCoordinates(e)
      endX.value = x
      endY.value = y

      // 计算最终半径
      const radius = Math.sqrt(
        Math.pow(endX.value - startX.value, 2) + Math.pow(endY.value - startY.value, 2),
      )

      // 最终绘制
      if (imageData) {
        ctx.putImageData(imageData, 0, 0)
      }
      drawCircle(ctx, startX.value, startY.value, radius)

      imageData = null
    },
  })

  return {
    onMouseInit,
    onMouseClean,
    strokeWidth,
    strokeColor,
    fillColor,
  }
}
