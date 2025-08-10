import { fetchWrapper } from "@/utils/wrapper"
import { getDefaultIcon } from "@/assets/default-icon"

// 图标缓存，避免重复下载相同域名的图标
const iconCache = new Map<string, { icon?: string; iconUrl?: string }>();

// 并发控制：限制同时进行的图标请求数量
class ConcurrencyController {
  private running = 0;
  private queue: Array<() => void> = [];

  constructor(private maxConcurrency: number = 6) { } // 限制最多6个并发请求

  async execute<T>(task: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      const run = async () => {
        this.running++;
        try {
          const result = await task();
          resolve(result);
        } catch (error) {
          reject(error);
        } finally {
          this.running--;
          if (this.queue.length > 0) {
            const next = this.queue.shift()!;
            next();
          }
        }
      };

      if (this.running < this.maxConcurrency) {
        run();
      } else {
        this.queue.push(run);
      }
    });
  }
}

const concurrencyController = new ConcurrencyController(6);

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

// 并发尝试多个图标URL，返回第一个成功的
const tryIconUrlsConcurrently = async (urls: string[], timeout: number = 3000): Promise<string | null> => {
  if (urls.length === 0) return null;

  // 创建并发请求的Promise数组
  const promises = urls.map(async (iconUrl, index) => {
    try {
      const response = await fetchWrapper(iconUrl, { timeout });
      const contentType = response.headers.get('content-type');
      const contentLength = response.headers.get('content-length');

      if (contentType && contentType.includes('image')) {
        // 检查文件大小，过小的可能是占位符
        const sizeKB = contentLength ? parseInt(contentLength) / 1024 : 0;
        if (sizeKB > 0.5 || !contentLength) {
          return { url: iconUrl, index, size: sizeKB };
        }
      }
      throw new Error('Invalid image');
    } catch (error) {
      throw new Error(`Failed: ${iconUrl}`);
    }
  });

  try {
    // 使用Promise.race的变体来获取第一个成功的结果
    const result = await new Promise<{ url: string; index: number; size: number }>((resolve, reject) => {
      let rejectedCount = 0;
      const errors: Error[] = [];
      
      promises.forEach((promise, index) => {
        promise
          .then(resolve)
          .catch((error) => {
            errors.push(error);
            rejectedCount++;
            if (rejectedCount === promises.length) {
              // 创建一个简单的错误对象，兼容所有环境
              const aggregateError = new Error('All promises rejected');
              (aggregateError as any).errors = errors;
              reject(aggregateError);
            }
          });
      });
    });
    
    console.log(`Found icon: ${result.url} (${result.size}KB, priority: ${result.index})`);
    return result.url;
  } catch (error) {
    // 所有请求都失败了
    return null;
  }
};

// 获取网站的高清 logo 或 favicon，优先高分辨率（优化版）
export const getLogoUrl = async (url: string) => {
  console.log(`Starting optimized icon search for: ${url}`);
  const startTime = Date.now();

  const parsedUrl = new URL(url);
  const hostname = parsedUrl.hostname;

  // 第一阶段：高优先级图标（并发尝试，快速超时）
  const highPriorityUrls = [
    ...getSpecialSiteIcons(hostname),
    ...getCommonIconUrls(url).slice(0, 8) // 只取前8个最可能的路径
  ];

  if (highPriorityUrls.length > 0) {
    const result = await tryIconUrlsConcurrently(highPriorityUrls, 2000); // 2秒超时
    if (result) {
      const elapsed = Date.now() - startTime;
      console.log(`Found high-priority icon in ${elapsed}ms: ${result}`);
      return result;
    }
  }

  // 第二阶段：第三方服务（并发尝试）
  const thirdPartyUrls = getThirdPartyIconUrls(url);
  const thirdPartyResult = await tryIconUrlsConcurrently(thirdPartyUrls, 3000); // 3秒超时
  if (thirdPartyResult) {
    const elapsed = Date.now() - startTime;
    console.log(`Found third-party icon in ${elapsed}ms: ${thirdPartyResult}`);
    return thirdPartyResult;
  }

  // 第三阶段：Google Favicon（最后的保底方案）
  const googleUrls = getGoogleLogoUrls(url);
  const googleResult = await tryIconUrlsConcurrently(googleUrls, 2000); // 2秒超时
  if (googleResult) {
    const elapsed = Date.now() - startTime;
    console.log(`Found Google favicon in ${elapsed}ms: ${googleResult}`);
    return googleResult;
  }

  const elapsed = Date.now() - startTime;
  console.warn(`All icon sources failed for ${url} after ${elapsed}ms`);
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

// 批量处理高清图标，带质量验证和缓存机制（性能优化版）
export const processIconWithFallback = async (url: string): Promise<{ icon?: string; iconUrl?: string; quality?: string }> => {
  return concurrencyController.execute(async () => {
    const startTime = Date.now();

    try {
      const parsedUrl = new URL(url);
      const domain = parsedUrl.hostname;

      // 检查缓存
      if (iconCache.has(domain)) {
        const cachedResult = iconCache.get(domain)!;
        console.log(`Cache hit for ${domain} (${Date.now() - startTime}ms)`);
        return cachedResult;
      }

      const logoUrl = await getLogoUrl(url);
      let result: { icon?: string; iconUrl?: string; quality?: string } = {};

      if (logoUrl) {
        try {
          // 并发执行质量评估和base64转换
          const [base64Icon, quality] = await Promise.all([
            logoToBase64(logoUrl),
            Promise.resolve(evaluateIconQuality(logoUrl))
          ]);

          result = {
            icon: base64Icon,
            iconUrl: logoUrl,
            quality: quality
          };

          const elapsed = Date.now() - startTime;
          console.log(`Processed ${quality} icon for ${domain} in ${elapsed}ms`);

        } catch (base64Error) {
          console.warn(`Base64 conversion failed for ${url} (${Date.now() - startTime}ms):`, base64Error);
          result = {
            iconUrl: logoUrl,
            quality: 'url-only'
          };
        }
      } else {
        const elapsed = Date.now() - startTime;
        console.warn(`No icon found for ${url} after ${elapsed}ms, using default icon`);
        
        // 使用默认图标
        result = {
          icon: getDefaultIcon(),
          iconUrl: 'default',
          quality: 'default'
        };
      }

      // 缓存结果（包括失败的结果，避免重复尝试）
      iconCache.set(domain, result);
      return result;

    } catch (error) {
      const elapsed = Date.now() - startTime;
      console.warn(`Icon processing failed for ${url} after ${elapsed}ms, using default icon:`, error);

      // 使用默认图标作为失败时的备用方案
      const defaultResult = {
        icon: getDefaultIcon(),
        iconUrl: 'default',
        quality: 'default'
      };
      
      try {
        iconCache.set(new URL(url).hostname, defaultResult);
      } catch (urlError) {
        // 如果URL解析失败，仍然返回默认图标
        console.warn(`URL parsing failed for ${url}, but returning default icon`);
      }
      
      return defaultResult;
    }
  });
}

// 智能评估图标质量
export const evaluateIconQuality = (iconUrl: string, base64Data?: string): string => {
  // 检查是否为默认图标
  if (iconUrl === 'default') {
    return 'default';
  }
  
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
