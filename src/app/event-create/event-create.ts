import { DeveloperEventService } from '../services/developer-event-service';
import { DeveloperEvent } from '../models/developer-event.model';
import { AuthService } from '../services/auth-service';
import { ActivatedRoute } from '@angular/router';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-event-create',
  imports: [],
  templateUrl: './event-create.html',
  styleUrl: './event-create.css',
})

export class EventCreate
{
  queryEvent: DeveloperEvent | null = null;

  constructor(private router: Router, private authService: AuthService, private developerEventService: DeveloperEventService, private activateRoute: ActivatedRoute)
  {
    this.activateRoute.queryParams.subscribe(params =>
    {
      const myUser = authService.getLoggedUser();
      console.log('myUser: ' + myUser?.username);

      if(!myUser)
      {
        console.log('Usuario não logado');
        this.router.navigate(['']);
        return;
      }

      const eventId = params['eventId'];

      if(!eventId)
      {
        console.log('Não há parametros, vida que segue');
        return;
      }

      const developerEvent = developerEventService.findEventById(eventId);
      console.log('developerEvent: ' + developerEvent?.creatorUsername);

      if(!developerEvent)
      {
        console.log('Evento não encontrado');
        this.router.navigate(['catalog']);
        return;
      }

      const isMyEvent = myUser.username == developerEvent.creatorUsername;
      console.log('isMyEvent: ' + isMyEvent);
      if(!isMyEvent)
      {
        console.log('Não é meu evento');
        this.router.navigate(['catalog']);
        return;
      }

      this.queryEvent = developerEvent;
    });
  }

  // Pq no construtor ele adicionar valor antes do HTML ser criado
  ngAfterViewInit()
  {
    if(this.queryEvent)
    {
      this.addValuesToForms(this.queryEvent);
    }
  }

  addValuesToForms(developerEvent: DeveloperEvent)
  {
    this.setInputValue('c-title', developerEvent.title);
      this.setInputValue('c-desc', developerEvent.description);
      this.setInputValue('c-slots', String(developerEvent.maxSlots));
      this.setInputValue('c-type', developerEvent.category);
      
      const date = new Date(developerEvent.dateTime);
      this.setInputValue('c-date', date.toISOString().split('T')[0]);

      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      this.setInputValue('c-time', `${hours}:${minutes}`);
  }

  onHomeButtonClick()
  {
    this.router.navigate(['']);
  }

  onCreateEventButtonClick()
  {
    const title = this.getInputValue('c-title');
    const description = this.getInputValue('c-desc');
    const dateTime = this.getInputValue('c-date');
    const startTime = this.getInputValue('c-time');
    const maxSlots = this.getInputValue('c-slots');
    const category = this.getInputValue('c-type');

    const creatorUser = this.authService.getLoggedUser();
    const creatorUsername = creatorUser ? creatorUser.username : 'Não encontrado';
    
    const newEvent: DeveloperEvent =
    {
      id: crypto.randomUUID(),
      creatorUsername: creatorUsername,
      title: title,
      description: description,
      dateTime: new Date(`${dateTime}T${startTime}`),
      category: category,
      maxSlots: Number(maxSlots),
      participants: []
    };

    const success = this.developerEventService.createEvent(newEvent);

    if(!success)
    {
      console.log("erro ao criar um novo evento")
    }

    this.router.navigate(['event/detail']);
  }

  onBackButtonClick()
  {
    if(this.queryEvent)
    {
      this.router.navigate(['event/detail'], { queryParams: { eventId: this.queryEvent.id } });
    }
    else
    {
      this.router.navigate(['catalog']);
    }
  }

  getInputValue(id: string): string
  {
    const element = document.getElementById(id) as HTMLInputElement | null;
    return element?.value ?? '';
  }

  setInputValue(id: string, value: string): void
  {
    const element = document.getElementById(id) as HTMLInputElement | null;
    if (element) element.value = value;
  }
}