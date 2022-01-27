const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers; 

  const findUser = users.find(user => user.username === username);

  if(!findUser) {
    return response.status(400).json({ error: "Users not found" })
  }

  request.user = findUser;

  return next();
}

app.post('/users', (request, response) => {
  const { name, username } = request.body;
  
  const user = {
    id: uuidv4(),
    name,
    username,
    todos: []
  }

  const verifyUserAlreadyExists = users.some( user => user.username ===  username);

  if(verifyUserAlreadyExists) {
    response.status(400).json({ error: "Users already exists!" })
  }

  users.push(user);

  return response.status(201).send(user);
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request;

  const findUser = users.find(user => user.username === user.username);

  return response.json(findUser.todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { title, deadline } = request.body;

  const todo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  }
  
  user.todos.push(todo);

  return response.status(201).send(todo);
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { id } = request.params;
  const { title, deadline } = request.body;
  const { user } = request;
  
  const find = user.todos.find(todo => todo.id === id);

  find.title = title;
  find.deadline = new Data(deadline);

  console.log(find)

  
  return response.status(200).send()
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;