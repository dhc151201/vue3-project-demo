import path from 'path'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import viteCompression from "vite-plugin-compression"
import Components from 'unplugin-vue-components/vite';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  plugins: [
    vue(),
    vueJsx(),
    Components({
      resolvers: [
        AntDesignVueResolver({
          importStyle: false,
        }),
      ],
    }),
    viteCompression({
      verbose: true, // 是否在控制台中输出压缩结果
      disable: false,
      threshold: 10240, // 如果体积大于阈值，将被压缩，单位为b
      algorithm: 'gzip', // 压缩算法，可选['gzip'，' brotliccompress '，'deflate '，'deflateRaw']
      ext: '.gz',
      deleteOriginFile: false // 源文件压缩后是否删除
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      // 'vue': 'vue/dist/vue.esm-bundler.js' // 支持运行时编译，根据情况是否需要，再开启，会增大包体积
    }
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        additionalData: `;@import "${path.resolve(__dirname, 'src/styles/thame.less')}";`, // 全局less变量自动载入vue文件
      }
    }
  },
  build: {
    rollupOptions: {
      output: {
        chunkFileNames: `js/[name]-[hash].js`,
        entryFileNames: `js/[name]-[hash].js`,
        assetFileNames: `[ext]/[name]-[hash].[ext]`,
      }
    }
  },
})
