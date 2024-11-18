<template>
    <div>
        <h1>Company Organization Chart</h1>
        <p>go back to home page and come back if no data is displayed.</p>
        
    </div>
</template>


<script lang="js">

//This component is responsible for displaying the main organization tree. 

import * as d3 from "d3";
import { useDataStore } from '@/stores/globalDataStore.js'

export default {
    name: "OrgTree",
    data() {
        const dataStore = useDataStore();
        console.log("reading from pinia store:")
        console.log(dataStore.nestedData)
        return {
            orgTree: dataStore.nestedData,
            dummyData: ''
        }
    },

    mounted() {
        if (this.orgTree) {
            this.createOrgTree()
        }
        else {
            console.error("Error, no tree found!")
        }
    },

    methods: {
        createOrgTree() {
            console.log("creating org tree")
            //A lot of the code below was chatgpt generated...
            //Issue lies with the relationship not being displayed in a tree format (more like linked list)
            
            const width = 1500; // Width of the SVG canvas
            const height = 1000; // Height of the SVG canvas
            const margin = { top: 50, right: 200, bottom: 100, left: 200};

            const svg = d3
                .select(this.$el) // Attach to the component's root DOM element
                .append("svg")
                .attr("width", width)
                .attr("height", height)
                .append("g")
                .attr("transform", `translate(${margin.left}, ${margin.top})`);

            const treeLayout = d3.tree().size([width, height]);
            const root = d3.hierarchy(this.orgTree);

            treeLayout(root)
            
            const nodes = root.descendants();
            const links = root.links(); 

            svg
                .selectAll(".link")
                .data(links)
                .enter()
                .append("path")
                .attr("class", "link")
                .attr("fill", "none")
                .attr("stroke", "#ccc")
                .attr("stroke-width", 2)
                .attr("d",d3.linkHorizontal().x(d => d.y).y(d => d.x));

            // Render the nodes
            const node = svg
                .selectAll(".node")
                .data(nodes)
                .enter()
                .append("g")
                .attr("class", "node")
                .attr("transform", d => `translate(${d.y},${d.x})`);
        
            node.append("circle").attr("r", 5).style("fill", d => (d.children ? "#69b3a2" : "#1f77b4")); 
            
            // Add labels
            node
                .append("text")
                .attr("dy", 3)
                .attr("x", d => (d.children ? -10 : 10)) // Adjust label position
                .style("text-anchor", d => (d.children ? "end" : "start"))
                .text(d => `${d.data.name} (${d.data.position})`); 
        },
    },
};

</script>