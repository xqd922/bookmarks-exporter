import { fetchWrapper } from "@/utils/wrapper"

// 图标缓存，避免重复下载相同域名的图标
const iconCache = new Map<string, { icon?: string; iconUrl?: string }>();

// 获取知名网站的特殊高质量图标路径
export const getSpecialSiteIcons = (hostname: string): string[] => {
  const specialIcons: string[] = [];
  
  if (hostname.includes('youtube.com')) {
    specialIcons.push(
      'https://www.youtube.com/s/desktop/favicon.ico',
      'https://www.youtube.com/img/favicon_144x144.png',
      'https://www.youtube.com/img/favicon_96x96.png',
      'https://logo.clearbit.com/youtube.com',
      'https://www.google.com/s2/favicons?sz=256&domain=youtube.com'
    );
  } else if (hostname.includes('google.com')) {
    specialIcons.push(
      'https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png',
      'https://logo.clearbit.com/google.com',
      'https://www.google.com/favicon.ico'
    );
  } else if (hostname.includes('github.com')) {
    specialIcons.push(
      'https://github.com/fluidicon.png',
      'https://github.com/apple-touch-icon-180x180.png',
      'https://logo.clearbit.com/github.com'
    );
  } else if (hostname.includes('twitter.com') || hostname.includes('x.com')) {
    specialIcons.push(
      'https://abs.twimg.com/responsive-web/client-web/icon-ios.b1fc7275.png',
      'https://abs.twimg.com/icons/apple-touch-icon-192x192.png',
      'https://logo.clearbit.com/twitter.com'
    );
  } else if (hostname.includes('facebook.com')) {
    specialIcons.push(
      'https://static.xx.fbcdn.net/rsrc.php/yo/r/iRmz9lCMBD2.ico',
      'https://logo.clearbit.com/facebook.com'
    );
  } else if (hostname.includes('instagram.com')) {
    specialIcons.push(
      'https://static.cdninstagram.com/rsrc.php/v3/yt/r/30PrGfR3xhD.png',
      'https://logo.clearbit.com/instagram.com'
    );
  } else if (hostname.includes('linkedin.com')) {
    specialIcons.push(
      'https://static.licdn.com/aero-v1/sc/h/al2o9zrvru7aqj8e1x2rzsrca',
      'https://logo.clearbit.com/linkedin.com'
    );
  } else if (hostname.includes('netflix.com')) {
    specialIcons.push(
      'https://assets.nflxext.com/ffe/siteui/common/icons/nficon2016.ico',
      'https://logo.clearbit.com/netflix.com'
    );
  } else if (hostname.includes('amazon.com')) {
    specialIcons.push(
      'https://www.amazon.com/favicon.ico',
      'https://logo.clearbit.com/amazon.com'
    );
  } else if (hostname.includes('microsoft.com')) {
    specialIcons.push(
      'https://c.s-microsoft.com/favicon.ico?v2',
      'https://logo.clearbit.com/microsoft.com'
    );
  } else if (hostname.includes('apple.com')) {
    specialIcons.push(
      'https://www.apple.com/favicon.ico',
      'https://logo.clearbit.com/apple.com'
    );
  } else if (hostname.includes('stackoverflow.com')) {
    specialIcons.push(
      'https://cdn.sstatic.net/Sites/stackoverflow/Img/apple-touch-icon.png',
      'https://logo.clearbit.com/stackoverflow.com'
    );
  } else if (hostname.includes('reddit.com')) {
    specialIcons.push(
      'https://www.redditstatic.com/desktop2x/img/favicon/apple-icon-180x180.png',
      'https://logo.clearbit.com/reddit.com'
    );
  } else if (hostname.includes('discord.com')) {
    specialIcons.push(
      'https://discord.com/assets/f8389ca1a741a115313bede9ac02e2c0.ico',
      'https://logo.clearbit.com/discord.com'
    );
  } else if (hostname.includes('spotify.com')) {
    specialIcons.push(
      'https://open.scdn.co/cdn/images/favicon32.8e66b099.png',
      'https://logo.clearbit.com/spotify.com'
    );
  } else if (hostname.includes('twitch.tv')) {
    specialIcons.push(
      'https://static.twitchcdn.net/assets/favicon-32-e29e246c157142c94346.png',
      'https://logo.clearbit.com/twitch.tv'
    );
  }
  
  return specialIcons;
}

