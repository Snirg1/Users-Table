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

    async fetchUsersByPageNum(pageNumber, fullName = null) {
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
                            pageNum: pageNumber
                        }
                    )
                })
                let newUsers = this.state.usersByPage
                newUsers[pageNumber - 1] = usersObjects;
                let userData = null;
                if (fullName){
                    userData = newUsers[pageNumber - 1].find(userData => userData.fullName === fullName)
                }
                this.setState({
                    usersByPage: newUsers, isLoading: false,
                    currentPage: pageNumber, userDetails: userData
                });
            } catch (error) {
                alert("Error: " + error)
            }
        }
    }

    setNextPage = () => {
        var originUrl = window.location.origin;
        window.location.assign(`${originUrl}/${this.state.currentPage + 1}`)
    }

    setPrevPage = () => {
        var originUrl = window.location.origin;
        window.location.assign(`${originUrl}/${this.state.currentPage - 1}`)
    }

    renderUsersTable = (currPage) => {
        return (
            <UsersTable key={"users_table_page_" + currPage} currentPage={currPage}
                        usersOnPage={this.state.usersByPage[this.state.currentPage - 1]}
                        onSetNextPage={this.setNextPage}
                        onSetPrevPage={this.setPrevPage}
                        onUserDataRowClicked={this.onUserDataRowClicked}
                        reRenderTable={this.reRenderTable}
            />
        )
    }

    reRenderTable = () => {
        var originUrl = window.location.origin;
        window.location.assign(`${originUrl}/${this.state.currentPage}`)
    }

    onUserDataRowClicked = (userData) => {
        var originUrl = window.location.origin;
        window.location.assign(`${originUrl}/${userData.pageNum}/${userData.fullName}`)
    }

    renderUiElements = () => {
        const userData = this.state.userDetails
        if (userData){
            return <UserDetails userData={userData} reRenderTable={this.reRenderTable}/>
        }else{
            return this.renderUsersTable(this.state.currentPage);
        }
    }

    render() {
        return this.state.isLoading ? (
            <Router>
                <div className="App">
                    <Switch>
                        <Route path={"/:pageNum/:fullName"} render={(props) => {
                            const {pageNum, fullName} = props.match.params
                            this.fetchUsersByPageNum(pageNum, fullName)
                        }}/>
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