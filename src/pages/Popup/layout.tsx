import React from 'react';

const Layout = ({ children }: { children: JSX.Element }) => {
    return (
        <div style={{
            height: '500px',
            width: '562px',
            margin: 'auto'
        }}>
            {children}
        </div>
    );
};


export default Layout;