
import { useState, useEffect } from "react"
import { getRooms, postRooms, getUser } from "../../utils/api"
import { Card, Form, Input, Button } from 'antd';
import { useNavigate } from "react-router-dom";
import useWebSocket from "react-use-websocket";
import { RightCircleOutlined } from "@ant-design/icons"

import "./Home.css"

const Home = () => {

    let [rooms, setRooms] = useState([])
    let [user_id, setUserid] = useState('')
    let navigate = useNavigate();
    let [rerender, setRerender] = useState(false)
    const [form] = Form.useForm();

    useEffect(() => {
        getRooms(setRooms)
        getUser(setUserid)
    }, [rerender])

    const { sendJsonMessage } = useWebSocket(`ws://127.0.0.1:8000/room/add/`)
    useWebSocket(`ws://127.0.0.1:8000/room/add/`, {
        onOpen: () => {
            console.log("Connected!");
        },
        onClose: () => {
            console.log("Disconnected!");
        },
        onMessage: (e) => {
            let data = JSON.parse(e.data)
            let rid = parseInt(localStorage.getItem('room')) + parseInt(1)
            setRooms(prev => prev.concat({...data, id: rid}))
        }
    });

    const handle_submit = (v) => {
        let data={"name": v.room_name, "users": [user_id]}
        postRooms(data)
        setRerender(rerender ? false : true)
        form.resetFields();
        sendJsonMessage({
            type: "chat_broadcast",
            name: v.room_name,
            users: [user_id],
        })
    }

    const log_out= () => {
        localStorage.setItem('token', '')
        window.location.replace("/")
    }

    return(
        <div className='container'>
            <div className="home__log-out" onClick={log_out}></div>
            <Card
                title="Выберите / создайте чат"
                bordered={false}
                className="card"
            >
                {rooms.map((r) => <div onClick={() => navigate(`/rooms/${r.id}`)} key={r.name} className="home__rooms-item">{r.name}<RightCircleOutlined className="home__rooms-item-i" /></div>)}
                <Form
                    onFinish={handle_submit}
                    size='large'
                    layout="inline"
                    form={form}
                >
                    <Form.Item
                        name="room_name"
                        className="home__room-input-area"
                    >
                        <Input className="home__room-input" placeholder="Введите название чата" />
                    </Form.Item>
                    
                        <Button className='home__create-chat-button' htmlType="submit">
                            Создать
                        </Button>
                    
                </Form>
            </Card>
        </div>
    ) 
}

export default Home;