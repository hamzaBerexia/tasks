import { Component, OnInit } from '@angular/core';
import { Task } from 'src/app/models/task';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
})
export class TasksComponent implements OnInit {

  searchField=true;

  searchText="";

  editForm = false;

  formShow = false;

  myTask: Task = {
    label: '',
    completed: false,
  };

  tasks: Task[] = [];
  resultTasks: Task[] = [];

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.getTasks();
  }

  getTasks() {
    this.taskService.findAll().subscribe((tasks) => {this.tasks = tasks;this.resultTasks=tasks});
  }

  deleteTask(id: any) {
    this.taskService.delete(id).subscribe(() => {
      this.tasks = this.tasks.filter((task) => task.id != id);
    });
  }

  persistTask() {
    this.taskService.persist(this.myTask).subscribe((task) => {
      this.tasks = [task, ...this.tasks];
      this.resetMyTask();
      this.formShow = false;
      this.searchField=false;
      this.searchField=true;
    });
  }

  resetMyTask() {
    this.myTask = { label: '', completed: false };
  }

  toggleCompleted(task: Task) {
    this.taskService.completed(task.id, task.completed).subscribe(() => {
      task.completed = !task.completed;
    });
  }

  editTask(task: Task) {
    this.myTask = task;
    this.editForm = true;
    this.showForm();
    this.searchField=false;
  }

  showForm() {
    this.formShow = true;
    this.searchField=false;
    this.resultTasks=this.tasks;
  }

  updateTask() {
    this.taskService.update(this.myTask).subscribe(() => {
      this.resetMyTask;
      this.editForm = false;
      this.formShow = false;
      this.searchField=true;
    });
  }

  searchTasks(){
    this.resultTasks=this.tasks.filter((task)=>task.label.includes(this.searchText))
  }

  hideForm(){
    this.formShow=false;
    this.searchField=true
  }
}
