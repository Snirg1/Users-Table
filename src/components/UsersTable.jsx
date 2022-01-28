import React, {Component} from "react";
import UserDataRow from "./UserDataRow"

class UsersTable extends Component {

    constructor(props) {
        super(props);
        this.headersMap = {
            gender: "Gender", fullName: "Full name", email: "Email", age: "Age", pictureUrl: "Picture"
        }
        this.state = {
            updatedUsersToRender: [],
            users: [],
            isLoading: false,
            isError: false,
            sortBy: "email",
            isAsc: true,
            searchWord: ""
        }
    }

    async componentDidMount() {
        this.setState({isLoading: true})
        try {
            const resText = await fetch("https://randomuser.me/api/?inc=gender,name,picture,location,dob,email&results=50&seed=abc");
            const resJson = await resText.json();
            const usersObjects = resJson.results.map((userRawData, index) => {
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
            this.setState({users: usersObjects, updatedUsersToRender: usersObjects, isLoading: false});
        } catch (error) {
            //TODO: handle error
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
        const newUsers = this.state.updatedUsersToRender.map((user, index) => {
            return (
                <UserDataRow key={"userDataRow_" + user.age + "_" + index} userData={user}/>
                // we add the user.age to distinct between each component's key
            )
        });
        return newUsers;
    }

    filterUsersByEmail = (evnt) => {
        const updatedSearchWord = evnt.target.value
        const filteredUsers = this.state.users.filter((userData) => {
            return (userData.email.includes(updatedSearchWord))
        })
        this.setState({updatedUsersToRender: filteredUsers, searchWord: updatedSearchWord})
    }
    // TODO: Build a general filter function that gets as arg - attr


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
                <input type="text" onChange={(evnt) => this.filterUsersByEmail(evnt)}/>
                {(updatedUsersToRender.length > 0)
                    ? (
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
                    )
                    : (<div>No Users</div>)}
            </div>
        )
    }
}

export default UsersTable