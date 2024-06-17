import sql from 'mssql'

const dbsettings = {
    user : "frgesp",
    password : "Password!",
    server : "frgespserver.database.windows.net",
    database : "Inventario2",
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