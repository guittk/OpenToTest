import { Component } from '@angular/core';
import { DeveloperEvent } from '../models/developer-event.model';
import { DeveloperEventService } from '../services/developer-event-service';

@Component({
  selector: 'app-catalog',
  imports: [],
  templateUrl: './catalog.html',
  styleUrl: './catalog.css',
})

export class Catalog
{
  developerEvents: DeveloperEvent[] = [];
  
    constructor(private eventService: DeveloperEventService) {}
  
    ngOnInit(): void
    {
      this.eventService.getEvents().subscribe(events => {
        this.developerEvents = events;
      });
    }
  
    getFilteredEvents(searchText: string): DeveloperEvent[]
    {
      return this.developerEvents.filter(e =>
        e.title.includes(searchText) ||
        e.description.includes(searchText)
      );
    }
}