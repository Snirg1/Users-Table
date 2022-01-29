import React, {Component} from 'react';
import UsersTable from "./UsersTable";
import "./table.css";


class App extends Component {

    constructor(props) {
        super(props)
        this.usersPerPage = 10
        this.state = {
            isLoading: true,
            currentPage: 1,
            usersByPage: [] // usersByPage[0] = all the users data from page 1, usersByPage[1] = all the users data from page 2
        }
    }

    componentDidMount() {
        this.fetchUsersByPageNum(this.state.currentPage)
    }

    async fetchUsersByPageNum(pageNumber) {
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
                            location: '',
                        }
                    )
                })
                let newUsers = this.state.usersByPage
                newUsers[pageNumber - 1] = usersObjects;
                this.setState({usersByPage: newUsers, isLoading: false, currentPage: pageNumber});
            } catch (error) {
                //TODO: handle error
            }
        }
    }

    setNextPage = () => {
        console.log("setNextPage")
        this.fetchUsersByPageNum(this.state.currentPage + 1)
    }

    setPrevPage = () => {
        console.log("setPrevPage")
        this.fetchUsersByPageNum(this.state.currentPage - 1)
    }

    render() {
        const currPage = this.state.currentPage
        return !this.state.isLoading ? (
            <div>
                <UsersTable key={"users_table_page_" + currPage} currentPage={currPage}
                            usersOnPage={this.state.usersByPage[this.state.currentPage - 1]}
                            onSetNextPage={this.setNextPage}
                            onSetPrevPage={this.setPrevPage}
                />
            </div>
        ) : null;
    }
}


export default App;