const pass = process.env.MONGO_PASS 

export default {
    dbURL: `mongodb+srv://chen100030:${pass}@cluster1.qno65qh.mongodb.net/?retryWrites=true&w=majority`,
    dbName: 'toyStore',
}


