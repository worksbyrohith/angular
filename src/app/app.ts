import { Component, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

export interface Task {
  id: number;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  createdAt: Date;
  category: string;
}

@Component({
  selector: 'app-root',
  imports: [FormsModule, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  newTaskTitle = signal('');
  newTaskDesc = signal('');
  newTaskPriority = signal<'low' | 'medium' | 'high'>('medium');
  newTaskCategory = signal('Work');
  showForm = signal(false);
  activeFilter = signal<'all' | 'active' | 'completed'>('all');
  searchQuery = signal('');

  tasks = signal<Task[]>([
    { id: 1, title: 'Design Dashboard UI', description: 'Create wireframes and prototypes for the new dashboard', priority: 'high', completed: true, createdAt: new Date('2024-03-01'), category: 'Design' },
    { id: 2, title: 'Implement Auth Module', description: 'Add JWT-based authentication and route guards', priority: 'high', completed: false, createdAt: new Date('2024-03-05'), category: 'Dev' },
    { id: 3, title: 'Write Unit Tests', description: 'Cover all service methods with Jest unit tests', priority: 'medium', completed: false, createdAt: new Date('2024-03-07'), category: 'Dev' },
    { id: 4, title: 'Update Documentation', description: 'Revise API docs for v2 endpoints', priority: 'low', completed: false, createdAt: new Date('2024-03-09'), category: 'Docs' },
    { id: 5, title: 'Performance Audit', description: 'Use Lighthouse to identify and fix bottlenecks', priority: 'medium', completed: true, createdAt: new Date('2024-03-10'), category: 'Work' },
  ]);

  categories = ['Work', 'Dev', 'Design', 'Docs', 'Personal'];

  filteredTasks = computed(() => {
    let list = this.tasks();
    const q = this.searchQuery().toLowerCase();
    if (q) list = list.filter(t => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q));
    if (this.activeFilter() === 'active') list = list.filter(t => !t.completed);
    if (this.activeFilter() === 'completed') list = list.filter(t => t.completed);
    return list;
  });

  totalTasks = computed(() => this.tasks().length);
  completedTasks = computed(() => this.tasks().filter(t => t.completed).length);
  progressPercent = computed(() => this.totalTasks() > 0 ? Math.round((this.completedTasks() / this.totalTasks()) * 100) : 0);
  highPriority = computed(() => this.tasks().filter(t => t.priority === 'high' && !t.completed).length);

  toggleTask(id: number) {
    this.tasks.update(tasks => tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  }

  deleteTask(id: number) {
    this.tasks.update(tasks => tasks.filter(t => t.id !== id));
  }

  addTask() {
    const title = this.newTaskTitle().trim();
    if (!title) return;
    const task: Task = {
      id: Date.now(),
      title,
      description: this.newTaskDesc(),
      priority: this.newTaskPriority(),
      completed: false,
      createdAt: new Date(),
      category: this.newTaskCategory()
    };
    this.tasks.update(tasks => [task, ...tasks]);
    this.newTaskTitle.set('');
    this.newTaskDesc.set('');
    this.newTaskPriority.set('medium');
    this.showForm.set(false);
  }

  setFilter(f: 'all' | 'active' | 'completed') {
    this.activeFilter.set(f);
  }

  trackById(index: number, task: Task) {
    return task.id;
  }
}
