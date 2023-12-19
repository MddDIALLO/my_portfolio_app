import { Component } from '@angular/core';
import { Rep } from '../models/response.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  showPdfViewer: boolean = false;
  buttonText = 'Visualiser mon CV';
  connectedUsername = '';

  togglePdfViewer() {
    this.showPdfViewer = !this.showPdfViewer;
    this.buttonText = this.showPdfViewer ? 'Fermer' : 'Visualiser mon CV';
  }

  ngOnInit(): void {
    let tokenData: string | null = localStorage.getItem('token');

    if (tokenData) {
      const parsedTokenData: Rep | null = JSON.parse(tokenData);

      if(parsedTokenData && parsedTokenData.connectedUser.username) {
        this.connectedUsername = parsedTokenData?.connectedUser.username;
      }
    }
  }
}
