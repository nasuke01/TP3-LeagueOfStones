import { useState, useEffect } from 'react';
import Head from 'next/head';
import Card from '../components/Card';

export default function Home() {
  // --- MES VARIABLES D'ETAT ---
  const [availableCards, setAvailableCards] = useState([]);
  const [deck, setDeck] = useState([]);
  // Cet état me sert à savoir si on a fini de choisir
  const [isDeckValidated, setIsDeckValidated] = useState(false);

  // Je récupère les champions depuis mon API locale au démarrage
  useEffect(() => {
    fetch('http://localhost:3001/cards')
      .then((res) => res.json())
      .then((data) => setAvailableCards(data))
      .catch((err) => console.error("Erreur de connexion API:", err));
  }, []);

  // --- MES FONCTIONS DE GESTION ---

  const addToDeck = (card) => {
    // Je vérifie qu'on ne dépasse pas 20 cartes
    if (deck.length >= 20) {
      alert("Votre deck est complet (20 cartes max) !");
      return;
    }
    setDeck([...deck, card]);
    // Je retire la carte des 'disponibles' pour pas la choisir 2 fois
    setAvailableCards(availableCards.filter((c) => c.id !== card.id));
  };

  const removeFromDeck = (card) => {
    // Si on clique sur une carte du deck, elle retourne à gauche
    setAvailableCards([card, ...availableCards]);
    setDeck(deck.filter((c) => c.id !== card.id));
  };

  // C'est ici que je valide le deck final
  const handleValidateDeck = () => {
    setIsDeckValidated(true);
    // Je remonte en haut de page pour bien voir le résultat
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div translate="no">
      <Head>
        <title>League of Stones - Builder</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
      </Head>

      {/* SCENARIO 1 : LE DECK EST VALIDÉ
      */}
      {isDeckValidated ? (
        <div className="min-vh-100 bg-dark text-white p-5">
          <div className="container">
            {/* Le titre de victoire */}
            <div className="text-center mb-5">
              <h1 className="display-4 fw-bold text-success mb-3">
                 Le deck a été validé !
              </h1>
              <p className="lead text-white-50">Voici votre sélection finale de 20 champions.</p>
            </div>

            {/* La grille des 20 cartes */}
            <div className="row">
              {deck.map((card) => (
                <Card 
                  key={card.id} 
                  card={card} 
                  // Je ne passe pas de 'onClick' ici car on ne peut plus modifier
                  isFinalView={true} 
                />
              ))}
            </div>

            {/* Un petit bouton pour recommencer si besoin */}
            <div className="text-center mt-5">
              <button 
                className="btn btn-outline-secondary" 
                onClick={() => window.location.reload()}
              >
                Recommencer une partie
              </button>
            </div>
          </div>
        </div>
      ) : (

      /* SCENARIO 2 : EN COURS DE CONSTRUCTION
      */
        <div className="d-flex flex-column flex-md-row min-vh-100 bg-dark text-white">
          
          {/* COLONNE GAUCHE : CHAMPIONS DISPOS */}
          <div className="col-md-8 p-3" style={{ backgroundColor: '#121212' }}>
            <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom border-secondary">
              <h2 className="fw-bold m-0">
                <span className="text-info">Champions</span> Disponibles
              </h2>
              <span className="badge bg-secondary">{availableCards.length}</span>
            </div>

            <div className="row g-2">
              {availableCards.map((card) => (
                <Card 
                  key={card.id} 
                  card={card} 
                  onClick={addToDeck} 
                  isDeckCard={false} 
                />
              ))}
            </div>
          </div>

          {/* COLONNE DROITE : MON DECK */}
          <div className="col-md-4 p-3 d-flex flex-column border-start border-dark" 
               style={{ backgroundColor: '#1e1b4b', boxShadow: '-5px 0 15px rgba(0,0,0,0.5)' }}>
            
            <div className="mb-3 d-flex justify-content-between align-items-center">
              <h2 className="fw-bold text-warning m-0">Mon Deck</h2>
              <span className={`badge ${deck.length === 20 ? 'bg-success' : 'bg-warning text-dark'}`}>
                {deck.length} / 20
              </span>
            </div>

            {/* Bouton de validation (Visible seulement si 20 cartes) */}
            {deck.length === 20 && (
              <button 
                onClick={handleValidateDeck}
                className="btn btn-warning w-100 fw-bold mb-3 shadow-lg text-uppercase py-2"
                style={{ letterSpacing: '2px' }}
              >
                ✓ Valider le Deck
              </button>
            )}

            {/* Liste des cartes choisies */}
            <div className="row g-2 overflow-auto" style={{ maxHeight: '85vh' }}>
              {deck.map((card) => (
                <Card 
                  key={card.id} 
                  card={card} 
                  onClick={removeFromDeck} 
                  isDeckCard={true} 
                />
              ))}
            </div>
            
            {deck.length === 0 && (
              <p className="text-white-50 text-center mt-5 fst-italic">
                Sélectionnez 20 champions à gauche.
              </p>
            )}

          </div>
        </div>
      )}
    </div>
  );
}