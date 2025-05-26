import React, { useState } from 'react';

interface DriverLogoProps {
  driverName: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const DriverLogo: React.FC<DriverLogoProps> = ({ 
  driverName, 
  size = 'md', 
  className = '' 
}) => {
  const [imageError, setImageError] = useState(false);
  
  // Size mappings
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-base',
    xl: 'w-20 h-20 text-lg'
  };

  // Generate initials from driver name
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Generate a consistent color based on driver name
  const getDriverColor = (name: string): string => {
    const colors = [
      'bg-red-600', 'bg-blue-600', 'bg-green-600', 'bg-yellow-600',
      'bg-purple-600', 'bg-pink-600', 'bg-indigo-600', 'bg-orange-600',
      'bg-teal-600', 'bg-cyan-600', 'bg-lime-600', 'bg-emerald-600'
    ];
    
    // Simple hash function to get consistent color for each driver
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  // Convert driver name to filename format
  const getImagePath = (name: string): string => {
    return `/images/drivers/${name.toLowerCase().replace(/\s+/g, '-')}.png`;
  };

  const initials = getInitials(driverName);
  const colorClass = getDriverColor(driverName);
  const imagePath = getImagePath(driverName);

  return (
    <div className={`${sizeClasses[size]} ${className} relative flex-shrink-0`}>
      {!imageError ? (
        <img
          src={imagePath}
          alt={`${driverName} logo`}
          className="w-full h-full rounded-full object-cover border-2 border-gray-600"
          onError={() => setImageError(true)}
          onLoad={() => setImageError(false)}
        />
      ) : (
        <div className={`w-full h-full rounded-full ${colorClass} flex items-center justify-center border-2 border-gray-600`}>
          <span className="font-bold text-white">{initials}</span>
        </div>
      )}
      
      {/* Optional racing number overlay */}
      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#7cff00] rounded-full flex items-center justify-center">
        <i className="fas fa-car text-black text-xs"></i>
      </div>
    </div>
  );
};

export default DriverLogo; 