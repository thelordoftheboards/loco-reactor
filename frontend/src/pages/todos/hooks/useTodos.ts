import { QUERY_KEY } from '../../../constants/queryKeys'
import { Todo } from '@/models/todo'
import { apiGet, ResponseError } from '@/utils/api'
import { useQuery } from '@tanstack/react-query'

const fetchTodos = async (): Promise<Todo[]> => {
  return (await apiGet('todos')) as Array<Todo>
}

interface IUseTodos {
  todos: Todo[]
  isLoading: boolean
  isFetching: boolean
  error?: string
}

function mapError(error: unknown): string {
  if (error instanceof ResponseError) return error.message
  return 'Unknown error'
}

export const useTodos = (): IUseTodos => {
  const {
    data: todos = [],
    isLoading,
    isFetching,
    error,
  } = useQuery(
    [QUERY_KEY.todos],

    fetchTodos,

    {
      // refetchInterval: 1000,
      refetchOnWindowFocus: false,
      retry: 2,
    }
  )

  return {
    todos,
    isLoading,
    isFetching,
    error: mapError(error),
  }
}
