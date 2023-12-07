import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  showPdfViewer: boolean = false;
  buttonText = 'Visualiser mon CV';

  togglePdfViewer() {
    this.showPdfViewer = !this.showPdfViewer;
    this.buttonText = this.showPdfViewer ? 'Fermer' : 'Visualiser mon CV';
  }
}
