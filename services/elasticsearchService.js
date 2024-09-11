// services/elasticsearchService.js
const { indexes } = require('../config/config');
const { Client } = require('@elastic/elasticsearch');
const LOCAL_PDF_DIRECTORY = '/home/tims/Documents/Others'; // Répertoire de base
const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
const pdfParse = require('pdf-parse');


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
    const { body } = await client.get({
      index: indexes.documentsIndex,
      id: id
    });

    if (body.found) {
      return body._source;
    } else {
      throw new Error(`Document avec l'ID ${id} non trouvé.`);
    }
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
    index:indexes.documentsIndex,
    body: {
      query: {
        bool: {
          should: [
            { match: { content: query } }, // Recherche dans le contenu
            { match: { filename: query } } // Recherche dans le nom du document
          ]
        }
      },
      highlight: {
        fields: {
          content: {} 
        }
      }
    },
  });

    if (!body.hits || !body.hits.hits) {
      return [];  // Assurez-vous de retourner un tableau vide si aucune donnée n'est trouvée
    }

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

const findPagesWithSearchTerm = async (pdfBuffer, searchTerm) => {
  try {
    // Séparer les mots du terme de recherche
    const searchWords = searchTerm.trim().toLowerCase().split(/\s+/);

    // Extraire le texte du PDF
    const parsedData = await pdfParse(pdfBuffer);
    const extractedText = parsedData.text;
    // console.log('Texte extrait:', extractedText);

    // Diviser le texte en pages
    const pages = extractedText.split('\f'); // Utiliser le caractère de saut de page form feed

    // Parcourir chaque page
    for (let i = 0; i < pages.length; i++) {
      const pageText = pages[i].toLowerCase();

      // Vérifiez si chaque mot du terme de recherche est présent dans le texte de la page
      const allWordsPresent = searchWords.every(word => pageText.includes(word));
      
      if (allWordsPresent) {
        console.log(`Mot recherché trouvé à la page : ${i + 1}`);
        return i; // Retourner l'index de la page contenant tous les mots
      }
    }
    return null; // Retourner null si aucun mot n'est trouvé
  } catch (error) {
    console.error(`Erreur lors de l'extraction du texte du PDF: ${error.message}`);
    throw new Error('Erreur lors de l\'extraction du texte du PDF.');
  }
};


const getDocumentWithFixedPages = async (filePath, searchTerm) => {
  try {
    const pdfBuffer = fs.readFileSync(filePath);
    const pageIndex = await findPagesWithSearchTerm(pdfBuffer, searchTerm);

    if (pageIndex === null) {
      throw new Error('Terme recherché non trouvé dans le document');
    }

    const pdfDocLib = await PDFDocument.load(pdfBuffer);
    const newPdfDoc = await PDFDocument.create();
    const totalPages = pdfDocLib.getPageCount();

    // Copier la première page
    const firstPage = await newPdfDoc.copyPages(pdfDocLib, [0]);
    newPdfDoc.addPage(firstPage[0]);

    // Copier la page contenant le terme recherché
    if (pageIndex >= 0 && pageIndex < totalPages) {
      const searchPage = await newPdfDoc.copyPages(pdfDocLib, [pageIndex]);
      newPdfDoc.addPage(searchPage[0]);
    } else {
      console.log('Index de la page recherchée est hors de portée.');
    }

    // Copier la dernière page
    if (totalPages > 1) {
      const lastPage = await newPdfDoc.copyPages(pdfDocLib, [totalPages - 1]);
      newPdfDoc.addPage(lastPage[0]);
    }

    const pdfBytes = await newPdfDoc.save();
    return pdfBytes;
  } catch (error) {
    console.error(`Erreur lors de la génération du PDF avec les pages fixes: ${error.message}`);
    throw new Error('Erreur lors de la génération du PDF avec les pages fixes.');
  }
};

// const getDocumentWithFixedPages = async (filePath, searchTerm) => {
//   const pdfBuffer = fs.readFileSync(filePath);
//   const pageIndex = await findPagesWithSearchTerm(pdfBuffer, searchTerm);

//   if (pageIndex === null) {
//     throw new Error(`Terme recherché "${searchTerm}" non trouvé dans le document`);
//   }

//   const pdfDocLib = await PDFDocument.load(pdfBuffer);
//   const newPdfDoc = await PDFDocument.create();
//   const totalPages = pdfDocLib.getPageCount();

//   console.log(`Total de pages: ${totalPages}`);
//   console.log(`Page contenant le terme recherché : ${pageIndex}`);

//   // Fonction pour copier une page avec une vérification supplémentaire
//   const safeCopyPage = async (pdfDocLib, newPdfDoc, pageIndex) => {
//     if (pageIndex >= 0 && pageIndex < totalPages) {
//       const pages = await newPdfDoc.copyPages(pdfDocLib, [pageIndex]);
//       if (pages && pages[0]) {
//         newPdfDoc.addPage(pages[0]);
//       } else {
//         console.warn(`Page ${pageIndex} introuvable ou illisible.`);
//       }
//     } else {
//       console.warn(`Index de page hors de portée : ${pageIndex}`);
//     }
//   };

//   // Copier la première page
//   await safeCopyPage(pdfDocLib, newPdfDoc, 0);

//   // Copier la page contenant le terme recherché
//   if (pageIndex !== 0 && pageIndex !== totalPages - 1) {
//     await safeCopyPage(pdfDocLib, newPdfDoc, pageIndex);
//   }

//   // Copier la dernière page
//   await safeCopyPage(pdfDocLib, newPdfDoc, totalPages - 1);

//   const pdfBytes = await newPdfDoc.save(); 
//   return pdfBytes;
// };







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
  getFile,
  findPagesWithSearchTerm,
  getDocumentWithFixedPages
};
