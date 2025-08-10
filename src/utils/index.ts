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

// Google S2 Converter 获取 favicon URL
export const getGoogleLogoUrl = async (url: string) => {
  const parsedUrl = new URL(url);
  return `https://www.google.com/s2/favicons?sz=64&domain_url=${parsedUrl}`;
}

// 获取网站原生 favicon.ico 文件
export const getNativeFaviconUrl = async (url: string) => {
  const parsedUrl = new URL(url);
  const domain = parsedUrl.origin;
  return `${domain}/favicon.ico`;
}

// 获取网站根目录下的其他常见图标文件
export const getCommonIconUrls = (url: string): string[] => {
  const parsedUrl = new URL(url);
  const domain = parsedUrl.origin;
  return [
    `${domain}/favicon.ico`,
    `${domain}/favicon.png`,
    `${domain}/apple-touch-icon.png`,
    `${domain}/apple-touch-icon-precomposed.png`,
    `${domain}/icon.png`,
    `${domain}/icon.ico`
  ];
}

// 获取网站的 logo 或 favicon，并进行容错处理
export const getLogoUrl = async (url: string) => {
  // 首先尝试多个常见的原生图标文件
  const commonIconUrls = getCommonIconUrls(url);
  
  for (const iconUrl of commonIconUrls) {
    try {
      await fetchWrapper(iconUrl);
      console.log(`Using native icon for ${url}: ${iconUrl}`);
      return iconUrl;
    } catch (error) {
      // 继续尝试下一个
      continue;
    }
  }
  
  console.warn(`No native icons found for ${url}, trying external services.`);

  try {
    // 尝试使用 Clearbit 获取 logo
    const clearbitLogoUrl = await getClearbitLogoUrl(url);
    await fetchWrapper(clearbitLogoUrl);
    console.log(`Using Clearbit logo for ${url}: ${clearbitLogoUrl}`);
    return clearbitLogoUrl;
  } catch (error) {
    console.warn(`Clearbit logo not found for ${url}, trying Google Favicon.`);

    try {
      // 尝试使用 Google S2 Converter 获取 favicon
      const googleFaviconUrl = await getGoogleLogoUrl(url);
      await fetchWrapper(googleFaviconUrl);
      console.log(`Using Google favicon for ${url}: ${googleFaviconUrl}`);
      return googleFaviconUrl;
    } catch (error) {
      console.warn(`All icon sources failed for ${url}`);
      return undefined;
    }
  }
}

// 将 Logo 图标转换为 base64 编码
export const logoToBase64 = async (logoUrl: string) => {
  try {
    const response = await fetchWrapper(logoUrl);
    const arrayBuffer = await response.arrayBuffer();
    
    // 在浏览器环境中使用 btoa 和 Uint8Array 来转换为 base64
    const uint8Array = new Uint8Array(arrayBuffer);
    let binaryString = '';
    for (let i = 0; i < uint8Array.length; i++) {
      binaryString += String.fromCharCode(uint8Array[i]);
    }
    const base64 = btoa(binaryString);
    
    const mimeType = response.headers.get('content-type') || 'image/x-icon';
    return `data:${mimeType};base64,${base64}`;
  } catch (error) {
    console.error(`Failed to convert logo to base64 for ${logoUrl}:`, error);
    throw new Error(`Failed to convert logo to base64: ${error}`);
  }
}

// 批量处理图标，提高性能，带缓存机制
export const processIconWithFallback = async (url: string): Promise<{ icon?: string; iconUrl?: string }> => {
  try {
    const parsedUrl = new URL(url);
    const domain = parsedUrl.hostname;
    
    // 检查缓存
    if (iconCache.has(domain)) {
      const cachedResult = iconCache.get(domain)!;
      console.log(`Using cached icon for domain ${domain}`);
      return cachedResult;
    }
    
    const logoUrl = await getLogoUrl(url);
    let result: { icon?: string; iconUrl?: string } = {};
    
    if (logoUrl) {
      try {
        const base64Icon = await logoToBase64(logoUrl);
        result = {
          icon: base64Icon,
          iconUrl: logoUrl
        };
      } catch (base64Error) {
        console.warn(`Failed to convert to base64 for ${url}, using URL only:`, base64Error);
        result = {
          iconUrl: logoUrl
        };
      }
    }
    
    // 缓存结果
    iconCache.set(domain, result);
    return result;
    
  } catch (error) {
    console.warn(`Failed to get icon for ${url}:`, error);
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
