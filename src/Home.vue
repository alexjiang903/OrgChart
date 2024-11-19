
<template>
    <div style="background-color: skyblue;">
        <h1>Home Page of Application</h1>
        <pre>{{nestedJSON}}</pre>

    </div>
</template>

<script lang="js">
import Papa from 'papaparse';
import { useDataStore } from '@/stores/globalDataStore.js'

export default {
    name: 'Home', //Home page component of organization chart. 
    data() {
        return {
            csvData: [],
            nestedJSON: {}
        };
    },
    mounted() {
        this.loadCSV();
    },
    methods: {
        async loadCSV() {
            try {
                const response = await fetch('/csv_data/sample_real_data.csv');
                const csvText = await response.text();
                this.parseCSV(csvText);
                
            }
            catch (error) {
                console.error('Error loading CSV file:', error);
            }
        },

        parseCSV(csvString) {
            //parse the csv data using papa parse
            const dataStore = useDataStore();
            Papa.parse(csvString, { 
                header: true,
                worker: true, //enable worker thread for better performance
                delimiter: ',',
                complete: (results) => {
                    if (results.data.length === 0) {
                        console.error("no data was parsed!") 
                    }

                    const flatData = results.data;
                    const JSONTreeData = this.getNestedJSON(flatData); //stores the final nested JSON mapping out parent-child relationships
                   
                    this.nestedJSON = JSONTreeData;
                    console.log("finished processing all 30k employees")
                    
                    dataStore.setNestedData(this.nestedJSON);
                    console.log("data stored in pinia global state")
                    


                },

                error: function (err) {
                    console.log(err);
                }
            });
        },

        getNestedJSON(data) {
            const LUT = {}; //hashmap to track employee ID (key) with all other fields (values)

            data.forEach(element => { //element is an individual object of a person (row in csv)
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

            data.forEach(employee => {
                if (!employee.Manager) {
                    // node must be root of organization (CEO)
                    rootNode = LUT[0]; //CEO Employee ID === 0 (Joan Telyer)
                }
                else {
                    const managerNode = LUT[employee.Manager]; //look up the employee ID of manager
                    if (managerNode) {
                        managerNode.children.push(LUT[employee["Employee Id"]]);
                    }
                }
            });
            return rootNode;
        }
    },
};
</script>

<style scoped>
table {
    width: 100%;
    border-collapse: collapse;
}

th,
td {
    padding: 8px;
    border: 1px solid #ddd;
    text-align: left;
}
</style>