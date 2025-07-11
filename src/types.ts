export interface FormItem {
    name: string
    type: string
    label: string
    placeholder?: string
    required?: boolean
    validation?: object
    autoResize?: boolean // For Textarea
    // For select, multiselect, radio
    options?: { label: string; value: any }[]
    checkboxLabel?: string // For checkbox
    //允许其他任何通过v-bind传递的属性
    [key: string]: any
}
