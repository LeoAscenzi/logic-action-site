"use client";
import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import Button from '../button';

type Status = {
  submitted: boolean;
  submitting: boolean;
  info: {
    error: boolean;
    msg: string | null;
  };
};

type Inputs = {
    fname: string;
    lname: string;
    number: string;
    email: string;
    message: string;
};

const ContactForm: React.FC = () => {
  const [status, setStatus] = useState<Status>({
    submitted: false,
    submitting: false,
    info: { error: false, msg: null },
  });

  const [inputs, setInputs] = useState<Inputs>({
    fname: "",
    lname: "",
    number: "",
    email: "",
    message: "",
  });

  const handleServerResponse = (ok: boolean, msg: string) => {
    if (ok) {
      setStatus({
        submitted: true,
        submitting: false,
        info: { error: false, msg },
      });
      setInputs({
        fname: "",
        lname: "",
        number: "",
        email: "",
        message: "",
      });
    } else {
      setStatus((prev) => ({
        ...prev,
        submitting: false,
        info: { error: true, msg },
      }));
    }
  };

  const handleOnChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;

    setInputs((prev) => ({
      ...prev,
      [id]: value,
    }));

    setStatus({
      submitted: false,
      submitting: false,
      info: { error: false, msg: null },
    });
  };

  const handleOnSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    setStatus((prev) => ({ ...prev, submitting: true }));

    try {
      await axios.post(
        'https://formspree.io/f/mwvrddjq',
        inputs
      );

      handleServerResponse(
        true,
        'Thank you, your message has been submitted.'
      );
    } catch (err) {
      const error = err as AxiosError<{ error: string }>;
      handleServerResponse(
        false,
        error.response?.data?.error || 'Something went wrong.'
      );
    }
  };

  return (
    <main className="">
      <div className="emphasis-text gold-text text-left p-2">Message us</div>
      <form onSubmit={handleOnSubmit} className="grid grid-cols-2 gap-3 px-2 text-left">
        <div className="grid col-start-1 col-span-2 md:col-span-1">
            <label htmlFor="fname" className="emphasis-text gray-text">First Name</label>
            <input
            id="fname"
            type="text"
            name="fname"
            className="bg-white"
            onChange={handleOnChange}
            required
            value={inputs.fname}
            />
        </div>
        <div className="grid col-start-1 col-span-2 md:col-start-2 md:col-span-1">
            <label htmlFor="lname" className="emphasis-text gray-text">Last Name</label>
            <input
            id="lname"
            name="lname"
            className="bg-white rounded-md"
            onChange={handleOnChange}
            required
            value={inputs.lname}
            />
        </div>
        <div className="grid col-span-2">
            <label htmlFor="email" className="emphasis-text gray-text">Email Address</label>
            <input
            id="email"
            type="email"
            name="_replyto"
            className="bg-white"
            onChange={handleOnChange}
            required
            value={inputs.email}
            />
        </div>
        <div className="grid col-span-2 col-start-1">
            <label htmlFor="number" className="emphasis-text gray-text">Phone Number</label>
            <input
            id="number"
            type="tel"
            name="Phone Number"
            className="bg-white"
            onChange={handleOnChange}
            value={inputs.number}
            />
        </div>
        <div className="grid col-span-2">
            <label htmlFor="message" className="emphasis-text gray-text">Message</label>
            <textarea
            id="message"
            name="Message"
            className="bg-white min-h-[100px]"
            onChange={handleOnChange}
            required
            value={inputs.message}
            />
        </div>
        <div className="grid col-span-2 py-2 justify-center">
            <Button className="min-w-[200px] max-w-[200px] py-2 cursor-pointer" type="submit" disabled={status.submitting} >
            {!status.submitting
                ? !status.submitted
                ? 'Submit'
                : 'Submitted'
                : 'Submitting...'}
            </Button>
        </div>
      </form>

      {status.info.error && (
        <div className="error">Error: {status.info.msg}</div>
      )}

      {!status.info.error && status.info.msg && (
        <p>{status.info.msg}</p>
      )}
    </main>
  );
};

export default ContactForm;