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
        <RouterLink
          to="/profile"
          class="sidebar-link"
          :class="{ active: activeTab === 'statistics' }"
          @click="activeTab = 'statistics'"
        >
          <i class="far fa-play-circle"></i>
          Statistics
        </RouterLink>
        <RouterLink
          to="/profile/settings"
          class="sidebar-link"
          :class="{ active: activeTab === 'settings' }"
          @click="activeTab = 'settings'"
        >
          <i class="far fa-play-circle"></i>
          Settings
        </RouterLink>
      </nav>
    </div>

    <div class="profile-content">

      <div class="content-header">
        <span v-if="activeTab === 'statistics'" class="content-title">Statistics</span>
        <span v-if="activeTab === 'settings'" class="content-title">Account Settings</span>
      </div>

      <div class="round-container">
        <template v-if="activeTab === 'settings'">
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
        </template>

        <template v-if="activeTab === 'statistics'">
          <div class="stat-hero">
            <div class="stat-hero-item stat-hero-elo-group">
              <div class="stat-hero-elo-main">
                <div class="stat-hero-value">
                  {{ player.elo }}
                  <span v-if="player.elo_change !== 0" class="elo-badge" :class="player.elo_change > 0 ? 'elo-up' : 'elo-down'">
                    {{ player.elo_change > 0 ? '↑' : '↓' }} {{ Math.abs(player.elo_change) }}
                  </span>
                </div>
                <div class="stat-hero-label">Current ELO</div>
              </div>
            </div>
            <div v-if="peakElo !== null" class="stat-hero-divider"></div>
            <div v-if="peakElo !== null" class="stat-hero-item stat-hero-item-pair">
              <div class="stat-hero-pair-row">
                <div class="stat-hero-sub-value elo-positive">{{ peakElo }}</div>
                <div class="stat-hero-sub-label">Peak ELO</div>
              </div>
              <div class="stat-hero-pair-row">
                <div class="stat-hero-sub-value elo-negative">{{ bottomElo }}</div>
                <div class="stat-hero-sub-label">Bottom ELO</div>
              </div>
            </div>
            <div class="stat-hero-divider"></div>
            <div class="stat-hero-item">
              <div class="stat-hero-value">{{ player.games_played }}</div>
              <div class="stat-hero-label">Games Played</div>
            </div>
            <div class="stat-hero-divider"></div>
            <div class="stat-hero-item">
              <div class="stat-hero-value">{{ player.pps.toFixed(1) }}</div>
              <div class="stat-hero-label">Points Per Set</div>
            </div>
          </div>

          <div class="wdl-bar-section">
            <div class="wdl-bar">
              <div class="wdl-segment wdl-wins" :style="{ width: player.win_percentage + '%' }"></div>
              <div class="wdl-segment wdl-draws" :style="{ width: player.draw_percentage + '%' }"></div>
              <div class="wdl-segment wdl-losses" :style="{ width: player.loss_percentage + '%' }"></div>
            </div>
            <div class="wdl-labels">
              <div class="wdl-label">
                <span class="wdl-dot wdl-dot-wins"></span>
                <span class="wdl-count">{{ player.wins }}</span>
                <span class="wdl-name">Wins</span>
                <span class="wdl-pct">{{ player.win_percentage.toFixed(1) }}%</span>
              </div>
              <div class="wdl-label">
                <span class="wdl-dot wdl-dot-draws"></span>
                <span class="wdl-count">{{ player.draws }}</span>
                <span class="wdl-name">Draws</span>
                <span class="wdl-pct">{{ player.draw_percentage.toFixed(1) }}%</span>
              </div>
              <div class="wdl-label">
                <span class="wdl-dot wdl-dot-losses"></span>
                <span class="wdl-count">{{ player.losses }}</span>
                <span class="wdl-name">Losses</span>
                <span class="wdl-pct">{{ player.loss_percentage.toFixed(1) }}%</span>
              </div>
            </div>
          </div>

          <div class="stats-insights">
            <div v-if="nemesis" class="stats-insight-item">
              <router-link :to="'/player/' + nemesis.opponent_id + '/profile'" class="insight-value elo-negative insight-link">{{ nemesis.opponent_name }}</router-link>
              <div class="insight-label">Nemesis <span class="insight-sub">({{ nemesis.losses }} losses)</span></div>
            </div>
            <div v-if="favouriteVictim" class="stats-insight-item">
              <router-link :to="'/player/' + favouriteVictim.opponent_id + '/profile'" class="insight-value elo-positive insight-link">{{ favouriteVictim.opponent_name }}</router-link>
              <div class="insight-label">Favourite Victim <span class="insight-sub">({{ favouriteVictim.wins }} wins)</span></div>
            </div>
            <div v-if="mostPlayedOpponent" class="stats-insight-item">
              <router-link :to="'/player/' + mostPlayedOpponent.opponent_id + '/profile'" class="insight-value insight-link">{{ mostPlayedOpponent.opponent_name }}</router-link>
              <div class="insight-label">Most Played <span class="insight-sub">({{ mostPlayedOpponent.games }} games)</span></div>
            </div>
          </div>

          <div v-if="lineChartData" class="elo-chart-section">
            <div class="elo-chart-header">
              <div class="elo-chart-title">ELO Progression</div>
              <div v-if="lastResults.length" class="last-results">
                <template v-for="(winnerId, i) in [...lastResults].reverse()" :key="i">
                  <PlayerFormLabel :player-id="player.id" :winner-id="winnerId" />
                </template>
                <i class="fas fa-long-arrow-alt-right form-arrow"></i>
              </div>
            </div>
            <GChart type="AreaChart" :data="lineChartData" :options="lineChartOptions" />
          </div>
        </template>
      </div>
    </div>
  </div>

  <div v-else class="loader">
    Loading profile...
  </div>
