import React, { useState } from 'react';
import { getDriverSeriesColor } from '../utils/helpers';

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
  const [imageError, setImageError] = useState(true);
  
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

  // Get faint driver series colors for avatar circles

  // Convert driver name to filename format
  const getImagePath = (name: string): string => {
    return `/images/drivers/${name.toLowerCase().replace(/\s+/g, '-')}.png`;
  };

  const initials = getInitials(driverName);
  const driverColors = getDriverSeriesColor(driverName);
  const imagePath = getImagePath(driverName);

  // Test if image exists when component mounts
  React.useEffect(() => {
    const img = new Image();
    img.onload = () => setImageError(false);
    img.onerror = () => setImageError(true);
    img.src = imagePath;
  }, [imagePath]);

  return (
    <div className={`${sizeClasses[size]} ${className} relative flex-shrink-0`}>
      {!imageError ? (
        <img
          src={imagePath}
          alt={`${driverName} logo`}
          className="w-full h-full rounded-full object-cover border-2 border-gray-600"
        />
      ) : (
        <div className={`w-full h-full rounded-full ${driverColors.bgColor} flex items-center justify-center border-2 border-gray-300`}>
          <span className={`font-bold ${driverColors.textColor}`}>{initials}</span>
        </div>
      )}
    </div>
  );
};

export default DriverLogo; 