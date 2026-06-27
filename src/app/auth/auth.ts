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

    this.sendLogin(username, password);
  }

  sendLogin(username: string, password: string)
  {
    this.authService.login(username, password).subscribe({
      next: (res) =>
      {
        console.log(`usuário ${res.user.username} logado com sucesso`);
        console.log(`token: ${res.token}`);

        this.showMessage('li-err', false);
        this.router.navigate(['/catalog']);
      },
      error: (err) =>
      {
        console.log(`erro ao fazer login: ${err.error.message}`);
        this.showMessage('li-err', true);
      }
    });
  }

  onTryDoRegister()
  {    
    const username = this.getInputValue('reg-usr');
    const email = this.getInputValue('reg-email');
    const password = this.getInputValue('reg-pw');

    this.authService.register(username, email, password).subscribe({
      next: (res) =>
      {
        console.log(`usuário ${res.user.username} criado com sucesso`);
        this.sendLogin(username, password);
      },
      error: (err) =>
      {
        console.log(`erro ao criar usuário: ${err.error.message}`);
        this.showMessage('li-err', true);
      }
    }); 
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