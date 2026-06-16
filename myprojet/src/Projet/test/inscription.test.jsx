import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Inscription from '../Inscription';

// ── Helpers ───────────────────────────────────────────────────────────────────

const renderInscription = () =>
  render(
    <MemoryRouter>
      <Inscription />
    </MemoryRouter>
  );

// Remplit tous les champs avec des valeurs valides
const remplirFormulaire = async (user, overrides = {}) => {
  const valeurs = {
    nom:             'Dupont',
    prenom:          'Jean',
    email:           'jean@exemple.com',
    password:        'MonSuperMot2passe!2025',
    confirmPassword: 'MonSuperMot2passe!2025',
    ...overrides,
  };

  if (valeurs.nom)             await user.type(screen.getByPlaceholderText('Nom'), valeurs.nom);
  if (valeurs.prenom)          await user.type(screen.getByPlaceholderText('Prénom'), valeurs.prenom);
  if (valeurs.email)           await user.type(screen.getByPlaceholderText('E-mail'), valeurs.email);
  if (valeurs.password)        await user.type(screen.getByPlaceholderText('Mot de passe'), valeurs.password);
  if (valeurs.confirmPassword) await user.type(screen.getByPlaceholderText('Confirmer le mot de passe'), valeurs.confirmPassword);
};

beforeEach(() => {
  vi.clearAllMocks();
  global.fetch = vi.fn();
});

afterEach(() => {
  vi.restoreAllMocks();
});

// ─────────────────────────────────────────────────────────────────────────────

