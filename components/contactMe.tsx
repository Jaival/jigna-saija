'use client';
import {
  LucideLoader2,
  Mail,
  Instagram,
  Facebook,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import userData from '@/data/data';
import { submitContactForm } from '@/app/actions/contact';
import { useToast } from '@/lib/use-toast';
import Image from 'next/image';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useHasHover } from '@/lib/motion';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  userMessage: string;
}

export default function ContactMeComponent() {
  const hasHover = useHasHover();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, touchedFields },
  } = useForm<ContactFormData>({
    mode: 'onBlur', // Validate on blur for better UX
  });

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
        setSubmitSuccess(true);
        toast({
          description:
            result.message || 'Your message has been sent successfully!',
          variant: 'default',
        });
        reset(); // Clear the form
        setTimeout(() => setSubmitSuccess(false), 5000);
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
              <h1 className="text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
                Let&apos;s Create Something
                <span style={{ color: 'var(--color-clay)' }}> Beautiful</span>
              </h1>
              <p className="mt-4 text-base text-muted-foreground md:text-lg">
                Ready to transform your space? Get in touch and let&apos;s
                discuss your next project.
              </p>
            </div>

            <div className="space-y-6">
              {/* Email Contact Card */}
              <div className="bg-card text-card-foreground border border-border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-150 ease-out group">
                <div className="flex items-center space-x-4">
                  <div
                    className="flex items-center justify-center w-12 h-12 rounded-lg flex-shrink-0 group-hover:scale-110 transition-transform duration-150"
                    style={{ backgroundColor: 'color-mix(in oklab, var(--color-pine) 10%, transparent)' }}
                  >
                    <Mail className="w-6 h-6" style={{ color: 'var(--color-pine)' }} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-semibold text-foreground">
                      Email
                    </h3>
                    <Link
                      href={`mailto:${userData.email}`}
                      className="text-muted-foreground hover:opacity-80 transition-colors break-words text-sm md:text-base"
                    >
                      {userData.email}
                    </Link>
                  </div>
                </div>
              </div>

              {/* Social Media Section */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-foreground">
                  Connect With Me
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Instagram Card */}
                  <Link
                    href={userData.socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-[transform,box-shadow] duration-150 ease-out group"
                    style={{
                      background:
                        'linear-gradient(135deg, var(--color-clay) 0%, var(--color-clay-deep) 50%, var(--color-ochre) 100%)',
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
                    className="p-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-[transform,box-shadow] duration-150 ease-out group"
                    style={{
                      background:
                        'linear-gradient(135deg, var(--color-pine) 0%, var(--color-pine-light) 100%)',
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
            <div className="bg-card text-card-foreground border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-150 ease-out">
              <h3 className="text-lg font-semibold text-foreground mb-4 text-center">
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
          <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-xl">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground">
                Send a Message
              </h2>
              <p className="mt-2 text-muted-foreground">
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
                  className="block text-sm font-medium text-foreground/80 mb-2"
                >
                  Name *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="name"
                    disabled={isSubmitting}
                    aria-invalid={errors.name ? 'true' : 'false'}
                    aria-describedby={errors.name ? 'name-error' : undefined}
                    className={`w-full px-4 py-3 pr-10 border rounded-lg bg-background text-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150 ease-out ${
                      errors.name
                        ? 'border-destructive focus-visible:outline-destructive'
                        : touchedFields.name
                          ? 'border-success focus-visible:outline-success'
                          : 'border-input'
                    }`}
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
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <AlertCircle
                        className="h-5 w-5 text-destructive"
                        aria-hidden="true"
                      />
                    </div>
                  )}
                  {touchedFields.name && !errors.name && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <CheckCircle2
                        className="h-5 w-5 text-success"
                        aria-hidden="true"
                      />
                    </div>
                  )}
                </div>
                <AnimatePresence>
                  {errors.name && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      id="name-error"
                      className="mt-2 text-sm text-destructive flex items-center gap-1"
                      role="alert"
                    >
                      <AlertCircle className="w-4 h-4" />
                      {errors.name.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-foreground/80 mb-2"
                >
                  Email *
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    disabled={isSubmitting}
                    aria-invalid={errors.email ? 'true' : 'false'}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                    className={`w-full px-4 py-3 pr-10 border rounded-lg bg-background text-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150 ease-out ${
                      errors.email
                        ? 'border-destructive focus-visible:outline-destructive'
                        : touchedFields.email
                          ? 'border-success focus-visible:outline-success'
                          : 'border-input'
                    }`}
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
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <AlertCircle
                        className="h-5 w-5 text-destructive"
                        aria-hidden="true"
                      />
                    </div>
                  )}
                  {touchedFields.email && !errors.email && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <CheckCircle2
                        className="h-5 w-5 text-success"
                        aria-hidden="true"
                      />
                    </div>
                  )}
                </div>
                <AnimatePresence>
                  {errors.email && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      id="email-error"
                      className="mt-2 text-sm text-destructive flex items-center gap-1"
                      role="alert"
                    >
                      <AlertCircle className="w-4 h-4" />
                      {errors.email.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Subject Field */}
              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-foreground/80 mb-2"
                >
                  Subject *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="subject"
                    disabled={isSubmitting}
                    aria-invalid={errors.subject ? 'true' : 'false'}
                    aria-describedby={
                      errors.subject ? 'subject-error' : undefined
                    }
                    className={`w-full px-4 py-3 pr-10 border rounded-lg bg-background text-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150 ease-out ${
                      errors.subject
                        ? 'border-destructive focus-visible:outline-destructive'
                        : touchedFields.subject
                          ? 'border-success focus-visible:outline-success'
                          : 'border-input'
                    }`}
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
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <AlertCircle
                        className="h-5 w-5 text-destructive"
                        aria-hidden="true"
                      />
                    </div>
                  )}
                  {touchedFields.subject && !errors.subject && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <CheckCircle2
                        className="h-5 w-5 text-success"
                        aria-hidden="true"
                      />
                    </div>
                  )}
                </div>
                <AnimatePresence>
                  {errors.subject && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      id="subject-error"
                      className="mt-2 text-sm text-destructive flex items-center gap-1"
                      role="alert"
                    >
                      <AlertCircle className="w-4 h-4" />
                      {errors.subject.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Message Field */}
              <div>
                <label
                  htmlFor="userMessage"
                  className="block text-sm font-medium text-foreground/80 mb-2"
                >
                  Message *
                </label>
                <textarea
                  id="userMessage"
                  rows={5}
                  disabled={isSubmitting}
                  aria-invalid={errors.userMessage ? 'true' : 'false'}
                  aria-describedby={
                    errors.userMessage ? 'message-error' : undefined
                  }
                  className={`w-full px-4 py-3 border rounded-lg bg-background text-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150 ease-out resize-none ${
                    errors.userMessage
                      ? 'border-destructive focus-visible:outline-destructive'
                      : touchedFields.userMessage
                        ? 'border-success focus-visible:outline-success'
                        : 'border-input'
                  }`}
                  placeholder="Tell me about your project..."
                  {...register('userMessage', {
                    required: 'Message is required',
                    minLength: {
                      value: 10,
                      message: 'Message must be at least 10 characters',
                    },
                  })}
                />
                <AnimatePresence>
                  {errors.userMessage && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      id="message-error"
                      className="mt-2 text-sm text-destructive flex items-center gap-1"
                      role="alert"
                    >
                      <AlertCircle className="w-4 h-4" />
                      {errors.userMessage.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={hasHover ? { scale: isSubmitting ? 1 : 1.02 } : undefined}
                whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                className="w-full text-white font-semibold py-3 px-6 rounded-lg hover:shadow-lg transition-[box-shadow,opacity] duration-150 ease-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                style={{
                  background:
                    'linear-gradient(135deg, var(--color-pine) 0%, var(--color-clay) 100%)',
                }}
              >
                <AnimatePresence mode="wait">
                  {isSubmitting ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center space-x-2"
                    >
                      <LucideLoader2 className="w-5 h-5 animate-spin" />
                      <span>Sending...</span>
                    </motion.div>
                  ) : submitSuccess ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center space-x-2"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Message Sent!</span>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="default"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center space-x-2"
                    >
                      <Mail className="w-5 h-5" />
                      <span>Send Message</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
