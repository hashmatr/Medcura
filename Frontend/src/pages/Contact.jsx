import React from 'react';
import contactimg from '../assets/assets_frontend/contact_image.png'; // Assuming you have an image in your assets
const Contact = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      {/* Contact Us Section */}
      <div className="text-center mb-16">
        <h1 className="text-3xl font-bold text-foreground mb-12">CONTACT US</h1>
        
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Image Space */}
          <div className="flex-1 max-w-md">
            <div className="bg-muted/20 rounded-lg aspect-[4/3] flex items-center justify-center ">
              <img src={contactimg} alt="Contact Us" className="object-cover rounded-lg" />
            </div>
          </div>
          
          {/* Content */}
          <div className="flex-1 text-left space-y-8">
            {/* Our Office Section */}
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-4">OUR OFFICE</h2>
              <div className="space-y-2 text-muted-foreground">
                <p>54709 Willms Station</p>
                <p>Suite 350, Washington, USA</p>
                <p className="pt-2">Tel: (415) 555-0132</p>
                <p>Email: greatstackdev@gmail.com</p>
              </div>
            </div>

            {/* Careers Section */}
            <div className="pt-8">
              <h2 className="text-xl font-semibold text-foreground mb-4">CAREERS AT Medcura</h2>
              <p className="text-muted-foreground mb-6">
                Learn more about our teams and job openings.
              </p>
              <button variant="outline" className=" cursor-pointer px-8 py-3 border border-border rounded-lg text-muted-foreground hover:bg-black hover:text-white transition-colors">
                Explore Jobs
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;