import React, { Component } from 'react';
import { List, ListItem, ListItemContent, Button } from 'react-mdl';
import { Link } from 'react-router';
import Storage from '../utilities/Storage';

// Displays a single group's details
class Group extends Component {
    constructor (props) {
        super(props);

        // Bind internal methods
        this._delete = this._delete.bind(this);
        this._addToGroup = this._addToGroup.bind(this);
        this._removeFromGroup = this._removeFromGroup.bind(this);

        let groupId = props.data.params.id.replace(/^\:/, '').toLowerCase();

        this.state = window.DataStore.getGroup(groupId);
    }

    _delete (evt) {
        // Get the button element
        let button = evt.target.nodeName === 'SPAN' ? evt.target.parentNode : evt.target;

        // Get group ID from data attribute (I know there are better ways to pass this...)
        let groupId = button.getAttribute('data-id');

        // Don't follow the `<Link>`
        evt.preventDefault();

        window.DataStore.deleteGroup(groupId);

        // Remove the group and update the state
        this.setState(window.DataStore.getGroup());

        // Go back to the home page since there's nothing more to do here
        window.location.hash = '/';
    }

    _addToGroup (evt) {
        // Get the button element
        let button = evt.target.nodeName === 'SPAN' ? evt.target.parentNode : evt.target;

        // Get group ID from data attribute (I know there are better ways to pass this...)
        let userId = button.getAttribute('data-id');

        // Don't follow the `<Link>`
        evt.preventDefault();

        // Add the group (which will update the store) and update the state
        window.DataStore.addUserToGroup(userId, this.state.id);

        // Update the state
        this.setState(window.DataStore.getGroup(this.state.id));
    }

    _removeFromGroup (evt) {
        // Get the button element
        let button = evt.target.nodeName === 'SPAN' ? evt.target.parentNode : evt.target;

        // Get group ID from data attribute (I know there are better ways to pass this...)
        let userId = button.getAttribute('data-id');

        // Don't follow the `<Link>`
        evt.preventDefault();

        // Add the group (which will update the store)
        window.DataStore.removeUserFromGroup(userId, this.state.id);

        // Update the state
        this.setState(window.DataStore.getGroup(this.state.id));
    }

    render () {
        // Users already in this group
        let listOfMembers = window.DataStore.getUsersByGroup(this.state.id);

        // Other users not yet in this group
        let listOfOtherUsers = window.DataStore.getUserList().filter(user => {
            return (user.groups.indexOf(this.state.id) === -1);
        });

        return (
            <div>
                <h3>Group: {this.state.name}</h3>

                {/* List of users in this group */}
                {
                    listOfMembers.length === 0
                        ?
                            <p><em>No members</em></p>
                        :
                            <div>
                                <h4>Current users</h4>
                                <List>
                                    {listOfMembers.map((user, u) => {
                                        // Find number of groups this user is in
                                        let usersOtherGroups = window.DataStore.getGroupsByUser(user.id).filter(group => {
                                            return group.name !== this.state.name;
                                        });

                                        let listItemAttributes = {
                                            twoLine: false,
                                        };

                                        let listItemContentAttributes = {
                                            subtitle: '',
                                        };

                                        // Describe how many other groups the user is in
                                        if (usersOtherGroups.length) {
                                            listItemAttributes.twoLine = true;
                                            listItemContentAttributes.subtitle =
                                                'Also a member of: ' +
                                                (
                                                    // Extract the names of the remaining groups
                                                    usersOtherGroups.map(group => {
                                                        return group.name;
                                                    })
                                                    .join(', ')
                                                );
                                        }

                                        return (
                                            <ListItem key={u} {...listItemAttributes}>
                                                <ListItemContent {...listItemContentAttributes}>
                                                    <Link to={{pathname: '/user:' + user.id}}>
                                                        {user.name}
                                                    </Link>
                                                    <Button
                                                        onClick={(evt) => {this._removeFromGroup(evt)}}
                                                        data-id={user.id}
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

                {/* List of other users who could could join this group */}
                {
                    listOfOtherUsers.length === 0
                        ?
                            null
                        :
                            <div>
                                <h4>Add users</h4>
                                <List>
                                    {listOfOtherUsers.map((user, u) => {
                                        return (
                                            <Button
                                                key={u}
                                                onClick={(evt) => {this._addToGroup(evt)}}
                                                data-id={user.id}
                                                colored
                                                ripple
                                            >
                                                {user.name}
                                            </Button>
                                        );
                                    })}
                                </List>
                            </div>
                }

                {/* Global actions (i.e. delete group) */}
                {
                    listOfMembers.length === 0
                        ?
                            <div>
                                <h4>Other actions</h4>
                                <Button
                                    onClick={(evt) => {this._delete(evt)}}
                                    data-id={this.state.id}
                                    colored={true}
                                    raised={true}
                                    ripple={true}
                                >
                                    Delete group
                                </Button>
                            </div>
                        :
                            null
                }
            </div>
        );
    }
}

export default (props) => (
    <Group data={props} />
)
