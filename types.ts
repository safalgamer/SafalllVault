
export interface DocumentItem {
  id: string;
  name: string;
  dataUrl: string;
}

export interface Writing {
  id: string;
  title: string;
  content: string;
  isPublic: boolean;
}

export enum Page {
  HOME,
  DOCUMENTS,
  WRITINGS,
}