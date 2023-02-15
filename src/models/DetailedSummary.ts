class Summary {
  public homeName: string;
  public awayName: string;
  public tournamentName: string;
  public groupName: string;
  public homePlayerId: number;
  public awayPlayerId: number;
  public winnerId: number;
  public homeTotalScore: number;
  public awayTotalScore: number;
  public homeTotalPoints: number;
  public awayTotalPoints: number;
  public homePointsPerc: string;
  public awayPointsPerc: string;

  public constructor(data: any) {
    this.homeName = data.home_name;
    this.awayName = data.away_name;
    this.tournamentName = data.tournament_name;
    this.groupName = data.group_name;
    this.homePlayerId = data.home_player_id;
    this.awayPlayerId = data.away_player_id;
    this.winnerId = data.winner_id;
    this.homeTotalScore = data.home_total_score;
    this.awayTotalScore = data.away_total_score;
    this.homeTotalPoints = data.home_total_points;
    this.awayTotalPoints = data.away_total_points;
    this.homePointsPerc = parseFloat(data.home_points_perc).toFixed(2);
    this.awayPointsPerc = parseFloat(data.away_points_perc).toFixed(2);
  }
}

class Sets {}

export class DetailedSummary {
  public summary: Summary;
  public sets: Sets;

  public constructor(data: any) {
    this.summary = new Summary(data.summary);
    this.sets = data.sets;
  }
}
