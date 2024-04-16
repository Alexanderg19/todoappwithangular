import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-labs',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './labs.component.html',
  styleUrl: './labs.component.css'
})
export class LabsComponent {
  welcome = 'Hola!';
  tasks = signal([
    'Instalar Angular',
    'Crear proyecto',
    'Correro proyecto'
  ]);
  name = signal('Alexander');
  age = 26
  disabled = true
  img = 'https://w3schools.com/howto/img_avatar.png'

  person = signal({
    name: 'alexander',
    age: 20,
    avatar: 'https://w3schools.com/howto/img_avatar.png'

  })

  colorCtrl = new FormControl();
  widthCtrl = new FormControl(50, {
    nonNullable: true,
  })

  nameCtrl = new FormControl('alexander', {
    nonNullable: true,
    validators: [
      Validators.required,
      Validators.minLength(3)
    ]
  })

  constructor() {
    this.colorCtrl.valueChanges.subscribe(value => {
      console.log(value);

    })
  }

  clickHandler() {
    alert('Hola')
  }
  valueInputChange = '';

  changeHandler(event: Event) {
    const input = event.target as HTMLInputElement
    this.valueInputChange = input.value
  }

  changeHandlerSignals(event: Event) {
    const input = event.target as HTMLInputElement
    const newValue = input.value
    this.name.set(newValue)
  }

  valueInputKeyDown = '';

  keydownHandler(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    this.valueInputKeyDown = input.value
    const newValue = input.value
    this.name.set(newValue)
  }

  initialValue = signal(0)

  increase() {
    this.initialValue.update((value) => value + 1 )
  }

  changeAge(event: Event) {
    const input = event.target as HTMLInputElement
    const newValue = input.value
    this.person.update((prevState) => {
      return {
        ...prevState,
        age: parseInt(newValue)
      }
    })
  }

  changeName(event: Event) {
    const input = event.target as HTMLInputElement
    const newValue = input.value
    this.person.update((prevState) => {
      return {
        ...prevState,
        name: newValue
      }
    })
  }

}
