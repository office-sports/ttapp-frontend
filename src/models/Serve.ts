interface ServeInterface {
  gameId: number;
  setNumber: number;
  firstGameServer: number;
  secondGameServer: number;
  currentSetFirstServer: number;
  currentSetSecondServer: number;
  currentServerId: number;
  numServes: number;
}

export class Serve implements ServeInterface {
  currentServerId: number;
  currentSetFirstServer: number;
  currentSetSecondServer: number;
  firstGameServer: number;
  gameId: number;
  numServes: number;
  secondGameServer: number;
  setNumber: number;

  public constructor(data: any) {
    this.gameId = data.game_id;
    this.setNumber = data.set_number;
    this.firstGameServer = data.first_game_server;
    this.secondGameServer = data.second_game_server;
    this.currentSetFirstServer = data.current_set_first_server;
    this.currentSetSecondServer = data.current_set_second_server;
    this.currentServerId = data.current_server_id;
    this.numServes = data.num_serves;
  }
}
