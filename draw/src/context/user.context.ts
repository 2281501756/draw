import { createContext, Dispatch } from 'react'

export type User = {
  scoketID: string
  name: string
  photo: string
}

export const initUserStatue: User = {
  scoketID: '',
  name: window.user ? window.user.username : '正在加载',
  photo: window.user ? window.user.photo : import.meta.env.VITE_SERVER_URL + '/static/photo.png',
}

const userContext = createContext<{
  userState: User
  setUserState: Dispatch<Partial<User>>
}>({
  userState: initUserStatue,
  setUserState: () => {
    throw new Error('未定义')
  },
})

export const UsreReducer = (prevState: User, updateState: Partial<User>) => {
  return {
    ...prevState,
    ...updateState,
  }
}
export default userContext
