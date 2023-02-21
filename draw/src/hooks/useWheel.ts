import { MutableRefObject, useCallback, useEffect } from 'react'

// 滚动速度
const speed = 60

export function useWheel(dom: MutableRefObject<HTMLDivElement | null>) {
  const fun = useCallback(
    (e: any) => {
      if (!dom.current) return
      if (e.wheelDelta > 0) {
        //向上滚动
        dom.current.scrollTop = dom.current.scrollTop - speed
      }
      if (e.wheelDelta < 0) {
        //向下滚动
        dom.current.scrollTop = dom.current.scrollTop + speed
      }
    },
    [dom]
  )

  useEffect(() => {
    dom.current && dom.current.addEventListener('wheel', fun)

    return () => {
      dom.current && dom.current.removeEventListener('wheel', fun)
    }
  }, [])
}
