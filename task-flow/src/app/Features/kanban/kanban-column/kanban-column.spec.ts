import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { KanbanColumn } from './kanban-column';
import { Task } from '../../../Core/models/task.model';

function makeTask(id: string, status: Task['status']): Task {
  return {
    id,
    projectId: 'p1',
    title: `Task ${id}`,
    description: '',
    status,
    priority: 'Medium',
    assigneeId: null,
    dueDate: null,
    tags: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

describe('KanbanColumn', () => {
  let component: KanbanColumn;
  let fixture: ComponentFixture<KanbanColumn>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KanbanColumn],
    }).compileComponents();

    fixture = TestBed.createComponent(KanbanColumn);
    fixture.componentRef.setInput('status', 'TODO');
    fixture.componentRef.setInput('tasks', [
      makeTask('t1', 'Todo'),
      makeTask('t2', 'Todo'),
    ]);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('emits the CDK drop event on drop', () => {
    const emitted: CdkDragDrop<Task[]>[] = [];
    component.taskDropped.subscribe(e => emitted.push(e));

    const sourceList = { data: [], id: 'IN_PROGRESS' };
    const container = { data: component.tasks(), id: 'TODO' };
    component.onDrop({
      previousIndex: 0,
      currentIndex: 1,
      item: { data: 't1' },
      previousContainer: sourceList,
      container,
    } as unknown as CdkDragDrop<Task[]>);

    expect(emitted.length).toBe(1);
    expect(emitted[0].previousContainer).toBe(sourceList);
  });

  it('reorders local data when dropping inside the same column', () => {
    const container = { data: component.tasks(), id: 'TODO' };
    const event = {
      previousIndex: 0,
      currentIndex: 1,
      item: { data: 't1' },
      previousContainer: container,
      container,
    } as unknown as CdkDragDrop<Task[]>;

    component.onDrop(event);

    expect(event.container.data[0].id).toBe('t2');
    expect(event.container.data[1].id).toBe('t1');
  });

  it('toggles dragOver on enter/leave', () => {
    expect(component.dragOver()).toBe(false);
    component.onDragEnter();
    expect(component.dragOver()).toBe(true);
    component.onDragLeave();
    expect(component.dragOver()).toBe(false);
  });
});
