// services/elasticsearchService.js
const { indexes } = require('../config/config');
const { Client } = require('@elastic/elasticsearch');
const LOCAL_PDF_DIRECTORY = '/home/tims/Documents/Others';



const client = new Client({ node: 'http://localhost:9200' });

// Fonction pour vérifier l'existence de l'index
const indexExists = async (index) => {
  try {
    const { body } = await client.indices.exists({ index });
    return body;
  } catch (error) {
    console.error(`Erreur lors de la vérification de l'existence de l'index: ${error.message}`);
    return false;
  }
};

// Fonction pour récupérer tous les documents
const getAllDocuments = async () => {
  try {
    const indexCheck = await indexExists(indexes.documentsIndex);
    if (!indexCheck) {
      throw new Error(`Index ${indexes.documentsIndex} n'existe pas.`);
    }
    const { body } = await client.search({
      index: indexes.documentsIndex,
      body: {
        query: {
          match_all: {} // Recherche tous les documents
        }
      },
      size: 10000 // Limite des documents récupérés
    });
    return body.hits.hits;
  } catch (error) {
    console.error(`Erreur lors de la récupération des documents: ${error.message}`);
    throw new Error(`Erreur lors de la récupération des documents.`);
  }
};

// Fonction pour récupérer un document par ID
const getDocumentById = async (id) => {
  try {
    const indexCheck = await indexExists(indexes.documentsIndex);
    if (!indexCheck) {
      throw new Error(`Index ${indexes.documentsIndex} n'existe pas.`);
    }
    const { body } = await client.get({
      index: indexes.documentsIndex,
      id: id
    });
    return body._source;
  } catch (error) {
    console.error(`Erreur lors de la récupération du document: ${error.message}`);
    throw new Error('Erreur lors de la récupération du document.');
  }
};

// Fonction pour mettre à jour un document partiellement
const updateDocument = async (id, document) => {
  try {
    const { body } = await client.update({
      index: indexes.documentsIndex,
      id: id,
      body: {
        doc: document // Mise à jour partielle
      }
    });
    return body;
  } catch (error) {
    console.error(`Erreur lors de la mise à jour du document: ${error.message}`);
    throw new Error('Erreur lors de la mise à jour du document.');
  }
};

// Fonction pour supprimer un document
const deleteDocument = async (id) => {
  try {
    const { body } = await client.delete({
      index: indexes.documentsIndex,
      id: id
    });
    return body;
  } catch (error) {
    console.error(`Erreur lors de la suppression du document: ${error.message}`);
    throw new Error('Erreur lors de la suppression du document.');
  }
};

// Fonction de recherche multi-champs
const searchDocuments = async (query) => {
  try {
    const indexCheck = await indexExists(indexes.documentsIndex);
    if (!indexCheck) {
      throw new Error(`Index ${indexes.documentsIndex} n'existe pas.`);
    }
    const { body } = await client.search({
      index: indexes.documentsIndex,
      body: {
        query: {
          multi_match: {
            query: query,
            fields: ["content", "filename", "meta.date"] // Recherche sur plusieurs champs
          }
        }
      }
    });
    return body.hits.hits;
  } catch (error) {
    console.error(`Erreur lors de la recherche: ${error.message}`);
    throw new Error('Erreur lors de la recherche de documents.');
  }
};

// Fonction de recherche avec surlignage (highlight)
const searchDocumentsWithHighlight = async (query, fields) => {
  try {
    const indexCheck = await indexExists(indexes.documentsIndex);
    if (!indexCheck) {
      throw new Error(`Index ${indexes.documentsIndex} n'existe pas.`);
    }
    const { body } = await client.search({
      index: indexes.documentsIndex,
      body: {
        query: {
          match: query
        },
        highlight: {
          fields: fields.reduce((acc, field) => {
            acc[field] = {}; // Surligner les champs spécifiés
            return acc;
          }, {})
        }
      }
    });
    return body.hits.hits;
  } catch (error) {
    console.error(`Erreur lors de la recherche avec surlignage: ${error.message}`);
    throw new Error('Erreur lors de la recherche avec surlignage.');
  }
};

// Fonction de recherche triée par date
const searchDocumentsSortedByDate = async (query, sortOrder = 'desc') => {
  try {
    const { body } = await client.search({
      index: indexes.documentsIndex,
      body: {
        query: {
          match: query
        },
        sort: [
          { "meta.date": { order: sortOrder } } // Tri basé sur la date
        ]
      }
    });
    return body.hits.hits;
  } catch (error) {
    console.error(`Erreur lors de la recherche triée par date: ${error.message}`);
    throw new Error('Erreur lors de la recherche triée par date.');
  }
};

// Fonction de pagination
const searchDocumentsWithPagination = async (query, page = 1, limit = 10) => {
  try {
    const { body } = await client.search({
      index: indexes.documentsIndex,
      body: {
        query: {
          match: query
        },
        from: (page - 1) * limit,
        size: limit
      }
    });
    return body.hits.hits;
  } catch (error) {
    console.error(`Erreur lors de la recherche avec pagination: ${error.message}`);
    throw new Error('Erreur lors de la recherche avec pagination.');
  }
};

// Fonction de recherche par plage de dates
const searchDocumentsByDateRange = async (startDate, endDate) => {
  try {
    const { body } = await client.search({
      index: indexes.documentsIndex,
      body: {
        query: {
          range: {
            "meta.date": {
              gte: startDate,
              lte: endDate
            }
          }
        }
      }
    });
    return body.hits.hits;
  } catch (error) {
    console.error(`Erreur lors de la recherche par plage de dates: ${error.message}`);
    throw new Error('Erreur lors de la recherche par plage de dates.');
  }
};

const getFile = async (filename) => {
  try {
    // Chemin du répertoire local où sont stockés les fichiers

    // Générer le chemin complet du fichier
    const filePath = path.join(LOCAL_PDF_DIRECTORY, filename);

    // Vérifier si le fichier existe
    if (!fs.existsSync(filePath)) {
      console.log('Fichier non trouvé:', filePath);
      throw new Error('Fichier non trouvé');
    }

    // Retourner le chemin du fichier pour être utilisé par la route d'envoi de fichier
    return filePath;
  } catch (error) {
    console.error(`Erreur lors de l'accès au fichier local: ${error.message}`);
    throw new Error('Erreur lors de l’accès au fichier local.');
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
  searchDocumentsByDateRange,
  getFile
};
