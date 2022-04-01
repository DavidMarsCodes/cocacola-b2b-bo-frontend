export interface Banner {
    active: boolean
    date?: string
    device?: string
    bannerId: number
    lastUpdate?: string;
    deleted: boolean;
    title?: string
    image: string;
    order?: number;
    clientPath?: string;
  }