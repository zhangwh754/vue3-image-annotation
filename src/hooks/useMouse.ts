import type { StaticCanvas } from 'fabric'
import type { Ref } from 'vue'

type MouseHandler = {
  onMouseMove?: (e: MouseEvent) => void
  onMouseDown?: (e: MouseEvent) => void
  onMouseUp?: (e: MouseEvent) => void
}

export default function useMouse(domRef: Ref<StaticCanvas>, mouseEvent: MouseHandler) {
  const { onMouseMove, onMouseDown, onMouseUp } = mouseEvent

  const onMouseInit = () => {
    const canvasElement = domRef.value?.getElement()
    if (!canvasElement) return

    if (onMouseMove) canvasElement.addEventListener('mousemove', onMouseMove)
    if (onMouseDown) canvasElement.addEventListener('mousedown', onMouseDown)
    if (onMouseUp) canvasElement.addEventListener('mouseup', onMouseUp)

    return () => onMouseClean()
  }

  const onMouseClean = () => {
    const canvasElement = domRef.value?.getElement()
    if (!canvasElement) return

    if (onMouseMove) canvasElement.removeEventListener('mousemove', onMouseMove)
    if (onMouseDown) canvasElement.removeEventListener('mousedown', onMouseDown)
    if (onMouseUp) canvasElement.removeEventListener('mouseup', onMouseUp)
  }

  return {
    onMouseInit,
    onMouseClean,
  }
}
