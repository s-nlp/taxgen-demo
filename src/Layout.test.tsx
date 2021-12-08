import { render, screen } from '@testing-library/react';
import Layout from './Layout';

test('renders header and given canvas', () => {
  render(
    <Layout>
      <>canvas</>
    </Layout>
  );

  const headerElement = screen.getByText(/Taxonomy/i);
  expect(headerElement).toBeInTheDocument();

  const canvasElement = screen.getByText(/canvas/i);
  expect(canvasElement).toBeInTheDocument();
});
