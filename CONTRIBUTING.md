# 🤝 Contributing to Evo Theme

感谢您对 Evo Theme 的贡献兴趣！我们欢迎所有形式的贡献，包括但不限于代码改进、文档更新、bug 报告和功能建议。

## 🚀 开发环境设置

1. **Fork 并克隆仓库**
   ```bash
   git clone https://github.com/your-username/evo-theme.git
   cd evo-theme
   ```

2. **安装依赖**
   ```bash
   npm run setup
   ```

3. **开始开发**
   ```bash
   npm run dev
   ```

## 📝 代码规范

### JavaScript/TypeScript 规范

- 使用 ES6+ 语法
- 遵循 ESLint 配置规则
- 使用 2 空格缩进
- 使用单引号
- 不使用分号结尾

### 文件命名规范

- 使用 kebab-case 命名文件：`my-component.js`
- 组件文件放在对应目录：
  - `src/components/` - 通用组件
  - `src/data/` - Alpine.js 数据组件
  - `src/plugins/` - Alpine.js 插件
  - `src/utils/` - 工具函数

### 注释规范

每个文件都应包含标准的文档注释：

```javascript
/**
 * Evo Theme - Component Name
 * Brief description of the component
 * 
 * @description Detailed description of functionality
 * @version 1.0.0
 */
```

## 🔧 开发流程

### 1. 创建功能分支

```bash
git checkout -b feature/your-feature-name
```

### 2. 开发和测试

- 在 `src/` 目录中进行开发
- 运行 `npm run dev` 进行实时编译
- 使用 `npm run lint` 检查代码质量

### 3. 提交代码

```bash
git add .
git commit -m "feat: add new component functionality"
```

### 提交信息规范

使用 [Conventional Commits](https://www.conventionalcommits.org/) 格式：

- `feat:` 新功能
- `fix:` bug 修复
- `docs:` 文档更新
- `style:` 代码格式调整
- `refactor:` 代码重构
- `test:` 测试相关
- `chore:` 构建工具或辅助工具的变动

### 4. 创建 Pull Request

1. 推送到您的 fork
2. 创建 Pull Request
3. 详细描述您的更改
4. 等待代码审查

## 🐛 Bug 报告

报告 bug 时，请包含：

1. **环境信息**
   - Node.js 版本
   - 浏览器版本
   - 操作系统

2. **重现步骤**
   - 详细的操作步骤
   - 预期行为
   - 实际行为

3. **相关代码**
   - 错误信息
   - 相关代码片段

## 💡 功能建议

提出新功能时，请考虑：

1. **用例描述**
   - 解决什么问题
   - 目标用户群体
   - 使用场景

2. **实现方案**
   - 技术可行性
   - 性能影响
   - 兼容性考虑

## 📋 代码审查清单

提交 PR 前，请确保：

- [ ] 代码通过 ESLint 检查
- [ ] 添加了适当的注释
- [ ] 更新了相关文档
- [ ] 测试了所有相关功能
- [ ] 遵循了项目的代码规范

## 🎯 开发优先级

我们特别欢迎以下方面的贡献：

1. **性能优化**
   - 减少包大小
   - 提升运行效率
   - 优化加载速度

2. **可访问性改进**
   - ARIA 标签支持
   - 键盘导航
   - 屏幕阅读器兼容

3. **新组件开发**
   - 可复用组件
   - Alpine.js 插件
   - 工具函数

4. **文档完善**
   - API 文档
   - 使用示例
   - 最佳实践

## 📞 获取帮助

如果您在贡献过程中遇到问题：

1. 查看现有的 Issues 和 Discussions
2. 阅读项目文档
3. 创建新的 Issue 描述您的问题

## 🙏 致谢

感谢所有为 Evo Theme 做出贡献的开发者！您的努力让这个项目变得更好。

---

**Happy Coding! 🚀**


