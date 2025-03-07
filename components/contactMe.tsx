'use client';
import { LucideLoader2, Mail } from 'lucide-react';
import userData from '@/data/data';
import { sendContactForm } from '@/lib/sendMailapi';
import FormValues from '@/lib/types/contactFormType';
import { useToast } from '@/lib/use-toast';
import Image from 'next/image';
import Link from 'next/link';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useState } from 'react';

export default function ContactMeComponent() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({});

  const onSubmit: SubmitHandler<FormValues> = async (data: any) => {
    try {
      setIsSubmitting(true);
      const res = await sendContactForm(data);

      if (res.success === true) {
        toast({
          description: 'Your message has been sent successfully!',
          variant: 'default',
        });
      } else {
        toast({
          description:
            res.message || 'Failed to send message. Please try again.',
          variant: 'destructive',
        });
      }
      reset();
    } catch (error) {
      toast({
        description: 'An unexpected error occurred. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex max-w-4xl mx-auto overflow-hidden text-white rounded-lg shadow-lg bg-aquamarine">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="order-2 p-6 md:p-10 md:order-1">
          <header className="mb-8">
            <h1 className="text-3xl font-bold">
              Get in touch, let&apos;s talk.
            </h1>
            <p className="mt-3 text-lg font-light text-white/90">
              Fill in the details and I&apos;ll get back to you as soon as I
              can.
            </p>
          </header>
          <div className="flex flex-col space-y-6 my-10">
            <div className="flex items-center space-x-4 p-4 border rounded-lg border-white/20 hover:border-white/40 transition-colors">
              <Mail className="w-5 h-5" />
              <a href={`mailto:${userData.email}`} className="text-base hover:underline">
                {userData.email}
              </a>
            </div>

            <div className="flex justify-center p-4 bg-white/10 rounded-lg">
              <Image
                src={'/images/jignasaijaQR.png'}
                width={180}
                height={180}
                alt="QR code to connect"
                className="rounded-md"
                priority
              />
            </div>
          </div>

          <div className="flex flex-row space-x-4">
            <Link
              href={userData.socialLinks.facebook}
              className="flex items-center justify-center w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              aria-label="Facebook"
            >
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>

            <Link
              href={userData.socialLinks.instagram}
              className="flex items-center justify-center w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              aria-label="Instagram"
            >
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </div>
        </div>
        <form
          className="order-1 md:order-2 rounded-lg shadow-sm p-6 md:p-10 bg-white/5"
          onSubmit={handleSubmit(onSubmit)}
          aria-label="Contact form"
        >
          <div className="mb-5">
            <label htmlFor="name" className="block mb-2 text-sm font-medium">
              Name
            </label>
            <input
              {...register('name', { required: 'Your name is required.' })}
              type="text"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-white/30 focus:outline-none text-white placeholder-white/60 transition-colors"
              name="name"
              id="name"
              placeholder="Your name"
              aria-invalid={errors.name ? 'true' : 'false'}
              disabled={isSubmitting}
            />
            {errors?.name && (
              <p className="mt-2 text-sm text-red-400" role="alert">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="mb-5">
            <label htmlFor="email" className="block mb-2 text-sm font-medium">
              Email
            </label>
            <input
              {...register('email', {
                required: 'Your email is required.',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
              type="email"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-white/30 focus:outline-none text-white placeholder-white/60 transition-colors"
              name="email"
              id="email"
              placeholder="your.email@example.com"
              aria-invalid={errors.email ? 'true' : 'false'}
              disabled={isSubmitting}
            />
            {errors?.email && (
              <p className="mt-2 text-sm text-red-400" role="alert">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="mb-5">
            <label htmlFor="subject" className="block mb-2 text-sm font-medium">
              Subject
            </label>
            <input
              {...register('subject', { required: 'The subject is required.' })}
              type="text"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-white/30 focus:outline-none text-white placeholder-white/60 transition-colors"
              name="subject"
              id="subject"
              placeholder="What is this regarding?"
              aria-invalid={errors.subject ? 'true' : 'false'}
              disabled={isSubmitting}
            />
            {errors?.subject && (
              <p className="mt-2 text-sm text-red-400" role="alert">
                {errors.subject.message}
              </p>
            )}
          </div>

          <div className="mb-5">
            <label htmlFor="userMessage" className="block mb-2 text-sm font-medium">
              Message
            </label>
            <textarea
              {...register('userMessage', {
                required: 'Your message is required.',
              })}
              rows={5}
              typeof="text"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-white/30 focus:outline-none text-white placeholder-white/60 transition-colors resize-none"
              name="userMessage"
              id="userMessage"
              placeholder="Type your message here..."
              aria-invalid={errors.userMessage ? 'true' : 'false'}
              disabled={isSubmitting}
            ></textarea>
            {errors?.userMessage && (
              <p className="mt-2 text-sm text-red-400" role="alert">
                {errors.userMessage.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-6 py-3 font-medium text-white rounded-lg bg-button-blue hover:bg-opacity-90 focus:ring-4 focus:ring-button-blue/30 focus:outline-none transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isSubmitting ? (
              <>
                <LucideLoader2 className="w-4 h-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              'Send Message'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
