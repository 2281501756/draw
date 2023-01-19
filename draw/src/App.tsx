import Background from './components/Background/Background'
import HomePage from './views/HomePage/HomePage'
import { useReducer } from 'react'
import routerContext, { routerReducer, routerInit } from './context/router.context'
import RoomPage from './views/RoomPage/RoomPage'
import SinglePage from './views/SinglePage/SinglePage'

function App() {
  const [routerState, setRouterState] = useReducer(routerReducer, routerInit)
  return (
    <Background>
      <routerContext.Provider value={{ routerState, setRouterState }}>
        {routerState.name === 'home' && <HomePage></HomePage>}
        {routerState.name === 'room' && <RoomPage></RoomPage>}
        {routerState.name === 'single' && <SinglePage></SinglePage>}
      </routerContext.Provider>
    </Background>
  )
}

export default App
