import { inject, Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AlertSeverity, CAlert } from '../utilities/Alert';
import { CommonFunctions } from '../utilities/CommonFunctions';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  
  private messageService = inject(MessageService);

  constructor() { }

  show(severity: AlertSeverity, msg: string, dur: number=null) {

    const duration = dur??CAlert.getDefaultDuration(severity);
    this.messageService.add({
      severity: CAlert.getSeverityText(severity),
      life: duration,
      detail: msg,
    });
  }

  closeAll() {
    this.messageService.clear();
  }

}
