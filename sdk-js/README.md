# Line Tech SDK for JavaScript

Official JavaScript SDK for Line Tech Softwares API.

## Installation

```bash
npm install linetec h-sdk
```

## Usage

```javascript
import { LineTechAPI } from 'linetech-sdk';

const api = new LineTechAPI('YOUR_API_KEY');

// Get all users
const users = await api.getUsers();
console.log(users);

// Create a new user
const newUser = await api.createUser({
  name: 'John Doe',
  email: 'john@example.com',
  role: 'developer'
});
console.log(newUser);

// Get all projects
const projects = await api.getProjects();
console.log(projects);

// Create a new project
const newProject = await api.createProject({
  name: 'My Awesome Project',
  description: 'A description of the project',
  technologies: ['React', 'Node.js', 'MongoDB']
});
console.log(newProject);
```

## Authentication

```javascript
// Authenticate with email/password
const authResponse = await api.authenticate('user@example.com', 'password');
console.log(authResponse.token);

// Or set API key directly
api.setApiKey('your-new-api-key');
```

## Error Handling

```javascript
try {
  const users = await api.getUsers();
} catch (error) {
  console.error('API Error:', error.message);
}
```

## API Methods

### Users
- `getUsers()` - Get all users
- `createUser(userData)` - Create a new user

### Projects
- `getProjects()` - Get all projects
- `createProject(projectData)` - Create a new project

### Authentication
- `authenticate(email, password)` - Login and get token
- `setApiKey(apiKey)` - Set new API key

### Utilities
- `getHealth()` - Check API health

## Development

```bash
git clone https://github.com/linetechsoftwares/linetech-sdk-js.git
cd linetec h-sdk-js
npm install
npm test
npm run build
```

## License

MIT License