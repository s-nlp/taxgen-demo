import { render, screen } from '@testing-library/react';
import Layout from './Layout';

test('renders given canvas', () => {
  render(
    <Layout>
      <>canvas</>
    </Layout>
  );

  const canvasElement = screen.getByText(/canvas/i);
  expect(canvasElement).toBeInTheDocument();
});
