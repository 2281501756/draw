import styles from './index.module.less'
import RoomItem from './RoomItem/RoomItem'
import routerContext from '../../context/router.context'
import Button from '../../components/Button/Button'
import { useContext, useEffect, useRef, useState } from 'react'
import userContext from '../../context/user.context'
import socketContext from '../../context/socket.context'
import request from '../../utils/request'
import { message } from 'antd'
import type { IRoom } from './types/room.type'
import NewRoom from './NewRoom/NewRoom'
import { useWheel } from '../../hooks/useWheel'

const RoomPage = () => {
  const { setRouterState } = useContext(routerContext)
  const { userState } = useContext(userContext)
  const [messageApi, contextHolder] = message.useMessage()
  const [roomState, setRoomState] = useState<IRoom[]>([])
  const [activeRoomState, setActiveRoomState] = useState(-1)
  const [showNewBox, setShowNewBox] = useState(false)
  const handleBack = () => {
    setRouterState({ name: 'home' })
  }
  const handleJoin = () => {
    request
      .post('/room/join', {
        name: userState.name,
        photo: userState.photo,
        id: userState.scoketID,
        roomName: roomState[activeRoomState].roomName,
      })
      .then((res: any) => {
        if (res.message === 'error') {
          messageApi.open({
            type: 'error',
            content: res.data,
          })
          return
        }
        setRouterState({ name: 'multi', meta: { roomName: roomState[activeRoomState].roomName } })
      })
  }

  //socket
  const socket = useContext(socketContext)
  useEffect(() => {
    socket.on('allRoom', (data: IRoom[]) => {
      setRoomState(data)
    })

    request
      .get('/room', {
        params: {
          id: userState.scoketID,
        },
      })
      .then((res: any) => {
        if (res.message === 'error') {
          messageApi.open({
            type: 'error',
            content: res.data,
          })
        }
      })

    return () => {
      socket.removeListener('allRoom')
    }
  }, [])

  //滚动事件
  const gameBox = useRef(null)
  useWheel(gameBox)

  return (
    <>
      {contextHolder}
      <div className={styles.roomPage}>
        <div className={styles.title}>
          <div className={styles.back} onClick={handleBack}></div>
          <div className={styles.iconBack}>房间</div>
          <div className={styles.back} style={{ opacity: 0 }}></div>
        </div>
        <div className={styles.gameBox} ref={gameBox}>
          {roomState.length === 0 ? (
            <div className={styles.nogame}>暂无游戏</div>
          ) : (
            roomState.map((i, index) => {
              return (
                <RoomItem
                  key={i.roomName}
                  {...i}
                  active={index === activeRoomState}
                  onclick={() => {
                    setActiveRoomState(index)
                  }}
                ></RoomItem>
              )
            })
          )}
        </div>
        <div className={styles.buttonBox}>
          <Button
            title="创建房间"
            color="#13bafe"
            img="/svg/ic_Rooms.svg"
            onclick={() => {
              setShowNewBox(true)
            }}
          ></Button>
          <Button
            title="加入房间"
            color="#ffcb00"
            img="/svg/ic_Play.svg"
            onclick={handleJoin}
          ></Button>
        </div>
        {showNewBox && (
          <NewRoom
            cancelFun={() => {
              setShowNewBox(false)
            }}
          ></NewRoom>
        )}
      </div>
    </>
  )
}

export default RoomPage
