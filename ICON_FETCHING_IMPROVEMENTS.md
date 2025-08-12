# 图标获取功能改进

## 问题描述

对于某些网站（如 https://blog.xqd.pp.ua/），原有的图标获取逻辑可能无法正确下载图标文件。

## 改进措施

### 1. 扩展图标源列表

按优先级顺序尝试以下图标源：

#### 原生网站图标（优先级最高）
- `{origin}/favicon.ico` - 标准 favicon 位置
- `{origin}/assets/favicon.ico` - 资源文件夹中的 favicon
- `{origin}/static/favicon.ico` - 静态文件夹中的 favicon  
- `{origin}/images/favicon.ico` - 图片文件夹中的 favicon
- `{origin}/img/favicon.ico` - img 文件夹中的 favicon

#### Apple Touch Icon（通常质量较高）
- `{origin}/apple-touch-icon.png`
- `{origin}/apple-touch-icon-precomposed.png`

#### 第三方图标服务
- Google Favicon API (64px 和 32px)
- Clearbit Logo API
- DuckDuckGo Icons API
- GitHub Favicons API

#### 其他格式尝试
- `{origin}/favicon.png`
- `{origin}/favicon.svg`
- `{origin}/icon.ico`
- `{origin}/icon.png`

### 2. 改进的错误处理

#### 超时控制
- 每个请求设置 10 秒超时
- 使用 AbortController 控制请求取消

#### 文件大小验证
- 检查下载的文件大小，避免下载过小的占位符文件
- 最小文件大小阈值：100 字节

#### 详细日志记录
- 记录每次尝试的 URL
- 记录成功获取的图标信息（URL、文件大小）
- 记录失败原因

### 3. 请求头优化

添加标准浏览器 User-Agent：
```
Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36
```

这有助于绕过某些网站的反爬虫机制。

## 技术实现

### 核心函数改进

```typescript
export const getIconData = async (url: string): Promise<{ fileName: string; blob: Blob } | undefined> => {
  // 16 个不同的图标源按优先级尝试
  // 包含文件大小验证和详细日志
  // 超时控制和错误处理
}
```

### fetchWrapper 增强

```typescript
export async function fetchWrapper(url: string, options: FetchOptions = {}) {
  // 添加超时控制
  // 标准 User-Agent
  // 改进的错误信息
}
```

## 预期效果

### 对于 https://blog.xqd.pp.ua/
1. 首先尝试 `https://blog.xqd.pp.ua/favicon.ico`
2. 如果失败，尝试其他路径和第三方服务
3. 最终应该能够获取到合适的图标文件

### 通用改进
- 提高图标获取成功率
- 减少获取到无效图标的情况
- 更好的错误诊断信息
- 更稳定的网络请求处理

## 调试信息

在浏览器控制台中可以看到详细的图标获取日志：
- `Trying to fetch icon from: {url}` - 尝试获取图标
- `Successfully fetched icon from: {url}, size: {size} bytes` - 成功获取
- `Icon too small from {url}: {size} bytes` - 文件过小被跳过
- `No valid icon found for {url}` - 所有源都失败

这些日志有助于诊断特定网站的图标获取问题。