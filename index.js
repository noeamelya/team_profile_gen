const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");

// node modules
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./src/page-template.js");
// const { default: Choices } = require("inquirer/lib/objects/choices");


// TODO: Write Code to gather information about the development team members, and render the HTML file.

const teamProfile = [];

// start of manager prompts 
const addManager = () => {
    return inquirer.prompt ([
        {
            type: 'input',
            name: 'name',
            message: 'Who is the manager of this team?',
        },
        {
            type: 'input',
            name: 'id',
            message: "Please enter the manager's ID.",
        },
        {
            type: 'input',
            name: 'email',
            message: "Please enter the manager's email.",
        },
        {
            type: 'number',
            name: 'officeNumber',
            message: "Please enter the manager's office number",
        }
    ]).then(answers => {
        const manager = new Manager (answers.name, answers.id, answers.email, answers.officeNumber);
        teamProfile.push(manager); 
        console.log(manager); 
    });
};

const addEmployee = () => {
    return new Promise((resolve, rej) => {
        inquirer.prompt([
            
        // {
        //     type: `list`,
        //     name: `employeeType`,
        //     message: "Use arrow to select the type of employee",
        //     Choices: [`Engineer`, `Intern`]
        // },
        {
            name: `name`,
            message: "What is the engineer's name?",
            when: ({ employeeType }) => employeeType === "Engineer"
        },
        {
            message: "What is the intern's name?",
            name: "name",
            when: ({ employeeType }) => employeeType === "Intern"
        },
        {
            message: "What is the engineer's ID?",
            name: "id",
            when: ({ employeeType }) => employeeType === "Engineer"
        },
        {
            message: "What is the intern's ID?",
            name: "id",
            when: ({ employeeType }) => employeeType === "Intern"
        },
        {
            message: "What is the engineer's email address?",
            name: "email",
            when: ({ employeeType }) => employeeType === "Engineer"
        },
        {
            message: "What is the intern's email address?",
            name: "email",
            when: ({ employeeType }) => employeeType === "Intern"
        },
        {
            message: "what is the engineer's GitHub username?",
            name: "github",
            when: ({ employeeType }) => employeeType === "Engineer"
        },
        {
            message: "Which school is the intern from?",
            name: "school",
            when: ({ employeeType }) => employeeType === "Intern"
        }
    ]).then(answers => {
        if(answers.employeeType){
            switch(answers.employeeType){
                case "Engineer":
                    const engineer = new Engineer(answers.name, answers.id, answers.email, answers.github);
                    teamProfile.push(engineer);
                    break;
                case "Intern":
                    const intern = new Intern (answers.name, answers.id, answers.email, answers.github);
                    teamProfile.push(intern);
                    break;
            }
            return addEmployee().then(() => resolve());
        } else {
            return resolve();
        }
    })
    })
};

// create function to render HTML page file using file system

const createHTMLFile = (htmlPage) => {
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR);
    }

    fs.writeFile(outputPath, htmlPage, "utf-8", (err) => {
        if(err) throw err;
        console.log(`Success! See Team Profile Page at ${outputPath}`)
    });
}

//call the manager first, then Engineer or Intern
addManager().then(() => {
    return addEmployee();
}).then(() => {
    const templateHTML = render(teamProfile)
    createHTMLFile(templateHTML);
}).catch((err) => {
    console.log(err);
});