import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileSettings, SettingsUser } from './profile-settings';

const MOCK_USER: SettingsUser = {
  name: 'Aysha',
  email: 'aysha@taskflow.dev',
  role: 'Frontend Developer',
  initial: 'A',
};

describe('ProfileSettings', () => {
  let component: ProfileSettings;
  let fixture: ComponentFixture<ProfileSettings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileSettings],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileSettings);
    // Required inputs must be set before the first change detection pass.
    fixture.componentRef.setInput('user', MOCK_USER);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the user name and email', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('#ps-name')).toBeTruthy();
    expect((el.querySelector('#ps-email') as HTMLInputElement)?.value).toBe('aysha@taskflow.dev');
  });
});
