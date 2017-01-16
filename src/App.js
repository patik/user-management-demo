// Vendor libs
import React, { Component } from 'react';
import { HashRouter, Match, Link } from 'react-router';
import { Layout, Header, Content } from 'react-mdl';

// App pages
import SectionToggle from './components/SectionToggle';
import UserDetail from './components/UserDetail';
import GroupDetail from './components/GroupDetail';

// Storage module that manages our users and groups
import Storage from './utilities/Storage.js';

// Find data to load
(function () {
    let data;

    // Look for previous data store in `localStorage`
    if (window.localStorage && window.localStorage.getItem('userMgmtData')) {
        data = JSON.parse(window.localStorage.getItem('userMgmtData'));
    }
    // Fall back to an empty list
    else {
        data = {
            userList: [],
            groupList: [],
        };
    }

    // Create a `Storage` instance using the data

    // I know this next line is one of the most egregious offenses a developer can make, and I feel awful about it, but I didn't have time within the 4-hour limit to debug some issues I had with propagating changes to all components:
    window.DataStore = new Storage(data);
    // I feel ashamed and embarrassed about that. I'm sure with more time I could avoid using a global.
}());

export default () => (
    <HashRouter>
        <Layout fixedHeader>
            <Header>
                <Link to="/">
                    <span className="mdl-layout-title header-link">User Management</span>
                </Link>
            </Header>
            <Content>
                <Match exactly pattern="/"         component={ SectionToggle }  />
                <Match exactly pattern="/user:id"  component={ UserDetail }  />
                <Match exactly pattern="/group:id" component={ GroupDetail } />
            </Content>
        </Layout>
    </HashRouter>
);
