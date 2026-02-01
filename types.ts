export interface PromptData {
  id?: string;
  title: string;
  content: string;
  tags: string[];
  imageUrl?: string;
  userId?: string; // ID do dono da nota
  createdAt: number;
}

export enum ViewMode {
  LIST = 'LIST',
  CREATE = 'CREATE',
  EDIT = 'EDIT'
}