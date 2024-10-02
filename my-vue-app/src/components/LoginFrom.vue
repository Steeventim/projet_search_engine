<template>
  <div class="container">
    <!-- Étape de connexion ou d'inscription -->
    <div v-if="step === 1">
      <div class="login-section">
        <h4 class="text-center">Login to Your Account</h4>
        <p class="text-center grey-text">
          Log in to your account so you can continue building and editing your
          onboarding flows
        </p>
        <div class="form-container">
          <form @submit.prevent="submitLogin" novalidate>
            <input
              type="email"
              v-model="loginEmail"
              :class="{ 'is-invalid': !valid && !loginEmail }"
              placeholder="Email"
              class="form-control"
            />
            <input
              type="password"
              v-model="loginPassword"
              :class="{ 'is-invalid': !valid && !loginPassword }"
              placeholder="Password"
              class="form-control"
            />
            <div class="form-check">
              <input
                type="checkbox"
                v-model="rememberMe"
                id="rememberMe"
                class="form-check-input"
              />
              <label for="rememberMe">Remember Me</label>
            </div>
            <button type="submit" :disabled="!valid" class="btn btn-primary">
              Log in
            </button>
          </form>
        </div>
        <div class="signup-link">
          <p>Don't Have an Account Yet?</p>
          <button @click="step++" class="btn btn-outline-primary">
            SIGN UP
          </button>
        </div>
      </div>
    </div>

    <!-- Étape d'inscription -->
    <div v-else-if="step === 2">
      <div class="signup-section">
        <h4 class="text-center">Sign Up for an Account</h4>
        <p class="text-center grey-text">
          Let's get you all set up so you can start creating your first
          onboarding experience
        </p>
        <div class="form-container">
          <form @submit.prevent="submitSignup" novalidate>
            <input
              type="text"
              v-model="signupFirstName"
              :class="{ 'is-invalid': !valid && !signupFirstName }"
              placeholder="First Name"
              class="form-control"
            />
            <input
              type="text"
              v-model="signupLastName"
              :class="{ 'is-invalid': !valid && !signupLastName }"
              placeholder="Last Name"
              class="form-control"
            />
            <input
              type="email"
              v-model="signupEmail"
              :class="{ 'is-invalid': !valid && !signupEmail }"
              placeholder="Email"
              class="form-control"
            />
            <input
              type="password"
              v-model="signupPassword"
              :class="{ 'is-invalid': !valid && !signupPassword }"
              placeholder="Password"
              class="form-control"
            />
            <div class="form-check">
              <input
                type="checkbox"
                v-model="termsAccepted"
                id="termsAccepted"
                class="form-check-input"
              />
              <label for="termsAccepted">I Accept Terms & Conditions</label>
            </div>
            <button
              type="submit"
              :disabled="!valid || !termsAccepted"
              class="btn btn-primary"
            >
              Sign up
            </button>
          </form>
        </div>
        <div class="login-link">
          <p>Already Signed up?</p>
          <button @click="step--" class="btn btn-outline-primary">
            Log in
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      step: 1,
      valid: true, // Assume form is valid for simplicity
      loginEmail: "",
      loginPassword: "",
      rememberMe: false,
      signupFirstName: "",
      signupLastName: "",
      signupEmail: "",
      signupPassword: "",
      termsAccepted: false,
    };
  },
  methods: {
    submitLogin() {
      if (this.loginEmail && this.loginPassword) {
        console.log(
          "Login submitted with:",
          this.loginEmail,
          this.loginPassword
        );
      } else {
        this.valid = false;
      }
    },
    submitSignup() {
      if (
        this.signupFirstName &&
        this.signupLastName &&
        this.signupEmail &&
        this.signupPassword &&
        this.termsAccepted
      ) {
        console.log(
          "Signup submitted with:",
          this.signupFirstName,
          this.signupLastName,
          this.signupEmail
        );
      } else {
        this.valid = false;
      }
    },
  },
};
</script>

<style scoped>
.container {
  background-color: beige;
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
}
.form-container {
  margin-top: 20px;
}
.form-control {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
}
.form-check {
  margin-bottom: 10px;
}
.is-invalid {
  border-color: red;
}
.btn {
  width: 100%;
}
.signup-link,
.login-link {
  text-align: center;
  margin-top: 20px;
}
</style>
