import React from 'react';

export const renderUserButton = (user, handleOpen, toggleDropdown, showDropdown) => {
    if (user && user.email) {
      const displayEmail = user.email.split('@')[0];
      return (
        <>
          <button id="usernameDropdownButton" onClick={toggleDropdown}>
            {displayEmail}
          </button>
          {showDropdown && (
            <>
              <div className="dropdown-content">
                <button id="closeDropdownButton" onClick={toggleDropdown}>X</button> {/* Added Close button */}
                <div className="dropdown-items">
                  <button onClick={() => { /* go to My Profile */ }}>My Profile</button>
                  <button onClick={() => { /* go to Saved Graphs */ }}>Saved Graphs</button>
                  <button onClick={() => { /* sign out */ }}>Sign Out</button>
                </div>
              </div>
            </>
          )}
        </>
      );
    } else {
      return <div id="loginButton" onClick={handleOpen}>Sign In</div>;
    }
  };

  
  