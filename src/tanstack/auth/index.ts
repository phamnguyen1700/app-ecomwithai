import { loginApi } from "@/zustand/services/auth/login"
import { useAuthStore } from "@/zustand/store/userAuth"
import { useMutation } from "@tanstack/react-query"
import { toast } from "react-toastify"

export const useLogin = () => {
  const setUser = useAuthStore((state) => state.setUser)

  return useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      setUser(data)
      toast.success('Đăng nhập thành công!')
    },
    onError: () => {
      toast.error('Đăng nhập thất bại!')
    },
  })
}
