import { TableService } from './table.service';
import { TicketService } from '../ticket/ticket.service';
import { Component, OnInit } from '@angular/core';
import { ExtractedData, TicketDisplayInfo } from './table.model';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
})
export class TableComponent implements OnInit {
  extractedData: ExtractedData[] = [];
  league: string[] = [];
  ticketDisplayInfo: TicketDisplayInfo[] = [];
  ticketInput: HTMLInputElement;

  constructor(
    private tableService: TableService,
    private ticketService: TicketService
  ) {}

  ngOnInit(): void {
    this.tableService.fetchData().subscribe();
    this.extractedData = this.tableService.extractedData;
    this.league = this.tableService.league;

    this.ticketService.inputShared.subscribe(
      (input) => (this.ticketInput = input)
    );
  }

  getInfo(event: MouseEvent): void {
    const element = event.currentTarget as HTMLDivElement;
    const odds = element.textContent;

    const eventInfo = element.parentElement.firstChild.textContent;
    const teamsInfo = eventInfo.split('⚽')[0];
    const timeInfo = eventInfo.split('⚽')[1];

    this.ticketDisplayInfo.push(
      new TicketDisplayInfo(teamsInfo, timeInfo, odds)
    );

    const filteredData = this.filterTicketData(teamsInfo, odds);
    this.ticketDisplayInfo = filteredData;

    this.tableService.dataSelected.emit(filteredData);
    this.closeTicketFromTable(element, teamsInfo);
    this.setCellColor(element);
    this.resetInput();
  }

  filterTicketData(clickedTeams: string, newOdds: string): TicketDisplayInfo[] {
    for (const obj of this.ticketDisplayInfo) {
      if (obj.teamsInfo === clickedTeams) {
        obj.odds = newOdds;
      }
    }

    return [
      ...new Set(
        this.ticketDisplayInfo.map((object) => JSON.stringify(object))
      ),
    ].map((object) => JSON.parse(object));
  }

  closeTicketFromTable(elem: HTMLDivElement, teamsInfo: string): void {
    const table = document.querySelector('table');
    const rows = Array.from(table.rows);

    for (const row of rows) {
      const tds = Array.from(row.children);

      for (const td of tds) {
        const clickedTeams = td.parentElement.firstChild.firstChild.textContent
          .slice(0, -2)
          .trim();
        if (
          td.classList.contains('red') &&
          elem.classList.contains('red') &&
          clickedTeams === teamsInfo.trim()
        ) {
          this.ticketDisplayInfo.splice(
            this.ticketDisplayInfo.findIndex(
              (obj) => obj.teamsInfo === teamsInfo
            ),
            1
          );
        }
      }
    }
  }

  setCellColor(elem: HTMLDivElement): void {
    const table = document.querySelector('table');
    const rows = Array.from(table.rows);

    for (const row of rows) {
      const tds = Array.from(row.children);
      const selected = row.getElementsByClassName('red');
      const arrSelected = Array.from(selected);

      for (const td of tds) {
        if (arrSelected.length > 1) {
          td.classList.remove('red');
          elem.classList.add('red');
        } else {
          elem.classList.toggle('red');
        }
      }
    }
  }

  resetInput(): string {
    if (!this.ticketDisplayInfo.length) {
      return this.ticketInput ? (this.ticketInput.value = '') : null;
    }
  }
}
