export default function NotFound() {
  return (
    <html lang="en">
      <head>
        <title>404 - Page Not Found</title>
        <meta name="description" content="The page you are looking for could not be found." />
      </head>
      <body>
        <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',flexDirection:'column',fontFamily:'system-ui, -apple-system, sans-serif'}}>
          <h1 style={{fontSize:'2rem',marginBottom:'1rem'}}>404 - Page Not Found</h1>
          <p style={{color:'#666',marginBottom:'2rem'}}>The page you are looking for does not exist.</p>
          <a href="/" style={{marginTop:'20px',color:'#4F46E5',textDecoration:'none',padding:'10px 20px',border:'1px solid #4F46E5',borderRadius:'4px'}}>Go Home</a>
        </div>
      </body>
    </html>
  );
}

