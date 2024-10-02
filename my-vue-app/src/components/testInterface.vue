<template>
  <div class="container mt-4" style="max-width: 1200px; margin: 0 auto">
    <!-- Barre de navigation -->
    <nav
      class="navbar mb-4"
      style="background-color: #337ab7; padding: 10px; border-radius: 10px"
    >
      <div class="navbar-brand" style="color: #fff" size="50px">
        Document Search
      </div>
      <div>
        <button class="btn btn-light" @click="goToLogin">connexion</button>
      </div>
    </nav>

    <!-- Zone de recherche -->
    <div
      class="search-bar mb-4 d-flex"
      style="background-color: #f7f7f7; padding: 20px; border-radius: 10px"
    >
      <!-- Ajout de la classe 'me-2' pour l'espacement -->
      <input
        v-model="input"
        @input="filterData"
        class="form-control me-2"
        placeholder="Search..."
        style="
          height: 40px;
          font-size: 16px;
          padding: 10px;
          border: 1px solid #ccc;
        "
      />

      <button @click="searchDocuments" class="btn btn-primary">Search</button>
    </div>

    <!-- Message si aucun résultat -->
    <div v-if="filteredItems.length === 0">
      <p>Aucun document ne correspond à votre recherche.</p>
    </div>

    <!-- Liste des résultats -->
    <div class="result-list">
      <div v-for="item in paginatedItems" :key="item.id" class="result-card">
        <div class="content">
          <!-- Titre sous forme de lien hypertexte -->
          <h3>
            <a
              href="#"
              @click.prevent="openPdfInNewPage(item.virtualPath)"
              style="color: #337ab7; text-decoration: underline"
            >
              {{ item.filename }}
            </a>
          </h3>
          <p><strong>Created Date:</strong> {{ item.createdDate }}</p>
          <!-- Bouton pour afficher plus de détails -->
          <button
            class="btn btn-secondary"
            @click="item.showDetails = !item.showDetails"
          >
            {{
              item.showDetails
                ? "Masquer les détails"
                : "Afficher plus de détails"
            }}
          </button>

          <!-- Section détaillée cachée par défaut -->
          <div v-if="item.showDetails" class="details mt-2">
            <p><strong>Filesize:</strong> {{ item.filesize }} bytes</p>
            <div
              v-html="getHighlightedSnippet(item.highlight.content)"
              class="content-text mb-3"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div class="pagination-controls">
      <button
        @click="currentPage--"
        :disabled="currentPage === 1"
        class="btn btn-secondary"
      >
        Précédent
      </button>
      <span>Page {{ currentPage }} sur {{ totalPages }}</span>
      <button
        @click="currentPage++"
        :disabled="currentPage >= totalPages"
        class="btn btn-secondary"
      >
        Suivant
      </button>
    </div>
  </div>
</template>

<script>
// import authService from "@/services/authService"; // Importer le service d'authentification

export default {
  data() {
    return {
      input: "", // Contient la valeur du champ de recherche
      items: [], // Liste des documents obtenus après la recherche
      currentPage: 1, // Page actuelle pour la pagination
      itemsPerPage: 10, // Nombre d'éléments affichés par page
      filteredItems: [], // Liste des documents après filtrage basé sur le terme de recherche
      dropdownOpen: false, // État pour contrôler l'affichage du menu déroulant
    };
  },
  methods: {
    toggleDropdown() {
      this.dropdownOpen = !this.dropdownOpen; // Bascule l'état du menu déroulant
    },
    goToLogin() {
      this.$router.push("/login");
      // window.open(pdfUrl, "_blank");
    },
    async searchDocuments() {
      try {
        const response = await fetch(
          "http://localhost:3000/api/documents/search",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ query: this.input }),
          }
        );
        const data = await response.json();
        this.items = this.preprocessData(data);
        this.filterData(); // Appliquer le filtre après la recherche
      } catch (error) {
        console.error("Erreur lors de la recherche:", error);
      }
    },
    preprocessData(data) {
      return data.map((item) => ({
        id: item._id,
        content: item._source.content,
        filename: item._source.file.filename,
        filesize: item._source.file.filesize,
        createdDate: new Date(item._source.file.created).toLocaleDateString(),
        virtualPath: item._source.path.virtual,
        highlight: item.highlight || { content: [] }, // Assurez-vous d'inclure les highlights
        showDetails: false, // Par défaut, les détails sont cachés
      }));
    },
    filterData() {
      this.currentPage = 1;
      if (this.input.trim() === "") {
        this.filteredItems = this.items;
      } else {
        this.filteredItems = this.items.filter(
          (item) =>
            item.content.toLowerCase().includes(this.input.toLowerCase()) ||
            item.filename.toLowerCase().includes(this.input.toLowerCase())
        );
      }
    },
    getHighlightedSnippet(text) {
      if (Array.isArray(text)) {
        text = text.join(" ");
      }
      if (typeof text !== "string") {
        return text;
      }
      if (this.input.trim()) {
        const query = this.input.toLowerCase();
        const regex = new RegExp(`(${query})`, "gi");
        return text.replace(regex, "<mark>$1</mark>");
      }
      return text;
    },
    openPdfInNewPage(virtualPath) {
      if (virtualPath) {
        const searchTerm = this.input;
        const pdfUrl = `http://localhost:3000/api/documents/files/fixedPages/${encodeURIComponent(
          virtualPath
        )}?searchTerm=${encodeURIComponent(searchTerm)}`;
        window.open(pdfUrl, "_blank");
      } else {
        console.error("Le chemin virtuel n'est pas défini");
      }
    },
  },
  computed: {
    paginatedItems() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredItems.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredItems.length / this.itemsPerPage);
    },
  },
};
</script>

<style scoped>
body {
  background-color: #666;
}
.btn-primary {
  height: 40px;
  font-size: 16px;
  padding: 10px;
  border: none;
  border-radius: 10px;
  background-color: #337ab7;
  color: #fff;
}

.btn-secondary {
  height: 30px;
  font-size: 14px;
  padding: 5px;
  border: none;
  border-radius: 5px;
  background-color: #666;
  color: #fff;
}

.search-bar {
  max-width: 600px;
  margin: 0 auto;
  display: flex; /* Aligner les éléments sur la même ligne */
  align-items: center; /* Centrer verticalement */
}

.result-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.result-card {
  background-color: white;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
}

.content {
  text-align: left;
}

.details {
  background-color: #f9f9f9;
  padding: 10px;
  border-radius: 8px;
}

.content-text {
  white-space: pre-wrap;
  font-size: 14px;
  color: #666;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
}
</style>
