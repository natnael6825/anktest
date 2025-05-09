import PropTypes from "prop-types";
import { Typography } from "@material-tailwind/react";
import { useEffect, useState } from "react";

export function InfoCard({ title, count: targetCount, icon, bgColor }) {
  const [currentCount, setCurrentCount] = useState(1);

  // Function to format the number
  const formatNumber = (number) => {
    if (number >= 1000000) {
      return `${(number / 1000000).toFixed(1)}M`;
    } else if (number >= 1000) {
      return `${(number / 1000).toFixed(1)}K`;
    } else if (number >= 100) {
      return Math.ceil(number / 100) * 100;
    }
    return number;
  };

  useEffect(() => {
    let intervalId;

    // Determine the step size and interval duration based on the magnitude of the targetCount
    const calculateStepAndInterval = () => {
      if (targetCount >= 1000000) {
        return { step: Math.ceil(targetCount / 200), interval: 15 }; // Fast for millions
      } else if (targetCount >= 1000) {
        return { step: Math.ceil(targetCount / 100), interval: 25 }; // Medium for thousands
      } else {
        return { step: Math.ceil(targetCount / 50), interval: 35 }; // Slow for hundreds
      }
    };

    const { step, interval } = calculateStepAndInterval();

    // Function to animate the count
    const animateCount = () => {
      if (currentCount < targetCount) {
        setCurrentCount((prevCount) => Math.min(prevCount + step, targetCount));
      } else {
        clearInterval(intervalId); // Stop when we reach the target
      }
    };

    // Start the animation
    intervalId = setInterval(animateCount, interval);

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, [targetCount, currentCount]);

  return (
    <div className="flex items-center gap-4 flex-1">
      <div className={`h-16 w-16 rounded-full flex items-center justify-center ${bgColor}`}>
      {icon.startsWith("/") ? (
          <img
            src={icon}
            alt={title}
            className="h-20 w-20 text-white" // Adjust size as needed
          />
        ) : (
          <i className={`${icon} text-white text-2xl`} />
        )}
      </div>
      <div>
        <Typography variant="h5" className="font-bold">
          Over {formatNumber(currentCount)}
        </Typography>
        <Typography className="text-gray-500">{title}</Typography>
      </div>
    </div>
  );
}

InfoCard.propTypes = {
  title: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired, // Ensure count is a number
  icon: PropTypes.string.isRequired,
  bgColor: PropTypes.string.isRequired,
};

InfoCard.displayName = "/src/widgets/layout/feature-card.jsx";
export default InfoCard;
