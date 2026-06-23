import { Component } from '@angular/core';
import { DeveloperEvent } from '../models/developer-event.model';
import { DeveloperEventService } from '../services/developer-event-service';
import { AuthService } from '../services/auth-service';

@Component({
  selector: 'app-catalog',
  imports: [],
  templateUrl: './catalog.html',
  styleUrl: './catalog.css',
})

export class Catalog
{
  myEvents: DeveloperEvent[] = [];
  otherEvents: DeveloperEvent[] = [];

  constructor(private developerEventService: DeveloperEventService, private authService: AuthService)
  {
    const myUser = this.authService.getLoggedUser();
    if (!myUser) return;

    this.myEvents = this.developerEventService.getMyEvents(myUser.username);
    this.otherEvents = this.developerEventService.getOtherEvents(myUser.username);
  }
}