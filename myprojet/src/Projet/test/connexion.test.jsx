import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Connexion from '../Connexion';
import { UserContext } from '../Context/UserContext';

// ── Helpers ───────────────────────────────────────────────────────────────────

const mockLogin = vi.fn();

// Injecte le UserContext manuellement pour éviter les appels fetch du UserProvider
const renderConnexion = () =>
  render(
    <MemoryRouter>
      <UserContext.Provider value={{ user: null, login: mockLogin }}>
        <Connexion />
      </UserContext.Provider>
    </MemoryRouter>
  );

beforeEach(() => {
  vi.clearAllMocks();
  global.fetch = vi.fn();
});

afterEach(() => {
  vi.restoreAllMocks();
});

// ─────────────────────────────────────────────────────────────────────────────

describe('Page de connexion', () => {

  // ── SCÉNARIO 1 : Rendu initial ────────────────────────────────────────────

  it('affiche le formulaire avec tous les champs vides au chargement', () => {
    renderConnexion();

    expect(screen.getByPlaceholderText('E-mail')).toHaveValue('');
    expect(screen.getByPlaceholderText('Mot de passe')).toHaveValue('');
    expect(screen.getByRole('button', { name: /se connecter/i })).toBeInTheDocument();
  });

  it('affiche le titre "Connexion"', () => {
    renderConnexion();
    expect(screen.getByRole('heading', { name: /connexion/i })).toBeInTheDocument();
  });

  // ── SCÉNARIO 2 : Soumission avec champs vides ────────────────────────────

  it('refuse la soumission si les deux champs sont vides', async () => {
    renderConnexion();
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: /se connecter/i }));

    expect(await screen.findByText(/Veuillez remplir tous les champs/i)).toBeInTheDocument();
    expect(mockLogin).not.toHaveBeenCalled();
  });

  // ── SCÉNARIO 3 : Validation email ────────────────────────────────────────

  it('affiche une erreur si l\'email ne contient pas de @', async () => {
    renderConnexion();
    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText('E-mail'), 'abcgmail.com');

    expect(await screen.findByText(/Adresse e-mail invalide/i)).toBeInTheDocument();
  });

  it('affiche une erreur si l\'email n\'a pas de point dans le domaine', async () => {
    renderConnexion();
    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText('E-mail'), 'abc@gmailcom');

    expect(await screen.findByText(/Adresse e-mail invalide/i)).toBeInTheDocument();
  });

  it('affiche une erreur si le champ email est vidé après saisie', async () => {
    renderConnexion();
    const user = userEvent.setup();
    const emailInput = screen.getByPlaceholderText('E-mail');

    await user.type(emailInput, 'test@test.com');
    await user.clear(emailInput);

    expect(await screen.findByText(/L'email est requis/i)).toBeInTheDocument();
  });

  // ── SCÉNARIO 4 : Validation mot de passe ─────────────────────────────────

  it('affiche une erreur si le mot de passe fait moins de 8 caractères', async () => {
    renderConnexion();
    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText('Mot de passe'), 'abc');

    expect(await screen.findByText(/8 caractères minimum/i)).toBeInTheDocument();
  });

  it('affiche une erreur si le champ mot de passe est vidé après saisie', async () => {
    renderConnexion();
    const user = userEvent.setup();
    const pwInput = screen.getByPlaceholderText('Mot de passe');

    await user.type(pwInput, 'monmotdepasse');
    await user.clear(pwInput);

    expect(await screen.findByText(/Le mot de passe est requis/i)).toBeInTheDocument();
  });

  // ── SCÉNARIO 5 : Identifiants incorrects (réponse serveur) ───────────────

  it('affiche l\'erreur du serveur si les identifiants sont incorrects', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Email ou mot de passe incorrect.' }),
    });

    renderConnexion();
    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText('E-mail'), 'wrong@test.com');
    await user.type(screen.getByPlaceholderText('Mot de passe'), 'wrongpassword');
    await user.click(screen.getByRole('button', { name: /se connecter/i }));

    expect(await screen.findByText(/Email ou mot de passe incorrect/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText('E-mail')).toHaveValue('wrong@test.com');
    expect(mockLogin).not.toHaveBeenCalled();
  });

  // ── SCÉNARIO 6 : Connexion réussie ───────────────────────────────────────

  it('appelle login et affiche le message de succès avec des identifiants valides', async () => {
    const fakeUser = { idUser: 1, nom: 'Doe', prenom: 'John', role: 'client' };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ user: fakeUser, accessToken: 'fake-access-token' }),
    });

    renderConnexion();
    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText('E-mail'), 'abc@gmail.com');
    await user.type(screen.getByPlaceholderText('Mot de passe'), 'MonSuperMot2passe!2025');
    await user.click(screen.getByRole('button', { name: /se connecter/i }));

    expect(await screen.findByText(/Connexion réussie/i)).toBeInTheDocument();
    expect(mockLogin).toHaveBeenCalledWith(fakeUser, 'fake-access-token');
    expect(screen.queryByText(/Au moins/i)).not.toBeInTheDocument();
  });

  // ── SCÉNARIO 7 : Erreur réseau ───────────────────────────────────────────

  it('affiche une erreur si le serveur est inaccessible', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network error'));

    renderConnexion();
    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText('E-mail'), 'abc@gmail.com');
    await user.type(screen.getByPlaceholderText('Mot de passe'), 'MonSuperMot2passe!2025');
    await user.click(screen.getByRole('button', { name: /se connecter/i }));

    expect(await screen.findByText(/Erreur serveur/i)).toBeInTheDocument();
    expect(mockLogin).not.toHaveBeenCalled();
  });

  // ── SCÉNARIO 8 : Navigation vers inscription ──────────────────────────────

  it('affiche un lien vers la page d\'inscription', () => {
    renderConnexion();
    expect(screen.getByRole('link', { name: /s'inscrire/i })).toBeInTheDocument();
  });

  // ── SCÉNARIO 9 : Protection XSS ──────────────────────────────────────────

  it('bloque une tentative d\'injection XSS dans l\'email', async () => {
    renderConnexion();
    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText('E-mail'), '<script>alert(1)</script>@test.com');
    await user.type(screen.getByPlaceholderText('Mot de passe'), 'monmotdepasse');
    await user.click(screen.getByRole('button', { name: /se connecter/i }));

    expect(await screen.findByText(/Caractères non autorisés détectés/i)).toBeInTheDocument();
    expect(global.fetch).not.toHaveBeenCalled();
    expect(mockLogin).not.toHaveBeenCalled();
  });
});
