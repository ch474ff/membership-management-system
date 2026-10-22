# Membership Management System

A web-based application for managing members and teams through a centralized dashboard. Built using React and Vite for the frontend and Ruby on Rails for the backend API.

## Demo Video
https://drive.google.com/file/d/1eqqGQTQt1y1SRg9_ShjyokcudUlfwhJj/view?usp=sharing

## Features

- **Dashboard:** Centralized navigation to the main sections of the application.
- **Member Management:** View, search, filter, and manage member records.
- **Team Management:** Access and organize team information.
- **Authentication:** Access the application through its authentication system.
- **Permission-Aware Actions:** Restrict operations according to configured permissions.
- **API Integration:** Connect the frontend and backend through API requests.
- **Modern Interface:** Dark theme with subtle violet accents and clear action buttons.

## Tech Stack

### Frontend
- React
- Vite
- Axios
- CSS

### Backend
- Ruby on Rails
- Rails API
- REST API architecture

### Development Tools
- Git
- GitHub
- Visual Studio Code
- WSL

## Design Philosophy

The application follows a modern dark-themed design focused on clarity, consistency, and usability.

### Visual Identity

- **Dark Glassmorphism:** Dark surfaces and layered cards create visual depth.
- **Violet Accents:** Violet highlights navigation states and interactive elements.
- **White Primary Buttons:** White buttons with dark text provide contrast against the dark background.
- **Semantic Action Colors:** Green identifies Edit actions, while red identifies Delete actions.
- **Subtle Borders and Shadows:** Lightweight visual effects distinguish content areas without unnecessary clutter.

### Layout and Interaction

- Card-based content sections help organize information.
- Consistent headings, spacing, and action placement improve navigation.
- Hover states provide feedback for interactive elements.
- Keyboard focus indicators help users identify focused controls.
- Disabled buttons use visual feedback to indicate their state.

### Design Goals

1. **Clarity:** Make information and actions easy to locate.
2. **Consistency:** Maintain predictable patterns across pages.
3. **Usability:** Keep common membership-management tasks straightforward.
4. **Visual Restraint:** Use colors and shadows purposefully.
5. **Maintainability:** Keep styles and components organized for future development.

## Project Structure

```text
membership-management-system/
├── backend/
│   ├── app/
│   ├── config/
│   ├── db/
│   └── ...
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── client.js
│   │   ├── App.css
│   │   └── ...
│   ├── package.json
│   └── ...
└── README.md
```

This is a simplified overview of the project structure.

## Prerequisites

Install the following tools before running the application:

- Ruby and RubyGems
- Bundler
- Ruby on Rails
- Node.js and npm
- The database required by the backend configuration
- Git

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd membership-management-system
```

If you already have the project locally, navigate to its root directory instead.

### 2. Start the Backend

```bash
cd backend
bundle install
bin/rails db:prepare
bin/rails server
```

The Rails server typically runs at:

`http://localhost:3000`

If database preparation fails, check the database configuration and required environment variables.

### 3. Start the Frontend

Open a second terminal from the project root:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite. It is typically:

`http://localhost:5173`

### 4. API Configuration

The frontend API client is located at:

`frontend/src/api/client.js`

Verify the API base URL in that file and ensure it matches the backend configuration.

If the frontend and backend use different origins, configure CORS and authentication settings appropriately.

## Usage

1. Start the backend server.
2. Start the frontend development server.
3. Open the frontend in your browser.
4. Log in using an account configured in the backend.
5. Navigate through the dashboard, member directory, and Teams section.
6. Use the features available to your account.

## Development Guidelines

- Keep API requests organized in appropriate client or service modules.
- Maintain compatibility between frontend requests and backend responses.
- Preserve authentication and authorization checks.
- Validate inputs on the backend.
- Keep passwords, API tokens, and other secrets out of version control.
- Test relevant functionality after making changes.
- Use focused Git commits with descriptive messages.

## Troubleshooting

### Backend fails to start
- Run `bundle install`.
- Check the database configuration.
- Verify required environment variables.
- Review the Rails error output.

### Frontend fails to start
- Run `npm install` inside `frontend`.
- Check your Node.js and npm installations.
- Review the Vite error output.

### API requests fail
- Verify that the backend is running.
- Check the API base URL.
- Inspect browser developer tools for network errors.
- Check CORS and authentication configuration.

## Future Improvements

Potential enhancements include:

- Additional dashboard statistics.
- Expanded search and filtering.
- More detailed reports.
- Automated frontend and backend tests.
- Additional API documentation.

These are potential enhancements, not claims about existing functionality.

## License

No license has been specified yet. Add a `LICENSE` file if you intend to distribute the project under a specific open-source license.

---

Built to provide an organized and maintainable approach to membership administration.
