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
Rely on manager column (# of manager a given employee has) and the unique employeeID

Create a hashmap storing {employeeID : manager}

Less # of managers --> higher up person is in tree

Manager = 0 --> person is at the top (CEO, CTO, etc.)
Manager > 0 --> person must not be a root, has to report to at least one other person









# Important reference material: 

<ins>**Management Cost (CM)**</ins>

Sum of salaries for all descendant nodes (people) who have at least one direct report. This means it calculates the salary sum of children that are **not** leaf nodes in the company tree.


<ins>**IC Cost (CI)**</ins>

Sum of salaries for people who do not manage anyone in ther company. For a given node, it would be the sum of salaries of all **leaf nodes**.


<ins>**Total Cost**</ins>

Sum of salaries of all children under a given person. Total cost = IC cost + Management cost.


<ins>**Management Cost Ratio**</ins>

Ratio of CI/CM 








