# Brainstorm Space

This markdown is a brainstorm space where I can jot down my thoughts.

# Initial Approach/Thoughts

- Need to visualize who is under who like in example:

Relationship between parent and child node --> Manager and employee

Preliminary steps (rough steps, very high level)
1. Scrape data from the csv and store in a json
2. From the json retrieve key parameters (salary, role, etc.) for each person
3. Display data in tree format using d3-hierarchy



# Important reference material: 

<ins>**Management Cost (CM)**</ins>

Sum of salaries for all descendant nodes (people) who have at least one direct report. This means it calculates the salary sum of children that are **not** leaf nodes in the company tree.


<ins>**IC Cost (CI)**</ins>

Sum of salaries for people who do not manage anyone in ther company. For a given node, it would be the sum of salaries of all **leaf nodes**.


<ins>**Total Cost**</ins>

Sum of salaries of all children under a given person. Total cost = IC cost + Management cost.


<ins>**Management Cost Ratio**</ins>

Ratio of CI/CM 








