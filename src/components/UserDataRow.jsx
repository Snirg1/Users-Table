import React, {Component} from "react"

class UserDataRow extends Component {

    constructor(props) {
        super(props);
        this.state = {
            gender: props.userData.gender,
            firstName: props.userData.name.first,
            lastName: props.userData.name.last,
            fullName: props.userData.name.first.slice(0,1) + "." + props.userData.name.last,
            email: props.userData.email,
            age: props.userData.dob.age,
            pictureUrl: props.userData.picture.medium,
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