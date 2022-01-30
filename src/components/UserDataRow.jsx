import React, {Component} from "react"

class UserDataRow extends Component {

    constructor(props) {
        super(props);
        this.onUserDataRowClicked = props.onUserDataRowClicked
        this.state = {
            gender: props.userData.gender,
            fullName: props.userData.fullName,
            email: props.userData.email,
            age: props.userData.age,
            pictureUrl: props.userData.pictureUrl,
            location: props.userData.location,
            pageNum: props.userData.pageNum
        }
    }


    render() {
        const {gender, fullName, email, age, pictureUrl} = this.state
        return (
            <tr onClick={() => this.onUserDataRowClicked(this.state)}>
                <td>{gender}</td>
                <td>{fullName}</td>
                <td>{email}</td>
                <td>{age}</td>
                <td><img className="profilePic" src={pictureUrl}/></td>
            </tr>
        )
    }
}

export default UserDataRow;