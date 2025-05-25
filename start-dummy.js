const connectMongo = require('./mongodb.js');
const { User, Expense, Refund, Project } = require("./models/index.js");
const ProjectPreferences = require('./models/mongodb/project.preference.js');
const service = require("./services/account.services.js");
const clearDatabaseAndFiles = require('./clearDatabase.js');

const path = require("path");
const fs = require("fs");
const DUMMY_ASSETS_DIR = path.join(__dirname, "./userdata/dummy-assets");
const UPLOADS_DIR = path.join(__dirname, "./userdata/receipt");
const attachmentRefs = [];

async function createDummyImages(){
    if (!fs.existsSync(UPLOADS_DIR)) {
        fs.mkdirSync(UPLOADS_DIR);
    }
    const dummyFiles = fs.readdirSync(DUMMY_ASSETS_DIR);
    dummyFiles.forEach((file) => {
        const src = path.join(DUMMY_ASSETS_DIR, file);
        const dest = path.join(UPLOADS_DIR, file);
        fs.copyFileSync(src, dest);
    });
    let refs = dummyFiles.map(file => path.join(__dirname, './userdata/receipt', file));
    attachmentRefs.push(...refs);
}

async function generateDummyData(){
    await createDummyImages();
    await connectMongo();

    const dummyUsers = [
    { email: "alice@gmail.com", password: await service.getHashed("123") },
    { email: "roberto@gmail.com", password: await service.getHashed("123") },
    { email: "carol@gmail.com", password: await service.getHashed("123") },
    { email: "david@gmail.com", password: await service.getHashed("123") },
    { email: "eva@gmail.com", password: await service.getHashed("123") },
    { email: "lucas@gmail.com", password: await service.getHashed("123") },
    { email: "graca@gmail.com", password: await service.getHashed("123") },
    { email: "rogerio@gmail.com", password: await service.getHashed("123") },
    { email: "ivan@gmail.com", password: await service.getHashed("123") },
    { email: "joao@gmail.com", password: await service.getHashed("123") },
    { email: "pedro@gmail.com", password: await service.getHashed("123") },
    { email: "leon@gmail.com", password: await service.getHashed("123") },
    { email: "aline@gmail.com", password: await service.getHashed("123") },
    { email: "oscar@gmail.com", password: await service.getHashed("123") },
    { email: "pablo@gmail.com", password: await service.getHashed("123") }
    ];

    const dummyProjects = [
    { name: "Iniciativa Aurora" },
    { name: "Platforma Nimbus" },
    { name: "Análise de Estoques" },
    { name: "Núvem Zenith" },
    { name: "Atlas Network" },
    { name: "Gestão de Produtos" }
    ];
       
    const dummyRefunds = [
        {
            projectId: 1,
            userId: 1,
            date: new Date(),
            status: "approved"
        },
        {
            projectId: 2,
            userId: 2,
            date: new Date(),
            status: "in-process"
        },
        {
            projectId: 3,
            userId: 3,
            date: new Date(),
            status: "rejected"
        },
        {
            projectId: 4,
            userId: 5,
            date: new Date(),
            status: "approved"
        },
        {
            projectId: 3,
            userId: 9,
            date: new Date(),
            status: "in-process"
        },
        {
            projectId: 6,
            userId: 6,
            date: new Date(),
            status: "approved"
        },
        // Refunds that will exceed refundLimit
        {
            projectId: 4,
            userId: 8,
            date: new Date(),
            status: "approved"
        },
        {
            projectId: 3,
            userId: 14,
            date: new Date(),
            status: "in-process"
        }
    ];
    const dummyExpenses = [
        // Normal expenses
        {
            userId: 1,
            refundId: 1,
            type: "Value",
            value: 120,
            date: new Date(),
            attachmentRef: attachmentRefs[0],
            description: ""
        },
        {
            userId: 1,
            refundId: 1,
            type: "quantity",
            value: 63,
            quantityType: "Gasolina",
            date: new Date(),
            attachmentRef: attachmentRefs[1],
            description: ""
        },
        {
            userId: 2,
            refundId: 2,
            type: "Value",
            value: 250,
            date: new Date(),
            attachmentRef: attachmentRefs[2],
            description: ""
        },
        {
            userId: 3,
            refundId: 3,
            type: "Value",
            value: 100,
            date: new Date(),
            attachmentRef: attachmentRefs[3],
            description: ""
        },
        {
            userId: 5,
            refundId: 4,
            type: "Value",
            value: 200,
            date: new Date(),
            attachmentRef: attachmentRefs[4],
            description: ""
        },
        {
            userId: 9,
            refundId: 5,
            type: "Value",
            value: 300,
            date: new Date(),
            attachmentRef: attachmentRefs[5],
            description: ""
        },
        {
            userId: 9,
            refundId: 5,
            type: "quantity",
            quantityType: "Estadía",
            value: 200,
            date: new Date(),
            attachmentRef: attachmentRefs[6],
            description: ""
        },
        {
            userId: 6,
            refundId: 6,
            type: "quantity",
            quantityType: "Publicidade",
            value: 150,
            date: new Date(),
            attachmentRef: attachmentRefs[7],
            description: ""
        },
        // Refund/Expense exceeding limit
        {
            userId: 8,
            refundId: 7,
            type: "Value",
            value: 900,
            date: new Date(),
            attachmentRef: attachmentRefs[8],
            description: "Substituição urgente de equipamento."
        },
        {
            userId: 8,
            refundId: 7,
            type: "quantity",
            value: 150,
            quantityType: "Taxa do contratante",
            date: new Date(),
            attachmentRef: attachmentRefs[9],
            description: "Taxa especial do contratante."
        },
        {
            userId: 14,
            refundId: 8,
            type: "Value",
            value: 340,
            date: new Date(),
            attachmentRef: attachmentRefs[10],
            description: "Viagem para conferência acima do orçamento."
        },
        {
            userId: 14,
            refundId: 8,
            type: "Value",
            value: 340,
            date: new Date(),
            attachmentRef: attachmentRefs[11],
            description: ""
        }
    ];

    const dummyPreferences = [
        {
        projectId: 1,
        refundLimit: 500,
        expenseLimit: 300,
        quantityValues: [
            { "Gasolina": 7 },
            { "Necessidades Basicas": 15 }
        ]
        },
        {
            projectId: 2,
            refundLimit: 800,
            expenseLimit: 450,
            quantityValues: [
                { "Licensa de Software": 120 },
                { "Cloud Storage": 50 }
            ]
        },
        {
            projectId: 3,
            refundLimit: 600,
            expenseLimit: 350,
            quantityValues: [
                { "Milhas": 0.5 },
                { "Estadía": 200 }
            ]
        },
        {
            projectId: 4,
            refundLimit: 1000,
            expenseLimit: 700,
            quantityValues: [
                { "Horas de Consultoria": 75 },
                { "Taxa do contratante": 500 }
            ]
        },
        {
            projectId: 5,
            refundLimit: 750,
            expenseLimit: 500,
            quantityValues: [
                { "Horas de Servidor": 20 },
                { "Armazenamento de Banco de Dados": 100 }
            ]
        },
        {
            projectId: 6,
            refundLimit: 900,
            expenseLimit: 600,
            quantityValues: [
                { "Publicidade": 150 }
            ]
        }
    ];

    let users = await User.bulkCreate(dummyUsers, {returning: true});
    let projects = await Project.bulkCreate(dummyProjects, {returning: true});
    (()=>{
        users[0].addProjects([projects[0], projects[1], projects[2]]);
        users[1].addProjects([projects[1], projects[3]]);
        users[2].addProjects([projects[2], projects[4], projects[5]]);
        users[3].addProjects([projects[0], projects[4]]);
        users[4].addProjects([projects[3]]);
        users[5].addProjects([projects[0], projects[1], projects[5]]);
        users[6].addProjects([projects[2]]);
        users[7].addProjects([projects[1], projects[3], projects[4]]);
        users[8].addProjects([projects[0], projects[2]]);
        users[9].addProjects([projects[5]]);
        users[10].addProjects([projects[3], projects[4]]);
        users[11].addProjects([projects[1], projects[5]]);
        users[12].addProjects([projects[0], projects[4]]);
        users[13].addProjects([projects[2], projects[3]]);
        users[14].addProjects([projects[1]]);
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