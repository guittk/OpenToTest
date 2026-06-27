import { RegisterRequest, RegisterResponse } from '../models/register.model';
import { LoginRequest, LoginResponse } from '../models/login.model';
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class AuthService
{
  private port = "8080";
  private http = inject(HttpClient);
  private route = `http://localhost:${this.port}`;

  // AUTH //
  register(username: string, email: string, password: string): Observable<RegisterResponse>
  {
    const registerRequest: RegisterRequest = {
      username: username,
      email : email,
      password: password
    };

    return this.http.post<RegisterResponse>(`${this.route}/register`, registerRequest);
  }

  login(username: string, password: string): Observable<LoginResponse>
  {
    const loginRequest : LoginRequest = {
      username : username,
      password: password
    };

    return this.http.post<LoginResponse>(`${this.route}/login`, loginRequest).pipe(
      tap(response =>
      {
        this.saveToken(response.token);
        this.saveUser(response.user);
      })
    );
  }

  isLogged()
  {
    return this.loadToken() !== '';
  }

  logout()
  {
    this.saveToken(null);
    this.saveUser(null);
  }

  getMyUser() : User | null
  {
    return this.loadUser();
  }

  // LOCAL STORAGE //
  saveToken(token: string | null): void
  {
    if(!token)
    {
      localStorage.removeItem("tokenKey");
      return;
    }

    localStorage.setItem("tokenKey", token);
  }

  loadToken(): string
  {
    return localStorage.getItem("tokenKey") ?? '';
  }

  saveUser(user: User | null): void
  {
    if(!user)
    {
      localStorage.removeItem("userKey");
      return;
    }

    localStorage.setItem("userKey", JSON.stringify(user));
  }

  loadUser(): User | null
  {
    const user = localStorage.getItem("userKey");
    return user ? JSON.parse(user) : null;
  }
}




// export class AuthService_BACKUP
// {
//   private LOGGEDUSERKEY: string = 'LoggedUsers'
//   private USERSKEY: string = 'Users'

//   register(username: string, email: string, password: string) : boolean
//   {
//     if(username == '' || email == '' || password == '')
//     {
//       return false;
//     }

//     const user = this.findUser(username)
//     if(user)
//     {
//       this.saveLoggedUser(user);
//       return true;
//     }

//     const newUser: User =
//     {
//       id: crypto.randomUUID(),
//       username: username,
//       password: password,
//       email: email
//     };  
//     const allUsers = this.getAllUsers();
//     allUsers.push(newUser);

//     this.saveStorage(allUsers);
//     this.saveLoggedUser(newUser);
//     return true;
//   }

//   login(username: string, password: string) : boolean
//   {
//     const allUsers = this.getAllUsers();
//     const user = allUsers.find(u => u.username == username && u.password == password);

//     if(!user)
//     {
//       return false;
//     }

//     this.saveLoggedUser(user);
//     return true;
//   }

//   getAllUsers(): User[]
//   {
//     return this.loadStorage();
//   }

//   findUser(username: string)
//   {
//     const users = this.getAllUsers();
//     const user = users.find(u => u.username == username);
//     return user;
//   }

//   isLogged()
//   {
//     return this.getLoggedUser() != null;
//   }

//   getLoggedUser() : User | null
//   {
//     return this.loadLoggedUser();
//   }

// //#region Local Storage

//   loadLoggedUser()
//   {
//     return JSON.parse(localStorage.getItem(this.LOGGEDUSERKEY) || 'null');
//   }

//   saveLoggedUser(user: User)
//   {
//     localStorage.setItem(this.LOGGEDUSERKEY, JSON.stringify(user))
//   }

//   logout()
//   {
//     localStorage.removeItem(this.LOGGEDUSERKEY);
//   }

//   saveStorage(allUsers: User[])
//   {
//     localStorage.setItem(this.USERSKEY, JSON.stringify(allUsers));
//   }

//   loadStorage()
//   {
//     return JSON.parse(localStorage.getItem(this.USERSKEY) || '[]');
//   }
  
//   //#endregion
// }
