import { Technology } from './technology.interface';


export interface Project {
  id: number;
  type: string;
  subject: string;
  name: string;
  description: string;
  technologies: Technology[];
}

export interface ProjectData {
  message: string;
  result: Project[]
}
