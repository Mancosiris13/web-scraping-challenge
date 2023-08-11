// Import required libraries
const fs = require('fs'); // For file system operations
const axios = require('axios'); // For making HTTP requests
const cheerio = require('cheerio'); // For parsing HTML
const ExcelJS = require('exceljs'); // For generating Excel files

// Base URL of the website to scrape
const baseURL = 'https://www.htfw.com/';

// Function to scrape products within a category
async function scrapeCategory(category) {
  const categoryURL = baseURL + category;
  const response = await axios.get(categoryURL);
  const $ = cheerio.load(response.data);

  const products = [];

  // Iterate over each product item
  $('.product-item').each((index, element) => {
    // Extract various product details using class names from the name
    const name = $(element).find('.product-item-link').text().trim();
    const price = $(element).find('.price').text().trim();
    const description = $(element)
      .find('.product-item-description')
      .text()
      .trim();
    const clAndAlcoholPercentage = $(element)
      .find('.product-subtitle')
      .text()
      .trim();

    // Extract distillery from the product name
    const hyphenIndex = name.indexOf('-');
    const distillery =
      hyphenIndex !== -1 ? name.substring(0, hyphenIndex).trim() : '';

    // Push product details to the products array
    products.push({
      name,
      distillery,
      description,
      clAndAlcoholPercentage,
      price,
    });
  });

  return products;
}

// Function to scrape all categories
async function scrapeAllCategories(categories) {
  const allProducts = {};

  // Iterate over each category and scrape its products
  for (const category of categories) {
    allProducts[category] = await scrapeCategory(category);
  }

  return allProducts;
}

// List of categories to scrape
const categories = [
  'scotch-malt-whisky/campbeltown',
  'scotch-malt-whisky/highlands',
  'scotch-malt-whisky/islands',
  'single-malt-scotch/islands',
  'scotch-malt-whisky/lowlands',
  'scotch-malt-whisky/speyside',
  'single-malt-scotch/grain-whisky',
  'scotch-malt-whisky/silent-distilleries',
  'single-malt-scotch/miniatures',
  'single-malt-scotch/rarest',
  'single-malt-scotch/single-cask-whisky',
  'blended-whisky',
  'american-whiskey',
  'worldwide-whisky/australia',
  'worldwide-whisky/canadian-whisky',
  'world-whisky/danish-whisky',
  'worldwide-whisky/dutch-whisky',
  'worldwide-whisky/english-whisky',
  'worldwide-whisky/french-whisky',
  'worldwide-whisky/indian-whisky',
  'worldwide-whisky/irish-whiskey',
  'worldwide-whisky/israel',
  'worldwide-whisky/italian-whisky',
  'worldwide-whisky/japanese-whisky',
  'worldwide-whisky/new-zealand-whisky',
  'world-whisky/norwegian-whisky',
  'worldwide-whisky/south-african-whisky',
  'world-whisky/swiss-whisky',
  'worldwide-whisky/swedish-whisky',
  'worldwide-whisky/taiwanese-whisky',
  'worldwide-whisky/welsh-whisky',
  'spirits/rum',
  'spirits/tequila',
  'spirits/cognac',
  'spirits/brandy',
  'spirits/gin',
  'spirits/vodka',
  'spirits/liqueur',
  'spirits/other-spirits',
];

// Scrape all categories and save the result to an Excel file
scrapeAllCategories(categories)
  .then((result) => {
    // Create a new Excel workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Products');

    // Add headers to the worksheet
    worksheet.addRow([
      'Distillery',
      'Name',
      'Price',
      'Description',
      'CL and Alcohol Percentage',
    ]);

    // Add data rows from the JSON result
    for (const category of categories) {
      const products = result[category];
      for (const product of products) {
        worksheet.addRow([
          product.distillery,
          product.name,
          product.price,
          product.description,
          product.clAndAlcoholPercentage,
        ]);
      }
    }

    // Save the workbook to a file
    workbook.xlsx
      .writeFile('products.xlsx')
      .then(() => {
        console.log('Excel file saved as products.xlsx');
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  })
  .catch((error) => {
    console.error('Error:', error);
  });
