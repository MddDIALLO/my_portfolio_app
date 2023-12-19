import { Component } from '@angular/core';
import { Project } from '../models/project.interface';
import { ProjectService } from '../service/project/project.service';
import { GetUsersService } from '../service/user/get-users.service';
import { Rep } from '../models/response.interface';
import { UserTable, UsersData } from '../models/user.interface';
import { ProjectData } from '../models/project.interface';
import { Technology, TechnologyData } from '../models/technology.interface';
import { TechnologyService } from '../service/technology/technology.service';

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

  public projects: Project[] = [];
  public users: UserTable[] = [];
  public technologies: Technology[] = [];

  constructor(
    private _projectService: ProjectService,
    private _getUsersService: GetUsersService,
    private _getTechnologiesService: TechnologyService
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
    this._getTechnologiesService.getTechnologies().subscribe(data => {
      let responseData: TechnologyData | any = data;
      const parsedResponseData: any = JSON.parse(responseData);
      const results: Technology[] = parsedResponseData.result;

      if(results) {
        this.technologies = results;
      }
    });
  }

  showEditTechnologyForm(technologyId: number) {
    this.selectedTechnology.id = technologyId;
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

  editTechnology(technologyId: number) {
    console.log(`Edit technology: ${this.selectedTechnology.id, this.selectedTechnology.image_url}`);
    this.submitUpdatedTechnology();
  }

  onImageChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      const file = inputElement.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedTechnology.image_url = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
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
