export interface FormItem {
    name: string,
    type: string,
    label: string,
    placeholder?: string,
    required?: boolean,
    validation?: object,
    autoResize?: boolean,
    //允许其他任何通过v-bind传递的属性
    [key: string]: any
}
