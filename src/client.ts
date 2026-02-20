import pLimit from 'p-limit';

export interface ClientOptions {
  /** Max concurrent requests (default: 5) */
  concurrency?: number;
  /** Max retry attempts on 429/5xx (default: 3) */
  retries?: number;
  /** Base delay in ms for exponential backoff (default: 1000) */
  retryDelay?: number;
}

const DEFAULT_OPTIONS: Required<ClientOptions> = {
  concurrency: 5,
  retries: 3,
  retryDelay: 1000,
};

export class BaseClient {
  protected readonly limit: ReturnType<typeof pLimit>;
  protected readonly retries: number;
  protected readonly retryDelay: number;

  constructor(
    protected readonly baseUrl: string,
    options: ClientOptions = {},
  ) {
    const opts = { ...DEFAULT_OPTIONS, ...options };
    this.limit = pLimit(opts.concurrency);
    this.retries = opts.retries;
    this.retryDelay = opts.retryDelay;
  }

  protected async request<T>(path: string, params?: Record<string, unknown>): Promise<T> {
    return this.limit(() => this.fetchWithRetry<T>(path, params));
  }

  private async fetchWithRetry<T>(path: string, params?: Record<string, unknown>): Promise<T> {
    const base = this.baseUrl.endsWith('/') ? this.baseUrl : this.baseUrl + '/';
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    const url = new URL(cleanPath, base);
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            for (const v of value) {
              url.searchParams.append(key, String(v));
            }
          } else {
            url.searchParams.set(key, String(value));
          }
        }
      }
    }

    let lastError: Error | undefined;
    for (let attempt = 0; attempt <= this.retries; attempt++) {
      try {
        const response = await fetch(url.toString(), {
          headers: { Accept: 'application/json' },
        });

        if (response.status === 429 || response.status >= 500) {
          const retryAfter = response.headers.get('Retry-After');
          const delay = retryAfter
            ? parseInt(retryAfter, 10) * 1000
            : this.retryDelay * Math.pow(2, attempt);
          if (attempt < this.retries) {
            await this.sleep(delay);
            continue;
          }
        }

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText} for ${url.toString()}`);
        }

        return (await response.json()) as T;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        if (attempt < this.retries) {
          await this.sleep(this.retryDelay * Math.pow(2, attempt));
          continue;
        }
      }
    }

    throw lastError ?? new Error(`Request failed after ${this.retries} retries`);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
