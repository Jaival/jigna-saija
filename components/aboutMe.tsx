import Image from 'next/image';

export default function AboutMeComponent() {
  return (
    <div className='flex md:justify-center md:items-center'>
      <div className="container mt-14">
        <div className="my-10 text-left md:text-center">
          <h2 className='text-xl font-bold md:text-4xl'>About Me</h2>
        </div>

        <div className="flex flex-col items-center gap-2 md:flex-row">
          <div className="flex flex-col">
            <Image
              className="rounded-lg aspect-auto"
              alt="architecture"
              width={3248}
              height={4062.1}
              src={
                '/images/jignasaija.jpg'
              }
            />
            <div className="py-2 text-left md:text-center">
              <q className="font-light md:text-base">We believe in complete design</q>
              <p className="text-sm font-thin md:text-base md:h-6"> - Jigna Saija </p>
            </div>
          </div>

          <div className='flex flex-col md:ml-10'>
            <p className='text-base leading-relaxed tracking-wide md:text-2xl'>
              With more than fifteen years of experience designing both residential and commercial architectures and interiors, I gracefully oversee projects from concept to completion. As a versatile designer, I have an innate ability to conceive elegant and inspiring concepts and transform them into functional spaces that are both beautiful and practical.
            </p>
          </div>
        </div>

        {/* <!-- Experience Cards--> */}
        <div className="grid grid-flow-col grid-rows-3 gap-4 mt-10 md:grid-rows-1">

          <div className="card">
            <div className="p-4 card-body">
              <h5 className="text-lg font-bold text-white md:text-2xl">20</h5>
              <p className="text-base md:text-lg text-white-dark">Years of Experience</p>
            </div>
          </div>
          <div className="card">
            <div className="p-4 card-body">
              <h5 className="text-lg font-bold text-white md:text-2xl">10</h5>
              <p className="text-base md:text-lg text-white-dark">Projects Completed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}