<template>
  <div class="mygames-wrap">
    <div class="mygames-container">
      <!-- Left sidebar -->
      <div class="mygames-sidebar">
        <div class="sidebar-title">My Games</div>
        <nav class="sidebar-nav">
          <a :class="['nav-link', { active: section === 'incoming' }]" @click="section = 'incoming'">
            Reschedule Requests
            <span v-if="incoming.length" class="badge">{{ incoming.length }}</span>
          </a>
          <a :class="['nav-link', { active: section === 'upcoming' }]" @click="section = 'upcoming'">
            Upcoming Matches
          </a>
        </nav>
      </div>

      <!-- Content -->
      <div class="mygames-content">

        <!-- Incoming reschedule requests -->
        <template v-if="section === 'incoming'">
          <div class="section-title">Pending Reschedule Requests</div>

          <div v-if="loadingRequests" class="empty-state">Loading…</div>
          <div v-else-if="incoming.length === 0" class="empty-state">No pending requests.</div>

          <div v-for="req in incoming" :key="req.id" class="request-card">
            <div class="request-header">
              <router-link :to="'/player/' + req.home_player_id + '/profile'" class="player-link">{{ req.home_player_name }}</router-link>
              <span class="vs">vs</span>
              <router-link :to="'/player/' + req.away_player_id + '/profile'" class="player-link">{{ req.away_player_name }}</router-link>
            </div>

            <div class="request-from">
              Requested by <strong>{{ req.requester_name }}</strong>
            </div>

            <div class="request-dates">
              <div class="date-block">
                <span class="date-label">Proposed</span>
                <span class="date-value">{{ formatDate(req.proposed_date_from) }}</span>
                <template v-if="req.proposed_date_to && req.proposed_date_to !== req.proposed_date_from">
                  <span class="date-label">to</span>
                  <span class="date-value">{{ formatDate(req.proposed_date_to) }}</span>
                </template>
              </div>
              <div v-if="req.current_date_of_match" class="date-block">
                <span class="date-label">Currently scheduled</span>
                <span class="date-value muted">{{ formatDate(req.current_date_of_match) }}</span>
              </div>
            </div>

            <div class="request-actions">
              <button class="btn-accept" :disabled="actionLoading === req.id" @click="accept(req)">
                Accept & Reschedule
              </button>
              <button class="btn-counter" :disabled="actionLoading === req.id" @click="openCounter(req)">
                Counter
              </button>
              <button class="btn-decline" :disabled="actionLoading === req.id" @click="decline(req)">
                Decline
              </button>
            </div>

            <div v-if="actionError === req.id" class="action-error">Failed. Try again.</div>
          </div>
        </template>

        <!-- Upcoming matches -->
        <template v-if="section === 'upcoming'">
          <div class="section-title">Upcoming Matches</div>

          <div v-if="loadingSchedule" class="empty-state">Loading…</div>
          <div v-else-if="schedule.length === 0" class="empty-state">No upcoming matches.</div>

          <table v-else class="matches-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Opponent</th>
                <th>ELO Diff</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="game in schedule" :key="game.id">
                <td class="td-date">{{ game.date_of_match ? formatDate(game.date_of_match) : '—' }}</td>
                <td class="td-opponent">
                  <router-link
                    :to="'/player/' + opponentId(game) + '/profile'"
                    class="player-link"
                  >{{ opponentName(game) }}</router-link>
                </td>
                <td class="td-elo">
                  <span :class="eloDiffClass(game)">{{ formatEloDiff(game) }}</span>
                </td>
                <td class="td-action">
                  <button
                    v-if="canReschedule(game)"
                    class="btn-reschedule"
                    @click="openReschedule(game)"
                  >Reschedule</button>
                  <span v-else class="past-label">Past</span>
                </td>
              </tr>
            </tbody>
          </table>
        </template>
      </div>
    </div>

    <!-- Reschedule modal -->
    <RescheduleModal
      v-if="rescheduleGame"
      :game="rescheduleGame"
      @close="rescheduleGame = null"
      @submitted="onRescheduleSubmitted"
    />

    <!-- Counter-proposal modal -->
    <RescheduleModal
      v-if="counterTarget"
      :game="counterGame"
      :counter-request-id="counterTarget.id"
      @close="counterTarget = null; counterGame = null"
      @submitted="onCounterSubmitted"
    />
  </div>
