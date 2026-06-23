import { DeveloperEvent } from '../models/developer-event.model';
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})

export class DeveloperEventService
{
  private EVENTSKEY: string = "EventsKey";

  getMyEvents(myUsername: string) : DeveloperEvent[]
  {
    const allEvents = this.getAllEvents();
    return allEvents.filter(e => e.organizerId === myUsername);
  }

   getOtherEvents(myUsername: string) : DeveloperEvent[]
  {
    const allEvents = this.getAllEvents();
    return allEvents.filter(e => e.organizerId !== myUsername);
  }
  
  getAllEvents() : DeveloperEvent[]
  {
    return this.loadStorage();
  }

  createEvent(newEvent: DeveloperEvent)
  {
    const event = this.findEvent(newEvent.title);

    if(event)
    {
      return false;
    }

    const allEvents = this.getAllEvents();
    allEvents.push(newEvent);

    this.saveStorage(allEvents);
    return true;
  }

  findEvent(title: string)
  {
    const allEvents = this.getAllEvents();
    return allEvents.find(e => e.title == title) ?? null;
  }

  deleteEvent(title: string)
  {
    const allEvents = this.getAllEvents();
    const foundEvent = this.findEvent(title);

    if(!foundEvent)
    {
      return false;
    }
    
    const newEvents = allEvents.filter(e => e.title !== title);

    if (newEvents.length === allEvents.length)
    {
      return false;
    }

    this.saveStorage(newEvents);
    return true;
  }

  saveStorage(allEvents: DeveloperEvent[])
  {
    localStorage.setItem(this.EVENTSKEY, JSON.stringify(allEvents));
  }

  loadStorage()
  {
    return JSON.parse(localStorage.getItem(this.EVENTSKEY) || '[]');
  }
}

// export class DeveloperEventService
// {
//   private http = inject(HttpClient);
//   private base = 'http://localhost:3000/events';

//   getEvents(): Observable<DeveloperEvent[]>
//   {
//     return this.http.get<DeveloperEvent[]>(this.base)
//   }

//   createEvent(event: DeveloperEvent): Observable<DeveloperEvent>
//   {
//     return this.http.post<DeveloperEvent>(this.base, event);
//   }

//   findEvent(id: string): Observable<DeveloperEvent>
//   {
//     return this.http.get<DeveloperEvent>(`${this.base}/${id}`);
//   }

//   updateEvent(id: string, event: Partial<DeveloperEvent>): Observable<DeveloperEvent>
//   {
//     return this.http.patch<DeveloperEvent>(`${this.base}/${id}`, event);
//   }

//   deleteEvent(id: string)
//   {
//     return this.http.delete(`${this.base}/${id}`);
//   }
// }