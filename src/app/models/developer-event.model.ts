import { User } from "./user.model";

export interface DeveloperEvent
{
  _id: string;
  title: string;
  description: string;
  dateTime: Date;
  category: string;
  maxSlots: number;

  owner: User;
  participants: User[];
}

export interface CreateEventRequest
{
  title: string;
  description: string;
  dateTime: Date;
  category: string;
  maxSlots: number;
}