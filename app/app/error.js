'use client';

export default function Error({ error, reset }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      flexDirection: 'column',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '20px',
      textAlign: 'center'
    }}>
      <h1 style={{
        fontSize: '2rem',
        marginBottom: '1rem',
        color: '#1f2937',
        margin: 0
      }}>
        Something went wrong!
      </h1>
      <p style={{
        color: '#666',
        marginBottom: '2rem',
        margin: 0
      }}>
        An unexpected error occurred.
      </p>
      <div style={{
        display: 'flex',
        gap: '10px',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        {reset && (
          <button
            onClick={reset}
            style={{
              padding: '10px 20px',
              color: '#4F46E5',
              border: '1px solid #4F46E5',
              borderRadius: '4px',
              cursor: 'pointer',
              background: 'white',
              fontSize: '16px'
            }}
          >
            Try again
          </button>
        )}
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
    </div>
  );
}

