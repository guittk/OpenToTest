import { DeveloperEventService } from '../services/developer-event-service';
import { DeveloperEvent } from '../models/developer-event.model';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-event-detail',
  imports: [DatePipe],
  templateUrl: './event-detail.html',
  styleUrl: './event-detail.css',
})

export class EventDetail
{
  developerEvent!: DeveloperEvent;

  constructor(private route: ActivatedRoute, private developerEventService: DeveloperEventService, private router: Router)
  {
    this.route.queryParams.subscribe(params =>
    {
      const eventId = params['eventId'];

      const developerEvent = developerEventService.findEventById(eventId);
    
      if(!developerEvent)
      {
        console.log('Evento não encontrado');
        this.router.navigate(['catalog']);
        return;
      }

      this.developerEvent = developerEvent;
    });
  }

  onHomeButtonClick()
  {
    this.router.navigate(['']);
  }

  onCatalogButtonClick()
  {
    this.router.navigate(['catalog']);
  }
}