'use client';
import { LucideLoader2, Mail, Instagram, Facebook } from 'lucide-react';
import userData from '@/data/data';
import { submitContactForm } from '@/app/actions/contact';
import { useToast } from '@/lib/use-toast';
import Image from 'next/image';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useState } from 'react';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  userMessage: string;
}

export default function ContactMeComponent() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>();

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('email', data.email);
      formData.append('subject', data.subject);
      formData.append('userMessage', data.userMessage);

      const result = await submitContactForm({}, formData);

      if (result.success) {
        toast({
          description:
            result.message || 'Your message has been sent successfully!',
          variant: 'default',
        });
        reset(); // Clear the form
      } else {
        toast({
          description:
            result.message || 'Failed to send message. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        description: 'An error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative py-8 md:py-16">
      <div className="w-full max-w-7xl px-4 mx-auto sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-16">
          {/* Contact Information */}
          <div className="space-y-6 md:space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl lg:text-5xl">
                Let&apos;s Create Something
                <span style={{ color: '#a40e4c' }}> Beautiful</span>
              </h1>
              <p className="mt-4 text-base text-gray-600 dark:text-gray-300 md:text-lg">
                Ready to transform your space? Get in touch and let&apos;s
                discuss your next project.
              </p>
            </div>

            <div className="space-y-6">
              {/* Email Contact Card */}
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <div className="flex items-center space-x-4">
                  <div
                    className="flex items-center justify-center w-12 h-12 rounded-lg flex-shrink-0 group-hover:scale-110 transition-transform duration-300"
                    style={{ backgroundColor: 'rgba(29, 103, 147, 0.1)' }}
                  >
                    <Mail className="w-6 h-6" style={{ color: '#1d6793' }} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-semibold text-gray-600 dark:text-white">
                      Email
                    </h3>
                    <Link
                      href={`mailto:${userData.email}`}
                      className="text-gray-400 hover:opacity-80 transition-colors break-words text-sm md:text-base"
                    >
                      {userData.email}
                    </Link>
                  </div>
                </div>
              </div>

              {/* Social Media Section */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Connect With Me
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Instagram Card */}
                  <Link
                    href={userData.socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 group"
                    style={{
                      background:
                        'linear-gradient(135deg, #a40e4c 0%, #bc1058 50%, #fb923c 100%)',
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-10 h-10 bg-white/20 rounded-lg">
                        <Instagram className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-white">
                        <h4 className="font-semibold">Instagram</h4>
                        <p className="text-sm text-white/80 truncate">
                          @jigna_saija
                        </p>
                      </div>
                    </div>
                  </Link>

                  {/* Facebook Card */}
                  <Link
                    href={userData.socialLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 group"
                    style={{
                      background:
                        'linear-gradient(135deg, #1d6793 0%, #2278aa 100%)',
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-10 h-10 bg-white/20 rounded-lg">
                        <Facebook className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-white">
                        <h4 className="font-semibold">Facebook</h4>
                        <p className="text-sm text-white/80 truncate">
                          Designlines502
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            {/* QR Code Image */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">
                Scan to Connect
              </h3>
              <div className="relative w-full max-w-xs mx-auto aspect-square">
                <Image
                  src="/images/jignasaijaQR.png"
                  alt="QR Code - Connect with Jigna Saija"
                  fill
                  className="object-contain rounded-lg"
                  sizes="(max-width: 768px) 280px, 320px"
                />
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-xl">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Send a Message
              </h2>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                Fill out the form below and I&apos;ll get back to you as soon as
                possible.
              </p>
            </div>

            {/* React Hook Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Name Field */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg  bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  placeholder="Your name"
                  {...register('name', {
                    required: 'Name is required',
                    minLength: {
                      value: 2,
                      message: 'Name must be at least 2 characters',
                    },
                  })}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg   bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  placeholder="your@email.com"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Subject Field */}
              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg   bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  placeholder="Project inquiry"
                  {...register('subject', {
                    required: 'Subject is required',
                    minLength: {
                      value: 3,
                      message: 'Subject must be at least 3 characters',
                    },
                  })}
                />
                {errors.subject && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.subject.message}
                  </p>
                )}
              </div>

              {/* Message Field */}
              <div>
                <label
                  htmlFor="userMessage"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Message *
                </label>
                <textarea
                  id="userMessage"
                  rows={5}
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg  bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors resize-none"
                  placeholder="Tell me about your project..."
                  {...register('userMessage', {
                    required: 'Message is required',
                    minLength: {
                      value: 10,
                      message: 'Message must be at least 10 characters',
                    },
                  })}
                />
                {errors.userMessage && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.userMessage.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full text-white font-semibold py-3 px-6 rounded-lg hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
                style={{
                  background:
                    'linear-gradient(135deg, #1d6793 0%, #a40e4c 100%)',
                }}
              >
                {isSubmitting ? (
                  <>
                    <LucideLoader2 className="w-5 h-5 animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Mail className="w-5 h-5" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
