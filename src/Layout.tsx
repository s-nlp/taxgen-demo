import { ReactElement } from "react";
import Container from 'react-bootstrap/Container';

export interface LayoutProps {
    children: ReactElement;
}

export default function Layout({children}: LayoutProps) {
    return (
      <Container fluid>
        {children}
      </Container>
    );
}
