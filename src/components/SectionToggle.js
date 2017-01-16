import React from 'react';
import { Layout, Header, Content, Tab, Tabs } from 'react-mdl';
import { UserList } from './UserList';
import { GroupList } from './GroupList';

export class SectionToggle extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            activeTab: 0,
        };
    }

    render () {
        let contents;

        // Determine which content to display based on the switch's current value
        if (this.state.activeTab === 0) {
            contents = <UserList />;
        }
        else if (this.state.activeTab === 1) {
            contents = <GroupList />;
        }

        return (
            <div>
                <Tabs
                    activeTab={this.state.activeTab}
                    onChange={(tabId) => this.setState({ activeTab: tabId })}
                    ripple
                >
                    <Tab>Users</Tab>
                    <Tab>Groups</Tab>
                </Tabs>
                {contents}
            </div>
        );
    }
}

export default () => (
    <SectionToggle />
);
