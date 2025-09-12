import React from 'react';
import AboutImg from '../assets/assets_frontend/about_image.png'; // Assuming you have an image in your assets
const About = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      {/* About Us Section */}
      <div className="text-center mb-16">
        <h1 className="text-3xl font-bold text-foreground mb-12">ABOUT US</h1>
        
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Image Space */}
          <div className="flex-1 max-w-md">
            <div className="bg-muted/20 rounded-lg aspect-[4/3] flex items-center justify-center ">
              <img src={AboutImg} alt="About Us" className="object-cover rounded-lg" />
              </div>
          </div>
          
          {/* Content */}
          <div className="flex-1 text-left space-y-6">
            <p className="text-muted-foreground leading-relaxed">
              Welcome To Medcura, Your Trusted Partner In Managing Your Healthcare Needs Conveniently And Efficiently. 
              At Medcura, We Understand The Challenges Individuals Face When It Comes To Scheduling Doctor 
              Appointments And Managing Their Health Records.
            </p>
            
            <p className="text-muted-foreground leading-relaxed">
              Medcura Is Committed To Excellence In Healthcare Technology. We Continuously Strive To Enhance Our 
              Platform, Integrating The Latest Advancements To Improve User Experience And Deliver Superior Service. 
              Whether You're Booking Your First Appointment Or Managing Ongoing Care, Medcura Is Here To Support You 
              Every Step Of The Way.
            </p>
            
            <div className="pt-4">
              <h3 className="text-lg font-semibold text-foreground mb-3">Our Vision</h3>
              <p className="text-muted-foreground leading-relaxed">
                Our Vision At Medcura Is To Create A Seamless Healthcare Experience For Every User. We Aim To Bridge The 
                Gap Between Patients And Healthcare Providers, Making It Easier For You To Access The Care You Need, When 
                You Need It.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="pt-16">
        <h2 className="text-2xl font-bold text-foreground mb-12">
          WHY <span className="text-primary">CHOOSE US</span>
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* Efficiency */}
          <div className="border border-border rounded-lg p-8 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold text-foreground mb-4">EFFICIENCY:</h3>
            <p className="text-muted-foreground leading-relaxed">
              Streamlined Appointment Scheduling That Fits Into Your Busy Lifestyle.
            </p>
          </div>
          
          {/* Convenience */}
          <div className="border border-border rounded-lg p-8 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold text-foreground mb-4">CONVENIENCE:</h3>
            <p className="text-muted-foreground leading-relaxed">
              Access To A Network Of Trusted Healthcare Professionals In Your Area.
            </p>
          </div>
          
          {/* Personalization */}
          <div className="border border-border rounded-lg p-8 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold text-foreground mb-4">PERSONALIZATION:</h3>
            <p className="text-muted-foreground leading-relaxed">
              Tailored Recommendations And Reminders To Help You Stay On Top Of Your Health.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;