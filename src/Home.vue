<template>
    <div class="flex flex-col items-center justify-start min-h-screen bg-blue-100 p-6">
        <nav class="w-full flex justify-between items-center text-blue-900 py-3 px-6 mb-6 shadow-md">
            <a href="#/" class="font-semibold hover:underline">Home</a>
            <a href="#/orgchart" class="font-semibold hover:underline">View Org Chart</a>
        </nav>

        <h1 class="text-4xl font-bold text-blue-500 mb-4">Quick Find</h1>
        <p class="text-lg text-gray-600 mb-6">This is the home page of the application. You can search for a user by
            name to view their details.</p>
        <div class="flex items-center gap-4 mb-6">
            <input v-model="searchQuery" type="text" placeholder="Enter name to search"
                class="w-64 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400" />
            <button @click="searchUser"
                class="px-6 py-3 text-white bg-blue-500 rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400">
                Search
            </button>
        </div>

        <div v-if="!userCardVisible" class="text-gray-600 text-lg mb-6">Search for a user to view their details</div>
        <div v-if="userCardVisible" class="bg-white w-80 p-6 rounded-lg shadow-lg border border-gray-200 text-left">
            <div v-for="user in this.userSelected" :key="user['Employee Id']" class="user-card">
                <div class="card">
                    <div class="card-content">
                        <p class="mb-2">
                            <strong class="text-gray-700">Name: </strong>
                            <span class="text-gray-800">{{ user.Name }}</span>
                        </p>
                        <p class="mb-2">
                            <strong class="text-gray-700">Job Title: </strong>
                            <span class="text-gray-800">{{ user["Job Title"] }}</span>
                        </p>
                        <p class="mb-2">
                            <strong class="text-gray-700">Email: </strong>
                            <span class="text-gray-800">{{ user.Email }}</span>
                        </p>
                        <p class="mb-2">
                            <strong class="text-gray-700">Location: </strong>
                            <span class="text-gray-800">{{ user.Location }}</span>
                        </p>
                        <p class="mb-2">
                            <strong class="text-gray-700">Employee Level: </strong>
                            <span class="text-gray-800">{{ user.level }}</span>
                        </p>
                        <p class="mb-2">
                            <strong class="text-gray-700">Job Family: </strong>
                            <span class="text-gray-800">{{ user["Job Family"] }}</span>
                        </p>
                        <p class="mb-2">
                            <strong class="text-gray-700">Agentnoon Entity: </strong>
                            <span class="text-gray-800">{{ user.Entity }}</span>
                        </p>
                        <p class="mb-2">
                            <strong class="text-gray-700">Number of Subordinates: </strong>
                            <span class="text-gray-800">{{ user.descendants }}</span>
                        </p>
                        <p class="mb-2">
                            <strong class="text-gray-700">Salary </strong>
                            <span class="text-gray-800">{{ user.Salary }}</span>
                        </p>
                    </div>
                </div>
            </div>

            <div v-if="this.userSelected.manage_cost">
                <p class="mb-2">
                    <strong class="text-gray-700">IC Cost: </strong>
                    <span class="text-gray-800">{{ this.userSelected.Salary }}</span>
                </p>

                <p class="mb-2">
                    <strong class="text-gray-700">Total Cost: </strong>
                    <span class="text-gray-800">{{ this.userSelected.Salary }}</span>
                </p>

                <p class="mb-2">
                    <strong class="text-gray-700">Management Cost Ratio: </strong>
                    <span class="text-gray-800">{{ this.userSelected.Salary }}</span>
                </p>
            </div>

        </div>
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
            nestedJSON: {},
            searchQuery: '',
            userCardVisible: false,
            userSelected: {
                name: '',
                jobTitle: '',
                email: '',
                location: '',
                level: '',
                jobFamily: '',
                entity: '',
                descendants: '',
                salary: '',
                manage_cost: '',
                ic_cost: '',
                total_cost: '',
                MCR: '',
            },
        };
    },
    mounted() {
        this.loadCSV();
    },
    methods: {
        async loadCSV() {
            try {
                const response = await fetch('/csv_data/30k_ppl.csv');
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
            const doNotInclude = ["age", "gender", "End Date", "Performance", "Project", "Source", "Skill",
                "Buisness Pillar", "Buisness Sector", "Company Cluster", "Company Hierarchy", "Cost Center", "Employee Type", "Work Shift", "country"
            ]; //fields to exclude when parsing (will not be used)
            const filteredData = [];
            Papa.parse(csvString, { 
                header: true,
                worker: true, //enable worker thread for better performance
                delimiter: ',',
                step: (row) => {
                    const filteredRow = Object.keys(row.data)
                        .filter((key) => !doNotInclude.includes(key)) // Exclude unwanted fields
                        .reduce((filtered, key) => {
                            filtered[key] = row.data[key]; // Add only allowed fields to the new object
                            return filtered;
                        }, {});
                            
                    filteredData.push(filteredRow);
                },
                complete: () => {
                    if (filteredData.length === 0) {
                        console.error("No data parsed!");
                    }

                    const flatData = filteredData;
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
        },

        searchUser() {
            const user = this.findUser(this.nestedJSON, this.searchQuery); //if exact match found
            let potentialUsers = []

            if (!user) {
                potentialUsers = this.findPartialMatches(this.nestedJSON, this.searchQuery) //if one or more names matches what was searched
            }
            
            console.log(user, potentialUsers);


            if (user) {
                this.userSelected = user;
                console.log(user);
                this.userCardVisible = true;
            }
            else if (potentialUsers.length > 0) {
                //set as many "this.userSelected" items are there to display (from array of potential matches)
                this.userSelected = potentialUsers;
                console.log(this.userSelected)
                this.userCardVisible = true;
            }
            else {
                this.userCardVisible = false;
                alert('User not found');
            }
        },

        findUser(node, searchQuery) {
            if (node.Name.toLowerCase() === searchQuery.toLowerCase()) {
                return node;
            }
            else if (node.children) {
                let result = null;
                for (let i = 0; result === null && i < node.children.length; i++) {
                    result = this.findUser(node.children[i], searchQuery);
                }
                return result;
            }
            return null;
        },

        findPartialMatches(node, searchQuery) {
            //find partial matches in the tree
            const allResults = [];
            const lowerQuery = searchQuery.toLowerCase();

            function searchTree(currentNode) {
                if (currentNode.Name.toLowerCase().includes(lowerQuery)) {
                    allResults.push(currentNode);
                }
                if (currentNode.children) {
                    currentNode.children.forEach(child => searchTree(child));
                }
            }

            searchTree(node);
            console.log(allResults);
            return allResults;
        },

    
    },
};
</script>

<style scoped>
table {
    width: 100%;
    border-collapse: collapse;
}

th,td {
    padding: 8px;
    border: 1px solid #ddd;
    text-align: left;
}

/* Container for the user cards */
.user-card-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 20px; /* Space between cards */
  padding: 20px;
  width: 400px;
  box-sizing: border-box;
}

/* Individual card styling */
.user-card {
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 20px;
  width: 400px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px; /* Space below each card */
  background-color: white;
  box-sizing: border-box;
}


/* Card content styling */
.card-content {
  text-align: left;
}

/* Ensure text in the card is spaced out */
.card-content p {
  margin: 5px 0;
}
</style>