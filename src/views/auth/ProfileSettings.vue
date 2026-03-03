<template>
  <div class="profile-container" v-if="player">
    <div class="profile-left">
      <div class="profile-picture">
        <div class="circular-pic">
          <img 
            :src="player.profile_pic_url" 
            class="pic" 
            @error="imageLoadError = true"
            v-if="!imageLoadError"
          />
          <div v-if="imageLoadError" class="pic-fallback">
            <i class="far fa-user"></i>
          </div>
        </div>
      </div>
      <nav class="sidebar-nav">
        <a :class="['sidebar-link', { active: activeTab === 'settings' }]" @click="activeTab = 'settings'">
          <i class="fas fa-user"></i> Profile
        </a>
        <a :class="['sidebar-link', { active: activeTab === 'reschedule' }]" @click="activeTab = 'reschedule'; loadRescheduleTab()">
          <i class="fas fa-calendar-alt"></i> Reschedule
        </a>
      </nav>
    </div>

    <div class="profile-content">
      <div class="content-header">
        <span class="content-title">{{ activeTab === 'reschedule' ? 'Reschedule Requests' : 'Account Settings' }}</span>
      </div>

      <div v-if="activeTab === 'settings'" class="round-container">
        <div class="player-info marb20">
            <div class="info-item">
              <span class="info-label">Name</span>
              <span class="info-value">{{ player.name }}</span>
            </div>
          </div>

          <div class="separator-line"></div>

          <form @submit.prevent="handleUpdate" class="form-wrapper">
            <div v-if="mustChangePassword" class="password-warning">
              ⚠️ Password Change Required: Your password has expired. Please change it before continuing.
            </div>

            <div class="password-section">
              <div class="form-group">
                <input
                  v-model="form.password"
                  type="password"
                  class="form-input"
                  placeholder="New password"
                />
              </div>

              <div class="form-group">
                <input
                  v-model="form.passwordConfirm"
                  type="password"
                  class="form-input"
                  placeholder="Repeat new password"
                />
              </div>
            </div>

            <div v-if="error" class="round-container-errors marb10">
              {{ error }}
            </div>

            <div v-if="success" class="round-container-green-small marb10">
              {{ success }}
            </div>

            <div class="button-group">
              <button type="submit" class="btn-submit-small" :disabled="loading">
                {{ loading ? "Saving..." : "Save changes" }}
              </button>
            </div>
          </form>
      </div>

      <!-- Reschedule tab -->
      <div v-if="activeTab === 'reschedule'">

        <!-- Settled requests -->
        <div v-if="settledRequests.length > 0">
          <div class="sched-section-title">Settled</div>
          <div v-for="req in settledRequests" :key="req.id" class="request-card request-card-settled">
            <div class="request-header">
              <router-link :to="'/player/' + req.home_player_id + '/profile'" class="req-player-link">{{ req.home_player_name }}</router-link>
              <span class="req-vs">vs</span>
              <router-link :to="'/player/' + req.away_player_id + '/profile'" class="req-player-link">{{ req.away_player_name }}</router-link>
              <span :class="'status-badge status-' + req.status">{{ req.status }}</span>
            </div>
            <div class="request-from">Proposed by <strong>{{ req.requester_name }}</strong></div>
            <div class="request-dates">
              <span class="date-label">Proposed:</span>
              <span class="date-value">{{ formatDate(req.proposed_date_from) }}</span>
              <template v-if="isRange(req)">
                <span class="date-label">–</span>
                <span class="date-value">{{ formatDate(req.proposed_date_to) }}</span>
              </template>
              <template v-if="req.status === 'accepted' && req.current_date_of_match">
                <span class="date-label" style="margin-left:12px">New date:</span>
                <span class="date-value" style="color:#6dd98c">{{ formatDate(req.current_date_of_match) }}</span>
              </template>
              <template v-else-if="req.original_date_of_match">
                <span class="date-label" style="margin-left:12px">Original:</span>
                <span class="date-value muted">{{ formatDate(req.original_date_of_match) }}</span>
              </template>
            </div>
            <div class="request-actions">
              <button class="btn-reschedule-small" @click="openReopenModal(req)">Propose new date</button>
            </div>
            <div v-if="actionError === req.id" class="action-error">Failed. Try again.</div>
          </div>
          <div class="sched-divider"></div>
        </div>

        <!-- Incoming requests (from opponent) -->
        <div class="sched-section-title">Incoming Requests</div>
        <div v-if="loadingRequests" class="empty-state">Loading…</div>
        <div v-else-if="incomingRequests.length === 0" class="empty-state">No incoming requests.</div>

        <div v-for="req in incomingRequests" :key="req.id" class="request-card">
          <div class="request-header">
            <router-link :to="'/player/' + req.home_player_id + '/profile'" class="req-player-link">{{ req.home_player_name }}</router-link>
            <span class="req-vs">vs</span>
            <router-link :to="'/player/' + req.away_player_id + '/profile'" class="req-player-link">{{ req.away_player_name }}</router-link>
            <span class="status-badge status-pending">pending</span>
          </div>
          <div class="request-from">Proposed by <strong>{{ req.requester_name }}</strong></div>
          <div class="request-dates">
            <span class="date-label">Proposed:</span>
            <span class="date-value">{{ formatDate(req.proposed_date_from) }}</span>
            <template v-if="isRange(req)">
              <span class="date-label">–</span>
              <span class="date-value">{{ formatDate(req.proposed_date_to) }}</span>
            </template>
            <template v-if="req.original_date_of_match">
              <span class="date-label" style="margin-left:12px">Original:</span>
              <span class="date-value muted">{{ formatDate(req.original_date_of_match) }}</span>
            </template>
          </div>
          <div v-if="isRange(req)" class="range-accept-row">
            <span class="date-label">Pick date to confirm:</span>
            <input type="date"
              :min="req.proposed_date_from.slice(0,10)"
              :max="req.proposed_date_to.slice(0,10)"
              v-model="confirmedDates[req.id]"
              class="confirm-date-input"
            />
          </div>
          <div class="request-actions">
            <button class="btn-accept" :disabled="actionLoading === req.id || (isRange(req) && !confirmedDates[req.id])" @click="accept(req)">Accept</button>
            <button class="btn-counter" :disabled="actionLoading === req.id" @click="openCounter(req)">Counter</button>
            <button class="btn-decline" :disabled="actionLoading === req.id" @click="decline(req)">Decline</button>
          </div>
          <div v-if="actionError === req.id" class="action-error">Failed. Try again.</div>
        </div>

        <!-- Outgoing requests (my own pending proposals) -->
        <div class="sched-divider"></div>
        <div class="sched-section-title">My Proposals</div>
        <div v-if="!loadingRequests && outgoingRequests.length === 0" class="empty-state">No outgoing proposals.</div>

        <div v-for="req in outgoingRequests" :key="req.id" class="request-card">
          <div class="request-header">
            <router-link :to="'/player/' + req.home_player_id + '/profile'" class="req-player-link">{{ req.home_player_name }}</router-link>
            <span class="req-vs">vs</span>
            <router-link :to="'/player/' + req.away_player_id + '/profile'" class="req-player-link">{{ req.away_player_name }}</router-link>
            <span class="status-badge status-pending">pending</span>
          </div>
          <div class="request-dates">
            <span class="date-label">Proposed:</span>
            <span class="date-value">{{ formatDate(req.proposed_date_from) }}</span>
            <template v-if="isRange(req)">
              <span class="date-label">–</span>
              <span class="date-value">{{ formatDate(req.proposed_date_to) }}</span>
            </template>
            <template v-if="req.original_date_of_match">
              <span class="date-label" style="margin-left:12px">Original:</span>
              <span class="date-value muted">{{ formatDate(req.original_date_of_match) }}</span>
            </template>
          </div>
          <div class="request-actions">
            <button class="btn-decline" :disabled="actionLoading === req.id" @click="cancel(req)">Cancel</button>
          </div>
          <div v-if="actionError === req.id" class="action-error">Failed. Try again.</div>
        </div>

        <!-- Upcoming matches section -->
        <div class="sched-divider"></div>
        <div class="sched-section-title">Upcoming Matches</div>
        <div v-if="loadingSchedule" class="empty-state">Loading…</div>
        <div v-else-if="schedule.length === 0" class="empty-state">No upcoming matches.</div>
        <table v-else class="sched-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Opponent</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="game in schedule" :key="game.match_id">
              <td class="td-date">{{ game.date_of_match ? formatDate(game.date_of_match) : '—' }}</td>
              <td>
                <router-link :to="'/player/' + (game.home_player_id === player.id ? game.away_player_id : game.home_player_id) + '/profile'" class="req-player-link">
                  {{ game.home_player_id === player.id ? game.away_player_name : game.home_player_name }}
                </router-link>
              </td>
              <td class="td-action">
                <template v-if="gameRequest(game)">
                  <span :class="'req-status-label req-status-' + gameRequest(game).status">
                    {{ { pending: 'Requested', accepted: 'Settled', declined: 'Declined', countered: 'Requested', revoked: 'Revoked' }[gameRequest(game).status] || gameRequest(game).status }}
                  </span>
                </template>
                <button v-else-if="canReschedule(game)" class="btn-reschedule-small" @click="rescheduleGame = { ...game, id: game.match_id }">Reschedule</button>
                <span v-else class="past-label">Past</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <RescheduleModal
      v-if="rescheduleGame"
      :game="rescheduleGame"
      @close="rescheduleGame = null"
      @submitted="onRescheduleSubmitted"
    />

    <RescheduleModal
      v-if="counterTarget"
      :game="counterGame"
      :counter-request-id="counterTarget.id"
      @close="counterTarget = null; counterGame = null"
      @submitted="onCounterSubmitted"
    />

  </div>

  <div v-else class="loader">
    Loading profile...
  </div>
