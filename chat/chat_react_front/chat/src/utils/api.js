
import axios from 'axios';
import { message } from 'antd';

let motion = axios.create({
    headers: {
      Authorization : `JWT ${localStorage.getItem('token')}`
      }
    }
)

export const getUser = (setUserid) => {
    motion.get('/api/user/')
      .then(res => {
          localStorage.setItem('user', res.data.id);
          setUserid(res.data.id)
        })  
}

export const authUser = (datain) => {
    let data =  motion.post('/api/token-auth/', datain)
        .then(res => {
          localStorage.setItem('token', res.data.token);
          window.location.replace("/")
          return res.data
        })
        .catch(function (error) {
          if (error.toJSON().status === 400) {
            message.info('Неверный логин или пароль');
          }
        })

    return data
}

export const getRooms = async (setRooms) => {
  await motion.get('/api/rooms/')
                .then(res => setRooms(res.data.results))
}

export const getRoom = async (room_id, setRoom) => {
  await motion.get(`/api/rooms/${room_id}`)
                .then(res => setRoom(res.data.name))
}

export const postRooms = async (indata) => {
  await motion.post('/api/rooms/', indata)
                .then(res => localStorage.setItem('room', res.data.id))
                .catch(function (error) {
                  if (error.toJSON().status === 400) {
                    message.info('Название чата не может быть пустым или с одинковым названием');
                  }
                })
}

export const getMessages = (id, setMessages) => {
  motion.get(`/api/messages?room=${id}`)
      .then(res => {
          setMessages(res.data.results)
      })
}