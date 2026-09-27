import React, { useState } from 'react';
import PageHeader from '../components/PageHeader';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    }
  };

  return (
    <>
      <PageHeader title="Contact Us" breadcrumb="Contact Us" badge="Direct Farmers Community" />

      <div className="container-xxl py-6">
        <div className="container">
          <div className="section-header text-center mx-auto mb-5" style={{ maxWidth: '600px' }}>
            <h1 className="display-5 mb-3">Contact Us</h1>
            <p className="text-muted">Have questions about weekend market schedules, in-stall pre-orders, or becoming a farm vendor? Reach out to our community coordination team.</p>
          </div>

          <div className="row g-5 justify-content-center">
            <div className="col-lg-5 col-md-12">
              <div className="bg-primary text-white d-flex flex-column justify-content-center h-100 p-5 rounded">
                <h5 className="text-white">Call Us</h5>
                <p className="mb-4"><i className="fa fa-phone-alt me-3"></i>+92 42 3578 9200</p>
                <h5 className="text-white">Email Us</h5>
                <p className="mb-4"><i className="fa fa-envelope me-3"></i>marketlink118@gmail.com</p>
                <h5 className="text-white">Market Coordination Hub</h5>
                <p className="mb-0"><i className="fa fa-map-marker-alt me-3"></i>Liberty Market Hub & Model Town Market, Lahore</p>
              </div>
            </div>

            <div className="col-lg-7 col-md-12">
              {submitted && (
                <div className="alert alert-success alert-dismissible fade show" role="alert">
                  <strong>Thank you!</strong> Your message has been sent successfully.
                </div>
              )}
              <p className="mb-4">
                Have questions or need assistance? Fill out the form below and our team will get in touch with you shortly.
              </p>
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="form-floating">
                      <input 
                        type="text" 
                        className="form-control" 
                        id="name" 
                        placeholder="Your Name"
                        value={formData.name}
                        onChange={handleChange}
                        required 
                      />
                      <label htmlFor="name">Your Name</label>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-floating">
                      <input 
                        type="email" 
                        className="form-control" 
                        id="email" 
                        placeholder="Your Email"
                        value={formData.email}
                        onChange={handleChange}
                        required 
                      />
                      <label htmlFor="email">Your Email</label>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="form-floating">
                      <input 
                        type="text" 
                        className="form-control" 
                        id="subject" 
                        placeholder="Subject"
                        value={formData.subject}
                        onChange={handleChange} 
                      />
                      <label htmlFor="subject">Subject</label>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="form-floating">
                      <textarea 
                        className="form-control" 
                        placeholder="Leave a message here" 
                        id="message" 
                        style={{ height: '200px' }}
                        value={formData.message}
                        onChange={handleChange}
                        required
                      ></textarea>
                      <label htmlFor="message">Message</label>
                    </div>
                  </div>
                  <div className="col-12">
                    <button className="btn btn-primary rounded-pill py-3 px-5" type="submit">
                      Send Message
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="container-xxl px-0" style={{ marginBottom: '-6px' }}>
        <iframe 
          className="w-100" 
          style={{ height: '450px', border: 0 }}
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3001156.4288297426!2d-78.01371936852176!3d42.72876761954724!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4ccc4bf0f123a5a9%3A0xddcfc6c1de189567!2sNew%20York%2C%20USA!5e0!3m2!1sen!2sbd!4v1603794290143!5m2!1sen!2sbd"
          allowFullScreen="" 
          loading="lazy"
          title="Office Location Map"
        ></iframe>
      </div>
    </>
  );
}
