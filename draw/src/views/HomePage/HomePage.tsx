import styles from './index.module.css'
import Button from '../../components/Button/Button'
import routerContext from '../../context/router.context'
import { useCallback, useContext } from 'react'

const HomePage = () => {
  const { routerState, setRouterState } = useContext(routerContext)
  const handleRoomButton = useCallback(() => {
    setRouterState({ name: 'room' })
  }, [setRouterState])
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
              <img src="/src/assets/photo.png" alt="用户头像" />
            </div>
            <div className={styles.userName}>
              <span>昵称</span>
              <input type="text" value={'用户名'} readOnly={true} />
            </div>
          </div>
          <div className={styles.bottomBox}>
            <Button
              title="房间"
              color="#13bafe"
              img="/src/assets/svg/ic_Rooms.svg"
              onclick={handleRoomButton}
            ></Button>
            <Button title="开始匹配" color="#ffcb00" img="/src/assets/svg/ic_Play.svg"></Button>
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
              img="/src/assets/svg/ic_Rooms.svg"
              model
              onclick={() => {
                setRouterState({ name: 'single' })
              }}
            ></Button>
            <Button
              title="优秀作品"
              color="#fd5c20"
              img="/src/assets/svg/ic_Rooms.svg"
              model
            ></Button>
            <Button
              title="优秀作品"
              color="#fd5c20"
              img="/src/assets/svg/ic_Rooms.svg"
              model
            ></Button>
            <Button
              title="优秀作品"
              color="#fd5c20"
              img="/src/assets/svg/ic_Rooms.svg"
              model
            ></Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage
