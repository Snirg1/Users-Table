import React, {Component} from 'react';
import UsersTable from "./UsersTable";
import {
    BrowserRouter as Router,
    Switch,
    Redirect,
    Route,
} from "react-router-dom";
import "./table.css";
import UserDetails from "./userDetails";


class App extends Component {

    constructor(props) {
        super(props)
        this.usersPerPage = 10
        this.fetchOnMount = true
        this.state = {
            isLoading: true,
            currentPage: 1,
            usersByPage: [], // usersByPage[0] = all the users data from page 1, usersByPage[1] = all the users data from page 2
            userDetails: null
        }
    }

    componentDidMount() {
        if (this.fetchOnMount)
            this.fetchUsersByPageNum(this.state.currentPage)
    }

    async fetchUsersByPageNum(pageNumber) {
        this.fetchOnMount = false
        if (this.state.usersByPage[pageNumber - 1]) {
            this.setState({currentPage: pageNumber});
        } else {
            try {
                const resText = await fetch(`https://randomuser.me/api/?inc=gender,name,picture,location,dob,email&results=${this.usersPerPage}&seed=abc&page=${pageNumber}`);
                const resJson = await resText.json();
                const usersObjects = resJson.results.map((userRawData) => {
                    return (
                        {
                            gender: userRawData.gender,
                            firstName: userRawData.name.first,
                            lastName: userRawData.name.last,
                            fullName: userRawData.name.first.slice(0, 1) + "." + userRawData.name.last,
                            email: userRawData.email,
                            age: userRawData.dob.age,
                            pictureUrl: userRawData.picture.medium,
                            location: userRawData.location,
                        }
                    )
                })
                let newUsers = this.state.usersByPage
                newUsers[pageNumber - 1] = usersObjects;
                this.setState({
                    usersByPage: newUsers, isLoading: false,
                    currentPage: pageNumber
                });
            } catch (error) {
                //TODO: handle error
            }
        }
    }

    onUserDataRowClicked = (userData) => {
        this.setState({userDetails: userData})
    }

    setNextPage = () => {
        this.fetchUsersByPageNum(this.state.currentPage + 1)
    }

    setPrevPage = () => {
        this.fetchUsersByPageNum(this.state.currentPage - 1)
    }

    renderUsersTable = (currPage) => {
        return (
            <UsersTable key={"users_table_page_" + currPage} currentPage={currPage}
                        usersOnPage={this.state.usersByPage[this.state.currentPage - 1]}
                        onSetNextPage={this.setNextPage}
                        onSetPrevPage={this.setPrevPage}
                        onUserDataRowClicked={this.onUserDataRowClicked}
            />
        )
    }

    // renderUserDetails = (pageNum, fullName) => {
    //     const userData = this.state.usersByPage[pageNum].find((userData) => userData.fullName === fullName)
    //     return (<UserDetails userData={userData}/>)
    // }

    renderUiElements = () => {
        const userData = this.state.userDetails
        if (userData){
            return <UserDetails userData={userData}/>
        }else{
            return this.renderUsersTable(this.state.currentPage);
        }
    }


    render() {
        return this.state.isLoading ? (
            <Router>
                <div className="App">
                    <Switch>
                        {/*<Route path={"/:pageNum/:fullName"} render={(history) => {*/}
                        {/*    const {pageNum, fullName} = history.match.params*/}
                        {/*    this.renderUserDetails(pageNum, fullName)*/}
                        {/*    //TODO : render user details from pageNum page and fullName*/}
                        {/*}}/>*/}
                        <Route exact path={"/:pageNum"} render={(props) => {
                            const pageNum = parseInt(props.match.params.pageNum)
                            this.fetchUsersByPageNum(pageNum)
                        }}/>
                        <Route exact path={"/"} render={(props) => {
                            return <Redirect to={{pathname: "/1"}}/>
                        }}/>
                        )
                    </Switch>
                </div>
            </Router>
        ) : this.renderUiElements()
    }
}


export default App;