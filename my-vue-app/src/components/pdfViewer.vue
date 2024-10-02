<template>
  <div id="pdf-viewer"></div>
</template>

<script>
import { GlobalWorkerOptions, getDocument } from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.js'; // Utiliser le bon chemin ici

export default {
  props: {
    pdfUrl: {
      type: String,
      required: true
    }
  },
  mounted() {
    GlobalWorkerOptions.workerSrc = pdfWorker;
    this.loadPdf();
  },
  methods: {
    async loadPdf() {
      if (this.pdfUrl) {
        const loadingTask = getDocument(this.pdfUrl);
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(1); // Charger la première page
        
        const scale = 1.5;
        const viewport = page.getViewport({ scale });
        
        // Préparer le canvas
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        document.getElementById('pdf-viewer').appendChild(canvas);
        
        // Rendre la page
        const renderContext = {
          canvasContext: context,
          viewport: viewport
        };
        await page.render(renderContext).promise;
      }
    }
  }
};
</script>
