import { useRef } from "react";
import { CSSTransition } from "react-transition-group";

interface IProps {
  show: boolean;
  onDismiss: () => void;
}

export function Overlay({ show, onDismiss }: IProps) {
  const nodeRef = useRef(null);

  return (
    <CSSTransition
      key="overlay"
      in={show}
      nodeRef={nodeRef}
      timeout={150}
      unmountOnExit
      classNames={{
        enter: "opacity-0",
        enterActive: "opacity-50 transition-opacity",
        enterDone: "opacity-50",
        exit: "opacity-50",
        exitActive: "opacity-0 transition-opacity",
      }}
    >
      <div
        ref={nodeRef}
        className="absolute inset-0 bg-dark"
        onClick={onDismiss}
      />
    </CSSTransition>
  );
}
