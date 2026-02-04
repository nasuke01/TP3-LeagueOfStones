import { useState, useEffect } from 'react';
import Head from 'next/head';
import Card from '../components/Card';

export default function Home() {
  // Mes variables d'état pour stocker les cartes dispo et mon deck
  const [availableCards, setAvailableCards] = useState([]);
  const [deck, setDeck] = useState([]);

  // Au lancement de la page, je récupère les cartes depuis mon API locale
  useEffect(() => {
    fetch('http://localhost:3001/cards')
      .then((res) => res.json())
      .then((data) => setAvailableCards(data))
      .catch((err) => console.error("Problème avec l'API :", err));
  }, []);

  // Fonction pour ajouter une carte dans le deck (limite à 20)
  const addToDeck = (card) => {
    if (deck.length >= 20) {
      alert("Le deck est plein ! (20 cartes max)");
      return;
    }
    // J'ajoute la carte au deck et je l'enlève de la liste de gauche
    setDeck([...deck, card]);
    setAvailableCards(availableCards.filter((c) => c.id !== card.id));
  };

  // Fonction pour retirer une carte du deck
  const removeFromDeck = (card) => {
    // Je la remets dans la liste de gauche et je l'enlève du deck
    setAvailableCards([card, ...availableCards]);
    setDeck(deck.filter((c) => c.id !== card.id));
  };

  return (
    // "translate=no" pour éviter que le navigateur traduise et casse React
    <div translate="no">
      <Head>
        <title>League of Stones</title>
        {/* J'importe Bootstrap pour le design */}
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
      </Head>

      <div className="container-fluid bg-dark min-vh-100 p-3">
        
        <h1 className="text-white text-center mb-4">League of Stones</h1>

        {/* Petit message de succès quand le deck est fini */}
        {deck.length === 20 && (
          <div className="alert alert-success text-center fw-bold">
             Le deck a été validé !
          </div>
        )}

        <div className="row">
          {/* COLONNE GAUCHE : Les cartes que je peux choisir */}
          <div className="col-md-8">
            <h3 className="text-white border-bottom border-secondary pb-2 mb-3">
              Champions disponibles ({availableCards.length})
            </h3>
            <div className="row">
              {availableCards.map((card) => (
                <Card key={card.id} card={card} onClick={addToDeck} />
              ))}
            </div>
          </div>

          {/* COLONNE DROITE : Mon Deck en cours de construction */}
          <div className="col-md-4 border-start border-secondary">
            {/* sticky-top pour que le deck reste visible quand on scrolle */}
            <div className="sticky-top pt-2" style={{ top: '20px' }}>
              <h3 className="text-info border-bottom border-info pb-2 mb-3">
                Mon Deck ({deck.length} / 20)
              </h3>
              
              {deck.length === 0 && <p className="text-muted">Cliquez sur un champion pour commencer.</p>}

              <div className="row">
                {deck.map((card) => (
                  <Card key={card.id} card={card} onClick={removeFromDeck} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}