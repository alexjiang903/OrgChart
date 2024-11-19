// This JS Script is responsible for calculating the management cost, IC cost, total cost, and MCR for each node in data.

export function countChildren(node, memo = new Map()) {
    //Node is the object of the employee
    let totalChildren = 0;
    if (!node) {
        return 0;
    }

    if (memo.has(node)) {
        return memo.get(node);
    }

    if (node.children && node.children.length > 0) {
        //if the node's children key contains children and is non-empty, recursively count every child node's children until leaf. 
        for (const child of node.children) {
            totalChildren += (1 + countChildren(child, memo));
        }
    }
    memo.set(node, totalChildren);
    return totalChildren;
};

function getNumSal(stringSal) {
    //helper function to convert string salary "$XXX,XXX" -> "XXXXXX"
    return Number(stringSal.replace(/[$,]/g, ""));
}

export function calcManageCost(node) {
    if (!node) {
        return 0;
    } 
    let manageCost = 0;
    if (node.children && node.children.length > 0) {
        for (const child of node.children) {
            if (child.children && child.children.length > 0) {
                const childSalary = getNumSal(child.Salary);
                manageCost += childSalary; // Add child salary if they manage at least one other employee
            }
            manageCost += calcManageCost(child); // Recursively calculate for subordinates
        }
    }
    return manageCost;
}

export function calcICCost(node) {
    if (!node) {
        return 0;
    }

    let ic_cost = 0;
    if (node.children && node.children.length > 0) {
        for (const child of node.children) {
            if (!child.children || child.children.length === 0) {
                const childSalary = getNumSal(child.Salary);
                ic_cost += childSalary;
            }
            ic_cost += calcICCost(child);
        }
    }

    return ic_cost;
}


export function calcTotalCost(node) {
    if (!node) {
        return 0;
    }
    let totalCost = 0;

    if (node.children && node.children.length > 0) {
        for (const child of node.children) {
            totalCost += getNumSal(child.Salary) //add child's salary to the total cost
            totalCost += calcTotalCost(child); //add the children of the child salaries
        }
    }

    return totalCost;
}

export function calcMCR(mc, ic) {
    const res = (mc !== 0) ? (ic / mc): 0;
    return res;
}

