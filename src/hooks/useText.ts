// useText.ts
import { ref, nextTick, type Ref } from 'vue'
import { IText, type Canvas, type TPointerEvent, type TPointerEventInfo } from 'fabric'
import defaultConfig from '@/config/default-config'
import useMouse from './useMouse'

export default function useText(canvasRef: Ref<Canvas>) {
  const textSize = ref(defaultConfig.fontSize)
  const fontColor = ref(defaultConfig.fontColor)
  let tempText: IText | null = null
  let editingTicker: number | null = null

  const { onMouseInit, onMouseClean } = useMouse(canvasRef, {
    onMouseDown: async (options: TPointerEventInfo<TPointerEvent>) => {
      const canvas = canvasRef.value
      if (!canvas) return

      // 🔧 修复2: 检测点击目标是否为文本对象
      const target = canvas.findTarget(options.e)
      if (target && target instanceof IText) {
        // 点击到已有文本，先清理之前的编辑状态
        if (tempText && tempText !== target && tempText.isEditing) {
          tempText.exitEditing()
        }

        // 进入新的编辑模式
        canvas.setActiveObject(target)
        target.enterEditing()
        target.selectAll() // 全选已有文本

        tempText = target
        startEditingTicker(target, canvas)

        await nextTick()
        target.hiddenTextarea?.focus()
        return
      }

      // 若当前文本仍在编辑中，则退出编辑
      if (tempText && tempText.isEditing) {
        tempText.exitEditing()
        tempText = null
      }

      const { x, y } = canvas.getViewportPoint(options.e)
      const text = new IText('双击编辑文本', {
        left: x,
        top: y,
        fontSize: textSize.value,
        fill: fontColor.value,
        fontFamily: 'Arial',
        selectable: true,
        editable: true,
        hasControls: false,
        objectCaching: false,
      })

      // 持续渲染修复光标与选区不同步
      function startEditingTicker(textObj: IText, canvasObj: Canvas) {
        if (editingTicker) cancelAnimationFrame(editingTicker)
        const tick = () => {
          if (textObj.isEditing) {
            canvasObj.requestRenderAll()
            editingTicker = requestAnimationFrame(tick)
          }
        }
        editingTicker = requestAnimationFrame(tick)
      }

      text.on('editing:entered', () => {
        tempText = text
        startEditingTicker(text, canvas)

        nextTick(() => {
          const ta = text.hiddenTextarea
          if (!ta) return
          ta.focus()

          // 🔧 修复1: 使用 selectAll + input 事件替换默认文本
          text.selectAll()
          canvas.requestRenderAll()

          let isFirstInput = true

          const handleInput = () => {
            if (isFirstInput) {
              isFirstInput = false
              // input 事件触发时，新内容已经替换了选中文本
              // 无需额外处理
            }
          }

          const handleKeyDown = (e: KeyboardEvent) => {
            if (isFirstInput) {
              // 忽略功能键
              if (
                e.ctrlKey ||
                e.metaKey ||
                e.altKey ||
                [
                  'Shift',
                  'Control',
                  'Alt',
                  'Meta',
                  'ArrowLeft',
                  'ArrowRight',
                  'ArrowUp',
                  'ArrowDown',
                  'Home',
                  'End',
                  'PageUp',
                  'PageDown',
                  'Tab',
                  'Escape',
                  'CapsLock',
                ].includes(e.key)
              ) {
                return
              }

              // 对于可输入的键，清空文本
              if (
                e.key.length === 1 ||
                e.key === 'Enter' ||
                e.key === 'Backspace' ||
                e.key === 'Delete'
              ) {
                isFirstInput = false
                if (e.key === 'Backspace' || e.key === 'Delete') {
                  text.text = ''
                  text.selectionStart = 0
                  text.selectionEnd = 0
                  text.setCoords()
                  canvas.requestRenderAll()
                  e.preventDefault()
                }
                // 其他键让 Fabric 自然处理（会替换选中文本）
              }
            }
          }

          const handleMouseDown = () => {
            if (isFirstInput) {
              isFirstInput = false
            }
          }

          ta.addEventListener('input', handleInput)
          ta.addEventListener('keydown', handleKeyDown)
          ta.addEventListener('mousedown', handleMouseDown)

          // 清理函数
          text.on('editing:exited', () => {
            ta.removeEventListener('input', handleInput)
            ta.removeEventListener('keydown', handleKeyDown)
            ta.removeEventListener('mousedown', handleMouseDown)
          })
        })
      })

      text.on('editing:exited', () => {
        if (tempText === text) {
          tempText = null
        }
        if (editingTicker) {
          cancelAnimationFrame(editingTicker)
          editingTicker = null
        }
        canvas.requestRenderAll()
      })

      canvas.add(text)
      canvas.setActiveObject(text)
      text.enterEditing()

      await nextTick()
      text.hiddenTextarea?.focus()

      canvas.renderAll()
    },
  })

  const cleanupText = () => {
    const canvas = canvasRef.value
    if (!canvas) return
    if (tempText && tempText.isEditing) {
      tempText.exitEditing()
    }
    tempText = null
    if (editingTicker) {
      cancelAnimationFrame(editingTicker)
      editingTicker = null
    }
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
