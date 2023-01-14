import React, {useState, useEffect} from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import {getTodos, addTodo} from '../api/todosApi'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUpload } from '@fortawesome/free-solid-svg-icons'
import TodoItem  from './TodoItem'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { StrictModeDroppable } from '../helpers/StrictModeDroppable'
import { deleteTodo } from '../api/todosApi'

export const TodoList = () => {
	const [newTodo, setNewTodo] = useState('')
	const queryClient = useQueryClient()
	const  {
		isLoading,
		isError,
		error, 
		data,
	} = useQuery('todos', getTodos, {
		select: data => data.sort((a, b) => b.id - a.id)
	})

	const deleteTodoMutation = useMutation(deleteTodo, {
		onSuccess: () => {
			queryClient.invalidateQueries('todos')
		}
	})

	const [todos, updateTodos] = useState(data || []) 

	useEffect(() => {
		const arrayIdsOrder = JSON.parse(localStorage.getItem(`taskOrder`))

		if(!arrayIdsOrder && data?.length){
			const idsOrderArray = data.map(item => item.id)
			localStorage.setItem('taskOrder', JSON.stringify(idsOrderArray))
		}

		let tempArray
		if(arrayIdsOrder?.length && data?.length){
			tempArray=  arrayIdsOrder.map(p => {
				return data.find(el => el.id === p)
			})

			const newItem = data.filter(el => {
				return !arrayIdsOrder.includes(el.id)
			})

			if(newItem?.length)
				tempArray= [...newItem, ...tempArray]
		}

		updateTodos(tempArray || data)
	}, [data])

	const addTodoMutation = useMutation(addTodo, {
		onSuccess: () => {
			queryClient.invalidateQueries('todos')
		}
	})

	const handleSubmit = e => {
		e.preventDefault()

		addTodoMutation.mutate({
			userId: 1,
			title: newTodo,
			completed: false
		})
		setNewTodo('')
	}

	const handleOnDragEnd = result => {
		if(!result?.destination) return 

		const tasks = [...todos]

		const [reorderedItem] = tasks.splice(result.source.index, 1)

		tasks.splice(result.destination.index, 0, reorderedItem)

		const idsOrderArray = tasks.map(x => x.id)

		localStorage.setItem('taskOrder', JSON.stringify(idsOrderArray))

		updateTodos(tasks)
	}

	const handleDelete = id => {
		const arrayIdsOrder = JSON.parse(localStorage.getItem(`taskOrder`))

		if(arrayIdsOrder?.length){
			const newIdsOrderArray = arrayIdsOrder.filter(x => x !== id)

			localStorage.setItem('taskOrder', JSON.stringify(newIdsOrderArray))
		}

		deleteTodoMutation.mutate({id})

		updateTodos(todos.filter(x => x.id !== id))
	}


	return (
		<main>
			<h1>Todo List</h1>
			
			<form onSubmit={handleSubmit}>
				<label htmlFor="new-todo">Enter a new todo item: </label>
				<div className='new-todo'>
				<input 
					type='text'
					name='new-todo'
					value={newTodo}
					placeholder='Enter new todo ...'
					onChange={e => setNewTodo(e.target.value)} 
				/>
				</div>
				<button className='submit'>
					<FontAwesomeIcon icon={faUpload} />
				</button>
			</form>
			
			
			{ isLoading && <p>Loading...</p>}
			{ isError && <p>Error: {error.message}</p>}

			{!isLoading && !isError && (
				<DragDropContext onDragEnd={handleOnDragEnd}>
					<StrictModeDroppable droppableId='todos'>
					{/* <Droppable droppableId='todos'> */}
						{
							provided => (
								<section 
									{...provided.droppableProps}
									ref={provided.innerRef}
								>
									{todos?.map((todo, idx) => (
										<Draggable 
											key={todo.id}
											draggableId={todo.id.toString()}
											index={idx}
										>
											{provided => (
												<article
													{...provided.draggableProps}
													{...provided.dragHandleProps}
													ref={provided.innerRef} 
												>
													<TodoItem
														key={todo.id} 
														todo={todo}
														handleDelete={handleDelete} 
													/>
												</article>
											)}
											
										</Draggable>
									))}
									{provided.placeholder}
								</section>
							)
						}
					{/* </Droppable> */}
					</StrictModeDroppable>
				</DragDropContext>
			)}	
		</main>
	)			
}
	
