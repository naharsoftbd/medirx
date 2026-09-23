import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useForm, usePage } from '@inertiajs/react';
import * as LucideIcons from 'lucide-react';
import React from 'react';

export default function ContactForm() {
    const { appSettings } = usePage().props;
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        subject: '',
        message: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('contact.submit'), {
            onSuccess: () => reset(),
        }); // You can define this route in Laravel
    };

    return (
        <div className="container mx-auto py-10">
            <div className="rounded-lg border bg-gray-50 p-4 shadow-sm">
                <div className="mb-4 flex flex-col items-center justify-center gap-4 md:flex-row md:gap-24">
                    <div className="flex flex-col items-center md:flex-row">
                        <div className="flex w-[50px] items-center justify-center rounded-md bg-[var(--base-color)] p-2">
                            <LucideIcons.Phone className="mr-1 h-10 w-10 text-white" />
                        </div>
                        <div className="ml-1">
                            <p className="text-center font-semibold text-black">Mobile Number</p>
                            {appSettings.site_mobile && (
                                <p className="flex text-black">
                                    {appSettings.site_country_code}-{appSettings.site_mobile}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col items-center md:flex-row">
                        <div className="flex w-[50px] items-center justify-center rounded-md bg-[var(--base-color)] p-2">
                            <LucideIcons.Mail className="mr-1 h-10 w-10 text-white" />
                        </div>
                        <div className="ml-1">
                            <p className="text-center font-semibold text-black md:text-left">Email</p>
                            {appSettings.site_email && <p className="flex text-black">{appSettings.site_email}</p>}
                        </div>
                    </div>
                    <div className="flex flex-col items-center md:flex-row">
                        <div className="flex w-[50px] items-center justify-center rounded-md bg-[var(--base-color)] p-2">
                            <LucideIcons.MapPin className="mr-1 h-10 w-10 text-white" />
                        </div>
                        <div className="ml-1">
                            <p className="text-center font-semibold text-black md:text-left">Address</p>
                            {appSettings.site_address && <p className="flex text-black">{appSettings.site_address}</p>}
                        </div>
                    </div>
                </div>
                <form onSubmit={handleSubmit} role="form" id="contact-form" className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name" className="block after:text-red-500 after:content-['*']">
                            Name
                        </Label>
                        <Input
                            id="name"
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Your Name"
                            className="w-full"
                        />
                        {errors.name && <div className="text-sm text-red-500">{errors.name}</div>}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email" className="block after:text-red-500 after:content-['*']">
                            Email
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="Your Email"
                            className="w-full"
                        />
                        {errors.email && <div className="text-sm text-red-500">{errors.email}</div>}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="subject" className="block after:text-red-500 after:content-['*']">
                            Subject
                        </Label>
                        <Input
                            id="subject"
                            type="text"
                            value={data.subject}
                            onChange={(e) => setData('subject', e.target.value)}
                            placeholder="Your Subject"
                            className="w-full"
                        />
                        {errors.subject && <div className="text-sm text-red-500">{errors.subject}</div>}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="message" className="block after:text-red-500 after:content-['*']">
                            Message
                        </Label>
                        <Textarea
                            id="message"
                            value={data.message}
                            onChange={(e) => setData('message', e.target.value)}
                            placeholder="Your Message"
                            className="w-full"
                            rows={4}
                        />
                        {errors.message && <div className="text-sm text-red-500">{errors.message}</div>}
                    </div>

                    <Button type="submit" disabled={processing} className="text-white">
                        {processing ? 'Sending...' : 'Send Message'}
                    </Button>
                </form>
            </div>
        </div>
    );
}
