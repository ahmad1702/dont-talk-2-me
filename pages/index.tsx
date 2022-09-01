import { Button, Navbar, Switch, useTheme, Text, Dropdown, Avatar, Link, Input } from '@nextui-org/react';
import axios from 'axios';
import { get } from 'lodash-es';
import type { NextPage } from 'next';
import { useTheme as useNextTheme } from 'next-themes';
import Head from 'next/head';
import Pusher from 'pusher-js';
import { useContext, useEffect, useRef, useState } from 'react';
import useLocalStorageState from 'use-local-storage-state';
import { UserContext } from '../Auth/UserProvider';
import CustomNav from '../components/CustomNav';
import { SendButton } from '../components/icons/SendButton';
import { SendIcon } from '../components/icons/SendIcon';

const incomingMsgStyle = 'bg-neutral-400 dark:bg-neutral-600 rounded-tl-2xl rounded-tr-2xl rounded-br-2xl';
const outgoingMsgStyle = 'bg-blue-400 rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl';

const BG_PIC_LIGHT = "https://images.unsplash.com/photo-1618576980905-8b704806a39b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2815&q=80";
const BG_PIC_DARK = "https://images.unsplash.com/photo-1557682257-2f9c37a3a5f3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1700&q=80";
export type Message = {
  username: string;
  message: string;
  time: Date;
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

type RoomType = 'Architecture' | 'DataAlgo2' | 'Object Oriented'
const rooms: RoomType[] = [
  'Architecture',
  'DataAlgo2',
  'Object Oriented'
]

const Home: NextPage = () => {
  const [apiCalls, setApiCalls] = useState<number>(0);
  const { isDark } = useTheme();
  const { currentUser } = useContext(UserContext);

  const [currSelectedRoom, setCurrSelectedRoom] = useLocalStorageState<RoomType>('room', {
    defaultValue: 'Object Oriented',
  });

  const [currMessage, setCurrMessage] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<Message | null>(null);

  useEffect(() => {
    if (message && !messages.includes(message)) {
      setMessages([...messages, message])
    }
  }, [message])
  let allMessages: Message[] = [];
  // [
  //   {
  //     username: 'Armando',
  //     message: 'whatsup',
  //     time: new Date(Date.now()),
  //   },
  //   {
  //     username: 'Ahmad',
  //     message: 'whatsup',
  //     time: new Date(Date.now()),
  //   },
  // ]

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
    submitPusherMessage();
  }
  // const submitMessage = (e: any) => {
  //   if (currentUser) {
  //     setMessages([
  //       ...messages,
  //       {
  //         username: currentUser.username,
  //         message: currMessage,
  //         time: new Date(Date.now())
  //       }
  //     ])
  //     setCurrMessage('')
  //   }
  // }
  const handleSelectRoomChange = (e: any) => {
    if (e.currentKey === currSelectedRoom) return;
    setCurrSelectedRoom(e.currentKey as RoomType);
  }

  useEffect(() => {
    Pusher.logToConsole = true;
    const APP_KEY = process.env.NEXT_PUBLIC_PUSHER_APP_KEY
    if (APP_KEY && APP_KEY.length > 0) {
      const pusher = new Pusher(APP_KEY, {
        cluster: 'us2'
      });

      const channelNameFromRoom = currSelectedRoom.replace(' ', '').toLowerCase();
      const channel = pusher.subscribe(channelNameFromRoom);
      channel.bind('my-event', function (data: any) {
        setApiCalls(apiCalls + 1)
        console.log('DatePusha:', data)
        if (data && get(data, 'username')) {
          // allMessages.push(data)
          // setMessages(allMessages)
          setMessage(data as Message)
        }
        // console.log("MYData:", data)
      });
      return (() => {
        pusher.unsubscribe(currSelectedRoom)
        // pusher.unsubscribe('channel_name2')
      })
    } else {
      console.error('ENV_VAR: APP_KEY NOT FOUND')
    }
  }, [currSelectedRoom]);

  const submitPusherMessage = async (e?: any) => {

    if (e) {
      e.preventDefault();
    }
    if (!currentUser) return;

    const channelNameFromRoom = currSelectedRoom.replace(' ', '').toLowerCase();
    const res = await axios.post(`${window.location.origin}/api/messages?room=${channelNameFromRoom}`, {
      username: currentUser.username,
      message: currMessage,
      time: new Date(Date.now())
    })
    console.log('res:', res)
    setCurrMessage('');

  }

  useEffect(() => console.log(messages), [messages])

  useEffect(() => {
    setMessage(null);
    setMessages([])
  }, [currSelectedRoom])

  return (
    <div className="h-screen w-full max-w-none" style={isDark
      ? { background: `url("${BG_PIC_DARK}")`, backgroundPosition: 'top', backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }
      : { background: `url("${BG_PIC_DARK}")`, backgroundPosition: 'top', backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }
    }>
      <Head>
        <title>✌️ DontTalk2Me</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <CustomNav />

      <main className="p-10" style={{ height: 'calc(100vh - 76px)', }}>

        <div className='w-full flex items-center justify-center mb-5'>
          <div className='flex items-center justify-center bg-white/20 dark:bg-black/30 backdrop-blur-lg p-3 px-5 rounded-2xl'>
            <div className='text-2xl font-extrabold mr-3 mb-1 text-white '>{apiCalls} Current Room:</div>
            <Dropdown>
              <Dropdown.Button bordered color='warning' className='text-white border-white '>{currSelectedRoom}</Dropdown.Button>
              <Dropdown.Menu
                color="warning"
                aria-label="Select Room"
                selectionMode="single"
                selectedKeys={new Set([currSelectedRoom])}
                onSelectionChange={handleSelectRoomChange}
              >
                {rooms.map((room: RoomType) => {
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
            {messages.map((currMessage: Message, i: number) => {
              return (
                <div key={i} className={'w-full flex items-center mt-1 ' + (currMessage.username === currentUser?.username ? 'justify-end' : 'justify-start')} >
                  <div className={'m-w-1/3 py-3 px-5 text-white' + ' ' + (currMessage.username === currentUser?.username ? outgoingMsgStyle : incomingMsgStyle)}>
                    <div className='text-sm'>{currMessage.username}</div>
                    <div className='font-bold'>{currMessage.message}</div>
                    {/* <div className='text-xs'>{formatAMPM(currMessage.time as Date)}</div> */}
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
                <div onClick={(e: any) => submitPusherMessage(e)}>
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
    </div>
  )
}

export default Home
