// A 24x24 line icon. Pass `d` for a single path, or children for anything else.
export default function Icon({ d, size = 16, stroke = 'currentColor', sw = 2, fill = 'none', style, children, ...rest }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={fill === 'none' ? stroke : undefined} strokeWidth={fill === 'none' ? sw : undefined} style={style} {...rest}>
      {d && <path d={d} />}
      {children}
    </svg>
  )
}

export function DotsIcon() {
  return (
    <Icon size={16} fill="#6F6A78">
      <circle cx="5" cy="12" r="1.7" />
      <circle cx="12" cy="12" r="1.7" />
      <circle cx="19" cy="12" r="1.7" />
    </Icon>
  )
}

export function SearchIcon({ size = 15, stroke = '#A8A29A' }) {
  return (
    <Icon size={size} stroke={stroke} sw={2.2}>
      <circle cx="11" cy="11" r="7.5" />
      <path d="M21 21l-4.3-4.3" />
    </Icon>
  )
}
