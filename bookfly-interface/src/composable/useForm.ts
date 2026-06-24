import { ref, reactive, computed } from 'vue'

export interface FormField {
    name: string
    label: string
    type: 'text' | 'email' | 'password' | 'select'
    cols?: number
    required?: boolean
    items?: any[]
    placeholder?: string
    defaultValue?: any
    rules?: ((value: any) => boolean | string)[]
}

export function useForm() {
    const showModal = ref(false)
    const modalType = ref<'edit' | 'delete' | null>(null)
    const selectedItem = ref<any>(null)
    const lastOptions = ref<any>(null)

    function setLastOptions(options: any) {
        lastOptions.value = options
    }


    function buildForm(fields: FormField[]) {
        const formData: Record<string, any> = {}
        fields.forEach((field) => {
            formData[field.name] = field.defaultValue ?? ''
        })
        return ref(formData)
    }


    function fillForm(formData: Record<string, any>, item: any) {
        Object.keys(formData).forEach((key) => {
            formData[key] = item?.[key] ?? ''
        })
    }

    function openModal(type: 'edit' | 'delete', item?: any) {
        modalType.value = type
        selectedItem.value = item ?? null
        showModal.value = true
    }

    function closeModal() {
        modalType.value = null
        selectedItem.value = null
        showModal.value = false
    }

    function deleteMessage(entityLabel: string) {
        return selectedItem.value?.name
            ? `Deseja apagar ${entityLabel} "${selectedItem.value.name}"?`
            : `Deseja apagar este ${entityLabel}?`
    }

    return {
        showModal,
        modalType,
        selectedItem,
        buildForm,
        fillForm,
        openModal,
        closeModal,
        deleteMessage,
        lastOptions,
        setLastOptions
    }
}