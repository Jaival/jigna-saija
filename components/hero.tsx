import Image from 'next/image';

export default function Hero() {
  return (
    <div className='mt-10'>
      <div className="flex flex-row gap-5">
        <div className="flex flex-col gap-6 justify-center items-center m-8">
          <h1 className="text-5xl">Building your next big project.</h1>
          <p className="text-2xl min-w-min">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium
            voluptates distinctio odit, consequuntur fugiat omnis, praesentium
            saepe non.
          </p>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 w-60 rounded">
            See projects
          </button>
        </div>

        <div className="flex flex-col">
          <Image
            className="rounded-lg"
            alt="architecture"
            priority={false}
            width={1600}
            height={1100}
            src={
              'https://images.unsplash.com/photo-1435575653489-b0873ec954e2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'
            }
          />
        </div>
      </div>
      <div className="container mt-14">
        <div className="text-center mb-10">
          <p className='text-4xl font-bold'>
            Why Chose Me?
          </p>
        </div>

        <div className='grid grid-flow-col grid-rows-2 gap-14'>
          <div className="card">
            <h5 className="mb-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              Design Approach
            </h5>
            <p className="font-normal text-lg text-gray-700 dark:text-gray-400">
              We hear the customer, we set the customers and their requirements
              in the heart of our design.
            </p>
          </div>

          <div className="card">
            <h5 className="mb-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              Transparency
            </h5>
            <p className="font-normal text-lg text-gray-700 dark:text-gray-400">
              We provide complete transparency on all matters. Our BOGs (bill of
              quality) & bring clarity in each step/material we select and
              order.
            </p>
          </div>

          <div className="card">
            <h5 className="mb-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              Trust
            </h5>
            <p className="font-normal text-lg text-gray-700 dark:text-gray-400">
              We work to build trust. Our work & transparency speaks it all.
            </p>
          </div>

          <div className="card">
            <h5 className="mb-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              Quality
            </h5>
            <p className="font-normal text-lg text-gray-700 dark:text-gray-400">
              The design approach helps us offer well-planned, beautifully
              detailed long-lasting & high-satisfactory products.
            </p>
          </div>

          <div className="card">
            <h5 className="mb-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              Fast & Hassle Free
            </h5>
            <p className="font-normal text-lg text-gray-700 dark:text-gray-400">
              We handle the project from start to end. Clients need not
              co-ordinate when with team & contractors. We will manage all when
              the total responsibility has been given.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
