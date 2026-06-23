import { Injectable } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})

export class AuthService
{
  private LOGGEDUSERKEY: string = 'LoggedUsers'
  private USERSKEY: string = 'Users'

  register(username: string, email: string, password: string) : boolean
  {
    if(username == '' || email == '' || password == '')
    {
      return false;
    }

    const user = this.findUser(username)
    if(user)
    {
      this.saveLoggedUser(user);
      return true;
    }

    const newUser: User = { username, email, password };  
    const allUsers = this.getAllUsers();
    allUsers.push(newUser);

    this.saveStorage(allUsers);
    this.saveLoggedUser(newUser);
    return true;
  }

  login(username: string, password: string) : boolean
  {
    const allUsers = this.getAllUsers();
    const user = allUsers.find(u => u.username == username && u.password == password);

    if(!user)
    {
      return false;
    }

    this.saveLoggedUser(user);
    return true;
  }

  getAllUsers(): User[]
  {
    return this.loadStorage();
  }

  findUser(username: string)
  {
    const users = this.getAllUsers();
    const user = users.find(u => u.username == username);
    return user;
  }

  isLogged()
  {
    return this.getLoggedUser() != null;
  }

  getLoggedUser() : User | null
  {
    return this.loadLoggedUser();
  }

//#region Local Storage

  loadLoggedUser()
  {
    return JSON.parse(localStorage.getItem(this.LOGGEDUSERKEY) || 'null');
  }

  saveLoggedUser(user: User)
  {
    localStorage.setItem(this.LOGGEDUSERKEY, JSON.stringify(user))
  }

  logout()
  {
    localStorage.removeItem(this.LOGGEDUSERKEY);
  }

  saveStorage(allUsers: User[])
  {
    localStorage.setItem(this.USERSKEY, JSON.stringify(allUsers));
  }

  loadStorage()
  {
    return JSON.parse(localStorage.getItem(this.USERSKEY) || '[]');
  }
  
  //#endregion
}