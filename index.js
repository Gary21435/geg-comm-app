const app = require('./app')

const PORT = 3001;
app.listen(PORT, () => {
    console.log("Server up and running in port", PORT);
})