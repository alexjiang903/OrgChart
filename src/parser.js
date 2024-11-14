// This helper file aims to parse data from the csv and store it in a json format

import Papa from 'papaparse';

Papa.parse("../csv_data/30k_ppl.csv", {
    download: true,
    header: true,
    worker: true, //enable worker thread for better 
    step: function(results) {
        //stream the input so that the large csv does not crash browser
        const row = results.data;
        processRow(row); //
    },
    complete: function() {
        console.log("finished parsing all 30k people")
    } 
})


function processRow(r) {
    //takes in row r, and creates a json structure showing hierarchical pos.

    const LUT = {}; //hashmap to track how manager count
    
    
}


