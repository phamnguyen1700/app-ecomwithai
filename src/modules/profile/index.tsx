import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import React from 'react'

const Profile = () => {
    return (
        <div className='w-full'>
            <div className="w-full h-10 bg-gradient-to-r from-blue-200 via-white to-yellow-100 rounded"></div>
            <div>
                <div>
                    <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                </div>
                <div></div>
            </div>
        </div>
    )
}

export default Profile