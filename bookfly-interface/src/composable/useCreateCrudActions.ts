import type { BtnAction } from '@/composable/useBtnActions'

export function createCrudActions(
  editFn: (item: any) => void,
  deleteFn: (item: any) => void
): BtnAction[] {
  return [
    {
      label: 'Editar',
      icon: 'mdi-pencil',
      size: 'small',
      color: 'warning',
      handler: editFn
    },
    {
      label: 'Apagar',
      icon: 'mdi-delete',
      size: 'small',
      color: 'error',
      handler: deleteFn
    }
  ]
}