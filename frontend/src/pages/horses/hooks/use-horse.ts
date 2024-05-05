import { QUERY_KEY } from '../../../constants/queryKeys'
import { apiGet, ResponseError } from '@/lib/api'
import { Horse } from '@/models/horse'
import { useQuery } from '@tanstack/react-query'

const fetchHorse = async (id: number): Promise<Horse> => {
  if (id === 0)
    return {
      id: 0,
      given_name: '',
      gender_id: 1,
      color_id: 1,
    }

  const horse = (await apiGet(`horses/${id}`)) as Horse
  return horse
}

interface IUseHorse {
  horse: Horse | undefined
  isLoading: boolean
  isFetching: boolean
  error?: string
}

function mapError(error: unknown): string {
  if (error instanceof ResponseError) return error.message
  if (error instanceof Error) return 'Unexpected error: ' + error.message
  return ''
}

export const useHorse = (id: number): IUseHorse => {
  const {
    data: horse,
    isLoading,
    isFetching,
    error,
  } = useQuery({
    queryKey: [QUERY_KEY.horse, id],
    queryFn: () => fetchHorse(id),
    refetchOnWindowFocus: false,
    retry: 2,
  })

  return {
    horse,
    isLoading,
    isFetching,
    error: mapError(error),
  }
}
