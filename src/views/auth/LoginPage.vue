<template>
  <div class="login-wrapper">
    <div class="login-header">
      <div class="login-title">TTAPP User Panel</div>
      <div class="login-subtitle">Sign in to your account</div>
    </div>
    <div class="round-container login-box">
      <form @submit.prevent="handleLogin">
        <div class="form-group marb10">
          <input
            v-model="form.slackName"
            type="text"
            class="form-input"
            placeholder="Username"
            required
          />
        </div>

        <div class="form-group marb10">
          <input
            v-model="form.password"
            type="password"
            class="form-input"
            placeholder="Password"
            required
          />
        </div>

        <div v-if="error" class="round-container-errors marb15">
          {{ error }}
        </div>

        <div class="form-group mart20 marb10">
          <button type="submit" class="btn-submit login-button" :disabled="loading">
            {{ loading ? "Logging in..." : "Login" }}
          </button>
        </div>
      </form>
    </div>
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
      form: {
        slackName: "",
        password: "",
      },
      error: "",
      loading: false,
    };
  },
  methods: {
    async handleLogin() {
      this.error = "";
      this.loading = true;

      try {
        const response = await axios.post("/api/auth/login", {
          slack_name: this.form.slackName,
          password: this.form.password,
        });

        if (response.data.token) {
          localStorage.setItem("authToken", response.data.token);
          localStorage.setItem("playerId", response.data.player_id);
          localStorage.setItem("playerName", response.data.name);
          
          // Dispatch custom event to notify TopMenu
          window.dispatchEvent(new Event('authStatusChanged'));
          
          // Check if password change is required
          if (response.data.must_change_password) {
            localStorage.setItem("mustChangePassword", "true");
            this.router.push("/profile?passwordRequired=true");
          } else {
            this.router.push("/");
          }
        }
      } catch (error) {
        this.error =
          error.response?.data?.error || "Login failed. Please try again.";
      } finally {
        this.loading = false;
      }
    },
  },
  mounted() {
    if (localStorage.getItem("authToken")) {
      this.router.push("/");
    }
  },
};
</script>

<style scoped>
.login-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  min-height: 100vh;
  padding: 40px 20px;
  padding-top: 60px;
}

.login-title {
  font-size: 24px;
  font-weight: 600;
  color: white;
  margin-bottom: 5px;
}

.login-header {
  margin-bottom: 20px;
  text-align: center;
}

.login-subtitle {
  font-size: 15px;
  color: #269a47;
}

.login-box {
  width: 100%;
  max-width: 350px;
  padding: 20px;
  box-sizing: border-box;
}

.form-group {
  display: flex;
  flex-direction: column;
  width: 100%;
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

.text-center {
  text-align: center;
}

.marb15 {
  margin-bottom: 15px;
}

.marb10 {
  margin-bottom: 10px;
}

.round-container-errors {
  color: #ff6b6b;
  padding: 8px 12px;
  font-size: 13px;
  border-radius: 4px;
}

.btn-submit {
  padding: 6px 16px;
  font-size: 14px;
}

.login-button {
  width: 100%;
  padding: 6px 8px;
  height: 32px;
  font-size: 14px;
  text-transform: none;
}
</style>
