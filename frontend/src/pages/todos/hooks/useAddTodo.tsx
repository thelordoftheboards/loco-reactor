import { QUERY_KEY } from '../../../constants/queryKeys'
import { toast } from '@/components/ui/use-toast'
import { Todo } from '@/models/todo'
import { apiPost, ResponseError } from '@/utils/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'

const postTodo = async (text: Todo['text']): Promise<Todo> => {
  return (await apiPost('todos', { text })) as Todo
}

interface IUseAddTodo {
  addTodo: (text: Todo['text']) => void
}

function mapError(error: unknown): string {
  if (error instanceof ResponseError) return error.message
  return 'Unknown error'
}

export const useAddTodo = (): IUseAddTodo => {
  const client = useQueryClient()
  const { mutate: addTodo } = useMutation(postTodo, {
    onSuccess: () => {
      toast({
        title: 'Todo added',
      })

      client.invalidateQueries([QUERY_KEY.todos])
    },
    onError: (error) => {
      const errorMessage = mapError(error)

      toast({
        title: 'Todo could not be added',
        description: (
          <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
            <code className='text-white'>{errorMessage}</code>
          </pre>
        ),
      })
    },
  })

  return {
    addTodo,
  }
}
