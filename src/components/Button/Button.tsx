import { Html } from '@react-three/drei';
import './Button.scss';
import { Dispatch, SetStateAction } from 'react';
import React from 'react';

type Props = {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

export const Button: React.FC<Props> = ({ setIsOpen }) => {
  const handleCLoce = () => {
    setIsOpen(prev => !prev);
  };

  return (
    <Html position={[0, 0, 2]} center>
      <button
        className="button"
        onTouchStart={handleCLoce}
        onClick={handleCLoce}
      >
        Будеш моєю валентинкою?
      </button>
    </Html>
  );
};
