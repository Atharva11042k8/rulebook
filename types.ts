export interface Point {
  id: string;
  text: string;
  done: boolean;
  order?: number;
}

export interface Rule {
  id: string;
  title: string;
  description: string;
  points: Point[];
  createdAt: string;
  updatedAt: string;
  order?: number;
}

export interface MetaData {
  title: string;
  version: string;
  createdAt: string;
  updatedAt: string;
}

export interface RuleBookData {
  meta: MetaData;
  rules: Rule[];
}

export type Theme = 'dark' | 'light';