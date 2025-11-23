export interface StockMetadata {
  title: string;
  description: string;
  keywords: string[];
  category: string;
}

export enum LoadingState {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}