import CarouselToggle from "@/app/(media)/_components/carousel-toggle";
import { PersonTaggedImage, Profile } from "@/types/request-types-camelcase";
import { TaggedSlide } from "./tagged-images";
import { SlideImageCard } from "@/components/slide-image-card";

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
    <SlideImageCard
      key={item.filePath}
      unoptimized={true}
      baseUrl="/tmdb/t/p/w342"
      imagePath={item.filePath}
      alt={`profile image of ${personName}`}
      aspectClass="aspect-[2/3]"
      // className="max-h-[250px] max-w-[179px] sm:max-h-[350px] sm:max-w-full"
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
          {
            items: profileSlides,
            label: "Profile",
            breakpointType: "poster",
          },
        ]}
        title="Images"
      />
    </section>
  );
}
