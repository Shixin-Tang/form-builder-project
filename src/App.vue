<script setup lang="ts">
//--- PrimeVue 组件导入 ---
import Button from 'primevue/button'
import Textarea from 'primevue/textarea' // 1. 缺少 Textarea 组件的导入
import Splitter from 'primevue/splitter'
import SplitterPanel from 'primevue/splitterpanel'
import FormBuilder from './components/FormBuilder.vue'
import type { FormItem } from './types'

import { ref, computed } from 'vue'

//--- 定义响应式状态 ---
//绑定 JSON 输入
const jsonConfigurationInput = ref(
    JSON.stringify(
        [
            {
                name: 'name',
                type: 'text',
                label: '姓名',
                placeholder: '请输入您的姓名',
                required: true,
                validation: {
                    min: 2,
                    max: 50,
                },
            },
            {
                name: 'email',
                type: 'email',
                label: '邮箱',
                placeholder: '请输入您的邮箱地址',
                required: true,
            },
            {
                name: 'bio',
                type: 'textarea',
                label: '简介',
                placeholder: '请简单介绍一下自己',
                autoResize: true,
            },
        ],
        null,
        4,
    ),
)

//computed：安全解析json的输入
//响应jsonConfigurationInput的变化，如果JSON文件出错，返回空数组
const formSchema = computed<FormItem[]>(() => {
    try {
        const parsed = JSON.parse(jsonConfigurationInput.value)
        //保证解析的结果是数组
        return Array.isArray(parsed) ? parsed : []
    } catch (error) {
        console.log('Invalid JSON Configuration format: ', error)
        return []
    }
})

//存储用户在form中输入的数据
const formData = ref<{ [key: string]: any }>({})

const submitForm = () => {
    alert('表单已提交！请在控制台查看数据。')
    console.log(formData.value)
}

// 清空表单输入
const clearForm = () => {
    formData.value = {}
}
</script>

<template>
    <div class="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <header class="mb-8 text-center">
            <h1 class="text-4xl font-bold tracking-tight">PrimeVue 动态表单生成器</h1>
            <p class="mt-2 text-lg">在左侧面板输入或修改JSON配置，在右侧将自动生成表单</p>
        </header>

        <Splitter
            class="h-[70vh] rounded-md border border-gray-200"
            :pt="{ gutterHandler: { class: 'bg-gray-200' } }"
        >
            <SplitterPanel :size="40" class="flex flex-col">
                <div class="p-4 h-full flex flex-col">
                    <h2 class="text-2xl font-semibold mb-4">JSON 配置</h2>
                    <Textarea v-model="jsonConfigurationInput" autoResize class="w-full flex-grow font-mono text-sm" />
                </div>
            </SplitterPanel>

            <SplitterPanel :size="60" class="flex flex-col">
                <div class="p-4 h-full overflow-y-auto">
                    <form @submit.prevent="submitForm" class="flex flex-col gap-6">
                        <FormBuilder :schema="formSchema" v-model="formData" />
                        <div class="flex items-center gap-4 mt-4 self-start">
                            <Button type="submit" label="提交" severity="primary" />
                            <Button type="button" label="清空输入" severity="secondary" @click="clearForm" />
                        </div>
                    </form>

                    <div class="mt-8 p-4 rounded-lg border bg-gray-50 border-gray-200">
                        <h3 class="text-lg font-semibold mb-2 text-gray-900">表单实时数据</h3>
                        <pre
                            v-if="Object.keys(formData).length > 0"
                            class="whitespace-pre-wrap break-words font-mono text-sm bg-gray-900 text-white p-4 rounded-md"
                        >{{ formData }}</pre>
                    </div>
                </div>
            </SplitterPanel>
        </Splitter>
    </div>
</template>
