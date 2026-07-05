/** Tipi minimi per @pagefind/default-ui (il pacchetto non li fornisce). */
declare module '@pagefind/default-ui' {
  export interface PagefindUIOptions {
    element: HTMLElement | string;
    bundlePath?: string;
    pageSize?: number;
    showImages?: boolean;
    showSubResults?: boolean;
    excerptLength?: number;
    debounceTimeoutMs?: number;
    translations?: Record<string, string>;
  }

  export class PagefindUI {
    constructor(options: PagefindUIOptions);
    destroy(): void;
  }
}
