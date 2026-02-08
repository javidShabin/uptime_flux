export interface InvitationInput {
  projectId: string;
  email: string;
  role: "ADMIN" | "MEMBER" | "VIEWER";
  invitedBy: string;
}