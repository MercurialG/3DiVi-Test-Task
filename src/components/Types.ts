export interface Base {
  begin: Date;
  data: Node;
  dt_format: string;
  end: Date;
  levels: string[];
  obj_in_page: number;
  ok: number;
  page: number;
  pages_total: number;
  path: string;
  user_id: number;
}

export interface Node {
  n: string;
  o: Node[];
  t: string;
  ots: number;
  otsd: number;
  v: number;
  vd: number;
}
