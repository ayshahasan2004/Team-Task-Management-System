import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MemberCard } from './member-card';
import { Member } from '../../../Core/models/member.model';

const MOCK_MEMBER: Member = {
  id: 'm1',
  name: 'Aysha',
  initial: 'A',
  role: 'Frontend Developer',
  email: 'aysha@taskflow.dev',
  projectsCount: 3,
  status: 'Online',
};

describe('MemberCard', () => {
  let component: MemberCard;
  let fixture: ComponentFixture<MemberCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemberCard],
    }).compileComponents();

    fixture = TestBed.createComponent(MemberCard);
    // Required inputs must be set before the first change detection pass.
    fixture.componentRef.setInput('member', MOCK_MEMBER);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the member name', () => {
    expect(fixture.nativeElement.querySelector('.member-name')?.textContent).toContain('Aysha');
  });
});
