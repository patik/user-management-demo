import Storage  from './Storage';
import DemoData from './DemoData';

describe('addUser', () => {
    let data = new Storage(DemoData);
    let originalCount = data.getUserList().length;

    // Add another user
    data.addUser({id: 'x', name: 'x', groups: []});

    it('should have 1 more than ' + originalCount + ' users', () => {
        expect(
            data.getUserList().length
        )
        .toBe(
            originalCount + 1
        );
    });
});

describe('removeUserFromGroup', () => {
    let data = new Storage(DemoData);

    // Remove a user from one of his two groups
    data = data.removeUserFromGroup('john', 'thebeatles');

    it('user should now have 1 group', () => {
        expect(
            data.groups.length
        )
        .toBe(1);
    });
});

describe('getUser', () => {
    let data = new Storage(DemoData);

    // We need to stringify JSON to satisfy the `===` operation used by Jest since no two `{}` objects are truly identical
    it('should return an empty user object', () => {
        expect(
            JSON.stringify(data.getUser())
        )
        .toBe(
            JSON.stringify({id: '', name: '', groups: []})
        );
    });
});
