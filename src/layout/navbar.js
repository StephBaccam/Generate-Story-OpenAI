const Navbar = () => {
    return (
        <nav className="navbar navbar-expand-sm sticky-top" style={{display:"block", backgroundColor: '#2F3643'}}> 
            <div className="d-flex">
                <a href='/' className="navbar-text mr-auto" style={{fontSize:"20px", color: "white"}}>
                    OpenAI Story
                </a>
            </div>
        </nav>
    )
}

export default Navbar