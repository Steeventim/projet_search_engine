<template>
  <div class="container mt-4">
    <!-- Zone de recherche -->
    <div class="search-bar mb-4">
      <input v-model="input" @input="filterData" class="form-control" placeholder="Search..." />
      <button @click="searchDocuments" class="btn btn-primary mt-2">Search</button>
    </div>

    <!-- Liste des résultats -->
    <div class="row">
      <div v-for="item in paginatedItems" :key="item.id" class="col-md-4 mb-4">
        <div class="card">
          <div class="card-body">
          
            <!-- Contenu avec surbrillance -->
            <div v-html="getHighlightedSnippet(item.content)" class="content-text mb-3"></div>

            <!-- Informations supplémentaires sur le document -->
            <p><strong>Filename:</strong> {{ item.filename }}</p>
            <p><strong>Filesize:</strong> {{ item.filesize }} bytes</p>
            <p><strong>Created Date:</strong> {{ item.createdDate }}</p>
            <p><strong>Virtual Path:</strong> {{ item.virtualPath }}</p>

            <!-- Bouton pour visualiser le fichier -->
            <button class="btn btn-primary mt-2" @click="openPdfViewer(item.virtualPath)">View File</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <nav aria-label="Page navigation">
      <ul class="pagination">
        <li class="page-item">
          <button class="page-link" @click="changePage(currentPage - 1)" :disabled="currentPage <= 1">Previous</button>
        </li>
        <li class="page-item">
          <span class="page-link">{{ currentPage }} / {{ totalPages }}</span>
        </li>
        <li class="page-item">
          <button class="page-link" @click="changePage(currentPage + 1)" :disabled="currentPage >= totalPages">Next</button>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
export default {
  data() {
    return {
      input: '',
      items: [], // Remplir avec les données des résultats de recherche
      currentPage: 1,
      itemsPerPage: 10,
      filteredItems: [], // Liste filtrée des résultats
      pdfUrl: ''
    };
  },
  methods: {
    filterData() {
      this.currentPage = 1;
      if (this.input.trim() === "") {
        this.filteredItems = this.items;
      } else {
        this.filteredItems = this.items.filter(item =>
          item.content.toLowerCase().includes(this.input.toLowerCase()) ||
          item.filename.toLowerCase().includes(this.input.toLowerCase())
        );
      }
    },
    getHighlightedSnippet(text) {
      if (!this.input.trim()) return text;
      const query = this.input.toLowerCase();
      const regex = new RegExp(`(${query})`, 'gi');
      return text.replace(regex, '<mark>$1</mark>');
    },
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
    openPdfViewer(filename) {
      if (filename) {
        this.pdfUrl = `http://localhost:3000/api/documents/files/${encodeURIComponent(filename)}`;
      } else {
        console.error('Nom du fichier non défini');
      }
    }
  },
  computed: {
    paginatedItems() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredItems.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredItems.length / this.itemsPerPage);
    }
  }
};
</script>

<style scoped>
.search-bar {
  max-width: 600px;
  margin: 0 auto;
}

.card {
  border: 1px solid #ddd;
  border-radius: 0.25rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.card-body {
  flex-grow: 1;
}

.content-text {
  white-space: pre-wrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-height: 150px;
}

.pagination {
  justify-content: center;
}
</style>
