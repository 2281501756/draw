import GameCanvas from '../../components/GameCanvas/GameCanvas'
import styles from './index.module.css'
import routerContext from '../../context/router.context'
import { useContext } from 'react'

const SinglePage = () => {
  const { routerState, setRouterState } = useContext(routerContext)
  const handleBack = () => {
    setRouterState({ name: 'home' })
  }

  return (
    <div className={styles.base}>
      <div className={styles.head}>
        <span className={styles.back} onClick={handleBack}></span>
        <span className={styles.title}>单人绘画</span>
      </div>
      <GameCanvas></GameCanvas>
    </div>
  )
}

export default SinglePage