export const getCopyYear = () => {
  const currentYear = new Date().getFullYear()
  const year = currentYear === 2024 ? "2024" : `2024 - ${currentYear}`
  return year
}

// Clearbit API 获取 logo URL
export const getClearbitLogoUrl = async (url: string) => {
  const parsedUrl = new URL(url);
  const domain = parsedUrl.hostname;
  return `https://logo.clearbit.com/${domain}`;
}

// Google S2 Converter 获取高分辨率 favicon URL
export const getGoogleLogoUrl = async (url: string, size: number = 128) => {
  const parsedUrl = new URL(url);
  return `https://www.google.com/s2/favicons?sz=${size}&domain_url=${parsedUrl}`;
}

// 获取多种尺寸的Google favicon（优化版）
export const getGoogleLogoUrls = (url: string): string[] => {
  const parsedUrl = new URL(url);
  const domain = parsedUrl.hostname;
  
  return [
    // 使用domain参数（有时比domain_url效果更好）
    `https://www.google.com/s2/favicons?sz=256&domain=${domain}`,
    `https://www.google.com/s2/favicons?sz=128&domain=${domain}`,
    `https://www.google.com/s2/favicons?sz=96&domain=${domain}`,
    
    // 使用完整URL参数
    `https://www.google.com/s2/favicons?sz=256&domain_url=${parsedUrl}`,
    `https://www.google.com/s2/favicons?sz=128&domain_url=${parsedUrl}`,
    `https://www.google.com/s2/favicons?sz=96&domain_url=${parsedUrl}`,
    `https://www.google.com/s2/favicons?sz=64&domain_url=${parsedUrl}`,
    
    // 不指定尺寸，让Google自动选择最佳尺寸
    `https://www.google.com/s2/favicons?domain=${domain}`,
    `https://www.google.com/s2/favicons?domain_url=${parsedUrl}`,
  ];
}

// 获取网站原生 favicon.ico 文件
export const getNativeFaviconUrl = async (url: string) => {
  const parsedUrl = new URL(url);
  const domain = parsedUrl.origin;
  return `${domain}/favicon.ico`;
}

// 获取网站根目录下的高分辨率图标文件（按优先级排序）
export const getCommonIconUrls = (url: string): string[] => {
  const parsedUrl = new URL(url);
  const domain = parsedUrl.origin;
  const hostname = parsedUrl.hostname;
  
  // 基础高分辨率图标路径
  const baseIcons = [
    // 高分辨率Apple图标（通常最清晰）
    `${domain}/apple-touch-icon-180x180.png`,
    `${domain}/apple-touch-icon-152x152.png`,
    `${domain}/apple-touch-icon-144x144.png`,
    `${domain}/apple-touch-icon-120x120.png`,
    `${domain}/apple-touch-icon.png`,
    `${domain}/apple-touch-icon-precomposed.png`,
    
    // 高分辨率PNG图标
    `${domain}/icon-512x512.png`,
    `${domain}/icon-256x256.png`,
    `${domain}/icon-192x192.png`,
    `${domain}/icon-128x128.png`,
    `${domain}/icon-96x96.png`,
    `${domain}/favicon-96x96.png`,
    `${domain}/favicon-64x64.png`,
    `${domain}/favicon-32x32.png`,
    `${domain}/favicon.png`,
    
    // SVG图标（矢量，最清晰）
    `${domain}/favicon.svg`,
    `${domain}/icon.svg`,
    
    // 常见特殊目录下的图标（按发现频率排序）
    `${domain}/favicon/favicon.ico`,
    `${domain}/favicon/favicon.png`,
    `${domain}/favicon/favicon.svg`,
    `${domain}/favicon/apple-touch-icon.png`,
    `${domain}/favicon/apple-touch-icon-180x180.png`,
    `${domain}/assets/favicon.ico`,
    `${domain}/assets/favicon.png`,
    `${domain}/assets/images/favicon.ico`,
    `${domain}/static/favicon.ico`,
    `${domain}/static/images/favicon.ico`,
    `${domain}/public/favicon.ico`,
    `${domain}/public/images/favicon.ico`,
    `${domain}/img/favicon.ico`,
    `${domain}/images/favicon.ico`,
    `${domain}/icons/favicon.ico`,
    `${domain}/icons/apple-touch-icon.png`,
    `${domain}/icon/favicon.ico`,
    `${domain}/media/favicon.ico`,
    `${domain}/resources/favicon.ico`,
    `${domain}/dist/favicon.ico`,
    `${domain}/build/favicon.ico`,
    `${domain}/wp-content/themes/favicon.ico`,
    `${domain}/themes/favicon.ico`,
    
    // 传统ICO文件（根目录）
    `${domain}/favicon.ico`,
    `${domain}/icon.ico`
  ];
  
  // 针对特定大型网站的优化路径
  const specialIcons = [];
  
  if (hostname.includes('youtube.com')) {
    specialIcons.push(
      `${domain}/img/favicon_144x144.png`,
      `${domain}/img/favicon_96x96.png`,
      `${domain}/img/favicon_48x48.png`,
      `${domain}/s/desktop/favicon.ico`,
      `${domain}/yts/img/favicon_144x144.png`
    );
  } else if (hostname.includes('google.com')) {
    specialIcons.push(
      `${domain}/images/branding/googleg/1x/googleg_standard_color_128dp.png`,
      `${domain}/images/branding/product/ico/googleg_lodp.ico`
    );
  } else if (hostname.includes('github.com')) {
    specialIcons.push(
      `${domain}/fluidicon.png`,
      `${domain}/apple-touch-icon-180x180.png`
    );
  } else if (hostname.includes('twitter.com') || hostname.includes('x.com')) {
    specialIcons.push(
      `${domain}/i/web/icon/favicon.ico`,
      `${domain}/favicon.ico`
    );
  } else if (hostname.includes('facebook.com')) {
    specialIcons.push(
      `${domain}/rsrc.php/yo/r/iRmz9lCMBD2.ico`,
      `${domain}/images/fb_icon_325x325.png`
    );
  }
  
  // 将特殊路径放在前面，优先尝试
  return [...specialIcons, ...baseIcons];
}

