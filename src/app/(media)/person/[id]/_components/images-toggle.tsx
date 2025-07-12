import CarouselToggle from "@/app/(media)/_components/carousel-toggle";
import { PersonTaggedImage, Profile } from "@/types/request-types-camelcase";
import { TaggedSlide } from "./tagged-images";
import Image from "next/image";
import { BASE_PROFILE_IMAGE_URL } from "@/lib/constants";

export default function ImagesToggleSection({
  taggedImages,
  profileImages,
  showIdMap,
  personName,
}: {
  taggedImages: PersonTaggedImage[];
  profileImages: Profile[];
  showIdMap: Map<number, string>;
  personName: string;
}) {
  const taggedImageSlides = taggedImages.map((item) => (
    <TaggedSlide
      key={item.id ?? item.filePath}
      item={item}
      showIdMap={showIdMap}
    />
  ));

  const profileSlides = profileImages?.map((item, index) => (
    <Image
      src={`${BASE_PROFILE_IMAGE_URL}${item.filePath}`}
      width={228}
      height={342}
      alt={`tagged image of ${personName}`}
      unoptimized
      className="rounded-lg"
      key={index}
    />
  ));
  if (!taggedImages.length || !profileImages.length) return;
  return (
    <section className="media-card">
      <CarouselToggle
        options={[
          {
            items: taggedImageSlides,
            label: "Tagged",
            breakpointType: "backdrop",
          },
          { items: profileSlides, label: "Profile", breakpointType: "poster" },
        ]}
        title="Images"
      />
    </section>
  );
}
