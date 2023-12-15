import { Component } from '@angular/core';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss'
})
export class ServicesComponent {
  public services: any[] = [
    {
      title: 'Web Development Services',
      description: 'My web development services include:',
      details: ['Front-end Development', 'Back-end Development', 'Responsive Design']
    },
    {
      title: 'Data Management Services',
      description: 'My data management services encompass:',
      details: ['Data Analysis', 'Database Management', 'Data Warehousing']
    }
  ];
}
