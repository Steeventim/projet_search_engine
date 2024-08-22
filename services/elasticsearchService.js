// services/elasticsearchService.js
const { indexes } = require('../config/config');
const { Client } = require('@elastic/elasticsearch');

const client = new Client({ node: 'http://localhost:9200' });

// const createIndex = async (indexName, settings = {}, mappings = {}) => {
//   const { body } = await client.indices.create({
//     index: indexName,
//     body: {
//       settings,
//       mappings
//     }
//   });
//   return body;
// };

// // const getIndex = async (indexName) => {
// //   const { body } = await client.indices.get({
// //     index: indexName
// //   });
// //   return body;
// // };

// const updateIndex = async (indexName, settings) => {
//   const { body } = await client.indices.putSettings({
//     index: indexName,
//     body: settings
//   });
//   return body;
// };

// const deleteIndex = async (indexName) => {
//   const { body } = await client.indices.delete({
//     index: indexName
//   });
//   return body;
// };

const getAllDocuments = async () => {
  const { body } = await client.search({
    index: indexes.documentsIndex, // Remplacez par le nom de votre index
    body: {
      query: {
        match_all: {}
      }
    },
    size: 10000 // Ajustez la taille pour récupérer le nombre de documents désirés
  });
  return body.hits.hits;
};

const getDocumentById = async (id) => {
  const { body } = await client.get({
    index: indexes.documentsIndex, // Remplacez par le nom de votre index
    id: id
  });
  return body._source;
};


const updateDocument = async (id, document) => {
  const { body } = await client.update({
    index: 'test_search', // Remplacez par le nom de votre index
    id: id,
    body: {
      doc: document
    }
  });
  return body;
};

const deleteDocument = async (id) => {
  const { body } = await client.delete({
    index: indexes.documentsIndex, // Remplacez par le nom de votre index
    id: id
  });
  return body;
};

const searchDocuments = async (index, query) => {
  const { body } = await client.search({
    index,
    body: {
      query: {
        match: query
      }
    }
  });
  return body.hits.hits;
};

const searchDocumentsWithHighlight = async (index, query, fields) => {
  const { body } = await client.search({
    index,
    body: {
      query: {
        match: query
      },
      highlight: {
        fields: fields.reduce((acc, field) => {
          acc[field] = {};
          return acc;
        }, {})
      }
    }
  });
  return body.hits.hits;
};


module.exports = {
  getAllDocuments,
  getDocumentById,
  updateDocument,
  deleteDocument,
  searchDocuments,
  searchDocumentsWithHighlight,
};