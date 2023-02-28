export interface Position {
  x: number;
  y: number;
}

export interface Color {
  color: string;
  positions: Position[];
}

export interface Path {
  stroke: string;
  draw: string;
}