</template>

<script>
import axios from "axios";
import RescheduleModal from "@/components/game/RescheduleModal.vue";

export default {
  components: { RescheduleModal },
  data() {
    return {
      section: "incoming",
      playerId: null,
      incoming: [],
      schedule: [],
      loadingRequests: false,
      loadingSchedule: false,
      actionLoading: null,
      actionError: null,
      rescheduleGame: null,
      counterTarget: null,
      counterGame: null,
    };
  },
  mounted() {
    this.playerId = Number(localStorage.getItem("playerId"));
    if (!this.playerId) {
      this.$router.push("/login");
      return;
    }
    this.loadRequests();
    this.loadSchedule();
  },
  methods: {
    authHeaders() {
      return { Authorization: `Bearer ${localStorage.getItem("authToken")}` };
    },
    async loadRequests() {
      this.loadingRequests = true;
      try {
        const res = await axios.get(`/api/players/${this.playerId}/reschedule`, {
          headers: this.authHeaders(),
        });
        this.incoming = res.data || [];
      } finally {
        this.loadingRequests = false;
      }
    },
    async loadSchedule() {
      this.loadingSchedule = true;
      try {
        const res = await axios.get(`/api/players/${this.playerId}/schedule`);
        this.schedule = res.data || [];
      } finally {
        this.loadingSchedule = false;
      }
    },
    formatDate(d) {
      if (!d) return "—";
      const dt = new Date(d);
      if (isNaN(dt)) return d;
      return dt.toLocaleDateString(undefined, { dateStyle: "medium" });
    },
    opponentId(game) {
      return game.home_player_id === this.playerId ? game.away_player_id : game.home_player_id;
    },
    opponentName(game) {
      return game.home_player_id === this.playerId ? game.away_player_name : game.home_player_name;
    },
    eloDiff(game) {
      const myElo = game.home_player_id === this.playerId ? game.home_elo : game.away_elo;
      const oppElo = game.home_player_id === this.playerId ? game.away_elo : game.home_elo;
      return oppElo - myElo;
    },
    formatEloDiff(game) {
      const d = this.eloDiff(game);
      return d > 0 ? `+${d}` : `${d}`;
    },
    eloDiffClass(game) {
      const d = this.eloDiff(game);
      return d > 0 ? "elo-positive" : d < 0 ? "elo-negative" : "elo-neutral";
    },
    canReschedule(game) {
      if (!game.date_of_match) return true;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return new Date(game.date_of_match) >= today;
    },
    openReschedule(game) {
      this.rescheduleGame = game;
    },
    onRescheduleSubmitted() {
      this.rescheduleGame = null;
      this.section = "incoming";
      this.loadRequests();
      this.loadSchedule();
    },
    openCounter(req) {
      this.counterTarget = req;
      this.counterGame = {
        id: req.game_id,
        home_player_id: req.home_player_id,
        away_player_id: req.away_player_id,
        home_player_name: req.home_player_name,
        away_player_name: req.away_player_name,
        date_of_match: req.current_date_of_match,
      };
    },
    async onCounterSubmitted() {
      this.counterTarget = null;
      this.counterGame = null;
      await this.loadRequests();
    },
    async accept(req) {
      this.actionLoading = req.id;
      this.actionError = null;
      try {
        await axios.post(`/api/reschedule/${req.id}/accept`, {}, { headers: this.authHeaders() });
        await this.loadRequests();
        await this.loadSchedule();
      } catch (_) {
        this.actionError = req.id;
      } finally {
        this.actionLoading = null;
      }
    },
    async decline(req) {
      this.actionLoading = req.id;
      this.actionError = null;
      try {
        await axios.post(`/api/reschedule/${req.id}/decline`, {}, { headers: this.authHeaders() });
        await this.loadRequests();
      } catch (_) {
        this.actionError = req.id;
      } finally {
        this.actionLoading = null;
      }
    },
  },
};
</script>

