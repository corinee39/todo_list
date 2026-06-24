import { useState } from 'react';
import SideMenu from './SideMenu';
import './HomeHeader.css';

function getAvatarText(name) {
  if (name && name.trim()) {
    return name.trim().charAt(0);
  }

  return '?';
}

function HomeHeader({
  isLoggedIn,
  currentUser,
  friends = [],
  onChangePage,
  onLogout,
  onOpenFriendAdd,
  onOpenFriendTodos,
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const displayName =
    isLoggedIn && currentUser?.nickname ? currentUser.nickname : '게스트';

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
            <span className="avatar">{getAvatarText(displayName)}</span>
            <span>{displayName}</span>
          </button>

          {friends.map((friend) => (
            <button
              className="profile-chip"
              key={friend.id}
              onClick={() => onOpenFriendTodos(friend.id)}
            >
              <span className="avatar">{getAvatarText(friend.name)}</span>
              <span>{friend.name}</span>
            </button>
          ))}

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
        isLoggedIn={isLoggedIn}
        nickname={displayName}
        onClose={handleCloseMenu}
        onChangePage={onChangePage}
        onLogout={onLogout}
      />
    </>
  );
}

export default HomeHeader;
