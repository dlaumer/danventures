/*
--------------
Button.tsx
--------------

Functionality for most of the basic buttons like disable, active, hover, etc.

*/

import React, { FC, useEffect, useState } from 'react';
import { getTranslation } from '../services/languageHelper';
import { useSelector } from 'react-redux';

type ButtonProps = {
    title?: string;
    titleKey?: string;
    isDisabled?: boolean;
    isActive?: boolean;
    hoverTitle?: string;
    hoverStyle?: React.CSSProperties;
    icon?: any;
    isVisible?: boolean;
    username?: string;
};
const Button: FC<ButtonProps & React.ComponentProps<'button'>> = ({
    title = 'Default',
    titleKey,
    isDisabled,
    isActive = false,
    hoverTitle = title,
    icon = null,
    isVisible = true,
    username = '',
    ...props
}) => {
    const [isHover, setIsHovered] = useState(false);

    const handleHover = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    if (titleKey == 'login' && username != '') {
        titleKey = username;
    }
    title = titleKey != null ? getTranslation(titleKey) : title;

    hoverTitle = title;

    let content: any = isHover ? hoverTitle : title;

    if (icon != null) {
        content = (
            <div className="h-full flex items-center">
                <img src={icon} className="h-[80%] px-[5px]"></img>
                <div>{isHover ? hoverTitle : title}</div>
            </div>
        );
    }

    return (
        <button
            className={`h-full rounded-xl transition-opacity ease-in-out duration-200 font-noigrotesk p-2 h-fit w-fit text-lg font-medium text-neutral-600 whitespace-nowrap ${
                isDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
            }
            ${isActive ? 'bg-white shadow-sm text-black' : 'bg-backgroundgray'}
            ${isVisible ? '' : 'hidden'}
            `}
            onMouseEnter={handleHover}
            onMouseLeave={handleMouseLeave}
            disabled={isDisabled}
            {...props}
        >
            {content}
        </button>
    );
};
export default Button;
