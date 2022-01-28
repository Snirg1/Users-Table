import React, {Component} from 'react';
import UsersTable from "./UsersTable";
import "./table.css";

class App extends Component {

    render() {
        return (
            <div>
                <UsersTable />
            </div>
        );
    }
}

export default App;