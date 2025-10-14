# 📄 Evo Theme - 简单404页面

## ✨ 简洁原创设计

已将404页面重新设计为简洁、现代的Evo主题风格。

### 🎯 主要改进

#### **原始 vs Evo版本**
- **类名**: `float-grid` → `evo-grid` (品牌化)
- **容器**: `wrapper` → `evo-container` (一致性)
- **按钮**: 基础链接 → `evo-btn` 样式系统
- **间距**: 固定值 → CSS变量控制

#### **保持简单但原创**
- ✅ 相同的简洁布局
- ✅ Evo品牌化的CSS类名
- ✅ 现代化的按钮样式
- ✅ 可配置的容器宽度
- ✅ 自定义按钮文字

### 📋 Schema配置

**简化配置选项**:
- 容器宽度选择 (3个选项)
- 上下间距调节
- 按钮文字自定义

**总配置数**: 5个 (vs 原始的4个)

### 🎨 样式特色

- **现代按钮**: 悬停效果和阴影
- **响应式设计**: 移动端优化
- **品牌一致性**: Evo主题色彩
- **简洁布局**: 居中对齐设计

### 💡 使用方式

完全兼容原始使用方式，只是换了Evo的品牌样式：

```liquid
<div class="evo-container evo-section-spacing">
  <div class="evo-grid">
    <div class="evo-grid__item--center">
      <h1 class="evo-404-title">Page Not Found</h1>
      <p class="evo-404-description">Description text</p>
      <a href="/" class="evo-btn evo-btn--primary">Continue Shopping</a>
    </div>
  </div>
</div>
```

## 🎊 总结

**简单但原创** - 保持了原有的简洁性，但完全使用Evo主题的品牌元素和现代化样式！

