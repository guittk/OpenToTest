import { DeveloperEventService } from '../services/developer-event-service';
import { DeveloperEvent } from '../models/developer-event.model';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';
import { User } from '../models/user.model';
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
  myUser: User | null = null;
  role: 'Owner' | 'User' = 'User';
  isJoining: boolean = true;

  constructor(private route: ActivatedRoute, private developerEventService: DeveloperEventService, private router: Router, private authService: AuthService)
  {    
    this.route.queryParams.subscribe(params =>
    {
      this.myUser = authService.getLoggedUser();

      if(!this.myUser)
      {
        this.router.navigate(['']);
        return;
      }

      const eventId = params['eventId'];
      const developerEvent = developerEventService.findEventById(eventId);
    
      if(!developerEvent)
      {
        console.log('Evento não encontrado');
        this.router.navigate(['catalog']);
        return;
      }

      this.developerEvent = developerEvent;
      
      const isOwner = this.myUser.username === developerEvent.creatorUsername;
      this.role = isOwner ? 'Owner' : 'User';

      this.refreshIsJoining();
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

  onDeleteButtonClick()
  {
    const success = this.developerEventService.deleteEvent(this.developerEvent.id);

    if(!success)return;

    this.router.navigate(['catalog']);
  }

  onJoinButtonClick()
  {
    if(!this.myUser) return;

    if(this.developerEvent.participants.length >= this.developerEvent.maxSlots) return;

    if(this.developerEventService.isJoining(this.myUser.id)) return;

    this.developerEventService.addParticipant(this.myUser, this.developerEvent);

    this.refreshIsJoining();
  }

  onCancelButtonClick()
  {
    if(!this.myUser) return;

    this.developerEventService.removeParticipant(this.myUser.id, this.developerEvent);

    this.refreshIsJoining();
  }

  refreshIsJoining()
  {
    if(!this.myUser)
    {
      this.router.navigate(['']);
      return;
    }

    this.isJoining = this.developerEventService.isJoining(this.myUser.id);
  }
}