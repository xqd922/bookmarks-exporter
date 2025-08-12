# 图标下载功能说明

## 功能概述

现在 Pintree Bookmarks Exporter 支持自动下载网站图标并将其作为本地文件包含在导出包中，而不是仅提供外部链接。

## 新功能特点

### 1. 自动图标获取
- **多源获取**: 依次尝试 Clearbit API、Google Favicon API 和网站原生 favicon.ico
- **智能命名**: 图标文件以域名命名，如 `github_com.ico`、`google_com.ico`
- **容错处理**: 如果某个源失败，自动尝试下一个源

### 2. 本地文件存储
- 图标以 `.ico` 格式保存
- 文件名格式：`域名.ico`（点号替换为下划线）
- 所有图标统一存放在 `icons/` 文件夹中

### 3. 压缩包导出
- 导出文件格式从单个 JSON 文件改为 ZIP 压缩包
- 压缩包包含：
  - `pintree.json`: 书签数据文件
  - `icons/`: 图标文件夹，包含所有下载的图标

## 输出结构示例

### 压缩包结构
```
pintree-bookmarks.zip
├── pintree.json          # 书签数据
└── icons/                # 图标文件夹
    ├── github_com.ico
    ├── google_com.ico
    ├── stackoverflow_com.ico
    └── youtube_com.ico
```

### JSON 数据格式
```json
[
  {
    "type": "folder",
    "addDate": 1640995200000,
    "title": "工作相关",
    "url": "",
    "children": [
      {
        "type": "link",
        "addDate": 1640995200000,
        "title": "GitHub",
        "icon": "icons/github_com.ico",
        "url": "https://github.com"
      },
      {
        "type": "link",
        "addDate": 1640995200000,
        "title": "Stack Overflow", 
        "icon": "icons/stackoverflow_com.ico",
        "url": "https://stackoverflow.com"
      }
    ]
  }
]
```

## 技术实现

### 核心函数

#### `getIconData(url: string)`
```typescript
// 获取图标数据并返回文件名和blob数据
export const getIconData = async (url: string): Promise<{ fileName: string; blob: Blob } | undefined>
```

**功能**:
- 解析 URL 获取域名
- 生成标准化文件名
- 依次尝试多个图标源
- 返回图标文件名和二进制数据

#### 图标源优先级
1. **Clearbit API**: `https://logo.clearbit.com/{domain}` - 高质量品牌 logo
2. **Google Favicon API**: `https://www.google.com/s2/favicons?sz=64&domain_url={url}` - 通用 favicon
3. **原生 favicon**: `{origin}/favicon.ico` - 网站原生图标

### 数据流程

1. **选择书签** → 用户在书签树中选择要导出的书签
2. **处理导出** → 遍历所有链接类型书签，获取图标数据
3. **数据存储** → 将图标数据存储在 React Context 中
4. **生成压缩包** → 使用 JSZip 创建包含 JSON 和图标的压缩包
5. **下载文件** → 用户下载完整的压缩包

## 使用场景

### 1. 离线书签管理
- 图标文件本地化，无需网络连接即可显示
- 适合离线环境或内网环境使用

### 2. 书签备份
- 完整备份包括书签数据和视觉元素
- 恢复时保持原有的视觉体验

### 3. 第三方工具集成
- 提供标准化的图标文件格式
- 便于其他书签管理工具导入和使用

## 错误处理

### 图标获取失败
- 如果所有图标源都失败，该书签的 `icon` 字段为 `undefined`
- 不会影响整体导出流程

### 压缩包生成失败
- 如果 ZIP 生成失败，会降级为仅下载 JSON 文件
- 确保用户至少能获得书签数据

## 性能考虑

### 并发控制
- 图标下载采用异步处理，避免阻塞 UI
- 使用进度条显示处理状态

### 文件大小
- 图标文件通常较小（几 KB 到几十 KB）
- 压缩包大小取决于书签数量和图标文件大小

## 兼容性

- **浏览器**: 支持所有现代浏览器（Chrome、Firefox、Edge、Safari）
- **文件格式**: 标准 ZIP 格式，可用任何解压工具打开
- **图标格式**: ICO 格式，广泛兼容各种应用程序