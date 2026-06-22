export class UserCreateRequest {
  username !: string;
  password !: string;
}

export class UserSignUp {
  username!: string;
  password!: string;
  email!: string;
}

export class ChatSearchRequest {
  question!: string;
  limit!: number;
}


