import { Button, Navbar, Switch, useTheme, Text, Dropdown, Avatar, Link, Input } from '@nextui-org/react';
import axios from 'axios';
import { get } from 'lodash-es';
import type { NextPage } from 'next';
import { useTheme as useNextTheme } from 'next-themes';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Pusher from 'pusher-js';
import { useContext, useEffect, useRef, useState } from 'react';
import useLocalStorageState from 'use-local-storage-state';
import { UserContext } from '../Auth/UserProvider';
import CustomNav from '../components/CustomNav';
import { SendButton } from '../components/icons/SendButton';
import { SendIcon } from '../components/icons/SendIcon';
import io from 'socket.io-client'
import { XMarkIcon } from '@heroicons/react/24/solid';

const incomingMsgStyle = 'bg-neutral-400 dark:bg-neutral-600 rounded-tl-2xl rounded-tr-2xl rounded-br-2xl';
const outgoingMsgStyle = 'bg-blue-400 rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl';

const BG_PIC_LIGHT = "https://images.unsplash.com/photo-1618576980905-8b704806a39b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2815&q=80";
const BG_PIC_DARK = "https://images.unsplash.com/photo-1557682257-2f9c37a3a5f3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1700&q=80";

export type Message = {
  createdAt: Date;
  id: number;
  roomName: string;
  text: string;
  username: string;
}


const formatAMPM = (date: Date) => {
  if (date) {
    var hours = date.getHours();
    let minutes: string | number = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  } else {
    console.error("formatAMPM Error:", date)
    return '';
  }
}

