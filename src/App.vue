<template>
  <header class="header">
    <div style="display: flex; align-items: center; font-size: 30px; color: white;">
      <img style="width: 100px;" alt="Vue logo" src="./assets/logo.png">
      <h2>Lógica Descomplicada</h2>
    </div>
    <ul
      style="width: 30%; justify-content: space-around; align-items: center; display: flex; height: 50px;">
      <li><router-link to="/">INÍCIO</router-link></li>
      <li><router-link to="jogo">TABELA VERDADE</router-link></li>
      <li><router-link to="jogo">JOGO TABELA VERDADE</router-link></li>
      <li><router-link to="/">QUEM SOMOS</router-link></li>
    </ul>
  </header>
  <main style="display: flex; justify-content: center; margin-top: 150px;">
    <router-view></router-view>
  </main>
</template>

<script setup>
import router from './router';


</script>

<style scoped>
.header {
  display: flex;
  margin: 0 50px 0 50px;
  align-items: center;
  justify-content: space-between;
  font-family: "Roboto", sans-serif;
  font-weight: 400;
  font-style: normal;
}

ul li a {
  font-size: 14px;
  color: white;
  text-decoration: none;
}

ul li a:hover {
  color: blueviolet;
}
</style>