</template>

<script>
import axios from "axios";
import { useRouter } from "vue-router";
import RescheduleModal from "@/components/game/RescheduleModal.vue";

export default {
  components: { RescheduleModal },
  setup() {
    const router = useRouter();
    return { router };
  },
  data() {
    return {
      player: null,
      activeTab: "settings",
      imageLoadError: false,
      form: {
        nickname: "",
        password: "",
        passwordConfirm: "",
      },
      error: "",
      success: "",
      loading: false,
      mustChangePassword: false,
      rescheduleRequests: [],
      confirmedDates: {},
      loadingRequests: false,
      loadingSchedule: false,
      schedule: [],
      rescheduleGame: null,
      actionLoading: null,
      actionError: null,
      counterTarget: null,
      counterGame: null,
    };
  },
  computed: {
    settledRequests() {
      const settled = this.rescheduleRequests.filter(r => ['accepted','declined','revoked','countered'].includes(r.status));
      // Keep only the latest request per game (highest id)
      const latest = new Map();
      for (const r of settled) {
        if (!latest.has(r.game_id) || r.id > latest.get(r.game_id).id) {
          latest.set(r.game_id, r);
        }
      }
      return [...latest.values()];
    },
    incomingRequests() {
      const myId = Number(localStorage.getItem("playerId"));
      return this.rescheduleRequests.filter(r => r.status === 'pending' && r.requester_id !== myId);
    },
    outgoingRequests() {
      const myId = Number(localStorage.getItem("playerId"));
      return this.rescheduleRequests.filter(r => r.status === 'pending' && r.requester_id === myId);
    },
  },
  methods: {
    async loadProfile() {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          this.router.push("/login");
          return;
        }

        const response = await axios.get("/api/auth/verify", {
          headers: { Authorization: `Bearer ${token}` },
        });

        this.player = response.data;
        this.form.nickname = this.player.nickname || "";
      } catch (error) {
        console.error("Failed to load profile", error);
        this.router.push("/login");
      }
    },

    async handleUpdate() {
      this.error = "";
      this.success = "";

      if (!this.form.password) {
        this.error = "Please enter a new password";
        return;
      }

      if (this.form.password.length < 6) {
        this.error = "Password must be at least 6 characters";
        return;
      }

      if (this.form.password !== this.form.passwordConfirm) {
        this.error = "Passwords do not match";
        return;
      }

      this.loading = true;

      try {
        const token = localStorage.getItem("authToken");
        const payload = {
          nickname: this.form.nickname,
        };

        if (this.form.password) {
          payload.password = this.form.password;
        }

        const response = await axios.put("/api/auth/profile", payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        this.player = response.data;
        this.form.password = "";
        this.form.passwordConfirm = "";
        this.success = "Password changed successfully!";
        this.mustChangePassword = false;
        localStorage.removeItem("mustChangePassword");
        
        // Dispatch event to notify TopMenu
        window.dispatchEvent(new Event('authStatusChanged'));

        setTimeout(() => {
          this.success = "";
        }, 3000);
      } catch (error) {
        this.error =
          error.response?.data?.error || "Failed to update profile";
      } finally {
        this.loading = false;
      }
    },

    authHeaders() {
      return { Authorization: `Bearer ${localStorage.getItem("authToken")}` };
    },
    formatDate(d) {
      if (!d) return "—";
      const dt = new Date(d);
      return isNaN(dt) ? d : dt.toLocaleDateString(undefined, { dateStyle: "medium" });
    },
    async loadRescheduleRequests() {
      if (!this.player) return;
      this.loadingRequests = true;
      try {
        const res = await axios.get(`/api/players/${this.player.id}/reschedule`, { headers: this.authHeaders() });
        this.rescheduleRequests = res.data || [];
        window.dispatchEvent(new Event('rescheduleUpdated'));
      } finally {
        this.loadingRequests = false;
      }
    },
    async loadSchedule() {
      if (!this.player) return;
      this.loadingSchedule = true;
      try {
        const res = await axios.get(`/api/players/${this.player.id}/schedule`);
        this.schedule = res.data || [];
      } finally {
        this.loadingSchedule = false;
      }
    },
    loadRescheduleTab() {
      this.loadRescheduleRequests();
      this.loadSchedule();
    },
    canReschedule(game) {
      if (!game.date_of_match) return true;
      const today = new Date(); today.setHours(0, 0, 0, 0);
      if (new Date(game.date_of_match) < today) return false;
      const req = this.gameRequest(game);
      return !req || req.status !== 'pending';
    },
    gameRequest(game) {
      const id = game.match_id || game.id;
      return this.rescheduleRequests.find(r => r.game_id === id) || null;
    },
    onRescheduleSubmitted() {
      this.rescheduleGame = null;
      this.loadRescheduleRequests();
    },
    isRange(req) {
      return req.proposed_date_to && req.proposed_date_to !== req.proposed_date_from;
    },
    async accept(req) {
      this.actionLoading = req.id; this.actionError = null;
      try {
        const body = this.isRange(req) ? { confirmed_date: this.confirmedDates[req.id] } : {};
        await axios.post(`/api/reschedule/${req.id}/accept`, body, { headers: this.authHeaders() });
        await Promise.all([this.loadRescheduleRequests(), this.loadSchedule()]);
      } catch (_) { this.actionError = req.id; } finally { this.actionLoading = null; }
    },
    async decline(req) {
      this.actionLoading = req.id; this.actionError = null;
      try {
        await axios.post(`/api/reschedule/${req.id}/decline`, {}, { headers: this.authHeaders() });
        await this.loadRescheduleRequests();
      } catch (_) { this.actionError = req.id; } finally { this.actionLoading = null; }
    },
    async cancel(req) {
      this.actionLoading = req.id; this.actionError = null;
      try {
        await axios.post(`/api/reschedule/${req.id}/decline`, {}, { headers: this.authHeaders() });
        await this.loadRescheduleRequests();
      } catch (_) { this.actionError = req.id; } finally { this.actionLoading = null; }
    },
    openReopenModal(req) {
      this.rescheduleGame = {
        id: req.game_id,
        home_player_id: req.home_player_id,
        away_player_id: req.away_player_id,
        home_player_name: req.home_player_name,
        away_player_name: req.away_player_name,
        date_of_match: req.current_date_of_match,
      };
    },
    openCounter(req) {
      this.counterTarget = req;
      this.counterGame = { id: req.game_id, home_player_id: req.home_player_id, away_player_id: req.away_player_id, home_player_name: req.home_player_name, away_player_name: req.away_player_name, date_of_match: req.current_date_of_match };
    },
    async onCounterSubmitted() {
      this.counterTarget = null; this.counterGame = null;
      await this.loadRescheduleRequests();
    },

    handleLogout() {
      localStorage.removeItem("authToken");
      localStorage.removeItem("playerId");
      localStorage.removeItem("playerName");
      this.router.push("/login");
    },
  },
  mounted() {
    this.loadProfile();
    
    // Check if password change was required
    const params = new URLSearchParams(window.location.search);
    this.mustChangePassword = params.get("passwordRequired") === "true";
    
    // Mark password as required if flag is set
    if (this.mustChangePassword) {
      localStorage.setItem("mustChangePassword", "true");
    }
  },
};
</script>

