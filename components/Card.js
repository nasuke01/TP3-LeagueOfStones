import { useState } from 'react';

export default function Card({ card, onClick }) {
  // J'utilise ces variables pour gérer l'affichage (image cassée et survol souris)
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // L'adresse de l'image chez Riot
  const imageUrl = `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${card.key}_0.jpg`;

  // Le style de la carte (avec l'animation de relief au survol)
  const cardStyle = {
    cursor: 'pointer',
    transition: 'all 0.3s ease', // Pour que l'animation soit fluide
    transform: isHovered ? 'translateY(-10px)' : 'translateY(0)', // La carte monte un peu
    boxShadow: isHovered 
      ? '0 15px 30px rgba(0, 0, 0, 0.7), 0 0 15px rgba(255, 215, 0, 0.3)' // Grosse ombre si souris dessus
      : '0 4px 8px rgba(0, 0, 0, 0.5)', // Ombre normale
    border: isHovered ? '1px solid #FFD700' : '1px solid #555'
  };

  return (
    <div className="col-md-3 col-6 mb-4">
      <div 
        className="card bg-black text-white h-100" 
        style={cardStyle} 
        onClick={() => onClick(card)}
        onMouseEnter={() => setIsHovered(true)} // Quand la souris entre
        onMouseLeave={() => setIsHovered(false)} // Quand la souris sort
      >
        
        {/* Gestion de l'image : si elle bug (réseau fac), je mets un carré gris */}
        {!imageError ? (
          <img 
            src={imageUrl} 
            className="card-img-top" 
            alt={card.name}
            style={{ height: '150px', objectFit: 'cover', borderBottom: '1px solid #333' }}
            onError={() => setImageError(true)} // Si l'image charge pas, on change l'état
          />
        ) : (
          // Affichage de secours (carré gris avec la 1ère lettre)
          <div 
            className="card-img-top d-flex align-items-center justify-content-center bg-secondary" 
            style={{ height: '150px', borderBottom: '1px solid #333' }}
          >
            <span className="h1 fw-bold text-white-50">{card.name.charAt(0)}</span>
          </div>
        )}

        <div className="card-body p-2 text-center">
          <h5 className="card-title fs-6 fw-bold text-uppercase mb-2">{card.name}</h5>
          
          {/* Les stats Attaque / Défense */}
          <div className="d-flex justify-content-between px-3 pb-2 small">
            <span className="text-danger fw-bold">⚔️ {card.info.attack}</span>
            <span className="text-success fw-bold">🛡️ {card.info.defense}</span>
          </div>
        </div>

      </div>
    </div>
  );
}