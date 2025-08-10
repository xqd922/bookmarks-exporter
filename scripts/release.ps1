# Pintree 书签导出器发布脚本

Write-Host "🚀 准备发布 Pintree 书签导出器" -ForegroundColor Green

# 读取版本号
$packageJson = Get-Content "package.json" | ConvertFrom-Json
$version = $packageJson.version
$tagName = "v$version"

Write-Host "📦 版本: $version" -ForegroundColor Cyan
Write-Host "🏷️  标签: $tagName" -ForegroundColor Cyan
Write-Host ""

# 检查Git状态
Write-Host "🔍 检查Git状态..." -ForegroundColor Yellow
$gitStatus = git status --porcelain
if ($gitStatus) {
    Write-Host "⚠️  发现未提交的更改:" -ForegroundColor Red
    Write-Host $gitStatus
    Write-Host "请先提交所有更改后再发布。" -ForegroundColor Red
    exit 1
}

# 检查标签是否存在
Write-Host "🏷️  检查标签是否存在..." -ForegroundColor Yellow
try {
    git rev-parse $tagName 2>$null
    Write-Host "❌ 标签 $tagName 已存在！" -ForegroundColor Red
    Write-Host "请更新package.json中的版本号。" -ForegroundColor Red
    exit 1
} catch {
    # 标签不存在，继续
}

# 构建项目
Write-Host "🔨 构建项目..." -ForegroundColor Yellow
pnpm build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ 构建失败" -ForegroundColor Red
    exit 1
}

Write-Host "📦 打包扩展..." -ForegroundColor Yellow
pnpm package
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ 打包失败" -ForegroundColor Red
    exit 1
}

# 检查构建产物
$buildPath = "./build/chrome-mv3-prod.zip"
if (-not (Test-Path $buildPath)) {
    Write-Host "❌ 构建失败：找不到打包文件" -ForegroundColor Red
    exit 1
}

$fileSize = (Get-Item $buildPath).Length / 1MB
Write-Host "✅ 构建成功！文件大小: $([math]::Round($fileSize, 2))MB" -ForegroundColor Green

# 创建并推送标签
Write-Host "🏷️  创建Git标签..." -ForegroundColor Yellow
git tag -a $tagName -m "Release $tagName"
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ 创建标签失败" -ForegroundColor Red
    exit 1
}

Write-Host "📤 推送标签到远程仓库..." -ForegroundColor Yellow
git push origin $tagName
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ 推送标签失败" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🎉 发布流程已启动！" -ForegroundColor Green
Write-Host ""
Write-Host "📋 接下来会发生什么:" -ForegroundColor Cyan
Write-Host "1. GitHub Actions 会自动构建项目"
Write-Host "2. 创建新的Release页面"
Write-Host "3. 上传打包好的扩展文件"
Write-Host "4. 生成详细的发布说明"
Write-Host ""

# 获取仓库信息
try {
    $remoteUrl = git remote get-url origin
    if ($remoteUrl -match "github\.com[:/](.+?)(?:\.git)?$") {
        $repoInfo = $matches[1]
        Write-Host "🔗 查看发布状态: https://github.com/$repoInfo/actions" -ForegroundColor Blue
        Write-Host "📦 发布完成后访问: https://github.com/$repoInfo/releases/tag/$tagName" -ForegroundColor Blue
    }
} catch {
    Write-Host "🔗 请在GitHub仓库页面查看发布状态" -ForegroundColor Blue
}

Write-Host ""
Write-Host "✨ 发布脚本执行完成！" -ForegroundColor Green