/**
 * Aggregates GDP and Population Data by Continents
 * @param {*} filePath
 */
const fs = require('fs');

const mapPath = 'data/country-mapper-file.json';

const readFile = (file) => {
  const promise = new Promise((resolve, reject) => {
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
  return promise;
};

const writeFile = (file, content) => {
  const promise = new Promise((resolve, reject) => {
    fs.writeFile(file, content, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
  return promise;
};


const aggregate = (filePath) => {
  Promise.all([readFile(filePath), readFile(mapPath)]).then((values) => {
    const csvFileData = (values[0].replace(/"/g, '')).split('\n');
    const mapFileData = JSON.parse(values[1]);
    const headerTxt = csvFileData[0].split(',');
    const rowsTxt = csvFileData.slice(1, csvFileData.length);
    const indexCountryName = headerTxt.indexOf('Country Name');
    const indexGDP2012 = headerTxt.indexOf('GDP Billions (US Dollar) - 2012');
    const indexPopulation2012 = headerTxt.indexOf('Population (Millions) - 2012');

    const output = {};
    rowsTxt.forEach((value) => {
      const rowCells = value.split(',');
      const continentName = mapFileData[rowCells[indexCountryName]];
      if (continentName !== undefined && rowCells[indexCountryName] !== '' && continentName !== undefined) {
        if (output[continentName] === undefined) {
          output[continentName] = {};
          output[continentName].GDP_2012 = parseFloat(rowCells[indexGDP2012]);
          output[continentName].POPULATION_2012 = parseFloat(rowCells[indexPopulation2012]);
        } else {
          output[continentName].GDP_2012 += parseFloat(rowCells[indexGDP2012]);
          output[continentName].POPULATION_2012 += parseFloat(rowCells[indexPopulation2012]);
        }
      }
    });
    writeFile('output/output.json', JSON.stringify(output));
  });
};

module.exports = aggregate;
