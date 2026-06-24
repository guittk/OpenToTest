import { User } from "./user.model";

export interface DeveloperEvent
{
  id: string;
  creatorUsername: string;

  title: string;
  description: string;
  dateTime: Date;
  category: string;
  maxSlots: number;

  participants: User[];
}