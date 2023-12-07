import { Component } from '@angular/core';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent {
  public projects: any[] = [
    {
      title: 'Project 1',
      description: 'Description for Project 1',
      technologies: ['HTML', 'CSS', 'JavaScript', 'Angular']
    },
    {
      title: 'Project 2',
      description: 'Description for Project 2',
      technologies: ['React', 'Node.js', 'MongoDB']
    },
    // Add more projects as needed...
  ];
}
