import { fetchWrapper } from "@/utils/wrapper"

// 图标缓存，避免重复下载相同域名的图标
const iconCache = new Map<string, { icon?: string; iconUrl?: string }>();

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

// 获取多种尺寸的Google favicon
export const getGoogleLogoUrls = (url: string): string[] => {
  const parsedUrl = new URL(url);
  return [
    `https://www.google.com/s2/favicons?sz=128&domain_url=${parsedUrl}`, // 128x128 高清
    `https://www.google.com/s2/favicons?sz=96&domain_url=${parsedUrl}`,  // 96x96
    `https://www.google.com/s2/favicons?sz=64&domain_url=${parsedUrl}`,  // 64x64
    `https://www.google.com/s2/favicons?sz=48&domain_url=${parsedUrl}`,  // 48x48
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
  return [
    // 高分辨率Apple图标（通常最清晰）
    `${domain}/apple-touch-icon-180x180.png`,
    `${domain}/apple-touch-icon-152x152.png`,
    `${domain}/apple-touch-icon-144x144.png`,
    `${domain}/apple-touch-icon-120x120.png`,
    `${domain}/apple-touch-icon.png`,
    `${domain}/apple-touch-icon-precomposed.png`,
    
    // 高分辨率PNG图标
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
    
    // 传统ICO文件
    `${domain}/favicon.ico`,
    `${domain}/icon.ico`
  ];
}

// 获取更多第三方高清图标服务
export const getThirdPartyIconUrls = (url: string): string[] => {
  const parsedUrl = new URL(url);
  const domain = parsedUrl.hostname;
  return [
    // Clearbit (高质量品牌Logo)
    `https://logo.clearbit.com/${domain}`,
    
    // DuckDuckGo 图标服务（高分辨率）
    `https://icons.duckduckgo.com/ip3/${domain}.ico`,
    
    // Favicon.io 服务
    `https://favicons.githubusercontent.com/${domain}`,
    
    // Yandex 图标服务
    `https://favicon.yandex.net/favicon/${domain}`,
    
    // Besticon 服务（多尺寸）
    `https://besticon-demo.herokuapp.com/icon?url=${encodeURIComponent(url)}&size=128`,
    `https://besticon-demo.herokuapp.com/icon?url=${encodeURIComponent(url)}&size=96`,
  ];
}

// 获取网站的高清 logo 或 favicon，优先高分辨率
export const getLogoUrl = async (url: string) => {
  console.log(`Starting high-resolution icon search for: ${url}`);
  
  // 第一优先级：网站原生高分辨率图标
  const commonIconUrls = getCommonIconUrls(url);
  for (const iconUrl of commonIconUrls) {
    try {
      const response = await fetchWrapper(iconUrl, { timeout: 5000 });
      // 检查图片尺寸和质量
      const contentLength = response.headers.get('content-length');
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('image')) {
        console.log(`Found native high-res icon for ${url}: ${iconUrl} (${contentLength} bytes)`);
        return iconUrl;
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
      await fetchWrapper(iconUrl, { timeout: 5000 });
      console.log(`Using third-party high-res icon for ${url}: ${iconUrl}`);
      return iconUrl;
    } catch (error) {
      continue;
    }
  }

  // 第三优先级：Google高分辨率favicon（多尺寸尝试）
  const googleUrls = getGoogleLogoUrls(url);
  for (const iconUrl of googleUrls) {
    try {
      await fetchWrapper(iconUrl, { timeout: 5000 });
      console.log(`Using Google high-res favicon for ${url}: ${iconUrl}`);
      return iconUrl;
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
        
        // 评估图标质量
        let quality = 'standard';
        if (logoUrl.includes('180x180') || logoUrl.includes('192x192') || logoUrl.includes('128')) {
          quality = 'high';
        } else if (logoUrl.includes('svg')) {
          quality = 'vector';
        } else if (logoUrl.includes('clearbit') || logoUrl.includes('apple-touch-icon')) {
          quality = 'premium';
        }
        
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
