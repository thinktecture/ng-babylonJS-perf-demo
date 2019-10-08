export interface MeshConfiguration {
  freeze: boolean;
  merge: boolean;
  index: boolean;
  flat: boolean;
  normals: boolean;
  edge: boolean;
  boundings: boolean;
  batch: boolean;
}

export interface AsteroidConfiguration {
  amount: number;
  segments: number;
}

export interface MaterialConfiguration {
  freeze: boolean;
}
