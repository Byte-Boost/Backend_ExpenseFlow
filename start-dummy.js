const connectMongo = require('./mongodb.js');
const { User, Expense, Refund, Project } = require("./models/index.js");
const ProjectPreferences = require('./models/mongodb/project.preference.js');
const service = require("./services/account.services.js");
const clearDatabaseAndFiles = require('./clearDatabase.js');

async function generateDummyData(){
    await connectMongo();

    const dummyUsers = [
        {
            email: "red@gmail.com",
            password: await service.getHashed("123"),
        },
        {
            email: "green@gmail.com",
            password: await service.getHashed("123"),
        },
        {
            email: "blue@gmail.com",
            password: await service.getHashed("123"),
        },
        {
            email: "yellow@gmail.com",
            password: await service.getHashed("123"),
        },
        {
            email: "black@gmail.com",
            password: await service.getHashed("123"),
        },
        {
            email: "white@gmail.com",
            password: await service.getHashed("123"),
        },
    ];    
    const dummyProjects = [
        {
            name: "Project A",
        },
        {
            name: "Project B",
        },
        {
            name: "Project C",
        },
        {
            name: "Project D",
        },
    ]        
    const dummyRefunds = [
        { 
            projectId: 1,
            userId: 1,
            date: new Date(), 
            status: "approved" 
        },
        { 
            projectId: 2,
            userId: 1,
            date: new Date(), 
            status: "in-process" 
        },
        { 
            projectId: 1,
            userId: 2,
            date: new Date(), 
            status: "rejected" 
        },
        { 
            projectId: 1,
            userId: 2,
            date: new Date(), 
            status: "new" 
        },
        { 
            projectId: 3,
            userId: 3,
            date: new Date(), 
            status: "in-process" 
        },
        { 
            projectId: 4,
            userId: 3,
            date: new Date(), 
            status: "in-process" 
        },
    ];        
    const dummyExpenses = [
        {
            userId: 1, 
            refundId: 1,
            type: "Value",
            value: 40,
            date: new Date(),
            attachmentRef: "",
            description: "",
        },
        {
            userId: 1, 
            refundId: 1,
            type: "Value",
            value: 50,
            date: new Date(),
            attachmentRef: "",
            description: "",
        },
        {
            userId: 1, 
            refundId: 2,
            type: "Value",
            value: 90,
            date: new Date(),
            attachmentRef: "",
            description: "",
        },
        {
            userId: 2, 
            refundId: 3,
            type: "Value",
            value: 150,
            date: new Date(),
            attachmentRef: "",
            description: "",
        },
        {
            userId: 3, 
            refundId: 5,
            type: "Value",
            value: 60,
            date: new Date(),
            attachmentRef: "",
            description: "",
        },
        {
            userId: 3, 
            refundId: 6,
            type: "Value",
            value: 75,
            date: new Date(),
            attachmentRef: "",
            description: "",
        },
    ];
    const dummyPreferences = [
        {
            projectId: 1,
            refundLimit: 100,
            expenseLimit: 60,
            quantityValues: [
                {"Gasoline": 9},
                {"Accomodation": 400}
            ]
        },
        {
            projectId: 2,
            refundLimit: 720,
            expenseLimit: 105,
            quantityValues: [
                {"Gasoline": 6.5},
            ]
        },
        {
            projectId: 3,
            refundLimit: 180,
            expenseLimit: 75,
            quantityValues: [
                {"Gasoline": 8}
            ]
        },
        {
            projectId: 4,
            refundLimit: null,
            expenseLimit: null,
            quantityValues: [
                {"Gasoline": 9.5}
            ]
        },
    ];
        
    let users = await User.bulkCreate(dummyUsers, {returning: true});
    let projects = await Project.bulkCreate(dummyProjects, {returning: true});
    (()=>{
        users[0].addProjects([projects[0], projects[1], projects[2], projects[3]]);
        users[1].addProjects([projects[0], projects[1]]);
        users[2].addProjects([projects[2], projects[3]]);
        users[3].addProjects([projects[0]]);
        users[4].addProjects([projects[1]]);
        users[5].addProjects([projects[2]]);
    })();
    await Refund.bulkCreate(dummyRefunds);
    await Expense.bulkCreate(dummyExpenses);
    await ProjectPreferences.insertMany(dummyPreferences);
    console.log("\nDummy data generated\n");

}


async function startDummy() {
  await clearDatabaseAndFiles();
  await generateDummyData();
  require('./index');
}

startDummy();