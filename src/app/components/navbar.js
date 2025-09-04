import Image from "next/image";
import { FaRegUser } from "react-icons/fa6";
import { CiSearch } from "react-icons/ci";
import { PiBagSimple } from "react-icons/pi";
import Link from "next/link";
import "./navbar.css";

export default function navbar() {
    return (
        <nav className="navbar">
            <div className="logo">
                <Link href="/" ><Image src="/logo.png" alt="logo" width={50} height={50}/></Link>
            </div>
            <div className="links">
                <Link href="/">TOPS</Link>
                <Link href="/about">BOTTOMS</Link>
                <Link href="/contact">BASICS</Link>
                <Link href="/blog">CLEARANCE</Link>
                <Link href="/careers">TRACK ORDER</Link>
            </div>
            <div className="icons">
                <FaRegUser size={30}/>
                <CiSearch size={30}/>
                <PiBagSimple size={30}/>
            </div>
        </nav>
    )
}