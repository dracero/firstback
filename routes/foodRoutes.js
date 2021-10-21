import express from "express";
import foodModel  from "../models/food.js";

const app = express();

//Acá leo la base de datos con el endpoint https://<URL>/foods
app.get("/foods", async (request, response) => {
  const foods = await foodModel.find({});

  try {
    response.send(foods);
  } catch (error) {
    response.status(500).send(error);
  }
});
//acá cargo un valor en la base de datos  https://<URL>/food?name=<nombre>&calories=<calorias>
app.post("/food", async (request, response) => {
    const obj = JSON.stringify({name: request.query.name, calories:request.query.calories});
    const food = new foodModel(JSON.parse(obj));
  
    try {
      await food.save();
      response.send(food);
    } catch (error) {
      response.status(500).send(error);
    }
  });
 //<id> es que id gigante de Mongo, eso lo tenemos que cambiar, tenemos que buscar por nombre 
// acá modifico los valores con el endpoint https://<URL>/food/<id>?name=<nombre>&calories=<calorias>
//no hace falta que la cadena esté completa, puede estar name o no y lo mismo calories
app.put("/food/:id", async (request, response) => {
    const obj = JSON.stringify({name: request.query.name, calories:request.query.calories});
    try {
      await foodModel.findByIdAndUpdate(request.params.id, JSON.parse(obj));
      await foodModel.save();
      response.send(food);
    } catch (error) {
      response.status(500).send(error);
    }
  });
// acá borro con el endpoint https://<URL>/food/<id>
// el id es el gigante de Mongo, eso hay que cambiarlo
app.delete("/food/:id", async (request, response) => {
    try {
      const food = await foodModel.findByIdAndDelete(request.params.id);
  
      if (!food) response.status(404).send("No item found");
      response.status(200).send();
    } catch (error) {
      response.status(500).send(error);
    }
  });

  app.use((error, req, res, next) => {
    // Sets HTTP status code
    res.status(error.status)
  
    // Sends response
    res.json({
      status: error.status,
      message: error.message,
      stack: error.stack
    })
  })

  export default app;