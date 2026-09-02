export type Position = "POR" | "DEF" | "MED" | "DEL";

export type PlayerStatus = "answered" | "pending";

export type Player = {
  id: string;
  name: string;
  apellido: string;
  edad: number | null;
  nickname: string;
  num: number;
  pos: Position;
  positions: Position[];
  positionsDetail: string[];
  pac: number | null;
  sho: number | null;
  pas: number | null;
  dri: number | null;
  def: number | null;
  phy: number | null;
  ovr: number | null;
  note: string[];
  note_raw: string | null;
  photo: string | null;
  status: PlayerStatus;
  respondedAt: string | null;
};

export type Tier = {
  label: "Oro" | "Plata" | "Bronce";
  ink: string;
  tintA: string;
  tintB: string;
  edge: string;
};
