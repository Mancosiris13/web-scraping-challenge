// Import required libraries
const fs = require('fs'); // For file system operations
const axios = require('axios'); // For making HTTP requests
const cheerio = require('cheerio'); // For parsing HTML

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
    // Extract various product details using class names from the web
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
  'highland-park-single-malt-15-year-old-whisky',
  'glenallachie-marsala-wood-finish-uk-exclusive-11-year-old-whisky',
  'plantation-fiji-2004-terraverra-range-rum',
  'tobermory-limited-single-cask-1975-1995-27-year-old-whisky',
  'glenturret-triple-wood-2023-release-whisky',
  'benromach-contrasts-kiln-dried-oak-2012-whisky',
  'hennessy-vs-50-years-of-hip-hop-nas-limited-edition-cognac',
  'ben-nevis-limited-single-cask-1726-1996-26-year-old-whisky',
  'rock-island-rum-cask-limited-edition-malt-whisky',
  'yamazaki-100-years-of-suntory-japanese-single-malt-12-year-old-whisky',
  'balblair-2023-release-single-malt-25-year-old-whisky',
  'ardbeg-islay-single-malt-2023-edition-25-year-old-whisky',
  'dallas-dhu-silent-private-collection-single-cask-1404-1979-43-year-old-whisky',
  'whistlepig-the-boss-hog-viii-lapulapu-s-pacific-whiskey',
  'loch-lomond-2022-release-1992-30-year-old-whisky',
  'berry-bros-rudd-exceptional-blended-single-cask-5-1979-44-year-old-whisky',
  'bushmills-single-malt-rare-irish-30-year-old-whiskey',
  'berry-bros-rudd-exceptional-blended-single-cask-5-1979-44-year-old-whisky',
  'bushmills-single-malt-rare-irish-30-year-old-whiskey',
  'bunnahabhain-feis-ile-2023-manzanilla-cask-finish-1998-whisky',
  'woodford-reserve-baccarat-edition-crystal-glasses-pack-whiskey',
  'port-ellen-silent-9-rogue-casks-1979-40-year-old',
];

scrapeAllCategories(categories)
  .then((result) => {
    // Convert the result to a JSON string
    const jsonData = JSON.stringify(result, null, 2);

    // Write the JSON data to a file named "products.json"
    fs.writeFileSync('products.json', jsonData);

    console.log('Data saved to products.json');
  })
  .catch((error) => {
    console.error('Error:', error);
  });
