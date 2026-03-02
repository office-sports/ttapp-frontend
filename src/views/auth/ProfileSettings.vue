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
          :class="{ active: activeTab === 'settings' }"
          @click="activeTab = 'settings'"
        >
          <i class="far fa-play-circle"></i>
          Settings
        </RouterLink>
        <RouterLink
          to="/profile/statistics"
          class="sidebar-link"
          :class="{ active: activeTab === 'statistics' }"
          @click="activeTab = 'statistics'"
        >
          <i class="far fa-play-circle"></i>
          Statistics
        </RouterLink>
      </nav>
    </div>

    <div class="profile-content">

      <div class="content-header">
        <span v-if="activeTab === 'settings'" class="content-title">Account Settings</span>
        <span v-if="activeTab === 'statistics'" class="content-title">Statistics</span>
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
          <div class="statistics-grid">
            <div class="stat-card">
              <div class="stat-label">Current ELO</div>
              <div class="stat-value">{{ player.elo }}</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">ELO Change</div>
              <div class="stat-value" :class="{ positive: player.elo_change > 0, negative: player.elo_change < 0 }">
                {{ player.elo_change > 0 ? '+' : '' }}{{ player.elo_change }}
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Games Played</div>
              <div class="stat-value">{{ player.games_played }}</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Wins</div>
              <div class="stat-value">{{ player.wins }}</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Draws</div>
              <div class="stat-value">{{ player.draws }}</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Losses</div>
              <div class="stat-value">{{ player.losses }}</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Win %</div>
              <div class="stat-value">{{ (player.win_percentage * 100).toFixed(1) }}%</div>
            </div>
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

export default {
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
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
  gap: 20px;
  padding: 0;
  min-height: auto;
}

.profile-left {
  width: 200px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 30px;
  padding: 20px;
}

.profile-picture {
  width: 100%;
  display: flex;
  justify-content: center;
}

.circular-pic {
  width: 160px;
  height: 160px;
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
  background: var(--color-container);
  border-radius: 20px;
  border: none;
  display: flex;
  flex-direction: column;
  min-height: auto;
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

.statistics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
  margin-top: 20px;
}

.stat-card {
  background: var(--color-container);
  border: 1px solid rgba(84, 84, 84, 0.3);
  border-radius: 8px;
  padding: 15px;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 8px;
}

.stat-label {
  color: #999;
  font-size: 13px;
  font-weight: 500;
  text-transform: uppercase;
}

.stat-value {
  color: white;
  font-size: 24px;
  font-weight: 700;
}

.stat-value.positive {
  color: #40c500;
}

.stat-value.negative {
  color: #ff6b6b;
}
</style>
