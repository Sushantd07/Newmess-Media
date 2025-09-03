import React from 'react';

class SafeBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // Log boundary errors for debugging without crashing the whole app
    // eslint-disable-next-line no-console
    console.error('[SafeBoundary] Caught error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return null;
    }
    return this.props.children;
  }
}

export default SafeBoundary;


