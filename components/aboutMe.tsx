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
              className="rounded-lg"
              alt="architecture"
              width={2500}
              height={1667}
              src={
                '/images/pexels-isaw-company-955733.jpg'
              }
            />
            <div className="py-2 text-left md:text-center">
              <q className="font-light md:text-base">We believe in complete design</q>
              <p className="text-sm font-thin md:text-base md:h-6"> - Jigna Saija </p>
            </div>
          </div>

          <div className='flex flex-col md:ml-10'>
            <p className='text-base md:text-2xl'>
               I gracefully designs from concept to completion with over ten years of design experience
               in residential and commercial interiors.
               I is a versatile designer with an ability to effortlessly conceive elegant concepts and
               then translate them into functional and Inspiring spaces.
            </p>
          </div>
        </div>

        {/* <!-- Experience Cards--> */}
        <div className="grid grid-flow-col grid-rows-3 gap-4 mt-10 md:grid-rows-1">

          <div className="card">
            <div className="p-4 card-body">
              <h5 className="text-lg font-bold text-white md:text-2xl">10</h5>
              <p className="text-base md:text-lg text-white-dark">Years of Experience</p>
            </div>
          </div>
          <div className="card">
            <div className="p-4 card-body">
              <h5 className="text-lg font-bold text-white md:text-2xl">10</h5>
              <p className="text-base md:text-lg text-white-dark">Project Completed</p>
            </div>
          </div>
          <div className="card">
            <div className="p-4 card-body">
              <h5 className="text-lg font-bold text-white md:text-2xl">10</h5>
              <p className="text-base md:text-lg text-white-dark">Awards Gained</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}