export interface SpawnPoints {
  [key: string]: { x: number; y: number }[];
}

export interface LayerObjects {
  height: number;
  id: number;
  name: string;
  rotation: number;
  type: string;
  visible: boolean;
  width: number;
  x: number;
  y: number;
}

export interface Layer {
  data: number[];
  height: number;
  id: number;
  name: string;
  opacity: number;
  type: string;
  visible: boolean;
  width: number;
  objects: LayerObjects[];
}

export interface Level {
  compressionlevel: number;
  height: number;
  infinite: boolean;
  layers: Layer[];
}