<style scoped>
.profile-container {
  display: flex;
  flex-direction: row;
  background: var(--color-container);
  border-radius: 20px;
  overflow: hidden;
  padding: 0;
  align-items: stretch;
}

.profile-left {
  width: 200px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 20px;
  background: #0f1017;
}

.profile-picture {
  width: 100%;
  display: flex;
  justify-content: center;
}

.circular-pic {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  border: 3px solid rgba(84, 84, 84, 0.65);
  display: flex;
  align-items: center;
  justify-content: center;
}

.pic {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.pic-fallback {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-container);
  color: white;
}

.pic-fallback i {
  font-size: 60px;
  color: rgba(200, 200, 200, 0.7);
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 0;
  margin: 0;
}

.sidebar-link {
  padding: 8px 0;
  border-bottom: 1px solid rgba(84, 84, 84, 0.4);
  color: white;
  text-decoration: none;
  transition: color 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
}

.sidebar-link:last-child {
  border-bottom: none;
}

.sidebar-link i {
  color: white;
  font-size: 12px;
}

.sidebar-link:hover {
  color: #269a47;
}

.sidebar-link.active {
  color: #269a47;
  font-weight: 600;
}

.profile-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.content-header {
  padding: 0 0 15px 0;
  margin-bottom: 20px;
  border-bottom: 1px solid rgba(84, 84, 84, 0.3);
}

