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
      appear
      classNames={{
        enter: "opacity-0",
        enterActive: "transition-opacity opacity-50",
        enterDone: "opacity-50",
        appear: "opacity-0",
        appearActive: "transition-opacity opacity-50",
        exit: "opacity-50",
        exitActive: "transition-opacity opacity-50",
        exitDone: "opacity-0",
      }}
    >
      <div
        ref={nodeRef}
        className="fixed inset-0 bg-dark"
        onClick={onDismiss}
      />
    </CSSTransition>
  );
}
