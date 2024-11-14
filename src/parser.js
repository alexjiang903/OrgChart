// This helper file aims to parse data from the csv and store it in a json format

import Papa from 'papaparse';
import { M } from 'vite/dist/node/types.d-aGj9QkWt';

Papa.parse("../csv_data/30k_ppl.csv", {
    download: true,
    header: true,
    worker: true, //enable worker thread for better performance
    complete: function(results) {
        const data = results.data;
        flatToNested(data);
        console.log("finished processing all 30k people")
    } 
})


function flatToNested(flatData) {
    //takes in the parsed CSV (flat JSON), outputs a nested JSON object with relationships established

    const LUT = {}; //hashmap to track employee ID (key) with all other fields (values)
    
    flatData.forEach(element => { //element is an individual object of a person (row in csv)
        LUT[element["Employee Id"]] = {
            ...element,
            children: [], //all subordinates that report to person with the employee ID
            manage_cost: 0, //management costs
            ic_cost: 0, 
            total_cost: 0,
            MCR: 0, //management cost ratio
        };
    });


    let root = null;
    flatData.forEach(element => {
        const e_node = LUT[element["Employee Id"]]; // a certain employee's node
        if (element.Manager) {
            
            //if the employee's manager field is not blank nor empty, it must be a child node
        }
    })
    //To build hierarchy, look at 


    
    
}