.content-title {
  color: white;
  font-size: 23px;
  font-weight: 800;
}

.round-container {
  background: transparent;
  border: none;
  padding: 0;
}

.player-info {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.info-item {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 20px;
}

.info-label {
  font-weight: 600;
  color: #999;
  min-width: 80px;
  font-size: 15px;
}

.info-value {
  color: white;
  font-size: 15px;
}

.password-warning {
  background: rgba(255, 193, 7, 0.1);
  border: 1px solid rgba(255, 193, 7, 0.3);
  padding: 8px 12px;
  border-radius: 10px;
  color: #FFC107;
  font-size: 15px;
  margin-bottom: 15px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.form-group {
  display: flex;
  flex-direction: column;
  width: 25%;
}

.password-section {
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(84, 84, 84, 0.3);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-wrapper {
  display: flex;
  flex-direction: column;
  margin-top: 20px;
}

.separator-line {
  height: 1px;
  background: rgba(84, 84, 84, 0.3);
  margin: 15px 0;
}

.form-row {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}

.form-row .form-group {
  flex: 1;
  margin-bottom: 0;
}

.button-group {
  display: flex;
  justify-content: flex-end;
  margin-top: 15px;
}

.form-input {
  width: 100%;
  max-width: 100%;
  padding: 6px 8px;
  border: 1px solid rgba(84, 84, 84, 0.65);
  border-radius: 4px;
  background: var(--col-dark);
  color: white;
  font-size: 14px;
  font-family: inherit;
  box-sizing: border-box;
  display: block;
  margin: 0;
  text-align: left;
  -webkit-appearance: none;
  appearance: none;
}

.form-input::placeholder {
  color: rgba(200, 200, 200, 0.7);
  text-align: left;
}

.form-input:focus {
  border: 1px solid rgba(200, 200, 200, 1);
  outline: none;
}

.flex {
  display: flex;
  gap: 10px;
}

.gap10 {
  gap: 10px;
}

.round-container-errors {
  color: #ff6b6b;
  padding: 8px 12px;
  font-size: 15px;
  border-radius: 10px;
}

.round-container-green-small {
  background-color: #1e88e5;
  color: white;
  padding: 8px 12px;
  font-size: 15px;
  border-radius: 8px;
}

.text-left {
  text-align: left;
}

.padl10 {
  padding-left: 10px;
}

.padl20 {
  padding-left: 20px;
}

.marb15 {
  margin-bottom: 15px;
}

.marb10 {
  margin-bottom: 10px;
}

.marb20 {
  margin-bottom: 20px;
}

.txt-col-player {
  color: #969696;
  font-size: 12px;
}

.txt-bold {
  font-weight: 900;
}

.col-winner {
  color: #40c500;
}

.loader {
  text-align: center;
  font-size: 30px;
  color: var(--color-green);
}

.btn-submit-small {
  padding: 6px 16px;
  background: #269a47;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  text-transform: none;
}

.btn-submit-small:hover:not(:disabled) {
  background: #1f7a37;
}

.btn-submit-small:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

table {
  width: 100%;
  border-collapse: collapse;
}

.tbl-fixed {
  table-layout: fixed;
}

.dsp-block {
  display: block;
}

td {
  vertical-align: top;
}

.stat-hero {
  display: flex;
  align-items: center;
  gap: 30px;
  padding: 10px 0 24px 0;
}

.stat-hero-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.stat-hero-value {
  font-size: 48px;
  font-weight: 800;
  color: white;
  line-height: 1;
}

.stat-hero-label {
  font-size: 12px;
  text-transform: uppercase;
  color: #888;
  font-weight: 500;
  letter-spacing: 0.05em;
}

.elo-positive { color: #93c47d; }
.elo-negative { color: #d4836e; }

.elo-badge {
  font-size: 15px;
  font-weight: 600;
  vertical-align: middle;
  padding: 1px 5px;
  border-radius: 20px;
  margin-left: 6px;
}

.elo-up {
  color: #93c47d;
  background: rgba(147, 196, 125, 0.15);
}

.elo-down {
  color: #d4836e;
  background: rgba(212, 131, 110, 0.15);
}

.elo-chart-section {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid rgba(84, 84, 84, 0.3);
}

.elo-chart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}

.last-results {
  display: flex;
  align-items: center;
  gap: 3px;
}

.form-sep {
  font-size: 10px;
  color: white;
  padding: 0 1px;
}

.form-arrow {
  font-size: 10px;
  color: white;
  padding: 0 1px;
}

.elo-chart-title {
  font-size: 12px;
  text-transform: uppercase;
  color: #888;
  font-weight: 500;
  letter-spacing: 0.05em;
  margin-bottom: 6px;
}

.stat-hero-divider {
  width: 1px;
  height: 50px;
  background: rgba(84, 84, 84, 0.5);
}

.stat-hero-item-pair {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.stat-hero-elo-group {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
}

.stat-hero-elo-main {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.stat-hero-pair-row {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.stat-hero-sub-value {
  font-size: 24px;
  font-weight: 700;
  line-height: 1;
}

.stat-hero-sub-label {
  font-size: 11px;
  text-transform: uppercase;
  color: #888;
  font-weight: 500;
  letter-spacing: 0.05em;
}

.wdl-bar-section {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.stats-insights {
  display: flex;
  gap: 0;
  margin-top: 24px;
  border-top: 1px solid rgba(84, 84, 84, 0.3);
  padding-top: 20px;
  flex-wrap: wrap;
}

.stats-insight-item {
  flex: 1;
  min-width: 120px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 0 16px 0 0;
}

.stats-insight-item:not(:last-child) {
  border-right: 1px solid rgba(84, 84, 84, 0.3);
  margin-right: 16px;
}

.insight-value {
  font-size: 18px;
  font-weight: 700;
  color: white;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.insight-link {
  text-decoration: none;
}

.insight-link:hover {
  text-decoration: underline;
}

.insight-label {
  font-size: 11px;
  text-transform: uppercase;
  color: #888;
  font-weight: 500;
  letter-spacing: 0.05em;
}

.insight-sub {
  color: #666;
  font-weight: 400;
  text-transform: none;
  letter-spacing: 0;
}

.wdl-bar {
  display: flex;
  height: 14px;
  border-radius: 7px;
  overflow: hidden;
  background: rgba(84, 84, 84, 0.3);
}

.wdl-segment {
  height: 100%;
  transition: width 0.4s ease;
}

.wdl-wins   { background: #93c47d; }
.wdl-draws  { background: #d9ead3; }
.wdl-losses { background: #d4836e; }

.wdl-labels {
  display: flex;
  gap: 24px;
}

.wdl-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
}

.wdl-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.wdl-dot-wins   { background: #93c47d; }
.wdl-dot-draws  { background: #d9ead3; }
.wdl-dot-losses { background: #d4836e; }

.wdl-count {
  color: white;
  font-weight: 700;
}

.wdl-name {
  color: #aaa;
}

.wdl-pct {
  color: #666;
}

.nav-badge {
  background: #4a7c59;
  color: #fff;
  border-radius: 10px;
  font-size: 10px;
  padding: 1px 6px;
  font-weight: 600;
  margin-left: auto;
}

.empty-state { color: #555; font-size: 14px; padding: 10px 0; }

.request-card {
  background: #0f1017;
  border-radius: 8px;
  padding: 8px 12px;
  margin-bottom: 6px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.request-card-settled {
  opacity: 0.65;
}
.request-card-settled:hover {
  opacity: 1;
}

.request-header {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
  font-size: 13px;
}

.req-vs { color: #555; font-size: 11px; }

.req-player-link { color: #c8d8c0; text-decoration: none; }
.req-player-link:hover { text-decoration: underline; }

.request-from { font-size: 12px; color: #666; }

.request-dates {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  flex-wrap: wrap;
}

.date-label { color: #555; }
.date-value { color: #ccc; font-weight: 500; }
.date-value.muted { color: #666; }

.request-actions { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 2px; }

.btn-accept {
  background: #4a7c59; color: #fff; border: none;
  border-radius: 6px; padding: 3px 11px; font-size: 12px;
  cursor: pointer; font-family: inherit;
}
.btn-accept:hover:not(:disabled) { background: #5a9469; }

.btn-counter {
  background: #2a3a4a; color: #7bb8e0; border: none;
  border-radius: 6px; padding: 3px 11px; font-size: 12px;
  cursor: pointer; font-family: inherit;
}
.btn-counter:hover:not(:disabled) { background: #354a5e; }

.btn-decline {
  background: #2a2a35; color: #888; border: none;
  border-radius: 6px; padding: 3px 11px; font-size: 12px;
  cursor: pointer; font-family: inherit;
}
.btn-decline:hover:not(:disabled) { background: #3a2a2a; color: #e06c6c; }

.btn-accept:disabled, .btn-counter:disabled, .btn-decline:disabled { opacity: 0.5; cursor: default; }

.action-error { font-size: 11px; color: #e06c6c; }

.range-accept-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
}

.confirm-date-input {
  background: #1e1e26;
  border: 1px solid #333;
  border-radius: 6px;
  padding: 3px 8px;
  color: #e0e0e0;
  font-size: 12px;
  font-family: inherit;
  outline: none;
  color-scheme: dark;
  min-width: 150px;
}
.confirm-date-input:focus { border-color: #555; }

.pending-badge {
  margin-left: 8px;
  font-size: 11px;
  color: #7bb8e0;
  background: rgba(123,184,224,0.1);
  border-radius: 8px;
  padding: 1px 7px;
}

.status-badge {
  margin-left: auto;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-radius: 8px;
  padding: 1px 7px;
}
.status-pending   { color: #7bb8e0; background: rgba(123,184,224,0.1); }
.status-accepted  { color: #6dd98c; background: rgba(109,217,140,0.1); }
.status-declined  { color: #e06c6c; background: rgba(224,108,108,0.1); }
.status-countered { color: #e0b96c; background: rgba(224,185,108,0.1); }
.status-revoked   { color: #888;    background: rgba(136,136,136,0.1); }

.sched-section-title {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #555;
  margin-bottom: 8px;
}

.sched-divider {
  height: 1px;
  background: rgba(84, 84, 84, 0.3);
  margin: 16px 0 14px;
}

.sched-table {
  width: 100%;
  border-collapse: collapse;
}
.sched-table th {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #555;
  padding: 0 12px 6px 0;
  text-align: left;
  font-weight: 600;
}
.sched-table td {
  padding: 6px 12px 6px 0;
  border-top: 1px solid #1a1a24;
  font-size: 13px;
  color: #ccc;
  vertical-align: middle;
}
.td-date { color: #888; font-size: 12px; white-space: nowrap; }
.td-action { text-align: right; }

.btn-reschedule-small {
  background: #2a3a4a;
  color: #7bb8e0;
  border: none;
  border-radius: 7px;
  padding: 4px 12px;
  font-size: 12px;
  cursor: pointer;
  font-family: inherit;
  white-space: nowrap;
}
.btn-reschedule-small:hover { background: #354a5e; }
.past-label { color: #444; font-size: 12px; }
.settled-label { color: #6dd98c; font-size: 12px; }
.req-status-label { font-size: 12px; }
.req-status-pending   { color: #7bb8e0; }
.req-status-accepted  { color: #6dd98c; }
.req-status-declined  { color: #e06c6c; }
.req-status-countered { color: #7bb8e0; }
.req-status-revoked   { color: #555; }
</style>
