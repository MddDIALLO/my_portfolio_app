import { Component } from '@angular/core';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {
  formData: any = {};

  submitForm() {
    // Save form data to a JSON file
    const dataToSave = JSON.stringify(this.formData);
    // Logic to save data to a JSON file (e.g., using Angular's HttpClient to post the data to a backend endpoint)
    // For demonstration purposes, you can log the data
    console.log(dataToSave);
  }
}
