import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectCard } from './project-card';
import { Project } from '../../../Core/models/project.model';

const MOCK_PROJECT: Project = {
  id: 'p1',
  name: 'Test Project',
  description: 'A project used for testing',
  status: 'Active',
  memberIds: ['m1', 'm2'],
  dueDate: new Date('2030-01-01'),
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-01'),
};

describe('ProjectCard', () => {
  let component: ProjectCard;
  let fixture: ComponentFixture<ProjectCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectCard],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectCard);
    // Required inputs must be set before the first change detection pass.
    fixture.componentRef.setInput('project', MOCK_PROJECT);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the project name', () => {
    expect(fixture.nativeElement.querySelector('.project-name')?.textContent).toContain(
      'Test Project',
    );
  });
});
