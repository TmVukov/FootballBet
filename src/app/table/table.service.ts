import {
  ApiData,
  EventDateGroup,
  ExtractedData,
  Event,
  TicketDisplayInfo,
} from './table.model';
import { HttpClient } from '@angular/common/http';
import { Injectable, EventEmitter } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TableService {
  dataSelected = new EventEmitter<TicketDisplayInfo[]>();

  extractedData: ExtractedData[] = [];
  league: string[] = [];

  constructor(private http: HttpClient) {}

  fetchData(): Observable<void> {
    return this.http
      .get<ApiData>(
        'https://sportdataprovider.stage-volcano.com/api/public/prematch/SportEvents?SportId=1&LocationId=243&timezone=-120&clientType=MobileWebConsumer&lang=en'
      )
      .pipe(
        map((response) => {
          // console.log(response)
          const leagues = response.locations[0].leagues;

          const groups: EventDateGroup[] = [];

          for (const leagueItem of leagues) {
            if (leagueItem.id === '67') {
              this.league.push(leagueItem.name);
            }
            groups.push(leagueItem.eventDateGroups[0]);
          }

          for (const group of groups) {
            for (const event of group.events) {
              // console.log(event)
              this.getData(
                group,
                event,
                this.extractedData.sort((a, b) =>
                  a.day > b.day ? 1 : -1 && a.time > b.time ? 1 : -1
                )
              );
            }
          }
        })
      );
  }

  getData(group: EventDateGroup, event: Event, array: any): void {
    // const day = new Date(group.date).toLocaleString('en-US', {
    //   weekday: 'long',
    // });
    const day = new Date(group.date).toLocaleString('de-DE').slice(0, -10);
    const time = new Date(event.fixture.startDate)
      .toLocaleString('de-DE')
      .slice(-9, -3);

    const participantOne = event.fixture.participants[0].name;
    const participantTwo = event.fixture.participants[1].name;

    const picks = event.markets.reduce((acc, curr) => {
      if (curr.marketId === '1') {
        for (const key of curr.picks) {
          acc.push(key);
        }
      }
      return acc.sort((a, b) => a.order - b.order);
    }, []);

    array.push(
      new ExtractedData(participantOne, participantTwo, day, time, picks)
    );
  }
}
