import axios from 'axios'

export const todosApi = axios.create({
  baseURL: 'http://localhost:3500',
  // baseURL: 'https://jsonplaceholder.typicode.com',
})

export const getTodos = async () => {
  const res = await todosApi.get('/todos')
  return res.data
}

export const addTodo = async (todo) => {
  return await todosApi.post('/todos', todo)
}

export const updateTodo = async (todo) => {
  return await todosApi.patch(`/todos/${todo.id}`, todo)
}

export const deleteTodo = async ({ id }) => {
  if (window.confirm('Are you sure you want to delete this todo?'))
    return await todosApi.delete(`/todos/${id}`, id)
}
