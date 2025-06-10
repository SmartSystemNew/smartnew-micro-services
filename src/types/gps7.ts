export type GPS7Equipment = {
  cidade: string;
  codigo: number;
  data: string | Date;
  dataGps: string | Date;
  hodometro: number;
  horimetro: number;
  id: number;
  identificador: string;
  ignicao: number;
  latitude: string;
  longitude: string;
  motorista: string | null;
  panico: number;
  posicaoValida: number;
  s7: number;
  tensao: string | number;
  tensaoExterna: string | number;
};

export type GPS7Response = {
  status: string;
  msg: GPS7Equipment[];
};
