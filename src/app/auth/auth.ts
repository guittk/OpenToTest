import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';

@Component({
  selector: 'app-auth',
  imports: [],
  templateUrl: './auth.html',
  styleUrl: './auth.css',
})

export class Auth
{
  currentTab: 'Login' | 'Register' = "Register";

  constructor(private router: Router, private authService: AuthService, private route: ActivatedRoute)
  {
    this.route.queryParams.subscribe(params =>
    {
      const p = params['tab'];
      if(p == 'Register' || p == 'Login')
      {
        this.currentTab = params['tab'];
      }
    });
  }

  onLoginButtonClick()
  {
    this.setCurrentTab('Login');
    this.router.navigate(['/auth']);
  }

  onRegisterButtonClick()
  {
    this.setCurrentTab('Register');
    this.router.navigate(['/auth']);
  }

  setCurrentTab(tab: 'Login' | 'Register')
  {
    this.currentTab = tab;
  }

  onHomeButtonClick()
  {
    this.router.navigate(['']);
  }

  onTryDoLogin()
  {    
    const username = this.getInputValue('li-usr');
    const password = this.getInputValue('li-pw');
    const isSuccess = this.authService.login(username, password);

    if(!isSuccess)
    {
      this.showMessage('li-err', true);
      return;
    }

    this.showMessage('li-err', false);
    this.router.navigate(['/catalog']);  
  }

  onTryDoRegister()
  {    
    const username = this.getInputValue('reg-usr');
    const email = this.getInputValue('reg-email');
    const password = this.getInputValue('reg-pw');
    const isSuccess = this.authService.register(username, email, password);

    if(!isSuccess)
    {
      this.showMessage('li-err', true);
      return;
    }

    this.showMessage('li-err', false);
    this.router.navigate(['/catalog']);  
  }

  getInputValue(id: string): string
  {
    const element = document.getElementById(id) as HTMLInputElement | null;
    return element?.value ?? '';
  }

  showMessage(id: string, state: boolean)
  {
    const element = document.getElementById(id);

    if(element)
    {
      element.style.display = state ? 'block' : 'none';
    }
  }
}