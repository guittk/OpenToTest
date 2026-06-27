import { CreateEventRequest, DeveloperEvent } from '../models/developer-event.model';
import { DeveloperEventService } from '../services/developer-event-service';
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
      const myUser = authService.getMyUser();
      console.log('myUser: ' + myUser?.username);

      if(!myUser)
      {
        console.log('Usuario não logado');
        this.router.navigate(['']);
        return;
      }

      const eventId = params['eventId'];
      console.log("Deveria estar recebendo parametros");
      console.log(params);
      console.log(eventId);


      if(!eventId)
      {
        console.log('Não há parametros, vida que segue');
        return;
      }

      const foundEvent = developerEventService.getLocalMyEventById(eventId);
      
      if(!foundEvent)
      {
        console.log('Evento não encontrado ou não é meu');
        this.router.navigate(['catalog']);
        return;
      }

      this.queryEvent = foundEvent;
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

    const myUser = this.authService.getMyUser();

    if(!myUser)
    {
      console.log("Não estou logado");
      return;
    }

    if(this.queryEvent)
    {
      const updateEvent = this.queryEvent;
      updateEvent.title = title,
      updateEvent.description = description,
      updateEvent.dateTime = new Date(`${dateTime}T${startTime}`),
      updateEvent.maxSlots = Number(maxSlots),
      updateEvent.category = category,

      this.updateEvent(updateEvent);
      return;
    }

    const newEvent : CreateEventRequest =
    {
      title: title,
      description: description,
      dateTime: new Date(`${dateTime}T${startTime}`),
      maxSlots: Number(maxSlots),
      category: category
    };

    this.createEvent(newEvent);
  }

  createEvent(newEvent: CreateEventRequest)
  {
    this.developerEventService.createEvent(newEvent).subscribe({
      next: (event) =>
      {
        this.router.navigate(['event/detail']);
      },
      error: (err) =>
      {
        console.log(`erro ao criar um novo evento: ${err.error.message}`);
      }
    });
  }

  updateEvent(newEvent: DeveloperEvent)
  {
    this.developerEventService.updateEvent(newEvent).subscribe({
      next: (event) =>
      {
        this.router.navigate(['event/detail']);
      },
      error: (err) =>
      {
        console.log(`erro ao editar um novo evento: ${err.error.message}`);
      }
    });
  }

  onBackButtonClick()
  {
    if(this.queryEvent)
    {
      this.router.navigate(['event/detail'], { queryParams: { eventId: this.queryEvent._id } });
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