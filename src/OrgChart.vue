<template>
    <div style="background-color: powderblue;">
        <h1>AgentNoon Company Organization Chart</h1>
        <p><strong>Don't refresh this page directly, go back to home page (otherwise csv data won't be accessible in Pinia yet)</strong></p>
        <h1>Total Organization Headcount: {{ this.headcount }}</h1>
        <div id="tree-container" style="width: 100%; height: 100%;">
            <div ref="infoCard" class="emp-info-card" style="display: none;">
                <p><strong>Name: </strong> {{ userSelected.name }}</p>
                <p><strong>Job Title: </strong> {{ userSelected.jobTitle }}</p>
                <p><strong>Email: </strong> {{ userSelected.email }}</p>
                <p><strong>Location: </strong> {{ userSelected.location }}</p>
                <p><strong>Employee Level: </strong> {{ userSelected.level }}</p>
                <p><strong>Job Family: </strong> {{ userSelected.jobFamily }}</p>
                <p><strong>Agentnoon Entity: </strong>{{ userSelected.entity }}</p>
                <p><strong>Number of Subordinates: </strong>{{ userSelected.descendants }}</p>
                <p><strong>Management Cost: </strong> {{`$${userSelected.manage_cost }`}}</p>
                <p><strong>IC Cost: </strong> {{`$${userSelected.ic_cost }` }}</p>
                <p><strong>Total Cost: </strong> {{`$${userSelected.total_cost }` }}</p>
                <p><strong>Management Cost Ratio: </strong> {{ userSelected.MCR }}</p>
            </div>
        </div>
    </div>
</template>



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
  stroke: sandybrown;
  stroke-width: 2px;
}

.emp-info-card {
  position: absolute;
  background-color: white;
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  font-size: 14px;
  pointer-events: none; /* Prevent the card from blocking mouse events */
  z-index: 1000; /* Ensure it appears above everything else */
}
</style>


<script lang="js">

//This component is responsible for displaying the main organization tree. 

