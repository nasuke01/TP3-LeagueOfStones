import { useState } from 'react';

export default function Card({ card, onClick, isDeckCard, isFinalView }) {
  // --- MES VARIABLES D'ETAT ---
  // Pour gérer si l'image ne charge pas et l'animation de la souris
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // L'URL officielle de l'image chez Riot Games
  const imageUrl = `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${card.key}_0.jpg`;

  // --- STYLE PERSONNALISE ---
  // Si c'est le deck final, je force la bordure en OR, sinon ça dépend
  const borderColor = (isDeckCard || isFinalView) ? '#FFD700' : '#0dcaf0'; 

  const cardStyle = {
    cursor: onClick ? 'pointer' : 'default', // Pas de curseur main si on ne peut plus cliquer (vue finale)
    transition: 'all 0.2s ease-out',
    transform: isHovered && onClick ? 'translateY(-5px)' : 'translateY(0)', // Animation seulement si cliquable
    boxShadow: isHovered 
      ? `0 0 15px ${borderColor}` // Effet lumineux au survol
      : '0 4px 6px rgba(0,0,0,0.5)',
    border: `1px solid ${isHovered || isFinalView ? borderColor : '#444'}`, 
    backgroundColor: '#1e2124',
    height: '100%' 
  };

  return (
    // J'adapte la largeur selon si on est dans la vue finale ou pas
    <div className={isFinalView ? "col-6 col-md-4 col-lg-3 mb-4" : "col-6 col-md-6 col-lg-4 mb-3"}>
      <div 
        className="card text-white overflow-hidden h-100" 
        style={cardStyle} 
        // Si onClick existe (mode construction), je l'active. Sinon (mode final), rien ne se passe.
        onClick={() => onClick && onClick(card)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        
        {/* --- IMAGE DU CHAMPION --- */}
        <div style={{ position: 'relative', height: '120px' }}> 
          {!imageError ? (
            <img 
              src={imageUrl} 
              className="w-100 h-100" 
              alt={card.name}
              style={{ objectFit: 'cover' }}
              onError={() => setImageError(true)}
            />
          ) : (
            // Mon bloc de secours 
            <div className="w-100 h-100 d-flex align-items-center justify-content-center bg-secondary">
              <span className="h1 fw-bold text-white-50">{card.name.charAt(0)}</span>
            </div>
          )}
          
          {/* Nom du champion en superposition */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)',
            padding: '4px'
          }}>
            <h6 className="m-0 text-center fw-bold text-uppercase small text-truncate">
              {card.name}
            </h6>
          </div>
        </div>

        {/* --- ATTRIBUTS / STATS  --- */}
        <div className="card-body p-1">
          {/* J'ai mis fontSize à 0.7rem pour que "Difficulté" tienne bien sur une ligne */}
          <div className="row g-0 text-center" style={{ fontSize: '0.7rem', fontWeight: 'bold' }}>
            <div className="col-6 text-danger">Attaque : {card.info.attack}</div>
            <div className="col-6 text-success">Défense : {card.info.defense}</div>
            <div className="col-6 text-info">Magie : {card.info.magic}</div>
            <div className="col-6 text-warning">Difficulté : {card.info.difficulty}</div>
          </div>
        </div>

      </div>
    </div>
  );
}