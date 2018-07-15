/**
 * Aggregates GDP and Population Data by Continents
 * @param {*} filePath
 */
const fs = require('fs');

const continentList = ['South America', 'Oceania', 'North America', 'Asia', 'Europe', 'Africa'];

const asiaCountries = ['"China"', '"India"', '"Indonesia"', '"Japan"', '"Russia"', '"Saudi Arabia"', '"Turkey"', '"Republic of Korea"'];
const southAmericaCountries = ['"Argentina"', '"Brazil"'];
const oceaniaCountries = ['"Australia"'];
const northAmericaCountries = ['"Canada"', '"Mexico"', '"USA"'];
const europeCountries = ['"France"', '"Germany"', '"Italy"', '"United Kingdom"'];
const africaCountries = ['"South Africa"'];

const output = {
  'South America': { GDP_2012: 0, POPULATION_2012: 0 },
  Oceania: { GDP_2012: 0, POPULATION_2012: 0 },
  'North America': { GDP_2012: 0, POPULATION_2012: 0 },
  Asia: { GDP_2012: 0, POPULATION_2012: 0 },
  Europe: { GDP_2012: 0, POPULATION_2012: 0 },
  Africa: { GDP_2012: 0, POPULATION_2012: 0 },
};

function csvToArray(csv) {
  const rows = csv.split(['\n']);

  return rows.map(row => row.split(','));
  // return rows.map(function (row) {
  //   return row.split(',');
  // });
}

function arrToObject(arr) {
  // assuming header
  const keys = arr[0];
  // vacate keys from main array
  const newArr = arr.slice(1, arr.length);

  const formatted = [];
  const l = keys.length;
  for (let i = 0; i < newArr.length; i += 1) {
    const d = newArr[i];
    const o = {};
    for (let j = 0; j < l; j += 1) {
      o[keys[j]] = d[j];
    }
    formatted.push(o);
  }
  return formatted;
}

const aggregate = (filePath) => {
  const fileContent = fs.readFileSync(filePath, 'utf8');

  const fileContentArray = csvToArray(fileContent);
  const fileContentJSONObj = arrToObject(fileContentArray);

  function continent(countryArray) {
    let GDP = 0;
    let population = 0;
    for (let i = 0; i < (fileContentJSONObj.length); i += 1) {
      for (let j = 0; j < countryArray.length; j += 1) {
        if (countryArray[j] === fileContentJSONObj[i]['"Country Name"']) {
          GDP += parseFloat((fileContentJSONObj[i]['"GDP Billions (US Dollar) - 2012"']).replace('"', ''));
          population += parseFloat((fileContentJSONObj[i]['"Population (Millions) - 2012"']).replace('"', ''));
        }
      }
    }
    return [GDP, population];
  }

  const mapFile = [continent(southAmericaCountries),
    continent(oceaniaCountries),
    continent(northAmericaCountries),
    continent(asiaCountries),
    continent(europeCountries),
    continent(africaCountries)];

  // Assigning the GDP_2012 in the output file
  for (let i = 0; i < continentList.length; i += 1) {
    const variable1 = mapFile[i][0];
    output[continentList[i]].GDP_2012 = variable1;
  }
  // Assigning the POPULATION_2012 in the output file
  for (let i = 0; i < continentList.length; i += 1) {
    const variable2 = mapFile[i][1];
    output[continentList[i]].POPULATION_2012 = variable2;
  }
  fs.writeFileSync('output/output.json', JSON.stringify(output));
};

module.exports = aggregate;
