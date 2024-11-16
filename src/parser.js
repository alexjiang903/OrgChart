// This helper file aims to parse data from the csv and store it in a json format

import Papa from 'papaparse';
import { useDataStore } from './stores/globalDataStore';
const fs = require('fs')


function parseCSV() {
    return new Promise((resolve, reject) => {
        console.log("log start")
        const csvFile = fs.readFileSync("/csv_data/30k_ppl.csv")
        const csvData = csvFile.toString() 
        
        Papa.parse(csvData, {
            download: true,
            header: true,
            worker: true, //enable worker thread for better performance
            complete: function(results) {
                const flatData = results.data;
                const nestedData = flatToNested(flatData);
                const dataStore = useDataStore();
                
                dataStore.setNestedData(nestedData);  //Store the nestedData in Vue global state w/ Pinia
                
                console.log("Nested Data stored in Pinia")
                console.log("finished processing all 30k employees")
                console.log("test")

                resolve(nestedData);
            },
            error: function(err) {
                reject(err);
            }
        });
    })
}


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


    let rootNode = null;

    flatData.forEach(employee => {
        if (!employee.Manager) {
            // node must be root of organization (CEO)
            rootNode = LUT[0]; //CEO Employee ID === 0 (Joan Telyer)
        }
        else {
            const managerNode = LUT[employee.Manager]; //look up the employee ID of mananager
            if (managerNode) {
                managerNode.children.push(LUT[employee["Employee Id"]]);
            }
        }
    });

    return rootNode;
}

export default parseCSV;