import * as d3 from "d3";
import { useDataStore } from '@/stores/globalDataStore.js'
import { countChildren, calcManageCost, calcICCost, calcTotalCost, calcMCR } from "@/utils/pathCalcs.js";
export default {
    name: "OrgTree",
    data() {
        const dataStore = useDataStore();
        return {
            orgTree: dataStore.nestedData, //raw json data stored in Pinia
            svgWidth: 0,
            svgHeight: 0,
            margin: { top: 50, right: 200, bottom: 100, left: 200},
            root: null, //root of org tree (d3 hierarchy object)
            g: null, //group 
            index: 0, //id for tracking node element (for node collapsing logic) 
            tree: null,
            userSelected: { // employee info to be displayed (when mouse hovers over)
                name: "",
                jobTitle: "",
                email: "",
                location: "",
                level: 0,
                jobFamily: "",
                entity: "",
                descendants: "",
                salary: 0,
                ic_cost: 0,
                manage_cost: 0,
                MCR: 0,
                total_cost: 0
            },
            headcount: 0, // employee count of ALL members of the organization (CEO included)
        }
    },

    mounted() {
        if (this.orgTree) {
            this.svgHeight = 800;
            this.svgWidth = 1000;
            this.createOrgTree();
            window.addEventListener("resize", this.resize);

            this.setCalcVals(this.orgTree);
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
            const root_node = d3.hierarchy(this.orgTree);

            this.root = root_node;
            this.root.x0 = this.svgHeight / 2;
            this.root.y0 = 0;
            this.g = g;
            this.tree = treeLayout;

            treeLayout(root_node);

            // Create links between nodes
            g.selectAll(".link")
                .data(root_node.links())
                .enter()
                .append("path")
                .attr("class", "link")
                .attr("fill", "none")
                .attr("stroke", "#ccc")
                .attr("stroke-width", 3)
                .attr("d",d3.linkHorizontal().x((d) => d.y).y((d) => d.x));

            // Create nodes
            const nodes = g
                .selectAll(".node")
                .data(root_node.descendants())
                .enter()
                .append("g")
                .attr("class", "node")
                .attr("transform", (d) => `translate(${d.y}, ${d.x})`);

            nodes
                .append("circle")
                .attr("r", 5)
                .attr("fill", (d) => d.children ? "steelblue": "#2d5475")
                .on("click", (event, d) => this.onNodeClick(d))
                .on("mouseover", (event, d) => this.showInfoCard(event, d))
                .on("mouseout", (event,d) => this.hideInfoCard());

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
            const treeWidth = root_node.y; // Horizontal size of the tree
            const treeHeight = root_node.x; // Vertical size of the tree

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
            d3.select("#chart-container").attr("width", this.svgWidth).attr("height", this.svgHeight);
        },

        onNodeClick(d) {
            //toggle visibility for a subtree, allowing for collapsing/expanding as needed
            if (d.children) {
                d.temp_children = d.children; // collapse node
                d.children = null;
            } 
            else {
                // Expand the node
                d.children = d.temp_children;
                d.temp_children = null;
            }

            this.updateTree(d); // Re-render the tree
        },

        updateTree(source) {
            //logic to update tree to reflect changes
          
            this.tree(this.root);

            const nodes = this.root.descendants();
            const links = this.root.links();

        
            const node = this.g.selectAll(".node").data(nodes, d => d.id || (d.id = ++(this.index)));

            // Enter new nodes at the parent's previous position
            const nodeEnter = node
                .enter()
                .append("g")
                .attr("class", "node")
                .attr("transform", () => `translate(${source.y0},${source.x0})`)
                .on("click", (event, d) => this.onNodeClick(d))
                .on("mouseover", (event, d) => this.showInfoCard(event, d))
                .on("mouseout", (event,d) => this.hideInfoCard());

            nodeEnter
                .append("circle")
                .attr("r", 5)
                .attr("fill", (d) => (d._children ? "steelblue" : "#2d5475"));

            nodeEnter
                .append("text")
                .attr("dy", 4)
                .attr("x", (d) => (d._children ? -10 : 10))
                .attr("text-anchor", (d) => (d._children ? "end" : "start"))
                .text((d) => `${d.data.Name} (${d.data["Job Title"]})`);

            // Update node positions
            const nodeUpdate = node
                .merge(nodeEnter)
                .transition()
                .duration(750)
                .attr("transform", (d) => `translate(${d.y},${d.x})`);

            // Remove exiting nodes
            const nodeExit = node
                .exit()
                .transition()
                .duration(750)
                .attr("transform", () => `translate(${source.y},${source.x})`)
                .remove();

            // Update links
            const link = this.g.selectAll(".link").data(links, (d) => d.target.id);

            link
                .enter()
                .insert("path", "g")
                .attr("class", "link")
                .merge(link)
                .transition()
                .duration(750)
                .attr("d",d3.linkHorizontal().x((d) => d.y).y((d) => d.x));

            link.exit().remove();

            // Store positions for transition
            nodes.forEach((d) => {
                d.x0 = d.x;
                d.y0 = d.y;
            });
            
        },

        showInfoCard(event, d) {
            //displays user info card with key parameters
            // Get the info card element
            const infoCard = this.$refs.infoCard;

            // Populate the info card with data
            this.userSelected = {
                name: d.data.Name,
                email: d.data.Email,
                jobTitle: d.data["Job Title"],
                location: d.data.Location,
                level: d.data.level,
                jobFamily: d.data["Job Family"],
                entity: d.data.Entity,
                salary: d.data.Salary, //not displayed but used in calculations for params below. 

                //Following values are taken from the pre-calulated values when mounted.
                manage_cost: this.formatWithCommas(d.data["Management Cost"]),
                ic_cost: this.formatWithCommas(d.data["IC Cost"]),
                total_cost: this.formatWithCommas(d.data["Total Cost"]),
                MCR: d.data["MCR"],
                descendants: this.formatWithCommas(d.data["Descendants"])
            };

            // Get the node's position in the SVG
            const nodePosition = event.target.getBoundingClientRect();
            const svgContainer = document.querySelector("#tree-container").getBoundingClientRect();

            // Calculate the position relative to the node
            const left = nodePosition.right - svgContainer.left + 10; // Align right of the node text
            const top = nodePosition.top - svgContainer.top - 10; // Adjust slightly above the node center

            // Apply the position to the card
            infoCard.style.left = `${left}px`;
            infoCard.style.top = `${top}px`;

            // Show the card
            infoCard.style.display = "block";
        },

        hideInfoCard() {
            //hides the info card once mouse leaves node
            const infoCard = this.$refs.infoCard;
            infoCard.style.display = "none";
        },

        setCalcVals(node) {
            //method to assign manage cost, ic cost, # of descendants, total cost, and MCR to the node and all its children
            const memo = new Map();
            const manageCost = calcManageCost(node);
            const ic_cost = calcICCost(node);
            const children = countChildren(node, memo);
            const total_cost = calcTotalCost(node);
            const mcr = calcMCR(manageCost, ic_cost);

            node["Management Cost"] = manageCost;
            node["IC Cost"] = ic_cost;
            node["Total Cost"] = total_cost;
            node["MCR"] = Math.round(mcr * 100) / 100;
            node["Descendants"] = children;
            
            if (node.children && node.children.length > 0) {
                for (const child of node.children) {
                    this.setCalcVals(child);
                }
            }
            
            this.headcount = 1 + children;
        },

        formatWithCommas(number) {
            return new Intl.NumberFormat('en-US').format(number);
        }


    },
};

</script>


