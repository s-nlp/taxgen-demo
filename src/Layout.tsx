import { ReactElement } from "react";

export interface LayoutProps {
    children: ReactElement;
}

export default function Layout({children}: LayoutProps) {
    return (
      <div>
        <h1>Taxonomy</h1>
        {children}
      </div>
    );
}
