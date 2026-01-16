import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const FAQSection = () => {
  const faqs = [
    {
      question: "What does 'Local-First' mean?",
      answer:
        "It means your data lives on your device (in your browser's storage), not on our servers. This ensures zero latency, complete privacy, and full offline capability. We only touch your data when you choose to sync it.",
    },
    {
      question: "Is the Free plan really free forever?",
      answer:
        "Yes. The Local Personal plan is free forever. You get unlimited projects and tasks. We don't charge for local usage because it costs us nothing to host your local data.",
    },
    {
      question: "How does the Pro Cloud sync work?",
      answer:
        "When you upgrade to Pro, we enable a secure, encrypted connection between your devices. Your data is synced in real-time to our cloud database so you can access it from your phone, tablet, or another computer.",
    },
    {
      question: "Can I export my data?",
      answer:
        "Absolutely. You can export your entire workspace to a JSON file at any time from the settings menu. Your data belongs to you.",
    },
    {
      question: "Do I need an internet connection to use Taskflow?",
      answer:
        "No! Taskflow works perfectly offline. If you're on the Pro plan, changes you make offline will automatically sync the next time you connect to the internet.",
    },
  ];

  return (
    <section className="py-24 bg-black relative">
      <div className="container mx-auto px-6 max-w-3xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black mb-4 tracking-tight text-white">
            Common Questions
          </h2>
          <p className="text-lg text-zinc-400">
            Everything you need to know about the product and billing.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border border-white/10 bg-zinc-900/20 rounded-2xl px-6 data-[state=open]:bg-zinc-900/40 transition-colors"
            >
              <AccordionTrigger className="text-white hover:no-underline text-left text-base md:text-lg font-medium py-6">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-zinc-400 text-base pb-6 leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};
