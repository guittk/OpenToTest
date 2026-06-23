import { DeveloperEvent } from '../models/developer-event.model';
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class DeveloperEventService
{
  private http = inject(HttpClient);
  private base = 'http://localhost:3000/events';

  getEvents(): Observable<DeveloperEvent[]>
  {
    return this.http.get<DeveloperEvent[]>(this.base)
  }

  createEvent(event: DeveloperEvent): Observable<DeveloperEvent>
  {
    console.log(event);
    return this.http.post<DeveloperEvent>(this.base, event);
  }

  findEvent(id: string): Observable<DeveloperEvent>
  {
    return this.http.get<DeveloperEvent>(`${this.base}/${id}`);
  }

  updateEvent(id: string, event: Partial<DeveloperEvent>): Observable<DeveloperEvent>
  {
    return this.http.patch<DeveloperEvent>(`${this.base}/${id}`, event);
  }

  deleteEvent(id: string)
  {
    return this.http.delete(`${this.base}/${id}`);
  }
}