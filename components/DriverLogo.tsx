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

  // Custom driver color mapping based on user's specific groupings
  const getDriverColor = (name: string): string => {
    const driverColors: { [key: string]: string } = {
      // Red Group
      'Kyle Larson': 'bg-red-600',
      'Alex Bowman': 'bg-red-600', 
      'Ross Chastain': 'bg-red-600',
      'Daniel Suarez': 'bg-red-600',
      'Austin Dillon': 'bg-red-600',
      
      // Blue Group
      'Connor Zilisch': 'bg-blue-600',
      'Carson Kvapil': 'bg-blue-600',
      'Austin Hill': 'bg-blue-600',
      'Jesse Love': 'bg-blue-600',
      'Nick Sanchez': 'bg-blue-600',
      'Daniel Dye': 'bg-blue-600',
      
      // Green Group
      'Grant Enfinger': 'bg-green-600',
      'Daniel Hemric': 'bg-green-600',
      'Connor Mosack': 'bg-green-600',
      'Kaden Honeycutt': 'bg-green-600',
      'Rajah Caruth': 'bg-green-600',
      'Andres Perez': 'bg-green-600',
      'Matt Mills': 'bg-green-600',
      'Dawson Sutton': 'bg-green-600',
      
      // White Group
      'Tristan McKee': 'bg-white',
      'Helio Meza': 'bg-white',
      'Corey Day': 'bg-white',
      'Ben Maier': 'bg-white',
      'Tyler Reif': 'bg-white',
      'Brenden Queen': 'bg-white'
    };
    
    // Return specific color for driver, or fallback to a default
    return driverColors[name] || 'bg-gray-600';
  };

  // Convert driver name to filename format
  const getImagePath = (name: string): string => {
    return `/images/drivers/${name.toLowerCase().replace(/\s+/g, '-')}.png`;
  };

  const initials = getInitials(driverName);
  const colorClass = getDriverColor(driverName);
  const imagePath = getImagePath(driverName);
  
  // Determine text color based on background color
  const textColor = colorClass === 'bg-white' ? 'text-black' : 'text-white';

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
          <span className={`font-bold ${textColor}`}>{initials}</span>
        </div>
      )}
    </div>
  );
};

export default DriverLogo; 