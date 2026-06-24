import { DeveloperEventService } from '../services/developer-event-service';
import { DeveloperEvent } from '../models/developer-event.model';
import { AuthService } from '../services/auth-service';
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
  constructor(private router: Router, private authService: AuthService, private developerEventService: DeveloperEventService) { }

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

    // const duration = this.getInputValue('c-dur');
    // const gameVersion = this.getInputValue('c-ver');
    // const platform = this.getInputValue('c-plat');
    // const link = this.getInputValue('c-link');

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

  onCatalogButtonClick()
  {
    this.router.navigate(['catalog']);
  }

  getInputValue(id: string): string
  {
    const element = document.getElementById(id) as HTMLInputElement | null;
    return element?.value ?? '';
  }
}