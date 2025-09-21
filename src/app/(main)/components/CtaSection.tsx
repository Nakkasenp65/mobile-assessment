import { Button } from "@/components/ui/button";

const CtaSection = () => (
  <section className="container mx-auto p-4">
    <div className="rounded-3xl bg-gradient-to-br from-pink-200 to-pink-300 p-12 text-center shadow-lg">
      <h3 className="text-secondary mb-2 text-xl font-bold md:text-3xl">
        ยังมีคำถามอื่นๆ อีกไหม?
      </h3>
      <p className="text-muted-foreground mb-6 text-lg">
        ทีมงานของเราพร้อมตอบทุกคำถามและให้คำปรึกษาฟรี
      </p>
      <div className="flex justify-center gap-4">
        <Button
          size="lg"
          className="from-primary to-secondary h-14 rounded-full bg-gradient-to-r px-8 text-lg"
        >
          แชทกับเรา
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="border-secondary text-secondary hover:bg-secondary h-14 rounded-full border-2 bg-white px-8 text-lg hover:text-white"
        >
          โทรสอบถาม
        </Button>
      </div>
    </div>
  </section>
);

export default CtaSection;
