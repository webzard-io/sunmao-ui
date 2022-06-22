import { Condition } from './condition';

declare module '@sinclair/typebox' {
  export interface CustomOptions {
    defaultValue?: any;
    // category
    category?: string;
    weight?: number;
    name?: string;
    // conditional render
    conditions?: Condition[];
  }
}
