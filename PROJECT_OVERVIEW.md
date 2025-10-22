# 🎉 Evo Theme - 项目概览

### 主要模块：

**主入口文件：**
- `src/main.js` - Evo Theme 主入口
- `src/vendor.js` - 第三方依赖管理

**工具函数：**
- `src/utils/theme-globals.js` - 全局配置系统
- `src/utils/polyfills.js` - 浏览器兼容层
- `src/utils/resolution.js` - 响应式管理器

**组件系统：**
- `src/components/modals.js` - 模态框管理系统
- `src/components/float-labels.js` - 浮动标签系统
- `src/components/error-tab-index.js` - 错误处理组件
- `src/components/custom-scrollbar.js` - 自定义滚动条

**数据组件：**
- `src/data/announcement.js` - 公告组件
- `src/data/toggle.js` - 通用切换组件
- `src/data/tabs.js` - 高级标签系统
- `src/data/overflow.js` - 内容溢出管理
- `src/data/product-*.js` - 产品相关组件

**插件系统：**
- `src/plugins/flickity.js` - 轮播图集成
- `src/plugins/disclosure.js` - 折叠动画插件
- `src/plugins/section.js` - Shopify 区块管理器
- `src/plugins/marquee.js` - 跑马灯动画插件
- `src/plugins/clone.js` - 元素克隆插件

**指令系统：**
- `src/directives/target-referrer.js` - 来源定向指令

#### 4. **开发工具**
- `dev/watch.js` - 开发监听脚本
- `dev/backup-original.js` - 文件备份工具

#### 5. **原始编译文件**
- `assets/theme.js` - 更新版权信息头部

### 品牌特色：

#### **品牌标识：**
- **主题名称**：Evo Theme
- **副标题**：Modern Shopify Development Framework
- **定位**：高性能现代电商主题
- **版本**：1.0.0
- **作者**：Will Baoea

#### **核心价值：**
1. **现代化技术栈** - ES6+、模块化、TypeScript 支持
2. **高性能优化** - 针对速度和用户体验优化
3. **开发者友好** - 完整的开发工具链和文档
4. **可访问性** - 符合现代 Web 标准
5. **模块化架构** - 易于维护和扩展

#### **技术特色：**
- 🚀 Vite 构建系统，极速开发体验
- 🎨 Alpine.js 轻量级响应式框架
- 📱 移动优先的响应式设计
- ♿ 完整的可访问性支持
- 🔧 现代化开发工具链
- 📦 模块化组件系统

### 📁 最终项目结构：

```
Evo-theme/
├── src/                    # 源代码目录
│   ├── components/         # 可复用组件
│   ├── data/              # Alpine.js 数据组件
│   ├── plugins/           # Alpine.js 插件
│   ├── directives/        # Alpine.js 指令
│   ├── utils/             # 工具函数
│   ├── main.js            # 主入口文件
│   └── vendor.js          # 第三方依赖
├── dev/                   # 开发工具
├── assets/                # 编译输出目录
├── 配置文件               # 各种配置文件
└── 文档文件               # 完整的项目文档
```


现在这个项目独立开发环境，具有完整的品牌标识和开发工具链！



