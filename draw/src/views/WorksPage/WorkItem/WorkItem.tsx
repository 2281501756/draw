import { work } from '../types'
import styles from './index.module.less'
import { formatDate } from '../../../utils/time'

const WorkItem = ({ userName, photo, data, createdAt }: work) => {
  return (
    <div className={styles.box}>
      <div className={styles.buttom}>
        <img className={styles.photo} src={photo} alt="头像" /> {userName}
        <span className={styles.right}>{formatDate(createdAt).timeText}</span>
      </div>
      <img src={import.meta.env.VITE_SERVER_URL + data} alt="作品" />
    </div>
  )
}

export default WorkItem
