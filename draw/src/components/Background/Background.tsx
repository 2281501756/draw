import { PropsWithChildren } from 'react'
import styles from './index.module.css'

const Background = ({ children }: PropsWithChildren) => {
  return <div className={styles.root}>{children}</div>
}

export default Background
