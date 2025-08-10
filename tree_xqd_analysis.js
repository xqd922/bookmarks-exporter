// 分析 https://tree.xqd.pp.ua/ 网站的图标获取策略
const testUrl = "https://tree.xqd.pp.ua/";
const parsedUrl = new URL(testUrl);
const domain = parsedUrl.origin;
const hostname = parsedUrl.hostname;

console.log("=== tree.xqd.pp.ua 网站图标获取分析 ===");
console.log(`目标网站: ${testUrl}`);
console.log(`域名: ${hostname}`);
console.log(`完整域名: ${domain}`);
console.log("");

// 1. 检查是否有特殊网站优化
console.log("🔍 特殊网站检查:");
const hasSpecialOptimization = [
  'youtube.com', 'google.com', 'github.com', 'twitter.com', 
  'facebook.com', 'instagram.com', 'linkedin.com'
].some(site => hostname.includes(site));

if (hasSpecialOptimization) {
  console.log("✅ 该网站有特殊优化路径");
} else {
  console.log("❌ 该网站无特殊优化，使用通用策略");
}
console.log("");

// 2. 第一优先级：原生高分辨率图标路径
console.log("📱 第一优先级：原生高分辨率图标路径");
const nativeIcons = [
  `${domain}/apple-touch-icon-180x180.png`,
  `${domain}/apple-touch-icon-152x152.png`,
  `${domain}/apple-touch-icon-144x144.png`,
  `${domain}/apple-touch-icon-120x120.png`,
  `${domain}/apple-touch-icon.png`,
  `${domain}/apple-touch-icon-precomposed.png`,
  `${domain}/icon-512x512.png`,
  `${domain}/icon-256x256.png`,
  `${domain}/icon-192x192.png`,
  `${domain}/icon-128x128.png`,
  `${domain}/icon-96x96.png`,
  `${domain}/favicon-96x96.png`,
  `${domain}/favicon-64x64.png`,
  `${domain}/favicon-32x32.png`,
  `${domain}/favicon.png`,
  `${domain}/favicon.svg`,
  `${domain}/icon.svg`,
  `${domain}/favicon.ico`,
  `${domain}/icon.ico`
];

nativeIcons.forEach((url, index) => {
  console.log(`${index + 1}. ${url}`);
});
console.log("");

// 3. 第二优先级：第三方高质量服务
console.log("🌐 第二优先级：第三方高质量服务");
const thirdPartyIcons = [
  `https://logo.clearbit.com/${hostname}`,
  `https://icon.horse/icon/${hostname}`,
  `https://favicongrabber.com/api/grab/${hostname}`,
  `https://icons.duckduckgo.com/ip3/${hostname}.ico`,
  `https://www.google.com/s2/favicons?sz=256&domain=${hostname}`,
  `https://www.google.com/s2/favicons?sz=128&domain=${hostname}`,
  `https://favicons.githubusercontent.com/${hostname}`,
  `https://favicon.yandex.net/favicon/${hostname}`,
  `https://besticon-demo.herokuapp.com/icon?url=${encodeURIComponent(testUrl)}&size=256`,
  `https://besticon-demo.herokuapp.com/icon?url=${encodeURIComponent(testUrl)}&size=128`,
  `https://api.faviconkit.com/${hostname}/256`,
  `https://api.faviconkit.com/${hostname}/128`,
  `https://www.getfavicon.org/?url=${encodeURIComponent(testUrl)}&size=128`
];

thirdPartyIcons.forEach((url, index) => {
  console.log(`${index + 1}. ${url}`);
});
console.log("");

// 4. 第三优先级：Google多尺寸Favicon
console.log("🔍 第三优先级：Google多尺寸Favicon");
const googleIcons = [
  `https://www.google.com/s2/favicons?sz=256&domain=${hostname}`,
  `https://www.google.com/s2/favicons?sz=128&domain=${hostname}`,
  `https://www.google.com/s2/favicons?sz=96&domain=${hostname}`,
  `https://www.google.com/s2/favicons?sz=256&domain_url=${testUrl}`,
  `https://www.google.com/s2/favicons?sz=128&domain_url=${testUrl}`,
  `https://www.google.com/s2/favicons?sz=96&domain_url=${testUrl}`,
  `https://www.google.com/s2/favicons?sz=64&domain_url=${testUrl}`,
  `https://www.google.com/s2/favicons?domain=${hostname}`,
  `https://www.google.com/s2/favicons?domain_url=${testUrl}`
];

googleIcons.forEach((url, index) => {
  console.log(`${index + 1}. ${url}`);
});
console.log("");

// 5. 预测最可能成功的图标源
console.log("🎯 预测最可能成功的图标源:");
console.log("1. https://tree.xqd.pp.ua/favicon.ico (传统favicon)");
console.log("2. https://www.google.com/s2/favicons?sz=128&domain=tree.xqd.pp.ua (Google 128x128)");
console.log("3. https://icon.horse/icon/tree.xqd.pp.ua (IconHorse服务)");
console.log("4. https://api.faviconkit.com/tree.xqd.pp.ua/128 (FaviconKit服务)");
console.log("");

// 6. 预测质量等级
console.log("📊 预测质量等级:");
console.log("• 如果获取到原生高分辨率图标 (180x180+): 🔥 High (高清)");
console.log("• 如果获取到SVG图标: ⭐ Vector (矢量)");
console.log("• 如果获取到128x128图标: ✅ Good (良好)");
console.log("• 如果只能获取到favicon.ico: 📱 Standard (标准)");
console.log("");

// 7. 预测JSON输出格式
console.log("📄 预测JSON输出格式:");
const predictedJson = {
  type: "link",
  addDate: 1640995200000, // 示例时间戳
  title: "Tree - 个人网站", // 假设的标题
  icon: "data:image/x-icon;base64,AAABAAEAEBAQAAEABAAoAQAAFgAAACgAAAAQAAAAIAAAAAEABAAAAAAAgAAAAAAAAAAAAAAAEAAAAAAAAAAAAA...", // base64编码的图标
  iconUrl: "https://tree.xqd.pp.ua/favicon.ico", // 最可能的图标URL
  quality: "standard", // 预测质量等级
  url: "https://tree.xqd.pp.ua/"
};

console.log(JSON.stringify(predictedJson, null, 2));
console.log("");

console.log("🔧 分析总结:");
console.log("• 这是一个个人网站 (.pp.ua 域名)");
console.log("• 没有特殊优化，使用通用获取策略");
console.log("• 预计质量等级: Standard 或 Good");
console.log("• 成功率: 高 (Google Favicon作为保底)");