#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 获取命令行参数
const args = process.argv.slice(2);
const versionType = args[0]; // major, minor, patch

if (!versionType || !['major', 'minor', 'patch'].includes(versionType)) {
  console.log('使用方法: node scripts/version.js <major|minor|patch>');
  console.log('');
  console.log('示例:');
  console.log('  node scripts/version.js patch   # 1.0.0 -> 1.0.1');
  console.log('  node scripts/version.js minor   # 1.0.0 -> 1.1.0');
  console.log('  node scripts/version.js major   # 1.0.0 -> 2.0.0');
  process.exit(1);
}

// 读取package.json
const packagePath = path.join(process.cwd(), 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

// 解析当前版本
const currentVersion = packageJson.version;
const [major, minor, patch] = currentVersion.split('.').map(Number);

// 计算新版本
let newVersion;
switch (versionType) {
  case 'major':
    newVersion = `${major + 1}.0.0`;
    break;
  case 'minor':
    newVersion = `${major}.${minor + 1}.0`;
    break;
  case 'patch':
    newVersion = `${major}.${minor}.${patch + 1}`;
    break;
}

console.log(`📦 版本更新: ${currentVersion} -> ${newVersion}`);

// 更新package.json
packageJson.version = newVersion;
fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2) + '\n');

console.log('✅ package.json 已更新');
console.log('');
console.log('🚀 接下来可以执行:');
console.log(`   git add package.json`);
console.log(`   git commit -m "chore: bump version to ${newVersion}"`);
console.log(`   pnpm run release:win`);