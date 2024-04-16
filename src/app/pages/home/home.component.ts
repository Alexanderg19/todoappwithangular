import { Component, Injector, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { type Task } from '../../models/task.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  tasks = signal<Task[]>([]);

  newTaskCtrl = new FormControl('',{
    nonNullable: true,
    validators: [
      Validators.required
    ]
  })


  filter = signal<'all' | 'pending' | 'completed'>('all')
  tasksByFilter = computed(() => {
    const filter = this.filter();
    const tasks = this.tasks();

    if(filter === 'pending') {
      return tasks.filter((task) => !task.completed)
    }

    if(filter === 'completed') {
      return tasks.filter((task) => task.completed)
    }

    return tasks;
  });

  injector = inject(Injector)

  ngOnInit() {
    const storage = localStorage.getItem('tasks');
    if(storage) {
      const tasks = JSON.parse(storage);
      this.tasks.set(tasks)
    }
    this.trackTask()
  }

  trackTask() {
    effect(() => {
      const tasks = this.tasks();
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }, {injector: this.injector})
  }

  changeHandler() {

    if(this.newTaskCtrl.valid && (this.newTaskCtrl.value.trim() != '')) {
      const value = this.newTaskCtrl.value
      this.addTask(value.trim())
      this.newTaskCtrl.setValue('')
    }

  }

  addTask(title: string) {
    const newTask = {
      id: Date.now(),
      title: title,
      completed: false
    }
    this.tasks.update((tasks) => [...tasks, newTask])
  }

  deleteTask(index: number) {
    this.tasks.update((tasks) => tasks.filter((tasks, position) => position != index))
  }

  updateTask(index: number) {
    this.tasks.update((tasks) =>{
      return tasks.map((task, position) => {
        if(position === index) {
          return {
            ...task,
            completed: !task.completed
          }
        }
        return task;
      })
    })
  }

  updateTasksEditingMode(index: number) {
    if(this.tasks()[index].completed) return;
    this.tasks.update((tasks) =>{
      return tasks.map((task, position) => {
        if(position === index) {
          return {
            ...task,
            editing: true
          }
        }
        return {
          ...task,
          editing: false
        };
      })
    })
  }

  updateTasksTitle(index: number, event: Event) {
    const input = event.target as HTMLInputElement;
    if(input.value.trim() === '') return;
    this.tasks.update((tasks) =>{
      return tasks.map((task, position) => {
        if(position === index) {
          return {
            ...task,
            title: input.value,
            editing: false
          }
        }
        return task;
      })
    })
  }

  changeFilter(filter: 'all' | 'pending' | 'completed') {
    this.filter.set(filter);
  }
}
