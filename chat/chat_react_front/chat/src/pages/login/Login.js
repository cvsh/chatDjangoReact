
import React from 'react';
import { authUser } from '../../utils/api';
import { Card, Form, Input, Button } from 'antd';
import "./Login.css"

const Login = () => {

    const handle_submit = (v) => {
        let data={"username": v.username, "password": v.password}
        authUser(data)
    }

    return (
        <div className='container'>
            <Card
                title="Авторизация"
                bordered={false}
                className="card"
            >
                <Form
                    name="basic"
                    onFinish={handle_submit}
                    size='large'
                >
                    <Form.Item className='loginform__item'
                        name="username"
                    >
                        <Input className="loginform__input" placeholder="Логин" />
                    </Form.Item>

                    <Form.Item className='loginform__item'
                        name="password"
                    >
                        <Input className="loginform__input" type="password" placeholder="Пароль" />
                    </Form.Item>

                    <Form.Item>
                        <Button className='loginform__enter-button' htmlType="submit">
                            Войти
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
}

export default Login;