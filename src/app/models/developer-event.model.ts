export interface DeveloperEvent {
  id: number;
  title: string;
  description: string;
  dateTime: Date;
  location: string;
  category: string;
  maxSlots: number;
  image?: string;

  status: 'future' | 'ongoing' | 'finished';

  organizerId: string;
}