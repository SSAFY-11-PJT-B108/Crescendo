import React from 'react'
import { isRouteErrorResponse,useNavigate,useRouteError } from "react-router-dom";
import Button from '../common/Button';


export default function ErrorPage() {
    const navigate = useNavigate();  
    const error = useRouteError();

    const HandleBack = () => {
        navigate(-1);
    }
    
    if (isRouteErrorResponse(error)) {
        return <div className='flex flex-col w-1/5 mx-auto justify-center items-center'>
        <div className='text-4xl text-center'>{error.status} {error.statusText}</div>
        <Button onClick={HandleBack}>뒤로가기</Button>
        </div>
    }
  
    return <div className='mx-auto'>Something went wrong</div>;
  }
