import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { MenuState } from '../../menu-state';
import { faArrowRightFromBracket, faBars, faChevronDown, faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-NavBar',
  standalone: false,
  templateUrl: './NavBar.component.html',
  styleUrls: ['./NavBar.component.scss']
})
export class NavBarComponent implements OnInit {
  
  private router = inject(Router);
  private userService = inject(UserService);
  
  @Input() menuVisible = false;
  @Input() smallScreen = false;
  @Input() menuState!: MenuState;
  @Input() pageTitle = '';
  @Output() NavOpen = new EventEmitter();

  logoutIcon = faArrowRightFromBracket;
  menuIcon = faBars;
  mobileIcon = faEllipsis;
  downArrowIcon = faChevronDown;

  mobileMenuOn = false;

  MenuState = MenuState;

  currentUser = '';
  
  onNavOpen() {
    try {
      this.NavOpen.emit();
    } catch (ex) {
      console.log('Error opening menu', ex);
    }
  }
  
  ngOnInit() {
    try {
      this.currentUser = this.userService.getCurrentUserName()!;
    } catch (ex) {
      console.log('Error initialising nav bar', ex);
      
    }
  }

  onToggleMenuClick(){
    try {
      this.mobileMenuOn = !this.mobileMenuOn;      
    } catch (ex) {
      console.log('Error toggling menu', ex);
      
    }
  }

  onLogout() {
    try {
      console.log('Logged out');
      this.userService.logout();
      this.router.navigate(['auth/signin'])
    } catch (ex) {
      console.log('Error logging out', ex);
      
    }
  }
}
