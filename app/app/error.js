'use client';

export default function Error({ error, reset }) {
  if (error) {
    console.error(error);
  }

  return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',flexDirection:'column',fontFamily:'system-ui, -apple-system, sans-serif'}}>
      <h1 style={{fontSize:'2rem',marginBottom:'1rem'}}>Something went wrong!</h1>
      <p style={{color:'#666',marginBottom:'2rem'}}>An unexpected error occurred.</p>
      {reset && (
        <button 
          onClick={() => typeof reset === 'function' && reset()}
          style={{marginTop:'20px',padding:'10px 20px',color:'#4F46E5',border:'1px solid #4F46E5',borderRadius:'4px',cursor:'pointer',background:'white'}}
        >
          Try again
        </button>
      )}
      <a href="/" style={{marginTop:'20px',color:'#4F46E5',textDecoration:'none',padding:'10px 20px',border:'1px solid #4F46E5',borderRadius:'4px'}}>Go Home</a>
    </div>
  );
}

