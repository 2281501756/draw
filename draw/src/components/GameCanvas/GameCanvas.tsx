import styles from './index.module.less'
import { Stage, Layer, Line, Rect } from 'react-konva'
import { useContext, useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react'
import ColorBox from './ColorBox/ColorBox'
import { config } from './colorBox.config'
import { Slider, Button, Modal, notification } from 'antd'
import { useDownload } from '../../hooks/useDownload'
import socketContext from '../../context/socket.context'
import userContext from '../../context/user.context'
import upload from '../../utils/upload'
type LineType = {
  stroke: string
  points: number[]
  strokeWidth: number
  x: number
  y: number
  did: number
}
type Props = {
  disabled?: boolean
  roomName?: string
}

const GameCanvas = forwardRef(({ disabled, roomName }: Props, ref) => {
  const [data, setData] = useState<LineType[]>([])
  const [isEnter, setIsEnter] = useState(false)
  const [drawColor, setDrawColor] = useState('#020000')
  const [drawStroke, setDrawStroke] = useState(3)
  const stageRef = useRef<any>(null)
  const socket = useContext(socketContext)
  const { userState } = useContext(userContext)
  const handleMouseDown = (e: any) => {
    if (disabled) return
    setIsEnter(true)
    let newLine: LineType = {
      did: Date.now(),
      x: e.evt.layerX,
      y: e.evt.layerY,
      points: [],
      stroke: drawColor,
      strokeWidth: drawStroke,
    }
    setData([...data, newLine])
  }
  const handleMouseMove = (e: any) => {
    if (disabled) return
    if (isEnter) {
      let t = [...data]
      t[t.length - 1].points = [
        ...t[t.length - 1].points,
        e.evt.layerX - t[t.length - 1].x,
        e.evt.layerY - t[t.length - 1].y,
      ]
      setData(t)
      if (roomName) {
        socket.emit('draw', {
          id: userState.scoketID,
          roomName,
          data: t,
        })
      }
    }
  }
  const handleMouseUp = (e: any) => {
    if (disabled) return
    setIsEnter(false)
  }
  const checkSave = () => {
    const uri = stageRef.current.toDataURL()
    useDownload(uri)
  }

  const checkColor = (color: string) => {
    setDrawColor(color)
  }
  const checkStroke = (n: number) => {
    setDrawStroke(n)
  }
  const checkRemake = () => {
    setData([])
    if (roomName) {
      socket.emit('draw', {
        id: userState.scoketID,
        roomName,
        data: [],
      })
    }
  }
  const handleUpload = async () => {
    const uri = stageRef.current.toDataURL()
    let res = await upload(uri, userState.name, userState.photo)
    console.log(res)
    openNotificationWithIcon('success', '????????????')
    setShowModal1(false)
  }
  const [showModal, setShowModal] = useState(false)
  const [showModal1, setShowModal1] = useState(false)

  // socket
  useEffect(() => {
    if (roomName) {
      socket.on('draw', (data: any) => {
        if (data.id !== userState.scoketID) setData(data.data)
      })
    }
    return () => {
      if (roomName) {
        socket.removeListener('draw')
      }
    }
  })

  useImperativeHandle(ref, () => {
    return {
      checkRemake,
    }
  })

  // antd ??????
  type NotificationType = 'success' | 'info' | 'warning' | 'error'
  const [api, contextHolder] = notification.useNotification()
  const openNotificationWithIcon = (type: NotificationType, messgae: string = '') => {
    api[type]({
      message: '??????',
      description: messgae,
      duration: 3,
    })
  }

  return (
    <div className={styles.box}>
      {!disabled && (
        <div className={styles.colorToolkit}>
          <div className={styles.color}>
            {config.map((i) => (
              <ColorBox
                key={i.id}
                color={i.color}
                onclick={checkColor}
                active={drawColor === i.color}
              ></ColorBox>
            ))}
          </div>
          <div className={styles.box2}>
            <div className={styles.size}>
              <div className={styles.big}></div>
              <Slider
                style={{ height: 100, display: 'inline-block' }}
                vertical
                min={1}
                max={20}
                defaultValue={3}
                onChange={checkStroke}
              />
              <div className={styles.small}></div>
            </div>
            <div className={styles.buttonBox}>
              <Button type="primary" danger size="small" onClick={checkRemake}>
                ??????
              </Button>
              <Button
                type="primary"
                style={{ backgroundColor: '#3271ae' }}
                size="small"
                onClick={() => setShowModal(true)}
              >
                ??????
              </Button>
              <Button
                type="primary"
                style={{ backgroundColor: '#a6559d' }}
                size="small"
                onClick={() => setShowModal1(true)}
              >
                ??????
              </Button>
            </div>
          </div>
        </div>
      )}
      <Stage
        width={720}
        height={420}
        ref={stageRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <Layer>
          <Rect x={0} y={0} width={780} height={470} fill="#fff" cornerRadius={15}></Rect>
          {data.map((i) => (
            <Line key={i.did} {...i}></Line>
          ))}
        </Layer>
      </Stage>
      <Modal
        title="????????????"
        open={showModal}
        onOk={checkSave}
        okText="??????"
        cancelText="??????"
        onCancel={() => {
          setShowModal(false)
        }}
      >
        <p>?????????????????????????????????</p>
      </Modal>

      <Modal
        title="????????????"
        open={showModal1}
        onOk={handleUpload}
        okText="??????"
        cancelText="??????"
        onCancel={() => {
          setShowModal1(false)
        }}
      >
        <p>????????????????????????????????????</p>
      </Modal>
      {contextHolder}
    </div>
  )
})

export default GameCanvas
