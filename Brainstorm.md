# Brainstorm Space

This markdown is a brainstorm space where I can jot down my thoughts.

# Initial Approach/Thoughts

- Need to visualize who is under who like in example:

Relationship between parent and child node --> Manager and employee

Preliminary steps (rough steps, very high level)
1. Scrape data from the csv and store in a json
2. From the json retrieve key parameters (salary, role, etc.) for each person
3. Display data in tree format using d3-hierarchy


Scrape data:
- Are there restrictions to external js libraries (outside of d3)?
- <s>Stream data</s> (process rows 1 by 1) or Compile data all at once and then process
    - Thinking of compile data all at once to map out manager relations we need to know the whole picture




<ins>**How to determine who's a child of who**</ins>

Rely on <s> manager column </s> and the unique employeeID

Create a hashmap storing {employeeID : manager}

Manager field identifies the specific employee ID that the employee has a manager to. 


# Important reference material: 

<ins>**Management Cost (CM)**</ins>

Sum of salaries for all descendant nodes (people) who have at least one direct report. This means it calculates the salary sum of children that are **not** leaf nodes in the company tree.


<ins>**IC Cost (CI)**</ins>

Sum of salaries for people who do not manage anyone in ther company. For a given node, it would be the sum of salaries of all **leaf nodes**.


<ins>**Total Cost**</ins>

Sum of salaries of all children under a given person. Total cost = IC cost + Management cost.


<ins>**Management Cost Ratio**</ins>

Ratio of CI/CM.


# Scratchpad


```js

//Flat JSON will look like this (after Papa parse):
[{"Employee ID": 0, "Name":"John York", "Job Title": "CEO", ...} , {"Employee ID": 1, "Name":"John Pork", "Job Title": "CTO", ...}, ...]

```


**Employee ID = 0 => CEO of organization**

All people in the csv are sorted by Employee ID. The lower the employee ID, the higher up the person is the company's hierarchy.



# ROADBLOCKS

 1. Can't get the .csv file to show up under "sources" when inspect element
    
-  Online/ChatGPT says that all assets under "public" should be loaded and accessible when running local env, but can't seem to get the public folder to show up at all under sources

- The application is not reading the .csv file as text when I go to "localhost:5173/csv_data/testing_data.csv"

- Seems like the parse csv is parsing the string "/csv_data/testing_data2.csv" literally as a csv, not the file path

- It is not an issue with not using fs, fs is not applicable in this case because it is used for server side operations while we want to read the csv client side (locally).


- See [stack overflow 1](https://stackoverflow.com/questions/23603514/javascript-require-function-giving-referenceerror-require-is-not-defined) and [stack overflow 2](https://stackoverflow.com/questions/65293047/how-to-use-fs-in-the-browser-in-a-html-file)
   




# Solutions/Tips

- Don't work with so many "moving parts at once" (trying to not have one huge file for everything is good but having excessive files everywhere is not good either)

- Work in *.vue to create different components (w/ styles, scripts, template)
-  Main.js is just responsible for routing and does not contain UI


```js
<template>
  <div>
    <h1>Home</h1>
    <!-- James helper code to display raw csv data -->

    <!-- assuming csvData is referring to this.csvData -->
    <!-- also all of this I did with chatgpt so it is useful. -->
    <table v-if="csvData.length">
      <thead>
        <tr>
          <th v-for="(header, index) in csvData[0]" :key="index">{{ header }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, index) in csvData.slice(1)" :key="index">
          <td v-for="(cell, colIndex) in row" :key="colIndex">{{ cell }}</td>
        </tr>
      </tbody>
    </table>
    <h1>CHUNGUS</h1>
  </div>
</template>

<script>
// `this` here refers to the vue component instance. ask chatGPT 
// for additional understanding. make sure you know what each "part" of 
// this `default` component does! HOW TO KNOW IF U UNDERSTAND: 
// if you change some value here, you 
// will know what will change before even running the code.

// all of this is boilerplate for you to read and understand.
// `this` can be interacted with in the script and in the HTML component.

export default {
  name: 'Home',
  data() {
    return {
      csvData: [],
    };
  },
  mounted() {
    this.loadCSV();
    console.log("this.csvData: ", this.csvData)
  },
  methods: {
    async loadCSV() {
      try {
        // this will inevitably blow up for the 30k row csv. exercise left for the programmer.
        const response = await fetch('/csv_data/test.csv');
        const csvText = await response.text();
        // console.log("csvText: ", csvText)
        this.csvData = this.parseCSV(csvText);
      } catch (error) {
        console.error('Error loading CSV file:', error);
      }
    },

    // replace wth papa parse or whatever. you figure it out.......
    parseCSV(csvString) {
      const rows = csvString.split('\n');
      return rows.map(row => row.split(',')); 
    },
  },
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  padding: 8px;
  border: 1px solid #ddd;
  text-align: left;
}
</style>
```

```js
//Format for d3 hierarchy. 
{
  data: { /* Original data object */ }, // Your raw data object (e.g., Employee information)
  depth: Number, // Depth of the node in the tree (0 for root)
  height: Number, // Height of the subtree rooted at this node
  parent: Node, // Reference to the parent node (null for root)
  children: Array, // Array of child nodes (if expanded)
  temp_children: Array, // Custom property you add to store collapsed children
  x: Number, // x-coordinate (calculated by D3 layout)
  y: Number  // y-coordinate (calculated by D3 layout)
}
```






