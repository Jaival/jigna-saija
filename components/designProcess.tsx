export default function DesignProcessComponent() {
  return (
    <div className="container mt-5">

      <div className="text-center m-10">
        <h2 className='text-4xl font-bold'>Design Process</h2>
      </div>

      <div className="timeline">
        <div className="timeline-row">
          <div className="timeline-time">
            Layout Options
          </div>
          <div className="timeline-content">
            <p>We create a couple of format alternatives with the aid of using knowledge of clients
              requirements, needs, and choices.
            </p>
          </div>
        </div>

        <div className="timeline-row">
          <div className="timeline-time">
            Presentation
          </div>
          <div className="timeline-content">
            <p>Considering customers preferences, we create several design concepts for you to choose.
            </p>

          </div>
        </div>

        <div className="timeline-row">
          <div className="timeline-time">
            3d Views
          </div>
          <div className=" timeline-content">
            <p> After concept confirmation, we only detail and create 3D if necessary.
            </p>
          </div>
        </div>

        <div className="timeline-row">
          <div className="timeline-time">
            Bill of Quality<small>(BOQ)</small>
          </div>
          <div className="timeline-content">
            <p>Based on the material selection, we create detailed cost estimates. </p>
          </div>
        </div>

        <div className="timeline-row">
          <div className="timeline-time">
            Material Selection
          </div>
          <div className="timeline-content">
            <p>Depending on your budget, we offer your preferred material selection and combination.</p>
          </div>
        </div>
      </div>
    </div>
  );
}