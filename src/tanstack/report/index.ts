import { get } from '@/util/Http';
import { useQuery } from '@tanstack/react-query'

export const useOrderStats = (from: string, to: string) => {
  return useQuery({
    queryKey: ['order-stats', from, to],
    queryFn: async () => {
      const res = await get('report/order', { params: { from, to } });
      return res.data;
    },
    enabled: !!from && !!to,
  });
}