"""
Line Tech API SDK for Python
"""

import requests
from typing import Dict, List, Optional, Any
from pydantic import BaseModel


class User(BaseModel):
    id: str
    name: str
    email: str
    role: str


class Project(BaseModel):
    id: str
    name: str
    description: Optional[str] = ""
    technologies: List[str] = []
    status: str = "active"


class LineTechAPI:
    """
    Line Tech API SDK for Python

    Args:
        api_key (str): Your API key for authentication
        base_url (str): Base URL for the API (default: https://api.linetechsoftwares.co.za/v1/)
    """

    def __init__(self, api_key: str, base_url: str = "https://api.linetechsoftwares.co.za/v1/"):
        self.api_key = api_key
        self.base_url = base_url.rstrip('/')
        self.session = requests.Session()
        self.session.headers.update({
            'Authorization': f'Bearer {self.api_key}',
            'Content-Type': 'application/json'
        })

    def _make_request(self, method: str, endpoint: str, data: Optional[Dict] = None) -> Dict[str, Any]:
        """Make a request to the API"""
        url = f"{self.base_url}{endpoint}"

        try:
            if method.upper() == 'GET':
                response = self.session.get(url)
            elif method.upper() == 'POST':
                response = self.session.post(url, json=data)
            else:
                raise ValueError(f"Unsupported HTTP method: {method}")

            response.raise_for_status()
            return response.json()

        except requests.exceptions.HTTPError as e:
            error_data = e.response.json() if e.response.content else {}
            error_message = error_data.get('error', str(e))
            raise Exception(f"API Error: {error_message}")
        except requests.exceptions.RequestException as e:
            raise Exception(f"Network Error: {str(e)}")

    def get_users(self) -> Dict[str, List[User]]:
        """
        Retrieve a list of users

        Returns:
            Dict containing users list
        """
        response = self._make_request('GET', '/users')
        # Convert to User objects
        users = [User(**user) for user in response.get('users', [])]
        return {'users': users}

    def create_user(self, user_data: Dict[str, Any]) -> User:
        """
        Create a new user

        Args:
            user_data (dict): User data with name, email, and optional role

        Returns:
            User: Created user object
        """
        response = self._make_request('POST', '/users', user_data)
        return User(**response)

    def get_projects(self) -> Dict[str, List[Project]]:
        """
        Get all projects

        Returns:
            Dict containing projects list
        """
        response = self._make_request('GET', '/projects')
        # Convert to Project objects
        projects = [Project(**project) for project in response.get('projects', [])]
        return {'projects': projects}

    def create_project(self, project_data: Dict[str, Any]) -> Project:
        """
        Create a new project

        Args:
            project_data (dict): Project data with name and optional description/technologies

        Returns:
            Project: Created project object
        """
        response = self._make_request('POST', '/projects', project_data)
        return Project(**response)

    def authenticate(self, email: str, password: str) -> Dict[str, Any]:
        """
        Authenticate and get access token

        Args:
            email (str): User email
            password (str): User password

        Returns:
            Dict: Authentication response with token and user data
        """
        response = self._make_request('POST', '/auth/login', {'email': email, 'password': password})
        # Update session with new token
        if 'token' in response:
            self.session.headers['Authorization'] = f'Bearer {response["token"]}'
        return response

    def set_api_key(self, api_key: str) -> None:
        """
        Set a new API key/token

        Args:
            api_key (str): New API key or token
        """
        self.api_key = api_key
        self.session.headers['Authorization'] = f'Bearer {api_key}'

    def get_health(self) -> Dict[str, Any]:
        """
        Get API health status

        Returns:
            Dict: Health check response
        """
        url = f"{self.base_url.replace('/v1', '')}/health"
        try:
            response = requests.get(url)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            raise Exception(f"Health check failed: {str(e)}")