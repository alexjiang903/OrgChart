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
   











