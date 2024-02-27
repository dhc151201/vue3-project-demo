# minerwatch-vue3-vite

tip1: node版本要求：推荐使用16.14.0版本，建议使用nvm管理切换node版本。

tip2: 静态资源，将构建在dist目录下，web页面访问入口为index.html文件。

## Project Setup

### 安装依赖包

```sh
pnpm install
```

#### 本地开发环境运行

```sh
pnpm dev
```

#### test环境构建

```sh
pnpm build:test
或者
pnpm build-only:test
```

#### test-1 环境构建

```sh
pnpm build:test-1
或者
pnpm build-only:test-1
```

#### test-2 环境构建

```sh
pnpm build:test-2
或者
pnpm build-only:test-2
```

### 生产环境构建

```sh
pnpm build:prod
或者
pnpm build-only:prod
```
