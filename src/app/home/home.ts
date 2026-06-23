import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth-service';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
})

export class Home
{  
  constructor(private router: Router, private authService: AuthService) { }

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