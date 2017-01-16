import React, { Component } from 'react';
import { Button, List, ListItem, ListItemContent, ListItemAction } from 'react-mdl';
import { Link } from 'react-router';
import UserAdd  from './UserAdd';
import Storage  from '../utilities/Storage';
import DemoData from '../utilities/DemoData';

export class UserList extends Component {
    constructor (props) {
        super(props);

        // Bind internal methods
        this._addNew = this._addNew.bind(this);
        this._loadDemoData = this._loadDemoData.bind(this);

        this.state = {
            userList: window.DataStore.getUserList(),
        };
    }

    _addNew (user) {
        // Add to data Storage
        window.DataStore.addUser(user);

        // Add to state
        this.setState({
            userList: window.DataStore.getUserList(),
        });
    }

    _delete (evt) {
        // Get the button element
        let button = evt.target.nodeName === 'SPAN' ? evt.target.parentNode : evt.target;

        // Get user ID from data attribute (I know there are better ways to pass this...)
        let userId = button.getAttribute('data-id');

        // Don't follow the `<Link>`
        evt.preventDefault();

        let newData = window.DataStore.deleteUser(userId);

        // Remove the user and update the state
        this.setState({
            userList: newData,
        });
    }

    _loadDemoData (evt) {
        // Get the button element
        let button = evt.target.nodeName === 'SPAN' ? evt.target.parentNode : evt.target;

        window.DataStore = new Storage(DemoData);
        window.DataStore.updateLocalStorage();

        // Remove the button
        button.parentNode.removeChild(button);

        this.setState({
            userList: window.DataStore.getUserList(),
        });
    }

    render () {
        let addNewUserElem;
        let noUsersElem;
        let loadDemoElem;

        // Only show the "add user" input if at least one group exists
        if (window.DataStore.getGroupList().length) {
            addNewUserElem = (
                <UserAdd addNew={this._addNew} />
            );
        }
        else {
            addNewUserElem = (
                <p><em>You must have at least one group before you can add new users</em></p>
            );
        }

        // Sections that only render when there are no users
        if (!this.state.userList.length) {
            noUsersElem = (
                <div className="grid-row">
                    <div className="grid-col">
                        <strong>No users</strong>
                    </div>
                </div>
            );

            loadDemoElem = (
                <div className="grid-row">
                    <div className="grid-col">
                        <Button
                            onClick={(evt) => {this._loadDemoData(evt)}}
                            ripple
                            colored
                        >
                            Load Demo Data
                        </Button>
                    </div>
                </div>
            );
        }

        return (
            <div>
                <div className="grid-row">
                    <div className="grid-col" style={{ margin: '16px auto' }}>
                        {addNewUserElem}
                    </div>
                </div>

                {noUsersElem}

                {loadDemoElem}

                <List>
                    {this.state.userList.map((user, u) => {
                        let groupButtonText;

                        // No groups
                        if (user.groups.length === 0) {
                            groupButtonText = 'Not in any groups yet';
                        }
                        else {
                            groupButtonText = 'Member of ' + user.groups.length + ' group';

                            // Correct grammar for multiple groups
                            if (user.groups.length > 1) {
                                groupButtonText += 's';
                            }
                        }

                        return (
                            <ListItem twoLine key={u}>
                                <ListItemContent subtitle={groupButtonText}>
                                    <Link to={{pathname: '/user:' + user.id}}>
                                        {user.name}
                                    </Link>
                                </ListItemContent>
                                <ListItemAction>
                                    <Button
                                        onClick={(evt) => {this._delete(evt)}}
                                        data-id={user.id}
                                        colored
                                        ripple
                                    >
                                        Delete
                                    </Button>
                                </ListItemAction>
                            </ListItem>
                        );
                    })}
                </List>
            </div>
        );
    }
}
