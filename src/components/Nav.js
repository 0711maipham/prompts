import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function Nav() {
    const { currentUser } = useAuth();
    return (
        <nav className="Nav">
            <div className="Nav__container mb-5">
                {/* <Link to="/" className="Nav__brand">
              <img src="logo.svg" className="Nav__logo" />
            </Link> */}

                <div className="Nav__right">
                    <ul className="Nav__item-wrapper">
                        <li className="Nav__item">
                            <Link className="Nav__link" to="/">
                                <FontAwesomeIcon icon="home" />
                            </Link>
                        </li>
                        <li className="Nav__item">
                            <Link className="Nav__link" to={currentUser ? "/update-profile" : "/login"}>
                                {
                                    currentUser ? <FontAwesomeIcon icon="cog" /> : <FontAwesomeIcon icon="sign-in-alt" />
                                }
                            </Link>
                        </li>
                        <li className="Nav__item">
                                {currentUser ? 
                                <Link className="Nav__link" to="/saved-decks">
                                <FontAwesomeIcon icon="heart" />
                                </Link>
                                :
                                ""}
                        </li>
                        {/* <li className="Nav__item">
                            <Link className="Nav__link" to="/">
                                <FontAwesomeIcon icon="question-circle" />
                            </Link>
                        </li> */}
                    </ul>
                </div>
            </div>
        </nav>
    )
}