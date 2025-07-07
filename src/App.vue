<script setup lang="ts">
//--- PrimeVue 组件导入 ---
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Textarea from 'primevue/textarea'
import Splitter from 'primevue/splitter'
import SplitterPanel from 'primevue/splitterpanel'

import { ref, computed, watch } from 'vue'

// --- 动态组件映射 ---
// 这个对象将 `field.type` 字符串映射到实际的 Vue 组件。
const componentMap = {
    text: InputText,
    email: InputText,
    textarea: Textarea,
}

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

//存储用户在form中输入的数据
const formData = ref<{ [key: string]: any }>({})

//computed：安全解析json的输入
//响应jsonConfigurationInput的变化，如果JSON文件出错，返回空数组
const formSchema = computed(() => {
    try {
        const parsed = JSON.parse(jsonConfigurationInput.value)
        //保证解析的结果是数组
        return Array.isArray(parsed) ? parsed : []
    } catch (error) {
        console.log('Invalid JSON format: ', error)
        return []
    }
})

//监听formSchema的变化 动态修改formData
watch(
    formSchema,
    (newSchema) => {
        const newFormData: { [key: string]: any } = {}
        newSchema.forEach((field) => {
            //为每个表单项，在formData中创建一个响应式的key
            newFormData[field.name] = undefined
        })
        formData.value = newFormData
    },
    { immediate: true },
) //immediate: true 确保组件加载时立即执行一次

const submitForm = () => {
    alert('表单已提交！请在控制台查看数据。')
    console.log(formData.value)
}
</script>

<template>
    <div class="container">
        <header>
            <h1>PrimeVue 动态表单生成器</h1>
            <p>在左侧面板输入或修改JSON配置，在右侧将自动生成表单</p>
        </header>

        <Splitter style="height: 70vh; border: 1px solid #dee2e6; border-radius: 6px">
            <SplitterPanel :size="40">
                <div class="panel">
                    <h2>JSON 配置</h2>
                    <Textarea v-model="jsonConfigurationInput" autoResize class="json-input" />
                </div>
            </SplitterPanel>

            <SplitterPanel :size="60">
                <div class="panel">
                    <form @submit.prevent="submitForm" class="dynamic-form">
                        <div v-for="field in formSchema" :key="field.name" class="form-field">
                            <label :for="field.name">{{ field.label }}</label>
                            <component
                                :is="componentMap[field.type] || InputText"
                                :id="field.name"
                                v-model="formData[field.name]"
                                v-bind="field"
                                class="p-inputtext-lg"
                            />
                        </div>
                        <Button type="submit" label="提交" class="p-button-primary submit-button" />
                    </form>

                    <div class="data-display">
                        <h3>表单实时数据</h3>
                        <pre>{{ formData }}</pre>
                    </div>
                </div>
            </SplitterPanel>
        </Splitter>
    </div>
</template>

<style scoped>
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    font-family:
        -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif,
        'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
    color: #495057;
}

header {
    margin-bottom: 2rem;
    text-align: center;
}

.panel {
    padding: 1rem;
    height: 100%;
    overflow-y: auto;
}

.json-input {
    width: 100%;
    height: calc(100% - 4rem); /* 为标题留出空间 */
    font-family: 'Courier New', Courier, monospace;
}

.dynamic-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}
.form-field {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}
.form-field label {
    font-weight: bold;
}

.submit-button {
    margin-top: 1rem;
}

.data-display {
    margin-top: 2rem;
    padding: 1rem;
    border-radius: 6px;
    border: 1px solid #dee2e6;
}
pre {
    white-space: pre-wrap;
    word-wrap: break-word;
    font-family: 'Courier New', Courier, monospace;
}
</style>
