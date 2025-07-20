// Simple navigation test
export const TestNav = () => {
  return (
    <nav style={{background: '#4F46E5', color: 'white', padding: '10px'}}>
      <h1>MyNextLesson - Test Navigation</h1>
      <ul style={{listStyle: 'none', display: 'flex', gap: '20px'}}>
        <li>Home</li>
        <li>Lessons</li>
        <li>Generator</li>
        <li>API Docs</li>
      </ul>
    </nav>
  );
};
