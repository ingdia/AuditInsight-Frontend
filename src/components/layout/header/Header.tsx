import { headerStyles } from "./header.styles"

export interface HeaderProps {
  title: string
}

const navItems = [
  "Dashboard",
  "Transactions",
  "Evidence",
  "Review Queue",
  "Reports",
  "Settings",
]

export default function Header({ title }: HeaderProps) {
  return (
    <header style={headerStyles.container}>
      <div style={headerStyles.left}>
        <div style={headerStyles.logo}>
          <div style={headerStyles.logoMark} />
          {title}   {/* ⭐ use the prop here */}
        </div>

        <nav style={headerStyles.nav}>
          {navItems.map((item, index) => (
            <div
              key={item}
              style={{
                ...headerStyles.navItem,
                ...(index === 0 ? headerStyles.navItemActive : {}),
              }}
            >
              {item}

              {index === 0 && (
                <div style={headerStyles.activeUnderline} />
              )}
            </div>
          ))}
        </nav>
      </div>

      <div style={headerStyles.right}>
        <span style={headerStyles.welcome}>Welcome, Diana</span>

        <div style={headerStyles.avatar}>
          <div style={headerStyles.badge}>6</div>
        </div>
      </div>
    </header>
  )
}