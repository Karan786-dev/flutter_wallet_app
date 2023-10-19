import React, { useState } from 'react';
import { connect } from 'react-redux';
import Circles_bg from '@/components/Circle_bg';
import axios from 'axios';
import styles from '@/styles/login.module.css';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { useRouter } from 'next/navigation';


export const Register = (props) => {
    let router = useRouter()
    const [formData, setFormData] = useState({ name: '', phone: '', password: '' });

    const inputChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    const handleRegister = (event) => {
        event.preventDefault();
        axios
            .post(`${process.env.NEXT_PUBLIC_API}/auth/merchant/register`, formData)
            .then((result) => {
                toast.success(result.message)
                router.push('/login')
            })
            .catch((error) => {
                toast.error(error.message||error.response.data.message)
                console.log(error.response.data)
            })
    };

    return (
        <div>
            <div className={`${styles.context} justify-content-center`}>
                <div className="container">
                    <div className="row">
                        <div className={`col-md-6 col-sm-12 ${styles['center-form']}`}>
                            <form className="border rounded p-3 bg-light" onSubmit={handleRegister}>
                                <h2 className={`mb-4 ${styles['login-heading']}`}>Register</h2>
                                <div className={`${styles['form-floating']} mb-3 form-floating`}>
                                    <input
                                        onChange={inputChange}
                                        type="text"
                                        className="form-control"
                                        id="name"
                                        placeholder="Enter Name"
                                        name="name"
                                        value={formData.name}
                                    />
                                    <label htmlFor="name">
                                        <i className="fad fa-user" style={{ fontSize: '15px' }}></i> Enter Name
                                    </label>
                                </div>
                                <div className={`${styles['form-floating']} mb-3 form-floating`}>
                                    <input
                                        onChange={inputChange}
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        placeholder="Enter email"
                                        name="email"
                                        value={formData.email}
                                    />
                                    <label htmlFor="name">
                                        <i className="fad fa-envelope" style={{ fontSize: '15px' }}></i> Enter Email
                                    </label>
                                </div>
                                <div className={`${styles['form-floating']} mb-3 form-floating`}>
                                    <input
                                        type="phone"
                                        className="form-control"
                                        id="number"
                                        placeholder="Phone Number"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={inputChange}
                                    />
                                    <label htmlFor="number">
                                        <i className="fas fa-phone-alt" style={{ fontSize: '15px' }}></i> Enter number
                                    </label>
                                </div>
                                <div className={`${styles['form-floating']} form-floating`}>
                                    <input
                                        name="password"
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        placeholder="Password"
                                        value={formData.password}
                                        onChange={inputChange}
                                    />
                                    <label htmlFor="password">
                                        <i className="fad fa-key" style={{ fontSize: '15px' }}></i> Enter password
                                    </label>
                                </div>
                                <button id="btn" type="submit" className="btn mt-3 w-100 btn-primary ">
                                    <i className="fas fa-lock"></i> Register
                                </button>
                                <div className="mt-3">
                                    Already have an account? <Link href={'/login'}><b>Login</b></Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <Circles_bg />
        </div>
    );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Register);
