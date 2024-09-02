// routes/documentRoutes.js
const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');

// Route pour récupérer tous les documents
router.get('/', documentController.getAllDocuments);

// Route pour récupérer un document par ID
router.get('/:id', documentController.getDocumentById);

// Route pour mettre à jour un document par ID
router.put('/:id', documentController.updateDocument);

// Route pour supprimer un document par ID
router.delete('/:id', documentController.deleteDocument);

// Route pour effectuer une recherche simple
router.post('/search', documentController.searchDocuments);

// Route pour effectuer une recherche avec surlignage
router.post('/search/highlight', documentController.searchDocumentsWithHighlight);

// Route pour effectuer une recherche triée par date
router.post('/search/sort/date', documentController.searchDocumentsSortedByDate);

// Route pour effectuer une recherche avec pagination
router.post('/search/paginate', documentController.searchDocumentsWithPagination);

// Nouvelle route pour servir les fichiers PDF
router.get('/files/:filename', documentController.getFile);

module.exports = router;
