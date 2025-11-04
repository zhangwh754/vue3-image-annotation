import type { Ref } from 'vue'

type MouseHandler = {
  onMouseMove: (e: MouseEvent) => void
  onMouseDown: (e: MouseEvent) => void
  onMouseUp: (e: MouseEvent) => void
}

export default function useMouse(domRef: Ref<HTMLElement>, mouseEvent: MouseHandler) {
  const { onMouseMove, onMouseDown, onMouseUp } = mouseEvent

  const onMouseInit = () => {
    domRef.value.addEventListener('mousemove', onMouseMove)
    domRef.value.addEventListener('mousedown', onMouseDown)
    domRef.value.addEventListener('mouseup', onMouseUp)

    return () => onMouseClean()
  }

  const onMouseClean = () => {
    if (!domRef.value) return

    domRef.value.removeEventListener('mousemove', onMouseMove)
    domRef.value.removeEventListener('mousedown', onMouseDown)
    domRef.value.removeEventListener('mouseup', onMouseUp)
  }

  return {
    onMouseInit,
    onMouseClean,
  }
}
