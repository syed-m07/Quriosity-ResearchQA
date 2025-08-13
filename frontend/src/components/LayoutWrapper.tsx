import { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import Layout from './Layout'; // Assuming Layout is in the same directory

interface LayoutWrapperProps {
  children: ReactNode;
}

const LayoutWrapper = ({ children }: LayoutWrapperProps) => {
  const location = useLocation(); // useLocation is now inside Router context

  return (
    <Layout key={location.key}>
      {children}
    </Layout>
  );
};

export default LayoutWrapper;
