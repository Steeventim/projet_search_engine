<template>
  <router-view />
</template>

<script>
// import DocumentList from "./components/testInterface.vue";
export default {
  name: "App",
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

em {
  background-color: #ffff00; /* Couleur de fond jaune */
  color: #000; /* Couleur du texte noir */
  padding: 0.1em; /* Espacement autour du texte */
  border-radius: 0.2em; /* Coins arrondis */
}

header {
  margin-bottom: 20px;
}
</style>
