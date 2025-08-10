// YouTube图标获取测试脚本
const testUrl = "https://www.youtube.com";

// 模拟当前系统会尝试的所有图标URL
const getYouTubeIconUrls = () => {
  const domain = "https://www.youtube.com";
  
  console.log("=== YouTube图标获取测试 ===");
  console.log(`目标网站: ${testUrl}`);
  console.log("");
  
  // 第一优先级：原生高分辨率图标
  console.log("🔍 第一优先级：原生高分辨率图标");
  const nativeIcons = [
    `${domain}/apple-touch-icon-180x180.png`,
    `${domain}/apple-touch-icon-152x152.png`, 
    `${domain}/apple-touch-icon-144x144.png`,
    `${domain}/apple-touch-icon-120x120.png`,
    `${domain}/apple-touch-icon.png`,
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
  
  // 第二优先级：第三方高质量服务
  console.log("🔍 第二优先级：第三方高质量服务");
  const thirdPartyIcons = [
    "https://logo.clearbit.com/youtube.com",
    "https://icons.duckduckgo.com/ip3/youtube.com.ico",
    "https://favicons.githubusercontent.com/youtube.com",
    "https://favicon.yandex.net/favicon/youtube.com",
    "https://besticon-demo.herokuapp.com/icon?url=https%3A//www.youtube.com&size=128",
    "https://besticon-demo.herokuapp.com/icon?url=https%3A//www.youtube.com&size=96"
  ];
  
  thirdPartyIcons.forEach((url, index) => {
    console.log(`${index + 1}. ${url}`);
  });
  
  console.log("");
  
  // 第三优先级：Google高分辨率Favicon
  console.log("🔍 第三优先级：Google高分辨率Favicon");
  const googleIcons = [
    "https://www.google.com/s2/favicons?sz=128&domain_url=https://www.youtube.com",
    "https://www.google.com/s2/favicons?sz=96&domain_url=https://www.youtube.com", 
    "https://www.google.com/s2/favicons?sz=64&domain_url=https://www.youtube.com",
    "https://www.google.com/s2/favicons?sz=48&domain_url=https://www.youtube.com"
  ];
  
  googleIcons.forEach((url, index) => {
    console.log(`${index + 1}. ${url}`);
  });
  
  return {
    native: nativeIcons,
    thirdParty: thirdPartyIcons,
    google: googleIcons
  };
};

// 执行测试
const urls = getYouTubeIconUrls();

console.log("");
console.log("=== 预期结果分析 ===");
console.log("✅ 最可能成功的URL:");
console.log("1. https://logo.clearbit.com/youtube.com (Clearbit品牌Logo)");
console.log("2. https://www.google.com/s2/favicons?sz=128&domain_url=https://www.youtube.com (Google 128x128)");
console.log("3. https://www.youtube.com/favicon.ico (YouTube原生favicon)");

console.log("");
console.log("🎯 推荐优化方案:");
console.log("1. 增加YouTube特定的高分辨率图标URL");
console.log("2. 优化Google Favicon的尺寸参数");
console.log("3. 添加更多专业图标服务");