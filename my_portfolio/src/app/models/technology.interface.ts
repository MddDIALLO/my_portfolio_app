export interface Technology {
  id: number;
  type: string;
  subject: string;
  name: string;
  image_url: string;
}

export interface TechnologyData {
  message: string;
  result: Technology[];
}
