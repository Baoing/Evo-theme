# 🚀 Evo Theme 现代化开发环境设置指南

## 快速开始

### 1. 备份原始文件并安装依赖

```bash
npm run setup
```

这个命令会：
- 自动备份现有的主题文件（`theme.js` → `theme.js.original`）
- 安装所有必要的开发依赖

### 2. 开始开发

```bash
npm run dev
```

这将启动 Vite 的监听模式，自动将 `src/` 中的源代码编译到 `assets/` 目录。

### 3. 生产构建

```bash
npm run build
```

## 📋 完整设置步骤

### 环境要求

- Node.js 16+ 
- npm 或 yarn

### 详细步骤

1. **克隆或下载项目**
   ```bash
   cd /path/to/your/shopify-theme
   ```

2. **备份原始编译文件**
   ```bash
   npm run backup
   ```

3. **安装依赖**
   ```bash
   npm install
   ```

4. **开始开发**
   ```bash
   npm run dev
   ```

## 🔧 开发工作流

### 日常开发

1. 运行 `npm run dev` 启动监听模式
2. 在 `src/` 目录中编辑源代码
3. Vite 会自动编译并更新 `assets/theme.js`
4. 在浏览器中查看更改

### 代码质量检查

```bash
npm run lint        # 检查代码质量
npm run lint:fix    # 自动修复问题
npm run type-check  # TypeScript 类型检查
```

### 生产部署

```bash
npm run build       # 构建优化后的生产版本
```

## 📁 关键文件说明

- `src/main.js` - 主入口文件，注册所有 Alpine.js 组件
- `src/vendor.js` - 第三方依赖管理
- `vite.config.js` - Vite 构建配置
- `package.json` - 项目依赖和脚本

## 🎯 开发提示

### 添加新的 Alpine.js 组件

1. 在 `src/data/` 创建新文件：
   ```javascript
   // src/data/my-component.js
   export default function myComponent() {
     return {
       // 组件逻辑
     }
   }
   ```

2. 在 `src/main.js` 中注册：
   ```javascript
   import myComponent from '@data/my-component'
   Alpine.data('myComponent', myComponent)
   ```

### 添加新的插件

1. 在 `src/plugins/` 创建新文件：
   ```javascript
   // src/plugins/my-plugin.js
   export default function myPlugin(Alpine) {
     // 插件逻辑
   }
   ```

2. 在 `src/main.js` 中注册：
   ```javascript
   import myPlugin from '@plugins/my-plugin'
   Alpine.plugin(myPlugin)
   ```

## 🚨 重要注意事项

1. **永远不要直接编辑 `assets/theme.js`** - 这是编译后的文件，会被覆盖
2. **所有源代码修改都在 `src/` 目录中进行**
3. **开发时保持 `npm run dev` 运行**以获得实时编译
4. **提交代码前运行 `npm run lint`** 确保代码质量

## 🔄 主题文件管理

如果需要恢复到备份的主题文件：

```bash
cp assets/theme.js.original assets/theme.js
```

## 📞 获取帮助

如果遇到问题：

1. 检查 Node.js 版本是否为 16+
2. 删除 `node_modules` 并重新运行 `npm install`
3. 检查浏览器控制台的错误信息
4. 确保 `src/` 目录中的文件语法正确

## 🎉 开始开发

现在你已经准备好开始开发了！运行 `npm run dev` 并开始在 `src/` 目录中编辑你的代码。
