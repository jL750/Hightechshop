import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import userEvent from '@testing-library/user-event';
import App from '../../App';

describe('Composant App (page par défaut Vite)', () => {

  it('affiche le titre "Vite + React"', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /vite \+ react/i })).toBeInTheDocument();
  });

  it('affiche le bouton compteur initialisé à 0', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: /count is 0/i })).toBeInTheDocument();
  });

  it('incrémente le compteur à chaque clic', async () => {
    render(<App />);
    const user = userEvent.setup();
    const btn = screen.getByRole('button', { name: /count is 0/i });

    await user.click(btn);
    expect(screen.getByRole('button', { name: /count is 1/i })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /count is 1/i }));
    expect(screen.getByRole('button', { name: /count is 2/i })).toBeInTheDocument();
  });

  it('affiche le lien vers la documentation Vite', () => {
    render(<App />);
    expect(screen.getByRole('link', { name: /vite logo/i })).toBeInTheDocument();
  });

  it('affiche le lien vers la documentation React', () => {
    render(<App />);
    expect(screen.getByRole('link', { name: /react logo/i })).toBeInTheDocument();
  });
});
