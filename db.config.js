module.exports = {
  HOST: "logcalhost",
  USER: "postgres",
  PASSWORD: "findjob",
  DB: "findajob",
  dialect: "postgres",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