// 获取更多第三方高清图标服务
export const getThirdPartyIconUrls = (url: string): string[] => {
  const parsedUrl = new URL(url);
  const domain = parsedUrl.hostname;
  const encodedUrl = encodeURIComponent(url);
  
  return [
    // Clearbit (高质量品牌Logo) - 最高优先级
    `https://logo.clearbit.com/${domain}`,
    
    // IconHorse 服务（新的高质量服务）
    `https://icon.horse/icon/${domain}`,
    
    // Favicon Grabber 服务
    `https://favicongrabber.com/api/grab/${domain}`,
    
    // DuckDuckGo 图标服务（高分辨率）
    `https://icons.duckduckgo.com/ip3/${domain}.ico`,
    
    // Google Favicon 高分辨率版本
    `https://www.google.com/s2/favicons?sz=256&domain=${domain}`,
    `https://www.google.com/s2/favicons?sz=128&domain=${domain}`,
    
    // Favicon.io 服务
    `https://favicons.githubusercontent.com/${domain}`,
    
    // Yandex 图标服务
    `https://favicon.yandex.net/favicon/${domain}`,
    
    // Besticon 服务（多尺寸）
    `https://besticon-demo.herokuapp.com/icon?url=${encodedUrl}&size=256`,
    `https://besticon-demo.herokuapp.com/icon?url=${encodedUrl}&size=128`,
    `https://besticon-demo.herokuapp.com/icon?url=${encodedUrl}&size=96`,
    
    // Favicon Kit 服务
    `https://api.faviconkit.com/${domain}/256`,
    `https://api.faviconkit.com/${domain}/128`,
    
    // GetFavicon 服务
    `https://www.getfavicon.org/?url=${encodedUrl}&size=128`,
    
    // Iconify API (如果是知名网站)
    `https://api.iconify.design/logos:${domain.replace('.', '-')}.svg`,
  ];
}

