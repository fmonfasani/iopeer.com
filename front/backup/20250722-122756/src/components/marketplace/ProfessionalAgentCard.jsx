import React, { useState } from 'react';
import { 
  Star, Download, Shield, Crown, Heart, ShoppingCart, 
  Eye, Play, MoreHorizontal, Zap, TrendingUp, Award
} from 'lucide-react';

const ProfessionalAgentCard = ({ agent, viewMode = 'grid' }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleInstall = () => {
    window.dispatchEvent(new CustomEvent('showNotification', {
      detail: {
        type: 'success',
        title: '✅ Instalando...',
        message: `${agent.name} se está instalando en tu workspace`
      }
    }));
    console.log('Installing agent:', agent.id);
  };

  const handleDemo = () => {
    window.dispatchEvent(new CustomEvent('showNotification', {
      detail: {
        type: 'info',
        title: '🚀 Demo Iniciado',
        message: `Probando las capacidades de ${agent.name}`
      }
    }));
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const formatPrice = (price) => {
    if (price === 'Gratis') return 'Gratis';
    if (price === 'Premium') return 'Premium';
    return price;
  };

  const getDiscountPercentage = () => {
    // Simulate discount for some premium agents
    if (agent.premium && agent.installs > 10000) {
      return Math.floor(Math.random() * 30) + 10; // 10-40% discount
    }
    return null;
  };

  const discount = getDiscountPercentage();
  const originalPrice = agent.premium ? '$99' : null;

  if (viewMode === 'list') {
    return (
      <div className="professional-card list-view">
        <div className="card-image-section">
          <div className={`agent-avatar ${agent.color}`}>
            <span className="avatar-emoji">{agent.avatar}</span>
          </div>
        </div>

        <div className="card-content-section">
          <div className="card-header">
            <div className="title-section">
              <h3 className="agent-title">{agent.name}</h3>
              <div className="badges">
                {agent.verified && (
                  <span className="badge verified">
                    <Shield size={12} />
                    Verificado
                  </span>
                )}
                {agent.premium && (
                  <span className="badge premium">
                    <Crown size={12} />
                    Premium
                  </span>
                )}
                {agent.installs > 10000 && (
                  <span className="badge bestseller">
                    <TrendingUp size={12} />
                    Más vendido
                  </span>
                )}
              </div>
            </div>
            <p className="agent-description">{agent.description}</p>
          </div>

          <div className="card-footer">
            <div className="rating-section">
              <div className="rating">
                <Star className="star-icon filled" size={14} />
                <span className="rating-value">{agent.rating}</span>
                <span className="installs">({agent.installs.toLocaleString()})</span>
              </div>
              <span className="author">por {agent.author}</span>
            </div>

            <div className="price-section">
              <div className="price-container">
                {discount && (
                  <span className="discount-badge">-{discount}%</span>
                )}
                <div className="prices">
                  {originalPrice && discount && (
                    <span className="original-price">{originalPrice}</span>
                  )}
                  <span className="current-price">{formatPrice(agent.price)}</span>
                </div>
              </div>
            </div>

            <div className="actions-section">
              <button onClick={handleInstall} className="install-button">
                <ShoppingCart size={16} />
                Instalar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="professional-card grid-view"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Card Header */}
      <div className="card-header">
        <div className="card-image">
          <div className={`agent-avatar bg-gradient-to-br ${agent.color}`}>
            <span className="avatar-emoji">{agent.avatar}</span>
          </div>
          
          {/* Overlay badges */}
          <div className="card-badges">
            {agent.verified && (
              <span className="badge verified">
                <Shield size={10} />
              </span>
            )}
            {agent.premium && (
              <span className="badge premium">
                <Crown size={10} />
              </span>
            )}
            {agent.installs > 10000 && (
              <span className="badge bestseller">
                <Award size={10} />
                Más vendido
              </span>
            )}
          </div>

          {/* Action buttons overlay */}
          <div className={`card-actions ${isHovered ? 'visible' : ''}`}>
            <button
              onClick={handleLike}
              className={`action-button ${isLiked ? 'liked' : ''}`}
            >
              <Heart size={14} fill={isLiked ? 'currentColor' : 'none'} />
            </button>
            {agent.demo && (
              <button onClick={handleDemo} className="action-button">
                <Play size={14} />
              </button>
            )}
            <button className="action-button">
              <Eye size={14} />
            </button>
          </div>

          {/* Discount badge */}
          {discount && (
            <div className="discount-corner">
              <span>-{discount}%</span>
            </div>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="card-content">
        <div className="content-header">
          <h3 className="agent-title">{agent.name}</h3>
          <p className="agent-description">{agent.description}</p>
        </div>

        {/* Rating and Stats */}
        <div className="card-stats">
          <div className="rating-container">
            <div className="rating">
              <Star className="star-icon" size={12} fill="currentColor" />
              <span className="rating-value">{agent.rating}</span>
            </div>
            <span className="installs">({agent.installs > 1000 ? `${Math.floor(agent.installs/1000)}k` : agent.installs})</span>
          </div>
          <span className="author">por {agent.author}</span>
        </div>

        {/* Tags */}
        <div className="tags-container">
          {agent.tags.slice(0, 3).map(tag => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
          {agent.tags.length > 3 && (
            <span className="tag more">+{agent.tags.length - 3}</span>
          )}
        </div>

        {/* Price Section */}
        <div className="price-section">
          <div className="price-container">
            {originalPrice && discount && (
              <span className="original-price">{originalPrice}</span>
            )}
            <span className="current-price">{formatPrice(agent.price)}</span>
            {agent.premium && !agent.price.includes('$') && (
              <span className="price-note">desde $29/mes</span>
            )}
          </div>
          
          {!agent.premium && (
            <span className="free-badge">
              <Zap size={12} />
              Gratis
            </span>
          )}
        </div>

        {/* Action Button */}
        <button onClick={handleInstall} className="install-button">
          <ShoppingCart size={16} />
          <span>Instalar ahora</span>
          {agent.premium && (
            <span className="button-note">Prueba gratis</span>
          )}
        </button>

        {/* Secondary Actions */}
        <div className="secondary-actions">
          {agent.demo && (
            <button onClick={handleDemo} className="demo-button">
              <Play size={14} />
              Ver demo
            </button>
          )}
          <button className="details-button">
            Más detalles
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalAgentCard;
