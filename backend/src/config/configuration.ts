export default () => ({
  dataType: process.env.DATA_TYPE ?? "FS",
  fsFolder: process.env.FS_FOLDER ?? "./data",
});
