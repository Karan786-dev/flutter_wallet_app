import React from 'react';
import { connect } from 'react-redux';
import styles from '@/styles/navbar.module.css'
import { useRouter } from 'next/router';
import Link from 'next/link';

export const Navbar = (props) => {
    const router = useRouter()
    const navbarStyle = {
        height: '65px',
    };

    const containerStyle = {
        display: 'flex',
        alignItems: 'center',
        fontSize: '20px',
        color: '#fbfbfbeb',
        fontWeight: '600',
    };

    const imgStyle = {
        height: '40px',
        width: '40px',
        borderRadius: '50%',
        border: '1px solid gray',
        padding: '3px',
        marginRight: '12px',
    };

    const logoutButtonStyle = {
        zIndex: '99',
    };

    const logout = () => {
        localStorage.removeItem("wallet-auth-token")
        router.push('/login')
    }

    return (
        <div>
            <nav style={navbarStyle} className={`navbar navbar-expand-lg bg-body-tertiary ${styles.navbar}`}>
                <div className="container-fluid">
                    <div className="navbar-branding d-flex align-items-center" style={containerStyle}>
                        <img src="https://Task.cb-campaign.in/logo.jpg" style={imgStyle} alt="" />
                        CB Campaign
                    </div>
                    {router.pathname == '/merchant' &&
                        <Link style={{ zIndex: 888 }} href={'/merchant/profile'}><button className="btn btn-light btn-sm"><i className="fa fa-user" aria-hidden="true"></i></button>
                        </Link>
                    }

                    {router.pathname == '/merchant/profile' ? <Link style={{zIndex:888}} href={'/merchant'}>
                        <button className="btn btn-light btn-sm">
                            <i className="fad fa-sign-out-alt"></i></button></Link>
                        : <button id="logouts" style={logoutButtonStyle} onClick={logout} className="btn btn-light btn-sm">
                            <i className="fad fa-sign-out-alt"></i>
                        </button>}
                </div>
            </nav>
        </div>
    );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
