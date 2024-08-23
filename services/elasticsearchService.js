// services/elasticsearchService.js
const { indexes } = require('../config/config');
const { Client } = require('@elastic/elasticsearch');

const client = new Client({ node: 'http://localhost:9200' });

// Fonction pour récupérer tous les documents
const getAllDocuments = async () => {
  try {
    const { body } = await client.search({
      index: indexes.documentsIndex, // Utilisation dynamique du nom de l'index
      body: {
        query: {
          match_all: {} // Recherche tous les documents
        }
      },
      size: 10000 // Limite des documents récupérés (à ajuster selon les besoins)
    });
    return body.hits.hits;
  } catch (error) {
    console.error("Erreur lors de la récupération des documents:", error);
    throw new Error('Erreur lors de la récupération des documents.');
  }
};

// Fonction pour récupérer un document par ID
const getDocumentById = async (id) => {
  try {
    const { body } = await client.get({
      index: indexes.documentsIndex, // Utilisation dynamique du nom de l'index
      id: id
    });
    return body._source;
  } catch (error) {
    console.error("Erreur lors de la récupération du document:", error);
    throw new Error('Erreur lors de la récupération du document.');
  }
};

// Fonction pour mettre à jour un document
const updateDocument = async (id, document) => {
  try {
    const { body } = await client.update({
      index: indexes.documentsIndex, // Utilisation dynamique du nom de l'index
      id: id,
      body: {
        doc: document // Mise à jour partielle du document
      }
    });
    return body;
  } catch (error) {
    console.error("Erreur lors de la mise à jour du document:", error);
    throw new Error('Erreur lors de la mise à jour du document.');
  }
};

// Fonction pour supprimer un document
const deleteDocument = async (id) => {
  try {
    const { body } = await client.delete({
      index: indexes.documentsIndex, // Utilisation dynamique du nom de l'index
      id: id
    });
    return body;
  } catch (error) {
    console.error("Erreur lors de la suppression du document:", error);
    throw new Error('Erreur lors de la suppression du document.');
  }
};

// Fonction pour effectuer une recherche par mot-clé
const searchDocuments = async (query) => {
  try {
    const { body } = await client.search({
      index: indexes.documentsIndex, // Utilisation dynamique du nom de l'index
      body: {
        query: {
          match: query // Match sur un terme ou champ spécifique
        }
      }
    });
    return body.hits.hits;
  } catch (error) {
    console.error("Erreur lors de la recherche:", error);
    throw new Error('Erreur lors de la recherche de documents.');
  }
};

// Fonction pour effectuer une recherche avec surlignage (highlight)
const searchDocumentsWithHighlight = async (query, fields) => {
  try {
    const { body } = await client.search({
      index: indexes.documentsIndex, // Utilisation dynamique du nom de l'index
      body: {
        query: {
          match: query // Match sur les termes de la requête
        },
        highlight: {
          fields: fields.reduce((acc, field) => {
            acc[field] = {}; // Surligne les champs spécifiés
            return acc;
          }, {})
        }
      }
    });
    return body.hits.hits;
  } catch (error) {
    console.error("Erreur lors de la recherche avec surlignage:", error);
    throw new Error('Erreur lors de la recherche avec surlignage.');
  }
};

// Fonction pour trier les documents par date
const searchDocumentsSortedByDate = async (query, sortOrder = 'desc') => {
  try {
    const { body } = await client.search({
      index: indexes.documentsIndex, 
      body: {
        query: {
          match: query // Recherche basée sur un mot-clé
        },
        sort: [
          { "meta.date": { order: sortOrder } } // Tri basé sur la date
        ]
      }
    });
    return body.hits.hits;
  } catch (error) {
    console.error("Erreur lors de la recherche triée par date:", error);
    throw new Error('Erreur lors de la recherche triée par date.');
  }
};

// Fonction pour paginer les résultats
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
    console.error("Erreur lors de la recherche avec pagination:", error);
    throw new Error('Erreur lors de la recherche avec pagination.');
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
  searchDocumentsWithPagination
};
