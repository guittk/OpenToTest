import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth-service';
import { User } from '../models/user.model';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
})

export class Home
{  
  myUser: User | null = null;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit()
  {
    this.myUser = this.authService.getMyUser();
  }

  onLoginButtonClick()
  {
    if(this.authService.isLogged())
    {
      this.router.navigate(['catalog']);
    }
    else
    {
      this.router.navigate(['/auth'], { queryParams: { tab: 'Login' } });
    }
  }

  onRegisterButtonClick()
  {
    if(this.authService.isLogged())
    {
      this.router.navigate(['catalog']);
    }
    else
    {
      this.router.navigate(['/auth'], { queryParams: { tab: 'Register' } });
    }
  }

  onCatalogButtonClick()
  {
    if(this.authService.isLogged())
    {
      this.router.navigate(['catalog']);
    }
    else
    {
      this.router.navigate(['/auth'], { queryParams: { tab: 'Login' } });
    }
  }

  onLogoutButtonClick()
  {
    this.authService.logout();
    this.router.navigate(['']);
  }

  isLogged(): boolean
  {
    return this.authService.isLogged();
  }
}