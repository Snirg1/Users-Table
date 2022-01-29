import React, {Component} from "react";
import UserDataRow from "./UserDataRow"

class UsersTable extends Component {

    constructor(props) {
        super(props);
        console.log("props: ")
        console.log(props)
        this.usersPerPage = 10
        this.currentPage = props.currentPage
        this.onSetNextPage = props.onSetNextPage
        this.onSetPrevPage = props.onSetPrevPage
        this.headersMap = {
            pictureUrl: "Picture", gender: "Gender", fullName: "Full name", email: "Email", age: "Age",
        }
        console.log(props)
        this.state = {
            updatedUsersToRender: props.usersOnPage,
            users: props.usersOnPage,
            isLoading: false,
            isError: false,
            sortBy: "email",
            searchBy: "fullName",
            isAsc: true,
            searchWord: "",
            currentPage: 1,
        }
    }


    sortUsersByAttribute = (attr) => {
        const isAsc = (attr === this.state.sortBy) ? (!this.state.isAsc) : true;

        const sortFn = (userA, userB) => {
            const res = (userA[this.state.sortBy] < userB[this.state.sortBy]) ? -1 : ((userA[this.state.sortBy] > userB[this.state.sortBy]) ? 1 : 0)
            const sign = this.state.isAsc ? 1 : -1;
            return res * sign;
        }
        const newUsers = [...this.state.updatedUsersToRender].sort(sortFn)
        const sortedUsers = this.state.users.sort(sortFn)
        this.setState({users: sortedUsers, updatedUsersToRender: newUsers, isAsc: isAsc, sortBy: attr});
    }

    renderTableHeader = () => {
        return Object.keys(this.state.users[0]).map(attr => {
                const header = this.headersMap[attr];
                const onClickFn = ["gender", "pictureUrl"].includes(attr) ? () => {
                } : () => this.sortUsersByAttribute(attr)
                if (header) {
                    return (<th key={attr} onClick={onClickFn}>{header} </th>)
                } else
                    return null
            }
        )
    }

    renderTableRows = () => {
        let newUsers = this.state.updatedUsersToRender.map((user, index) => {
            return (
                <UserDataRow key={"userDataRow_" + user.age + "_" + index} userData={user}/>
                // we add the user.age to distinct between each component's key
            )
        });
        return newUsers;
    }

    filterUsersBy = (searchWord, filterBy) => {
        return this.state.users.filter((userData) => {
            return (userData[filterBy].toString().toLowerCase().includes(searchWord.toLowerCase())) // return false if the current user should be filtered
        })
    }

    onSearchWordChange = (evnt) => {
        const updatedSearchWord = evnt.target.value
        const filteredUsers = this.filterUsersBy(updatedSearchWord, this.state.searchBy)
        this.setState({updatedUsersToRender: filteredUsers, searchWord: updatedSearchWord})
    }

    render() {
        const {updatedUsersToRender, isLoading, isError} = this.state;

        if (isLoading) {
            return <div>Loading...</div>
        }
        if (isError) {
            return <div>Error...</div>
        }
        return (
            <div>
                {this.renderTableSearch()}
                {(updatedUsersToRender.length > 0)
                    ? (
                        <div>
                            <table>
                                <thead>
                                <tr>
                                    {this.renderTableHeader()}
                                </tr>
                                </thead>
                                <tbody>
                                {this.renderTableRows()}
                                </tbody>
                            </table>
                            {this.renderTablePagination()}
                        </div>
                    )
                    : (<h3>No Users</h3>)}
            </div>
        )
    }

    onSearchRadioClicked = (evnt) => {
        console.log("evnt.target.value: " + evnt.target.value, "this.state.searchWord: " + this.state.searchWord)
        const newSearchBy = evnt.target.value
        const filteredUsers = this.filterUsersBy(this.state.searchWord, newSearchBy)
        this.setState({updatedUsersToRender: filteredUsers, searchBy: newSearchBy})
    }

    renderTableSearch() {
        console.log("this.state.searchBy: " + this.state.searchBy)
        return (
            <div>
                <input type="radio" id="name" name="filter-by" value="fullName"
                       onChange={(evnt) => this.onSearchRadioClicked(evnt)} checked={this.state.searchBy === "fullName"}/>
                <label htmlFor="name">Name</label>
                <input type="radio" id="email" name="filter-by" value="email"
                       onChange={(evnt) => this.onSearchRadioClicked(evnt)} checked={this.state.searchBy === "email"}/>
                <label htmlFor="email">Email</label>
                <input type="radio" id="age" name="filter-by" value="age"
                       onChange={(evnt) => this.onSearchRadioClicked(evnt)} checked={this.state.searchBy === "age"}/>
                <label htmlFor="age">Age</label>
                
                <input type="text" onChange={(evnt) => this.onSearchWordChange(evnt)}/>
            </div>
        )
    }

    getPageButton = (dir) => {
        return dir === "next" ?
            <input type="button" name="Next page" value="NextPage"
                   onClick={this.onSetNextPage}/> :
            <input type="button" name="Previous page" value="Previous page"
                   onClick={this.onSetPrevPage}/>
    }

    renderTablePagination() {
        return (
            <div className="pagination-buttons">

                {(this.currentPage > 1) ? (
                        <div>
                            {this.getPageButton("prev")}
                            {this.getPageButton("next")}
                        </div>
                    ) :
                    (<div>
                        {this.getPageButton("next")}
                    </div>)}
                <div className="currPage">-{this.currentPage}-</div>
            </div>
        )
    }
}

export default UsersTable