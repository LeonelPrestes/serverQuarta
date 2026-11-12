import pg from "pg";

const Pool = pg.Pool;

export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 5_000
});

pool.on("connect", () => {
    console.log("Nova conexão aberta com o PostgreSQL.");
});

pool.on("error", (erro) => {
    console.error("Erro inesperado no pool:", erro.message);
});
