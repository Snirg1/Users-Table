import React, {Component} from 'react';
import GoogleMapReact from 'google-map-react';

class userDetails extends Component {

    constructor(props) {
        super(props);
        const location = {
            lat: parseFloat(props.userData.location.coordinates.latitude),
            lng: parseFloat(props.userData.location.coordinates.longitude),
        }

        this.state = {
            gender: props.userData.gender,
            fullName: props.userData.fullName,
            email: props.userData.email,
            age: props.userData.age,
            pictureUrl: props.userData.pictureUrl,
            location: location
        }
    }

    render() {
        return (
            <div>
                <h2>User Details Page</h2>
                <ul>
                    <li>{this.state.fullName}</li>
                    <li>{this.state.gender}</li>
                    <li>{this.state.fullName}</li>
                    <li>{this.state.email}</li>
                    <li>{this.state.age}</li>
                    <li><img className="profilePic" src={this.state.pictureUrl}/></li>
                </ul>

                <div style={{width: '100%', height: '400px'}}>
                    <GoogleMapReact
                        bootstrapURLKeys={{key: 'AIzaSyD8vJ4r7Ybqx4OhzfTfCaMeuUKPjrAPM0E'}}
                        center={[this.state.location.lat,this.state.location.lng]}
                        defaultZoom={60}
                    >
                        <span lat={this.state.location.lat}
                              lng={this.state.location.lng} className="dot"/>
                    </GoogleMapReact>
                </div>
            </div>
        );
    }
}

export default userDetails;


