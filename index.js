const express = require("express");
const uuid = require("uuid");

const port = 3000;
const app = express();
app.use(express.json());

const orders = [];

const checkOrderId = (request, response, next) => {
  //a funçao checkOrderIde é um middleware
  const { id } = request.params;

  const index = orders.findIndex((product) => product.id === id);

  if (index < 0) {
    return response.status(404).json({ error: "Order not found" });
  }
  request.orderIndex = index;
  request.orderId = id;

  next();
};

app.get("/orders", (request, response) => {
  console.log("A rota foi chamada");

  return response.json(orders);
});

app.post("/orders", (request, response) => {
  const { order, clientName, price, status } = request.body;

  const product = { id: uuid.v4(), order, clientName, price, status };

  orders.push(product);

  return response.status(201).json(product);
});

app.put("/orders/:id", checkOrderId, (request, response) => {
  const { order, clientName, price, status } = request.body;
  const index = request.orderIndex;
  const id = request.orderId;

  const updateOrder = { id, order, clientName, price, status };

  orders[index] = updateOrder;

  return response.json(updateOrder);
});

app.delete("/orders/:id", checkOrderId, (request, response) => {
  const index = request.orderIndex;

  orders.splice(index, 1);

  return response.status(204).json();
});

app.patch("/orders/:id", checkOrderId, (request, response) => {
  const index = request.orderIndex;
  const id = request.orderId;

  const { order, clientName, price, status } = request.body;

  const updateOrder = { id, order, clientName, price, status: "Pronto" };

  // console.log(request)

  orders[index] = updateOrder;

  return response.json(updateOrder);
});

app.listen(port, () => {
  console.log(`🚀Server started on port ${port}`);
});