</template>

<script>
import axios from "axios";
import { useRouter } from "vue-router";
import { GChart } from "vue-google-charts";
import PlayerFormLabel from "@/components/game/PlayerFormLabel.vue";

export default {
  components: { GChart, PlayerFormLabel },
  setup() {
    const router = useRouter();
    return { router };
  },
  data() {
    return {
      player: null,
      activeTab: "statistics",
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
      lastResults: [],
      longestWinStreak: 0,
      nemesis: null,
      favouriteVictim: null,
      mostPlayedOpponent: null,
      peakElo: null,
      bottomElo: null,
      lineChartData: null,
      lineChartOptions: {
        vAxis: {
          baselineColor: "#333",
          textStyle: { color: "#555", fontSize: 11 },
          gridlines: { count: 3, color: "#2a2a2a" },
          minorGridlines: { count: 0 },
        },
        hAxis: {
          baselineColor: "#333",
          textStyle: { color: "#555", fontSize: 11 },
          gridlines: { count: 0 },
          minorGridlines: { count: 0 },
        },
        height: 220,
        lineWidth: 2,
        pointSize: 6,
        pointsVisible: true,
        legend: { position: "none" },
        fontName: "Quicksand",
        backgroundColor: "#1e1e26",
        chartArea: { backgroundColor: "#1e1e26", left: 50, right: 20, top: 10, bottom: 30 },
        colors: ["#93c47d"],
        areaOpacity: 0.15,
      },
    };
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
        this.lineChartData = [["Game", "ELO"], ...this.player.elo_history];
        if (this.player.elo_history.length) {
          const eloValues = this.player.elo_history.map(h => h[1]);
          this.peakElo = Math.max(...eloValues);
          this.bottomElo = Math.min(...eloValues);
        }

        const results = await axios.get(`/api/players/${this.player.id}/results`);
        if (results.data && results.data.length > 0) {
          const last = results.data[0];
          this.player.elo_change = last.home_player_id === this.player.id
            ? last.home_elo_diff
            : last.away_elo_diff;
          this.lastResults = results.data.slice(0, 7).map(r => r.winner_id);

          let longest = 0, current = 0;
          for (const r of [...results.data].reverse()) {
            if (Number(r.winner_id) === Number(this.player.id)) { current++; longest = Math.max(longest, current); }
            else { current = 0; }
          }
          this.longestWinStreak = longest;
        }

        const opponents = await axios.get(`/api/players/${this.player.id}/opponents`);
        if (opponents.data && opponents.data.length > 0) {
          const opp = opponents.data;
          this.nemesis = opp.reduce((m, o) => o.losses > (m?.losses ?? -1) ? o : m, null);
          this.favouriteVictim = opp.reduce((m, o) => o.wins > (m?.wins ?? -1) ? o : m, null);
          this.mostPlayedOpponent = opp.reduce((m, o) => o.games > (m?.games ?? -1) ? o : m, null);
        }
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

    handleLogout() {
      localStorage.removeItem("authToken");
      localStorage.removeItem("playerId");
      localStorage.removeItem("playerName");
      this.router.push("/login");
    },
  },
  mounted() {
    this.activeTab = this.$route.path.includes("settings") ? "settings" : "statistics";
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
</style>
