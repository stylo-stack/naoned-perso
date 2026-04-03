export type BrickId = string;

export interface BrickDefinition {
  id: BrickId;
  label: string;
  description: string;
  icon: string;
  accentColor: string;
  route: string;
  defaultEnabled: boolean;
}

export interface BrickInstance {
  id: BrickId;
  order: number;
}
