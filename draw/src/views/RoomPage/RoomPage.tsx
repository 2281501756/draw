import styles from './index.module.css'
import RoomItem from './RoomItem/RoomItem'
import routerContext from '../../context/router.context'
import { useContext } from 'react'

const RoomPage = () => {
  const { routerState, setRouterState } = useContext(routerContext)
  const handleBack = () => {
    setRouterState({ name: 'home' })
  }

  return (
    <div className={styles.roomPage}>
      <div className={styles.title}>
        <div className={styles.back} onClick={handleBack}></div>
        <div className={styles.iconBack}>房间</div>
        <div className={styles.back} style={{ opacity: 0 }}></div>
      </div>
      <div className={styles.gameBox}>
        <RoomItem></RoomItem>
        <RoomItem></RoomItem>
        <RoomItem></RoomItem>
        <RoomItem></RoomItem>
        <RoomItem></RoomItem>
        <RoomItem></RoomItem>
      </div>
    </div>
  )
}

export default RoomPage
