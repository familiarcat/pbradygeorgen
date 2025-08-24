export type Story = {
  id: string;
  title: string;
  description: string;
  assignee: string;
  status: 'NEW' | 'GROOMED' | 'PLANNED' | 'IN_PROGRESS' | 'COMPLETE';
};
