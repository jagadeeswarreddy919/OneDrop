import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import App from './App';
import './index.css';

class GlobalErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ONEDROP Global Error Boundary Caught Error]', error, errorInfo);
  }

  handleReset = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {
      console.error('Failed to clear storage:', e);
    }
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          backgroundColor: '#0f172a',
          color: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '3rem',
            marginBottom: '1rem'
          }}>
            🩸
          </div>
          <h1 style={{
            fontSize: '1.75rem',
            fontWeight: '800',
            marginBottom: '0.5rem',
            color: '#f43f5e'
          }}>
            ONEDROP Application Recovered
          </h1>
          <p style={{
            fontSize: '0.875rem',
            color: '#94a3b8',
            maxWidth: '500px',
            marginBottom: '1.5rem',
            lineHeight: '1.5'
          }}>
            {this.state.error?.message || 'A temporary browser cache or component state error occurred. Click below to clear cache and reload ONEDROP.'}
          </p>
          <button
            onClick={this.handleReset}
            style={{
              backgroundColor: '#e11d48',
              color: '#ffffff',
              fontWeight: '700',
              fontSize: '0.875rem',
              padding: '0.75rem 1.75rem',
              borderRadius: '0.75rem',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 10px 15px -3px rgba(225, 29, 72, 0.4)',
              transition: 'transform 0.2s, background-color 0.2s'
            }}
          >
            Reset Session & Launch ONEDROP
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GlobalErrorBoundary>
      <Provider store={store}>
        <App />
      </Provider>
    </GlobalErrorBoundary>
  </React.StrictMode>
);
