// useText.ts
import { ref, type Ref } from 'vue'
import { IText, type Canvas, type TPointerEvent, type TPointerEventInfo } from 'fabric'
import defaultConfig from '@/config/default-config'
import useMouse from './useMouse'

export default function useText(canvasRef: Ref<Canvas>) {
  const startX = ref(0)
  const startY = ref(0)

  const textSize = ref(defaultConfig.fontSize)
  const fontColor = ref(defaultConfig.fontColor)

  // 保存临时文本对象
  let tempText: IText | null = null

  const { onMouseInit, onMouseClean } = useMouse(canvasRef, {
    onMouseDown: (options: TPointerEventInfo<TPointerEvent>) => {
      const canvas = canvasRef.value
      if (!canvas) return

      const { x, y } = canvas.getViewportPoint(options.e)

      if (tempText) {
        tempText.enterEditing()
        tempText.hiddenTextarea?.focus()
        return
      }

      startX.value = x
      startY.value = y

      // 创建文本对象
      tempText = new IText('双击编辑文本', {
        left: x,
        top: y,
        fontSize: textSize.value,
        fill: fontColor.value,
        fontFamily: 'Arial',
        selectable: true,
        editable: true,
      })

      if (tempText) {
        // 聚焦
        tempText.on('editing:entered', function (res) {})

        // 矢焦
        tempText.on('editing:exited', () => {})

        canvas.add(tempText)
        canvas.renderAll()
        canvas.setActiveObject(tempText)
        canvas.discardActiveObject()
        tempText.enterEditing()
        tempText.hiddenTextarea?.focus()
      }
    },
  })

  const cleanupText = () => {
    const canvas = canvasRef.value
    if (!canvas) return

    if (tempText) {
      canvas.remove(tempText)
      tempText = null
    }

    canvas.renderAll()
  }

  return {
    onMouseInit,
    onMouseClean: () => {
      cleanupText()
      onMouseClean()
    },

    fontColor,
    textSize,
  }
}
