import Image from 'next/image';
import Link from 'next/link';
import { SubmitHandler, useForm } from 'react-hook-form';
import userData from '../data/data';
import { sendContactForm } from '../lib/sendMailapi';
import FormValues from '../lib/types/contactFormType';
import { useToast } from './use-toast';


export default function ContactMeComponent() {
  const { toast } = useToast()

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
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormValues>({});

  const onSubmit: SubmitHandler<FormValues> = data => {
    console.log(data);
    sendContactForm(data);
    toast({
      description: 'Your message has been sent.',
    });
    reset();
  };

  return (
    <div
      className="relative z-10 max-w-4xl p-4 mx-auto mb-20 -mt-4 text-white rounded-md shadow-md bg-aquamarine md:p-10 lg:p-20">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="order-2 md:ml-4 md:order-1">
          <header>
            <h1 className="text-2xl font-semibold">
              Get in touch, let&apos;s talk.
            </h1>
            <p className="mt-2 text-base font-light">
              Fill in the details and I&apos;ll get back to you as soon as I can.
            </p>
          </header>
          <div className="flex flex-row justify-between my-10 icons-container md:inline-flex md:flex-col">
            <div
              className="flex flex-row items-center p-4 space-x-6 border rounded-md border-white-dark">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="w-4 h-4 bi bi-envelope-fill "
                viewBox="0 0 16 16"
              >
                <path
                  d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555zM0 4.697v7.104l5.803-3.558L0 4.697zM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757zm3.436-.586L16 11.801V4.697l-5.803 3.546z" />
              </svg>
              <p className="text-sm font-light ">
                {userData.email}
              </p>
            </div>

            <div className='flex flex-col pt-4 rounded-lg'>
              <Image src={'/images/jignasaijaQR.png'} width={200} height={200} alt='qr-code' priority></Image>
            </div>

          </div>
          <div className="flex flex-row space-x-8 social-icons">

            <Link
              href={userData.socialLinks.facebook}
              className="flex items-center justify-center w-10 h-10 rounded-lg cursor-pointer hover:border hover:border-aero"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="w-5 h-5 bi bi-twitter"
                viewBox="0 0 16 16"
              >
                <path
                  d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z" />
              </svg>
            </Link>
            <Link
              href={userData.socialLinks.instagram}
              className="flex items-center justify-center w-10 h-10 rounded-lg cursor-pointer hover:border hover:border-aero"
            >
              <svg
                width="24"
                height="24"
                className=""
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 7C9.23858 7 7 9.23858 7 12C7 14.7614 9.23858 17 12 17C14.7614 17 17 14.7614 17 12C17 9.23858 14.7614 7 12 7ZM9 12C9 13.6569 10.3431 15 12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12Z"
                  fill="currentColor"
                />
                <path
                  d="M18 5C17.4477 5 17 5.44772 17 6C17 6.55228 17.4477 7 18 7C18.5523 7 19 6.55228 19 6C19 5.44772 18.5523 5 18 5Z"
                  fill="currentColor"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M5 1C2.79086 1 1 2.79086 1 5V19C1 21.2091 2.79086 23 5 23H19C21.2091 23 23 21.2091 23 19V5C23 2.79086 21.2091 1 19 1H5ZM19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z"
                  fill="currentColor"
                />
              </svg>
            </Link>
          </div>
        </div>
        <form className="flex flex-col order-1 pl-3 rounded-lg form md:order-2" onSubmit={handleSubmit(onSubmit)}>
          <label htmlFor="name" className="mx-4 text-sm">
            Name
          </label>
          <input
            {...register('name', { required: 'Your name is required.' })}
            type="text"
            className="px-2 py-2 mx-4 mt-2 font-light bg-white rounded-md text-blue-dark focus:outline-none"
            name="name"
          />
          {errors?.name && <span className='pt-1 pl-6 text-sm'>{errors.name.message}</span>}
          <label htmlFor="email" className="mx-4 mt-4 text-sm">
            Email Id
          </label>
          <input
            {...register('email', { required: 'Your email is required.' })}
            type="email"
            className="px-2 py-2 mx-4 mt-2 font-light bg-white rounded-md text-blue-dark focus:outline-none"
            name="email"
          />
          {errors?.email && <span className='pt-1 pl-6 text-sm'>{errors.email.message}</span>}
          <label htmlFor="subject" className="mx-4 mt-4 text-sm">
            Subject
          </label>
          <input
            {...register('subject', { required: 'The subject is required.' })}
            type="text"
            className="px-2 py-2 mx-4 mt-2 font-light bg-white rounded-md text-blue-dark focus:outline-none"
            name="subject"
          />
          {errors?.subject && <span className='pt-1 pl-6 text-sm'>{errors.subject.message}</span>}
          <label
            htmlFor="userMessage"
            className="mx-4 mt-4 text-sm"
          >
            Message
          </label>

          <textarea
            {...register('userMessage', { required: 'Your message is required.', })}
            rows={4}
            typeof="text"
            className="px-2 py-2 mx-4 mt-2 overflow-hidden font-light bg-white rounded-md resize-none text-blue-dark focus:outline-none"
            name="userMessage"
          >
          </textarea>
          {errors?.userMessage && <span className='pt-1 pl-6 text-sm'>{errors.userMessage.message}</span>}
          <input
            type="submit"
            className="w-1/2 py-2 m-4 mt-8 text-xs font-bold rounded-md bg-button-blue"
          />
        </form>
      </div>
    </div>
  );
}