import React from 'react'
import { useMutation, useQueryClient } from 'react-query'
import { updateTodo, deleteTodo} from '../api/todosApi'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'

const TodoItem = ({todo, handleDelete}) => {
	const queryClient = useQueryClient()

	const updateTodoMutation = useMutation(updateTodo, {
		onSuccess: () => {
			queryClient.invalidateQueries('todos')
		}
	})

	// const deleteTodoMutation = useMutation(deleteTodo, {
	// 	onSuccess: () => {
	// 		queryClient.invalidateQueries('todos')
	// 	}
	// })

	return (
		<>
			<div className='todo'>
				<input type="checkbox"
					checked={todo.completed}
					id={todo.id}
					onChange={() => {
						return updateTodoMutation.mutate({
							...todo,
							completed: !todo.completed
						})
					}}
				/>
				<label htmlFor={todo.id}>{todo.title}</label>
			</div>	

			<button 
				className='trash'
				onClick={() => {
					// return deleteTodoMutation.mutate({id: todo.id})
					return handleDelete(todo.id)
				}}
			>
				<FontAwesomeIcon icon={faTrash} />
			</button> 
		</>
	)
}

const areEqual = (prevProps, nextProps) => {
	return prevProps.todo.id === nextProps.todo.id &&
		prevProps.todo.completed === nextProps.todo.completed
} 

const memorizedTodoItem = React.memo(TodoItem, areEqual)

export default memorizedTodoItem