export interface Account {
  login: string;
  password: string;
  name?: string;
}

export interface UserDoc {
  id: string;
  user_id: string;
  name: string;
}

export interface UniqueNameDoc {
  id: string;
  name: string;
}
