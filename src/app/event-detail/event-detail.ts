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

  constructor(private activateRoute: ActivatedRoute, private developerEventService: DeveloperEventService, private router: Router, private authService: AuthService)
  {    
    this.activateRoute.queryParams.subscribe(params =>
    {
      this.myUser = authService.getMyUser();

      if(!this.myUser)
      {
        this.router.navigate(['']);
        return;
      }

      const eventId = params['eventId'];
      const developerEvent = developerEventService.findLocalAnyEventById(eventId);
    
      if(!developerEvent)
      {
        console.log('Evento não encontrado');
        this.router.navigate(['catalog']);
        return;
      }

      this.developerEvent = developerEvent;
      
      const isOwner = this.myUser._id === developerEvent.owner._id;
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

  onEditButtonClick()
  {
    if(!this.developerEvent)
    {
      console.log("O evento não está salvo");
      return;
    }

    console.log("--------------------");
    console.log(this.developerEvent);
    console.log(this.developerEvent._id);
    console.log("--------------------");

    this.router.navigate(
      ['event/create'],
      {
        queryParams: {
          eventId: this.developerEvent._id
        }
      }
    );

    console.log("Estou enviando parametros");
    this.router.navigate(['event/create'], { queryParams: { eventId: this.developerEvent._id } });
  }

  onDeleteButtonClick()
  {
    this.developerEventService.deleteEvent(this.developerEvent._id).subscribe({
      next: (event) =>
      {
        console.log(`Evento deletado com sucesso`);
        this.router.navigate(['catalog']);
      },
      error: (err) =>
      {
        console.log(`Erro ao excluir evento: ${err.error.message}`);
      }
    });;
  }

  onJoinButtonClick()
  {
    if(!this.myUser) return;

    if(this.developerEvent.participants.length >= this.developerEvent.maxSlots) return;

    if(this.developerEventService.isLocalJoining(this.myUser._id)) return;

    this.developerEventService.addParticipant(this.developerEvent._id);

    this.refreshIsJoining();
  }

  onCancelButtonClick()
  {
    if(!this.myUser) return;

    this.developerEventService.removeParticipant(this.developerEvent._id);

    this.refreshIsJoining();
  }

  refreshIsJoining()
  {
    if(!this.myUser)
    {
      this.router.navigate(['']);
      return;
    }

    this.isJoining = this.developerEventService.isLocalJoining(this.myUser._id);
  }
}