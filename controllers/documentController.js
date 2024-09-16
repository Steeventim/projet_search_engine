// controllers/documentController.js
const path = require('path');
const fs = require('fs'); 
const elasticsearchService = require('../services/elasticsearchService');
const LOCAL_PDF_DIRECTORY = '/home/tims/Documents/Others';



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
    const id = req.params.id;  // Récupérer l'ID de l'URL

    const document = await getDocumentById(id);

    res.status(200).json(document);
  } catch (error) {
    console.error('Erreur lors de la récupération du document:', error.message);
    res.status(500).send('Erreur lors de la récupération du document.');
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
    const query = req.body.query || req.query.query;  // Obtenez le terme de recherche à partir du corps ou des paramètres de requête
    // console.log(req.body.query);
    if (!query) {
      return res.status(400).send('Le terme de recherche est requis.');
    }

    const results = await elasticsearchService.searchDocuments(query);  // Appel de votre service de recherche

    if (!results || !Array.isArray(results)) {
      return res.status(404).send('Aucun document trouvé.');
    }

    res.json(results);
  } catch (error) {
    console.error('Erreur lors de la recherche:', error.message);
    res.status(500).send('Erreur lors de la recherche de documents.');
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

const getFile = async (req, res) => {
  try {
    const filename = req.params.filename;

    // Chemin des fichiers
    const filePath = path.join(LOCAL_PDF_DIRECTORY, filename);

    // Vérification si le fichier existe
    if (!fs.existsSync(filePath)) {
      console.log('Fichier non trouvé:', filePath);
      return res.status(404).send('Fichier non trouvé');
    }

    console.log('Envoi du fichier:', filePath);

    // Envoi du fichier PDF
    res.sendFile(filePath);
  } catch (error) {
    console.error(`Erreur lors de l'accès au fichier: ${error.message}`);
    res.status(500).send('Erreur lors de l\'accès au fichier.');
  }
};

const getDocumentWithFixedPages = async (req, res) => {
  try {
    const fileName = req.params.fileName;
    const searchTerm = req.query.query;

    const pdfBytes = await getDocumentWithFixedPages(fileName, searchTerm);

    // Envoyer le fichier PDF en réponse
    res.setHeader('Content-Type', 'application/pdf');
    res.send(Buffer.from(pdfBytes));
  } catch (error) {
    console.error(`Erreur lors de la génération du fichier PDF: ${error.message}`);
    res.status(500).send('Erreur lors de la génération du fichier PDF.');
  }
};



const viewDocument = async (req, res) => {
  try {
    const filename = req.params.filename;
    const searchTerm = req.query.searchTerm || req.body.query || req.query.query || '';

    console.log('Filename:', filename);
    console.log('Search Term:', searchTerm); // Vérifiez ici si le terme de recherche est présent

    const filePath = path.join(LOCAL_PDF_DIRECTORY, filename);

    if (!fs.existsSync(filePath)) {
      console.log('Fichier non trouvé:', filePath);
      return res.status(404).send('Fichier non trouvé');
    }

    console.log('Chemin du fichier:', filePath);

    const pdfBytes = await elasticsearchService.getDocumentWithFixedPages(filePath, searchTerm);

    res.setHeader('Content-Type', 'application/pdf');
    res.send(Buffer.from(pdfBytes));
  } catch (error) {
    console.error(`Erreur lors de l'accès au fichier: ${error.message}`);
    res.status(500).send('Erreur lors de l\'accès au fichier.');
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
  getFile,
  getDocumentWithFixedPages,
  viewDocument
};
