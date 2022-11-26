import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';

export default function DesignProcessComponent() {
  return (
    <div className="container mt-5">

      <div className="text-center m-10">
        <h2 className='text-4xl font-bold'>Design Process</h2>
      </div>
      <div className="container">
        <VerticalTimeline>
          <VerticalTimelineElement
            className="vertical-timeline-element--work"
            contentStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
            contentArrowStyle={{ borderRight: '7px solid  rgb(33, 150, 243)' }}
            // date="2011 - present"
            iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
          // icon={<WorkIcon />}
          >
            <h3 className="vertical-timeline-element-title">Layout Options</h3>
            {/* <h4 className="vertical-timeline-element-subtitle">Miami, FL</h4> */}
            <p>
              We create a couple of format alternatives with the aid of using knowledge of clients requirements, needs, and choices.
            </p>
          </VerticalTimelineElement>
          <VerticalTimelineElement
            className="vertical-timeline-element--education"
            // date="November 2012"
            iconStyle={{ background: 'rgb(233, 30, 99)', color: '#fff' }}
            contentStyle={{ background: 'rgb(233, 30, 99)', color: '#fff' }}
          // icon={<SchoolIcon />}
          >
            <h3 className="vertical-timeline-element-title">Presentation</h3>
            {/* <h4 className="vertical-timeline-element-subtitle">Certification</h4> */}
            <p>
              Considering customers preferences, we create several design concepts for you to choose.
            </p>
          </VerticalTimelineElement>
          <VerticalTimelineElement
            className="vertical-timeline-element--work"
            contentStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
            contentArrowStyle={{ borderRight: '7px solid  rgb(33, 150, 243)' }}
            // date="2011 - present"
            iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
          // icon={<WorkIcon />}
          >
            <h3 className="vertical-timeline-element-title">3D Views</h3>
            {/* <h4 className="vertical-timeline-element-subtitle">Miami, FL</h4> */}
            <p>
              After concept confirmation, we only detail and create 3D if necessary.
            </p>
          </VerticalTimelineElement>
          <VerticalTimelineElement
            className="vertical-timeline-element--education"
            // date="November 2012"
            iconStyle={{ background: 'rgb(233, 30, 99)', color: '#fff' }}
            contentStyle={{ background: 'rgb(233, 30, 99)', color: '#fff' }}
          // icon={<SchoolIcon />}
          >
            <h3 className="vertical-timeline-element-title">Bill of Quality</h3>
            <h4 className="vertical-timeline-element-subtitle">BOQ</h4>
            <p>
              Based on the material selection, we create detailed cost estimates.
            </p>
          </VerticalTimelineElement>
          <VerticalTimelineElement
            className="vertical-timeline-element--work"
            contentStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
            contentArrowStyle={{ borderRight: '7px solid  rgb(33, 150, 243)' }}
            // date="2011 - present"
            iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
          // icon={<WorkIcon />}
          >
            <h3 className="vertical-timeline-element-title">Material Selection</h3>
            {/* <h4 className="vertical-timeline-element-subtitle">Miami, FL</h4> */}
            <p>
              Depending on your budget, we offer your preferred material selection and combination.
            </p>
          </VerticalTimelineElement>
        </VerticalTimeline>
      </div>
    </div>
  );
}