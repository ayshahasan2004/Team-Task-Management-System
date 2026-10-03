import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskCard } from './task-card';
import { Task } from '../../../Core/models/task.model';

const MOCK_TASK: Task = {
  id: 't1',
  projectId: 'p1',
  title: 'Test Task',
  description: 'A task used for testing',
  status: 'Todo',
  priority: 'High',
  assigneeId: 'm1',
  dueDate: new Date('2030-01-01'),
  tags: [],
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-01'),
};

describe('TaskCard', () => {
  let component: TaskCard;
  let fixture: ComponentFixture<TaskCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskCard],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskCard);
    // Required inputs must be set before the first change detection pass.
    fixture.componentRef.setInput('task', MOCK_TASK);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the task title', () => {
    expect(fixture.nativeElement.querySelector('.task-title')?.textContent).toContain('Test Task');
  });
});
