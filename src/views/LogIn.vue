<template>
  <div>
    <div v-if="loading">
      <div class="titleOne row">
        <h1>Welcome Keyence</h1>
      </div>
      <div class="login-box">
        <div class="btn-group mb-4" role="group" aria-label="Basic radio toggle button group">
          <input
            @click="checkLogIn(1)"
            type="radio"
            class="btn-check"
            name="btnradio"
            id="btnradio1"
            checked
          />
          <label class="btn btn-outline-light" for="btnradio1" style="font-size: 20px;">Log In</label>

          <input
            @click="checkLogIn(0)"
            type="radio"
            class="btn-check"
            name="btnradio"
            id="btnradio3"
          />
          <label class="btn btn-outline-light" for="btnradio3" style="font-size: 20px;">Sing In</label>
        </div>

        <!-- Form for Log In -->
        <form v-if="logIn">
          <div class="user-box">
            <input type="text" name required v-model="userName" />
            <label>Username</label>
          </div>
          <div class="user-box">
            <input type="password" name required v-model="password" />
            <label>Password</label>
          </div>
          <a href="#" @click="singIn" v-if="userName.length > 0 && password.length > 0">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            Submit
          </a>
        </form>
        <!-- Form for Sing In -->
        <form v-if="!logIn">
          <div class="user-box">
            <input type="text" name required v-model="newUserName" />
            <label>Username</label>
          </div>
          <div class="user-box">
            <input type="text" name required v-model="newEmal" />
            <label>Email</label>
          </div>
          <div class="user-box">
            <input type="password" name required v-model="newPassword" />
            <label>Set Password</label>
          </div>
          <a
            href="#"
            @click="signUp"
            v-if="newUserName.length > 0 && newEmal.length > 0 && newPassword.length > 0"
          >
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            Submit
          </a>
        </form>
      </div>
    </div>
    <div class="loading-box" v-if="!loading">
      <Loading />
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { ref } from "vue";
import { useStore } from "vuex";
import router from "@/router";
import Swal from "sweetalert2";
import Loading from "../components/Loading.vue";

const api = "http://localhost:3000/api";
const logIn = ref(true);
const store = useStore();
const loading = ref(true);

// Variables para el logIn
const userName = ref("");
const password = ref("");

//Variables para el SingIn
const newUserName = ref("");
const newEmal = ref("");
const newPassword = ref("");

const checkLogIn = option => {
  option == 1 ? (logIn.value = true) : (logIn.value = false);
};

//Funcion para hacer el Log In
const singIn = async () => {
  try {
    loading.value = false;
    const res = await axios.post(api + "/signIn", {
      email: userName.value,
      password: password.value
    });
    if (res.status == 200) {
      loading.value = true;
      let tokenProvided = res.data.token;
      let status = true;
      store.commit("setUserAuth", status);
      localStorage.setItem("token", tokenProvided);
      // console.log(store.state.userAuth);
      router.push("/dashboard");
      cleanData(1);
    }
  } catch (error) {
    let status = false;
    store.commit("setUserAuth", status);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Credenciales invalidas, intenta de nuevo"
    });
    loading.value = true;
    cleanData(1);
  }
};

//Funcion para hacer el Log In
const signUp = async () => {
  try {
    loading.value = false;
    const res = await axios.post(api + "/signUp", {
      userName: newUserName.value,
      email: newEmal.value,
      password: newPassword.value
    });
    if (res.status == 200) {
      loading.value = true;
      let tokenProvided = res.data.token;
      let status = true;
      store.commit("setUserAuth", status);
      localStorage.setItem("token", tokenProvided);
      // console.log(store.state.userAuth);
      router.push("/dashboard");
      cleanData(0);
    }
  } catch (error) {
    let status = false;
    store.commit("setUserAuth", status);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Credenciales invalidas, intenta de nuevo"
    });
    loading.value = true;
    cleanData(0);
  }
};

