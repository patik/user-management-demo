import React, { Component } from 'react';
import { List, ListItem, ListItemContent, Button } from 'react-mdl';
import { Link } from 'react-router';
import Storage from '../utilities/Storage';

// Displays a single user's details
class User extends Component {
    constructor (props) {
        super(props);

        // Bind internal methods
        this._delete = this._delete.bind(this);
        this._addToGroup = this._addToGroup.bind(this);
        this._removeFromGroup = this._removeFromGroup.bind(this);

        let userId = props.data.params.id.replace(/^\:/, '').toLowerCase();

        this.state = window.DataStore.getUser(userId);
    }

    _delete (evt) {
        // Get the button element
        let button = evt.target.nodeName === 'SPAN' ? evt.target.parentNode : evt.target;

        // Get user ID from data attribute (I know there are better ways to pass this...)
        let userId = button.getAttribute('data-id');

        // Don't follow the `<Link>`
        evt.preventDefault();

        window.DataStore.deleteUser(userId);

        // Remove the user and update the state
        this.setState(window.DataStore.getUser());

        // Go back to the home page since there's nothing more to do here
        window.location.hash = '/';
    }

    _addToGroup (evt) {
        // Get the button element
        let button = evt.target.nodeName === 'SPAN' ? evt.target.parentNode : evt.target;

        // Get group ID from data attribute (I know there are better ways to pass this...)
        let groupId = button.getAttribute('data-id');

        // Don't follow the `<Link>`
        evt.preventDefault();

        // Add the group (which will update the store) and update the state
        this.setState({
            groups: window.DataStore.addUserToGroup(this.state.id, groupId).groups,
        });
    }

    _removeFromGroup (evt) {
        // Get the button element
        let button = evt.target.nodeName === 'SPAN' ? evt.target.parentNode : evt.target;

        // Get group ID from data attribute (I know there are better ways to pass this...)
        let groupId = button.getAttribute('data-id');

        // Don't follow the `<Link>`
        evt.preventDefault();

        // Add the group (which will update the store) and update the state
        this.setState({
            groups: window.DataStore.removeUserFromGroup(this.state.id, groupId).groups,
        });
    }

    render () {
        // Groups the user is already in
        let listOfMemberGroups = window.DataStore.getGroupsByUser(this.state.id);

        // Groups the user is not yet in
        let listOfOtherGroups = window.DataStore.getGroupList().filter(group => {
            return (this.state.groups.indexOf(group.id) === -1);
        });

        return (
            <div>
                <h3>User: {this.state.name}</h3>

                {/* List of groups this user is a member of */}
                {
                    listOfMemberGroups.length === 0
                        ?
                            <div>
                                <p><em>Not a member of any group</em></p>
                            </div>
                        :
                            <div>
                                <h4>Current groups</h4>
                                <List>
                                    {listOfMemberGroups.map((group, g) => {
                                        return (
                                            <ListItem key={g}>
                                                <ListItemContent>
                                                    <Link to={{pathname: '/group:' + group.id}}>
                                                        {group.name}
                                                    </Link>
                                                    <Button
                                                        onClick={(evt) => {this._removeFromGroup(evt)}}
                                                        data-id={group.id}
                                                        colored
                                                        ripple
                                                    >
                                                        Remove
                                                    </Button>
                                                </ListItemContent>
                                            </ListItem>
                                        );
                                    })}
                                </List>
                            </div>
                }

                {/* List of other groups this user could join */}
                {
                    listOfOtherGroups.length === 0
                        ?
                            null
                        :
                            <div>
                                <h4>Add to group</h4>
                                <List>
                                    {listOfOtherGroups.map((group, g) => {
                                        return (
                                            <Button
                                                key={g}
                                                onClick={(evt) => {this._addToGroup(evt)}}
                                                data-id={group.id}
                                                colored
                                                ripple
                                            >
                                                {group.name}
                                            </Button>
                                        );
                                    })}
                                </List>
                            </div>
                }

                {/* Global actions (i.e. delete user) */}
                <div>
                    <h4>Other actions</h4>
                    <Button
                        onClick={(evt) => {this._delete(evt)}}
                        data-id={this.state.id}
                        colored={true}
                        raised={true}
                        ripple={true}
                    >
                        Delete user
                    </Button>
                </div>
            </div>
        );
    }
}

export default (props) => (
    <User data={props} />
)
