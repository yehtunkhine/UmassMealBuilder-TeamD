import { Link, useMatch, useResolvedPath} from "react-router-dom"

export default function Navbar(){
    return (
        <nav className="navbar navbar-expand-md nav bg-maroon navbar-dark">
        <div className="container-fluid">
            <Link to="/" className="navbar-brand site-title">UMass Meal Builder</Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
                <ul>
                    <CustomLink to = "/analysis">Analysis</CustomLink>
                    <CustomLink to = "/dininghalls">Dining Halls</CustomLink>
                    <CustomLink to = "/favorites">Favorites</CustomLink>
                    <CustomLink to = "/login">Login</CustomLink>
                    <CustomLink to = "/signup">Sign Up</CustomLink>
                </ul>
            </div>
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
