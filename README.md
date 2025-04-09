# Code Editor and Compiler

A modern, feature-rich web application that provides a multi-language code editor and compiler environment. This application allows users to write, edit, and execute code in multiple programming languages directly in the browser.

![Code Editor Screenshot](https://via.placeholder.com/800x450.png?text=Code+Editor+Screenshot)

## Features

### Core Features
- **Multi-language Support**: Write and execute code in JavaScript, Java, Python, C, and C++
- **Advanced Code Editor**:
  - Syntax highlighting for all supported languages
  - Intelligent auto-completion
  - Line numbers and error indicators
  - Dark/light theme toggle
  - Code formatting capabilities
- **Code Execution**:
  - Real-time compilation and execution
  - Support for standard input (stdin)
  - Clear output console for stdout and stderr
- **User-friendly Interface**:
  - Responsive design that works on desktop and mobile devices
  - Intuitive layout with editor and output panels
  - Easy language selection

### Additional Features
- **Save/Load Functionality**: Save your code and return to it later
- **Security Measures**: Secure code execution with proper sandboxing
- **Downloadable Code**: Export your code as a file
- **Shareable Links**: Generate links to share your code with others
- **User Authentication**: Secure user authentication with Supabase
  - Email/password signup and login
  - Password reset functionality
  - Protected routes for authenticated users
  - User profile management

## Technology Stack

- **Frontend**:
  - Next.js 14 (React framework)
  - TypeScript for type safety
  - Monaco Editor for code editing capabilities
  - Modern UI with responsive design
  
- **Backend**:
  - Next.js API routes for server-side functionality
  - Secure code execution environment
  - API integration for code compilation and execution
  - Supabase for authentication and user management

## Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm or yarn package manager
- Supabase account (for authentication features)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/code-editor.git
   cd code-editor
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following variables:
   ```
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   
   # Code Execution Configuration
   EXECUTION_API_KEY=your_api_key_here
   MAX_EXECUTION_TIME=10000
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Usage

1. Select your preferred programming language from the dropdown menu
2. Write your code in the editor panel
3. Add any required input in the input field (if your program reads from stdin)
4. Click the "Run" button to execute your code
5. View the output in the console panel below the editor
6. Use the theme toggle to switch between light and dark modes
7. Save your code or generate a shareable link as needed

## Authentication Features

The application includes a complete authentication system powered by Supabase:

### User Registration and Login
- Email and password-based authentication
- Form validation with password strength requirements
- Error handling and user feedback

### Password Management
- Secure password reset via email
- Password update functionality for logged-in users

### Protected Routes
- Route protection for authenticated content
- Automatic redirection to login page for unauthenticated users

### User Profile
- View and update user profile information
- Manage account settings

## Configuration

The application can be configured through environment variables:

```
# .env.local example
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Code Execution Configuration
EXECUTION_API_KEY=your_api_key_here
MAX_EXECUTION_TIME=10000
```

## Security Considerations

This application implements several security measures:
- Code execution is performed in a sandboxed environment
- Resource limits are enforced to prevent abuse
- Input validation is performed to prevent injection attacks
- Authentication is handled securely through Supabase
- Passwords are securely hashed and stored
- Protected routes ensure only authenticated users can access certain features

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Monaco Editor](https://microsoft.github.io/monaco-editor/) for the powerful code editing capabilities
- [Next.js](https://nextjs.org/) for the React framework
- [Supabase](https://supabase.io/) for authentication and backend services
