<template>
  <div class="w-full">
    <!-- Main Navigation with Office Selector on same line -->
    <div class="w-full flex justify-between items-center">
      <nav class="flex items-center space-x-3">
        <RouterLink to="/">
          <img src="@/assets/images/favicon.ico" class="logo" alt="LOGO" />
        </RouterLink>
        <RouterLink to="/"> TTAPP</RouterLink>
        <RouterLink to="/tournaments">tournaments</RouterLink>
        <RouterLink to="/players">players</RouterLink>
        <RouterLink to="/leaders">leaders</RouterLink>
        <!-- Login link when not logged in -->
        <RouterLink v-if="!isLoggedIn" to="/login" class="nav-link" style="color:#fcd34d">login</RouterLink>
      </nav>

      <div class="office-selector-top">
        <span class="sep">|</span>
        office
        <select
          class="textInput"
          @change="changeOffice()"
          v-model="this.officeId"
          v-if="this.offices"
        >
          <template v-for="office in this.offices">
            <option :value="office.id" v-if="office" v-bind:key="office.id">
              {{ office.name }}
            </option>
          </template>
        </select>
      </div>
    </div>

    <!-- Logged-in User Info Panel (only visible when logged in) -->
    <div v-if="isLoggedIn" class="user-info-panel marb20">
      <div class="user-info-left">
        <span class="logged-user">{{ userName }}</span>
      </div>
      <div class="user-info-right">
          <div v-if="pendingCount > 0 || settledCount > 0" class="reschedule-info">
            <span class="reschedule-info-label">reschedules</span>
            <RouterLink to="/profile" class="reschedule-count-link">
              <span v-if="pendingCount > 0" class="notif-badge notif-pending">{{ pendingCount }} pending</span>
              <span v-if="settledCount > 0" class="notif-badge notif-settled">{{ settledCount }} settled</span>
            </RouterLink>
          </div>
          <span v-if="pendingCount > 0 || settledCount > 0" class="text-gray-500">|</span>
          <RouterLink to="/profile" class="nav-link">settings</RouterLink>
          <template v-if="isAdmin">
            <span class="text-gray-500">|</span>
            <RouterLink to="/admin" class="nav-link nav-admin">admin</RouterLink>
          </template>
          <span class="text-gray-500">|</span>
          <a href="#" class="nav-link" @click.prevent="logout">logout</a>
        </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      offices: [],
      officeId: 0,
      isLoggedIn: false,
      userName: "",
      isAdmin: false,
      pendingCount: 0,
      settledCount: 0,
    };
  },
  methods: {
    changeOffice() {
      localStorage.setItem("officeId", this.officeId);
      window.location.reload();
    },
    logout() {
      localStorage.removeItem("authToken");
      localStorage.removeItem("playerId");
      localStorage.removeItem("playerName");
      localStorage.removeItem("isAdmin");
      this.isLoggedIn = false;
      this.userName = "";
      this.$router.push("/login");
    },
    checkAuthStatus() {
      this.isLoggedIn = !!localStorage.getItem("authToken");
      this.userName = localStorage.getItem("playerName") || "";
      this.isAdmin = localStorage.getItem("isAdmin") === "1";
      if (this.isLoggedIn) this.fetchPendingCount();
      else { this.pendingCount = 0; this.settledCount = 0; }
    },
    async fetchPendingCount() {
      const playerId = localStorage.getItem("playerId");
      const token = localStorage.getItem("authToken");
      if (!playerId || !token) return;
      try {
        const res = await axios.get(`/api/players/${playerId}/reschedule`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const myId = Number(playerId);
        const requests = res.data || [];
        this.pendingCount = requests.filter(r => r.status === 'pending').length;
        this.settledCount = requests.filter(r => ['accepted','declined','revoked'].includes(r.status)).length;
      } catch (_) { this.pendingCount = 0; }
    },
  },
  watch: {
    $route() {
      this.checkAuthStatus();
    }
  },
  mounted() {
    this.officeId = localStorage.getItem("officeId") ?? "1";
    this.checkAuthStatus();

    // Listen for auth status changes
    window.addEventListener('authStatusChanged', () => {
      this.checkAuthStatus();
    });
    window.addEventListener('rescheduleUpdated', () => {
      if (this.isLoggedIn) this.fetchPendingCount();
    });

    // Listen for storage changes (auth token updates)
    window.addEventListener('storage', () => {
      this.checkAuthStatus();
    });

    axios
      .all([axios.get("/api/offices")])
      .then(
        axios.spread((o) => {
          this.offices = o.data;
        })
      )
      .catch((error) => {
        console.log(error);
      });
  },
};
</script>

<style>
.logo {
  width: 16px;
  height: 16px;
}

.textInput {
  border: 1px solid rgba(84, 84, 84, 0.65);
  border-radius: 4px;
  padding: 5px 8px;
  background: var(--col-dark);
  color: white;
  font-size: 15px;
  font-family: inherit;
}

.textInput:focus {
  border: 1px solid rgba(200, 200, 200, 1);
  outline: rgba(200, 200, 200, 1);
}

.nav-link {
  color: white;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
}

.notif-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 700;
  height: 16px;
  border-radius: 8px;
  padding: 0 6px;
  line-height: 1;
  color: #fff;
}
.notif-pending { background: #2a6496; }
.notif-settled { background: #4a7c59; }

.reschedule-info {
  display: flex;
  align-items: center;
  gap: 5px;
}
.reschedule-info-label {
  font-size: 11px;
  color: #555;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.reschedule-count-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  text-decoration: none;
}

.nav-link:hover {
  color: #808082;
}
.nav-admin { color: #e0b96c; }
.nav-admin:hover { color: #c9963a; }

.sep {
  margin: 0 8px;
  color: #565656;
}

.office-selector-top {
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-info-panel {
  border-radius: 15px;
  border: none;
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--color-container);
}

.user-info-left {
  display: flex;
  align-items: center;
}

.user-info-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.logged-user {
  color: #269a47;
  font-weight: 600;
  font-size: 14px;
}
</style>
