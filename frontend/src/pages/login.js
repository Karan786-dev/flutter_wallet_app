import React, { useRef, useState } from 'react';
import { connect } from 'react-redux';
import styles from '@/styles/login.module.css';
import Circles_bg from '@/components/Circle_bg';
import axios from 'axios';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export const Login = (props) => {
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [is_merchant, set_is_merchant] = useState(null);
    const [reset_pass_form, set_reset_pass_form] = useState({
        email: '',
        new_password: '',
        verification_code: '',
    })
    const [second_section_opened, open_second_section] = useState(false)
    const inputChange = (event) => {
        set_reset_pass_form({ ...reset_pass_form, [event.target.name]: event.target.value });
    };
    const send_reset_request = (e) => {
        e.preventDefault()
        if (!(reset_pass_form.new_password)) return toast.warn('Enter new password')
        if (!(reset_pass_form.verification_code)) return toast.warn('Enter verification code')
        axios.post(`${process.env.NEXT_PUBLIC_API}/auth/user/verify`, { verification_code: reset_pass_form.verification_code, new_password: reset_pass_form.new_password }).then((result) => {
            toast.success(result.data.message)
            close_canvas_button.current.click()
        }).catch((error) => {
            toast.error(error.response.data.message||error.message);
            console.log(error.response.data||error);
        })
    }
    const send_otp = (e) => {
        e.preventDefault()
        if (!(reset_pass_form.email)) return toast.warn('Enter registed email address')
        axios.post(`${process.env.NEXT_PUBLIC_API}/auth/user/reset`, { email: reset_pass_form.email })
            .then((result) => {
                open_second_section(true)
                toast.success(result.data.message)
            })
            .catch((error) => {
                toast.error(error.response.data.message||error.message);
                console.log(error||error.response.data);
            })
    }
    const router = useRouter()
    const handleLogin = (event) => {
        event.preventDefault();
        axios
            .post(`${process.env.NEXT_PUBLIC_API}/auth/${is_merchant ? 'merchant' : 'user'}/login`, { phone, password })
            .then((result) => {
                toast.success(result.data.message);
                localStorage.setItem(is_merchant ? "merchant-wallet-auth-token" : "wallet-auth-token", result.data.token)
                router.push(is_merchant ? '/merchant' : '/dashboard');
            })
            .catch((error) => {
                toast.error(error.response.data.message||error.message);
                console.log(error||error.response.data);
            });
    };
    const close_canvas_button = useRef(null)
    return (
        <div>
            <div className={`${styles.context} justify-content-center`}>
                <div className="container">
                    <div className="row">
                        <div className={`col-md-6 col-sm-12 ${styles['center-form']}`}>
                            <form className="border rounded p-3 bg-light" onSubmit={handleLogin}>
                                <h2 className={`mb-4 ${styles['login-heading']}`}>Login</h2>
                                <div className={`${styles['form-floating']} mb-3 form-floating`}>
                                    <input
                                        type="tel"
                                        className="form-control"
                                        id="number"
                                        placeholder="Phone Number"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                    />
                                    <label htmlFor="number">
                                        <i className="fas fa-phone-alt" style={{ fontSize: '15px' }}></i> Enter number
                                    </label>
                                </div>
                                <div className={`${styles['form-floating']} form-floating mb-3`}>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <label htmlFor="password">
                                        <i className="fad fa-key" style={{ fontSize: '15px' }}></i> Enter password
                                    </label>
                                </div>
                                <lable>
                                    Are you a merchant?
                                </lable>
                                <input type="checkbox" name="is-merchant" id="is-merchant" value={is_merchant} onChange={(e) => set_is_merchant(e.target.checked)} />
                                <button id="btn" type="submit" className="btn mt-3 w-100 btn-primary ">
                                    <i className="fas fa-lock"></i> Login
                                </button>
                                <div className="mt-3">
                                    Don't have an account? <Link href="/register">Register</Link>
                                </div>
                                <div className="mt-2 mb-0">
                                    Forgot Password?
                                    <a className="text-decoration-none" data-bs-toggle="offcanvas" data-bs-target="#offcanvasBottom" aria-controls="offcanvasBottom">
                                        {' '}
                                        Reset
                                    </a>
                                </div>
                            </form>
                            <div
                                style={{
                                    height: 'auto',
                                    borderTopLeftRadius: '21px',
                                    borderTopRightRadius: '21px',
                                }}
                                className="offcanvas offcanvas-bottom"
                                tabIndex="-1"
                                id="offcanvasBottom"
                                aria-labelledby="offcanvasBottomLabel"
                            >
                                <center>
                                    <div
                                        data-bs-dismiss="offcanvas"
                                        aria-label="Close"
                                        style={{ height: '4px', width: '37px', background: '#d6d6d6', borderRadius: '10px', marginTop: '10px' }}
                                    ></div>
                                </center>
                                <div className="offcanvas-header py-0 pt-2">
                                    <h6 className="offcanvas-title fwi" id="offcanvasBottomLabel">
                                        <img src="/images/lock_reset.png" style={{ height: '30px', width: '30px', border: '1px solid #d6d6d6', padding: '3px', borderRadius: '50%' }} alt="" /> Reset your password
                                    </h6>
                                    <hr />
                                    <button style={{ border: 'none' }} type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close" ref={close_canvas_button}></button>
                                </div>
                                <div className="offcanvas-body small">
                                    {
                                        !second_section_opened ? (<><div className="mb-3" id="emaildiv">
                                            <input type="email" className="fwi form-control" id="email_id" placeholder="Registered email" name='email' onChange={inputChange} value={reset_pass_form.email}/>
                                        </div>

                                            <button onClick={send_otp} style={{ background: '#01a1f7' }} id="send_otp" className="btn fw mb-3 w-100 btn-info">
                                                <i className="far fa-shield-alt"></i> Send OTP
                                            </button> </>) : (<><div className="mb-3" id="otpdiv" >
                                                <input className="fwi form-control" id="otp" placeholder="Enter verification code" name="verification_code" value={reset_pass_form.verification_code} onChange={inputChange} />
                                            </div>
                                                <div className="mb-3" id="pwddiv">
                                                    <input type="password" className="fwi form-control" id="pwd" placeholder="Enter New Password" name="new_password" onChange={inputChange} value={reset_pass_form.new_password}/>
                                                </div>
                                                <button style={{ background: '#01a1f7', display: second_section_opened }} id="verify_otp" className="btn fw mb-3 w-100 btn-info" disabled={!(reset_pass_form.new_password) || !(reset_pass_form.verification_code)} onClick={send_reset_request}>
                                                    <i className="fad fa-user-lock"></i> Verify
                                                </button></>)
                                    }

                                </div>
                            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Login);
