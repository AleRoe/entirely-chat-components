import React from 'react';
import { useKeycloak } from '@react-keycloak/web';
import { 
  Button, 
  Text, 
  Avatar, 
  Menu, 
  MenuTrigger, 
  MenuPopover, 
  MenuList, 
  MenuItem,
  MenuDivider
} from '@fluentui/react-components';
import { 
  Person24Regular, 
  SignOut24Regular
} from '@fluentui/react-icons';

const Header: React.FC = () => {
  const { keycloak } = useKeycloak();
  
  // Get user info from Keycloak token
  const user = keycloak.tokenParsed;
  const userName = user?.name || user?.preferred_username || 'User';
  const userEmail = user?.email || '';

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px 24px',
      background: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(5px)',
      borderBottom: '1px solid rgba(225, 225, 225, 0.3)',
      boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
      zIndex: 1000 // Increased z-index to ensure header and menu appear above other content
    }}>
      {/* Left side - Logo and App title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '32px',
          height: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <svg 
            width="32" 
            height="32" 
            viewBox="0 0 31 31" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Official Entirely icon */}
            <mask id="mask0_header" style={{maskType:'luminance'}} maskUnits="userSpaceOnUse" x="0" y="0" width="31" height="31">
              <path d="M0.000400543 0H30.3594V30.359H0.000400543V0Z" fill="white"/>
            </mask>
            <g mask="url(#mask0_header)">
              <path d="M0.0690565 28.5855L4.5032 15.1794L0.0705811 1.77477C-0.0910489 1.28835 0.0339853 0.759248 0.39689 0.396343C0.759796 0.0334376 1.28738 -0.091597 1.77532 0.0685084L15.1814 4.50266L28.586 0.0685084C29.0725 -0.091597 29.6016 0.0334376 29.9645 0.396343C30.3259 0.759248 30.4509 1.28683 30.2908 1.77325L25.8567 15.1794L30.2908 28.5855C30.4524 29.0735 30.3259 29.601 29.963 29.9639C29.7053 30.2216 29.3637 30.3604 29.0115 30.3604C28.8697 30.3604 28.7248 30.3375 28.5845 30.2918L15.1784 25.8576L1.77227 30.2918C1.28586 30.4519 0.758273 30.3284 0.395367 29.9655C0.0324626 29.6026 -0.0925742 29.075 0.0675318 28.5871L0.0690565 28.5855ZM6.48853 13.5844L11.5036 11.503L13.585 6.48797L2.98144 2.9809L6.48853 13.5844ZM12.6899 16.9497C13.0177 17.0854 13.2739 17.34 13.4096 17.6694L15.1799 21.9358L16.9502 17.6694C17.0859 17.3416 17.3421 17.0854 17.6684 16.9512L21.9348 15.1809L17.6669 13.4106C17.3391 13.2749 17.0844 13.0187 16.9487 12.6924L15.1784 8.426L13.4081 12.6924C13.2724 13.0203 13.0177 13.2749 12.6899 13.4106L8.42346 15.1809L12.6884 16.9512L12.6899 16.9497ZM27.3784 2.9809L16.7749 6.48797L18.8563 11.503L23.8713 13.5844L27.3784 2.9809ZM23.8713 16.7743L18.8563 18.8557L16.7749 23.8708L27.3784 27.3779L23.8713 16.7743ZM13.585 23.8723L11.5036 18.8572L6.48853 16.7758L2.98144 27.3794L13.585 23.8723Z" fill="#231F1F"/>
            </g>
          </svg>
        </div>
        <Text style={{ 
          fontSize: '20px', 
          fontWeight: '600', 
          color: '#323130',
          letterSpacing: '-0.01em'
        }}>
          Ecosystem Lab
        </Text>
      </div>
      
      {/* Right side - User menu */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Menu>
          <MenuTrigger disableButtonEnhancement>
            <Button
              appearance="subtle"
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Avatar 
                size={32}
                style={{ backgroundColor: '#0078d4' }}
                name={userName}
              />
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'flex-start',
                textAlign: 'left'
              }}>
                <Text style={{ 
                  fontSize: '14px', 
                  fontWeight: '500', 
                  color: '#323130',
                  lineHeight: '1.2'
                }}>
                  {userName}
                </Text>
                <Text style={{ 
                  fontSize: '12px', 
                  color: '#605e5c',
                  lineHeight: '1.2'
                }}>
                  {userEmail}
                </Text>
              </div>
            </Button>
          </MenuTrigger>
          
          <MenuPopover>
            <MenuList>
              <MenuItem icon={<Person24Regular />}>
                <div>
                  <div style={{ fontWeight: '500' }}>{userName}</div>
                  <div style={{ fontSize: '12px', color: '#605e5c' }}>{userEmail}</div>
                </div>
              </MenuItem>
              <MenuDivider />
              <MenuItem 
                icon={<SignOut24Regular />}
                onClick={() => keycloak.logout()}
              >
                Sign Out
              </MenuItem>
            </MenuList>
          </MenuPopover>
        </Menu>
      </div>
    </div>
  );
};

export default Header;