describe('Page d\'inscription', () => {

  // ── SCÉNARIO 1 : Rendu initial ────────────────────────────────────────────

  it('affiche le formulaire avec tous les champs vides au chargement', () => {
    renderInscription();

    expect(screen.getByPlaceholderText('Nom')).toHaveValue('');
    expect(screen.getByPlaceholderText('Prénom')).toHaveValue('');
    expect(screen.getByPlaceholderText('E-mail')).toHaveValue('');
    expect(screen.getByPlaceholderText('Mot de passe')).toHaveValue('');
    expect(screen.getByPlaceholderText('Confirmer le mot de passe')).toHaveValue('');
    expect(screen.getByRole('button', { name: /s'inscrire/i })).toBeInTheDocument();
  });

  it('affiche le titre "Créer un compte"', () => {
    renderInscription();
    expect(screen.getByRole('heading', { name: /créer un compte/i })).toBeInTheDocument();
  });

  // ── SCÉNARIO 2 : Soumission avec champs vides ────────────────────────────

  it('refuse la soumission si tous les champs sont vides', async () => {
    renderInscription();
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: /s'inscrire/i }));

    expect(await screen.findByText(/Veuillez remplir tous les champs/i)).toBeInTheDocument();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  // ── SCÉNARIO 3 : Validation mot de passe — longueur ──────────────────────

  it('refuse un mot de passe de moins de 12 caractères', async () => {
    renderInscription();
    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText('Mot de passe'), 'abc');

    expect(await screen.findByText(/12 caractères minimum/i)).toBeInTheDocument();
  });

  it('n\'affiche pas d\'erreur de longueur avec un mot de passe de 12 caractères ou plus', async () => {
    renderInscription();
    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText('Mot de passe'), 'MonSuperMot2passe!2025');

    expect(screen.queryByText(/12 caractères minimum/i)).not.toBeInTheDocument();
  });

  // ── SCÉNARIO 3b : Validation mot de passe — majuscule ────────────────────

  it('affiche une erreur si le mot de passe n\'a pas de majuscule', async () => {
    renderInscription();
    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText('Mot de passe'), 'monmotdepasse1!');

    expect(await screen.findByText(/au moins une majuscule/i)).toBeInTheDocument();
  });

  it('refuse la soumission si le mot de passe n\'a pas de majuscule', async () => {
    renderInscription();
    const user = userEvent.setup();

    await remplirFormulaire(user, {
      password:        'monmotdepasse1!',
      confirmPassword: 'monmotdepasse1!',
    });
    await user.click(screen.getByRole('button', { name: /s'inscrire/i }));

    expect(await screen.findByText(/au moins une majuscule/i)).toBeInTheDocument();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  // ── SCÉNARIO 3c : Validation mot de passe — chiffre ──────────────────────

  it('affiche une erreur si le mot de passe n\'a pas de chiffre', async () => {
    renderInscription();
    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText('Mot de passe'), 'MonMotDePasse!');

    expect(await screen.findByText(/au moins un chiffre/i)).toBeInTheDocument();
  });

  it('refuse la soumission si le mot de passe n\'a pas de chiffre', async () => {
    renderInscription();
    const user = userEvent.setup();

    await remplirFormulaire(user, {
      password:        'MonMotDePasse!',
      confirmPassword: 'MonMotDePasse!',
    });
    await user.click(screen.getByRole('button', { name: /s'inscrire/i }));

    expect(await screen.findByText(/au moins un chiffre/i)).toBeInTheDocument();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  // ── SCÉNARIO 3d : Validation mot de passe — caractère spécial ────────────

  it('affiche une erreur si le mot de passe n\'a pas de caractère spécial', async () => {
    renderInscription();
    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText('Mot de passe'), 'MonMotDePasse1');

    expect(await screen.findByText(/au moins un caractère spécial/i)).toBeInTheDocument();
  });

  it('refuse la soumission si le mot de passe n\'a pas de caractère spécial', async () => {
    renderInscription();
    const user = userEvent.setup();

    await remplirFormulaire(user, {
      password:        'MonMotDePasse1',
      confirmPassword: 'MonMotDePasse1',
    });
    await user.click(screen.getByRole('button', { name: /s'inscrire/i }));

    expect(await screen.findByText(/au moins un caractère spécial/i)).toBeInTheDocument();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  // ── SCÉNARIO 3e : Mot de passe valide (toutes règles respectées) ──────────

  it('n\'affiche aucune erreur avec un mot de passe valide', async () => {
    renderInscription();
    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText('Mot de passe'), 'MonMot2Passe!');

    expect(screen.queryByText(/12 caractères minimum/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/au moins une majuscule/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/au moins un chiffre/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/au moins un caractère spécial/i)).not.toBeInTheDocument();
  });

  // ── SCÉNARIO 4 : Validation mot de passe — champ vide ────────────────────

  it('affiche une erreur si le champ mot de passe est vidé après saisie', async () => {
    renderInscription();
    const user = userEvent.setup();
    const pwInput = screen.getByPlaceholderText('Mot de passe');

    await user.type(pwInput, 'MonSuperMotDePasse!');
    await user.clear(pwInput);

    expect(await screen.findByText(/Le mot de passe est requis/i)).toBeInTheDocument();
  });

  // ── SCÉNARIO 5 : Mots de passe non identiques ────────────────────────────

  it('affiche une erreur si les mots de passe ne correspondent pas (à la saisie)', async () => {
    renderInscription();
    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText('Mot de passe'), 'MonSuperMot2passe!2025');
    await user.type(screen.getByPlaceholderText('Confirmer le mot de passe'), 'MotDifferent!2025');

    expect(await screen.findByText(/Les mots de passe ne correspondent pas/i)).toBeInTheDocument();
  });

  it('refuse la soumission si les mots de passe ne correspondent pas', async () => {
    renderInscription();
    const user = userEvent.setup();

    await remplirFormulaire(user, { confirmPassword: 'MotDifferent!2025' });
    await user.click(screen.getByRole('button', { name: /s'inscrire/i }));

    // Le message apparaît deux fois : erreur inline + erreur globale de soumission
    const erreurs = await screen.findAllByText(/Les mots de passe ne correspondent pas/i);
    expect(erreurs.length).toBeGreaterThanOrEqual(1);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  // ── SCÉNARIO 6 : Validation nom / prénom ─────────────────────────────────

  it('affiche une erreur si le nom contient des chiffres', async () => {
    renderInscription();
    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText('Nom'), 'Jean123');

    expect(await screen.findByText(/Le nom ne doit contenir que des lettres/i)).toBeInTheDocument();
  });

  it('affiche une erreur si le champ nom est vidé après saisie', async () => {
    renderInscription();
    const user = userEvent.setup();
    const nomInput = screen.getByPlaceholderText('Nom');

    await user.type(nomInput, 'Dupont');
    await user.clear(nomInput);

    expect(await screen.findByText(/Le nom est requis/i)).toBeInTheDocument();
  });

  // ── SCÉNARIO 7 : Inscription réussie ─────────────────────────────────────

  it('affiche le message de succès après une inscription valide', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Compte créé avec succès.' }),
    });

    renderInscription();
    const user = userEvent.setup();

    await remplirFormulaire(user);
    await user.click(screen.getByRole('button', { name: /s'inscrire/i }));

    expect(await screen.findByText(/Inscription réussie/i)).toBeInTheDocument();
    expect(screen.queryByText(/12 caractères minimum/i)).not.toBeInTheDocument();
  });

  it('vide les champs après une inscription réussie', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Compte créé avec succès.' }),
    });

    renderInscription();
    const user = userEvent.setup();

    await remplirFormulaire(user);
    await user.click(screen.getByRole('button', { name: /s'inscrire/i }));

    await screen.findByText(/Inscription réussie/i);
    expect(screen.getByPlaceholderText('Nom')).toHaveValue('');
    expect(screen.getByPlaceholderText('E-mail')).toHaveValue('');
  });

  // ── SCÉNARIO 8 : Erreur serveur ──────────────────────────────────────────

  it('affiche le message d\'erreur du serveur (ex: email déjà utilisé)', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Cet email est déjà utilisé.' }),
    });

    renderInscription();
    const user = userEvent.setup();

    await remplirFormulaire(user);
    await user.click(screen.getByRole('button', { name: /s'inscrire/i }));

    expect(await screen.findByText(/Cet email est déjà utilisé/i)).toBeInTheDocument();
  });

  it('affiche une erreur si le serveur est inaccessible', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network error'));

    renderInscription();
    const user = userEvent.setup();

    await remplirFormulaire(user);
    await user.click(screen.getByRole('button', { name: /s'inscrire/i }));

    expect(await screen.findByText(/Erreur serveur/i)).toBeInTheDocument();
  });

  // ── SCÉNARIO 9 : Protection XSS ──────────────────────────────────────────

  it('bloque une tentative d\'injection XSS dans le nom', async () => {
    renderInscription();
    const user = userEvent.setup();

    await remplirFormulaire(user, { nom: '<script>alert(1)</script>' });
    await user.click(screen.getByRole('button', { name: /s'inscrire/i }));

    expect(await screen.findByText(/Caractères non autorisés détectés/i)).toBeInTheDocument();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  // ── SCÉNARIO 10 : Navigation vers connexion ───────────────────────────────

  it('affiche un lien vers la page de connexion', () => {
    renderInscription();
    expect(screen.getByRole('link', { name: /se connecter/i })).toBeInTheDocument();
  });
});
