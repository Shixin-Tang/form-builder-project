<script setup lang="ts">
import { computed, type PropType } from 'vue'
import type { FormItem } from '../types'

// --- Component Imports ---
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import InputNumber from 'primevue/inputnumber'
import Password from 'primevue/password'
import Calendar from 'primevue/calendar'
import Dropdown from 'primevue/dropdown'
import MultiSelect from 'primevue/multiselect'
import Checkbox from 'primevue/checkbox'
import RadioButton from 'primevue/radiobutton'

//定义动态组件类型的映射
//将json配置文件的type映射为PrimeVue的组件类型
const componentMap: { [key: string]: any } = {
    text: InputText,
    email: InputText,
    textarea: Textarea,
    number: InputNumber,
    password: Password,
    date: Calendar,
    select: Dropdown,
    multiselect: MultiSelect,
    checkbox: Checkbox,
}

//定义porps
const props = defineProps({
    schema: {
        type: Array as PropType<FormItem[]>,
        required: true,
    },
    modelValue: {
        type: Object as PropType<{ [key: string]: any }>,
        required: true,
    },
})

//定义emits,可以支持v-model
const emit = defineEmits(['update:modelValue'])

//定义一个计算属性，绑定v-model
const formData = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value),
})
</script>

<template>
    <!-- 遍历schema数组，动态渲染表单的内容-->
    <div v-for="field in schema" :key="field.name" class="flex flex-col gap-2">
        <label v-if="field.type !== 'checkbox'" :for="field.name" class="font-semibold">{{
            field.label
        }}</label>
        <span v-else class="font-semibold">{{ field.label }}</span>

        <!-- Radio Button Group -->
        <div v-if="field.type === 'radio'" class="flex items-center gap-6 pt-1">
            <div v-for="option in field.options" :key="option.value" class="flex items-center">
                <RadioButton
                    :inputId="`${field.name}-${option.value}`"
                    :name="field.name"
                    :value="option.value"
                    v-model="formData[field.name]"
                />
                <label :for="`${field.name}-${option.value}`" class="ml-2 font-normal">{{
                    option.label
                }}</label>
            </div>
        </div>

        <!-- Single Checkbox (for boolean) -->
        <div v-else-if="field.type === 'checkbox'" class="flex items-center gap-2 pt-1">
            <Checkbox :inputId="field.name" v-model="formData[field.name]" :binary="true" />
            <label :for="field.name" class="font-normal">{{ field.checkboxLabel }}</label>
        </div>

        <!-- All other component types -->
        <component
            v-else
            :is="componentMap[field.type] || InputText"
            :id="field.name"
            v-model="formData[field.name]"
            v-bind="field"
            class="p-inputtext-lg w-full"
            :optionLabel="field.type.includes('select') ? 'label' : undefined"
            :optionValue="field.type.includes('select') ? 'value' : undefined"
        />
    </div>
</template>
