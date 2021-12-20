import React, {useState} from 'react'
import Base from '../core/Base'
import { Link } from 'react-router-dom'
import {signup} from '../auth/helper'

const Signup = () => {

    const [ values, setValues ] = useState({
        firstname: "",
        email: "",
        password: "",
        error: "",
        success: false
    })
    const {firstname, email, password, error, success} = values

    const handleChange = name => event => {
        setValues({...values, error: false, [name]: event.target.value });
    }

    const onSubmit = event => {
        event.preventDefault()
        setValues({...values, error: false})
        signup({firstname, email, password})
        .then( data => {
            if(data.error){
                setValues({ ...values, error: data.error, success: false })
            }
            else{
                setValues({
                    ...values,
                    firstname: "",
                    email: "",
                    password: "",
                    error: "",
                    success: true
                })
            }
        })
        .catch(console.log("Error in signup"))
    }

    const signUpForm = ()=> {
        return(
            <div className="row">
                <div className="col-md-6 offset-sm-3 text-left">
                    <form>
                        <div className="form-group">
                            <label className="text-light">Name</label>
                            <input className="form-control" type="text" onChange={handleChange("firstname")} value={firstname} />
                        </div>
                        <div className="form-group">
                            <label className="text-light">Email</label>
                            <input className="form-control" type="email" onChange={handleChange("email")} value={email} />
                        </div>
                        <div className="form-group">
                            <label className="text-light">Password</label>
                            <input className="form-control" type="password" onChange={handleChange("password")} value={password} />
                        </div>
                        <div class="d-grid my-2">
                            <button className="btn btn-success" onClick={onSubmit}>Submit</button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }

    const successMessage = () => {
        return (
            <div className="row">
                <div className="col-md-6 offset-sm-3 text-left">
                    <div className="alert alert-success" style={{display: success ? "": "none"}}>
                        New account was created successfully. Please <Link to="/signin">Login here </Link>.
                    </div>
                </div>
            </div>
        )
    } 

    const errorMessage = () => {
        return(
            <div className="row">
                <div className="col-md-6 offset-sm-3 text-left">
                    <div className="alert alert-danger" style={{display: error ? "": "none"}}>
                        {error}
                    </div>
                </div>
            </div>
        )} 


    return (
        <Base title="Sign up page" description="A page for user to signup!" >
            {successMessage()}
            {errorMessage()}
            {signUpForm()}
        </Base>
    )
}
export default Signup;