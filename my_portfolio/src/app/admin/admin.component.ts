import { Component } from '@angular/core';
import { Project } from '../models/project.interface';
import { ProjectService } from '../service/project/project.service';
import { GetUsersService } from '../service/user/get-users.service';
import { Rep } from '../models/response.interface';
import { UserTable, UsersData } from '../models/user.interface';
import { ProjectData } from '../models/project.interface';
import { Technology, TechnologyData } from '../models/technology.interface';
import { TechnologyService } from '../service/technology/technology.service';
import { ImageService } from '../service/image.service';

interface ImageRes {
  message: string;
  filePath: string;
}

interface UpdateTechRes {
  message: string;
  technologyId: number;
}

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent {
  tokenData: string | null = localStorage.getItem('token');
  isEditingTechnology: boolean = false;
  selectedTechnology: Technology = {
    id: 0,
    type: '',
    subject: '',
    name: '',
    image_url: ''
  };
  staticUrl: string = 'http://localhost:4201/static/';

  public projects: Project[] = [];
  public users: UserTable[] = [];
  public technologies: Technology[] = [];

  constructor(
    private _projectService: ProjectService,
    private _getUsersService: GetUsersService,
    private _technologiesService: TechnologyService,
    private _imagesService: ImageService
  ) {}

  ngOnInit(): void {
    let token: string = '';

    if (this.tokenData) {
      const parsedTokenData: Rep = JSON.parse(this.tokenData);
      token = parsedTokenData.token;
    }

    this.loadProjects();
    this.loadUsers(token);
    this.loadTechnologies();
  }

  loadUsers(token: string) {
    this._getUsersService.getUsers(token).subscribe(data => {
      let usersData: any = data;
      const responseData: UsersData = JSON.parse(usersData);
      const results: UserTable[] = responseData.result;

      if(results) {
        this.users = results;
      }
    });
  }

  loadProjects() {
    this._projectService.getProjects().subscribe(data => {
      let tableData: ProjectData | any = data;
      const responseData: any = JSON.parse(tableData);
      const results: Project[] = responseData.result;

      if(results) {
        this.projects = results;
      }
    });
  }

  loadTechnologies() {
    this._technologiesService.getTechnologies().subscribe(data => {
      let responseData: TechnologyData | any = data;
      const parsedResponseData: any = JSON.parse(responseData);
      const results: Technology[] = parsedResponseData.result;

      if(results) {
        this.technologies = results;
      }
    });
  }

  showEditTechnologyForm(technologyId: number) {
    const technologyItem: Technology | undefined = this.technologies.find((element) => element.id === technologyId);
    if(technologyItem){
      this.selectedTechnology = technologyItem;
    }

    this.isEditingTechnology = true;
  }

  submitUpdatedTechnology() {
    this.isEditingTechnology = false;
  }

  cancelEditTechnology() {
    this.isEditingTechnology = false;
  }

  editUser(userId: number) {
    console.log(`Edit user with ID ${userId}`);
  }

  deleteUser(userId: number) {
    console.log(`Delete user with ID ${userId}`);
  }

  getFileExtension(fileName: string): string {
    return fileName.slice(((fileName.lastIndexOf('.') - 1) >>> 0) + 2);
  }

  onImageChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;

    if (inputElement.files && inputElement.files.length > 0) {
      const file = inputElement.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        const imageData = reader.result as string;
        const uploadPath = 'images';
        const fileExtension = this.getFileExtension(file.name);
        const fileName = `technology_${this.selectedTechnology.id}.${fileExtension}`;

        this._imagesService.uploadImage(imageData, uploadPath, fileName).subscribe(
          (response) => {
            const responseData: any = response;
            const data: ImageRes = JSON.parse(responseData);
            if(data.message === 'Image saved successfully') {
              this.selectedTechnology.image_url = fileName;
              console.log(this.selectedTechnology);
            }
          },
          (error) => {
            console.error('Error uploading image:', error);
          }
        );
      };
      reader.readAsDataURL(file);
    }
  }

  editTechnology() {
    if(this.selectedTechnology.id > 0) {
      this._technologiesService.updateTechnology(
        this.selectedTechnology.id,
        this.selectedTechnology.type,
        this.selectedTechnology.subject,
        this.selectedTechnology.name,
        this.selectedTechnology.image_url
        ).subscribe(
          (response) => {
            const responseData: any = response;
            const data: UpdateTechRes = JSON.parse(responseData);
            if(data.message === 'Technology updated successfully') {
              console.log(data.message);
            }
          },
          (error) => {
            console.error('Error uploading image:', error);
          }
        )
    }

    this.submitUpdatedTechnology();
  }

  deleteTechnology(technologyId: number) {
    console.log(`Delete user with ID ${technologyId}`);
  }

  editProject(projectId: number) {
    console.log(`Edit user with ID ${projectId}`);
  }

  deleteProject(projectId: number) {
    console.log(`Delete user with ID ${projectId}`);
  }
}
