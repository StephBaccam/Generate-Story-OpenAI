const Navbar = () => {
    return (
        <nav className="navbar navbar-expand-sm sticky-top" style={{display:"block", backgroundColor: '#2F3643'}}> 
            <div className="d-flex">
                <a href='/' className="navbar-text mr-auto text-white">
                    OpenAI Story
                </a>
                <a href='/inscription' className="navbar-text ml-auto text-white">
                    S'inscrire
                </a>
            </div>
        </nav>
    )
}

export default Navbar