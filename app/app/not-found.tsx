export default function NotFound() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      flexDirection: 'column',
      padding: '20px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <h1 style={{
        fontSize: '2rem',
        marginBottom: '1rem',
        color: '#1f2937',
        margin: 0
      }}>
        404 - Page Not Found
      </h1>
      <p style={{
        color: '#666',
        marginBottom: '2rem',
        textAlign: 'center',
        margin: 0
      }}>
        The page you are looking for does not exist.
      </p>
      <a
        href="/"
        style={{
          padding: '10px 20px',
          color: '#4F46E5',
          textDecoration: 'none',
          border: '1px solid #4F46E5',
          borderRadius: '4px',
          display: 'inline-block',
          fontSize: '16px'
        }}
      >
        Go Home
      </a>
    </div>
  )
}

