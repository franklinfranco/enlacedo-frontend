import React from 'react';
import TopHeader from './TopHeader';
import MainHeader from './MainHeader';

function Header() {
  return (
    <header className="header">
      <TopHeader />
      <MainHeader />
    </header>
  );
}

export default Header;