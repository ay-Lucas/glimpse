import Metric from "./metric";
import CertifiedFreshTomato from "@/assets/Certified_Fresh_2018.svg";
import FreshTomato from "@/assets/Rotten_Tomatoes.svg";
import RottenTomato from "@/assets/Rotten_Tomatoes_rotten.svg";

/*
 * Converts TomatoMeter score (0–100) to a label and icon
 */
function getTomatoMeterType(tomatoMeter: number) {
  if (tomatoMeter >= 75 && tomatoMeter <= 100) {
    return {
      svg: <CertifiedFreshTomato height={30} width={30} />,
      label: "Certified Fresh",
    };
  } else if (tomatoMeter >= 60 && tomatoMeter <= 100) {
    return {
      svg: <FreshTomato height={30} width={30} />,
      label: "Fresh",
    };
  } else {
    return {
      svg: <RottenTomato height={25} width={25} />,
      label: "Rotten",
    };
  }
}

export default function RottenTomatoesRating({
  title,
  score,
}: {
  title: string;
  score: number;
}) {
  const RottenTomatoesSearchUrl = `https://www.rottentomatoes.com/search?search=${encodeURIComponent(
    title
  )}`;
  return (
    <Metric
      href={RottenTomatoesSearchUrl}
      Icon={getTomatoMeterType(score).svg}
      value={`${score}%`}
    />
  );
}
