
import React, { useState, useEffect } from 'react';
import { getUser, getRoom, getMessages } from '../../utils/api'
import useWebSocket from "react-use-websocket";
import { Card, Form, Input, Button, message} from 'antd';
import { useNavigate } from "react-router-dom";
import { SendOutlined } from "@ant-design/icons"
import InfiniteScroll from "react-infinite-scroll-component";

import './Room.css'

const Room = () => {

    let [user_id, setUserid] = useState('')
    let [allusersinchat, setAllusersinchat] = useState('')
    let [room, setRoom] = useState('')
    let [messages, setMessages] = useState([])
    let time = new Date();
    let room_id = window.location.pathname.split("/").pop()
    let navigate = useNavigate();
    let [form] = Form.useForm();

    useEffect(() => {
        getUser(setUserid)
        getRoom(room_id, setRoom)
        getMessages(room_id, setMessages)
    },[user_id, room_id])

    let ut = localStorage.getItem('user')

    const { sendJsonMessage } = useWebSocket(`ws://127.0.0.1:8000/${room_id}/`)
    useWebSocket(`ws://127.0.0.1:8000/${room_id}/`, {
        onOpen: () => {
            console.log("Connected!");
            sendJsonMessage({ type: "reading", user: ut ? ut : user_id });
        },
        onClose: () => {
            console.log("Disconnected!");
        },
        onMessage: (e) => {
            let data = JSON.parse(e.data)
            switch(data.type) {
                case "chat_broadcast":
                    setMessages(prev => prev.concat(data))
                    break;
                case "read":
                    setAllusersinchat(data.users)
                    break;
                default:
                    console.error("Unknown message type!");
                    break;
            }
            
        }
    });

    const handle_submit = (v) => {
        let m = v.message
        m ? 
        sendJsonMessage({
            type: "chat_broadcast",
            user: ut ? ut : user_id,
            text: m,
            time: time,
            room: room_id,
        }) : message.info('Сообщение не может быть пустым')
        form.resetFields()
    }

    const getLoacalTime = (timestamp) => {
        let date = new Date(timestamp);
        return date.toLocaleTimeString('it-IT').slice(0, 5);
    }

    let today = new Date().toLocaleDateString("de-DE");

    return (
        <div className='room__container'>
            <Card
                title={room}
                bordered={false}
                className="room__card"
            >
                {allusersinchat === 1 ? <div className='chat__num-users'>{allusersinchat} участник</div> : allusersinchat < 5 && allusersinchat > 1  ? <div className='chat__num-users'>{allusersinchat} участника</div> : <div className='chat__num-users'>{allusersinchat} участников</div>}
                <div className='room_log-out' onClick={() => navigate("/")}></div>
                <div id="scrollableDiv" className='room_chat-area-scroll'>
                    <InfiniteScroll
                        dataLength={messages.length}
                        next={() => getMessages(room_id, setMessages)}
                        style={{ display: 'flex', flexDirection: 'column' }}
                        scrollableTarget="scrollableDiv"
                    >
                        {messages.length > 0 ? <div className='chat__date'>{today}</div> : ''}
                        {messages.map((m) => (m.user === user_id) ? <div className='chat__message-current-user' key={m.time}>
                                                                        {m.text}
                                                                        <div className='chat__message-current-user__time'>
                                                                            
                                                                            {m.read === true ? <div><div className='chat__read-mark'>L</div><div className='chat__read-mark-next'>L</div></div> : <div className='chat__checkmark'>L</div>}
                                                                            <div className='chat__time'>{getLoacalTime(m.time)}</div>
                                                                        </div>
                                                                    </div> 
                                                                    : 
                                                                    <div className='chat__message-another-user' key={m.time}>
                                                                        <b>{m.username}</b><br />
                                                                        {m.text}
                                                                        <div className='chat__time-au'>{getLoacalTime(m.time)}</div>
                                                                    </div>
                                    )
                        }
                    
                    </InfiniteScroll>
                </div>
                <Form
                    form={form}
                    onFinish={handle_submit}
                    size='large'
                    layout="inline"
                    className='chat__send-message-input'
                >
                    <Form.Item
                        name="message"
                        className='chat__send-message-input-actual'
                    >
                        <Input placeholder="Сообщение..." />
                    </Form.Item>

                        <Button className='chat__send-button' htmlType="submit">
                            <SendOutlined />
                        </Button>

                </Form>
            </Card>
        </div>
    )
}

export default Room;