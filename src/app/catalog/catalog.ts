import { DeveloperEventService } from '../services/developer-event-service';
import { DeveloperEvent } from '../models/developer-event.model';
import { AuthService } from '../services/auth-service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '../models/user.model';
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
  loggedUser: User | null = null;

  myEvents: DeveloperEvent[] = [];
  otherEvents: DeveloperEvent[] = [];

  constructor(private developerEventService: DeveloperEventService, private authService: AuthService, private router: Router)
  {
    this.loggedUser = this.authService.getLoggedUser();
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
    this.router.navigate(['event/detail'], { queryParams: { eventId: event.id } });
  }

  onChangeFilter()
  {
    this.refreshEvents();
  }

  refreshEvents()
  {
    if (!this.loggedUser)
    {
      this.router.navigate(['/']);
      return;
    }

    this.myEvents = this.developerEventService.getMyEvents(this.loggedUser.username);
    let otherEvents = this.developerEventService.getOtherEvents(this.loggedUser.username);

    if(this.selectedCategory != '')
    {
      otherEvents = otherEvents.filter(e => e.category == this.selectedCategory);
    }

    if(this.searchText != '')
    {
      otherEvents = otherEvents.filter(e => e.title.toLocaleLowerCase().includes(this.searchText.toLocaleLowerCase()));
    }

    this.otherEvents = otherEvents;
  }
}