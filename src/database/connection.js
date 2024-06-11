import sql from 'mssql'

const dbsettings = {
    user : "frgesp",
    //user : "sa",
    password : "Password!",
    server : "frgespserver.database.windows.net",
    //server: "localhost",
    database : "Inventario",
    options : {
        encrypt : true,
        trustServerCertificate : true
    } 
};

export const getConnection = async () =>
{
    try{
        const pool = await sql.connect(dbsettings);
        return pool;
    }
    catch(error){
        console.error(error);
    }
}