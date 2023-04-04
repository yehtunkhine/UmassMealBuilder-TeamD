import { Link, useMatch, useResolvedPath} from "react-router-dom"

export default function Navbar(){
    const path = window.location.pathname
    return (
        <nav className="navbar nav bg-maroon">
        <div className="container-fluid">
        <Link to="/" className="navbar-brand site-title">UMass Meal Builder</Link>
        <ul>
            <CustomLink to = "/analysis">Analysis</CustomLink>
            <CustomLink to = "/dininghalls">Dining Halls</CustomLink>
            <CustomLink to = "/favorites">Favorites</CustomLink>
            <CustomLink to = "/login">Login</CustomLink>
            <CustomLink to = "/signup">Sign Up</CustomLink>
        </ul>
        </div>
    </nav>
    )
}

function CustomLink({ to,children, ...props}){
 const resolvedPath = useResolvedPath(to)
 const isActive = useMatch({path: resolvedPath.pathname, end:true})
    return(
        <li className = {isActive ? "active":""}>
            <Link to = {to}{...props}>
                 {children}
            </Link>
        </li>
    )
}
