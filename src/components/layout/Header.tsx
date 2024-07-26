import React from 'react'
import { ReactComponent as Login } from "../../assets/images/login.svg"
import { ReactComponent as UserList } from "../../assets/images/userlist.svg"
import { Link } from 'react-router-dom'
export default function Header() {
  return (
    <div className='header'>
        <Link to="/"><div className='header_title'>CRESCENDO</div></Link>

        <ul className='header_menu'>
            <li><Link to="/">커뮤니티</Link></li>
            <li><Link to="/">댄스챌린지</Link></li>
            <li><Link to="/">전국최애자랑</Link></li>
            <li><Link to="/">오락실</Link></li>
        </ul>

        <div className='header_icon'>
        <Link to="/"><Login/></Link>
        <Link to="/"><UserList/></Link>
        </div>
    </div>
  )
}
