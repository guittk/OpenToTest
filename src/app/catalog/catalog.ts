import { DeveloperEventService } from '../services/developer-event-service';
import { DeveloperEvent } from '../models/developer-event.model';
import { EventCategories } from '../constants/categories';
import { AuthService } from '../services/auth-service';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-catalog',
  imports: [DatePipe, FormsModule],
  templateUrl: './catalog.html',
  styleUrl: './catalog.css',
})

export class Catalog
{
  selectedCategory: string = '';
  searchText: string = '';

  myEvents: DeveloperEvent[] = [];
  otherEvents: DeveloperEvent[] = [];
  myJoinedEvents: DeveloperEvent[] = [];

  eventCategories = EventCategories;

  constructor(private developerEventService: DeveloperEventService, private authService: AuthService, private router: Router)
  {
    this.refreshEvents();
  }

  onHomeButtonClick()
  {
    this.router.navigate(['']);
  }

  onCreateEventButtonClick()
  {
    this.router.navigate(['event/create']);
  }

  onEventButtonClick(event: DeveloperEvent)
  {
    this.router.navigate(['event/detail'], { queryParams: { eventId: event._id } });
  }

  onChangeFilter()
  {
    this.refreshEvents();
  }

  refreshEvents()
  {
    if (!this.authService.isLogged())
    {
      this.router.navigate(['/']);
      return;
    }

    this.myEvents = this.developerEventService.getLocalMyEvents();
    this.myJoinedEvents = this.developerEventService.getLocalJoinedEvents();
    this.otherEvents = this.developerEventService.getLocalOtherEvents(this.searchText, this.selectedCategory);

    console.log({
      myEvents: this.myEvents,
      myJoinedEvents : this.myJoinedEvents,
      otherEvents: this.otherEvents
    });
  }
}