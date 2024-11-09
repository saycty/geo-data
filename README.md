# Geo-Data App

## **Overview**

GeoMap is a web application that provides a user authentication and management system, along with a geographic mapping feature using Mapbox API. The application allows users to register, login, and manage their account details, while also providing an interactive map to display location-based information.

## **Key Features**

- **User Authentication and Management**:
  - User registration with email and password
  - User login with email and password
  - Retrieval of user details (e.g. name, email, etc.)
  - Authentication and authorization using JSON Web Tokens (JWT)
- **Geographic Mapping**:
  - Interactive map rendering using Mapbox API
  - Display of location-based information (e.g. markers, polygons, etc.)

## **API Endpoints**

The application provides the following API endpoints:

- **Register User**: `/users/register`
- **Login User**: `/users/login`
- **Get User Details**: `/users/`

## **Mapbox Integration**

The application uses the Mapbox API to render interactive maps and display location-based information. The Mapbox component is implemented in the `Mapbox.jsx` file..

## Getting Started

Follow these instructions to set up and run both the frontend and backend of the application.

### Prerequisites

_- [Node.js](https://nodejs.org/)_

_- [npm](https://www.npmjs.com/)_

### Running the Application

1. **Clone the repository:**

   ```bash
   git clone https://github.com/saycty/geo.git
   ```

2. **Install dependencies for both frontend and backend:**

   - Frontend:
     ```bash
     cd frontend
     npm install
     ```
   - Backend:
     ```bash
     cd backend
     npm install
     ```

3. **Start the application:**
   - Frontend:
     ```bash
     cd frontend
     npm start
     ```
   - Backend:
     ```bash
     cd backend
     npm run dev  # For development
     npm start    # For production
     ```

### Environment Variables

- Create a `.env` file in the backend directory and add the following:

```bash
MONGO_URL=your_database_url

JWT_SECRET_KEY=your_jwt_secret_key

PORT=8000
```

## Application Features

- **File Upload and Map Preview**: Users can upload GeoJSON files, which are then previewed using Mapbox.
- **Map Interactions**:
- **Draw Shapes**: Users can draw custom shapes directly on the map.
- **Marker Management**: Add, move, and delete markers on the map for easy data annotation.
- **Distance Calculation**: Measure distances between points on the map in both kilometers and miles.

### Planned Features and Improvements

- **Reusable Components**: Centralize reusable components in the frontend to ensure consistency and efficiency. This can be managed via an interceptor for better control and organization.

## Improvement Pointers

Suggestions to enhance the codebase and functionality:

1. **Pagination**

- Implement pagination for tables on the dashboard to manage data display more efficiently.

2. **Data Actions**

- Add options to delete or edit entries directly from the dashboard screen, using a popup for a smoother user experience.

3. **State Management**

- Use a more robust state management system (e.g., Redux or MobX) to improve data handling and synchronization across components.

4. **Data Caching**

- Implement caching for frequently accessed data, reducing load times and server requests.

5. **Secure Authentication**

- Consider implementing OAuth or JWT for a more secure and scalable authentication system.

6. **Code Quality**

- Improve code organization and modularity by separating concerns and following a standardized project structure.
- Use a linter and code formatter (e.g., ESLint and Prettier) to maintain code consistency and quality.

7. **Enhanced User Experience**

- Add loading animations and other user feedback mechanisms to create a smooth and engaging user experience.

## Flow Improvement

Ideas to improve data flow and component interaction in the project:

- **Data Fetching**: Consider using GraphQL or RESTful APIs to make data fetching more efficient and adaptable.
- **Routing**: Implement a more robust routing system (e.g., React Router, Next.js) for better navigation and dynamic page loading.
- **File Uploads**: Improve the file upload system to support multi-file uploads, with added security and efficiency.

## Options for Enhanced User Experience

- **Dashboard Enhancements**
- Add search, sorting, and filtering options to the dashboard to allow users to interact with data more easily.
- Enable edit and delete options on the dashboard using a popup, keeping the interface uncluttered.

## Centralizing Reusable Components

1. **Component Structure**

- Create a `components` directory for all reusable UI components, making them easily accessible and maintainable.

2. **Interceptors**

- Use an interceptor to centralize common tasks such as:
  - **Authentication**: Ensure secure access and session handling.
  - **Error Handling**: Centralize error logging and handling for consistent feedback.
  - **Data Caching**: Manage data caching to improve load times and reduce redundancy.

## Contributing

If you'd like to contribute, please fork this repository and submit a pull request. You can also report issues or contact me at sayanchakrabortty3@gmail.com.
