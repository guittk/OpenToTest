import { CreateEventRequest, DeveloperEvent } from '../models/developer-event.model';
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthService } from './auth-service';

@Injectable({
  providedIn: 'root',
})

export class DeveloperEventService
{
  private port = "8080";
  private http = inject(HttpClient);
  private route = `http://localhost:${this.port}`;

  private allEvents: DeveloperEvent[] = [];

  constructor(private authService: AuthService)
  {
    this.getAllEvents().subscribe();
  }

  // EVENTS //
  getAllEvents(): Observable<DeveloperEvent[]>
  {
    return this.http.get<DeveloperEvent[]>(`${this.route}/events`).pipe(tap(allEvents => this.allEvents = allEvents));
  }

  createEvent(event: CreateEventRequest): Observable<DeveloperEvent>
  {
    return this.http.post<DeveloperEvent>(`${this.route}/event`, event, this.getToken()).pipe(
      tap(createdEvent =>
      {
        this.getAllEvents().subscribe();
      })
    );
  }

  updateEvent(event: Partial<DeveloperEvent>): Observable<DeveloperEvent>
  {
    return this.http.patch<DeveloperEvent>(`${this.route}/event/${event._id}`, event, this.getToken()).pipe(
      tap(updatedEvent =>
      {
        this.getAllEvents().subscribe();
      })
    );
  }

  deleteEvent(eventId: string): Observable<void>
  {
    return this.http.delete<void>(`${this.route}/event/${eventId}`, this.getToken()).pipe(
      tap(() =>
      {
        this.getAllEvents().subscribe();
      })
    );
  }

  getToken()
  {
    const token =
    {
      headers:
      {
        Authorization: `Bearer ${this.authService.loadToken()}`
      }
    }

    return token;
  }

  // LOCAL //
  getLocalMyEventById(eventId: string): DeveloperEvent | null
  {
    return this.allEvents.find(e => e._id === eventId) ?? null;
  }
  
  getLocalMyEvents(): DeveloperEvent[]
  {
    const userId = this.authService.getMyUser()?._id;
    return this.allEvents.filter(e => e.owner._id === userId);
  }
  
  getLocalJoinedEvents(): DeveloperEvent[]
  {
    const userId = this.authService.getMyUser()?._id;
    return this.allEvents.filter(e => e.participants.find(p => p._id === userId))
  }

  getLocalOtherEvents(filterByName: string, filterByCategory: string): DeveloperEvent[]
  {
    const userId = this.authService.getMyUser()?._id;
    const otherEvents = this.allEvents.filter(e => e.owner._id !== userId);
    let otherEventsFiltered = otherEvents;

    const searchText = filterByName.trim().toLowerCase();

    if(searchText !== '')
    {
      otherEventsFiltered = otherEventsFiltered.filter(e => e.title.toLowerCase().includes(searchText));
    }

    if(filterByCategory !== '')
    {
      otherEventsFiltered = otherEventsFiltered.filter(e => e.category === filterByCategory);
    }

    return otherEventsFiltered;
  }

  findLocalAnyEventById(eventId: string)
  {
    return this.allEvents.find(e => e._id === eventId);
  }

  isLocalJoining(userId: string) : boolean
  {
    return this.allEvents.find(x => x.participants.find(y => y._id === userId)) != null;
  }

  addParticipant(eventId: string)
  {
    const event = this.findLocalAnyEventById(eventId);

    if(!event)
    {
      return;
    }

    const myUser = this.authService.getMyUser();

    if(!myUser)
    {
      return;
    }

    event.participants.push(myUser);

    this.updateEvent(event).subscribe({
      next: (event) =>
      {
        console.log(`Participante adicionado com sucesso`);
      },
      error: (err) =>
      {
        console.log(`Erro ao adicionar participante: ${err.error.message}`);
      }
    });
  }

  removeParticipant(eventId: string)
  {
    const event = this.findLocalAnyEventById(eventId);

    if(!event)
    {
      return;
    }

    const myUser = this.authService.getMyUser();

    if(!myUser)
    {
      return;
    }

    event.participants = event.participants.filter(p => p._id !== myUser._id);

    this.updateEvent(event).subscribe({
      next: (event) =>
      {
        console.log(`Participante adicionado com sucesso`);
      },
      error: (err) =>
      {
        console.log(`Erro ao adicionar participante: ${err.error.message}`);
      }
    });
  }
}


// export class DeveloperEventService_BACKUP
// {
//   private EVENTSKEY: string = "EventsKey";

//   getMyEvents(myUsername: string) : DeveloperEvent[]
//   {
//     return this.getAllEvents().filter(e => e.creatorUsername === myUsername);
//   }

//   getOtherEvents(myUsername: string) : DeveloperEvent[]
//   {
//     return this.getAllEvents().filter(e => e.creatorUsername !== myUsername);
//   }
  
//   getAllEvents() : DeveloperEvent[]
//   {
//     return this.loadStorage();
//   }

//   createEvent(newEvent: DeveloperEvent)
//   {
//     const event = this.findEventByTitle(newEvent.title);

//     if(event)
//     {
//       console.log("Evento já existe!");
//       return false;
//     }

//     const allEvents = this.getAllEvents();
//     allEvents.push(newEvent);

//     this.saveStorage(allEvents);
//     return true;
//   }

//   findEventByTitle(title: string)
//   {
//     return this.getAllEvents().find(e => e.title == title) ?? null;
//   }

//   findEventById(id: string)
//   {
//     return this.getAllEvents().find(e => e.id == id) ?? null;
//   }

//   addParticipant(user: User, event: DeveloperEvent)
//   {
//     event.participants.push(user);

//     this.updateEvent(event);
//     return true;
//   }

//   removeParticipant(userId: string, event: DeveloperEvent)
//   {
//     event.participants = event.participants.filter(p => p.id !== userId);

//     this.updateEvent(event);
//     return true;
//   }

//   updateEvent(event: DeveloperEvent)
//   {
//     const allEvents = this.getAllEvents();
//     const newEvents = allEvents.filter(e => e.id !== event.id);
//     newEvents.push(event);

//     this.saveStorage(newEvents);
//     return true;
//   }

//   deleteEvent(eventId: string)
//   {
//     const allEvents = this.getAllEvents();
//     const newEvents = allEvents.filter(e => e.id !== eventId);

//     this.saveStorage(newEvents);
//     return true;
//   }

//   saveStorage(allEvents: DeveloperEvent[])
//   {
//     localStorage.setItem(this.EVENTSKEY, JSON.stringify(allEvents));
//   }

//   loadStorage()
//   {
//     return JSON.parse(localStorage.getItem(this.EVENTSKEY) || '[]');
//   }

//   isJoining(userId: string) : boolean
//   {
//     return this.getAllEvents().find(x => x.participants.find(y => y.id === userId)) != null;
//   }
// }