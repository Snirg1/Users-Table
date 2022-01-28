import React, {Component} from "react";

class UsersTable extends Component {

    constructor(props) {
        super(props);
        this.headersMap = {gender: "Gender", name: "Name", email: "Email", dob: "Age", picture: "Picture"}
        this.state = {
            users: [],
            isLoading: false,
            isError: false
        }
    }

    async componentDidMount() {
        this.setState({isLoading: true})
        const resText = await fetch("https://randomuser.me/api/?inc=gender,name,picture,location,dob,email&results=50&seed=abc");
        console.log(resText)
        const resJson = await resText.json();
        console.log(resJson)
        this.setState({users: resJson.results, isLoading: false});
    }

    sortUsersByColumn = (attr) => {
        console.log(attr)
        const newUsers = this.state.users.sort((userA, userB) => {
            return userA[attr] - userB[attr];
        })
        this.setState({users: newUsers});
    }

    renderTableHeader = () => {
        return Object.keys(this.state.users[0]).map(attr => {
                const header = this.headersMap[attr];
                if (header) {
                    return (<th key={attr} onClick={() => this.sortUsersByColumn(attr)}>{header} </th>)
                } else
                    return null
            }
        )
    }

    renderTableRows = () => {
        return this.state.users.map(user => {
            return (
                <tr>
                    <td>{user.gender}</td>
                    <td>{user.name.first}</td>
                    <td>{user.email}</td>
                    <td>{user.dob.age}</td>
                    <td><img src={user.picture.medium}/></td>
                </tr>
            )
        })
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