import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/services/Alert.service';
import { AlertSeverity } from 'src/app/utilities/Alert';

@Component({
  selector: 'app-NotFound',
  standalone: true,
  templateUrl: './NotFound.component.html',
  styleUrls: ['./NotFound.component.scss']
})
export class NotFoundComponent implements OnInit {

  private router = inject(Router);
  private alertService = inject(AlertService);
  
  constructor() { }

  ngOnInit() {
  }

  goToHome(): void {
    try {
      this.router.navigate(['/fkmgmt/home']);
    } catch (ex) {
      console.log('Error in Go to Home button click', ex);
      this.alertService.show(AlertSeverity.eError, 'Error navigating to home');
      
    }
  }
}
