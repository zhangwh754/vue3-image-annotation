import type { Canvas, TPointerEvent, TPointerEventInfo } from 'fabric'
import type { Ref } from 'vue'

type MouseHandler = {
  onMouseMove?: (options: TPointerEventInfo<TPointerEvent>) => void
  onMouseDown?: (options: TPointerEventInfo<TPointerEvent>) => void
  onMouseUp?: (options: TPointerEventInfo<TPointerEvent>) => void
  onMouseDblClick?: (options: TPointerEventInfo<TPointerEvent>) => void
  onMouseRightClick?: (e: MouseEvent) => void
}

export default function useMouse(domRef: Ref<Canvas>, mouseEvent: MouseHandler) {
  const { onMouseMove, onMouseDown, onMouseUp, onMouseDblClick, onMouseRightClick } = mouseEvent

  function onContextMenuHandler(e: MouseEvent) {
    e.preventDefault()

    if (onMouseRightClick) {
      onMouseRightClick(e)
    }
  }

  const onMouseInit = () => {
    const canvasElement = domRef.value
    if (!canvasElement) return

    if (onMouseMove) canvasElement.on('mouse:move', onMouseMove)
    if (onMouseDown) canvasElement.on('mouse:down', onMouseDown)
    if (onMouseUp) canvasElement.on('mouse:up', onMouseUp)
    if (onMouseDblClick) canvasElement.on('mouse:dblclick', onMouseDblClick)

    canvasElement.getElement().addEventListener('contextmenu', onContextMenuHandler)

    return () => onMouseClean()
  }

  const onMouseClean = () => {
    const canvasElement = domRef.value
    if (!canvasElement) return

    if (onMouseMove) canvasElement.off('mouse:move', onMouseMove)
    if (onMouseDown) canvasElement.off('mouse:down', onMouseDown)
    if (onMouseUp) canvasElement.off('mouse:up', onMouseUp)
    if (onMouseDblClick) canvasElement.off('mouse:dblclick', onMouseDblClick)

    canvasElement.getElement().removeEventListener('contextmenu', onContextMenuHandler)
  }

  return {
    onMouseInit,
    onMouseClean,
  }
}