const Home: NextPage = () => {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const { isDark } = useTheme();

  const [rooms, setRooms] = useState([])
  const [currSelectedRoom, setCurrSelectedRoom] = useState<string>('Object Oriented');

  const [currMessage, setCurrMessage] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  let allMessages: Message[] = []

  const updateMessages = (input: Message) => {
    setMessages([
      ...messages,
      input
    ])
  }


  // useEffect(() => {
  //   if (!currSelectedRoom) return;
  //   const addMessage = (msg: any) => setMessages(prevMessages => [...prevMessages, msg]);
  //   fetch(`${window.location.origin}/api/socket`).finally(() => {
  //     const socket = io({
  //       query: {
  //         room: currSelectedRoom.split(' ').join('%20'),
  //       },
  //     })

  //     socket.on('connect', () => {
  //       socket.emit('hello', 'waterrr')
  //       // socket.emit(currSelectedRoom)
  //       socket.emit('join', currSelectedRoom);
  //       console.log('Connected')
  //     })


  //     socket.on('hello', data => {
  //       console.log('hello', data)
  //     })

  //     socket.on('a user connected', () => {
  //       console.log('a user connected')
  //     })
  //     socket.on('connectToRoom', data => {
  //       alert(data)
  //     })

  //     socket.on('notif', data => console.log(data))

  //     socket.on(currSelectedRoom, data => {
  //       console.log("Room:", data)
  //       const { username, message, room } = JSON.parse(data)
  //       if (username && message && room && typeof username === 'string' && typeof message === 'string' && typeof room === 'string') {
  //         addMessage(
  //           {
  //             username: username,
  //             text: message,
  //             id: Math.random() * 1000,
  //             roomName: currSelectedRoom,
  //             createdAt: new Date(Date.now())
  //           }
  //         )
  //       }
  //     })

  //     socket.on('disconnect', () => {
  //       console.log('disconnect')
  //     })
  //   })


  // }, [currSelectedRoom])

  useEffect(() => {
    // Enable pusher logging - don't include this in production
    const addMessage = (msg: any) => setMessages(prevMessages => [...prevMessages, msg]);
    Pusher.logToConsole = true;
    const PUBLIC_KEY = process.env.NEXT_PUBLIC_PUSHER_APP_KEY
    if (!PUBLIC_KEY) {
      console.log('no public key found')
      return;
    }
    const pusher = new Pusher(PUBLIC_KEY, {
      cluster: 'us2'
    });

    const channel = pusher.subscribe('chat');
    channel.bind("chat-event", function (data: any) {
      const parsedData: Message = data as Message;
      if (parsedData) {
        addMessage(parsedData);
      }
    });

    return () => {
      pusher.unsubscribe('chat')
    }
  }, [])

  // useEffect(() => {
  //   const pusher = new Pusher(process.env.NEXT_PUBLIC_KEY, {
  //     cluster: "eu",
  //   });

  //   const channel = pusher.subscribe("chat");

  //   channel.bind("chat-event", function (data) {
  //     setChats((prevState) => [
  //       ...prevState,
  //       { sender: data.sender, message: data.message },
  //     ]);
  //   });

  //   return () => {
  //     pusher.unsubscribe("chat");
  //   };
  // }, []);


  useEffect(() => {
    const roomsApiCall = async () => {
      const res = await axios.get(`${window.location.origin}/api/rooms`, {
        headers: {
          authorization: 'Bearer alligator'
        }
      })
      if (res.status === 200 && get(res, 'data')) {
        setRooms(get(res, 'data').map((item: any) => get(item, 'name')))
      }
    }
    roomsApiCall()
  }, [])

  useEffect(() => {
    const allMessagesApiCall = async () => {
      const res = await axios.get(`${window.location.origin}/api/messages/mymessages?room=${currSelectedRoom}`)
      if (res.status === 200 && get(res, 'data')) {
        setMessages(get(res, 'data') as Message[])
      }
    }
    setMessages([])
    allMessagesApiCall()
  }, [currSelectedRoom])

  // Ui for Chat
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // 👇️ scroll to bottom every time messages change
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: any) => {
    if (e) {
      e.preventDefault();
    }
    submitSocketMessage()
  }
  const handleSelectRoomChange = (e: any) => {
    if (e.currentKey === currSelectedRoom) return;
    setCurrSelectedRoom(e.currentKey);
  }

  const submitSocketMessage = async (e?: any) => {
    if (currentUser && currMessage.length > 0) {
      const res = await axios.post(`${window.location.origin}/api/pusher`, {
        username: currentUser.username,
        message: currMessage,
        room: currSelectedRoom
      })
      if (res) {
        setCurrMessage('')
      }

      console.log(res)
    }
  }
  const deleteMessage = async (id: number) => {
    const res = await axios.delete(`${window.location.origin}/api/messages?id=${id}`)
    console.log(res)
    if (res.status === 200) {
      setMessages(currmessages => currmessages.filter(item => item.id !== id))
    }
  }

  // const submitSocketMessage = async (e?: any) => {
  //   console.log('submit socket messgae')
  //   if (!(currentUser && currSelectedRoom)) return;
  //   fetch(`${window.location.origin}/api/socket`).finally(() => {
  //     const socket = io()

  //     socket.on('connect', () => {
  //       console.log('we in the submit socket')
  //       socket.emit('newMessage', JSON.stringify({
  //         username: currentUser.username,
  //         message: currMessage,
  //         room: currSelectedRoom
  //       }))
  //       setCurrMessage('')
  //     })


  //     socket.on('newMessage', data => {
  //       socket.disconnect()
  //     })

  //     socket.on('disconnect', () => {
  //       console.log('disconnect')
  //     })
  //   })
  // }

  // const submitSocketMessage = async (e?: any) => {

  //   if (e) {
  //     e.preventDefault();
  //   }
  //   if (!currentUser) return;
  //   const res = await axios.post(`${window.location.origin}/api/messages?room=${currSelectedRoom.split(' ').join('%20')}`, {
  //     username: currentUser.username,
  //     message: currMessage,
  //     time: new Date(Date.now())
  //   })
  //   console.log('res:', res)
  //   setCurrMessage('');

  // }

  return (
    <div className="md:h-screen w-full max-w-none md:overflow-hidden" style={isDark
      ? { background: `url("${BG_PIC_DARK}")`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }
      : { background: `url("${BG_PIC_DARK}")`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }
    }>
      <Head>
        <title>✌️ DontTalk2Me</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Head>
      <CustomNav />

      {currentUser ? (
        <main className="py-10 px-3 md:px-10 h-full md:h-[calc(100vh-76px)]" >

          <div className='w-full flex items-center justify-center mb-5'>
            <div className='flex items-center justify-center bg-white/20 dark:bg-black/30 backdrop-blur-lg p-3 px-5 rounded-2xl'>
              <div className='text-2xl font-extrabold mr-3 mb-1 text-white '>Current Room:</div>
              <Dropdown>
                <Dropdown.Button bordered color='warning' className='text-white border-white '>{currSelectedRoom}</Dropdown.Button>
                <Dropdown.Menu
                  color="warning"
                  aria-label="Select Room"
                  selectionMode="single"
                  selectedKeys={new Set([currSelectedRoom])}
                  onSelectionChange={handleSelectRoomChange}
                >
                  {rooms.map((room: string) => {
                    return (
                      <Dropdown.Item key={room}>{room}</Dropdown.Item>
                    )
                  })}
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
          <div className='p-5 bg-white/50 dark:bg-neutral-700/50 rounded-2xl' style={{ height: '70vh' }}>
            <div className='overflow-auto' style={{ height: 'calc(70vh - 6rem)', overflow: 'auto' }}>
              {messages.map((currentMessage: Message, i: number) => {
                return (
                  <div key={i} className={'w-full flex items-center mt-1 ' + (currentMessage.username === currentUser?.username ? 'justify-end' : 'justify-start')} >
                    <div className={'m-w-1/3 py-3 px-5 text-white relative' + ' ' + (currentMessage.username === currentUser?.username ? outgoingMsgStyle : incomingMsgStyle)}>
                      <div className='text-sm'>{currentMessage.username}</div>
                      <div className='font-bold'>{currentMessage.text}</div>
                      <div className='text-xs'>{formatAMPM(new Date(currentMessage.createdAt))}</div>
                      <div
                        onClick={(e) => deleteMessage(currentMessage.id)}
                        className='h-3 w-3 bg-red-600/30 hover:bg-red-600 cursor-pointer duration-300 rounded-full p-0.5 absolute top-2 right-2'
                      >
                        <XMarkIcon />
                      </div>
                    </div>
                  </div>
                )
              })}
              <div ref={bottomRef} />
            </div>
            <form onSubmit={handleSubmit} className='h-24 mt-3'>
              <Input
                aria-label='Message'
                clearable
                fullWidth
                contentRightStyling={false}
                placeholder="Type your message..."
                contentRight={
                  <div onClick={(e: any) => console.log(e)}>
                    <SendButton>
                      <SendIcon fill={'white'} filled={undefined} size={undefined} height={undefined} width={undefined} label={undefined} className={undefined} />
                    </SendButton>
                  </div>
                }
                value={currMessage}
                onChange={(e) => setCurrMessage(e.target.value)}
              />
            </form>
          </div>

        </main>
      ) : (
        <div className="p-10 flex items-center justify-center" style={{ height: 'calc(100vh - 76px)', }}>
          <div className='text-white font-extrabold'>Please Sign In</div>
        </div>
      )}
    </div>
  )
}

export default Home
