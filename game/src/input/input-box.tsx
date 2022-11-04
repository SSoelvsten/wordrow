import React from 'react';

export interface InputBoxProps {
    content: string,
}

const InputBox = ({ content }: InputBoxProps) => {
  return (
    <div className="InputBox">
      {content}
    </div>
  );
}

export default InputBox;
