# 图标增强功能说明

## 新增功能概述

本次更新为书签导出器增加了优先使用网站原生ico文件的功能，并提供了多重备用方案和性能优化。

## 主要改进

### 1. 多层级图标获取策略

图标获取现在按以下优先级顺序进行：

1. **网站原生图标文件**（最高优先级）
   - `/favicon.ico`
   - `/favicon.png`
   - `/apple-touch-icon.png`
   - `/apple-touch-icon-precomposed.png`
   - `/icon.png`
   - `/icon.ico`

2. **Clearbit Logo API**
   - 提供高质量的品牌Logo

3. **Google Favicon API**
   - 作为最后的备用方案

### 2. 图标处理优化

- **Base64编码存储**：将图标转换为base64格式直接存储在JSON中，确保离线可用
- **URL备份**：同时保留原始图标URL作为备用引用
- **缓存机制**：相同域名的图标只下载一次，提高处理效率
- **错误容错**：单个图标失败不影响整体导出过程

### 3. 网络请求增强

- **超时控制**：默认10秒超时，避免长时间等待
- **重试机制**：失败后自动重试2次
- **User-Agent设置**：模拟真实浏览器请求，提高成功率

### 4. 用户体验改进

- **详细进度显示**：显示当前处理的书签和进度
- **实时状态更新**：显示正在处理的网站名称
- **处理统计**：显示已处理/总数量的比例

## 导出数据格式

### 链接类型数据结构
```json
{
  "type": "link",
  "addDate": 1640995200000,
  "title": "GitHub",
  "icon": "data:image/x-icon;base64,AAABAAEAEBAQAAEABAAoAQAAFgAAACgAAAAQAAAAIAAAAAEABAAAAAAAgAAAAAAAAAAAAAAAEAAAAAAAAAAAAA...",
  "iconUrl": "https://github.com/favicon.ico",
  "url": "https://github.com"
}
```

### 字段说明
- `icon`: base64编码的图标数据（优先使用）
- `iconUrl`: 原始图标URL（备用引用）
- 其他字段保持不变

## 性能特性

- **域名缓存**：相同域名的图标只处理一次
- **并发控制**：避免过多并发请求导致的性能问题
- **内存优化**：处理完成后可清理缓存
- **错误隔离**：单个图标处理失败不影响其他书签

## 使用建议

1. **大量书签处理**：对于包含大量书签的导出，建议在网络状况良好时进行
2. **图标质量**：原生ico文件通常质量最佳，建议优先使用
3. **离线使用**：导出的base64图标支持完全离线使用
4. **存储空间**：base64编码会增加文件大小，但提供更好的兼容性

## 技术实现

### 核心函数
- `getLogoUrl()`: 多策略图标URL获取
- `processIconWithFallback()`: 带缓存的图标处理
- `logoToBase64()`: 图标转base64编码
- `fetchWrapper()`: 增强的网络请求包装器

### 缓存管理
- `clearIconCache()`: 清理图标缓存
- `getIconCacheStats()`: 获取缓存统计信息

这些改进确保了书签导出器能够获取到最佳质量的网站图标，同时保持良好的性能和用户体验。