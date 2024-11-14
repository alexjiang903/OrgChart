// This helper file aims to parse data from the csv and store it in a json format

import Papa from 'papaparse';
import { useDataStore } from './stores/globalDataStore';


const dataStore = useDataStore();


Papa.parse("../csv_data/30k_ppl.csv", {
    download: true,
    header: true,
    worker: true, //enable worker thread for better performance
    complete: function(results) {
        const data = results.data;
        const nestedData = flatToNested(data);
        console.log("finished processing all 30k people")
        
        dataStore.setNestedData(nestedData);
        console.log("Nested Data stored in Pinia")
        //Store the nestedData in Vue global state w/ Pinia
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


