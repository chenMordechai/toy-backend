const pass = process.env.MONGO_PASS

export default {
    // dbURL: `mongodb+srv://chen100030:${pass}@cluster1.qno65qh.mongodb.net/?retryWrites=true&w=majority`,
    dbURL: 'mongodb://127.0.0.1:27017',
    dbName: 'toyStore',
}
