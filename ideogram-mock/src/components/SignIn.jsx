import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

const SignIn = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setName(e.target.value);
        setEmail(e.target.value);
        setPassword(e.target.value);
    }

    // authentication logic here

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate("/", { replace: true });
        console.log(`Name: ${name}, Email: ${email}, Password: ${password}`);
    }

  return (
    <div className='flex items-center justify-center flex-col '>
        <img className='w-100 rounded-xl' src="../ideogramlogo.png" alt="Ideogram Logo " />
        <h1 className=' p-2'>welcome to ideogram</h1>

      <form className='flex flex-col content-center' onSubmit={handleSubmit}> 
        <>
        <input  className='m-5 w-100 p-4  rounded-xl bg-green-600'
          placeholder='Enter your name'
          type="text" 
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        </>
        <>
        <input className='m-5 w-100 p-4 rounded-xl bg-green-50'
          placeholder='Enter your email'
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        </>
       <>
        <input type="password" className='p-4 m-5 w-100 rounded-xl bg-green-500 '  
          placeholder="Enter your password"
          value={password} 
          onChange={(e) => setPassword(e.target.value)} />
        </>
       <input className='rounded-xl bg-amber-500' type="submit" />
       <button type='submit' className='bg-red-600 rounded-xl'> Sign in </button>
       <p>Create an account? <Link to="/signup">Sign Up</Link></p>
     </form>
      <Link to="/">sign in </Link>
        <Link to="/home">Go to Home </Link>
        <Link to="/signup">sign up </Link>
        <Link to="/notification">notify me</Link>

    </div>
  ); 
}

export default SignIn;