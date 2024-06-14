import React, { Suspense } from "react";
import {
    BrowserRouter as Router,
    Route,
    Redirect,
    Switch,
} from "react-router-dom";

// import Users from "./user/pages/Users";
// import NewPlace from "./places/pages/NewPlace";
// import UserPlaces from "./places/pages/UserPlaces";
// import Nav from "./shared/components/Navigation/Nav";
// import UpdatePlace from "./places/pages/UpdatePlace";
// import Auth from "./user/pages/Auth";
import { AuthContext } from "./shared/contexts/authContext";
import { useAuth } from "./shared/hooks/AuthHook";
import LoadingSpinner from "./shared/components/UIElements/LoadingSpinner";

const Users = React.lazy(() => import("./user/pages/Users"));
const NewPlace = React.lazy(() => import("./places/pages/NewPlace"));
const UserPlaces = React.lazy(() => import("./places/pages/UserPlaces"));
const Nav = React.lazy(() => import("./shared/components/Navigation/Nav"));
const UpdatePlace = React.lazy(() => import("./places/pages/UpdatePlace"));
const Auth = React.lazy(() => import("./user/pages/Auth"));

const App = () => {
    const { token, login, logout, user } = useAuth();

    let routes;
    if (token) {
        routes = (
            <Switch>
                <Route path='/' exact>
                    <Users />
                </Route>
                <Route path='/:userId/places'>
                    <UserPlaces />
                </Route>
                <Route path='/places/new' exact>
                    <NewPlace />
                </Route>
                <Route path='/places/:placeId' exact>
                    <UpdatePlace />
                </Route>
                <Redirect to='/' />
            </Switch>
        );
    } else {
        routes = (
            <Switch>
                <Route path='/' exact>
                    <Users />
                </Route>
                <Route path='/:userId/places'>
                    <UserPlaces />
                </Route>
                <Route path='/auth' exact>
                    <Auth />
                </Route>
                <Redirect to='/auth' />
            </Switch>
        );
    }

    return (
        <AuthContext.Provider
            value={{
                isLoggedIn: !!token,
                token: token,
                login: login,
                logout: logout,
                user: user,
            }}
        >
            <Router>
                <Suspense
                    fallback={
                        <div className='center'>
                            <LoadingSpinner />
                        </div>
                    }
                >
                    <Nav />
                    <main>{routes}</main>
                </Suspense>
            </Router>
        </AuthContext.Provider>
    );
};

export default App;
