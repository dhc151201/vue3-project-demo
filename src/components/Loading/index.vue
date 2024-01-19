<template>
    <a-spin class="custom-spin" :wrapperClassName="noBg ? 'no-bg' : ''" :indicator="indicator" :spinning="loading"
      :tip="tip || undefined" :size="size">
      <slot></slot>
    </a-spin>
  </template>
  <script lang="ts" setup>
  import { LoadingOutlined } from '@ant-design/icons-vue';
  import { h } from 'vue';
  
  const props = defineProps({
    loading: {
      type: Boolean,
      default: false
    },
    tip: {
      type: String,
      default: "loading"
    },
    size: {
      type: String,
      default: "default"
    },
    noBg: {
        type: Boolean,
        default: false
    }
  })
  
  const indicator = h(LoadingOutlined, {
    style: {
      fontSize: {
        "default": "24px",
        "small": "16px",
        "large": "30px"
      }[props.size],
      color: "#d0d4d6"
    },
    spin: true,
  });
  </script>
  <style lang="less" scoped>
  .custom-spin {
    display: block;
  }
  
  :deep(.ant-spin-text) {
    color: #d0d4d6;
    font-size: 13px;
    margin-top: 10px;
  }
  
  .no-bg :deep(.ant-spin-container::after) {
    background-color: transparent !important;
  }
  </style>