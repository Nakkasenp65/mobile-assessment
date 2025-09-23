import { Button } from "@/components/ui/button";
import FramerButton from "../../../components/ui/framer/FramerButton";

const CtaSection = () => (
  <section className="container mx-auto p-4">
    <div className="rounded-3xl bg-gradient-to-br from-pink-200 to-pink-300 p-6 text-center shadow-lg md:p-12">
      <h3 className="text-secondary mb-2 text-xl font-bold md:text-3xl">
        ยังมีคำถามอื่นๆ อีกไหม?
      </h3>
      <p className="text-muted-foreground mb-6 text-lg">
        ทีมงานของเราพร้อมตอบทุกคำถามและให้คำปรึกษาฟรี
      </p>
      <div className="flex justify-center gap-4">
        <FramerButton
          size="lg"
          className="from-primary to-secondary h-14 rounded-full bg-gradient-to-r px-2 text-xs md:px-8 md:text-lg"
        >
          แชทกับเรา
        </FramerButton>
        <FramerButton
          size="lg"
          variant="outline"
          className="border-secondary text-secondary hover:bg-secondary h-14 rounded-full border-2 bg-white text-xs hover:text-white md:px-8 md:text-lg"
        >
          โทรสอบถาม
        </FramerButton>
      </div>
    </div>
  </section>
);

export default CtaSection;
