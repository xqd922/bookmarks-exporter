type FetchOptions = {
  method?: string;
  headers?: { [key: string]: string };
  body?: any;
  timeout?: number;
  retries?: number;
};

export async function fetchWrapper(url: string, options: FetchOptions = {}) {
  const { timeout = 5000, retries = 1, ...fetchOptions } = options; // 减少默认超时和重试次数
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      
      const response = await fetch(url, {
        method: fetchOptions.method || 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'image/*,*/*;q=0.8', // 优先接受图片
          'Cache-Control': 'no-cache', // 避免缓存问题
          ...fetchOptions.headers
        },
        body: fetchOptions.body,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        // 对于图标请求，404是常见的，不需要重试
        if (response.status === 404) {
          throw new Error(`Not found: ${response.status}`);
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return response;
    } catch (error) {
      // 对于超时和404错误，不进行重试
      if (error.name === 'AbortError' || error.message.includes('Not found')) {
        throw error;
      }
      
      if (attempt === retries) {
        throw new Error(`Fetch failed after ${retries + 1} attempts: ${error}`);
      }
      
      // 快速重试，不等待
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  }
  
  throw new Error('Unexpected error in fetchWrapper');
}
