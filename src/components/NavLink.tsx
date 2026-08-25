import { forwardRef, type ComponentProps } from "react";
import { Link, useLocation } from "@/lib/router-compat";
import { cn } from "@/lib/utils";

interface NavLinkCompatProps extends Omit<ComponentProps<typeof Link>, "className"> {
  className?: string;
  activeClassName?: string;
  pendingClassName?: string;
  end?: boolean;
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkCompatProps>(
  ({ className, activeClassName, to, end, ...props }, ref) => {
    const location = useLocation();
    const target = typeof to === "string" ? to.split(/[?#]/)[0] ?? "" : "";
    const isActive = end
      ? location.pathname === target
      : location.pathname === target || location.pathname.startsWith(`${target}/`);
    return (
      <Link
        ref={ref}
        to={to}
        className={cn(className, isActive && activeClassName)}
        {...props}
      />
    );
  },
);

NavLink.displayName = "NavLink";

export default NavLink;
export { NavLink };
