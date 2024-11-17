<template>
  <div>
    <h1>Home</h1>
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
};
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
