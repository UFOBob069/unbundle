export default function NotFound() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>404 - Page Not Found</title>
        <meta name="description" content="The page you are looking for could not be found." />
      </head>
      <body style={{margin:0,padding:0,fontFamily:'system-ui, -apple-system, sans-serif'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'100vh',flexDirection:'column',padding:'20px'}}>
          <h1 style={{fontSize:'2rem',marginBottom:'1rem',color:'#1f2937',margin:0}}>404 - Page Not Found</h1>
          <p style={{color:'#666',marginBottom:'2rem',textAlign:'center',margin:0}}>The page you are looking for does not exist.</p>
          <a href="/" style={{padding:'10px 20px',color:'#4F46E5',textDecoration:'none',border:'1px solid #4F46E5',borderRadius:'4px',display:'inline-block',fontSize:'16px'}}>Go Home</a>
        </div>
      </body>
    </html>
  )
}

