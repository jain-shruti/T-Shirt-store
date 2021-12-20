import React, {useState, useEffect} from 'react'
import { Link } from 'react-router-dom';
import Base from "../core/Base";
import { getCategories, getProduct, updateProduct } from './helper/adminapicall';
import { isAuthenticated } from "../auth/helper/index";

const UpdateProduct = ({ match }) => {

    const {user, token} = isAuthenticated()
    const [values, setValues] = useState({
        name: "",
        description: "",
        price: "",
        stock: "",
        photo: "",
        categories: [],
        category: "",
        loading: false,
        error: "",
        updatedProduct: "",
        getaRedirect: false,
        formData: "" 
    })

    const { name, 
        description, 
        price, 
        stock, 
        categories, 
        category, 
        loading, 
        error, 
        updatedProduct, 
        getaRedirect, 
        formData} = values;

    const preload = (productId) => {
        getProduct(productId).then(data => {
            // console.log(data)
            if(data?.error){
                setValues({...values, error: data.error})
            }else{
                setValues({
                    ...values,
                    name: data?.name,
                    description: data?.description,
                    price: data?.price,
                    category: data?.category._id,
                    stock: data?.stock,
                    formData: new FormData(),
                });
                preloadCategories()
            }
        })
    }

    const preloadCategories = () => {
        getCategories().then(data => {
            if(data?.error){
                setValues({...values, error: data.error})
            }else{
                setValues({
                    categories: data,
                    formData: new FormData()
                })
            }
        })
    }

    useEffect(() => {
        preload(match.params.productId);
    }, [])

    const handleChange = name=> event => {
        const value = name === "photo" ? event.target.files[0] : event.target.value
        formData.set(name, value);
        setValues({...values, [name]: value});
    }

    const onSubmit = event => {
        event.preventDefault();
        setValues({...values, error: "", loading: true})
        updateProduct( match.params.productId, user._id, token, formData).then(data=> {
            if(data?.error){
                setValues({...values, error: data.error})
            }
            else{
                setValues({
                    ...values,
                    name: "",
                    description: "",
                    price: "",
                    photo: "",
                    loading: false,
                    updatedProduct: data?.name
                })
            }
        }).catch(err=>console.log(err))
    }

    const successMessage = () => {
        return (
            <div className="alert alert-success mt-3" style={{display: updatedProduct ? "" : "none"}}>
                <h4>{updatedProduct} updated successfully</h4>
            </div>
        )
    }

    const warningMessage = () => {
        return(
            <div className="alert alert-warning mt-3" style={{display: error ? error : 'none'}}>
                <h4>Failed to create product</h4>
            </div>
        )
    }

    const updateProductForm = () => (
        <form >
          <span>Post photo</span>
          <div className="form-group mb-2">
            <label className="btn btn-block btn-success">
              <input
                onChange={handleChange("photo")}
                type="file"
                name="photo"
                accept="image"
                placeholder="choose a file"
              />
            </label>
          </div>
          <div className="form-group mb-2">
            <input
              onChange={handleChange("name")}
              name="photo"
              className="form-control"
              placeholder="Name"
              value={name}
            />
          </div>
          <div className="form-group mb-2">
            <textarea
              onChange={handleChange("description")}
              name="photo"
              className="form-control"
              placeholder="Description"
              value={description}
            />
          </div>
          <div className="form-group mb-2">
            <input
              onChange={handleChange("price")}
              type="number"
              className="form-control"
              placeholder="Price"
              value={price}
            />
          </div>
          <div className="form-group mb-2">
            <select
              onChange={handleChange("category")}
              className="form-control"
              placeholder="Category"
            >
              <option>Select</option>
              {categories &&
              categories?.map((category, index) => (
                <option key={index} value={category._id}>{category.name}</option>
              )) }
            </select>
          </div>
          <div className="form-group mb-2">
            <input
              onChange={handleChange("stock")}
              type="number"
              className="form-control"
              placeholder="Quantity"
              value={stock}
            />
          </div>
          
          <button type="submit" onClick={onSubmit} className="btn btn-outline-success mb-3">
            Update Product
          </button>
        </form>
    );

    return (
        <Base 
        title="Update a product" 
        description="Welcome to product updation section"
        className="container bg-info p-4"
        >
            <Link className="btn btn-md btn-success mb-3" to="/admin/dashboard">Admin Home</Link>

            <div className="row bg-dark text-white rounded">
                <div className="col-md-8 offset-md-2">
                    {successMessage()}
                    {warningMessage()}
                    {updateProductForm()}
                </div>
            </div>
        </Base>
    )
}



export default UpdateProduct