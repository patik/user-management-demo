import React, { Component } from 'react';
import { Button, List, ListItem, ListItemContent, ListItemAction } from 'react-mdl';
import { Link } from 'react-router';
import GroupAdd from './GroupAdd';
import Storage  from '../utilities/Storage';
import DemoData from '../utilities/DemoData';

export class GroupList extends Component {
    constructor (props) {
        super(props);

        // Bind internal methods
        this._addNew = this._addNew.bind(this);
        this._delete = this._delete.bind(this);
        this._loadDemoData = this._loadDemoData.bind(this);

        this.state = {
            groupList: window.DataStore.getGroupList(),
        };
    }

    _addNew (group) {
        // Add to data Storage
        window.DataStore.addGroup(group);

        // Add to state
        this.setState({
            groupList: window.DataStore.getGroupList(),
        });
    }

    _delete (evt) {
        // Get the button element
        let button = evt.target.nodeName === 'SPAN' ? evt.target.parentNode : evt.target;

        // Get group ID from data attribute (I know there are better ways to pass this...)
        let groupId = button.getAttribute('data-id');

        // Don't follow the `<Link>`
        evt.preventDefault();

        // Remove the group and update the state
        this.setState({
            groupList: window.DataStore.deleteGroup(groupId),
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
            groupList: window.DataStore.getGroupList(),
        });
    }

    render () {
        let noGroupsElem;
        let loadDemoElem;

        // Sections that only render when there are no users
        if (!this.state.groupList.length) {
            noGroupsElem = (
                <div className="grid-row">
                    <div className="grid-col">
                        <strong>No groups</strong>
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
                        <GroupAdd addNew={this._addNew} />
                    </div>
                </div>

                {noGroupsElem}

                {loadDemoElem}

                <List>
                    {this.state.groupList.map((group, g) => {
                        let numUsers = window.DataStore.getUsersByGroup(group.id).length;
                        let deleteButton = '';
                        let subtitleText = 'No users';

                        // Group is empty, can be deleted
                        if (numUsers < 1) {
                            deleteButton = (
                                <ListItemAction>
                                    <Button
                                        onClick={(evt) => {this._delete(evt)}}
                                        data-id={group.id}
                                        colored
                                        ripple
                                    >
                                        Delete
                                    </Button>
                                </ListItemAction>
                            );
                        }
                        else {
                            subtitleText = 'Contains ' + numUsers + ' user' + (numUsers === 1 ? '' : 's');
                        }

                        return (
                            <ListItem twoLine key={g}>
                                <ListItemContent subtitle={subtitleText}>
                                    <Link to={{pathname: '/group:' + group.id}}>
                                        {group.name}
                                    </Link>
                                </ListItemContent>
                                {deleteButton}
                            </ListItem>
                        );
                    })}
                </List>
            </div>
        );
    }
}
