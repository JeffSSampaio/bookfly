export interface BtnAction {
  label: string
  icon: string
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'error'
  size: string
  handler: (item: any) => void
}
