import React, {Component} from "react";
import UserDataRow from "./UserDataRow"
class UsersTable extends Component {

    constructor(props) {
        super(props);
        this.headersMap = {gender: "Gender", fullName: "Full name", email: "Email", age: "Age", pictureUrl: "Picture"}
        this.state = {
            users: [],
            isLoading: false,
            isError: false,
            sortBy: "email",
            isAsc: true
        }
    }

    async componentDidMount() {
        this.setState({isLoading: true})
        const resText = await fetch("https://randomuser.me/api/?inc=gender,name,picture,location,dob,email&results=50&seed=abc");
        const resJson = await resText.json();
        const usersObjects = resJson.results.map( (userRawData, index) => {
            return (
                {
                    gender: userRawData.gender,
                    firstName: userRawData.name.first,
                    lastName: userRawData.name.last,
                    fullName: userRawData.name.first.slice(0,1) + "." + userRawData.name.last,
                    email: userRawData.email,
                    age: userRawData.dob.age,
                    pictureUrl: userRawData.picture.medium,
                    location: '',
                    key: "user_data_"+ index
                }
            )
        })
        this.setState({users: usersObjects, isLoading: false});
    }

    sortUsersByAttribute = (usersArray) => {

        return (
            [...usersArray].sort((userA, userB) => {
                const res = (userA[this.state.sortBy] < userB[this.state.sortBy]) ? -1 : ((userA[this.state.sortBy] > userB[this.state.sortBy]) ? 1 : 0)
                    const sign = this.state.isAsc? 1: -1;
                    return res * sign;
            })
        )
    }

    setSortBy = (attr) => {
        let isAsc = (attr == this.state.sortBy) ? (!this.state.isAsc) : true;
        this.setState({sortBy: attr, isAsc: isAsc});
    }


    renderTableHeader = () => {
        return Object.keys(this.state.users[0]).map(attr => {
                const header = this.headersMap[attr];
                if (header) {
                    return (<th key={attr} onClick={() => this.setSortBy(attr)}>{header} </th>)
                } else
                    return null
            }
        )
    }

    renderTableRows = () => {
        const newUsers = this.sortUsersByAttribute(this.state.users).map((user,index) => {
            return (
                // <UserDataRow key = {"userDataRow_"+ index } userData={user} />
                <tr>
                    <td>{user.gender}</td>
                    <td>{user.fullName}</td>
                    <td>{user.email}</td>
                    <td>{user.age}</td>
                    <td><img src={user.pictureUrl}/></td>
                </tr>
            )
        });
        console.log(newUsers.map((user) => user.props.userData));
        return newUsers;
    }

    render() {
        const {users, isLoading, isError} = this.state;

        if (isLoading) {
            return <div>Loading...</div>
        }
        if (isError) {
            return <div>Error...</div>
        }
        return ((users.length > 0)
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
                : (<div>No Users</div>)
        )
    }
}
export default UsersTable