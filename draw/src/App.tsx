import Background from './components/Background/Background'
import HomePage from './views/HomePage/HomePage'
import { useEffect, useReducer } from 'react'
import routerContext, { routerReducer, routerInit } from './context/router.context'
import userContext, { initUserStatue, UsreReducer } from './context/user.context'
import socketContext, { socketInit } from './context/socket.context'
import RoomPage from './views/RoomPage/RoomPage'
import SinglePage from './views/SinglePage/SinglePage'
import MultiPage from './views/MultiPage/MultiPage'
import WorksPage from './views/WorksPage/WorksPage'
import { ConfigProvider } from 'antd'

function App() {
  const [routerState, setRouterState] = useReducer(routerReducer, routerInit)
  const [userState, setUserState] = useReducer(UsreReducer, initUserStatue)
  useEffect(() => {
    setTimeout(() => {
      setUserState({
        name: window.user.username,
        photo: window.user.photo,
      })
    }, 2000)
  }, [])
  return (
    <Background>
      <routerContext.Provider value={{ routerState, setRouterState }}>
        <userContext.Provider value={{ userState, setUserState }}>
          <socketContext.Provider value={socketInit}>
            <ConfigProvider
              getPopupContainer={() =>
                document.querySelector('#suibianwanwandrawgame') || document.body
              }
            >
              <div id="suibianwanwandrawgame">
                {routerState.name === 'home' && <HomePage></HomePage>}
                {routerState.name === 'room' && <RoomPage></RoomPage>}
                {routerState.name === 'single' && <SinglePage></SinglePage>}
                {routerState.name === 'multi' && <MultiPage></MultiPage>}
                {routerState.name === 'works' && <WorksPage></WorksPage>}
              </div>
            </ConfigProvider>
          </socketContext.Provider>
        </userContext.Provider>
      </routerContext.Provider>
    </Background>
  )
}

export default App
