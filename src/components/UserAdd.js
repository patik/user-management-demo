import React, { Component } from 'react';
import { Textfield, Button } from 'react-mdl';

class UserAdd extends Component {
    constructor (props) {
        super(props);

        // Bind internal methods
        this._getDefaultState = this._getDefaultState.bind(this);
        this._onChangeName = this._onChangeName.bind(this);
        this._onClickAddNew = this._onClickAddNew.bind(this);

        this.state = this._getDefaultState();
    }

    _getDefaultState () {
        // Standard user object
        let user = window.DataStore.getUser();

        // Add place to hold error message
        user.error = '';

        return user;
    }

    // User types a name
    _onChangeName (evt) {
        let name = evt.target.value;
        let id = name.trim().replace(/\W/g, '').toLowerCase();
        let newState = {
            id: id,
            name: name,
        };

        // Validation:

        // User entered something without any letters
        if (name && (!id || /^\d+$/.test(name))) {
            newState.error = 'Name must contain at least one letter';
        }
        // Name is valid, clear existing error
        else if (this.state.error) {
            newState.error = '';
        }

        this.setState(newState);
    }

    // Send new user to parent component where it will be stored
    _onClickAddNew (evt) {
        let name = this.state.name.trim();

        // Ignore if there are known errors (they'll be shown on the text input so we don't need to display anything here)
        if (this.state.error) {
            return;
        }

        // Make sure something was entered
        if (!name || !this.state.id) {
            this.setState({
                error: 'You must enter a valid name first',
            });

            return;
        }

        // Everything's fine, so add the name to the data storage via the parent component
        this.props.props.addNew({
            name: name,
            id: this.state.id,
            groups: this.state.groups,
        });

        // Clear the state so another name can be added
        this.state = this._getDefaultState();
    }

    render () {
        return (
            <div>
                <Textfield
                    label='Add new user'
                    onChange={this._onChangeName}
                    value={this.state.name}
                    error={this.state.error}
                    style={{width: '200px'}}
                    floatingLabel
                />
                <Button onClick={this._onClickAddNew} raised accent ripple>Add</Button>
            </div>
        );
    }
}

export default (props) => (
    <UserAdd props={props} />
);
