import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KanbanTask } from './kanban-task';
import { Task } from '../../../Core/models/task.model';

const MOCK_TASK: Task = {
  id: 't1',
  projectId: 'p1',
  title: 'Kanban Task',
  description: 'A task used for testing',
  status: 'In Progress',
  priority: 'Medium',
  assigneeId: 'm1',
  dueDate: new Date('2030-01-01'),
  tags: [],
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-01'),
};

describe('KanbanTask', () => {
  let component: KanbanTask;
  let fixture: ComponentFixture<KanbanTask>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KanbanTask],
    }).compileComponents();

    fixture = TestBed.createComponent(KanbanTask);
    // Required inputs must be set before the first change detection pass.
    fixture.componentRef.setInput('task', MOCK_TASK);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the task title', () => {
    expect(fixture.nativeElement.querySelector('.task-title')?.textContent).toContain(
      'Kanban Task',
    );
  });
});
