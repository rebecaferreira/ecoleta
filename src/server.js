const express = require("express")
const server = express()

//pegar o bd
const db = require("./database/db")

//configurar pasta publica
server.use(express.static("public"))

//habilitar o uso do req.body
server.use(express.urlencoded({extended: true}))


//utilizando template engine
const nunjucks = require("nunjucks")
nunjucks.configure("src/views", { 
    express: server,
    noCache: true
})


//configurar caminhos do app
//pagina inicial
server.get("/", (req, res) => {
   return res.render("index.html")

})

server.get("/create-point", (req, res) => {

//req.query: query strings da url

   return res.render("create-point.html")

})

server.post("/savepoint", (req, res) => {
   //req.body: corpo do formulario

   //inserir dados no bd
   const query = `
        INSERT INTO places (
            image,
            name,
            address,
            address2,
            state,
            city,
            items
        ) VALUES (?,?,?,?,?,?,?);
`
    const values = [
        req.body.image,
        req.body.name,
        req.body.address,
        req.body.address2,
        req.body.state,
        req.body.city,
        req.body.items

   ]

    function afterInsertData(err) {
        if (err) {
            console.log(err)
            return res.send("Erro no cadastro!")
        } 
        console.log("Cadastrado com sucesso.")
        console.log(this)
        return res.render("create-point.html", { saved: true })
    }

    db.run(query, values, afterInsertData)


   
})




server.get("/search", (req, res) => {

   const search = req.query.search

   if(search == "") {
      //pesquisa vazia
      return res.render("search-results.html", {total: 0})
   } 


   //pegar os dados do bd
   
      db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function(err, rows){
         if(err) {
               return console.log(err)
         }

         const total = rows.length

         //mostrar a pagina html com os dados do bd
         return res.render("search-results.html", {places: rows, total: total})
      })

    
 
 })



server.listen(3000)