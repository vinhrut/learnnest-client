import { Button, ConfigProvider } from "antd"
import type { FC, ReactNode, CSSProperties } from "react"
import type { ButtonProps } from "antd"
import { useCallback, useMemo } from "react"

interface ColorButtonProps extends Omit<ButtonProps, "color" | "size" | "shape"> {
  children: ReactNode
  color?: "primary" | "accent" | "secondary" | "outline" | "third" | "form" // secondary và third = backward compatibility
  size?: "small" | "medium" | "large"
  shape?: "rounded" | "square" // rounded = rounded-full, square = rounded-lg
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

const ColorButton: FC<ColorButtonProps> = ({ 
  children, 
  color = "primary", 
  size = "medium",
  shape = "rounded",
  type,
  className = "",
  style,
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  ...props 
}) => {
  // Normalize color prop (backward compatibility)
  const normalizedColor = useMemo(() => {
    if (color === "secondary") return "accent"
    if (color === "third") return "outline"
    return color || "primary"
  }, [color])

  // Configs - memoized to avoid recreating on every render
  const configs = useMemo(() => ({
    size: {
      small: { padding: "6px 24px", fontSize: "14px", height: "auto" }, // px-6 py-2.5
      medium: { padding: "8px 32px", fontSize: "16px", height: "auto" }, // px-8 py-4
      large: { padding: "12px 40px", fontSize: "18px", height: "auto" },
    },
    style: {
      primary: {
        background: "#0052CC", // Primary - Deep Navy
        border: "none",
        borderRadius: shape === "rounded" ? "50px" : "8px",
        color: "#ffffff",
        boxShadow: "0 4px 6px -1px rgba(2, 30, 99, 0.3), 0 2px 4px -1px rgba(2, 30, 99, 0.2)",
        fontFamily: "'Be Vietnam Pro', sans-serif",
        fontWeight: 700,
      },
      accent: {
        background: "#42526E", // Accent - Warm Gold
        border: "none",
        borderRadius: shape === "rounded" ? "50px" : "8px",
        color: "#021E63",
        boxShadow: "0 10px 15px -3px rgba(245, 214, 123, 0.3), 0 4px 6px -2px rgba(245, 214, 123, 0.2)",
        fontFamily: "'Be Vietnam Pro', sans-serif",
        fontWeight: 700,
      },
      outline: {
        background: "#091E42", // Outline button
        border: "2px solid #ffffff",
        borderRadius: shape === "rounded" ? "50px" : "8px",
        color: "#ffffff",
        fontWeight: 600,
        boxShadow: "none",
        fontFamily: "'Be Vietnam Pro', sans-serif",
      },
      form: {
        background: "#A33500", // Form button - Primary với rounded-lg
        border: "none",
        borderRadius: "8px", // rounded-lg
        color: "#ffffff",
        boxShadow: "0 4px 6px -1px rgba(2, 30, 99, 0.3), 0 2px 4px -1px rgba(2, 30, 99, 0.2)",
        fontFamily: "'Be Vietnam Pro', sans-serif",
        fontWeight: 700,
      }
    },
    hover: {
      primary: { 
        background: "rgba(2, 30, 99, 0.9)", // hover:bg-opacity-90
        boxShadow: "0 10px 15px -3px rgba(2, 30, 99, 0.4), 0 4px 6px -2px rgba(2, 30, 99, 0.3)",
        color: undefined,
        transform: undefined
      },
      accent: { 
        background: "#ffffff",
        color: "#021E63",
        transform: "scale(1.05)", // hover:scale-105
        boxShadow: "0 20px 25px -5px rgba(245, 214, 123, 0.4), 0 10px 10px -5px rgba(245, 214, 123, 0.2)"
      },
      outline: { 
        background: "#ffffff",
        color: "#021E63",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        transform: undefined
      },
      form: {
        background: "rgba(2, 30, 99, 0.9)", // hover:bg-primary/90
        transform: "translateY(-4px)", // hover:-translate-y-1
        boxShadow: "0 10px 15px -3px rgba(2, 30, 99, 0.4), 0 4px 6px -2px rgba(2, 30, 99, 0.3)",
        color: undefined
      }
    },
    disabled: {
      primary: { background: "#9ca3af", color: "#ffffff", opacity: 0.6, cursor: "not-allowed", boxShadow: "none" },
      accent: { background: "#9ca3af", color: "#ffffff", opacity: 0.6, cursor: "not-allowed", boxShadow: "none" },
      outline: { background: "transparent", border: "2px solid #9ca3af", color: "#9ca3af", opacity: 0.6, cursor: "not-allowed", boxShadow: "none" },
      form: { background: "#9ca3af", color: "#ffffff", opacity: 0.6, cursor: "not-allowed", boxShadow: "none" }
    }
  }), [shape])

  // Button style
  const buttonStyle: CSSProperties = {
    ...configs.style[normalizedColor],
    ...(disabled ? configs.disabled[normalizedColor] : {}),
    ...configs.size[size],
    ...style,
  }

  // Hover handlers
  const handleMouseEnter = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return
    const hover = configs.hover[normalizedColor]
    const element = e.currentTarget
    element.style.background = hover.background as string
    element.style.boxShadow = hover.boxShadow as string
    if (hover.color) element.style.color = hover.color as string
    if (hover.transform) element.style.transform = hover.transform as string
    props.onMouseEnter?.(e)
  }, [normalizedColor, disabled, loading, configs.hover, props])

  const handleMouseLeave = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return
    const normal = configs.style[normalizedColor]
    const element = e.currentTarget
    element.style.background = normal.background as string
    element.style.boxShadow = normal.boxShadow as string
    element.style.color = normal.color as string
    element.style.transform = "none"
    props.onMouseLeave?.(e)
  }, [normalizedColor, disabled, loading, configs.style, props])

  // Content với icons
  const content = (
    <span className="flex items-center justify-center gap-2">
      {leftIcon && leftIcon}
      {children}
      {rightIcon && rightIcon}
    </span>
  )

  return (
    <ConfigProvider theme={{ token: { borderRadius: shape === "rounded" ? 50 : 8 } }}>
      <Button 
        {...props} 
        type={type || (normalizedColor === "outline" ? "default" : "primary")}
        size={size === "small" ? "small" : size === "large" ? "large" : "middle"}
        className={`transition-all duration-300 ${disabled ? "cursor-not-allowed" : ""} ${className}`.trim()}
        style={buttonStyle}
        disabled={disabled}
        loading={loading}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {content}
      </Button>
    </ConfigProvider>
  )
}

export default ColorButton
