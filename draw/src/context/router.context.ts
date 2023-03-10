import { createContext, Dispatch } from 'react'

export interface router {
  name: string
  meta: any
}

export const routerInit = {
  name: 'home',
  meta: null,
}

const routerContext = createContext<{
  routerState: router
  setRouterState: Dispatch<Partial<router>>
}>({
  routerState: routerInit,
  setRouterState: () => {
    throw new Error('未定义')
  },
})

export const routerReducer = (prevState: router, updateState: Partial<router>) => ({
  ...prevState,
  ...updateState,
})

export default routerContext
