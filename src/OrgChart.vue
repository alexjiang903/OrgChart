<template>
    <div>
        <h1>Company Organization Chart</h1>
        <p>NOTE: go back to home page and come back if no data is displayed.</p>
        <div id="tree-container" style="width: 100%; height: 100%;"></div>
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
            svgWidth: 0,
            svgHeight: 0,
            margin: { top: 50, right: 200, bottom: 100, left: 200}
        }
    },

    mounted() {
        if (this.orgTree) {
            this.svgHeight = 800;
            this.svgWidth = 1200;
            this.createOrgTree();
            window.addEventListener("resize", this.resize);
        }
        else {
            console.error("Error, no tree found!")
        }
    },

    beforeUnmount() {
        window.removeEventListener("resize", this.resize);
    },

    methods: {
        createOrgTree() {
            console.log("creating org tree")

            const margin = this.margin;
            const innerWidth = this.svgWidth - margin.left - margin.right;
            const innerHeight = this.svgHeight - margin.top - margin.bottom;

            const svg = d3
                .select("#tree-container") 
                .append("svg")
                .attr("width", this.svgWidth)
                .attr("height", this.svgHeight)
                .attr("id", "chart-container")

            // Add a zoomable group
            const g = svg
                .append("g")
                .attr("id", "treeGroup")
                .attr("transform", `translate(${margin.left}, ${margin.top})`);

            const zoom = d3
                .zoom()
                .scaleExtent([0.5, 2]) // Limit zoom levels
                .on("zoom", (event) => {
                    g.attr("transform", event.transform);
                });

            svg.call(zoom);

            const treeLayout = d3.tree().size([innerHeight, innerWidth]);
            const root = d3.hierarchy(this.orgTree);

            treeLayout(root);

            // Create links between nodes
            g.selectAll(".link")
                .data(root.links())
                .enter()
                .append("path")
                .attr("class", "link")
                .attr("fill", "none")
                .attr("stroke", "#ccc")
                .attr("stroke-width", 2)
                .attr("d",d3.linkHorizontal().x((d) => d.y).y((d) => d.x));

            // Create nodes
            const nodes = g
                .selectAll(".node")
                .data(root.descendants())
                .enter()
                .append("g")
                .attr("class", "node")
                .attr("transform", (d) => `translate(${d.y}, ${d.x})`);

            nodes
                .append("circle")
                .attr("r", 5)
                .attr("fill", "steelblue");

            nodes
                .append("text")
                .attr("dx", 10)
                .attr("dy", 4)
                .text((d) => d.data.Name +` (${d.data["Job Title"]})`)
                .style("font-size", "12px");

            // Calculate the center of the SVG canvas
            const svgCenterX = this.svgWidth / 2;
            const svgCenterY = this.svgHeight / 2;

            // Calculate the tree's dimensions
            const treeWidth = root.y; // Horizontal size of the tree
            const treeHeight = root.x; // Vertical size of the tree

            // Adjust the tree to be centered in the canvas
            const initialTransform = d3.zoomIdentity
                .translate(svgCenterX - treeWidth / 2, svgCenterY - treeHeight / 2)
                .scale(1);

            // Apply the initial transform
            svg.call(zoom.transform, initialTransform);
            g.attr("transform", initialTransform);
        },

        resize() {
            console.log("resize called!")
            // Update dimensions based on the new window size
            this.svgWidth = window.innerWidth;
            this.svgHeight = window.innerHeight;

            // Update SVG dimensions
            d3.select("#orgTreeSVG").attr("width", this.svgWidth).attr("height", this.svgHeight);

            // Reposition the tree group to keep it centered
            this.treeGroup.attr("transform", `translate(${this.svgWidth / 2}, ${this.svgHeight / 2})`);
        }
    },
};

</script>

<style>
#tree-container {
  overflow: hidden;
  position: relative;
}
.node circle {
  fill: steelblue;
}
.node text {
  font-size: 12px;
  font-family: Arial, sans-serif;
}
.link {
  fill: none;
  stroke: #ccc;
  stroke-width: 2px;
}
</style>