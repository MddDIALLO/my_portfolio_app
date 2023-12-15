import { Component } from '@angular/core';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {
  formData: any = {};

  submitForm() {
    const dataToSave = JSON.stringify(this.formData);
    console.log(dataToSave);
  }
}
