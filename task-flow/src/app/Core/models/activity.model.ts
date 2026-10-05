export interface Activity {
  id: string;
  memberId: string;
  memberName?: string | null;
  text: string;
  time: string;
  createdAt: Date;
}
