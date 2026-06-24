export interface DeveloperEvent
{
  id: string;
  creatorUsername: string;

  title: string;
  description: string;
  dateTime: Date;
  category: string;
  maxSlots: number;

  participants: Participant[];
}

export interface Participant
{
  username: string;
}