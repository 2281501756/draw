import { useContext, useEffect, useRef, useState } from 'react'
import routerContext from '../../context/router.context'
import { useWheel } from '../../hooks/useWheel'
import request from '../../utils/request'
import styles from './index.module.less'
import { work } from './types'
import WorkItem from './WorkItem/WorkItem'

const WorksPage = () => {
  const { setRouterState } = useContext(routerContext)
  const [works, setWorks] = useState<work[]>([])

  const handleBack = () => {
    setRouterState({ name: 'home' })
  }
  useEffect(() => {
    request.get('/file/works').then((res: any) => {
      console.log(res)
      setWorks(res)
    })
  }, [])

  //滚动
  const workBox = useRef<HTMLDivElement>(null)
  useWheel(workBox)
  return (
    <div className={styles.page}>
      <div className={styles.icon}>
        <div className={styles.back} onClick={handleBack}></div>
        <div className={styles.iconBack}>作品集</div>
      </div>
      <div className={styles.body} ref={workBox}>
        {works.map((i) => {
          return <WorkItem key={i.id} {...i}></WorkItem>
        })}
      </div>
    </div>
  )
}

export default WorksPage
