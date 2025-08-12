# Chrome 扩展构建问题解决过程

## 项目概述
Pintree Bookmarks Exporter 是一个基于 Plasmo 框架开发的 Chrome 扩展，用于导出 Chrome 书签为 JSON 格式。

## 遇到的问题

### 1. Sharp 模块安装失败

**错误信息：**
```
Error: Something went wrong installing the "sharp" module
Cannot find module '../build/Release/sharp-win32-x64.node'
```

**问题分析：**
- Sharp 是一个图像处理库，需要编译原生模块
- 在 Windows 环境下，pnpm 安装时没有正确构建原生依赖
- 构建脚本被默认忽略，导致 sharp 模块无法正常工作

## 解决步骤

### 步骤 1: 清理环境
```bash
# 清理 pnpm 缓存
pnpm store prune

# 删除 node_modules 和锁文件
Remove-Item node_modules -Recurse -Force
Remove-Item pnpm-lock.yaml -Force
```

### 步骤 2: 重新安装依赖
```bash
pnpm install
```

**注意：** 安装过程中会出现警告信息：
```
Ignored build scripts: @parcel/watcher, @swc/core, esbuild, lmdb, msgpackr-extract, sharp.
Run "pnpm approve-builds" to pick which dependencies should be allowed to run scripts.
```

### 步骤 3: 批准构建脚本
```bash
pnpm approve-builds
```

选择所有需要构建的包：
- @parcel/watcher
- @swc/core  
- esbuild
- lmdb
- msgpackr-extract
- sharp

### 步骤 4: 执行构建
```bash
pnpm build
```

**构建成功输出：**
```
🟣 Plasmo v0.88.0
🔴 The Browser Extension Framework
🔵 INFO   | Prepare to bundle the extension...
🟢 DONE   | Finished in 4796ms!
```

### 步骤 5: 打包扩展
```bash
pnpm package
```

**打包成功输出：**
```
🔵 INFO   | Zip Package size: 0.31 MB in 139ms
```

## 最终结果

### 构建输出文件结构
```
build/
├── chrome-mv3-prod/
│   ├── manifest.json          # 扩展清单文件
│   ├── popup.html            # 弹窗页面
│   ├── popup.100f6462.js     # 弹窗逻辑
│   ├── popup.df89bfed.css    # 弹窗样式
│   ├── content.883ade9e.js   # 内容脚本
│   └── icon*.png             # 各尺寸图标
└── chrome-mv3-prod.zip       # 打包文件 (0.31 MB)
```

### 生成的 manifest.json 关键配置
```json
{
  "manifest_version": 3,
  "name": "Pintree Bookmarks Exporter",
  "version": "1.0.0",
  "permissions": ["bookmarks"],
  "host_permissions": ["https://*/*"],
  "action": {
    "default_popup": "popup.html"
  }
}
```

## 安装测试步骤

1. 打开 Chrome 浏览器
2. 访问 `chrome://extensions/`
3. 开启"开发者模式"开关
4. 点击"加载已解压的扩展程序"
5. 选择 `build/chrome-mv3-prod` 文件夹
6. 扩展安装完成，可在工具栏看到图标

## 关键经验总结

### 1. pnpm 构建脚本权限
- pnpm 默认会忽略某些包的构建脚本以提高安全性
- 对于需要编译原生模块的包（如 sharp），必须使用 `pnpm approve-builds` 批准
- 这是 pnpm 的安全特性，防止恶意脚本执行

### 2. Plasmo 框架特点
- 基于 Parcel 构建系统
- 自动处理 Chrome 扩展的复杂配置
- 支持 TypeScript、React、Tailwind CSS 开箱即用
- 生成符合 Manifest V3 规范的扩展

### 3. Windows 环境注意事项
- 原生模块编译可能需要额外的构建工具
- 使用 PowerShell 命令进行文件操作
- 网络问题可能导致包下载失败，需要重试

## 后续开发建议

1. **版本更新**: 考虑升级到 Plasmo v0.90.5 最新版本
2. **依赖优化**: 解决 peer dependency 警告
3. **测试完善**: 添加自动化测试流程
4. **CI/CD**: 配置 GitHub Actions 自动构建和发布