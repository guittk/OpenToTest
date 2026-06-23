import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Auth } from './auth/auth';
import { Catalog } from './catalog/catalog';
import { EventCreate } from './event-create/event-create';
import { EventDetail } from './event-detail/event-detail';

export const routes: Routes = [
    {path: '', component: Home },
    {path: 'auth', component: Auth },
    {path: 'catalog', component: Catalog },
    {path: 'event/create', component: EventCreate },
    {path: 'event/detail', component: EventDetail },
];