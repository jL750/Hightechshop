const express = require('express');
const router = express.Router();
const Produit = require('../models/Produit');

// GET — tous les produits
router.get('/', async (req, res) => {
  try {
    const produits = await Produit.findAll();
    res.json(produits);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET — un produit par id
router.get('/:id', async (req, res) => {
  try {
    const produit = await Produit.findByPk(req.params.id);
    if (!produit) return res.status(404).json({ message: 'Produit non trouvé.' });
    res.json(produit);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
