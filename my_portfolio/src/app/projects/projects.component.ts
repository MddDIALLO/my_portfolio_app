import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../service/project/project.service';
import { Project } from '../models/project.interface';
interface ProjectData {
  message: string;
  result: Project[]
}

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {
  public projects: Project[] = [];

  constructor(
    private _projectService: ProjectService
  ) {}

  ngOnInit(): void {
    this._projectService.getProjects().subscribe(data => {
      let tableData: ProjectData | any = data;
      const responseData: any = JSON.parse(tableData);
      const results: Project[] = responseData.result;

      if(results) {
        this.projects = results;
      }
    });
  }
}
