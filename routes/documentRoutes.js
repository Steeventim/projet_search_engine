// routes/documentRoutes.js
const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');


router.get('/', documentController.getAllDocuments);
router.get('/:id', documentController.getDocumentById);
// router.post('/', documentController.addDocument);
router.put('/:id', documentController.updateDocument);
router.delete('/:id', documentController.deleteDocument);
router.post('/search', documentController.searchDocuments);
router.post('/search/highlight', documentController.searchDocumentsWithHighlight);



module.exports = router;
