import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Loading from './Loading';

const RouteChangeLoader = ({ children }) => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [location]);

  if (loading) {
    return <Loading />;
  }

  return children;
};

export default RouteChangeLoader;