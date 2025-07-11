<script setup lang="ts">
import { computed, type PropType } from 'vue'
import type { FormItem } from '../types'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'

//定义动态组件类型的映射
//将json配置文件的type映射为PrimeVue的组件类型
const componentMap = {
    text: InputText,
    email: InputText,
    textarea: Textarea,
}

//定义porps
const props = defineProps({
    schema: {
        type: Array as PropType<FormItem[]>,
        required: true,
    },
    modelValue: { // 2. 修正拼写错误：modelVale -> modelValue
        type: Object as PropType<{ [key: string]: any }>,
        required: true,
    },
})

//定义emits,可以支持v-model
const emit = defineEmits(['update:modelValue']) // 3. 修正 defineEmits 的用法

//定义一个计算属性，绑定v-model
const formData = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value),
})
</script>

<template>
    <!-- 遍历schema数组，动态渲染表单的内容-->
    <div v-for="field in schema" :key="field.name" class="flex flex-col gap-2">
        <label :for="field.name" class="font-semibold">{{ field.label }}</label>
        <component
            :is="componentMap[field.type] || InputText"
            :id="field.name"
            v-model="formData[field.name]"
            v-bind="field"
            class="p-inputtext-lg w-full"
            />
</div>
</template>
