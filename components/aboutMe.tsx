import Image from 'next/image';

export default function AboutMeComponent() {
  return (
    <div className="container mt-5">

      <div className="text-center m-10">
        <h2 className='text-4xl font-bold'>About Me</h2>
      </div>

      <div className="flex flex-row gap-2 items-center">
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
          <div className="text-center p-2">
            <q className="font-thin">We believe in complete design</q>
            <p className="font-light h-6"> - Jigna Saija </p>
          </div>
        </div>

        <div className='text-2xl min-w-min ml-10'>
          <p>
            I gracefully designs from concept to completion with over ten years of design experience
            in residential and commercial interiors.
            I is a versatile designer with an ability to effortlessly conceive elegant concepts and
            then translate them into functional and Inspiring spaces.
          </p>
        </div>
      </div>

      {/* <!-- Experience Cards--> */}
      <div className="grid grid-flow-col gap-4 mt-10">

        <div className="card">
          <div className="card-body p-4">
            <h5 className="font-bold">10</h5>
            <p className="">Years of Experience</p>
          </div>
        </div>
        <div className="card">
          <div className="card-body p-4">
            <h5 className="font-bold">10</h5>
            <p className="">Project Completed</p>
          </div>
        </div>
        <div className="card">
          <div className="card-body p-4">
            <h5 className="font-bold">10</h5>
            <p className="">Awards Gained</p>
          </div>
        </div>
      </div>
    </div>
  );
}