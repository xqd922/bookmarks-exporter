type FetchOptions = {
  method?: string;
  headers?: { [key: string]: string };
  body?: any;
  timeout?: number;
  retries?: number;
};

export async function fetchWrapper(url: string, options: FetchOptions = {}) {
  const { timeout = 10000, retries = 2, ...fetchOptions } = options;
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      
      const response = await fetch(url, {
        method: fetchOptions.method || 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          ...fetchOptions.headers
        },
        body: fetchOptions.body,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return response;
    } catch (error) {
      if (attempt === retries) {
        throw new Error(`Fetch failed after ${retries + 1} attempts: ${error}`);
      }
      
      // 等待一段时间后重试
      await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
    }
  }
  
  throw new Error('Unexpected error in fetchWrapper');
}
