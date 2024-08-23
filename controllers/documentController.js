// controllers/documentController.js
const elasticsearchService = require('../services/elasticsearchService');

// Récupérer tous les documents
const getAllDocuments = async (req, res) => {
  try {
    const documents = await elasticsearchService.getAllDocuments();
    res.json(documents);
  } catch (error) {
    res.status(500).send('Erreur lors de la récupération des documents');
  }
};

// Récupérer un document par ID
const getDocumentById = async (req, res) => {
  try {
    const document = await elasticsearchService.getDocumentById(req.params.id);
    res.json(document);
  } catch (error) {
    res.status(500).send('Erreur lors de la récupération du document');
  }
};

// Mettre à jour un document
const updateDocument = async (req, res) => {
  try {
    const result = await elasticsearchService.updateDocument(req.params.id, req.body);
    res.json(result);
  } catch (error) {
    res.status(500).send('Erreur lors de la mise à jour du document');
  }
};

// Supprimer un document
const deleteDocument = async (req, res) => {
  try {
    const result = await elasticsearchService.deleteDocument(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).send('Erreur lors de la suppression du document');
  }
};

// Recherche simple
const searchDocuments = async (req, res) => {
  try {
    const { query } = req.body; // Extrait les paramètres de la requête
    const documents = await elasticsearchService.searchDocuments(query);

    if (documents.length === 0) {
      console.log("Aucun document trouvé dans l'index spécifié.");
    } else {
      console.log("Documents trouvés !");
    }

    res.json(documents);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur lors de la recherche des documents');
  }
};

// Recherche avec surlignage
const searchDocumentsWithHighlight = async (req, res) => {
  try {
    const { query, fields } = req.body; // Extrait les paramètres de la requête
    const documents = await elasticsearchService.searchDocumentsWithHighlight(query, fields);

    if (documents.length === 0) {
      console.log("Aucun document trouvé avec surlignage.");
    } else {
      console.log("Documents trouvés avec surlignage !");
    }

    res.json(documents);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur lors de la recherche des documents avec surlignage');
  }
};

// Recherche triée par date
const searchDocumentsSortedByDate = async (req, res) => {
  try {
    const { query, sortOrder } = req.body; // Extrait les paramètres de la requête
    const documents = await elasticsearchService.searchDocumentsSortedByDate(query, sortOrder);

    if (documents.length === 0) {
      console.log("Aucun document trouvé pour le tri par date.");
    } else {
      console.log("Documents trouvés avec tri par date !");
    }

    res.json(documents);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur lors de la recherche des documents triés par date');
  }
};

// Recherche avec pagination
const searchDocumentsWithPagination = async (req, res) => {
  try {
    const { query, page, limit } = req.body; // Extrait les paramètres de la requête
    const documents = await elasticsearchService.searchDocumentsWithPagination(query, page, limit);

    if (documents.length === 0) {
      console.log("Aucun document trouvé pour la pagination.");
    } else {
      console.log("Documents trouvés avec pagination !");
    }

    res.json(documents);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur lors de la recherche des documents avec pagination');
  }
};

module.exports = {
  getAllDocuments,
  getDocumentById,
  updateDocument,
  deleteDocument,
  searchDocuments,
  searchDocumentsWithHighlight,
  searchDocumentsSortedByDate,
  searchDocumentsWithPagination,
};