// 获取网站的高清 logo 或 favicon，优先高分辨率
export const getLogoUrl = async (url: string) => {
  console.log(`Starting high-resolution icon search for: ${url}`);
  
  const parsedUrl = new URL(url);
  const hostname = parsedUrl.hostname;
  
  // 特殊处理：对于知名大型网站，优先尝试已知的高质量图标
  const specialIcons = getSpecialSiteIcons(hostname);
  if (specialIcons.length > 0) {
    for (const iconUrl of specialIcons) {
      try {
        const response = await fetchWrapper(iconUrl, { timeout: 5000 });
        const contentType = response.headers.get('content-type');
        const contentLength = response.headers.get('content-length');
        
        if (contentType && contentType.includes('image')) {
          // 检查文件大小，确保不是占位符
          const sizeKB = contentLength ? parseInt(contentLength) / 1024 : 0;
          if (sizeKB > 0.5 || !contentLength) { // 大于0.5KB或无法获取大小
            console.log(`Found special site icon for ${hostname}: ${iconUrl} (${contentLength} bytes)`);
            return iconUrl;
          }
        }
      } catch (error) {
        continue;
      }
    }
  }
  
  // 第一优先级：网站原生高分辨率图标
  const commonIconUrls = getCommonIconUrls(url);
  for (const iconUrl of commonIconUrls) {
    try {
      const response = await fetchWrapper(iconUrl, { timeout: 5000 });
      const contentLength = response.headers.get('content-length');
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('image')) {
        // 检查文件大小，过小的可能是占位符
        const sizeKB = contentLength ? parseInt(contentLength) / 1024 : 0;
        if (sizeKB > 1 || !contentLength) { // 大于1KB或无法获取大小信息
          console.log(`Found native high-res icon for ${url}: ${iconUrl} (${contentLength} bytes)`);
          return iconUrl;
        }
      }
    } catch (error) {
      continue;
    }
  }
  
  console.log(`No native high-res icons found for ${url}, trying third-party services.`);

  // 第二优先级：第三方高质量图标服务
  const thirdPartyUrls = getThirdPartyIconUrls(url);
  for (const iconUrl of thirdPartyUrls) {
    try {
      const response = await fetchWrapper(iconUrl, { timeout: 5000 });
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('image')) {
        console.log(`Using third-party high-res icon for ${url}: ${iconUrl}`);
        return iconUrl;
      }
    } catch (error) {
      continue;
    }
  }

  // 第三优先级：Google高分辨率favicon（多尺寸尝试）
  const googleUrls = getGoogleLogoUrls(url);
  for (const iconUrl of googleUrls) {
    try {
      const response = await fetchWrapper(iconUrl, { timeout: 5000 });
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('image')) {
        console.log(`Using Google high-res favicon for ${url}: ${iconUrl}`);
        return iconUrl;
      }
    } catch (error) {
      continue;
    }
  }

  console.warn(`All high-resolution icon sources failed for ${url}`);
  return undefined;
}

// 将高清 Logo 图标转换为 base64 编码，保持最佳质量
export const logoToBase64 = async (logoUrl: string) => {
  try {
    const response = await fetchWrapper(logoUrl, { timeout: 10000 });
    const arrayBuffer = await response.arrayBuffer();
    
    // 获取正确的MIME类型
    let mimeType = response.headers.get('content-type') || '';
    
    // 根据URL推断MIME类型（如果响应头没有提供）
    if (!mimeType) {
      if (logoUrl.includes('.png')) mimeType = 'image/png';
      else if (logoUrl.includes('.jpg') || logoUrl.includes('.jpeg')) mimeType = 'image/jpeg';
      else if (logoUrl.includes('.svg')) mimeType = 'image/svg+xml';
      else if (logoUrl.includes('.gif')) mimeType = 'image/gif';
      else if (logoUrl.includes('.webp')) mimeType = 'image/webp';
      else mimeType = 'image/x-icon'; // 默认为ico
    }
    
    // 检查图片大小，确保是高质量图标
    const fileSizeKB = arrayBuffer.byteLength / 1024;
    console.log(`Converting high-res icon: ${logoUrl} (${fileSizeKB.toFixed(1)}KB, ${mimeType})`);
    
    // 使用更高效的base64转换方法
    const uint8Array = new Uint8Array(arrayBuffer);
    let binaryString = '';
    
    // 分块处理大文件，避免字符串过长导致的性能问题
    const chunkSize = 8192;
    for (let i = 0; i < uint8Array.length; i += chunkSize) {
      const chunk = uint8Array.subarray(i, i + chunkSize);
      binaryString += String.fromCharCode.apply(null, Array.from(chunk));
    }
    
    const base64 = btoa(binaryString);
    const dataUrl = `data:${mimeType};base64,${base64}`;
    
    console.log(`Successfully converted high-res icon to base64: ${fileSizeKB.toFixed(1)}KB → ${(dataUrl.length / 1024).toFixed(1)}KB`);
    return dataUrl;
    
  } catch (error) {
    console.error(`Failed to convert high-res logo to base64 for ${logoUrl}:`, error);
    throw new Error(`Failed to convert logo to base64: ${error}`);
  }
}

