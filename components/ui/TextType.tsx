'use client';

import { useEffect, useRef, useState, useMemo, useCallback } from 'react';

import './TextType.css';

export interface TextTypeProps extends React.HTMLAttributes<HTMLElement> {
  text: string | string[];
  as?: React.ElementType;
  typingSpeed?: number;
  initialDelay?: number;
  pauseDuration?: number;
  deletingSpeed?: number;
  loop?: boolean;
  className?: string;
  showCursor?: boolean;
  hideCursorWhileTyping?: boolean;
  cursorCharacter?: React.ReactNode;
  cursorClassName?: string;
  cursorBlinkDuration?: number;
  textColors?: string[];
  variableSpeed?: { min: number; max: number };
  onSentenceComplete?: (sentence: string, index: number) => void;
  startOnVisible?: boolean;
  reverseMode?: boolean;
}

const TextType: React.FC<TextTypeProps> = ({
  text,
  as: Component = 'div',
  typingSpeed = 50,
  initialDelay = 0,
  className = '',
  showCursor = true,
  hideCursorWhileTyping = false,
  cursorCharacter = '|',
  cursorClassName = '',
  cursorBlinkDuration = 0.5,
  textColors = [],
  variableSpeed,
  onSentenceComplete,
  startOnVisible = false,
  reverseMode = false,
  ...props
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [currentTextIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(!startOnVisible);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const cursorRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLElement>(null);

  const textArray = useMemo(() => (Array.isArray(text) ? text : [text]), [text]);

  const getRandomSpeed = useCallback(() => {
    if (!variableSpeed) return typingSpeed;
    const { min, max } = variableSpeed;
    return Math.random() * (max - min) + min;
  }, [variableSpeed, typingSpeed]);

  const getCurrentTextColor = () => {
    if (textColors.length === 0) return 'inherit';
    return textColors[currentTextIndex % textColors.length];
  };

  useEffect(() => {
    if (!startOnVisible || !containerRef.current) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [startOnVisible]);

  // GSAP cursor blink removed in favor of CSS animation (automatically pauses off-screen)

  useEffect(() => {
    if (!isVisible || isTypingComplete) return;

    let timeout: ReturnType<typeof setTimeout>;
    const currentText = textArray[currentTextIndex];
    const processedText = reverseMode ? currentText.split('').reverse().join('') : currentText;

    const executeTypingAnimation = () => {
      if (currentCharIndex < processedText.length) {
        timeout = setTimeout(
          () => {
            setDisplayedText(prev => prev + processedText[currentCharIndex]);
            setCurrentCharIndex(prev => prev + 1);
          },
          variableSpeed ? getRandomSpeed() : typingSpeed
        );
      } else {
        if (onSentenceComplete) {
          onSentenceComplete(textArray[currentTextIndex], currentTextIndex);
        }
        
        if (currentTextIndex === textArray.length - 1) {
           setIsTypingComplete(true);
        } else {
           setIsTypingComplete(true);
        }
      }
    };

    if (currentCharIndex === 0 && displayedText === '') {
      timeout = setTimeout(executeTypingAnimation, initialDelay);
    } else {
      executeTypingAnimation();
    }

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    currentCharIndex,
    displayedText,
    typingSpeed,
    textArray,
    currentTextIndex,
    initialDelay,
    isVisible,
    reverseMode,
    variableSpeed,
    onSentenceComplete,
    isTypingComplete
  ]);

  const shouldHideCursor =
    hideCursorWhileTyping && !isTypingComplete;

  const Comp = Component as React.ElementType;

  return (
    <Comp ref={containerRef} className={`text-type ${className}`} {...props}>
      <span className="text-type__content" style={{ color: getCurrentTextColor() || 'inherit' }}>
        {displayedText}
      </span>
      {showCursor && (
        <span
          ref={cursorRef}
          className={`text-type__cursor ${cursorClassName} ${shouldHideCursor ? 'text-type__cursor--hidden' : ''}`}
          style={{ animationDuration: `${cursorBlinkDuration * 2}s` }}
        >
          {cursorCharacter}
        </span>
      )}
    </Comp>
  );
};

export default TextType;
