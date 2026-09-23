import AnimatedHeading from '@/components/AnimatedHeading';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { usePage } from '@inertiajs/react';

export default function FAQSection({ faqs }) {
    const { appSettings } = usePage().props as { appSettings: Record<string, string> };
    const mid = Math.ceil(faqs.length / 2);
    const leftFaqs = faqs.slice(0, mid);
    const rightFaqs = faqs.slice(mid);

    return (
        <div className="container mx-auto bg-gray-50 py-10">
            <AnimatedHeading className="mb-1 justify-center text-center text-3xl font-bold">{appSettings?.faq_heading}</AnimatedHeading>
            <p className="mb-6 text-center text-gray-500">{appSettings?.faq_subheading}</p>
            <div className="gird-cols-1 grid gap-4 md:grid-cols-2">
                {/* Left Column */}
                <Accordion type="single" collapsible className="space-y-2">
                    {leftFaqs.map((item, i) => (
                        <AccordionItem
                            key={i}
                            value={`left-${i}`}
                            className="rounded-md border border-[var(--base-color)] shadow-sm transition hover:shadow-md dark:bg-gray-800"
                        >
                            <AccordionTrigger className="cursor-pointer px-2 text-left font-medium data-[state=open]:bg-[var(--base-color)] data-[state=open]:text-white">
                                {item.question}
                            </AccordionTrigger>
                            <AccordionContent className="px-2">{item.answer}</AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>

                {/* Right Column */}
                <Accordion type="single" collapsible className="space-y-2">
                    {rightFaqs.map((item, i) => (
                        <AccordionItem
                            key={i}
                            value={`right-${i}`}
                            className="rounded-md border border-[var(--base-color)] shadow-sm transition hover:shadow-md dark:bg-gray-800"
                        >
                            <AccordionTrigger className="cursor-pointer px-2 text-left font-medium data-[state=open]:bg-[var(--base-color)] data-[state=open]:text-white">
                                {item.question}
                            </AccordionTrigger>
                            <AccordionContent className="px-2">{item.answer}</AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </div>
    );
}
