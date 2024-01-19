<template>
    <a-form v-bind="prop" ref="RefForm" :model="model">
        <template v-for="(item, index) of items" :key="index + item.label">
            {{ item.options }}
            <a-form-item v-bind="item.options">
                <a-input v-if="!item.type || item.type == 'text'" v-model:value="model[item.field]" />
                <a-input-number v-else-if="item.type == 'number'" v-model:value="model[item.field]">
                    <template v-if="item.options?.suffix" #addonAfter>{{ item.options?.suffix }}</template>
                </a-input-number>
                <a-input-password v-else-if="item.type == 'password'" v-model:value="model[item.field]" />
                <a-textarea v-else-if="item.type == 'textarea'" v-model:value="model[item.field]" >
                </a-textarea>
                <a-date-picker v-else-if="item.type == 'date'" v-model:value="model[item.field]" :showToday="false" />
                <a-range-picker v-else-if="item.type == 'date-range'" v-model:value="model[item.field]"
                    separator="~" />
                <a-checkbox-group v-else-if="item.type == 'checkbox'" v-model:value="model[item.field]"
                    :options="item.dic || []" />
                <a-radio-group v-else-if="item.type == 'radio'" v-model:value="model[item.field]"
                    :options="item.dic || []" />
                <a-select class="select" :class="{ 'form-item-readlony': item.options?.readonly }"
                    v-else-if="item.type == 'select'" v-model:value="model[item.field]"
                    :options="item.dic || []" showArrow>
                </a-select>
            </a-form-item>
        </template>
        <slot :submit="handelSubmit" :model="model"></slot>
    </a-form>
</template>
<script setup lang="ts">
import { useForm } from "@/hooks/useFormModel"
import { ref } from "vue";

const props = defineProps({
    config: {
        type: Object,
        default: () => ({})
    }
})

const {
    FormProps: prop,
    FormItems: items,
    FormState: model
} = useForm(props.config, props.config.items as any)

const RefForm = ref<any>(null)
const handelSubmit = async () => {
    try {
        await RefForm.value?.validateFields()
        if (props.config.onSubmit) {
            await props.config.onSubmit(model.value)
        }
        return model.value
    } catch (e) {
        throw '表单验证未通过'
    }
}
defineExpose({
    submit: handelSubmit,
    model: model.value
})
</script>
<style lang="less" scoped>
    
</style>