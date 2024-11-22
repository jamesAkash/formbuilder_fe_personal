import { createContext, useContext, useState } from "react";

const ToolTipContext = createContext();

function Tooltip({ children }) {
  const [isVisible, setIsVisible] = useState(false);
  return (
    <ToolTipContext.Provider value={{ setIsVisible, isVisible }}>
      <div className="relative">{children}</div>
    </ToolTipContext.Provider>
  );
}

const ToolTipIcon = ({ children }) => {
  const { setIsVisible } = useContext(ToolTipContext);

  return (
    <span
      className="cursor-pointer "
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
    </span>
  );
};

const ToolTipContent = ({ children }) => {
  const { isVisible, setIsVisible } = useContext(ToolTipContext);

  if (isVisible)
    return (
      <div
        className={`tooltip-children z-50 bg-slate-800 leading-5 text-sm  text-white absolute top-2 left-6  px-4 py-2 rounded-md w-full min-w-44 max-w-44`}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
    );

  return null;
};

Tooltip.Icon = ToolTipIcon;
Tooltip.Content = ToolTipContent;

export default Tooltip;
