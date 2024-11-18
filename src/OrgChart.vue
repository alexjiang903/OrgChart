<template>
    <div>
        <h1>Home Page of Application</h1>
        
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
            const width = 1000; // Width of the SVG canvas
            const height = 1500; // Height of the SVG canvas
            const margin = { top: 50, right: 150, bottom: 50, left: 150 };

            const svg = d3
                .select(this.$el) // Attach to the component's root DOM element
                .append("svg")
                .attr("width", width)
                .attr("height", height)
                .append("g")
                .attr(
                    "transform",
                    `translate(${margin.left}, ${margin.top})`
                );

            const root = d3.hierarchy(this.orgTree);
            
            const treeLayout = d3.tree().size([
                height - margin.top - margin.bottom,
                width - margin.left - margin.right,
            ]);

            treeLayout(root)

            
            const link = svg //link between nodesd
                .selectAll(".link")
                .data(root.links())
                .enter()
                .append("path")
                .attr("class", "link")
                .attr("d", d3.linkHorizontal()
                    .x(d => d.y) // Horizontal position
                    .y(d => d.x) // Vertical position
                )
                .style("fill", "none")
                .style("stroke", "#ccc")
                .style("stroke-width", 2);
            
            const node = svg //nodes for each employee
                .selectAll(".node")
                .data(root.descendants())
                .enter()
                .append("g")
                .attr("class", "node")
                .attr("transform", d => `translate(${d.y},${d.x})`);
            
            node.append("circle").attr("r", 5).style("fill", "#69b3a2"); //create a circle shape for the employee

            node
                .append("text")
                .attr("dy", 3)
                .attr("x", d => (d.children ? -10 : 10)) // Adjust text position
                .style("text-anchor", d => (d.children ? "end" : "start"))
                .text(d => `${d.data.name} (${d.data.position || "Unknown"})`); // Combine name and position

        },
    },
};

</script>