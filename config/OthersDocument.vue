<template>
  <div>
    <input
      type="text"
      v-model="input"
      placeholder="Rechercher des documents..."
      @input="filterData"
    />

    <div class="results-container">
      <div class="item" v-for="item in filteredItems" :key="item.id">
        <h2 v-html="highlightText(item.filename)"></h2>

      <p v-html="highlightText(item.content.substring(0, 100)) + (item.content.length > 100 ? '...' : '')"></p>
        <p><strong>Taille :</strong> {{ item.filesize }} bytes</p>
        <p><strong>Créé le :</strong> {{ item.createdDate }}</p>
        <!-- <p><strong>URL :</strong> <a :href="item.url" target="_blank">Ouvrir le fichier</a></p> -->  
        <!-- <p><strong>URL :</strong> <a :href="item.url" target="_blank" @click.prevent="openPdf(item.url)">Ouvrir le fichier</a></p> -->
        <p><strong>URL :</strong> <a :href="item.url" target="_blank" @click.prevent="openPdf(item.url)">Ouvrir le fichier</a></p>

        <p><strong>Chemin Virtuel :</strong> {{ item.virtualPath }}</p>
      </div>
      <div class="item error" v-if="input && !filteredItems.length">
        <p>Aucun résultat trouvé !</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
// import { PDFDocument, PDFpage} from 'pdfjs-dist';

const input = ref("");
// const sortOrder = ref("desc"); // Option de tri par défaut
const items = ref([]);
const filteredItems = ref([]);

// Fonction pour récupérer et prétraiter les données
const fetchData = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/documents');
    const data = await response.data;
    // console.log(data);
    items.value = preprocessData(data);
    // filteredItems.value = items.value;
    filterData(); // Met à jour les éléments filtrés

  } catch (error) {
    console.error("Erreur lors de la récupération des données :", error);
  }
};

// Fonction pour prétraiter les données
const preprocessData = (data) => {
  return data.map(item => ({
    id: item._id,
    content: item._source.content,
    filename: item._source.file.filename,
    filesize: item._source.file.filesize,
    createdDate: new Date(item._source.file.created).toLocaleDateString(),
    // created: new Date(item._source.file.created), // Ajout pour faciliter le tri
    url: item._source.file.url,
    virtualPath: item._source.path.virtual,
  }));
};


const filterData = () => {
  if (input.value.trim() === "") {
    filteredItems.value = items.value;
  } else {
    filteredItems.value = items.value.filter(item =>
      item.content.toLowerCase().includes(input.value.toLowerCase()) ||
      item.filename.toLowerCase().includes(input.value.toLowerCase())
    );
  }
};

// Fonction pour surligner le texte
const highlightText = (text) => {
  if (!input.value.trim()) return text;
  const regex = new RegExp(`(${input.value})`, 'gi');
  return text.replace(regex, '<span class="highlight">$1</span>');
};


// Récupérer les données au montage du composant
onMounted(fetchData);
</script>

<style>

</style>
