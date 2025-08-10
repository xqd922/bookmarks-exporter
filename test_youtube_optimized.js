// 优化后的YouTube图标获取测试
console.log("=== 优化后的YouTube图标获取策略 ===");
console.log("");

const testUrls = [
  "https://www.youtube.com",
  "https://youtube.com", 
  "https://m.youtube.com"
];

testUrls.forEach(url => {
  console.log(`🎯 测试URL: ${url}`);
  console.log("");
  
  // YouTube特殊优化路径
  console.log("🚀 YouTube特殊优化路径 (最高优先级):");
  const youtubeSpecial = [
    "https://www.youtube.com/s/desktop/favicon.ico",
    "https://www.youtube.com/img/favicon_144x144.png", 
    "https://logo.clearbit.com/youtube.com",
    "https://www.google.com/s2/favicons?sz=256&domain=youtube.com"
  ];
  
  youtubeSpecial.forEach((iconUrl, index) => {
    console.log(`  ${index + 1}. ${iconUrl}`);
  });
  
  console.log("");
  
  // 原生路径（包含YouTube特殊路径）
  console.log("📱 原生高分辨率路径:");
  const nativePaths = [
    "https://www.youtube.com/img/favicon_144x144.png",
    "https://www.youtube.com/img/favicon_96x96.png", 
    "https://www.youtube.com/img/favicon_48x48.png",
    "https://www.youtube.com/s/desktop/favicon.ico",
    "https://www.youtube.com/yts/img/favicon_144x144.png",
    "https://www.youtube.com/apple-touch-icon-180x180.png",
    "https://www.youtube.com/icon-512x512.png",
    "https://www.youtube.com/favicon.svg"
  ];
  
  nativePaths.forEach((iconUrl, index) => {
    console.log(`  ${index + 1}. ${iconUrl}`);
  });
  
  console.log("");
  
  // 第三方服务（增强版）
  console.log("🌐 第三方高质量服务:");
  const thirdParty = [
    "https://logo.clearbit.com/youtube.com",
    "https://icon.horse/icon/youtube.com",
    "https://icons.duckduckgo.com/ip3/youtube.com.ico",
    "https://www.google.com/s2/favicons?sz=256&domain=youtube.com",
    "https://api.faviconkit.com/youtube.com/256",
    "https://besticon-demo.herokuapp.com/icon?url=https%3A//www.youtube.com&size=256"
  ];
  
  thirdParty.forEach((iconUrl, index) => {
    console.log(`  ${index + 1}. ${iconUrl}`);
  });
  
  console.log("");
  console.log("─".repeat(60));
  console.log("");
});

console.log("🎉 优化效果预期:");
console.log("✅ YouTube图标清晰度提升: 16x16 → 144x144+ (9倍提升)");
console.log("✅ 成功率提升: 增加YouTube特殊路径和更多服务");
console.log("✅ 质量等级: Premium (Clearbit) 或 High (144x144+)");
console.log("✅ 加载速度: 优先尝试已知有效路径");

console.log("");
console.log("🔧 技术改进:");
console.log("• 添加YouTube特殊路径优先处理");
console.log("• 增加文件大小检查，过滤占位符图标");
console.log("• 优化Google Favicon参数 (domain vs domain_url)");
console.log("• 新增多个专业图标服务API");
console.log("• 支持更高分辨率 (最高512x512)");