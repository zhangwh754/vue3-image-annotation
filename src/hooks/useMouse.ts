import type { Ref } from 'vue'

type MouseHandler = {
  onMouseMove?: (e: MouseEvent) => void
  onMouseDown?: (e: MouseEvent) => void
  onMouseUp?: (e: MouseEvent) => void
}

export default function useMouse(domRef: Ref<HTMLElement>, mouseEvent: MouseHandler) {
  const { onMouseMove, onMouseDown, onMouseUp } = mouseEvent

  const onMouseInit = () => {
    if (onMouseMove) domRef.value.addEventListener('mousemove', onMouseMove)
    if (onMouseDown) domRef.value.addEventListener('mousedown', onMouseDown)
    if (onMouseUp) domRef.value.addEventListener('mouseup', onMouseUp)

    return () => onMouseClean()
  }

  const onMouseClean = () => {
    if (!domRef.value) return

    if (onMouseMove) domRef.value.removeEventListener('mousemove', onMouseMove)
    if (onMouseDown) domRef.value.removeEventListener('mousedown', onMouseDown)
    if (onMouseUp) domRef.value.removeEventListener('mouseup', onMouseUp)
  }

  return {
    onMouseInit,
    onMouseClean,
  }
}
