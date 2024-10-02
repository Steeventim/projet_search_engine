<template>
  <div class="p-4">
    <div class="flex items-center mb-4">
      <h1 class="text-3xl font-bold text-red-600 mr-2">DOCUMENT SEARCH</h1>
      <div class="relative flex-grow">
        <input class="w-full border rounded-full py-2 px-4" placeholder="archimedes method" type="text" v-model="searchQuery" />
        <i class="fas fa-search absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500"></i>
        <button class="ml-2" @click="clearSearch">Clear</button>
      </div>
    </div>

    <div class="space-y-4">
      <ul v-if="filteredItems.length > 0">
        <li v-for="item in filteredItems" :key="item.id" class="border rounded p-4 flex items-start bg-white shadow">
          <img :alt="item.coverAlt" class="w-12 h-16 mr-4" height="70" :src="item.coverSrc" width="50" />
          <div>
            <h2 class="text-lg font-bold text-blue-600">{{ item.title }}</h2>
            <p class="text-sm text-gray-600">{{ item.pages }} Pages · {{ item.year }} · {{ item.size }} MB · <span class="text-red-600" v-if="item.new">New!</span></p>
            <p class="text-sm text-gray-700">{{ item.description }}</p>
          </div>
        </li>
      </ul>
      <p v-else-if="loading">Loading...</p>
      <p v-else>No results found.</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchQuery: '',
      items: [
        {
          id: 1,
          title: 'The Works of Archimedes',
          coverAlt: 'Cover of The Works of Archimedes',
          coverSrc: 'https://oaidalleapiprodscus.blob.core.windows.net/private/org-BVbpSZmLndA7MfHIxv2ahIKS/user-IBY8IaMXtVn7IVIdZeyvjx16/img-Tc1BQcidJIUOTUiNjDkGgf63.png?st=2024-09-02T09%3A08%3A00Z&amp;se=2024-09-02T11%3A08%3A00Z&amp;sp=r&amp;sv=2024-08-04&amp;sr=b&amp;rscd=inline&amp;rsct=image/png&amp;skoid=d505667d-d6c1-4a0a-bac7-5c84a87759f8&amp;sktid=a48cca56-e6da-484e-a814-9c849652bcb3&amp;skt=2024-09-01T20%3A36%3A17Z&amp;ske=2024-09-02T20%3A36%3A17Z&amp;sks=b&amp;skv=2024-08-04&amp;sig=Cg5wF0aTAtXjcSJToK5QghWWYR4LDLbEEYKMiLmQPBM%3D',
          pages: 514,
          year: 2002,
          size: 18.45,
          new: true,
          description: 'writings on treating mechanical problems provides a thorough exposition of Archimedes\' methods ...'
        },
        {
        id: 2,
          title: 'The Genius of Archimedes -- 23 Centuries of Influence on Mathematics, Science ...',
          coverAlt: 'Cover of The Genius of Archimedes',
          coverSrc: 'https://oaidalleapiprodscus.blob.core.windows.net/private/org-BVbpSZmLndA7MfHIxv2ahIKS/user-IBY8IaMXtVn7IVIdZeyvjx16/img-7ocuV3QikARHDQEzLASWfJJo.png?st=2024-09-02T09%3A07%3A57Z&amp;se=2024-09-02T11%3A07%3A57Z&amp;sp=r&amp;sv=2024-08-04&amp;sr=b&amp;rscd=inline&amp;rsct=image/png&amp;skoid=d505667d-d6c1-4a0a-bac7-5c84a87759f8&amp;sktid=a48cca56-e6da-484e-a814-9c849652bcb3&amp;skt=2024-09-01T17%3A42%3A16Z&amp;ske=2024-09-02T17%3A42%3A16Z&amp;sks=b&amp;skv=2024-08-04&amp;sig=H0lGraAtQVr6q4OlQexb4w6ob1pWgy1eZaQVRSP1yBQ%3D',
          pages: 526,
          year: 2010,
          size: 16.27,
          new: true,
          description: 'Calculus (Archimedes as the father of the integral calculus, method of exhaustion, approximation of pi ...'
        },
        {
          id: 3,
          title: 'The Method of Archimedes, recently discovered by Heiberg; a supplement to the ...',
          coverAlt: 'Cover of The Method of Archimedes',
          coverSrc: 'https://oaidalleapiprodscus.blob.core.windows.net/private/org-BVbpSZmLndA7MfHIxv2ahIKS/user-IBY8IaMXtVn7IVIdZeyvjx16/img-IAWFMmEPMI9sSwFjysZdIlku.png?st=2024-09-02T09%3A08%3A02Z&amp;se=2024-09-02T11%3A08%3A02Z&amp;sp=r&amp;sv=2024-08-04&amp;sr=b&amp;rscd=inline&amp;rsct=image/png&amp;skoid=d505667d-d6c1-4a0a-bac7-5c84a87759f8&amp;sktid=a48cca56-e6da-484e-a814-9c849652bcb3&amp;skt=2024-09-02T02%3A23%3A56Z&amp;ske=2024-09-03T02%3A23%3A56Z&amp;sks=b&amp;skv=2024-08-04&amp;sig=eydQpe9VIkg7hyXIMIdo1xfhOEocQyYp50N8Q7RvxF4%3D',
          pages: 53,
          year: 1912,
          size: 2.17,
          new: true,
          description: 'The Method of Archimedes, recently discovered by Heiberg; a supplement to the Works of Archimedes ...'
        }
      ], // your items array
      loading: false,
    }
  },
  computed: {
    filteredItems() {
      return this.items.filter(item => item.title.toLowerCase().includes(this.searchQuery.toLowerCase()));
    }
  },
  watch: {
    searchQuery() {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
      }, 500); // debounce for 500ms
    }
  },
  methods: {
    clearSearch() {
      this.searchQuery = '';
    }
  }
}
</script>