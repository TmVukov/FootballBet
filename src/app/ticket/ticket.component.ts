import { TicketDisplayInfo } from './../table/table.model';
import { TableService } from './../table/table.service';
import { TicketService } from '../ticket/ticket.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.css'],
})
export class TicketComponent implements OnInit {
  selectedData: TicketDisplayInfo[] = [];
  amount: number;

  constructor(private tableService: TableService, private ticketService: TicketService) {}

  ngOnInit(): void {
    this.tableService.dataSelected.subscribe((data: TicketDisplayInfo[]) => {
      this.selectedData = data;
    });
  }

  closeTicket(i: number, event: MouseEvent, input: HTMLInputElement): void {
    this.selectedData.splice(i, 1);

    const element = event.currentTarget as HTMLDivElement;
    const ticketTeams =
      element.firstElementChild.firstElementChild.textContent.trim();

    const table = document.querySelector('table');
    const rows = Array.from(table.rows);

    for (const row of rows) {
      const selected = row.getElementsByClassName('red');
      const arrSelected = Array.from(selected);

      for (const td of arrSelected) {
        const tableTeams = td.parentElement.firstChild.firstChild.textContent
          .slice(0, -2)
          .trim();

        if (tableTeams === ticketTeams) {
          td.classList.remove('red');
        }
      }
    }

    this.resetInput(input);
    this.ticketService.inputShared.next(input);
  }

  getTicketRate(): void {
    const oddsArray = [];

    for (const data of this.selectedData) {
      oddsArray.push(Number(data.odds));
    }

    if (oddsArray.length) {
      const result = oddsArray.reduce((acc, curr) => acc * curr);
      return oddsArray.length ? result.toFixed(2) : '0';
    }
  }

  getTicketGain(): number {
    const odds = this.getTicketRate();

    return this.amount * Number(odds);
  }

  resetInput(input: HTMLInputElement): void {
    if (!this.selectedData.length) {
      input.value = '';
    }
  }
}
