export interface ApiData {
  locations: { id: string; name: string; leagues: Leagues[] };
}

export interface Leagues {
  eventDateGroups: EventDateGroup[];
}

export interface EventDateGroup {
  date: string;
  events: Event[];
}

export interface Event {
  id: string;
  fixture: Fixture;
  markets: Markets[];
}

export interface Fixture {
  startDate: string;
  participants: Participants;
}

export interface Markets {
  marketId: string;
  picks: Picks[];
}

export interface Participants {
  name: string;
  position: string;
}

export interface Picks {
  id: string;
  odds: number;
  order: number;
  selected: boolean;
}

export class ExtractedData {
  constructor(
    public participantOne: string,
    public participantTwo: string,
    public day: string,
    public time: string,
    public picks: any[]
  ) {}
}

export class TicketDisplayInfo {
  constructor(
    public teamsInfo: string,
    public timeInfo: string,
    public odds: string
  ) {}
}
