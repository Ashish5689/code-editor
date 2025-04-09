# CodeSurfer - Modern Online Code Editor

![CodeSurfer Logo](public/logo.png)

![Code Editor Screenshot](https://via.placeholder.com/800x450.png?text=Code+Editor+Screenshot)
Live Preview: [Link](https://code-surf.netlify.app)

CodeSurfer is a powerful, feature-rich online code editor designed for developers of all skill levels. It provides a seamless coding experience with real-time execution, multi-language support, and an intuitive user interface. Whether you're learning to code, testing algorithms, or sharing solutions with colleagues, CodeSurfer offers the tools you need in a sleek, modern environment.

## Why Choose CodeSurfer?

### What Sets Us Apart

- **Beautiful, Intuitive Interface**: Our modern UI with customizable themes creates a distraction-free coding environment that adapts to your preferences.
- **Lightning-Fast Execution**: Experience near-instant code execution with our optimized runtime environment.
- **Seamless Cross-Device Experience**: Start coding on your desktop and continue on your mobile device with our responsive design.
- **Privacy-Focused**: Your code remains private by default, and you control what you share.
- **No Account Required for Basic Use**: Jump straight into coding without registration barriers.
- **Open Source**: Community-driven development ensures continuous improvement and transparency.

### Core Features

- **Multi-Language Support**: Write and execute code in multiple programming languages including JavaScript, Python, Java, C++, Ruby, and more.
- **Real-Time Code Execution**: Run your code instantly and see results immediately in the integrated console.
- **Intelligent Code Editor**: Powered by Monaco Editor (the same engine behind VS Code) with syntax highlighting, auto-completion, and error detection.
- **Customizable Environment**: Choose between light and dark themes to reduce eye strain during long coding sessions.
- **Responsive Design**: Optimized for both desktop and mobile devices, allowing you to code anywhere.

### Additional Features
- **Save/Load Functionality**: Save your code and return to it later without losing your work.
- **Security Measures**: Secure code execution with proper sandboxing to prevent malicious code execution.
- **Downloadable Code**: Export your code as a file with a single click for offline use.
- **Shareable Links**: Generate unique links to share your code with others, perfect for collaboration or education.
- **User Authentication**: Secure user authentication with Supabase
  - Email/password signup and login
  - Password reset functionality
  - Protected routes for authenticated users
  - User profile management
- **Interactive UI Elements**: Modern animations and transitions create an engaging user experience.
- **Execution Time Display**: Track the performance of your code with built-in execution time measurement.
- **Language-Specific Tips**: Access helpful tips and documentation specific to your chosen programming language.

## Technology Stack

- **Frontend**:
  - Next.js 14 (React framework) for server-side rendering and optimal performance
  - TypeScript for type safety and improved developer experience
  - Monaco Editor for professional-grade code editing capabilities
  - Framer Motion for smooth animations and transitions
  - Tailwind CSS for responsive and customizable UI components
  - Headless UI for accessible dropdown menus and interactive elements
  
- **Backend**:
  - Next.js API routes for server-side functionality
  - Secure code execution environment with resource limitations
  - API integration for code compilation and execution
  - Supabase for authentication, user management, and data storage

## Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm or yarn package manager
- Supabase account (for authentication features)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Ashish5689/code-editor.git
   cd code-editor
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
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
# .env example
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
- [Framer Motion](https://www.framer.com/motion/) for smooth animations and transitions
