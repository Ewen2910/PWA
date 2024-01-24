// Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import {
    MDBNavbar,
    MDBNavbarBrand,
    MDBNavbarNav,
    MDBNavbarItem,
    MDBNavbarLink,
    MDBContainer,
} from 'mdb-react-ui-kit';

const Navbar = () => {
    // Récupérer la valeur de sessionStorage.isConnected
    const isConnected = sessionStorage.getItem('isConnected') === 'true';

    return (
        <MDBNavbar expand='lg' light bgColor='white'>
            <MDBContainer fluid>
                <MDBNavbarBrand href='#'>Recipe App</MDBNavbarBrand>
                <MDBNavbarNav right className='mb-2 mb-lg-0'>
                    <MDBNavbarItem>
                        <Link to='/HomePage' className='nav-link'>
                            Home
                        </Link>
                    </MDBNavbarItem>
                    {isConnected && ( // Afficher le menu Recipes seulement si isConnected est true
                        <MDBNavbarItem>
                            <Link to='/create-recipe' className='nav-link'>
                                Recipes
                            </Link>
                        </MDBNavbarItem>
                    )}
                    <MDBNavbarItem>
                        <Link to='/Profile' className='nav-link'>
                            Profile
                        </Link>
                    </MDBNavbarItem>
                </MDBNavbarNav>
            </MDBContainer>
        </MDBNavbar>
    );
};

export default Navbar;
