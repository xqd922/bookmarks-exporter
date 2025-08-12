import { fetchWrapper } from "@/utils/wrapper"

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

// 获取图标数据并返回文件名和blob数据
export const getIconData = async (url: string): Promise<{ fileName: string; blob: Blob } | undefined> => {
  try {
    const parsedUrl = new URL(url);
    const domain = parsedUrl.hostname;
    const fileName = `${domain.replace(/\./g, '_')}.ico`;
    
    // 尝试多个图标源，按优先级排序
    const iconSources = [
      // 1. 网站原生 favicon.ico (最准确)
      `${parsedUrl.origin}/favicon.ico`,
      // 2. 常见的 favicon 路径
      `${parsedUrl.origin}/assets/favicon.ico`,
      `${parsedUrl.origin}/static/favicon.ico`,
      `${parsedUrl.origin}/images/favicon.ico`,
      `${parsedUrl.origin}/img/favicon.ico`,
      // 3. Apple touch icon (通常质量较高)
      `${parsedUrl.origin}/apple-touch-icon.png`,
      `${parsedUrl.origin}/apple-touch-icon-precomposed.png`,
      // 4. 第三方服务
      `https://www.google.com/s2/favicons?sz=64&domain_url=${parsedUrl.origin}`,
      `https://www.google.com/s2/favicons?sz=32&domain_url=${parsedUrl.origin}`,
      `https://logo.clearbit.com/${domain}`,
      // 5. 其他第三方服务
      `https://icons.duckduckgo.com/ip3/${domain}.ico`,
      `https://favicons.githubusercontent.com/${domain}`,
      // 6. 尝试不同的文件扩展名
      `${parsedUrl.origin}/favicon.png`,
      `${parsedUrl.origin}/favicon.svg`,
      `${parsedUrl.origin}/icon.ico`,
      `${parsedUrl.origin}/icon.png`
    ];
    
    for (const iconUrl of iconSources) {
      try {
        console.log(`Trying to fetch icon from: ${iconUrl}`);
        const response = await fetchWrapper(iconUrl);
        
        if (response.ok) {
          const blob = await response.blob();
          
          // 检查文件大小，避免下载过小的文件（可能是占位符）
          if (blob.size > 100) {
            console.log(`Successfully fetched icon from: ${iconUrl}, size: ${blob.size} bytes`);
            return { fileName, blob };
          } else {
            console.warn(`Icon too small from ${iconUrl}: ${blob.size} bytes`);
          }
        }
      } catch (error) {
        console.warn(`Failed to fetch icon from ${iconUrl}:`, error);
        continue;
      }
    }
    
    console.warn(`No valid icon found for ${url}`);
    return undefined;
  } catch (error) {
    console.error(`Error fetching icon for ${url}:`, error);
    return undefined;
  }
}

// 获取网站的 logo 或 favicon，并进行容错处理
export const getLogoUrl = async (url: string) => {
  try {
    // 尝试使用 Clearbit 获取 logo
    const clearbitLogoUrl = await getClearbitLogoUrl(url);
    await fetchWrapper(clearbitLogoUrl); // 检查是否能成功获取
    return clearbitLogoUrl;
  } catch (error) {
    console.warn(`Clearbit logo not found for ${url}, trying Google Favicon.`);

    try {
      // 尝试使用 Google S2 Converter 获取 favicon
      const googleFaviconUrl = await getGoogleLogoUrl(url);
      await fetchWrapper(googleFaviconUrl); // 检查是否能成功获取
      return googleFaviconUrl;
    } catch (error) {
      console.warn(`Google favicon not found for ${url}, using default favicon.`);

      // 返回默认的 favicon
      return undefined;
    }
  }
}

// 将 Logo 图标转换为 base64 编码
export const logoToBase64 = async (logoUrl: string) => {
  try {
    const response = await fetchWrapper(logoUrl);
    const arrayBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');
    const mimeType = response.headers.get('content-type')!;
    return `data:${mimeType};base64,${base64}`;
  } catch (error) {
    throw new Error(`Failed to convert logo to base64: ${error}`);
  }
}

/**
 * @description: Delayed execution
 * @param {number} time delay
 * @return Promise
 */
export const delay = (time: number = 500): Promise<TimerHandler> =>
  new Promise(resolve => setTimeout(resolve, time));
