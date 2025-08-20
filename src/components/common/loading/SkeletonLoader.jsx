import React from 'react';
import PropTypes from 'prop-types';
import styles from '@/styles/SkeletonLoader.module.css'; // Adjust the path as needed

const LoadingSkeleton = ({ 
  height, 
  width, 
  count, 
  circle, 
  rounded, 
  className, 
  style 
}) => {
  // If count is specified, return multiple skeletons
  if (count && count > 1) {
    return (
      <div className={styles.skeletonContainer}>
        {[...Array(count)].map((_, i) => (
          <LoadingSkeleton 
            key={i} 
            height={height} 
            width={width} 
            circle={circle} 
            rounded={rounded} 
            className={className} 
            style={style}
          />
        ))}
      </div>
    );
  }

  const skeletonStyle = {
    height: height || '1rem',
    width: width || '100%',
    borderRadius: circle ? '50%' : rounded ? '0.5rem' : '0.25rem',
    ...style
  };

  return (
    <div 
      className={`${styles.skeleton} ${className || ''}`}
      style={skeletonStyle}
      aria-label="Loading content..."
      role="status"
    />
  );
};

LoadingSkeleton.propTypes = {
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  count: PropTypes.number,
  circle: PropTypes.bool,
  rounded: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object
};

// Pre-configured skeleton variants for common use cases
LoadingSkeleton.PropertyCard = () => (
  <div className="space-y-4">
    <LoadingSkeleton height="200px" rounded />
    <div className="space-y-2">
      <LoadingSkeleton height="24px" width="80%" />
      <LoadingSkeleton height="16px" width="60%" />
      <div className="flex gap-2">
        <LoadingSkeleton height="16px" width="40px" />
        <LoadingSkeleton height="16px" width="40px" />
      </div>
      <LoadingSkeleton height="20px" width="50%" />
    </div>
  </div>
);

LoadingSkeleton.Hero = () => (
  <div className="w-full">
    <LoadingSkeleton height="80vh" rounded={false} />
  </div>
);

LoadingSkeleton.Testimonial = () => (
  <div className="space-y-4 p-4">
    <div className="flex items-center gap-3">
      <LoadingSkeleton circle height="48px" width="48px" />
      <div className="flex-1 space-y-2">
        <LoadingSkeleton height="20px" width="70%" />
        <LoadingSkeleton height="16px" width="50%" />
      </div>
    </div>
    <LoadingSkeleton height="16px" count={3} />
  </div>
);

LoadingSkeleton.ExperienceCard = () => (
  <div className="space-y-3 text-center p-4">
    <LoadingSkeleton circle height="48px" width="48px" className="mx-auto" />
    <LoadingSkeleton height="20px" width="80%" className="mx-auto" />
    <LoadingSkeleton height="16px" width="90%" className="mx-auto" />
  </div>
);

export default LoadingSkeleton;