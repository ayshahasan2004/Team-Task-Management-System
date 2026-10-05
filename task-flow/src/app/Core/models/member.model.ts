export type MemberStatus = 'Online' | 'Offline';

export interface Member {
  id: string;
  name: string;
  initial: string;
  role: string;
  email: string;
  teamName?: string;
  projectsCount: number;
  status: MemberStatus;
}

export interface TeamGroup {
  id: string;
  name: string;
  members: Member[];
}