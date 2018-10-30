import React, {Component} from 'react';
import './App.css';
import Login from '../LoginComponent/Login';
import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles'
import {BrowserRouter, Route, Redirect} from 'react-router-dom'
import Home from '../Home/Home';
import {auth} from '../../firebase/index';
import {CircularProgress} from '@material-ui/core';
const theme = createMuiTheme({
  palette: {
    type: 'light'
  },
  typography: {
    useNextVariants: true
  }
})

class App extends Component {
  constructor() {
    super();
    this.state = {
      authenticated: "",
      loading: true
    }
  }

  componentWillMount() {
    auth
      .auth
      .onAuthStateChanged((user) => {
        console.log(user);
        if (user) {
          this.setState({authenticated: user.uid, loading: false})
          localStorage.setItem("user", JSON.stringify(user));
        } else {
          this.setState({authenticated: "", loading: false})
        }
        console.log(this.state)
      })
  }

  render() {
    if (this.state.loading) {
      return (
        <div
          style={{
          display: 'flex',
          justifyContent: 'center'
        }}>
          <CircularProgress variant="indeterminate" className="center-text"></CircularProgress>
        </div>

      )
    }
    return (

      <MuiThemeProvider theme={theme}>
        <BrowserRouter>
          <div>
            <Route exact path="/" component={Login}/>
            <AuthenticatedRoute
              authenticated={this.state.authenticated}
              exact
              path="/home"
              component={Home}/>
          </div>
        </BrowserRouter>
      </MuiThemeProvider>
    );
  }
}
function AuthenticatedRoute({
  component: Component,
  authenticated,
  ...rest
}) {
  console.log(authenticated)
  return (
    <Route
      {...rest}
      render=
      {(props) => authenticated != "" ? <Component {...props} {...rest} /> : <Redirect to="/"/> }/>
  )
}
export default App;