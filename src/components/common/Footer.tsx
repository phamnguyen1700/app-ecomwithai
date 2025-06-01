import { Facebook, Instagram } from 'lucide-react'
import React from 'react'
import { Button } from '../ui/button'

const Footer = () => {
  return (
    <div className='container mx-auto flex items-center justify-between border-t-2'>
        <div>
            <h3>Information</h3>
            <div>About us</div>
            <div>Track your order</div>
            <div>Contact us</div>
            <div>+92 321 3333 333</div>
        </div>
        <div>
            <h1 className='text-2xl'>Stay Connected</h1>
            <div className='flex items-start gap-2'>
                <div>
                    <Facebook/>
                    <Instagram/>
                </div>
                <div>
                    Like us on Facebook
                </div>
            </div>
            <div className='my-4'>SIGN UP FOR OUR NEWSLETTER</div>
            <input placeholder='write your email address'/>
            <Button className='rounded-sm'>Submit</Button>
        </div>
    </div>
  )
}

export default Footer