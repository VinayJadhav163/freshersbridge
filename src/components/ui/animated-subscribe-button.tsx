"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

export interface AnimatedSubscribeButtonProps {
  buttonColor: string;
  buttonTextColor?: string;
  subscribeStatus: boolean;
  initialText: React.ReactElement | string;
  changeText: React.ReactElement | string;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const AnimatedSubscribeButton: React.FC<
  AnimatedSubscribeButtonProps
> = ({
  buttonColor,
  subscribeStatus,
  buttonTextColor = "#ffffff",
  changeText,
  initialText,
  className = "",
  disabled = false,
  type = "button",
  onClick,
}) => {
  const [isSubscribed, setIsSubscribed] = useState<boolean>(subscribeStatus);

  useEffect(() => {
    setIsSubscribed(subscribeStatus);
  }, [subscribeStatus]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isSubscribed ? (
        <motion.button
          key="subscribed"
          type={type}
          disabled={disabled}
          className={`relative flex min-w-[180px] sm:min-w-[200px] items-center justify-center overflow-hidden rounded-xl bg-emerald-50 dark:bg-emerald-950/40 px-6 py-3 border border-emerald-500/40 text-emerald-600 dark:text-emerald-400 font-bold shadow-sm ${className}`}
          onClick={handleClick}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.span
            key="action"
            className="relative flex items-center justify-center font-bold text-sm"
            initial={{ y: -15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {changeText}
          </motion.span>
        </motion.button>
      ) : (
        <motion.button
          key="unsubscribed"
          type={type}
          disabled={disabled}
          className={`relative flex min-w-[180px] sm:min-w-[200px] cursor-pointer items-center justify-center rounded-xl px-6 py-3 text-sm font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
          style={{ backgroundColor: buttonColor, color: buttonTextColor }}
          onClick={handleClick}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.span
            key="reaction"
            className="relative flex items-center justify-center font-bold text-sm"
            initial={{ x: 0 }}
            exit={{ x: 20, opacity: 0, transition: { duration: 0.15 } }}
          >
            {initialText}
          </motion.span>
        </motion.button>
      )}
    </AnimatePresence>
  );
};
