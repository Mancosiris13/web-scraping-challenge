// Import the required libraries
const axios = require('axios'); // For making HTTP requests
const cheerio = require('cheerio'); // For parsing HTML

// URL of the website to scrape
const url = 'https://www.htfw.com/';

// Send an HTTP GET request to the specified URL
axios
  .get(url)
  .then((response) => {
    // Load the response HTML data into Cheerio
    const $ = cheerio.load(response.data);

    // Select all <a> elements on the page using Cheerio
    $('a').each((index, element) => {
      // Get the 'href' attribute value of the current <a> element
      const link = $(element).attr('href');

      // Print the extracted link to the console
      console.log(link);
    });
  })
  .catch((error) => {
    // Handle errors if the HTTP request fails
    console.error('Error al obtener la página:', error);
  });