// 批量处理高清图标，带质量验证和缓存机制
export const processIconWithFallback = async (url: string): Promise<{ icon?: string; iconUrl?: string; quality?: string }> => {
  try {
    const parsedUrl = new URL(url);
    const domain = parsedUrl.hostname;
    
    // 检查缓存
    if (iconCache.has(domain)) {
      const cachedResult = iconCache.get(domain)!;
      console.log(`Using cached high-res icon for domain ${domain}`);
      return cachedResult;
    }
    
    const logoUrl = await getLogoUrl(url);
    let result: { icon?: string; iconUrl?: string; quality?: string } = {};
    
    if (logoUrl) {
      try {
        const base64Icon = await logoToBase64(logoUrl);
        
        // 智能评估图标质量
        let quality = evaluateIconQuality(logoUrl, base64Icon);
        
        result = {
          icon: base64Icon,
          iconUrl: logoUrl,
          quality: quality
        };
        
        console.log(`Successfully processed ${quality} quality icon for ${domain}`);
        
      } catch (base64Error) {
        console.warn(`Failed to convert high-res icon to base64 for ${url}, using URL only:`, base64Error);
        result = {
          iconUrl: logoUrl,
          quality: 'url-only'
        };
      }
    } else {
      console.warn(`No suitable high-res icon found for ${url}`);
    }
    
    // 缓存结果
    iconCache.set(domain, result);
    return result;
    
  } catch (error) {
    console.warn(`Failed to get high-res icon for ${url}:`, error);
    return {};
  }
}

// 智能评估图标质量
export const evaluateIconQuality = (iconUrl: string, base64Data?: string): string => {
  // 基于URL特征评估
  if (iconUrl.includes('clearbit.com')) {
    return 'premium'; // Clearbit品牌级Logo
  }
  
  if (iconUrl.includes('.svg') || iconUrl.includes('svg')) {
    return 'vector'; // SVG矢量图标
  }
  
  // 基于尺寸评估
  if (iconUrl.includes('512x512') || iconUrl.includes('256x256')) {
    return 'ultra-high'; // 超高清
  }
  
  if (iconUrl.includes('180x180') || iconUrl.includes('192x192') || 
      iconUrl.includes('144x144') || iconUrl.includes('152x152')) {
    return 'high'; // 高清
  }
  
  if (iconUrl.includes('128x128') || iconUrl.includes('128') || 
      iconUrl.includes('96x96') || iconUrl.includes('apple-touch-icon')) {
    return 'good'; // 良好
  }
  
  // 基于服务商评估
  if (iconUrl.includes('icon.horse') || iconUrl.includes('faviconkit') || 
      iconUrl.includes('besticon')) {
    return 'good'; // 专业服务
  }
  
  // 基于文件大小评估（如果有base64数据）
  if (base64Data) {
    const sizeKB = (base64Data.length * 0.75) / 1024; // base64大约比原文件大33%
    if (sizeKB > 20) return 'high';
    if (sizeKB > 10) return 'good';
    if (sizeKB > 5) return 'standard';
  }
  
  // 特殊网站路径
  if (iconUrl.includes('youtube.com/img/favicon_144') || 
      iconUrl.includes('github.com/fluidicon') ||
      iconUrl.includes('twimg.com') ||
      iconUrl.includes('fbcdn.net')) {
    return 'premium';
  }
  
  return 'standard';
}

// 清理图标缓存
export const clearIconCache = () => {
  iconCache.clear();
  console.log('Icon cache cleared');
}

// 获取缓存统计信息
export const getIconCacheStats = () => {
  return {
    size: iconCache.size,
    domains: Array.from(iconCache.keys())
  };
}

/**
 * @description: Delayed execution
 * @param {number} time delay
 * @return Promise
 */
export const delay = (time: number = 500): Promise<TimerHandler> =>
  new Promise(resolve => setTimeout(resolve, time));
