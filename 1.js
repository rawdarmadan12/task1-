const fs = require('fs');

const usersFile = './users.json';


const readUsersFile = () => {
    if (!fs.existsSync(usersFile)) return [];
    const usersString = fs.readFileSync(usersFile, 'utf8') || '[]';
    return JSON.parse(usersString);
};


const writeUsersFile = (users) => {
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
};

const users = readUsersFile();
const [, , action] = process.argv;

const addUser = () => {
    const [,,, name, age, job] = process.argv;
    if (!name || !age || !job) {
        return console.log('You must provide a name, age, and job title.');
    }

    
    const maxId = users.length > 0 ? Math.max(...users.map(user => user.id)) : 0;
    const user = {
        id: maxId + 1, 
        name,
        age,
        job,
    };
    users.push(user);
    writeUsersFile(users);
    console.log('User added successfully:', user);
};

const readUsers = () => {
    const [,,, id] = process.argv;
    if (!id) {
        return console.log('Users:', users);
    }
    const user = users.find(user => user.id === Number(id));
    if (!user) {
        return console.log('User not found.');
    }
    console.log('User:', user);
};

const updateUser = () => {
    const [,,, id, name, job] = process.argv;
    if (!id || !name || !job) {
        return console.log('You must provide an id, new name, and new job title.');
    }
    const userIndex = users.findIndex(user => user.id === Number(id));
    if (userIndex === -1) {
        return console.log('User not found.');
    }
    users[userIndex].name = name;
    users[userIndex].job = job;
    writeUsersFile(users);
    console.log('User updated successfully:', users[userIndex]);
};

const deleteUser = () => {
    const [,,, id] = process.argv;
    if (!id) {
        return console.log('You must provide a user id to delete.');
    }
    const newUsers = users.filter(user => user.id !== Number(id));
    if (newUsers.length === users.length) {
        return console.log('User not found.');
    }
    writeUsersFile(newUsers);
    console.log('User deleted successfully.');
};

switch (action) {
    case 'add':
        addUser();
        break;
    case 'read':
        readUsers();
        break;
    case 'update':
        updateUser();
        break;
    case 'delete':
        deleteUser();
        break;
    default:
        throw new Error('Invalid input.');
}
