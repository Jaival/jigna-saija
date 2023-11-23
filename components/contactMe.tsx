'use client'
import Image from 'next/image';
import Link from 'next/link';
import { SubmitHandler, useForm } from 'react-hook-form';
import userData from '../data/data';
import { sendContactForm } from '../lib/sendMailapi';
import FormValues from '../lib/types/contactFormType';
import { useToast } from '../lib/use-toast';

export default function ContactMeComponent() {
  const { toast } = useToast();

  // const resolver: Resolver<FormValues> = async (values) => {
  //   return {
  //     values: values.name || values.email || values.subject || values.userMessage ? values : {},
  //     errors: !values
  //       ? {
  //         root: {
  //           message: 'All the fields are required'
  //         },
  //         name: {
  //           type: 'required',
  //           message: 'Your name is required.',
  //         },
  //         email: {
  //           type: 'required',
  //           message: 'Your email is required.',
  //         },
  //         subject: {
  //           type: 'required',
  //           message: 'The subject is required.',
  //         },
  //         userMessage: {
  //           type: 'required',
  //           message: 'Your message is required.',
  //         }
  //       }
  //       : {},
  //   };
  // };
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({});

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    console.log(data);
    const res = await sendContactForm(data);
    console.log(res.message);
    if (res.success === true) {
      toast({
        description: 'Your message has been sent.',
      });
    } else {
      toast({
        description: res.message,
      });
    }
    reset();
  };

  return (
    <div className="relative z-10 max-w-4xl p-4 mx-auto mb-20 -mt-4 text-white rounded-md shadow-md bg-aquamarine md:p-10 lg:p-20">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="order-2 md:ml-4 md:order-1">
          <header>
            <h1 className="text-2xl font-semibold">
              Get in touch, let&apos;s talk.
            </h1>
            <p className="mt-2 text-base font-light">
              Fill in the details and I&apos;ll get back to you as soon as I
              can.
            </p>
          </header>
          <div className="flex flex-col justify-between my-10 md:inline-flex">
            <div className="flex flex-row items-center p-4 space-x-6 border rounded-md border-white-dark">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="w-4 h-4 bi bi-envelope-fill "
                viewBox="0 0 16 16"
              >
                <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555zM0 4.697v7.104l5.803-3.558L0 4.697zM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757zm3.436-.586L16 11.801V4.697l-5.803 3.546z" />
              </svg>
              <p className="text-sm font-light ">{userData.email}</p>
            </div>

            <div className="flex flex-row items-center p-4 space-x-6 rounded-md ">
              <Image
                src={'/images/jignasaijaQR.png'}
                width={200}
                height={200}
                alt="qr-code"
                priority
              ></Image>
            </div>
          </div>

          <div className="flex flex-row space-x-8 social-icons">
            <Link
              href={userData.socialLinks.facebook}
              className="flex items-center justify-center w-10 h-10 rounded-lg cursor-pointer hover:border hover:border-white-dark"
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
              className="flex items-center justify-center w-10 h-10 rounded-lg cursor-pointer hover:border hover:border-white-dark"
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
          className="flex flex-col order-1 pl-3 rounded-lg form md:order-2"
          onSubmit={handleSubmit(onSubmit)}
        >
          <label htmlFor="name" className="mx-4 text-sm">
            Name
          </label>
          <input
            {...register('name', { required: 'Your name is required.' })}
            type="text"
            className="px-2 py-2 mx-4 mt-2 font-light bg-white rounded-md text-blue-dark focus:outline-none"
            name="name"
          />
          {errors?.name && (
            <span className="pt-1 pl-6 text-sm">{errors.name.message}</span>
          )}
          <label htmlFor="email" className="mx-4 mt-4 text-sm">
            Email Id
          </label>
          <input
            {...register('email', { required: 'Your email is required.' })}
            type="email"
            className="px-2 py-2 mx-4 mt-2 font-light bg-white rounded-md text-blue-dark focus:outline-none"
            name="email"
          />
          {errors?.email && (
            <span className="pt-1 pl-6 text-sm">{errors.email.message}</span>
          )}
          <label htmlFor="subject" className="mx-4 mt-4 text-sm">
            Subject
          </label>
          <input
            {...register('subject', { required: 'The subject is required.' })}
            type="text"
            className="px-2 py-2 mx-4 mt-2 font-light bg-white rounded-md text-blue-dark focus:outline-none"
            name="subject"
          />
          {errors?.subject && (
            <span className="pt-1 pl-6 text-sm">{errors.subject.message}</span>
          )}
          <label htmlFor="userMessage" className="mx-4 mt-4 text-sm">
            Message
          </label>

          <textarea
            {...register('userMessage', {
              required: 'Your message is required.',
            })}
            rows={4}
            typeof="text"
            className="px-2 py-2 mx-4 mt-2 overflow-hidden font-light bg-white rounded-md resize-none text-blue-dark focus:outline-none"
            name="userMessage"
          ></textarea>
          {errors?.userMessage && (
            <span className="pt-1 pl-6 text-sm">
              {errors.userMessage.message}
            </span>
          )}
          <input
            type="submit"
            className="w-1/2 py-2 m-4 mt-8 text-xs font-bold rounded-md bg-button-blue"
          />
        </form>
      </div>
    </div>
  );
}
