import styles from './index.module.css'
import Button from '../../components/Button/Button'
import routerContext from '../../context/router.context'
import { ChangeEvent, useCallback, useContext, useEffect, useState } from 'react'
import userContext from '../../context/user.context'
import socketContext from '../../context/socket.context'
import request from '../../utils/request'
import { message } from 'antd'

const HomePage = () => {
  const { setRouterState } = useContext(routerContext)
  const { userState, setUserState } = useContext(userContext)
  const [messageApi, contextHolder] = message.useMessage()
  const [man, setMan] = useState(0)

  const handleRoomButton = useCallback(() => {
    setRouterState({ name: 'room' })
  }, [setRouterState])
  const handleChangeUserName = (e: ChangeEvent<HTMLInputElement>) => {
    setUserState({
      name: e.target.value,
    })
  }
  const handleMatching = async () => {
    let data: any = await request('/room/match')
    if (data.message === 'error') {
      messageApi.open({
        type: 'error',
        content: '没有空闲房间',
      })
      return
    }
    request
      .post('/room/join', {
        name: userState.name,
        photo: userState.photo,
        id: userState.scoketID,
        roomName: data.data.roomName,
      })
      .then((res: any) => {
        if (res.message === 'error') {
          messageApi.open({
            type: 'error',
            content: res.data,
          })
          return
        }
        setRouterState({ name: 'multi', meta: { roomName: data.data.roomName } })
      })
  }

  // 处理scoket
  const socket = useContext(socketContext)
  useEffect(() => {
    socket.on('init', (data) => {
      console.log(data)
      setUserState({ scoketID: data.id })
    })
    socket.send('man')
    socket.on('man', (data) => setMan(data))
    return () => {
      socket.removeListener('init')
      socket.removeListener('man')
    }
  }, [])

  return (
    <div className={styles.homePage}>
      <div className={styles.icon}>
        <div className={styles.iconBack}>你画我猜</div>
      </div>
      <div className={styles.modelBox}>
        <div className={styles.left}>
          <div className={styles.gameModelTitle}>多人游戏</div>
          <div className={styles.userdata}>
            <div className={styles.userPhoto}>
              <img src={userState.photo} alt="用户头像" />
            </div>
            <div className={styles.userName}>
              <span>昵称</span>
              <input type="text" value={userState.name} onChange={handleChangeUserName} />
            </div>
          </div>
          <div className={styles.bottomBox}>
            <Button
              title="房间"
              color="#13bafe"
              img="/svg/ic_Rooms.svg"
              onclick={handleRoomButton}
            ></Button>
            <Button
              title="开始匹配"
              color="#ffcb00"
              img="/svg/ic_Play.svg"
              onclick={handleMatching}
            ></Button>
          </div>
        </div>
        <div className={styles.center}>
          <span>或</span>
        </div>
        <div className={styles.right}>
          <div className={styles.gameModelTitle}>休闲模式</div>
          <div className={styles.modelBox}>
            <Button
              title="单人训练"
              color="#7289da"
              img="/svg/ic_Rooms.svg"
              model
              onclick={() => {
                setRouterState({ name: 'single' })
              }}
            ></Button>
            <Button
              title="优秀作品"
              color="#fd5c20"
              img="/svg/ic_Rooms.svg"
              model
              onclick={() => {
                setRouterState({ name: 'works' })
              }}
            ></Button>
          </div>
          <div className={styles.man}>活跃人数{man}</div>
        </div>
      </div>
      {contextHolder}
    </div>
  )
}

export default HomePage
