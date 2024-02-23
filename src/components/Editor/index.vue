<template>
    <div style="border: 1px solid #ccc">
      <Toolbar
        style="border-bottom: 1px solid #ccc"
        :editor="editorRef"
        :defaultConfig="toolbarConfig"
        mode="simple"
      />
      <Editor
        :style="`height: ${height}px; overflow-y: hidden;`"
        v-model="valueHtml"
        :defaultConfig="editorConfig"
        mode="simple"
        @onCreated="handleCreated"
      />
    </div>
</template>
<script setup lang="ts">
import '@wangeditor/editor/dist/css/style.css'
import { onBeforeUnmount, shallowRef, computed } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'

const props = defineProps({
    html: {
        type: String,
        default: ""
    },
    height: {
        type: Number,
        default: 310
    }
})
const emits = defineEmits(['update:value'])

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef()

// 内容 HTML
const valueHtml = computed({
    get() { return props.html },
    set(val) {emits('update:value', val)}
})

const toolbarConfig = {}
const editorConfig = { placeholder: '请输入内容...' }
/*
// 自定义图片上传
editorConfig.MENU_CONF['uploadImage'] = {
    async customUpload(file, insertFn) {
        let formData = new FormData();
        formData.append('files', file);
        try {
            // 这里结合实际场景写自己上传图片的逻辑，此处代码仅为示例
            const { data } = await upload(formData);
            // 对图片进行处理，同样需要结合实际场景
            data.forEach(item => {
                insertFn(item, 'image', item)
            })
        } catch (error) {
            console.log(error);
        }
    }
}
// 自定义视频上传
editorConfig.MENU_CONF['uploadVideo'] = {
    async customUpload(file, insertFn) {
        let formData = new FormData();
        formData.append('files', file);
        try {
            // 这里结合实际场景写自己上传图片的逻辑，此处代码仅为示例
            const { data } = await upload(formData);
            // 对图片进行处理，同样需要结合实际场景
            data.forEach(item => {
                insertFn(item, 'video')
            })
        } catch (error) {
            console.log(error);
        }
    }
}
*/


// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
    const editor = editorRef.value
    if (editor == null) return
    editor.destroy()
})

const handleCreated = (editor: any) => {
  editorRef.value = editor // 记录 editor 实例，重要！
}
</script>  
