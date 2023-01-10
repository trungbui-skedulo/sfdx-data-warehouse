const { retrieve, migrate } = require("./src/action");

const action = process.argv[2];

if (action == "retrieve") retrieve();
if (action == "migrate") migrate();
