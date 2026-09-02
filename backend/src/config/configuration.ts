export default () => ({
  dataType: process.env.DATA_TYPE ?? "FS",
  fsFolder: process.env.FS_FOLDER ?? "./data",

  db: {
    host: process.env.DB_HOST ?? "localhost",
    port: Number(process.env.DB_PORT ?? 1433),
    username: process.env.DB_USERNAME ?? "",
    password: process.env.DB_PASSWORD ?? "",
    database: process.env.DB_DATABASE ?? "HotelBookingDb",
  },
});
