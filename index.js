/**
 * @author Pedro Mattos
 * Importações de pacotes
 */
const csv = require('csv-parser')
const ObjectsToCsv = require('node-create-csv');
const fs = require('fs')

// Inicia variáveis globais
const results = [];
let nResults = {}

// faz a leitura do arquivo CSV
fs.createReadStream('csv-in/dados_pgm_idnova.csv')
  .pipe(csv())
  .on('data', (data) => results.push(data))
  .on('end', () => {
    // console de teste
    // console.log(results);
    // remove as tags '<br>' do texto e separa cada individuo por espaços grades para a quebra de linha
    nResults = splitData(removeBrs(results))
    // faz a conversão do array de objetos para um novo CSV tabulado
    parser(nResults);
});

/**
 * 
 * @param {Array< Object >} obj Parâmetro obrigatório, recebe um array de objetos de forma assincrona
 * para criar um novo CSV com esses dados
 */
async function parser(obj) {
    console.log('Parse para CSV iniciado...')
    const csv = new ObjectsToCsv(obj);
    console.log('Parse finalizado...')
    // Save to file:
    console.log('Salvando arquivo na pasta de destino...')
    await csv.toDisk('csv-out/test.csv', {showHeader: true});
    console.log('Processo finalizado!')
    // Return the CSV file as string:
    // console.log(await csv.toString());
}

/**
 * 
 * @param {Array<Object>} csvData Parâmetro obrigatório, recebe um array de objetos para remover todos
 * os '<br>'
 * @returns Array of Objects
 */
function removeBrs(csvData) {
    const newData = []
    csvData.forEach(element => {
        const regex = /<br>/g;
        let txtRGX = element.moradores.toString()
        // console.log(txtRGX.replace(regex, ''), 'fim')
        newData.push({
            casanova: element.casanova,
            moradores: txtRGX.replace(regex, '').trim()
        })
    });
    // console.log(csvData)
    return newData;
}

/**
 * 
 * @param {Array<Object>} noBrs Parâmetro obrigatório para separar os ids dos nomes e separar
 * por grandes espaços para a quebra de linha
 * @returns 
 */
function splitData(noBrs) {
    // console.log(noBrs)
    const newObj = []
    noBrs.forEach(element => {
        // console.log(element, element.moradores.split('-'))
        let splited = element.moradores.split('-')
        let dois = []
        for (let i = 0; i < splited.length; i++) {
            dois.push(splited[i].trim().split(' '))
        }
        let flat = dois.flat(1)
        for (let i = 0; i < flat.length; i++) {
          if (!isNaN(parseInt(flat[i])) && i > 0) {
              flat[i - 1] = `${flat[i - 1]}                              `
          }
        }
        newObj.push({
            casanova: element.casanova,
            moradores: flat.toString().replace(/,/g, ' ')
        })
        // console.log(flat.toString().replace(/,/g, ' '))
    });
    return newObj;
}
