# LostMyPhone

LostMyPhone is a web application designed to help you access your important contacts when you need them most. Whether you've lost your phone, it's damaged, or just out of battery, LostMyPhone ensures you can always reach your emergency contacts.

## Features

- 🔒 Secure storage of important contact numbers
- 📱 Easy access from any device
- 👥 Limited to essential contacts only (5 numbers max)
- 🔑 Simple authentication method
- 🌐 Mobile-friendly design

## Development

This project is currently under development. The work-in-progress version is available at [lostmyphone.github.io](https://lostmyphone.github.io).

### Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```

## Production Deployment

### Environment Setup

Before deployment, make sure to:

1. Update the API URL in `.env.production`
2. Set any environment-specific variables

### Building for Production

```bash
npm run build
```

This creates a production-optimized build in the `build` directory.

### Docker Deployment

You can deploy using Docker:

```bash
# Build the Docker image
docker build -t lostmyphone:latest .

# Run the container
docker run -p 80:80 lostmyphone:latest
```

### Performance Analysis

To analyze the bundle size:

```bash
npm run analyze
```

## Security Features

- HTTPS enforcement in production
- Secure token storage in sessionStorage
- Content Security Policy implementation
- XSS and CSRF protection
- Automatic token expiration
- Input sanitization

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