const cleanData = option => {
  if (option == 1) {
    userName.value = "";
    password.value = "";
  } else if (option == 0) {
    newUserName.value = "";
    newEmal.value = "";
    newPassword.value = "";
  }
};
</script>

<style>
html {
  height: 100%;
}
body {
  margin: 0;
  padding: 0;
  font-family: sans-serif;
  background: linear-gradient(#141e30, #243b55);
}
.titleOne {
  position: absolute;
  top: 15%;
  left: 39%;
  padding: 40px;
  color: white;
}
.login-box {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 400px;
  padding: 40px;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.5);
  box-sizing: border-box;
  box-shadow: 0 15px 25px rgba(0, 0, 0, 0.6);
  border-radius: 10px;
}
.loading-box {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 400px;
  padding: 40px;
  transform: translate(-50%, -50%);
  background: rgba(255, 255, 255, 0);
  box-sizing: border-box;
  box-shadow: 0 15px 25px rgba(255, 255, 255, 0);
  border-radius: 10px;
}

.login-box h2 {
  margin: 0 0 30px;
  padding: 0;
  color: #fff;
  text-align: center;
}

.login-box .user-box {
  position: relative;
}

.login-box .user-box input {
  width: 100%;
  padding: 10px 0;
  font-size: 16px;
  color: #fff;
  margin-bottom: 30px;
  border: none;
  border-bottom: 1px solid #fff;
  outline: none;
  background: transparent;
}
.login-box .user-box label {
  position: absolute;
  top: 0;
  left: 0;
  padding: 10px 0;
  font-size: 16px;
  color: #fff;
  pointer-events: none;
  transition: 0.5s;
}

.login-box .user-box input:focus ~ label,
.login-box .user-box input:valid ~ label {
  top: -20px;
  left: 0;
  color: #03e9f4;
  font-size: 12px;
}

.login-box form a {
  position: relative;
  display: inline-block;
  padding: 10px 20px;
  color: #03e9f4;
  font-size: 16px;
  text-decoration: none;
  text-transform: uppercase;
  overflow: hidden;
  transition: 0.5s;
  margin-top: 40px;
  letter-spacing: 4px;
}

.login-box a:hover {
  background: #03e9f4;
  color: #fff;
  border-radius: 5px;
  box-shadow: 0 0 5px #03e9f4, 0 0 25px #03e9f4, 0 0 50px #03e9f4,
    0 0 100px #03e9f4;
}

.login-box a span {
  position: absolute;
  display: block;
}

.login-box a span:nth-child(1) {
  top: 0;
  left: -100%;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #03e9f4);
  animation: btn-anim1 1s linear infinite;
}

@keyframes btn-anim1 {
  0% {
    left: -100%;
  }
  50%,
  100% {
    left: 100%;
  }
}

.login-box a span:nth-child(2) {
  top: -100%;
  right: 0;
  width: 2px;
  height: 100%;
  background: linear-gradient(180deg, transparent, #03e9f4);
  animation: btn-anim2 1s linear infinite;
  animation-delay: 0.25s;
}

@keyframes btn-anim2 {
  0% {
    top: -100%;
  }
  50%,
  100% {
    top: 100%;
  }
}

.login-box a span:nth-child(3) {
  bottom: 0;
  right: -100%;
  width: 100%;
  height: 2px;
  background: linear-gradient(270deg, transparent, #03e9f4);
  animation: btn-anim3 1s linear infinite;
  animation-delay: 0.5s;
}

@keyframes btn-anim3 {
  0% {
    right: -100%;
  }
  50%,
  100% {
    right: 100%;
  }
}

.login-box a span:nth-child(4) {
  bottom: -100%;
  left: 0;
  width: 2px;
  height: 100%;
  background: linear-gradient(360deg, transparent, #03e9f4);
  animation: btn-anim4 1s linear infinite;
  animation-delay: 0.75s;
}

@keyframes btn-anim4 {
  0% {
    bottom: -100%;
  }
  50%,
  100% {
    bottom: 100%;
  }
}
</style>