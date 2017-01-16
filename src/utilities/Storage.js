export default class Storage {
    constructor (data) {
        this.userList = data.userList || [];
        this.groupList = data.groupList || [];
    }

    // Save data to disk
    updateLocalStorage () {
        try {
            window.localStorage.setItem(
                'userMgmtData',
                JSON.stringify({
                    userList: this.userList,
                    groupList: this.groupList,
                })
            );
        }
        catch (e) { }
    }

    ///////////
    // Users //
    ///////////

    getUser (userId) {
        let returnVal = {id: '', name: '', groups: []};

        this.userList.some(user => {
            if (user.id === userId) {
                returnVal = user;

                // Break the loop
                return true;
            }

            return false;
        });

        return returnVal;
    }

    addUser (user) {
        this.userList.unshift(user);

        this.updateLocalStorage();

        // Return the updated list
        return this.userList;
    }

    getUserList () {
        return this.userList;
    }

    // Get all users belonging to a particular group
    getUsersByGroup (groupId) {
        let returnVal = [];

        // Find the group
        this.groupList.some(group => {
            if (group.id === groupId) {
                // Find all users who list this group
                this.userList.map(user => {
                    if (user.groups.indexOf(groupId) !== -1) {
                        returnVal.push(user);
                    }
                });

                return true;
            }

            return false;
        });

        return returnVal;
    }

    addUserToGroup (userId, groupId) {
        let updatedUser = this.getUser(userId);

        updatedUser.groups.unshift(groupId);

        // Update the store
        let index = -1;

        this.userList.some((user, u) => {
            if (user.id === updatedUser.id) {
                index = u;

                return true;
            }

            return false;
        });

        if (index !== -1) {
            this.userList[index] = updatedUser;

            this.updateLocalStorage();
        }

        return updatedUser;
    }

    removeUserFromGroup (userId, groupId) {
        let updatedUser = this.getUser(userId);

        updatedUser.groups = updatedUser.groups.filter(group => {
            return group !== groupId;
        });

        // Update the store
        let index = -1;

        this.userList.some((user, u) => {
            if (user.id === updatedUser.id) {
                index = u;

                return true;
            }

            return false;
        });

        if (index !== -1) {
            this.userList[index] = updatedUser;

            this.updateLocalStorage();
        }

        return updatedUser;
    }

    deleteUser (userId) {
        // Remove the user from all groups

        this.userList = this.userList.filter(user => {
            // Return all users except the target one
            return user.id !== userId;
        });

        this.updateLocalStorage();

        return this.userList;
    }


    ////////////
    // Groups //
    ////////////

    getGroup (groupId) {
        let returnVal = {id: '', name: ''};

        this.groupList.some(group => {
            if (group.id === groupId) {
                returnVal = group;

                return true;
            }

            return false;
        });

        return returnVal;
    }

    addGroup (group) {
        this.groupList.unshift(group);

        this.updateLocalStorage();

        // Return the updated list
        return this.groupList;
    }

    getGroupList () {
        return this.groupList;
    }

    // Get all groups that a particular user belongs to
    getGroupsByUser (userId) {
        let returnVal = [];

        this.userList.some(user => {
            if (user.id === userId) {
                returnVal = user.groups.map(this.getGroup.bind(this));

                return true;
            }

            return false;
        });

        return returnVal;
    }

    deleteGroup (groupId) {
        this.groupList = this.groupList.filter(group => {
            // Return all groups except the target one
            return group.id !== groupId;
        });

        this.updateLocalStorage();

        return this.groupList;
    }
}
