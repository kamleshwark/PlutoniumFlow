import { Injectable } from '@angular/core';
import { CommonFunctions } from '../utilities/CommonFunctions';
import { isFuture} from 'date-fns'
import { CUser, CUserForAddEdit } from '../models/User';
import { BehaviorSubject } from 'rxjs';
import Enumerable from 'linq';
import { CGridColumnFilterOption } from '../models/GridColumnFilterOption';

@Injectable({
  providedIn: 'root'
})
export class UserService {


  private userData: any;
  private storageName = 'user';
  private storage = localStorage;
  private taskManagers: CUser[] = [];
  private taskParticipants: CUser[] = [];
  private projectManagers: CUser[] = [];
  private roles: string[] = [];
  private rolesColumnFilterOptions: CGridColumnFilterOption[] = [];

  private loginSuccessful = new BehaviorSubject<boolean>(false);
  loginObservable = this.loginSuccessful.asObservable();

  private newUserAdded = new BehaviorSubject<CUserForAddEdit>(null);
  newUserObservable = this.newUserAdded.asObservable();

  constructor() { }

  getCurrentUserName():string|undefined {
    if(this.userData){
      return this.userData.userName;
    } else {
      return undefined;
    }
  }

  getCurrentUserId():number|undefined {
    if(this.userData){
      return this.userData.userId;
    } else {
      return undefined;
    }
  }

  setUserFromStorage() {
    const data = this.storage.getItem(this.storageName);
    if (data) {
      this.userData = JSON.parse(data);
    } else {
      console.log('user data not found in storage');
    }
  }

  reportLogin(userData: any) {
    this.storage.setItem(this.storageName, JSON.stringify(userData));
    this.userData = userData;
    this.loginSuccessful.next(true);
  }

  logout() {
    this.storage.removeItem(this.storageName);
  }

  isTokenValid():boolean {
    let result = false;
    if(CommonFunctions.isValid(this.userData)) {
      if(!CommonFunctions.isStringNullOrEmpty(this.userData.token)) {
        const tokenExpiresOn = new Date(this.userData.tokenExpiresOn);
        if(isFuture(tokenExpiresOn)) {
          result = true;
        }
      }
    }
    return result;
  }

  getAuthToken(): string | undefined {
    if(!this.isTokenValid()) {
      this.setUserFromStorage();
    }
    if (CommonFunctions.isValid(this.userData)) {
      return this.userData.token;
    }

    return undefined;
  }

  
  
  private sortUsers(users: CUser[]): CUser[]{
    users = Enumerable.from(users)
      .orderBy(u => u.Username.toLowerCase())
      .toArray();

    return users;
  }

  getUserRoles(): string[] {
    return this.userData.roles;
  }

  isUserInRole(role: string): boolean {
    return (this.userData.roles as string[]).includes(role);
  }

  userRoleCount(): number {
    return (this.userData.roles as string[]).length;
  }

  getAllUserRoles(): string[] {
    return this.roles;
  }

  setAllUserRoles(roles: string[]): void{
    this.roles = roles;
    this.setRolesColumFilterOptions();
  }

  private setRolesColumFilterOptions() {
    this.rolesColumnFilterOptions = [];
    this.roles.forEach(role => {
      this.rolesColumnFilterOptions.push(new CGridColumnFilterOption(role, role, true));
    });
  }

  getRolesColumFilterOptions(): CGridColumnFilterOption[] {
    return this.rolesColumnFilterOptions;
  }

  reportNewUserAdded(newUser: CUserForAddEdit) {
    this.newUserAdded.next(newUser);
  }
}
