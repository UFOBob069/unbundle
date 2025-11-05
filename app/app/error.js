'use client';

export default function Error() {
  return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',flexDirection:'column'}}>
      <h1>Error</h1>
      <p>Something went wrong</p>
      <a href="/" style={{marginTop:'20px',color:'#4F46E5'}}>Go Home</a>
    </div>
  );
}

