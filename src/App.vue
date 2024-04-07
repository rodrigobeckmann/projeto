<template>
  <header class="header">
    <div style="display: flex; align-items: center; font-size: 50px;">
      <img style="width: 200px;" alt="Vue logo" src="./assets/logo.png">
      <h2>Lógica Descomplicada</h2>
    </div>
    <ul style="width: 100%; justify-content: space-around; align-items: center; display: flex; background-color: #a0a8a8; height: 50px;">
      <li><router-link to="/">INÍCIO</router-link></li>
      <li><router-link to="jogo">TABELA VERDADE</router-link></li>
      <li><router-link to="jogo">JOGO TABELA VERDADE</router-link></li>
      <li><router-link to="/">QUEM SOMOS</router-link></li>
    </ul>
  </header>
  <main style="display: flex; justify-content: center;">
    <router-view></router-view>
  </main>
</template>

<script setup>
import router from './router';


</script>

<style scoped>
  .header {
    display: flex;
    width: 100%;
    flex-direction: column;
    margin-bottom: 50px;
  }

  ul li a{
    font-size: 30px;
    color: white;
    text-decoration: none;
  }
</style>

