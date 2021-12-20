import React, {useState, useEffect} from 'react'
import { Link } from 'react-router-dom';
import Base from "../core/Base";
import { getCategory, updateCategory } from './helper/adminapicall';
import { isAuthenticated } from "../auth/helper/index";

const UpdateCategory = ({ match }) => {
    const {user, token} = isAuthenticated()
    const [values, setValues] = useState({
        name: "",
        error: "",
        updatedCategory: "",
        getaRedirect: false
    })

    const { name, error, updatedCategory, getaRedirect } = values;

    const preload = (categoryId) => {
        getCategory(categoryId).then(data => {
            if(data?.error){
                setValues({...values, error: data.error})
            }else{
                setValues({
                    ...values,
                    name: data?.name,
                });
            }
        })
    }

    useEffect(() => {
        preload(match.params.categoryId);
    }, [])

    const handleChange = name => event => {
        const value = event.target.value
        setValues({...values, [name]: value});
    }

    const onSubmit = event => {
        event.preventDefault();
        setValues({...values, error: ""})
        updateCategory( match.params.categoryId, user._id, token, {name})
        .then(data => {            
            if( data && data?.error){
                setValues({...values, error: data.error})
            }
            else{
                setValues({
                    ...values,
                    name: "",
                    updatedCategory: data?.name
                })              
            }
        }).catch(err=>console.log(err))
    }

    const successMessage = () => {
        return (
            <div className="alert alert-success mt-3" style={{display: updatedCategory ? "" : "none"}}>
                <h4>{updateCategory} updated successfully</h4>
            </div>
        )
    }

    const warningMessage = () => {
        return(
            <div className="alert alert-warning mt-3" style={{display: error ? error : 'none'}}>
                <h4>Failed to update category</h4>
            </div>
        )
    }

    const updateCategoryForm = () => (
        <form className="mt-2">
          <div className="form-group mb-2">
            <input
            type="text"
              onChange={handleChange("name")}
              name="name"
              className="form-control"
              placeholder="Name"
              value={name}
            />
          </div>
          <button type="submit" onClick={onSubmit} className="btn btn-outline-success mb-3">
            Update Category
          </button>
        </form>
    );

    return (
        <Base 
        title="Update a category" 
        description="Welcome to category updation section"
        className="container bg-info p-4"
        >
            <Link className="btn btn-md btn-success mb-3" to="/admin/dashboard">Admin Home</Link>

            <div className="row bg-dark text-white rounded">
                <div className="col-md-8 offset-md-2">
                    {successMessage()}
                    {warningMessage()}
                    {updateCategoryForm()}
                </div>
            </div>
        </Base>
    )
}

export default UpdateCategory