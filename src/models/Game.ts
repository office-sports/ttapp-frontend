export class Game {
  id: number;
  homePlayerId: number;
  awayPlayerId: number;
  homePlayerName: string;
  awayPlayerName: string;
  maxSets: number;
  currentHomePoints: number;
  currentAwayPoints: number;
  homeScoreTotal: number;
  awayScoreTotal: number;
  winnerId: number;
  hasPoints: boolean;
  scores: [];

  public constructor(data: any) {
    this.id = data.match_id;
    this.homePlayerId = data.home_player_id;
    this.awayPlayerId = data.away_player_id;
    this.homePlayerName = data.home_player_name;
    this.awayPlayerName = data.away_player_name;
    this.maxSets = data.max_sets;
    this.currentHomePoints = data.current_home_points;
    this.currentAwayPoints = data.current_away_points;
    this.homeScoreTotal = data.home_score_total;
    this.awayScoreTotal = data.away_score_total;
    this.winnerId = data.winner_id;
    this.scores = data.scores;
    this.hasPoints = !!data.has_points;
  }
}
