import { reactive , watch} from 'vue'

export interface FormField {
    name: string
    label: string
    type: 'text' | 'email' | 'password' | 'select'
    cols?: number
    class?: string
    required?: boolean
    items?: any[]
    placeholder?: string
    defaultValue?: any
    rules?: ((value: any) => boolean | string)[]
}

export function useForm() {

    function buildForm(fields: FormField[]) {
        const form = reactive<Record<string, any>>({})

        fields.forEach(field => {
            form[field.name] = field.defaultValue ?? ''
        })

        return form
    }

    function buildRules(field: FormField){
        const rules = [...(field.rules ?? [])]
        if(field.required){
            rules.unshift(v => !!v || 'Campo obrigatório')
        }
        return rules
    }

    return {
        buildForm
    }
}