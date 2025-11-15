'use client';

export default function Error({ error, reset }) {
  return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',flexDirection:'column'}}>
      <h1>Error</h1>
      <p>Something went wrong</p>
      {reset && (
        <button 
          onClick={reset}
          style={{marginTop:'20px',padding:'10px 20px',color:'#4F46E5',border:'1px solid #4F46E5',borderRadius:'4px',cursor:'pointer',background:'white'}}
        >
          Try again
        </button>
      )}
      <a href="/" style={{marginTop:'20px',color:'#4F46E5'}}>Go Home</a>
    </div>
  );
}

