export default function Footer() {
  return (
    <footer className="py-8">
      {/* <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" /> */}
      <hr className="my-4 border-gray-200 sm:mx-auto dark:border-gray-700 md:my-6" />
      <span className="block justify-center items-center text-sm text-gray-500 sm:text-center dark:text-gray-400">
        © {new Date().getFullYear() + ' '}
        <a className="hover:underline">Jigna Saija</a>. All Rights Reserved.
      </span>
    </footer>
  );
}
