import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const images = [
  "https://via.placeholder.com/400",
  "https://via.placeholder.com/401",
  "https://via.placeholder.com/402",
];

const ImageSlideshow = () => {
  const [index, setIndex] = useState(0);

  return (
    <Card>
      <CardHeader className="font-bold text-lg">Image Slideshow</CardHeader>
      <CardContent className="space-y-4 text-center">
        <img src={images[index]} className="mx-auto rounded" />

        <div className="flex justify-center gap-4">
          <Button
            onClick={() => setIndex((index - 1 + images.length) % images.length)}
          >
            Previous
          </Button>
          <Button
            onClick={() => setIndex((index + 1) % images.length)}
          >
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ImageSlideshow;
