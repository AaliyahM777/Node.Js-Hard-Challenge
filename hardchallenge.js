
// ENDPOINTS:
// GET::http://localhost:3000/employees
// GET::http://localhost:3000/employees/1   (or any other employee id)
// POST::http://localhost:3000/employees
// PUT::http://localhost:3000/employees/1   (or any other employee id)
// DELETE::http://localhost:3000/employees/1    (or any other employee id)

const express = require('express');
const app = express();
const employees = require('./mediumchallenge.json');
const Joi = require('joi');

app.use(express.json());    // parses data with JSON. Without it, json input would not be read
//app.use(express.urlencoded({extended: true}));  // parses data with urlencoded

app.get('/employees', (req, res) => res.send(employees))

// there was just some weird stuff with the line breaks, try now
app.get('/employees/:EmployeeId', (req, res) => {
    const roster = employees.find(roster => roster.EmployeeId == req.params.EmployeeId);
    if (!roster) return res.sendStatus(404);
    res.send(roster)
})



app.post('/employees', (req, res) => {
    const { error } = validateEmployee(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const newEmployee = {
        EmployeeId: employees.length + 1,
        Name: req.body.Name,
        Salary: req.body.Salary,
        DepartmentName: req.body.DepartmentName
    };
    employees.push(newEmployee)
    res.status(200).send(newEmployee)
}
)

function validateEmployee(employee) {
    const schema = {
        Name: Joi.string().min(1).max(20).required(),
        Salary: Joi.number().integer().min(10000).max(1000000).required(),
        DepartmentName: Joi.string().min(2).required()
    };
    return Joi.validate(employee, schema);
}

// 1.Our app is handling a put request(updating our exisiting data) to our employees with employee id which is our address path
// here we also take in parameters request and response
app.put('/employees/:EmployeeId', (req, res) => {
    /*(our callback function is ((req, res) => { const{error} = validateEmployee(req.body)) ) 
    it calls the validate employee 
*/
/* if employee id endpoint is invalid,
     then return a response with a 404 status meaning error and send 
     a message also saying employee not found
    */
   const roster = employees.find(roster => roster.EmployeeId == req.params.EmployeeId);
   if (!roster) return res.sendStatus(404)
    /* else show the identified employee name salary and department name if true */


    /* 2. we create a const variable with an error in curly brackets
    because we want to return a message with the error details if something goes wrong
    and we use error to check for any errors within a statement
     validate employee conatins two parameters the req = reuqest and body = our input
    */
    const { error } = validateEmployee(req.body);
    /* 3.if there is an error return a response with a 400 status(bad request) and send out first line 
  of error message this help makes make our messages short incase of sending a whole body(page) errors*/
    if (error) return res.status(400).send(error.details[0].message);
    /* 4. we have a const variable employee to equal the employees from our array in our .json file
    within our employees json array we want to find the specfic employee id

    (=== parseInt(req.params.EmployeeID) is taking the requested employee id and making sure that its
    being represented as a number or integer.  
    */

        roster.Name = req.body.Name;
        roster.Salary = req.body.Salary;
        roster.DepartmentName = req.body.DepartmentName;

    // if all goes well return status 200 meaning everything is ok and send the employee details
    res.send(roster);
});

//Our app is handling a delete request(deleting our existing data) to our employees with employee id which is our address path
// here we also take in parameters request and response
app.delete('/employees/:EmployeeId', (req, res) => {
    // same a put method
    const roster = employees.find(roster => roster.EmployeeId == req.params.EmployeeId);
    if (!roster) return res.status(404);
  
        /* else show the identified employee name salary and department name if true */
    // deleting part
    /* so we create a const varaible index set to find the correct 
    employee with the right id  */
    const index = employees.indexOf(roster);
    /* this removes a certain employee */
    employees.splice(index, 1);
    /*this returns a status 200 meaning its ok and then returns the changes send(employee); 
    (meaning it deleted the employee successfully) */
    res.send(roster);
});


app.listen(3000, () => console.log(`Express server currently running on port 3000`));