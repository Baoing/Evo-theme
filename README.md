# Evo Theme - 现代化开发环境

Evo 是一个高性能的 Shopify 主题，专为现代电商体验而设计。本项目提供了完整的开发环境，使用最新的工具链进行高效开发。

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

这将启动 Vite 的监听模式，自动编译源代码到 `assets/` 目录。

### 生产构建

```bash
npm run build
```

### 代码检查

```bash
npm run lint
npm run lint:fix  # 自动修复
```

## 📁 项目结构

```
src/
├── components/          # 可复用组件
│   ├── modals.js
│   ├── float-labels.js
│   ├── error-tab-index.js
│   └── custom-scrollbar.js
├── data/               # Alpine.js 数据组件
│   ├── announcement.js
│   ├── announcement-slider.js
│   ├── announcement-ticker.js
│   ├── toggle.js
│   ├── tabs.js
│   └── overflow.js
├── plugins/            # Alpine.js 插件
│   ├── flickity.js
│   ├── disclosure.js
│   └── ...
├── directives/         # Alpine.js 指令
│   └── target-referrer.js
├── utils/              # 工具函数
│   ├── polyfills.js
│   ├── theme-globals.js
│   └── resolution.js
├── main.js            # 主入口文件
└── vendor.js          # 第三方依赖
```

## 🛠 技术栈

- **构建工具**: Vite
- **前端框架**: Alpine.js
- **样式**: TailwindCSS (如果需要)
- **代码检查**: ESLint
- **类型检查**: TypeScript (可选)

## 📦 主要依赖

- **Alpine.js**: 轻量级响应式框架
- **Flickity**: 轮播图组件
- **AOS**: 滚动动画
- **Axios**: HTTP 客户端
- **MicroModal**: 模态框组件
- **Rellax**: 视差滚动

## 🔧 开发指南

### 添加新组件

1. 在 `src/components/` 中创建新文件
2. 在 `src/main.js` 中导入并注册

### 添加 Alpine.js 数据组件

1. 在 `src/data/` 中创建新文件
2. 导出一个返回对象的函数
3. 在 `src/main.js` 中注册：

```javascript
import myComponent from '@data/my-component'
Alpine.data('myComponent', myComponent)
```

### 添加 Alpine.js 插件

1. 在 `src/plugins/` 中创建新文件
2. 导出一个接收 Alpine 实例的函数
3. 在 `src/main.js` 中注册：

```javascript
import myPlugin from '@plugins/my-plugin'
Alpine.plugin(myPlugin)
```

## 🎯 路径别名

项目配置了以下路径别名：

- `@` → `src/`
- `@components` → `src/components/`
- `@plugins` → `src/plugins/`
- `@data` → `src/data/`
- `@utils` → `src/utils/`
- `@styles` → `src/styles/`

## 📝 注意事项

1. **不要直接编辑 `assets/theme.js`**，这是编译后的文件
2. 所有源代码修改都应该在 `src/` 目录中进行
3. 开发时使用 `npm run dev` 保持文件监听
4. 提交前运行 `npm run lint` 检查代码质量

## 🔄 架构特色

Evo 主题采用现代化的开发架构，具有以下特色：

1. **模块化设计**: 组件化架构，便于维护和扩展
2. **现代化技术栈**: 使用 ES6+ 语法和模块系统
3. **高效工具链**: 集成 Vite 构建工具，提供极速开发体验
4. **代码质量保障**: 内置 ESLint 和 TypeScript 支持

## 🐛 故障排除

### 构建失败

1. 检查 Node.js 版本 (推荐 16+)
2. 删除 `node_modules` 重新安装
3. 检查 `src/` 目录中的语法错误

### Alpine.js 组件不工作

1. 确保在 `main.js` 中正确注册
2. 检查浏览器控制台错误
3. 验证 HTML 中的 Alpine.js 指令

## 📄 许可证

Evo Theme - Modern Shopify Development Framework

本主题采用现代化开发理念，专注于性能优化和用户体验。适用于专业开发者和电商团队使用。
