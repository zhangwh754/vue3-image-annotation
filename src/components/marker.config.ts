export type ToolType = 'circle' | 'rect' | 'line' | 'text' | null

type MarkerConfig = {
  type: ToolType
  icon: string
}

const markerConfig: MarkerConfig[] = [
  { type: 'circle', icon: 'icon-tuoyuan' },
  { type: 'rect', icon: 'icon-juxing' },
  { type: 'line', icon: 'icon-huabi' },
  { type: 'text', icon: 'icon-wenzi' },
]

export default markerConfig