<style scoped>
.mygames-wrap {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}
.mygames-container {
  display: flex;
  background: var(--color-container);
  border-radius: 20px;
  overflow: hidden;
  min-height: 500px;
}
.mygames-sidebar {
  width: 200px;
  flex-shrink: 0;
  background: #0f1017;
  padding: 24px 0;
  display: flex;
  flex-direction: column;
}
.sidebar-title {
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #666;
  padding: 0 20px 16px;
}
.sidebar-nav {
  display: flex;
  flex-direction: column;
}
.nav-link {
  padding: 10px 20px;
  font-size: 14px;
  color: #888;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: color 0.15s, background 0.15s;
  text-decoration: none;
}
.nav-link:hover { color: #ccc; background: rgba(255,255,255,0.04); }
.nav-link.active { color: #e0e0e0; background: rgba(255,255,255,0.07); }
.badge {
  background: #4a7c59;
  color: #fff;
  border-radius: 10px;
  font-size: 11px;
  padding: 1px 7px;
  font-weight: 600;
}
.mygames-content {
  flex: 1;
  padding: 24px;
  overflow: auto;
}
.section-title {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #555;
  margin-bottom: 16px;
}
.empty-state {
  color: #555;
  font-size: 14px;
  padding: 20px 0;
}
/* Request cards */
.request-card {
  background: #0f1017;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.request-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 15px;
}
.vs {
  color: #555;
  font-size: 12px;
}
.player-link {
  color: #c8d8c0;
  text-decoration: none;
}
.player-link:hover { text-decoration: underline; }
.request-from {
  font-size: 13px;
  color: #777;
}
.request-dates {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}
.date-block {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
}
.date-label { color: #555; }
.date-value { color: #ccc; font-weight: 500; }
.date-value.muted { color: #666; }
.request-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.btn-accept {
  background: #4a7c59;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 7px 16px;
  font-size: 13px;
  cursor: pointer;
  font-family: inherit;
}
.btn-accept:hover:not(:disabled) { background: #5a9469; }
.btn-counter {
  background: #2a3a4a;
  color: #7bb8e0;
  border: none;
  border-radius: 8px;
  padding: 7px 16px;
  font-size: 13px;
  cursor: pointer;
  font-family: inherit;
}
.btn-counter:hover:not(:disabled) { background: #354a5e; }
.btn-decline {
  background: #2a2a35;
  color: #888;
  border: none;
  border-radius: 8px;
  padding: 7px 16px;
  font-size: 13px;
  cursor: pointer;
  font-family: inherit;
}
.btn-decline:hover:not(:disabled) { background: #3a2a2a; color: #e06c6c; }
.btn-accept:disabled, .btn-counter:disabled, .btn-decline:disabled {
  opacity: 0.5;
  cursor: default;
}
.action-error {
  font-size: 12px;
  color: #e06c6c;
}
/* Matches table */
.matches-table {
  width: 100%;
  border-collapse: collapse;
}
.matches-table th {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #555;
  padding: 0 12px 10px 0;
  text-align: left;
  font-weight: 600;
}
.matches-table td {
  padding: 10px 12px 10px 0;
  border-top: 1px solid #1a1a24;
  font-size: 14px;
  color: #ccc;
  vertical-align: middle;
}
.td-date { color: #888; font-size: 13px; white-space: nowrap; }
.elo-positive { color: #e06c6c; }
.elo-negative { color: #93c47d; }
.elo-neutral  { color: #888; }
.btn-reschedule {
  background: #2a3a4a;
  color: #7bb8e0;
  border: none;
  border-radius: 7px;
  padding: 5px 14px;
  font-size: 12px;
  cursor: pointer;
  font-family: inherit;
  white-space: nowrap;
}
.btn-reschedule:hover { background: #354a5e; }
.past-label { color: #444; font-size: 12px; }
</style>
