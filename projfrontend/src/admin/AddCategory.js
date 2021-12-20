import React, {useState} from 'react'
import Base from '../core/Base';
import { isAuthenticated } from "../auth/helper";
import { Link } from 'react-router-dom';
import { createCategory } from "./helper/adminapicall";

const AddCategory = () => {

    const [name, setName] = useState("");
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);

    const {user, token} = isAuthenticated();

    const handleChange = event => {
        setError("");
        setName(event.target.value)
    };

    const onSubmit = event => {
        event.preventDefault();
        setError("")
        setSuccess(false)
        //backend req fired
        createCategory(user._id, token, {name})
        .then(data=> {
            if(data.error){
                setName("");
                setError(true)
            }else{                
                setName("");
                setError("");
                setSuccess(true);
            }
        })
    }

    const successMessage = () => {
        if(success){
            return <h4 className="text-success">Category created successfully</h4>
        }
    }

    const warningMessage = () => {
        if(error){
            return <h4 className="text-warning">Failed to create category</h4>
        }
    }

    const myCategoryForm = () => {
        return(
            <form>
                <div className="form-group">
                    <p className="lead">Enter the category</p>
                    <input 
                    type="text" 
                    className="form-control my-3 " 
                    onChange={handleChange}
                    autoFocus 
                    required 
                    placeholder="For ex. Summer" 
                    />
                    <button 
                    className="btn btn-outline-info mb-1 rounded"
                    onClick={onSubmit}
                    >Create Category</button>
                </div>
            </form>
        )
    }

    return (
        <Base title="Create a category here" description="Add a new category for new t-shirts" className="container bg-info p-4">
            <Link className="btn btn-md btn-success mb-3" to="/admin/dashboard">Admin Home</Link>
            <div className="row bg-white rounded">
                <div className="col-md-8 offset-md-2">
                    {successMessage()}
                    {warningMessage()}
                    {myCategoryForm()}
                </div>
            </div>
        </Base>
    )
}
export default AddCategory;