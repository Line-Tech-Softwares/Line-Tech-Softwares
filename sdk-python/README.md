# Line Tech SDK for Python

Official Python SDK for Line Tech Softwares API.

## Installation

```bash
pip install linetec h-sdk
```

## Usage

```python
from linetec h_sdk import LineTechAPI

# Initialize the API client
api = LineTechAPI('YOUR_API_KEY')

# Get all users
users = api.get_users()
print(users)

# Create a new user
new_user = api.create_user({
    'name': 'John Doe',
    'email': 'john@example.com',
    'role': 'developer'
})
print(new_user)

# Get all projects
projects = api.get_projects()
print(projects)

# Create a new project
new_project = api.create_project({
    'name': 'My Awesome Project',
    'description': 'A description of the project',
    'technologies': ['React', 'Node.js', 'MongoDB']
})
print(new_project)
```

## Authentication

The SDK handles authentication automatically. Just provide your API key when initializing:

```python
api = LineTechAPI('your-api-key-here')
```

## Error Handling

The SDK raises exceptions for API errors:

```python
try:
    users = api.get_users()
except Exception as e:
    print(f"Error: {e}")
```

## Development

To set up the development environment:

```bash
git clone https://github.com/linetechsoftwares/linetech-sdk-python.git
cd linetec h-sdk-python
pip install -e .[dev]
```

Run tests:

```bash
pytest
```

## License

MIT License - see LICENSE file for details.