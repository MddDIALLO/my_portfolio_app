export interface Rep {
  message: string;
  token: string;
  connectedUser: {
    id: number;
    username: string;
    role: string;
    image_url: string;
    };
}

export interface Message {
  message: string;
}
