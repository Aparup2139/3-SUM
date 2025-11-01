
import styled from "styled-components";

export const MorphedMenu = ({
  openMenu,
  setOpenMenu,
}: {
  openMenu: boolean;
  setOpenMenu: (val: boolean) => void;
}) => {
  return (
    <StyledWrapper
      onClick={(e) => {
        e.stopPropagation();
        setOpenMenu(!openMenu);
      }}
      aria-label="Toggle Menu"
    >
      <div className={`burger ${openMenu ? "open" : ""}`}>
        <span className="line line1" />
        <span className="line line2" />
        <span className="line line3" />
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  z-index: 999;

  .burger {
    width: 24px;
    height: 14px;
    position: relative;
    display: flex;
    gap: 2px;
    flex-direction: column;
  }

  .line {
    display: block;
    height: 2px;
    background: oklch(0.627 0.265 303.9);
    border-radius: 10px;
    transition: all 0.3s ease;
  }

  .line1,
  .line2,
  .line3 {
    width: 100%;
    position: absolute;
    left: 0;
  }

  .line1 {
    top: 0;
  }

  .line2 {
    top: 9px;
  }

  .line3 {
    top: 18px;
  }

  
  .burger.open .line1 {
    transform: rotate(45deg);
    top: 9px;
  }

  .burger.open .line2 {
    opacity: 0;
  }

  .burger.open .line3 {
    transform: rotate(-45deg);
    top: 9px;
  }
`;
