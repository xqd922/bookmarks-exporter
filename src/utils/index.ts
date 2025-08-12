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
    
    // 尝试多个图标源
    const iconSources = [
      await getClearbitLogoUrl(url),
      await getGoogleLogoUrl(url),
      `${parsedUrl.origin}/favicon.ico`
    ];
    
    for (const iconUrl of iconSources) {
      try {
        const response = await fetchWrapper(iconUrl);
        if (response.ok) {
          const blob = await response.blob();
          return { fileName, blob };
        }
      } catch (error) {
        console.warn(`Failed to fetch icon from ${iconUrl}:`, error);
        continue;
      }
    }
    
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
