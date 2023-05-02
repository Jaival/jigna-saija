import { useTheme } from 'next-themes';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';

export default function DesignProcessComponent() {
  const {theme, setTheme} = useTheme();
  return (
    <div className='flex md:justify-center md:items-center'>
      <div className="container mt-5">

        <div className="my-10 text-left md:text-center">
          <h2 className='font-bold text:xl md:text-4xl'>Design Process</h2>
        </div>
        <div className="container">
          <VerticalTimeline lineColor={theme === 'dark' ? 'white' : 'black'}>
            <VerticalTimelineElement
              className="vertical-timeline-element--work"
              contentStyle={{background: '#0E79B2', color: '#fff'}}
              contentArrowStyle={{borderRight: '7px solid  #0E79B2'}}
              // date="2011 - present"
              iconStyle={{background: '#0E79B2', color: '#fff'}}
              // icon={<WorkIcon />}
            >
              <h3 className="font-semibold vertical-timeline-element-title text-l md:text-2xl">Layout Options</h3>
              {/* <h4 className="vertical-timeline-element-subtitle">Miami, FL</h4> */}
              <p className='text-base'>
                 We create a couple of format alternatives with the aid of using knowledge of clients requirements,
                 needs, and choices.
              </p>
            </VerticalTimelineElement>
            <VerticalTimelineElement
              className="vertical-timeline-element--education"
              // date="November 2012"
              iconStyle={{background: '#A40E4C', color: '#fff'}}
              contentArrowStyle={{borderRight: '7px solid  #A40E4C'}}
              contentStyle={{background: '#A40E4C', color: '#fff'}}
              // icon={<SchoolIcon />}
            >
              <h3 className="font-semibold vertical-timeline-element-title text-l md:text-2xl">Presentation</h3>
              {/* <h4 className="vertical-timeline-element-subtitle">Certification</h4> */}
              <p className='text-base'>
                 Considering customers preferences, we create several design concepts for you to choose.
              </p>
            </VerticalTimelineElement>
            <VerticalTimelineElement
              className="vertical-timeline-element--work"
              contentStyle={{background: '#0E79B2', color: '#fff'}}
              contentArrowStyle={{borderRight: '7px solid  #0E79B2'}}
              // date="2011 - present"
              iconStyle={{background: '#0E79B2', color: '#fff'}}
              // icon={<WorkIcon />}
            >
              <h3 className="font-semibold vertical-timeline-element-title text-l md:text-2xl">3D Views</h3>
              {/* <h4 className="vertical-timeline-element-subtitle">Miami, FL</h4> */}
              <p className='text-base'>
                 After concept confirmation, we only detail and create 3D if necessary.
              </p>
            </VerticalTimelineElement>
            <VerticalTimelineElement
              className="vertical-timeline-element--education"
              // date="November 2012"
              iconStyle={{background: '#A40E4C', color: '#fff'}}
              contentArrowStyle={{borderRight: '7px solid  #A40E4C'}}
              contentStyle={{background: '#A40E4C', color: '#fff'}}
              // icon={<SchoolIcon />}
            >
              <h3 className="font-semibold vertical-timeline-element-title text-l md:text-2xl">Bill of Quality</h3>
              <h4 className="vertical-timeline-element-subtitle">BOQ</h4>
              <p className='text-base'>
                 Based on the material selection, we create detailed cost estimates.
              </p>
            </VerticalTimelineElement>
            <VerticalTimelineElement
              className="vertical-timeline-element--work"
              contentStyle={{background: '#0E79B2', color: '#fff'}}
              contentArrowStyle={{borderRight: '7px solid  #0E79B2'}}
              // date="2011 - present"
              iconStyle={{background: '#0E79B2', color: '#fff'}}
              // icon={<WorkIcon />}
            >
              <h3 className="font-semibold vertical-timeline-element-title text-l md:text-2xl">Material Selection</h3>
              {/* <h4 className="vertical-timeline-element-subtitle">Miami, FL</h4> */}
              <p className='text-base'>
                 Depending on your budget, we offer your preferred material selection and combination.
              </p>
            </VerticalTimelineElement>
          </VerticalTimeline>
        </div>
      </div>
    </div>
  );
}