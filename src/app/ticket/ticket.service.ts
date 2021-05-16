import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TicketService {
  inputShared = new Subject<HTMLInputElement>();

  constructor() {}
}
