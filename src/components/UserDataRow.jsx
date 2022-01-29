import React, {Component} from "react"

class UserDataRow extends Component {

    constructor(props) {
        super(props);
        this.state = {
            gender: props.userData.gender,
            fullName: props.userData.fullName,
            email: props.userData.email,
            age: props.userData.age,
            pictureUrl: props.userData.pictureUrl,
            location: ''
        }
    }


    render() {
        const {gender, fullName, email, age, pictureUrl } = this.state
        return (
            <tr>
                <td>{gender}</td>
                <td>{fullName}</td>
                <td>{email}</td>
                <td>{age}</td>
                <td><img src={pictureUrl}/></td>
            </tr>
        )
    }
}

export default UserDataRow;