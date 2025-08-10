#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// 读取package.json获取版本号
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const version = packageJson.version;
const tagName = `v${version}`;

console.log('🚀 准备发布 Pintree 书签导出器');
console.log(`📦 版本: ${version}`);
console.log(`🏷️  标签: ${tagName}`);
console.log('');

try {
  // 检查是否有未提交的更改
  console.log('🔍 检查Git状态...');
  const gitStatus = execSync('git status --porcelain', { encoding: 'utf8' });
  if (gitStatus.trim()) {
    console.log('⚠️  发现未提交的更改:');
    console.log(gitStatus);
    console.log('请先提交所有更改后再发布。');
    process.exit(1);
  }

  // 检查是否在main分支
  console.log('🌿 检查当前分支...');
  const currentBranch = execSync('git branch --show-current', { encoding: 'utf8' }).trim();
  if (currentBranch !== 'main' && currentBranch !== 'master') {
    console.log(`⚠️  当前分支: ${currentBranch}`);
    console.log('建议在main或master分支上发布。');
    console.log('是否继续? (y/N)');
    // 这里可以添加用户确认逻辑
  }

  // 检查标签是否已存在
  console.log('🏷️  检查标签是否存在...');
  try {
    execSync(`git rev-parse ${tagName}`, { stdio: 'ignore' });
    console.log(`❌ 标签 ${tagName} 已存在！`);
    console.log('请更新package.json中的版本号。');
    process.exit(1);
  } catch (e) {
    // 标签不存在，继续
  }

  // 构建项目
  console.log('🔨 构建项目...');
  execSync('pnpm build', { stdio: 'inherit' });
  
  console.log('📦 打包扩展...');
  execSync('pnpm package', { stdio: 'inherit' });

  // 检查构建产物
  const buildPath = './build/chrome-mv3-prod.zip';
  if (!fs.existsSync(buildPath)) {
    console.log('❌ 构建失败：找不到打包文件');
    process.exit(1);
  }

  const stats = fs.statSync(buildPath);
  const fileSizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
  console.log(`✅ 构建成功！文件大小: ${fileSizeInMB}MB`);

  // 创建并推送标签
  console.log('🏷️  创建Git标签...');
  execSync(`git tag -a ${tagName} -m "Release ${tagName}"`, { stdio: 'inherit' });
  
  console.log('📤 推送标签到远程仓库...');
  execSync(`git push origin ${tagName}`, { stdio: 'inherit' });

  console.log('');
  console.log('🎉 发布流程已启动！');
  console.log('');
  console.log('📋 接下来会发生什么:');
  console.log('1. GitHub Actions 会自动构建项目');
  console.log('2. 创建新的Release页面');
  console.log('3. 上传打包好的扩展文件');
  console.log('4. 生成详细的发布说明');
  console.log('');
  console.log(`🔗 查看发布状态: https://github.com/${getRepoInfo()}/actions`);
  console.log(`📦 发布完成后访问: https://github.com/${getRepoInfo()}/releases/tag/${tagName}`);

} catch (error) {
  console.error('❌ 发布失败:', error.message);
  process.exit(1);
}

function getRepoInfo() {
  try {
    const remoteUrl = execSync('git remote get-url origin', { encoding: 'utf8' }).trim();
    const match = remoteUrl.match(/github\.com[:/](.+?)(?:\.git)?$/);
    return match ? match[1] : 'your-username/your-repo';
  } catch (e) {
    return 'your-username/your-repo';
  }
}