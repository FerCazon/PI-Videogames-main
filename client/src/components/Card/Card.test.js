import { render, screen } from '@testing-library/react';
import Card from './card';

test('renders game information', () => {
  const game = {
    id: 1,
    name: 'Test Game',
    genres: [{ name: 'Action' }, { name: 'Adventure' }],
    rating: 4.5,
    image: 'https://example.com/image.jpg',
  };

  render(<Card games={game} />);

  const linkElement = screen.getByRole('link', { name: /test game/i });

  expect(linkElement).toBeInTheDocument();

  const nameElement = screen.getByText(/test game/i);
  expect(nameElement).toBeInTheDocument();

  const genresElement = screen.getByText(/genres: action, adventure/i);
  expect(genresElement).toBeInTheDocument();

  const ratingElement = screen.getByText(/rating: 4.5/i);
  expect(ratingElement).toBeInTheDocument();
});