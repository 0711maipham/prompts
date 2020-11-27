import "react-toggle/style.css"
import '../styles/app.css'
import React from "react"
import Signup from "./Signup"
import Dashboard from "./Dashboard"
import Login from "./Login"
import { Container } from "react-bootstrap"
import { AuthProvider } from "../contexts/AuthContext"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import PrivateRoute from './PrivateRoute'
import ForgotPassword from './ForgotPassword'
import UpdateProfile from "./UpdateProfile"
import EditDeck from "./EditDeck"
import Nav from './Nav';
import ReactDOM from 'react-dom'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { faCheckSquare, faCoffee, faHome, faCog, faSignInAlt, faMinusSquare, faEdit } from '@fortawesome/free-solid-svg-icons'

library.add(fab, faCheckSquare, faCoffee, faHome, faCog, faSignInAlt, faMinusSquare, faEdit)

function App() {
  return (
    <div className="align-items-center justify-content-center"
      style={{ minHeight: "100vh" }}>
      <Router>
        <AuthProvider>
          <Nav />
          <div className="w-100" style={{ maxWidth: '100%' }}>
            <Switch>
              <PrivateRoute exact path="/" component={Dashboard} />
              <Route path="/deck/:id" component={EditDeck} />
              <Container className="align-items-center justify-content-center">
              <PrivateRoute path="/update-profile" component={UpdateProfile} />
              <Route path="/forgot-password" component={ForgotPassword} />
              <Route path="/signup" component={Signup} />
              <Route path="/login" component={Login} />
              </Container>
            </Switch>
          </div>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
