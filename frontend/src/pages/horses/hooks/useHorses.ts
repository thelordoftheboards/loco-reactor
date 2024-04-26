import { QUERY_KEY } from '../../../constants/queryKeys'
import { Horse } from '@/models/horse'
import { apiGet, ResponseError } from '@/utils/api'
import { useQuery } from '@tanstack/react-query'

const fetchHorses = async (): Promise<Horse[]> => {
  return (await apiGet('horses')) as Array<Horse>
}

interface IUseHorses {
  horses: Horse[]
  isLoading: boolean
  isFetching: boolean
  error?: string
}

function mapError(error: unknown): string {
  if (error instanceof ResponseError) return error.message
  return 'Unknown error'
}

export const useHorses = (): IUseHorses => {
  const {
    data: horses = [],
    isLoading,
    isFetching,
    error,
  } = useQuery(
    [QUERY_KEY.horses],

    fetchHorses,

    {
      // refetchInterval: 1000,
      refetchOnWindowFocus: false,
      retry: 2,
    }
  )

  return {
    horses,
    isLoading,
    isFetching,
    error: mapError(error),
  }
}
