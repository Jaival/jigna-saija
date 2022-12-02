import Image from 'next/image';

export default function AboutMeComponent() {
  return (
    <div className='flex md:justify-center md:items-center'>
      <div className="container mt-14">
        <div className="text-left md:text-center my-10">
          <h2 className='text-xl md:text-4xl font-bold'>About Me</h2>
        </div>

        <div className="flex md:flex-row flex-col gap-2 items-center">
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
            <div className="text-left md:text-center py-2">
              <q className="font-light md:text-base">We believe in complete design</q>
              <p className="font-thin text-sm md:text-base md:h-6"> - Jigna Saija </p>
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
        <div className="grid grid-flow-col grid-rows-3 md:grid-rows-1 gap-4 mt-10">

          <div className="card">
            <div className="card-body p-4">
              <h5 className="font-bold text-lg md:text-2xl">10</h5>
              <p className="text-base md:text-lg">Years of Experience</p>
            </div>
          </div>
          <div className="card">
            <div className="card-body p-4">
              <h5 className="font-bold text-lg md:text-2xl">10</h5>
              <p className="text-base md:text-lg">Project Completed</p>
            </div>
          </div>
          <div className="card">
            <div className="card-body p-4">
              <h5 className="font-bold text-lg md:text-2xl">10</h5>
              <p className="text-base md:text-lg">Awards Gained</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}