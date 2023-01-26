export class Tournament {
  finished: number;
  id: number;
  is_finished: boolean;
  is_playoffs: boolean;
  name: string;
  office_id: number;
  participants: number;
  phase: string;
  scheduled: number;
  start_time: string;

  constructor(
    finished: number,
    id: number,
    is_finished: boolean,
    is_playoffs: boolean,
    name: string,
    office_id: number,
    participants: number,
    phase: string,
    scheduled: number,
    start_time: string
  ) {
    this.office_id = office_id;
    this.phase = phase;
    this.finished = finished;
    this.id = id;
    this.is_playoffs = is_playoffs;
    this.is_finished = is_finished;
    this.name = name;
    this.participants = participants;
    this.scheduled = scheduled;
    this.start_time = start_time;
  }
}
