import { useState } from 'react';
import SideMenu from './SideMenu';
import './HomeHeader.css';

function HomeHeader({ onChangePage, onOpenFriendAdd }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleOpenMenu = () => {
    setIsMenuOpen(true);
  };

  const handleCloseMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <header className="home-header">
        <div className="friend-list">
          <button className="profile-chip active">
            <span className="avatar">me</span>
            <span>me</span>
          </button>

          <button className="profile-chip">
            <span className="avatar animal">🐰</span>
            <span>모모</span>
          </button>

          <button className="profile-chip">
            <span className="avatar animal">🐻</span>
            <span>하니</span>
          </button>

          <button className="friend-add-button" onClick={onOpenFriendAdd}>
            ＋
          </button>
        </div>

        <button
          className="menu-button"
          aria-label="메뉴 열기"
          onClick={handleOpenMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </header>

      <SideMenu
        isOpen={isMenuOpen}
        onClose={handleCloseMenu}
        onChangePage={onChangePage}
      />
    </>
  );
}

export default HomeHeader;