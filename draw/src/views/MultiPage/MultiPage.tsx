import styles from './index.module.less'
import { Input, Button, Badge, notification } from 'antd'
import { KeyboardEvent, useContext, useEffect, useRef, useState } from 'react'
import { EditOutlined, MessageOutlined } from '@ant-design/icons'
import GameCanvas from '../../components/GameCanvas/GameCanvas'
import routerContext from '../../context/router.context'
import userContext from '../../context/user.context'
import socketContext from '../../context/socket.context'
import request from '../../utils/request'
import { IRoom } from './types'
import ParsonCard from './ParsonCard/ParsonCard'
import classNames from 'classnames'

const MultiPage = () => {
  const { routerState, setRouterState } = useContext(routerContext)
  const { userState } = useContext(userContext)
  const [roomState, setRoomState] = useState<IRoom>()
  const chatUlRef = useRef<HTMLUListElement>(null)
  const answerUlRef = useRef<HTMLUListElement>(null)
  const ganmeCanvas: any = useRef()
  const [chatInputValue, setChatInputValue] = useState('')
  const [chatData, setChatData] = useState<
    {
      time: number
      img: string
      name: string
      data: string
    }[]
  >([])
  const [answerInputValue, setAnswerInputValue] = useState('')
  const [answerData, setAnswerData] = useState<
    {
      time: number
      name: string
      data: string
      type: string
    }[]
  >([])
  const [answer, setAnswer] = useState({
    index: 0,
    data: [],
  })
  const handleBack = async () => {
    await request.get('/room/leave', {
      params: {
        id: userState.scoketID,
        roomName: roomState?.roomName,
      },
    })
    setRouterState({
      name: 'home',
    })
  }
  const handleSetAnswer = () => {
    request.post('/room/answer', {
      roomName: roomState?.roomName,
      answer: answer.data[answer.index],
    })
  }
  const handleRefresh = () => {
    request.get('/room/answer').then((res: any) => {
      setAnswer({
        ...answer,
        data: res,
      })
    })
  }
  const handleHint = () => {
    request.get('/room/hint', {
      params: {
        roomName: roomState?.roomName,
      },
    })
  }
  const handleAbandon = () => {
    ganmeCanvas.current.checkRemake()
    request.post('/room/abandon', {
      roomName: roomState?.roomName,
    })
  }

  const handleChat = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && chatInputValue.trim() !== '') {
      setChatData([
        ...chatData,
        {
          name: userState.name,
          img: userState.photo,
          data: chatInputValue,
          time: Date.now(),
        },
      ])
      socket.emit('chat', {
        roomName: roomState?.roomName,
        id: userState.scoketID,
        name: userState.name,
        img: userState.photo,
        data: chatInputValue,
        time: Date.now(),
      })
      setChatInputValue('')
      setTimeout(() => {
        if (chatUlRef.current) chatUlRef.current.scrollTop = chatUlRef.current.scrollHeight
      }, 0.3)
    }
    if (chatData.values.length > 100) {
      chatData.splice(0, 50)
      setChatData([...chatData])
    }
  }
  const submitAnswer = async (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter' || answerInputValue.trim() === '') return
    if (userState.scoketID === roomState?.userList[roomState.activeUser].scoketID) {
      openNotificationWithIcon('error', '你不能进行答题')
      return
    }
    if (answerInputValue.trim() === roomState?.answer) {
      let res: any = await request.post('/room/submit', {
        roomName: roomState.roomName,
        id: userState.scoketID,
      })
      if (res.message === 'success') {
        openNotificationWithIcon('success', '恭喜你回答成功，加6分')
        setAnswerData([
          ...answerData,
          {
            time: Date.now(),
            data: '回答正确',
            name: userState.name,
            type: 'success',
          },
        ])
      } else {
        openNotificationWithIcon('error', '您本回合已经得分')
      }
    } else {
      setAnswerData([
        ...answerData,
        {
          time: Date.now(),
          data: '回答错误',
          name: userState.name,
          type: 'error',
        },
      ])
    }
    setAnswerInputValue('')
    setTimeout(() => {
      if (answerUlRef.current) answerUlRef.current.scrollTop = answerUlRef.current.scrollHeight
    }, 0.3)
  }
  //socke
  const socket = useContext(socketContext)
  useEffect(() => {
    request.get('/room/init', {
      params: {
        roomName: routerState.meta['roomName'],
      },
    })
  }, [])
  useEffect(() => {
    socket.on('roomData', (res: IRoom) => {
      setRoomState(res)
    })
    socket.on('chat', (data: any) => {
      if (data.id === userState.scoketID) return
      setChatData([
        ...chatData,
        {
          name: data.name,
          img: data.img,
          data: data.data,
          time: data.time,
        },
      ])
      setTimeout(() => {
        if (chatUlRef.current) chatUlRef.current.scrollTop = chatUlRef.current.scrollHeight
      }, 0.3)
    })
    socket.on('oneManSuccess', (data: any) => {
      if (data.id === userState.scoketID) return
      setAnswerData([
        ...answerData,
        {
          time: Date.now(),
          name: data.name,
          data: '回答正确',
          type: 'success',
        },
      ])
      setTimeout(() => {
        if (chatUlRef.current) chatUlRef.current.scrollTop = chatUlRef.current.scrollHeight
      }, 0.3)
      console.log(
        data.name + '回答成功',
        userState.scoketID,
        roomState?.userList[roomState.activeUser].scoketID
      )
      if (userState.scoketID === roomState?.userList[roomState.activeUser].scoketID) {
        openNotificationWithIcon('success', data.name + '回答成功，加3分')
      }
    })
    request.get('/room/answer').then((res: any) => {
      setAnswer({
        ...answer,
        data: res,
      })
    })

    return () => {
      socket.removeListener('roomData')
      socket.removeListener('chat')
      socket.removeListener('oneManSuccess')
    }
  }, [chatData, answerData, userState, roomState])

  // antd 提示
  type NotificationType = 'success' | 'info' | 'warning' | 'error'
  const [api, contextHolder] = notification.useNotification()
  const openNotificationWithIcon = (type: NotificationType, messgae: string = '') => {
    api[type]({
      message: '提示',
      description: messgae,
      duration: 3,
    })
  }
  function hintHtml() {
    if (roomState?.hint === 0) return
    else if (roomState?.hint === 1) {
      let res = new Array(roomState.answer.length).fill('_')
      return (
        <div className={styles.hintBox}>
          {res.map((i, index) => {
            return <span key={index}>{i}</span>
          })}
        </div>
      )
    } else if (roomState?.hint === 2) {
      let res = new Array(roomState.answer.length).fill('_')
      res[0] = roomState.answer[0]
      return (
        <div className={styles.hintBox}>
          {res.map((i, index) => {
            return <span key={index}>{i}</span>
          })}
        </div>
      )
    }
  }
  return (
    <div className={styles.base}>
      <div className={styles.header}>
        <span className={styles.back} onClick={handleBack}></span>
        <span className={styles.title}>多人绘画</span>
      </div>
      <div className={styles.content}>
        <div className={styles.left}>
          {roomState?.userList.map((i, index) => {
            if (roomState.activeUser === index)
              return (
                <Badge.Ribbon text="房主" color={'volcano'}>
                  <ParsonCard
                    user={i}
                    key={i.scoketID}
                    status={roomState.start ? 'draw' : 'answer'}
                  ></ParsonCard>
                </Badge.Ribbon>
              )
            return <ParsonCard user={i} key={i.scoketID}></ParsonCard>
          })}
        </div>
        <div className={styles.right}>
          {userState?.scoketID === roomState?.userList[roomState?.activeUser]?.scoketID &&
          roomState.start ? (
            <div className={styles.hintBox}>
              <span onClick={handleHint}>提示{roomState.hint}</span>
              {roomState?.answer}
              <span onClick={handleAbandon}>放弃</span>
            </div>
          ) : (
            <div>{hintHtml()}</div>
          )}
          <GameCanvas
            ref={ganmeCanvas}
            disabled={
              !(
                userState?.scoketID === roomState?.userList[roomState?.activeUser]?.scoketID &&
                roomState.start
              )
            }
            roomName={roomState?.roomName}
          ></GameCanvas>
          <div
            className={classNames(styles.chatBox, {
              [styles.chatBoxAddMagin]:
                userState?.scoketID === roomState?.userList[roomState?.activeUser]?.scoketID &&
                roomState.start,
            })}
          >
            <div className={styles.chat}>
              <div className={styles.name}>回答</div>
              <ul ref={answerUlRef}>
                {answerData.map((i) => (
                  <div className={styles.chatItem} key={i.time} style={{ color: getColor(i.type) }}>
                    {i.name}
                    <span>{i.data}</span>
                  </div>
                ))}
              </ul>
              <Input
                size="small"
                placeholder="这里提交答案"
                prefix={<EditOutlined />}
                value={answerInputValue}
                onChange={(e) => {
                  setAnswerInputValue(e.target.value)
                }}
                onKeyDown={submitAnswer}
              ></Input>
            </div>
            <div className={styles.chat}>
              <div className={styles.name}>聊天</div>
              <ul ref={chatUlRef}>
                {chatData.map((i) => (
                  <div className={styles.chatItem} key={i.time}>
                    <img src={i.img} alt="头像" />
                    {i.name + '：'}
                    <span>{i.data}</span>
                  </div>
                ))}
              </ul>
              <Input
                size="small"
                placeholder="这里进行聊天"
                prefix={<MessageOutlined />}
                value={chatInputValue}
                onChange={(e) => {
                  setChatInputValue(e.target.value)
                }}
                onKeyDown={handleChat}
              ></Input>
            </div>
          </div>
        </div>
      </div>
      {userState?.scoketID === roomState?.userList[roomState?.activeUser]?.scoketID &&
        !roomState?.start && (
          <div className={styles.setAnswer}>
            <div className={styles.title1}>请选择题目</div>
            <div className={styles.answers}>
              {answer.data.map((i, index) => {
                return (
                  <span
                    key={i}
                    onClick={() => {
                      setAnswer({ ...answer, index })
                    }}
                    className={classNames({ [styles.answerActive]: index === answer.index })}
                  >
                    {i}
                  </span>
                )
              })}
            </div>
            <div>
              <Button type="primary" onClick={handleSetAnswer}>
                确定
              </Button>
              <Button onClick={handleRefresh}>刷新</Button>
            </div>
          </div>
        )}
      {contextHolder}
    </div>
  )
}

function getColor(type: string) {
  if (type === 'success') return '#52c41a'
  if (type === 'error') return 'red'
  if (type === 'leave') return '#000'
  if (type === 'join') return '#3271ae'
}

export default MultiPage
