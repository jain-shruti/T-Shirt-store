import React, {Fragment} from 'react'
import { Link } from 'react-router-dom';
import { isAuthenticated, signout } from '../auth/helper';
import '../styles.css'


const Menu = ({history}) =>(    
    <div>
        <ul className="nav nav-tabs bg-dark">
            <li className="nav-item">
                <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item">
                <Link className="nav-link" to="/cart">Cart</Link>
            </li>
            {isAuthenticated() && isAuthenticated().user.role=== 0 && (
                <li className="nav-item">
                    <Link className="nav-link" to="/user/dashboard">U. Dashboard</Link>
                </li>
            )}
            {isAuthenticated() && isAuthenticated().user.role === 1 && (
                <li className="nav-item">
                    <Link className="nav-link" to="/admin/dashboard">A. Dashboard</Link>
                </li>
            )}
            {!isAuthenticated() && (
                <Fragment>
                    <li className="nav-item">
                        <Link className="nav-link" to="/signup">Signup</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/signin">Signin</Link>
                    </li>
                </Fragment>
            )}
            {isAuthenticated() && (
                <li className="nav-item">
                    <Link 
                    to="/" 
                    className="nav-link text-warning" 
                    onClick={ ()=> { signout() }}>
                        Sign out
                    </Link>
                </li>
            )} 
            
        </ul>
    </div>
)


export default Menu;
