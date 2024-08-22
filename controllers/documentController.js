// controllers/documentController.js
const elasticsearchService = require('../services/elasticsearchService');


const getAllDocuments = async (req, res) => {
  try {
    const documents = await elasticsearchService.getAllDocuments();
    res.json(documents);
  } catch (error) {
    res.status(500).send('Error retrieving documents');
  }
};

const getDocumentById = async (req, res) => {
  try {
    const document = await elasticsearchService.getDocumentById(req.params.id);
    res.json(document);
  } catch (error) {
    res.status(500).send('Error retrieving document');
  }
};


// const addDocument = async (req, res) => {
//   try {
//     const result = await elasticsearchService.addDocument(req.body);
//     res.status(201).json(result);
//   } catch (error) {
//     res.status(500).send('Error adding document');
//   }
// };

const updateDocument = async (req, res) => {
  try {
    const result = await elasticsearchService.updateDocument(req.params.id, req.body);
    res.json(result);
  } catch (error) {
    res.status(500).send('Error updating document');
  }
};

const deleteDocument = async (req, res) => {
  try {
    const result = await elasticsearchService.deleteDocument(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).send('Error deleting document');
  }
};

const searchDocuments = async (req, res) => {
  try {
    const { index, query } = req.body; // Extrait les paramètres de la requête HTTP

    const documents = await elasticsearchService.searchDocuments(index, query);

    // Vérification et messages de log
    if (documents.length === 0) {
      console.log("No documents found in the specified index.");
    } else {
      console.log("Documents found!");
      console.log("Displaying documents...");
    }

    console.log(documents); // Log des résultats de la recherche
    res.json(documents); // Renvoie les résultats sous forme de JSON
  } catch (error) {
    console.error(error); // Log des erreurs
    res.status(500).send('Error searching documents'); // Réponse en cas d'erreur
  }
};

const searchDocumentsWithHighlight = async (req, res) => {
  try {
    const { index, query, fields } = req.body; // Extrait les paramètres de la requête HTTP

    const documents = await elasticsearchService.searchDocumentsWithHighlight(index, query, fields);

    // Vérification et messages de log
    if (documents.length === 0) {
      console.log("No documents found in the specified index.");
    } else {
      console.log("Documents found!");
      console.log("Displaying documents...");
    }

    console.log(documents); // Log des résultats de la recherche
    res.json(documents); // Renvoie les résultats sous forme de JSON
  } catch (error) {
    console.error(error); // Log des erreurs
    res.status(500).send('Error searching documents'); // Réponse en cas d'erreur
  }
};

module.exports = {
  // createIndex,
  // updateIndex,
  // deleteIndex,
  getAllDocuments,
  getDocumentById,
  updateDocument,
  deleteDocument,
  searchDocuments,
  searchDocumentsWithHighlight
};